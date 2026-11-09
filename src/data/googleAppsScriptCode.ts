export const GOOGLE_APPS_SCRIPT_CODE = `/**
 * =========================================================================
 * BALAJI COMMUNICATION - JAN SEVA KENDRA & DIGITAL SERVICES
 * SINGLE-SHEET CITIZEN ENQUIRY STORAGE SCRIPT (OFFICIAL PRODUCTION)
 * =========================================================================
 * 
 * PURPOSE:
 * Automatically stores all user and citizen applications / enquiries submitted
 * from the Balaji Communication website directly into a single Google Sheet
 * named "Enquiries".
 * 
 * EASY 2-MINUTE SETUP:
 * 1. Open Google Sheets at https://sheets.new (or open your existing Google Sheet).
 * 2. In Google Sheets menu bar, click: Extensions > Apps Script.
 * 3. Delete any default code in Code.gs, paste this ENTIRE code, and click Save (💾 icon).
 * 4. In the toolbar function dropdown, make sure "setupEnquiriesSheet" is selected and click "Run" (▶ icon).
 *    -> Click "Review permissions" -> Choose your Google Account.
 *    -> Click "Advanced" -> Click "Go to Untitled project (unsafe)" -> Click "Allow".
 *    -> An "Enquiries" sheet with headers and formatting will be created instantly!
 * 5. Click "Deploy" (top right blue button) > "New deployment".
 *    -> Click the gear icon next to "Select type" and select "Web app".
 *    -> Description: "Balaji Enquiry Storage"
 *    -> Execute as: "Me (your email)"
 *    -> Who has access: "Anyone"  <--- [CRITICAL: Do NOT choose "Only myself"]
 * 6. Click "Deploy" -> Copy the Web App URL (ends with "/exec").
 * 7. Paste that URL into the Balaji Admin Dashboard > "Google Sheet Enquiry Setup" box.
 */

// SPREADSHEET CONFIGURATION:
// When opened from Extensions > Apps Script, leave SPREADSHEET_ID empty ("").
var SPREADSHEET_ID = "";

var SHEET_NAME = "Enquiries";

var HEADERS = [
  "Timestamp",
  "Reference ID",
  "Citizen / Applicant Name",
  "Father / Husband Name",
  "Mobile Number",
  "Service Required",
  "Category",
  "Village / Town",
  "Full Address",
  "Citizen Message / Remarks",
  "Preferred Contact",
  "Urgency",
  "Application Status"
];

function getSpreadsheet() {
  var ss = null;
  try {
    ss = SpreadsheetApp.getActiveSpreadsheet();
  } catch (e) {}

  if (!ss && SPREADSHEET_ID && SPREADSHEET_ID.trim()) {
    var raw = SPREADSHEET_ID.trim();
    var cleanId = raw;
    if (raw.indexOf("/spreadsheets/d/") !== -1) {
      cleanId = raw.split("/spreadsheets/d/")[1].split("/")[0].split("?")[0].split("#")[0];
    }
    try {
      ss = SpreadsheetApp.openById(cleanId);
    } catch (err) {}
  }

  if (!ss) {
    var active = SpreadsheetApp.getActiveSheet();
    if (active) ss = active.getParent();
  }

  if (!ss) {
    throw new Error("Spreadsheet not found! Please open this script from Extensions > Apps Script inside your Google Sheet.");
  }
  return ss;
}

/**
 * Initializes the single "Enquiries" sheet with clean headers, column styling, and frozen header row.
 */
function setupEnquiriesSheet() {
  var ss = getSpreadsheet();
  var sheet = ss.getSheetByName(SHEET_NAME);

  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME, 0);
  }

  // Set headers
  var headerRange = sheet.getRange(1, 1, 1, HEADERS.length);
  headerRange.setValues([HEADERS]);
  headerRange.setBackground("#1e3a8a"); // Navy Blue
  headerRange.setFontColor("#ffffff");
  headerRange.setFontWeight("bold");
  headerRange.setFontSize(10);
  headerRange.setHorizontalAlignment("center");
  sheet.setFrozenRows(1);

  // Auto-resize columns
  for (var i = 1; i <= HEADERS.length; i++) {
    sheet.setColumnWidth(i, i === 1 ? 160 : i === 2 ? 180 : i === 3 ? 180 : i === 5 ? 130 : i === 6 ? 220 : i === 10 ? 250 : 140);
  }

  Logger.log("Enquiries sheet setup complete! Headers: " + HEADERS.join(", "));
  return "Success: Enquiries sheet created and formatted!";
}

/**
 * Handles incoming POST requests (no-cors JSON and text/plain)
 */
function doPost(e) {
  try {
    var contents = e && e.postData && e.postData.contents ? e.postData.contents : "";
    var payload = {};

    if (contents) {
      try {
        payload = JSON.parse(contents);
      } catch (err) {
        payload = e.parameter || {};
      }
    } else if (e && e.parameter) {
      payload = e.parameter;
    }

    var action = payload.action || (e && e.parameter && e.parameter.action) || "createEnquiry";
    var data = payload.data || payload;

    if (action === "createEnquiry" || !action) {
      return handleSaveEnquiry(data);
    } else if (action === "updateEnquiryStatus") {
      return handleUpdateStatus(payload);
    }

    return createJsonResponse({ status: "success", message: "Action received" });
  } catch (error) {
    return createJsonResponse({ status: "error", message: error.toString() });
  }
}

/**
 * Handles incoming GET requests (query params, fallback beacons, test checks)
 */
function doGet(e) {
  try {
    var params = (e && e.parameter) ? e.parameter : {};
    var action = params.action || "";

    if (action === "createEnquiry" || params.customer_name || params.applicant_name || params.mobile) {
      return handleSaveEnquiry(params);
    } else if (action === "updateEnquiryStatus") {
      return handleUpdateStatus(params);
    } else if (action === "ping") {
      return createJsonResponse({
        status: "success",
        message: "Balaji Communication Enquiries Google Sheet Web App is active!",
        timestamp: new Date().toISOString()
      });
    }

    return createJsonResponse({
      status: "success",
      message: "Balaji Communication Enquiries Web App is running. All citizen applications submitted on the website will be appended to the 'Enquiries' sheet.",
      sheet: SHEET_NAME
    });
  } catch (error) {
    return createJsonResponse({ status: "error", message: error.toString() });
  }
}

/**
 * Appends a citizen application / enquiry row to the "Enquiries" sheet
 */
function handleSaveEnquiry(item) {
  var ss = getSpreadsheet();
  var sheet = ss.getSheetByName(SHEET_NAME);

  if (!sheet) {
    setupEnquiriesSheet();
    sheet = ss.getSheetByName(SHEET_NAME);
  }

  var now = new Date();
  var formattedTime = Utilities.formatDate(now, Session.getScriptTimeZone() || "Asia/Kolkata", "dd/MM/yyyy hh:mm:ss a");

  var refId = item.enquiry_id || ("BALAJI-APP-" + now.getTime().toString(36).toUpperCase());
  var citizenName = item.customer_name || item.applicant_name || "";
  var fatherHusband = item.father_or_husband_name || "";
  var mobile = item.mobile || "";
  var serviceName = item.service_name || "";
  var category = item.category || "General";
  var village = item.village || "";
  var address = item.address || "";
  var message = item.message || "";
  var preferredContact = item.preferred_contact || "Call";
  var urgency = item.urgency || "Normal";
  var status = item.status || "New";

  var row = [
    formattedTime,
    refId,
    citizenName,
    fatherHusband,
    "'" + mobile, // apostrophe prevents leading zeroes from dropping in Excel/Sheets
    serviceName,
    category,
    village,
    address,
    message,
    preferredContact,
    urgency,
    status
  ];

  // DEDUPLICATION: Verify if this Reference ID was already recorded in Column 2 (Reference ID)
  var existingLastRow = sheet.getLastRow();
  if (existingLastRow > 1) {
    var idValues = sheet.getRange(2, 2, existingLastRow - 1, 1).getValues();
    for (var r = 0; r < idValues.length; r++) {
      if (idValues[r][0] && String(idValues[r][0]).trim() === String(refId).trim()) {
        Logger.log("Duplicate enquiry skipped: " + refId);
        return createJsonResponse({
          status: "success",
          message: "Enquiry already recorded (duplicate prevented)",
          reference_id: refId
        });
      }
    }
  }

  sheet.appendRow(row);

  // Format the newly appended row
  var lastRow = sheet.getLastRow();
  var range = sheet.getRange(lastRow, 1, 1, row.length);
  range.setFontSize(9);
  range.setVerticalAlignment("middle");
  if (lastRow % 2 === 0) {
    range.setBackground("#f8fafc");
  }

  // Highlight status cell
  var statusCell = sheet.getRange(lastRow, 13);
  statusCell.setFontWeight("bold");
  statusCell.setHorizontalAlignment("center");
  if (status === "New") {
    statusCell.setBackground("#dbeafe");
    statusCell.setFontColor("#1e40af");
  }

  return createJsonResponse({
    status: "success",
    message: "Citizen enquiry successfully stored in Google Sheet",
    enquiry_id: refId,
    row: lastRow
  });
}

/**
 * Updates application status in the "Enquiries" sheet
 */
function handleUpdateStatus(params) {
  var ss = getSpreadsheet();
  var sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) return createJsonResponse({ status: "error", message: "Enquiries sheet not found" });

  var targetId = params.enquiry_id || params.id;
  var newStatus = params.status || "In Progress";
  if (!targetId) return createJsonResponse({ status: "error", message: "Missing enquiry_id" });

  var data = sheet.getDataRange().getValues();
  for (var i = 1; i < data.length; i++) {
    if (data[i][1] == targetId) {
      sheet.getRange(i + 1, 13).setValue(newStatus);
      return createJsonResponse({ status: "success", message: "Status updated to " + newStatus });
    }
  }

  return createJsonResponse({ status: "error", message: "Enquiry ID not found in sheet" });
}

function createJsonResponse(data) {
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}
`;
