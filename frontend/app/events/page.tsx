'use client';

import { useMemo, useState } from 'react';
import { ApiList } from '@/components/ApiList';

type EventItem = {
  id: string;
  title: string;
  city: string;
  venue: string;
  date: string;
  status?: string;
  price: number;
  tags?: string[];
};

export default function EventsPage() {
  const [city, setCity] = useState('');
  const [status, setStatus] = useState('');

  const path = useMemo(() => {
    const params = new URLSearchParams();
    if (city.trim()) params.append('city', city.trim());
    if (status) params.append('status', status);
    const qs = params.toString();
    return `/api/events${qs ? `?${qs}` : ''}`;
  }, [city, status]);

  return (
    <main style={{ maxWidth: 960, margin: '0 auto', padding: 24 }}>
      <h1>Events</h1>
      <p>Live events from /api/events (public).</p>

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
          <span style={{ fontSize: 13, color: '#444' }}>City</span>
          <input
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="e.g. Las Vegas"
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
            <option value="active">Active</option>
            <option value="draft">Draft</option>
            <option value="archived">Archived</option>
          </select>
        </label>
      </div>

      <ApiList<EventItem>
        path={path}
        title="Upcoming"
        renderItem={(event) => (
          <div>
            <div style={{ fontWeight: 600 }}>{event.title}</div>
            <div>
              {event.city} - {event.venue}
            </div>
            <div>
              {event.date} - ${event.price}
            </div>
            {event.status && <div>Status: {event.status}</div>}
            {event.tags && <div>Tags: {event.tags.join(', ')}</div>}
          </div>
        )}
      />
    </main>
  );
}
