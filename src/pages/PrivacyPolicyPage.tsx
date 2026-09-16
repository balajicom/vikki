import React from 'react';
import { ShieldCheck, Lock, AlertCircle } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useData } from '../context/DataContext';

export const PrivacyPolicyPage: React.FC = () => {
  const { language } = useLanguage();
  const { settings } = useData();

  return (
    <div id="privacy-policy-page" className="min-h-screen bg-slate-50 py-12 sm:py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="bg-white rounded-2xl p-6 sm:p-10 border border-slate-200 shadow-sm space-y-8">
          
          <div className="border-b border-slate-200 pb-5">
            <div className="flex items-center gap-2 text-xs font-bold text-blue-700 uppercase tracking-wider mb-1">
              <ShieldCheck className="w-4 h-4 text-blue-600" />
              <span>Legal & Transparency</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              {language === 'hi' ? 'गोपनीयता नीति (Privacy Policy)' : 'Privacy Policy - Balaji Communication'}
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Last Updated: January 2026 | Balaji Communication Jan Seva Kendra
            </p>
          </div>

          <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-3 text-xs text-amber-900 leading-relaxed">
            <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <strong className="block font-bold mb-0.5">Crucial Security & Privacy Commitment:</strong>
              Balaji Communication does NOT collect, store, or share confidential citizen credentials such as Aadhaar OTPs, bank login passwords, UPI PINs, or ATM PINs through this website.
            </div>
          </div>

          <div className="prose prose-slate max-w-none text-xs sm:text-sm text-slate-700 leading-relaxed space-y-5">
            <section className="space-y-2">
              <h2 className="text-base sm:text-lg font-bold text-slate-900">1. Information We Collect</h2>
              <p>
                When you use our website or submit an assistance enquiry, we may collect basic contact information including your Name, Mobile Number, the Service you require, and optional messages describing your inquiry.
              </p>
              <p>
                We do not collect unnecessary personal or financial credentials via our online forms.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-base sm:text-lg font-bold text-slate-900">2. How We Use Your Information</h2>
              <p>
                The information provided by you is strictly used for:
              </p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Contacting you via phone call or WhatsApp regarding your requested service</li>
                <li>Explaining required documents and procedural steps for government portals</li>
                <li>Updating you on the progress of your application</li>
                <li>Scheduling in-person visits to our center in Sector 12, Noida</li>
              </ul>
            </section>

            <section className="space-y-2">
              <h2 className="text-base sm:text-lg font-bold text-slate-900">3. Third-Party Portals and Government Websites</h2>
              <p>
                Balaji Communication assists citizens with online submissions on authorized government portals (such as UIDAI, e-District, PM-KISAN, Election Commission of India, NSDL/UTI, and Food & Logistics Department). All applications submitted on these portals are governed by their respective official privacy and data protection frameworks.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-base sm:text-lg font-bold text-slate-900">4. Contact For Privacy Queries</h2>
              <p>
                If you have any questions regarding your personal information, you can reach out directly:
              </p>
              <p className="font-semibold text-slate-900">
                Balaji Communication (जन सेवा केंद्र)<br />
                Email: {settings.email}<br />
                Phone: {settings.phone_number}
              </p>
            </section>
          </div>

        </div>
      </div>
    </div>
  );
};
