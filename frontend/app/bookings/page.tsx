'use client';

import { ApiList } from '@/components/ApiList';

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
  return (
    <main style={{ maxWidth: 960, margin: '0 auto', padding: 24 }}>
      <h1>Bookings</h1>
      <p>Booking history from /api/bookings (requires auth; stub view).</p>
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
