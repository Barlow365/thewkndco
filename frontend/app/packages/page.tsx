'use client';

import { useMemo, useState } from 'react';
import { ApiList } from '@/components/ApiList';

type PackageItem = {
  id: string;
  status: string;
  total_price?: number;
  markup_percentage?: number;
  lodging?: { name: string; location: string };
  events?: { title: string }[];
};

export default function PackagesPage() {
  const [location, setLocation] = useState('');
  const [status, setStatus] = useState('');

  const path = useMemo(() => {
    const params = new URLSearchParams();
    if (location.trim()) params.append('location', location.trim());
    if (status) params.append('status', status);
    const qs = params.toString();
    return `/api/packages${qs ? `?${qs}` : ''}`;
  }, [location, status]);

  return (
    <main style={{ maxWidth: 960, margin: '0 auto', padding: 24 }}>
      <h1>Packages</h1>
      <p>Package list from /api/packages (public).</p>

      <div
        style={{
          marginTop: 12,
          display: 'flex',
          gap: 12,
          flexWrap: 'wrap',
          alignItems: 'flex-end',
        }}
      >
        <label style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <span style={{ fontSize: 13, color: '#444' }}>Location</span>
          <input
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="e.g. Miami"
            style={{ padding: '8px 10px', borderRadius: 8, border: '1px solid #e5e7eb' }}
          />
        </label>

        <label style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <span style={{ fontSize: 13, color: '#444' }}>Status</span>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            style={{ padding: '8px 10px', borderRadius: 8, border: '1px solid #e5e7eb' }}
          >
            <option value="">Any</option>
            <option value="draft">Draft</option>
            <option value="active">Active</option>
            <option value="sold_out">Sold out</option>
            <option value="archived">Archived</option>
          </select>
        </label>
      </div>

      <ApiList<PackageItem>
        path={path}
        title="Packages"
        renderItem={(pkg) => (
          <div>
            <div style={{ fontWeight: 600 }}>{pkg.id}</div>
            <div>Status: {pkg.status}</div>
            {pkg.total_price !== undefined && <div>Total: ${pkg.total_price}</div>}
            {pkg.markup_percentage !== undefined && (
              <div>Markup: {Math.round(pkg.markup_percentage * 100)}%</div>
            )}
            {pkg.lodging && (
              <div>
                Lodging: {pkg.lodging.name} ({pkg.lodging.location})
              </div>
            )}
            {pkg.events && pkg.events.length > 0 && (
              <div>Events: {pkg.events.map((e) => e.title).join(', ')}</div>
            )}
          </div>
        )}
      />
    </main>
  );
}
