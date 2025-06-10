import type { NextAuthOptions, User } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { compare } from 'bcryptjs';
import { PrismaClient, Role } from '@prisma/client';

// Define the user type for the raw SQL query result
interface DatabaseUser {
  id: string;
  name: string | null;
  email: string;
  image: string | null;
  hashedPassword: string;
  role: Role;
}

const prisma = new PrismaClient();

export const authOptions: NextAuthOptions = {
  session: {
    strategy: 'jwt',
  },
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Email and password are required');
        }

        // Find user in the database with raw query to avoid Prisma field mapping issues
        const users = await prisma.$queryRaw<DatabaseUser[]>`
          SELECT 
            id, 
            name, 
            email, 
            image, 
            hashed_password as "hashedPassword", 
            role 
          FROM users 
          WHERE email = ${credentials.email} 
          LIMIT 1`;
        
        const userData = users[0] || null;
        
        if (!userData) {
          throw new Error('No user found with this email');
        }

        // Check if the user has a hashed password
        if (!userData.hashedPassword) {
          throw new Error('User has no password set');
        }

        // Compare the provided password with the hashed password
        const isValid = await compare(credentials.password, userData.hashedPassword);
        
        if (!isValid) {
          throw new Error('Invalid password');
        }

        // Return the user data in the format expected by NextAuth
        return {
          id: userData.id,
          name: userData.name,
          email: userData.email,
          image: userData.image,
          role: userData.role
        };
      }
    })
  ],
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.name = user.name;
        token.email = user.email;
        token.picture = user.image;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        // Safely get token properties with fallbacks
        const name = typeof token.name === 'string' ? token.name : '';
        const email = typeof token.email === 'string' ? token.email : '';
        const image = typeof token.picture === 'string' ? token.picture : null;
        
        // Create a new user object with all required properties
        const user: User = {
          id: token.id as string,
          role: token.role as Role || 'USER', // Provide default role if not present
          name: name,
          email: email,
          image: image || undefined // Use undefined instead of null for optional fields
        };

        session.user = user;
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      console.log('Redirect called with:', { url, baseUrl });
      
      // If no URL is provided, redirect to the base URL with default language
      if (!url) {
        const defaultUrl = `${baseUrl}/en/dashboard`;
        console.log('No URL provided, using default:', defaultUrl);
        return defaultUrl;
      }

      // Handle relative URLs
      if (url.startsWith('/')) {
        // If the URL already has a language prefix, use it as is
        const langPrefix = url.split('/')[1];
        if (['en', 'sw', 'de'].includes(langPrefix)) {
          const result = `${baseUrl}${url}`;
          console.log('Relative URL with language prefix, returning:', result);
          return result;
        }
        // Otherwise, add the default language
        const result = `${baseUrl}/en${url}`;
        console.log('Relative URL without language, adding default:', result);
        return result;
      }
      
      // Handle absolute URLs
      try {
        const urlObj = new URL(url);
        if (urlObj.origin === baseUrl) {
          // If the URL already has a language prefix, use it as is
          const pathParts = urlObj.pathname.split('/').filter(Boolean);
          if (pathParts.length > 0 && ['en', 'sw', 'de'].includes(pathParts[0])) {
            console.log('Absolute URL with language prefix, returning as is:', url);
            return url;
          }
          // Otherwise, add the default language
          urlObj.pathname = `/en${urlObj.pathname}`;
          const result = urlObj.toString();
          console.log('Absolute URL without language, adding default:', result);
          return result;
        }
        console.log('Different origin, returning base URL:', baseUrl);
        return baseUrl;
      } catch (error) {
        console.error('Error processing URL:', error);
        return baseUrl;
      }
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === 'development',
};
