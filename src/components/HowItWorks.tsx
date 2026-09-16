import React from 'react';
import { Layers, PhoneCall, FileCheck, CheckCircle2, ArrowRight } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useData } from '../context/DataContext';

export const HowItWorks: React.FC = () => {
  const { language, t } = useLanguage();
  const { openEnquiryModal } = useData();

  const steps = [
    {
      stepNumber: '01',
      icon: Layers,
      title: t('step1Title'),
      desc: t('step1Desc'),
      color: 'bg-blue-50 text-blue-700 border-blue-200'
    },
    {
      stepNumber: '02',
      icon: PhoneCall,
      title: t('step2Title'),
      desc: t('step2Desc'),
      color: 'bg-emerald-50 text-emerald-700 border-emerald-200'
    },
    {
      stepNumber: '03',
      icon: FileCheck,
      title: t('step3Title'),
      desc: t('step3Desc'),
      color: 'bg-amber-50 text-amber-700 border-amber-200'
    },
    {
      stepNumber: '04',
      icon: CheckCircle2,
      title: t('step4Title'),
      desc: t('step4Desc'),
      color: 'bg-indigo-50 text-indigo-700 border-indigo-200'
    }
  ];

  return (
    <section id="how-it-works-section" className="py-14 sm:py-16 bg-slate-50 border-y border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-700 bg-blue-100/60 px-3 py-1 rounded-full border border-blue-200">
            {language === 'hi' ? 'सरल एवं पारदर्शी प्रक्रिया' : 'Simple 4-Step Process'}
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-2.5">
            {language === 'hi' ? 'सेवा प्राप्त करने की आसान विधि' : 'How Balaji Jan Seva Kendra Works'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-1.5 leading-relaxed">
            {language === 'hi'
              ? 'बिना किसी परेशानी या लंबी लाइनों के अपने आवश्यक सरकारी दस्तावेज़ और फॉर्म बनवाएं।'
              : 'Convenient, hassle-free guidance for government applications and digital verification.'}
          </p>
        </div>

        {/* Steps Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div
                key={idx}
                id={`how-it-works-step-${idx + 1}`}
                className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs hover:shadow-md transition-shadow relative flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center border ${step.color}`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-2xl font-black text-slate-300">
                      {step.stepNumber}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-slate-900 mb-2">
                    {step.title}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed font-normal">
                    {step.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Call to Action */}
        <div className="text-center mt-10">
          <button
            type="button"
            onClick={() => openEnquiryModal()}
            className="inline-flex items-center gap-2 px-6 py-3 text-xs sm:text-sm font-bold text-white bg-blue-700 hover:bg-blue-800 rounded-xl shadow-md transition-colors"
          >
            <span>{language === 'hi' ? 'अभी आवेदन या पूछताछ करें' : 'Start Application or Enquiry Now'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
};
