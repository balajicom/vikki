import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, MessageCircle, Mail, MapPin, Clock, FileSpreadsheet, Shield } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useData } from '../context/DataContext';

export const Footer: React.FC = () => {
  const { language } = useLanguage();
  const { settings, openSheetConfig, isAdminLoggedIn } = useData();

  const cleanWhatsApp = (settings.whatsapp_number || '919870677605').replace(/\D/g, '');
  const cleanPhone = settings.phone_number || '+919870677605';

  return (
    <footer id="site-footer" className="bg-slate-950 text-slate-300 py-10 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-6 border-b border-slate-800/80">
          {/* Brand */}
          <div className="text-center md:text-left space-y-1">
            <div className="flex items-center justify-center md:justify-start gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-blue-600 text-white font-black text-sm flex items-center justify-center">
                BC
              </div>
              <h3 className="text-white font-extrabold text-base tracking-tight">
                {settings.business_name_en}
              </h3>
            </div>
            <p className="text-amber-400 text-xs font-semibold">
              {settings.business_name_hi} (जन सेवा केंद्र | डिजिटल सेवा केंद्र)
            </p>
            <p className="text-xs text-slate-400 max-w-md pt-1">
              {language === 'hi' ? settings.address_hi : settings.address_en}
            </p>
          </div>

          {/* Quick Contact & Google Sheet buttons */}
          <div className="flex flex-wrap items-center justify-center gap-2.5">
            <a
              href={`tel:${cleanPhone}`}
              className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-slate-200 hover:text-white rounded-lg border border-slate-700 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Phone className="w-3.5 h-3.5 text-blue-400" />
              <span>{settings.phone_number}</span>
            </a>

            <a
              href={`https://wa.me/${cleanWhatsApp}?text=${encodeURIComponent('Hello Balaji Communication, I need help with Jan Seva Kendra services.')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-1.5 bg-emerald-950/80 hover:bg-emerald-900 text-emerald-300 rounded-lg border border-emerald-800 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <MessageCircle className="w-3.5 h-3.5 fill-emerald-400" />
              <span>WhatsApp Helpline</span>
            </a>

            <button
              type="button"
              onClick={openSheetConfig}
              className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-emerald-300 rounded-lg border border-slate-700 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
              <span>Google Sheet Settings</span>
            </button>

            {/* Admin Login / Dashboard Link */}
            {isAdminLoggedIn ? (
              <Link
                to="/admin"
                className="px-3.5 py-1.5 bg-amber-950/80 hover:bg-amber-900 text-amber-300 rounded-lg border border-amber-800 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Shield className="w-3.5 h-3.5 text-amber-400" />
                <span>Admin Dashboard</span>
              </Link>
            ) : (
              <Link
                to="/login"
                className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white rounded-lg border border-slate-700 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Shield className="w-3.5 h-3.5 text-amber-400" />
                <span>Admin Login</span>
              </Link>
            )}
          </div>
        </div>

        {/* Disclaimer & Copyright */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500 text-center sm:text-left">
          <p>© 2026 Balaji Communication (जन सेवा केंद्र). All Rights Reserved.</p>
          <p className="text-[11px] text-slate-600">
            Independent digital service assistance center. Citizens can apply online directly.
          </p>
        </div>
      </div>
    </footer>
  );
};
