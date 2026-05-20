import React, { useState } from 'react';
import { useAuth } from '../../components/context/AuthContext';
import { Card, StatusBadge, Button, Badge, SectionHeader, Avatar } from '../../components/common/UI';

function JobCard({ job, onUpdate }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const actions = {
    'Requested':   [{ label: 'Accept ✓', variant: 'primary', next: 'Accepted' }, { label: 'Decline', variant: 'danger', next: 'Rejected' }],
    'Accepted':    [{ label: 'Start Job →', variant: 'primary', next: 'In Progress' }],
    'In Progress': [{ label: 'Request Payment 💳', variant: 'soft', next: 'Pending Payment' }],
  };
  const btns = actions[job.status] || [];

  return (
    <Card padding="18px 22px" style={job.status === 'Requested' ? { borderColor: 'var(--brand)', background: 'var(--brand-glow)', cursor: 'pointer' } : { cursor: 'pointer' }} onClick={() => setIsExpanded(!isExpanded)}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <Avatar initials={(job.customerName || 'C').split(' ').map(n => n[0]).join('')} size={44} bg="#FEF3C7" color="#92400E" />
          <div>
            <p style={{ fontWeight: 700, fontSize: '14.5px', color: 'var(--text-primary)', marginBottom: '3px' }}>{job.customerName || 'Valued Customer'}</p>
            <p style={{ fontSize: '12.5px', color: 'var(--text-secondary)' }}><b>Service:</b> {job.service}</p>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>📅 {job.date} · ⏰ {job.time} · 📍 {job.location}</p>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          <div style={{ textAlign: 'right' }}>
            <p style={{ fontWeight: 800, color: 'var(--brand)', fontSize: '17px' }}>₹{job.amount}</p>
            <StatusBadge status={job.status} />
          </div>
          {btns.length > 0 && (
            <div style={{ display: 'flex', gap: '8px' }}>
              {btns.map(b => <Button key={b.label} variant={b.variant} size="sm" onClick={(e) => { e.stopPropagation(); onUpdate(job.id, b.next); }}>{b.label}</Button>)}
            </div>
          )}
        </div>
      </div>
      
      {isExpanded && (
        <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid var(--border)', animation: 'fadeIn 0.2s' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
             <div>
                <p style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '8px' }}>Requested Items</p>
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                   {(job.options || ['Standard Service']).map(o => <Badge key={o} color="muted">{o}</Badge>)}
                </div>
             </div>
             <div>
                <p style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '8px' }}>Location Map</p>
                <div style={{ height: '80px', background: 'var(--bg-elevated)', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
                   <div style={{ fontSize: '20px' }}>📍</div>
                   <div style={{ position: 'absolute', inset: 0, border: '1px solid var(--border)', opacity: 0.3, background: 'repeating-linear-gradient(45deg, transparent, transparent 10px, var(--border) 10px, var(--border) 11px)' }}></div>
                </div>
             </div>
          </div>
        </div>
      )}
    </Card>
  );
}

export default function ProviderJobs() {
  const { bookings, updateBookingStatus, user } = useAuth();
  
  const providerBookings = bookings.filter(b => (b.serviceProviderId === user?.id || (!b.serviceProviderId && b.providerName === user?.name)) && (b.status === 'Requested' || b.status === 'Accepted' || b.status === 'In Progress' || b.status === 'Pending Payment'));
  const pastBookings = bookings.filter(b => (b.serviceProviderId === user?.id || (!b.serviceProviderId && b.providerName === user?.name)) && (b.status === 'Completed' || b.status === 'Rejected' || b.status === 'Cancelled'));

  return (
    <div style={{ padding: '32px 36px', maxWidth: '1100px' }}>
      <SectionHeader title="Active Job Requests" subtitle="Manage your incoming service requests" />
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '28px' }}>
        {providerBookings.length > 0 ? (
          providerBookings.map(job => <JobCard key={job.id} job={job} onUpdate={updateBookingStatus} />)
        ) : (
          <p style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)', background: 'var(--bg-card)', borderRadius: 'var(--radius-lg)', border: '1.5px dashed var(--border)' }}>
            No active job requests at the moment.
          </p>
        )}
      </div>

      <SectionHeader title="Job History" subtitle="Recently completed or cancelled jobs" />
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '28px' }}>
        {pastBookings.length > 0 ? (
          pastBookings.map(job => <JobCard key={job.id} job={job} onUpdate={updateBookingStatus} />)
        ) : (
          <p style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)', background: 'var(--bg-card)', borderRadius: 'var(--radius-lg)', border: '1.5px dashed var(--border)' }}>
            No job history found.
          </p>
        )}
      </div>
    </div>
  );
}
