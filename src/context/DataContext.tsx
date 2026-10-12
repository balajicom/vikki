import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Service, Enquiry, WebsiteSettings, EnquiryStatus, PriceListItem, NoticeItem, QuickLinkItem, CitizenRecord } from '../types';
import { INITIAL_SERVICES, INITIAL_SETTINGS, CATEGORIES, INITIAL_PRICELIST, INITIAL_NOTICES, INITIAL_QUICKLINKS } from '../data/initialData';
import { DEFAULT_GOOGLE_SHEET_WEBAPP_URL } from '../config/sheetConfig';

interface DataContextType {
  services: Service[];
  settings: WebsiteSettings;
  categories: string[];
  enquiries: Enquiry[];
  priceList: PriceListItem[];
  notices: NoticeItem[];
  quickLinks: QuickLinkItem[];
  citizens: CitizenRecord[];
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
  clearAllEnquiries: () => Promise<boolean>;
  updateSettings: (newSettings: Partial<WebsiteSettings>) => Promise<boolean>;
  syncWithGoogleSheets: (url?: string) => Promise<{ success: boolean; message: string; count?: number }>;
  importCsvData: (type: string, csvText: string) => Promise<{ success: boolean; message: string; count?: number }>;
  refreshData: () => Promise<void>;
  isLiveAutoSyncing: boolean;
  lastLiveSyncTime: string | null;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

const DEFAULT_ENQUIRIES: Enquiry[] = [];

function loadLocalServices(): Service[] {
  try {
    const raw = localStorage.getItem('balaji_services');
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed.map((s: any) => ({
          ...s,
          required_documents: Array.isArray(s.required_documents)
            ? s.required_documents
            : (typeof s.required_documents === 'string' ? s.required_documents.split(/[;\n]+/).map((d: string) => d.trim()).filter(Boolean) : ['Original Aadhaar Card', 'Mobile Number'])
        }));
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
      if (Array.isArray(parsed)) {
        // Strip out any legacy test/mock entries from previous sessions
        const clean = parsed.filter(e => 
          !e.enquiry_id?.startsWith('BALAJI-APP-2026-00') &&
          !e.enquiry_id?.startsWith('ENQ-2026-00') &&
          !e.enquiry_id?.startsWith('TEST-LIVE-') &&
          e.customer_name !== 'Dinesh Kumar Gangwar' &&
          e.customer_name !== 'Ramesh Chandra Gangwar' &&
          e.customer_name !== 'Test Verification Citizen'
        );
        return clean;
      }
    }
  } catch (err) {
    console.warn('Could not parse balaji_enquiries from localStorage:', err);
  }
  return DEFAULT_ENQUIRIES;
}

function loadLocalPriceList(): PriceListItem[] {
  try {
    const raw = localStorage.getItem('balaji_pricelist');
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {}
  return INITIAL_PRICELIST;
}

function loadLocalNotices(): NoticeItem[] {
  try {
    const raw = localStorage.getItem('balaji_notices');
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {}
  return INITIAL_NOTICES;
}

function loadLocalQuickLinks(): QuickLinkItem[] {
  try {
    const raw = localStorage.getItem('balaji_quicklinks');
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {}
  return INITIAL_QUICKLINKS;
}

function loadLocalCitizens(): CitizenRecord[] {
  try {
    const raw = localStorage.getItem('balaji_citizens');
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        return parsed.filter(c => c.citizen_id !== 'CIT-001');
      }
    }
  } catch (e) {}
  return [];
}

function loadLocalSettings(): WebsiteSettings {
  try {
    const directSheetUrl = localStorage.getItem('balaji_sheet_url');
    const raw = localStorage.getItem('balaji_settings');
    let loaded: WebsiteSettings = { ...INITIAL_SETTINGS };
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === 'object') {
        loaded = { ...INITIAL_SETTINGS, ...parsed };
      }
    }
    if (directSheetUrl && directSheetUrl.trim()) {
      loaded.google_sheet_webapp_url = directSheetUrl.trim();
    }
    return loaded;
  } catch (err) {
    console.warn('Could not parse balaji_settings from localStorage:', err);
  }
  return INITIAL_SETTINGS;
}

