import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Layers, Phone, MessageCircle } from 'lucide-react';
import { useData } from '../context/DataContext';
import { useLanguage } from '../context/LanguageContext';

export const StickyMobileBar: React.FC = () => {
  const location = useLocation();
  const { settings } = useData();
  const { t } = useLanguage();

  const cleanWhatsApp = (settings.whatsapp_number || '919876543210').replace(/\D/g, '');
  const cleanPhone = settings.phone_number || '+919876543210';

  const isHome = location.pathname === '/';
  const isServices = location.pathname.startsWith('/services');

  return (
    <div
      id="sticky-mobile-nav"
      className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t border-slate-200 shadow-2xl py-1.5 px-3"
    >
      <div className="grid grid-cols-4 items-center text-center gap-1">
        {/* Home */}
        <Link
          to="/"
          id="mobile-nav-home"
          className={`flex flex-col items-center justify-center py-1 rounded-lg transition-colors ${
            isHome ? 'text-blue-700 font-bold' : 'text-slate-600 hover:text-blue-600'
          }`}
        >
          <Home className="w-5 h-5" />
          <span className="text-[11px] mt-0.5">{t('navHome')}</span>
        </Link>

        {/* Services */}
        <Link
          to="/services"
          id="mobile-nav-services"
          className={`flex flex-col items-center justify-center py-1 rounded-lg transition-colors ${
            isServices ? 'text-blue-700 font-bold' : 'text-slate-600 hover:text-blue-600'
          }`}
        >
          <Layers className="w-5 h-5" />
          <span className="text-[11px] mt-0.5">{t('navServices')}</span>
        </Link>

        {/* Call */}
        <a
          href={`tel:${cleanPhone}`}
          id="mobile-nav-call"
          className="flex flex-col items-center justify-center py-1 rounded-lg text-slate-700 hover:text-blue-700 active:bg-slate-100 transition-colors"
        >
          <div className="w-7 h-7 rounded-full bg-blue-50 text-blue-700 flex items-center justify-center">
            <Phone className="w-4 h-4" />
          </div>
          <span className="text-[11px] mt-0.5 font-medium">{t('callNow')}</span>
        </a>

        {/* WhatsApp */}
        <a
          href={`https://wa.me/${cleanWhatsApp}?text=${encodeURIComponent('Hello Balaji Communication, I want information about Jan Seva Kendra services.')}`}
          target="_blank"
          rel="noopener noreferrer"
          id="mobile-nav-whatsapp"
          className="flex flex-col items-center justify-center py-1 rounded-lg text-emerald-700 hover:text-emerald-800 active:bg-emerald-50 transition-colors"
        >
          <div className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center">
            <MessageCircle className="w-4 h-4 fill-emerald-600" />
          </div>
          <span className="text-[11px] mt-0.5 font-medium">{t('whatsAppNow')}</span>
        </a>
      </div>
    </div>
  );
};
