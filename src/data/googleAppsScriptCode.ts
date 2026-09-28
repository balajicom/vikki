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
    var payload = JSON.parse(e.postData.contents);
    var action = payload.action;
    
    if (action === "createEnquiry") {
      result = addEnquiry(payload.data);
    } else if (action === "createService") {
      result = addService(payload.data);
    } else if (action === "updateService") {
      result = updateService(payload.data);
    } else if (action === "deleteService") {
      result = deleteService(payload.service_id);
    } else if (action === "updateEnquiryStatus") {
      result = updateEnquiryStatus(payload.enquiry_id, payload.status);
    } else if (action === "savePriceList") {
      result = savePriceListItem(payload.data);
    } else if (action === "saveNotice") {
      result = saveNoticeItem(payload.data);
    } else if (action === "saveCitizen") {
      result = saveCitizenItem(payload.data);
    } else if (action === "updateSettings") {
      result = saveSettingsData(payload.data);
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
  
  // 1. SERVICES TAB
  var srvSheet = getOrCreateSheet(ss, "Services");
  srvSheet.clearContents();
  var srvHeaders = [
    "service_id", "service_name_en", "service_name_hi", "category",
    "short_description_en", "short_description_hi", "full_description_en", "full_description_hi",
    "required_documents", "icon", "status", "popular", "estimated_time", "whatsapp_message"
  ];
  srvSheet.appendRow(srvHeaders);
  srvSheet.appendRow([
    "srv-aadhaar-mob", "Aadhaar Mobile Number Update", "आधार मोबाइल नंबर अपडेट / जोड़ना", "Aadhaar",
    "Quick assistance for linking or updating active mobile number in Aadhaar.",
    "अपने आधार कार्ड में चालू मोबाइल नंबर लिंक या अपडेट करवाने के लिए सहायता।",
    "Updating mobile number in Aadhaar is essential for OTPs, banking, and government schemes.",
    "आधार में मोबाइल नंबर लिंक होना बैंक और सरकारी योजनाओं के लिए आवश्यक है।",
    "Original Aadhaar Card\\nActive Mobile Number", "Smartphone", "Active", "yes", "24-48 Hours",
    "Hello Balaji Communication, I need help with Aadhaar Mobile Number Update."
  ]);
  srvSheet.appendRow([
    "srv-pan-new", "New PAN Card (Instant e-PAN & Physical)", "नया पैन कार्ड (त्वरित ई-पैन और फिजिकल कार्ड)", "PAN Card",
    "Apply for fresh NSDL / UTI PAN card using Aadhaar e-KYC.",
    "आधार ई-केवाईसी द्वारा नया पैन कार्ड मात्र कुछ दिनों में प्राप्त करें।",
    "Complete online application for individual, minor, or business PAN card with paperless verification.",
    "नागरिकों और व्यापारियों के लिए संपूर्ण ऑनलाइन पैन कार्ड आवेदन सुविधा।",
    "Aadhaar Card\\n2 Passport Photos\\nSignature", "CreditCard", "Active", "yes", "3-5 Working Days",
    "Hello Balaji Communication, I want to apply for a New PAN Card."
  ]);
  srvSheet.appendRow([
    "srv-income-cert", "Income Certificate (आय प्रमाण पत्र)", "आय प्रमाण पत्र (Income Certificate UP)", "Government Certificates",
    "Online application on UP eDistrict portal for official revenue income certificate.",
    "उत्तर प्रदेश ई-डिस्ट्रिक्ट पोर्टल के माध्यम से आधिकारिक आय प्रमाण पत्र।",
    "Required for student scholarships, government welfare schemes, and pension applications.",
    "छात्रवृत्ति, सरकारी योजनाओं और राशन कार्ड के लिए अनिवार्य राजस्व आय प्रमाण पत्र।",
    "Aadhaar Card\\nRation Card / Family Register\\nSelf Declaration\\nPhoto", "FileText", "Active", "yes", "7-10 Working Days",
    "Hello Balaji Communication, I want to apply for Income Certificate."
  ]);
  formatHeaderRow(srvSheet, "#1E3A8A");

  // 2. ENQUIRIES TAB
  var enqSheet = getOrCreateSheet(ss, "Enquiries");
  if (enqSheet.getLastRow() === 0) {
    enqSheet.appendRow([
      "enquiry_id", "customer_name", "father_or_husband_name", "mobile", "service_name",
      "category", "village", "address", "message", "preferred_contact", "urgency", "status", "created_at"
    ]);
    enqSheet.appendRow([
      "ENQ-2026-001", "Ramesh Chandra Gangwar", "Shri Ram Prasad Gangwar", "9876543210",
      "Income Certificate (आय प्रमाण पत्र)", "Government Certificates", "Gaini",
      "Vill Gaini, Near Primary School, Bareilly", "Urgent requirement for son college scholarship form deadline.",
      "WhatsApp", "Urgent", "New", new Date().toISOString()
    ]);
  }
  formatHeaderRow(enqSheet, "#065F46");

  // 3. PRICELIST TAB
  var prcSheet = getOrCreateSheet(ss, "PriceList");
  prcSheet.clearContents();
  prcSheet.appendRow([
    "price_id", "service_name", "category", "government_fee", "csc_service_fee",
    "total_fee", "processing_time", "eligibility_or_note", "status"
  ]);
  prcSheet.appendRow([
    "PRC-001", "Aadhaar Mobile Number Update", "Aadhaar Services", "₹50", "₹30", "₹80", "24 to 48 Hours",
    "UIDAI official biometric update fee + Kendra verification assistance", "Active"
  ]);
  prcSheet.appendRow([
    "PRC-002", "Income / Caste / Domicile Certificate", "Revenue & eDistrict UP", "₹15", "₹35", "₹50", "7 to 10 Days",
    "Official UP Govt treasury challan + online application & scanning", "Active"
  ]);
  prcSheet.appendRow([
    "PRC-003", "New PAN Card (Physical Delivery to Home)", "NSDL / UTI Services", "₹107", "₹93", "₹200", "10 to 15 Days",
    "NSDL official fee + biometric e-KYC and Speed Post plastic card", "Active"
  ]);
  formatHeaderRow(prcSheet, "#7C2D12");

  // 4. NOTICE BOARD TAB
  var ntcSheet = getOrCreateSheet(ss, "NoticeBoard");
  ntcSheet.clearContents();
  ntcSheet.appendRow([
    "notice_id", "title_en", "title_hi", "description_en", "description_hi",
    "category", "badge_type", "last_date", "action_link", "status", "created_at"
  ]);
  ntcSheet.appendRow([
    "NTC-001", "PM Kisan 19th Installment e-KYC Mandatory",
    "पीएम किसान 19वीं किस्त हेतु बायोमेट्रिक ई-केवाईसी अनिवार्य",
    "Farmers who have not completed biometric e-KYC must visit Balaji Communication to avoid installment blockage.",
    "जिन किसान भाइयों की ई-केवाईसी पूरी नहीं है, वे अपनी आगामी किस्त पाने के लिए तुरंत केंद्र पर आकर फिंगरप्रिंट से ई-केवाईसी कराएं।",
    "PM Kisan", "Urgent", "31-03-2026", "/services/srv-pm-kisan", "Active", new Date().toISOString()
  ]);
  formatHeaderRow(ntcSheet, "#92400E");

  // 5. QUICK LINKS TAB
  var lnkSheet = getOrCreateSheet(ss, "QuickLinks");
  lnkSheet.clearContents();
  lnkSheet.appendRow([
    "link_id", "portal_name", "department", "category", "portal_url",
    "description", "portal_login_type", "required_credentials"
  ]);
  lnkSheet.appendRow([
    "LNK-001", "e-District Uttar Pradesh (ई-डिस्ट्रिक्ट)", "Revenue & IT Department UP", "Certificates",
    "https://edistrict.up.gov.in", "Official UP portal for Income, Caste, Domicile certificates.",
    "CSC Operator / Citizen Login", "Kendra Operator ID / OTP"
  ]);
  lnkSheet.appendRow([
    "LNK-002", "UIDAI Official MyAadhaar Portal", "Ministry of Electronics and IT", "Aadhaar Services",
    "https://myaadhaar.uidai.gov.in", "Download e-Aadhaar, PVC card order, check update status.",
    "Citizen Aadhaar OTP / Biometric", "Aadhaar Number + Registered Mobile"
  ]);
  formatHeaderRow(lnkSheet, "#4C1D95");

  // 6. CITIZENS REGISTRY TAB
  var citSheet = getOrCreateSheet(ss, "Citizens");
  if (citSheet.getLastRow() === 0) {
    citSheet.appendRow([
      "citizen_id", "full_name", "father_name", "mobile", "aadhaar_last4",
      "village", "address", "services_availed", "notes", "status", "created_at"
    ]);
    citSheet.appendRow([
      "CIT-001", "Satish Gangwar", "Mahavir Prasad", "9870601122", "4589",
      "Gaini", "Inter College Road, Gaini, Bareilly", "Income Certificate, PM Kisan e-KYC",
      "Eligible for PM Awas Yojana list check", "Completed", new Date().toISOString()
    ]);
  }
  formatHeaderRow(citSheet, "#1F2937");

  // 7. SETTINGS TAB
  var setSheet = getOrCreateSheet(ss, "Settings");
  setSheet.clearContents();
  setSheet.appendRow(["Key", "Value"]);
  setSheet.appendRow(["business_name_en", "Balaji Communication"]);
  setSheet.appendRow(["business_name_hi", "बालाजी कम्युनिकेशन"]);
  setSheet.appendRow(["phone_number", "+919870677605"]);
  setSheet.appendRow(["whatsapp_number", "919870677605"]);
  setSheet.appendRow(["email", "vikkysingh9870677605@gmail.com"]);
  setSheet.appendRow(["address_en", "Shop, Masjid bali gali, Inter college road Gaini, Bareilly, UP - 243302"]);
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
  var id = data.enquiry_id || ("ENQ-" + Utilities.getUuid().substring(0, 8).toUpperCase());
  var createdAt = new Date().toISOString();
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
    "New",
    createdAt
  ]);
  return { status: "success", enquiry_id: id };
}

function addService(service) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = getOrCreateSheet(ss, "Services");
  var id = service.service_id || ("srv-" + Utilities.getUuid().substring(0, 8));
  var docsStr = Array.isArray(service.required_documents) ? service.required_documents.join("\\n") : (service.required_documents || "");
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
  return { status: "success", service_id: id };
}

function updateService(service) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName("Services");
  if (!sheet) return { status: "error", message: "Sheet not found" };
  var data = sheet.getDataRange().getValues();
  for (var i = 1; i < data.length; i++) {
    if (String(data[i][0]) === String(service.service_id)) {
      var row = i + 1;
      var docsStr = Array.isArray(service.required_documents) ? service.required_documents.join("\\n") : service.required_documents;
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
    if (String(data[i][0]) === String(serviceId)) {
      sheet.deleteRow(i + 1);
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
    if (String(data[i][0]) === String(enquiryId)) {
      sheet.getRange(i + 1, 12).setValue(newStatus);
      return { status: "success" };
    }
  }
  return { status: "error", message: "Enquiry ID not found" };
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
