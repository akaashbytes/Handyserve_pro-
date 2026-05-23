import React, { useState } from 'react';
import { Card, Button, Input, SectionHeader, Toast } from '../../components/common/UI';

export default function AdminSettings() {
  const [toast, setToast]       = useState(null);
  const [maintenance, setMaintenance] = useState(false);
  const [notifications, setNotifications] = useState({
    bookingConfirm:  true,
    paymentAlert:    true,
    disputeAlert:    true,
    providerApproval: true,
    weeklyReport:    false,
  });
  const [fees, setFees] = useState({
    platformFee:   '10',
    gstRate:       '5',
    cancellationFee: '50',
  });
  const [platform, setPlatform] = useState({
    name:    'HandyServe Pro',
    email:   'support@handyserve.com',
    phone:   '+91 99887 76655',
    address: 'Guindy, Chennai - 600032',
  });

  const save = () => setToast({ message: 'Settings saved successfully!', type: 'success' });

  const Toggle = ({ value, onChange, label, desc }) => (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 0', borderBottom: '1px solid var(--border-light)' }}>
      <div>
        <p style={{ fontWeight: 600, fontSize: '14px', color: 'var(--text-primary)' }}>{label}</p>
        {desc && <p style={{ fontSize: '12.5px', color: 'var(--text-muted)', marginTop: '2px' }}>{desc}</p>}
      </div>
      <div onClick={onChange}
        style={{ width: 46, height: 26, borderRadius: 13, background: value ? 'var(--brand)' : 'var(--border)', cursor: 'pointer', position: 'relative', transition: 'var(--transition)', flexShrink: 0 }}>
        <div style={{ width: 20, height: 20, borderRadius: '50%', background: '#fff', position: 'absolute', top: 3, left: value ? 23 : 3, transition: 'var(--transition)', boxShadow: 'var(--shadow-sm)' }} />
      </div>
    </div>
  );

  return (
    <div className="animate-fade-in-up" style={{ padding: '32px 36px', maxWidth: '760px' }}>
      <SectionHeader title="Platform Settings" subtitle="Configure HandyServe Pro settings" />

      {/* Maintenance Mode */}
      <Card padding="20px 24px" style={{ marginBottom: '18px', background: maintenance ? 'var(--warning-light)' : 'var(--bg-card)', borderColor: maintenance ? 'var(--warning)' : 'var(--border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
            <div style={{ width: 46, height: 46, borderRadius: 'var(--radius-md)', background: 'var(--warning-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px' }}>🚧</div>
            <div>
              <p style={{ fontWeight: 700, fontSize: '15px', color: 'var(--text-primary)' }}>Maintenance Mode</p>
              <p style={{ fontSize: '12.5px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                {maintenance ? '⚠️ Platform is currently in maintenance mode' : 'Platform is live and accepting bookings'}
              </p>
            </div>
          </div>
          <div onClick={() => setMaintenance(m => !m)}
            style={{ width: 46, height: 26, borderRadius: 13, background: maintenance ? 'var(--warning)' : 'var(--border)', cursor: 'pointer', position: 'relative', transition: 'var(--transition)', flexShrink: 0 }}>
            <div style={{ width: 20, height: 20, borderRadius: '50%', background: '#fff', position: 'absolute', top: 3, left: maintenance ? 23 : 3, transition: 'var(--transition)', boxShadow: 'var(--shadow-sm)' }} />
          </div>
        </div>
      </Card>

      {/* Platform Info */}
      <Card padding="24px" style={{ marginBottom: '18px' }}>
        <p style={{ fontWeight: 700, fontSize: '15px', color: 'var(--text-primary)', marginBottom: '18px' }}>🏢 Platform Information</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <Input label="Platform Name"  value={platform.name}    onChange={e => setPlatform(p => ({ ...p, name: e.target.value }))}    icon="🏷️" />
          <Input label="Support Email"  value={platform.email}   onChange={e => setPlatform(p => ({ ...p, email: e.target.value }))}   icon="✉️" />
          <Input label="Support Phone"  value={platform.phone}   onChange={e => setPlatform(p => ({ ...p, phone: e.target.value }))}   icon="📱" />
          <Input label="Office Address" value={platform.address} onChange={e => setPlatform(p => ({ ...p, address: e.target.value }))} icon="📍" />
        </div>
      </Card>

      {/* Fee Settings */}
      <Card padding="24px" style={{ marginBottom: '18px' }}>
        <p style={{ fontWeight: 700, fontSize: '15px', color: 'var(--text-primary)', marginBottom: '18px' }}>💰 Fee Configuration</p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
          <div>
            <label style={{ fontSize: '13px', fontWeight: 500, color: 'var(--text-primary)', display: 'block', marginBottom: '5px' }}>Platform Fee (%)</label>
            <input type="number" value={fees.platformFee} onChange={e => setFees(f => ({ ...f, platformFee: e.target.value }))}
              style={{ width: '100%', padding: '10px 14px', background: 'var(--bg-input)', border: '1.5px solid var(--border)', borderRadius: 'var(--radius-md)', color: 'var(--text-primary)', fontSize: '14px', outline: 'none' }} />
          </div>
          <div>
            <label style={{ fontSize: '13px', fontWeight: 500, color: 'var(--text-primary)', display: 'block', marginBottom: '5px' }}>GST Rate (%)</label>
            <input type="number" value={fees.gstRate} onChange={e => setFees(f => ({ ...f, gstRate: e.target.value }))}
              style={{ width: '100%', padding: '10px 14px', background: 'var(--bg-input)', border: '1.5px solid var(--border)', borderRadius: 'var(--radius-md)', color: 'var(--text-primary)', fontSize: '14px', outline: 'none' }} />
          </div>
          <div>
            <label style={{ fontSize: '13px', fontWeight: 500, color: 'var(--text-primary)', display: 'block', marginBottom: '5px' }}>Cancellation Fee (₹)</label>
            <input type="number" value={fees.cancellationFee} onChange={e => setFees(f => ({ ...f, cancellationFee: e.target.value }))}
              style={{ width: '100%', padding: '10px 14px', background: 'var(--bg-input)', border: '1.5px solid var(--border)', borderRadius: 'var(--radius-md)', color: 'var(--text-primary)', fontSize: '14px', outline: 'none' }} />
          </div>
        </div>
      </Card>

      {/* Notification Settings */}
      <Card padding="24px" style={{ marginBottom: '18px' }}>
        <p style={{ fontWeight: 700, fontSize: '15px', color: 'var(--text-primary)', marginBottom: '4px' }}>🔔 Email Notifications</p>
        <Toggle value={notifications.bookingConfirm}  onChange={() => setNotifications(n => ({ ...n, bookingConfirm:  !n.bookingConfirm }))}  label="Booking Confirmations" desc="Send email when booking is confirmed" />
        <Toggle value={notifications.paymentAlert}    onChange={() => setNotifications(n => ({ ...n, paymentAlert:    !n.paymentAlert }))}    label="Payment Alerts"        desc="Send email for payments & invoices" />
        <Toggle value={notifications.disputeAlert}    onChange={() => setNotifications(n => ({ ...n, disputeAlert:    !n.disputeAlert }))}    label="Dispute Alerts"        desc="Notify admin when dispute is raised" />
        <Toggle value={notifications.providerApproval} onChange={() => setNotifications(n => ({ ...n, providerApproval: !n.providerApproval }))} label="Provider Approvals"  desc="Notify when provider registers" />
        <Toggle value={notifications.weeklyReport}    onChange={() => setNotifications(n => ({ ...n, weeklyReport:    !n.weeklyReport }))}    label="Weekly Reports"        desc="Send weekly analytics summary" />
      </Card>

      <Button fullWidth size="lg" onClick={save}>Save All Settings</Button>

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}
