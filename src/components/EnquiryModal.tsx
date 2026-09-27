import React, { useState, useEffect } from 'react';
import { X, CheckCircle, AlertCircle, Shield, Phone, MessageCircle, Send, Printer, FileText, Building2 } from 'lucide-react';
import { useData } from '../context/DataContext';
import { useLanguage } from '../context/LanguageContext';
import { Enquiry } from '../types';

export const EnquiryModal: React.FC = () => {
  const { isEnquiryModalOpen, closeEnquiryModal, enquiryPreselectedService, services, submitEnquiry, settings } = useData();
  const { language, t } = useLanguage();

  const [fullName, setFullName] = useState('');
  const [fatherOrHusbandName, setFatherOrHusbandName] = useState('');
  const [mobile, setMobile] = useState('');
  const [address, setAddress] = useState('');
  const [selectedServiceId, setSelectedServiceId] = useState('');
  const [preferredContact, setPreferredContact] = useState<'Call' | 'WhatsApp'>('WhatsApp');
  const [urgency, setUrgency] = useState<'Normal' | 'Urgent' | 'Immediate'>('Normal');
  const [message, setMessage] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedApplication, setSubmittedApplication] = useState<Enquiry | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Update selected service when modal opens or preselected service changes
  useEffect(() => {
    if (enquiryPreselectedService) {
      setSelectedServiceId(enquiryPreselectedService.service_id);
    } else if (services.length > 0 && !selectedServiceId) {
      setSelectedServiceId(services[0].service_id);
    }
  }, [enquiryPreselectedService, services, selectedServiceId]);

  if (!isEnquiryModalOpen) return null;

  const cleanWhatsApp = (settings.whatsapp_number || '919870677605').replace(/\D/g, '');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // Validation
    if (!fullName.trim()) {
      setErrorMessage(language === 'hi' ? 'कृपया आवेदक का पूरा नाम दर्ज करें।' : 'Please enter applicant full name.');
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
    const rawCheck = `${fullName} ${message} ${address}`.toLowerCase();
    if (rawCheck.includes('otp') || rawCheck.includes('pin') || rawCheck.includes('password') || rawCheck.includes('cvv')) {
      setErrorMessage(t('securityWarning'));
      return;
    }

    const matchedService = services.find(s => s.service_id === selectedServiceId);
    const serviceName = matchedService
      ? (language === 'hi' ? matchedService.service_name_hi : matchedService.service_name_en)
      : 'Jan Seva Kendra Application';

    setIsSubmitting(true);
    const result = await submitEnquiry({
      customer_name: fullName.trim(),
      applicant_name: fullName.trim(),
      mobile: cleanMobile,
      father_or_husband_name: fatherOrHusbandName.trim(),
      address: address.trim(),
      service_id: selectedServiceId,
      service_name: serviceName,
      category: matchedService?.category || 'Jan Seva Kendra',
      message: message.trim(),
      preferred_contact: preferredContact,
      urgency
    });

    setIsSubmitting(false);

    if (result.success && result.application) {
      setSubmittedApplication(result.application);
    } else if (result.success) {
      setSubmittedApplication({
        enquiry_id: result.enquiry_id || `BALAJI-APP-${Date.now()}`,
        customer_name: fullName.trim(),
        mobile: cleanMobile,
        father_or_husband_name: fatherOrHusbandName.trim(),
        address: address.trim(),
        service_id: selectedServiceId,
        service_name: serviceName,
        message: message.trim(),
        preferred_contact: preferredContact,
        status: 'New',
        urgency,
        created_at: new Date().toISOString()
      });
    } else {
      setErrorMessage(result.message);
    }
  };

  const handleClose = () => {
    setSubmittedApplication(null);
    setErrorMessage(null);
    closeEnquiryModal();
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div
      id="enquiry-modal-backdrop"
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4"
      onClick={handleClose}
    >
      <div
        id="enquiry-modal-content"
        className="bg-white rounded-2xl max-w-xl w-full shadow-2xl overflow-hidden border border-slate-200 relative animate-in fade-in zoom-in-95 duration-150 my-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="bg-gradient-to-r from-blue-700 to-indigo-800 text-white p-5 sm:p-6 relative">
          <button
            type="button"
            id="btn-close-enquiry-modal"
            onClick={handleClose}
            className="absolute top-4 right-4 text-blue-100 hover:text-white bg-white/10 hover:bg-white/20 p-1.5 rounded-full transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="pr-8">
            <span className="inline-block text-[11px] font-bold uppercase tracking-wider text-amber-300 mb-1">
              Balaji Communication Jan Seva Kendra Gaini
            </span>
            <h2 className="text-xl sm:text-2xl font-black">
              {language === 'hi' ? 'सीधे ऑनलाइन सेवा आवेदन पत्र' : 'Direct Online Application'}
            </h2>
            <p className="text-blue-100 text-xs mt-1">
              {language === 'hi'
                ? 'तुरंत डिजिटल पावती संख्या प्राप्त करें। केंद्र द्वारा शीघ्र संपर्क किया जाएगा।'
                : 'Get instant application reference ID and priority assistance from Balaji Communication.'}
            </p>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 max-h-[75vh] overflow-y-auto">
          {submittedApplication ? (
            /* SUCCESS ACKNOWLEDGEMENT SLIP VIEW */
            <div className="space-y-5">
              <div className="text-center py-2">
                <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner mb-3">
                  <CheckCircle className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">
                  {language === 'hi' ? 'आवेदन सफलतापूर्वक दर्ज हो गया है!' : 'Application Successfully Received!'}
                </h3>
                <p className="text-xs text-slate-600 mt-1">
                  {t('enquirySuccessMessage')}
                </p>
              </div>

              {/* Digital Slip Box */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3 text-xs">
                <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                  <span className="font-bold text-slate-500 uppercase tracking-wider text-[10px]">
                    Application Ref. Number:
                  </span>
                  <span className="font-mono font-bold text-sm text-blue-800 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                    {submittedApplication.enquiry_id}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-slate-700">
                  <div>
                    <span className="text-slate-400 block">Applicant / आवेदक:</span>
                    <span className="font-semibold text-slate-900">{submittedApplication.customer_name}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Mobile / मोबाइल:</span>
                    <span className="font-semibold text-slate-900">{submittedApplication.mobile}</span>
                  </div>
                  <div className="col-span-2">
                    <span className="text-slate-400 block">Service / सेवा:</span>
                    <span className="font-bold text-blue-700">{submittedApplication.service_name}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Status / स्थिति:</span>
                    <span className="font-bold text-emerald-700">Received & Processing</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Center Location:</span>
                    <span className="font-semibold text-slate-800">Gaini, Bareilly</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons for Slip */}
              <div className="space-y-2 pt-2">
                <a
                  href={`https://wa.me/${cleanWhatsApp}?text=${encodeURIComponent(
                    `Hello Balaji Communication, I have submitted an online application.\nApplication ID: ${submittedApplication.enquiry_id}\nApplicant: ${submittedApplication.customer_name}\nService: ${submittedApplication.service_name}\nMobile: ${submittedApplication.mobile}`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Send Slip on WhatsApp (+919870677605)</span>
                </a>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={handlePrint}
                    className="py-2.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs rounded-xl transition-colors flex items-center justify-center gap-1.5"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>Print Receipt</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleClose}
                    className="py-2.5 px-3 bg-slate-800 hover:bg-slate-900 text-white font-semibold text-xs rounded-xl transition-colors"
                  >
                    Close Window
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* APPLICATION FORM */
            <form onSubmit={handleSubmit} className="space-y-4">
              {errorMessage && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Service Selection */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {t('selectService')} *
                </label>
                <select
                  value={selectedServiceId}
                  onChange={(e) => setSelectedServiceId(e.target.value)}
                  required
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600/30 focus:border-blue-600"
                >
                  {services.map(s => (
                    <option key={s.service_id} value={s.service_id}>
                      [{s.category}] {language === 'hi' ? s.service_name_hi : s.service_name_en}
                    </option>
                  ))}
                </select>
              </div>

              {/* Full Name & Father/Husband Name */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {t('fullName')} *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ramesh Kumar"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600/30 focus:border-blue-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Father/Husband Name (पिता/पति का नाम)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Suresh Kumar"
                    value={fatherOrHusbandName}
                    onChange={(e) => setFatherOrHusbandName(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600/30 focus:border-blue-600"
                  />
                </div>
              </div>

              {/* Mobile Number & Urgency */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {t('mobileNumber')} *
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-2 text-xs font-bold text-slate-400">
                      +91
                    </span>
                    <input
                      type="tel"
                      required
                      maxLength={10}
                      placeholder="9870677605"
                      value={mobile}
                      onChange={(e) => setMobile(e.target.value)}
                      className="w-full pl-10 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 font-mono focus:outline-none focus:ring-2 focus:ring-blue-600/30 focus:border-blue-600"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Urgency / प्राथमिकता
                  </label>
                  <select
                    value={urgency}
                    onChange={(e) => setUrgency(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600/30 focus:border-blue-600"
                  >
                    <option value="Normal">Normal (सामान्य कार्यदिवस)</option>
                    <option value="Urgent">Urgent (आवश्यक)</option>
                    <option value="Immediate">Immediate Walk-in</option>
                  </select>
                </div>
              </div>

              {/* Village Address */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Village / Town (गाँव / कस्बा / पता)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Gaini, Bareilly"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600/30 focus:border-blue-600"
                />
              </div>

              {/* Contact Method */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  {t('preferredContact')}
                </label>
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-1.5 cursor-pointer text-xs text-slate-800">
                    <input
                      type="radio"
                      name="modal_contact"
                      value="WhatsApp"
                      checked={preferredContact === 'WhatsApp'}
                      onChange={() => setPreferredContact('WhatsApp')}
                      className="text-emerald-600 focus:ring-emerald-500"
                    />
                    <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                    <span>WhatsApp</span>
                  </label>

                  <label className="flex items-center gap-1.5 cursor-pointer text-xs text-slate-800">
                    <input
                      type="radio"
                      name="modal_contact"
                      value="Call"
                      checked={preferredContact === 'Call'}
                      onChange={() => setPreferredContact('Call')}
                      className="text-blue-600 focus:ring-blue-500"
                    />
                    <Phone className="w-3.5 h-3.5 text-blue-600" />
                    <span>Phone Call</span>
                  </label>
                </div>
              </div>

              {/* Remarks */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Remarks / दस्तावेजी आवश्यकता (वैकल्पिक)
                </label>
                <textarea
                  rows={2}
                  placeholder="Details of correction, scheme name or query..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600/30 focus:border-blue-600"
                />
              </div>

              {/* Security Warning */}
              <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl flex items-start gap-2 text-[11px] text-slate-600">
                <Shield className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>{t('securityNotice')}</span>
              </div>

              {/* Submit Buttons */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 px-4 bg-blue-700 hover:bg-blue-800 active:bg-blue-900 disabled:opacity-60 text-white font-bold text-xs sm:text-sm rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  <span>
                    {isSubmitting
                      ? (language === 'hi' ? 'जमा हो रहा है...' : 'Submitting Application...')
                      : (language === 'hi' ? 'सीधे ऑनलाइन आवेदन जमा करें' : 'Submit Direct Online Application')}
                  </span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
