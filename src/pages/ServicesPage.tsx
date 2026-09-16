import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Filter, Sparkles, Layers, FileQuestion, MessageCircle } from 'lucide-react';
import { useData } from '../context/DataContext';
import { useLanguage } from '../context/LanguageContext';
import { ServiceCard } from '../components/ServiceCard';

export const ServicesPage: React.FC = () => {
  const { services, categories, settings, openEnquiryModal } = useData();
  const { language, t } = useLanguage();
  const [searchParams, setSearchParams] = useSearchParams();

  const queryParam = searchParams.get('q') || '';
  const categoryParam = searchParams.get('category') || 'All';

  const [searchQuery, setSearchQuery] = useState(queryParam);
  const [selectedCategory, setSelectedCategory] = useState(categoryParam);

  // Sync state if URL changes
  useEffect(() => {
    if (queryParam !== searchQuery) {
      setSearchQuery(queryParam);
    }
  }, [queryParam]);

  useEffect(() => {
    if (categoryParam !== selectedCategory) {
      setSelectedCategory(categoryParam);
    }
  }, [categoryParam]);

  const handleCategoryChange = (cat: string) => {
    setSelectedCategory(cat);
    const newParams = new URLSearchParams(searchParams);
    if (cat === 'All') {
      newParams.delete('category');
    } else {
      newParams.set('category', cat);
    }
    setSearchParams(newParams);
  };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    const newParams = new URLSearchParams(searchParams);
    if (!query.trim()) {
      newParams.delete('q');
    } else {
      newParams.set('q', query);
    }
    setSearchParams(newParams);
  };

  // Filtered list
  const filteredServices = useMemo(() => {
    return services.filter(service => {
      // Must be Active for public
      if (service.status !== 'Active') return false;

      // Category filter
      if (selectedCategory !== 'All' && service.category !== selectedCategory) {
        return false;
      }

      // Search text filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchEn = service.service_name_en.toLowerCase().includes(q);
        const matchHi = service.service_name_hi.toLowerCase().includes(q);
        const matchCat = service.category.toLowerCase().includes(q);
        const matchDesc = (service.short_description_en + ' ' + service.short_description_hi).toLowerCase().includes(q);
        const matchDocs = service.required_documents.some(d => d.toLowerCase().includes(q));
        if (!matchEn && !matchHi && !matchCat && !matchDesc && !matchDocs) {
          return false;
        }
      }

      return true;
    });
  }, [services, selectedCategory, searchQuery]);

  const cleanWhatsApp = (settings.whatsapp_number || '919876543210').replace(/\D/g, '');

  return (
    <div id="services-page" className="min-h-screen bg-slate-50 py-10 sm:py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Page Header */}
        <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-bold uppercase tracking-wider mb-2 border border-blue-200">
            <Layers className="w-3.5 h-3.5 text-blue-600" />
            <span>{language === 'hi' ? 'नागरिक सेवा केंद्र' : 'Citizen Service Directory'}</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            {t('allServicesTitle')}
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
            {language === 'hi'
              ? 'आधार, राशन कार्ड, पीएम किसान, आयुष्मान, वोटर आईडी, पैन कार्ड एवं अन्य सभी डिजिटल सेवाओं की सूची और आवश्यक दस्तावेजों की जानकारी।'
              : 'Browse all government schemes, identity certificates, and digital assistance services provided by Balaji Communication.'}
          </p>
        </div>

        {/* Search & Filter Controls */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-sm mb-8 space-y-4">
          {/* Instant Search Bar */}
          <div className="relative">
            <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              id="services-search-input"
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              placeholder={t('searchPlaceholder')}
              className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => handleSearchChange('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-500 hover:text-slate-800 bg-slate-200/70 hover:bg-slate-200 px-2 py-1 rounded-md"
              >
                Clear
              </button>
            )}
          </div>

          {/* Category Filter Pills */}
          <div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500 mb-2">
              <Filter className="w-3.5 h-3.5 text-blue-600" />
              <span>{language === 'hi' ? 'श्रेणी अनुसार फिल्टर करें:' : 'Filter by Category:'}</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {['All', ...categories.filter(c => c !== 'All')].map((cat) => (
                <button
                  key={cat}
                  type="button"
                  id={`cat-filter-${cat.toLowerCase().replace(/\s+/g, '-')}`}
                  onClick={() => handleCategoryChange(cat)}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    selectedCategory === cat
                      ? 'bg-blue-700 text-white shadow-xs'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200/80'
                  }`}
                >
                  {cat === 'All' ? t('allCategories') : cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Results Counter */}
        <div className="flex items-center justify-between text-xs text-slate-500 font-medium mb-5 px-1">
          <span>
            {language === 'hi' ? 'दिखाए जा रहे हैं:' : 'Showing:'}{' '}
            <strong className="text-slate-900 font-bold">{filteredServices.length}</strong>{' '}
            {language === 'hi' ? 'सेवाएं' : 'services'}
          </span>
          {(searchQuery || selectedCategory !== 'All') && (
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('All');
                setSearchParams({});
              }}
              className="text-blue-700 hover:underline font-semibold"
            >
              {language === 'hi' ? 'सभी फिल्टर हटाएं' : 'Reset all filters'}
            </button>
          )}
        </div>

        {/* Services Cards Grid */}
        {filteredServices.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filteredServices.map((service) => (
              <ServiceCard key={service.service_id} service={service} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl p-12 border border-slate-200 text-center max-w-md mx-auto space-y-4">
            <div className="w-14 h-14 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
              <FileQuestion className="w-8 h-8" />
            </div>
            <h3 className="text-base font-bold text-slate-900">
              {t('noServicesFound')}
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              {language === 'hi'
                ? 'कृपया अलग शब्द से खोजें अथवा नीचे दिए बटन से संपर्क करें।'
                : 'Try searching with different keywords, or enquire directly via WhatsApp or call.'}
            </p>
            <div className="pt-2 flex flex-col sm:flex-row gap-2 justify-center">
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('All');
                }}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg transition-colors"
              >
                {language === 'hi' ? 'सभी सेवाएं दिखाएं' : 'Show all services'}
              </button>
              <button
                type="button"
                onClick={() => openEnquiryModal()}
                className="px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold rounded-lg transition-colors"
              >
                {t('applyEnquire')}
              </button>
            </div>
          </div>
        )}

        {/* Direct Help Footer Card */}
        <div className="mt-12 bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              {language === 'hi' ? 'क्या आपकी आवश्यकता के अनुसार कोई विशिष्ट सेवा चाहिए?' : 'Need personalized assistance or custom form submission?'}
            </h3>
            <p className="text-xs text-slate-600 mt-1">
              {language === 'hi'
                ? 'हमारे केंद्र पर सरकारी नौकरी के फॉर्म, एडमिट कार्ड, परीक्षा परिणाम एवं प्रमाण पत्र के लिए प्रत्यक्ष सहायता उपलब्ध है।'
                : 'Visit our center or message on WhatsApp for instant guidance and document verification.'}
            </p>
          </div>
          <a
            href={`https://wa.me/${cleanWhatsApp}?text=${encodeURIComponent('Hello Balaji Communication, I need assistance with a service not listed.')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors shrink-0"
          >
            <MessageCircle className="w-4 h-4 fill-white" />
            <span>{t('whatsAppNow')}</span>
          </a>
        </div>

      </div>
    </div>
  );
};
