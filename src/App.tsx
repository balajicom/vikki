import React, { useEffect } from 'react';
import { HashRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { LanguageProvider } from './context/LanguageContext';
import { DataProvider } from './context/DataContext';

import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { StickyMobileBar } from './components/StickyMobileBar';
import { ServiceModal } from './components/ServiceModal';
import { EnquiryModal } from './components/EnquiryModal';

import { HomePage } from './pages/HomePage';
import { ServicesPage } from './pages/ServicesPage';
import { AboutPage } from './pages/AboutPage';
import { HowItWorksPage } from './pages/HowItWorksPage';
import { DocumentsPage } from './pages/DocumentsPage';
import { ContactPage } from './pages/ContactPage';
import { PrivacyPolicyPage } from './pages/PrivacyPolicyPage';
import { TermsPage } from './pages/TermsPage';
import { DirectApplicationPage } from './pages/DirectApplicationPage';
import { TrackApplicationPage } from './pages/TrackApplicationPage';
import { AdminLogin } from './pages/admin/AdminLogin';
import { AdminDashboard } from './pages/admin/AdminDashboard';

// Scroll to top helper on route change
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [pathname]);

  return null;
}

export default function App() {
  return (
    <LanguageProvider>
      <DataProvider>
        <Router>
          <ScrollToTop />
          <div className="flex flex-col min-h-screen bg-white text-slate-900 font-sans antialiased selection:bg-blue-600 selection:text-white pb-14 md:pb-0">
            {/* Header / Navigation */}
            <Header />

            {/* Main Content Area */}
            <main className="flex-1">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/services" element={<ServicesPage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/how-it-works" element={<HowItWorksPage />} />
                <Route path="/documents" element={<DocumentsPage />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
                <Route path="/terms" element={<TermsPage />} />
                <Route path="/terms-conditions" element={<TermsPage />} />
                <Route path="/apply" element={<DirectApplicationPage />} />
                <Route path="/track" element={<TrackApplicationPage />} />

                {/* Admin Routes */}
                <Route path="/admin" element={<AdminLogin />} />
                <Route path="/admin/login" element={<AdminLogin />} />
                <Route path="/admin/dashboard" element={<AdminDashboard />} />

                {/* Catch-all fallback */}
                <Route path="*" element={<HomePage />} />
              </Routes>
            </main>

            {/* Detailed Government-Style Footer */}
            <Footer />

            {/* Mobile Bottom Navigation Bar (Android optimized) */}
            <StickyMobileBar />

            {/* Modals for Details and Application / Enquiries */}
            <ServiceModal />
            <EnquiryModal />
          </div>
        </Router>
      </DataProvider>
    </LanguageProvider>
  );
}