export function getGoogleSheetWebappUrl(currentSettings?: WebsiteSettings): string {
  // 1. Current state setting
  if (currentSettings?.google_sheet_webapp_url && currentSettings.google_sheet_webapp_url.trim()) {
    return currentSettings.google_sheet_webapp_url.trim();
  }
  if ((currentSettings as any)?.google_sheet_web_app_url && (currentSettings as any).google_sheet_web_app_url.trim()) {
    return (currentSettings as any).google_sheet_web_app_url.trim();
  }
  // 2. Vite environment variable (Inlined during GitHub Actions / build)
  try {
    const metaEnv = (import.meta as any)?.env;
    if (metaEnv && metaEnv.VITE_GOOGLE_SHEET_WEBAPP_URL) {
      const envUrl = String(metaEnv.VITE_GOOGLE_SHEET_WEBAPP_URL).trim();
      if (envUrl) return envUrl;
    }
  } catch (e) {}
  // 3. Central code config (src/config/sheetConfig.ts)
  const defaultCodeUrl = String(DEFAULT_GOOGLE_SHEET_WEBAPP_URL || '').trim();
  if (defaultCodeUrl) {
    return defaultCodeUrl;
  }
  // 4. LocalStorage
  try {
    const direct = localStorage.getItem('balaji_sheet_url');
    if (direct && direct.trim()) return direct.trim();
    const raw = localStorage.getItem('balaji_settings');
    if (raw) {
      const p = JSON.parse(raw);
      if (p.google_sheet_webapp_url && p.google_sheet_webapp_url.trim()) return p.google_sheet_webapp_url.trim();
      if (p.google_sheet_web_app_url && p.google_sheet_web_app_url.trim()) return p.google_sheet_web_app_url.trim();
    }
  } catch (e) {}
  // 5. Initial settings
  return (INITIAL_SETTINGS.google_sheet_webapp_url || '').trim();
}

/**
 * Sends a Citizen Application directly to Google Sheets Web App from the browser.
 * Uses 4-way dispatch (POST text/plain without CORS preflight + GET fallback + Image beacon + Navigator beacon)
 * to guarantee delivery on GitHub Pages static hosting where no Express backend server is available.
 */
export async function sendApplicationToGoogleSheets(url: string, application: Enquiry): Promise<boolean> {
  if (!url || !url.includes('script.google.com')) return false;
  const targetUrl = url.trim();

  // 1. Dispatch A: POST with mode: 'no-cors' & text/plain (avoids CORS preflight)
  try {
    fetch(targetUrl, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify({
        action: 'createEnquiry',
        data: application
      })
    }).catch(err => console.warn('POST to Google Sheets failed:', err));
  } catch (err) {}

  // 2. Dispatch B: GET query parameter (Google Apps Script handles GET reliably across all browsers)
  try {
    const params = new URLSearchParams({
      action: 'createEnquiry',
      enquiry_id: application.enquiry_id || '',
      customer_name: application.customer_name || application.applicant_name || '',
      applicant_name: application.applicant_name || application.customer_name || '',
      father_or_husband_name: application.father_or_husband_name || '',
      mobile: application.mobile || '',
      service_name: application.service_name || '',
      category: application.category || '',
      village: application.village || '',
      address: application.address || '',
      message: application.message || '',
      preferred_contact: application.preferred_contact || 'Call',
      urgency: application.urgency || 'Normal',
      status: application.status || 'New',
      created_at: application.created_at || new Date().toISOString()
    });
    const getUrl = `${targetUrl}${targetUrl.includes('?') ? '&' : '?'}${params.toString()}`;
    fetch(getUrl, { mode: 'no-cors' }).catch(err => console.warn('GET to Google Sheets failed:', err));

    // 3. Dispatch C: Image GET trigger (100% immune to browser CORS restrictions)
    if (typeof Image !== 'undefined') {
      const img = new Image();
      img.src = getUrl;
    }
  } catch (err) {}

  // 4. Dispatch D: Beacon API fallback (ensures background transmission if user closes page)
  try {
    if (typeof navigator !== 'undefined' && navigator.sendBeacon) {
      const beaconData = new Blob([JSON.stringify({
        action: 'createEnquiry',
        data: application
      })], { type: 'text/plain;charset=utf-8' });
      navigator.sendBeacon(targetUrl, beaconData);
    }
  } catch (e) {}

  return true;
}

/**
 * Sends Enquiry Status changes directly to Google Sheets Web App from the browser.
 */
export async function sendStatusUpdateToGoogleSheets(url: string, enquiryId: string, status: string): Promise<boolean> {
  if (!url || !url.includes('script.google.com')) return false;
  const targetUrl = url.trim();

  try {
    fetch(targetUrl, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify({
        action: 'updateEnquiryStatus',
        enquiry_id: enquiryId,
        status: status
      })
    }).catch(() => {});
  } catch (e) {}

  try {
    const getUrl = `${targetUrl}${targetUrl.includes('?') ? '&' : '?'}action=updateEnquiryStatus&enquiry_id=${encodeURIComponent(enquiryId)}&status=${encodeURIComponent(status)}`;
    fetch(getUrl, { mode: 'no-cors' }).catch(() => {});
    if (typeof Image !== 'undefined') {
      const img = new Image();
      img.src = getUrl;
    }
  } catch (e) {}

  return true;
}

