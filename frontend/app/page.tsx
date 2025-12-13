'use client';

import { useEffect, useState } from 'react';
import { AuthStatus } from '@/components/AuthStatus';
import { apiFetch, healthCheck } from '@/lib/api';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';

export default function HomePage() {
  const [health, setHealth] = useState<string>('Checking API...');
  const [error, setError] = useState<string | null>(null);
  const [whoami, setWhoami] = useState<string>('Unknown');

  useEffect(() => {
    healthCheck()
      .then((data) => {
        setHealth(data.status ? `OK: ${data.status}` : 'OK');
      })
      .catch((e) => {
        setError(String(e.message || e));
        setHealth('API not reachable');
      });
  }, []);

  const checkProtected = async () => {
    try {
      const res = await apiFetch('/api/me');
      setWhoami(JSON.stringify(res));
      setError(null);
    } catch (e: any) {
      setWhoami('Unauthorized');
      setError(e?.message || 'Request failed');
    }
  };

  return (
    <main style={{ maxWidth: 960, margin: '0 auto', padding: 24 }}>
      <h1 style={{ fontSize: 40, marginBottom: 8 }}>The WKND Co</h1>
      <p style={{ fontSize: 18, marginTop: 0 }}>
        Events, stays, and curated weekend packages supported by real concierge and promoters.
      </p>

      <section
        style={{
          marginTop: 24,
          padding: 16,
          border: '1px solid #e5e7eb',
          borderRadius: 12,
        }}
      >
        <h2 style={{ marginTop: 0 }}>System Status</h2>
        <div>
          <div>
            <strong>API Base:</strong> {API_BASE}
          </div>
          <div>
            <strong>Health:</strong> {health}
          </div>
          {error && (
            <div style={{ marginTop: 8 }}>
              <strong>Error:</strong> {error}
            </div>
          )}
        </div>
        <AuthStatus />
        <button
          onClick={checkProtected}
          style={{
            marginTop: 12,
            padding: '8px 12px',
            borderRadius: 8,
            border: '1px solid #111',
          }}
        >
          Call protected /api/me
        </button>
        <div style={{ marginTop: 8, fontSize: 14 }}>Response: {whoami}</div>
      </section>

      <section style={{ marginTop: 28 }}>
        <h2>Start</h2>
        <ol style={{ lineHeight: 1.8 }}>
          <li>Browse events</li>
          <li>Select a stay (curated inventory first)</li>
          <li>Bundle into a WKND Package</li>
          <li>Book and chat with a concierge</li>
        </ol>
      </section>
    </main>
  );
}
