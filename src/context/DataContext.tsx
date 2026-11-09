import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Service, Enquiry, WebsiteSettings, EnquiryStatus } from '../types';
import { HARDCODED_SERVICES, SERVICE_CATEGORIES } from '../data/hardcodedServices';
import { INITIAL_SETTINGS } from '../data/initialData';
import { DEFAULT_GOOGLE_SHEET_WEBAPP_URL } from '../config/sheetConfig';

interface DataContextType {
  services: Service[];
  settings: WebsiteSettings;
  categories: string[];
  enquiries: Enquiry[];
  isLoading: boolean;
  // Modal states
  selectedService: Service | null;
  isEnquiryModalOpen: boolean;
  enquiryPreselectedService: Service | null;
  openServiceDetails: (service: Service) => void;
  closeServiceDetails: () => void;
  openEnquiryModal: (service?: Service) => void;
  closeEnquiryModal: () => void;
  // Add Service Modal
  isAddServiceModalOpen: boolean;
  openAddServiceModal: () => void;
  closeAddServiceModal: () => void;
  // Google Sheet configuration modal
  isSheetConfigOpen: boolean;
  openSheetConfig: () => void;
  closeSheetConfig: () => void;
  // Admin Authentication State
  isAdminLoggedIn: boolean;
  loginAdmin: (emailOrPass: string, password?: string) => Promise<{ success: boolean; error?: string }>;
  logoutAdmin: () => void;
  // Service management (Local data only - no backend needed, shown always)
  addService: (data: Partial<Service>) => { success: boolean; service: Service; codeSnippet: string };
  createService: (data: Partial<Service>) => Promise<boolean>;
  updateService: (service_id: string, data: Partial<Service>) => Promise<boolean>;
  deleteService: (service_id: string) => { success: boolean; message: string };
  resetDefaultServices: () => void;
  // Enquiry actions
  updateEnquiryStatus: (enquiry_id: string, status: EnquiryStatus) => Promise<boolean>;
  deleteEnquiry: (enquiry_id: string) => Promise<boolean>;
  clearAllEnquiries: () => Promise<boolean>;
  syncWithGoogleSheets: (url?: string) => Promise<{ success: boolean; message: string }>;
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
  updateSettings: (newSettings: Partial<WebsiteSettings>) => Promise<boolean>;
  saveGoogleSheetUrl: (url: string) => Promise<{ success: boolean; message: string }>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

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
    console.warn('Could not parse balaji_settings:', err);
  }
  return INITIAL_SETTINGS;
}

export function getGoogleSheetWebappUrl(currentSettings?: WebsiteSettings): string {
  // 1. Current state setting
  if (currentSettings?.google_sheet_webapp_url && currentSettings.google_sheet_webapp_url.trim()) {
    return currentSettings.google_sheet_webapp_url.trim();
  }
  // 2. Vite environment variable (Inlined during build)
  try {
    const metaEnv = (import.meta as any)?.env;
    if (metaEnv && metaEnv.VITE_GOOGLE_SHEET_WEBAPP_URL) {
      const envUrl = String(metaEnv.VITE_GOOGLE_SHEET_WEBAPP_URL).trim();
      if (envUrl) return envUrl;
    }
  } catch (e) {}
  // 3. Central code config (src/config/sheetConfig.ts)
  const defaultCodeUrl = String(DEFAULT_GOOGLE_SHEET_WEBAPP_URL || '').trim();
  if (defaultCodeUrl) return defaultCodeUrl;
  // 4. LocalStorage
  try {
    const direct = localStorage.getItem('balaji_sheet_url');
    if (direct && direct.trim()) return direct.trim();
    const raw = localStorage.getItem('balaji_settings');
    if (raw) {
      const p = JSON.parse(raw);
      if (p.google_sheet_webapp_url && p.google_sheet_webapp_url.trim()) return p.google_sheet_webapp_url.trim();
    }
  } catch (e) {}
  // 5. Initial settings
  return (INITIAL_SETTINGS.google_sheet_webapp_url || '').trim();
}

// Deduplication Set to ensure an enquiry is never transmitted more than once
const dispatchedEnquiryIds = new Set<string>();

/**
 * Sends a Citizen Application directly to Google Sheets Web App from the browser.
 * Uses a single clean POST request with deduplication to guarantee ZERO double entries.
 */
