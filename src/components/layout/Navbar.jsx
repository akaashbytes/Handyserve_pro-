import React, { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';


const NAV_LINKS = [
  { label: 'Home',     href: '#home' },
  { label: 'Services', href: '#services' },
  { label: 'About',    href: '#about' },
  { label: 'Contact',  href: '#contact' },
];
export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const { toggleTheme, isDark } = useTheme();
  const { isAuthenticated, user } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  return (
    <nav style={{
      position: 'fixed',
      top: 0, left: 0, right: 0,
      zIndex: 1000,
      padding: '0 40px',
      height: '70px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      background: scrolled
        ? 'rgba(15, 17, 23, 0.95)'
        : 'transparent',
      backdropFilter: scrolled ? 'blur(10px)' : 'none',
      borderBottom: scrolled
        ? '1px solid rgba(255,255,255,0.08)'
        : 'none',
      transition: 'all 0.3s ease',
    }}>

      {/* ── Logo ─────────────────────────────── */}
      <div style={{
        fontFamily: 'var(--font-display)',
        fontWeight: 800,
        fontSize: '22px',
        color: '#fff',
        letterSpacing: '-0.5px',
      }}>
        HANDY<span style={{ color: 'var(--brand)' }}>SERVE</span>
      </div>

      {/* ── Nav Links ────────────────────────── */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '36px',
      }}>
        {NAV_LINKS.map(link => (
          <a key={link.label} href={link.href}
            style={{
              color: 'rgba(255,255,255,0.8)',
              fontSize: '14px',
              fontWeight: 500,
              transition: 'var(--transition)',
              textDecoration: 'none',
            }}
            onMouseEnter={e => {
              e.target.style.color = '#fff';
            }}
            onMouseLeave={e => {
              e.target.style.color = 'rgba(255,255,255,0.8)';
            }}
          >
            {link.label}
          </a>
        ))}

        
        {/* Theme Toggle */}
        <button 
          onClick={toggleTheme}
          style={{
            background: 'rgba(255,255,255,0.1)',
            border: '1px solid rgba(255,255,255,0.2)',
            color: '#fff',
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            fontSize: '18px',
            padding: 0
          }}
          title={`Switch to ${isDark ? 'light' : 'dark'} mode`}
        >
          {isDark ? '☀️' : '🌙'}
        </button>

      </div>

      {/* ── Login Button ─────────────────────── */}
      <button
        onClick={() => window.location.href = isAuthenticated ? `/${user?.role}` : '/login'}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '10px 22px',
          background: 'var(--brand)',
          color: '#fff',
          border: 'none',
          borderRadius: '25px',
          fontSize: '14px',
          fontWeight: 600,
          cursor: 'pointer',
          transition: 'var(--transition)',
          boxShadow: '0 4px 15px rgba(124,58,237,0.4)',
        }}
        onMouseEnter={e => {
          e.currentTarget.style.background = 'var(--brand-dark)';
          e.currentTarget.style.transform = 'translateY(-1px)';
        }}
        onMouseLeave={e => {
          e.currentTarget.style.background = 'var(--brand)';
          e.currentTarget.style.transform = 'translateY(0)';
        }}
      >
        {isAuthenticated ? '🏠 Dashboard' : '👤 Login'}
      </button>

    </nav>
  );
}