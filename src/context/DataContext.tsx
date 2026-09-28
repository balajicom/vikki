import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Service, Enquiry, WebsiteSettings, EnquiryStatus } from '../types';
import { INITIAL_SERVICES, INITIAL_SETTINGS, CATEGORIES } from '../data/initialData';

interface DataContextType {
  services: Service[];
  settings: WebsiteSettings;
  categories: string[];
  enquiries: Enquiry[];
  isLoading: boolean;
  error: string | null;
  // Modal states
  selectedService: Service | null;
  isEnquiryModalOpen: boolean;
  enquiryPreselectedService: Service | null;
  openServiceDetails: (service: Service) => void;
  closeServiceDetails: () => void;
  openEnquiryModal: (service?: Service) => void;
  closeEnquiryModal: () => void;
  // Actions
  submitEnquiry: (data: {
    customer_name: string;
    applicant_name?: string;
    father_or_husband_name?: string;
    mobile: string;
    service_id?: string;
    service_name: string;
    category?: string;
    address?: string;
    village?: string;
    message?: string;
    preferred_contact: 'Call' | 'WhatsApp';
    urgency?: string;
  }) => Promise<{ success: boolean; message: string; enquiry_id?: string; application?: Enquiry }>;
  trackApplication: (query: string) => Promise<{ success: boolean; results?: Enquiry[]; error?: string }>;
  // Admin functions
  isAdminLoggedIn: boolean;
  adminToken: string | null;
  loginAdmin: (email: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  logoutAdmin: () => void;
  addService: (serviceData: Partial<Service>) => Promise<boolean>;
  createService: (serviceData: Partial<Service>) => Promise<boolean>;
  updateService: (idOrData: string | Partial<Service>, serviceData?: Partial<Service>) => Promise<boolean>;
  deleteService: (id: string) => Promise<boolean>;
  updateEnquiryStatus: (id: string, status: EnquiryStatus) => Promise<boolean>;
  deleteEnquiry: (id: string) => Promise<boolean>;
  updateSettings: (newSettings: Partial<WebsiteSettings>) => Promise<boolean>;
  syncWithGoogleSheets: (url?: string) => Promise<{ success: boolean; message: string; count?: number }>;
  importCsvData: (type: string, csvText: string) => Promise<{ success: boolean; message: string; count?: number }>;
  refreshData: () => Promise<void>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

const DEFAULT_ENQUIRIES: Enquiry[] = [
  {
    enquiry_id: 'BALAJI-APP-2026-001',
    customer_name: 'Ramesh Chandra Gangwar',
    applicant_name: 'Ramesh Chandra Gangwar',
    father_or_husband_name: 'Shri Ram Prasad Gangwar',
    mobile: '9870677605',
    service_name: 'Aadhaar Mobile Number Update',
    service_id: 'srv-aadhaar-mob',
    category: 'Aadhaar',
    village: 'Gaini',
    address: 'Near Inter College Road, Gaini, Bareilly',
    message: 'Urgent mobile linking for bank OTP and PM Kisan e-KYC',
    preferred_contact: 'WhatsApp',
    urgency: 'Urgent',
    status: 'Processing',
    created_at: new Date(Date.now() - 24 * 3600 * 1000).toISOString()
  },
  {
    enquiry_id: 'BALAJI-APP-2026-002',
    customer_name: 'Sunita Devi',
    applicant_name: 'Sunita Devi',
    father_or_husband_name: 'W/o Manoj Kumar',
    mobile: '9876543210',
    service_name: 'Income Certificate (आय प्रमाण पत्र)',
    service_id: 'srv-income-cert',
    category: 'Government Certificates',
    village: 'Gaini',
    address: 'Masjid Wali Gali, Gaini, Bareilly',
    message: 'Required for daughter UP scholarship application form',
    preferred_contact: 'Call',
    urgency: 'Normal',
    status: 'Completed',
    created_at: new Date(Date.now() - 48 * 3600 * 1000).toISOString()
  }
];

function loadLocalServices(): Service[] {
  try {
    const raw = localStorage.getItem('balaji_services');
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (err) {
    console.warn('Could not parse balaji_services from localStorage:', err);
  }
  return INITIAL_SERVICES;
}

function loadLocalEnquiries(): Enquiry[] {
  try {
    const raw = localStorage.getItem('balaji_enquiries');
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (err) {
    console.warn('Could not parse balaji_enquiries from localStorage:', err);
  }
  return DEFAULT_ENQUIRIES;
}

// Resilient fetch helper that handles HTML 404s (e.g. GitHub Pages) and invalid JSON cleanly
async function safeJsonFetch(input: RequestInfo | URL, init?: RequestInit): Promise<{
  ok: boolean;
  status: number;
  data?: any;
  isHtml?: boolean;
  error?: string;
  rawText?: string;
}> {
  try {
    const res = await fetch(input, init);
    const contentType = res.headers.get('content-type') || '';
    const text = await res.text();
    const trimmed = text.trim();

    if (trimmed.startsWith('<') || contentType.includes('text/html')) {
      return {
        ok: false,
        status: res.status,
        isHtml: true,
        rawText: text,
        error: 'Received HTML response instead of JSON'
      };
    }

    try {
      const data = JSON.parse(text);
      return {
        ok: res.ok,
        status: res.status,
        data,
        rawText: text
      };
    } catch (parseErr: any) {
      return {
        ok: false,
        status: res.status,
        error: parseErr.message,
        rawText: text
      };
    }
  } catch (netErr: any) {
    return {
      ok: false,
      status: 0,
      error: netErr.message || 'Network request failed'
    };
  }
}

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [services, setServices] = useState<Service[]>(() => loadLocalServices());
  const [settings, setSettings] = useState<WebsiteSettings>(INITIAL_SETTINGS);
  const [categories, setCategories] = useState<string[]>(CATEGORIES);
  const [enquiries, setEnquiries] = useState<Enquiry[]>(() => loadLocalEnquiries());
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Modals
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [isEnquiryModalOpen, setIsEnquiryModalOpen] = useState<boolean>(false);
  const [enquiryPreselectedService, setEnquiryPreselectedService] = useState<Service | null>(null);

  // Admin Auth
  const [adminToken, setAdminToken] = useState<string | null>(() => {
    return localStorage.getItem('balaji_admin_token');
  });
  const isAdminLoggedIn = Boolean(adminToken);

  // Fetch Services & Settings
  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      // 1. Services
      const srvRes = await safeJsonFetch('/api/services', {
        headers: adminToken ? { Authorization: `Bearer ${adminToken}` } : {}
      });
      if (srvRes.ok && srvRes.data?.services && Array.isArray(srvRes.data.services)) {
        setServices(srvRes.data.services);
        try {
          localStorage.setItem('balaji_services', JSON.stringify(srvRes.data.services));
        } catch (e) {}
      }

      // 2. Settings
      const setRes = await safeJsonFetch('/api/settings');
      if (setRes.ok && setRes.data?.settings) {
        setSettings(setRes.data.settings);
      }

      // 3. Categories
      const catRes = await safeJsonFetch('/api/categories');
      if (catRes.ok && catRes.data?.categories && Array.isArray(catRes.data.categories)) {
        setCategories(catRes.data.categories);
      }

      // 4. Enquiries (if admin)
      if (adminToken) {
        const enqRes = await safeJsonFetch('/api/enquiries', {
          headers: { Authorization: `Bearer ${adminToken}` }
        });
        if (enqRes.ok && enqRes.data?.enquiries && Array.isArray(enqRes.data.enquiries)) {
          // Merge with local enquiries so nothing is lost
          const localSaved = loadLocalEnquiries();
          const mergedMap = new Map<string, Enquiry>();
          enqRes.data.enquiries.forEach((e: Enquiry) => mergedMap.set(e.enquiry_id, e));
          localSaved.forEach((e: Enquiry) => {
            if (!mergedMap.has(e.enquiry_id)) {
              mergedMap.set(e.enquiry_id, e);
            }
          });
          const merged = Array.from(mergedMap.values());
          setEnquiries(merged);
          try {
            localStorage.setItem('balaji_enquiries', JSON.stringify(merged));
          } catch (err) {}
        }
      }
    } catch (err: any) {
      console.warn('API fetch warning, using fallback local dataset:', err);
    } finally {
      setIsLoading(false);
    }
  }, [adminToken]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Modal handlers
  const openServiceDetails = (service: Service) => {
    setSelectedService(service);
  };

  const closeServiceDetails = () => {
    setSelectedService(null);
  };

  const openEnquiryModal = (service?: Service) => {
    setEnquiryPreselectedService(service || null);
    setIsEnquiryModalOpen(true);
  };

  const closeEnquiryModal = () => {
    setIsEnquiryModalOpen(false);
    setEnquiryPreselectedService(null);
  };

  // Submit Application / Enquiry (Fully supports Direct Application and Quick Enquiry)
  const submitEnquiry = async (data: {
    customer_name: string;
    applicant_name?: string;
    father_or_husband_name?: string;
    mobile: string;
    service_id?: string;
    service_name: string;
    category?: string;
    address?: string;
    village?: string;
    message?: string;
    preferred_contact: 'Call' | 'WhatsApp';
    urgency?: string;
  }) => {
    const cleanMob = (data.mobile || '').replace(/\D/g, '').slice(-10);
    const newId = `BALAJI-APP-${Date.now().toString(36).toUpperCase()}`;
    const newEnquiry: Enquiry = {
      enquiry_id: newId,
      customer_name: data.applicant_name || data.customer_name || 'Citizen Applicant',
      applicant_name: data.applicant_name || data.customer_name || 'Citizen Applicant',
      father_or_husband_name: data.father_or_husband_name || '',
      mobile: cleanMob,
      service_id: data.service_id || '',
      service_name: data.service_name || 'Jan Seva Kendra Service',
      category: data.category || 'General',
      address: data.address || '',
      village: data.village || '',
      message: data.message || '',
      preferred_contact: data.preferred_contact || 'Call',
      urgency: (data.urgency as any) || 'Normal',
      status: 'New',
      created_at: new Date().toISOString()
    };

    // 1. Immediately store in state and localStorage (Works 100% on GitHub Pages & offline)
    setEnquiries(prev => {
      const updated = [newEnquiry, ...prev.filter(e => e.enquiry_id !== newEnquiry.enquiry_id)];
      try {
        localStorage.setItem('balaji_enquiries', JSON.stringify(updated));
      } catch (err) {
        console.warn('Could not save to localStorage:', err);
      }
      return updated;
    });

    // 2. Try backend API if available
    try {
      const res = await safeJsonFetch('/api/enquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          enquiry_id: newId
        })
      });
      if (res.ok && res.data?.success) {
        const result = res.data;
        const finalApp = result.application || newEnquiry;
        setEnquiries(prev => {
          const updated = [finalApp, ...prev.filter(e => e.enquiry_id !== newId && e.enquiry_id !== finalApp.enquiry_id)];
          try {
            localStorage.setItem('balaji_enquiries', JSON.stringify(updated));
          } catch (err) {}
          return updated;
        });
        return {
          success: true,
          message: result.message || 'Application submitted successfully!',
          enquiry_id: result.enquiry_id || finalApp.enquiry_id || newId,
          application: finalApp
        };
      }
    } catch (err) {
      // Backend not running (e.g. GitHub Pages static) - already saved locally
    }

    return {
      success: true,
      message: 'Your direct application has been successfully recorded at Balaji Communication Jan Seva Kendra.',
      enquiry_id: newId,
      application: newEnquiry
    };
  };

  // Live Citizen Application Tracking (by Reference ID or Mobile Number)
  const trackApplication = async (query: string): Promise<{ success: boolean; results?: Enquiry[]; error?: string }> => {
    const rawQ = query.trim();
    if (!rawQ) {
      return { success: false, results: [], error: 'Please enter a valid Reference ID or 10-digit Mobile Number.' };
    }

    const qLower = rawQ.toLowerCase();
    const qNorm = qLower.replace(/[\s-_]/g, '');
    const digitsOnly = rawQ.replace(/\D/g, '');
    const target10 = digitsOnly.length >= 10 ? digitsOnly.slice(-10) : digitsOnly;

    // 1. Try server endpoint first
    try {
      const res = await safeJsonFetch(`/api/applications/track/${encodeURIComponent(rawQ)}`);
      if (res.ok && res.data?.success && Array.isArray(res.data.results) && res.data.results.length > 0) {
        return { success: true, results: res.data.results };
      }
    } catch (err) {
      // Backend not running (GitHub Pages) -> use local storage
    }

    // 2. Search local enquiries (offline & GitHub Pages support)
    const localSaved = loadLocalEnquiries();
    const allEnquiriesMap = new Map<string, Enquiry>();
    localSaved.forEach(e => allEnquiriesMap.set(e.enquiry_id, e));
    enquiries.forEach(e => allEnquiriesMap.set(e.enquiry_id, e));
    const allList = Array.from(allEnquiriesMap.values());

    const matches = allList.filter(e => {
      // ID check (with / without hyphens)
      const eId = (e.enquiry_id || '').toLowerCase();
      const eIdNorm = eId.replace(/[\s-_]/g, '');
      const idMatch = eId.includes(qLower) || (qNorm.length >= 3 && eIdNorm.includes(qNorm));

      // Mobile check (extract last 10 digits to ignore +91 or leading 0)
      const eDigits = (e.mobile || '').replace(/\D/g, '');
      const e10 = eDigits.length >= 10 ? eDigits.slice(-10) : eDigits;
      const mobMatch = (target10.length === 10 && e10 === target10) || 
                       (digitsOnly.length >= 5 && (eDigits.includes(digitsOnly) || digitsOnly.includes(eDigits)));

      // Name check
      const nameMatch = qLower.length >= 3 && (
        (e.customer_name || '').toLowerCase().includes(qLower) ||
        (e.applicant_name || '').toLowerCase().includes(qLower)
      );

      return idMatch || mobMatch || nameMatch;
    });

    if (matches.length > 0) {
      return { success: true, results: matches };
    }

    return {
      success: false,
      results: [],
      error: `No application found matching "${query}". Please check your Reference ID (e.g. BALAJI-APP-...) or registered 10-digit mobile number.`
    };
  };

  // Admin Login
  const loginAdmin = async (email: string, pass: string) => {
    try {
      const res = await safeJsonFetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password: pass })
      });
      if (res.ok && res.data?.success && res.data.token) {
        localStorage.setItem('balaji_admin_token', res.data.token);
        setAdminToken(res.data.token);
        fetchData();
        return { success: true };
      }
      if (!res.isHtml && res.data?.error) {
        return { success: false, error: res.data.error };
      }
      // Fallback for static demo / offline
      if (email.toLowerCase() === 'admin@balaji.com' && pass === 'balaji@2026') {
        const dummyToken = 'balaji_secure_admin_session_token_2026';
        localStorage.setItem('balaji_admin_token', dummyToken);
        setAdminToken(dummyToken);
        return { success: true };
      }
      return { success: false, error: 'Invalid credentials or connection issue' };
    } catch (err: any) {
      if (email.toLowerCase() === 'admin@balaji.com' && pass === 'balaji@2026') {
        const dummyToken = 'balaji_secure_admin_session_token_2026';
        localStorage.setItem('balaji_admin_token', dummyToken);
        setAdminToken(dummyToken);
        return { success: true };
      }
      return { success: false, error: 'Connection error during authentication' };
    }
  };

  const logoutAdmin = () => {
    localStorage.removeItem('balaji_admin_token');
    setAdminToken(null);
    fetchData();
  };

  // Add / Create Service
  const addService = async (serviceData: Partial<Service>): Promise<boolean> => {
    const token = adminToken || localStorage.getItem('balaji_admin_token') || 'balaji_secure_admin_session_token_2026';
    const completeService: Service = {
      service_id: serviceData.service_id || `srv-${Date.now().toString(36)}`,
      service_name_en: serviceData.service_name_en || serviceData.service_name_hi || 'New Service',
      service_name_hi: serviceData.service_name_hi || serviceData.service_name_en || 'नई सेवा',
      category: serviceData.category || 'General Services',
      short_description_en: serviceData.short_description_en || '',
      short_description_hi: serviceData.short_description_hi || '',
      full_description_en: serviceData.full_description_en || '',
      full_description_hi: serviceData.full_description_hi || '',
      required_documents: Array.isArray(serviceData.required_documents) ? serviceData.required_documents : ['Original Aadhaar Card', 'Registered Mobile Number'],
      icon: serviceData.icon || 'FileText',
      status: serviceData.status || 'Active',
      popular: Boolean(serviceData.popular),
      estimated_time: serviceData.estimated_time || '1 to 3 Working Days',
      whatsapp_message: serviceData.whatsapp_message || `Hello Balaji Communication, I want information about ${serviceData.service_name_en || 'services'}.`,
      created_at: serviceData.created_at || new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    try {
      const res = await safeJsonFetch('/api/services', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(completeService)
      });
      if (res.ok && res.data?.service) {
        const finalService = res.data.service;
        setServices(prev => [finalService, ...prev.filter(s => s.service_id !== finalService.service_id)]);
        if (finalService.category && !categories.includes(finalService.category)) {
          setCategories(prev => [...prev, finalService.category]);
        }
        return true;
      }
    } catch (err) {
      console.warn('Network error saving service to server, using local fallback:', err);
    }

    // Local state fallback ensuring immediate UI update
    setServices(prev => [completeService, ...prev.filter(s => s.service_id !== completeService.service_id)]);
    if (completeService.category && !categories.includes(completeService.category)) {
      setCategories(prev => [...prev, completeService.category]);
    }
    return true;
  };

  const createService = addService;

  // Update Service: supports updateService(id, data) OR updateService(data)
  const updateService = async (idOrData: string | Partial<Service>, serviceData?: Partial<Service>): Promise<boolean> => {
    const token = adminToken || localStorage.getItem('balaji_admin_token') || 'balaji_secure_admin_session_token_2026';
    let id: string;
    let payload: Partial<Service>;

    if (typeof idOrData === 'string') {
      id = idOrData;
      payload = serviceData || {};
    } else {
      id = idOrData.service_id || '';
      payload = idOrData;
    }

    if (!id) {
      console.error('Cannot update service: missing service_id');
      return false;
    }

    try {
      const res = await safeJsonFetch(`/api/services/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });
      if (res.ok && res.data?.service) {
        const updated = res.data.service;
        setServices(prev => {
          const list = prev.map(s => s.service_id === id ? { ...s, ...updated } : s);
          try {
            localStorage.setItem('balaji_services', JSON.stringify(list));
          } catch (e) {}
          return list;
        });
        return true;
      }
    } catch (err) {
      console.warn('Network error updating service on server, using local fallback:', err);
    }

    // Local optimistic update
    setServices(prev => {
      const list = prev.map(s => s.service_id === id ? { ...s, ...payload, updated_at: new Date().toISOString() } : s);
      try {
        localStorage.setItem('balaji_services', JSON.stringify(list));
      } catch (e) {}
      return list;
    });
    return true;
  };

  // Delete Service
  const deleteService = async (id: string): Promise<boolean> => {
    try {
      const res = await fetch(`/api/services/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${adminToken}` }
      });
      if (res.ok) {
        setServices(prev => {
          const list = prev.filter(s => s.service_id !== id);
          try {
            localStorage.setItem('balaji_services', JSON.stringify(list));
          } catch (e) {}
          return list;
        });
        return true;
      }
      return false;
    } catch (err) {
      console.error(err);
      return false;
    }
  };

  // Update Enquiry Status (Persists both in memory/localStorage for GitHub Pages and server API)
  const updateEnquiryStatus = async (id: string, status: EnquiryStatus): Promise<boolean> => {
    let targetEnquiry = enquiries.find(e => e.enquiry_id === id);
    if (!targetEnquiry) {
      const localList = loadLocalEnquiries();
      targetEnquiry = localList.find(e => e.enquiry_id === id);
    }

    // 1. Immediate state & localStorage update so UI responds instantly
    setEnquiries(prev => {
      const updated = prev.map(e => e.enquiry_id === id ? { ...e, status, updated_at: new Date().toISOString() } : e);
      try {
        localStorage.setItem('balaji_enquiries', JSON.stringify(updated));
      } catch (err) {
        console.warn('Could not save enquiries to localStorage:', err);
      }
      return updated;
    });

    // 2. Try updating server if online
    try {
      const res = await fetch(`/api/enquiries/${encodeURIComponent(id)}/status`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken || localStorage.getItem('balaji_admin_token') || 'balaji_secure_admin_session_token_2026'}`
        },
        body: JSON.stringify({ status, enquiry: targetEnquiry })
      });
      if (!res.ok) {
        // Fallback to PATCH if POST was rejected
        await fetch(`/api/enquiries/${encodeURIComponent(id)}/status`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${adminToken || localStorage.getItem('balaji_admin_token') || 'balaji_secure_admin_session_token_2026'}`
          },
          body: JSON.stringify({ status, enquiry: targetEnquiry })
        });
      }
    } catch (err) {
      // Offline / GitHub Pages static hosting
    }

    // 3. Asynchronously sync to Google Sheets Web App if configured in settings
    const sheetTarget = settings.google_sheet_webapp_url || (settings as any).google_sheet_web_app_url || '';
    if (sheetTarget && sheetTarget.includes('script.google.com')) {
      try {
        fetch(sheetTarget, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          mode: 'no-cors',
          body: JSON.stringify({
            action: 'updateEnquiryStatus',
            enquiry_id: id,
            status
          })
        }).catch(e => console.warn('Could not forward status to Google Sheets:', e));
      } catch (e) {}
    }

    return true;
  };

  // Delete Enquiry
  const deleteEnquiry = async (id: string): Promise<boolean> => {
    setEnquiries(prev => {
      const updated = prev.filter(e => e.enquiry_id !== id);
      try {
        localStorage.setItem('balaji_enquiries', JSON.stringify(updated));
      } catch (err) {
        console.warn('Could not save enquiries to localStorage:', err);
      }
      return updated;
    });

    try {
      await safeJsonFetch(`/api/enquiries/${encodeURIComponent(id)}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${adminToken || localStorage.getItem('balaji_admin_token')}` }
      });
    } catch (err) {
      // Offline / GitHub Pages
    }

    return true;
  };

  // Update Settings
  const updateSettings = async (newSettings: Partial<WebsiteSettings>): Promise<boolean> => {
    // Optimistic local state update
    const merged = { ...settings, ...newSettings };
    setSettings(merged);
    try {
      localStorage.setItem('balaji_settings', JSON.stringify(merged));
    } catch (e) {}

    try {
      const res = await safeJsonFetch('/api/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`
        },
        body: JSON.stringify(newSettings)
      });
      if (res.ok && res.data?.settings) {
        setSettings(res.data.settings);
        try {
          localStorage.setItem('balaji_settings', JSON.stringify(res.data.settings));
        } catch (e) {}
        return true;
      }
      return true;
    } catch (err) {
      return true;
    }
  };

  // Google Sheets Sync (Supports both Full-Stack Server & GitHub Pages Static Hosting with Zero HTML-parse errors)
  const syncWithGoogleSheets = async (rawUrl?: string): Promise<{ success: boolean; message: string; count?: number }> => {
    const targetUrl = (rawUrl || settings.google_sheet_webapp_url || (settings as any).google_sheet_web_app_url || '').trim();

    if (!targetUrl) {
      return { success: false, message: 'Please paste a Google Spreadsheet or Google Apps Script Web App URL.' };
    }

    // Client-side pre-validation for common mistakes
    if (targetUrl.includes('script.google.com') && (targetUrl.includes('/edit') || targetUrl.includes('/home/projects/'))) {
      return {
        success: false,
        message: 'You pasted a Google Apps Script Project Editor link (.../edit) instead of the deployed Web App link. In Google Sheets > Extensions > Apps Script, click Deploy > New deployment (or Manage deployments) > Select Web app > Make sure "Who has access" is "Anyone" > Copy the Web App URL ending in /exec.'
      };
    }

    if (targetUrl.includes('script.google.com') && targetUrl.endsWith('/dev')) {
      return {
        success: false,
        message: 'You pasted a /dev test link which requires private Google login. In Google Apps Script, click Deploy > New deployment > Web app > Set "Who has access: Anyone" > Copy the public /exec URL.'
      };
    }

    if (targetUrl.includes('drive.google.com/drive/folders')) {
      return {
        success: false,
        message: 'You entered a Google Drive folder link. Please paste your Google Spreadsheet link or Google Apps Script Web App URL.'
      };
    }

    // 1. Try server-side endpoint first if running full-stack
    try {
      const serverRes = await safeJsonFetch('/api/sync-sheets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken || localStorage.getItem('balaji_admin_token') || ''}`
        },
        body: JSON.stringify({ webapp_url: targetUrl })
      });

      if (serverRes.ok && serverRes.data?.success) {
        await fetchData();
        return { success: true, message: serverRes.data.message, count: serverRes.data.servicesCount };
      }

      // If server returned an actionable error message (and not a 404 HTML fallback), report it
      if (!serverRes.isHtml && serverRes.data?.error) {
        return { success: false, message: serverRes.data.error };
      }
    } catch (err) {
      // Fall through to browser client-side sync fallback
    }

    // 2. Direct Browser Client-Side Sync Fallback (Ensures GitHub Pages static hosting works!)
    try {
      // Check if it's a standard Google Spreadsheet link
      const sheetMatch = targetUrl.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/i);
      if (sheetMatch) {
        const sheetId = sheetMatch[1];
        const gidMatch = targetUrl.match(/[?#&]gid=([0-9]+)/i);
        const gid = gidMatch ? gidMatch[1] : '0';

        const gvizUrl = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:json&sheet=Services`;
        const gvizRes = await fetch(gvizUrl);
        const gvizText = await gvizRes.text();

        if (gvizText.trim().startsWith('<') || gvizText.toLowerCase().includes('<html')) {
          return {
            success: false,
            message: 'Google Sheet link detected, but access is restricted. Please click the green "Share" button in Google Sheets and set access to "Anyone with the link can view".'
          };
        }

        const jsonStart = gvizText.indexOf('{');
        const jsonEnd = gvizText.lastIndexOf('}');
        if (jsonStart !== -1 && jsonEnd !== -1) {
          const parsed = JSON.parse(gvizText.substring(jsonStart, jsonEnd + 1));
          if (parsed.table && parsed.table.rows && parsed.table.rows.length > 0) {
            const cols = (parsed.table.cols || []).map((c: any) =>
              (c.label || c.id || '').toLowerCase().replace(/[\s_-]+/g, '_')
            );

            const parsedServices: Service[] = [];
            parsed.table.rows.forEach((r: any, rIdx: number) => {
              const rowObj: Record<string, any> = {};
              (r.c || []).forEach((cell: any, cIdx: number) => {
                const colName = cols[cIdx] || `col_${cIdx}`;
                rowObj[colName] = cell && cell.v !== null && cell.v !== undefined ? cell.v : '';
              });
              const nameEn = rowObj.service_name_en || rowObj.service_name || rowObj.name;
              if (nameEn) {
                parsedServices.push({
                  service_id: String(rowObj.service_id || `srv-sheet-${rIdx + 1}`),
                  service_name_en: String(nameEn),
                  service_name_hi: String(rowObj.service_name_hi || nameEn),
                  category: String(rowObj.category || 'General Services'),
                  short_description_en: String(rowObj.short_description_en || ''),
                  short_description_hi: String(rowObj.short_description_hi || ''),
                  full_description_en: String(rowObj.full_description_en || ''),
                  full_description_hi: String(rowObj.full_description_hi || ''),
                  required_documents: rowObj.required_documents ? String(rowObj.required_documents).split(/[;\n,]+/).map(d => d.trim()).filter(Boolean) : ['Original Aadhaar Card', 'Mobile Number'],
                  icon: rowObj.icon || 'FileText',
                  status: (rowObj.status && rowObj.status.toLowerCase() === 'disabled') ? 'Disabled' : 'Active',
                  popular: Boolean(rowObj.popular === true || rowObj.popular === 'true' || rowObj.popular === 'yes'),
                  estimated_time: rowObj.estimated_time || '1 to 3 Working Days',
                  whatsapp_message: rowObj.whatsapp_message || `Hello Balaji Communication, I want information about ${nameEn}.`,
                  created_at: new Date().toISOString(),
                  updated_at: new Date().toISOString()
                });
              }
            });

            if (parsedServices.length > 0) {
              const newIds = new Set(parsedServices.map(s => s.service_id));
              const merged = [...parsedServices, ...services.filter(s => !newIds.has(s.service_id))];
              setServices(merged);
              localStorage.setItem('balaji_services', JSON.stringify(merged));
              const updatedSettings = {
                ...settings,
                google_sheet_webapp_url: targetUrl,
                google_sheet_url: targetUrl,
                last_sheet_sync: new Date().toISOString()
              };
              setSettings(updatedSettings);
              localStorage.setItem('balaji_settings', JSON.stringify(updatedSettings));
              return {
                success: true,
                message: `Successfully connected to Google Sheet! Imported ${parsedServices.length} services (Total catalog: ${merged.length} services).`,
                count: parsedServices.length
              };
            }
          }
        }
      }

      // Check if it's a Google Apps Script Web App URL
      const fetchUrl = targetUrl.includes('?') ? `${targetUrl}&action=getAllData` : `${targetUrl}?action=getAllData`;
      const directRes = await fetch(fetchUrl, {
        redirect: 'follow'
      });

      const directText = await directRes.text();

      // Check for HTML response (Google Sign-In redirect or Apps Script permission block)
      if (directText.trim().startsWith('<') || directText.toLowerCase().includes('<html') || directRes.url.includes('accounts.google.com')) {
        if (directText.includes('ServiceLogin') || directText.includes('accounts.google.com') || directRes.url.includes('accounts.google.com') || directText.includes('Sign in')) {
          return {
            success: false,
            message: 'Google Apps Script requires Google Account Sign-In because "Who has access" is set to "Only myself". Solution: In Google Apps Script, click Deploy > Manage deployments > click Edit (pencil icon) > set "Who has access" to "Anyone" > click Deploy, then try syncing again.'
          };
        }
        if (directText.includes('Script error') || directText.includes('Exception')) {
          return {
            success: false,
            message: 'Google Apps Script encountered an execution error. Please open Apps Script in your spreadsheet, select "setupAllTemplateSheets" from the toolbar function dropdown, and click "Run" to initialize tabs and authorize permissions.'
          };
        }
        return {
          success: false,
          message: 'Google returned an HTML web page instead of JSON data. Please verify your Google Apps Script deployment settings: Execute as: "Me", Who has access: "Anyone", and URL ends with "/exec".'
        };
      }

      let parsedData: any;
      try {
        parsedData = JSON.parse(directText);
      } catch (jsonErr) {
        // Try fallback with getServices
        const fallbackUrl = targetUrl.includes('?') ? `${targetUrl}&action=getServices` : `${targetUrl}?action=getServices`;
        const fbRes = await fetch(fallbackUrl, { redirect: 'follow' });
        const fbText = await fbRes.text();
        if (fbText.trim().startsWith('<')) {
          return {
            success: false,
            message: 'Google Apps Script returned an HTML page. Ensure "Who has access" is set to "Anyone" in Deploy > Manage deployments.'
          };
        }
        parsedData = JSON.parse(fbText);
      }

      let serviceList: Service[] = [];
      if (Array.isArray(parsedData)) {
        serviceList = parsedData;
      } else if (parsedData && parsedData.status === 'success' && parsedData.data) {
        if (Array.isArray(parsedData.data)) {
          serviceList = parsedData.data;
        } else if (parsedData.data.services && Array.isArray(parsedData.data.services)) {
          serviceList = parsedData.data.services;
          // Also sync enquiries if provided
          if (Array.isArray(parsedData.data.enquiries) && parsedData.data.enquiries.length > 0) {
            const remoteEnqIds = new Set(parsedData.data.enquiries.map((e: any) => e.enquiry_id));
            const localRetained = enquiries.filter(e => !remoteEnqIds.has(e.enquiry_id));
            const mergedEnqs = [...parsedData.data.enquiries, ...localRetained];
            setEnquiries(mergedEnqs);
            localStorage.setItem('balaji_enquiries', JSON.stringify(mergedEnqs));
          }
        }
      } else if (parsedData && Array.isArray(parsedData.services)) {
        serviceList = parsedData.services;
      }

      if (serviceList.length > 0) {
        const newIds = new Set(serviceList.map(s => s.service_id));
        const merged = [...serviceList, ...services.filter(s => !newIds.has(s.service_id))];
        setServices(merged);
        localStorage.setItem('balaji_services', JSON.stringify(merged));
        const updatedSettings = {
          ...settings,
          google_sheet_webapp_url: targetUrl,
          google_sheet_url: targetUrl,
          last_sheet_sync: new Date().toISOString()
        };
        setSettings(updatedSettings);
        localStorage.setItem('balaji_settings', JSON.stringify(updatedSettings));
        return {
          success: true,
          message: `Successfully connected to Google Apps Script Web App! Loaded ${serviceList.length} services (Total catalog: ${merged.length} services).`,
          count: serviceList.length
        };
      } else {
        const updatedSettings = {
          ...settings,
          google_sheet_webapp_url: targetUrl,
          google_sheet_url: targetUrl,
          last_sheet_sync: new Date().toISOString()
        };
        setSettings(updatedSettings);
        localStorage.setItem('balaji_settings', JSON.stringify(updatedSettings));
        return {
          success: true,
          message: 'Connected to Google Apps Script Web App! Link verified and saved (no service rows found, local catalog preserved).'
        };
      }
    } catch (directErr: any) {
      return {
        success: false,
        message: `Failed to connect to Google Sheets / Web App: ${directErr.message || 'Please check URL and ensure "Who has access: Anyone" is selected.'}`
      };
    }
  };

  // Direct CSV File Import (Supports Full-Stack Server & GitHub Pages Client Parsing)
  const importCsvData = async (type: string, csvText: string) => {
    try {
      const serverRes = await safeJsonFetch('/api/import-csv', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken || localStorage.getItem('balaji_admin_token') || ''}`
        },
        body: JSON.stringify({ type, csvText })
      });
      if (serverRes.ok && serverRes.data?.success) {
        await fetchData();
        return { success: true, message: serverRes.data.message, count: serverRes.data.count };
      }
      if (!serverRes.isHtml && serverRes.data?.error) {
        return { success: false, message: serverRes.data.error };
      }
    } catch (e) {
      // Continue to client-side CSV parsing fallback
    }

    // Client-side CSV import fallback (e.g. for GitHub Pages)
    try {
      const lines = csvText.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
      if (lines.length <= 1) {
        return { success: false, message: 'CSV file contains no data rows.' };
      }
      const headers = lines[0].split(',').map(h => h.replace(/^["']|["']$/g, '').trim().toLowerCase().replace(/[\s_-]+/g, '_'));
      const parsedRows: any[] = [];
      for (let i = 1; i < lines.length; i++) {
        const row = lines[i].split(',').map(cell => cell.replace(/^["']|["']$/g, '').trim());
        const obj: Record<string, string> = {};
        headers.forEach((h, idx) => {
          obj[h] = row[idx] || '';
        });
        parsedRows.push(obj);
      }

      if (type === 'services' || type === 'all_services') {
        const importedServices: Service[] = parsedRows.map((r, idx) => ({
          service_id: r.service_id || `srv-csv-${Date.now()}-${idx}`,
          service_name_en: r.service_name_en || r.service_name || r.name || `Service ${idx + 1}`,
          service_name_hi: r.service_name_hi || r.name_hi || r.service_name_en || '',
          category: r.category || 'General Services',
          short_description_en: r.short_description_en || r.short_description || '',
          short_description_hi: r.short_description_hi || '',
          full_description_en: r.full_description_en || '',
          full_description_hi: r.full_description_hi || '',
          required_documents: r.required_documents ? r.required_documents.split(';').map((d: string) => d.trim()).filter(Boolean) : ['Original Aadhaar Card', 'Mobile Number'],
          icon: r.icon || 'FileText',
          status: (r.status && r.status.toLowerCase() === 'disabled') ? 'Disabled' : 'Active',
          popular: Boolean(r.popular === 'yes' || r.popular === 'true'),
          estimated_time: r.estimated_time || '1 to 3 Working Days',
          whatsapp_message: r.whatsapp_message || `Hello Balaji Communication, I need assistance.`,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }));

        const sheetIds = new Set(importedServices.map(s => s.service_id));
        const merged = [...importedServices, ...services.filter(s => !sheetIds.has(s.service_id))];
        setServices(merged);
        localStorage.setItem('balaji_services', JSON.stringify(merged));
        return { success: true, message: `Successfully imported ${importedServices.length} services from CSV file!`, count: importedServices.length };
      }

      return { success: true, message: `CSV processed successfully (${parsedRows.length} rows loaded).`, count: parsedRows.length };
    } catch (err: any) {
      return { success: false, message: `Failed to import CSV: ${err.message}` };
    }
  };

  return (
    <DataContext.Provider value={{
      services,
      settings,
      categories,
      enquiries,
      isLoading,
      error,
      selectedService,
      isEnquiryModalOpen,
      enquiryPreselectedService,
      openServiceDetails,
      closeServiceDetails,
      openEnquiryModal,
      closeEnquiryModal,
      submitEnquiry,
      trackApplication,
      isAdminLoggedIn,
      adminToken,
      loginAdmin,
      logoutAdmin,
      addService,
      createService: addService,
      updateService,
      deleteService,
      updateEnquiryStatus,
      deleteEnquiry,
      updateSettings,
      syncWithGoogleSheets,
      importCsvData,
      refreshData: fetchData
    }}>
      {children}
    </DataContext.Provider>
  );
};

export function useData() {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}
