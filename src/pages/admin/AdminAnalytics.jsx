import React from 'react';
import { Card, SectionHeader, Button } from '../../components/common/UI';
import { MONTHLY_REVENUE } from '../../data/mockData';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function AdminAnalytics() {
  return (
    <div style={{ padding: '32px 36px', maxWidth: '1000px' }}>
      <SectionHeader title="Analytics & Insights" subtitle="Deep-dive into platform performance"
        action={<Button variant="outline" size="sm"  onClick={() => {
    const content = `
HandyServe Pro — Analytics Report
Generated: ${new Date().toLocaleDateString()}
================================
Avg Booking Value:      ₹620
Customer Retention:     68%
Provider Rejection Rate: 4.2%
Dispute Rate:           0.8%
Refund Rate:            2.1%
================================
Monthly Revenue:
Sep: ₹48,000 | Oct: ₹62,000
Nov: ₹55,000 | Dec: ₹78,000
Jan: ₹91,000 | Feb: ₹84,000
    `;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'HandyServe_Analytics_Report.txt';
    a.click();
    URL.revokeObjectURL(url);
  }}>📥 Export PDF</Button>} />

      <Card padding="24px" style={{ marginBottom: '24px' }}>
        <p style={{ fontWeight: 700, marginBottom: '16px', fontSize: '16px', color: 'var(--text-primary)' }}>Service Demand Heatmap</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '5px' }}>
          {['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].map(d => (
            <p key={d} style={{ textAlign: 'center', fontSize: '11.5px', color: 'var(--text-muted)', marginBottom: '5px', fontWeight: 600 }}>{d}</p>
          ))}
          {Array.from({ length: 28 }, (_, i) => i).map(i => {
            // eslint-disable-next-line react-hooks/rules-of-hooks
            const intensity = React.useMemo(() => Math.random(), []);
            return (
              <div key={i} style={{ height: 36, borderRadius: 'var(--radius-sm)', background: `rgba(124,58,237,${(0.1 + intensity * 0.9).toFixed(2)})`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', color: intensity > 0.55 ? '#fff' : 'var(--text-secondary)', fontWeight: 600 }}>
                {Math.round(intensity * 40 + 5)}
              </div>
            );
          })}
        </div>
        <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '12px' }}>Numbers = bookings per day · Darker purple = higher demand</p>
      </Card>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        <Card padding="24px">
          <p style={{ fontWeight: 700, marginBottom: '20px', fontSize: '15px', color: 'var(--text-primary)' }}>Booking Trends</p>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={MONTHLY_REVENUE}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="month" stroke="var(--text-muted)" fontSize={12} />
              <YAxis stroke="var(--text-muted)" fontSize={12} />
              <Tooltip contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 10, color: 'var(--text-primary)' }} />
              <Bar dataKey="bookings" fill="#7C3AED" radius={[4,4,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card padding="24px">
          <p style={{ fontWeight: 700, marginBottom: '16px', fontSize: '15px', color: 'var(--text-primary)' }}>Key Metrics</p>
          {[
            { label: 'Avg Booking Value',      value: '₹620',  color: 'var(--brand)' },
            { label: 'Customer Retention',      value: '68%',   color: 'var(--success)' },
            { label: 'Provider Rejection Rate', value: '4.2%',  color: 'var(--warning)' },
            { label: 'Dispute Rate',            value: '0.8%',  color: 'var(--danger)' },
            { label: 'Refund Rate',             value: '2.1%',  color: 'var(--text-secondary)' },
          ].map((m, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: i < 4 ? '1px solid var(--border)' : 'none' }}>
              <p style={{ fontSize: '13.5px', color: 'var(--text-secondary)' }}>{m.label}</p>
              <p style={{ fontWeight: 700, color: m.color, fontSize: '14.5px' }}>{m.value}</p>
            </div>
          ))}
        </Card>
      </div>
    </div>
  );
}