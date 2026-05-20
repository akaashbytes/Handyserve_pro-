import React from 'react';

const FOOTER_LINKS = [
  { label: 'Home',     href: '#home' },
  { label: 'Services', href: '#services' },
  { label: 'About',    href: '#about' },
  { label: 'Contact',  href: '#contact' },
];
export default function Footer() {
  return (
    <footer style={{
      background: '#0F1117',
      padding: '50px 40px 30px',
      borderTop: '1px solid rgba(255,255,255,0.08)',
    }}>

      {/* ── Top Row ──────────────────────────── */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '40px',
        flexWrap: 'wrap',
        gap: '20px',
      }}>

        {/* Logo */}
        <div style={{
          fontFamily: 'var(--font-display)',
          fontWeight: 800,
          fontSize: '20px',
          color: '#fff',
          letterSpacing: '-0.5px',
        }}>
          HANDY<span style={{
            color: 'var(--brand)'
          }}>SERVE</span>
        </div>

        {/* Links */}
        <div style={{
          display: 'flex',
          gap: '32px',
          flexWrap: 'wrap',
        }}>
          {FOOTER_LINKS.map(link => (
            <a key={link.label}
              href={link.href}
              style={{
                color: 'rgba(255,255,255,0.55)',
                fontSize: '14px',
                fontWeight: 500,
                textDecoration: 'none',
                transition: 'var(--transition)',
              }}
              onMouseEnter={e => {
                e.target.style.color = '#fff';
              }}
              onMouseLeave={e => {
                e.target.style.color =
                  'rgba(255,255,255,0.55)';
              }}
            >
              {link.label}
            </a>
          ))}
        </div>

      </div>

      {/* ── Divider ──────────────────────────── */}
      <div style={{
        height: '1px',
        background: 'rgba(255,255,255,0.08)',
        marginBottom: '28px',
      }} />

      {/* ── Bottom Row ───────────────────────── */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <p style={{
          color: 'rgba(255,255,255,0.35)',
          fontSize: '13px',
        }}>
          © 2026 HANDYSERVE. All rights reserved.
        </p>
      </div>

    </footer>
  );
}