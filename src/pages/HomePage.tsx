import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Search, Layers, Sparkles, MapPin, Phone, MessageCircle, Clock, ShieldCheck, CheckCircle2, Plus, Inbox, Shield, LogOut } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useData } from '../context/DataContext';
import { ServiceCard } from '../components/ServiceCard';

export const HomePage: React.FC = () => {
  const { language, t } = useLanguage();
  const { services, categories, settings, openAddServiceModal, isAdminLoggedIn, logoutAdmin, enquiries } = useData();

  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const cleanWhatsApp = (settings.whatsapp_number || '919870677605').replace(/\D/g, '');
  const cleanPhone = settings.phone_number || '+919870677605';

  // Filter services by category and search
  const filteredServices = useMemo(() => {
    let result = services.filter(s => !s.status || s.status !== 'Disabled');

    if (selectedCategory !== 'All') {
      result = result.filter(s => (s.category || '').toLowerCase().trim() === selectedCategory.toLowerCase().trim());
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(s =>
        (s.service_name_en || '').toLowerCase().includes(q) ||
        (s.service_name_hi || '').toLowerCase().includes(q) ||
        (s.category || '').toLowerCase().includes(q) ||
        (s.short_description_en || '').toLowerCase().includes(q) ||
        (s.short_description_hi || '').toLowerCase().includes(q)
      );
    }

    return result;
  }, [services, selectedCategory, searchQuery]);

  return (
    <div id="home-page" className="flex flex-col min-h-screen bg-slate-50">
      
      {/* Admin Mode Top Banner (Only visible when Admin is logged in) */}
      {isAdminLoggedIn && (
        <aside aria-label="Admin Status" className="bg-amber-400 text-amber-950 px-4 py-2.5 text-xs font-bold border-b border-amber-500 shadow-xs">
          <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-700 animate-pulse" />
              <span className="font-extrabold">{language === 'hi' ? 'एडमिन मोड सक्रिय है' : 'Admin Mode Active'}</span>
              <span className="text-amber-900 font-normal hidden sm:inline">
                | {language === 'hi' ? 'आप नई सेवाएं जोड़ सकते हैं और नागरिक आवेदन देख सकते हैं।' : 'You can add services and view citizen enquiries.'}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Link
                to="/admin"
                className="px-3 py-1 bg-slate-900 text-white hover:bg-black rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 shadow-xs"
              >
                <Inbox className="w-3.5 h-3.5 text-amber-400" />
                <span>{language === 'hi' ? 'आवेदन देखें' : 'See Enquiries'} ({enquiries.length})</span>
              </Link>
              <button
                type="button"
                onClick={openAddServiceModal}
                className="px-3 py-1 bg-amber-100 hover:bg-white text-amber-950 rounded-lg text-xs font-bold transition-colors border border-amber-300 cursor-pointer flex items-center gap-1"
              >
                <Plus className="w-3 h-3 text-amber-900" />
                <span>{language === 'hi' ? '+ सेवा जोड़ें' : '+ Add Service'}</span>
              </button>
              <button
                type="button"
                onClick={logoutAdmin}
                className="px-2.5 py-1 bg-amber-500 hover:bg-amber-600 text-amber-950 rounded-lg text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1"
              >
                <LogOut className="w-3 h-3" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </aside>
      )}

      {/* 1. Main Services Header & Search Bar */}
      <section className="bg-white border-b border-slate-200 py-6 sm:py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-5">
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-800 text-xs font-bold uppercase tracking-wider mb-1.5 border border-blue-200">
                <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                <span>{language === 'hi' ? 'जन सेवा केंद्र सेवाएं' : 'Digital Citizen Services'}</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                {language === 'hi' ? 'सभी ऑनलाइन एवं सरकारी सेवाएं' : 'Government & Digital Services Catalog'}
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl font-normal">
                {language === 'hi'
                  ? 'आधार, राशन कार्ड, पीएम किसान, आयुष्मान, वोटर आईडी, पैन कार्ड एवं सभी प्रमाण पत्र सेवाओं के लिए सीधे ऑनलाइन आवेदन करें।'
                  : 'Apply directly online for Aadhaar, Ration Card, PM Kisan, Ayushman, Voter ID, PAN Card, and all certificate services.'}
              </p>
            </div>

            {/* Direct Service Count Badge */}
            <div className="shrink-0 flex items-center gap-2 bg-slate-50 px-3.5 py-2 rounded-xl border border-slate-200">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-bold text-slate-800">
                {services.length} {language === 'hi' ? 'सेवाएं उपलब्ध' : 'Services Active'}
              </span>
            </div>
          </div>

          {/* Quick Search Input */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5 shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={language === 'hi' ? 'सेवा का नाम खोजें (उदा. आधार, राशन, किसान, पैन, आयुष्मान)...' : 'Search service name (e.g. Aadhaar, Ration, PM Kisan, PAN, Ayushman)...'}
              className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 shadow-2xs"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-3 text-xs font-bold text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                ✕
              </button>
            )}
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
            {categories.map((cat) => {
              const count = cat === 'All'
                ? services.length
                : services.filter(s => (s.category || '').toLowerCase().trim() === cat.toLowerCase().trim()).length;

              if (cat !== 'All' && count === 0) return null;

              const isSelected = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-blue-700 text-white shadow-xs'
                      : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
                  }`}
                >
                  <span>{cat === 'All' ? (language === 'hi' ? 'सभी सेवाएं' : 'All Services') : cat}</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                    isSelected ? 'bg-blue-800 text-blue-100' : 'bg-slate-100 text-slate-600'
                  }`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

        </div>
      </section>

      {/* 2. Services Grid */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-10 flex-1">
        {filteredServices.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredServices.map((service) => (
              <ServiceCard key={service.service_id} service={service} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 px-4 bg-white rounded-2xl border border-slate-200 max-w-md mx-auto space-y-3">
            <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
              <Search className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-800">
              {language === 'hi' ? 'कोई सेवा नहीं मिली' : 'No Services Found'}
            </h3>
            <p className="text-xs text-slate-500">
              {language === 'hi'
                ? `"${searchQuery || selectedCategory}" के लिए कोई परिणाम नहीं मिला। कृपया फिल्टर साफ़ करें।`
                : `No results matching "${searchQuery || selectedCategory}". Please clear filters.`}
            </p>
            <button
              type="button"
              onClick={() => { setSearchQuery(''); setSelectedCategory('All'); }}
              className="px-4 py-2 bg-blue-700 text-white rounded-xl text-xs font-bold hover:bg-blue-800 transition-colors cursor-pointer"
            >
              {language === 'hi' ? 'सभी सेवाएं दिखाएं' : 'Show All Services'}
            </button>
          </div>
        )}
      </main>

      {/* 3. Center Contact, Hours & Physical Walk-in Banner */}
      <section className="bg-white border-t border-slate-200 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="bg-slate-900 text-white rounded-2xl p-6 sm:p-8 shadow-md flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-2 text-center md:text-left">
              <span className="px-2.5 py-0.5 text-[11px] font-bold bg-amber-400 text-slate-950 rounded-full uppercase tracking-wider inline-block">
                {language === 'hi' ? 'केंद्र पता व संपर्क' : 'Physical Center & Helpline'}
              </span>
              <h3 className="text-lg sm:text-xl font-bold">
                {settings.business_name_en} ({settings.business_name_hi})
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
                {language === 'hi' ? settings.address_hi : settings.address_en}
              </p>
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-xs text-slate-400 pt-1">
                <span className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-amber-400" />
                  <span>{language === 'hi' ? settings.opening_hours_hi : settings.opening_hours_en}</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{settings.phone_number}</span>
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <a
                href={`tel:${cleanPhone}`}
                className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>{t('callNow')}</span>
              </a>
              <a
                href={`https://wa.me/${cleanWhatsApp}?text=${encodeURIComponent('Hello Balaji Communication, I need assistance with Jan Seva Kendra services.')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <MessageCircle className="w-3.5 h-3.5 fill-white" />
                <span>WhatsApp</span>
              </a>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};
