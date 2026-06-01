import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Avatar, Badge, Button } from './UI';

export default function ProfileDrawer({ isOpen, onClose }) {
  const { user, logout } = useAuth();


  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div 
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.4)',
          backdropFilter: 'blur(4px)',
          zIndex: 999,
          animation: 'fadeIn 0.2s ease'
        }}
        onClick={onClose}
      />

      {/* Drawer */}
      <div 
        style={{
          position: 'fixed',
          right: 0,
          top: 0,
          bottom: 0,
          width: '420px',
          background: 'var(--bg-base)',
          boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
          zIndex: 1000,
          display: 'flex',
          flexDirection: 'column',
          animation: 'slideInRight 0.3s ease',
          '@media (max-width: 600px)': {
            width: '100%'
          }
        }}
      >
        {/* Header */}
        <div style={{
          padding: '20px 24px',
          borderBottom: '1px solid var(--border)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <h2 style={{
            fontSize: '18px',
            fontWeight: 700,
            color: 'var(--text-primary)',
            fontFamily: 'var(--font-display)'
          }}>
            My Profile
          </h2>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '22px',
              cursor: 'pointer',
              color: 'var(--text-muted)',
              padding: 0,
              width: 32,
              height: 32,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 'var(--radius-md)',
              transition: 'var(--transition)'
            }}
            onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-elevated)'}
            onMouseLeave={e => e.currentTarget.style.background = 'none'}
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '24px' }}>
          {/* Profile Header */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '28px' }}>
            <Avatar initials={user?.avatar} size={56} />
            <div style={{ flex: 1 }}>
              <h3 style={{
                fontSize: '16px',
                fontWeight: 700,
                color: 'var(--text-primary)',
                marginBottom: '4px'
              }}>
                {user?.name}
              </h3>
              <p style={{ fontSize: '12.5px', color: 'var(--text-muted)', marginBottom: '8px' }}>
                {user?.email}
              </p>
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                <Badge color="brand" style={{ textTransform: 'capitalize', fontSize: '11px' }}>
                  {user?.role}
                </Badge>
                {user?.verified && <Badge color="success" style={{ fontSize: '11px' }}>✓ Verified</Badge>}
              </div>
            </div>
          </div>

          {/* Info Section */}
          <div style={{ marginBottom: '24px' }}>
            <p style={{
              fontSize: '12px',
              fontWeight: 600,
              color: 'var(--text-muted)',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              marginBottom: '14px'
            }}>
              Contact Information
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {[
                { icon: '📧', label: 'Email', value: user?.email },
                { icon: '📱', label: 'Phone', value: user?.phone || 'Not set' },
                { icon: '🏠', label: 'Address', value: user?.address || 'Not set' }
              ].map((item, i) => (
                <div key={i} style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                  <div style={{
                    width: 36,
                    height: 36,
                    borderRadius: 'var(--radius-md)',
                    background: 'var(--bg-elevated)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '16px',
                    flexShrink: 0
                  }}>
                    {item.icon}
                  </div>
                  <div>
                    <p style={{
                      fontSize: '11px',
                      color: 'var(--text-muted)',
                      fontWeight: 600,
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      marginBottom: '2px'
                    }}>
                      {item.label}
                    </p>
                    <p style={{
                      fontSize: '13.5px',
                      color: 'var(--text-primary)',
                      fontWeight: 500
                    }}>
                      {item.value}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Stats */}
          {user?.role === 'provider' && (
            <div style={{ marginBottom: '24px' }}>
              <p style={{
                fontSize: '12px',
                fontWeight: 600,
                color: 'var(--text-muted)',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                marginBottom: '14px'
              }}>
                Performance
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                {[
                  { label: 'Jobs Completed', value: '47' },
                  { label: 'Avg Rating', value: '4.8 ⭐' }
                ].map((stat, i) => (
                  <div key={i} style={{
                    background: 'var(--bg-elevated)',
                    padding: '12px',
                    borderRadius: 'var(--radius-md)',
                    textAlign: 'center'
                  }}>
                    <p style={{
                      fontSize: '11px',
                      color: 'var(--text-muted)',
                      marginBottom: '6px',
                      fontWeight: 600
                    }}>
                      {stat.label}
                    </p>
                    <p style={{
                      fontSize: '16px',
                      fontWeight: 700,
                      color: 'var(--brand)'
                    }}>
                      {stat.value}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {user?.role === 'customer' && (
            <div style={{ marginBottom: '24px' }}>
              <p style={{
                fontSize: '12px',
                fontWeight: 600,
                color: 'var(--text-muted)',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                marginBottom: '14px'
              }}>
                Activity
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                {[
                  { label: 'Total Bookings', value: '12' },
                  { label: 'Total Spent', value: '₹8.4k' }
                ].map((stat, i) => (
                  <div key={i} style={{
                    background: 'var(--bg-elevated)',
                    padding: '12px',
                    borderRadius: 'var(--radius-md)',
                    textAlign: 'center'
                  }}>
                    <p style={{
                      fontSize: '11px',
                      color: 'var(--text-muted)',
                      marginBottom: '6px',
                      fontWeight: 600
                    }}>
                      {stat.label}
                    </p>
                    <p style={{
                      fontSize: '16px',
                      fontWeight: 700,
                      color: 'var(--brand)'
                    }}>
                      {stat.value}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div style={{
          borderTop: '1px solid var(--border)',
          padding: '16px 24px',
          display: 'flex',
          gap: '10px'
        }}>
          <Button size="sm" variant="outline" fullWidth onClick={onClose}>
            Close
          </Button>
          <Button size="sm" variant="danger" fullWidth onClick={() => {
            logout();
            onClose();
          }}>
            Logout
          </Button>
        </div>

        <style>{`
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          @keyframes slideInRight {
            from { transform: translateX(100%); }
            to { transform: translateX(0); }
          }
        `}</style>
      </div>
    </>
  );
}
