import express from 'express';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';
import { INITIAL_SERVICES, INITIAL_SETTINGS, CATEGORIES, INITIAL_ENQUIRIES } from './src/data/initialData';
import { Service, Enquiry, WebsiteSettings, PriceListItem, NoticeItem, QuickLinkItem, CitizenRecord } from './src/types';
import { SHEET_TEMPLATES, generateCsvContent } from './src/data/sheetTemplates';

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '10mb' }));

// Database file path for local persistence
const DATA_DIR = path.join(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'db.json');

interface DatabaseSchema {
  services: Service[];
  enquiries: Enquiry[];
  settings: WebsiteSettings;
  priceList?: PriceListItem[];
  notices?: NoticeItem[];
  quickLinks?: QuickLinkItem[];
  citizens?: CitizenRecord[];
  adminCredentials: {
    email: string;
    passwordHash: string;
  };
}

// Ensure database file exists
function loadDatabase(): DatabaseSchema {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (fs.existsSync(DB_FILE)) {
      const raw = fs.readFileSync(DB_FILE, 'utf-8');
      const parsed = JSON.parse(raw);
      // Ensure Gaini Bareilly info if older data exists
      if (!parsed.settings.address_en || parsed.settings.address_en.includes('Sector 12')) {
        parsed.settings = { ...parsed.settings, ...INITIAL_SETTINGS };
      }
      // Ensure enquiries are seeded if empty
      if (!Array.isArray(parsed.enquiries) || parsed.enquiries.length === 0) {
        parsed.enquiries = INITIAL_ENQUIRIES;
      }
      return parsed;
    }
  } catch (err) {
    console.error('Error reading db.json, falling back to defaults:', err);
  }

  // Initial seed with services and initial enquiries
  const initialDb: DatabaseSchema = {
    services: INITIAL_SERVICES,
    enquiries: INITIAL_ENQUIRIES,
    settings: INITIAL_SETTINGS,
    adminCredentials: {
      email: "admin@balaji.com",
      passwordHash: "balaji@2026"
    }
  };

  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(initialDb, null, 2));
  } catch (e) {
    console.error('Could not write initial db.json:', e);
  }

  return initialDb;
}

function saveDatabase(database: DatabaseSchema) {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(DB_FILE, JSON.stringify(database, null, 2));
  } catch (err) {
    console.error('Error saving db.json:', err);
  }
}

// In-memory reference that stays in sync
let db = loadDatabase();

// Authentication middleware helper
const ADMIN_TOKEN = "balaji_secure_admin_session_token_2026";

function checkAdminAuth(req: express.Request, res: express.Response, next: express.NextFunction) {
  const authHeader = req.headers.authorization || '';
  const tokenQuery = (req.query.token as string) || '';
  const tokenBody = (req.body && req.body.token as string) || '';

  if (authHeader.includes(ADMIN_TOKEN) || tokenQuery === ADMIN_TOKEN || tokenBody === ADMIN_TOKEN) {
    return next();
  }
  return res.status(401).json({ error: "Unauthorized access. Please login as admin." });
}

