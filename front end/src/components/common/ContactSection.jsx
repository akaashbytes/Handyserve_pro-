import React, { useState } from 'react';
import { Card, Button, Input, Toast } from './UI';
import { useAuth } from '../context/AuthContext';

export default function ContactSection() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const { submitContactRequest } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.firstName.trim() || !formData.lastName.trim() || !formData.email.trim() || !formData.message.trim()) {
      setToast({ message: 'Please fill in all fields', type: 'error' });
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setToast({ message: 'Please enter a valid email', type: 'error' });
      return;
    }

    setLoading(true);
    try {
      const payload = {
        name: `${formData.firstName} ${formData.lastName}`.trim(),
        email: formData.email.trim(),
        message: formData.message.trim(),
        phone: ''
      };
      await submitContactRequest(payload);
      setFormData({ firstName: '', lastName: '', email: '', message: '' });
      setToast({ message: '✅ Message sent successfully! We\'ll get back to you soon.', type: 'success' });
      setTimeout(() => setToast(null), 5000);
    } catch (error) {
      console.error('Contact form submission failed:', error);
      setToast({ message: 'Failed to submit contact query. Please try again later.', type: 'error' });
      setTimeout(() => setToast(null), 5000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" style={{
      padding: '100px 40px',
      background: 'var(--bg-base)',
    }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
          <p style={{
            fontSize: '13px',
            fontWeight: 600,
            color: 'var(--brand)',
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            marginBottom: '12px',
          }}>
            Contact Us
          </p>
          <h2 style={{
            fontFamily: 'var(--font-display)',
            fontSize: '42px',
            fontWeight: 800,
            color: 'var(--text-primary)',
            letterSpacing: '-1px',
            marginBottom: '16px',
          }}>
            Get In Touch
          </h2>
          <p style={{ fontSize: '16px', color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto' }}>
            Have questions or need assistance? Reach out to our 24/7 support team.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '40px', alignItems: 'start' }}>
          <Card padding="40px">
            <form onSubmit={handleSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                <Input 
                  label="First Name" 
                  placeholder="John" 
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                />
                <Input 
                  label="Last Name" 
                  placeholder="Doe" 
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                />
              </div>
              <Input 
                label="Email Address" 
                placeholder="john@example.com" 
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                style={{ marginBottom: '20px' }}
                required
              />
              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '8px' }}>Message</label>
                <textarea 
                  name="message"
                  placeholder="How can we help you?"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    background: 'var(--bg-input)',
                    border: '1.5px solid var(--border)',
                    borderRadius: 'var(--radius-md)',
                    color: 'var(--text-primary)',
                    fontSize: '14px',
                    outline: 'none',
                    minHeight: '120px',
                    resize: 'vertical',
                    fontFamily: 'var(--font-body)',
                    transition: 'var(--transition)'
                  }}
                  onFocus={e => { e.target.style.borderColor = 'var(--brand)'; e.target.style.boxShadow = '0 0 0 3px var(--brand-glow)'; }}
                  onBlur={e => { e.target.style.borderColor = 'var(--border)'; e.target.style.boxShadow = 'none'; }}
                />
              </div>
              <Button fullWidth loading={loading} type="submit">
                {loading ? 'Sending...' : 'Send Message'}
              </Button>
            </form>
          </Card>

          <div style={{ padding: '20px' }}>
            {[
              { icon: '📍', title: 'Our Office', content: '123 Service Lane, Metro City, 600001' },
              { icon: '📞', title: 'Call Center', content: '+91 800-HANDY-SV' },
              { icon: '✉️', title: 'Support Email', content: 'support@handyserve.com' },
              { icon: '🕒', title: 'Operating Hours', content: 'Mon - Sun: 8:00 AM - 10:00 PM' },
            ].map((item, i) => (
              <div key={i} style={{ display: 'flex', gap: '20px', marginBottom: '32px' }}>
                <div style={{ 
                  width: '48px', 
                  height: '48px', 
                  borderRadius: '12px', 
                  background: 'var(--brand-light)', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  fontSize: '20px',
                  flexShrink: 0
                }}>
                  {item.icon}
                </div>
                <div>
                  <h4 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '4px' }}>{item.title}</h4>
                  <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>{item.content}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </section>
  );
}
