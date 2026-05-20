import React from 'react';
import { Card, StatCard, Badge, SectionHeader, Avatar } from '../../components/common/UI';
import { MONTHLY_REVENUE, CATEGORY_DEMAND, PROVIDERS, RECENT_ACTIVITIES } from '../../data/mockData';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { useAuth } from '../../components/context/AuthContext';

const CHART_STYLE = { background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 10, color: 'var(--text-primary)' };
const PIE_COLORS = ['#7C3AED', '#F59E0B', '#EF4444', '#10B981', '#3B82F6', '#8B5CF6'];

export default function AdminDashboard() {
  const { bookings, providers, leaveRequests, disputes, contactRequests } = useAuth();
  
  const totalRevenue = bookings.filter(b => b.status === 'Completed').reduce((sum, b) => sum + (b.amount || 0), 0);
  const totalBookingsCount = bookings.length;
  const activeProviders = providers.filter(p => !p.blocked).length;
  const completedBookings = bookings.filter(b => b.status === 'Completed').length;
  const completionRate = totalBookingsCount > 0 ? Math.round((completedBookings / totalBookingsCount) * 100) : 0;
  const pendingLeaves = leaveRequests ? leaveRequests.filter(l => l.status === 'pending').length : 0;
  const openDisputes = disputes ? disputes.filter(d => d.status === 'Open').length : 0;

  return (
    <div style={{ padding: '32px 36px', maxWidth: '1200px' }}>
      <div style={{ marginBottom: '26px' }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '26px', fontWeight: 800, color: 'var(--text-primary)' }}>Admin Dashboard</h1>
        <p style={{ color: 'var(--text-secondary)', marginTop: '4px', fontSize: '14px' }}>Platform overview — HandyServe Pro</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '16px' }}>
        <StatCard label="Total Revenue"    value={`₹${(totalRevenue/1000).toFixed(1)}k`} icon="💰" change="from bookings" iconBg="#EDE9FE" color="var(--brand)" />
        <StatCard label="Total Bookings"   value={totalBookingsCount.toString()}   icon="📋" change="platform total" iconBg="#D1FAE5" color="var(--success)" />
        <StatCard label="Active Providers" value={activeProviders.toString()} icon="🔧" iconBg="#FEF3C7" color="#D97706" />
        <StatCard label="Active Customers" value="84" icon="👤" iconBg="#DBEAFE" color="#1D4ED8" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '28px' }}>
        <StatCard label="Pending Leaves"    value={pendingLeaves.toString()} icon="⏳" iconBg="#FEF3C7" color="#D97706" />
        <StatCard label="Open Disputes"     value={openDisputes.toString()}  icon="⚠️" iconBg="#FEE2E2" color="var(--danger)" />
        <StatCard label="Platform Rating"   value="4.8"                      icon="⭐" iconBg="#FEF3C7" color="#D97706" />
        <StatCard label="Completion Rate"   value={`${completionRate}%`}     icon="✅" iconBg="#D1FAE5" color="var(--success)" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: '20px', marginBottom: '24px' }}>
        <Card padding="24px">
          <p style={{ fontWeight: 700, marginBottom: '20px', fontSize: '16px', color: 'var(--text-primary)' }}>Monthly Revenue & Bookings</p>
          <ResponsiveContainer width="100%" height={230}>
            <BarChart data={MONTHLY_REVENUE} barCategoryGap="35%">
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="month" stroke="var(--text-muted)" fontSize={12} />
              <YAxis yAxisId="left" stroke="var(--text-muted)" fontSize={12} tickFormatter={v => `₹${v/1000}k`} />
              <YAxis yAxisId="right" orientation="right" stroke="var(--text-muted)" fontSize={12} />
              <Tooltip contentStyle={CHART_STYLE} />
              <Bar yAxisId="left" dataKey="revenue" fill="#7C3AED" radius={[4,4,0,0]} name="Revenue" />
              <Bar yAxisId="right" dataKey="bookings" fill="#DDD6FE" radius={[4,4,0,0]} name="Bookings" />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card padding="24px">
          <p style={{ fontWeight: 700, marginBottom: '16px', fontSize: '16px', color: 'var(--text-primary)' }}>Category Demand</p>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie data={CATEGORY_DEMAND} cx="50%" cy="50%" outerRadius={80} innerRadius={40} dataKey="value" paddingAngle={3}>
                {CATEGORY_DEMAND.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
              </Pie>
              <Tooltip contentStyle={CHART_STYLE} />
            </PieChart>
          </ResponsiveContainer>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '8px' }}>
            {CATEGORY_DEMAND.slice(0, 4).map((c, i) => (
              <div key={c.name} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
                  <div style={{ width: 10, height: 10, borderRadius: '50%', background: PIE_COLORS[i], flexShrink: 0 }} />
                  <span style={{ fontSize: '12.5px', color: 'var(--text-secondary)' }}>{c.name}</span>
                </div>
                <span style={{ fontSize: '12.5px', fontWeight: 600, color: 'var(--text-primary)' }}>{c.value}%</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '20px' }}>
        <Card padding="24px">
          <p style={{ fontWeight: 700, marginBottom: '18px', fontSize: '16px', color: 'var(--text-primary)' }}>Provider Performance</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {PROVIDERS.slice(0, 4).map((p, idx) => {
              const bgs = ['#EDE9FE', '#D1FAE5', '#DBEAFE', '#FEF3C7'];
              return (
                <div key={p.id} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <Avatar initials={p.avatar} size={38} bg={bgs[idx]} color="var(--brand)" />
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                      <p style={{ fontWeight: 600, fontSize: '14px', color: 'var(--text-primary)' }}>{p.name}</p>
                      <span style={{ fontSize: '12.5px', color: '#F59E0B', fontWeight: 600 }}>★ {p.rating}</span>
                    </div>
                    <div style={{ height: 6, background: 'var(--bg-elevated)', borderRadius: 10, overflow: 'hidden' }}>
                      <div style={{ width: `${(p.rating / 5) * 100}%`, height: '100%', background: 'linear-gradient(90deg, var(--brand), #8B5CF6)', borderRadius: 10 }} />
                    </div>
                  </div>
                  <Badge color={p.verified ? 'brand' : 'warning'}>{p.verified ? '✓ Verified' : 'Pending'}</Badge>
                </div>
              );
            })}
          </div>
        </Card>

        <Card padding="24px">
          <p style={{ fontWeight: 700, marginBottom: '16px', fontSize: '16px', color: 'var(--text-primary)' }}>Recent Activity</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {RECENT_ACTIVITIES.map(a => (
              <div key={a.id} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: a.color, marginTop: '6px', flexShrink: 0 }} />
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: '13px', color: 'var(--text-primary)', lineHeight: 1.4 }}>{a.text}</p>
                  <p style={{ fontSize: '11.5px', color: 'var(--text-muted)', marginTop: '2px' }}>{a.time}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}