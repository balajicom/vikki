import React from 'react';
import { X, CheckCircle2, Clock, ShieldAlert, MessageCircle, ArrowRight, FileCheck, Phone } from 'lucide-react';
import { useData } from '../context/DataContext';
import { useLanguage } from '../context/LanguageContext';
import { getServiceIcon } from '../utils/iconHelper';

export const ServiceModal: React.FC = () => {
  const { selectedService, closeServiceDetails, openEnquiryModal, settings } = useData();
  const { language, t } = useLanguage();

  if (!selectedService) return null;

  const title = language === 'hi' ? selectedService.service_name_hi : selectedService.service_name_en;
  const secondaryTitle = language === 'hi' ? selectedService.service_name_en : selectedService.service_name_hi;
  const fullDesc = language === 'hi' ? selectedService.full_description_hi : selectedService.full_description_en;
  const otherDesc = language === 'hi' ? selectedService.full_description_en : selectedService.full_description_hi;

  const cleanWhatsApp = (settings.whatsapp_number || '919876543210').replace(/\D/g, '');
  const cleanPhone = settings.phone_number || '+919876543210';
  const waMsg = selectedService.whatsapp_message || `Hello Balaji Communication, I want information about ${selectedService.service_name_en}.`;

  const handleApplyClick = () => {
    const srv = selectedService;
    closeServiceDetails();
    openEnquiryModal(srv);
  };

  return (
    <div
      id="service-details-modal-backdrop"
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4"
      onClick={closeServiceDetails}
    >
      <div
        id="service-details-modal-content"
        className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl overflow-hidden border border-slate-200 relative my-8 animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-blue-700 to-indigo-800 text-white p-6 sm:p-7 relative">
          <button
            type="button"
            id="btn-close-service-modal"
            onClick={closeServiceDetails}
            className="absolute top-4 right-4 text-blue-100 hover:text-white bg-white/10 hover:bg-white/20 p-2 rounded-full transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-xl bg-white/10 backdrop-blur-xs border border-white/20 text-white flex items-center justify-center shrink-0 shadow-inner">
              {getServiceIcon(selectedService.icon, { className: "w-7 h-7 text-amber-300" })}
            </div>
            <div className="pr-8">
              <span className="inline-block px-2.5 py-0.5 text-xs font-semibold bg-white/20 text-blue-100 rounded-full mb-2">
                {selectedService.category}
              </span>
              <h2 className="text-xl sm:text-2xl font-bold leading-tight">
                {title}
              </h2>
              <p className="text-blue-100 text-xs sm:text-sm font-medium mt-1">
                {secondaryTitle}
              </p>
            </div>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-7 space-y-6 max-h-[70vh] overflow-y-auto">
          {/* Estimated time info badge if present */}
          {selectedService.estimated_time && (
            <div className="flex items-center gap-2 p-3 bg-amber-50/90 border border-amber-200/80 rounded-xl text-xs text-amber-900">
              <Clock className="w-4 h-4 text-amber-700 shrink-0" />
              <div>
                <span className="font-bold">{t('estimatedTime')}: </span>
                <span>{selectedService.estimated_time}</span>
              </div>
            </div>
          )}

          {/* Detailed Descriptions (Bilingual) */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Service Overview / सेवा विवरण
            </h4>
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80 text-sm text-slate-800 leading-relaxed space-y-2">
              <p className="font-medium text-slate-900">{fullDesc}</p>
              {otherDesc && (
                <p className="text-xs text-slate-500 border-t border-slate-200/60 pt-2 italic">
                  {otherDesc}
                </p>
              )}
            </div>
          </div>

          {/* Required Documents Checklist */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <FileCheck className="w-4 h-4 text-blue-700" />
              <h4 className="text-sm font-bold text-slate-900">
                {t('requiredDocuments')}
              </h4>
            </div>

            {selectedService.required_documents && selectedService.required_documents.length > 0 ? (
              <ul className="space-y-2.5">
                {selectedService.required_documents.map((doc, idx) => (
                  <li
                    key={idx}
                    className="flex items-start gap-2.5 p-2.5 bg-slate-50 hover:bg-blue-50/50 rounded-lg border border-slate-200/60 text-xs sm:text-sm text-slate-700 transition-colors"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span className="font-medium">{doc}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-xs text-slate-500 italic">
                Standard identity proof and active mobile phone required. Contact center for exact details.
              </p>
            )}
          </div>

          {/* Important Legal & Government Notice */}
          <div className="p-4 bg-slate-100 rounded-xl border border-slate-200 text-xs text-slate-600 space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-slate-800 text-xs">
              <ShieldAlert className="w-4 h-4 text-amber-600" />
              <span>{t('importantNoticeTitle')}</span>
            </div>
            <p className="leading-relaxed">
              {t('importantNoticeText')}
            </p>
          </div>
        </div>

        {/* Modal Footer Actions */}
        <div className="p-4 sm:p-6 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <a
              href={`tel:${cleanPhone}`}
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-100 border border-slate-300 rounded-lg transition-colors"
            >
              <Phone className="w-3.5 h-3.5 text-blue-600" />
              <span>{t('callNow')}</span>
            </a>
            <a
              href={`https://wa.me/${cleanWhatsApp}?text=${encodeURIComponent(waMsg)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-bold text-emerald-800 bg-emerald-100 hover:bg-emerald-200 border border-emerald-300 rounded-lg transition-colors"
            >
              <MessageCircle className="w-3.5 h-3.5 fill-emerald-600" />
              <span>WhatsApp Query</span>
            </a>
          </div>

          <button
            type="button"
            id="btn-modal-apply-now"
            onClick={handleApplyClick}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 text-xs sm:text-sm font-bold text-white bg-blue-700 hover:bg-blue-800 rounded-lg shadow-sm transition-colors"
          >
            <span>{t('applyEnquire')}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