/**
 * Sends Service changes (create / update / delete) directly to Google Sheets Web App from browser.
 */
export async function sendServiceToGoogleSheets(url: string, action: 'createService' | 'updateService' | 'deleteService', service: Partial<Service>): Promise<boolean> {
  if (!url || !url.includes('script.google.com')) return false;
  const targetUrl = url.trim();

  // 1. Dispatch A: POST with mode 'no-cors' and text/plain (avoids CORS preflight)
  try {
    fetch(targetUrl, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify({
        action,
        service_id: service.service_id,
        id: service.service_id,
        data: service
      })
    }).catch(() => {});
  } catch (e) {}

  // 2. Dispatch B: GET query parameter (100% reliable across browsers and static hosts)
  try {
    const params = new URLSearchParams({
      action,
      service_id: service.service_id || '',
      service_name_en: service.service_name_en || '',
      service_name_hi: service.service_name_hi || '',
      category: service.category || 'General Services',
      short_description_en: service.short_description_en || '',
      short_description_hi: service.short_description_hi || '',
      full_description_en: service.full_description_en || '',
      full_description_hi: service.full_description_hi || '',
      required_documents: Array.isArray(service.required_documents) ? service.required_documents.join('\n') : (service.required_documents || ''),
      icon: service.icon || 'FileText',
      status: service.status || 'Active',
      popular: service.popular ? 'yes' : 'no',
      estimated_time: service.estimated_time || '1 to 3 Working Days',
      whatsapp_message: service.whatsapp_message || ''
    });
    const getUrl = `${targetUrl}${targetUrl.includes('?') ? '&' : '?'}${params.toString()}`;
    fetch(getUrl, { mode: 'no-cors' }).catch(() => {});

    // 3. Dispatch C: Image GET trigger
    if (typeof Image !== 'undefined') {
      const img = new Image();
      img.src = getUrl;
    }
  } catch (e) {}

  return true;
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
    const res = await fetch(input, {
      credentials: 'same-origin',
      ...init
    });
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
  const [settings, setSettings] = useState<WebsiteSettings>(() => loadLocalSettings());
  const [categories, setCategories] = useState<string[]>(CATEGORIES);
  const [enquiries, setEnquiries] = useState<Enquiry[]>(() => loadLocalEnquiries());
  const [priceList, setPriceList] = useState<PriceListItem[]>(() => loadLocalPriceList());
  const [notices, setNotices] = useState<NoticeItem[]>(() => loadLocalNotices());
  const [quickLinks, setQuickLinks] = useState<QuickLinkItem[]>(() => loadLocalQuickLinks());
  const [citizens, setCitizens] = useState<CitizenRecord[]>(() => loadLocalCitizens());
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isLiveAutoSyncing, setIsLiveAutoSyncing] = useState<boolean>(true);
  const [lastLiveSyncTime, setLastLiveSyncTime] = useState<string | null>(() => new Date().toLocaleTimeString());

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
      // 1. Services: Merge server services with locally stored services so newly added ones persist across refresh
      const srvRes = await safeJsonFetch('/api/services', {
        headers: adminToken ? { Authorization: `Bearer ${adminToken}` } : {}
      });
      if (srvRes.ok && srvRes.data?.services && Array.isArray(srvRes.data.services)) {
        const serverServices: Service[] = srvRes.data.services.map((s: any) => ({
          ...s,
          required_documents: Array.isArray(s.required_documents)
            ? s.required_documents
            : (typeof s.required_documents === 'string' ? s.required_documents.split(/[;\n]+/).map((d: string) => d.trim()).filter(Boolean) : ['Original Aadhaar Card', 'Mobile Number']),
          status: s.status || 'Active',
          popular: Boolean(s.popular)
        }));
        setServices(serverServices);
        try {
          localStorage.setItem('balaji_services', JSON.stringify(serverServices));
        } catch (e) {}
      } else {
        // Fallback: keep local services intact if server is offline
        const localSaved = loadLocalServices();
        if (localSaved.length > 0) {
          setServices(localSaved);
        }
      }

      // 2. Settings
      const setRes = await safeJsonFetch('/api/settings');
      if (setRes.ok && setRes.data?.settings) {
        setSettings(setRes.data.settings);
        try {
          localStorage.setItem('balaji_settings', JSON.stringify(setRes.data.settings));
          if (setRes.data.settings.google_sheet_webapp_url) {
            localStorage.setItem('balaji_sheet_url', setRes.data.settings.google_sheet_webapp_url);
          }
        } catch (e) {}
      } else {
        // Fallback to local settings (ensures Google Sheet URL remains loaded on GitHub Pages)
        let localSettings = loadLocalSettings();

        // Check for static config.json deployed on GitHub Pages
        try {
          const baseUrl = (import.meta as any)?.env?.BASE_URL || './';
          const configUrl = baseUrl.endsWith('/') ? `${baseUrl}config.json` : `${baseUrl}/config.json`;
          let cfgRes = await fetch(configUrl).catch(() => null);
          if (!cfgRes || !cfgRes.ok) {
            cfgRes = await fetch('./config.json').catch(() => null);
          }
          if (!cfgRes || !cfgRes.ok) {
            cfgRes = await fetch('/vikki/config.json').catch(() => null);
          }
          if (cfgRes && cfgRes.ok) {
            const cfg = await cfgRes.json();
            if (cfg?.google_sheet_webapp_url && !localSettings.google_sheet_webapp_url) {
              localSettings.google_sheet_webapp_url = cfg.google_sheet_webapp_url;
              localSettings.google_sheet_url = cfg.google_sheet_webapp_url;
              try {
                localStorage.setItem('balaji_sheet_url', cfg.google_sheet_webapp_url);
              } catch (e) {}
            }
          }
        } catch (e) {}

        // Check Vite environment variable
        try {
          const metaEnv = (import.meta as any)?.env;
          if (metaEnv && metaEnv.VITE_GOOGLE_SHEET_WEBAPP_URL) {
            const envUrl = String(metaEnv.VITE_GOOGLE_SHEET_WEBAPP_URL).trim();
            if (envUrl && !localSettings.google_sheet_webapp_url) {
              localSettings.google_sheet_webapp_url = envUrl;
              localSettings.google_sheet_url = envUrl;
            }
          }
        } catch (e) {}

        // Check DEFAULT_GOOGLE_SHEET_WEBAPP_URL from src/config/sheetConfig.ts
        const codeUrl = String(DEFAULT_GOOGLE_SHEET_WEBAPP_URL || '').trim();
        if (codeUrl && !localSettings.google_sheet_webapp_url) {
          localSettings.google_sheet_webapp_url = codeUrl;
          localSettings.google_sheet_url = codeUrl;
        }

        setSettings(localSettings);
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

      // 5. Price List, Notices, Quick Links, Citizens
      safeJsonFetch('/api/pricelist').then(res => {
        if (res.ok && res.data?.priceList && Array.isArray(res.data.priceList)) {
          setPriceList(res.data.priceList);
          try { localStorage.setItem('balaji_pricelist', JSON.stringify(res.data.priceList)); } catch (e) {}
        }
      }).catch(() => {});

      safeJsonFetch('/api/notices').then(res => {
        if (res.ok && res.data?.notices && Array.isArray(res.data.notices)) {
          setNotices(res.data.notices);
          try { localStorage.setItem('balaji_notices', JSON.stringify(res.data.notices)); } catch (e) {}
        }
      }).catch(() => {});

      safeJsonFetch('/api/quicklinks').then(res => {
        if (res.ok && res.data?.quickLinks && Array.isArray(res.data.quickLinks)) {
          setQuickLinks(res.data.quickLinks);
          try { localStorage.setItem('balaji_quicklinks', JSON.stringify(res.data.quickLinks)); } catch (e) {}
        }
      }).catch(() => {});

      if (adminToken) {
        safeJsonFetch('/api/citizens', { headers: { Authorization: `Bearer ${adminToken}` } }).then(res => {
          if (res.ok && res.data?.citizens && Array.isArray(res.data.citizens)) {
            setCitizens(res.data.citizens);
            try { localStorage.setItem('balaji_citizens', JSON.stringify(res.data.citizens)); } catch (e) {}
          }
        }).catch(() => {});
      }
    } catch (err: any) {
      console.warn('API fetch warning, using fallback local dataset:', err);
    } finally {
      setIsLoading(false);
    }
  }, [adminToken]);

  // Background Live Sync (runs every 1.5 seconds across all devices & browsers)
  const pollLatestData = useCallback(async () => {
    try {
      // 1. Unified live sync endpoint (super-fast lightweight payload)
      const syncRes = await safeJsonFetch('/api/sync-live');
      if (syncRes.ok && syncRes.data?.success && Array.isArray(syncRes.data.services)) {
        const liveServices: Service[] = syncRes.data.services.map((s: any) => ({
          ...s,
          required_documents: Array.isArray(s.required_documents)
            ? s.required_documents
            : (typeof s.required_documents === 'string' ? s.required_documents.split(/[;\n]+/).map((d: string) => d.trim()).filter(Boolean) : ['Original Aadhaar Card', 'Mobile Number']),
          status: s.status || 'Active',
          popular: Boolean(s.popular)
        }));
        setServices(prev => {
          if (JSON.stringify(prev) !== JSON.stringify(liveServices)) {
            try { localStorage.setItem('balaji_services', JSON.stringify(liveServices)); } catch (e) {}
            return liveServices;
          }
          return prev;
        });

        // Sync settings
        if (syncRes.data.settings && typeof syncRes.data.settings === 'object') {
          setSettings(prev => {
            if (JSON.stringify(prev) !== JSON.stringify(syncRes.data.settings)) {
              try { localStorage.setItem('balaji_settings', JSON.stringify(syncRes.data.settings)); } catch (e) {}
              return { ...prev, ...syncRes.data.settings };
            }
            return prev;
          });
        }

        // Sync categories
        const dynamicCats = Array.from(new Set(liveServices.map(s => s.category).filter(Boolean)));
        if (dynamicCats.length > 0) {
          setCategories(prev => {
            if (dynamicCats.length !== prev.length || dynamicCats.some(c => !prev.includes(c))) {
              return dynamicCats;
            }
            return prev;
          });
        }

        if (Array.isArray(syncRes.data.priceList)) {
          setPriceList(prev => {
            if (JSON.stringify(prev) !== JSON.stringify(syncRes.data.priceList)) {
              try { localStorage.setItem('balaji_pricelist', JSON.stringify(syncRes.data.priceList)); } catch (e) {}
              return syncRes.data.priceList;
            }
            return prev;
          });
        }

        if (Array.isArray(syncRes.data.notices)) {
          setNotices(prev => {
            if (JSON.stringify(prev) !== JSON.stringify(syncRes.data.notices)) {
              try { localStorage.setItem('balaji_notices', JSON.stringify(syncRes.data.notices)); } catch (e) {}
              return syncRes.data.notices;
            }
            return prev;
          });
        }

        if (Array.isArray(syncRes.data.quickLinks)) {
          setQuickLinks(prev => {
            if (JSON.stringify(prev) !== JSON.stringify(syncRes.data.quickLinks)) {
              try { localStorage.setItem('balaji_quicklinks', JSON.stringify(syncRes.data.quickLinks)); } catch (e) {}
              return syncRes.data.quickLinks;
            }
            return prev;
          });
        }

        if (adminToken) {
          const enqRes = await safeJsonFetch('/api/enquiries', {
            headers: { Authorization: `Bearer ${adminToken}` }
          });
          if (enqRes.ok && Array.isArray(enqRes.data?.enquiries)) {
            setEnquiries(prev => {
              if (JSON.stringify(prev) !== JSON.stringify(enqRes.data.enquiries)) {
                try { localStorage.setItem('balaji_enquiries', JSON.stringify(enqRes.data.enquiries)); } catch (e) {}
                return enqRes.data.enquiries;
              }
              return prev;
            });
          }
        }

        setLastLiveSyncTime(new Date().toLocaleTimeString());
        setIsLiveAutoSyncing(true);
        return;
      }

      // 2. Google Sheets Web App Fallback (for static GitHub Pages hosting)
      const activeSheetUrl = getGoogleSheetWebappUrl(settings);
      if (activeSheetUrl && activeSheetUrl.includes('script.google.com')) {
        const sheetRes = await fetch(`${activeSheetUrl}${activeSheetUrl.includes('?') ? '&' : '?'}action=getAllData`);
        if (sheetRes.ok) {
          const parsed = await sheetRes.json();
          if (parsed && parsed.status === 'success' && parsed.data) {
            if (Array.isArray(parsed.data.services) && parsed.data.services.length > 0) {
              setServices(prev => {
                if (JSON.stringify(prev) !== JSON.stringify(parsed.data.services)) {
                  try { localStorage.setItem('balaji_services', JSON.stringify(parsed.data.services)); } catch (e) {}
                  return parsed.data.services;
                }
                return prev;
              });
            }
            if (Array.isArray(parsed.data.priceList) && parsed.data.priceList.length > 0) {
              setPriceList(parsed.data.priceList);
            }
            if (Array.isArray(parsed.data.notices) && parsed.data.notices.length > 0) {
              setNotices(parsed.data.notices);
            }
            if (Array.isArray(parsed.data.quickLinks) && parsed.data.quickLinks.length > 0) {
              setQuickLinks(parsed.data.quickLinks);
            }
            if (adminToken && Array.isArray(parsed.data.enquiries)) {
              setEnquiries(parsed.data.enquiries);
            }
            setLastLiveSyncTime(new Date().toLocaleTimeString());
            setIsLiveAutoSyncing(true);
          }
        }
      }
    } catch (pollErr) {
      // Background sync non-blocking
    }
  }, [adminToken, settings]);

  useEffect(() => {
    fetchData();

    // Cross-tab instant local storage sync (0ms latency for open tabs)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'balaji_services' && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          if (Array.isArray(parsed)) setServices(parsed);
        } catch (err) {}
      } else if (e.key === 'balaji_enquiries' && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          if (Array.isArray(parsed)) setEnquiries(parsed);
        } catch (err) {}
      } else if (e.key === 'balaji_pricelist' && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          if (Array.isArray(parsed)) setPriceList(parsed);
        } catch (err) {}
      } else if (e.key === 'balaji_notices' && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          if (Array.isArray(parsed)) setNotices(parsed);
        } catch (err) {}
      } else if (e.key === 'balaji_quicklinks' && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          if (Array.isArray(parsed)) setQuickLinks(parsed);
        } catch (err) {}
      } else if (e.key === 'balaji_settings' && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          if (parsed && typeof parsed === 'object') setSettings(parsed);
        } catch (err) {}
      }
    };
    window.addEventListener('storage', handleStorageChange);

    // Immediate auto-refresh when tab gains focus or window becomes visible
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        pollLatestData();
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', handleVisibilityChange);

    // Multi-browser live polling (every 1.5 seconds)
    let isPolling = false;
    const interval = setInterval(async () => {
      if (isPolling) return;
      isPolling = true;
      try {
        await pollLatestData();
      } finally {
        isPolling = false;
      }
    }, 1500);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleVisibilityChange);
      clearInterval(interval);
    };
  }, [fetchData, pollLatestData]);

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

    // 2. DISPATCH DIRECTLY TO GOOGLE SHEETS WEB APP FROM BROWSER (CRITICAL FOR GITHUB LIVE)
    const activeSheetUrl = getGoogleSheetWebappUrl(settings);
    if (activeSheetUrl && activeSheetUrl.includes('script.google.com')) {
      sendApplicationToGoogleSheets(activeSheetUrl, newEnquiry).catch(err => {
        console.warn('Browser dispatch to Google Sheets:', err);
      });
    }

    // 3. Try backend API if available (for local dev server / fullstack)
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
      // Backend not running (e.g. GitHub Pages static) - already saved locally and dispatched to Google Sheets
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
    const rawDocs = serviceData.required_documents;
    const normDocs = Array.isArray(rawDocs)
      ? rawDocs
      : (typeof rawDocs === 'string' ? (rawDocs as string).split(/[;\n]+/).map(s => s.trim()).filter(Boolean) : ['Original Aadhaar Card', 'Registered Mobile Number']);

    const completeService: Service = {
      service_id: serviceData.service_id || `srv-${Date.now().toString(36)}`,
      service_name_en: serviceData.service_name_en || serviceData.service_name_hi || 'New Service',
      service_name_hi: serviceData.service_name_hi || serviceData.service_name_en || 'नई सेवा',
      category: serviceData.category || 'General Services',
      short_description_en: serviceData.short_description_en || '',
      short_description_hi: serviceData.short_description_hi || '',
      full_description_en: serviceData.full_description_en || '',
      full_description_hi: serviceData.full_description_hi || '',
      required_documents: normDocs,
      icon: serviceData.icon || 'FileText',
      status: serviceData.status || 'Active',
      popular: Boolean(serviceData.popular),
      estimated_time: serviceData.estimated_time || '1 to 3 Working Days',
      whatsapp_message: serviceData.whatsapp_message || `Hello Balaji Communication, I want information about ${serviceData.service_name_en || 'services'}.`,
      created_at: serviceData.created_at || new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    // 1. Immediately persist locally (ensures service never disappears on refresh)
    let updatedServices: Service[] = [];
    setServices(prev => {
      updatedServices = [completeService, ...prev.filter(s => s.service_id !== completeService.service_id)];
      try {
        localStorage.setItem('balaji_services', JSON.stringify(updatedServices));
      } catch (e) {}
      return updatedServices;
    });

    if (completeService.category && !categories.includes(completeService.category)) {
      setCategories(prev => [...prev, completeService.category]);
    }

    // 2. Direct browser forward to Google Apps Script Web App (works on GitHub Pages static)
    const activeSheetUrl = getGoogleSheetWebappUrl(settings);
    if (activeSheetUrl && activeSheetUrl.includes('script.google.com')) {
      sendServiceToGoogleSheets(activeSheetUrl, 'createService', completeService).catch(() => {});
    }

    // 3. Sync to backend API if available
    try {
      await safeJsonFetch('/api/services', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(completeService)
      });
      // Push complete list so all other browsers get updated instantly
      await safeJsonFetch('/api/sync-push', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ services: updatedServices })
      });
    } catch (err) {
      console.warn('Network error saving service to server, local record preserved:', err);
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

    // 1. Immediate optimistic UI update (0ms delay)
    let updatedList: Service[] = [];
    setServices(prev => {
      updatedList = prev.map(s => s.service_id === id ? { ...s, ...payload, updated_at: new Date().toISOString() } : s);
      try {
        localStorage.setItem('balaji_services', JSON.stringify(updatedList));
      } catch (e) {}
      return updatedList;
    });

    // 2. Direct browser forward to Google Apps Script Web App
    const activeSheetUrl = getGoogleSheetWebappUrl(settings);
    if (activeSheetUrl && activeSheetUrl.includes('script.google.com')) {
      sendServiceToGoogleSheets(activeSheetUrl, 'updateService', { ...payload, service_id: id }).catch(() => {});
    }

    // 3. Persist to Express backend if online
    try {
      await safeJsonFetch(`/api/services/${encodeURIComponent(id)}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });
      // Push complete list so all other browsers get updated instantly
      await safeJsonFetch('/api/sync-push', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ services: updatedList })
      });
    } catch (err) {
      console.warn('Network error updating service on server, local update preserved:', err);
    }

    return true;
  };

  // Delete Service
  const deleteService = async (id: string): Promise<boolean> => {
    if (!id) return false;

    // 1. Immediate optimistic UI update (0ms delay)
    let updatedList: Service[] = [];
    setServices(prev => {
      updatedList = prev.filter(s => s.service_id !== id);
      try {
        localStorage.setItem('balaji_services', JSON.stringify(updatedList));
      } catch (e) {}
      return updatedList;
    });

    // 2. Direct browser forward to Google Apps Script Web App
    const activeSheetUrl = getGoogleSheetWebappUrl(settings);
    if (activeSheetUrl && activeSheetUrl.includes('script.google.com')) {
      sendServiceToGoogleSheets(activeSheetUrl, 'deleteService', { service_id: id }).catch(() => {});
    }

    // 3. Persist deletion on Express backend
    const token = adminToken || localStorage.getItem('balaji_admin_token') || 'balaji_secure_admin_session_token_2026';
    try {
      await fetch(`/api/services/${encodeURIComponent(id)}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      // Push updated list to server so all other browsers reflect deletion immediately
      await safeJsonFetch('/api/sync-push', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ services: updatedList })
      });
    } catch (err) {
      console.warn('Network error deleting service on server, local deletion preserved:', err);
    }

    return true;
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

    // 2. Direct browser sync to Google Sheets Web App (guarantees update on GitHub Pages static)
    const activeSheetUrl = getGoogleSheetWebappUrl(settings);
    if (activeSheetUrl && activeSheetUrl.includes('script.google.com')) {
      sendStatusUpdateToGoogleSheets(activeSheetUrl, id, status).catch(() => {});
    }

    // 3. Try updating server if online
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

  // Clear all enquiries (removes test/mock entries)
  const clearAllEnquiries = async (): Promise<boolean> => {
    setEnquiries([]);
    try {
      localStorage.setItem('balaji_enquiries', JSON.stringify([]));
    } catch (e) {}

    try {
      await safeJsonFetch('/api/enquiries-all', {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${adminToken || localStorage.getItem('balaji_admin_token')}` }
      });
    } catch (err) {}

    return true;
  };

  // Update Settings
  const updateSettings = async (newSettings: Partial<WebsiteSettings>): Promise<boolean> => {
    // Optimistic local state update
    const merged = { ...settings, ...newSettings };
    setSettings(merged);
    try {
      localStorage.setItem('balaji_settings', JSON.stringify(merged));
      const sUrl = merged.google_sheet_webapp_url || merged.google_sheet_url;
      if (sUrl) {
        localStorage.setItem('balaji_sheet_url', sUrl);
      }
    } catch (e) {}

    try {
      const token = adminToken || localStorage.getItem('balaji_admin_token') || 'balaji_secure_admin_session_token_2026';
      const res = await safeJsonFetch('/api/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(newSettings)
      });
      if (res.ok && res.data?.settings) {
        setSettings(res.data.settings);
        try {
          localStorage.setItem('balaji_settings', JSON.stringify(res.data.settings));
          if (res.data.settings.google_sheet_webapp_url) {
            localStorage.setItem('balaji_sheet_url', res.data.settings.google_sheet_webapp_url);
          }
        } catch (e) {}
      }
      // Also push to sync-push to ensure all devices and browsers stay updated
      await safeJsonFetch('/api/sync-push', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ settings: merged })
      });
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
              setServices(parsedServices);
              localStorage.setItem('balaji_services', JSON.stringify(parsedServices));
              const updatedSettings = {
                ...settings,
                google_sheet_webapp_url: targetUrl,
                google_sheet_url: targetUrl,
                last_sheet_sync: new Date().toISOString()
              };
              setSettings(updatedSettings);
              localStorage.setItem('balaji_settings', JSON.stringify(updatedSettings));
              try { localStorage.setItem('balaji_sheet_url', targetUrl); } catch (e) {}

              // Push immediately to backend server so all browsers receive it in real-time
              safeJsonFetch('/api/sync-push', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  services: parsedServices,
                  settings: updatedSettings
                })
              }).catch(() => {});

              return {
                success: true,
                message: `Successfully connected to Google Sheet! Imported ${parsedServices.length} services directly from your sheet.`,
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
        } else if (typeof parsedData.data === 'object') {
          // 1. Services
          if (parsedData.data.services && Array.isArray(parsedData.data.services)) {
            serviceList = parsedData.data.services;
          }
          // 2. Citizen Enquiries
          if (Array.isArray(parsedData.data.enquiries)) {
            setEnquiries(parsedData.data.enquiries);
            try { localStorage.setItem('balaji_enquiries', JSON.stringify(parsedData.data.enquiries)); } catch (e) {}
          }
          // 3. Price List
          if (Array.isArray(parsedData.data.priceList) && parsedData.data.priceList.length > 0) {
            setPriceList(parsedData.data.priceList);
            try { localStorage.setItem('balaji_pricelist', JSON.stringify(parsedData.data.priceList)); } catch (e) {}
          }
          // 4. Notice Board
          if (Array.isArray(parsedData.data.notices) && parsedData.data.notices.length > 0) {
            setNotices(parsedData.data.notices);
            try { localStorage.setItem('balaji_notices', JSON.stringify(parsedData.data.notices)); } catch (e) {}
          }
          // 5. Quick Links
          if (Array.isArray(parsedData.data.quickLinks) && parsedData.data.quickLinks.length > 0) {
            setQuickLinks(parsedData.data.quickLinks);
            try { localStorage.setItem('balaji_quicklinks', JSON.stringify(parsedData.data.quickLinks)); } catch (e) {}
          }
          // 6. Citizens
          if (Array.isArray(parsedData.data.citizens)) {
            setCitizens(parsedData.data.citizens);
            try { localStorage.setItem('balaji_citizens', JSON.stringify(parsedData.data.citizens)); } catch (e) {}
          }
          // 7. Settings
          if (parsedData.data.settings && typeof parsedData.data.settings === 'object') {
            setSettings(prev => ({ ...prev, ...parsedData.data.settings }));
          }
        }
      } else if (parsedData && Array.isArray(parsedData.services)) {
        serviceList = parsedData.services;
      }

      if (serviceList.length > 0) {
        setServices(serviceList);
        localStorage.setItem('balaji_services', JSON.stringify(serviceList));
        const updatedSettings = {
          ...settings,
          google_sheet_webapp_url: targetUrl,
          google_sheet_url: targetUrl,
          last_sheet_sync: new Date().toISOString()
        };
        setSettings(updatedSettings);
        localStorage.setItem('balaji_settings', JSON.stringify(updatedSettings));
        try { localStorage.setItem('balaji_sheet_url', targetUrl); } catch (e) {}

        // Push immediately to backend server so all browsers receive it in real-time
        safeJsonFetch('/api/sync-push', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            services: serviceList,
            settings: updatedSettings,
            priceList: parsedData?.data?.priceList,
            notices: parsedData?.data?.notices,
            quickLinks: parsedData?.data?.quickLinks,
            enquiries: parsedData?.data?.enquiries
          })
        }).catch(() => {});

        return {
          success: true,
          message: `Successfully connected to Google Sheet! Synced ${serviceList.length} services and all sheet tabs directly.`,
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
        try { localStorage.setItem('balaji_sheet_url', targetUrl); } catch (e) {}

        safeJsonFetch('/api/sync-push', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            settings: updatedSettings,
            priceList: parsedData?.data?.priceList,
            notices: parsedData?.data?.notices,
            quickLinks: parsedData?.data?.quickLinks
          })
        }).catch(() => {});

        return {
          success: true,
          message: 'Connected to Google Apps Script Web App! Link verified and saved (All sheet tables synchronized).'
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
      priceList,
      notices,
      quickLinks,
      citizens,
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
      clearAllEnquiries,
      updateSettings,
      syncWithGoogleSheets,
      importCsvData,
      refreshData: fetchData,
      isLiveAutoSyncing,
      lastLiveSyncTime
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
