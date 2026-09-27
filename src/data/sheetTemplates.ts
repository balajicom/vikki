import { SheetTemplateInfo } from '../types';

export const SHEET_TEMPLATES: SheetTemplateInfo[] = [
  {
    id: 'services',
    title: 'Services Catalog Template',
    hindiTitle: 'सेवा सूची टेम्पलेट',
    description: 'Import all Jan Seva Kendra & CSC services, categories, English/Hindi names, required documents, icons, and WhatsApp messages.',
    fileName: 'balaji_services_template.csv',
    sheetTabName: 'Services',
    badge: 'Core Services',
    headers: [
      'service_id',
      'service_name_en',
      'service_name_hi',
      'category',
      'short_description_en',
      'short_description_hi',
      'full_description_en',
      'full_description_hi',
      'required_documents',
      'icon',
      'status',
      'popular',
      'estimated_time',
      'whatsapp_message'
    ],
    sampleRows: [
      [
        'srv-aadhaar-mob',
        'Aadhaar Mobile Number Update',
        'आधार मोबाइल नंबर अपडेट / जोड़ना',
        'Aadhaar',
        'Quick assistance for linking or updating active mobile number in Aadhaar.',
        'अपने आधार कार्ड में चालू मोबाइल नंबर लिंक या अपडेट करवाने के लिए सहायता।',
        'Updating mobile number in Aadhaar is essential for OTPs, banking, and government schemes.',
        'आधार में मोबाइल नंबर लिंक होना बैंक और सरकारी योजनाओं के लिए आवश्यक है।',
        'Original Aadhaar Card; Active Mobile Number',
        'Smartphone',
        'Active',
        'yes',
        '24-48 Hours',
        'Hello Balaji Communication, I need help with Aadhaar Mobile Number Update.'
      ],
      [
        'srv-pan-new',
        'New PAN Card (Instant e-PAN & Physical)',
        'नया पैन कार्ड (त्वरित ई-पैन और फिजिकल कार्ड)',
        'PAN Card',
        'Apply for fresh NSDL / UTI PAN card using Aadhaar e-KYC.',
        'आधार ई-केवाईसी द्वारा नया पैन कार्ड मात्र कुछ दिनों में प्राप्त करें।',
        'Complete online application for individual, minor, or business PAN card with paperless verification.',
        'नागरिकों और व्यापारियों के लिए संपूर्ण ऑनलाइन पैन कार्ड आवेदन सुविधा।',
        'Aadhaar Card; 2 Passport Photos; Signature',
        'CreditCard',
        'Active',
        'yes',
        '3-5 Working Days',
        'Hello Balaji Communication, I want to apply for a New PAN Card.'
      ],
      [
        'srv-income-cert',
        'Income Certificate (आय प्रमाण पत्र)',
        'आय प्रमाण पत्र (Income Certificate UP)',
        'Government Certificates',
        'Online application on UP eDistrict portal for official revenue income certificate.',
        'उत्तर प्रदेश ई-डिस्ट्रिक्ट पोर्टल के माध्यम से आधिकारिक आय प्रमाण पत्र।',
        'Required for student scholarships, government welfare schemes, and pension applications.',
        'छात्रवृत्ति, सरकारी योजनाओं और राशन कार्ड के लिए अनिवार्य राजस्व आय प्रमाण पत्र।',
        'Aadhaar Card; Ration Card / Family Register; Self Declaration; Photo',
        'FileText',
        'Active',
        'yes',
        '7-10 Working Days',
        'Hello Balaji Communication, I want to apply for Income Certificate.'
      ],
      [
        'srv-pm-kisan',
        'PM Kisan e-KYC & New Farmer Registration',
        'पीएम किसान सम्मान निधि ई-केवाईसी एवं नया पंजीकरण',
        'Farmer & Agriculture',
        'Biometric thumb e-KYC, land seeding, and new farmer enrollment for Rs 6000 annual aid.',
        'सालाना ₹6000 सहायता हेतु आधार बायोमेट्रिक ई-केवाईसी एवं खतौनी सत्यापन।',
        'Assistance with PM Kisan Samman Nidhi Yojana installment verification, bank NPCI seeding, and correction.',
        'पीएम किसान की किस्त रुकने, बैंक खाता लिंक और नई खतौनी जोड़ने की पूरी सहायता।',
        'Aadhaar Card; Bank Passbook; Khatauni (Land Record); Mobile for OTP',
        'Heart',
        'Active',
        'yes',
        'Instant Biometric / 7 Days Approval',
        'Hello Balaji Communication, I need help with PM Kisan e-KYC and installment.'
      ]
    ],
    columnsExplanation: [
      { key: 'service_id', required: true, description: 'Unique identifier code for the service', sample: 'srv-aadhaar-mob' },
      { key: 'service_name_en', required: true, description: 'Service title displayed in English', sample: 'Aadhaar Mobile Number Update' },
      { key: 'service_name_hi', required: true, description: 'Service title in Hindi (Devanagari)', sample: 'आधार मोबाइल नंबर अपडेट' },
      { key: 'category', required: true, description: 'Grouping category (Aadhaar, PAN Card, Ration Card, etc.)', sample: 'Aadhaar' },
      { key: 'short_description_en', required: false, description: 'Quick 1-sentence summary in English', sample: 'Quick assistance for linking mobile...' },
      { key: 'short_description_hi', required: false, description: 'Quick 1-sentence summary in Hindi', sample: 'अपने आधार कार्ड में चालू मोबाइल...' },
      { key: 'full_description_en', required: false, description: 'Detailed process explanation in English', sample: 'Detailed guidelines and benefits...' },
      { key: 'full_description_hi', required: false, description: 'Detailed process explanation in Hindi', sample: 'संपूर्ण जानकारी एवं लाभ...' },
      { key: 'required_documents', required: false, description: 'Semicolon or newline separated checklist of required documents', sample: 'Aadhaar Card; Active Mobile Number' },
      { key: 'icon', required: false, description: 'Lucide icon: CreditCard, FileText, Smartphone, Heart, Users, CheckCircle', sample: 'Smartphone' },
      { key: 'status', required: true, description: 'Active or Disabled', sample: 'Active' },
      { key: 'popular', required: false, description: 'yes / no - displays badge on homepage', sample: 'yes' },
      { key: 'estimated_time', required: false, description: 'Expected completion turnaround time', sample: '24-48 Hours' },
      { key: 'whatsapp_message', required: false, description: 'Pre-filled message when citizen clicks WhatsApp assistance', sample: 'Hello Balaji, I need help...' }
    ]
  },
  {
    id: 'enquiries',
    title: 'Citizen Applications & Enquiries Template',
    hindiTitle: 'नागरिक आवेदन एवं पूछताछ रजिस्टर टेम्पलेट',
    description: 'Import offline registers, walk-in applicants, phone enquiries, applicant names, villages, and mobile numbers for digital tracking.',
    fileName: 'balaji_enquiries_template.csv',
    sheetTabName: 'Enquiries',
    badge: 'Citizen CRM',
    headers: [
      'enquiry_id',
      'customer_name',
      'father_or_husband_name',
      'mobile',
      'service_name',
      'category',
      'village',
      'address',
      'message',
      'preferred_contact',
      'urgency',
      'status',
      'created_at'
    ],
    sampleRows: [
      [
        'ENQ-2026-001',
        'Ramesh Chandra Gangwar',
        'Shri Ram Prasad Gangwar',
        '9876543210',
        'Income Certificate (आय प्रमाण पत्र)',
        'Government Certificates',
        'Gaini',
        'Vill Gaini, Near Primary School, Bareilly',
        'Urgent requirement for son college scholarship form deadline.',
        'WhatsApp',
        'Urgent',
        'New',
        '2026-03-25T10:30:00.000Z'
      ],
      [
        'ENQ-2026-002',
        'Sunita Devi',
        'W/o Manoj Kumar',
        '9812345678',
        'Ration Card Member Name Add',
        'Ration Card',
        'Fatehganj West',
        'Mohalla Kila, Bareilly',
        'Need to add newborn baby name in ration card with birth certificate.',
        'Call',
        'Normal',
        'Processing',
        '2026-03-24T14:15:00.000Z'
      ],
      [
        'ENQ-2026-003',
        'Mohammad Imran',
        'Abdul Rasheed',
        '9754321098',
        'Ayushman Golden Card (₹5 Lakh Free Treatment)',
        'Health & Ayushman',
        'Gaini',
        'Masjid Wali Gali, Gaini, Bareilly',
        'Name found in SECC list, wants card download and plastic card print.',
        'WhatsApp',
        'High Priority',
        'Completed',
        '2026-03-23T09:00:00.000Z'
      ]
    ],
    columnsExplanation: [
      { key: 'enquiry_id', required: false, description: 'Application token code (Auto-generated if blank)', sample: 'ENQ-2026-001' },
      { key: 'customer_name', required: true, description: 'Full name of applicant / citizen', sample: 'Ramesh Chandra Gangwar' },
      { key: 'father_or_husband_name', required: false, description: 'Father or husband name for official identification', sample: 'Shri Ram Prasad Gangwar' },
      { key: 'mobile', required: true, description: '10-digit mobile phone number', sample: '9876543210' },
      { key: 'service_name', required: true, description: 'Target Jan Seva Kendra service applied for', sample: 'Income Certificate (आय प्रमाण पत्र)' },
      { key: 'category', required: false, description: 'Service department category', sample: 'Government Certificates' },
      { key: 'village', required: false, description: 'Village / Town name (Gaini, Bareilly, etc.)', sample: 'Gaini' },
      { key: 'address', required: false, description: 'Full residential address or locality', sample: 'Near Primary School, Gaini' },
      { key: 'message', required: false, description: 'Citizen notes or specific instructions', sample: 'Urgent for college scholarship' },
      { key: 'preferred_contact', required: false, description: 'Call or WhatsApp', sample: 'WhatsApp' },
      { key: 'urgency', required: false, description: 'Normal, High Priority, Urgent', sample: 'Urgent' },
      { key: 'status', required: true, description: 'New, Contacted, Processing, Completed, Cancelled', sample: 'New' },
      { key: 'created_at', required: false, description: 'Date and time of application receipt', sample: '2026-03-25T10:30:00.000Z' }
    ]
  },
  {
    id: 'pricelist',
    title: 'CSC Government Fees & Service Rate List Template',
    hindiTitle: 'सरकारी शुल्क एवं जन सेवा केंद्र दर सूची टेम्पलेट',
    description: 'Display transparent official government fee, CSC convenience fee, total cost, and delivery turnaround for all citizen services.',
    fileName: 'balaji_pricelist_template.csv',
    sheetTabName: 'PriceList',
    badge: 'Pricing & Fees',
    headers: [
      'price_id',
      'service_name',
      'category',
      'government_fee',
      'csc_service_fee',
      'total_fee',
      'processing_time',
      'eligibility_or_note',
      'status'
    ],
    sampleRows: [
      [
        'PRC-001',
        'Aadhaar Mobile Number Update',
        'Aadhaar Services',
        '₹50',
        '₹30',
        '₹80',
        '24 to 48 Hours',
        'UIDAI official biometric update fee + Kendra verification assistance',
        'Active'
      ],
      [
        'PRC-002',
        'Income / Caste / Domicile Certificate',
        'Revenue & eDistrict UP',
        '₹15',
        '₹35',
        '₹50',
        '7 to 10 Days',
        'Official UP Govt treasury challan + online application & scanning',
        'Active'
      ],
      [
        'PRC-003',
        'New PAN Card (Physical Delivery to Home)',
        'NSDL / UTI Services',
        '₹107',
        '₹93',
        '₹200',
        '10 to 15 Days',
        'NSDL official fee + biometric e-KYC and Speed Post plastic card',
        'Active'
      ],
      [
        'PRC-004',
        'Ayushman Bharat Golden Card Print',
        'Health Mission',
        '₹0 (Govt Free)',
        '₹30',
        '₹30',
        'Instant 5 Mins',
        'Government subsidy is free; High-grade waterproof PVC print charge',
        'Active'
      ],
      [
        'PRC-005',
        'PM Kisan Samman Nidhi e-KYC',
        'Agriculture Services',
        '₹0 (Govt Free)',
        '₹20',
        '₹20',
        'Instant Thumb Scan',
        'Biometric thumb authentication machine and portal server charge',
        'Active'
      ]
    ],
    columnsExplanation: [
      { key: 'price_id', required: true, description: 'Unique fee code identifier', sample: 'PRC-001' },
      { key: 'service_name', required: true, description: 'Exact service name matching catalog', sample: 'Income / Caste / Domicile Certificate' },
      { key: 'category', required: true, description: 'Service department category', sample: 'Revenue & eDistrict UP' },
      { key: 'government_fee', required: true, description: 'Official departmental fee prescribed by government', sample: '₹15' },
      { key: 'csc_service_fee', required: true, description: 'Jan Seva Kendra computer/portal processing fee', sample: '₹35' },
      { key: 'total_fee', required: true, description: 'Total price payable by the citizen', sample: '₹50' },
      { key: 'processing_time', required: true, description: 'Expected working days to receive final document', sample: '7 to 10 Days' },
      { key: 'eligibility_or_note', required: false, description: 'Clear remarks, inclusions, or required proof note', sample: 'UP Govt treasury challan + scanning' },
      { key: 'status', required: true, description: 'Active or Inactive', sample: 'Active' }
    ]
  },
  {
    id: 'notices',
    title: 'Notice Board & Flash Announcements Template',
    hindiTitle: 'सूचना पट्ट एवं महत्वपूर्ण सरकारी योजना अपडेट टेम्पलेट',
    description: 'Post urgent notifications, scholarship deadlines, last dates for e-KYC, and new government scheme rollouts.',
    fileName: 'balaji_notices_template.csv',
    sheetTabName: 'NoticeBoard',
    badge: 'Announcements',
    headers: [
      'notice_id',
      'title_en',
      'title_hi',
      'description_en',
      'description_hi',
      'category',
      'badge_type',
      'last_date',
      'action_link',
      'status',
      'created_at'
    ],
    sampleRows: [
      [
        'NTC-001',
        'PM Kisan 19th Installment e-KYC Mandatory',
        'पीएम किसान 19वीं किस्त हेतु बायोमेट्रिक ई-केवाईसी अनिवार्य',
        'Farmers who have not completed biometric or OTP e-KYC must visit Balaji Communication to avoid installment blockage.',
        'जिन किसान भाइयों की ई-केवाईसी पूरी नहीं है, वे अपनी आगामी किस्त पाने के लिए तुरंत केंद्र पर आकर फिंगरप्रिंट से ई-केवाईसी कराएं।',
        'PM Kisan',
        'Urgent',
        '31-03-2026',
        '/services/srv-pm-kisan',
        'Active',
        '2026-03-20T08:00:00.000Z'
      ],
      [
        'NTC-002',
        'UP Scholarship 2026 Pre & Post Matric Applications Open',
        'यूपी छात्रवृत्ति 2026 दशमोत्तर एवं पूर्वदशम आवेदन प्रारंभ',
        'Apply online with Marksheet, Income Certificate, Caste Certificate, and Bank Passbook linked with NPCI.',
        'कक्षा 9, 10, 11, 12 एवं बीए, बीएससी, आईटीआई छात्रवृत्ति के नए एवं नवीनीकरण फॉर्म भरने हेतु संपर्क करें।',
        'Education & Scholarship',
        'New',
        '15-05-2026',
        '/contact',
        'Active',
        '2026-03-18T10:00:00.000Z'
      ],
      [
        'NTC-003',
        'Free Aadhaar Document Update Extended by UIDAI',
        'मुफ्त आधार कार्ड दस्तावेज अपडेट सुविधा का लाभ उठाएं',
        'UIDAI has extended online proof of identity and address update for cards older than 10 years.',
        'जिनका आधार कार्ड 10 वर्ष से अधिक पुराना है, वे अपनी पहचान एवं पते का प्रमाण तुरंत अपडेट करवाएं।',
        'Aadhaar Alert',
        'Important',
        '30-06-2026',
        '/services/srv-aadhaar-corr',
        'Active',
        '2026-03-15T09:30:00.000Z'
      ]
    ],
    columnsExplanation: [
      { key: 'notice_id', required: true, description: 'Unique notice reference code', sample: 'NTC-001' },
      { key: 'title_en', required: true, description: 'Headline in English', sample: 'PM Kisan 19th Installment e-KYC Mandatory' },
      { key: 'title_hi', required: true, description: 'Headline in Hindi (Devanagari)', sample: 'पीएम किसान 19वीं किस्त हेतु ई-केवाईसी...' },
      { key: 'description_en', required: false, description: 'Detailed notice text in English', sample: 'Farmers must complete e-KYC...' },
      { key: 'description_hi', required: false, description: 'Detailed notice text in Hindi', sample: 'किसान भाई तुरंत आकर ई-केवाईसी कराएं...' },
      { key: 'category', required: true, description: 'Topic category for grouping', sample: 'PM Kisan' },
      { key: 'badge_type', required: true, description: 'Urgent, New, Important, General', sample: 'Urgent' },
      { key: 'last_date', required: false, description: 'Scheme expiry or final submission date', sample: '31-03-2026' },
      { key: 'action_link', required: false, description: 'Page path or external official URL', sample: '/services/srv-pm-kisan' },
      { key: 'status', required: true, description: 'Active or Archived', sample: 'Active' },
      { key: 'created_at', required: false, description: 'Date published', sample: '2026-03-20T08:00:00.000Z' }
    ]
  },
  {
    id: 'quicklinks',
    title: 'Government Portals & Quick Operator Links Template',
    hindiTitle: 'सरकारी पोर्टल एवं त्वरित लिंक डायरेक्टरी टेम्पलेट',
    description: 'Directory of direct official UP and India government department URLs, operator portals, and login guidelines for CSC operations.',
    fileName: 'balaji_quicklinks_template.csv',
    sheetTabName: 'QuickLinks',
    badge: 'Official Portals',
    headers: [
      'link_id',
      'portal_name',
      'department',
      'category',
      'portal_url',
      'description',
      'portal_login_type',
      'required_credentials'
    ],
    sampleRows: [
      [
        'LNK-001',
        'e-District Uttar Pradesh (ई-डिस्ट्रिक्ट)',
        'Revenue & IT Department UP',
        'Certificates',
        'https://edistrict.up.gov.in',
        'Official UP portal for Income, Caste, Domicile, Birth, Death certificates and revenue services.',
        'CSC Operator / Citizen Login',
        'Kendra Operator ID / OTP'
      ],
      [
        'LNK-002',
        'UIDAI Official MyAadhaar Portal',
        'Ministry of Electronics and IT',
        'Aadhaar Services',
        'https://myaadhaar.uidai.gov.in',
        'Download e-Aadhaar, PVC card order, check update status, and verify mobile/email.',
        'Citizen Aadhaar OTP / Biometric',
        'Aadhaar Number + Registered Mobile'
      ],
      [
        'LNK-003',
        'UP Bhulekh Land Records (भूलेख खतौनी)',
        'Board of Revenue Uttar Pradesh',
        'Land Records',
        'https://upbhulekh.gov.in',
        'View and print authenticated RoR Khatauni, Gata number details, and land parcel ownership.',
        'Open Public Search / Certified Copy',
        'District, Tehsil, Village Code, Gata/Khasra No'
      ],
      [
        'LNK-004',
        'National Voter Service Portal (ECI Voters)',
        'Election Commission of India',
        'Voter ID',
        'https://voters.eci.gov.in',
        'New Form 6 voter enrollment, Form 8 address/photo correction, and EPIC digital download.',
        'Mobile Login / ECI User',
        'EPIC Voter Number / Mobile OTP'
      ],
      [
        'LNK-005',
        'PM Kisan Samman Nidhi Portal',
        'Ministry of Agriculture & Farmers Welfare',
        'Agriculture',
        'https://pmkisan.gov.in',
        'Beneficiary status check, biometric e-KYC, land correction, and farmer grievance redressal.',
        'CSC Login / Farmer Self Service',
        'Aadhaar / Farmer Registration Number'
      ]
    ],
    columnsExplanation: [
      { key: 'link_id', required: true, description: 'Unique link identifier code', sample: 'LNK-001' },
      { key: 'portal_name', required: true, description: 'Official name of the government department portal', sample: 'e-District Uttar Pradesh' },
      { key: 'department', required: true, description: 'Ministry or Department name', sample: 'Revenue & IT Department UP' },
      { key: 'category', required: true, description: 'Functional category (Certificates, Land, Voter, etc.)', sample: 'Certificates' },
      { key: 'portal_url', required: true, description: 'Exact HTTPS web address of the official portal', sample: 'https://edistrict.up.gov.in' },
      { key: 'description', required: false, description: 'Short summary of citizen services provided on the portal', sample: 'Income, Caste, Domicile certificates' },
      { key: 'portal_login_type', required: false, description: 'Operator login, citizen OTP, or public access', sample: 'CSC Operator / Citizen Login' },
      { key: 'required_credentials', required: false, description: 'Requirements needed from citizen for operator processing', sample: 'Aadhaar Number + Registered Mobile' }
    ]
  },
  {
    id: 'citizens',
    title: 'Citizen & Customer Master Registry Template',
    hindiTitle: 'नागरिक एवं ग्राहक मास्टर रजिस्टर टेम्पलेट',
    description: 'Maintain permanent citizen directory with village name, family head, Aadhaar last-4, phone, and past service history.',
    fileName: 'balaji_citizens_template.csv',
    sheetTabName: 'Citizens',
    badge: 'Customer Directory',
    headers: [
      'citizen_id',
      'full_name',
      'father_name',
      'mobile',
      'aadhaar_last4',
      'village',
      'address',
      'services_availed',
      'notes',
      'status',
      'created_at'
    ],
    sampleRows: [
      [
        'CIT-001',
        'Satish Gangwar',
        'Mahavir Prasad',
        '9870601122',
        '4589',
        'Gaini',
        'Inter College Road, Gaini, Bareilly',
        'Income Certificate, PM Kisan e-KYC',
        'Eligible for PM Awas Yojana list check',
        'Completed',
        '2026-02-10T11:00:00.000Z'
      ],
      [
        'CIT-002',
        'Pooja Sharma',
        'D/o Rajesh Sharma',
        '9897112233',
        '7812',
        'Fatehganj',
        'Station Road, Fatehganj, Bareilly',
        'PAN Card New, Ayushman Card',
        'Physical PAN card received at Kendra',
        'Completed',
        '2026-02-15T15:30:00.000Z'
      ],
      [
        'CIT-003',
        'Dharamvir Singh',
        'Roopchand Singh',
        '9758004455',
        '1034',
        'Gaini',
        'Masjid Wali Gali, Gaini, Bareilly',
        'Aadhaar Address Update',
        'Waiting for UIDAI update approval SMS',
        'Pending Docs',
        '2026-03-01T12:00:00.000Z'
      ]
    ],
    columnsExplanation: [
      { key: 'citizen_id', required: true, description: 'Permanent customer registration ID', sample: 'CIT-001' },
      { key: 'full_name', required: true, description: 'Citizen full legal name', sample: 'Satish Gangwar' },
      { key: 'father_name', required: false, description: 'Father / Guardian name', sample: 'Mahavir Prasad' },
      { key: 'mobile', required: true, description: '10-digit primary mobile number', sample: '9870601122' },
      { key: 'aadhaar_last4', required: false, description: 'Last 4 digits of Aadhaar (Never store full 12 digits)', sample: '4589' },
      { key: 'village', required: true, description: 'Village / town locality', sample: 'Gaini' },
      { key: 'address', required: false, description: 'Full address landmark', sample: 'Inter College Road, Gaini' },
      { key: 'services_availed', required: false, description: 'Comma separated history of services completed', sample: 'Income Certificate, PM Kisan' },
      { key: 'notes', required: false, description: 'Operator remarks, dues, or follow-up notes', sample: 'Awaiting UIDAI approval' },
      { key: 'status', required: true, description: 'Active, Pending Docs, or Completed', sample: 'Active' },
      { key: 'created_at', required: false, description: 'Date citizen registered at Kendra', sample: '2026-02-10T11:00:00.000Z' }
    ]
  }
];

// Helper: Escape CSV values
function escapeCsvValue(val: any): string {
  if (val === null || val === undefined) return '""';
  const str = String(val).replace(/"/g, '""');
  return `"${str}"`;
}

// Generate CSV string with UTF-8 BOM so Hindi/Devanagari shows properly in Excel & Sheets
export function generateCsvContent(template: SheetTemplateInfo): string {
  const bom = '\uFEFF';
  const headerLine = template.headers.map(escapeCsvValue).join(',');
  const rowLines = template.sampleRows.map(row => 
    row.map(escapeCsvValue).join(',')
  );
  return bom + [headerLine, ...rowLines].join('\r\n');
}

// Generate Tab-Separated string for instant copy & paste into Google Sheets (Ctrl+C -> Ctrl+V)
export function generateTabSeparatedContent(template: SheetTemplateInfo): string {
  const headerLine = template.headers.join('\t');
  const rowLines = template.sampleRows.map(row => row.join('\t'));
  return [headerLine, ...rowLines].join('\n');
}

// Helper to trigger browser download of template CSV
export function downloadCsvTemplate(template: SheetTemplateInfo): void {
  const csvContent = generateCsvContent(template);
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', template.fileName);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
