import React, { useState } from 'react';
import { useAuth } from '../../components/context/AuthContext';
import { Card, Badge, Button, SectionHeader, Avatar } from '../../components/common/UI';

export default function AdminProviders() {
  const { providers, blockProvider } = useAuth();
  const [search, setSearch] = useState('');
  const filtered = providers.filter(p => !search || p.name.toLowerCase().includes(search.toLowerCase()) || p.service?.toLowerCase().includes(search.toLowerCase()));

  return (
    <div style={{ padding: '32px 36px', maxWidth: '1100px' }}>
      <SectionHeader title="Provider Management" subtitle="Verify, approve, and manage service providers" />
      <div style={{ marginBottom: '20px' }}>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="🔍  Search providers..."
          style={{ width: '100%', maxWidth: '400px', padding: '10px 16px', background: 'var(--bg-card)', border: '1.5px solid var(--border)', borderRadius: 'var(--radius-md)', color: 'var(--text-primary)', fontSize: '14px', outline: 'none', boxShadow: 'var(--shadow-xs)' }} />
      </div>

      <Card padding="0" style={{ overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: 'var(--bg-elevated)', borderBottom: '1px solid var(--border)' }}>
                {['Provider', 'Service', 'Rating', 'Reviews', 'Location', 'Status', 'Reliability',
  'Actions'].map(h => (
                  <th key={h} style={{ padding: '12px 18px', textAlign: 'left', fontSize: '11.5px', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.06em', whiteSpace: 'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((p, i) => (
                <tr key={p.id} style={{ borderBottom: '1px solid var(--border)', background: i % 2 === 0 ? 'var(--bg-card)' : 'var(--bg-base)', transition: 'var(--transition)' }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'var(--brand-light)'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = i % 2 === 0 ? 'var(--bg-card)' : 'var(--bg-base)'; }}>
                  <td style={{ padding: '14px 18px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <Avatar initials={p.avatar} size={36} />
                      <p style={{ fontWeight: 600, fontSize: '14px', color: 'var(--text-primary)' }}>{p.name}</p>
                    </div>
                  </td>
                  <td style={{ padding: '14px 18px', fontSize: '13.5px', color: 'var(--text-secondary)' }}>{p.service}</td>
                  <td style={{ padding: '14px 18px', fontSize: '13.5px', color: '#D97706', fontWeight: 600 }}>★ {p.rating}</td>
                  <td style={{ padding: '14px 18px', fontSize: '13.5px', color: 'var(--text-secondary)' }}>{p.reviews}</td>
                  <td style={{ padding: '14px 18px', fontSize: '13.5px', color: 'var(--text-secondary)' }}>{p.location}</td>
                  <td style={{ padding: '14px 18px' }}>
                    {p.blocked ? (
                      <Badge color="danger">Blocked</Badge>
                    ) : (
                      <Badge color="success">✓ Active</Badge>
                    )}
                  </td>

                  <td style={{ padding: '14px 18px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                 <div style={{ width: 60, height: 5, background: 'var(--bg-elevated)', borderRadius: 10, overflow: 'hidden' }}>
                     <div style={{ width: `${p.reliabilityScore || 90}%`, height: '100%', background: (p.reliabilityScore || 90) < 55 ? 'var(--danger)' : 'var(--success)', borderRadius: 10 }} />
                 </div>
                 <span style={{ fontSize: '12px', color: (p.reliabilityScore || 90) < 55 ? 'var(--danger)' : 'var(--success)', fontWeight: 600 }}>{p.reliabilityScore || 90}%</span>
                      </div>
                    </td>

                  <td style={{ padding: '14px 18px' }}>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      {p.blocked ? (
                        <Button size="sm" variant="soft" onClick={() => blockProvider(p.id)}>
                          Unblock
                        </Button>
                      ) : ((p.reliabilityScore || 90) < 55 && (p.lowScoreDays || 0) >= 3) ? (
                        <Button size="sm" variant="danger" onClick={() => blockProvider(p.id)}>
                          Block Provider
                        </Button>
                      ) : null}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}