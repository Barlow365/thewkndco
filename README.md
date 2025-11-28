This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/pages/api-reference/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.tsx`. The page auto-updates as you edit the file.

[API routes](https://nextjs.org/docs/pages/building-your-application/routing/api-routes) can be accessed on [http://localhost:3000/api/hello](http://localhost:3000/api/hello). This endpoint can be edited in `pages/api/hello.ts`.

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/pages/building-your-application/routing/api-routes) instead of React pages.

This project uses [`next/font`](https://nextjs.org/docs/pages/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Tailwind

This project has Tailwind CSS configured. Key notes:

- Tailwind directives are in `styles/globals.css` (base, components, utilities).
- `tailwind.config.js` contains content paths for `pages`, `components` and `app`, plus class-based dark mode and a small theme extension.
- A demo page is available at `/tailwind-demo` and a reusable `Hero` component is available in `components/Hero.tsx`.

## Supabase (Auth)

This project includes starter scaffolding for Supabase Authentication.

- Add `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` to a local `.env.local` file (see `.env.local.example`).
	- New Supabase projects may surface a `publishable` key (example: `sb_publishable_...`) — that value is safe for frontend use and should be copied into `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
	- A `.env.local.example` file is included in the repo to show expected keys. Do not commit `.env.local` itself — `.gitignore` already ignores it.
- The file `lib/supabaseClient.ts` creates a Supabase client using these env variables.
- AuthProvider (`components/AuthProvider.tsx`) exposes `useAuth()` which provides `user`, `signIn`, `signUp`, and `signOut`.
- Pages provided: `/login` and `/signup` (simple forms that use Supabase's auth methods).

Server-side protection
- A `middleware.ts` file is included which uses Supabase cookies (via `@supabase/auth-helpers-nextjs`) to protect server-side routes such as `/dashboard`.
- When a user is not authenticated the middleware redirects them to `/login` and appends a `redirect` query parameter for returning them after sign-in.

To try it locally with a real Supabase project:

1. Create a Supabase project at https://app.supabase.com.
2. Copy the project URL and anon key into `.env.local` (see `.env.local.example`).
3. Restart the dev server (npm run dev) so env vars are picked up.


## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn-pages-router) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/pages/building-your-application/deploying) for more details.
