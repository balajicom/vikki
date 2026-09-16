import React from 'react';
import { Hero } from '../components/Hero';
import { PopularServices } from '../components/PopularServices';
import { HowItWorks } from '../components/HowItWorks';
import { useLanguage } from '../context/LanguageContext';
import { useData } from '../context/DataContext';
import { Link } from 'react-router-dom';
import { Shield, Clock, MapPin, Phone, MessageCircle, ArrowRight, CheckCircle2 } from 'lucide-react';

export const HomePage: React.FC = () => {
  const { language, t } = useLanguage();
  const { settings, openEnquiryModal } = useData();

  const cleanWhatsApp = (settings.whatsapp_number || '919876543210').replace(/\D/g, '');
  const cleanPhone = settings.phone_number || '+919876543210';

  return (
    <div id="home-page" className="flex flex-col">
      {/* 1. Hero Section with Search and Call-to-actions */}
      <Hero />

      {/* 2. Popular Citizen Services */}
      <PopularServices />

      {/* 3. How It Works (4 Steps) */}
      <HowItWorks />

      {/* 4. About Balaji Communication Section */}
      <section className="py-14 sm:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div className="space-y-4">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
                {language === 'hi' ? 'विश्वसनीय डिजिटल केंद्र' : 'Trusted Local Digital Center'}
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                {language === 'hi' ? 'बालाजी कम्युनिकेशन जन सेवा केंद्र के बारे में' : 'About Balaji Communication Jan Seva Kendra'}
              </h2>
              <p className="text-sm text-slate-600 leading-relaxed">
                {language === 'hi' ? settings.about_us_hi : settings.about_us_en}
              </p>

              <div className="space-y-2.5 pt-2">
                {[
                  language === 'hi' ? 'सभी सरकारी योजनाओं एवं पोर्टल्स में सही दस्तावेजी सहायता' : 'Accurate documentation assistance for state and central portals',
                  language === 'hi' ? 'पारदर्शी एवं निर्धारित सहायता शुल्क (कोई छुपा शुल्क नहीं)' : 'Transparent assistance fees with zero hidden charges',
                  language === 'hi' ? 'वरिष्ठ नागरिकों एवं ग्रामीण निवासियों के लिए विशेष मार्गदर्शन' : 'Special guidance for senior citizens and non-technical applicants',
                  language === 'hi' ? 'तत्काल डिजिटल रसीद एवं आवेदन ट्रैकिंग सुविधा' : 'Instant acknowledgement receipt and status tracking'
                ].map((point, i) => (
                  <div key={i} className="flex items-center gap-2.5 text-xs sm:text-sm text-slate-700">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{point}</span>
                  </div>
                ))}
              </div>

              <div className="pt-3 flex flex-wrap items-center gap-3">
                <Link
                  to="/about"
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold rounded-xl transition-colors"
                >
                  <span>{language === 'hi' ? 'अधिक जानकारी पढ़ें' : 'Read More About Us'}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <button
                  type="button"
                  onClick={() => openEnquiryModal()}
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl transition-colors"
                >
                  <span>{t('applyEnquire')}</span>
                </button>
              </div>
            </div>

            {/* Visual Box */}
            <div className="bg-slate-900 text-white rounded-2xl p-7 sm:p-8 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 -mr-10 -mt-10 w-48 h-48 bg-blue-600/20 rounded-full blur-2xl" />
              <div className="relative z-10 space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-white mb-1">
                    {settings.business_name_en}
                  </h3>
                  <p className="text-amber-400 text-xs font-semibold">
                    {settings.business_name_hi}
                  </p>
                </div>

                <div className="space-y-4 text-xs text-slate-300">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-white block mb-0.5">Center Address:</span>
                      <span>{language === 'hi' ? settings.address_hi : settings.address_en}</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Clock className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-white block mb-0.5">Opening Hours:</span>
                      <span>{language === 'hi' ? settings.opening_hours_hi : settings.opening_hours_en}</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Phone className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-white block mb-0.5">Helpline Phone & WhatsApp:</span>
                      <span>{settings.phone_number}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-800 flex flex-wrap gap-2.5">
                  <a
                    href={`tel:${cleanPhone}`}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg transition-colors"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>{t('callNow')}</span>
                  </a>
                  <a
                    href={`https://wa.me/${cleanWhatsApp}?text=${encodeURIComponent('Hello Balaji Communication, I need information about Jan Seva Kendra.')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg transition-colors"
                  >
                    <MessageCircle className="w-3.5 h-3.5 fill-white" />
                    <span>{t('whatsAppNow')}</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Location & Directions Section */}
      <section className="py-12 bg-slate-100 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                {language === 'hi' ? 'केंद्र पर पधारें' : 'Visit Our Physical Center'}
              </span>
              <h3 className="text-xl font-bold text-slate-900">
                {language === 'hi' ? 'सीधे केंद्र पर आकर भी सेवा प्राप्त करें' : 'Walk-in Anytime During Center Hours'}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 max-w-xl">
                {language === 'hi' ? settings.address_hi : settings.address_en}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <a
                href={settings.google_maps_url || "https://maps.google.com"}
                target="_blank"
                rel="noopener noreferrer"
                id="btn-home-get-directions"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-700 hover:bg-blue-800 text-white text-xs sm:text-sm font-bold rounded-xl shadow-xs transition-colors"
              >
                <MapPin className="w-4 h-4 text-white" />
                <span>{t('getDirections')}</span>
              </a>

              <Link
                to="/contact"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs sm:text-sm font-bold rounded-xl transition-colors"
              >
                <span>{t('navContact')}</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
