import { Service } from '../types';

/**
 * ============================================================================
 * BALAJI COMMUNICATION - HARDCODED SERVICES DATASET
 * ============================================================================
 * 
 * TO ADD A NEW SERVICE:
 * Simply copy and paste the block below into the HARDCODED_SERVICES array:
 * 
 * {
 *   service_id: "srv-your-service-slug",
 *   service_name_en: "Service Name in English",
 *   service_name_hi: "सेवा का नाम हिंदी में",
 *   category: "Aadhaar / Ration Card / PM Kisan / Voter ID / PAN Card / Certificates / Other",
 *   image_url: "https://images.unsplash.com/your-image-url",
 *   short_description_en: "Short description in English",
 *   short_description_hi: "संक्षिप्त विवरण हिंदी में",
 *   full_description_en: "Full details in English",
 *   full_description_hi: "पूरी जानकारी हिंदी में",
 *   required_documents: ["Original Aadhaar Card", "Mobile Number for OTP"],
 *   estimated_time: "1 to 3 Days",
 *   icon: "CreditCard",
 *   status: "Active",
 *   popular: true
 * },
 */

/**
 * Curated high-resolution Unsplash photo presets for Jan Seva Kendra services.
 * Allows 1-click picture selection when adding new services.
 */
export const SERVICE_PHOTO_PRESETS = [
  {
    label: "Aadhaar / Smart Card",
    url: "https://images.unsplash.com/photo-1512428559087-560fa5ceab42?auto=format&fit=crop&w=800&q=80",
    category: "Aadhaar"
  },
  {
    label: "Ration / Food Scheme",
    url: "https://images.unsplash.com/photo-1586281380349-632531db7ed4?auto=format&fit=crop&w=800&q=80",
    category: "Ration Card"
  },
  {
    label: "Farmer / PM Kisan",
    url: "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=800&q=80",
    category: "PM Kisan"
  },
  {
    label: "Health / Ayushman",
    url: "https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=800&q=80",
    category: "Ayushman"
  },
  {
    label: "Voter ID / Election",
    url: "https://images.unsplash.com/photo-1540910419892-4a36d2c3266c?auto=format&fit=crop&w=800&q=80",
    category: "Voter ID"
  },
  {
    label: "PAN / Banking / Tax",
    url: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=800&q=80",
    category: "PAN Card"
  },
  {
    label: "Certificates / Legal",
    url: "https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=800&q=80",
    category: "Certificates"
  },
  {
    label: "Forms / Online Application",
    url: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=800&q=80",
    category: "Other Digital Services"
  },
  {
    label: "Print, Scan & Photo",
    url: "https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?auto=format&fit=crop&w=800&q=80",
    category: "Other Digital Services"
  },
  {
    label: "E-Shram / Labour Welfare",
    url: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80",
    category: "Other Digital Services"
  },
  {
    label: "Pension / Senior Citizen",
    url: "https://images.unsplash.com/photo-1473496169904-658ba7c44d8a?auto=format&fit=crop&w=800&q=80",
    category: "Certificates"
  },
  {
    label: "Vehicle & Driving License",
    url: "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?auto=format&fit=crop&w=800&q=80",
    category: "Other Digital Services"
  }
];

