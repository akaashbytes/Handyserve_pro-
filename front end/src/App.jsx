import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './components/context/ThemeContext';
import { AuthProvider, useAuth } from './components/context/AuthContext';
import ProviderLiveLocationBridge from './components/provider/ProviderLiveLocationBridge';
import AppLayout from './components/layout/AppLayout';
import './styles/globals.css';

// Landing
import Navbar from './components/layout/Navbar';
import HeroSection from './components/common/HeroSection';
import StatsSection from './components/common/StatsSection';
import ServicesSection from './components/common/ServicesSection';
import AboutSection from './components/common/AboutSection';
import ContactSection from './components/common/ContactSection';
import CTASection from './components/common/CTASection';
import Footer from './components/layout/Footer';


// Auth
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import RoleSelectionPage from './pages/auth/RoleSelectionPage';


// Customer
import CustomerDashboard from './pages/customer/CustomerDashboard';
import DiscoverPage from './pages/customer/DiscoverPage';
import BookingsPage from './pages/customer/BookingsPage';
import TrackingPage from './pages/customer/TrackingPage';
import PaymentsPage from './pages/customer/PaymentsPage';

// Provider
import ProviderDashboard from './pages/provider/ProviderDashboard';
import ProviderJobs from './pages/provider/ProviderJobs';
import SchedulePage from './pages/provider/SchedulePage';
import EarningsPage from './pages/provider/EarningsPage';
import LeaveRequestPage from './pages/provider/LeaveRequestPage';
import ProviderDisputes from './pages/provider/ProviderDisputes';

// Admin
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminProviders from './pages/admin/AdminProviders';
import AdminAnalytics from './pages/admin/AdminAnalytics';
import AdminLeavePage from './pages/admin/AdminLeavePage';

import AdminBookings from './pages/admin/AdminBookings';
import AdminDisputes from './pages/admin/AdminDisputes';
import AdminSettings from './pages/admin/AdminSettings';
import AdminRequests from './pages/admin/AdminRequests';
// Shared
import ProfilePage from './pages/ProfilePage';

// ── Route Guards ───────────────────────────────────────────
function Protected({ children, role }) {
  const { isAuthenticated, user } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (role && user?.role !== role) return <Navigate to={`/${user?.role}`} replace />;
  return <AppLayout>{children}</AppLayout>;
}

function PendingRoute({ children }) {
  const { isPending, isAuthenticated, user } = useAuth();
  if (isAuthenticated) return <Navigate to={`/${user?.role}`} replace />;
  if (!isPending) return <Navigate to="/login" replace />;
  return children;
}

function PublicRoute({ children }) {
  const { isAuthenticated, user, isPending } = useAuth();
  if (isAuthenticated) return <Navigate to={`/${user?.role}`} replace />;
  if (isPending) return <Navigate to="/select-role" replace />;
  return children;
}

function Placeholder({ title }) {
  return (
    <div style={{ padding: '32px 36px' }}>
      <div style={{ maxWidth: '520px', padding: '60px', textAlign: 'center', background: 'var(--bg-card)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)', margin: '40px auto' }}>
        <div style={{ width: 72, height: 72, borderRadius: '50%', background: 'var(--brand-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '32px', margin: '0 auto 16px' }}>🚧</div>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '20px', fontWeight: 700, marginBottom: '8px', color: 'var(--text-primary)' }}>{title}</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>This section is ready to be built.</p>
      </div>
    </div>
  );
}

// ── Landing Page ───────────────────────────────────────────
function LandingPage() {
  return (
    <div style={{ margin: 0, padding: 0 }}>
      <Navbar />
      <HeroSection />
      <StatsSection />
      <ServicesSection />
      <AboutSection />
      <ContactSection />
      <CTASection />
      <Footer />
    </div>

  );
}

// ── App ────────────────────────────────────────────────────
export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <ProviderLiveLocationBridge />
        <BrowserRouter>
          <Routes>
            {/* Public */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
            <Route path="/register" element={<PublicRoute><RegisterPage /></PublicRoute>} />
            <Route path="/select-role" element={<PendingRoute><RoleSelectionPage /></PendingRoute>} />

            {/* Customer */}
            <Route path="/customer" element={<Protected role="customer"><CustomerDashboard /></Protected>} />
            <Route path="/customer/discover" element={<Protected role="customer"><DiscoverPage /></Protected>} />
            <Route path="/customer/bookings" element={<Protected role="customer"><BookingsPage /></Protected>} />
            <Route path="/customer/tracking" element={<Protected role="customer"><TrackingPage /></Protected>} />
            <Route path="/customer/payments" element={<Protected role="customer"><PaymentsPage /></Protected>} />
            <Route path="/customer/profile" element={<Protected role="customer"><ProfilePage /></Protected>} />

            {/* Provider */}
            <Route path="/provider" element={<Protected role="provider"><ProviderDashboard /></Protected>} />
            <Route path="/provider/jobs" element={<Protected role="provider"><ProviderJobs /></Protected>} />
            <Route path="/provider/disputes" element={<Protected role="provider"><ProviderDisputes /></Protected>} />
            <Route path="/provider/schedule" element={<Protected role="provider"><SchedulePage /></Protected>} />
            <Route path="/provider/earnings" element={<Protected role="provider"><EarningsPage /></Protected>} />
            <Route path="/provider/leave" element={<Protected role="provider"><LeaveRequestPage /></Protected>} />
            <Route path="/provider/profile" element={<Protected role="provider"><ProfilePage /></Protected>} />

            {/* Admin */}
            <Route path="/admin" element={<Protected role="admin"><AdminDashboard /></Protected>} />
            <Route path="/admin/providers" element={<Protected role="admin"><AdminProviders /></Protected>} />
            <Route path="/admin/leave" element={<Protected role="admin"><AdminLeavePage /></Protected>} />
            <Route path="/admin/analytics" element={<Protected role="admin"><AdminAnalytics /></Protected>} />
            <Route path="/admin/bookings" element={<Protected role="admin"><AdminBookings /></Protected>} />
            <Route path="/admin/disputes" element={<Protected role="admin"><AdminDisputes /></Protected>} />
            <Route path="/admin/settings" element={<Protected role="admin"><AdminSettings /></Protected>} />
            <Route path="/admin/requests" element={<Protected role="admin"><AdminRequests /></Protected>} />
            {/* Catch all */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}