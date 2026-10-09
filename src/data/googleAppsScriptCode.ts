export const GOOGLE_APPS_SCRIPT_CODE = `/**
 * =========================================================================
 * BALAJI COMMUNICATION - JAN SEVA KENDRA & CSC
 * MASTER GOOGLE APPS SCRIPT BACKEND (ALL TEMPLATES SUPPORTED)
 * =========================================================================
 * 
 * QUICK SETUP GUIDE:
 * 1. Open Google Sheets at https://sheets.new
 * 2. Rename spreadsheet: "Balaji Communication Master Database"
 * 3. Go to Extensions > Apps Script
 * 4. Paste this complete code into Code.gs (replacing any existing code)
 * 5. In toolbar dropdown, select "setupAllTemplateSheets" and click "Run"
 *    -> Click "Review permissions" -> Select your Google Account -> Click "Advanced" -> "Go to (unsafe)" -> "Allow"
 *    -> This creates all 7 tabs automatically (Services, Enquiries, PriceList, etc.)
 * 6. Click "Deploy" > "New deployment"
 *    - Click the gear icon (Select type) -> Choose "Web app"
 *    - Description: "Balaji Database API"
 *    - Execute as: "Me" (your Google account)
 *    - WHO HAS ACCESS: "Anyone"  <--- [VERY IMPORTANT! Do NOT select "Only myself"]
 *      (If "Only myself" is selected, Google blocks access and redirects to a login page)
 * 7. Click "Deploy" -> Copy the Web App URL (ends with "/exec")
 * 8. Paste into Balaji Admin Dashboard > "Google Spreadsheet Link or Apps Script Web App URL" box!
 */

function doGet(e) {
  var action = (e && e.parameter && e.parameter.action) ? e.parameter.action : "getAllData";
  var result = { status: "error", message: "Invalid action" };
  
  try {
    if (action === "getAllData" || action === "all") {
      result = {
        status: "success",
        message: "Balaji Google Apps Script Backend is Live!",
        data: {
          services: getServicesList(),
          enquiries: getEnquiriesList(),
          priceList: getPriceListData(),
          notices: getNoticesData(),
          quickLinks: getQuickLinksData(),
          citizens: getCitizensData(),
          settings: getSettingsData()
        }
      };
    } else if (action === "getServices" || action === "services") {
      result = { status: "success", data: getServicesList() };
    } else if (action === "getEnquiries" || action === "enquiries") {
      result = { status: "success", data: getEnquiriesList() };
    } else if (action === "getPriceList" || action === "pricelist") {
      result = { status: "success", data: getPriceListData() };
    } else if (action === "getNotices" || action === "notices") {
      result = { status: "success", data: getNoticesData() };
    } else if (action === "getQuickLinks" || action === "quicklinks") {
      result = { status: "success", data: getQuickLinksData() };
    } else if (action === "getCitizens" || action === "citizens") {
      result = { status: "success", data: getCitizensData() };
    } else if (action === "getSettings" || action === "settings") {
      result = { status: "success", data: getSettingsData() };
    } else if (action === "createEnquiry" || action === "addEnquiry") {
      // Allows browser on GitHub Pages to submit applications via GET (bypassing CORS)
      var enquiryData = null;
      if (e.parameter && e.parameter.data) {
        try {
          enquiryData = JSON.parse(e.parameter.data);
        } catch (pe) {}
      }
      if (!enquiryData && e.parameter) {
        enquiryData = {
          enquiry_id: e.parameter.enquiry_id || e.parameter.id,
          customer_name: e.parameter.customer_name || e.parameter.applicant_name || e.parameter.name,
          applicant_name: e.parameter.applicant_name || e.parameter.customer_name || e.parameter.name,
          father_or_husband_name: e.parameter.father_or_husband_name || e.parameter.father_name,
          mobile: e.parameter.mobile || e.parameter.phone,
          service_name: e.parameter.service_name || e.parameter.service,
          category: e.parameter.category,
          village: e.parameter.village,
          address: e.parameter.address,
          message: e.parameter.message,
          preferred_contact: e.parameter.preferred_contact || "Call",
          urgency: e.parameter.urgency || "Normal",
          status: e.parameter.status || "New"
        };
      }
      result = addEnquiry(enquiryData || {});
    } else if (action === "updateEnquiryStatus") {
      var enqId = (e.parameter && (e.parameter.enquiry_id || e.parameter.id)) ? String(e.parameter.enquiry_id || e.parameter.id) : "";
      var status = (e.parameter && e.parameter.status) ? String(e.parameter.status) : "New";
      result = updateEnquiryStatus(enqId, status);
    } else if (action === "createService" || action === "addService") {
      var serviceData = null;
      if (e.parameter && e.parameter.data) {
        try {
          serviceData = JSON.parse(e.parameter.data);
        } catch (pe) {}
      }
      if (!serviceData && e.parameter) {
        serviceData = {
          service_id: e.parameter.service_id || e.parameter.id,
          service_name_en: e.parameter.service_name_en || e.parameter.name_en || e.parameter.name,
          service_name_hi: e.parameter.service_name_hi || e.parameter.name_hi,
          category: e.parameter.category,
          short_description_en: e.parameter.short_description_en,
          short_description_hi: e.parameter.short_description_hi,
          full_description_en: e.parameter.full_description_en,
          full_description_hi: e.parameter.full_description_hi,
          required_documents: e.parameter.required_documents,
          icon: e.parameter.icon,
          status: e.parameter.status,
          popular: e.parameter.popular === "yes" || e.parameter.popular === "true",
          estimated_time: e.parameter.estimated_time,
          whatsapp_message: e.parameter.whatsapp_message
        };
      }
      result = addService(serviceData || {});
    } else if (action === "updateService") {
      result = updateService(e.parameter || {});
    } else if (action === "deleteService") {
      result = deleteService(e.parameter.service_id || e.parameter.id);
    } else if (action === "ping" || action === "status") {
      result = {
        status: "success",
        message: "Google Apps Script Web App is connected and working!",
        timestamp: new Date().toISOString()
      };
    }
  } catch (err) {
    result = { status: "error", message: err.toString() };
  }
  
  return ContentService.createTextOutput(JSON.stringify(result))
    .setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  var result = { status: "error", message: "No data received" };
  
  try {
    var payload = {};
    if (e && e.postData && e.postData.contents) {
      try {
        payload = JSON.parse(e.postData.contents);
      } catch (pe) {
        if (e.parameter) {
          payload = e.parameter;
        }
      }
    } else if (e && e.parameter) {
      payload = e.parameter;
    }
    
    var action = payload.action || (e && e.parameter && e.parameter.action);
    
    if (action === "createEnquiry" || action === "addEnquiry") {
      result = addEnquiry(payload.data || payload);
    } else if (action === "createService") {
      result = addService(payload.data || payload);
    } else if (action === "updateService") {
      result = updateService(payload.data || payload);
    } else if (action === "deleteService") {
      result = deleteService(payload.service_id || payload.id);
    } else if (action === "updateEnquiryStatus") {
      result = updateEnquiryStatus(payload.enquiry_id || payload.id, payload.status);
    } else if (action === "savePriceList") {
      result = savePriceListItem(payload.data || payload);
    } else if (action === "saveNotice") {
      result = saveNoticeItem(payload.data || payload);
    } else if (action === "saveCitizen") {
      result = saveCitizenItem(payload.data || payload);
    } else if (action === "updateSettings") {
      result = saveSettingsData(payload.data || payload);
    }
  } catch (err) {
    result = { status: "error", message: err.toString() };
  }
  
  return ContentService.createTextOutput(JSON.stringify(result))
    .setMimeType(ContentService.MimeType.JSON);
}

// ==========================================
// 1-CLICK AUTO SETUP MACRO FOR ALL TEMPLATES
// ==========================================
function setupAllTemplateSheets() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  
  // 1. SERVICES TAB (Full Balaji Communication Master Service Catalog)
  var srvSheet = getOrCreateSheet(ss, "Services");
  srvSheet.clearContents();
  var srvHeaders = [
    "service_id", "service_name_en", "service_name_hi", "category",
    "short_description_en", "short_description_hi", "full_description_en", "full_description_hi",
    "required_documents", "icon", "status", "popular", "estimated_time", "whatsapp_message"
  ];
  srvSheet.appendRow(srvHeaders);
  var defaultServices = [
    ["srv-aadhaar-mob", "Aadhaar Mobile Number Update", "आधार मोबाइल नंबर अपडेट / जोड़ना", "Aadhaar", "Quick assistance for linking or updating active mobile number in Aadhaar.", "अपने आधार कार्ड में चालू मोबाइल नंबर लिंक या अपडेट करवाने के लिए आसान सहायता।", "Updating mobile number in Aadhaar is essential for receiving OTPs for banking, ITR verification, DigiLocker, and availing all government online benefits.", "आधार में मोबाइल नंबर लिंक होना बैंक, डिजीलॉकर, राशन कार्ड और सरकारी योजनाओं के ओटीपी के लिए अनिवार्य है।", "Original Aadhaar Card\\nActive Mobile SIM", "Smartphone", "Active", "yes", "24-48 Hours", "Hello Balaji Communication, I want information about Aadhaar Mobile Number Update."],
    ["srv-aadhaar-corr", "Aadhaar Correction & Address Update", "आधार सुधार एवं पता बदलाव", "Aadhaar", "Name, DOB, gender, or address correction in your existing Aadhaar card with valid proof.", "आधार कार्ड में नाम, जन्मतिथि, लिंग अथवा पते में सुधार के लिए उचित दस्तावेजों के साथ आवेदन।", "Get corrections in demographic details updated in UIDAI database.", "UIDAI नियमों के अनुसार आधार कार्ड में नाम, पिता/पति का नाम, जन्मतिथि एवं आवासीय पता ठीक कराने हेतु सहायता।", "Existing Aadhaar Card copy\\nProof of Identity / Address", "UserCheck", "Active", "yes", "3-7 Working Days", "Hello Balaji Communication, I want information about Aadhaar Correction."],
    ["srv-aadhaar-down", "Aadhaar Download & PVC Card Print", "आधार कार्ड डाउनलोड एवं पीवीसी कार्ड प्रिंट", "Aadhaar", "Instant e-Aadhaar PDF download and ordering durable plastic PVC Aadhaar card.", "तुरंत ई-आधार डाउनलोड और वॉटरप्रूफ सुरक्षित पीवीसी (प्लास्टिक) कार्ड बनवाने की सुविधा।", "Lost your physical Aadhaar card? Get high-quality e-Aadhaar downloaded instantly through OTP.", "यदि आधार खो गया है, तो तुरंत ओटीपी के माध्यम से ई-आधार डाउनलोड कराएं या पीवीसी प्लास्टिक कार्ड मंगवाएं।", "Aadhaar Number or Enrollment ID\\nRegistered Mobile Phone", "CreditCard", "Active", "yes", "Instant Download / 7-10 days Speed Post", "Hello Balaji Communication, I want information about Aadhaar Download and PVC Card."],
    ["srv-ration-new", "New Ration Card Application", "नया राशन कार्ड ऑनलाइन आवेदन", "Ration Card", "Assistance in applying for new APL/BPL/Antyodaya ration cards for eligible families.", "पात्र परिवारों के लिए नया राशन कार्ड ऑनलाइन अप्लाई करने में सहायता।", "Complete documentation and online portal registration for fresh ration card applications.", "परिवार के सभी सदस्यों के विवरण, आधार एवं आय प्रमाण पत्र के साथ नए राशन कार्ड के लिए आवेदन।", "Head of Family Aadhaar & Photo\\nFamily Aadhaar copies\\nIncome Certificate\\nBank Passbook", "FileSpreadsheet", "Active", "yes", "15-30 Working Days", "Hello Balaji Communication, I want information about New Ration Card Apply."],
    ["srv-ration-corr", "Ration Card Correction & Member Add/Remove", "राशन कार्ड संशोधन एवं यूनिट जोड़ना/हटाना", "Ration Card", "Add new family member/child, remove married member, or correct names in ration card.", "राशन कार्ड में नए बच्चे/सदस्य का नाम जोड़ना, नाम हटाना अथवा गलतियों में सुधार।", "Online submission for adding newborn children or daughters-in-law into existing ration cards.", "विवाह के पश्चात नई बहू का नाम जोड़ना या नवजात शिशु की यूनिट जोड़ने की ऑनलाइन प्रक्रिया।", "Original Ration Card Number\\nNew member Aadhaar / Birth Certificate", "Users", "Active", "no", "10-20 Working Days", "Hello Balaji Communication, I want information about Ration Card Member Addition."],
    ["srv-pmkisan-reg", "PM Kisan Samman Nidhi Registration", "पीएम किसान सम्मान निधि नया पंजीकरण", "PM Kisan", "New farmer enrollment to receive ₹6,000 yearly direct benefit from Government of India.", "पात्र किसान भाइयों के लिए सालाना ₹6,000 सहायता प्राप्त करने हेतु नया ऑनलाइन पंजीकरण।", "Assistance for small and marginal farmer families to register under PM-KISAN scheme.", "पीएम-किसान योजना के अंतर्गत किसानों का ऑनलाइन रजिस्ट्रेशन, खतौनी भूलेख विवरण दर्ज करना।", "Farmer Aadhaar Card\\nKhatauni Land Record\\nBank Passbook\\nMobile linked with Aadhaar", "Tractor", "Active", "yes", "Departmental Verification", "Hello Balaji Communication, I want information about PM Kisan Registration."],
    ["srv-pmkisan-kyc", "PM Kisan e-KYC & Status Check", "पीएम किसान ई-केवाईसी एवं किस्त स्थिति जांच", "PM Kisan", "Mandatory OTP/Biometric e-KYC to ensure continuous payment of PM Kisan installments.", "किस्त न रुकने पाए इसके लिए बायोमेट्रिक या आधार ओटीपी से तुरंत ई-केवाईसी करवाएं।", "If your PM-Kisan installment is stuck due to pending eKYC or land seeding, visit our center.", "अटकी हुई किस्तें चालू कराने और ई-केवाईसी फिंगरप्रिंट या ओटीपी द्वारा तुरंत पूर्ण कराने की सेवा।", "Aadhaar Card\\nAadhaar Registered Mobile", "ShieldCheck", "Active", "yes", "Instant (5 Minutes)", "Hello Balaji Communication, I want information about PM Kisan e-KYC."],
    ["srv-ayushman-card", "Ayushman Card Apply & Download", "आयुष्मान भारत गोल्डन कार्ड (₹5 लाख मुफ्त इलाज)", "Ayushman", "Check eligibility under PM-JAY and apply/download your cashless hospital treatment card.", "प्रतिवर्ष ₹5 लाख तक के मुफ्त इलाज हेतु आयुष्मान भारत कार्ड की पात्रता जांच, आवेदन व डाउनलोड।", "Eligible families get cashless treatment up to ₹5 lakh per year in empanelled hospitals.", "पात्रता सूची या राशन कार्ड के आधार पर आयुष्मान कार्ड केवाईसी, नाम सर्च और तुरंत ओरिजिनल आयुष्मान पीवीसी कार्ड प्रिंट।", "Aadhaar Card\\nRation Card or PM-JAY letter\\nMobile Phone for OTP", "HeartPulse", "Active", "yes", "Instant verification / 24-48 Hours Approval", "Hello Balaji Communication, I want information about Ayushman Card."],
    ["srv-voter-id", "Voter ID / पहचान पत्र Apply & Correction", "वोटर आईडी (पहचान पत्र) नया आवेदन एवं संशोधन", "Voter ID", "New voter registration (Form 6), address shift (Form 8), and digital e-EPIC download.", "18 वर्ष पूर्ण होने पर नया पहचान पत्र बनवाना, पता बदलना या डिजिटल वोटर कार्ड डाउनलोड।", "Assistance on Election Commission of India (ECI) portal to apply for fresh voter ID card.", "भारत निर्वाचन आयोग के पोर्टल पर फॉर्म 6 द्वारा नया पहचान पत्र आवेदन एवं संशोधन।", "Passport Photo\\nAge Proof\\nAddress Proof", "Vote", "Active", "yes", "15-30 Days", "Hello Balaji Communication, I want information about Voter ID application."],
    ["srv-pan-card", "PAN Card Apply & Correction", "नया पैन कार्ड आवेदन एवं सुधार", "PAN Card", "New Instant e-PAN, minor PAN card, or correction in name/father's name.", "नया पैन कार्ड (वयस्क/नाबालिग), खोए हुए पैन को दोबारा प्राप्त करना या नाम सुधार।", "Online submission via NSDL / UTIITSL for new PAN allocation or updating details.", "NSDL / UTIITSL पोर्टल के माध्यम से नया पैन कार्ड आवेदन। 2 से 3 दिन में ई-पैन एवं स्पीड पोस्ट द्वारा घर पर ओरिजिनल कार्ड।", "Aadhaar Card\\nTwo Passport Photos", "BadgePercent", "Active", "yes", "2-3 Days e-PAN / 10-15 Days physical card", "Hello Balaji Communication, I want information about PAN Card application."],
    ["srv-income-cert", "Income Certificate (आय प्रमाण पत्र)", "आय प्रमाण पत्र ऑनलाइन आवेदन", "Certificates", "Government issued income certificate for student scholarships, fee concession, and schemes.", "छात्रवृत्ति, स्कूल-कॉलेज प्रवेश एवं सरकारी योजनाओं हेतु अधिकृत आय प्रमाण पत्र।", "Assistance on state e-District portal for applying and downloading Tehsildar verified certificate.", "ई-डिस्ट्रिक्ट पोर्टल के माध्यम से स्वप्रमाणित घोषणा पत्र के साथ आय प्रमाण पत्र का आवेदन।", "Aadhaar Card\\nSelf-Declaration Form\\nSalary/Gram Pradhan report\\nPhoto", "FileCheck2", "Active", "yes", "7-15 Working Days", "Hello Balaji Communication, I want information about Income Certificate."],
    ["srv-caste-cert", "Caste Certificate (जाति प्रमाण पत्र)", "जाति प्रमाण पत्र (SC / ST / OBC / EWS)", "Certificates", "Official caste certificate for competitive examinations, reservations, and state benefits.", "सरकारी नौकरियों, आरक्षण एवं उच्च शिक्षा में लाभ हेतु अधिकृत जाति प्रमाण पत्र।", "State and Central format caste certificates application with proper revenue validation.", "राज्य एवं केंद्र सरकार के प्रारूप में एससी, एसटी, ओबीसी एवं ईडब्ल्यूएस प्रमाण पत्र का ऑनलाइन आवेदन।", "Aadhaar Card\\nOld family caste proof / registry\\nSelf-Declaration\\nPhoto", "Award", "Active", "no", "7-15 Working Days", "Hello Balaji Communication, I want information about Caste Certificate."],
    ["srv-residence-cert", "Residence / Domicile Certificate (निवास प्रमाण पत्र)", "मूल निवास प्रमाण पत्र ऑनलाइन आवेदन", "Certificates", "Valid proof of permanent residence for admissions, government jobs, and police verification.", "स्थानीय निवासी होने का कानूनी प्रमाण पत्र, जो नौकरियों एवं प्रवेश में अनिवार्य है।", "Apply for official Domicile (Niwas Praman Patra) through e-District platform.", "तहसीलदार स्तर से सत्यापित डिजिटल हस्ताक्षरित मूल निवास प्रमाण पत्र के लिए ऑनलाइन आवेदन।", "Aadhaar Card\\nElectricity Bill / Voter ID\\nPhoto", "Home", "Active", "no", "7-15 Working Days", "Hello Balaji Communication, I want information about Residence / Domicile Certificate."],
    ["srv-birth-cert", "Birth Certificate Assistance (जन्म प्रमाण पत्र)", "जन्म प्रमाण पत्र ऑनलाइन सहायता", "Certificates", "Assistance in applying for municipal birth certificate for new-borns and delayed registrations.", "नगर निगम / ब्लॉक स्तर पर नवजात बच्चों अथवा छूटे हुए जन्म प्रमाण पत्र के लिए मार्गदर्शन।", "Civil Registration System (CRS) application filing and hospital discharge slip submission.", "सीआरएस पोर्टल पर जन्म पंजीकरण एवं अस्पताल की डिस्चार्ज स्लिप के साथ आवेदन।", "Hospital Discharge Slip\\nParents Aadhaar\\nMarriage proof", "Baby", "Active", "no", "10-21 Working Days", "Hello Balaji Communication, I want information about Birth Certificate."],
    ["srv-online-forms", "Online Form Filling & Govt Job Applications", "सरकारी नौकरी फॉर्म एवं ऑनलाइन फॉर्म फिलिंग", "Other Digital Services", "Error-free form filling for SSC, Police, Railway, UPSC, Teaching, and college admissions.", "एसएससी, रेलवे, पुलिस, शिक्षक भर्ती, नीट, जेईई एवं अन्य प्रतियोगी परीक्षाओं के सही फॉर्म।", "Professional form submission with exact photo & signature resizing, document scanning, fee payment receipt generation.", "सटीक फोटो/हस्ताक्षर साइजिंग, योग्यता विवरण प्रविष्टि, सुरक्षित ऑनलाइन फीस भुगतान और प्रिंट आउट।", "Educational Marksheets\\nClear photo & signature\\nAadhaar Card", "FileText", "Active", "yes", "Immediate submission with receipt", "Hello Balaji Communication, I want information about Online Form Filling."],
    ["srv-print-scan", "Print, Scan, Photocopy & Passport Photos", "प्रिंट, स्कैन, फोटोकॉपी एवं तत्काल पासपोर्ट साइज फोटो", "Other Digital Services", "High-resolution color printing, document lamination, and instant 5-minute passport photos.", "हाई-क्वालिटी रंगीन व ब्लैक-व्हाइट प्रिंट, दस्तावेज लैमिनेशन एवं 5 मिनट में पासपोर्ट फोटो।", "Walk-in facilities for high-speed laser printing from WhatsApp/Email/Pen-drive, crisp scanning to PDF.", "व्हाट्सएप, ईमेल अथवा पेनड्राइव से तुरंत प्रिंट, सभी प्रकार के कागजातों की फोटोकॉपी एवं लैमिनेशन।", "Original Document or Soft copy", "Printer", "Active", "no", "Instant Walk-in (2-5 Minutes)", "Hello Balaji Communication, I want to print or scan documents."]
  ];
  for (var sIdx = 0; sIdx < defaultServices.length; sIdx++) {
    srvSheet.appendRow(defaultServices[sIdx]);
  }
  formatHeaderRow(srvSheet, "#1E3A8A");

  // 2. ENQUIRIES TAB (Header only - clean register ready for real citizen submissions, NO mock/test data)
  var enqSheet = getOrCreateSheet(ss, "Enquiries");
  if (enqSheet.getLastRow() === 0) {
    enqSheet.appendRow([
      "enquiry_id", "customer_name", "father_or_husband_name", "mobile", "service_name",
      "category", "village", "address", "message", "preferred_contact", "urgency", "status", "created_at"
    ]);
  }
  formatHeaderRow(enqSheet, "#065F46");

  // 3. PRICELIST TAB (Transparent CSC Government Fee & Kendra Rate Card)
  var prcSheet = getOrCreateSheet(ss, "PriceList");
  prcSheet.clearContents();
  prcSheet.appendRow([
    "price_id", "service_name", "category", "government_fee", "csc_service_fee",
    "total_fee", "processing_time", "eligibility_or_note", "status"
  ]);
  var defaultPrices = [
    ["PRC-001", "Aadhaar Mobile Number Update", "Aadhaar Services", "₹50", "₹30", "₹80", "24 to 48 Hours", "UIDAI biometric update fee + Kendra verification assistance", "Active"],
    ["PRC-002", "Income / Caste / Domicile Certificate", "Revenue & eDistrict UP", "₹15", "₹35", "₹50", "7 to 10 Days", "Official UP Govt treasury challan + online application & scanning", "Active"],
    ["PRC-003", "New PAN Card (Physical Delivery to Home)", "NSDL / UTI Services", "₹107", "₹93", "₹200", "10 to 15 Days", "NSDL official fee + biometric e-KYC and Speed Post plastic card", "Active"],
    ["PRC-004", "Ayushman Bharat Golden Card Print", "Health Mission", "₹0 (Govt Free)", "₹30", "₹30", "Instant 5 Mins", "Government subsidy is free; High-grade waterproof PVC print charge", "Active"],
    ["PRC-005", "PM Kisan Samman Nidhi e-KYC", "Agriculture Services", "₹0 (Govt Free)", "₹20", "₹20", "Instant Thumb Scan", "Biometric thumb authentication machine and portal server charge", "Active"],
    ["PRC-006", "New Ration Card Application", "Food & Civil Supplies", "₹0 (Govt Free)", "₹60", "₹60", "15 to 30 Days", "Online FCS portal filing, unit registration and document upload", "Active"],
    ["PRC-007", "Voter ID New Registration / Correction", "Election Commission", "₹0 (Govt Free)", "₹40", "₹40", "15 to 30 Days", "Form 6 / Form 8 application filing with BLO follow-up guidance", "Active"],
    ["PRC-008", "PVC Smart Plastic Card Print (Aadhaar / Voter / PAN)", "Digital Print Services", "₹0", "₹50", "₹50", "Instant 5 Mins", "High definition UV waterproof smart PVC plastic card printing", "Active"]
  ];
  for (var pIdx = 0; pIdx < defaultPrices.length; pIdx++) {
    prcSheet.appendRow(defaultPrices[pIdx]);
  }
  formatHeaderRow(prcSheet, "#7C2D12");

  // 4. NOTICE BOARD TAB (Live scheme announcements & deadlines)
  var ntcSheet = getOrCreateSheet(ss, "NoticeBoard");
  ntcSheet.clearContents();
  ntcSheet.appendRow([
    "notice_id", "title_en", "title_hi", "description_en", "description_hi",
    "category", "badge_type", "last_date", "action_link", "status", "created_at"
  ]);
  var defaultNotices = [
    ["NTC-001", "PM Kisan 19th Installment e-KYC Mandatory", "पीएम किसान 19वीं किस्त हेतु बायोमेट्रिक ई-केवाईसी अनिवार्य", "Farmers who have not completed biometric e-KYC must visit Balaji Communication to avoid installment blockage.", "जिन किसान भाइयों की ई-केवाईसी पूरी नहीं है, वे अपनी आगामी किस्त पाने के लिए तुरंत केंद्र पर आकर फिंगरप्रिंट से ई-केवाईसी कराएं।", "PM Kisan", "Urgent", "31-03-2026", "/services", "Active", new Date().toISOString()],
    ["NTC-002", "UP Scholarship 2026 Pre & Post Matric Applications Open", "यूपी छात्रवृत्ति 2026 दशमोत्तर एवं पूर्वदशम आवेदन प्रारंभ", "Apply online with Marksheet, Income Certificate, Caste Certificate, and Bank Passbook linked with NPCI.", "कक्षा 9, 10, 11, 12 एवं बीए, बीएससी, आईटीआई छात्रवृत्ति के नए एवं नवीनीकरण फॉर्म भरने हेतु संपर्क करें।", "Education & Scholarship", "New", "15-05-2026", "/contact", "Active", new Date().toISOString()],
    ["NTC-003", "Free Aadhaar Document Update Extended by UIDAI", "मुफ्त आधार कार्ड दस्तावेज अपडेट सुविधा का लाभ उठाएं", "UIDAI has extended online proof of identity and address update for cards older than 10 years.", "जिनका आधार कार्ड 10 वर्ष से अधिक पुराना है, वे अपनी पहचान एवं पते का प्रमाण तुरंत अपडेट करवाएं।", "Aadhaar Alert", "Important", "30-06-2026", "/services", "Active", new Date().toISOString()]
  ];
  for (var nIdx = 0; nIdx < defaultNotices.length; nIdx++) {
    ntcSheet.appendRow(defaultNotices[nIdx]);
  }
  formatHeaderRow(ntcSheet, "#92400E");

  // 5. QUICK LINKS TAB (Direct Official Portals Directory)
  var lnkSheet = getOrCreateSheet(ss, "QuickLinks");
  lnkSheet.clearContents();
  lnkSheet.appendRow([
    "link_id", "portal_name", "department", "category", "portal_url",
    "description", "portal_login_type", "required_credentials"
  ]);
  var defaultLinks = [
    ["LNK-001", "e-District Uttar Pradesh (ई-डिस्ट्रिक्ट)", "Revenue & IT Department UP", "Certificates", "https://edistrict.up.gov.in", "Official UP portal for Income, Caste, Domicile, Birth certificates.", "CSC Operator / Citizen Login", "Kendra Operator ID / OTP"],
    ["LNK-002", "UIDAI Official MyAadhaar Portal", "Ministry of Electronics and IT", "Aadhaar Services", "https://myaadhaar.uidai.gov.in", "Download e-Aadhaar, PVC card order, check update status.", "Citizen Aadhaar OTP / Biometric", "Aadhaar Number + Registered Mobile"],
    ["LNK-003", "UP Bhulekh Land Records (भूलेख खतौनी)", "Board of Revenue Uttar Pradesh", "Land Records", "https://upbhulekh.gov.in", "View and print authenticated RoR Khatauni, Gata number details.", "Open Public Search / Certified Copy", "District, Tehsil, Village Code, Gata/Khasra No"],
    ["LNK-004", "National Voter Service Portal (ECI Voters)", "Election Commission of India", "Voter ID", "https://voters.eci.gov.in", "New Form 6 voter enrollment, Form 8 correction, EPIC download.", "Mobile Login / ECI User", "EPIC Voter Number / Mobile OTP"],
    ["LNK-005", "PM Kisan Samman Nidhi Portal", "Ministry of Agriculture & Farmers Welfare", "Agriculture", "https://pmkisan.gov.in", "Beneficiary status check, biometric e-KYC, land correction.", "CSC Login / Farmer Self Service", "Aadhaar / Farmer Registration Number"]
  ];
  for (var lIdx = 0; lIdx < defaultLinks.length; lIdx++) {
    lnkSheet.appendRow(defaultLinks[lIdx]);
  }
  formatHeaderRow(lnkSheet, "#4C1D95");

  // 6. CITIZENS REGISTRY TAB (Header only - clean customer master directory, NO mock/test citizens)
  var citSheet = getOrCreateSheet(ss, "Citizens");
  if (citSheet.getLastRow() === 0) {
    citSheet.appendRow([
      "citizen_id", "full_name", "father_name", "mobile", "aadhaar_last4",
      "village", "address", "services_availed", "notes", "status", "created_at"
    ]);
  }
  formatHeaderRow(citSheet, "#1F2937");

  // 7. SETTINGS TAB (Balaji Communication Center Info)
  var setSheet = getOrCreateSheet(ss, "Settings");
  setSheet.clearContents();
  setSheet.appendRow(["Key", "Value"]);
  setSheet.appendRow(["business_name_en", "Balaji Communication"]);
  setSheet.appendRow(["business_name_hi", "बालाजी कम्युनिकेशन"]);
  setSheet.appendRow(["phone_number", "+919870677605"]);
  setSheet.appendRow(["whatsapp_number", "919870677605"]);
  setSheet.appendRow(["email", "vikkysingh9870677605@gmail.com"]);
  setSheet.appendRow(["address_en", "Shop, Masjid bali gali, Inter college road Gaini, Bareilly, Uttar Pradesh - 243302"]);
  setSheet.appendRow(["address_hi", "दुकान, मस्जिद वाली गली, इंटर कॉलेज रोड, गैनी, बरेली, उत्तर प्रदेश - 243302"]);
  formatHeaderRow(setSheet, "#374151");

  SpreadsheetApp.flush();
}

function getOrCreateSheet(ss, name) {
  var sheet = ss.getSheetByName(name);
  if (!sheet) {
    sheet = ss.insertSheet(name);
  }
  return sheet;
}

function formatHeaderRow(sheet, bgColor) {
  var range = sheet.getRange(1, 1, 1, sheet.getLastColumn() || 1);
  range.setBackground(bgColor);
  range.setFontColor("#FFFFFF");
  range.setFontWeight("bold");
  sheet.setFrozenRows(1);
}

// ================= READ DATA FUNCTIONS =================
function getServicesList() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName("Services");
  if (!sheet) {
    try {
      setupAllTemplateSheets();
      sheet = ss.getSheetByName("Services");
    } catch (e) {}
  }
  if (!sheet) return [];
  var data = sheet.getDataRange().getValues();
  if (data.length <= 1) return [];
  
  var services = [];
  for (var i = 1; i < data.length; i++) {
    var r = data[i];
    if (!r[1] && !r[2]) continue;
    services.push({
      service_id: String(r[0] || ("srv-" + i)),
      service_name_en: String(r[1] || r[2] || ""),
      service_name_hi: String(r[2] || r[1] || ""),
      category: String(r[3] || "General Services"),
      short_description_en: String(r[4] || ""),
      short_description_hi: String(r[5] || ""),
      full_description_en: String(r[6] || ""),
      full_description_hi: String(r[7] || ""),
      required_documents: r[8] ? String(r[8]).split(/[\\n;]+/).map(function(s){return s.trim();}).filter(Boolean) : [],
      icon: String(r[9] || "FileText"),
      status: String(r[10] || "Active"),
      popular: r[11] === true || String(r[11]).toLowerCase() === "yes",
      estimated_time: String(r[12] || "1 to 3 Working Days"),
      whatsapp_message: String(r[13] || "")
    });
  }
  return services;
}

function getEnquiriesList() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName("Enquiries");
  if (!sheet) return [];
  var data = sheet.getDataRange().getValues();
  if (data.length <= 1) return [];
  var list = [];
  for (var i = 1; i < data.length; i++) {
    var r = data[i];
    if (!r[1]) continue;
    list.push({
      enquiry_id: String(r[0] || ("ENQ-" + i)),
      customer_name: String(r[1] || ""),
      father_or_husband_name: String(r[2] || ""),
      mobile: String(r[3] || ""),
      service_name: String(r[4] || ""),
      category: String(r[5] || ""),
      village: String(r[6] || ""),
      address: String(r[7] || ""),
      message: String(r[8] || ""),
      preferred_contact: String(r[9] || "Call"),
      urgency: String(r[10] || "Normal"),
      status: String(r[11] || "New"),
      created_at: String(r[12] || new Date().toISOString())
    });
  }
  return list;
}

function getPriceListData() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName("PriceList");
  if (!sheet) return [];
  var data = sheet.getDataRange().getValues();
  if (data.length <= 1) return [];
  var list = [];
  for (var i = 1; i < data.length; i++) {
    var r = data[i];
    if (!r[1]) continue;
    list.push({
      price_id: String(r[0] || ("PRC-" + i)),
      service_name: String(r[1] || ""),
      category: String(r[2] || ""),
      government_fee: String(r[3] || "₹0"),
      csc_service_fee: String(r[4] || "₹0"),
      total_fee: String(r[5] || "₹0"),
      processing_time: String(r[6] || "1-3 Days"),
      eligibility_or_note: String(r[7] || ""),
      status: String(r[8] || "Active")
    });
  }
  return list;
}

function getNoticesData() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName("NoticeBoard");
  if (!sheet) return [];
  var data = sheet.getDataRange().getValues();
  if (data.length <= 1) return [];
  var list = [];
  for (var i = 1; i < data.length; i++) {
    var r = data[i];
    if (!r[1] && !r[2]) continue;
    list.push({
      notice_id: String(r[0] || ("NTC-" + i)),
      title_en: String(r[1] || ""),
      title_hi: String(r[2] || ""),
      description_en: String(r[3] || ""),
      description_hi: String(r[4] || ""),
      category: String(r[5] || "General"),
      badge_type: String(r[6] || "Important"),
      last_date: String(r[7] || ""),
      action_link: String(r[8] || ""),
      status: String(r[9] || "Active"),
      created_at: String(r[10] || new Date().toISOString())
    });
  }
  return list;
}

function getQuickLinksData() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName("QuickLinks");
  if (!sheet) return [];
  var data = sheet.getDataRange().getValues();
  if (data.length <= 1) return [];
  var list = [];
  for (var i = 1; i < data.length; i++) {
    var r = data[i];
    if (!r[1]) continue;
    list.push({
      link_id: String(r[0] || ("LNK-" + i)),
      portal_name: String(r[1] || ""),
      department: String(r[2] || ""),
      category: String(r[3] || ""),
      portal_url: String(r[4] || ""),
      description: String(r[5] || ""),
      portal_login_type: String(r[6] || ""),
      required_credentials: String(r[7] || "")
    });
  }
  return list;
}

function getCitizensData() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName("Citizens");
  if (!sheet) return [];
  var data = sheet.getDataRange().getValues();
  if (data.length <= 1) return [];
  var list = [];
  for (var i = 1; i < data.length; i++) {
    var r = data[i];
    if (!r[1]) continue;
    list.push({
      citizen_id: String(r[0] || ("CIT-" + i)),
      full_name: String(r[1] || ""),
      father_name: String(r[2] || ""),
      mobile: String(r[3] || ""),
      aadhaar_last4: String(r[4] || ""),
      village: String(r[5] || ""),
      address: String(r[6] || ""),
      services_availed: String(r[7] || ""),
      notes: String(r[8] || ""),
      status: String(r[9] || "Active"),
      created_at: String(r[10] || new Date().toISOString())
    });
  }
  return list;
}

function getSettingsData() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName("Settings");
  if (!sheet) return {};
  var data = sheet.getDataRange().getValues();
  var settings = {};
  for (var i = 1; i < data.length; i++) {
    var key = String(data[i][0]);
    var val = String(data[i][1]);
    if (key) settings[key] = val;
  }
  return settings;
}

// ================= WRITE / APPEND FUNCTIONS =================
function addEnquiry(data) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = getOrCreateSheet(ss, "Enquiries");
  if (sheet.getLastRow() === 0) {
    sheet.appendRow([
      "enquiry_id", "customer_name", "father_or_husband_name", "mobile", "service_name",
      "category", "village", "address", "message", "preferred_contact", "urgency", "status", "created_at"
    ]);
    formatHeaderRow(sheet, "#065F46");
  }
  var id = data.enquiry_id || ("ENQ-" + Utilities.getUuid().substring(0, 8).toUpperCase());
  
  // Deduplication check: Avoid inserting identical enquiry twice if sent by both client and server
  var lastRow = sheet.getLastRow();
  if (lastRow > 1) {
    var existingIds = sheet.getRange(2, 1, lastRow - 1, 1).getValues();
    for (var i = 0; i < existingIds.length; i++) {
      if (String(existingIds[i][0]).trim().toUpperCase() === String(id).trim().toUpperCase()) {
        return { status: "success", enquiry_id: id, message: "Enquiry already recorded" };
      }
    }
  }

  var createdAt = data.created_at || new Date().toISOString();
  sheet.appendRow([
    id,
    data.customer_name || data.applicant_name || "",
    data.father_or_husband_name || "",
    data.mobile || "",
    data.service_name || "",
    data.category || "",
    data.village || "",
    data.address || "",
    data.message || "",
    data.preferred_contact || "Call",
    data.urgency || "Normal",
    data.status || "New",
    createdAt
  ]);
  SpreadsheetApp.flush();
  return { status: "success", enquiry_id: id };
}

function addService(service) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = getOrCreateSheet(ss, "Services");
  if (sheet.getLastRow() === 0) {
    sheet.appendRow([
      "service_id", "service_name_en", "service_name_hi", "category",
      "short_description_en", "short_description_hi", "full_description_en", "full_description_hi",
      "required_documents", "icon", "status", "popular", "estimated_time", "whatsapp_message"
    ]);
    formatHeaderRow(sheet, "#1E3A8A");
  }
  var id = service.service_id || ("srv-" + Utilities.getUuid().substring(0, 8));
  var docsStr = Array.isArray(service.required_documents) ? service.required_documents.join("\n") : (service.required_documents || "");

  // Upsert check: If row exists with same service_id, update it
  var lastRow = sheet.getLastRow();
  if (lastRow > 1) {
    var existingIds = sheet.getRange(2, 1, lastRow - 1, 1).getValues();
    for (var i = 0; i < existingIds.length; i++) {
      if (String(existingIds[i][0]).trim().toUpperCase() === String(id).trim().toUpperCase()) {
        var row = i + 2;
        sheet.getRange(row, 2).setValue(service.service_name_en || "");
        sheet.getRange(row, 3).setValue(service.service_name_hi || "");
        sheet.getRange(row, 4).setValue(service.category || "General Services");
        sheet.getRange(row, 5).setValue(service.short_description_en || "");
        sheet.getRange(row, 6).setValue(service.short_description_hi || "");
        sheet.getRange(row, 7).setValue(service.full_description_en || "");
        sheet.getRange(row, 8).setValue(service.full_description_hi || "");
        sheet.getRange(row, 9).setValue(docsStr);
        sheet.getRange(row, 10).setValue(service.icon || "FileText");
        sheet.getRange(row, 11).setValue(service.status || "Active");
        sheet.getRange(row, 12).setValue(service.popular ? "yes" : "no");
        sheet.getRange(row, 13).setValue(service.estimated_time || "1-3 Days");
        sheet.getRange(row, 14).setValue(service.whatsapp_message || "");
        SpreadsheetApp.flush();
        return { status: "success", service_id: id, updated: true };
      }
    }
  }

  sheet.appendRow([
    id,
    service.service_name_en || "",
    service.service_name_hi || "",
    service.category || "General Services",
    service.short_description_en || "",
    service.short_description_hi || "",
    service.full_description_en || "",
    service.full_description_hi || "",
    docsStr,
    service.icon || "FileText",
    service.status || "Active",
    service.popular ? "yes" : "no",
    service.estimated_time || "1-3 Days",
    service.whatsapp_message || ""
  ]);
  SpreadsheetApp.flush();
  return { status: "success", service_id: id };
}

function updateService(service) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName("Services");
  if (!sheet) return { status: "error", message: "Sheet not found" };
  var data = sheet.getDataRange().getValues();
  for (var i = 1; i < data.length; i++) {
    if (String(data[i][0]).trim().toUpperCase() === String(service.service_id).trim().toUpperCase()) {
      var row = i + 1;
      var docsStr = Array.isArray(service.required_documents) ? service.required_documents.join("\n") : service.required_documents;
      sheet.getRange(row, 2).setValue(service.service_name_en);
      sheet.getRange(row, 3).setValue(service.service_name_hi);
      sheet.getRange(row, 4).setValue(service.category);
      sheet.getRange(row, 5).setValue(service.short_description_en);
      sheet.getRange(row, 6).setValue(service.short_description_hi);
      sheet.getRange(row, 7).setValue(service.full_description_en);
      sheet.getRange(row, 8).setValue(service.full_description_hi);
      sheet.getRange(row, 9).setValue(docsStr);
      sheet.getRange(row, 10).setValue(service.icon);
      sheet.getRange(row, 11).setValue(service.status);
      sheet.getRange(row, 12).setValue(service.popular ? "yes" : "no");
      sheet.getRange(row, 13).setValue(service.estimated_time);
      sheet.getRange(row, 14).setValue(service.whatsapp_message || "");
      SpreadsheetApp.flush();
      return { status: "success" };
    }
  }
  return { status: "error", message: "Service not found" };
}

function deleteService(serviceId) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName("Services");
  if (!sheet) return { status: "error", message: "Sheet not found" };
  var data = sheet.getDataRange().getValues();
  for (var i = 1; i < data.length; i++) {
    if (String(data[i][0]).trim().toUpperCase() === String(serviceId).trim().toUpperCase()) {
      sheet.deleteRow(i + 1);
      SpreadsheetApp.flush();
      return { status: "success" };
    }
  }
  return { status: "error", message: "Not found" };
}

function updateEnquiryStatus(enquiryId, newStatus) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName("Enquiries");
  if (!sheet) return { status: "error", message: "Enquiries sheet not found" };
  var data = sheet.getDataRange().getValues();
  for (var i = 1; i < data.length; i++) {
    if (String(data[i][0]).trim().toUpperCase() === String(enquiryId).trim().toUpperCase()) {
      sheet.getRange(i + 1, 12).setValue(newStatus);
      SpreadsheetApp.flush();
      return { status: "success", enquiry_id: enquiryId, status: newStatus };
    }
  }
  return { status: "error", message: "Enquiry ID not found: " + enquiryId };
}

function saveSettingsData(settingsObj) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = getOrCreateSheet(ss, "Settings");
  sheet.clearContents();
  sheet.appendRow(["Key", "Value"]);
  for (var k in settingsObj) {
    sheet.appendRow([k, String(settingsObj[k] || "")]);
  }
  formatHeaderRow(sheet, "#374151");
  return { status: "success" };
}
`;