export const HARDCODED_SERVICES: Service[] = [
     {
    service_id: "srv-custom-mw8rlqe7",
    service_name_en: "PPPPPPP",
    service_name_hi: "PPPPPPP",
    category: "Other Digital Services",
    image_url: "https://kommodo.ai/tools/image-to-url",
    short_description_en: "PPPPPPP",
    short_description_hi: "PPPPPPP",
    full_description_en: "PPPPPPP",
    full_description_hi: "PPPPPPP",
    required_documents: [
      "Original Aadhaar Card (मूल आधार कार्ड)",
      "Active Mobile Number (चालू मोबाइल नंबर)",
      "Bank Passbook (बैंक पासबुक)"
],
    icon: "Sparkles",
    status: "Active",
    popular: true,
    estimated_time: "1-3 Days",
    whatsapp_message: "Hello Balaji Communication, I want information about PPPPPPP.",
    created_at: "2026-11-09T04:32:17.887Z",
    updated_at: "2026-11-09T04:32:17.887Z"
  },
  {
    service_id: "srv-aadhaar-mob",
    service_name_en: "Aadhaar Mobile Number Update",
    service_name_hi: "आधार मोबाइल नंबर अपडेट / लिंक",
    category: "Aadhaar",
    image_url: "https://images.unsplash.com/photo-1512428559087-560fa5ceab42?auto=format&fit=crop&w=800&q=80",
    short_description_en: "Link or change your active mobile number in Aadhaar for OTPs and verification.",
    short_description_hi: "बैंक, डिजीलॉकर और सरकारी योजनाओं के ओटीपी के लिए आधार में नया मोबाइल लिंक करवाएं।",
    full_description_en: "Updating your mobile number in Aadhaar is essential for receiving OTPs for banking, ITR verification, DigiLocker, and government benefits. We assist with biometric verification guidance and status tracking.",
    full_description_hi: "आधार में मोबाइल नंबर लिंक होना बैंक, डिजीलॉकर, राशन कार्ड और सरकारी योजनाओं के ओटीपी के लिए अनिवार्य है। हमारे केंद्र पर बायोमेट्रिक सत्यापन मार्गदर्शन उपलब्ध है।",
    required_documents: [
      "Original Aadhaar Card (मूल आधार कार्ड)",
      "Active Mobile SIM to be linked (चालू मोबाइल नंबर)",
      "Physical presence for biometric verification (बायोमेट्रिक उपस्थिति)"
    ],
    icon: "Smartphone",
    status: "Active",
    popular: true,
    estimated_time: "24-48 Hours",
    whatsapp_message: "Hello Balaji Communication, I want information about Aadhaar Mobile Update.",
    created_at: "2026-01-10T10:00:00.000Z",
    updated_at: "2026-01-10T10:00:00.000Z"
  },
  {
    service_id: "srv-aadhaar-corr",
    service_name_en: "Aadhaar Correction & Address Update",
    service_name_hi: "आधार सुधार एवं पता बदलाव",
    category: "Aadhaar",
    image_url: "https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=800&q=80",
    short_description_en: "Correction in name, date of birth, gender, husband/father name, or residence address.",
    short_description_hi: "आधार कार्ड में नाम, जन्मतिथि, पिता/पति का नाम एवं पता सुधारने हेतु उचित सहायता।",
    full_description_en: "Get corrections in demographic details such as name spelling, date of birth, father/husband name, and residential address updated in Aadhaar database in accordance with UIDAI guidelines.",
    full_description_hi: "UIDAI नियमों के अनुसार आधार कार्ड में नाम, पिता/पति का नाम, जन्मतिथि एवं आवासीय पता ठीक कराने हेतु संपूर्ण दस्तावेजी सहायता।",
    required_documents: [
      "Existing Aadhaar Card copy (वर्तमान आधार प्रति)",
      "Proof of Identity / Address (पहचान व निवास प्रमाण)",
      "Marksheet / Voter ID / Ration Card (यदि लागू हो)"
    ],
    icon: "UserCheck",
    status: "Active",
    popular: true,
    estimated_time: "3-7 Working Days",
    whatsapp_message: "Hello Balaji Communication, I want information about Aadhaar Correction.",
    created_at: "2026-01-10T10:00:00.000Z",
    updated_at: "2026-01-10T10:00:00.000Z"
  },
  {
    service_id: "srv-aadhaar-down",
    service_name_en: "Aadhaar Download & PVC Smart Card",
    service_name_hi: "आधार डाउनलोड एवं पीवीसी प्लास्टिक कार्ड",
    category: "Aadhaar",
    image_url: "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=800&q=80",
    short_description_en: "Instant e-Aadhaar PDF download and ordering official waterproof PVC smart card.",
    short_description_hi: "तुरंत ई-आधार डाउनलोड और वॉटरप्रूफ सुरक्षित पीवीसी (प्लास्टिक) कार्ड प्रिंट कराने की सुविधा।",
    full_description_en: "Lost your physical Aadhaar card? Get high-quality e-Aadhaar downloaded instantly through OTP and order official UIDAI PVC smart card with QR code and hologram.",
    full_description_hi: "यदि आधार खो गया है, तो तुरंत ओटीपी के माध्यम से ई-आधार डाउनलोड कराएं या आधिकारिक क्यूआर कोड युक्त पीवीसी प्लास्टिक कार्ड मंगवाएं।",
    required_documents: [
      "Aadhaar Number or Enrollment Slip (आधार नंबर या पर्ची)",
      "Registered Mobile Phone for OTP (ओटीपी के लिए मोबाइल)"
    ],
    icon: "CreditCard",
    status: "Active",
    popular: true,
    estimated_time: "Instant Download / 5 Mins",
    whatsapp_message: "Hello Balaji Communication, I want information about Aadhaar Download and PVC Card.",
    created_at: "2026-01-10T10:00:00.000Z",
    updated_at: "2026-01-10T10:00:00.000Z"
  },
  {
    service_id: "srv-ration-new",
    service_name_en: "New Ration Card Online Application",
    service_name_hi: "नया राशन कार्ड ऑनलाइन आवेदन",
    category: "Ration Card",
    image_url: "https://images.unsplash.com/photo-1586281380349-632531db7ed4?auto=format&fit=crop&w=800&q=80",
    short_description_en: "Apply for new NFSA family ration card (Patra Grihasti / Antyodaya).",
    short_description_hi: "पात्र परिवारों के लिए नया राशन कार्ड ऑनलाइन अप्लाई करने में संपूर्ण दस्तावेजी सहायता।",
    full_description_en: "Complete documentation and online portal registration for fresh ration card applications. Includes family member details verification and departmental tracking.",
    full_description_hi: "परिवार के सभी सदस्यों के विवरण, आधार एवं आय प्रमाण पत्र के साथ खाद्य एवं रसद विभाग के पोर्टल पर नए राशन कार्ड के लिए आवेदन।",
    required_documents: [
      "Head of Family (Female) Aadhaar Card & Photo (परिवार मुखिया की फोटो व आधार)",
      "Aadhaar copies of all family members (सभी सदस्यों के आधार कार्ड)",
      "Income Certificate (आय प्रमाण पत्र)",
      "Bank Passbook copy (बैंक पासबुक)"
    ],
    icon: "FileSpreadsheet",
    status: "Active",
    popular: true,
    estimated_time: "15-30 Working Days",
    whatsapp_message: "Hello Balaji Communication, I want information about New Ration Card Apply.",
    created_at: "2026-01-10T10:00:00.000Z",
    updated_at: "2026-01-10T10:00:00.000Z"
  },
  {
    service_id: "srv-ration-corr",
    service_name_en: "Ration Card Member Addition & Correction",
    service_name_hi: "राशन कार्ड में नया नाम जोड़ना / सुधार",
    category: "Ration Card",
    image_url: "https://images.unsplash.com/photo-1536939459926-301728717817?auto=format&fit=crop&w=800&q=80",
    short_description_en: "Add child or daughter-in-law, remove married member, or correct name in ration card.",
    short_description_hi: "राशन कार्ड में नए बच्चे/सदस्य का नाम जोड़ना, नाम हटाना अथवा गलतियों में सुधार।",
    full_description_en: "Online submission for adding newborn children or daughters-in-law into existing ration cards, surrendering/removing units upon marriage, or modifying head of household.",
    full_description_hi: "विवाह के पश्चात नई बहू का नाम जोड़ना, नवजात शिशु की यूनिट जोड़ना या राशन कार्ड में नाम की स्पेलिंग दुरुस्त कराने की ऑनलाइन प्रक्रिया।",
    required_documents: [
      "Original Ration Card Number (राशन कार्ड नंबर)",
      "New member's Aadhaar Card / Birth Certificate (नए सदस्य का आधार या जन्म प्रमाण पत्र)"
    ],
    icon: "Users",
    status: "Active",
    popular: false,
    estimated_time: "10-20 Working Days",
    whatsapp_message: "Hello Balaji Communication, I want information about Ration Card Member Addition.",
    created_at: "2026-01-10T10:00:00.000Z",
    updated_at: "2026-01-10T10:00:00.000Z"
  },
  {
    service_id: "srv-pmkisan-reg",
    service_name_en: "PM Kisan Samman Nidhi Registration",
    service_name_hi: "पीएम किसान सम्मान निधि नया पंजीकरण",
    category: "PM Kisan",
    image_url: "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=800&q=80",
    short_description_en: "Farmer enrollment to receive ₹6,000 yearly financial assistance directly into bank account.",
    short_description_hi: "पात्र किसान भाइयों के लिए सालाना ₹6,000 सहायता प्राप्त करने हेतु नया ऑनलाइन पंजीकरण।",
    full_description_en: "Assistance for small and marginal landholding farmer families to register under PM-KISAN scheme, upload land revenue records (Khatauni) and verify bank details.",
    full_description_hi: "पीएम-किसान योजना के अंतर्गत किसानों का ऑनलाइन रजिस्ट्रेशन, खतौनी भूलेख विवरण दर्ज करना एवं बैंक खाते का सत्यापन।",
    required_documents: [
      "Farmer's Aadhaar Card (किसान का आधार कार्ड)",
      "Land Record / Khatauni (खसरा/खतौनी की नकल)",
      "Bank Account Passbook (बैंक पासबुक)",
      "Aadhaar-linked Mobile Number (ओटीपी के लिए मोबाइल)"
    ],
    icon: "Tractor",
    status: "Active",
    popular: true,
    estimated_time: "Revenue Department Verification",
    whatsapp_message: "Hello Balaji Communication, I want information about PM Kisan Registration.",
    created_at: "2026-01-10T10:00:00.000Z",
    updated_at: "2026-01-10T10:00:00.000Z"
  },
  {
    service_id: "srv-pmkisan-kyc",
    service_name_en: "PM Kisan e-KYC & Status Check",
    service_name_hi: "पीएम किसान ई-केवाईसी एवं किस्त स्थिति जांच",
    category: "PM Kisan",
    image_url: "https://images.unsplash.com/photo-1628348068343-c6a848d2b6dd?auto=format&fit=crop&w=800&q=80",
    short_description_en: "Mandatory OTP or Biometric fingerprint e-KYC to keep installments active.",
    short_description_hi: "किस्त न रुकने पाए इसके लिए बायोमेट्रिक या आधार ओटीपी से तुरंत ई-केवाईसी करवाएं।",
    full_description_en: "If your PM-Kisan installment is stuck due to pending eKYC, land-seeding issues, or NPCI bank account mapping, visit our center for instant resolution.",
    full_description_hi: "अटकी हुई किस्तें चालू कराने, भूमि सीडिंग समस्या दूर करने और ई-केवाईसी फिंगरप्रिंट या ओटीपी द्वारा तुरंत पूर्ण कराने की सेवा।",
    required_documents: [
      "Aadhaar Card (आधार कार्ड)",
      "Aadhaar Registered Mobile Number (ओटीपी के लिए मोबाइल)"
    ],
    icon: "ShieldCheck",
    status: "Active",
    popular: true,
    estimated_time: "Instant (5 Minutes)",
    whatsapp_message: "Hello Balaji Communication, I want information about PM Kisan e-KYC.",
    created_at: "2026-01-10T10:00:00.000Z",
    updated_at: "2026-01-10T10:00:00.000Z"
  },
  {
    service_id: "srv-ayushman-card",
    service_name_en: "Ayushman Card Apply & Download",
    service_name_hi: "आयुष्मान भारत गोल्डन कार्ड (₹5 लाख मुफ्त इलाज)",
    category: "Ayushman",
    image_url: "https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=800&q=80",
    short_description_en: "Check eligibility under PM-JAY and apply/download your cashless hospital treatment card.",
    short_description_hi: "प्रतिवर्ष ₹5 लाख तक के मुफ्त इलाज हेतु आयुष्मान कार्ड की पात्रता जांच, आवेदन व डाउनलोड।",
    full_description_en: "Under Ayushman Bharat Pradhan Mantri Jan Arogya Yojana, eligible families get cashless treatment up to ₹5 lakh per year in empanelled hospitals. We verify your name in the SECC list or Ration Card database and generate the official PVC card.",
    full_description_hi: "पात्रता सूची या राशन कार्ड के आधार पर आयुष्मान कार्ड केवाईसी, नाम सर्च और तुरंत ओरिजिनल आयुष्मान कार्ड प्रिंट की सुविधा।",
    required_documents: [
      "Aadhaar Card of Applicant (आवेदक का आधार कार्ड)",
      "Ration Card with 6+ units or PM-JAY letter (राशन कार्ड या आयुष्मान पत्र)",
      "Mobile Phone for OTP (ओटीपी के लिए मोबाइल)"
    ],
    icon: "HeartPulse",
    status: "Active",
    popular: true,
    estimated_time: "Instant Eligibility Check / Approval 24-48h",
    whatsapp_message: "Hello Balaji Communication, I want information about Ayushman Card.",
    created_at: "2026-01-10T10:00:00.000Z",
    updated_at: "2026-01-10T10:00:00.000Z"
  },
  {
    service_id: "srv-voter-id",
    service_name_en: "Voter ID / पहचान पत्र Apply & Correction",
    service_name_hi: "वोटर आईडी (पहचान पत्र) नया आवेदन एवं संशोधन",
    category: "Voter ID",
    image_url: "https://images.unsplash.com/photo-1540910419892-4a36d2c3266c?auto=format&fit=crop&w=800&q=80",
    short_description_en: "New voter registration (Form 6), address shift (Form 8), and digital e-EPIC download.",
    short_description_hi: "18 वर्ष पूर्ण होने पर नया पहचान पत्र बनवाना, पता बदलना या डिजिटल वोटर कार्ड डाउनलोड।",
    full_description_en: "Assistance for citizens on the Election Commission of India (ECI) portal to apply for a fresh voter ID card, modify constituency, or replace old black & white voter cards with new colorful smart cards.",
    full_description_hi: "भारत निर्वाचन आयोग के पोर्टल पर फॉर्म 6 द्वारा नया पहचान पत्र आवेदन, फोटो एवं पते में संशोधन तथा ई-एपिक डाउनलोड सुविधा।",
    required_documents: [
      "Passport size photograph (पासपोर्ट साइज फोटो)",
      "Age Proof - Marksheet or Birth Certificate or Aadhaar (आयु प्रमाण)",
      "Address Proof - Electricity Bill or Aadhaar (निवास प्रमाण)"
    ],
    icon: "Vote",
    status: "Active",
    popular: true,
    estimated_time: "15-30 Days",
    whatsapp_message: "Hello Balaji Communication, I want information about Voter ID application.",
    created_at: "2026-01-10T10:00:00.000Z",
    updated_at: "2026-01-10T10:00:00.000Z"
  },
  {
    service_id: "srv-pan-card",
    service_name_en: "PAN Card Apply & Correction",
    service_name_hi: "नया पैन कार्ड आवेदन एवं सुधार",
    category: "PAN Card",
    image_url: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=800&q=80",
    short_description_en: "Instant e-PAN, minor PAN card, or correction in name/father's name/DOB.",
    short_description_hi: "नया पैन कार्ड, खोए हुए पैन को दोबारा प्राप्त करना या नाम-जन्मतिथि सुधार।",
    full_description_en: "Online submission via NSDL / UTIITSL for new PAN allocation or updating details. Get digital e-PAN on email within 2-3 days and physical plastic PAN delivered to your home address.",
    full_description_hi: "NSDL / UTIITSL पोर्टल के माध्यम से नया पैन कार्ड आवेदन। 2 से 3 दिन में ईमेल पर ई-पैन एवं स्पीड पोस्ट द्वारा घर पर ओरिजिनल कार्ड प्राप्त करें।",
    required_documents: [
      "Aadhaar Card with correct details (आधार कार्ड)",
      "Two Passport Size Photographs (दो पासपोर्ट साइज फोटो)"
    ],
    icon: "BadgePercent",
    status: "Active",
    popular: true,
    estimated_time: "2-3 Days for e-PAN / 10 Days for Card",
    whatsapp_message: "Hello Balaji Communication, I want information about PAN Card application.",
    created_at: "2026-01-10T10:00:00.000Z",
    updated_at: "2026-01-10T10:00:00.000Z"
  },
  {
    service_id: "srv-income-cert",
    service_name_en: "Income Certificate (आय प्रमाण पत्र)",
    service_name_hi: "आय प्रमाण पत्र ऑनलाइन आवेदन",
    category: "Certificates",
    image_url: "https://images.unsplash.com/photo-1554224154-26032ffc0d07?auto=format&fit=crop&w=800&q=80",
    short_description_en: "Government verified income certificate for student scholarships and schemes.",
    short_description_hi: "छात्रवृत्ति, स्कूल-कॉलेज प्रवेश एवं सरकारी योजनाओं हेतु अधिकृत आय प्रमाण पत्र।",
    full_description_en: "Assistance on state e-District portal for applying, uploading self-declaration, and downloading Tehsildar verified Income Certificate.",
    full_description_hi: "ई-डिस्ट्रिक्ट पोर्टल के माध्यम से स्वप्रमाणित घोषणा पत्र एवं आवश्यक दस्तावेजों के साथ आय प्रमाण पत्र का आवेदन।",
    required_documents: [
      "Aadhaar Card (आधार कार्ड)",
      "Self-Declaration Form (स्वप्रमाणित घोषणा पत्र)",
      "Salary Slip or Gram Pradhan/Councillor report",
      "Passport Size Photo (पासपोर्ट साइज फोटो)"
    ],
    icon: "FileCheck2",
    status: "Active",
    popular: true,
    estimated_time: "7-15 Working Days",
    whatsapp_message: "Hello Balaji Communication, I want information about Income Certificate.",
    created_at: "2026-01-10T10:00:00.000Z",
    updated_at: "2026-01-10T10:00:00.000Z"
  },
  {
    service_id: "srv-caste-cert",
    service_name_en: "Caste Certificate (जाति प्रमाण पत्र)",
    service_name_hi: "जाति प्रमाण पत्र (SC / ST / OBC / EWS)",
    category: "Certificates",
    image_url: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=800&q=80",
    short_description_en: "Official caste certificate for competitive examinations and reservations.",
    short_description_hi: "सरकारी नौकरियों, आरक्षण एवं उच्च शिक्षा में लाभ हेतु अधिकृत जाति प्रमाण पत्र।",
    full_description_en: "State and Central format caste certificates application with proper revenue validation and digital verification.",
    full_description_hi: "राज्य एवं केंद्र सरकार के प्रारूप में एससी, एसटी, ओबीसी एवं ईडब्ल्यूएस प्रमाण पत्र का ऑनलाइन आवेदन।",
    required_documents: [
      "Aadhaar Card (आधार कार्ड)",
      "Family caste certificate or land proof (पारिवारिक जाति प्रमाण)",
      "Passport Size Photograph (फोटो)"
    ],
    icon: "Award",
    status: "Active",
    popular: false,
    estimated_time: "7-15 Working Days",
    whatsapp_message: "Hello Balaji Communication, I want information about Caste Certificate.",
    created_at: "2026-01-10T10:00:00.000Z",
    updated_at: "2026-01-10T10:00:00.000Z"
  },
  {
    service_id: "srv-residence-cert",
    service_name_en: "Residence / Domicile Certificate (निवास प्रमाण पत्र)",
    service_name_hi: "मूल निवास प्रमाण पत्र ऑनलाइन आवेदन",
    category: "Certificates",
    image_url: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=800&q=80",
    short_description_en: "Valid proof of permanent residence for admissions and government jobs.",
    short_description_hi: "स्थानीय निवासी होने का कानूनी प्रमाण पत्र, जो नौकरियों एवं प्रवेश में अनिवार्य है।",
    full_description_en: "Apply for official Domicile (Niwas Praman Patra) through e-District platform, verified by local Lekhpal / Tehsildar.",
    full_description_hi: "तहसीलदार स्तर से सत्यापित डिजिटल हस्ताक्षरित मूल निवास प्रमाण पत्र के लिए ऑनलाइन आवेदन।",
    required_documents: [
      "Aadhaar Card (आधार कार्ड)",
      "Electricity Bill / Ration Card (निवास का साक्ष्य)",
      "Passport Size Photograph (फोटो)"
    ],
    icon: "Home",
    status: "Active",
    popular: false,
    estimated_time: "7-15 Working Days",
    whatsapp_message: "Hello Balaji Communication, I want information about Residence / Domicile Certificate.",
    created_at: "2026-01-10T10:00:00.000Z",
    updated_at: "2026-01-10T10:00:00.000Z"
  },
  {
    service_id: "srv-birth-cert",
    service_name_en: "Birth Certificate Assistance (जन्म प्रमाण पत्र)",
    service_name_hi: "जन्म प्रमाण पत्र ऑनलाइन सहायता",
    category: "Certificates",
    image_url: "https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&w=800&q=80",
    short_description_en: "Assistance in applying for municipal or block level birth certificate.",
    short_description_hi: "नगर निगम / ब्लॉक स्तर पर नवजात बच्चों अथवा छूटे हुए जन्म प्रमाण पत्र के लिए मार्गदर्शन।",
    full_description_en: "Civil Registration System (CRS) application filing, hospital discharge slip submission, and municipal follow-up support.",
    full_description_hi: "सीआरएस पोर्टल पर जन्म पंजीकरण, अस्पताल की डिस्चार्ज स्लिप एवं माता-पिता के पहचान पत्र संलग्न कर आवेदन।",
    required_documents: [
      "Hospital Birth Slip (अस्पताल की जन्म पर्ची)",
      "Mother & Father Aadhaar Card (माता-पिता का आधार कार्ड)"
    ],
    icon: "Baby",
    status: "Active",
    popular: false,
    estimated_time: "10-21 Working Days",
    whatsapp_message: "Hello Balaji Communication, I want information about Birth Certificate.",
    created_at: "2026-01-10T10:00:00.000Z",
    updated_at: "2026-01-10T10:00:00.000Z"
  },
  {
    service_id: "srv-online-forms",
    service_name_en: "Online Form Filling & Govt Job Applications",
    service_name_hi: "सरकारी नौकरी फॉर्म एवं ऑनलाइन फॉर्म फिलिंग",
    category: "Other Digital Services",
    image_url: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=800&q=80",
    short_description_en: "Error-free form filling for SSC, Police, Railway, UPSC, and college admissions.",
    short_description_hi: "एसएससी, रेलवे, पुलिस, शिक्षक भर्ती एवं अन्य प्रतियोगी परीक्षाओं के सही फॉर्म।",
    full_description_en: "Professional form submission with exact photo & signature resizing, document scanning, fee payment receipt generation, and admit card download.",
    full_description_hi: "सटीक फोटो/हस्ताक्षर साइजिंग, योग्यता विवरण प्रविष्टि, सुरक्षित ऑनलाइन फीस भुगतान और आवेदन प्रिंट आउट।",
    required_documents: [
      "Educational Marksheets (अंकपत्र)",
      "Passport size photo & signature (फोटो व हस्ताक्षर)",
      "Aadhaar Card (आधार कार्ड)"
    ],
    icon: "FileText",
    status: "Active",
    popular: true,
    estimated_time: "Instant Submission",
    whatsapp_message: "Hello Balaji Communication, I want information about Online Form Filling.",
    created_at: "2026-01-10T10:00:00.000Z",
    updated_at: "2026-01-10T10:00:00.000Z"
  },
  {
    service_id: "srv-print-scan",
    service_name_en: "Print, Scan, Photocopy & Passport Photos",
    service_name_hi: "प्रिंट, स्कैन, फोटोकॉपी एवं तत्काल पासपोर्ट साइज फोटो",
    category: "Other Digital Services",
    image_url: "https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?auto=format&fit=crop&w=800&q=80",
    short_description_en: "Color laser printing from WhatsApp/Email, lamination, and instant 5-minute photos.",
    short_description_hi: "हाई-क्वालिटी रंगीन व ब्लैक-व्हाइट प्रिंट, दस्तावेज लैमिनेशन एवं 5 मिनट में पासपोर्ट फोटो।",
    full_description_en: "Walk-in facilities for high-speed laser printing from WhatsApp/Email/Pen-drive, crisp scanning to PDF, and professional white/blue background passport photos.",
    full_description_hi: "व्हाट्सएप, ईमेल अथवा पेनड्राइव से तुरंत प्रिंट, सभी प्रकार के कागजातों की फोटोकॉपी, सुरक्षित लैमिनेशन एवं पासपोर्ट फोटो।",
    required_documents: [
      "Original Document or Soft copy on WhatsApp/Email (मूल प्रति या डिजिटल फाइल)"
    ],
    icon: "Printer",
    status: "Active",
    popular: false,
    estimated_time: "Instant Walk-in (2-5 Minutes)",
    whatsapp_message: "Hello Balaji Communication, I want to print or scan documents.",
    created_at: "2026-01-10T10:00:00.000Z",
    updated_at: "2026-01-10T10:00:00.000Z"
  }
];

export const SERVICE_CATEGORIES = [
  "All",
  "Aadhaar",
  "Ration Card",
  "PM Kisan",
  "Ayushman",
  "Voter ID",
  "PAN Card",
  "Certificates",
  "Other Digital Services"
];
