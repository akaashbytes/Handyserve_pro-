import React from 'react';

const SERVICES = [
  {
    icon: '🔧',
    title: 'Plumbing',
    desc: 'Leak repairs, pipe installation, drain cleaning, and complete plumbing solutions for your home.',
  },
  {
    icon: '⚡',
    title: 'Electrical',
    desc: 'Wiring, switch repairs, lighting installation, and safe electrical work by certified professionals.',
  },
  {
    icon: '🧹',
    title: 'Cleaning',
    desc: 'Deep home cleaning, kitchen sanitation, bathroom scrubbing, and post-renovation cleanup.',
  },
  {
    icon: '🔨',
    title: 'Appliance Repair',
    desc: 'AC servicing, refrigerator repair, washing machine fixes, and all home appliance care.',
  },
  {
    icon: '🐛',
    title: 'Pest Control',
    desc: 'Termite treatment, mosquito control, cockroach elimination, and safe pest-free living.',
  },
  {
    icon: '🎨',
    title: 'Painting',
    desc: 'Interior and exterior painting, texture work, and complete home makeover solutions.',
  },
];
export default function ServicesSection() {
  return (
    <section id="services" style={{
      background: 'var(--bg-base)',
      padding: '100px 40px',
    }}>

      {/* ── Section Header ───────────────────── */}
      <div style={{
        textAlign: 'center',
        marginBottom: '60px',
      }}>

        <p style={{
          fontSize: '13px',
          fontWeight: 600,
          color: 'var(--brand)',
          letterSpacing: '0.15em',
          textTransform: 'uppercase',
          marginBottom: '12px',
        }}>
          What We Offer
        </p>

        <h2 style={{
          fontFamily: 'var(--font-display)',
          fontSize: '42px',
          fontWeight: 800,
          color: 'var(--text-primary)',
          letterSpacing: '-1px',
          marginBottom: '16px',
        }}>
          Our Services
        </h2>

        <p style={{
          fontSize: '16px',
          color: 'var(--text-secondary)',
          maxWidth: '500px',
          margin: '0 auto',
          lineHeight: 1.7,
        }}>
          Expert solutions for every corner of
          your home, delivered by verified
          professionals.
        </p>

      </div>

      {/* ── Services Grid ─────────────────────── */}
      <div style={{
        display: 'grid',
        gridTemplateColumns:
          'repeat(3, 1fr)',
        gap: '24px',
        maxWidth: '1100px',
        margin: '0 auto',
      }}>
        {SERVICES.map((service, index) => (
          <div key={index}
            style={{
              background: 'var(--bg-card)',
              borderRadius: '16px',
              padding: '32px 28px',
              border: '1px solid var(--border)',
              cursor: 'pointer',
              transition: 'all 0.25s ease',
            }}
            onClick={() => window.location.href = '/login'}
            onMouseEnter={e => {

              e.currentTarget.style.transform =
                'translateY(-4px)';
              e.currentTarget.style.boxShadow =
                '0 12px 40px var(--brand-glow)';
              e.currentTarget.style.borderColor =
                'var(--brand)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform =
                'translateY(0)';
              e.currentTarget.style.boxShadow =
                'none';
              e.currentTarget.style.borderColor =
                'var(--border)';
            }}
          >

            {/* Icon */}
            <div style={{
              width: '52px',
              height: '52px',
              borderRadius: '12px',
              background: 'var(--brand-light)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '24px',
              marginBottom: '20px',
            }}>
              {service.icon}
            </div>

            {/* Title */}
            <h3 style={{
              fontFamily: 'var(--font-display)',
              fontSize: '18px',
              fontWeight: 700,
              color: 'var(--text-primary)',
              marginBottom: '10px',
            }}>
              {service.title}
            </h3>

            {/* Description */}
            <p style={{
              fontSize: '14px',
              color: 'var(--text-secondary)',
              lineHeight: 1.7,
            }}>
              {service.desc}
            </p>

          </div>
        ))}
      </div>

    </section>
  );
}