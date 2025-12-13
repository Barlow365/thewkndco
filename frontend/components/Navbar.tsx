'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { createClient } from '@/lib/supabase/client';

const links = [
  { href: '/', label: 'Home' },
  { href: '/events', label: 'Events' },
  { href: '/packages', label: 'Packages' },
  { href: '/bookings', label: 'Bookings' },
];

type UserInfo = { email: string | null };

export function NavBar() {
  const pathname = usePathname();
  const [user, setUser] = useState<UserInfo | null>(null);
  const supabase = useMemo(() => createClient(), []);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user ? { email: data.user.email } : null);
    });
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ? { email: session.user.email } : null);
    });
    return () => {
      listener?.subscription.unsubscribe();
    };
  }, [supabase]);

  return (
    <nav
      style={{
        display: 'flex',
        gap: 12,
        marginTop: 12,
        flexWrap: 'wrap',
        alignItems: 'center',
      }}
    >
      {links.map((link) => {
        const active = pathname === link.href;
        return (
          <Link
            key={link.href}
            href={link.href}
            style={{
              padding: '6px 10px',
              borderRadius: 8,
              border: active ? '1px solid #111' : '1px solid #e5e7eb',
              background: active ? '#111' : '#fff',
              color: active ? '#fff' : '#111',
              textDecoration: 'none',
              fontSize: 14,
            }}
          >
            {link.label}
          </Link>
        );
      })}

      <span style={{ marginLeft: 'auto' }} />

      {user ? (
        <>
          <span style={{ fontSize: 13, color: '#555' }}>
            {user.email ? `Signed in as ${user.email}` : 'Signed in'}
          </span>
          <button
            onClick={() => supabase.auth.signOut()}
            style={{
              padding: '6px 10px',
              borderRadius: 8,
              border: '1px solid #111',
              background: '#fff',
              cursor: 'pointer',
              fontSize: 13,
            }}
          >
            Log out
          </button>
        </>
      ) : (
        <>
          <Link
            href="/login"
            style={{
              padding: '6px 10px',
              borderRadius: 8,
              border: '1px solid #e5e7eb',
              textDecoration: 'none',
              fontSize: 13,
            }}
          >
            Log in
          </Link>
          <Link
            href="/signup"
            style={{
              padding: '6px 10px',
              borderRadius: 8,
              border: '1px solid #111',
              background: '#111',
              color: '#fff',
              textDecoration: 'none',
              fontSize: 13,
            }}
          >
            Sign up
          </Link>
        </>
      )}
    </nav>
  );
}