// Helper: Parse CSV text into array of objects
function parseCsvToObjects(csvText: string): Record<string, string>[] {
  const lines = csvText.split(/\r?\n/).filter(line => line.trim().length > 0);
  if (lines.length < 2) return [];

  const parseLine = (line: string): string[] => {
    const values: string[] = [];
    let current = '';
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      if (char === '"') {
        if (inQuotes && line[i + 1] === '"') {
          current += '"';
          i++;
        } else {
          inQuotes = !inQuotes;
        }
      } else if (char === ',' && !inQuotes) {
        values.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    values.push(current.trim());
    return values;
  };

  const headers = parseLine(lines[0]).map(h => h.trim().toLowerCase().replace(/[\s_-]+/g, '_'));
  const rows: Record<string, string>[] = [];

  for (let i = 1; i < lines.length; i++) {
    const values = parseLine(lines[i]);
    const obj: Record<string, string> = {};
    headers.forEach((header, idx) => {
      obj[header] = values[idx] || '';
    });
    rows.push(obj);
  }

  return rows;
}

// Helper: Map raw row data to standardized Service interface
function mapRowToService(row: Record<string, any>, idx: number): Service | null {
  const nameEn = row.service_name_en || row.service_name || row.name_en || row.name || row.title || '';
  if (!nameEn) return null;

  const id = row.service_id || row.id || `srv-sheet-${idx + 1}`;
  const nameHi = row.service_name_hi || row.name_hi || nameEn;
  const category = row.category || 'General Services';
  const shortEn = row.short_description_en || row.short_desc || row.short_description || row.description || '';
  const shortHi = row.short_description_hi || row.short_desc_hi || shortEn;
  const fullEn = row.full_description_en || row.full_description || row.long_description || shortEn;
  const fullHi = row.full_description_hi || row.full_description || shortHi;

  let docs: string[] = [];
  const rawDocs = row.required_documents || row.documents || row.docs || '';
  if (Array.isArray(rawDocs)) {
    docs = rawDocs;
  } else if (typeof rawDocs === 'string' && rawDocs.trim()) {
    docs = rawDocs.split(/[\n,;]+/).map(d => d.trim()).filter(Boolean);
  }

  return {
    service_id: String(id),
    service_name_en: String(nameEn),
    service_name_hi: String(nameHi),
    category: String(category),
    short_description_en: String(shortEn),
    short_description_hi: String(shortHi),
    full_description_en: String(fullEn),
    full_description_hi: String(fullHi),
    required_documents: docs.length > 0 ? docs : ['Original Aadhaar Card', 'Registered Mobile Number'],
    icon: row.icon || 'FileText',
    status: (row.status && row.status.toLowerCase() === 'disabled') ? 'Disabled' : 'Active',
    popular: Boolean(row.popular === true || row.popular === 'true' || row.popular === 'yes' || row.popular === 1),
    estimated_time: row.estimated_time || '1 to 3 Working Days',
    whatsapp_message: row.whatsapp_message || `Hello Balaji Communication, I want information about ${nameEn}.`,
    created_at: row.created_at || new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
}

// Master Google Sheets Sync Function (Handles both Google Spreadsheet links & Web App URLs)
async function syncFromGoogleSource(inputUrl: string): Promise<{
  success: boolean;
  message: string;
  count?: number;
  services?: Service[];
  sourceType?: 'spreadsheet' | 'webapp';
}> {
  const url = inputUrl.trim();
  if (!url) {
    return { success: false, message: 'Google Sheets or Web App URL is required.' };
  }

  // Check if standard Google Spreadsheet Link
  const sheetMatch = url.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/i);

  if (sheetMatch) {
    const sheetId = sheetMatch[1];
    const gidMatch = url.match(/[?#&]gid=([0-9]+)/i);
    const gid = gidMatch ? gidMatch[1] : '0';

    // Helper to merge imported services with existing ones
    const applyMergedServices = (importedServices: Service[], sourceType: 'spreadsheet' | 'webapp') => {
      const sheetServiceIds = new Set(importedServices.map(s => s.service_id));
      const existingRetained = db.services.filter(s => !sheetServiceIds.has(s.service_id));
      db.services = [...importedServices, ...existingRetained];
      db.settings.google_sheet_webapp_url = url;
      db.settings.google_sheet_url = url;
      db.settings.last_sheet_sync = new Date().toISOString();
      saveDatabase(db);
      return {
        success: true,
        message: `Successfully connected to Google Sheet! Imported ${importedServices.length} services (Total catalog: ${db.services.length} services).`,
        count: importedServices.length,
        sourceType,
        services: db.services
      };
    };

    // Attempt 1: Fetch through Google Visualization Query API (JSON format)
    const gvizUrlsToTry = [
      `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:json&sheet=Services`,
      `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:json&gid=${gid}`,
      `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:json`
    ];

    for (const gvizUrl of gvizUrlsToTry) {
      try {
        const gvizRes = await fetch(gvizUrl, { headers: { 'User-Agent': 'Mozilla/5.0' } });
        if (!gvizRes.ok) continue;
        const gvizText = await gvizRes.text();

        const jsonStart = gvizText.indexOf('{');
        const jsonEnd = gvizText.lastIndexOf('}');
        if (jsonStart !== -1 && jsonEnd !== -1) {
          const jsonStr = gvizText.substring(jsonStart, jsonEnd + 1);
          const parsed = JSON.parse(jsonStr);
          if (parsed.table && parsed.table.rows && parsed.table.rows.length > 0) {
            const cols: string[] = (parsed.table.cols || []).map((c: any) => 
              (c.label || c.id || '').toLowerCase().replace(/[\s_-]+/g, '_')
            );

            const parsedServices: Service[] = [];
            parsed.table.rows.forEach((r: any, rIdx: number) => {
              const rowObj: Record<string, any> = {};
              (r.c || []).forEach((cell: any, cIdx: number) => {
                const colName = cols[cIdx] || `col_${cIdx}`;
                rowObj[colName] = cell && cell.v !== null && cell.v !== undefined ? cell.v : '';
              });
              const s = mapRowToService(rowObj, rIdx);
              if (s) parsedServices.push(s);
            });

            if (parsedServices.length > 0) {
              return applyMergedServices(parsedServices, 'spreadsheet');
            }
          }
        }
      } catch (gvizErr) {
        // Continue to next gviz option or CSV fallback
      }
    }

    // Attempt 2: Fetch through CSV Export
    const csvUrlsToTry = [
      `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv&gid=${gid}`,
      `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv&gid=0`
    ];

    for (const csvUrl of csvUrlsToTry) {
      try {
        const csvRes = await fetch(csvUrl);
        if (csvRes.ok) {
          const csvText = await csvRes.text();
          const rows = parseCsvToObjects(csvText);
          const parsedServices: Service[] = [];
          rows.forEach((r, idx) => {
            const s = mapRowToService(r, idx);
            if (s) parsedServices.push(s);
          });

          if (parsedServices.length > 0) {
            return applyMergedServices(parsedServices, 'spreadsheet');
          }
        }
      } catch (csvErr: any) {
        // Continue to next fallback
      }
    }

    return {
      success: false,
      message: 'Found Google Sheet link, but could not read data. Please make sure the sheet is shared with: "Anyone with the link can view".'
    };
  }

  // Check if Google Apps Script Web App URL
  try {
    const fetchUrl = url.includes('?') ? `${url}&action=getServices` : `${url}?action=getServices`;
    const response = await fetch(fetchUrl, {
      redirect: 'follow',
      headers: { 'Accept': 'application/json' }
    });

    const data: any = await response.json();
    let serviceList: Service[] = [];

    if (Array.isArray(data)) {
      serviceList = data;
    } else if (data && data.status === 'success' && Array.isArray(data.data)) {
      serviceList = data.data;
    } else if (data && Array.isArray(data.services)) {
      serviceList = data.services;
    }

    if (serviceList.length > 0) {
      const sheetServiceIds = new Set(serviceList.map(s => s.service_id));
      const existingRetained = db.services.filter(s => !sheetServiceIds.has(s.service_id));
      db.services = [...serviceList, ...existingRetained];
      db.settings.google_sheet_webapp_url = url;
      db.settings.google_sheet_url = url;
      db.settings.last_sheet_sync = new Date().toISOString();
      saveDatabase(db);
      return {
        success: true,
        message: `Successfully connected to Google Apps Script Web App! Loaded ${serviceList.length} services (Total catalog: ${db.services.length} services).`,
        count: serviceList.length,
        sourceType: 'webapp',
        services: db.services
      };
    } else {
      return {
        success: true,
        message: 'Connected to Web App, but no services were returned. Local database retained.',
        sourceType: 'webapp'
      };
    }
  } catch (err: any) {
    console.error('Web App fetch error:', err);
    return {
      success: false,
      message: `Failed to connect to Google Apps Script Web App: ${err.message || 'Check URL permissions (Deploy > Anyone).'}`
    };
  }
}

// Auto-sync on startup if a Google Sheet URL is configured
if (db.settings.google_sheet_webapp_url || db.settings.google_sheet_url) {
  const syncTarget = db.settings.google_sheet_webapp_url || db.settings.google_sheet_url || '';
  if (syncTarget) {
    syncFromGoogleSource(syncTarget)
      .then(res => console.log('Initial Google Sheet sync result:', res.message))
      .catch(err => console.warn('Initial Google Sheet sync skipped:', err.message));
  }
}

// ================= API ROUTES =================

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'Balaji Communication Live API',
    location: 'Gaini, Bareilly',
    servicesCount: db.services.length,
    enquiriesCount: db.enquiries.length,
    lastSheetSync: db.settings.last_sheet_sync || null
  });
});

