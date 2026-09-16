import express from 'express';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';
import { INITIAL_SERVICES, INITIAL_SETTINGS, CATEGORIES } from './src/data/initialData';
import { Service, Enquiry, WebsiteSettings } from './src/types';

const app = express();
const PORT = 3000;

app.use(express.json());

// Database file path for local persistence
const DATA_DIR = path.join(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'db.json');

interface DatabaseSchema {
  services: Service[];
  enquiries: Enquiry[];
  settings: WebsiteSettings;
  adminCredentials: {
    email: string;
    passwordHash: string; // simulated hash
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
      return JSON.parse(raw);
    }
  } catch (err) {
    console.error('Error reading db.json, falling back to defaults:', err);
  }

  // Initial seed
  const initialDb: DatabaseSchema = {
    services: INITIAL_SERVICES,
    enquiries: [
      {
        enquiry_id: "enq-101",
        customer_name: "Ramesh Sharma",
        mobile: "9812345670",
        service_id: "srv-aadhaar-mob",
        service_name: "Aadhaar Mobile Number Update",
        message: "Need urgent update for bank loan verification.",
        preferred_contact: "WhatsApp",
        status: "New",
        created_at: new Date(Date.now() - 3600000 * 4).toISOString()
      },
      {
        enquiry_id: "enq-102",
        customer_name: "Sunita Devi",
        mobile: "9876501234",
        service_id: "srv-ayushman-card",
        service_name: "Ayushman Card Apply & Download",
        message: "Have ration card, want to check if all family members qualify.",
        preferred_contact: "Call",
        status: "Contacted",
        created_at: new Date(Date.now() - 3600000 * 26).toISOString()
      },
      {
        enquiry_id: "enq-103",
        customer_name: "Amit Kumar",
        mobile: "9988776655",
        service_id: "srv-pmkisan-kyc",
        service_name: "PM Kisan e-KYC & Status Check",
        message: "16th installment not received, need eKYC biometric.",
        preferred_contact: "WhatsApp",
        status: "Processing",
        created_at: new Date(Date.now() - 3600000 * 48).toISOString()
      }
    ],
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

function saveDatabase(db: DatabaseSchema) {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2));
  } catch (err) {
    console.error('Error saving db.json:', err);
  }
}

// In-memory reference that stays in sync
let db = loadDatabase();

// Authentication middleware helper
const ADMIN_TOKEN = "balaji_secure_admin_session_token_2026";

function checkAdminAuth(req: express.Request, res: express.Response, next: express.NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.includes(ADMIN_TOKEN)) {
    return res.status(401).json({ error: "Unauthorized access. Please login as admin." });
  }
  next();
}

// ================= API ROUTES =================

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'Balaji Communication API' });
});

// 1. Services
app.get('/api/services', (req, res) => {
  const auth = req.headers.authorization;
  const isAdmin = auth && auth.includes(ADMIN_TOKEN);
  
  // Public users only see Active services
  const services = isAdmin 
    ? db.services 
    : db.services.filter(s => s.status === 'Active');

  res.json({ success: true, services });
});

app.get('/api/services/:id', (req, res) => {
  const service = db.services.find(s => s.service_id === req.params.id);
  if (!service) {
    return res.status(404).json({ error: "Service not found" });
  }
  res.json({ success: true, service });
});

