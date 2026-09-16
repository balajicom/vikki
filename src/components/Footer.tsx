import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, MessageCircle, Mail, MapPin, Clock, ShieldAlert, ArrowRight, ExternalLink } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useData } from '../context/DataContext';

export const Footer: React.FC = () => {
  const { language, t } = useLanguage();
  const { settings } = useData();

  const cleanWhatsApp = (settings.whatsapp_number || '919876543210').replace(/\D/g, '');
  const cleanPhone = settings.phone_number || '+919876543210';

  const categories = [
    { name: 'Aadhaar Services', filter: 'Aadhaar' },
    { name: 'Ration Card', filter: 'Ration Card' },
    { name: 'PM Kisan Samman Nidhi', filter: 'PM Kisan' },
    { name: 'Ayushman Bharat Card', filter: 'Ayushman' },
    { name: 'Voter ID / पहचान पत्र', filter: 'Voter ID' },
    { name: 'PAN Card Services', filter: 'PAN Card' },
    { name: 'Certificates (Income/Caste/Niwas)', filter: 'Certificates' },
    { name: 'Digital & Print Services', filter: 'Other Digital Services' }
  ];

  return (
    <footer id="site-footer" className="bg-slate-950 text-slate-300 pt-14 pb-24 md:pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Col 1: Brand & Identity */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-600 text-white flex items-center justify-center font-black text-lg shadow-md">
                BC
              </div>
              <div>
                <h3 className="text-white font-extrabold text-lg tracking-tight">
                  {settings.business_name_en}
                </h3>
                <p className="text-amber-400 font-semibold text-xs">
                  {settings.business_name_hi} (जन सेवा केंद्र)
                </p>
              </div>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              {language === 'hi' ? settings.about_us_hi : settings.about_us_en}
            </p>

            <div className="pt-2 flex flex-wrap gap-2">
              <a
                href={`tel:${cleanPhone}`}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-white rounded-md border border-slate-700 transition-colors"
              >
                <Phone className="w-3.5 h-3.5 text-blue-400" />
                <span>Call Center</span>
              </a>
              <a
                href={`https://wa.me/${cleanWhatsApp}?text=${encodeURIComponent('Hello Balaji Communication, I need assistance.')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-emerald-950/80 hover:bg-emerald-900 text-emerald-300 border border-emerald-800/60 rounded-md transition-colors"
              >
                <MessageCircle className="w-3.5 h-3.5 fill-emerald-400" />
                <span>WhatsApp</span>
              </a>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div className="space-y-3">
            <h4 className="text-white font-bold text-sm uppercase tracking-wider text-slate-100 border-b border-slate-800 pb-2">
              Quick Links
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/" className="hover:text-blue-400 flex items-center gap-1.5 transition-colors">
                  <ArrowRight className="w-3 h-3 text-slate-500" />
                  <span>{t('navHome')}</span>
                </Link>
              </li>
              <li>
                <Link to="/services" className="hover:text-blue-400 flex items-center gap-1.5 transition-colors">
                  <ArrowRight className="w-3 h-3 text-slate-500" />
                  <span>{t('navServices')}</span>
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-blue-400 flex items-center gap-1.5 transition-colors">
                  <ArrowRight className="w-3 h-3 text-slate-500" />
                  <span>{t('navAbout')}</span>
                </Link>
              </li>
              <li>
                <Link to="/how-it-works" className="hover:text-blue-400 flex items-center gap-1.5 transition-colors">
                  <ArrowRight className="w-3 h-3 text-slate-500" />
                  <span>{t('navHowItWorks')}</span>
                </Link>
              </li>
              <li>
                <Link to="/documents" className="hover:text-blue-400 flex items-center gap-1.5 transition-colors">
                  <ArrowRight className="w-3 h-3 text-slate-500" />
                  <span>{t('navDocuments')}</span>
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-blue-400 flex items-center gap-1.5 transition-colors">
                  <ArrowRight className="w-3 h-3 text-slate-500" />
                  <span>{t('navContact')}</span>
                </Link>
              </li>
              <li>
                <Link to="/privacy-policy" className="hover:text-blue-400 flex items-center gap-1.5 transition-colors">
                  <ArrowRight className="w-3 h-3 text-slate-500" />
                  <span>Privacy Policy</span>
                </Link>
              </li>
              <li>
                <Link to="/terms-conditions" className="hover:text-blue-400 flex items-center gap-1.5 transition-colors">
                  <ArrowRight className="w-3 h-3 text-slate-500" />
                  <span>Terms & Conditions</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Service Categories */}
          <div className="space-y-3">
            <h4 className="text-white font-bold text-sm uppercase tracking-wider text-slate-100 border-b border-slate-800 pb-2">
              Service Categories
            </h4>
            <ul className="space-y-2 text-xs">
              {categories.map((cat, i) => (
                <li key={i}>
                  <Link
                    to={`/services?category=${encodeURIComponent(cat.filter)}`}
                    className="hover:text-blue-400 flex items-center gap-1.5 transition-colors"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                    <span>{cat.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4: Contact & Center Info */}
          <div className="space-y-3">
            <h4 className="text-white font-bold text-sm uppercase tracking-wider text-slate-100 border-b border-slate-800 pb-2">
              Contact Center
            </h4>
            <div className="space-y-2.5 text-xs text-slate-400">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                <span>{language === 'hi' ? settings.address_hi : settings.address_en}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                <a href={`tel:${cleanPhone}`} className="hover:text-white transition-colors">
                  {settings.phone_number}
                </a>
              </div>
              <div className="flex items-center gap-2">
                <MessageCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                <a
                  href={`https://wa.me/${cleanWhatsApp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors"
                >
                  +{cleanWhatsApp} (WhatsApp)
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-amber-400 shrink-0" />
                <a href={`mailto:${settings.email}`} className="hover:text-white transition-colors truncate">
                  {settings.email}
                </a>
              </div>
              <div className="flex items-start gap-2 pt-1">
                <Clock className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                <span>{language === 'hi' ? settings.opening_hours_hi : settings.opening_hours_en}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Prominent Legal / Trust Notice Banner */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 sm:p-5 mb-8">
          <div className="flex items-start gap-3">
            <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h5 className="text-white font-bold text-xs uppercase tracking-wider">
                {t('legalDisclaimerTitle')}
              </h5>
              <p className="text-xs text-slate-400 leading-relaxed">
                {t('legalDisclaimerBody')}
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Copyright */}
        <div className="pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <p>© 2026 Balaji Communication (जन सेवा केंद्र). All Rights Reserved.</p>
          <div className="flex items-center gap-4">
            <Link to="/privacy-policy" className="hover:text-slate-400 transition-colors">Privacy</Link>
            <span>•</span>
            <Link to="/terms-conditions" className="hover:text-slate-400 transition-colors">Terms</Link>
            <span>•</span>
            <Link to="/admin" className="hover:text-slate-400 transition-colors">Admin Portal</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
