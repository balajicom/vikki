import React, { useState } from 'react';
import { FileCheck, CheckCircle2, AlertCircle, ArrowRight, Phone, MessageCircle } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useData } from '../context/DataContext';

export const DocumentsPage: React.FC = () => {
  const { language, t } = useLanguage();
  const { settings, openEnquiryModal } = useData();

  const cleanWhatsApp = (settings.whatsapp_number || '919876543210').replace(/\D/g, '');

  const guides = [
    {
      category: 'Aadhaar Card (आधार कार्ड)',
      services: 'Mobile Number Link, Address Update, e-Aadhaar Download',
      docs: [
        'Original Aadhaar Card / Enrollment slip (मूल आधार कार्ड)',
        'Active mobile phone SIM for receiving OTP (चालू मोबाइल नंबर)',
        'For Address Update: Voter ID / Electricity bill / Rent agreement / Bank passbook'
      ]
    },
    {
      category: 'Ration Card (राशन कार्ड)',
      services: 'New Application, Unit Addition / Removal, Correction',
      docs: [
        'Head of Family (Female) Passport size photograph (मुखिया की फोटो)',
        'Aadhaar card copies of all family members (परिवार के सभी सदस्यों के आधार)',
        'Income Certificate of applicant (सत्यापित आय प्रमाण पत्र)',
        'Bank account passbook copy with IFSC (बैंक पासबुक प्रति)',
        'Electricity bill / LPG connection book / Rent slip (निवास साक्ष्य)',
        'For Child Addition: Birth Certificate of the child (जन्म प्रमाण पत्र)'
      ]
    },
    {
      category: 'PM Kisan Samman Nidhi (पीएम किसान)',
      services: 'New Registration, Biometric eKYC, Land Record Seeding',
      docs: [
        'Farmer Aadhaar Card (किसान का आधार कार्ड)',
        'Land Ownership Record / Khatauni Copy (खसरा/खतौनी की नकल)',
        'Bank Passbook linked with Aadhaar NPCI (आधार लिंक बैंक खाता)',
        'Active mobile number (चालू मोबाइल नंबर)'
      ]
    },
    {
      category: 'Ayushman Bharat Card (आयुष्मान कार्ड)',
      services: '₹5 Lakh Free Medical Treatment Golden Card',
      docs: [
        'Aadhaar card of all members to be registered (सभी सदस्यों का आधार कार्ड)',
        'Ration Card with 6+ members OR PM-JAY family letter (राशन कार्ड या आयुष्मान पत्र)',
        'Mobile phone for instant OTP verification'
      ]
    },
    {
      category: 'PAN Card (पैन कार्ड)',
      services: 'New PAN Allocation, Re-issue, Correction in Details',
      docs: [
        'Aadhaar card with accurate spelling & date of birth (आधार कार्ड)',
        'Two recent passport size color photographs (दो पासपोर्ट साइज फोटो)',
        'Active email ID and mobile number for receiving e-PAN'
      ]
    },
    {
      category: 'Government Certificates (आय, जाति, निवास प्रमाण पत्र)',
      services: 'e-District Revenue Department Official Verification',
      docs: [
        'Aadhaar card of applicant and father/guardian (आधार कार्ड)',
        'Self-declaration form (स्वप्रमाणित घोषणा पत्र - केंद्र पर उपलब्ध)',
        'Passport size photograph (पासपोर्ट साइज फोटो)',
        'For Caste: Old family caste proof / land record showing sub-caste (पारिवारिक साक्ष्य)',
        'For Niwas/Domicile: Ration card / electricity bill / voter ID / education marksheet'
      ]
    }
  ];

  return (
    <div id="documents-page" className="min-h-screen bg-slate-50 py-12 sm:py-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 space-y-10">
        
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-bold uppercase tracking-wider border border-blue-200">
            <FileCheck className="w-3.5 h-3.5 text-blue-600" />
            <span>{language === 'hi' ? 'दस्तावेज़ चेकलिस्ट' : 'Document Checklist'}</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            {language === 'hi' ? 'सेवाओं के लिए आवश्यक दस्तावेजों की सूची' : 'Required Documents Guide for Citizens'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 max-w-2xl mx-auto leading-relaxed">
            {language === 'hi'
              ? 'केंद्र पर आने से पहले सुनिश्चित करें कि आपके पास संबंधित सेवा के लिए सभी आवश्यक वैध दस्तावेज उपलब्ध हैं, ताकि आपका काम एक ही बार में आसानी से हो सके।'
              : 'Review the required documents list below to ensure a smooth, one-visit application experience at Balaji Communication.'}
          </p>
        </div>

        {/* Security / Advisory Callout */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3 text-xs text-amber-900">
          <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h4 className="font-bold text-amber-950">
              {language === 'hi' ? 'नागरिक सुरक्षा एवं गोपनीयता सूचना' : 'Citizen Safety & Privacy Notice'}
            </h4>
            <p className="leading-relaxed">
              {language === 'hi'
                ? 'कृपया केवल वही दस्तावेज़ लाएं जो आवेदन के लिए निर्धारित हैं। बालाजी कम्युनिकेशन किसी भी नागरिक का बैंक पिन, पासवर्ड अथवा अनावश्यक गोपनीय विवरण कभी नहीं मांगता।'
                : 'Bring only the official documents required for verification. Balaji Communication never asks for your bank password, UPI PIN, or confidential financial credentials.'}
            </p>
          </div>
        </div>

        {/* Document Checklist Cards */}
        <div className="space-y-6">
          {guides.map((item, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4 hover:border-blue-300 transition-colors"
            >
              <div className="border-b border-slate-100 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-slate-900">
                    {item.category}
                  </h3>
                  <p className="text-xs font-semibold text-blue-700">
                    {item.services}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => openEnquiryModal()}
                  className="self-start sm:self-auto text-xs font-bold text-slate-700 hover:text-blue-700 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-lg transition-colors"
                >
                  {t('applyEnquire')}
                </button>
              </div>

              <ul className="space-y-2.5">
                {item.docs.map((d, dIdx) => (
                  <li key={dIdx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{d}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Assistance Card */}
        <div className="bg-slate-900 text-white rounded-2xl p-6 sm:p-8 text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-5">
          <div className="space-y-1">
            <h3 className="text-base sm:text-lg font-bold">
              {language === 'hi' ? 'क्या आपको अपने दस्तावेजों के संबंध में कोई संदेह है?' : 'Unsure if your documents are complete or valid?'}
            </h3>
            <p className="text-xs text-slate-300">
              {language === 'hi'
                ? 'हमारे व्हाट्सएप पर मैसेज करें या कॉल करें, हमारे विशेषज्ञ आपको सही दस्तावेज़ बताएंगे।'
                : 'Send us a message on WhatsApp or call our helpdesk for instant verification guidance.'}
            </p>
          </div>

          <a
            href={`https://wa.me/${cleanWhatsApp}?text=${encodeURIComponent('Hello Balaji Communication, I want to verify required documents for a service.')}`}
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