// 1. Services
app.get('/api/services', (req, res) => {
  const auth = req.headers.authorization;
  const isAdmin = auth && auth.includes(ADMIN_TOKEN);

  const services = isAdmin 
    ? db.services 
    : db.services.filter(s => s.status === 'Active');

  res.json({
    success: true,
    services,
    last_sheet_sync: db.settings.last_sheet_sync || null
  });
});

app.get('/api/services/:id', (req, res) => {
  const service = db.services.find(s => s.service_id === req.params.id);
  if (!service) {
    return res.status(404).json({ error: "Service not found" });
  }
  res.json({ success: true, service });
});

app.post('/api/services', checkAdminAuth, async (req, res) => {
  const body = req.body;
  const nameEn = (body.service_name_en || body.service_name_hi || '').trim();
  const nameHi = (body.service_name_hi || body.service_name_en || '').trim();

  if (!nameEn && !nameHi) {
    return res.status(400).json({ error: "Service name is required (English or Hindi)." });
  }

  const newService: Service = {
    service_id: body.service_id || `srv-${Date.now().toString(36)}`,
    service_name_en: nameEn || nameHi,
    service_name_hi: nameHi || nameEn,
    category: (body.category || 'General Services').trim(),
    short_description_en: body.short_description_en || "",
    short_description_hi: body.short_description_hi || "",
    full_description_en: body.full_description_en || "",
    full_description_hi: body.full_description_hi || "",
    required_documents: Array.isArray(body.required_documents) 
      ? body.required_documents 
      : (typeof body.required_documents === 'string' ? body.required_documents.split('\n').map((s: string) => s.trim()).filter(Boolean) : []),
    icon: body.icon || 'CreditCard',
    status: body.status === 'Disabled' ? 'Disabled' : 'Active',
    popular: Boolean(body.popular),
    estimated_time: body.estimated_time || '1 to 3 Working Days',
    whatsapp_message: body.whatsapp_message || `Hello Balaji Communication, I want information about ${nameEn}.`,
    created_at: body.created_at || new Date().toISOString(),
    updated_at: new Date().toISOString()
  };

  const existingIdx = db.services.findIndex(s => s.service_id === newService.service_id);
  if (existingIdx !== -1) {
    db.services[existingIdx] = newService;
  } else {
    db.services.unshift(newService);
  }
  saveDatabase(db);

  // If a Google Apps Script Web App URL is configured, forward service asynchronously
  if (db.settings.google_sheet_webapp_url && db.settings.google_sheet_webapp_url.includes('script.google.com')) {
    try {
      fetch(db.settings.google_sheet_webapp_url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'createService',
          token: ADMIN_TOKEN,
          data: newService
        })
      }).catch(e => console.warn('Background sync to Google Sheet error:', e.message));
    } catch (ignore) {}
  }

  res.json({ success: true, service: newService });
});

