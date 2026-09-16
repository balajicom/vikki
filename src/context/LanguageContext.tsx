import React, { createContext, useContext, useState, useEffect } from 'react';
import { Language } from '../types';

interface Translations {
  [key: string]: {
    en: string;
    hi: string;
  };
}

export const TRANSLATIONS: Translations = {
  // Navigation
  navHome: { en: 'Home', hi: 'मुख्य पृष्ठ' },
  navServices: { en: 'Services', hi: 'सेवाएं' },
  navAbout: { en: 'About Us', hi: 'हमारे बारे में' },
  navHowItWorks: { en: 'How It Works', hi: 'कार्य प्रणाली' },
  navDocuments: { en: 'Documents', hi: 'आवश्यक दस्तावेज' },
  navContact: { en: 'Contact', hi: 'संपर्क करें' },
  navLogin: { en: 'Admin Login', hi: 'एडमिन लॉगिन' },
  
  // Call to Actions
  callNow: { en: 'Call Now', hi: 'कॉल करें' },
  whatsAppNow: { en: 'WhatsApp Now', hi: 'व्हाट्सएप करें' },
  viewServices: { en: 'View All Services', hi: 'सभी सेवाएं देखें' },
  applyEnquire: { en: 'Apply / Enquire', hi: 'आवेदन / पूछताछ' },
  viewDetails: { en: 'View Details', hi: 'विवरण देखें' },
  getDirections: { en: 'Get Directions', hi: 'रास्ता देखें' },
  
  // Hero & Sections
  popularServicesTitle: { en: 'Popular Citizen Services', hi: 'प्रमुख नागरिक सेवाएं' },
  popularServicesSub: { en: 'Most requested government applications and digital verification services', hi: 'नागरिकों द्वारा सर्वाधिक उपयोग की जाने वाली सरकारी एवं डिजिटल सेवाएं' },
  allServicesTitle: { en: 'Explore All Digital Services', hi: 'हमारी संपूर्ण ऑनलाइन सेवाएं' },
  searchPlaceholder: { en: 'Search for a service (e.g. Aadhaar, Ration, PM Kisan)...', hi: 'सेवा खोजें (जैसे: आधार, राशन, किसान, पैन)...' },
  allCategories: { en: 'All Categories', hi: 'सभी श्रेणियां' },
  noServicesFound: { en: 'No services found matching your criteria', hi: 'आपकी खोज के अनुसार कोई सेवा नहीं मिली' },
  
  // Service Modal
  requiredDocuments: { en: 'Required Documents', hi: 'आवश्यक दस्तावेज' },
  estimatedTime: { en: 'Estimated Processing', hi: 'अनुमानित प्रक्रिया समय' },
  importantNoticeTitle: { en: 'Important Notice', hi: 'महत्वपूर्ण सूचना' },
  importantNoticeText: { 
    en: 'Actual service availability, charges, processing time and final approval are strictly subject to the concerned government department/authority.',
    hi: 'वास्तविक सेवा उपलब्धता, शुल्क, प्रक्रिया में लगने वाला समय और अंतिम स्वीकृति संबंधित सरकारी विभाग/प्राधिकरण के अधीन है।'
  },
  
  // Enquiry Form
  enquiryFormTitle: { en: 'Service Enquiry & Assistance Request', hi: 'सेवा पूछताछ एवं आवेदन सहायता फॉर्म' },
  enquiryFormDesc: { 
    en: 'Fill out this simple form. Our team at Balaji Communication will contact you shortly.',
    hi: 'यह आसान फॉर्म भरें। बालाजी कम्युनिकेशन की टीम जल्द ही आपसे संपर्क करेगी।'
  },
  fullNameLabel: { en: 'Full Name', hi: 'पूरा नाम' },
  fullNamePlaceholder: { en: 'Enter your full name', hi: 'अपना पूरा नाम दर्ज करें' },
  mobileLabel: { en: 'Mobile Number', hi: 'मोबाइल नंबर' },
  mobilePlaceholder: { en: '10-digit mobile number', hi: '10 अंकों का मोबाइल नंबर' },
  serviceLabel: { en: 'Service Required', hi: 'आवश्यक सेवा' },
  contactPrefLabel: { en: 'Preferred Contact Method', hi: 'संपर्क का पसंदीदा माध्यम' },
  prefCall: { en: 'Phone Call', hi: 'फोन कॉल' },
  prefWhatsApp: { en: 'WhatsApp Message', hi: 'व्हाट्सएप मैसेज' },
  messageLabel: { en: 'Your Query / Message (Optional)', hi: 'आपका प्रश्न या संदेश (वैकल्पिक)' },
  messagePlaceholder: { en: 'Describe what you need help with...', hi: 'बताएं कि आपको किस काम में सहायता चाहिए...' },
  submitEnquiry: { en: 'Submit Request', hi: 'अनुरोध भेजें' },
  submitting: { en: 'Submitting...', hi: 'भेजा जा रहा है...' },
  securityWarning: { 
    en: 'Security Notice: Never submit sensitive credentials like Aadhaar OTP, bank password, UPI PIN, or ATM PIN. We will never ask for them.',
    hi: 'सुरक्षा सूचना: आधार ओटीपी, बैंक पासवर्ड, यूपीआई पिन अथवा एटीएम पिन जैसी गोपनीय जानकारी कभी साझा न करें।'
  },
  thankYouMessage: { 
    en: 'Thank you. Balaji Communication will contact you shortly.',
    hi: 'धन्यवाद। बालाजी कम्युनिकेशन जल्द ही आपसे संपर्क करेगा।'
  },
  
  // Legal Notice
  legalDisclaimerTitle: { en: 'Independent Service Disclaimer', hi: 'स्वतंत्र सेवा प्रदाता घोषणा' },
  legalDisclaimerBody: {
    en: 'Balaji Communication is an independent digital service assistance center and is not a government website unless specifically authorized. Government services, eligibility, fees, processing times and final approval are subject to the respective government department/authority.',
    hi: 'बालाजी कम्युनिकेशन एक स्वतंत्र डिजिटल सेवा सहायता केंद्र (जन सेवा केंद्र) है और यह कोई आधिकारिक सरकारी वेबसाइट नहीं है। सभी सरकारी सेवाएं, पात्रता, शुल्क, प्रक्रिया में लगने वाला समय एवं अंतिम स्वीकृति संबंधित सरकारी विभाग अथवा प्राधिकरण के नियमों के अधीन है।'
  },

  // How It Works Steps
  step1Title: { en: '1. Choose Service', hi: '1. सेवा चुनें' },
  step1Desc: { en: 'Select the required government or digital service from our portal.', hi: 'हमारी वेबसाइट पर अपनी आवश्यकतानुसार सरकारी या डिजिटल सेवा का चयन करें।' },
  step2Title: { en: '2. Contact Us', hi: '2. संपर्क करें' },
  step2Desc: { en: 'Reach out via instant WhatsApp, call, or submit an online request.', hi: 'व्हाट्सएप, फोन कॉल या वेबसाइट फॉर्म के माध्यम से हमसे सीधा संपर्क करें।' },
  step3Title: { en: '3. Submit Required Documents', hi: '3. दस्तावेज उपलब्ध कराएं' },
  step3Desc: { en: 'Provide only the necessary documents specified for your chosen service.', hi: 'चयनित सेवा के लिए आवश्यक वैध मूल दस्तावेज अथवा प्रतियां उपलब्ध कराएं।' },
  step4Title: { en: '4. Get Assistance', hi: '4. सहायता प्राप्त करें' },
  step4Desc: { en: 'Our experienced staff completes your application with official receipt.', hi: 'हमारी अनुभवी टीम आपके आवेदन को समय पर पूरा कर अधिकृत रसीद प्रदान करती है।' }
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('balaji_lang') as Language;
    return saved === 'en' || saved === 'hi' ? saved : 'hi'; // Default Hindi as requested for citizen center
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('balaji_lang', lang);
    document.documentElement.lang = lang;
  };

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  const t = (key: string): string => {
    if (TRANSLATIONS[key]) {
      return TRANSLATIONS[key][language] || TRANSLATIONS[key]['en'];
    }
    return key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
