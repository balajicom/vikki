import React, { useState } from 'react';
import { MessageCircle, FileText, ArrowRight, CheckCircle2, Image as ImageIcon, Trash2 } from 'lucide-react';
import { Service } from '../types';
import { getServiceIcon } from '../utils/iconHelper';
import { useLanguage } from '../context/LanguageContext';
import { useData } from '../context/DataContext';

interface ServiceCardProps {
  service: Service;
}

export const ServiceCard: React.FC<ServiceCardProps> = ({ service }) => {
  const { language, t } = useLanguage();
  const { settings, openServiceDetails, openEnquiryModal, deleteService } = useData();
  const [imageError, setImageError] = useState(false);

  const title = language === 'hi' ? service.service_name_hi : service.service_name_en;
  const secondaryTitle = language === 'hi' ? service.service_name_en : service.service_name_hi;
  const description = language === 'hi' ? service.short_description_hi : service.short_description_en;

  const cleanWhatsApp = (settings.whatsapp_number || '919870677605').replace(/\D/g, '');
  const waMsg = service.whatsapp_message || `Hello Balaji Communication, I want information about ${service.service_name_en}.`;

  // Fallback picture if not provided or broken
  const defaultImage = 'https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=600&q=80';
  const displayImage = (!imageError && service.image_url && service.image_url.trim()) ? service.image_url : defaultImage;

  return (
    <div
      id={`service-card-${service.service_id}`}
      className="bg-white rounded-2xl border border-slate-200 hover:border-blue-500/80 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden group hover:-translate-y-1"
    >
      {/* 1. Service Picture Banner */}
      <div className="relative w-full h-44 sm:h-48 overflow-hidden bg-slate-100">
        <img
          src={displayImage}
          alt={title}
          loading="lazy"
          onError={() => setImageError(true)}
          className="w-full h-full object-cover object-center group-hover:scale-108 transition-transform duration-500 ease-out"
        />

        {/* Gradient Overlay for text contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

        {/* Category & Badges on Picture */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2">
          <span className="text-[11px] font-bold px-2.5 py-1 rounded-lg bg-black/60 backdrop-blur-md text-white border border-white/20 shadow-xs">
            {service.category}
          </span>
          <div className="flex items-center gap-1.5">
            {service.popular && (
              <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-amber-500 text-slate-950 shadow-md uppercase tracking-wider">
                Popular
              </span>
            )}
          </div>
        </div>

        {/* Icon Overlay Badge at bottom corner of picture */}
        <div className="absolute bottom-3 left-3 flex items-center gap-2">
          <div className="w-10 h-10 rounded-xl bg-white/95 backdrop-blur-md text-blue-700 shadow-md flex items-center justify-center border border-white/40 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-200">
            {getServiceIcon(service.icon, { className: "w-5 h-5" })}
          </div>
          {service.estimated_time && (
            <span className="text-[10px] font-semibold text-white/90 bg-black/40 backdrop-blur-xs px-2 py-0.5 rounded-md line-clamp-1 max-w-[170px]">
              ⏱ {service.estimated_time}
            </span>
          )}
        </div>
      </div>

      {/* 2. Content Body */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col">
        {/* Title & Subtitle */}
        <h3 className="font-bold text-base sm:text-lg text-slate-900 leading-snug group-hover:text-blue-700 transition-colors line-clamp-2">
          {title}
        </h3>
        <p className="text-xs font-medium text-slate-500 mt-1 mb-2 line-clamp-1">
          {secondaryTitle}
        </p>

        {/* Short Description */}
        <p className="text-xs text-slate-600 leading-relaxed line-clamp-2 mb-3">
          {description}
        </p>

        {/* Quick Documents Preview */}
        {(() => {
          const docs = Array.isArray(service.required_documents)
            ? service.required_documents
            : (typeof service.required_documents === 'string' ? (service.required_documents as string).split(/[;\n]+/).map(s => s.trim()).filter(Boolean) : []);
          if (docs.length === 0) return null;
          return (
            <div className="bg-slate-50 rounded-xl p-2.5 border border-slate-100 mt-auto mb-3">
              <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-700 mb-0.5">
                <FileText className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                <span>{t('requiredDocuments')}:</span>
              </div>
              <p className="text-[11px] text-slate-600 truncate">
                {docs[0]}
                {docs.length > 1 && ` +${docs.length - 1} more`}
              </p>
            </div>
          );
        })()}
      </div>

      {/* 3. Action Buttons Bar */}
      <div className="px-4 pb-4 sm:px-5 sm:pb-5 pt-0 border-t border-slate-100 pt-3 flex flex-col gap-2">
        <div className="grid grid-cols-2 gap-2">
          {/* View Details */}
          <button
            type="button"
            id={`btn-details-${service.service_id}`}
            onClick={() => openServiceDetails(service)}
            className="w-full py-2 px-2.5 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 active:bg-slate-300 rounded-xl transition-colors text-center cursor-pointer"
          >
            {t('viewDetails')}
          </button>

          {/* Apply / Enquire */}
          <button
            type="button"
            id={`btn-enquire-${service.service_id}`}
            onClick={() => openEnquiryModal(service)}
            className="w-full py-2 px-2.5 text-xs font-bold text-white bg-blue-700 hover:bg-blue-800 active:bg-blue-900 rounded-xl transition-colors text-center shadow-xs cursor-pointer"
          >
            {language === 'hi' ? 'ऑनलाइन आवेदन' : 'Apply Online'}
          </button>
        </div>

        {/* WhatsApp Direct */}
        <a
          href={`https://wa.me/${cleanWhatsApp}?text=${encodeURIComponent(waMsg)}`}
          target="_blank"
          rel="noopener noreferrer"
          id={`btn-wa-${service.service_id}`}
          className="w-full py-1.5 px-3 text-[11px] font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 active:bg-emerald-200 border border-emerald-200 rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
        >
          <MessageCircle className="w-3.5 h-3.5 fill-emerald-600 text-white" />
          <span>WhatsApp Query</span>
        </a>
      </div>
    </div>
  );
};
