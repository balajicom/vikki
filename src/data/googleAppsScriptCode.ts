export const GOOGLE_APPS_SCRIPT_CODE = `/**
 * BALAJI COMMUNICATION - JAN SEVA KENDRA
 * Google Apps Script Backend for Google Sheets
 * 
 * Instructions:
 * 1. Create a new Google Sheet named "Balaji Communication Database"
 * 2. Create 3 tabs (sheets) with exact names:
 *    - "Services"
 *    - "Enquiries"
 *    - "Settings"
 * 3. Go to Extensions > Apps Script
 * 4. Paste this complete code into Code.gs
 * 5. Click "Deploy" > "New Deployment" > Select type: "Web app"
 *    - Execute as: "Me"
 *    - Who has access: "Anyone"
 * 6. Copy the Web App URL and paste it in the Balaji Admin Settings panel!
 */

function doGet(e) {
  var action = e.parameter.action || "getServices";
  var result = { status: "error", message: "Invalid action" };
  
  try {
    if (action === "getServices") {
      result = { status: "success", data: getServicesList() };
    } else if (action === "getSettings") {
      result = { status: "success", data: getSettingsData() };
    } else if (action === "getCategories") {
      result = { status: "success", data: getCategoriesList() };
    } else if (action === "getEnquiries") {
      // For admin viewing
      var token = e.parameter.token;
      if (verifyAdmin(token)) {
        result = { status: "success", data: getEnquiriesList() };
      } else {
        result = { status: "error", message: "Unauthorized" };
      }
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
      if (verifyAdmin(payload.token)) {
        result = addService(payload.data);
      } else {
        result = { status: "error", message: "Unauthorized" };
      }
    } else if (action === "updateService") {
      if (verifyAdmin(payload.token)) {
        result = updateService(payload.data);
      } else {
        result = { status: "error", message: "Unauthorized" };
      }
    } else if (action === "deleteService") {
      if (verifyAdmin(payload.token)) {
        result = deleteService(payload.service_id);
      } else {
        result = { status: "error", message: "Unauthorized" };
      }
    } else if (action === "updateEnquiryStatus") {
      if (verifyAdmin(payload.token)) {
        result = updateEnquiryStatus(payload.enquiry_id, payload.status);
      } else {
        result = { status: "error", message: "Unauthorized" };
      }
    } else if (action === "updateSettings") {
      if (verifyAdmin(payload.token)) {
        result = saveSettingsData(payload.data);
      } else {
        result = { status: "error", message: "Unauthorized" };
      }
    }
  } catch (err) {
    result = { status: "error", message: err.toString() };
  }
  
  return ContentService.createTextOutput(JSON.stringify(result))
    .setMimeType(ContentService.MimeType.JSON);
}

function verifyAdmin(token) {
  // Simple token verification or secret key check
  // Default master secret if needed: "balaji_admin_2026"
  return token && token.length > 5;
}

function getServicesList() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName("Services");
  if (!sheet) return [];
  
  var data = sheet.getDataRange().getValues();
  if (data.length <= 1) return [];
  
  var headers = data[0];
  var services = [];
  for (var i = 1; i < data.length; i++) {
    var row = data[i];
    if (!row[0]) continue;
    
    var s = {
      service_id: String(row[0]),
      service_name_en: String(row[1] || ""),
      service_name_hi: String(row[2] || ""),
      category: String(row[3] || "Other Digital Services"),
      short_description_en: String(row[4] || ""),
      short_description_hi: String(row[5] || ""),
      full_description_en: String(row[6] || ""),
      full_description_hi: String(row[7] || ""),
      required_documents: row[8] ? String(row[8]).split("\\n").filter(Boolean) : [],
      icon: String(row[9] || "FileText"),
      status: String(row[10] || "Active"),
      whatsapp_message: String(row[11] || ""),
      created_at: String(row[12] || new Date().toISOString())
    };
    services.push(s);
  }
  return services;
}

function addEnquiry(data) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName("Enquiries");
  if (!sheet) {
    sheet = ss.insertSheet("Enquiries");
    sheet.appendRow(["enquiry_id", "customer_name", "mobile", "service", "message", "preferred_contact", "status", "created_at"]);
  }
  
  var id = "enq-" + Utilities.getUuid().substring(0, 8);
  var createdAt = new Date().toISOString();
  
  sheet.appendRow([
    id,
    data.customer_name || "",
    data.mobile || "",
    data.service_name || "",
    data.message || "",
    data.preferred_contact || "Call",
    "New",
    createdAt
  ]);
  
  return { status: "success", enquiry_id: id };
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
    if (!r[0]) continue;
    list.push({
      enquiry_id: String(r[0]),
      customer_name: String(r[1]),
      mobile: String(r[2]),
      service_name: String(r[3]),
      message: String(r[4]),
      preferred_contact: String(r[5]),
      status: String(r[6]),
      created_at: String(r[7])
    });
  }
  return list;
}

function updateEnquiryStatus(enquiryId, newStatus) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName("Enquiries");
  if (!sheet) return { status: "error", message: "Enquiries sheet not found" };
  
  var data = sheet.getDataRange().getValues();
  for (var i = 1; i < data.length; i++) {
    if (String(data[i][0]) === String(enquiryId)) {
      sheet.getRange(i + 1, 7).setValue(newStatus);
      return { status: "success" };
    }
  }
  return { status: "error", message: "Enquiry ID not found" };
}

function addService(service) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName("Services");
  if (!sheet) {
    sheet = ss.insertSheet("Services");
    sheet.appendRow([
      "service_id", "service_name_en", "service_name_hi", "category", 
      "short_description_en", "short_description_hi", "full_description_en", 
      "full_description_hi", "required_documents", "icon", "status", 
      "whatsapp_message", "created_at"
    ]);
  }
  
  var id = service.service_id || ("srv-" + Utilities.getUuid().substring(0, 8));
  var docsStr = Array.isArray(service.required_documents) ? service.required_documents.join("\\n") : service.required_documents;
  
  sheet.appendRow([
    id,
    service.service_name_en,
    service.service_name_hi,
    service.category,
    service.short_description_en,
    service.short_description_hi,
    service.full_description_en,
    service.full_description_hi,
    docsStr,
    service.icon || "FileText",
    service.status || "Active",
    service.whatsapp_message || "",
    new Date().toISOString()
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
      sheet.getRange(row, 12).setValue(service.whatsapp_message || "");
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

function saveSettingsData(settingsObj) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName("Settings");
  if (!sheet) {
    sheet = ss.insertSheet("Settings");
    sheet.appendRow(["Key", "Value"]);
  }
  sheet.clearContents();
  sheet.appendRow(["Key", "Value"]);
  for (var k in settingsObj) {
    sheet.appendRow([k, String(settingsObj[k] || "")]);
  }
  return { status: "success" };
}
`;
