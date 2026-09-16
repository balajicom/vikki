import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Phone, MessageCircle, Clock, MapPin, Globe, Menu, X, Shield, ExternalLink } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useData } from '../context/DataContext';

export const Header: React.FC = () => {
  const { language, setLanguage, t } = useLanguage();
  const { settings, openEnquiryModal } = useData();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const cleanWhatsApp = (settings.whatsapp_number || '919876543210').replace(/\D/g, '');
  const cleanPhone = settings.phone_number || '+919876543210';

  const navLinks = [
    { to: '/', label: t('navHome') },
    { to: '/services', label: t('navServices') },
    { to: '/about', label: t('navAbout') },
    { to: '/how-it-works', label: t('navHowItWorks') },
    { to: '/documents', label: t('navDocuments') },
    { to: '/contact', label: t('navContact') }
  ];

  const isActive = (path: string) => {
    if (path === '/' && location.pathname !== '/') return false;
    return location.pathname.startsWith(path);
  };

  return (
    <header id="site-header" className="w-full bg-white border-b border-slate-200 sticky top-0 z-40 shadow-xs">
      {/* Top Utility Bar */}
      <div className="bg-slate-900 text-slate-200 text-xs py-2 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-1.5 text-slate-300">
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              <span>{language === 'hi' ? settings.opening_hours_hi : settings.opening_hours_en}</span>
            </div>
            <div className="hidden md:flex items-center gap-1.5 text-slate-300">
              <MapPin className="w-3.5 h-3.5 text-blue-400" />
              <span className="truncate max-w-xs">{language === 'hi' ? settings.address_hi : settings.address_en}</span>
            </div>
          </div>

          <div className="flex items-center gap-4 ml-auto">
            {/* Language Switcher */}
            <div className="flex items-center bg-slate-800 rounded-md p-0.5 border border-slate-700">
              <button
                type="button"
                id="btn-lang-hi"
                onClick={() => setLanguage('hi')}
                className={`px-2 py-0.5 text-xs font-semibold rounded ${
                  language === 'hi'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                हिंदी
              </button>
              <button
                type="button"
                id="btn-lang-en"
                onClick={() => setLanguage('en')}
                className={`px-2 py-0.5 text-xs font-semibold rounded ${
                  language === 'en'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                English
              </button>
            </div>

            {/* Admin Login Link */}
            <Link
              to="/admin"
              id="link-admin-login-top"
              className="text-slate-300 hover:text-white flex items-center gap-1 hover:underline text-xs"
            >
              <Shield className="w-3 h-3 text-emerald-400" />
              <span>{t('navLogin')}</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between gap-4">
        {/* Logo and Branding */}
        <Link to="/" id="logo-link" className="flex items-center gap-3 group">
          <div className="w-11 h-11 rounded-lg bg-gradient-to-br from-blue-700 to-indigo-800 text-white flex items-center justify-center font-bold text-xl shadow-md border border-blue-900/10 group-hover:scale-105 transition-transform">
            <span className="font-extrabold tracking-tight">BC</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-lg sm:text-xl tracking-tight text-slate-900 group-hover:text-blue-700 transition-colors">
                {settings.business_name_en}
              </span>
              <span className="inline-block px-1.5 py-0.5 text-[10px] font-bold bg-amber-100 text-amber-800 rounded uppercase tracking-wider border border-amber-200">
                जन सेवा केंद्र
              </span>
            </div>
            <p className="text-xs font-medium text-slate-600">
              {language === 'hi' ? settings.subtitle_hi : settings.subtitle_en}
            </p>
          </div>
        </Link>

        {/* Desktop Nav Links */}
        <nav className="hidden lg:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`text-sm font-semibold transition-colors pb-1 border-b-2 ${
                isActive(link.to)
                  ? 'text-blue-700 border-blue-600'
                  : 'text-slate-700 border-transparent hover:text-blue-600 hover:border-slate-300'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Action Buttons */}
        <div className="hidden sm:flex items-center gap-2.5">
          <a
            href={`tel:${cleanPhone}`}
            id="btn-header-call"
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors border border-slate-300"
          >
            <Phone className="w-4 h-4 text-blue-700" />
            <span>{t('callNow')}</span>
          </a>

          <a
            href={`https://wa.me/${cleanWhatsApp}?text=${encodeURIComponent('Hello Balaji Communication, I want information about Jan Seva Kendra services.')}`}
            target="_blank"
            rel="noopener noreferrer"
            id="btn-header-whatsapp"
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-xs transition-colors"
          >
            <MessageCircle className="w-4 h-4 fill-white" />
            <span>{t('whatsAppNow')}</span>
          </a>

          <button
            type="button"
            id="btn-header-enquire-quick"
            onClick={() => openEnquiryModal()}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-white bg-blue-700 hover:bg-blue-800 rounded-lg shadow-xs transition-colors"
          >
            <span>{t('applyEnquire')}</span>
          </button>
        </div>

        {/* Mobile Hamburger Toggle */}
        <button
          type="button"
          id="btn-mobile-menu-toggle"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden p-2 text-slate-700 hover:text-blue-700 focus:outline-none"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-t border-slate-200 px-4 pt-3 pb-6 space-y-3 shadow-lg">
          <nav className="flex flex-col space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMobileMenuOpen(false)}
                className={`px-3 py-2 rounded-md text-sm font-semibold ${
                  isActive(link.to)
                    ? 'bg-blue-50 text-blue-700 font-bold'
                    : 'text-slate-800 hover:bg-slate-100'
                }`}
              >
                {link.label}
              </Link>
            ))}
            <Link
              to="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-md text-sm font-semibold text-slate-700 hover:bg-slate-100 flex items-center justify-between"
            >
              <span>{t('navLogin')}</span>
              <Shield className="w-4 h-4 text-emerald-600" />
            </Link>
          </nav>

          <div className="pt-2 border-t border-slate-100 flex flex-col gap-2">
            <div className="grid grid-cols-2 gap-2">
              <a
                href={`tel:${cleanPhone}`}
                className="flex items-center justify-center gap-1.5 px-3 py-2.5 text-xs font-bold text-slate-800 bg-slate-100 rounded-lg"
              >
                <Phone className="w-4 h-4 text-blue-700" />
                <span>{t('callNow')}</span>
              </a>
              <a
                href={`https://wa.me/${cleanWhatsApp}?text=${encodeURIComponent('Hello Balaji Communication, I want information about Jan Seva Kendra services.')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-1.5 px-3 py-2.5 text-xs font-bold text-white bg-emerald-600 rounded-lg"
              >
                <MessageCircle className="w-4 h-4 fill-white" />
                <span>{t('whatsAppNow')}</span>
              </a>
            </div>
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                openEnquiryModal();
              }}
              className="w-full py-2.5 text-xs font-bold text-white bg-blue-700 rounded-lg"
            >
              {t('applyEnquire')}
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
