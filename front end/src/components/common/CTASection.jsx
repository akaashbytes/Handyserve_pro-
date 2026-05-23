import React from "react";
export default function CTASection() {
  return (
    <section style={{
      background: 'linear-gradient(135deg, #1a1040 0%, #2d1b69 50%, #1a1040 100%)',
      padding: '100px 40px',
      textAlign: 'center',
      position: 'relative',
      overflow: 'hidden',
    }}>

      {/* ── Decorative Circles ───────────────── */}
      <div style={{
        position: 'absolute',
        top: '-60px',
        left: '10%',
        width: '300px',
        height: '300px',
        borderRadius: '50%',
        background: 'rgba(124,58,237,0.1)',
        pointerEvents: 'none',
      }} />

      <div style={{
        position: 'absolute',
        bottom: '-60px',
        right: '10%',
        width: '250px',
        height: '250px',
        borderRadius: '50%',
        background: 'rgba(124,58,237,0.08)',
        pointerEvents: 'none',
      }} />

      {/* ── Content ──────────────────────────── */}
      <div style={{
        position: 'relative',
        zIndex: 1,
        maxWidth: '650px',
        margin: '0 auto',
      }}>

        <h2 style={{
          fontFamily: 'var(--font-display)',
          fontSize: '48px',
          fontWeight: 800,
          color: '#ffffff',
          lineHeight: 1.15,
          marginBottom: '20px',
          letterSpacing: '-1px',
        }}>
          Ready to experience
          stress-free home service?
        </h2>

        <p style={{
          fontSize: '17px',
          color: 'rgba(255,255,255,0.65)',
          marginBottom: '40px',
          lineHeight: 1.7,
        }}>
          Let us handle the hard work.
          Book a pro and relax.
        </p>

        {/* Book Now Button */}
        <button
          onClick={() => window.location.href = '/login'}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '10px',
            padding: '18px 42px',
            background: 'var(--brand)',
            color: '#fff',
            border: 'none',
            borderRadius: '50px',
            fontSize: '17px',
            fontWeight: 700,
            cursor: 'pointer',
            transition: 'all 0.25s ease',
            boxShadow: '0 8px 30px rgba(124,58,237,0.5)',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.transform =
              'translateY(-3px)';
            e.currentTarget.style.boxShadow =
              '0 14px 40px rgba(124,58,237,0.6)';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.transform =
              'translateY(0)';
            e.currentTarget.style.boxShadow =
              '0 8px 30px rgba(124,58,237,0.5)';
          }}
        >
          Book Now →
        </button>

      </div>
    </section>
  );
}