app.put('/api/services/:id', checkAdminAuth, (req, res) => {
  const idx = db.services.findIndex(s => s.service_id === req.params.id);
  if (idx === -1) {
    return res.status(404).json({ error: "Service not found" });
  }

  const body = req.body;
  const updatedService: Service = {
    ...db.services[idx],
    ...body,
    required_documents: Array.isArray(body.required_documents)
      ? body.required_documents
      : (typeof body.required_documents === 'string' ? body.required_documents.split('\n').filter(Boolean) : db.services[idx].required_documents),
    updated_at: new Date().toISOString()
  };

  db.services[idx] = updatedService;
  saveDatabase(db);

  res.json({ success: true, service: updatedService });
});

app.delete('/api/services/:id', checkAdminAuth, (req, res) => {
  const initialLength = db.services.length;
  db.services = db.services.filter(s => s.service_id !== req.params.id);
  if (db.services.length === initialLength) {
    return res.status(404).json({ error: "Service not found" });
  }
  saveDatabase(db);
  res.json({ success: true, message: "Service deleted successfully" });
});

// 2. Categories
app.get('/api/categories', (req, res) => {
  const existingCategories = new Set(CATEGORIES);
  db.services.forEach(s => {
    if (s.category) existingCategories.add(s.category);
  });
  res.json({ success: true, categories: Array.from(existingCategories) });
});

// 3. Settings
app.get('/api/settings', (req, res) => {
  res.json({ success: true, settings: db.settings });
});

app.put('/api/settings', checkAdminAuth, (req, res) => {
  db.settings = {
    ...db.settings,
    ...req.body
  };
  saveDatabase(db);
  res.json({ success: true, settings: db.settings });
});

