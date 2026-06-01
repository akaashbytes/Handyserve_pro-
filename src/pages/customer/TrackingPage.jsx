import React, { useEffect, useMemo, useState } from 'react';
import L from 'leaflet';
import { useAuth } from '../../components/context/AuthContext';
import { Card, Button, EmptyState } from '../../components/common/UI';
import { getIcon } from '../../components/common/Icons';
import { CircleMarker, MapContainer, Polyline, TileLayer, Tooltip, useMap } from 'react-leaflet';
import { haversineDistanceKm } from '../../lib/geo';

const DEFAULT_CENTER = [13.0827, 80.2707];

function FitTrackingBounds({ positions }) {
  const map = useMap();
  useEffect(() => {
    if (!map || !map.getContainer()) return;
    const valid = positions.filter((p) => p && typeof p[0] === 'number');
    if (valid.length === 0) return;
    if (valid.length === 1) {
      map.setView(valid[0], 14, { animate: false });
      return;
    }
    map.fitBounds(L.latLngBounds(valid), { padding: [28, 28], maxZoom: 15, animate: false });
  }, [map, positions]);
  return null;
}

export default function TrackingPage() {
  const { bookings, user } = useAuth();
  const activeBooking = bookings.find(b => ['Requested', 'Accepted', 'In Progress'].includes(b.status));

  const [chatMsg, setChatMsg] = useState('');
  const [messages, setMessages] = useState([
    { id: 1, sender: 'provider', text: `Hello! I have received your request for ${activeBooking?.service || 'service'}.`, time: '9:15 AM' },
    { id: 2, sender: 'customer', text: 'Great, thank you! I am at my location.', time: '9:18 AM' },
  ]);

  useEffect(() => {
    const handleWsChat = (e) => {
      const msg = e.detail;
      if (String(msg.bookingId) === String(activeBooking?.id)) {
        setMessages(m => {
          const exists = m.some(old => old.text === msg.text && old.sender === msg.sender && old.time === msg.time);
          if (exists) return m;
          return [...m, { id: msg.id || Date.now(), sender: msg.sender, text: msg.text, time: msg.time }];
        });
      }
    };
    window.addEventListener('ws:chat:message', handleWsChat);
    return () => window.removeEventListener('ws:chat:message', handleWsChat);
  }, [activeBooking?.id]);

  const customerPosition = useMemo(() => {
    if (activeBooking && typeof activeBooking.customerLatitude === 'number' && typeof activeBooking.customerLongitude === 'number') {
      return [activeBooking.customerLatitude, activeBooking.customerLongitude];
    }
    if (typeof user?.latitude === 'number' && typeof user?.longitude === 'number') {
      return [user.latitude, user.longitude];
    }
    return DEFAULT_CENTER;
  }, [activeBooking, user?.latitude, user?.longitude]);

  const providerLive = useMemo(() => {
    if (!activeBooking || typeof activeBooking.providerLatitude !== 'number' || typeof activeBooking.providerLongitude !== 'number') return null;
    return [activeBooking.providerLatitude, activeBooking.providerLongitude];
  }, [activeBooking]);

  const showProviderOnMap = Boolean(activeBooking && ['Accepted', 'In Progress'].includes(activeBooking.status) && providerLive);
  const providerDistanceKm = useMemo(() => {
    if (!showProviderOnMap || !providerLive) return null;
    return haversineDistanceKm(customerPosition, providerLive);
  }, [customerPosition, providerLive, showProviderOnMap]);
  const providerEtaMins = providerDistanceKm != null ? Math.max(3, Math.round(providerDistanceKm * 6)) : null;
  const mapPositions = useMemo(() => (showProviderOnMap && providerLive ? [customerPosition, providerLive] : [customerPosition]), [customerPosition, providerLive, showProviderOnMap]);

  if (!activeBooking) {
    return (
      <div style={{ padding: '32px 36px' }}>
        <EmptyState icon="📍" title="No Active Tracking" desc="You don't have any bookings currently in progress. Book a service to see live tracking." />
      </div>
    );
  }

  const steps = [
    { label: 'Requested',   icon: '📋', done: true, active: activeBooking.status === 'Requested' },
    { label: 'Accepted',    icon: '✅', done: ['Accepted', 'In Progress', 'Completed'].includes(activeBooking.status), active: activeBooking.status === 'Accepted' },
    { label: 'On the way',  icon: '🚗', done: ['In Progress', 'Completed'].includes(activeBooking.status), active: false },
    { label: 'In Progress', icon: '🔧', done: activeBooking.status === 'Completed', active: activeBooking.status === 'In Progress' },
    { label: 'Completed',   icon: '🎉', done: activeBooking.status === 'Completed' },
  ];

  const sendMsg = () => {
    if (!chatMsg.trim()) return;
    const currentMsg = chatMsg.trim();
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const payload = {
      type: 'chat:message',
      bookingId: activeBooking.id,
      sender: 'customer',
      text: currentMsg,
      time: timeStr
    };

    if (window.hsWebSocket && window.hsWebSocket.readyState === WebSocket.OPEN) {
      window.hsWebSocket.send(JSON.stringify(payload));
    } else {
      // Local fallback
      setMessages(m => [...m, { id: Date.now(), sender: 'customer', text: currentMsg, time: timeStr }]);
      
      setTimeout(() => {
        let reply = "Got it, I'll take note of that.";
        const lower = currentMsg.toLowerCase();
        
        if (lower.includes('where') || lower.includes('late') || lower.includes('eta')) {
          reply = "I'm currently on my way! Should be there in about 5-10 minutes. Traffic is a bit heavy.";
        } else if (lower.includes('hello') || lower.includes('hi ') || lower === 'hi' || lower === 'hey') {
          reply = "Hello! I have all my tools ready and I'm heading to your location now.";
        } else if (lower.includes('call') || lower.includes('number')) {
          reply = "I'll give you a call as soon as I reach your gate.";
        } else if (lower.includes('thanks') || lower.includes('thank you')) {
          reply = "You're welcome! See you soon.";
        } else if (lower.includes('cancel')) {
          reply = "If you need to cancel, please do it from the Bookings page. Let me know if I can help!";
        }

        setMessages(m => [...m, { id: Date.now() + 1, sender: 'provider', text: reply, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]);
      }, 1200);
    }
    
    setChatMsg('');
  };

  return (
    <div className="animate-fade-in-up" style={{ padding: '32px 36px', maxWidth: '1000px' }}>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '24px', fontWeight: 800, color: 'var(--text-primary)' }}>Live Job Tracking</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>Booking #{activeBooking.id} · {activeBooking.service} · {activeBooking.providerName}</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: '20px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          {/* Status Steps */}
          <Card padding="22px">
            <p style={{ fontWeight: 700, marginBottom: '22px', fontSize: '15px', color: 'var(--text-primary)' }}>Job Status</p>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              {steps.map((s, i) => (
                <React.Fragment key={s.label}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <div style={{ width: 44, height: 44, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', background: s.active ? 'var(--brand-light)' : s.done ? 'var(--success-light)' : 'var(--bg-elevated)', border: `2.5px solid ${s.active ? 'var(--brand)' : s.done ? 'var(--success)' : 'var(--border)'}`, marginBottom: '8px', animation: s.active ? 'pulse 2s infinite' : 'none' }}>{getIcon(s.icon, { size: 18 })}</div>
                    <p style={{ fontSize: '10.5px', color: s.active ? 'var(--brand)' : s.done ? 'var(--success)' : 'var(--text-muted)', fontWeight: s.active ? 700 : 400, textAlign: 'center', whiteSpace: 'nowrap' }}>{s.label}</p>
                  </div>
                  {i < steps.length - 1 && <div style={{ flex: 1, height: 2.5, background: steps[i+1].done || s.done ? 'var(--success)' : 'var(--border)', margin: '0 4px', marginTop: '-20px', borderRadius: 2 }} />}
                </React.Fragment>
              ))}
            </div>
          </Card>

          <Card padding="0" style={{ overflow: 'hidden', height: 320, borderRadius: 20 }}>
            <div style={{ height: '100%', position: 'relative' }}>
              <MapContainer center={customerPosition} zoom={13} scrollWheelZoom zoomAnimation={false} style={{ width: '100%', height: '100%' }}>
                <TileLayer attribution="&copy; OpenStreetMap" url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <FitTrackingBounds positions={mapPositions} />
                {showProviderOnMap && providerLive && (
                  <Polyline positions={[providerLive, customerPosition]} pathOptions={{ color: 'var(--brand)', weight: 4, opacity: 0.65 }} />
                )}
                {showProviderOnMap && providerLive && (
                  <CircleMarker center={providerLive} radius={10} pathOptions={{ color: '#0EA5E9', fillColor: '#0EA5E9', fillOpacity: 0.85 }}>
                    <Tooltip permanent direction="top" offset={[0, -8]}>Provider (live)</Tooltip>
                  </CircleMarker>
                )}
                <CircleMarker center={customerPosition} radius={10} pathOptions={{ color: 'var(--brand)', fillColor: 'var(--brand)', fillOpacity: 0.85 }}>
                  <Tooltip permanent direction="top" offset={[0, -8]}>You</Tooltip>
                </CircleMarker>
              </MapContainer>
              <div style={{ position: 'absolute', right: 12, top: 12, maxWidth: 200, background: 'var(--bg-card)', padding: '10px 12px', borderRadius: 12, boxShadow: 'var(--shadow-md)', border: '1px solid var(--border)' }}>
                {!showProviderOnMap && <p style={{ fontSize: 12, color: 'var(--text-secondary)', margin: 0 }}>Live provider location appears after they accept.</p>}
                {showProviderOnMap && providerDistanceKm != null && (
                  <>
                    <p style={{ fontWeight: 700, color: 'var(--brand)', fontSize: 13, margin: 0 }}>{providerDistanceKm.toFixed(1)} km away</p>
                    <p style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 4 }}>ETA ~{providerEtaMins} min</p>
                  </>
                )}
              </div>
            </div>
          </Card>

          {/* Safety */}
          <Card padding="18px 20px" style={{ background: 'var(--brand-light)', borderColor: '#DDD6FE' }}>
            <p style={{ display: 'flex', alignItems: 'center', gap: 8, fontWeight: 700, marginBottom: '10px', color: 'var(--brand)', fontSize: '14px' }}>{getIcon('🛡️', { size: 16 })}Safety Guidelines</p>
            {['Verify provider ID before allowing entry', 'Keep valuables secured during service', 'Do not make advance payments in cash', 'Rate your experience after completion'].map((tip, i) => (
              <p key={i} style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '5px', display: 'flex', gap: '7px' }}>
                <span style={{ color: 'var(--brand)', fontWeight: 700 }}>·</span>{tip}
              </p>
            ))}
          </Card>
        </div>

        {/* Chat */}
        <Card padding="0" style={{ display: 'flex', flexDirection: 'column', height: '580px' }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--brand-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '15px', fontWeight: 700, color: 'var(--brand)' }}>{activeBooking.providerName.split(' ').map(n=>n[0]).join('')}</div>
            <div>
              <p style={{ fontWeight: 700, fontSize: '14px', color: 'var(--text-primary)' }}>{activeBooking.providerName}</p>
              <p style={{ fontSize: '12px', color: 'var(--success)', fontWeight: 500 }}>● Online</p>
            </div>
          </div>
          <div style={{ flex: 1, overflowY: 'auto', padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px', background: 'var(--bg-base)' }}>
            {messages.map(m => (
              <div key={m.id} style={{ display: 'flex', justifyContent: m.sender === 'customer' ? 'flex-end' : 'flex-start' }}>
                <div style={{ maxWidth: '78%', padding: '10px 14px', borderRadius: m.sender === 'customer' ? '16px 16px 4px 16px' : '16px 16px 16px 4px', background: m.sender === 'customer' ? 'var(--brand)' : 'var(--bg-card)', color: m.sender === 'customer' ? '#fff' : 'var(--text-primary)', fontSize: '13.5px', boxShadow: 'var(--shadow-xs)', border: m.sender !== 'customer' ? '1px solid var(--border)' : 'none' }}>
                  <p style={{ lineHeight: 1.5 }}>{m.text}</p>
                  <p style={{ fontSize: '11px', opacity: 0.65, marginTop: '4px', textAlign: 'right' }}>{m.time}</p>
                </div>
              </div>
            ))}
          </div>
          <div style={{ padding: '12px 14px', borderTop: '1px solid var(--border)', display: 'flex', gap: '8px', background: 'var(--bg-card)' }}>
            <input value={chatMsg} onChange={e => setChatMsg(e.target.value)} onKeyDown={e => e.key === 'Enter' && sendMsg()} placeholder="Type a message..."
              style={{ flex: 1, padding: '10px 14px', background: 'var(--bg-input)', border: '1.5px solid var(--border)', borderRadius: 'var(--radius-md)', color: 'var(--text-primary)', fontSize: '13.5px', outline: 'none' }} />
            <Button onClick={sendMsg} style={{ padding: '10px 16px' }}>Send</Button>
          </div>
        </Card>
      </div>
    </div>
  );
}