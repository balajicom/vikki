import React from 'react';
import { MessageCircle, FileText, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Service } from '../types';
import { getServiceIcon } from '../utils/iconHelper';
import { useLanguage } from '../context/LanguageContext';
import { useData } from '../context/DataContext';

interface ServiceCardProps {
  service: Service;
}

export const ServiceCard: React.FC<ServiceCardProps> = ({ service }) => {
  const { language, t } = useLanguage();
  const { settings, openServiceDetails, openEnquiryModal } = useData();

  const title = language === 'hi' ? service.service_name_hi : service.service_name_en;
  const secondaryTitle = language === 'hi' ? service.service_name_en : service.service_name_hi;
  const description = language === 'hi' ? service.short_description_hi : service.short_description_en;

  const cleanWhatsApp = (settings.whatsapp_number || '919876543210').replace(/\D/g, '');
  const waMsg = service.whatsapp_message || `Hello Balaji Communication, I want information about ${service.service_name_en}.`;

  return (
    <div
      id={`service-card-${service.service_id}`}
      className="bg-white rounded-xl border border-slate-200/90 hover:border-blue-400/80 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between overflow-hidden group"
    >
      <div className="p-5 sm:p-6">
        {/* Top Header Row with Icon & Category Badge */}
        <div className="flex items-start justify-between gap-3 mb-3.5">
          <div className="w-12 h-12 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors duration-200 shrink-0">
            {getServiceIcon(service.icon, { className: "w-6 h-6" })}
          </div>
          <div className="flex items-center gap-1.5 flex-wrap justify-end">
            <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200/70">
              {service.category}
            </span>
            {service.popular && (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
                Popular
              </span>
            )}
          </div>
        </div>

        {/* Title & Subtitle */}
        <h3 className="font-bold text-base sm:text-lg text-slate-900 leading-snug group-hover:text-blue-700 transition-colors">
          {title}
        </h3>
        <p className="text-xs font-medium text-slate-500 mt-0.5 mb-2.5 line-clamp-1">
          {secondaryTitle}
        </p>

        {/* Short Description */}
        <p className="text-xs text-slate-600 leading-relaxed line-clamp-2 mb-3">
          {description}
        </p>

        {/* Quick Documents Preview */}
        {service.required_documents && service.required_documents.length > 0 && (
          <div className="bg-slate-50 rounded-lg p-2.5 border border-slate-100 mb-3">
            <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-700 mb-1">
              <FileText className="w-3.5 h-3.5 text-blue-600" />
              <span>{t('requiredDocuments')}:</span>
            </div>
            <p className="text-[11px] text-slate-600 truncate">
              {service.required_documents[0]}
              {service.required_documents.length > 1 && ` +${service.required_documents.length - 1} more`}
            </p>
          </div>
        )}
      </div>

      {/* Action Buttons Bar */}
      <div className="px-5 pb-5 pt-0 mt-auto border-t border-slate-100 pt-3.5 flex flex-col gap-2">
        <div className="grid grid-cols-2 gap-2">
          {/* View Details */}
          <button
            type="button"
            id={`btn-details-${service.service_id}`}
            onClick={() => openServiceDetails(service)}
            className="w-full py-2 px-2.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 active:bg-slate-300 rounded-lg transition-colors text-center"
          >
            {t('viewDetails')}
          </button>

          {/* Apply / Enquire */}
          <button
            type="button"
            id={`btn-enquire-${service.service_id}`}
            onClick={() => openEnquiryModal(service)}
            className="w-full py-2 px-2.5 text-xs font-bold text-white bg-blue-700 hover:bg-blue-800 active:bg-blue-900 rounded-lg transition-colors text-center shadow-xs"
          >
            {t('applyEnquire')}
          </button>
        </div>

        {/* WhatsApp Direct */}
        <a
          href={`https://wa.me/${cleanWhatsApp}?text=${encodeURIComponent(waMsg)}`}
          target="_blank"
          rel="noopener noreferrer"
          id={`btn-wa-${service.service_id}`}
          className="w-full py-1.5 px-3 text-[11px] font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg flex items-center justify-center gap-1.5 transition-colors"
        >
          <MessageCircle className="w-3.5 h-3.5 fill-emerald-600 text-white" />
          <span>WhatsApp Query</span>
        </a>
      </div>
    </div>
  );
};
