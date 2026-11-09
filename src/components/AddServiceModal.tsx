import React, { useState } from 'react';
import { X, Plus, Sparkles, Image as ImageIcon, Copy, Check, Trash2, Layers, AlertCircle, FileText, CheckCircle2 } from 'lucide-react';
import { useData } from '../context/DataContext';
import { useLanguage } from '../context/LanguageContext';
import { SERVICE_PHOTO_PRESETS } from '../data/hardcodedServices';
import { Service } from '../types';

export const AddServiceModal: React.FC = () => {
  const { isAddServiceModalOpen, closeAddServiceModal, addService, deleteService, services, categories, isAdminLoggedIn } = useData();
  const { language } = useLanguage();

  const [activeTab, setActiveTab] = useState<'create' | 'manage'>('create');

  // Form State
  const [nameEn, setNameEn] = useState('');
  const [nameHi, setNameHi] = useState('');
  const [category, setCategory] = useState('Other Digital Services');
  const [customCategory, setCustomCategory] = useState('');
  const [selectedPhotoUrl, setSelectedPhotoUrl] = useState(SERVICE_PHOTO_PRESETS[0].url);
  const [customPhotoUrl, setCustomPhotoUrl] = useState('');
  const [descEn, setDescEn] = useState('');
  const [descHi, setDescHi] = useState('');
  const [docsInput, setDocsInput] = useState('Original Aadhaar Card (मूल आधार कार्ड)\nActive Mobile Number (चालू मोबाइल नंबर)\nBank Passbook (बैंक पासबुक)');
  const [estimatedTime, setEstimatedTime] = useState('1-3 Days');
  const [isPopular, setIsPopular] = useState(false);

  // Success state & code snippet
  const [createdService, setCreatedService] = useState<Service | null>(null);
  const [generatedCode, setGeneratedCode] = useState<string>('');
  const [isCopied, setIsCopied] = useState(false);
  const [formError, setFormError] = useState('');

  // Can only be accessed after admin login
  if (!isAddServiceModalOpen || !isAdminLoggedIn) return null;

  const effectivePhotoUrl = customPhotoUrl.trim() || selectedPhotoUrl;
  const effectiveCategory = category === '__custom__' ? (customCategory.trim() || 'Other Digital Services') : category;

  // Custom services currently in state
  const customServicesList = services.filter(s => s.service_id.startsWith('srv-custom-'));

  const handleQuickDocAdd = (docName: string) => {
    if (!docsInput.includes(docName)) {
      setDocsInput(prev => prev ? `${prev}\n${docName}` : docName);
    }
  };

  const handleResetForm = () => {
    setNameEn('');
    setNameHi('');
    setCategory('Other Digital Services');
    setCustomCategory('');
    setSelectedPhotoUrl(SERVICE_PHOTO_PRESETS[0].url);
    setCustomPhotoUrl('');
    setDescEn('');
    setDescHi('');
    setDocsInput('Original Aadhaar Card (मूल आधार कार्ड)\nActive Mobile Number (चालू मोबाइल नंबर)');
    setEstimatedTime('1-3 Days');
    setIsPopular(false);
    setCreatedService(null);
    setGeneratedCode('');
    setIsCopied(false);
    setFormError('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!nameEn.trim()) {
      setFormError('Please enter the Service Name in English.');
      return;
    }

    const docList = docsInput
      .split('\n')
      .map(d => d.trim())
      .filter(Boolean);

    const result = addService({
      service_name_en: nameEn.trim(),
      service_name_hi: nameHi.trim() || nameEn.trim(),
      category: effectiveCategory,
      image_url: effectivePhotoUrl,
      short_description_en: descEn.trim() || `Apply for ${nameEn.trim()} online at Jan Seva Kendra.`,
      short_description_hi: descHi.trim() || `${nameHi.trim() || nameEn.trim()} हेतु जन सेवा केंद्र पर ऑनलाइन आवेदन एवं सहायता।`,
      full_description_en: descEn.trim() || `Complete online application and verification assistance for ${nameEn.trim()}.`,
      full_description_hi: descHi.trim() || `${nameHi.trim() || nameEn.trim()} हेतु आवश्यक दस्तावेज एवं ऑनलाइन पोर्टल सहायता।`,
      required_documents: docList.length > 0 ? docList : ['Original Aadhaar Card', 'Mobile Number'],
      estimated_time: estimatedTime.trim() || '1-3 Days',
      popular: isPopular,
      icon: 'Sparkles'
    });

    if (result.success) {
      setCreatedService(result.service);
      setGeneratedCode(result.codeSnippet);
    }
  };

  const handleCopyCode = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2500);
    } catch (err) {
      // Fallback
      const ta = document.createElement('textarea');
      ta.value = code;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2500);
    }
  };

  return (
    <div
      id="add-service-modal-backdrop"
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4"
      onClick={closeAddServiceModal}
    >
      <div
        id="add-service-modal-content"
        className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl overflow-hidden border border-slate-200 relative my-6 flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-700 to-indigo-800 text-white p-5 sm:p-6 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-amber-300 font-bold">
              <Plus className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-extrabold leading-tight">
                {language === 'hi' ? 'नई सेवा कोड जनरेटर (हार्डकोडेड इन कोड)' : 'Add Service (Hardcoded in Code)'}
              </h2>
              <p className="text-xs text-blue-100 mt-0.5">
                {language === 'hi' ? 'सेवा कोड सीधे src/data/hardcodedServices.ts में जुड़ेगा (कैश या शीट में नहीं)।' : 'Generates clean code for src/data/hardcodedServices.ts (not in cache or sheets).'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={closeAddServiceModal}
            className="text-white/80 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switcher */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-5 pt-3 gap-2 shrink-0">
          <button
            type="button"
            onClick={() => setActiveTab('create')}
            className={`pb-2.5 px-3 text-xs font-bold border-b-2 transition-colors cursor-pointer ${
              activeTab === 'create'
                ? 'border-blue-700 text-blue-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            + {language === 'hi' ? 'नई सेवा जोड़ें' : 'Add New Service'}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('manage')}
            className={`pb-2.5 px-3 text-xs font-bold border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'manage'
                ? 'border-blue-700 text-blue-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>{language === 'hi' ? 'जोड़ी गई सेवाएं प्रबंधित करें' : 'Manage Custom Services'}</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-slate-200 text-slate-700 font-bold">
              {customServicesList.length}
            </span>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 flex-1">

          {/* TAB 1: CREATE NEW SERVICE */}
          {activeTab === 'create' && (
            <>
              {/* Success Notification & Hardcoded Code Presentation */}
              {createdService ? (
                <div className="space-y-5 animate-in fade-in duration-200">
                  {/* Status banner */}
                  <div className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white rounded-2xl p-4 sm:p-5 shadow-sm flex items-start gap-3.5">
                    <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-xs flex items-center justify-center shrink-0 text-emerald-100">
                      <CheckCircle2 className="w-6 h-6" />
                    </div>
                    <div className="space-y-1 flex-1">
                      <h3 className="text-base font-extrabold tracking-tight">
                        {language === 'hi' ? 'हार्डकोडेड सेवा कोड तैयार है!' : 'Hardcoded Service Code Generated!'}
                      </h3>
                      <p className="text-xs text-emerald-100 leading-relaxed">
                        {language === 'hi'
                          ? `"${createdService.service_name_en}" का कोड सफलतापूर्वक तैयार कर दिया गया है। नीचे दिए गए कोड को कॉपी करके सीधे src/data/hardcodedServices.ts में पेस्ट करें।`
                          : `Code for "${createdService.service_name_en}" is ready! Copy the code snippet below and paste it directly into src/data/hardcodedServices.ts.`}
                      </p>
                    </div>
                  </div>

                  {/* Visual Preview of the configured service */}
                  <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center gap-4">
                    <img
                      src={createdService.image_url}
                      alt={createdService.service_name_en}
                      className="w-20 h-20 rounded-xl object-cover shrink-0 border border-slate-300 shadow-2xs"
                    />
                    <div className="space-y-1 flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-xs font-extrabold text-slate-900 truncate">
                          {createdService.service_name_en}
                        </span>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800">
                          {createdService.category}
                        </span>
                        {createdService.popular && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                            ★ Popular
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-600 font-medium">
                        {createdService.service_name_hi}
                      </p>
                      <p className="text-[11px] text-slate-500 truncate">
                        Est. Time: {createdService.estimated_time} | Docs: {createdService.required_documents?.length || 0} required
                      </p>
                    </div>
                  </div>

                  {/* PROMINENT HARDCODED CODE SNIPPET BOX */}
                  <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden shadow-lg">
                    {/* Code block header with 1-click copy */}
                    <div className="bg-slate-800/90 px-4 py-3 flex flex-wrap items-center justify-between gap-2.5 border-b border-slate-700/80">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-emerald-400" />
                        <span className="text-xs font-mono font-bold text-slate-200">
                          src/data/hardcodedServices.ts
                        </span>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-semibold">
                          TypeScript Object
                        </span>
                      </div>

                      <button
                        type="button"
                        id="btn-copy-service-hardcode"
                        onClick={() => handleCopyCode(generatedCode)}
                        className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold flex items-center gap-1.5 transition-all cursor-pointer shadow-sm ${
                          isCopied
                            ? 'bg-emerald-500 text-white scale-105'
                            : 'bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white'
                        }`}
                      >
                        {isCopied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                        <span>{isCopied ? '✓ Copied to Clipboard!' : 'Copy Code to Clipboard'}</span>
                      </button>
                    </div>

                    {/* Code block */}
                    <div className="p-4 overflow-x-auto max-h-56 scrollbar-thin">
                      <pre className="text-xs font-mono text-emerald-300 leading-relaxed selection:bg-blue-600 selection:text-white">
                        {generatedCode}
                      </pre>
                    </div>
                  </div>

                  {/* Step-by-step instructions */}
                  <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 sm:p-5 space-y-2 text-xs text-blue-950">
                    <div className="font-extrabold text-blue-900 flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-blue-700" />
                      <span>{language === 'hi' ? 'सीधे कोड में जोड़ने का आसान तरीका:' : 'How to Add Directly in Code:'}</span>
                    </div>
                    <ol className="list-decimal pl-5 space-y-1.5 text-blue-900 font-medium text-[11px] sm:text-xs">
                      <li>
                        {language === 'hi' ? (
                          <span>ऊपर <strong>"Copy Code to Clipboard"</strong> बटन पर क्लिक करें।</span>
                        ) : (
                          <span>Click the blue <strong>"Copy Code to Clipboard"</strong> button above.</span>
                        )}
                      </li>
                      <li>
                        {language === 'hi' ? (
                          <span>अपने कोड एडिटर या GitHub में <code>src/data/hardcodedServices.ts</code> फ़ाइल खोलें।</span>
                        ) : (
                          <span>Open file <code>src/data/hardcodedServices.ts</code> in your editor or GitHub repository.</span>
                        )}
                      </li>
                      <li>
                        {language === 'hi' ? (
                          <span><code>HARDCODED_SERVICES = [</code> के अंदर सबसे ऊपर इस कोड को पेस्ट कर दें।</span>
                        ) : (
                          <span>Paste this code inside the <code>HARDCODED_SERVICES = [</code> array.</span>
                        )}
                      </li>
                      <li>
                        {language === 'hi' ? (
                          <span>फ़ाइल सेव करें। सेवा हमेशा के लिए वेबसाइट पर हार्डकोडेड रहेगी (बिना किसी डेटाबेस या शीट के)!</span>
                        ) : (
                          <span>Save/commit the file. The service will be permanently hardcoded in the website (no backend/sheet needed)!</span>
                        )}
                      </li>
                    </ol>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                    <button
                      type="button"
                      onClick={handleResetForm}
                      className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl transition-colors cursor-pointer flex items-center gap-1.5"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>{language === 'hi' ? '+ एक और सेवा का कोड बनाएं' : '+ Add Another Service'}</span>
                    </button>

                    <div className="flex items-center gap-2.5">
                      <button
                        type="button"
                        onClick={() => {
                          handleCopyCode(generatedCode);
                        }}
                        className="px-4 py-2.5 bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold rounded-xl transition-colors cursor-pointer flex items-center gap-1.5 shadow-xs"
                      >
                        <Copy className="w-3.5 h-3.5" />
                        <span>{isCopied ? 'Copied!' : 'Copy Code'}</span>
                      </button>

                      <button
                        type="button"
                        onClick={closeAddServiceModal}
                        className="px-4 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-xl transition-colors cursor-pointer shadow-xs"
                      >
                        {language === 'hi' ? 'वेबसाइट पर देखें' : 'View on Website'}
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  {formError && (
                    <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                      <span>{formError}</span>
                    </div>
                  )}

                  {/* 1. Service Titles (English & Hindi) */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Service Name in English <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={nameEn}
                        onChange={(e) => setNameEn(e.target.value)}
                        placeholder="e.g. E-Shram Card Registration"
                        className="w-full px-3 py-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        सेवा का नाम हिंदी में (Hindi)
                      </label>
                      <input
                        type="text"
                        value={nameHi}
                        onChange={(e) => setNameHi(e.target.value)}
                        placeholder="उदा. ई-श्रम कार्ड नया पंजीकरण"
                        className="w-full px-3 py-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                      />
                    </div>
                  </div>

                  {/* 2. Category */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Category / विभाग
                    </label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full px-3 py-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 cursor-pointer"
                    >
                      {categories.filter(c => c !== 'All').map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                      <option value="__custom__">+ Enter Custom Category...</option>
                    </select>
                    {category === '__custom__' && (
                      <input
                        type="text"
                        value={customCategory}
                        onChange={(e) => setCustomCategory(e.target.value)}
                        placeholder="Type new category name..."
                        className="w-full mt-2 px-3 py-2 text-xs bg-white border border-blue-400 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                      />
                    )}
                  </div>

                  {/* 3. Picture / Photo Selection */}
                  <div className="space-y-2">
                    <label className="block text-xs font-bold text-slate-700">
                      Service Photo / फोटो (1-Click Presets or Custom URL)
                    </label>

                    {/* Presets Grid */}
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                      {SERVICE_PHOTO_PRESETS.map((preset, idx) => {
                        const isSelected = selectedPhotoUrl === preset.url && !customPhotoUrl.trim();
                        return (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => {
                              setSelectedPhotoUrl(preset.url);
                              setCustomPhotoUrl('');
                            }}
                            className={`relative rounded-xl overflow-hidden border text-left transition-all p-1 group cursor-pointer ${
                              isSelected
                                ? 'border-blue-600 ring-2 ring-blue-500/30 bg-blue-50'
                                : 'border-slate-200 hover:border-slate-300 bg-slate-50'
                            }`}
                          >
                            <img
                              src={preset.url}
                              alt={preset.label}
                              className="w-full h-14 object-cover rounded-lg"
                            />
                            <p className="text-[10px] font-bold text-slate-800 truncate mt-1">
                              {preset.label}
                            </p>
                            {isSelected && (
                              <div className="absolute top-2 right-2 bg-blue-600 text-white rounded-full p-0.5">
                                <Check className="w-2.5 h-2.5" />
                              </div>
                            )}
                          </button>
                        );
                      })}
                    </div>

                    {/* Custom Image URL fallback */}
                    <div className="pt-1">
                      <input
                        type="url"
                        value={customPhotoUrl}
                        onChange={(e) => setCustomPhotoUrl(e.target.value)}
                        placeholder="Or paste custom image link (https://images.unsplash.com/...)"
                        className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                      />
                    </div>
                  </div>

                  {/* 4. Descriptions */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Short Description (English)
                      </label>
                      <textarea
                        rows={2}
                        value={descEn}
                        onChange={(e) => setDescEn(e.target.value)}
                        placeholder="Brief 1-2 sentence description..."
                        className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        संक्षिप्त विवरण (Hindi)
                      </label>
                      <textarea
                        rows={2}
                        value={descHi}
                        onChange={(e) => setDescHi(e.target.value)}
                        placeholder="संक्षिप्त 1-2 पंक्तियों का विवरण..."
                        className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                      />
                    </div>
                  </div>

                  {/* 5. Required Documents */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Required Documents (One per line)
                    </label>
                    {/* Quick doc chips */}
                    <div className="flex flex-wrap gap-1.5 mb-2">
                      <span className="text-[10px] text-slate-500 self-center">Quick add:</span>
                      {[
                        'Original Aadhaar Card (आधार कार्ड)',
                        'Bank Passbook (बैंक पासबुक)',
                        'Mobile Number for OTP (मोबाइल)',
                        'Passport Size Photo (फोटो)',
                        'Income Certificate (आय प्रमाण)',
                        'Ration Card (राशन कार्ड)'
                      ].map(chip => (
                        <button
                          key={chip}
                          type="button"
                          onClick={() => handleQuickDocAdd(chip)}
                          className="text-[10px] font-semibold px-2 py-0.5 rounded-lg bg-slate-100 hover:bg-blue-50 hover:text-blue-700 border border-slate-200 transition-colors cursor-pointer"
                        >
                          + {chip.split(' ')[0]}
                        </button>
                      ))}
                    </div>
                    <textarea
                      rows={3}
                      value={docsInput}
                      onChange={(e) => setDocsInput(e.target.value)}
                      placeholder="Aadhaar Card&#10;Mobile Number&#10;Bank Passbook"
                      className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-mono text-[11px]"
                    />
                  </div>

                  {/* 6. Estimated Time & Popular Toggle */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 items-center">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Estimated Processing Time
                      </label>
                      <input
                        type="text"
                        value={estimatedTime}
                        onChange={(e) => setEstimatedTime(e.target.value)}
                        placeholder="e.g. Instant / 24-48 Hours / 3-7 Days"
                        className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                      />
                    </div>

                    <div className="pt-4 sm:pt-5">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={isPopular}
                          onChange={(e) => setIsPopular(e.target.checked)}
                          className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500 cursor-pointer"
                        />
                        <span className="text-xs font-bold text-slate-800">
                          Mark as Popular Service (मुख्य सेवा)
                        </span>
                      </label>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
                    <button
                      type="button"
                      onClick={closeAddServiceModal}
                      className="px-4 py-2.5 text-xs font-bold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
                    >
                      {language === 'hi' ? 'रद्द करें' : 'Cancel'}
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2.5 text-xs font-bold text-white bg-blue-700 hover:bg-blue-800 active:bg-blue-900 rounded-xl shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                      <span>{language === 'hi' ? 'सेवा सुरक्षित करें और दिखाएं' : 'Save & Show Service'}</span>
                    </button>
                  </div>
                </form>
              )}
            </>
          )}

          {/* TAB 2: MANAGE CUSTOM SERVICES */}
          {activeTab === 'manage' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    {language === 'hi' ? 'आपके द्वारा जोड़ी गई सेवाएं' : 'Custom Services Added'}
                  </h3>
                  <p className="text-xs text-slate-500">
                    {language === 'hi' ? 'यह सेवाएं तुरंत ब्राउज़र मेमोरी में सुरक्षित हैं और हमेशा दिखाई देती हैं।' : 'These services are stored in local storage and shown always without backend.'}
                  </p>
                </div>
                {customServicesList.length > 0 && (
                  <button
                    type="button"
                    onClick={() => {
                      const allCode = customServicesList.map(s => `  ${JSON.stringify(s, null, 2)}`).join(',\n');
                      handleCopyCode(allCode);
                    }}
                    className="px-3 py-1.5 text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg flex items-center gap-1.5 border border-slate-300 transition-colors cursor-pointer"
                  >
                    {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-slate-600" />}
                    <span>{isCopied ? 'Copied All!' : 'Copy All Code'}</span>
                  </button>
                )}
              </div>

              {customServicesList.length > 0 ? (
                <div className="divide-y divide-slate-100 border border-slate-200 rounded-2xl overflow-hidden bg-slate-50/50">
                  {customServicesList.map(srv => (
                    <div key={srv.service_id} className="p-3.5 sm:p-4 flex items-center justify-between gap-3 bg-white hover:bg-slate-50 transition-colors">
                      <div className="flex items-center gap-3">
                        <img
                          src={srv.image_url}
                          alt={srv.service_name_en}
                          className="w-12 h-12 rounded-xl object-cover shrink-0 border border-slate-200"
                        />
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="text-xs sm:text-sm font-bold text-slate-900">
                              {srv.service_name_en}
                            </h4>
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                              {srv.category}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-500 truncate max-w-sm mt-0.5">
                            {srv.service_name_hi}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          type="button"
                          onClick={() => {
                            if (window.confirm(`Are you sure you want to delete "${srv.service_name_en}"?`)) {
                              deleteService(srv.service_id);
                            }
                          }}
                          className="p-2 text-rose-600 hover:text-white hover:bg-rose-600 rounded-lg transition-colors border border-rose-200 cursor-pointer"
                          title="Delete Service"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-10 px-4 bg-slate-50 rounded-2xl border border-dashed border-slate-300 space-y-2">
                  <p className="text-xs font-bold text-slate-700">
                    {language === 'hi' ? 'अभी तक कोई नई सेवा नहीं जोड़ी गई है' : 'No custom services added yet'}
                  </p>
                  <p className="text-xs text-slate-500 max-w-xs mx-auto">
                    {language === 'hi'
                      ? 'डिफ़ॉल्ट 16 सेवाएं सीधे कोड से लोड हो रही हैं। आप ऊपर "नई सेवा जोड़ें" पर क्लिक करके नई सेवा जोड़ सकते हैं।'
                      : 'The default 16 services are currently displaying. Switch to "Add New Service" to create one.'}
                  </p>
                  <button
                    type="button"
                    onClick={() => setActiveTab('create')}
                    className="mt-2 px-3.5 py-1.5 text-xs font-bold bg-blue-700 text-white rounded-xl hover:bg-blue-800 transition-colors cursor-pointer"
                  >
                    + {language === 'hi' ? 'पहली सेवा जोड़ें' : 'Add First Service'}
                  </button>
                </div>
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
