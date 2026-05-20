import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Card, Button } from '../common/UI';
import { LOCATIONS } from '../../data/mockData';

export default function LocationModal({ isOpen, onClose }) {
  const { user, updateUser } = useAuth();

  const [formData, setFormData] = useState({
    state: user?.state || '',
    city: user?.city || '',
    area: user?.location || ''
  });

  const states = Object.keys(LOCATIONS);
  const cities = formData.state ? Object.keys(LOCATIONS[formData.state] || {}) : [];
  const areas = (formData.state && formData.city) ? (LOCATIONS[formData.state]?.[formData.city] || []) : [];


  useEffect(() => {
    if (isOpen) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setFormData({
        state: user?.state || '',
        city: user?.city || '',
        area: user?.location || ''
      });
    }
  }, [isOpen, user]);

  if (!isOpen) return null;

  const handleSave = () => {
    if (!formData.state || !formData.city || !formData.area) {
        alert('Please select all location fields.');
        return;
    }
    updateUser({ 
      ...user, 
      state: formData.state,
      city: formData.city, 
      location: formData.area 
    });
    onClose();
  };

  const selectStyle = {
    width: '100%',
    padding: '12px 14px',
    background: 'var(--bg-input)',
    border: '1.5px solid var(--border)',
    borderRadius: 'var(--radius-md)',
    color: 'var(--text-primary)',
    fontSize: '14px',
    outline: 'none',
    cursor: 'pointer',
    fontFamily: 'var(--font-body)'
  };

  const labelStyle = {
    fontSize: '13px',
    fontWeight: 600,
    color: 'var(--text-secondary)',
    marginBottom: '6px',
    display: 'block'
  };

  return (
    <div 
      style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000, padding: '20px' }}
      onClick={() => { if (user?.city) onClose(); }}
    >
      <Card padding="32px" style={{ width: '100%', maxWidth: '400px', animation: 'fadeInUp 0.3s ease' }} onClick={e => e.stopPropagation()}>
        <div style={{ marginBottom: '24px' }}>
            <h3 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '4px' }}>Set Your Location</h3>
            <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>Find professionals in your area.</p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '28px' }}>
            <div>
                <label style={labelStyle}>Select State</label>
                <select 
                    style={selectStyle} 
                    value={formData.state} 
                    onChange={(e) => setFormData({ state: e.target.value, city: '', area: '' })}
                >
                    <option value="">Choose State</option>
                    {states.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
            </div>

            <div>
                <label style={labelStyle}>Select City</label>
                <select 
                    style={selectStyle} 
                    disabled={!formData.state}
                    value={formData.city} 
                    onChange={(e) => setFormData({ ...formData, city: e.target.value, area: '' })}
                >
                    <option value="">Choose City</option>
                    {cities.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
            </div>

            <div>
                <label style={labelStyle}>Select Area</label>
                <select 
                    style={selectStyle} 
                    disabled={!formData.city}
                    value={formData.area} 
                    onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                >
                    <option value="">Choose Area</option>
                    {areas.map(a => <option key={a} value={a}>{a}</option>)}
                </select>
            </div>
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
            {user?.city && <Button variant="ghost" fullWidth onClick={onClose}>Cancel</Button>}
            <Button fullWidth onClick={handleSave}>Save Location</Button>
        </div>
      </Card>
    </div>
  );
}

