import React from 'react';

export default function AboutSection() {
  return (
    <section id="about" style={{
      padding: '100px 40px',
      background: 'var(--bg-surface)',
      borderTop: '1px solid var(--border)',
    }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '60px', alignItems: 'center' }}>
        <div>
          <p style={{
            fontSize: '13px',
            fontWeight: 600,
            color: 'var(--brand)',
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            marginBottom: '12px',
          }}>
            About Us
          </p>
          <h2 style={{
            fontFamily: 'var(--font-display)',
            fontSize: '42px',
            fontWeight: 800,
            color: 'var(--text-primary)',
            letterSpacing: '-1px',
            marginBottom: '24px',
            lineHeight: 1.2
          }}>
            Trusted Excellence in <br />
            <span style={{ color: 'var(--brand)' }}>Home Services</span>
          </h2>
          <p style={{ fontSize: '16px', color: 'var(--text-secondary)', lineHeight: 1.8, marginBottom: '24px' }}>
            At HANDYSERVE, we bridge the gap between skilled professionals and homeowners. Founded in 2024, our mission is to provide hassle-free, reliable, and high-quality home maintenance solutions at your fingertips.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
            <div>
              <h4 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '8px', color: 'var(--text-primary)' }}>100% Verified</h4>
              <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>Every provider undergoes a rigorous background check and skill assessment.</p>
            </div>
            <div>
              <h4 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '8px', color: 'var(--text-primary)' }}>Fair Pricing</h4>
              <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>Transparent quotes and upfront pricing with no hidden surprises.</p>
            </div>
          </div>
        </div>
        <div style={{ position: 'relative' }}>
          <div style={{
            width: '100%',
            height: '450px',
            background: 'var(--brand-light)',
            borderRadius: 'var(--radius-xl)',
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '80px',
            boxShadow: 'var(--shadow-lg)'
          }}>
            🏠
          </div>
          <div style={{
            position: 'absolute',
            bottom: '-30px',
            left: '-30px',
            padding: '24px',
            background: 'var(--bg-card)',
            borderRadius: 'var(--radius-lg)',
            boxShadow: 'var(--shadow-md)',
            border: '1px solid var(--border)',
            maxWidth: '200px'
          }}>
            <p style={{ fontSize: '32px', fontWeight: 800, color: 'var(--brand)', marginBottom: '4px' }}>10k+</p>
            <p style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)' }}>Served across the city</p>
          </div>
        </div>
      </div>
    </section>
  );
}
