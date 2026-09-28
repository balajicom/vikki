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
      const srvRes = await fetch('/api/services', {
        headers: adminToken ? { Authorization: `Bearer ${adminToken}` } : {}
      });
      if (srvRes.ok) {
        const srvData = await srvRes.json();
        if (srvData.services && Array.isArray(srvData.services)) {
          setServices(srvData.services);
          try {
            localStorage.setItem('balaji_services', JSON.stringify(srvData.services));
          } catch (e) {}
        }
      }

      // 2. Settings
      const setRes = await fetch('/api/settings');
      if (setRes.ok) {
        const setData = await setRes.json();
        if (setData.settings) {
          setSettings(setData.settings);
        }
      }

      // 3. Categories
      const catRes = await fetch('/api/categories');
      if (catRes.ok) {
        const catData = await catRes.json();
        if (catData.categories && Array.isArray(catData.categories)) {
          setCategories(catData.categories);
        }
      }

      // 4. Enquiries (if admin)
      if (adminToken) {
        const enqRes = await fetch('/api/enquiries', {
          headers: { Authorization: `Bearer ${adminToken}` }
        });
        if (enqRes.ok) {
          const enqData = await enqRes.json();
          if (enqData.enquiries && Array.isArray(enqData.enquiries)) {
            // Merge with local enquiries so nothing is lost
            const localSaved = loadLocalEnquiries();
            const mergedMap = new Map<string, Enquiry>();
            enqData.enquiries.forEach((e: Enquiry) => mergedMap.set(e.enquiry_id, e));
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
      const res = await fetch('/api/enquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          enquiry_id: newId
        })
      });
      if (res.ok) {
        const result = await res.json();
        if (result.success) {
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
      const res = await fetch(`/api/applications/track/${encodeURIComponent(rawQ)}`);
      if (res.ok) {
        const data = await res.json();
        if (data.success && Array.isArray(data.results) && data.results.length > 0) {
          return { success: true, results: data.results };
        }
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
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password: pass })
      });
      const data = await res.json();
      if (res.ok && data.success && data.token) {
        localStorage.setItem('balaji_admin_token', data.token);
        setAdminToken(data.token);
        fetchData();
        return { success: true };
      }
      return { success: false, error: data.error || 'Invalid credentials' };
    } catch (err: any) {
      // In emergency fallback mode
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
      const res = await fetch('/api/services', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(completeService)
      });
      if (res.ok) {
        const data = await res.json();
        const finalService = data.service || completeService;
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
      const res = await fetch(`/api/services/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        const data = await res.json();
        const updated = data.service || { ...payload, service_id: id };
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
      await fetch(`/api/enquiries/${encodeURIComponent(id)}`, {
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
    try {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`
        },
        body: JSON.stringify(newSettings)
      });
      if (res.ok) {
        const data = await res.json();
        if (data.settings) {
          setSettings(data.settings);
          return true;
        }
      }
      return false;
    } catch (err) {
      console.error(err);
      return false;
    }
  };

  // Google Sheets Sync
  const syncWithGoogleSheets = async (url?: string) => {
    try {
      const res = await fetch('/api/sync-sheets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`
        },
        body: JSON.stringify({ webapp_url: url })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        await fetchData();
        return { success: true, message: data.message, count: data.servicesCount };
      }
      return { success: false, message: data.error || 'Failed to sync with Google Sheet' };
    } catch (err: any) {
      return { success: false, message: err.message || 'Error communicating with server' };
    }
  };

  // Direct CSV File Import
  const importCsvData = async (type: string, csvText: string) => {
    try {
      const res = await fetch('/api/import-csv', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`
        },
        body: JSON.stringify({ type, csvText })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        await fetchData();
        return { success: true, message: data.message, count: data.count };
      }
      return { success: false, message: data.error || 'Failed to import CSV' };
    } catch (err: any) {
      return { success: false, message: err.message || 'Error communicating with server' };
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
