'use client';

import { ApiList } from '@/components/ApiList';
import { useState } from 'react';
import { apiFetch } from '@/lib/api';

type BookingItem = {
  id: string;
  status: string;
  payment_status?: string;
  package_id: string;
  user_id: string;
  amount_paid?: number;
  payment_method?: string;
};

export default function BookingsPage() {
  const [paymentStatus, setPaymentStatus] = useState<string | null>(null);
  const [paymentError, setPaymentError] = useState<string | null>(null);

  const createIntent = async () => {
    setPaymentStatus(null);
    setPaymentError(null);
    try {
      const res = await apiFetch('/api/payments/intents', {
        method: 'POST',
        body: JSON.stringify({ amount: 5000, currency: 'usd' }),
      });
      if (res.stubbed) {
        setPaymentStatus('Payments are in stub mode (no Stripe key set).');
      } else {
        setPaymentStatus(`Stripe intent created. Client secret: ${res.client_secret}`);
      }
    } catch (err: any) {
      setPaymentError(err?.message || 'Failed to create payment intent');
    }
  };

  return (
    <main style={{ maxWidth: 960, margin: '0 auto', padding: 24 }}>
      <h1>Bookings</h1>
      <p>Booking history from /api/bookings (requires auth; stub view).</p>
      <div style={{ marginTop: 12 }}>
        <button
          onClick={createIntent}
          style={{
            padding: '8px 12px',
            borderRadius: 8,
            border: '1px solid #111',
            background: '#111',
            color: '#fff',
            cursor: 'pointer',
          }}
        >
          Test payment intent
        </button>
        {paymentStatus && <div style={{ marginTop: 8, color: 'green' }}>{paymentStatus}</div>}
        {paymentError && <div style={{ marginTop: 8, color: 'red' }}>{paymentError}</div>}
      </div>
      <ApiList<BookingItem>
        path="/api/bookings"
        title="Bookings"
        unauthorizedMessage="Please log in to view bookings."
        renderItem={(bk) => (
          <div>
            <div style={{ fontWeight: 600 }}>{bk.id}</div>
            <div>Status: {bk.status}</div>
            <div>Payment: {bk.payment_status}</div>
            <div>Package: {bk.package_id}</div>
            <div>User: {bk.user_id}</div>
            {bk.amount_paid !== undefined && <div>Paid: ${bk.amount_paid}</div>}
            {bk.payment_method && <div>Method: {bk.payment_method}</div>}
          </div>
        )}
      />
    </main>
  );
}
