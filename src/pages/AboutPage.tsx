import React from 'react';
import { Shield, CheckCircle2, Clock, MapPin, Users, HeartHandshake, Phone, MessageCircle, ArrowRight } from 'lucide-react';
import { useData } from '../context/DataContext';
import { useLanguage } from '../context/LanguageContext';
import { Link } from 'react-router-dom';

export const AboutPage: React.FC = () => {
  const { settings, openEnquiryModal } = useData();
  const { language, t } = useLanguage();

  const cleanWhatsApp = (settings.whatsapp_number || '919876543210').replace(/\D/g, '');
  const cleanPhone = settings.phone_number || '+919876543210';

  return (
    <div id="about-page" className="min-h-screen bg-slate-50 py-12 sm:py-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 space-y-12">
        
        {/* Main Header */}
        <div className="text-center space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-700 bg-blue-100/70 px-3 py-1 rounded-full border border-blue-200">
            {language === 'hi' ? 'हमारे बारे में' : 'About Our Center'}
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            {language === 'hi' ? 'बालाजी कम्युनिकेशन (जन सेवा केंद्र)' : 'About Balaji Communication Jan Seva Kendra'}
          </h1>
          <p className="text-sm text-slate-600 max-w-2xl mx-auto leading-relaxed">
            {language === 'hi' ? settings.subtitle_hi : settings.subtitle_en}
          </p>
        </div>

        {/* Story & Mission Box */}
        <div className="bg-white rounded-2xl p-6 sm:p-10 border border-slate-200 shadow-sm space-y-6">
          <div className="prose prose-slate max-w-none text-slate-700 text-sm sm:text-base leading-relaxed space-y-4">
            <p className="font-semibold text-slate-900 text-base sm:text-lg">
              {language === 'hi' ? settings.about_us_hi : settings.about_us_en}
            </p>
            <p>
              {language === 'hi'
                ? 'आज के डिजिटल युग में कई नागरिक ऑनलाइन फॉर्म भरने, आधार कार्ड में सुधार, राशन कार्ड में यूनिट जोड़ने, किसान सम्मान निधि या आयुष्मान भारत कार्ड बनाने की तकनीकी प्रक्रिया से असहज महसूस करते हैं। बालाजी कम्युनिकेशन का उद्देश्य हर नागरिक को आसान, सम्मानजनक और सटीक सहायता उपलब्ध कराना है।'
                : 'In today’s digital era, many citizens find it challenging to navigate complex online portals for Aadhaar updates, Ration card changes, PM Kisan verification, or Ayushman Bharat health cards. Balaji Communication bridges this gap by offering reliable and friendly one-stop assistance.'}
            </p>
            <p>
              {language === 'hi'
                ? 'हमारे केंद्र पर बायोमेट्रिक सत्यापन, सुरक्षित प्रिंटिंग, दस्तावेज़ स्कैनिंग और ई-डिस्ट्रिक्ट पोर्टल के तहत आय, जाति व निवास प्रमाण पत्र के आवेदन त्वरित गति से पूर्ण किए जाते हैं।'
                : 'Our center is equipped with verified digital infrastructure, high-resolution printing, document scanning, and authorized e-District submission workflows.'}
            </p>
          </div>

          {/* Key Principles Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-slate-100">
            <div className="p-4 rounded-xl bg-blue-50/60 border border-blue-100 text-center space-y-2">
              <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center mx-auto">
                <Shield className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-sm text-slate-900">
                {language === 'hi' ? 'गोपनीयता एवं सुरक्षा' : 'Data Privacy & Security'}
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                {language === 'hi' ? 'नागरिकों के दस्तावेज़ पूर्णतः सुरक्षित रखे जाते हैं।' : 'Zero unnecessary credential storage and strict confidentiality.'}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-emerald-50/60 border border-emerald-100 text-center space-y-2">
              <div className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center mx-auto">
                <HeartHandshake className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-sm text-slate-900">
                {language === 'hi' ? 'पारदर्शी सेवा शुल्क' : 'Fair Assistance Fees'}
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                {language === 'hi' ? 'निर्धारित एवं स्पष्ट शुल्क। कोई छुपा हुआ खर्च नहीं।' : 'Fixed and honest assistance charges with official receipts.'}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-amber-50/60 border border-amber-100 text-center space-y-2">
              <div className="w-10 h-10 rounded-full bg-amber-600 text-white flex items-center justify-center mx-auto">
                <Clock className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-sm text-slate-900">
                {language === 'hi' ? 'समयबद्ध सेवा' : 'Timely Execution'}
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                {language === 'hi' ? 'आवेदनों को बिना देरी के समय पर सबमिट किया जाता है।' : 'Prompt application submission and tracking updates.'}
              </p>
            </div>
          </div>
        </div>

        {/* Center Details Card */}
        <div className="bg-slate-900 text-white rounded-2xl p-6 sm:p-8 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <h3 className="text-lg sm:text-xl font-bold">
              {language === 'hi' ? 'क्या आपको किसी सेवा में मार्गदर्शन चाहिए?' : 'Need guidance with your documents or application?'}
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 max-w-lg">
              {language === 'hi'
                ? 'हमारे केंद्र पर फोन करें अथवा व्हाट्सएप पर अपनी समस्या बताएं, हमारी टीम आपको तुरंत मार्गदर्शन प्रदान करेगी।'
                : 'Call our helpdesk or message on WhatsApp to check required documents and procedural steps.'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <a
              href={`tel:${cleanPhone}`}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-white hover:bg-slate-100 text-slate-900 text-xs font-bold rounded-xl transition-colors"
            >
              <Phone className="w-3.5 h-3.5 text-blue-700" />
              <span>{t('callNow')}</span>
            </a>
            <a
              href={`https://wa.me/${cleanWhatsApp}?text=${encodeURIComponent('Hello Balaji Communication, I need assistance.')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-colors"
            >
              <MessageCircle className="w-3.5 h-3.5 fill-white" />
              <span>{t('whatsAppNow')}</span>
            </a>
            <button
              type="button"
              onClick={() => openEnquiryModal()}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition-colors"
            >
              <span>{t('applyEnquire')}</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
