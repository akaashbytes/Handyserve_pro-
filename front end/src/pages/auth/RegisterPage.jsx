import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../components/context/AuthContext';
import { Card, Button, Input, SectionHeader } from '../../components/common/UI';
import { useTheme } from '../../components/context/ThemeContext';
import { getIcon } from '../../components/common/Icons';
import { SERVICE_CATEGORIES } from '../../data/mockData';
import CityLocationPicker from '../../components/common/CityLocationPicker';
import { isActiveServiceCity } from '../../lib/cities';

export default function RegisterPage() {
  const { register } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const [step, setStep] = useState(1); // 1: Role, 2: Form
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Form State
  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', password: '', confirmPassword: '',
    state: 'Tamil Nadu', city: '', serviceCity: '', location: '', address: '', pincode: '',
    latitude: null, longitude: null, displayAddress: '', serviceCityActive: true,
    age: '', gender: '', serviceType: '', experience: '', timing: '', radius: '', pricing: '',
    idType: '', idNumber: '', upi: '', bankName: '', accountHolder: ''
  });

  const [locationDraft, setLocationDraft] = useState({
    serviceCity: '', state: 'Tamil Nadu', location: '', latitude: null, longitude: null,
    displayAddress: '', serviceCityActive: true,
  });





  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleRoleSelect = (selectedRole) => {
    setRole(selectedRole);
    setStep(2);
  };

  const validate = () => {
    if (!formData.name || !formData.email || !formData.phone || !formData.password) return 'Please fill all required fields.';
    if (!locationDraft.serviceCity) return 'Select Chennai, Madurai, or Coimbatore.';
    if (typeof locationDraft.latitude !== 'number' || typeof locationDraft.longitude !== 'number') {
      return 'Search and confirm your area on the map.';
    }
    if (role === 'provider' && !isActiveServiceCity(locationDraft.serviceCity)) {
      return 'Providers can only register in Chennai, Madurai, or Coimbatore for now.';
    }
    if (formData.password !== formData.confirmPassword) return 'Passwords do not match.';
    if (formData.password.length < 6) return 'Password must be at least 6 characters.';
    return null;
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    const err = validate();
    if (err) {
      setError(err);
      return;
    }

    setLoading(true);
    try {
      const userData = {
        ...formData,
        role,
        serviceCity: locationDraft.serviceCity,
        city: locationDraft.serviceCity,
        state: locationDraft.state || 'Tamil Nadu',
        location: locationDraft.location,
        latitude: locationDraft.latitude,
        longitude: locationDraft.longitude,
        displayAddress: locationDraft.displayAddress,
        serviceCityActive: locationDraft.serviceCityActive !== false,
        detectedCityLabel: locationDraft.detectedCityLabel || locationDraft.serviceCity,
        address: formData.address || locationDraft.displayAddress,
      };
      await register(userData);
      navigate(`/${role}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--bg-base)',
      display: 'flex',
      flexDirection: 'column',
      transition: 'var(--transition)'
    }}>
      {/* Header */}
      <div style={{
        padding: '24px 40px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        background: 'var(--bg-surface)',
        borderBottom: '1px solid var(--border)'
      }}>
        <Link to="/" style={{ 
          fontFamily: 'var(--font-display)', 
          fontWeight: 800, 
          fontSize: '20px', 
          color: 'var(--text-primary)',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <span style={{ background: 'var(--brand)', color: '#fff', width: 32, height: 32, borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px' }}>{getIcon('🔧', { size: 16, style: { color: '#fff' } })}</span>
          HandyServe
        </Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
           <button onClick={toggleTheme} style={{ width: 40, height: 40, borderRadius: '50%', background: 'var(--bg-elevated)', border: '1.5px solid var(--border)', cursor: 'pointer', fontSize: '18px' }}>
              {getIcon(isDark ? '☀️' : '🌙', { size: 18, style: { color: 'var(--text-primary)' } })}
           </button>
           <Link to="/login" style={{ fontSize: '14px', color: 'var(--text-secondary)', fontWeight: 500 }}>Already have an account? <span style={{ color: 'var(--brand)' }}>Login</span></Link>
        </div>
      </div>

      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 20px' }}>
        <div style={{ width: '100%', maxWidth: step === 1 ? '700px' : '900px' }}>
          
          {step === 1 && (
            <div style={{ animation: 'fadeInUp 0.4s ease' }}>
              <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '32px', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '12px' }}>Choose Your Role</h1>
                <p style={{ color: 'var(--text-secondary)' }}>How are you planning to use HandyServe?</p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                <Card 
                  hover 
                  padding="40px" 
                  onClick={() => handleRoleSelect('customer')}
                  style={{ textAlign: 'center', cursor: 'pointer', border: '2px solid transparent', transition: 'all 0.3s ease' }}
                >
                  <div style={{ fontSize: '48px', marginBottom: '20px' }}>{getIcon('🏠', { size: 48 })}</div>
                  <h3 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '12px', color: 'var(--text-primary)' }}>Customer</h3>
                  <p style={{ fontSize: '14.5px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>I want to book services for my home and find trusted professionals.</p>
                  <div style={{ marginTop: '24px', color: 'var(--brand)', fontWeight: 600 }}>Create Customer Account →</div>
                </Card>

                <Card 
                  hover 
                  padding="40px" 
                  onClick={() => handleRoleSelect('provider')}
                  style={{ textAlign: 'center', cursor: 'pointer', border: '2px solid transparent', transition: 'all 0.3s ease' }}
                >
                  <div style={{ fontSize: '48px', marginBottom: '20px' }}>{getIcon('🔧', { size: 48 })}</div>
                  <h3 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '12px', color: 'var(--text-primary)' }}>Service Provider</h3>
                  <p style={{ fontSize: '14.5px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>I want to provide my services, manage jobs, and earn money.</p>
                  <div style={{ marginTop: '24px', color: 'var(--brand)', fontWeight: 600 }}>Join as Professional →</div>
                </Card>
              </div>
            </div>
          )}

          {step === 2 && (
            <div style={{ animation: 'fadeInUp 0.4s ease' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '32px' }}>
                <Button variant="outline" size="sm" onClick={() => setStep(1)}>← Back</Button>
                <div>
                  <h1 style={{ fontSize: '24px', fontWeight: 800, color: 'var(--text-primary)' }}>{role === 'customer' ? 'Customer' : 'Provider'} Registration</h1>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>Please provide your details to get started.</p>
                </div>
              </div>

              {error && (
                <div style={{ padding: '12px 16px', background: 'var(--danger-light)', border: '1px solid var(--danger)', borderRadius: 'var(--radius-md)', marginBottom: '24px', color: 'var(--danger)', fontSize: '14px', fontWeight: 500 }}>
                  {getIcon('⚠️', { size: 16, style: { marginRight: 8, verticalAlign: 'middle', color: 'var(--danger)' } })}{error}
                </div>
              )}

              <form onSubmit={handleRegister}>
                <div style={{ display: 'grid', gridTemplateColumns: role === 'provider' ? '1fr 1fr' : '1fr', gap: '32px' }}>
                  
                  {/* Common Personal Details */}
                  <Card padding="28px">
                    <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '20px', color: 'var(--text-primary)', borderBottom: '1px solid var(--border)', paddingBottom: '10px' }}>Personal Details</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                      <Input label="Full Name *" name="name" value={formData.name} onChange={handleChange} placeholder="John Doe" />
                      <Input label="Email Address *" name="email" type="email" value={formData.email} onChange={handleChange} placeholder="john@example.com" />
                      <Input label="Phone Number *" name="phone" value={formData.phone} onChange={handleChange} placeholder="+91 98765 43210" />
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                         <Input label="Password *" name="password" type="password" value={formData.password} onChange={handleChange} placeholder="••••••••" />
                         <Input label="Confirm Password *" name="confirmPassword" type="password" value={formData.confirmPassword} onChange={handleChange} placeholder="••••••••" />
                      </div>
                      {role === 'provider' && (
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                           <Input label="Age *" name="age" type="number" value={formData.age} onChange={handleChange} placeholder="25" />
                           <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                             <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)' }}>Gender *</label>
                             <select name="gender" onChange={handleChange} style={{ padding: '10px 14px', background: 'var(--bg-input)', border: '1.5px solid var(--border)', borderRadius: 'var(--radius-md)', color: 'var(--text-primary)', fontSize: '14px', outline: 'none' }}>
                                <option value="">Select</option>
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                                <option value="other">Other</option>
                             </select>
                           </div>
                        </div>
                      )}
                    </div>
                  </Card>

                  {/* Location & Role Specific */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    <Card padding="28px">
                      <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '8px', color: 'var(--text-primary)', borderBottom: '1px solid var(--border)', paddingBottom: '10px' }}>Service location</h3>
                      <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '18px', lineHeight: 1.5 }}>
                        {role === 'provider'
                          ? 'Select your city and pin your real service area. Customers in the same city will see you.'
                          : 'Select your city, then search any area within it on the map.'}
                      </p>
                      <CityLocationPicker
                        value={locationDraft}
                        onChange={setLocationDraft}
                        mapHeight={240}
                        allowFreeSearch={role === 'customer'}
                      />
                      <div style={{ marginTop: '16px' }}>
                        <Input label="Door / flat no. (optional)" name="address" value={formData.address} onChange={handleChange} placeholder="House no, floor, building" />
                      </div>
                      <div style={{ marginTop: 12 }}>
                        <Input label="Pincode (optional)" name="pincode" value={formData.pincode} onChange={handleChange} placeholder="600040" />
                      </div>
                    </Card>

                    {role === 'provider' && (
                      <Card padding="28px">
                        <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '20px', color: 'var(--text-primary)', borderBottom: '1px solid var(--border)', paddingBottom: '10px' }}>Professional Details</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                           <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                             <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)' }}>Service Category *</label>
                             <select name="serviceType" onChange={handleChange} style={{ width: '100%', padding: '10px 14px', background: 'var(--bg-input)', border: '1.5px solid var(--border)', borderRadius: 'var(--radius-md)', color: 'var(--text-primary)', fontSize: '14px', outline: 'none' }}>
                                <option value="">Select Service</option>
                                <option value="Plumber">Plumber</option>
                                <option value="Electrician">Electrician</option>
                                <option value="Cleaning">Cleaning</option>
                                <option value="AC Repair">AC Repair</option>
                                <option value="Carpenter">Carpenter</option>
                                <option value="Salon">Salon</option>
                                <option value="Bike Service">Bike Service</option>
                                <option value="Car Wash">Car Wash</option>
                             </select>
                           </div>
                           <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                              <Input label="Experience (yrs) *" name="experience" type="number" placeholder="5" onChange={handleChange} />
                              <Input label="Service Radius (km) *" name="radius" type="number" placeholder="10" onChange={handleChange} />
                           </div>
                           <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '12px' }}>
                              <Input label="Available Timing *" name="timing" placeholder="9 AM - 6 PM" onChange={handleChange} />
                              <Input label="Pricing Preference" name="pricing" placeholder="Fixed/Hourly" onChange={handleChange} />
                           </div>
                        </div>
                      </Card>
                    )}

                  </div>
                </div>

                {role === 'provider' && (
                   <Card padding="28px" style={{ marginTop: '24px' }}>
                      <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '20px', color: 'var(--text-primary)', borderBottom: '1px solid var(--border)', paddingBottom: '10px' }}>Verification & Payment</h3>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
                         <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                           <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)' }}>ID Type *</label>
                           <select name="idType" onChange={handleChange} style={{ padding: '10px 14px', background: 'var(--bg-input)', border: '1.5px solid var(--border)', borderRadius: 'var(--radius-md)', color: 'var(--text-primary)', fontSize: '14px', outline: 'none' }}>
                              <option value="Aadhar">Aadhar Card</option>
                              <option value="PAN">PAN Card</option>
                              <option value="DL">Driving License</option>
                           </select>
                         </div>
                         <Input label="ID Number *" name="idNumber" placeholder="Enter ID number" onChange={handleChange} />
                         <Input label="UPI ID *" name="upi" placeholder="user@upi" onChange={handleChange} />
                         <Input label="Account Holder Name" name="accountHolder" placeholder="Same as on ID" onChange={handleChange} />
                         <Input label="Bank Name" name="bankName" placeholder="e.g. HDFC Bank" onChange={handleChange} />
                      </div>
                   </Card>
                )}

                <div style={{ marginTop: '32px', display: 'flex', gap: '16px', justifyContent: 'flex-end' }}>
                  <Button variant="ghost" type="button" onClick={() => setStep(1)}>Cancel</Button>
                  <Button size="lg" loading={loading} type="submit" style={{ minWidth: '200px' }}>Create Account →</Button>
                </div>
              </form>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
