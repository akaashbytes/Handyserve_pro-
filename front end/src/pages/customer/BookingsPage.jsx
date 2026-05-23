import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import FeedbackPanel from '../../components/common/FeedbackPanel';
import { Card, StatusBadge, Button, SectionHeader, EmptyState } from '../../components/common/UI';
import { useAuth } from '../../components/context/AuthContext';
import { SERVICE_CATEGORIES } from '../../data/mockData';

export default function BookingsPage() {
  const { bookings, user } = useAuth();
  const [filter, setFilter] = useState('all');
  const navigate = useNavigate();
  const statuses = ['all', 'Requested', 'Accepted', 'In Progress', 'Pending Payment', 'Completed', 'Cancelled', 'Rejected'];
  
  const customerBookings = bookings.filter(b => b.customerId === user?.id || !b.customerId);
  const filtered = filter === 'all' ? customerBookings : customerBookings.filter(b => b.status === filter);
  const [feedbackBooking, setFeedbackBooking] = useState(null);

  return (
    <div className="animate-fade-in-up" style={{ padding: '32px 36px', maxWidth: '900px' }}>
      <SectionHeader title="My Bookings" subtitle="Track and manage all your service requests" />
      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '24px' }}>
        {statuses.map(s => {
          const active = filter === s;
          return (
            <button key={s} onClick={() => setFilter(s)}
              style={{ padding: '7px 16px', borderRadius: '20px', cursor: 'pointer', fontSize: '13px', fontFamily: 'var(--font-body)', fontWeight: active ? 600 : 400, background: active ? 'var(--brand)' : 'var(--bg-card)', border: `1.5px solid ${active ? 'var(--brand)' : 'var(--border)'}`, color: active ? '#fff' : 'var(--text-secondary)', boxShadow: active ? '0 2px 8px rgba(124,58,237,0.25)' : 'none' }}>
              {s === 'all' ? `All (${customerBookings.length})` : s}
            </button>
          );
        })}
      </div>
      {filtered.length === 0
        ? <EmptyState icon="📋" title="No bookings found" desc="Try a different filter or book a new service." />
        : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {filtered.map(b => (
              <Card key={b.id} padding="20px 24px">
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '16px' }}>
                  <div style={{ display: 'flex', gap: '14px', flex: 1 }}>
                    <div style={{ width: 48, height: 48, borderRadius: 'var(--radius-md)', background: 'var(--brand-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', flexShrink: 0 }}>
                      {SERVICE_CATEGORIES.find(c => c.label === b.service)?.icon || '🔧'}
                    </div>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                        <p style={{ fontWeight: 700, fontSize: '15px', color: 'var(--text-primary)' }}>{b.service}</p>
                        <StatusBadge status={b.status} />
                      </div>
                      <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '2px' }}>🧑‍🔧 {b.providerName} · 📅 {b.date} · ⏰ {b.time}</p>
                      <p style={{ fontSize: '12.5px', color: 'var(--text-muted)' }}>📍 {b.address} · #{b.id}</p>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right', flexShrink: 0 }}>
                    {b.amount > 0 && <p style={{ fontWeight: 700, fontSize: '18px', color: 'var(--brand)', marginBottom: '6px' }}>₹{b.amount}</p>}
                    {b.rating && <p style={{ fontSize: '12.5px', color: '#F59E0B', marginBottom: '6px' }}>{'★'.repeat(b.rating)} You rated {b.rating}★</p>}
                    {b.status === 'In Progress' && <Button size="sm" onClick={() => navigate('/customer/tracking')}>Track</Button>}
                    {b.status === 'Pending Payment' && <Button size="sm" onClick={() => navigate('/customer/payments')}>Pay Now</Button>}
                    {b.status === 'Completed' && !b.rating && (<Button size="sm" variant="soft" onClick={() => setFeedbackBooking(b)}> Rate Service</Button>)}
                  {feedbackBooking && (<FeedbackPanel booking={feedbackBooking} onClose={() => setFeedbackBooking(null)} />)}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )
      }
    </div>
  );
}