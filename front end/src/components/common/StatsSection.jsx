import React from 'react';

const STATS = [
  { value: '999+',  label: 'Trusted Customers & Growing' },
  { value: '200+',  label: 'Verified Professionals' },
  { value: '4.8★',  label: 'Average Rating' },
  { value: '8+',    label: 'Service Categories' },
];
export default function StatsSection() {
  return (
    <section style={{
      background: 'var(--bg-surface)',
      padding: '80px 40px',
    }}>

      {/* ── Section Title ─────────────────────── */}
      <div style={{
        textAlign: 'center',
        marginBottom: '60px',
      }}>
        <h2 style={{
          fontFamily: 'var(--font-display)',
          fontSize: '42px',
          fontWeight: 800,
          color: 'var(--text-primary)',
          letterSpacing: '-1px',
        }}>
          Service You Can Trust.
        </h2>
      </div>

      {/* ── Stats Grid ───────────────────────── */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '40px',
        flexWrap: 'wrap',
        maxWidth: '900px',
        margin: '0 auto',
      }}>
        {STATS.map((stat, index) => (
          <div key={index} style={{
            textAlign: 'center',
            padding: '20px',
          }}>

            {/* Value */}
            <p style={{
              fontFamily: 'var(--font-display)',
              fontSize: '52px',
              fontWeight: 800,
              color: 'var(--brand)',
              lineHeight: 1,
              marginBottom: '12px',
            }}>
              {stat.value}
            </p>

            {/* Label */}
            <p style={{
              fontSize: '15px',
              color: '#6B7280',
              fontWeight: 500,
              maxWidth: '160px',
              lineHeight: 1.5,
            }}>
              {stat.label}
            </p>

          </div>
        ))}
      </div>

    </section>
  );
}