// 4. Direct Online Application & Enquiry Submission
app.post(['/api/enquiries', '/api/applications'], (req, res) => {
  const {
    customer_name,
    applicant_name,
    mobile,
    father_or_husband_name,
    address,
    service_id,
    service_name,
    category,
    message,
    preferred_contact,
    urgency
  } = req.body;

  const finalName = (customer_name || applicant_name || '').trim();
  if (!finalName || !mobile) {
    return res.status(400).json({ error: "Applicant name and mobile number are required." });
  }

  const cleanMobile = String(mobile).replace(/\D/g, '');
  if (cleanMobile.length < 10) {
    return res.status(400).json({ error: "Please enter a valid 10-digit mobile number." });
  }

  const content = `${finalName} ${message || ''}`.toLowerCase();
  if (content.includes('otp') || content.includes('password') || content.includes('upi pin') || content.includes('cvv')) {
    return res.status(400).json({ error: "Please do NOT enter OTP, bank passwords, or PINs on this form." });
  }

  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  const now = new Date();
  const dateStr = `${String(now.getFullYear()).slice(-2)}${String(now.getMonth() + 1).padStart(2, '0')}`;
  const refId = (req.body.enquiry_id && String(req.body.enquiry_id).trim()) || `BALAJI-APP-${dateStr}-${randomSuffix}`;

  const newApplication: Enquiry = {
    enquiry_id: refId,
    customer_name: finalName,
    applicant_name: (applicant_name || finalName).trim(),
    mobile: cleanMobile,
    father_or_husband_name: father_or_husband_name ? father_or_husband_name.trim() : '',
    address: address ? address.trim() : '',
    village: (req.body.village || 'Gaini').trim(),
    service_id: service_id || '',
    service_name: service_name || 'General Citizen Service',
    category: category || 'Jan Seva Kendra',
    message: message ? message.trim() : '',
    preferred_contact: preferred_contact === 'WhatsApp' ? 'WhatsApp' : 'Call',
    status: 'New',
    urgency: urgency || 'Normal',
    created_at: now.toISOString(),
    updated_at: now.toISOString()
  };

  const existingIdx = db.enquiries.findIndex(e => e.enquiry_id === newApplication.enquiry_id);
  if (existingIdx !== -1) {
    db.enquiries[existingIdx] = newApplication;
  } else {
    db.enquiries.unshift(newApplication);
  }
  saveDatabase(db);

  // If Google Apps Script Web App URL is configured, asynchronously send to Google Sheets
  const sheetTarget = db.settings.google_sheet_webapp_url || db.settings.google_sheet_url;
  if (sheetTarget && sheetTarget.includes('script.google.com')) {
    try {
      fetch(sheetTarget, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'createEnquiry',
          data: newApplication
        })
      }).catch(err => console.error('Failed forwarding application to Google Sheets Web App:', err));
    } catch (err) {
      console.error('Error forwarding to Google Sheet:', err);
    }
  }

  res.json({
    success: true,
    message: "Thank you. Your direct application has been received by Balaji Communication Jan Seva Kendra.",
    enquiry_id: newApplication.enquiry_id,
    application: newApplication
  });
});

app.get('/api/enquiries', checkAdminAuth, (req, res) => {
  res.json({ success: true, enquiries: db.enquiries });
});

// Citizen Live Tracking by Application ID or Mobile Number
app.get('/api/applications/track/:query', (req, res) => {
  const rawQ = req.params.query.trim();
  const q = rawQ.toLowerCase();
  const qNorm = q.replace(/[\s-_]/g, '');
  const digitsOnly = q.replace(/\D/g, '');
  const target10 = digitsOnly.length >= 10 ? digitsOnly.slice(-10) : digitsOnly;

  const matches = db.enquiries.filter(e => {
    // 1. Check ID with/without hyphens
    const id = (e.enquiry_id || '').toLowerCase();
    const idNorm = id.replace(/[\s-_]/g, '');
    const idMatch = id.includes(q) || (qNorm.length >= 3 && idNorm.includes(qNorm));

    // 2. Check 10-digit mobile number normalized
    const eDigits = (e.mobile || '').replace(/\D/g, '');
    const e10 = eDigits.length >= 10 ? eDigits.slice(-10) : eDigits;
    const mobMatch = (target10.length === 10 && e10 === target10) || 
                     (digitsOnly.length >= 5 && (eDigits.includes(digitsOnly) || digitsOnly.includes(eDigits)));

    // 3. Check applicant name
    const nameMatch = q.length >= 3 && (
      (e.customer_name || '').toLowerCase().includes(q) || 
      ((e as any).applicant_name || '').toLowerCase().includes(q)
    );

    return idMatch || mobMatch || nameMatch;
  });

  res.json({
    success: true,
    query: rawQ,
    results: matches.map(m => ({
      enquiry_id: m.enquiry_id,
      customer_name: m.customer_name,
      applicant_name: m.applicant_name || m.customer_name,
      service_name: m.service_name,
      status: m.status,
      created_at: m.created_at,
      updated_at: m.updated_at || m.created_at,
      preferred_contact: m.preferred_contact,
      village: m.village || 'Gaini',
      address: m.address || '',
      urgency: m.urgency || 'Normal',
      masked_mobile: m.mobile ? (m.mobile.slice(0, 2) + '******' + m.mobile.slice(-2)) : ''
    }))
  });
});

