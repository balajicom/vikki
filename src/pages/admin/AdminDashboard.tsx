import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Layers,
  Inbox,
  Settings as SettingsIcon,
  FileSpreadsheet,
  Plus,
  Trash2,
  Edit,
  CheckCircle,
  Clock,
  Phone,
  MessageCircle,
  ExternalLink,
  Copy,
  Check,
  LogOut,
  Save,
  AlertCircle,
  Search,
  Eye,
  X,
  CheckCircle2,
  ArrowRight,
  Image as ImageIcon,
  Send,
  Sparkles
} from 'lucide-react';
import { useData, sendApplicationToGoogleSheets } from '../../context/DataContext';
import { Service, Enquiry, WebsiteSettings, EnquiryStatus } from '../../types';
import { getServiceIcon } from '../../utils/iconHelper';
import { GOOGLE_APPS_SCRIPT_CODE } from '../../data/googleAppsScriptCode';

export const AdminDashboard: React.FC = () => {
  const {
    isAdminLoggedIn,
    logoutAdmin,
    services,
    enquiries,
    settings,
    categories,
    clearAllEnquiries,
    addService,
    createService,
    updateService,
    deleteService,
    updateEnquiryStatus,
    deleteEnquiry,
    updateSettings,
    syncWithGoogleSheets,
    openAddServiceModal
  } = useData();

  const navigate = useNavigate();

  // Active Tab: Focused on Services, Citizen Enquiries, Google Sheet Enquiry Store, Center Settings
  const [activeTab, setActiveTab] = useState<'services' | 'enquiries' | 'sheets' | 'settings'>('services');

  // Service Edit / Create Modal State
  const [isServiceModalOpen, setIsServiceModalOpen] = useState(false);
  const [editingServiceId, setEditingServiceId] = useState<string | null>(null);
  const [isSavingService, setIsSavingService] = useState(false);
  const [serviceError, setServiceError] = useState<string | null>(null);
  const [serviceSuccessToast, setServiceSuccessToast] = useState<string | null>(null);
  const [serviceToDelete, setServiceToDelete] = useState<Service | null>(null);
  const [serviceForm, setServiceForm] = useState<Partial<Service>>({
    service_id: '',
    category: 'Aadhaar',
    image_url: '',
    service_name_en: '',
    service_name_hi: '',
    short_description_en: '',
    short_description_hi: '',
    full_description_en: '',
    full_description_hi: '',
    required_documents: [],
    estimated_time: '1 to 3 Working Days',
    status: 'Active',
    popular: false,
    icon: 'CreditCard',
    whatsapp_message: ''
  });
  const [docsInput, setDocsInput] = useState('');

  // Settings Form State
  const [settingsForm, setSettingsForm] = useState<WebsiteSettings>(settings);
  const [settingsSavedMsg, setSettingsSavedMsg] = useState(false);

  // Google Sheets Tab State
  const [sheetsUrlInput, setSheetsUrlInput] = useState(
    settings.google_sheet_webapp_url || (settings as any).google_sheet_web_app_url || (settings as any).google_sheet_url || localStorage.getItem('balaji_sheet_url') || ''
  );
  const [isConnectingSheet, setIsConnectingSheet] = useState(false);
  const [sheetStatusMsg, setSheetStatusMsg] = useState<string | null>(null);
  const [copiedCode, setCopiedCode] = useState(false);
  const [isTestingDispatch, setIsTestingDispatch] = useState(false);
  const [testDispatchSuccess, setTestDispatchSuccess] = useState<string | null>(null);

  // Search & Filters for Enquiries
  const [enquiryFilterStatus, setEnquiryFilterStatus] = useState<string>('All');
  const [enquirySearchTerm, setEnquirySearchTerm] = useState('');
  const [serviceSearchTerm, setServiceSearchTerm] = useState('');
  const [selectedEnquiryForDetails, setSelectedEnquiryForDetails] = useState<Enquiry | null>(null);
  const [enquiryToDelete, setEnquiryToDelete] = useState<Enquiry | null>(null);
  const [isClearEnquiriesModalOpen, setIsClearEnquiriesModalOpen] = useState(false);

  // Protect Admin route
  React.useEffect(() => {
    if (!isAdminLoggedIn) {
      navigate('/admin/login');
    }
  }, [isAdminLoggedIn, navigate]);

  React.useEffect(() => {
    setSettingsForm(settings);
    const activeUrl = settings.google_sheet_webapp_url || (settings as any).google_sheet_web_app_url || (settings as any).google_sheet_url || localStorage.getItem('balaji_sheet_url') || '';
    if (activeUrl) {
      setSheetsUrlInput(activeUrl);
    }
  }, [settings]);

  // Metrics
  const totalServices = services.length;
  const activeServices = services.filter(s => s.status === 'Active').length;
  const totalEnquiries = enquiries.length;
  const pendingEnquiries = enquiries.filter(e => e.status === 'New' || e.status === 'Processing').length;
  const completedEnquiries = enquiries.filter(e => e.status === 'Completed').length;

  // Open Service Add Form
  const handleOpenAddService = () => {
    setEditingServiceId(null);
    setServiceError(null);
    setServiceForm({
      service_id: `srv-${Date.now().toString(36)}`,
      category: categories[0] || 'Aadhaar',
      image_url: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=800&q=80',
      service_name_en: '',
      service_name_hi: '',
      short_description_en: '',
      short_description_hi: '',
      full_description_en: '',
      full_description_hi: '',
      required_documents: ['Original Aadhaar Card', 'Mobile Number'],
      estimated_time: '1 to 3 Working Days',
      status: 'Active',
      popular: false,
      icon: 'CreditCard',
      whatsapp_message: ''
    });
    setDocsInput('Original Aadhaar Card\nMobile Number');
    setIsServiceModalOpen(true);
  };

  // Open Service Edit Form
  const handleOpenEditService = (service: Service) => {
    setEditingServiceId(service.service_id);
    setServiceError(null);
    setServiceForm({ ...service });
    setDocsInput(service.required_documents ? service.required_documents.join('\n') : '');
    setIsServiceModalOpen(true);
  };

  // Save Service (Handles creation and update with image_url)
  const handleSaveService = async (e?: React.FormEvent | React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setServiceError(null);

    const nameEn = serviceForm.service_name_en?.trim() || '';
    const nameHi = serviceForm.service_name_hi?.trim() || '';

    if (!nameEn && !nameHi) {
      setServiceError('Please enter service name in English or Hindi.');
      return;
    }

    const finalNameEn = nameEn || nameHi;
    const finalNameHi = nameHi || nameEn;

    setIsSavingService(true);
    try {
      const docs = docsInput
        .split('\n')
        .map(d => d.trim())
        .filter(d => d.length > 0);

      const serviceData: Service = {
        service_id: editingServiceId || serviceForm.service_id || `srv-${Date.now().toString(36)}`,
        service_name_en: finalNameEn,
        service_name_hi: finalNameHi,
        category: serviceForm.category?.trim() || categories[0] || 'General Services',
        image_url: serviceForm.image_url?.trim() || 'https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=800&q=80',
        short_description_en: serviceForm.short_description_en?.trim() || serviceForm.short_description_hi?.trim() || '',
        short_description_hi: serviceForm.short_description_hi?.trim() || serviceForm.short_description_en?.trim() || '',
        full_description_en: serviceForm.full_description_en?.trim() || serviceForm.short_description_en?.trim() || '',
        full_description_hi: serviceForm.full_description_hi?.trim() || serviceForm.short_description_hi?.trim() || '',
        required_documents: docs.length > 0 ? docs : ['Original Aadhaar Card', 'Mobile Number'],
        icon: serviceForm.icon || 'CreditCard',
        status: (serviceForm.status as 'Active' | 'Disabled') || 'Active',
        popular: Boolean(serviceForm.popular),
        estimated_time: serviceForm.estimated_time?.trim() || '1 to 3 Working Days',
        whatsapp_message: serviceForm.whatsapp_message?.trim() || `Hello Balaji Communication, I want information about ${finalNameEn}.`,
        created_at: serviceForm.created_at || new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      let success = false;
      if (editingServiceId) {
        success = await updateService(editingServiceId, serviceData);
      } else {
        const saver = addService || createService;
        success = await saver(serviceData);
      }

      if (success) {
        setIsServiceModalOpen(false);
        setServiceSuccessToast(editingServiceId ? 'Service updated successfully!' : 'New service added with picture and published live!');
        setTimeout(() => setServiceSuccessToast(null), 4000);
      } else {
        setServiceError('Could not save service. Please verify fields and try again.');
      }
    } catch (err: any) {
      console.error('Error saving service:', err);
      setServiceError(err.message || 'An error occurred while saving service.');
    } finally {
      setIsSavingService(false);
    }
  };

  // Toggle Service Active status directly
  const handleToggleServiceStatus = async (service: Service) => {
    const updatedStatus = service.status === 'Active' ? 'Disabled' : 'Active';
    await updateService(service.service_id, { ...service, status: updatedStatus });
    setServiceSuccessToast(`Service "${service.service_name_en}" marked as ${updatedStatus}.`);
    setTimeout(() => setServiceSuccessToast(null), 3000);
  };

  // Delete Service
  const handleConfirmDeleteService = async () => {
    if (!serviceToDelete) return;
    const name = serviceToDelete.service_name_en;
    await deleteService(serviceToDelete.service_id);
    setServiceToDelete(null);
    setServiceSuccessToast(`Service "${name}" deleted.`);
    setTimeout(() => setServiceSuccessToast(null), 3000);
  };

  // Save Site Settings
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await updateSettings(settingsForm);
    if (res) {
      setSettingsSavedMsg(true);
      setTimeout(() => setSettingsSavedMsg(false), 3000);
    }
  };

  // Connect Google Sheet for Enquiries
  const handleConnectSheet = async () => {
    setIsConnectingSheet(true);
    setSheetStatusMsg(null);
    const trimmed = sheetsUrlInput.trim();
    if (trimmed) {
      await updateSettings({
        google_sheet_webapp_url: trimmed,
        google_sheet_url: trimmed
      });
      try {
        localStorage.setItem('balaji_sheet_url', trimmed);
      } catch (e) {}
    }
    const res = await syncWithGoogleSheets(trimmed);
    setIsConnectingSheet(false);
    setSheetStatusMsg(res.message);
  };

  // Send Test Enquiry to Google Sheet
  const handleSendTestEnquiry = async () => {
    const targetUrl = sheetsUrlInput.trim();
    if (!targetUrl || !targetUrl.includes('script.google.com')) {
      setTestDispatchSuccess('Please enter a valid Google Apps Script Web App URL ending in /exec first.');
      return;
    }
    setIsTestingDispatch(true);
    setTestDispatchSuccess(null);
    const testEnquiry: Enquiry = {
      enquiry_id: `BALAJI-TEST-${Date.now().toString(36).toUpperCase()}`,
      customer_name: 'Test Citizen (Enquiry Storage Verification)',
      applicant_name: 'Test Citizen',
      mobile: '9870677605',
      service_name: 'Aadhaar Card Service Test',
      category: 'Aadhaar',
      village: 'Gaini',
      address: 'Near Masjid, Gaini, Bareilly',
      message: 'This is a test enquiry verifying that user enquiries are stored directly in your single Google Sheet.',
      preferred_contact: 'Call',
      urgency: 'Normal',
      status: 'New',
      created_at: new Date().toISOString()
    };

    const sent = await sendApplicationToGoogleSheets(targetUrl, testEnquiry);
    setIsTestingDispatch(false);
    if (sent) {
      setTestDispatchSuccess(`Test enquiry dispatched! Check your Google Sheet "Enquiries" tab for Reference ID: ${testEnquiry.enquiry_id}`);
    } else {
      setTestDispatchSuccess('Could not send test enquiry. Please verify your Web App URL has "Who has access: Anyone".');
    }
  };

  const handleCopyScriptCode = () => {
    navigator.clipboard.writeText(GOOGLE_APPS_SCRIPT_CODE);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 3000);
  };

  // Filtered Services
  const filteredServices = services.filter(s => {
    if (!serviceSearchTerm.trim()) return true;
    const q = serviceSearchTerm.toLowerCase();
    return (
      (s.service_name_en || '').toLowerCase().includes(q) ||
      (s.service_name_hi || '').toLowerCase().includes(q) ||
      (s.category || '').toLowerCase().includes(q)
    );
  });

  // Filtered Enquiries
  const filteredEnquiries = enquiries.filter(enq => {
    const matchesStatus = enquiryFilterStatus === 'All' || enq.status === enquiryFilterStatus;
    const matchesSearch = !enquirySearchTerm.trim() ||
      (enq.customer_name || '').toLowerCase().includes(enquirySearchTerm.toLowerCase()) ||
      (enq.applicant_name || '').toLowerCase().includes(enquirySearchTerm.toLowerCase()) ||
      (enq.mobile || '').includes(enquirySearchTerm) ||
      (enq.service_name || '').toLowerCase().includes(enquirySearchTerm.toLowerCase()) ||
      (enq.enquiry_id || '').toLowerCase().includes(enquirySearchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <div id="admin-dashboard-page" className="min-h-screen bg-slate-100 pb-16">
      {/* Top Navbar */}
      <header className="bg-slate-900 text-white sticky top-0 z-30 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link to="/" className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-base shadow-xs hover:bg-blue-500 transition-colors">
              BC
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-extrabold text-sm sm:text-base tracking-tight text-white">
                  Balaji Admin Control Center
                </h1>
                <span className="px-2 py-0.5 text-[10px] font-bold bg-amber-400 text-slate-950 rounded uppercase tracking-wider">
                  Admin
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">
                Jan Seva Kendra Services & Single-Sheet Enquiry Management
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/"
              className="text-xs font-semibold text-slate-300 hover:text-white flex items-center gap-1.5 transition-colors hidden sm:flex"
            >
              <span>View Portal</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
            <button
              type="button"
              onClick={logoutAdmin}
              className="px-3 py-1.5 bg-slate-800 hover:bg-rose-900/60 text-slate-200 hover:text-white text-xs font-bold rounded-lg border border-slate-700 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        
        {/* Metric Cards Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-2xs">
            <span className="text-xs text-slate-500 font-bold block">Total Services</span>
            <div className="flex items-baseline justify-between mt-1">
              <span className="text-2xl sm:text-3xl font-black text-slate-900">{totalServices}</span>
              <Layers className="w-5 h-5 text-blue-600 opacity-60" />
            </div>
          </div>

          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-2xs">
            <span className="text-xs text-slate-500 font-bold block">Active Services</span>
            <div className="flex items-baseline justify-between mt-1">
              <span className="text-2xl sm:text-3xl font-black text-emerald-700">{activeServices}</span>
              <CheckCircle className="w-5 h-5 text-emerald-600 opacity-60" />
            </div>
          </div>

          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-2xs">
            <span className="text-xs text-slate-500 font-bold block">Citizen Enquiries</span>
            <div className="flex items-baseline justify-between mt-1">
              <span className="text-2xl sm:text-3xl font-black text-slate-900">{totalEnquiries}</span>
              <Inbox className="w-5 h-5 text-indigo-600 opacity-60" />
            </div>
          </div>

          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-2xs">
            <span className="text-xs text-slate-500 font-bold block">Pending / New</span>
            <div className="flex items-baseline justify-between mt-1">
              <span className="text-2xl sm:text-3xl font-black text-amber-600">{pendingEnquiries}</span>
              <Clock className="w-5 h-5 text-amber-500 opacity-60" />
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-2xl border border-slate-200 p-1.5 flex gap-1.5 overflow-x-auto shadow-2xs">
          <button
            type="button"
            id="tab-services"
            onClick={() => setActiveTab('services')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'services'
                ? 'bg-blue-700 text-white shadow-xs'
                : 'text-slate-700 hover:bg-slate-100'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Services Management ({totalServices})</span>
          </button>

          <button
            type="button"
            id="tab-enquiries"
            onClick={() => setActiveTab('enquiries')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'enquiries'
                ? 'bg-blue-700 text-white shadow-xs'
                : 'text-slate-700 hover:bg-slate-100'
            }`}
          >
            <Inbox className="w-4 h-4" />
            <span>Citizen Enquiries ({enquiries.length})</span>
          </button>

          <button
            type="button"
            id="tab-sheets"
            onClick={() => setActiveTab('sheets')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'sheets'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'text-slate-700 hover:bg-slate-100'
            }`}
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Google Sheet Enquiry Store</span>
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
              activeTab === 'sheets' ? 'bg-white/20 text-white' : 'bg-emerald-100 text-emerald-800'
            }`}>
              Single Sheet
            </span>
          </button>

          <button
            type="button"
            id="tab-settings"
            onClick={() => setActiveTab('settings')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'settings'
                ? 'bg-blue-700 text-white shadow-xs'
                : 'text-slate-700 hover:bg-slate-100'
            }`}
          >
            <SettingsIcon className="w-4 h-4" />
            <span>Center Settings</span>
          </button>
        </div>

        {/* TAB 1: SERVICES MANAGEMENT (WITH PICTURES & ADD/EDIT SERVICE) */}
        {activeTab === 'services' && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-6">
            {serviceSuccessToast && (
              <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-bold flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{serviceSuccessToast}</span>
                </div>
                <button type="button" onClick={() => setServiceSuccessToast(null)} className="text-emerald-700 font-bold">✕</button>
              </div>
            )}

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
              <div>
                <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <span>Services Catalog & Photos</span>
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800">
                    {totalServices} Total Services
                  </span>
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Services are hardcoded directly in the codebase (<code className="text-blue-700">src/data/hardcodedServices.ts</code>) — not in browser cache or sheets. Add new services here to generate code.
                </p>
              </div>

              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  id="btn-add-service-open"
                  onClick={openAddServiceModal}
                  className="px-4 py-2.5 bg-blue-700 hover:bg-blue-800 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-xs transition-colors cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>+ Add Service &amp; Generate Code</span>
                </button>
              </div>
            </div>

            {/* Instant Filter Search */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                placeholder="Search services by name or category..."
                value={serviceSearchTerm}
                onChange={(e) => setServiceSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:bg-white focus:border-blue-500"
              />
            </div>

            {/* Services Table with Pictures */}
            <div className="overflow-x-auto border border-slate-200 rounded-2xl">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200 uppercase tracking-wider text-[11px]">
                  <tr>
                    <th className="p-3.5">Picture & Service Name</th>
                    <th className="p-3.5">Category</th>
                    <th className="p-3.5">Est. Time</th>
                    <th className="p-3.5">Popular</th>
                    <th className="p-3.5">Status</th>
                    <th className="p-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredServices.length > 0 ? (
                    filteredServices.map((service) => (
                      <tr key={service.service_id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="p-3.5">
                          <div className="flex items-center gap-3">
                            <div className="w-14 h-10 rounded-lg overflow-hidden bg-slate-200 shrink-0 border border-slate-300">
                              <img
                                src={service.image_url || 'https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=600&q=80'}
                                alt={service.service_name_en}
                                className="w-full h-full object-cover"
                                onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }}
                              />
                            </div>
                            <div>
                              <div className="font-bold text-slate-900 text-sm">
                                {service.service_name_en}
                              </div>
                              <div className="text-[11px] text-slate-500 font-medium">
                                {service.service_name_hi}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="p-3.5">
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
                            {service.category}
                          </span>
                        </td>
                        <td className="p-3.5 text-slate-600 font-medium">
                          {service.estimated_time || '1 to 3 Days'}
                        </td>
                        <td className="p-3.5">
                          {service.popular ? (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                              ★ Popular
                            </span>
                          ) : (
                            <span className="text-[11px] text-slate-400">—</span>
                          )}
                        </td>
                        <td className="p-3.5">
                          <button
                            type="button"
                            onClick={() => handleToggleServiceStatus(service)}
                            className={`px-2.5 py-1 rounded-full text-[10px] font-bold cursor-pointer transition-colors ${
                              service.status === 'Active'
                                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100'
                                : 'bg-slate-100 text-slate-500 border border-slate-200 hover:bg-slate-200'
                            }`}
                          >
                            {service.status === 'Active' ? '● Active' : '○ Disabled'}
                          </button>
                        </td>
                        <td className="p-3.5 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              type="button"
                              onClick={() => handleOpenEditService(service)}
                              className="p-1.5 text-blue-700 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                              title="Edit Service"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => setServiceToDelete(service)}
                              className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                              title="Delete Service"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="text-center py-8 text-slate-500">
                        No services matching "{serviceSearchTerm}".
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 2: CITIZEN ENQUIRIES & APPLICATIONS */}
        {activeTab === 'enquiries' && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
              <div>
                <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <span>Citizen Enquiries & Online Applications</span>
                  <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-indigo-100 text-indigo-800">
                    {enquiries.length} Enquiries
                  </span>
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  User enquiries received from the website. Also automatically stored in your single Google Sheet ("Enquiries").
                </p>
              </div>

              <div className="flex items-center gap-2.5 flex-wrap">
                <select
                  value={enquiryFilterStatus}
                  onChange={(e) => setEnquiryFilterStatus(e.target.value)}
                  className="px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none"
                >
                  <option value="All">All Statuses ({enquiries.length})</option>
                  <option value="New">New ({enquiries.filter(e => e.status === 'New').length})</option>
                  <option value="Processing">Processing ({enquiries.filter(e => e.status === 'Processing').length})</option>
                  <option value="Completed">Completed ({enquiries.filter(e => e.status === 'Completed').length})</option>
                  <option value="Cancelled">Cancelled ({enquiries.filter(e => e.status === 'Cancelled').length})</option>
                </select>

                {enquiries.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setIsClearEnquiriesModalOpen(true)}
                    className="px-3 py-2 text-xs font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-xl transition-colors cursor-pointer"
                  >
                    Clear All
                  </button>
                )}
              </div>
            </div>

            {/* Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                placeholder="Search enquiries by Reference ID, citizen name, phone number, or service..."
                value={enquirySearchTerm}
                onChange={(e) => setEnquirySearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:bg-white focus:border-blue-500"
              />
            </div>

            {/* Enquiries Table */}
            <div className="overflow-x-auto border border-slate-200 rounded-2xl">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200 uppercase tracking-wider text-[11px]">
                  <tr>
                    <th className="p-3.5">Ref ID & Citizen Name</th>
                    <th className="p-3.5">Mobile & Contact</th>
                    <th className="p-3.5">Service Requested</th>
                    <th className="p-3.5">Date & Time</th>
                    <th className="p-3.5">Status</th>
                    <th className="p-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredEnquiries.length > 0 ? (
                    filteredEnquiries.map((enq) => {
                      const cleanPhone = (enq.mobile || '').replace(/\D/g, '').slice(-10);
                      return (
                        <tr key={enq.enquiry_id} className="hover:bg-slate-50/80 transition-colors">
                          <td className="p-3.5">
                            <span className="font-mono text-[10px] text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-200 block w-fit mb-1 font-bold">
                              {enq.enquiry_id}
                            </span>
                            <div className="font-bold text-slate-900 text-sm">
                              {enq.customer_name || enq.applicant_name}
                            </div>
                            {enq.village && (
                              <div className="text-[11px] text-slate-500">
                                Village: {enq.village}
                              </div>
                            )}
                          </td>

                          <td className="p-3.5">
                            <div className="font-mono text-slate-900 font-bold mb-1">
                              {enq.mobile}
                            </div>
                            <div className="flex items-center gap-2">
                              <a
                                href={`tel:${cleanPhone}`}
                                className="px-2 py-0.5 text-[10px] font-bold bg-blue-50 hover:bg-blue-100 text-blue-700 rounded border border-blue-200 flex items-center gap-1"
                              >
                                <Phone className="w-3 h-3" />
                                <span>Call</span>
                              </a>
                              <a
                                href={`https://wa.me/91${cleanPhone}?text=${encodeURIComponent(`Hello ${enq.customer_name}, regarding your application for ${enq.service_name} at Balaji Communication Jan Seva Kendra:`)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-2 py-0.5 text-[10px] font-bold bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded border border-emerald-200 flex items-center gap-1"
                              >
                                <MessageCircle className="w-3 h-3 fill-emerald-600 text-white" />
                                <span>WhatsApp</span>
                              </a>
                            </div>
                          </td>

                          <td className="p-3.5">
                            <div className="font-semibold text-slate-900">
                              {enq.service_name}
                            </div>
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200 inline-block mt-0.5">
                              {enq.category || 'General'}
                            </span>
                          </td>

                          <td className="p-3.5 text-slate-500 text-[11px]">
                            {enq.created_at ? new Date(enq.created_at).toLocaleString() : '—'}
                          </td>

                          <td className="p-3.5">
                            <select
                              value={enq.status || 'New'}
                              onChange={(e) => updateEnquiryStatus(enq.enquiry_id, e.target.value as EnquiryStatus)}
                              className={`px-2.5 py-1 rounded-lg text-xs font-bold border focus:outline-none ${
                                enq.status === 'New'
                                  ? 'bg-blue-50 text-blue-800 border-blue-300'
                                  : enq.status === 'Completed'
                                  ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                                  : enq.status === 'Processing'
                                  ? 'bg-indigo-50 text-indigo-800 border-indigo-300'
                                  : 'bg-rose-50 text-rose-800 border-rose-300'
                              }`}
                            >
                              <option value="New">New (आवेदन प्राप्त)</option>
                              <option value="Processing">Processing (प्रक्रियाधीन)</option>
                              <option value="Completed">Completed (कार्य पूर्ण)</option>
                              <option value="Cancelled">Cancelled (निरस्त)</option>
                            </select>
                          </td>

                          <td className="p-3.5 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                type="button"
                                onClick={() => setSelectedEnquiryForDetails(enq)}
                                className="p-1.5 text-blue-700 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                                title="View Details"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                              <button
                                type="button"
                                onClick={() => setEnquiryToDelete(enq)}
                                className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                                title="Delete Enquiry"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={6} className="text-center py-10 text-slate-500">
                        No enquiries found. All user submissions will appear here.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: GOOGLE SHEETS ENQUIRY STORE (SINGLE SHEET ONLY) */}
        {activeTab === 'sheets' && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-4">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-2">
                    <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Single-Sheet Citizen Enquiry Database</span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                    Google Sheet Setup for User Enquiries
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl leading-relaxed">
                    Google Sheets is used exclusively to store incoming citizen enquiries and online applications in a single sheet named <strong>"Enquiries"</strong>. No other data is fetched from Google Sheets.
                  </p>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  <a
                    href="https://sheets.new"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-4 py-2.5 text-xs font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-xl transition-colors cursor-pointer shadow-2xs"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Open sheets.new</span>
                  </a>
                  <button
                    type="button"
                    onClick={handleCopyScriptCode}
                    className="inline-flex items-center gap-1.5 px-4 py-2.5 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-colors cursor-pointer shadow-2xs"
                  >
                    {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedCode ? 'Code Copied!' : 'Copy Apps Script Code'}</span>
                  </button>
                </div>
              </div>

              {/* Quick 3-Step Setup Instructions */}
              <div className="bg-slate-50 rounded-2xl p-4 sm:p-5 border border-slate-200 space-y-2.5 text-xs text-slate-700">
                <span className="font-extrabold text-slate-900 block text-xs uppercase tracking-wider text-blue-700">
                  Quick 2-Minute Google Sheet Setup:
                </span>
                <ol className="list-decimal pl-4 space-y-1.5 text-slate-600 font-medium">
                  <li>Open your Google Sheet at <a href="https://sheets.new" target="_blank" rel="noopener noreferrer" className="text-blue-600 font-bold underline">sheets.new</a>. In menu, click <strong>Extensions &gt; Apps Script</strong>.</li>
                  <li>Click <strong>Copy Apps Script Code</strong> above, paste it into <code>Code.gs</code>, and click Save (💾).</li>
                  <li>In Apps Script toolbar dropdown, select <strong>setupEnquiriesSheet</strong> and click <strong>Run (▶)</strong> to authorize permissions and create the "Enquiries" sheet.</li>
                  <li>Click <strong>Deploy &gt; New deployment</strong>, select <strong>Web app</strong>, set <strong>Who has access: "Anyone"</strong>, click Deploy, and copy the Web App URL (ends with <code>/exec</code>).</li>
                  <li>Paste the Web App URL below and click <strong>Save &amp; Connect Google Sheet</strong>!</li>
                </ol>
              </div>

              {/* URL Input & Connect Action */}
              <div className="space-y-3 pt-2">
                <label className="block text-xs font-bold text-slate-800">
                  Google Apps Script Web App URL (/exec)
                </label>
                <div className="flex flex-col sm:flex-row gap-2.5">
                  <input
                    type="url"
                    value={sheetsUrlInput}
                    onChange={(e) => setSheetsUrlInput(e.target.value)}
                    placeholder="https://script.google.com/macros/s/.../exec"
                    className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 font-mono focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500"
                  />
                  <button
                    type="button"
                    onClick={handleConnectSheet}
                    disabled={isConnectingSheet}
                    className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer shadow-xs shrink-0 disabled:opacity-60 flex items-center justify-center gap-2"
                  >
                    {isConnectingSheet ? (
                      <>
                        <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Connecting...</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle className="w-4 h-4" />
                        <span>Save &amp; Connect</span>
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={handleSendTestEnquiry}
                    disabled={isTestingDispatch}
                    className="px-4 py-2.5 bg-blue-700 hover:bg-blue-800 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer shadow-xs shrink-0 disabled:opacity-60 flex items-center justify-center gap-1.5"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Send Test Enquiry</span>
                  </button>
                </div>

                {sheetStatusMsg && (
                  <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-semibold flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{sheetStatusMsg}</span>
                  </div>
                )}

                {testDispatchSuccess && (
                  <div className="p-3 bg-blue-50 border border-blue-200 text-blue-800 rounded-xl text-xs font-semibold flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                    <span>{testDispatchSuccess}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: CENTER SETTINGS */}
        {activeTab === 'settings' && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-6">
            <div className="border-b border-slate-100 pb-4">
              <h2 className="text-lg font-bold text-slate-900">
                Center Information & Contact Details
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Update Jan Seva Kendra name, phone numbers, WhatsApp helpline, and shop address.
              </p>
            </div>

            {settingsSavedMsg && (
              <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-bold flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Settings saved successfully!</span>
              </div>
            )}

            <form onSubmit={handleSaveSettings} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Center Name (English)
                  </label>
                  <input
                    type="text"
                    value={settingsForm.business_name_en || ''}
                    onChange={(e) => setSettingsForm({ ...settingsForm, business_name_en: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Center Name (Hindi)
                  </label>
                  <input
                    type="text"
                    value={settingsForm.business_name_hi || ''}
                    onChange={(e) => setSettingsForm({ ...settingsForm, business_name_hi: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Helpline Phone Number
                  </label>
                  <input
                    type="text"
                    value={settingsForm.phone_number || ''}
                    onChange={(e) => setSettingsForm({ ...settingsForm, phone_number: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    WhatsApp Number
                  </label>
                  <input
                    type="text"
                    value={settingsForm.whatsapp_number || ''}
                    onChange={(e) => setSettingsForm({ ...settingsForm, whatsapp_number: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={settingsForm.email || ''}
                    onChange={(e) => setSettingsForm({ ...settingsForm, email: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Address (English)
                  </label>
                  <textarea
                    rows={2}
                    value={settingsForm.address_en || ''}
                    onChange={(e) => setSettingsForm({ ...settingsForm, address_en: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Address (Hindi)
                  </label>
                  <textarea
                    rows={2}
                    value={settingsForm.address_hi || ''}
                    onChange={(e) => setSettingsForm({ ...settingsForm, address_hi: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Opening Hours (English)
                  </label>
                  <input
                    type="text"
                    value={settingsForm.opening_hours_en || ''}
                    onChange={(e) => setSettingsForm({ ...settingsForm, opening_hours_en: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Opening Hours (Hindi)
                  </label>
                  <input
                    type="text"
                    value={settingsForm.opening_hours_hi || ''}
                    onChange={(e) => setSettingsForm({ ...settingsForm, opening_hours_hi: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-blue-700 hover:bg-blue-800 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-xs transition-colors cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Center Settings</span>
                </button>
              </div>
            </form>
          </div>
        )}

      </div>

      {/* SERVICE ADD / EDIT MODAL (WITH PICTURE URL & LIVE PREVIEW) */}
      {isServiceModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 space-y-5 my-8 shadow-2xl border border-slate-200">
            <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Layers className="w-4 h-4 text-blue-600" />
                <span>{editingServiceId ? 'Edit Service & Picture' : 'Add New Service (Instant Publish)'}</span>
              </h3>
              <button
                type="button"
                onClick={() => setIsServiceModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 text-sm font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            {serviceError && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs font-semibold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{serviceError}</span>
              </div>
            )}

            <form onSubmit={(e) => { e.preventDefault(); e.stopPropagation(); handleSaveService(e); }} className="space-y-4">
              
              {/* Picture URL & Live Preview */}
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-2">
                <label className="block text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <ImageIcon className="w-3.5 h-3.5 text-blue-600" />
                  <span>Service Picture URL (Photo displayed on Portal)</span>
                </label>
                <div className="flex gap-3 items-center">
                  <input
                    type="url"
                    value={serviceForm.image_url || ''}
                    onChange={(e) => setServiceForm({ ...serviceForm, image_url: e.target.value })}
                    placeholder="https://images.unsplash.com/... or any photo URL"
                    className="flex-1 px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-none focus:border-blue-500"
                  />
                  {serviceForm.image_url ? (
                    <div className="w-16 h-12 rounded-lg overflow-hidden border border-slate-300 shrink-0 bg-slate-200 shadow-2xs">
                      <img
                        src={serviceForm.image_url}
                        alt="Preview"
                        className="w-full h-full object-cover"
                        onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }}
                      />
                    </div>
                  ) : (
                    <span className="text-[10px] text-slate-400 italic shrink-0">Default photo used if empty</span>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Service Name (English) *
                  </label>
                  <input
                    type="text"
                    required
                    value={serviceForm.service_name_en || ''}
                    onChange={(e) => setServiceForm({ ...serviceForm, service_name_en: e.target.value })}
                    placeholder="e.g. Aadhaar Address Update"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Service Name (Hindi) *
                  </label>
                  <input
                    type="text"
                    required
                    value={serviceForm.service_name_hi || ''}
                    onChange={(e) => setServiceForm({ ...serviceForm, service_name_hi: e.target.value })}
                    placeholder="उदा. आधार पता सुधार"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Category *
                  </label>
                  <input
                    type="text"
                    required
                    value={serviceForm.category || ''}
                    onChange={(e) => setServiceForm({ ...serviceForm, category: e.target.value })}
                    placeholder="Aadhaar, Ration Card, etc."
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Icon
                  </label>
                  <select
                    value={serviceForm.icon || 'CreditCard'}
                    onChange={(e) => setServiceForm({ ...serviceForm, icon: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs"
                  >
                    <option value="CreditCard">CreditCard (ID / PVC Plastic)</option>
                    <option value="FileText">FileText (Certificates / Form)</option>
                    <option value="Heart">Heart (Ayushman Health)</option>
                    <option value="Users">Users (Family / Ration / Voter)</option>
                    <option value="CheckCircle">CheckCircle (Verification)</option>
                    <option value="Smartphone">Smartphone (Mobile)</option>
                    <option value="Printer">Printer (Print / Photo)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Status
                  </label>
                  <select
                    value={serviceForm.status || 'Active'}
                    onChange={(e) => setServiceForm({ ...serviceForm, status: e.target.value as any })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs"
                  >
                    <option value="Active">Active (Visible)</option>
                    <option value="Disabled">Disabled (Hidden)</option>
                  </select>
                </div>
              </div>

              {/* Short Descriptions */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Short Description (English)
                  </label>
                  <input
                    type="text"
                    value={serviceForm.short_description_en || ''}
                    onChange={(e) => setServiceForm({ ...serviceForm, short_description_en: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Short Description (Hindi)
                  </label>
                  <input
                    type="text"
                    value={serviceForm.short_description_hi || ''}
                    onChange={(e) => setServiceForm({ ...serviceForm, short_description_hi: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs"
                  />
                </div>
              </div>

              {/* Required Documents */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Required Documents (Enter each document on a NEW line)
                </label>
                <textarea
                  rows={2}
                  value={docsInput}
                  onChange={(e) => setDocsInput(e.target.value)}
                  placeholder="Original Aadhaar Card&#10;Registered Mobile Number"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-mono"
                />
              </div>

              {/* Estimated Time & Popular Checkbox */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Estimated Time (e.g. 1 to 3 Working Days)
                  </label>
                  <input
                    type="text"
                    value={serviceForm.estimated_time || ''}
                    onChange={(e) => setServiceForm({ ...serviceForm, estimated_time: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs"
                  />
                </div>
                <div className="pt-4">
                  <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-800">
                    <input
                      type="checkbox"
                      checked={serviceForm.popular || false}
                      onChange={(e) => setServiceForm({ ...serviceForm, popular: e.target.checked })}
                      className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
                    />
                    <span>Highlight as "Popular Service" on Homepage</span>
                  </label>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  disabled={isSavingService}
                  onClick={() => setIsServiceModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSavingService}
                  className="px-5 py-2.5 bg-blue-700 hover:bg-blue-800 text-white rounded-xl text-xs font-bold shadow-xs transition-colors cursor-pointer flex items-center gap-2 disabled:opacity-60"
                >
                  {isSavingService ? (
                    <>
                      <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      <span>{editingServiceId ? 'Update Service' : 'Publish Service Live'}</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE SERVICE CONFIRMATION MODAL */}
      {serviceToDelete && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 space-y-4 shadow-xl border border-slate-200">
            <h3 className="text-base font-bold text-slate-900">Delete Service</h3>
            <p className="text-xs text-slate-600">
              Are you sure you want to delete <strong>"{serviceToDelete.service_name_en}"</strong>? This will remove it from the website immediately.
            </p>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setServiceToDelete(null)}
                className="px-3.5 py-2 text-xs font-bold text-slate-700 hover:bg-slate-100 rounded-xl"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDeleteService}
                className="px-4 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ENQUIRY DETAILS MODAL */}
      {selectedEnquiryForDetails && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="font-mono text-xs text-blue-700 font-bold bg-blue-50 px-2 py-0.5 rounded">
                  {selectedEnquiryForDetails.enquiry_id}
                </span>
                <h3 className="text-base font-bold text-slate-900 mt-1">
                  {selectedEnquiryForDetails.customer_name || selectedEnquiryForDetails.applicant_name}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedEnquiryForDetails(null)}
                className="text-slate-400 hover:text-slate-700 font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-700">
              <div className="grid grid-cols-2 gap-3 bg-slate-50 p-3 rounded-xl">
                <div>
                  <span className="font-bold text-slate-500 block">Mobile:</span>
                  <span className="font-mono text-slate-900 font-bold">{selectedEnquiryForDetails.mobile}</span>
                </div>
                <div>
                  <span className="font-bold text-slate-500 block">Service:</span>
                  <span className="font-bold text-slate-900">{selectedEnquiryForDetails.service_name}</span>
                </div>
                <div>
                  <span className="font-bold text-slate-500 block">Category:</span>
                  <span>{selectedEnquiryForDetails.category || 'General'}</span>
                </div>
                <div>
                  <span className="font-bold text-slate-500 block">Preferred Contact:</span>
                  <span>{selectedEnquiryForDetails.preferred_contact || 'Call'}</span>
                </div>
              </div>

              {selectedEnquiryForDetails.address && (
                <div>
                  <span className="font-bold text-slate-500 block">Address:</span>
                  <p className="text-slate-800">{selectedEnquiryForDetails.address}</p>
                </div>
              )}

              {selectedEnquiryForDetails.message && (
                <div>
                  <span className="font-bold text-slate-500 block">Message / Query:</span>
                  <p className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-slate-800">
                    {selectedEnquiryForDetails.message}
                  </p>
                </div>
              )}
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setSelectedEnquiryForDetails(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DELETE ENQUIRY CONFIRMATION MODAL */}
      {enquiryToDelete && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 space-y-4 shadow-xl border border-slate-200">
            <h3 className="text-base font-bold text-slate-900">Delete Citizen Enquiry</h3>
            <p className="text-xs text-slate-600">
              Are you sure you want to delete enquiry <strong>{enquiryToDelete.enquiry_id}</strong>?
            </p>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setEnquiryToDelete(null)}
                className="px-3.5 py-2 text-xs font-bold text-slate-700 hover:bg-slate-100 rounded-xl"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={async () => {
                  await deleteEnquiry(enquiryToDelete.enquiry_id);
                  setEnquiryToDelete(null);
                }}
                className="px-4 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CLEAR ALL ENQUIRIES CONFIRMATION MODAL */}
      {isClearEnquiriesModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 space-y-4 shadow-xl border border-slate-200">
            <h3 className="text-base font-bold text-slate-900">Clear All Enquiries</h3>
            <p className="text-xs text-slate-600">
              This will remove all {enquiries.length} stored enquiries from the local list. Existing records in Google Sheets will remain safe.
            </p>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsClearEnquiriesModalOpen(false)}
                className="px-3.5 py-2 text-xs font-bold text-slate-700 hover:bg-slate-100 rounded-xl"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={async () => {
                  await clearAllEnquiries();
                  setIsClearEnquiriesModalOpen(false);
                }}
                className="px-4 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl"
              >
                Clear All
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
