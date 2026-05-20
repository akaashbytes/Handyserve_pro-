import React, { useState, useMemo, useEffect } from 'react';
import { Card, Button, Input, Avatar, SectionHeader, Badge } from '../../components/common/UI';
import { SERVICE_CATEGORIES } from '../../data/mockData';
import { useAuth } from '../../components/context/AuthContext';


export default function DiscoverPage() {
  const { providers, user, createBooking, updateBookingStatus, leaveRequests, setLocationModalOpen } = useAuth();
  const [selectedCat, setSelectedCat] = useState('all');
  const [locationSearch, setLocationSearch] = useState(user?.location || user?.city || '');
  const [search, setSearch] = useState('');
  const [priceRange, setPriceRange] = useState('all');
  const [ratingFilter, setRatingFilter] = useState('all');
  const [availableOnly, setAvailableOnly] = useState(false);
  const [selected, setSelected] = useState(null);
  const [booked, setBooked] = useState(false);
  const [requestTime, setRequestTime] = useState(180);
  const [isRequesting, setIsRequesting] = useState(false);
  const [activeBookingId, setActiveBookingId] = useState(null);
  const [cleaningOptions, setCleaningOptions] = useState([]);
  const [bookingStep, setBookingStep] = useState(1); // 1: Date/Slot, 2: Options/Info, 3: Confirm
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedSlot, setSelectedSlot] = useState('');

  const handleBookClick = (p) => {
    if (!user?.city) {
      setLocationModalOpen(true);
      return;
    }
    setSelected(p);
  };

  const getBlockedSlots = (providerId, date) => {
    if (!date) return [];
    return leaveRequests
      .filter(l => l.providerId === providerId && l.date === date && l.status === 'approved')
      .flatMap(l => l.timeSlots);
  };

  useEffect(() => {
    if (!user?.city) {
      setLocationModalOpen(true);
    } else {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setLocationSearch(user?.location || user?.city || '');
    }
  }, [user, setLocationModalOpen]);

  const hasLeave = (providerId) => {
    return leaveRequests.some(l => l.providerId === providerId && l.status === 'approved');
  };

  const TIME_SLOTS = [
    '8 AM', '9 AM', '10 AM', '11 AM', '12 PM', 
    '1 PM', '2 PM', '3 PM', '4 PM', '5 PM'
  ];


  const toggleOption = (opt) => {
    setCleaningOptions(prev => prev.includes(opt) ? prev.filter(o => o !== opt) : [...prev, opt]);
  };


  const filtered = useMemo(() => providers.filter(p => {
    const locMatch = !locationSearch || 
                     (p.location && p.location.toLowerCase().includes(locationSearch.toLowerCase())) ||
                     (p.serviceLocations && p.serviceLocations.some(l => l?.toLowerCase().includes(locationSearch.toLowerCase())));
    
    const pCat = (p.category || p.service)?.toLowerCase() || '';
    const sCat = selectedCat?.toLowerCase() || 'all';
    
    // Robust category match
    const catMatch = sCat === 'all' || 
                     pCat.includes(sCat) || 
                     (sCat === 'plumbing' && pCat.includes('plumber')) ||
                     (sCat === 'electrical' && pCat.includes('electri'));
    
    const searchMatch = !search || p.name?.toLowerCase().includes(search.toLowerCase()) || p.service?.toLowerCase().includes(search.toLowerCase());
    const priceMatch = priceRange === 'all' || (priceRange === 'low' && p.price < 500) || (priceRange === 'mid' && p.price >= 500 && p.price < 1000) || (priceRange === 'high' && p.price >= 1000);
    const ratingMatch = ratingFilter === 'all' || p.rating >= parseFloat(ratingFilter);
    const availMatch = !availableOnly || p.available;
    
    return catMatch && searchMatch && locMatch && priceMatch && ratingMatch && availMatch;
  }), [selectedCat, search, locationSearch, priceRange, ratingFilter, availableOnly, providers]);





  useEffect(() => {
    let timer;
    if (isRequesting && requestTime > 0) {
      timer = setInterval(() => {
        setRequestTime(t => t - 1);
      }, 1000);
      
      if (requestTime === 175) { // After 5 seconds
        updateBookingStatus(activeBookingId, 'Accepted');
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setBooked(true);
         
        setIsRequesting(false);
      }
    } else if (requestTime === 0) {
      setIsRequesting(false);
      if (activeBookingId) updateBookingStatus(activeBookingId, 'Rejected');
    }
    return () => clearInterval(timer);
  }, [isRequesting, requestTime, activeBookingId, updateBookingStatus]);

  const confirmBook = () => { 
    const booking = createBooking({
      service: selected.service,
      serviceProviderId: selected.id,
      providerName: selected.name,
      customerId: user?.id,
      customerName: user?.name || 'New Customer',
      amount: selected.price,
      location: user?.location || 'Anna Nagar',
      date: selectedDate,
      time: selectedSlot,
      status: 'Requested',
      options: cleaningOptions
    });
    setActiveBookingId(booking.id);
    setIsRequesting(true); 
    setRequestTime(180);
    // Reset selections for next time
    setBookingStep(1);
  };
  
  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const BG = ['#EDE9FE', '#D1FAE5', '#DBEAFE', '#FEF3C7', '#FFE4E6', '#E0F2FE'];

  return (
    <div style={{ padding: '32px 36px', maxWidth: '1140px' }}>
      <SectionHeader title="Discover Services" subtitle="Book trusted professionals near you" />

      {/* Filters */}
      <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '20px', marginBottom: '24px', boxShadow: 'var(--shadow-xs)' }}>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'flex-end' }}>
          <div style={{ flex: '2 1 220px' }}>
            <Input label="Search" placeholder="Service or provider..." value={search} onChange={e => setSearch(e.target.value)} icon="🔍" />
          </div>
          <div style={{ flex: '1 1 200px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>Search Area</label>
            <div onClick={() => setLocationModalOpen(true)} style={{ position: 'relative', cursor: 'pointer' }}>
              <input readOnly value={locationSearch || 'Set Area'} placeholder="Select Area"
                style={{ width: '100%', padding: '10px 14px 10px 36px', background: 'var(--bg-input)', border: '1.5px solid var(--border)', borderRadius: 'var(--radius-md)', color: 'var(--text-primary)', fontSize: '14px', outline: 'none' }} />
              <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', fontSize: '14px' }}>📍</span>
            </div>
          </div>
          <div style={{ flex: '1 1 140px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>Price</label>
            <select value={priceRange} onChange={e => setPriceRange(e.target.value)} style={{ width: '100%', padding: '10px 14px', background: 'var(--bg-input)', border: '1.5px solid var(--border)', borderRadius: 'var(--radius-md)', color: 'var(--text-primary)', fontSize: '14px', outline: 'none' }}>
              <option value="all">Any Price</option>
              <option value="low">Under ₹500</option>
              <option value="mid">₹500–₹1000</option>
              <option value="high">₹1000+</option>
            </select>
          </div>
          <div style={{ flex: '1 1 130px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>Rating</label>
            <select value={ratingFilter} onChange={e => setRatingFilter(e.target.value)} style={{ width: '100%', padding: '10px 14px', background: 'var(--bg-input)', border: '1.5px solid var(--border)', borderRadius: 'var(--radius-md)', color: 'var(--text-primary)', fontSize: '14px', outline: 'none' }}>
              <option value="all">Any Rating</option>
              <option value="4.5">4.5+ ★</option>
              <option value="4">4.0+ ★</option>
            </select>
          </div>
          <label style={{ display: 'flex', alignItems: 'center', gap: '7px', cursor: 'pointer', fontSize: '13.5px', color: 'var(--text-secondary)', paddingBottom: '12px' }}>
            <input type="checkbox" checked={availableOnly} onChange={e => setAvailableOnly(e.target.checked)} style={{ accentColor: 'var(--brand)', width: 15, height: 15 }} />
            Available now
          </label>
        </div>
      </div>

      {/* Category Pills */}
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '24px' }}>
        {[{ id: 'all', label: 'All', icon: '✦' }, ...SERVICE_CATEGORIES].map(c => {
          const active = selectedCat === c.id;
          return (
            <button key={c.id} onClick={() => setSelectedCat(c.id)}
              style={{ padding: '7px 16px', borderRadius: '20px', cursor: 'pointer', fontSize: '13.5px', fontFamily: 'var(--font-body)', fontWeight: active ? 600 : 400, background: active ? 'var(--brand)' : 'var(--bg-card)', border: `1.5px solid ${active ? 'var(--brand)' : 'var(--border)'}`, color: active ? '#fff' : 'var(--text-secondary)', transition: 'var(--transition)', boxShadow: active ? '0 2px 8px rgba(124,58,237,0.25)' : 'none' }}>
              {c.icon} {c.label}
            </button>
          );
        })}
      </div>

      <p style={{ color: 'var(--text-secondary)', fontSize: '13.5px', marginBottom: '18px', fontWeight: 500 }}>
        {filtered.length} professional{filtered.length !== 1 ? 's' : ''} found in <b>{locationSearch || 'All Areas'}</b>
      </p>

      {/* Provider Cards */}
      {filtered.length > 0 ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '20px' }}>
          {filtered.map((p, idx) => (
            <Card key={p.id} hover padding="24px" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
                <Avatar initials={p.avatar} size={56} bg={BG[idx % BG.length]} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontWeight: 700, fontSize: '16px', color: 'var(--text-primary)', marginBottom: '2px' }}>{p.name}</p>
                  <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{p.service} · {p.experience}</p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '4px' }}>
                    <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>🕒 {p.workingHours}</span>
                  </div>
                </div>
                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  <p style={{ fontWeight: 800, color: 'var(--brand)', fontSize: '18px' }}>₹{p.price}</p>
                  <p style={{ fontSize: '11px', color: 'var(--text-muted)' }}>onwards</p>
                </div>
              </div>
              
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'var(--bg-input)', padding: '10px 12px', borderRadius: 'var(--radius-md)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <span style={{ color: '#F59E0B', fontSize: '14px' }}>★</span>
                  <span style={{ fontWeight: 700, fontSize: '14px', color: 'var(--text-primary)' }}>{p.rating}</span>
                  {hasLeave(p.id) && (
                    <span style={{ fontSize: '10px', color: '#D97706', fontWeight: 600, background: '#FEF3C7', padding: '2px 6px', borderRadius: '4px', marginLeft: '6px' }}>⚠️ Some slots unavailable</span>
                  )}
                  <span style={{ color: 'var(--text-muted)', fontSize: '12.5px' }}>({p.reviews})</span>
                </div>
                <span style={{ fontSize: '12.5px', color: 'var(--text-secondary)', fontWeight: 500 }}>📍 {p.location} ({p.radius})</span>
              </div>

              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                {p.tags?.slice(0, 3).map(t => <Badge key={t} color="muted">{t}</Badge>)}
              </div>

              {/* Service Areas */}
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: 500 }}>
                 Servicing: <span style={{ color: 'var(--brand)' }}>{p.serviceLocations?.join(', ') || 'All City'}</span>
              </div>

              {/* Availability Status */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 12px',
                borderRadius: 'var(--radius-md)',
                background: p.available ? 'var(--success-light)' : 'var(--danger-light)',
                border: `1px solid ${p.available ? 'var(--success)' : 'var(--danger)'}`,
              }}>
                <div style={{
                  width: 8, height: 8,
                  borderRadius: '50%',
                  background: p.available ? 'var(--success)' : 'var(--danger)',
                  animation: p.available ? 'pulse 2s infinite' : 'none',
                }} />
                <span style={{ fontSize: '13px', fontWeight: 600, color: p.available ? '#065F46' : '#991B1B' }}>
                  {p.available ? 'Available Now' : 'Currently Busy'}
                </span>
                {p.available && <span style={{ marginLeft: 'auto', fontSize: '11.5px', color: 'var(--success)', fontWeight: 500 }}>~15 min response</span>}
              </div>

               <Button fullWidth disabled={!p.available} onClick={() => handleBookClick(p)}>
                  {p.available ? 'Book Now' : 'Currently Unavailable'}
               </Button>
            </Card>
          ))}
        </div>
      ) : (
        <Card padding="60px" style={{ textAlign: 'center', background: 'var(--bg-elevated)', borderStyle: 'dashed', borderWidth: '2px' }}>
           <div style={{ fontSize: '48px', marginBottom: '20px' }}>📍</div>
           <h3 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '8px' }}>No Services in {locationSearch || 'this area'}</h3>
           <p style={{ color: 'var(--text-secondary)', maxWidth: '400px', margin: '0 auto 24px', lineHeight: 1.6 }}>
             We currently don't have any professionals registered in your specific area. Try searching for a nearby area or check back later!
           </p>
           <Button variant="outline" onClick={() => setLocationSearch('')}>View all professionals</Button>
        </Card>
      )}

      {/* Booking Modal */}
      {selected && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(17,24,39,0.7)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px', animation: 'fadeIn 0.2s ease' }}>
          <Card padding="32px" style={{ width: '100%', maxWidth: '440px', animation: 'fadeInUp 0.3s ease', boxShadow: 'var(--shadow-lg)' }}>
            {booked ? (
              <div style={{ textAlign: 'center', padding: '20px 0' }}>
                <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'var(--success-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '40px', margin: '0 auto 20px', animation: 'scaleIn 0.5s ease' }}>✅</div>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '24px', fontWeight: 700, marginBottom: '12px', color: 'var(--text-primary)' }}>Booking Confirmed!</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '15px', lineHeight: 1.6 }}>{selected.name} has accepted your request. They will arrive at your location shortly.</p>
                <Button style={{ marginTop: '24px' }} fullWidth onClick={() => { setSelected(null); setBooked(false); }}>Go to Dashboard</Button>
              </div>
            ) : isRequesting ? (
              <div style={{ textAlign: 'center', padding: '20px 0' }}>
                <div style={{ position: 'relative', width: 100, height: 100, margin: '0 auto 24px' }}>
                   <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', border: '4px solid var(--brand-light)', borderTopColor: 'var(--brand)', animation: 'spin 1.5s linear infinite' }} />
                   <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', fontWeight: 800, color: 'var(--brand)' }}>{formatTime(requestTime)}</div>
                </div>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '22px', fontWeight: 700, marginBottom: '12px', color: 'var(--text-primary)' }}>Waiting for Provider</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '14.5px', marginBottom: '8px' }}>Sending request to <b>{selected.name}</b>...</p>
                <p style={{ color: 'var(--text-muted)', fontSize: '13px' }}>If not accepted within 3 minutes, the request will expire.</p>
                <Button variant="outline" style={{ marginTop: '24px' }} onClick={() => setIsRequesting(false)}>Cancel Request</Button>
              </div>
            ) : (
              <>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '20px', fontWeight: 700, marginBottom: '20px', color: 'var(--text-primary)' }}>Confirm Booking Request</h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '16px', background: 'var(--brand-light)', borderRadius: 'var(--radius-lg)', marginBottom: '24px', border: '1px solid #DDD6FE' }}>
                  <Avatar initials={selected.avatar} size={48} />
                  <div>
                    <p style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '15px' }}>{selected.name}</p>
                    <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{selected.service} · ₹{selected.price}</p>
                  </div>
                </div>
                {/* Stepper Header */}
                <div style={{ display: 'flex', gap: '4px', marginBottom: '20px' }}>
                  {[1, 2, 3].map(s => (
                    <div key={s} style={{ flex: 1, height: '4px', borderRadius: '2px', background: bookingStep >= s ? 'var(--brand)' : 'var(--border)' }}></div>
                  ))}
                </div>

                {bookingStep === 1 && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '24px' }}>
                    <div>
                      <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '8px' }}>1. Select Date</label>
                      <input type="date" value={selectedDate} min={new Date().toISOString().split('T')[0]} onChange={e => { setSelectedDate(e.target.value); setSelectedSlot(''); }}
                        style={{ width: '100%', padding: '12px', background: 'var(--bg-input)', border: '1.5px solid var(--border)', borderRadius: 'var(--radius-md)', color: 'var(--text-primary)', outline: 'none' }} />
                    </div>
                    
                    {selectedDate && (
                      <div>
                        <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '10px' }}>2. Select Time Slot</label>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
                          {TIME_SLOTS.map(slot => {
                            const isBlocked = getBlockedSlots(selected.id, selectedDate).includes(slot);
                            const isActive = selectedSlot === slot;
                            return (
                              <button key={slot} disabled={isBlocked} onClick={() => setSelectedSlot(slot)}
                                style={{
                                  padding: '10px 4px', borderRadius: '8px', fontSize: '11.5px', fontWeight: 600, border: '1px solid var(--border)', cursor: isBlocked ? 'not-allowed' : 'pointer',
                                  background: isActive ? 'var(--brand)' : isBlocked ? 'var(--bg-elevated)' : 'var(--bg-card)',
                                  color: isActive ? '#fff' : isBlocked ? 'var(--text-muted)' : 'var(--text-secondary)',
                                  opacity: isBlocked ? 0.6 : 1,
                                  textDecoration: isBlocked ? 'line-through' : 'none',
                                  position: 'relative',
                                  transition: 'all 0.2s'
                                }}>
                                {slot}
                                {isBlocked && <span style={{ position: 'absolute', bottom: -2, left: '50%', transform: 'translateX(-50%)', fontSize: '7px', color: 'var(--danger)', fontWeight: 800 }}>ON LEAVE</span>}
                              </button>
                            );
                          })}
                        </div>
                        {getBlockedSlots(selected.id, selectedDate).length === TIME_SLOTS.length && (
                          <p style={{ marginTop: '12px', color: 'var(--danger)', fontSize: '12px', textAlign: 'center', fontWeight: 600 }}>🚫 Provider is fully on leave this day. Please choose another date.</p>
                        )}
                      </div>
                    )}
                    <Button fullWidth disabled={!selectedDate || !selectedSlot} onClick={() => setBookingStep(2)}>Next: Service Details</Button>
                  </div>
                )}

                {bookingStep === 2 && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px' }}>
                    <Input label="Your Location" placeholder="Where do you need the service?" icon="📍" defaultValue={user?.location || "Anna Nagar, Chennai"} />
                    
                    {selected.service.toLowerCase().includes('clean') && (
                      <div style={{ padding: '12px', background: 'var(--bg-elevated)', borderRadius: 'var(--radius-md)', border: '1.5px solid var(--border)' }}>
                        <p style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '10px' }}>Additional Services</p>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                          {['Deep Clean', 'Sofa Wash', 'Bathroom', 'Kitchen'].map(opt => (
                            <button key={opt} type="button" onClick={() => toggleOption(opt)}
                              style={{ padding: '6px 14px', borderRadius: '15px', fontSize: '12.5px', cursor: 'pointer', background: cleaningOptions.includes(opt) ? 'var(--brand)' : 'var(--bg-card)', color: cleaningOptions.includes(opt) ? '#fff' : 'var(--text-secondary)', border: '1px solid var(--border)', transition: 'all 0.2s', fontWeight: 500 }}>
                              {opt}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    <Input label="Problem Description" placeholder="Briefly describe the issue..." icon="📝" />
                    <div style={{ display: 'flex', gap: '10px' }}>
                      <Button variant="outline" fullWidth onClick={() => setBookingStep(1)}>Back</Button>
                      <Button fullWidth onClick={() => setBookingStep(3)}>Next: Confirm</Button>
                    </div>
                  </div>
                )}

                {bookingStep === 3 && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '24px' }}>
                    <div style={{ background: 'var(--brand-glow)', border: '1.5px dashed var(--brand)', padding: '16px', borderRadius: 'var(--radius-md)' }}>
                       <p style={{ fontSize: '12px', fontWeight: 600, color: 'var(--brand)', textTransform: 'uppercase', marginBottom: '12px' }}>Booking Summary</p>
                       <div style={{ display: 'grid', gap: '10px' }}>
                          <p style={{ fontSize: '14px', color: 'var(--text-primary)' }}>📅 <b>Date:</b> {selectedDate}</p>
                          <p style={{ fontSize: '14px', color: 'var(--text-primary)' }}>⏰ <b>Time:</b> {selectedSlot}</p>
                          <p style={{ fontSize: '14px', color: 'var(--text-primary)' }}>🔧 <b>Service:</b> {selected.service}</p>
                          <p style={{ fontSize: '14px', color: 'var(--text-primary)' }}>💰 <b>Total:</b> ₹{selected.price}</p>
                       </div>
                    </div>
                    <div style={{ display: 'flex', gap: '10px' }}>
                      <Button variant="outline" fullWidth onClick={() => setBookingStep(2)}>Back</Button>
                      <Button fullWidth onClick={confirmBook}>Confirm Booking →</Button>
                    </div>
                  </div>
                )}
              </>
            )}
          </Card>
        </div>
      )}
    </div>
  );
}
