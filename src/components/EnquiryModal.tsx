import React, { useState, useEffect } from 'react';
import { X, CheckCircle, AlertCircle, Shield, Phone, MessageCircle, Send } from 'lucide-react';
import { useData } from '../context/DataContext';
import { useLanguage } from '../context/LanguageContext';

export const EnquiryModal: React.FC = () => {
  const { isEnquiryModalOpen, closeEnquiryModal, enquiryPreselectedService, services, submitEnquiry } = useData();
  const { language, t } = useLanguage();

  const [fullName, setFullName] = useState('');
  const [mobile, setMobile] = useState('');
  const [selectedServiceId, setSelectedServiceId] = useState('');
  const [preferredContact, setPreferredContact] = useState<'Call' | 'WhatsApp'>('Call');
  const [message, setMessage] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedSuccess, setSubmittedSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Update selected service when modal opens or preselected service changes
  useEffect(() => {
    if (enquiryPreselectedService) {
      setSelectedServiceId(enquiryPreselectedService.service_id);
    } else if (services.length > 0 && !selectedServiceId) {
      setSelectedServiceId(services[0].service_id);
    }
  }, [enquiryPreselectedService, services]);

  if (!isEnquiryModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // Validation
    if (!fullName.trim()) {
      setErrorMessage(language === 'hi' ? 'कृपया अपना पूरा नाम दर्ज करें।' : 'Please enter your full name.');
      return;
    }

    const cleanMobile = mobile.replace(/\D/g, '');
    if (cleanMobile.length !== 10) {
      setErrorMessage(
        language === 'hi' 
          ? 'कृपया वैध 10 अंकों का मोबाइल नंबर दर्ज करें।' 
          : 'Please enter a valid 10-digit mobile number.'
      );
      return;
    }

    // Security check
    const rawCheck = `${fullName} ${message}`.toLowerCase();
    if (rawCheck.includes('otp') || rawCheck.includes('pin') || rawCheck.includes('password')) {
      setErrorMessage(t('securityWarning'));
      return;
    }

    const matchedService = services.find(s => s.service_id === selectedServiceId);
    const serviceName = matchedService
      ? (language === 'hi' ? matchedService.service_name_hi : matchedService.service_name_en)
      : 'General Inquiry';

    setIsSubmitting(true);
    const result = await submitEnquiry({
      customer_name: fullName.trim(),
      mobile: cleanMobile,
      service_id: selectedServiceId,
      service_name: serviceName,
      message: message.trim(),
      preferred_contact: preferredContact
    });

    setIsSubmitting(false);

    if (result.success) {
      setSubmittedSuccess(true);
      // Reset form
      setFullName('');
      setMobile('');
      setMessage('');
    } else {
      setErrorMessage(result.message);
    }
  };

  const handleClose = () => {
    setSubmittedSuccess(false);
    setErrorMessage(null);
    closeEnquiryModal();
  };

  return (
    <div
      id="enquiry-modal-backdrop"
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4"
      onClick={handleClose}
    >
      <div
        id="enquiry-modal-content"
        className="bg-white rounded-2xl max-w-lg w-full shadow-2xl overflow-hidden border border-slate-200 relative animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-slate-900 text-white p-5 sm:p-6 relative">
          <button
            type="button"
            id="btn-close-enquiry-modal"
            onClick={handleClose}
            className="absolute top-4 right-4 text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 p-2 rounded-full transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">
              Balaji Communication Desk
            </span>
          </div>
          <h2 className="text-lg sm:text-xl font-bold">
            {t('enquiryFormTitle')}
          </h2>
          <p className="text-xs text-slate-300 mt-1">
            {t('enquiryFormDesc')}
          </p>
        </div>

        {/* Content */}
        <div className="p-6">
          {submittedSuccess ? (
            <div className="text-center py-8 space-y-4">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle className="w-10 h-10" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">
                {language === 'hi' ? 'अनुरोध सफलतापूर्वक प्राप्त हुआ!' : 'Request Received Successfully!'}
              </h3>
              <p className="text-sm text-slate-600 max-w-sm mx-auto leading-relaxed font-medium">
                {t('thankYouMessage')}
              </p>
              <div className="p-3 bg-slate-50 rounded-xl text-xs text-slate-500 border border-slate-200">
                {language === 'hi'
                  ? 'हमारे प्रतिनिधि आपके द्वारा दिए गए नंबर पर शीघ्र ही कॉल या व्हाट्सएप करेंगे।'
                  : 'Our representative will reach out on your provided contact number soon.'}
              </div>
              <button
                type="button"
                onClick={handleClose}
                className="mt-4 px-6 py-2.5 bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold rounded-lg transition-colors"
              >
                {language === 'hi' ? 'बंद करें' : 'Close'}
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {errorMessage && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-2 text-xs text-rose-800">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Full Name */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {t('fullNameLabel')} <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  id="input-enquiry-name"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder={t('fullNamePlaceholder')}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all"
                />
              </div>

              {/* Mobile Number */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {t('mobileLabel')} <span className="text-rose-500">*</span>
                </label>
                <div className="relative flex">
                  <span className="inline-flex items-center px-3 rounded-l-lg border border-r-0 border-slate-300 bg-slate-100 text-slate-600 text-xs font-semibold">
                    +91
                  </span>
                  <input
                    type="tel"
                    id="input-enquiry-mobile"
                    required
                    maxLength={10}
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value.replace(/\D/g, ''))}
                    placeholder={t('mobilePlaceholder')}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-r-lg text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all"
                  />
                </div>
              </div>

              {/* Service Required */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {t('serviceLabel')} <span className="text-rose-500">*</span>
                </label>
                <select
                  id="select-enquiry-service"
                  value={selectedServiceId}
                  onChange={(e) => setSelectedServiceId(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all"
                >
                  {services.map((srv) => (
                    <option key={srv.service_id} value={srv.service_id}>
                      {language === 'hi' ? srv.service_name_hi : srv.service_name_en} ({srv.category})
                    </option>
                  ))}
                </select>
              </div>

              {/* Preferred Contact Method */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  {t('contactPrefLabel')}
                </label>
                <div className="grid grid-cols-2 gap-2.5">
                  <button
                    type="button"
                    onClick={() => setPreferredContact('Call')}
                    className={`flex items-center justify-center gap-2 py-2 px-3 rounded-lg border text-xs font-semibold transition-all ${
                      preferredContact === 'Call'
                        ? 'border-blue-600 bg-blue-50 text-blue-800'
                        : 'border-slate-300 bg-white text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <Phone className="w-3.5 h-3.5 text-blue-600" />
                    <span>{t('prefCall')}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPreferredContact('WhatsApp')}
                    className={`flex items-center justify-center gap-2 py-2 px-3 rounded-lg border text-xs font-semibold transition-all ${
                      preferredContact === 'WhatsApp'
                        ? 'border-emerald-600 bg-emerald-50 text-emerald-800'
                        : 'border-slate-300 bg-white text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{t('prefWhatsApp')}</span>
                  </button>
                </div>
              </div>

              {/* Message */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {t('messageLabel')}
                </label>
                <textarea
                  id="input-enquiry-message"
                  rows={2}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder={t('messagePlaceholder')}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all resize-none"
                />
              </div>

              {/* Security Warning Notice */}
              <div className="p-2.5 bg-amber-50/80 border border-amber-200/70 rounded-lg flex items-start gap-2 text-[11px] text-amber-900">
                <Shield className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <p className="leading-tight font-medium">
                  {t('securityWarning')}
                </p>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                id="btn-submit-enquiry"
                disabled={isSubmitting}
                className="w-full py-3 bg-blue-700 hover:bg-blue-800 active:bg-blue-900 text-white font-bold text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-70 cursor-pointer"
              >
                {isSubmitting ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>{t('submitting')}</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>{t('submitEnquiry')}</span>
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
