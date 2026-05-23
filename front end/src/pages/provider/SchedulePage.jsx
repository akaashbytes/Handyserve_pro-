import React, { useState } from 'react';
import { Card, SectionHeader } from '../../components/common/UI';

export default function SchedulePage() {
  const days  = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const hours = ['8 AM', '9 AM', '10 AM', '11 AM', '12 PM', '1 PM', '2 PM', '3 PM', '4 PM', '5 PM'];
  const [slots, setSlots] = useState({ 'Mon-10 AM': true, 'Mon-2 PM': true, 'Wed-9 AM': true, 'Wed-11 AM': true, 'Fri-10 AM': true, 'Fri-3 PM': true });
  const toggle = key => setSlots(s => ({ ...s, [key]: !s[key] }));

  return (
    <div className="animate-fade-in-up" style={{ padding: '32px 36px', maxWidth: '900px' }}>
      <SectionHeader title="My Schedule" subtitle="Click slots to mark your availability" />
      <Card padding="24px" style={{ overflowX: 'auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: `72px repeat(7, 1fr)`, gap: '6px', minWidth: '680px' }}>
          <div />
          {days.map(d => <p key={d} style={{ textAlign: 'center', fontWeight: 600, fontSize: '13px', padding: '6px 0', color: 'var(--text-secondary)' }}>{d}</p>)}
          {hours.map(h => (
            <React.Fragment key={h}>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)', paddingTop: '10px', textAlign: 'right', paddingRight: '10px' }}>{h}</div>
              {days.map(d => {
                const key = `${d}-${h}`;
                const on = slots[key];
                return (
                  <div key={key} onClick={() => toggle(key)}
                    style={{ height: 36, borderRadius: 'var(--radius-sm)', background: on ? 'var(--brand-light)' : 'var(--bg-elevated)', border: `1.5px solid ${on ? 'var(--brand)' : 'var(--border)'}`, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', color: on ? 'var(--brand)' : 'transparent', fontWeight: 700, transition: 'var(--transition)' }}>
                    {on ? '✓' : ''}
                  </div>
                );
              })}
            </React.Fragment>
          ))}
        </div>
        <div style={{ display: 'flex', gap: '16px', marginTop: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><div style={{ width: 14, height: 14, borderRadius: 3, background: 'var(--brand-light)', border: '1.5px solid var(--brand)' }} /><span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Available</span></div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><div style={{ width: 14, height: 14, borderRadius: 3, background: 'var(--bg-elevated)', border: '1.5px solid var(--border)' }} /><span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Unavailable</span></div>
        </div>
      </Card>
    </div>
  );
}