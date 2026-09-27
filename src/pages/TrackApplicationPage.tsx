import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, CheckCircle2, Clock, AlertCircle, Phone, MessageCircle, ArrowLeft, Shield, FileText } from 'lucide-react';
import { useData } from '../context/DataContext';
import { useLanguage } from '../context/LanguageContext';

export const TrackApplicationPage: React.FC = () => {
  const { trackApplication, settings } = useData();
  const { language } = useLanguage();

  const [query, setQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [results, setResults] = useState<any[]>([]);
  const [searchError, setSearchError] = useState<string | null>(null);

  const cleanWhatsApp = (settings.whatsapp_number || '919870677605').replace(/\D/g, '');
  const cleanPhone = settings.phone_number || '+919870677605';

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setIsSearching(true);
    setSearchError(null);
    setHasSearched(true);

    const res = await trackApplication(query.trim());
    setIsSearching(false);

    if (res.success && res.results) {
      setResults(res.results);
    } else {
      setResults([]);
      setSearchError(res.error || 'No records found');
    }
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

  return (
    <div id="track-application-page" className="min-h-screen bg-slate-50 py-10 sm:py-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        
        {/* Back Link */}
        <div className="mb-6">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-700 hover:text-blue-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{language === 'hi' ? 'मुख्य पृष्ठ पर वापस' : 'Back to Home'}</span>
          </Link>
        </div>

        {/* Header Card */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
              Live Status Check
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {language === 'hi' ? 'आवेदन की स्थिति जांचें' : 'Track Application Status'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              {language === 'hi'
                ? 'अपना 10 अंकों का पंजीकृत मोबाइल नंबर या एप्लीकेशन आईडी दर्ज करके अपने आवेदन की वर्तमान स्थिति जानें।'
                : 'Enter your 10-digit mobile number or Application Reference ID to check real-time progress.'}
            </p>
          </div>

          {/* Search Bar */}
          <form onSubmit={handleTrack} className="max-w-xl mx-auto">
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="relative flex-1">
                <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  required
                  placeholder="e.g. 9870677605 or BALAJI-APP-..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600/30 focus:border-blue-600"
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
          </form>

          {/* RESULTS DISPLAY */}
          {hasSearched && (
            <div className="pt-6 border-t border-slate-100 space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                {language === 'hi' ? 'खोज परिणाम' : 'Search Results'} ({results.length})
              </h3>

              {results.length === 0 ? (
                <div className="text-center py-8 bg-slate-50 rounded-xl border border-slate-200/80 p-6 space-y-3">
                  <AlertCircle className="w-10 h-10 text-amber-500 mx-auto" />
                  <h4 className="text-sm font-bold text-slate-800">
                    {language === 'hi' ? 'कोई रिकॉर्ड नहीं मिला' : 'No Applications Found'}
                  </h4>
                  <p className="text-xs text-slate-600 max-w-md mx-auto">
                    {language === 'hi'
                      ? 'दिए गए विवरण से कोई आवेदन नहीं मिला। कृपया अपना 10 अंकों का मोबाइल नंबर जांचें या केंद्र से संपर्क करें।'
                      : 'We could not locate an application with that query. Please verify your mobile number or contact Balaji Communication directly.'}
                  </p>
                  <div className="pt-2 flex items-center justify-center gap-3">
                    <Link
                      to="/apply"
                      className="px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold rounded-lg shadow-xs"
                    >
                      {language === 'hi' ? 'नया आवेदन करें' : 'Apply Online Now'}
                    </Link>
                    <a
                      href={`https://wa.me/${cleanWhatsApp}?text=${encodeURIComponent(`Hello Balaji Communication, I want to inquire about my application status.`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg shadow-xs inline-flex items-center gap-1.5"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span>WhatsApp Help</span>
                    </a>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {results.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-5 rounded-xl border border-slate-200 bg-white shadow-xs hover:border-blue-300 transition-colors space-y-3"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div>
                          <span className="font-mono text-xs font-bold text-blue-800 block">
                            {item.enquiry_id}
                          </span>
                          <h4 className="font-bold text-slate-900 text-sm">
                            {item.service_name}
                          </h4>
                        </div>
                        <div>
                          {getStatusBadge(item.status)}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs text-slate-600 pt-2 border-t border-slate-100">
                        <div>
                          <span className="text-slate-400 block">Applicant:</span>
                          <span className="font-semibold text-slate-800">{item.customer_name}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block">Submitted On:</span>
                          <span className="font-semibold text-slate-800">
                            {item.created_at ? new Date(item.created_at).toLocaleDateString() : 'Recent'}
                          </span>
                        </div>
                        <div>
                          <span className="text-slate-400 block">Preferred Contact:</span>
                          <span className="font-semibold text-slate-800">{item.preferred_contact}</span>
                        </div>
                      </div>

                      <div className="pt-2 flex items-center justify-between gap-2 text-xs">
                        <span className="text-slate-500 text-[11px]">
                          Need urgent assistance with this request?
                        </span>
                        <a
                          href={`https://wa.me/${cleanWhatsApp}?text=${encodeURIComponent(`Hello Balaji Communication, regarding my application ${item.enquiry_id} for ${item.service_name}.`)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-emerald-700 hover:text-emerald-800 font-bold"
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                          <span>Chat on WhatsApp</span>
                        </a>
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
            <span>Gaini, Bareilly, Uttar Pradesh - 243302</span>
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
