import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Phone, MessageCircle, ArrowRight, ShieldCheck, CheckCircle2, Award, Zap, FileText, Users, CreditCard } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useData } from '../context/DataContext';

export const Hero: React.FC = () => {
  const { language, t } = useLanguage();
  const { settings } = useData();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const cleanWhatsApp = (settings.whatsapp_number || '919876543210').replace(/\D/g, '');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/services?q=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate('/services');
    }
  };

  return (
    <div id="hero-section" className="relative bg-gradient-to-b from-blue-50/70 via-white to-slate-50 border-b border-slate-200 overflow-hidden py-12 lg:py-16">
      {/* Background Decorative Pattern */}
      <div className="absolute inset-0 opacity-40 pointer-events-none">
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-blue-100/80 blur-3xl" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 rounded-full bg-amber-100/60 blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
          
          {/* Left Column: Headings & Actions */}
          <div className="lg:col-span-7 space-y-6">
            {/* Center Status Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-100/90 text-blue-900 border border-blue-200/80 text-xs font-bold shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              <span>{language === 'hi' ? 'अधिकृत नागरिक सेवा सहायता केंद्र' : 'Authorized Digital Citizen Assistance Center'}</span>
            </div>

            {/* Main Headline & Subtitles */}
            <div className="space-y-2">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-[1.15]">
                {language === 'hi' ? settings.hero_headline_hi : settings.hero_headline_en}
              </h1>
              <p className="text-lg sm:text-xl font-bold text-blue-800">
                {language === 'hi' ? settings.hero_headline_en : settings.hero_headline_hi}
              </p>
            </div>

            {/* Description */}
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-xl font-normal">
              {language === 'hi' ? settings.hero_description_hi : settings.hero_description_en}
            </p>

            {/* Interactive Instant Search Bar */}
            <form onSubmit={handleSearch} className="max-w-xl">
              <div className="relative flex items-center shadow-md rounded-xl overflow-hidden border-2 border-blue-600/40 focus-within:border-blue-700 bg-white transition-all">
                <Search className="w-5 h-5 text-blue-600 ml-3.5 shrink-0" />
                <input
                  type="text"
                  id="hero-search-input"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={t('searchPlaceholder')}
                  className="w-full py-3.5 px-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none"
                />
                <button
                  type="submit"
                  id="btn-hero-search-submit"
                  className="bg-blue-700 hover:bg-blue-800 text-white text-xs sm:text-sm font-bold px-5 py-3.5 transition-colors shrink-0"
                >
                  {language === 'hi' ? 'खोजें' : 'Search'}
                </button>
              </div>
              <div className="flex items-center gap-2 mt-2 text-xs text-slate-500 flex-wrap">
                <span className="font-semibold text-slate-600">{language === 'hi' ? 'लोकप्रिय:' : 'Popular:'}</span>
                {['Aadhaar', 'Ration Card', 'PM Kisan', 'Ayushman', 'PAN Card'].map((term, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => navigate(`/services?q=${encodeURIComponent(term)}`)}
                    className="px-2 py-0.5 bg-white hover:bg-blue-50 text-slate-700 border border-slate-200 rounded text-[11px] font-medium transition-colors"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </form>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Link
                to="/services"
                id="btn-hero-view-services"
                className="inline-flex items-center gap-2 px-6 py-3 text-sm font-bold text-white bg-blue-700 hover:bg-blue-800 rounded-xl shadow-md hover:shadow-lg transition-all"
              >
                <span>{t('viewServices')}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                to="/contact"
                id="btn-hero-contact-us"
                className="inline-flex items-center gap-2 px-5 py-3 text-sm font-bold text-slate-800 bg-white hover:bg-slate-100 border border-slate-300 rounded-xl shadow-xs transition-colors"
              >
                <Phone className="w-4 h-4 text-blue-700" />
                <span>{t('navContact')}</span>
              </Link>

              <a
                href={`https://wa.me/${cleanWhatsApp}?text=${encodeURIComponent('Hello Balaji Communication, I want information about Jan Seva Kendra services.')}`}
                target="_blank"
                rel="noopener noreferrer"
                id="btn-hero-whatsapp"
                className="inline-flex items-center gap-2 px-5 py-3 text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-xs transition-colors"
              >
                <MessageCircle className="w-4 h-4 fill-white" />
                <span>{t('whatsAppNow')}</span>
              </a>
            </div>

            {/* Key Trust Highlights */}
            <div className="grid grid-cols-3 gap-3 pt-3 max-w-lg border-t border-slate-200/80">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="text-xs font-bold text-slate-700">15+ Services</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0" />
                <span className="text-xs font-bold text-slate-700">Expert Staff</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-500 shrink-0" />
                <span className="text-xs font-bold text-slate-700">Instant Help</span>
              </div>
            </div>
          </div>

          {/* Right Column: Citizen Services Illustration Showcase */}
          <div className="lg:col-span-5">
            <div className="relative mx-auto max-w-md bg-white rounded-2xl p-6 sm:p-7 shadow-xl border border-slate-200">
              {/* Card Header */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-5">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-blue-700 text-white flex items-center justify-center font-black text-sm">
                    BC
                  </div>
                  <div>
                    <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                      Digital Assistance Hub
                    </h2>
                    <p className="text-[11px] text-slate-500 font-medium">Balaji Communication Center</p>
                  </div>
                </div>
                <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full text-[10px] font-bold">
                  Active Desk
                </span>
              </div>

              {/* Service Cards Visual Grid */}
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-blue-50/70 rounded-xl border border-blue-100">
                  <div className="w-10 h-10 rounded-lg bg-blue-600 text-white flex items-center justify-center shrink-0">
                    <CreditCard className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xs font-bold text-slate-900 truncate">Aadhaar & PVC Smart Card</h3>
                      <span className="text-[10px] font-semibold text-blue-700">Instant</span>
                    </div>
                    <p className="text-[11px] text-slate-600 truncate">Mobile Link, Address & Reprint</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-emerald-50/70 rounded-xl border border-emerald-100">
                  <div className="w-10 h-10 rounded-lg bg-emerald-600 text-white flex items-center justify-center shrink-0">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xs font-bold text-slate-900 truncate">Ayushman Bharat Card</h3>
                      <span className="text-[10px] font-semibold text-emerald-700">₹5 Lakh Free</span>
                    </div>
                    <p className="text-[11px] text-slate-600 truncate">Golden Card KYC & Instant Print</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-amber-50/70 rounded-xl border border-amber-100">
                  <div className="w-10 h-10 rounded-lg bg-amber-600 text-white flex items-center justify-center shrink-0">
                    <Users className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xs font-bold text-slate-900 truncate">Ration Card & PM Kisan</h3>
                      <span className="text-[10px] font-semibold text-amber-700">Govt Schemes</span>
                    </div>
                    <p className="text-[11px] text-slate-600 truncate">New Apply, Unit Add, eKYC & Status</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-indigo-50/70 rounded-xl border border-indigo-100">
                  <div className="w-10 h-10 rounded-lg bg-indigo-600 text-white flex items-center justify-center shrink-0">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xs font-bold text-slate-900 truncate">Certificates & PAN Card</h3>
                      <span className="text-[10px] font-semibold text-indigo-700">e-District</span>
                    </div>
                    <p className="text-[11px] text-slate-600 truncate">Income, Caste, Domicile & Birth</p>
                  </div>
                </div>
              </div>

              {/* Bottom Quick Help Badge */}
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5 text-slate-600">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span>Open 6 Days a Week</span>
                </div>
                <span className="font-bold text-blue-700">Sector 12, Noida</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
