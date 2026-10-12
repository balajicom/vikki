import React, { useState } from 'react';
import { Hero } from '../components/Hero';
import { PopularServices } from '../components/PopularServices';
import { HowItWorks } from '../components/HowItWorks';
import { useLanguage } from '../context/LanguageContext';
import { useData } from '../context/DataContext';
import { Link } from 'react-router-dom';
import {
  Bell,
  ExternalLink,
  FileText,
  CheckCircle2,
  ArrowRight,
  Shield,
  Sparkles,
  Clock,
  MapPin,
  Phone,
  MessageCircle,
  HelpCircle,
  Layers,
  Award,
  Globe
} from 'lucide-react';

export const HomePage: React.FC = () => {
  const { language, t } = useLanguage();
  const { settings, notices, priceList, quickLinks, openEnquiryModal } = useData();

  const [rateCategoryFilter, setRateCategoryFilter] = useState<string>('All');

  const cleanWhatsApp = (settings.whatsapp_number || '919870677605').replace(/\D/g, '');
  const cleanPhone = settings.phone_number || '+919870677605';

  // Active notices
  const activeNotices = (notices || []).filter(n => !n.status || n.status === 'Active');

  // Price List Categories
  const priceCategories = ['All', ...Array.from(new Set((priceList || []).map(p => p.category).filter(Boolean)))];
  const filteredPriceList = (priceList || []).filter(p => {
    if (rateCategoryFilter === 'All') return true;
    return p.category === rateCategoryFilter;
  });

  return (
    <div id="home-page" className="flex flex-col">
      {/* 1. Hero Section with Search and Call-to-actions */}
      <Hero />

      {/* 2. Official Live Notice Board / Urgent Alerts Ticker */}
      {activeNotices.length > 0 && (
        <section id="official-notice-banner" className="bg-gradient-to-r from-amber-500 via-amber-600 to-orange-600 text-white py-3 px-4 shadow-sm">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2.5 font-bold shrink-0">
              <span className="flex h-2.5 w-2.5 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-white"></span>
              </span>
              <Bell className="w-4 h-4 text-white shrink-0" />
              <span className="uppercase tracking-wider font-extrabold bg-black/20 px-2 py-0.5 rounded text-[11px]">
                {language === 'hi' ? 'महत्वपूर्ण सूचनाएं' : 'Official Notice Board'}
              </span>
            </div>

            <div className="flex items-center gap-3 overflow-x-auto w-full md:w-auto py-1 scrollbar-none">
              {activeNotices.slice(0, 3).map((notice) => (
                <div
                  key={notice.notice_id}
                  className="flex items-center gap-2 bg-white/15 backdrop-blur-xs px-3 py-1.5 rounded-lg shrink-0 border border-white/20 text-white"
                >
                  <span className={`text-[10px] font-black uppercase px-1.5 py-0.2 rounded ${
                    notice.badge_type === 'Urgent'
                      ? 'bg-rose-500 text-white'
                      : notice.badge_type === 'New'
                      ? 'bg-emerald-500 text-white'
                      : 'bg-blue-500 text-white'
                  }`}>
                    {notice.badge_type || 'Update'}
                  </span>
                  <span className="font-semibold text-xs line-clamp-1 max-w-xs sm:max-w-md">
                    {language === 'hi' ? notice.title_hi : notice.title_en}
                  </span>
                  {notice.last_date && (
                    <span className="text-[10px] text-amber-100 bg-black/25 px-1.5 py-0.5 rounded font-mono">
                      {notice.last_date}
                    </span>
                  )}
                </div>
              ))}
            </div>

            <Link
              to="/services"
              className="hidden lg:inline-flex items-center gap-1 font-bold text-white hover:text-amber-100 shrink-0 text-xs underline underline-offset-2"
            >
              <span>{language === 'hi' ? 'सभी देखें' : 'View All'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </section>
      )}

      {/* 3. Popular & Complete Citizen Services (With dynamic Category filtering & live search) */}
      <PopularServices />

      {/* 4. Official Government Service Fees Transparency Rate List */}
      {priceList && priceList.length > 0 && (
        <section id="official-rate-list-section" className="py-12 sm:py-16 bg-slate-50 border-y border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-2 border border-emerald-200 shadow-2xs">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{language === 'hi' ? '100% पारदर्शी दर सूची' : '100% Transparent Fee Structure'}</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                  {language === 'hi' ? 'सरकारी शुल्क एवं केंद्र सहायता दर सूची' : 'Government Fees & Assistance Rate Card'}
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl font-normal">
                  {language === 'hi'
                    ? 'बालाजी कम्युनिकेशन पर सभी सेवाओं के सरकारी चालान एवं केंद्र सहायता शुल्क निर्धारित एवं पारदर्शी हैं। कोई अतिरिक्त या छुपा शुल्क नहीं।'
                    : 'Clear official fee structure with zero hidden charges. Government fees and digital assistance charges displayed openly.'}
                </p>
              </div>

              {/* Category Filter Pills for Rates */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                {priceCategories.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setRateCategoryFilter(cat)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                      rateCategoryFilter === cat
                        ? 'bg-emerald-700 text-white shadow-xs'
                        : 'bg-white hover:bg-slate-200 text-slate-700 border border-slate-200'
                    }`}
                  >
                    {cat === 'All' ? (language === 'hi' ? 'सभी शुल्क' : 'All Rates') : cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Rate List Table */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-900 text-white font-bold uppercase tracking-wider text-[11px]">
                      <th className="py-3 px-4">#</th>
                      <th className="py-3 px-4">{language === 'hi' ? 'सेवा का नाम' : 'Service Name'}</th>
                      <th className="py-3 px-4">{language === 'hi' ? 'श्रेणी' : 'Category'}</th>
                      <th className="py-3 px-4">{language === 'hi' ? 'सरकारी शुल्क' : 'Govt Fee'}</th>
                      <th className="py-3 px-4">{language === 'hi' ? 'केंद्र सेवा शुल्क' : 'Kendra Charge'}</th>
                      <th className="py-3 px-4 text-emerald-300 font-extrabold">{language === 'hi' ? 'कुल निर्धारित शुल्क' : 'Total Fee'}</th>
                      <th className="py-3 px-4">{language === 'hi' ? 'समय सीमा' : 'Duration'}</th>
                      <th className="py-3 px-4 text-right">{language === 'hi' ? 'आवेदन' : 'Action'}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredPriceList.map((item, idx) => (
                      <tr key={item.price_id || idx} className="hover:bg-blue-50/50 transition-colors">
                        <td className="py-3 px-4 font-mono text-slate-400 font-semibold">{idx + 1}</td>
                        <td className="py-3 px-4 font-bold text-slate-900">
                          <div>{item.service_name}</div>
                          {item.eligibility_or_note && (
                            <div className="text-[10px] text-slate-500 font-normal mt-0.5 line-clamp-1">
                              {item.eligibility_or_note}
                            </div>
                          )}
                        </td>
                        <td className="py-3 px-4">
                          <span className="px-2 py-0.5 bg-slate-100 text-slate-700 font-semibold rounded-full text-[10px] border border-slate-200">
                            {item.category}
                          </span>
                        </td>
                        <td className="py-3 px-4 font-semibold text-slate-600">{item.government_fee}</td>
                        <td className="py-3 px-4 font-semibold text-slate-600">{item.csc_service_fee}</td>
                        <td className="py-3 px-4">
                          <span className="font-extrabold text-emerald-700 text-sm bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-200">
                            {item.total_fee}
                          </span>
                        </td>
                        <td className="py-3 px-4 font-medium text-slate-600">{item.processing_time}</td>
                        <td className="py-3 px-4 text-right">
                          <button
                            type="button"
                            onClick={() => openEnquiryModal({
                              service_id: `rate-${idx}`,
                              service_name_en: item.service_name,
                              service_name_hi: item.service_name,
                              category: item.category,
                              status: 'Active'
                            } as any)}
                            className="px-3 py-1 bg-blue-700 hover:bg-blue-800 text-white font-bold rounded-lg text-[11px] transition-colors shadow-2xs"
                          >
                            {language === 'hi' ? 'आवेदन करें' : 'Apply'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 5. Direct Official Government Portal Links */}
      {quickLinks && quickLinks.length > 0 && (
        <section id="official-portals-section" className="py-12 sm:py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-800 text-xs font-bold uppercase tracking-wider mb-2 border border-blue-100 shadow-2xs">
                  <Globe className="w-3.5 h-3.5 text-blue-600" />
                  <span>{language === 'hi' ? 'सीधे सरकारी पोर्टल लिंक' : 'Official Portal Directory'}</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                  {language === 'hi' ? 'प्रमुख सरकारी एवं ई-डिस्ट्रिक्ट पोर्टल्स' : 'Key Government & Departmental Portals'}
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl font-normal">
                  {language === 'hi'
                    ? 'नागरिक सीधे भी संबंधित विभागों के आधिकारिक पोर्टल्स पर जाकर स्थिति जांच व सेवाएं देख सकते हैं।'
                    : 'Direct access to official state and central e-governance websites with guidance.'}
                </p>
              </div>

              <Link
                to="/services"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-700 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 px-3.5 py-2 rounded-lg transition-colors shrink-0"
              >
                <span>{language === 'hi' ? 'सभी सरकारी सेवाएं' : 'All Govt Services'}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {quickLinks.slice(0, 6).map((link) => (
                <div
                  key={link.link_id}
                  className="bg-slate-50 hover:bg-white p-5 rounded-2xl border border-slate-200 hover:border-blue-400 hover:shadow-md transition-all flex flex-col justify-between group"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                        {link.category}
                      </span>
                      <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600 transition-colors" />
                    </div>
                    <h3 className="text-sm font-bold text-slate-900 group-hover:text-blue-700 transition-colors">
                      {link.portal_name}
                    </h3>
                    <p className="text-[11px] text-slate-500 font-medium">{link.department}</p>
                    <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">
                      {link.description}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-slate-200/80 mt-4 flex items-center justify-between text-xs">
                    <span className="text-[10px] text-slate-500 truncate max-w-[150px]">
                      {link.portal_login_type || 'Citizen / Operator'}
                    </span>
                    <a
                      href={link.portal_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs font-bold text-blue-700 hover:text-blue-800 hover:underline"
                    >
                      <span>{language === 'hi' ? 'पोर्टल खोलें' : 'Open Portal'}</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 6. How It Works (4 Steps) */}
      <HowItWorks />

      {/* 7. About Balaji Communication Section */}
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
                <Link
                  to="/apply"
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-blue-50 hover:bg-blue-100 text-blue-800 text-xs font-bold rounded-xl transition-colors border border-blue-200"
                >
                  <span>{language === 'hi' ? 'सीधे ऑनलाइन आवेदन करें' : 'Apply Online Now'}</span>
                  <ArrowRight className="w-4 h-4 text-blue-700" />
                </Link>
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

      {/* 8. Location & Directions Section */}
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
