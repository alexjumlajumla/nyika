import type { NextAuthOptions, DefaultSession, User, Profile } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import { prisma } from './db';
import bcrypt from 'bcryptjs';

declare module 'next-auth' {
  interface Session extends DefaultSession {
    user: {
      id: string;
      role: string;
    } & DefaultSession['user'];
  }

  interface User {
    id: string;
    name?: string | null;
    email: string;
    role: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    email: string;
    name?: string | null;
    role: string;
  }
}

export const authOptions: NextAuthOptions = {
  debug: process.env.NODE_ENV === 'development',
  adapter: PrismaAdapter(prisma as any),
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: process.env.NEXTAUTH_SECRET || 'your-secret-key', // Fallback for development
  pages: {
    signIn: '/auth/signin',
    signOut: '/',
    error: '/auth/error',
    verifyRequest: '/auth/verify-request',
    newUser: '/dashboard',
  },
  cookies: {
    sessionToken: {
      name: `__Secure-next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production',
      },
    },
  },
  useSecureCookies: process.env.NODE_ENV === 'production',
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
      authorization: {
        params: {
          prompt: 'consent',
          access_type: 'offline',
          response_type: 'code',
        },
      },
    }),
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Please enter email and password');
        }

        // Use raw query to avoid Prisma field mapping issues
        const users = await prisma.$queryRaw<Array<{
          id: string;
          name: string | null;
          email: string;
          hashed_password: string;
          role: string;
        }>>`
          SELECT id, name, email, hashed_password, role 
          FROM users 
          WHERE email = ${credentials.email} 
          LIMIT 1
        `;

        const user = users[0] || null;

        if (!user || !user.hashed_password) {
          throw new Error('No user found with this email');
        }

        const isValid = await bcrypt.compare(
          credentials.password,
          user.hashed_password
        );

        if (!isValid) {
          throw new Error('Incorrect password');
        }

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role || 'user',
        };
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === 'google') {
        // Check if user exists using raw query
        const existingUsers = await prisma.$queryRaw<Array<{ id: string }>>`
          SELECT id FROM users WHERE email = ${user.email} LIMIT 1
        `;
        
        const existingUser = existingUsers[0] || null;

        if (!existingUser) {
          // Create new user if doesn't exist using raw query
          await prisma.$executeRaw`
            INSERT INTO users (id, email, name, email_verified, image, role, created_at, updated_at)
            VALUES (
              gen_random_uuid(),
              ${user.email!},
              ${user.name || profile?.name || user.email?.split('@')[0] || 'User'},
              NOW(),
              ${user.image || profile?.image || null},
              'user',
              NOW(),
              NOW()
            )
          `;
        }
      }
      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as User).role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      if (url.startsWith('/')) return `${baseUrl}${url}`;
      if (new URL(url).origin === baseUrl) return url;
      return baseUrl;
    },
  },
  events: {
    async signIn({ user }) {
      console.log('User signed in:', user.email);
    },
    async signOut() {
      console.log('User signed out');
    },
    // @ts-ignore - Error event is valid but not in types
    async error(error: Error) {
      console.error('Authentication error:', error);
    },
  } as const,
};

export const getServerSession = async (req: any, res: any) => {
  const { getServerSession } = await import('next-auth/next');
  return getServerSession(req, res, authOptions);
};

export default authOptions;