// Update Status (supports both PATCH and POST for maximum browser & proxy compatibility)
const handleStatusUpdate = (req: express.Request, res: express.Response) => {
  const { status, enquiry: clientEnquiry } = req.body;
  const targetId = req.params.id;

  const validStatuses = ['New', 'Contacted', 'Processing', 'Completed', 'Cancelled'];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ error: "Invalid status value. Must be New, Contacted, Processing, Completed, or Cancelled." });
  }

  let enquiry = db.enquiries.find(e => 
    e.enquiry_id === targetId || 
    e.enquiry_id.toLowerCase() === targetId.toLowerCase()
  );

  if (!enquiry) {
    // If client supplied the full enquiry or if it exists with normalized match
    const normTarget = targetId.toLowerCase().replace(/[\s-_]/g, '');
    enquiry = db.enquiries.find(e => (e.enquiry_id || '').toLowerCase().replace(/[\s-_]/g, '') === normTarget);
  }

  if (!enquiry) {
    if (clientEnquiry && clientEnquiry.customer_name) {
      // Upsert record from client
      enquiry = {
        ...clientEnquiry,
        enquiry_id: targetId,
        status,
        updated_at: new Date().toISOString()
      };
      db.enquiries.unshift(enquiry);
    } else {
      // Create minimal placeholder record to preserve status
      enquiry = {
        enquiry_id: targetId,
        customer_name: 'Citizen Applicant',
        mobile: '',
        service_name: 'Jan Seva Kendra Service',
        message: '',
        status,
        preferred_contact: 'Call',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      db.enquiries.unshift(enquiry);
    }
  } else {
    enquiry.status = status;
    enquiry.updated_at = new Date().toISOString();
  }

  saveDatabase(db);

  // Forward status change to Google Sheets if configured
  const sheetTarget = db.settings.google_sheet_webapp_url || db.settings.google_sheet_url;
  if (sheetTarget && sheetTarget.includes('script.google.com')) {
    try {
      fetch(sheetTarget, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'updateEnquiryStatus',
          enquiry_id: enquiry.enquiry_id,
          status: enquiry.status
        })
      }).catch(err => console.error('Failed forwarding status update to Google Sheets Web App:', err));
    } catch (err) {
      console.error('Error forwarding status update to Google Sheet:', err);
    }
  }

  return res.json({ success: true, enquiry, message: `Status updated to ${status}` });
};

app.patch('/api/enquiries/:id/status', checkAdminAuth, handleStatusUpdate);
app.post('/api/enquiries/:id/status', checkAdminAuth, handleStatusUpdate);

app.delete('/api/enquiries/:id', checkAdminAuth, (req, res) => {
  const prevLen = db.enquiries.length;
  db.enquiries = db.enquiries.filter(e => e.enquiry_id !== req.params.id);
  if (db.enquiries.length === prevLen) {
    return res.status(404).json({ error: "Application/Enquiry not found" });
  }
  saveDatabase(db);
  res.json({ success: true, message: "Deleted successfully" });
});

// 5. Authentication
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  if (email.trim().toLowerCase() === db.adminCredentials.email.toLowerCase() && password === db.adminCredentials.passwordHash) {
    return res.json({
      success: true,
      token: ADMIN_TOKEN,
      user: {
        email: db.adminCredentials.email,
        name: "Balaji Admin",
        role: "Super Admin"
      }
    });
  }

  return res.status(401).json({ error: "Invalid email or password. (Default: admin@balaji.com / balaji@2026)" });
});

app.post('/api/auth/verify', (req, res) => {
  const auth = req.headers.authorization;
  if (auth && auth.includes(ADMIN_TOKEN)) {
    return res.json({
      success: true,
      user: {
        email: db.adminCredentials.email,
        name: "Balaji Admin",
        role: "Super Admin"
      }
    });
  }
  return res.status(401).json({ error: "Invalid or expired token" });
});

app.post('/api/auth/change-password', checkAdminAuth, (req, res) => {
  const { newPassword } = req.body;
  if (!newPassword || newPassword.length < 6) {
    return res.status(400).json({ error: "Password must be at least 6 characters long." });
  }
  db.adminCredentials.passwordHash = newPassword;
  saveDatabase(db);
  res.json({ success: true, message: "Admin password updated successfully." });
});

// 6. Google Sheets Sync endpoint
app.post('/api/sync-sheets', checkAdminAuth, async (req, res) => {
  const { webapp_url, url } = req.body;
  const targetUrl = (webapp_url || url || db.settings.google_sheet_webapp_url || db.settings.google_sheet_url || '').trim();

  if (!targetUrl) {
    return res.status(400).json({ error: "Google Sheet URL or Web App link is required." });
  }

  const result = await syncFromGoogleSource(targetUrl);
  if (result.success) {
    return res.json({
      success: true,
      message: result.message,
      servicesCount: result.count,
      sourceType: result.sourceType
    });
  } else {
    return res.status(400).json({
      error: result.message
    });
  }
});

