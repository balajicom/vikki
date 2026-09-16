import React, { useState } from 'react';
import { MapPin, Phone, MessageCircle, Mail, Clock, Send, CheckCircle, AlertCircle, Shield, ExternalLink } from 'lucide-react';
import { useData } from '../context/DataContext';
import { useLanguage } from '../context/LanguageContext';

export const ContactPage: React.FC = () => {
  const { settings, services, submitEnquiry } = useData();
  const { language, t } = useLanguage();

  const [fullName, setFullName] = useState('');
  const [mobile, setMobile] = useState('');
  const [selectedService, setSelectedService] = useState('');
  const [contactPref, setContactPref] = useState<'Call' | 'WhatsApp'>('Call');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const cleanWhatsApp = (settings.whatsapp_number || '919876543210').replace(/\D/g, '');
  const cleanPhone = settings.phone_number || '+919876543210';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!fullName.trim()) {
      setErrorMessage(language === 'hi' ? 'कृपया अपना नाम दर्ज करें।' : 'Please enter your full name.');
      return;
    }

    const cleanMob = mobile.replace(/\D/g, '');
    if (cleanMob.length !== 10) {
      setErrorMessage(language === 'hi' ? 'कृपया वैध 10 अंकों का मोबाइल नंबर दर्ज करें।' : 'Please enter a valid 10-digit mobile number.');
      return;
    }

    const rawCheck = `${fullName} ${message}`.toLowerCase();
    if (rawCheck.includes('otp') || rawCheck.includes('pin') || rawCheck.includes('password')) {
      setErrorMessage(t('securityWarning'));
      return;
    }

    setIsSubmitting(true);
    const res = await submitEnquiry({
      customer_name: fullName.trim(),
      mobile: cleanMob,
      service_name: selectedService || 'General Inquiry',
      message: message.trim(),
      preferred_contact: contactPref
    });

    setIsSubmitting(false);
    if (res.success) {
      setSubmitted(true);
      setFullName('');
      setMobile('');
      setMessage('');
    } else {
      setErrorMessage(res.message);
    }
  };

  return (
    <div id="contact-page" className="min-h-screen bg-slate-50 py-12 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-700 bg-blue-100/70 px-3 py-1 rounded-full border border-blue-200">
            {language === 'hi' ? 'संपर्क सूत्र' : 'Get In Touch'}
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mt-2.5">
            {language === 'hi' ? 'बालाजी कम्युनिकेशन से संपर्क करें' : 'Contact Balaji Communication'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1.5 leading-relaxed">
            {language === 'hi'
              ? 'किसी भी सरकारी योजना, प्रमाण पत्र या डिजिटल सेवा सहायता के लिए हमें कॉल करें, व्हाट्सएप करें या सीधे केंद्र पर आएं।'
              : 'Visit our center or reach out via phone, WhatsApp or the contact form below.'}
          </p>
        </div>

        {/* Two Columns: Info & Map vs Form */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left: Contact Info & Map (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Center Info Cards */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-5">
              <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3">
                {settings.business_name_en}
                <span className="block text-xs font-semibold text-blue-700 mt-0.5">
                  {settings.business_name_hi} (जन सेवा केंद्र)
                </span>
              </h3>

              <div className="space-y-4 text-xs sm:text-sm text-slate-700">
                {/* Address */}
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center shrink-0 mt-0.5">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="font-bold text-slate-900 block mb-0.5">Address:</span>
                    <span className="leading-relaxed">
                      {language === 'hi' ? settings.address_hi : settings.address_en}
                    </span>
                  </div>
                </div>

                {/* Phone */}
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="font-bold text-slate-900 block mb-0.5">Phone Call:</span>
                    <a href={`tel:${cleanPhone}`} className="text-blue-700 hover:underline font-semibold">
                      {settings.phone_number}
                    </a>
                  </div>
                </div>

                {/* WhatsApp */}
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 mt-0.5">
                    <MessageCircle className="w-5 h-5 fill-emerald-600 text-white" />
                  </div>
                  <div>
                    <span className="font-bold text-slate-900 block mb-0.5">WhatsApp:</span>
                    <a
                      href={`https://wa.me/${cleanWhatsApp}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-emerald-700 hover:underline font-semibold"
                    >
                      +{cleanWhatsApp} (Direct Chat)
                    </a>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center shrink-0 mt-0.5">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="font-bold text-slate-900 block mb-0.5">Email ID:</span>
                    <a href={`mailto:${settings.email}`} className="text-blue-700 hover:underline break-all font-semibold">
                      {settings.email}
                    </a>
                  </div>
                </div>

                {/* Hours */}
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-lg bg-indigo-50 text-indigo-700 flex items-center justify-center shrink-0 mt-0.5">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="font-bold text-slate-900 block mb-0.5">Opening Hours:</span>
                    <span className="leading-relaxed">
                      {language === 'hi' ? settings.opening_hours_hi : settings.opening_hours_en}
                    </span>
                  </div>
                </div>
              </div>

              {/* Get Directions Button */}
              <div className="pt-2 border-t border-slate-100">
                <a
                  href={settings.google_maps_url || "https://maps.google.com"}
                  target="_blank"
                  rel="noopener noreferrer"
                  id="btn-contact-get-directions"
                  className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold rounded-xl shadow-xs transition-colors"
                >
                  <MapPin className="w-4 h-4 text-white" />
                  <span>{t('getDirections')} (Google Maps)</span>
                  <ExternalLink className="w-3.5 h-3.5 opacity-80" />
                </a>
              </div>
            </div>

            {/* Google Maps Visual Embed Area */}
            <div className="bg-white rounded-2xl p-3 border border-slate-200 shadow-xs overflow-hidden">
              <div className="relative w-full h-56 rounded-xl overflow-hidden bg-slate-200">
                <iframe
                  title="Balaji Communication Center Location"
                  src="https://maps.google.com/maps?q=Sector%2012%20Noida%20Uttar%20Pradesh&t=&z=14&ie=UTF8&iwloc=&output=embed"
                  className="w-full h-full border-0"
                  loading="lazy"
                  allowFullScreen
                />
              </div>
            </div>

          </div>

          {/* Right: Interactive Enquiry Form (7 cols) */}
          <div className="lg:col-span-7">
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm">
              <div className="mb-6">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                  Online Inquiry Desk
                </span>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mt-2">
                  {t('enquiryFormTitle')}
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 mt-1">
                  {t('enquiryFormDesc')}
                </p>
              </div>

              {submitted ? (
                <div className="text-center py-10 space-y-4">
                  <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
                    <CheckCircle className="w-10 h-10" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">
                    {language === 'hi' ? 'आपका अनुरोध दर्ज हो गया है!' : 'Request Successfully Submitted!'}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 max-w-sm mx-auto leading-relaxed font-medium">
                    {t('thankYouMessage')}
                  </p>
                  <button
                    type="button"
                    onClick={() => setSubmitted(false)}
                    className="mt-4 px-5 py-2.5 bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold rounded-xl transition-colors"
                  >
                    {language === 'hi' ? 'नया प्रश्न पूछें' : 'Submit Another Enquiry'}
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

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Name */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        {t('fullNameLabel')} <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        id="contact-page-name"
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder={t('fullNamePlaceholder')}
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500"
                      />
                    </div>

                    {/* Mobile */}
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
                          id="contact-page-mobile"
                          required
                          maxLength={10}
                          value={mobile}
                          onChange={(e) => setMobile(e.target.value.replace(/\D/g, ''))}
                          placeholder={t('mobilePlaceholder')}
                          className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-r-lg text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Service Required */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      {t('serviceLabel')}
                    </label>
                    <select
                      id="contact-page-service"
                      value={selectedService}
                      onChange={(e) => setSelectedService(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500"
                    >
                      <option value="">-- {language === 'hi' ? 'सेवा का चयन करें' : 'Select a service (or General Enquiry)'} --</option>
                      {services.map((s) => (
                        <option key={s.service_id} value={s.service_name_en}>
                          {language === 'hi' ? s.service_name_hi : s.service_name_en} ({s.category})
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Preferred Contact Method */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      {t('contactPrefLabel')}
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setContactPref('Call')}
                        className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg border text-xs font-semibold transition-all ${
                          contactPref === 'Call'
                            ? 'border-blue-600 bg-blue-50 text-blue-800'
                            : 'border-slate-300 bg-white text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        <Phone className="w-3.5 h-3.5 text-blue-600" />
                        <span>{t('prefCall')}</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setContactPref('WhatsApp')}
                        className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg border text-xs font-semibold transition-all ${
                          contactPref === 'WhatsApp'
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
                      id="contact-page-message"
                      rows={3}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder={t('messagePlaceholder')}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 resize-none"
                    />
                  </div>

                  {/* Security Notice */}
                  <div className="p-3 bg-amber-50 border border-amber-200/80 rounded-lg flex items-start gap-2 text-[11px] text-amber-900">
                    <Shield className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <p className="leading-tight font-medium">
                      {t('securityWarning')}
                    </p>
                  </div>

                  {/* Submit */}
                  <button
                    type="submit"
                    id="btn-contact-submit"
                    disabled={isSubmitting}
                    className="w-full py-3.5 bg-blue-700 hover:bg-blue-800 active:bg-blue-900 text-white font-bold text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70"
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
      </div>
    </div>
  );
};
