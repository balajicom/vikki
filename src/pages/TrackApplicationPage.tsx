import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Search, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Phone, 
  MessageCircle, 
  ArrowLeft, 
  Shield, 
  FileText, 
  Copy, 
  Check, 
  MapPin, 
  Calendar,
  Sparkles
} from 'lucide-react';
import { useData } from '../context/DataContext';
import { useLanguage } from '../context/LanguageContext';

export const TrackApplicationPage: React.FC = () => {
  const { trackApplication, settings } = useData();
  const { language } = useLanguage();
  const location = useLocation();

  const [query, setQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [results, setResults] = useState<any[]>([]);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const cleanWhatsApp = (settings.whatsapp_number || '919870677605').replace(/\D/g, '');
  const cleanPhone = settings.phone_number || '+919870677605';

  const runSearch = async (searchTerm: string) => {
    const q = searchTerm.trim();
    if (!q) return;

    setIsSearching(true);
    setSearchError(null);
    setHasSearched(true);

    const res = await trackApplication(q);
    setIsSearching(false);

    if (res.success && res.results) {
      setResults(res.results);
    } else {
      setResults([]);
      setSearchError(res.error || 'No records found');
    }
  };

  // Auto-search on URL query parameter e.g. /track?id=BALAJI-APP-... or ?q=9870677605
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const urlId = params.get('id') || params.get('q') || params.get('ref') || params.get('mobile');
    if (urlId && urlId.trim()) {
      setQuery(urlId.trim());
      runSearch(urlId.trim());
    }
  }, [location.search]);

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    await runSearch(query);
  };

  const handleCopyId = (id: string) => {
    navigator.clipboard.writeText(id);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'New':
        return (
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800 border border-blue-200">
            {language === 'hi' ? 'आवेदन प्राप्त हुआ (In Review)' : 'Application Received'}
          </span>
        );
      case 'Contacted':
        return (
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200">
            {language === 'hi' ? 'दस्तावेज सत्यापन जारी' : 'Documents Under Verification'}
          </span>
        );
      case 'Processing':
        return (
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-indigo-100 text-indigo-800 border border-indigo-200">
            {language === 'hi' ? 'सरकारी पोर्टल पर प्रक्रियाधीन' : 'Processing at Government Portal'}
          </span>
        );
      case 'Completed':
        return (
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
            {language === 'hi' ? 'कार्य पूर्ण / रसीद तैयार' : 'Completed / Ready for Collection'}
          </span>
        );
      case 'Cancelled':
        return (
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-800 border border-rose-200">
            {language === 'hi' ? 'निरस्त / सुधार आवश्यक' : 'Cancelled / Needs Clarification'}
          </span>
        );
      default:
        return (
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-800">
            {status}
          </span>
        );
    }
  };

  // Render 4-step progress line
  const renderStepTimeline = (status: string) => {
    if (status === 'Cancelled') {
      return (
        <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>
            {language === 'hi'
              ? 'इस आवेदन में दस्तावेज संबंधी सुधार की आवश्यकता है। कृपया केंद्र पर संपर्क करें।'
              : 'Action needed on this application. Please contact Balaji Communication Jan Seva Kendra.'}
          </span>
        </div>
      );
    }

    const steps = [
      { key: 'New', en: 'Received', hi: 'प्राप्त हुआ' },
      { key: 'Contacted', en: 'Verified', hi: 'दस्तावेज जांच' },
      { key: 'Processing', en: 'Govt Portal', hi: 'प्रक्रियाधीन' },
      { key: 'Completed', en: 'Ready', hi: 'पूर्ण / तैयार' }
    ];

    const stepOrder = ['New', 'Contacted', 'Processing', 'Completed'];
    const currentIdx = stepOrder.indexOf(status);
    const activeIndex = currentIdx === -1 ? 0 : currentIdx;

    return (
      <div className="pt-2 pb-1">
        <div className="relative flex items-center justify-between">
          <div className="absolute top-1/2 left-0 right-0 h-1 bg-slate-200 -translate-y-1/2 z-0" />
          <div 
            className="absolute top-1/2 left-0 h-1 bg-emerald-500 -translate-y-1/2 z-0 transition-all duration-500"
            style={{ width: `${(activeIndex / (steps.length - 1)) * 100}%` }}
          />

          {steps.map((st, i) => {
            const isDone = i <= activeIndex;
            const isCurrent = i === activeIndex;
            return (
              <div key={st.key} className="relative z-10 flex flex-col items-center">
                <div 
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all shadow-xs ${
                    isDone 
                      ? 'bg-emerald-600 text-white ring-4 ring-emerald-100' 
                      : 'bg-slate-200 text-slate-500'
                  } ${isCurrent ? 'scale-110' : ''}`}
                >
                  {isDone ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : i + 1}
                </div>
                <span className={`text-[10px] mt-1.5 font-bold text-center whitespace-nowrap ${
                  isCurrent ? 'text-blue-900' : isDone ? 'text-emerald-800' : 'text-slate-400'
                }`}>
                  {language === 'hi' ? st.hi : st.en}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div id="track-application-page" className="min-h-screen bg-slate-50 py-10 sm:py-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        
        {/* Back Link */}
        <div className="mb-6 flex items-center justify-between">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-700 hover:text-blue-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{language === 'hi' ? 'मुख्य पृष्ठ पर वापस' : 'Back to Home'}</span>
          </Link>

          <Link
            to="/apply"
            className="inline-flex items-center gap-1 text-xs font-bold text-blue-700 hover:underline"
          >
            <span>{language === 'hi' ? '+ नया आवेदन भरें' : '+ Apply Online'}</span>
          </Link>
        </div>

        {/* Header Card */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-3 py-1 rounded-full border border-blue-100 inline-flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-500" />
              <span>Real-Time Citizen Tracking</span>
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {language === 'hi' ? 'आवेदन की स्थिति जांचें' : 'Track Application Status'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              {language === 'hi'
                ? 'अपना 10 अंकों का पंजीकृत मोबाइल नंबर या एप्लीकेशन आईडी दर्ज करके अपने आवेदन की वर्तमान स्थिति जानें।'
                : 'Enter your 10-digit registered mobile number or Application Reference ID to check live progress.'}
            </p>
          </div>

          {/* Search Bar */}
          <form onSubmit={handleTrack} className="max-w-xl mx-auto space-y-3">
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="relative flex-1">
                <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  required
                  placeholder="e.g. 9870677605 or BALAJI-APP-2026-001"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600/30 focus:border-blue-600 shadow-2xs"
                />
              </div>
              <button
                type="submit"
                disabled={isSearching}
                className="px-6 py-3 bg-blue-700 hover:bg-blue-800 active:bg-blue-900 disabled:opacity-60 text-white font-bold text-sm rounded-xl shadow-xs transition-colors shrink-0"
              >
                {isSearching ? (language === 'hi' ? 'खोज रहे हैं...' : 'Tracking...') : (language === 'hi' ? 'स्थिति जांचें' : 'Check Status')}
              </button>
            </div>

            {/* Quick Test Samples */}
            <div className="flex flex-wrap items-center gap-1.5 text-[11px] text-slate-500 pt-1">
              <span className="font-semibold text-slate-600">{language === 'hi' ? 'त्वरित जांचें:' : 'Quick check:'}</span>
              <button
                type="button"
                onClick={() => { setQuery('9870677605'); runSearch('9870677605'); }}
                className="px-2 py-0.5 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-md font-mono border border-blue-200 transition-colors"
              >
                9870677605
              </button>
              <button
                type="button"
                onClick={() => { setQuery('BALAJI-APP-2026-001'); runSearch('BALAJI-APP-2026-001'); }}
                className="px-2 py-0.5 bg-slate-100 text-slate-700 hover:bg-slate-200 rounded-md font-mono border border-slate-200 transition-colors"
              >
                BALAJI-APP-2026-001
              </button>
              <button
                type="button"
                onClick={() => { setQuery('Sunita Devi'); runSearch('Sunita Devi'); }}
                className="px-2 py-0.5 bg-slate-100 text-slate-700 hover:bg-slate-200 rounded-md border border-slate-200 transition-colors"
              >
                Sunita Devi
              </button>
            </div>
          </form>

          {/* RESULTS DISPLAY */}
          {hasSearched && (
            <div className="pt-6 border-t border-slate-100 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  {language === 'hi' ? 'खोज परिणाम' : 'Search Results'} ({results.length})
                </h3>
                {results.length > 0 && (
                  <span className="text-[11px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    Live Record Found
                  </span>
                )}
              </div>

              {results.length === 0 ? (
                <div className="text-center py-8 bg-slate-50 rounded-xl border border-slate-200/80 p-6 space-y-3">
                  <AlertCircle className="w-10 h-10 text-amber-500 mx-auto" />
                  <h4 className="text-sm font-bold text-slate-800">
                    {language === 'hi' ? 'कोई रिकॉर्ड नहीं मिला' : 'No Applications Found'}
                  </h4>
                  <p className="text-xs text-slate-600 max-w-md mx-auto">
                    {language === 'hi'
                      ? 'दिए गए विवरण से कोई आवेदन नहीं मिला। कृपया अपना 10 अंकों का मोबाइल नंबर जांचें या केंद्र से संपर्क करें।'
                      : 'We could not locate an application with that query. Please verify your 10-digit mobile number or contact Balaji Communication directly.'}
                  </p>
                  <div className="pt-2 flex items-center justify-center gap-3">
                    <Link
                      to="/apply"
                      className="px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold rounded-lg shadow-xs"
                    >
                      {language === 'hi' ? 'नया आवेदन करें' : 'Apply Online Now'}
                    </Link>
                    <a
                      href={`https://wa.me/${cleanWhatsApp}?text=${encodeURIComponent(`Hello Balaji Communication, I want to inquire about my application status for ${query}.`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg shadow-xs inline-flex items-center gap-1.5"
                    >
                      <MessageCircle className="w-3.5 h-3.5 fill-white" />
                      <span>WhatsApp Help</span>
                    </a>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {results.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-5 sm:p-6 rounded-2xl border border-slate-200 bg-white shadow-xs hover:border-blue-300 transition-colors space-y-4"
                    >
                      {/* Top Row: Ref ID, Service Name & Status Badge */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-mono text-xs font-extrabold text-blue-900 bg-blue-50 px-2 py-0.5 rounded border border-blue-200 inline-flex items-center gap-1.5">
                              <span>{item.enquiry_id}</span>
                            </span>
                            <button
                              type="button"
                              onClick={() => handleCopyId(item.enquiry_id)}
                              className="text-slate-400 hover:text-blue-700 p-0.5"
                              title="Copy Application ID"
                            >
                              {copiedId === item.enquiry_id ? (
                                <Check className="w-3.5 h-3.5 text-emerald-600" />
                              ) : (
                                <Copy className="w-3.5 h-3.5" />
                              )}
                            </button>
                          </div>
                          <h4 className="font-extrabold text-slate-900 text-base">
                            {item.service_name}
                          </h4>
                        </div>
                        <div>
                          {getStatusBadge(item.status)}
                        </div>
                      </div>

                      {/* Visual Timeline Progress */}
                      <div className="bg-slate-50/80 rounded-xl p-4 border border-slate-100">
                        {renderStepTimeline(item.status)}
                      </div>

                      {/* Details Grid */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs text-slate-600 pt-1">
                        <div>
                          <span className="text-slate-400 block text-[11px]">Applicant Name:</span>
                          <span className="font-bold text-slate-900 block truncate">
                            {item.customer_name || item.applicant_name}
                          </span>
                        </div>
                        <div>
                          <span className="text-slate-400 block text-[11px]">Location / Village:</span>
                          <span className="font-semibold text-slate-800 block truncate">
                            📍 {item.village || 'Gaini'}
                          </span>
                        </div>
                        <div>
                          <span className="text-slate-400 block text-[11px]">Submitted On:</span>
                          <span className="font-semibold text-slate-800 block">
                            {item.created_at ? new Date(item.created_at).toLocaleDateString() : 'Recent'}
                          </span>
                        </div>
                        <div>
                          <span className="text-slate-400 block text-[11px]">Contact Channel:</span>
                          <span className="font-semibold text-slate-800 block">
                            {item.preferred_contact}
                          </span>
                        </div>
                      </div>

                      {/* Actions Footer */}
                      <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
                        <span className="text-slate-500 text-[11px]">
                          Need urgent update from Kendra operator?
                        </span>
                        <div className="flex items-center gap-2">
                          <a
                            href={`https://wa.me/${cleanWhatsApp}?text=${encodeURIComponent(`Hello Balaji Communication, regarding my application ${item.enquiry_id} for ${item.service_name}. Current status: ${item.status}.`)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold rounded-lg transition-colors border border-emerald-200"
                          >
                            <MessageCircle className="w-3.5 h-3.5 fill-emerald-600 text-emerald-600" />
                            <span>WhatsApp Operator</span>
                          </a>
                          <a
                            href={`tel:${cleanPhone}`}
                            className="inline-flex items-center gap-1 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-lg transition-colors border border-slate-200"
                          >
                            <Phone className="w-3.5 h-3.5 text-blue-700" />
                            <span>Call Center</span>
                          </a>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

        </div>

        {/* Quick Contact Footer Bar */}
        <div className="mt-6 p-4 rounded-xl bg-white border border-slate-200 text-xs text-slate-600 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <div>
            <span className="font-bold text-slate-900 block">{settings.business_name_en} — {settings.business_name_hi}</span>
            <span>Shop, Masjid Bali Gali, Inter College Road, Gaini, Bareilly - 243302</span>
          </div>
          <div className="flex items-center gap-3">
            <a href={`tel:${cleanPhone}`} className="text-blue-700 hover:underline font-bold inline-flex items-center gap-1">
              <Phone className="w-3.5 h-3.5" />
              <span>{settings.phone_number}</span>
            </a>
          </div>
        </div>

      </div>
    </div>
  );
};