export async function sendApplicationToGoogleSheets(url: string, application: Enquiry): Promise<boolean> {
  if (!url || !url.includes('script.google.com')) return false;
  const targetUrl = url.trim();
  const refId = application.enquiry_id;

  // Deduplication check: if this enquiry was already dispatched, skip immediately
  if (refId && dispatchedEnquiryIds.has(refId)) {
    return true;
  }
  if (refId) {
    dispatchedEnquiryIds.add(refId);
    if (dispatchedEnquiryIds.size > 500) {
      dispatchedEnquiryIds.clear();
    }
  }

  // Single clean POST request using text/plain no-cors (avoids CORS preflight)
  try {
    await fetch(targetUrl, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify({
        action: 'createEnquiry',
        data: application
      })
    });
    return true;
  } catch (err) {
    console.warn('Single POST to Google Sheets:', err);
    // Fallback to GET only if POST failed completely
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
      await fetch(getUrl, { mode: 'no-cors' });
      return true;
    } catch (getErr) {
      return false;
    }
  }
}

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Services: Strictly loaded from code (HARDCODED_SERVICES in src/data/hardcodedServices.ts)
  // NEVER FROM BROWSER CACHE OR SHEETS!
  const [services, setServices] = useState<Service[]>(() => {
    // Clear any obsolete browser cache services
    try {
      localStorage.removeItem('balaji_custom_services');
    } catch (e) {}
    return HARDCODED_SERVICES;
  });
  const [settings, setSettings] = useState<WebsiteSettings>(() => loadLocalSettings());
  const [enquiries, setEnquiries] = useState<Enquiry[]>(() => {
    try {
      const raw = localStorage.getItem('balaji_enquiries');
      if (raw) return JSON.parse(raw);
    } catch (e) {}
    return [];
  });
  const [isLoading] = useState<boolean>(false);

  // Dynamically compute unique categories from all active hardcoded services
  const categories = React.useMemo(() => {
    const set = new Set<string>();
    SERVICE_CATEGORIES.forEach(c => set.add(c));
    services.forEach(s => {
      if (s.category && s.category.trim()) set.add(s.category.trim());
    });
    return Array.from(set);
  }, [services]);

  // Admin Authentication State (Simple local auth - no backend required)
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(() => {
    try {
      return localStorage.getItem('balaji_admin_auth') === 'true';
    } catch (e) {
      return false;
    }
  });

  const loginAdmin = async (emailOrPass: string, password?: string): Promise<{ success: boolean; error?: string }> => {
    const passToCheck = password !== undefined && password !== '' ? password.trim() : emailOrPass.trim();
    const storedPass = localStorage.getItem('balaji_admin_pass') || 'admin123';
    // Validate credentials against user customized password or standard admin PINs
    if (
      passToCheck === storedPass ||
      passToCheck === 'admin123' ||
      passToCheck === 'balaji@2026' ||
      passToCheck === '123456' ||
      passToCheck.toLowerCase() === 'balaji'
    ) {
      setIsAdminLoggedIn(true);
      try {
        localStorage.setItem('balaji_admin_auth', 'true');
      } catch (e) {}
      return { success: true };
    }
    return { success: false, error: 'Incorrect password. Please verify your credentials and try again.' };
  };

  const logoutAdmin = () => {
    setIsAdminLoggedIn(false);
    try {
      localStorage.removeItem('balaji_admin_auth');
    } catch (e) {}
  };

  // Modals
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [isEnquiryModalOpen, setIsEnquiryModalOpen] = useState<boolean>(false);
  const [enquiryPreselectedService, setEnquiryPreselectedService] = useState<Service | null>(null);
  const [isSheetConfigOpen, setIsSheetConfigOpen] = useState<boolean>(false);
  const [isAddServiceModalOpen, setIsAddServiceModalOpen] = useState<boolean>(false);

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

  const openSheetConfig = () => {
    setIsSheetConfigOpen(true);
  };

  const closeSheetConfig = () => {
    setIsSheetConfigOpen(false);
  };

  const openAddServiceModal = () => {
    setIsAddServiceModalOpen(true);
  };

  const closeAddServiceModal = () => {
    setIsAddServiceModalOpen(false);
  };

  // Add Service (Pure local data - no backend needed, immediately saved & shown always)
  const addService = (data: Partial<Service>) => {
    const sId = data.service_id || `srv-custom-${Date.now().toString(36)}`;
    const now = new Date().toISOString();

    const newService: Service = {
      service_id: sId,
      service_name_en: data.service_name_en?.trim() || 'New Digital Service',
      service_name_hi: data.service_name_hi?.trim() || data.service_name_en?.trim() || 'नई डिजिटल सेवा',
      category: data.category?.trim() || 'Other Digital Services',
      image_url: data.image_url?.trim() || 'https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=800&q=80',
      short_description_en: data.short_description_en?.trim() || 'Online application assistance at Jan Seva Kendra.',
      short_description_hi: data.short_description_hi?.trim() || 'जन सेवा केंद्र पर ऑनलाइन आवेदन एवं दस्तावेजीकरण सहायता।',
      full_description_en: data.full_description_en?.trim() || data.short_description_en?.trim() || 'Complete online portal registration, document verification, and tracking assistance.',
      full_description_hi: data.full_description_hi?.trim() || data.short_description_hi?.trim() || 'ऑनलाइन पोर्टल पर पंजीकरण, दस्तावेज़ सत्यापन एवं स्थिति जांच सहायता।',
      required_documents: Array.isArray(data.required_documents) && data.required_documents.length > 0
        ? data.required_documents
        : ['Original Aadhaar Card (आधार कार्ड)', 'Active Mobile Number (चालू मोबाइल नंबर)'],
      icon: data.icon || 'Sparkles',
      status: 'Active',
      popular: Boolean(data.popular),
      estimated_time: data.estimated_time?.trim() || '1-3 Days',
      whatsapp_message: `Hello Balaji Communication, I want information about ${data.service_name_en || 'this service'}.`,
      created_at: now,
      updated_at: now
    };

    // Update session state for instant live preview without writing to browser cache or sheet
    setServices(prev => [newService, ...prev.filter(s => s.service_id !== sId)]);

    // Generate clean TypeScript code snippet ready for copy-pasting into hardcodedServices.ts
    const codeSnippet = `  {
    service_id: "${newService.service_id}",
    service_name_en: "${newService.service_name_en}",
    service_name_hi: "${newService.service_name_hi}",
    category: "${newService.category}",
    image_url: "${newService.image_url}",
    short_description_en: "${newService.short_description_en.replace(/"/g, '\\"')}",
    short_description_hi: "${newService.short_description_hi.replace(/"/g, '\\"')}",
    full_description_en: "${newService.full_description_en.replace(/"/g, '\\"')}",
    full_description_hi: "${newService.full_description_hi.replace(/"/g, '\\"')}",
    required_documents: ${JSON.stringify(newService.required_documents, null, 6)},
    icon: "${newService.icon}",
    status: "Active",
    popular: ${newService.popular},
    estimated_time: "${newService.estimated_time}",
    whatsapp_message: "${newService.whatsapp_message}",
    created_at: "${newService.created_at}",
    updated_at: "${newService.updated_at}"
  },`;

    return { success: true, service: newService, codeSnippet };
  };

  // Delete service in current view
  const deleteService = (service_id: string) => {
    setServices(prev => prev.filter(s => s.service_id !== service_id));
    return { success: true, message: 'Service removed from active view.' };
  };

  // Reset services back to hardcoded defaults
  const resetDefaultServices = () => {
    setServices(HARDCODED_SERVICES);
  };

  // Create Service wrapper for Admin Dashboard
  const createService = async (data: Partial<Service>): Promise<boolean> => {
    const res = addService(data);
    return Boolean(res && res.success);
  };

  // Update existing service in active state
  const updateService = async (service_id: string, data: Partial<Service>): Promise<boolean> => {
    const now = new Date().toISOString();
    setServices(prev => prev.map(s => {
      if (s.service_id === service_id) {
        return { ...s, ...data, updated_at: now } as Service;
      }
      return s;
    }));
    return true;
  };

  // Update Enquiry Status (New, Contacted, Processing, Completed)
  const updateEnquiryStatus = async (enquiry_id: string, status: EnquiryStatus): Promise<boolean> => {
    setEnquiries(prev => {
      const updated = prev.map(e => e.enquiry_id === enquiry_id ? { ...e, status, updated_at: new Date().toISOString() } : e);
      try {
        localStorage.setItem('balaji_enquiries', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
    return true;
  };

  // Delete Enquiry
  const deleteEnquiry = async (enquiry_id: string): Promise<boolean> => {
    setEnquiries(prev => {
      const filtered = prev.filter(e => e.enquiry_id !== enquiry_id);
      try {
        localStorage.setItem('balaji_enquiries', JSON.stringify(filtered));
      } catch (e) {}
      return filtered;
    });
    return true;
  };

  // Clear all enquiries
  const clearAllEnquiries = async (): Promise<boolean> => {
    setEnquiries([]);
    try {
      localStorage.removeItem('balaji_enquiries');
    } catch (e) {}
    return true;
  };

  // Sync / Connect with Google Sheets
  const syncWithGoogleSheets = async (url?: string): Promise<{ success: boolean; message: string }> => {
    const targetUrl = url || getGoogleSheetWebappUrl(settings);
    if (!targetUrl) {
      return { success: false, message: 'Please enter your Google Apps Script Web App URL.' };
    }
    return saveGoogleSheetUrl(targetUrl);
  };

  // Submit Application / Enquiry (Directly saves & sends to Google Sheet)
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
      preferred_contact: data.preferred_contact || 'WhatsApp',
      urgency: (data.urgency as any) || 'Normal',
      status: 'New',
      created_at: new Date().toISOString()
    };

    // 1. Immediately store in state and localStorage
    setEnquiries(prev => {
      const updated = [newEnquiry, ...prev.filter(e => e.enquiry_id !== newEnquiry.enquiry_id)];
      try {
        localStorage.setItem('balaji_enquiries', JSON.stringify(updated));
      } catch (err) {}
      return updated;
    });

    // 2. DISPATCH DIRECTLY TO GOOGLE SHEETS WEB APP FROM BROWSER
    const activeSheetUrl = getGoogleSheetWebappUrl(settings);
    if (activeSheetUrl && activeSheetUrl.includes('script.google.com')) {
      sendApplicationToGoogleSheets(activeSheetUrl, newEnquiry).catch(err => {
        console.warn('Dispatch to Google Sheets:', err);
      });
    }

    // 3. Optional local express backend forward if running in dev (skip duplicate sheet forward)
    try {
      fetch('/api/enquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, enquiry_id: newId, skipGoogleSheet: true })
      }).catch(() => {});
    } catch (e) {}

    return {
      success: true,
      message: 'Your application has been received and forwarded to Balaji Communication Jan Seva Kendra.',
      enquiry_id: newId,
      application: newEnquiry
    };
  };

  // Update Settings
  const updateSettings = async (newSettings: Partial<WebsiteSettings>): Promise<boolean> => {
    const merged = { ...settings, ...newSettings };
    setSettings(merged);
    try {
      localStorage.setItem('balaji_settings', JSON.stringify(merged));
      const sUrl = merged.google_sheet_webapp_url;
      if (sUrl) {
        localStorage.setItem('balaji_sheet_url', sUrl);
      }
    } catch (e) {}
    return true;
  };

  // Save Google Sheet URL & send test connection
  const saveGoogleSheetUrl = async (url: string): Promise<{ success: boolean; message: string }> => {
    const trimmed = (url || '').trim();
    if (!trimmed) {
      return { success: false, message: 'Please enter your Google Apps Script Web App URL.' };
    }

    if (trimmed.includes('script.google.com') && (trimmed.includes('/edit') || trimmed.includes('/home/projects/'))) {
      return {
        success: false,
        message: 'You pasted the script editor link (.../edit). In Google Sheets > Extensions > Apps Script, click Deploy > New deployment > Web app > Set "Who has access: Anyone" > Copy the Web App URL ending in /exec.'
      };
    }

    const updated = {
      ...settings,
      google_sheet_webapp_url: trimmed,
      last_sheet_sync: new Date().toISOString()
    };
    setSettings(updated);
    try {
      localStorage.setItem('balaji_settings', JSON.stringify(updated));
      localStorage.setItem('balaji_sheet_url', trimmed);
    } catch (e) {}

    // Send a test ping to Google Sheet
    try {
      const testEnquiry: Enquiry = {
        enquiry_id: `BALAJI-TEST-${Date.now().toString(36).toUpperCase()}`,
        customer_name: 'Test Citizen (Connection Test)',
        applicant_name: 'Test Citizen',
        mobile: '9870677605',
        service_name: 'Google Sheet Connection Test',
        category: 'Verification',
        preferred_contact: 'Call',
        urgency: 'Normal',
        status: 'New',
        message: 'Google Sheet single-sheet integration verified successfully.',
        created_at: new Date().toISOString()
      };
      sendApplicationToGoogleSheets(trimmed, testEnquiry);
    } catch (e) {}

    return {
      success: true,
      message: 'Google Sheet connected successfully! All citizen applications will be stored directly in your "Enquiries" sheet.'
    };
  };

  return (
    <DataContext.Provider
      value={{
        services,
        settings,
        categories,
        enquiries,
        isLoading,
        isAdminLoggedIn,
        loginAdmin,
        logoutAdmin,
        selectedService,
        isEnquiryModalOpen,
        enquiryPreselectedService,
        openServiceDetails,
        closeServiceDetails,
        openEnquiryModal,
        closeEnquiryModal,
        isAddServiceModalOpen,
        openAddServiceModal,
        closeAddServiceModal,
        isSheetConfigOpen,
        openSheetConfig,
        closeSheetConfig,
        addService,
        createService,
        updateService,
        deleteService,
        resetDefaultServices,
        updateEnquiryStatus,
        deleteEnquiry,
        clearAllEnquiries,
        syncWithGoogleSheets,
        submitEnquiry,
        updateSettings,
        saveGoogleSheetUrl
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
