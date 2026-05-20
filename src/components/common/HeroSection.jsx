import React from 'react';
export default function HeroSection() {
  return (
 <section id="home" style={{
  minHeight: '100vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  textAlign: 'center',
  padding: '0 20px',
  background: '#0F1117',
  position: 'relative',
  overflow: 'hidden',
}}>

  {/* Background Image */}
  <div style={{
    position: 'absolute',
    inset: 0,
    backgroundImage: `url('/hero-bg.jpg')`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    
    pointerEvents: 'none',
  }} />

  {/* Dark overlay */}
  <div style={{
  position: 'absolute',
  inset: 0,
  background: 'linear-gradient(135deg, #0F111766 0%, #1a104066 50%, #0F111766 100%)',
  pointerEvents: 'none',
  }} />
      {/* ── Decorative Circles ───────────────── */}
      <div style={{
        position: 'absolute',
        top: '-100px',
        right: '-100px',
        width: '500px',
        height: '500px',
        borderRadius: '50%',
        background: 'rgba(124, 58, 237, 0.08)',
        pointerEvents: 'none',
      }} />

      <div style={{
        position: 'absolute',
        bottom: '-80px',
        left: '-80px',
        width: '400px',
        height: '400px',
        borderRadius: '50%',
        background: 'rgba(124, 58, 237, 0.06)',
        pointerEvents: 'none',
      }} />

      <div style={{
        position: 'absolute',
        top: '40%',
        left: '10%',
        width: '200px',
        height: '200px',
        borderRadius: '50%',
        background: 'rgba(124, 58, 237, 0.04)',
        pointerEvents: 'none',
      }} />
      {/* ── Hero Content ─────────────────────── */}
      <div style={{
        position: 'relative',
        zIndex: 1,
        maxWidth: '750px',
      }}>

        {/* Badge */}
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          padding: '8px 18px',
          background: 'rgba(124, 58, 237, 0.15)',
          border: '1px solid rgba(124, 58, 237, 0.3)',
          borderRadius: '25px',
          marginBottom: '28px',
        }}>
          <span style={{ fontSize: '14px' }}>⚡</span>
          <span style={{
            color: 'rgba(255,255,255,0.85)',
            fontSize: '13px',
            fontWeight: 500,
          }}>
            Trusted by 10,000+ Happy Customers
          </span>
        </div>

        {/* Main Heading */}
        <h1 style={{
          fontFamily: 'var(--font-display)',
          fontSize: '62px',
          fontWeight: 800,
          color: '#ffffff',
          textShadow: '0 2px 20px rgba(0,0,0,0.8)',
          lineHeight: 1.1,
          marginBottom: '24px',
          letterSpacing: '-1.5px',
        }}>
          Premium Home Services,{' '}
        <span style={{ color: '#ffffff' }}>
         Simplified.
        </span>
        </h1>

        {/* Subtext */}
        <p style={{
          fontSize: '18px',
          color: 'rgba(255,255,255,0.65)',
          lineHeight: 1.7,
          marginBottom: '40px',
          maxWidth: '550px',
          margin: '0 auto 40px',
        }}>
          Book trusted professionals for your home
          in minutes. Quality work, transparent
          pricing, zero stress.
        </p>



        {/* Buttons */}
        <div style={{
          display: 'flex',
          gap: '16px',
          justifyContent: 'center',
          flexWrap: 'wrap',
          opacity: 0.8
        }}>


          {/* Book a Service */}
          <button
            onClick={() => window.location.href = '/login'}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '16px 32px',
              background: 'var(--brand)',
              color: '#fff',
              border: 'none',
              borderRadius: '50px',
              fontSize: '16px',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'var(--transition)',
              boxShadow: '0 8px 25px rgba(124,58,237,0.45)',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 12px 30px rgba(124,58,237,0.55)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 8px 25px rgba(124,58,237,0.45)';
            }}
          >
            📅 Book a Service
          </button>

          {/* Become a Professional */}
          <button
            onClick={() => window.location.href = '/login'}
            style={{
              padding: '16px 32px',
              background: 'transparent',
              color: '#fff',
              border: '2px solid rgba(255,255,255,0.3)',
              borderRadius: '50px',
              fontSize: '16px',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'var(--transition)',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.borderColor = '#fff';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.3)';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            Become a Professional
          </button>

        </div>
      </div>
    </section>
  );
}

   