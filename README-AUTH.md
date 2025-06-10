# Authentication System

This document outlines the authentication system implemented in the Nyika Safaris application.

## Features

- Email/Password authentication
- Social login (Google, GitHub)
- Protected routes
- Internationalization (i18n) support
- Server-side authentication with Supabase
- Form validation with Zod

## Setup

### 1. Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_secret  # Generate with: openssl rand -base64 32
NEXTAUTH_URL_INTERNAL=http://localhost:3000

# OAuth Providers (optional)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
```

### 2. Database Setup

Run the following SQL in your Supabase SQL editor to set up the required tables and RLS policies:

#### Users and Profiles

```sql
-- Enable Row Level Security
ALTER TABLE auth.users ENABLE ROW LEVEL SECURITY;

-- Create profiles table
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE,
  full_name TEXT,
  avatar_url TEXT,
  phone TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create policies for profiles
CREATE POLICY "Public profiles are viewable by everyone."
  ON public.profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can insert their own profile."
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile."
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- Function to handle new user signups
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'avatar_url'
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger the function every time a user is created
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Function to update profile when email is changed
CREATE OR REPLACE FUNCTION public.handle_update_user()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.profiles
  SET email = NEW.email
  WHERE id = NEW.id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger the function when auth.users email is updated
DROP TRIGGER IF EXISTS on_auth_user_updated ON auth.users;
CREATE TRIGGER on_auth_user_updated
  AFTER UPDATE OF email ON auth.users
  FOR EACH ROW
  WHEN (OLD.email IS DISTINCT FROM NEW.email)
  EXECUTE PROCEDURE public.handle_update_user();
```

#### Sessions and User Logs (Optional)

```sql
-- Table to track user logins/logouts
CREATE TABLE IF NOT EXISTS public.user_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  action TEXT NOT NULL, -- 'login', 'logout', 'token_refresh'
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on user_logs
ALTER TABLE public.user_logs ENABLE ROW LEVEL SECURITY;

-- Create policies for user_logs
CREATE POLICY "Users can view their own logs."
  ON public.user_logs FOR SELECT
  USING (auth.uid() = user_id);

-- Function to log user actions
CREATE OR REPLACE FUNCTION public.log_user_action(
  user_id UUID,
  action TEXT,
  ip_address TEXT DEFAULT NULL,
  user_agent TEXT DEFAULT NULL
)
RETURNS void AS $$
BEGIN
  INSERT INTO public.user_logs (user_id, action, ip_address, user_agent)
  VALUES (user_id, action, ip_address, user_agent);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

### 3. Email Templates (Optional)

Customize the email templates in the Supabase Auth settings for:
- Sign up confirmation
- Email change
- Password reset
- Magic link
- Invitation

## Authentication Flow

### 1. User Registration

1. User fills out the registration form with email, password, and other required fields
2. Client-side validation is performed using Zod schema
3. Form is submitted to `/api/auth/register`
4. Server-side validation and user creation in Supabase Auth
5. User profile is created in the `public.profiles` table
6. Email verification is sent if enabled
7. User is automatically signed in and redirected to the dashboard

### 2. Email Verification (if enabled)

1. User receives a verification email
2. Clicks the verification link
3. Email is verified in Supabase Auth
4. User is redirected to the app with a success message

### 3. User Login

1. User enters email and password
2. Client-side validation is performed
3. Form is submitted to NextAuth.js
4. NextAuth.js verifies credentials with Supabase Auth
5. Session is created and stored in an HTTP-only cookie
6. User is redirected to the dashboard or their original destination

### 4. Social Login (OAuth)

1. User clicks a social login button (Google, GitHub, etc.)
2. User is redirected to the provider's login page
3. After successful authentication, user is redirected back to the app
4. NextAuth.js handles the OAuth flow and creates/updates the user in Supabase Auth
5. Session is created and user is logged in

### 5. Protected Routes

Protected routes are handled by the middleware. If an unauthenticated user tries to access a protected route:

1. They are redirected to `/auth/signin`
2. After successful login, they are redirected back to their original destination

## Testing

### 1. Manual Testing

1. **Registration**
   - Test with valid and invalid email formats
   - Test password strength requirements
   - Test duplicate email registration
   - Test required fields

2. **Login**
   - Test with valid credentials
   - Test with invalid credentials
   - Test with non-existent user
   - Test password reset flow

3. **Protected Routes**
   - Try accessing protected routes while logged out
   - Verify redirection to login page
   - Verify access after successful login

4. **Social Login**
   - Test each enabled OAuth provider
   - Verify user creation in Supabase
   - Verify session management

### 2. Automated Tests

Create test files in the `__tests__` directory:

```typescript
// __tests__/auth.test.ts
import { test, expect } from '@playwright/test';

const BASE_URL = 'http://localhost:3000';

test.describe('Authentication', () => {
  test('should allow user to sign up', async ({ page }) => {
    await page.goto(`${BASE_URL}/auth/register`);
    
    // Fill in the registration form
    await page.fill('input[name="fullName"]', 'Test User');
    await page.fill('input[name="email"]', `test-${Date.now()}@example.com`);
    await page.fill('input[name="password"]', 'Password123!');
    await page.fill('input[name="confirmPassword"]', 'Password123!');
    
    // Submit the form
    await page.click('button[type="submit"]');
    
    // Verify redirection after successful registration
    await expect(page).toHaveURL(`${BASE_URL}/dashboard`);
  });

  test('should show error for invalid login', async ({ page }) => {
    await page.goto(`${BASE_URL}/auth/signin`);
    
    // Fill in with invalid credentials
    await page.fill('input[name="email"]', 'nonexistent@example.com');
    await page.fill('input[name="password"]', 'wrongpassword');
    
    // Submit the form
    await page.click('button[type="submit"]');
    
    // Verify error message is shown
    await expect(page.locator('text=Invalid login credentials')).toBeVisible();
  });
});
```

