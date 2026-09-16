import React from 'react';
import { ShieldAlert, Scale, CheckCircle2 } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useData } from '../context/DataContext';

export const TermsPage: React.FC = () => {
  const { language } = useLanguage();
  const { settings } = useData();

  return (
    <div id="terms-conditions-page" className="min-h-screen bg-slate-50 py-12 sm:py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="bg-white rounded-2xl p-6 sm:p-10 border border-slate-200 shadow-sm space-y-8">
          
          <div className="border-b border-slate-200 pb-5">
            <div className="flex items-center gap-2 text-xs font-bold text-blue-700 uppercase tracking-wider mb-1">
              <Scale className="w-4 h-4 text-blue-600" />
              <span>Terms of Service & Disclaimer</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              {language === 'hi' ? 'नियम एवं शर्तें (Terms & Conditions)' : 'Terms & Conditions - Balaji Communication'}
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Last Updated: January 2026 | Balaji Communication Jan Seva Kendra
            </p>
          </div>

          {/* Statutory Disclaimer Box */}
          <div className="p-5 bg-blue-50 border-2 border-blue-200 rounded-2xl space-y-2 text-xs sm:text-sm text-blue-950">
            <div className="flex items-center gap-2 font-bold text-blue-900 text-sm">
              <ShieldAlert className="w-5 h-5 text-blue-700" />
              <span>Independent Service Assistance Center Declaration</span>
            </div>
            <p className="leading-relaxed font-medium">
              "Balaji Communication is an independent digital service assistance center (Jan Seva Kendra) providing facilitation and technical form-filling assistance. It is NOT an official government website."
            </p>
            <p className="leading-relaxed text-blue-900">
              "Government services, applicant eligibility, statutory government fees, verification timelines, and final sanction/rejection are solely determined by the respective government department/authority."
            </p>
          </div>

          <div className="prose prose-slate max-w-none text-xs sm:text-sm text-slate-700 leading-relaxed space-y-5">
            <section className="space-y-2">
              <h2 className="text-base sm:text-lg font-bold text-slate-900">1. Nature of Services Provided</h2>
              <p>
                Balaji Communication offers digital facilitation, internet kiosk services, form submission guidance, biometric verification booking, document scanning, and printing. We do not manufacture government documents or approve statutory applications directly.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-base sm:text-lg font-bold text-slate-900">2. Applicant Responsibility & Genuine Documents</h2>
              <p>
                The applicant is solely responsible for the authenticity, correctness, and legality of all documents (such as proof of identity, address, birth, and income) presented for form submission. Providing counterfeit or forged documentation is an offence under Indian Law.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-base sm:text-lg font-bold text-slate-900">3. Turnaround Times and Government Delays</h2>
              <p>
                Estimated processing times stated on our website or by our staff are indicative averages based on typical department workflows. Delays caused by government server maintenance, departmental field inspections (by Lekhpal, Patwari, Food Inspectors, or Police), or portal backlog are beyond our operational control.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-base sm:text-lg font-bold text-slate-900">4. Service Charges & Acknowledgement</h2>
              <p>
                Balaji Communication levies standard, fair digital assistance and facilitation charges. An official printout or digital transaction acknowledgement is provided for every paid online submission.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-base sm:text-lg font-bold text-slate-900">5. Jurisdiction</h2>
              <p>
                Any claims or disputes arising in connection with services rendered by Balaji Communication Jan Seva Kendra are subject to the competent courts of Gautam Buddha Nagar (Noida), Uttar Pradesh, India.
              </p>
            </section>
          </div>

        </div>
      </div>
    </div>
  );
};
