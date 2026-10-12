import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, Search, Layers, CheckCircle2 } from 'lucide-react';
import { useData } from '../context/DataContext';
import { useLanguage } from '../context/LanguageContext';
import { ServiceCard } from './ServiceCard';

export const PopularServices: React.FC = () => {
  const { services, categories } = useData();
  const { language, t } = useLanguage();

  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showAllServices, setShowAllServices] = useState<boolean>(false);

  // All active services (case-insensitive status check so no service is hidden)
  const allActiveServices = useMemo(() => {
    return services.filter(s => !s.status || s.status.toLowerCase() !== 'disabled');
  }, [services]);

  // Dynamic category list
  const categoryList = useMemo(() => {
    const set = new Set<string>();
    allActiveServices.forEach(s => {
      if (s.category && s.category.trim()) {
        set.add(s.category.trim());
      }
    });
    // Add default categories if present in app
    categories.forEach(c => {
      if (c && c.trim()) set.add(c.trim());
    });
    return ['All', ...Array.from(set)];
  }, [allActiveServices, categories]);

  // Filtered services based on category and search query
  const filteredServices = useMemo(() => {
    let result = allActiveServices;

    // Filter by Category
    if (selectedCategory !== 'All') {
      result = result.filter(s => 
        (s.category || '').toLowerCase().trim() === selectedCategory.toLowerCase().trim()
      );
    }

    // Filter by Search Query
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
  }, [allActiveServices, selectedCategory, searchQuery]);

  // Services to display: if showing all or filtered by search/category, show all matching; else top 8
  const displayedServices = useMemo(() => {
    if (selectedCategory !== 'All' || searchQuery.trim() || showAllServices) {
      return filteredServices;
    }
    // Prioritize popular ones or first 8
    const popular = filteredServices.filter(s => s.popular);
    const nonPopular = filteredServices.filter(s => !s.popular);
    return [...popular, ...nonPopular].slice(0, 8);
  }, [filteredServices, selectedCategory, searchQuery, showAllServices]);

  return (
    <section id="popular-services-section" className="py-12 sm:py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6 sm:mb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-800 text-xs font-bold uppercase tracking-wider mb-2 border border-blue-100 shadow-2xs">
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              <span>{language === 'hi' ? 'नागरिक सेवा निर्देशिका' : 'Citizen Services Directory'}</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-[11px] font-extrabold text-emerald-700 bg-emerald-50 px-2 py-0.2 rounded-full border border-emerald-200">
                {allActiveServices.length} {language === 'hi' ? 'सेवाएं लाइव' : 'Live Services'}
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {t('popularServicesTitle')}
            </h2>
            <p className="text-sm text-slate-600 mt-1 max-w-2xl font-normal">
              {language === 'hi'
                ? 'सभी प्रमुख सरकारी योजनाएं, आधार, राशन कार्ड, पीएम किसान, आयुष्मान एवं डिजिटल प्रमाण पत्र सेवाएं।'
                : 'Complete catalog of government schemes, identity documentation, welfare cards and online applications.'}
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap shrink-0">
            <Link
              to="/services"
              id="link-view-all-services-header"
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-white bg-blue-700 hover:bg-blue-800 px-4 py-2 rounded-lg transition-colors shadow-xs"
            >
              <span>{language === 'hi' ? 'पूरी सूची देखें' : 'View All Directory'}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Instant Search & Category Filter Toolbar */}
        <div className="bg-slate-50 p-3.5 sm:p-4 rounded-2xl border border-slate-200 mb-8 space-y-3.5">
          {/* Quick Search */}
          <div className="relative flex items-center bg-white rounded-xl border border-slate-200 shadow-2xs focus-within:border-blue-500 overflow-hidden">
            <Search className="w-4 h-4 text-slate-400 ml-3.5 shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={language === 'hi' ? 'सीधे सेवा खोजें (उदा. आधार, राशन, किसान, पैन, आय प्रमाण पत्र)...' : 'Filter services directly (e.g. Aadhaar, Ration, PM Kisan, PAN, Certificate)...'}
              className="w-full py-2.5 px-3 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="text-xs text-slate-400 hover:text-slate-700 px-3 py-1 font-bold"
              >
                ✕
              </button>
            )}
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
            <span className="text-[11px] font-bold text-slate-500 whitespace-nowrap mr-1 flex items-center gap-1">
              <Layers className="w-3 h-3 text-blue-600" />
              <span>{language === 'hi' ? 'श्रेणी:' : 'Category:'}</span>
            </span>
            {categoryList.map((cat) => {
              const count = cat === 'All' 
                ? allActiveServices.length 
                : allActiveServices.filter(s => (s.category || '').toLowerCase().trim() === cat.toLowerCase().trim()).length;
              
              if (cat !== 'All' && count === 0) return null;

              const isSelected = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-blue-700 text-white shadow-xs font-bold'
                      : 'bg-white hover:bg-slate-200 text-slate-700 border border-slate-200'
                  }`}
                >
                  <span>{cat === 'All' ? (language === 'hi' ? 'सभी सेवाएं' : 'All Services') : cat}</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                    isSelected ? 'bg-blue-800 text-blue-100' : 'bg-slate-100 text-slate-500'
                  }`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Services Cards Grid */}
        {displayedServices.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {displayedServices.map((service) => (
              <ServiceCard key={service.service_id} service={service} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 px-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
            <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center mx-auto">
              <Search className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-800">
              {language === 'hi' ? 'कोई सेवा नहीं मिली' : 'No Services Found'}
            </h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              {language === 'hi'
                ? `"${searchQuery || selectedCategory}" के लिए कोई सेवा नहीं मिली। कृपया दूसरे शब्दों से खोजें या फिल्टर साफ़ करें।`
                : `No services matching "${searchQuery || selectedCategory}". Try another keyword or clear the filter.`}
            </p>
            <button
              type="button"
              onClick={() => { setSearchQuery(''); setSelectedCategory('All'); }}
              className="px-4 py-2 bg-blue-700 text-white rounded-lg text-xs font-bold hover:bg-blue-800 transition-colors"
            >
              {language === 'hi' ? 'सभी सेवाएं दिखाएं' : 'Show All Services'}
            </button>
          </div>
        )}

        {/* Show More / Show All Button Toggle */}
        {filteredServices.length > 8 && selectedCategory === 'All' && !searchQuery && (
          <div className="mt-8 text-center">
            <button
              type="button"
              onClick={() => setShowAllServices(!showAllServices)}
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs sm:text-sm font-bold rounded-xl transition-colors border border-slate-300 shadow-2xs cursor-pointer"
            >
              <span>
                {showAllServices
                  ? (language === 'hi' ? 'कम सेवाएं दिखाएं' : 'Show Fewer Services')
                  : (language === 'hi' ? `सभी ${allActiveServices.length} सेवाएं पोर्टल पर देखें` : `Show All ${allActiveServices.length} Services on Portal`)}
              </span>
              <ArrowRight className={`w-4 h-4 transition-transform ${showAllServices ? '-rotate-90' : 'rotate-90'}`} />
            </button>
          </div>
        )}

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
            to="/apply"
            className="px-5 py-2.5 bg-white hover:bg-slate-100 text-blue-800 text-xs font-bold rounded-xl shadow-xs transition-colors shrink-0"
          >
            {language === 'hi' ? 'सीधे ऑनलाइन आवेदन करें' : 'Apply Online Directly'}
          </Link>
        </div>
      </div>
    </section>
  );
};
