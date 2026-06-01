import React, { useState } from 'react';
import { useAuth } from "../components/context/AuthContext";
import { Card, Button, Input, Avatar, Badge, SectionHeader, Toast } from '../components/common/UI';

export default function ProfilePage() {
  const { user, updateUser } = useAuth();
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [address, setAddress] = useState(user?.address || '');
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);

  const save = async () => {
    setSaving(true);
    try {
      await updateUser({ name: name.trim(), phone: phone.trim(), address: address.trim() });
      setEditing(false);
      setToast({ message: 'Profile updated successfully!', type: 'success' });
    } catch (err) {
      setToast({ message: err.message || 'Failed to update profile.', type: 'error' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="animate-fade-in-up" style={{ padding: '32px 36px', maxWidth: '700px' }}>
      <SectionHeader title="My Profile" />

      <Card padding="24px 28px" style={{ marginBottom: '18px', display: 'flex', alignItems: 'center', gap: '20px' }}>
        <div style={{ position: 'relative' }}>
          <Avatar initials={user?.avatar} size={72} />
          <div style={{ position: 'absolute', bottom: 0, right: 0, width: 22, height: 22, background: 'var(--brand)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', border: '2px solid var(--bg-card)', cursor: 'pointer' }}>✏️</div>
        </div>
        <div style={{ flex: 1 }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '20px', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '4px' }}>{user?.name}</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '13.5px', marginBottom: '10px' }}>{user?.email}</p>
          <div style={{ display: 'flex', gap: '7px', flexWrap: 'wrap' }}>
            <Badge color="brand" style={{ textTransform: 'capitalize' }}>{user?.role}</Badge>
            {user?.verified && <Badge color="success">✓ Verified</Badge>}
          </div>
        </div>
        <Button variant={editing ? 'outline' : 'soft'} size="sm" onClick={() => setEditing(e => !e)}>
          {editing ? 'Cancel' : '✏️ Edit Profile'}
        </Button>
      </Card>

      <Card padding="24px" style={{ marginBottom: '18px' }}>
        <p style={{ fontWeight: 700, marginBottom: '18px', fontSize: '15px', color: 'var(--text-primary)' }}>
          {user?.role === 'provider' ? 'Service Details' : 'Personal Information'}
        </p>
        {editing ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <Input label="Full Name"     value={name}    onChange={e => setName(e.target.value)}    icon="👤" />
            <Input label="Phone Number"  value={phone}   onChange={e => setPhone(e.target.value)}   icon="📱" />
            <Input label="Address"       value={address} onChange={e => setAddress(e.target.value)} icon="🏠" />
            
            {user?.role === 'provider' && (
              <>
                <Input label="Service Locations (comma separated)" defaultValue="Anna Nagar, Shenoy Nagar" icon="📍" />
                <Input label="Service Radius (km)" defaultValue="10" icon="🌐" type="number" />
                <Input label="Working Hours" defaultValue="9:00 AM - 6:00 PM" icon="🕒" />
              </>
            )}
            
            <div style={{ display: 'flex', gap: '10px', marginTop: '4px' }}>
              <Button onClick={save} disabled={saving}>{saving ? 'Saving...' : 'Save Changes'}</Button>
              <Button variant="ghost" onClick={() => setEditing(false)}>Cancel</Button>
            </div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {[
              { icon: '📧', label: 'Email',   value: user?.email },
              { icon: '📱', label: 'Phone',   value: user?.phone   || 'Not set' },
              { icon: '🏠', label: 'Address', value: user?.address || 'Not set' },
              ...(user?.role === 'provider' ? [
                { icon: '📍', label: 'Service Locations', value: 'Anna Nagar, Shenoy Nagar, Kilpauk' },
                { icon: '🌐', label: 'Service Radius',    value: '10 km' },
                { icon: '🕒', label: 'Working Hours',     value: '9:00 AM - 6:00 PM' },
              ] : [])
            ].map((f, i, arr) => (
              <div key={i} style={{ display: 'flex', gap: '14px', alignItems: 'center', padding: '12px 0', borderBottom: i < arr.length - 1 ? '1px solid var(--border)' : 'none' }}>
                <div style={{ width: 38, height: 38, borderRadius: 'var(--radius-md)', background: 'var(--bg-elevated)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px' }}>{f.icon}</div>
                <div>
                  <p style={{ fontSize: '11.5px', color: 'var(--text-muted)', marginBottom: '2px', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{f.label}</p>
                  <p style={{ fontSize: '14px', fontWeight: 500, color: 'var(--text-primary)' }}>{f.value}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>



      {/* Reliability Score */}
  <Card padding="24px" style={{ marginBottom: '18px' }}>
  <p style={{ fontWeight: 700, marginBottom: '18px', fontSize: '15px', color: 'var(--text-primary)' }}>
    📊 Reliability Score
  </p>
  <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
    <div style={{ position: 'relative', width: 90, height: 90, flexShrink: 0 }}>
      <svg width="90" height="90" viewBox="0 0 90 90">
        <circle cx="45" cy="45" r="38" fill="none" stroke="var(--border)" strokeWidth="8" />
        <circle cx="45" cy="45" r="38" fill="none" stroke="var(--brand)" strokeWidth="8"
          strokeDasharray={`${(92 / 100) * 238.76} 238.76`}
          strokeLinecap="round" transform="rotate(-90 45 45)" />
      </svg>
      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '20px', color: 'var(--brand)', lineHeight: 1 }}>
          {user?.role === 'provider' ? (user?.reliabilityScore || 92) : 92}
        </p>
        <p style={{ fontSize: '10px', color: 'var(--text-muted)' }}>/ 100</p>
      </div>
    </div>
    <div style={{ flex: 1 }}>
      <p style={{ fontWeight: 700, color: 'var(--text-primary)', marginBottom: '6px' }}>
        {user?.role === 'provider' ? 'Top Professional' : 'Excellent Customer'}
      </p>
      <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '12px', lineHeight: 1.5 }}>
        {user?.role === 'provider' 
          ? 'Based on job completion, punctuality, and customer ratings.'
          : 'Based on payment history, cancellations, and reviews.'}
      </p>
      {(user?.role === 'provider' ? [
        { label: 'Job Completion', score: 98 },
        { label: 'Punctuality', score: 95 },
        { label: 'Customer Ratings', score: 92 },
      ] : [
        { label: 'On-time Payments', score: 100 },
        { label: 'Low Cancellations', score: 88 },
        { label: 'Quality Reviews', score: 90 },
      ]).map((s, i) => (
        <div key={i} style={{ marginBottom: '8px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
            <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{s.label}</span>
            <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--brand)' }}>{s.score}%</span>
          </div>
          <div style={{ height: 5, background: 'var(--bg-elevated)', borderRadius: 10, overflow: 'hidden' }}>
            <div style={{ width: `${s.score}%`, height: '100%', background: 'linear-gradient(90deg, var(--brand), #8B5CF6)', borderRadius: 10 }} />
          </div>
        </div>
      ))}
    </div>
  </div>
  </Card>

  {/* Emergency Contact */}
  <Card padding="24px" style={{ marginBottom: '18px' }}>
  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
    <p style={{ fontWeight: 700, fontSize: '15px', color: 'var(--text-primary)' }}>🆘 Emergency Contact</p>
    <Button size="sm" variant="soft">Edit</Button>
  </div>
  {[
    { icon: '👤', label: 'Name',         value: 'Priya Mehta' },
    { icon: '📱', label: 'Phone',        value: '+91 98760 00001' },
    { icon: '💞', label: 'Relationship', value: 'Spouse' },
  ].map((f, i, arr) => (
    <div key={i} style={{ display: 'flex', gap: '14px', alignItems: 'center', padding: '12px 0', borderBottom: i < arr.length - 1 ? '1px solid var(--border-light)' : 'none' }}>
      <div style={{ width: 38, height: 38, borderRadius: 'var(--radius-md)', background: 'var(--danger-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', flexShrink: 0 }}>{f.icon}</div>
      <div>
        <p style={{ fontSize: '11.5px', color: 'var(--text-muted)', marginBottom: '2px', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{f.label}</p>
        <p style={{ fontSize: '14px', fontWeight: 500, color: 'var(--text-primary)' }}>{f.value}</p>
      </div>
    </div>
  ))}
</Card>



      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}