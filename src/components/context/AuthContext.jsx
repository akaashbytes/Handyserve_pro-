import React, { createContext, useContext, useEffect, useState } from 'react';

import { DEMO_USERS, PROVIDERS as MOCK_PROVIDERS, DISPUTES as MOCK_DISPUTES } from '../../data/mockData';
const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [pendingUser, setPendingUser] = useState(null);
  const [isPending, setIsPending] = useState(false);
  const [customUsers, setCustomUsers] = useState(() => {
    try {
      const saved = localStorage.getItem('hs_custom_users');
      return saved && saved !== 'undefined' ? JSON.parse(saved) : [];
    } catch { return []; }
  });

  const [isLocationModalOpen, setLocationModalOpen] = useState(false);

  const [blockedProviders, setBlockedProviders] = useState(() => {
    try {
      const saved = localStorage.getItem('hs_blocked_providers');
      return saved ? JSON.parse(saved) : [];
    } catch { return []; }
  });

  useEffect(() => {
    localStorage.setItem('hs_blocked_providers', JSON.stringify(blockedProviders));
  }, [blockedProviders]);

  const blockProvider = (id) => {
    setBlockedProviders(prev => 
      prev.includes(id) ? prev.filter(pid => pid !== id) : [...prev, id]
    );
  };

  const [providers, setProviders] = useState([]);
  const [leaveRequests, setLeaveRequests] = useState(() => {
    try {
      const saved = localStorage.getItem('hs_leave_requests');
      return saved && saved !== 'undefined' ? JSON.parse(saved) : [];
    } catch { return []; }
  });
  const [bookings, setBookings] = useState(() => {
    try {
      const saved = localStorage.getItem('hs_bookings');
      if (saved && saved !== 'undefined') return JSON.parse(saved);
    } catch (e) { console.error(e); }
    return [
      { id: 'B101', service: 'Plumbing', status: 'Completed', date: '2025-05-10', time: '10:00 AM', amount: 450, providerName: 'Ravi Kumar', location: 'Anna Nagar' },
      { id: 'B102', service: 'Cleaning', status: 'Cancelled', date: '2025-05-12', time: '2:30 PM', amount: 1200, providerName: 'Meena Devi', location: 'Adyar' },
    ];
  });

  const [contactRequests, setContactRequests] = useState(() => {
    try {
      const saved = localStorage.getItem('hs_contact_requests');
      return saved && saved !== 'undefined' ? JSON.parse(saved) : [];
    } catch { return []; }
  });

  const submitContactRequest = (data) => {
    const newReq = { ...data, id: `CR${Date.now()}`, status: 'pending', date: new Date().toLocaleDateString() };
    setContactRequests(prev => [newReq, ...prev]);
    return newReq;
  };

  const updateContactRequestStatus = (id, status) => {
    setContactRequests(prev => prev.map(cr => cr.id === id ? { ...cr, status } : cr));
  };

  useEffect(() => {
    localStorage.setItem('hs_contact_requests', JSON.stringify(contactRequests));
  }, [contactRequests]);

  const [disputes, setDisputes] = useState(() => {
    try {
      const saved = localStorage.getItem('hs_disputes');
      return saved && saved !== 'undefined' ? JSON.parse(saved) : MOCK_DISPUTES;
    } catch { return MOCK_DISPUTES; }
  });

  const createDispute = (disputeData) => {
    const timestamp = new Date().toLocaleString('en-IN');
    const newDispute = {
      ...disputeData,
      id: `D${String(disputes.length + 1).padStart(3, '0')}`,
      status: 'Open',
      source: disputeData.source || 'web',
      issueCategory: disputeData.issueCategory || 'General issue',
      priority: disputeData.priority || 'Medium',
      customerEmail: disputeData.customerEmail || '',
      providerEmail: disputeData.providerEmail || '',
      updates: [
        {
          id: `U${Date.now()}`,
          actor: 'Customer',
          actorRole: 'customer',
          note: 'Ticket raised from web portal.',
          at: timestamp,
        },
      ],
      date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
    };
    setDisputes(prev => [newDispute, ...prev]);
    return newDispute;
  };

  const updateDisputeStatus = (id, status) => {
    setDisputes(prev => prev.map(d => d.id === id ? { ...d, status } : d));
  };

  const addDisputeUpdate = (id, updateData) => {
    const timestamp = new Date().toLocaleString('en-IN');
    setDisputes(prev => prev.map(d => {
      if (d.id !== id) return d;
      const newUpdate = {
        id: `U${Date.now()}`,
        actor: updateData.actor || 'System',
        actorRole: updateData.actorRole || 'system',
        note: updateData.note || '',
        at: timestamp,
      };
      return { ...d, updates: [newUpdate, ...(d.updates || [])] };
    }));
  };

  useEffect(() => {
    localStorage.setItem('hs_disputes', JSON.stringify(disputes));
  }, [disputes]);

  const createBooking = (bookingData) => {
    const newBooking = {
      ...bookingData,
      id: `B${Math.floor(1000 + Math.random() * 9000)}`,
      date: new Date().toISOString().split('T')[0],
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setBookings(prev => [newBooking, ...prev]);
    return newBooking;
  };

  const updateBookingStatus = (id, status) => {
    setBookings(prev => prev.map(b => b.id === id ? { ...b, status } : b));
  };

  const createLeaveRequest = (leaveData) => {
    const newLeave = {
      ...leaveData,
      id: `L${Date.now()}`,
      status: 'pending',
      createdAt: new Date().toISOString()
    };
    setLeaveRequests(prev => [newLeave, ...prev]);
    return newLeave;
  };

  const updateLeaveStatus = (id, status) => {
    // Conflict check for approval
    if (status === 'approved') {
      const leave = leaveRequests.find(l => l.id === id);
      const hasConflict = bookings.some(b => 
        b.serviceProviderId === leave.providerId && 
        b.date === leave.date && 
        leave.timeSlots.includes(b.time) &&
        b.status !== 'Cancelled' && b.status !== 'Rejected'
      );
      if (hasConflict) throw new Error('Cannot approve: Customer bookings exist on this date/time.');
    }
    setLeaveRequests(prev => prev.map(l => l.id === id ? { ...l, status } : l));
  };

  useEffect(() => {
    localStorage.setItem('hs_leave_requests', JSON.stringify(leaveRequests));
  }, [leaveRequests]);

  useEffect(() => {
    localStorage.setItem('hs_bookings', JSON.stringify(bookings));
  }, [bookings]);

  useEffect(() => {
    const combined = [
      ...MOCK_PROVIDERS.map(p => ({ ...p, blocked: blockedProviders.includes(p.id) })),

      ...customUsers.filter(u => u.role === 'provider').map(u => ({
        id: u.id,
        name: u.name,
        service: u.serviceType || 'Handyman',
        category: (u.serviceType || 'Other').toLowerCase(),
        rating: 4.8,
        reviews: 0,
        price: u.pricing === 'Hourly' ? 400 : 800,
        experience: `${u.experience || 2} Years`,
        location: u.city || 'Chennai',
        serviceLocations: typeof u.location === 'string' ? [u.location.trim()] : u.location ? [String(u.location)] : [],
        reliabilityScore: u.reliabilityScore || 90,
        lowScoreDays: u.lowScoreDays || 0,
        radius: `${u.radius || 10}km`,
        workingHours: u.timing || '9 AM - 6 PM',
        available: true,
        verified: true,
        avatar: (u.name || 'P').split(' ').filter(Boolean).map(n => n[0]).join('').toUpperCase() || 'P',
        tags: [u.serviceType || 'Service', 'Verified', 'Top Rated'].filter(Boolean),
        image: `https://api.dicebear.com/7.x/avataaars/svg?seed=${u.name || u.id}`,
        blocked: blockedProviders.includes(u.id)
      }))
    ];
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setProviders(combined);
  }, [customUsers, blockedProviders]);


  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('hs_user');
      const storedPending = localStorage.getItem('hs_pending_user');

      if (storedUser && storedUser !== 'undefined') {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setUser(JSON.parse(storedUser));
      }

      if (storedPending && storedPending !== 'undefined') {
        const parsed = JSON.parse(storedPending);
         
        setPendingUser(parsed);
         
        setIsPending(true);
      }
    } catch (e) {
      console.error('Failed to parse stored user:', e);
      localStorage.removeItem('hs_user');
      localStorage.removeItem('hs_pending_user');
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('hs_custom_users', JSON.stringify(customUsers));
  }, [customUsers]);

  useEffect(() => {
    if (user) {
      localStorage.setItem('hs_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('hs_user');
    }
  }, [user]);

  useEffect(() => {
    if (user && user.role === 'provider' && blockedProviders.includes(user.id)) {
      setUser(null);
    }
  }, [user, blockedProviders]);

  useEffect(() => {
    if (pendingUser) {
      localStorage.setItem('hs_pending_user', JSON.stringify(pendingUser));
    } else {
      localStorage.removeItem('hs_pending_user');
    }
  }, [pendingUser]);

  const login = (email, password) => {
    if (!email || !password) {
      throw new Error('Email and password are required.');
    }

    const allUsers = [...DEMO_USERS, ...customUsers];
    const matchedUser = allUsers.find(
      u => u.email === email && u.password === password
    );

    if (!matchedUser) {
      throw new Error('Invalid email or password.');
    }

    if (matchedUser.role === 'provider' && blockedProviders.includes(matchedUser.id)) {
      throw new Error('Your account has been blocked by the admin.');
    }

    setUser(matchedUser);
    return matchedUser;
  };

  const register = (userData) => {
    const allUsers = [...DEMO_USERS, ...customUsers];
    if (allUsers.some(u => u.email === userData.email)) {
      throw new Error('Email already registered.');
    }

    const newUser = {
      ...userData,
      id: `u_${Date.now()}`,
      verified: true,
      reliabilityScore: 90,
      lowScoreDays: 0,
      avatar: (userData.name || 'U').split(' ').filter(Boolean).map(n => n[0]).join('').toUpperCase() || 'U'
    };

    setCustomUsers(prev => [...prev, newUser]);
    setUser(newUser);
    return newUser;
  };

  const selectRole = (role) => {
    if (!pendingUser) {
      throw new Error('No pending user found. Please login again.');
    }

    const selectedUser = { ...pendingUser, role };
    setUser(selectedUser);
    setPendingUser(null);
    setIsPending(false);
    return selectedUser;
  };

  const logout = () => {
    setUser(null);
    setPendingUser(null);
    setIsPending(false);
  };

  const updateUser = (updatedData) => {
    setUser(updatedData);
    setCustomUsers(prev => prev.map(u => u.id === updatedData.id ? updatedData : u));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        pendingUser,
        isAuthenticated: Boolean(user),
        isPending,
        login,
        register,
        selectRole,
        logout,
        providers,
        updateUser,
        bookings,
        createBooking,
        updateBookingStatus,
        leaveRequests,
        createLeaveRequest,
        updateLeaveStatus,
        isLocationModalOpen,
        setLocationModalOpen,
        disputes,
        createDispute,
        updateDisputeStatus,
        addDisputeUpdate,
        blockProvider,
        contactRequests,
        submitContactRequest,
        updateContactRequestStatus,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}


// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used inside AuthProvider');
  }
  return ctx;
};