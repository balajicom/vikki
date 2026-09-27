import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  CheckCircle,
  AlertCircle,
  MessageCircle,
  Printer,
  ShieldCheck,
  Send,
  Building2,
  ArrowLeft,
  Search
} from 'lucide-react';
import { useData } from '../context/DataContext';
import { useLanguage } from '../context/LanguageContext';
import { Enquiry } from '../types';

export const DirectApplicationPage: React.FC = () => {
  const { services, settings, submitEnquiry } = useData();
  const { language, t } = useLanguage();
  const [searchParams] = useSearchParams();

  const [serviceId, setServiceId] = useState('');
  const [applicantName, setApplicantName] = useState('');
  const [fatherOrHusbandName, setFatherOrHusbandName] = useState('');
  const [mobile, setMobile] = useState('');
  const [villageAddress, setVillageAddress] = useState('');
  const [urgency, setUrgency] = useState<'Normal' | 'Urgent' | 'Immediate'>('Normal');
  const [preferredContact, setPreferredContact] = useState<'WhatsApp' | 'Call'>('WhatsApp');
  const [remarks, setRemarks] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedApplication, setSubmittedApplication] = useState<Enquiry | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Pre-select service from URL param (?service=srv-id)
  useEffect(() => {
    const srvParam = searchParams.get('service');
    if (srvParam && services.some(s => s.service_id === srvParam)) {
      setServiceId(srvParam);
    } else if (services.length > 0 && !serviceId) {
      setServiceId(services[0].service_id);
    }
  }, [searchParams, services, serviceId]);

  const selectedService = services.find(s => s.service_id === serviceId);
  const cleanWhatsApp = (settings.whatsapp_number || '919870677605').replace(/\D/g, '');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!applicantName.trim()) {
      setErrorMessage(language === 'hi' ? 'कृपया आवेदक का पूरा नाम दर्ज करें।' : 'Please enter applicant full name.');
      return;
    }

    const cleanMob = mobile.replace(/\D/g, '');
    if (cleanMob.length !== 10) {
      setErrorMessage(
        language === 'hi'
          ? 'कृपया वैध 10 अंकों का मोबाइल नंबर दर्ज करें।'
          : 'Please enter a valid 10-digit mobile number.'
      );
      return;
    }

    const checkText = `${applicantName} ${remarks} ${villageAddress}`.toLowerCase();
    if (checkText.includes('otp') || checkText.includes('pin') || checkText.includes('password') || checkText.includes('cvv')) {
      setErrorMessage(
        language === 'hi'
          ? 'सुरक्षा चेतावनी: कृपया फॉर्म में कोई पासवर्ड, ओटीपी या बैंक पिन दर्ज न करें।'
          : 'Security warning: Do not enter bank passwords, OTPs, or PINs in this form.'
      );
      return;
    }

    const serviceName = selectedService
      ? (language === 'hi' ? selectedService.service_name_hi : selectedService.service_name_en)
      : 'Jan Seva Kendra Application';

    setIsSubmitting(true);

    const res = await submitEnquiry({
      customer_name: applicantName.trim(),
      applicant_name: applicantName.trim(),
      mobile: cleanMob,
      father_or_husband_name: fatherOrHusbandName.trim(),
      address: villageAddress.trim(),
      service_id: serviceId,
      service_name: serviceName,
      category: selectedService?.category || 'Jan Seva Kendra',
      message: remarks.trim(),
      preferred_contact: preferredContact,
      urgency
    });

    setIsSubmitting(false);

    if (res.success && res.application) {
      setSubmittedApplication(res.application);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      setErrorMessage(res.message || 'Error submitting application');
    }
  };

  const handlePrintSlip = () => {
    window.print();
  };

  return (
    <div id="direct-application-page" className="min-h-screen bg-slate-50 py-10 sm:py-14">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        
        {/* Navigation Breadcrumb */}
        <div className="mb-6 flex items-center justify-between print:hidden">
          <Link
            to="/services"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-700 hover:text-blue-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{language === 'hi' ? 'सभी सेवाएं देखें' : 'Back to Services'}</span>
          </Link>

          <Link
            to="/track"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 px-3 py-1.5 rounded-lg shadow-2xs transition-colors"
          >
            <Search className="w-3.5 h-3.5 text-blue-600" />
            <span>{language === 'hi' ? 'आवेदन स्थिति ट्रैक करें' : 'Track Existing Application'}</span>
          </Link>
        </div>

        {/* SUCCESS CONFIRMATION / ACKNOWLEDGEMENT SLIP */}
        {submittedApplication ? (
          <div className="bg-white rounded-2xl border-2 border-emerald-600 shadow-xl overflow-hidden print:border-none print:shadow-none">
            {/* Header Slip Banner */}
            <div className="bg-emerald-700 text-white p-6 sm:p-7 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-xs flex items-center justify-center shrink-0">
                  <CheckCircle className="w-7 h-7 text-white" />
                </div>
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-100">
                    Official Digital Acknowledgement Receipt / पावती रसीद
                  </span>
                  <h1 className="text-xl sm:text-2xl font-black">
                    {language === 'hi' ? 'आवेदन सफलतापूर्वक दर्ज हुआ' : 'Application Submitted Successfully'}
                  </h1>
                </div>
              </div>

              <div className="bg-white/10 px-4 py-2 rounded-xl border border-white/20 text-right">
                <div className="text-[10px] text-emerald-100 font-bold uppercase">Application Ref. No.</div>
                <div className="font-mono text-base font-extrabold text-white tracking-wider">
                  {submittedApplication.enquiry_id}
                </div>
              </div>
            </div>

            {/* Slip Printable Content */}
            <div className="p-6 sm:p-8 space-y-6">
              {/* Center Details */}
              <div className="border-b border-slate-200 pb-5 flex flex-col sm:flex-row justify-between gap-4 text-xs text-slate-600">
                <div>
                  <div className="font-bold text-sm text-slate-900">{settings.business_name_en}</div>
                  <div className="font-semibold text-blue-700">{settings.business_name_hi}</div>
                  <div className="text-slate-500 mt-0.5">{language === 'hi' ? settings.address_hi : settings.address_en}</div>
                </div>
                <div className="sm:text-right space-y-0.5">
                  <div><strong>Date & Time:</strong> {new Date(submittedApplication.created_at).toLocaleString()}</div>
                  <div><strong>Helpline:</strong> {settings.phone_number}</div>
                  <div><strong>WhatsApp:</strong> +{cleanWhatsApp}</div>
                </div>
              </div>

              {/* Application Key-Value Table */}
              <div className="bg-slate-50 rounded-xl p-5 border border-slate-200 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-slate-500 font-medium block">Applicant Name / आवेदक का नाम:</span>
                  <span className="text-sm font-bold text-slate-900">{submittedApplication.customer_name}</span>
                </div>

                <div>
                  <span className="text-slate-500 font-medium block">Mobile Number / मोबाइल नंबर:</span>
                  <span className="text-sm font-bold text-slate-900">{submittedApplication.mobile}</span>
                </div>

                {submittedApplication.father_or_husband_name && (
                  <div>
                    <span className="text-slate-500 font-medium block">Father / Husband Name (पिता/पति):</span>
                    <span className="text-sm font-semibold text-slate-900">{submittedApplication.father_or_husband_name}</span>
                  </div>
                )}

                <div>
                  <span className="text-slate-500 font-medium block">Service Requested / सेवा का नाम:</span>
                  <span className="text-sm font-bold text-blue-700">{submittedApplication.service_name}</span>
                </div>

                {submittedApplication.address && (
                  <div className="sm:col-span-2">
                    <span className="text-slate-500 font-medium block">Applicant Address / पता:</span>
                    <span className="text-xs font-semibold text-slate-800">{submittedApplication.address}</span>
                  </div>
                )}

                <div>
                  <span className="text-slate-500 font-medium block">Processing Priority / प्राथमिकता:</span>
                  <span className="inline-block px-2 py-0.5 rounded text-[11px] font-bold bg-blue-100 text-blue-800 mt-0.5">
                    {submittedApplication.urgency || 'Normal'}
                  </span>
                </div>

                <div>
                  <span className="text-slate-500 font-medium block">Initial Status / वर्तमान स्थिति:</span>
                  <span className="inline-block px-2 py-0.5 rounded text-[11px] font-bold bg-amber-100 text-amber-900 mt-0.5">
                    Received & In Verification (प्राप्त)
                  </span>
                </div>
              </div>

              {/* Important Instructions Box */}
              <div className="p-4 bg-blue-50/70 border border-blue-200 rounded-xl text-xs text-blue-900 space-y-1.5">
                <div className="font-bold flex items-center gap-1.5 text-blue-800">
                  <ShieldCheck className="w-4 h-4 text-blue-600" />
                  <span>Important Instructions for Applicant / आवश्यक निर्देश:</span>
                </div>
                <p>
                  1. Please keep your <strong>Application ID ({submittedApplication.enquiry_id})</strong> safe for tracking and document submission.
                </p>
                <p>
                  2. Balaji Communication will contact you on <strong>{submittedApplication.mobile}</strong> or via WhatsApp to review documents.
                </p>
                <p>
                  3. You can also visit our center at Gaini, Bareilly along with original proofs during opening hours.
                </p>
              </div>

              {/* Action Buttons (Hidden when printing) */}
              <div className="pt-4 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 print:hidden">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handlePrintSlip}
                    className="inline-flex items-center gap-2 px-4 py-2.5 bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold rounded-xl shadow-xs transition-colors"
                  >
                    <Printer className="w-4 h-4" />
                    <span>Print / Save Receipt Slip</span>
                  </button>

                  <a
                    href={`https://wa.me/${cleanWhatsApp}?text=${encodeURIComponent(
                      `Hello Balaji Communication, I have submitted an online application.\nApplication ID: ${submittedApplication.enquiry_id}\nApplicant: ${submittedApplication.customer_name}\nService: ${submittedApplication.service_name}\nMobile: ${submittedApplication.mobile}`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Send Slip to WhatsApp Desk</span>
                  </a>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setSubmittedApplication(null);
                    setApplicantName('');
                    setMobile('');
                    setFatherOrHusbandName('');
                    setVillageAddress('');
                    setRemarks('');
                  }}
                  className="text-xs font-bold text-blue-700 hover:underline"
                >
                  Submit Another Application
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* APPLICATION FORM */
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-700 to-indigo-800 text-white p-6 sm:p-8">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-300 mb-2">
                <Building2 className="w-4 h-4" />
                <span>Balaji Communication Jan Seva Kendra Gaini</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                {language === 'hi' ? 'सीधे ऑनलाइन सेवा आवेदन पत्र' : 'Direct Online Application Portal'}
              </h1>
              <p className="text-xs sm:text-sm text-blue-100 mt-2 max-w-2xl leading-relaxed">
                {language === 'hi'
                  ? 'आधार, राशन कार्ड, पीएम किसान, आयुष्मान कार्ड, पहचान पत्र एवं अन्य सरकारी डिजिटल सेवाओं के लिए सीधे ऑनलाइन आवेदन भरें। तुरंत पावती संख्या प्राप्त करें।'
                  : 'Apply directly for Aadhaar, Ration Card, PM Kisan, Ayushman, Voter ID and government digital services. Get instant reference number and status tracking.'}
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6">
              {errorMessage && (
                <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs flex items-center gap-2.5">
                  <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Service Selection */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                  1. Select Service / सेवा का चयन करें *
                </label>
                <select
                  value={serviceId}
                  onChange={(e) => setServiceId(e.target.value)}
                  required
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600/30 focus:border-blue-600"
                >
                  {services.map(s => (
                    <option key={s.service_id} value={s.service_id}>
                      [{s.category}] {language === 'hi' ? s.service_name_hi : s.service_name_en} ({s.service_name_en})
                    </option>
                  ))}
                </select>

                {/* Selected Service Quick Info */}
                {selectedService && (
                  <div className="mt-3 p-3.5 bg-blue-50/70 border border-blue-100 rounded-xl text-xs text-slate-700 space-y-1.5">
                    <div className="font-bold text-blue-900">
                      {language === 'hi' ? selectedService.service_name_hi : selectedService.service_name_en}
                    </div>
                    <div className="text-slate-600 leading-relaxed">
                      {language === 'hi' ? selectedService.short_description_hi : selectedService.short_description_en}
                    </div>
                    {selectedService.required_documents && selectedService.required_documents.length > 0 && (
                      <div className="pt-1 text-[11px] text-slate-600">
                        <strong>{t('requiredDocuments')}:</strong> {selectedService.required_documents.join(', ')}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Applicant Personal Details */}
              <div className="space-y-4 pt-2 border-t border-slate-100">
                <span className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                  2. Applicant Details / आवेदक का विवरण
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Applicant Full Name */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Applicant Full Name (आवेदक का नाम) *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Ramesh Kumar"
                      value={applicantName}
                      onChange={(e) => setApplicantName(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600/30 focus:border-blue-600"
                    />
                  </div>

                  {/* Father or Husband Name */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Father / Husband Name (पिता या पति का नाम)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Suresh Kumar"
                      value={fatherOrHusbandName}
                      onChange={(e) => setFatherOrHusbandName(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600/30 focus:border-blue-600"
                    />
                  </div>

                  {/* Mobile Number */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      10-Digit Mobile Number (मोबाइल नंबर) *
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-2.5 text-xs font-bold text-slate-400">
                        +91
                      </span>
                      <input
                        type="tel"
                        required
                        maxLength={10}
                        placeholder="9870677605"
                        value={mobile}
                        onChange={(e) => setMobile(e.target.value)}
                        className="w-full pl-12 pr-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm text-slate-900 font-mono focus:outline-none focus:ring-2 focus:ring-blue-600/30 focus:border-blue-600"
                      />
                    </div>
                  </div>

                  {/* Urgency Level */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Urgency / प्राथमिकता
                    </label>
                    <select
                      value={urgency}
                      onChange={(e) => setUrgency(e.target.value as any)}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600/30 focus:border-blue-600"
                    >
                      <option value="Normal">Normal (सामान्य कार्यदिवस)</option>
                      <option value="Urgent">Urgent (आवश्यक / 24 घंटे)</option>
                      <option value="Immediate">Immediate Walk-in (केंद्र पर तत्काल)</option>
                    </select>
                  </div>
                </div>

                {/* Village / Town Address */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Village / Town / Locality (गाँव / कस्बा / पता)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Village Gaini, Tehsil Aonla, Bareilly"
                    value={villageAddress}
                    onChange={(e) => setVillageAddress(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600/30 focus:border-blue-600"
                  />
                </div>
              </div>

              {/* Contact Method & Remarks */}
              <div className="space-y-4 pt-2 border-t border-slate-100">
                <span className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                  3. Contact Preference & Remarks / संपर्क माध्यम
                </span>

                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-slate-800">
                    <input
                      type="radio"
                      name="preferred_contact"
                      value="WhatsApp"
                      checked={preferredContact === 'WhatsApp'}
                      onChange={() => setPreferredContact('WhatsApp')}
                      className="text-emerald-600 focus:ring-emerald-500"
                    />
                    <MessageCircle className="w-4 h-4 text-emerald-600" />
                    <span>WhatsApp Message</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-slate-800">
                    <input
                      type="radio"
                      name="preferred_contact"
                      value="Call"
                      checked={preferredContact === 'Call'}
                      onChange={() => setPreferredContact('Call')}
                      className="text-blue-600 focus:ring-blue-500"
                    />
                    <span>Direct Phone Call</span>
                  </label>
                </div>

                {/* Specific Message / Remarks */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Specific Requirement or Document Details (विवरण / टिप्पणी)
                  </label>
                  <textarea
                    rows={2}
                    placeholder="e.g. Want to link mobile number in Aadhaar card for bank loan verification."
                    value={remarks}
                    onChange={(e) => setRemarks(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600/30 focus:border-blue-600"
                  />
                </div>
              </div>

              {/* Safety & Compliance Notice */}
              <div className="p-3.5 bg-amber-50/90 border border-amber-200/80 rounded-xl flex items-start gap-2.5 text-xs text-amber-900 leading-relaxed">
                <ShieldCheck className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                <span>
                  {language === 'hi'
                    ? 'सुरक्षा नोट: बालाजी कम्युनिकेशन कभी भी आपसे ओटीपी, बैंक पासवर्ड या यूपीआई पिन नहीं मांगता है। इस वेबसाइट पर कोई गोपनीय पासवर्ड दर्ज न करें।'
                    : 'Security Note: Balaji Communication never requests OTPs, banking passwords, or UPI PINs. Do not enter confidential credentials online.'}
                </span>
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 px-6 bg-blue-700 hover:bg-blue-800 active:bg-blue-900 disabled:opacity-60 text-white font-bold text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  <span>
                    {isSubmitting
                      ? (language === 'hi' ? 'आवेदन दर्ज हो रहा है...' : 'Submitting Application...')
                      : (language === 'hi' ? 'सीधे ऑनलाइन आवेदन जमा करें' : 'Submit Direct Online Application')}
                  </span>
                </button>
              </div>

            </form>
          </div>
        )}

      </div>
    </div>
  );
};
