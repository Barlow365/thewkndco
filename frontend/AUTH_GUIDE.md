# Authentication System Guide

## Overview

This is a production-ready authentication system built with:
- **Next.js 16** (App Router)
- **Supabase Auth** with SSR
- **TypeScript**
- **Tailwind CSS**

## Project Structure

```
frontend/
├── app/
│   ├── layout.tsx                 # Root layout with AuthProvider
│   ├── page.tsx                   # Home page
│   ├── login/page.tsx             # Login page (server component)
│   ├── signup/page.tsx            # Signup page (server component)
│   ├── dashboard/page.tsx         # Protected dashboard (server component)
│   └── auth/
│       ├── callback/route.ts      # Auth callback for email confirmation
│       └── auth-code-error/page.tsx
│
├── components/auth/
│   ├── LoginForm.tsx              # Reusable login form (client)
│   ├── SignupForm.tsx             # Reusable signup form (client)
│   ├── LogoutButton.tsx           # Logout button (client)
│   └── AuthButton.tsx             # Smart auth button (client)
│
├── lib/
│   ├── auth/
│   │   └── context.tsx            # Auth context provider & useUser hook
│   └── supabase/
│       ├── client.ts              # Browser Supabase client
│       ├── server.ts              # Server Supabase client
│       └── middleware.ts          # Middleware Supabase client
│
├── middleware.ts                  # Route protection
└── .env.local                     # Environment variables
```

## How It Works

### 1. Supabase Client Setup

Three different Supabase clients for different contexts:

**Browser Client** (`lib/supabase/client.ts`)
- Used in Client Components
- Handles client-side auth operations

**Server Client** (`lib/supabase/server.ts`)
- Used in Server Components and Server Actions
- Reads/writes cookies for session management

**Middleware Client** (`lib/supabase/middleware.ts`)
- Used in Next.js middleware
- Protects routes and refreshes sessions

### 2. Authentication Context

**AuthProvider** (`lib/auth/context.tsx`)
- Wraps the entire app in `app/layout.tsx`
- Provides global auth state
- Listens for auth changes
- Exposes `useUser()` hook

**useUser Hook**
```tsx
import { useUser } from '@/lib/auth/context'

function MyComponent() {
  const { user, loading } = useUser()

  if (loading) return <div>Loading...</div>
  if (user) return <div>Welcome {user.email}</div>
  return <div>Please log in</div>
}
```

### 3. Pages

**Login Page** (`app/login/page.tsx`)
- Server Component
- Checks for existing session and redirects if logged in
- Renders `LoginForm` client component

**Signup Page** (`app/signup/page.tsx`)
- Server Component
- Checks for existing session and redirects if logged in
- Renders `SignupForm` client component
- Sends confirmation email

**Dashboard Page** (`app/dashboard/page.tsx`)
- Server Component
- Protected route (middleware redirects if not logged in)
- Displays user information

### 4. Auth Components

**LoginForm** (`components/auth/LoginForm.tsx`)
- Client Component
- Handles email/password login
- Error handling and loading states
- Redirects to dashboard on success

**SignupForm** (`components/auth/SignupForm.tsx`)
- Client Component
- Handles email/password signup
- Sends confirmation email
- Shows success message

**LogoutButton** (`components/auth/LogoutButton.tsx`)
- Client Component
- Signs user out and redirects to login

**AuthButton** (`components/auth/AuthButton.tsx`)
- Client Component
- Shows login/signup buttons when logged out
- Shows email and logout button when logged in

### 5. Middleware Protection

The middleware (`middleware.ts`) automatically:
- Refreshes auth sessions
- Redirects unauthenticated users to `/login`
- Runs on all routes (except static files)

## Usage Guide

### Starting the App

```bash
npm run dev
```

Visit `http://localhost:3000`

### Creating a New Account

1. Go to `/signup`
2. Enter email and password
3. Check your email for confirmation link
4. Click the confirmation link
5. You'll be redirected to `/dashboard`

### Logging In

1. Go to `/login`
2. Enter your email and password
3. Click "Sign in"
4. You'll be redirected to `/dashboard`

### Accessing Protected Routes

Any route is automatically protected by middleware. If you're not logged in, you'll be redirected to `/login`.

## Reusing This Auth System

This auth system is modular and can be copied to new projects:

### What to Copy

1. **Core Auth Files:**
   ```
   lib/supabase/
   lib/auth/
   components/auth/
   middleware.ts
   ```

2. **Auth Pages:**
   ```
   app/login/
   app/signup/
   app/auth/
   ```

3. **Environment Variables:**
   ```
   NEXT_PUBLIC_SUPABASE_URL
   NEXT_PUBLIC_SUPABASE_ANON_KEY
   ```

### Steps to Reuse

1. Copy the folders above to your new project
2. Add `.env.local` with your Supabase credentials
3. Install dependencies:
   ```bash
   npm install @supabase/ssr @supabase/supabase-js
   ```
4. Wrap your app in `AuthProvider` in `app/layout.tsx`
5. Use `useUser()` hook in any client component
6. Use `createClient()` from `lib/supabase/server` in server components

## Common Patterns

### Protect a Server Component

```tsx
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export default async function ProtectedPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  return <div>Protected content for {user.email}</div>
}
```

### Protect a Client Component

```tsx
'use client'
import { useUser } from '@/lib/auth/context'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function ProtectedClient() {
  const { user, loading } = useUser()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
    }
  }, [user, loading, router])

  if (loading) return <div>Loading...</div>
  if (!user) return null

  return <div>Protected content</div>
}
```

### Get User Data in Server Component

```tsx
import { createClient } from '@/lib/supabase/server'

export default async function MyPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  return <div>User: {user?.email}</div>
}
```

### Get User Data in Client Component

```tsx
'use client'
import { useUser } from '@/lib/auth/context'

export default function MyComponent() {
  const { user, loading } = useUser()

  return <div>User: {user?.email}</div>
}
```

## Environment Variables

Required in `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

Get these from your Supabase project dashboard:
1. Go to https://supabase.com/dashboard
2. Select your project
3. Go to Settings > API
4. Copy "Project URL" and "anon public" key

## Troubleshooting

**"User not found" after signup**
- Check your email for the confirmation link
- Make sure email confirmation is enabled in Supabase

**Redirects not working**
- Make sure middleware is running (check terminal logs)
- Clear your browser cookies
- Check that your Supabase URL and anon key are correct

**Build errors**
- Make sure you don't have both `pages/` and `app/` directories
- Run `rm -rf .next && npm run build` to clean build cache

## Next Steps

### Customize

- Update styling in the components to match your brand
- Add password reset functionality
- Add OAuth providers (Google, GitHub, etc.)
- Add user profiles
- Add role-based access control

### Deploy

1. Deploy to Vercel:
   ```bash
   vercel
   ```

2. Add environment variables in Vercel dashboard

3. Update Supabase redirect URLs:
   - Go to Authentication > URL Configuration
   - Add your production URL to "Site URL"
   - Add `https://your-domain.com/auth/callback` to "Redirect URLs"

## Resources

- [Supabase Auth Docs](https://supabase.com/docs/guides/auth)
- [Next.js App Router Docs](https://nextjs.org/docs/app)
- [Supabase SSR Guide](https://supabase.com/docs/guides/auth/server-side/nextjs)
