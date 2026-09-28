import React from 'react';
import { Link } from 'react-router-dom';
import { Layers, PhoneCall, FileCheck, CheckCircle2, ArrowRight, ShieldCheck, Clock, FileText, HelpCircle, Phone, MessageCircle } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useData } from '../context/DataContext';

export const HowItWorksPage: React.FC = () => {
  const { language, t } = useLanguage();
  const { settings, openEnquiryModal } = useData();

  const cleanWhatsApp = (settings.whatsapp_number || '919870677605').replace(/\D/g, '');
  const cleanPhone = settings.phone_number || '+919870677605';

  const steps = [
    {
      number: '01',
      icon: Layers,
      color: 'bg-blue-50 text-blue-700 border-blue-200',
      titleEn: '1. Select Your Required Service',
      titleHi: '1. अपनी आवश्यक सेवा चुनें',
      descEn: 'Browse our catalog of 30+ citizen services including Aadhaar updates, Ration Card, PM Kisan e-KYC, UP Income/Caste certificates, PAN card, and Ayushman Bharat.',
      descHi: 'हमारी 30+ सरकारी सेवाओं की सूची में से आधार सुधार, राशन कार्ड, पीएम किसान, आय/जाति प्रमाण पत्र अथवा पैन कार्ड जैसी अपनी सेवा चुनें।',
      tipsEn: 'Check the checklist of required documents before proceeding.',
      tipsHi: 'आवेदन करने से पूर्व अनिवार्य दस्तावेजों की सूची अवश्य देख लें।'
    },
    {
      number: '02',
      icon: PhoneCall,
      color: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      titleEn: '2. Submit Application Online or on WhatsApp',
      titleHi: '2. ऑनलाइन फॉर्म भरें अथवा व्हाट्सएप पर संपर्क करें',
      descEn: 'Submit your basic details online using our Direct Application form, or click WhatsApp to talk directly with our Kendra operator at Gaini Bareilly.',
      descHi: 'हमारी वेबसाइट पर "ऑनलाइन आवेदन" फॉर्म भरें या व्हाट्सएप पर सीधे हमारे गैनी केंद्र संचालक से संपर्क करके विवरण साझा करें।',
      tipsEn: 'You will receive an instant Application ID for live status tracking.',
      tipsHi: 'आवेदन के तुरंत बाद आपको एक यूनिक एप्लीकेशन आईडी प्राप्त होगी।'
    },
    {
      number: '03',
      icon: FileCheck,
      color: 'bg-amber-50 text-amber-700 border-amber-200',
      titleEn: '3. Verification & Official Portal Submission',
      titleHi: '3. दस्तावेज सत्यापन एवं आधिकारिक पोर्टल पर सबमिशन',
      descEn: 'Our trained CSC operator verifies all proof of identity/address documents, scans them according to government portal criteria, and submits the file on UP eDistrict or central ministry portal.',
      descHi: 'हमारे अनुभवी संचालक आपके दस्तावेजों की जांच करते हैं, उन्हें सरकारी मानकों के अनुसार स्कैन करते हैं और आधिकारिक ई-डिस्ट्रिक्ट पोर्टल पर आवेदन दाखिल करते हैं।',
      tipsEn: 'Official government treasury receipt and acknowledgement slip are generated.',
      tipsHi: 'आधिकारिक सरकारी चालान रसीद और पावती पर्ची तत्काल सुरक्षित की जाती है।'
    },
    {
      number: '04',
      icon: CheckCircle2,
      color: 'bg-indigo-50 text-indigo-700 border-indigo-200',
      titleEn: '4. Delivery & Track Progress to Completion',
      titleHi: '4. स्थिति ट्रैक करें एवं पूर्ण प्रमाण पत्र प्राप्त करें',
      descEn: 'Track your application status live on our portal. Once approved by the Tehsildar or respective department, collect your verified colored printout or PVC smart card from our Kendra.',
      descHi: 'पोर्टल पर कभी भी अपने आवेदन की स्थिति जांचें। संबंधित विभाग द्वारा अनुमोदन के उपरांत केंद्र से अपना लैमिनेटेड प्रमाण पत्र या पीवीसी कार्ड प्राप्त करें।',
      tipsEn: 'SMS alerts and WhatsApp notifications keep you informed.',
      tipsHi: 'आवेदन के प्रत्येक चरण की सूचना आपको फोन या व्हाट्सएप पर मिलती रहेगी।'
    }
  ];

  const faqs = [
    {
      qEn: 'Do I need to visit the Kendra physically or can I apply from home?',
      qHi: 'क्या मुझे केंद्र पर आना होगा या घर बैठे आवेदन हो सकता है?',
      aEn: 'For services requiring physical biometrics (fingerprint/iris) like new Aadhaar enrollment or thumb e-KYC, visiting our shop in Gaini is mandatory. For certificates, PAN card, and online forms, you can apply online from home and pick up the printout later.',
      aHi: 'बायोमेट्रिक फिंगरप्रिंट वाली सेवाओं (जैसे आधार बायोमेट्रिक या थंब ई-केवाईसी) के लिए केंद्र पर आना अनिवार्य है। आय/जाति प्रमाण पत्र, पैन कार्ड एवं फॉर्म घर बैठे ऑनलाइन भरे जा सकते हैं।'
    },
    {
      qEn: 'How can I track the progress of my application?',
      qHi: 'मैं अपने आवेदन की स्थिति कैसे देख सकता हूँ?',
      aEn: 'Simply visit the "Track Status" page and enter your Application Token Number (e.g. ENQ-2026-...) or your 10-digit mobile number to view real-time status updates.',
      aHi: 'वेबसाइट के "आवेदन स्थिति" (Track Status) पेज पर जाएं और अपना एप्लीकेशन नंबर या 10 अंकों का मोबाइल नंबर डालकर लाइव स्थिति देख सकते हैं।'
    },
    {
      qEn: 'What are the charges for Jan Seva Kendra services?',
      qHi: 'जन सेवा केंद्र की सेवाओं का क्या शुल्क है?',
      aEn: 'All government fees are transparently displayed according to official state treasury and CSC guidelines with no hidden fees.',
      aHi: 'सभी सेवाओं का सरकारी निर्धारित शुल्क और कंप्यूटर संचालन शुल्क पूर्णतः पारदर्शी है और पोर्टल की दर सूची में देखा जा सकता है।'
    }
  ];

  return (
    <div id="how-it-works-page" className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto space-y-10">
        
        {/* Breadcrumb Header */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
            <Link to="/" className="hover:text-blue-700 transition-colors">
              {t('navHome')}
            </Link>
            <span>/</span>
            <span className="text-blue-700 font-bold">{t('navHowItWorks')}</span>
          </div>

          <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 rounded-2xl p-6 sm:p-10 text-white shadow-xl relative overflow-hidden">
            <div className="relative z-10 max-w-2xl space-y-3">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-bold uppercase tracking-wider border border-blue-400/30">
                <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
                <span>{language === 'hi' ? 'नागरिक सेवा मार्गदर्शिका' : 'Citizen Service Workflow'}</span>
              </span>
              <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
                {language === 'hi' ? 'सेवा प्राप्त करने की संपूर्ण प्रक्रिया' : 'How Balaji Jan Seva Kendra Works'}
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                {language === 'hi'
                  ? 'गैनी, बरेली स्थित हमारे जन सेवा केंद्र पर नागरिकों को पारदर्शी, त्वरित एवं सुरक्षित सेवाएं प्रदान करने का सरल 4-चरणीय विवरण।'
                  : 'A simple, transparent 4-step guide on how we process your government applications, documentation, and digital verifications at Gaini, Bareilly.'}
              </p>
            </div>
          </div>
        </div>

        {/* 4 Detailed Steps */}
        <div className="space-y-6">
          <div className="text-center max-w-xl mx-auto space-y-1">
            <h2 className="text-xl sm:text-2xl font-black text-slate-900">
              {language === 'hi' ? '4 आसान चरणों में काम पूरा' : 'Complete in 4 Simple Steps'}
            </h2>
            <p className="text-xs text-slate-600">
              {language === 'hi' ? 'दस्तावेज चयन से लेकर अंतिम डिलीवरी तक की पूरी रूपरेखा' : 'From selecting required service to final certificate delivery'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {steps.map((st) => {
              const Icon = st.icon;
              return (
                <div
                  key={st.number}
                  className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center border ${st.color}`}>
                        <Icon className="w-6 h-6" />
                      </div>
                      <span className="text-3xl font-black text-slate-200">
                        {st.number}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-slate-900">
                      {language === 'hi' ? st.titleHi : st.titleEn}
                    </h3>

                    <p className="text-xs text-slate-600 leading-relaxed">
                      {language === 'hi' ? st.descHi : st.descEn}
                    </p>
                  </div>

                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-[11px] text-slate-700 flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>
                      <strong className="text-slate-900">{language === 'hi' ? 'सुझाव: ' : 'Helpful Tip: '}</strong>
                      {language === 'hi' ? st.tipsHi : st.tipsEn}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* FAQs Section */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-4">
            <HelpCircle className="w-5 h-5 text-blue-600" />
            <h3 className="text-lg font-bold text-slate-900">
              {language === 'hi' ? 'अक्सर पूछे जाने वाले प्रश्न (FAQs)' : 'Frequently Asked Questions'}
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {faqs.map((faq, i) => (
              <div key={i} className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <h4 className="text-xs font-bold text-slate-900">
                  {language === 'hi' ? faq.qHi : faq.qEn}
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {language === 'hi' ? faq.aHi : faq.aEn}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Call to Action Banner */}
        <div className="bg-gradient-to-r from-blue-700 to-indigo-800 rounded-2xl p-6 sm:p-8 text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-md">
          <div className="space-y-1 text-center sm:text-left">
            <h3 className="text-lg sm:text-xl font-extrabold">
              {language === 'hi' ? 'क्या आपको किसी सेवा में तुरंत मदद चाहिए?' : 'Need Immediate Help With Any Application?'}
            </h3>
            <p className="text-xs sm:text-sm text-blue-100">
              {language === 'hi'
                ? 'हमारे केंद्र संचालक से सीधे फोन या व्हाट्सएप पर बात करें अथवा ऑनलाइन आवेदन करें।'
                : 'Connect directly with Balaji Communication Gaini via Call, WhatsApp, or Online Application.'}
            </p>
          </div>

          <div className="flex items-center gap-3 flex-wrap justify-center">
            <Link
              to="/apply"
              className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold rounded-xl text-xs transition-colors shadow-sm"
            >
              <span>{language === 'hi' ? 'ऑनलाइन आवेदन' : 'Apply Online'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            <a
              href={`https://wa.me/${cleanWhatsApp}?text=${encodeURIComponent('Hello Balaji Communication, I need help with service application.')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs transition-colors shadow-sm"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>WhatsApp</span>
            </a>
          </div>
        </div>

      </div>
    </div>
  );
};
