'use client';

import { FormEvent, useState } from 'react';
import { apiFetch } from '@/lib/api';

type Status = { ok: boolean; message: string };

const fieldStyle = {
  padding: '8px 10px',
  borderRadius: 8,
  border: '1px solid #e5e7eb',
};

function useStatus() {
  const [status, setStatus] = useState<Status | null>(null);
  return {
    status,
    setStatus,
    reset: () => setStatus(null),
  };
}

export default function AdminPage() {
  const eventStatus = useStatus();
  const lodgingStatus = useStatus();
  const packageStatus = useStatus();

  async function handleEventSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    eventStatus.reset();
    const form = new FormData(e.currentTarget);
    const body = {
      id: form.get('id')?.toString() || undefined,
      title: form.get('title')?.toString() || '',
      city: form.get('city')?.toString() || '',
      venue: form.get('venue')?.toString() || '',
      date: form.get('date')?.toString() || '',
      price: parseFloat(form.get('price')?.toString() || '0'),
      tags: form
        .get('tags')
        ?.toString()
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean) || [],
      source: 'admin',
    };
    try {
      const res = await apiFetch('/api/admin/events', {
        method: 'POST',
        body: JSON.stringify(body),
      });
      eventStatus.setStatus({ ok: true, message: `Saved event ${res.id}` });
    } catch (err: any) {
      eventStatus.setStatus({ ok: false, message: err?.message || 'Failed to save event' });
    }
  }

  async function handleLodgingSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    lodgingStatus.reset();
    const form = new FormData(e.currentTarget);
    const body = {
      id: form.get('id')?.toString() || undefined,
      name: form.get('name')?.toString() || '',
      location: form.get('location')?.toString() || '',
      price: parseFloat(form.get('price')?.toString() || '0'),
      source: 'admin',
    };
    try {
      const res = await apiFetch('/api/admin/lodgings', {
        method: 'POST',
        body: JSON.stringify(body),
      });
      lodgingStatus.setStatus({ ok: true, message: `Saved lodging ${res.id}` });
    } catch (err: any) {
      lodgingStatus.setStatus({ ok: false, message: err?.message || 'Failed to save lodging' });
    }
  }

  async function handlePackageSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    packageStatus.reset();
    const form = new FormData(e.currentTarget);
    const eventIds = form
      .get('event_ids')
      ?.toString()
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean) || [];
    const body: Record<string, any> = {
      id: form.get('id')?.toString() || undefined,
      lodging_id: form.get('lodging_id')?.toString() || undefined,
      event_ids: eventIds,
      total_price: form.get('total_price')
        ? parseFloat(form.get('total_price')!.toString())
        : undefined,
      markup_percentage: form.get('markup_percentage')
        ? parseFloat(form.get('markup_percentage')!.toString())
        : undefined,
      addons: {},
      assigned_agent_id: form.get('assigned_agent_id')?.toString() || undefined,
    };
    try {
      const res = await apiFetch('/api/packages', {
        method: 'POST',
        body: JSON.stringify(body),
      });
      packageStatus.setStatus({ ok: true, message: `Saved package ${res.id}` });
    } catch (err: any) {
      packageStatus.setStatus({ ok: false, message: err?.message || 'Failed to save package' });
    }
  }

  return (
    <main style={{ maxWidth: 960, margin: '0 auto', padding: 24 }}>
      <h1>Admin</h1>
      <p style={{ color: '#555', marginBottom: 16 }}>
        Admin-only tools for seeding events, lodgings, and packages (with agent assignment).
      </p>

      <section style={{ marginTop: 16, padding: 16, border: '1px solid #e5e7eb', borderRadius: 12 }}>
        <h2 style={{ marginTop: 0 }}>Create / Update Event</h2>
        <form onSubmit={handleEventSubmit} style={{ display: 'grid', gap: 10, maxWidth: 520 }}>
          <input name="id" placeholder="Event ID (optional)" style={fieldStyle} />
          <input name="title" placeholder="Title" required style={fieldStyle} />
          <input name="city" placeholder="City" required style={fieldStyle} />
          <input name="venue" placeholder="Venue" required style={fieldStyle} />
          <input name="date" type="date" required style={fieldStyle} />
          <input name="price" type="number" step="0.01" placeholder="Price (e.g., 120)" required style={fieldStyle} />
          <input name="tags" placeholder="Tags (comma separated)" style={fieldStyle} />
          <button
            type="submit"
            style={{
              padding: '10px 14px',
              borderRadius: 8,
              border: '1px solid #111',
              background: '#111',
              color: '#fff',
              cursor: 'pointer',
            }}
          >
            Save Event
          </button>
          {eventStatus.status && (
            <div style={{ color: eventStatus.status.ok ? 'green' : 'red', fontSize: 14 }}>
              {eventStatus.status.message}
            </div>
          )}
        </form>
      </section>

      <section style={{ marginTop: 16, padding: 16, border: '1px solid #e5e7eb', borderRadius: 12 }}>
        <h2 style={{ marginTop: 0 }}>Create / Update Lodging</h2>
        <form onSubmit={handleLodgingSubmit} style={{ display: 'grid', gap: 10, maxWidth: 520 }}>
          <input name="id" placeholder="Lodging ID (optional)" style={fieldStyle} />
          <input name="name" placeholder="Name" required style={fieldStyle} />
          <input name="location" placeholder="Location" required style={fieldStyle} />
          <input name="price" type="number" step="0.01" placeholder="Price (e.g., 220)" required style={fieldStyle} />
          <button
            type="submit"
            style={{
              padding: '10px 14px',
              borderRadius: 8,
              border: '1px solid #111',
              background: '#111',
              color: '#fff',
              cursor: 'pointer',
            }}
          >
            Save Lodging
          </button>
          {lodgingStatus.status && (
            <div style={{ color: lodgingStatus.status.ok ? 'green' : 'red', fontSize: 14 }}>
              {lodgingStatus.status.message}
            </div>
          )}
        </form>
      </section>

      <section style={{ marginTop: 16, padding: 16, border: '1px solid #e5e7eb', borderRadius: 12 }}>
        <h2 style={{ marginTop: 0 }}>Create / Update Package (agent assignment)</h2>
        <form onSubmit={handlePackageSubmit} style={{ display: 'grid', gap: 10, maxWidth: 520 }}>
          <input name="id" placeholder="Package ID (optional)" style={fieldStyle} />
          <input name="lodging_id" placeholder="Lodging ID (optional)" style={fieldStyle} />
          <input
            name="event_ids"
            placeholder="Event IDs (comma separated)"
            style={fieldStyle}
          />
          <input
            name="total_price"
            type="number"
            step="0.01"
            placeholder="Total price (optional)"
            style={fieldStyle}
          />
          <input
            name="markup_percentage"
            type="number"
            step="0.01"
            placeholder="Markup (e.g., 0.15)"
            style={fieldStyle}
          />
          <input
            name="assigned_agent_id"
            placeholder="Agent ID (optional)"
            style={fieldStyle}
          />
          <button
            type="submit"
            style={{
              padding: '10px 14px',
              borderRadius: 8,
              border: '1px solid #111',
              background: '#111',
              color: '#fff',
              cursor: 'pointer',
            }}
          >
            Save Package
          </button>
          {packageStatus.status && (
            <div style={{ color: packageStatus.status.ok ? 'green' : 'red', fontSize: 14 }}>
              {packageStatus.status.message}
            </div>
          )}
        </form>
      </section>
    </main>
  );
}
