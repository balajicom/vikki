import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';
import { useData } from '../context/DataContext';
import { useLanguage } from '../context/LanguageContext';
import { ServiceCard } from './ServiceCard';

export const PopularServices: React.FC = () => {
  const { services } = useData();
  const { language, t } = useLanguage();

  // Filter popular services, or fallback to first 8 active services
  const popularServices = services.filter(s => s.status === 'Active' && (s.popular || ['Aadhaar', 'Ration Card', 'PM Kisan', 'Ayushman', 'Voter ID', 'PAN Card', 'Certificates', 'Other Digital Services'].includes(s.category))).slice(0, 8);

  return (
    <section id="popular-services-section" className="py-12 sm:py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 sm:mb-10">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-800 text-xs font-bold uppercase tracking-wider mb-2 border border-blue-100">
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              <span>{language === 'hi' ? 'सर्वाधिक लोकप्रिय' : 'Most In-Demand'}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {t('popularServicesTitle')}
            </h2>
            <p className="text-sm text-slate-600 mt-1 max-w-2xl font-normal">
              {t('popularServicesSub')}
            </p>
          </div>

          <Link
            to="/services"
            id="link-view-all-services-header"
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-blue-700 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 px-4 py-2 rounded-lg transition-colors shrink-0"
          >
            <span>{t('viewServices')}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {popularServices.map((service) => (
            <ServiceCard key={service.service_id} service={service} />
          ))}
        </div>

        {/* Bottom Banner */}
        <div className="mt-10 p-6 bg-gradient-to-r from-blue-700 to-indigo-800 text-white rounded-2xl shadow-md flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-bold">
              {language === 'hi' ? 'क्या आपकी आवश्यक सेवा यहाँ सूचीबद्ध नहीं है?' : 'Looking for another government or online form service?'}
            </h3>
            <p className="text-xs sm:text-sm text-blue-100 mt-1">
              {language === 'hi'
                ? 'हम सभी प्रकार के सरकारी पोर्टल, छात्रवृत्ति एवं डिजिटल आवेदनों में सहायता करते हैं।'
                : 'We provide comprehensive assistance for all state and central portal schemes, scholarships, and e-governance.'}
            </p>
          </div>
          <Link
            to="/services"
            className="px-5 py-2.5 bg-white hover:bg-slate-100 text-blue-800 text-xs font-bold rounded-xl shadow-xs transition-colors shrink-0"
          >
            {language === 'hi' ? 'सभी 15+ सेवाएं देखें' : 'View All 15+ Services'}
          </Link>
        </div>
      </div>
    </section>
  );
};
