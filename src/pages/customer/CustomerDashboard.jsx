import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../components/context/AuthContext';
import { Card, StatCard, StatusBadge, Button, SectionHeader } from '../../components/common/UI';
import { SERVICE_CATEGORIES, BOOKINGS } from '../../data/mockData';

export default function CustomerDashboard() {
  const { user, bookings, setLocationModalOpen } = useAuth();
  const navigate = useNavigate();
  
  const handleAction = (path = '/customer/discover') => {
    if (!user?.city) {
      setLocationModalOpen(true);
      return;
    }
    navigate(path);
  };
  
  const customerBookings = bookings.filter(b => b.customerId === user?.id || !b.customerId); // fallback for mock data
  const completed = customerBookings.filter(b => b.status === 'Completed');
  const totalSpent = completed.reduce((sum, b) => sum + (b.amount || 0), 0);
  const recentBookings = customerBookings.slice(0, 3);
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  return (
    <div style={{ padding: '32px 36px', maxWidth: '1140px' }}>
      {/* Header */}
      <div style={{ marginBottom: '28px' }}>
        <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '4px' }}>{new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })}</p>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '28px', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.4px' }}>
          {greeting}, <span style={{ color: 'var(--brand)' }}>{user?.name?.split(' ')[0]}</span> 👋
        </h1>
        <p style={{ color: 'var(--text-secondary)', marginTop: '4px', fontSize: '14px' }}>What home service do you need today?</p>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '16px', marginBottom: '28px' }}>
        <StatCard label="Total Bookings"   value={customerBookings.length.toString()}    icon="📋" change="+2 this month"  iconBg="#EDE9FE" color="var(--brand)" />
        <StatCard label="Completed"        value={completed.length.toString()}     icon="✅" change="+1 this week"   iconBg="#D1FAE5" color="var(--success)" />
        <StatCard label="Avg Rating Given" value="4.7"   icon="⭐" iconBg="#FEF3C7"        color="#D97706" />
      </div>

      {/* Hero Banner */}
      <div style={{ background: 'linear-gradient(120deg, #7C3AED 0%, #5B21B6 100%)', borderRadius: 'var(--radius-xl)', padding: '28px 36px', marginBottom: '32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative', overflow: 'hidden', boxShadow: '0 6px 28px rgba(124,58,237,0.3)' }}>
        <div style={{ position: 'absolute', right: -20, top: -40, width: 200, height: 200, borderRadius: '50%', background: 'rgba(255,255,255,0.07)', pointerEvents: 'none' }} />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '13px', marginBottom: '6px', fontWeight: 500 }}>Book a service</p>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '22px', fontWeight: 800, color: '#fff', marginBottom: '8px' }}>200+ professionals near you</h2>
          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '13.5px' }}>Fast booking · Verified experts · Fixed prices</p>
        </div>
        <Button onClick={() => handleAction()} size="lg" style={{ background: '#fff', color: 'var(--brand)', flexShrink: 0, position: 'relative', zIndex: 1 }}>Book Now →</Button>
      </div>

      {/* Categories */}
      <SectionHeader title="Our Services" action={<Button variant="ghost" size="sm" onClick={() => handleAction()} style={{ color: 'var(--brand)', fontWeight: 600 }}>See all →</Button>} />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '14px', marginBottom: '36px' }}>
        {SERVICE_CATEGORIES.slice(0, 4).map(cat => (
          <Card key={cat.id} hover onClick={() => handleAction()} padding="20px" style={{ textAlign: 'center' }}>
            <div style={{ width: 54, height: 54, borderRadius: '14px', background: 'var(--bg-elevated)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '26px', margin: '0 auto 12px' }}>{cat.icon}</div>
            <p style={{ fontWeight: 700, fontSize: '14px', color: 'var(--text-primary)', marginBottom: '4px' }}>{cat.label}</p>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)', lineHeight: 1.4 }}>{cat.desc}</p>
          </Card>
        ))}
      </div>

      {/* Recent Bookings */}
      <SectionHeader title="Recent Bookings" action={<Button variant="ghost" size="sm" onClick={() => navigate('/customer/bookings')} style={{ color: 'var(--brand)', fontWeight: 600 }}>View all →</Button>} />
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '32px' }}>
        {recentBookings.map(b => (
          <Card key={b.id} padding="18px 22px">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div style={{ width: 46, height: 46, borderRadius: 'var(--radius-md)', background: 'var(--brand-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px', flexShrink: 0 }}>
                  {SERVICE_CATEGORIES.find(c => c.label === b.service)?.icon || '🔧'}
                </div>
                <div>
                  <p style={{ fontWeight: 700, fontSize: '14.5px', marginBottom: '3px', color: 'var(--text-primary)' }}>{b.service}</p>
                  <p style={{ fontSize: '12.5px', color: 'var(--text-secondary)' }}>{b.providerName} · {b.date} · {b.time}</p>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexShrink: 0 }}>
                {b.amount > 0 && <p style={{ fontWeight: 700, color: 'var(--brand)', fontSize: '16px' }}>₹{b.amount}</p>}
                <StatusBadge status={b.status} />
                {b.status === 'In Progress' && <Button size="sm" onClick={() => navigate('/customer/tracking')}>Track</Button>}
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Badges */}
      <SectionHeader title="Your Badges" />
      <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
        {[
          { icon: '⚡', label: 'Prompt Customer', desc: 'Always pays on time', bg: '#FFFBEB', border: '#FDE68A' },
          { icon: '🌟', label: 'Loyal Member',    desc: '10+ bookings made',   bg: '#F5F3FF', border: '#DDD6FE' },
          { icon: '💬', label: 'Top Reviewer',    desc: 'Rated 5+ services',   bg: '#F0FDF4', border: '#BBF7D0' },
        ].map((b, i) => (
          <Card key={i} padding="16px 20px" style={{ display: 'flex', alignItems: 'center', gap: '14px', background: b.bg, borderColor: b.border }}>
            <div style={{ width: 44, height: 44, borderRadius: '12px', background: 'rgba(255,255,255,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px', flexShrink: 0 }}>{b.icon}</div>
            <div>
              <p style={{ fontWeight: 700, fontSize: '14px', color: 'var(--text-primary)' }}>{b.label}</p>
              <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{b.desc}</p>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}