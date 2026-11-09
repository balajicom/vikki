import React, { useEffect } from 'react';
import { HashRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { LanguageProvider } from './context/LanguageContext';
import { DataProvider } from './context/DataContext';

import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { StickyMobileBar } from './components/StickyMobileBar';
import { ServiceModal } from './components/ServiceModal';
import { EnquiryModal } from './components/EnquiryModal';
import { SheetConfigModal } from './components/SheetConfigModal';
import { AddServiceModal } from './components/AddServiceModal';
import { HomePage } from './pages/HomePage';
import { AdminLogin } from './pages/admin/AdminLogin';
import { AdminDashboard } from './pages/admin/AdminDashboard';

// Scroll to top helper on route change
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    try {
      window.scrollTo(0, 0);
    } catch (e) {}
  }, [pathname]);

  return null;
}

export default function App() {
  return (
    <LanguageProvider>
      <DataProvider>
        <Router>
          <ScrollToTop />
          <div className="flex flex-col min-h-screen bg-slate-50 text-slate-900 font-sans antialiased selection:bg-blue-600 selection:text-white pb-14 md:pb-0">
            {/* Simple Header with Helpline & Language */}
            <Header />

            {/* Main Content Area: Services Catalog + Protected Admin Area */}
            <main className="flex-1">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/services" element={<HomePage />} />
                <Route path="/login" element={<AdminLogin />} />
                <Route path="/admin/login" element={<AdminLogin />} />
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/admin/dashboard" element={<AdminDashboard />} />
                {/* Fallback to HomePage for any other URL */}
                <Route path="*" element={<HomePage />} />
              </Routes>
            </main>

            {/* Simple Clean Footer */}
            <Footer />

            {/* Mobile Bottom Bar for Instant Apply / Call / WhatsApp */}
            <StickyMobileBar />

            {/* Modals for Details, Application submission to Google Sheet, Google Sheet setup, and Add Service */}
            <ServiceModal />
            <EnquiryModal />
            <SheetConfigModal />
            <AddServiceModal />
          </div>
        </Router>
      </DataProvider>
    </LanguageProvider>
  );
}
