import React from 'react';
import { Layers, Phone, MessageCircle, FilePenLine } from 'lucide-react';
import { useData } from '../context/DataContext';
import { useLanguage } from '../context/LanguageContext';

export const StickyMobileBar: React.FC = () => {
  const { settings, openEnquiryModal } = useData();
  const { language, t } = useLanguage();

  const cleanWhatsApp = (settings.whatsapp_number || '919870677605').replace(/\D/g, '');
  const cleanPhone = settings.phone_number || '+919870677605';

  return (
    <div
      id="sticky-mobile-nav"
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 shadow-2xl py-2 px-4"
    >
      <div className="grid grid-cols-3 items-center text-center gap-2">
        {/* Direct Call */}
        <a
          href={`tel:${cleanPhone}`}
          id="mobile-nav-call"
          className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold border border-slate-300"
        >
          <Phone className="w-3.5 h-3.5 text-blue-700" />
          <span>{t('callNow')}</span>
        </a>

        {/* Apply Online (Opens Enquiry Modal) */}
        <button
          type="button"
          id="mobile-nav-apply"
          onClick={() => openEnquiryModal()}
          className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold shadow-xs cursor-pointer"
        >
          <FilePenLine className="w-3.5 h-3.5" />
          <span>{language === 'hi' ? 'आवेदन' : 'Apply'}</span>
        </button>

        {/* Direct WhatsApp */}
        <a
          href={`https://wa.me/${cleanWhatsApp}?text=${encodeURIComponent('Hello Balaji Communication, I want information about Jan Seva Kendra services.')}`}
          target="_blank"
          rel="noopener noreferrer"
          id="mobile-nav-whatsapp"
          className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs"
        >
          <MessageCircle className="w-3.5 h-3.5 fill-white" />
          <span>WhatsApp</span>
        </a>
      </div>
    </div>
  );
};
