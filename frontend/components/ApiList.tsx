'use client';

import { useEffect, useState } from 'react';
import { apiFetch } from '@/lib/api';

type Props<T> = {
  path: string;
  title: string;
  renderItem: (item: T) => React.ReactNode;
  unauthorizedMessage?: string;
};

export function ApiList<T>({ path, title, renderItem, unauthorizedMessage }: Props<T>) {
  const [items, setItems] = useState<T[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    apiFetch(path)
      .then((data) => {
        setItems(data || []);
      })
      .catch((e: any) => {
        const message = e?.message || 'Failed to load';
        const isUnauthorized = typeof message === 'string' && message.includes('API 401');
        setError(isUnauthorized && unauthorizedMessage ? unauthorizedMessage : message);
      });
  }, [path, unauthorizedMessage]);

  return (
    <section style={{ marginTop: 24 }}>
      <h2 style={{ marginBottom: 8 }}>{title}</h2>
      {error && <div style={{ color: 'red' }}>{error}</div>}
      {items.length === 0 && !error && <div>No results yet.</div>}
      <ul style={{ listStyle: 'none', padding: 0, display: 'grid', gap: 12 }}>
        {items.map((item, idx) => (
          <li
            key={idx}
            style={{ border: '1px solid #e5e7eb', borderRadius: 12, padding: 12 }}
          >
            {renderItem(item)}
          </li>
        ))}
      </ul>
    </section>
  );
}