// 7. CSV Template / Services Export for Google Sheets
app.get('/api/export-services-csv', (req, res) => {
  const escapeCsv = (val: any) => `"${String(val || '').replace(/"/g, '""')}"`;
  const headers = [
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
  ];

  const csvRows = [headers.join(',')];

  db.services.forEach(s => {
    csvRows.push([
      escapeCsv(s.service_id),
      escapeCsv(s.service_name_en),
      escapeCsv(s.service_name_hi),
      escapeCsv(s.category),
      escapeCsv(s.short_description_en),
      escapeCsv(s.short_description_hi),
      escapeCsv(s.full_description_en),
      escapeCsv(s.full_description_hi),
      escapeCsv((s.required_documents || []).join('; ')),
      escapeCsv(s.icon),
      escapeCsv(s.status),
      escapeCsv(s.popular ? 'yes' : 'no'),
      escapeCsv(s.estimated_time),
      escapeCsv(s.whatsapp_message)
    ].join(','));
  });

  res.setHeader('Content-Type', 'text/csv; charset=utf-8');
  res.setHeader('Content-Disposition', 'attachment; filename="balaji_services.csv"');
  res.send('\uFEFF' + csvRows.join('\r\n'));
});

// 8. Google Sheet Templates Directory API
app.get('/api/templates', (req, res) => {
  const summary = SHEET_TEMPLATES.map(t => ({
    id: t.id,
    title: t.title,
    hindiTitle: t.hindiTitle,
    description: t.description,
    fileName: t.fileName,
    sheetTabName: t.sheetTabName,
    badge: t.badge,
    columnsCount: t.headers.length,
    headers: t.headers,
    sampleRowsCount: t.sampleRows.length,
    downloadUrl: `/api/templates/${t.id}.csv`
  }));
  res.json({ success: true, templates: summary });
});

// 9. Download specific CSV Template for any importable entity
app.get('/api/templates/:id', (req, res) => {
  const cleanId = req.params.id.replace(/\.csv$/i, '').trim().toLowerCase();
  const template = SHEET_TEMPLATES.find(t => t.id.toLowerCase() === cleanId);

  if (!template) {
    return res.status(404).json({
      error: `Template '${cleanId}' not found. Available: ${SHEET_TEMPLATES.map(t => t.id).join(', ')}`
    });
  }

  const csvContent = generateCsvContent(template);
  res.setHeader('Content-Type', 'text/csv; charset=utf-8');
  res.setHeader('Content-Disposition', `attachment; filename="${template.fileName}"`);
  res.send(csvContent);
});