app.post('/api/services', checkAdminAuth, (req, res) => {
  const body = req.body;
  if (!body.service_name_en || !body.category) {
    return res.status(400).json({ error: "Service name and category are required" });
  }

  const newService: Service = {
    service_id: body.service_id || `srv-${Date.now().toString(36)}`,
    service_name_en: body.service_name_en,
    service_name_hi: body.service_name_hi || body.service_name_en,
    category: body.category,
    short_description_en: body.short_description_en || "",
    short_description_hi: body.short_description_hi || "",
    full_description_en: body.full_description_en || "",
    full_description_hi: body.full_description_hi || "",
    required_documents: Array.isArray(body.required_documents) 
      ? body.required_documents 
      : (typeof body.required_documents === 'string' ? body.required_documents.split('\n').filter(Boolean) : []),
    icon: body.icon || 'FileText',
    status: body.status || 'Active',
    popular: Boolean(body.popular),
    estimated_time: body.estimated_time || 'Varies by authority',
    whatsapp_message: body.whatsapp_message || `Hello Balaji Communication, I want information about ${body.service_name_en}.`,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };

  db.services.unshift(newService);
  saveDatabase(db);

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

// 4. Enquiries
app.post('/api/enquiries', (req, res) => {
  const { customer_name, mobile, service_id, service_name, message, preferred_contact } = req.body;

  if (!customer_name || !mobile) {
    return res.status(400).json({ error: "Customer name and mobile number are required." });
  }

  // Basic validation: 10-digit phone
  const cleanMobile = String(mobile).replace(/\D/g, '');
  if (cleanMobile.length < 10) {
    return res.status(400).json({ error: "Please enter a valid 10-digit mobile number." });
  }

  // Security Check: forbid sensitive strings (Aadhaar number patterns, passwords, PINs)
  const content = `${customer_name} ${message || ''}`.toLowerCase();
  if (content.includes('otp') || content.includes('password') || content.includes('upi pin') || content.includes('cvv')) {
    return res.status(400).json({ error: "Please do NOT enter OTP, bank passwords, or PINs on this form." });
  }

  const newEnquiry: Enquiry = {
    enquiry_id: `enq-${Date.now().toString(36)}`,
    customer_name: customer_name.trim(),
    mobile: cleanMobile,
    service_id: service_id || '',
    service_name: service_name || 'General Inquiry',
    message: message ? message.trim() : '',
    preferred_contact: preferred_contact === 'WhatsApp' ? 'WhatsApp' : 'Call',
    status: 'New',
    created_at: new Date().toISOString()
  };

  db.enquiries.unshift(newEnquiry);
  saveDatabase(db);

  // If Google Apps Script Web App URL is configured, asynchronously send to Google Sheets
  if (db.settings.google_sheet_webapp_url) {
    try {
      fetch(db.settings.google_sheet_webapp_url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'createEnquiry',
          data: newEnquiry
        })
      }).catch(err => console.error('Failed forwarding enquiry to Google Sheets:', err));
    } catch (err) {
      console.error('Error forwarding to Google Sheet:', err);
    }
  }

  res.json({
    success: true,
    message: "Thank you. Balaji Communication will contact you shortly.",
    enquiry_id: newEnquiry.enquiry_id
  });
});

app.get('/api/enquiries', checkAdminAuth, (req, res) => {
  res.json({ success: true, enquiries: db.enquiries });
});

app.patch('/api/enquiries/:id/status', checkAdminAuth, (req, res) => {
  const { status } = req.body;
  const enquiry = db.enquiries.find(e => e.enquiry_id === req.params.id);
  if (!enquiry) {
    return res.status(404).json({ error: "Enquiry not found" });
  }

  const validStatuses = ['New', 'Contacted', 'Processing', 'Completed', 'Cancelled'];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ error: "Invalid status value" });
  }

  enquiry.status = status;
  saveDatabase(db);

  res.json({ success: true, enquiry });
});

app.delete('/api/enquiries/:id', checkAdminAuth, (req, res) => {
  const prevLen = db.enquiries.length;
  db.enquiries = db.enquiries.filter(e => e.enquiry_id !== req.params.id);
  if (db.enquiries.length === prevLen) {
    return res.status(404).json({ error: "Enquiry not found" });
  }
  saveDatabase(db);
  res.json({ success: true, message: "Enquiry deleted" });
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
  const { webapp_url } = req.body;
  const targetUrl = webapp_url || db.settings.google_sheet_webapp_url;

  if (!targetUrl) {
    return res.status(400).json({ error: "Google Apps Script Web App URL is not provided or configured." });
  }

  try {
    // Test fetching from Google Apps Script Web App
    const response = await fetch(`${targetUrl}?action=getServices`);
    const data = await response.json();

    if (data && data.status === 'success' && Array.isArray(data.data) && data.data.length > 0) {
      // Merge or update local services
      const sheetServices: Service[] = data.data;
      db.services = sheetServices;
      saveDatabase(db);
      return res.json({
        success: true,
        message: `Successfully synced ${sheetServices.length} services from Google Sheets!`,
        servicesCount: sheetServices.length
      });
    } else {
      return res.json({
        success: true,
        message: "Connected to Google Sheet Web App, but no rows were returned or sheet is empty. Initial local database preserved.",
        raw: data
      });
    }
  } catch (err: any) {
    console.error('Google Sheets sync error:', err);
    return res.status(502).json({
      error: `Could not connect to Google Apps Script Web App: ${err.message || 'Check URL and access permissions (Must be deployed to Anyone).'}`
    });
  }
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
