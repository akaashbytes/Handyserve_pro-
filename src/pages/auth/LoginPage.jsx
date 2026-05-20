import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../components/context/AuthContext';
import { useTheme } from '../../components/context/ThemeContext';
export default function LoginPage() {
  const { login } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const validate = () => {
    const e = {};
    if (!email.trim()) {
      e.email = 'Email is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      e.email = 'Enter a valid email address.';
    }
    if (!password) {
      e.password = 'Password is required.';
    } else if (password.length < 6) {
      e.password = 'Minimum 6 characters.';
    }
    return e;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }
    setErrors({});
    setLoading(true);
    try {
      await new Promise(r => setTimeout(r, 700));
      const u = login(email.trim(), password);
      if (u && u.role) {
        navigate(`/${u.role}`, { replace: true });
      } else {
        navigate('/');
      }
    } catch (err) {
      setErrors({ form: err.message });
    } finally {
      setLoading(false);
    }
  };
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      background: 'var(--bg-base)',
      transition: 'background 0.3s ease',
    }}>

      {/* ── Left Brand Panel ───────────────── */}
      <div style={{
        flex: '0 0 44%',
        background: 'linear-gradient(155deg, #7C3AED 0%, #5B21B6 55%, #4C1D95 100%)',
        display: 'flex',
        flexDirection: 'column',
        padding: '48px 52px',
        position: 'relative',
        overflow: 'hidden',
      }}>

        {/* Decorative circles */}
        <div style={{
          position: 'absolute',
          top: -80, right: -80,
          width: 280, height: 280,
          borderRadius: '50%',
          background: 'rgba(255,255,255,0.06)',
          pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute',
          bottom: 60, left: -60,
          width: 200, height: 200,
          borderRadius: '50%',
          background: 'rgba(255,255,255,0.05)',
          pointerEvents: 'none',
        }} />

        {/* Logo */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          marginBottom: '64px',
        }}>
          <div style={{
            width: 40, height: 40,
            borderRadius: '11px',
            background: 'rgba(255,255,255,0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '20px',
          }}>🔧</div>
          <span style={{
            fontFamily: 'var(--font-display)',
            fontWeight: 800,
            fontSize: '20px',
            color: '#fff',
          }}>HandyServe Pro</span>
        </div>

        {/* Hero text */}
        <div style={{ flex: 1 }}>
          <h1 style={{
            fontFamily: 'var(--font-display)',
            fontSize: '38px',
            fontWeight: 800,
            color: '#fff',
            lineHeight: 1.2,
            marginBottom: '16px',
            letterSpacing: '-0.5px',
          }}>
            Your home,<br />cared for.
          </h1>
          <p style={{
            color: 'rgba(255,255,255,0.72)',
            fontSize: '15px',
            lineHeight: 1.75,
            maxWidth: '300px',
            marginBottom: '40px',
          }}>
            Book trusted professionals for every
            home service — from plumbing to
            deep cleaning.
          </p>

          {/* Feature list */}
          {[
            '200+ verified professionals',
            'Real-time job tracking',
            'Secure UPI & card payments',
            'Rated 4.8 by 10,000+ customers',
          ].map((t, i) => (
            <div key={i} style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              marginBottom: '14px',
            }}>
              <div style={{
                width: 22, height: 22,
                borderRadius: '50%',
                background: 'rgba(255,255,255,0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '11px',
                color: '#fff',
                fontWeight: 800,
                flexShrink: 0,
              }}>✓</div>
              <p style={{
                color: 'rgba(255,255,255,0.85)',
                fontSize: '14px',
              }}>{t}</p>
            </div>
          ))}
        </div>

        {/* Service chips */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '8px',
          marginTop: '40px',
        }}>
          {[
            '🔧 Plumbing',
            '⚡ Electrical',
            '🧹 Cleaning',
            '🔨 Appliance',
            '🐛 Pest Control',
          ].map(s => (
            <span key={s} style={{
              padding: '5px 12px',
              borderRadius: '20px',
              background: 'rgba(255,255,255,0.12)',
              color: 'rgba(255,255,255,0.9)',
              fontSize: '12px',
              fontWeight: 500,
            }}>{s}</span>
          ))}
        </div>
      </div>

      {/* ── Right Login Form ──────────────── */}
      <div style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px 48px',
        position: 'relative',
      }}>

        {/* Theme toggle */}
        <button onClick={toggleTheme}
          style={{
            position: 'absolute',
            top: 24, right: 28,
            width: 40, height: 40,
            borderRadius: '50%',
            background: 'var(--bg-elevated)',
            border: '1.5px solid var(--border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '18px',
            cursor: 'pointer',
          }}>
          {isDark ? '☀️' : '🌙'}
        </button>

        <div style={{
          width: '100%',
          maxWidth: '400px',
        }}>
          <Link to="/" style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            color: 'var(--text-secondary)',
            fontSize: '13.5px',
            fontWeight: 500,
            marginBottom: '24px',
            textDecoration: 'none',
            transition: 'var(--transition)'
          }}
          onMouseEnter={e => e.currentTarget.style.color = 'var(--text-primary)'}
          onMouseLeave={e => e.currentTarget.style.color = 'var(--text-secondary)'}
          >
            ← Back to Home
          </Link>

          <h2 style={{
            fontFamily: 'var(--font-display)',
            fontSize: '28px',
            fontWeight: 800,
            color: 'var(--text-primary)',
            marginBottom: '6px',
          }}>Welcome back</h2>
          <p style={{
            color: 'var(--text-secondary)',
            marginBottom: '32px',
            fontSize: '14px',
          }}>
            Sign in to continue to HandyServe Pro
          </p>

          {/* Form error */}
          {errors.form && (
            <div style={{
              padding: '12px 16px',
              background: 'var(--danger-light)',
              border: '1px solid var(--danger)',
              borderRadius: '10px',
              marginBottom: '20px',
              display: 'flex',
              gap: '10px',
              alignItems: 'center',
            }}>
              <span>⚠️</span>
              <p style={{
                fontSize: '13.5px',
                color: 'var(--danger)',
                fontWeight: 500,
              }}>{errors.form}</p>
            </div>
          )}

          {/* Form */}
          <form
            onSubmit={handleLogin}
            noValidate
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '18px',
            }}>

            {/* Email */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '5px',
            }}>
              <label style={{
                fontSize: '13px',
                fontWeight: 500,
                color: 'var(--text-primary)',
              }}>
                Email Address
                <span style={{
                  color: 'var(--danger)'
                }}> *</span>
              </label>
              <input
                type="email"
                value={email}
                onChange={e => {
                  setEmail(e.target.value);
                  setErrors(p => ({
                    ...p,
                    email: '',
                    form: '',
                  }));
                }}
                placeholder="you@example.com"
                style={{
                  padding: '10px 14px',
                  background: 'var(--bg-input)',
                  border: `1.5px solid ${errors.email
                    ? 'var(--danger)'
                    : 'var(--border)'}`,
                  borderRadius: '10px',
                  color: 'var(--text-primary)',
                  fontSize: '14px',
                  outline: 'none',
                }}
              />
              {errors.email && (
                <span style={{
                  fontSize: '12px',
                  color: 'var(--danger)',
                }}>
                  {errors.email}
                </span>
              )}
            </div>

            {/* Password */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '5px',
            }}>
              <label style={{
                fontSize: '13px',
                fontWeight: 500,
                color: 'var(--text-primary)',
              }}>
                Password
                <span style={{
                  color: 'var(--danger)'
                }}> *</span>
              </label>
              <input
                type="password"
                value={password}
                onChange={e => {
                  setPassword(e.target.value);
                  setErrors(p => ({
                    ...p,
                    password: '',
                    form: '',
                  }));
                }}
                placeholder="Your password"
                style={{
                  padding: '10px 14px',
                  background: 'var(--bg-input)',
                  border: `1.5px solid ${errors.password
                    ? 'var(--danger)'
                    : 'var(--border)'}`,
                  borderRadius: '10px',
                  color: 'var(--text-primary)',
                  fontSize: '14px',
                  outline: 'none',
                }}
              />
              {errors.password && (
                <span style={{
                  fontSize: '12px',
                  color: 'var(--danger)',
                }}>
                  {errors.password}
                </span>
              )}
            </div>

            {/* Submit button */}
            <button
              type="submit"
              disabled={loading}
              style={{
                padding: '13px',
                background: loading
                  ? 'var(--text-muted)'
                  : 'var(--brand)',
                color: '#fff',
                border: 'none',
                borderRadius: '10px',
                fontSize: '15px',
                fontWeight: 600,
                cursor: loading
                  ? 'not-allowed'
                  : 'pointer',
                marginTop: '4px',
              }}>
              {loading
                ? 'Signing in...'
                : 'Sign In →'}
            </button>
          </form>

          <p style={{
            textAlign: 'center',
            marginTop: '22px',
            fontSize: '13.5px',
            color: 'var(--text-secondary)',
          }}>
            New here?{' '}
            <Link to="/register" style={{
              color: 'var(--brand)',
              fontWeight: 600,
            }}>
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}