## Security Considerations

1. **Password Security**
   - Passwords are hashed using bcrypt before being stored in the database
   - Enforce strong password policies
   - Implement rate limiting on authentication endpoints

2. **Session Security**
   - Use HTTP-only, secure, same-site cookies
   - Implement proper session expiration
   - Invalidate sessions on password change

3. **CSRF Protection**
   - NextAuth.js provides built-in CSRF protection
   - Ensure all forms include CSRF tokens

4. **Rate Limiting**
   - Implement rate limiting on authentication endpoints
   - Use a service like Upstash or a middleware solution

5. **Logging and Monitoring**
   - Log authentication attempts (successful and failed)
   - Set up alerts for suspicious activities
   - Monitor for brute force attempts

## Troubleshooting

### Common Issues

1. **Authentication Fails Silently**
   - Check the browser's network tab for failed requests
   - Verify that environment variables are set correctly
   - Check the Supabase logs for errors

2. **Session Not Persisting**
   - Ensure `NEXTAUTH_URL` is set correctly
   - Verify cookie settings in `next-auth` configuration
   - Check if the domain is included in the cookie settings

3. **CORS Issues**
   - Ensure proper CORS headers are set
   - Verify the allowed origins in Supabase dashboard

4. **Email Not Sending**
   - Check Supabase email settings
   - Verify the email template configuration
   - Check spam/junk folders

## Deployment

### Vercel

1. Set up environment variables in the Vercel dashboard
2. Configure custom domains in both Vercel and Supabase
3. Update `NEXTAUTH_URL` to production URL
4. Set up production database connection

### Netlify

1. Set up environment variables in Netlify
2. Configure redirects in `_redirects`
3. Update `NEXTAUTH_URL` to production URL

## Maintenance

1. **Regular Backups**
   - Set up automated database backups in Supabase
   - Test restoration process periodically

2. **Updates**
   - Keep dependencies up to date
   - Follow security advisories for Next.js, NextAuth.js, and Supabase

3. **Monitoring**
   - Set up monitoring for authentication services
   - Monitor error rates and failed login attempts

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Write tests for new features
5. Submit a pull request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
   create table if not exists public.profiles (
     id uuid references auth.users on delete cascade not null primary key,
     email text unique,
     full_name text,
     avatar_url text,
     updated_at timestamp with time zone
   );

   -- Set up Row Level Security (RLS)
   alter table public.profiles enable row level security;

   -- Create policies for profiles
   create policy "Public profiles are viewable by everyone."
     on public.profiles for select
     using ( true );

   create policy "Users can insert their own profile."
     on public.profiles for insert
     with check ( auth.uid() = id );

   create policy "Users can update own profile."
     on public.profiles for update
     using ( auth.uid() = id );
   ```

## Authentication Flow

### Sign Up

1. User fills out the registration form with email and password
2. Form is validated client-side using Zod
3. On submission, a request is made to `/api/auth/register`
4. The API route creates a new user in Supabase Auth
5. A new profile is created in the `profiles` table
6. User is automatically signed in and redirected to the home page

### Sign In

1. User enters their email and password
2. Form is validated client-side using Zod
3. On submission, `signIn('credentials')` is called
4. NextAuth.js handles the authentication with Supabase
5. On success, the user is redirected to the home page or their original destination

### Protected Routes

Protected routes are defined in `middleware.ts`:

```typescript
const protectedRoutes = ['/account', '/bookings'];
```

When an unauthenticated user tries to access a protected route:
1. They are redirected to `/auth/signin`
2. After signing in, they are redirected back to their original destination

## Components

- `SignInForm` - Handles user sign in
- `SignUpForm` - Handles user registration
- `AuthLayout` - Layout for authentication pages
- `ProtectedRoute` - HOC for protecting routes (alternative to middleware)

## API Routes

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/signin` - Sign in a user (handled by NextAuth.js)
- `POST /api/auth/signout` - Sign out the current user (handled by NextAuth.js)

## Environment Variables

- `NEXT_PUBLIC_SUPABASE_URL` - Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Your Supabase anon/public key
- `SUPABASE_SERVICE_ROLE_KEY` - Your Supabase service role key (for server-side operations)
- `NEXTAUTH_URL` - The canonical URL of your site (e.g., http://localhost:3000)
- `NEXTAUTH_SECRET` - Used to encrypt the NextAuth.js JWT (generate with `openssl rand -base64 32`)

## Testing

1. Create a test user through the registration form
2. Verify the user is created in the Supabase Auth dashboard
3. Verify the profile is created in the `profiles` table
4. Test signing in with the new user
5. Test accessing protected routes while signed out
6. Test the remember me functionality

## Troubleshooting

### User is not redirected after sign in

- Check the `NEXTAUTH_URL` environment variable matches your app's URL
- Verify the callback URL is allowed in your Supabase Auth settings

### CSRF token validation failed

- Ensure your `NEXTAUTH_SECRET` is properly set and consistent across your application
- Make sure your app's URL is included in the `NEXTAUTH_URL` environment variable

### Database errors

- Verify the database tables and RLS policies are set up correctly
- Check the Supabase logs for any SQL errors

## Security Considerations

- Always use HTTPS in production
- Keep your Supabase service role key secure
- Use strong passwords and enable password hashing
- Implement rate limiting on authentication endpoints
- Keep dependencies up to date
- Regularly audit user access and permissions