// 10. Direct CSV Import Endpoint for all templates
app.post('/api/import-csv', checkAdminAuth, (req, res) => {
  const { type, csvText } = req.body;
  if (!csvText || typeof csvText !== 'string' || !csvText.trim()) {
    return res.status(400).json({ error: "CSV data is required." });
  }

  const rows = parseCsvToObjects(csvText);
  if (rows.length === 0) {
    return res.status(400).json({ error: "No valid rows found in the CSV content." });
  }

  const cleanType = (type || 'services').toLowerCase().trim();

  if (cleanType === 'services') {
    const importedServices: Service[] = [];
    rows.forEach((r, idx) => {
      const s = mapRowToService(r, idx);
      if (s) importedServices.push(s);
    });

    if (importedServices.length === 0) {
      return res.status(400).json({ error: "Could not parse any valid services from CSV. Please check columns." });
    }

    const importedIds = new Set(importedServices.map(s => s.service_id));
    const retained = db.services.filter(s => !importedIds.has(s.service_id));
    db.services = [...importedServices, ...retained];
    saveDatabase(db);

    return res.json({
      success: true,
      count: importedServices.length,
      totalServices: db.services.length,
      message: `Successfully imported ${importedServices.length} services from CSV file! Total catalog now has ${db.services.length} services.`
    });
  }

  if (cleanType === 'enquiries') {
    let addedCount = 0;
    rows.forEach((r, idx) => {
      const name = r.customer_name || r.applicant_name || r.name || '';
      const mobile = r.mobile || r.phone || '';
      if (!name || !mobile) return;

      const newEnq: Enquiry = {
        enquiry_id: r.enquiry_id || `ENQ-IMP-${Date.now().toString(36).toUpperCase()}-${idx + 1}`,
        customer_name: name,
        applicant_name: r.applicant_name || name,
        father_or_husband_name: r.father_or_husband_name || r.father_name || '',
        mobile: mobile.replace(/\D/g, '').slice(-10),
        service_name: r.service_name || r.service || 'General Jan Seva Assistance',
        category: r.category || 'General',
        village: r.village || '',
        address: r.address || '',
        message: r.message || r.notes || 'Imported via CSV',
        preferred_contact: (r.preferred_contact && r.preferred_contact.toLowerCase().includes('whatsapp')) ? 'WhatsApp' : 'Call',
        urgency: r.urgency || 'Normal',
        status: (['New', 'Contacted', 'Processing', 'Completed', 'Cancelled'].includes(r.status) ? r.status : 'New') as any,
        created_at: r.created_at || new Date().toISOString()
      };
      db.enquiries.unshift(newEnq);
      addedCount++;
    });

    if (addedCount === 0) {
      return res.status(400).json({ error: "Could not parse any valid enquiries. 'customer_name' and 'mobile' columns are required." });
    }

    saveDatabase(db);
    return res.json({
      success: true,
      count: addedCount,
      totalEnquiries: db.enquiries.length,
      message: `Successfully imported ${addedCount} citizen applications/enquiries from CSV file!`
    });
  }

  if (cleanType === 'pricelist') {
    const list: PriceListItem[] = rows.map((r, idx) => ({
      price_id: r.price_id || `PRC-${idx + 1}`,
      service_name: r.service_name || r.name || '',
      category: r.category || 'General',
      government_fee: r.government_fee || r.govt_fee || '₹0',
      csc_service_fee: r.csc_service_fee || r.csc_fee || '₹0',
      total_fee: r.total_fee || r.fee || '₹0',
      processing_time: r.processing_time || r.time || '1-3 Days',
      eligibility_or_note: r.eligibility_or_note || r.notes || '',
      status: r.status || 'Active'
    })).filter(p => p.service_name);

    db.priceList = list;
    saveDatabase(db);

    return res.json({
      success: true,
      count: list.length,
      message: `Successfully imported ${list.length} CSC price list items!`
    });
  }

  if (cleanType === 'notices') {
    const list: NoticeItem[] = rows.map((r, idx) => ({
      notice_id: r.notice_id || `NTC-${idx + 1}`,
      title_en: r.title_en || r.title || '',
      title_hi: r.title_hi || r.title_en || '',
      description_en: r.description_en || r.description || '',
      description_hi: r.description_hi || r.description_en || '',
      category: r.category || 'General',
      badge_type: (['Urgent', 'New', 'Important', 'General'].includes(r.badge_type) ? r.badge_type : 'Important') as any,
      last_date: r.last_date || '',
      action_link: r.action_link || '',
      status: (r.status === 'Archived' ? 'Archived' : 'Active') as any,
      created_at: r.created_at || new Date().toISOString()
    })).filter(n => n.title_en || n.title_hi);

    db.notices = list;
    saveDatabase(db);

    return res.json({
      success: true,
      count: list.length,
      message: `Successfully imported ${list.length} announcements & notices!`
    });
  }

  if (cleanType === 'quicklinks') {
    const list: QuickLinkItem[] = rows.map((r, idx) => ({
      link_id: r.link_id || `LNK-${idx + 1}`,
      portal_name: r.portal_name || r.name || '',
      department: r.department || '',
      category: r.category || 'General',
      portal_url: r.portal_url || r.url || '',
      description: r.description || '',
      portal_login_type: r.portal_login_type || '',
      required_credentials: r.required_credentials || ''
    })).filter(l => l.portal_name && l.portal_url);

    db.quickLinks = list;
    saveDatabase(db);

    return res.json({
      success: true,
      count: list.length,
      message: `Successfully imported ${list.length} government portal quick links!`
    });
  }

  if (cleanType === 'citizens') {
    const list: CitizenRecord[] = rows.map((r, idx) => ({
      citizen_id: r.citizen_id || `CIT-${idx + 1}`,
      full_name: r.full_name || r.name || '',
      father_name: r.father_name || '',
      mobile: (r.mobile || '').replace(/\D/g, '').slice(-10),
      aadhaar_last4: r.aadhaar_last4 || '',
      village: r.village || '',
      address: r.address || '',
      services_availed: r.services_availed || '',
      notes: r.notes || '',
      status: (r.status || 'Active') as any,
      created_at: r.created_at || new Date().toISOString()
    })).filter(c => c.full_name);

    db.citizens = list;
    saveDatabase(db);

    return res.json({
      success: true,
      count: list.length,
      message: `Successfully imported ${list.length} citizen customer records!`
    });
  }

  return res.status(400).json({
    error: `Unknown import type: '${type}'. Supported types: services, enquiries, pricelist, notices, quicklinks, citizens`
  });
});

// ================= VITE MIDDLEWARE / STATIC ASSETS =================
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use('/vikki', express.static(distPath));
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Balaji Communication Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
