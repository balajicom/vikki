import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, MessageCircle, Clock, MapPin, FileSpreadsheet, Plus, Shield, Inbox, LogOut } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useData } from '../context/DataContext';

export const Header: React.FC = () => {
  const { language, setLanguage, t } = useLanguage();
  const { settings, openSheetConfig, openAddServiceModal, isAdminLoggedIn, logoutAdmin, enquiries } = useData();

  const cleanWhatsApp = (settings.whatsapp_number || '919870677605').replace(/\D/g, '');
  const cleanPhone = settings.phone_number || '+919870677605';

  return (
    <header id="site-header" className="w-full bg-white border-b border-slate-200 sticky top-0 z-40 shadow-xs">
      {/* Top Info Bar */}
      <div className="bg-slate-900 text-slate-200 text-xs py-1.5 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
          <div className="flex items-center gap-4 text-[11px] text-slate-300">
            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span>{language === 'hi' ? settings.opening_hours_hi : settings.opening_hours_en}</span>
            </div>
            <div className="hidden sm:flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-blue-400 shrink-0" />
              <span className="truncate max-w-sm">{language === 'hi' ? settings.address_hi : settings.address_en}</span>
            </div>
          </div>

          <div className="flex items-center gap-3 ml-auto">
            {/* Google Sheet Config Button */}
            <button
              type="button"
              onClick={openSheetConfig}
              className="text-slate-300 hover:text-emerald-300 flex items-center gap-1 text-[11px] font-medium transition-colors cursor-pointer"
              title="Configure Google Sheet Enquiry Storage"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden sm:inline">Google Sheet</span>
            </button>

            {/* Admin Login or Admin Dashboard */}
            {isAdminLoggedIn ? (
              <div className="flex items-center gap-2">
                <Link
                  to="/admin"
                  className="text-amber-300 hover:text-amber-200 flex items-center gap-1 text-[11px] font-bold transition-colors"
                  title="Admin Dashboard: View Enquiries and Manage Services"
                >
                  <Shield className="w-3.5 h-3.5 text-amber-400" />
                  <span>Admin Panel</span>
                  <span className="px-1.5 py-0.2 bg-amber-400 text-slate-950 rounded-full text-[9px] font-black">
                    {enquiries.length}
                  </span>
                </Link>
                <button
                  type="button"
                  onClick={logoutAdmin}
                  className="text-rose-300 hover:text-rose-200 flex items-center gap-1 text-[11px] transition-colors cursor-pointer ml-1"
                  title="Logout"
                >
                  <LogOut className="w-3 h-3" />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="text-slate-300 hover:text-amber-300 flex items-center gap-1 text-[11px] font-medium transition-colors"
                title="Admin / Owner Login"
              >
                <Shield className="w-3.5 h-3.5 text-amber-400" />
                <span>Admin Login</span>
              </Link>
            )}

            {/* Language Switcher */}
            <div className="flex items-center bg-slate-800 rounded-md p-0.5 border border-slate-700">
              <button
                type="button"
                id="btn-lang-hi"
                onClick={() => setLanguage('hi')}
                className={`px-2 py-0.5 text-xs font-semibold rounded cursor-pointer ${
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
                className={`px-2 py-0.5 text-xs font-semibold rounded cursor-pointer ${
                  language === 'en'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                English
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-br from-blue-700 to-indigo-800 text-white flex items-center justify-center font-black text-lg shadow-md border border-blue-900/10 shrink-0">
            BC
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-base sm:text-xl tracking-tight text-slate-900">
                {settings.business_name_en}
              </span>
              <span className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-bold bg-amber-100 text-amber-900 rounded-full border border-amber-200">
                जन सेवा केंद्र
              </span>
            </div>
            <p className="text-xs font-medium text-slate-500">
              {language === 'hi' ? settings.subtitle_hi : settings.subtitle_en}
            </p>
          </div>
        </div>

        {/* Quick Contact & Action Buttons */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {isAdminLoggedIn ? (
            <Link
              to="/admin"
              id="btn-header-enquiries"
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-amber-950 bg-amber-400 hover:bg-amber-300 active:bg-amber-500 rounded-xl transition-colors shadow-2xs"
              title="View Citizen Applications & Enquiries"
            >
              <Inbox className="w-3.5 h-3.5" />
              <span>{language === 'hi' ? 'आवेदन देखें' : 'See Enquiries'} ({enquiries.length})</span>
            </Link>
          ) : null}

          {isAdminLoggedIn && (
            <button
              type="button"
              id="btn-header-add-service"
              onClick={openAddServiceModal}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 active:bg-blue-200 border border-blue-200 rounded-xl transition-colors cursor-pointer"
              title="Add Service Code Generator (Admin Only)"
            >
              <Plus className="w-3.5 h-3.5 text-blue-700" />
              <span className="hidden sm:inline">{language === 'hi' ? '+ सेवा जोड़ें' : '+ Add Service'}</span>
            </button>
          )}

          <a
            href={`tel:${cleanPhone}`}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-slate-800 bg-slate-100 hover:bg-slate-200 active:bg-slate-300 rounded-xl transition-colors border border-slate-300 cursor-pointer"
          >
            <Phone className="w-3.5 h-3.5 text-blue-700" />
            <span className="hidden sm:inline">{t('callNow')}</span>
          </a>

          <a
            href={`https://wa.me/${cleanWhatsApp}?text=${encodeURIComponent('Hello Balaji Communication, I need information about Jan Seva Kendra services.')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 rounded-xl shadow-xs transition-colors cursor-pointer"
          >
            <MessageCircle className="w-3.5 h-3.5 fill-white" />
            <span>WhatsApp</span>
          </a>
        </div>
      </div>
    </header>
  );
};
