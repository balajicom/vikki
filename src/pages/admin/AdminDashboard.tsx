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
  RefreshCw,
  LogOut,
  Save,
  AlertTriangle,
  AlertCircle,
  Search,
  Eye,
  EyeOff,
  Download,
  UploadCloud,
  Table,
  FileText,
  CheckCircle2,
  HelpCircle,
  ArrowRight,
  Sparkles,
  CreditCard,
  Users,
  Heart,
  Smartphone,
  X
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import { Service, Enquiry, SiteSettings, SheetTemplateInfo } from '../../types';
import { getServiceIcon } from '../../utils/iconHelper';
import { GOOGLE_APPS_SCRIPT_CODE } from '../../data/googleAppsScriptCode';
import { SHEET_TEMPLATES, downloadCsvTemplate, generateTabSeparatedContent } from '../../data/sheetTemplates';

export const AdminDashboard: React.FC = () => {
  const {
    isAdminLoggedIn,
    logoutAdmin,
    services,
    enquiries,
    settings,
    categories,
    addService,
    createService,
    updateService,
    deleteService,
    updateEnquiryStatus,
    deleteEnquiry,
    updateSettings,
    syncWithGoogleSheets,
    importCsvData
  } = useData();

  const navigate = useNavigate();

  // Active Tab
  const [activeTab, setActiveTab] = useState<'services' | 'enquiries' | 'settings' | 'sheets'>('services');

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
  const [settingsForm, setSettingsForm] = useState<SiteSettings>(settings);
  const [settingsSavedMsg, setSettingsSavedMsg] = useState(false);

  // Google Sheets Tab State
  const [sheetsUrlInput, setSheetsUrlInput] = useState(settings.google_sheet_web_app_url || '');
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncStatusMsg, setSyncStatusMsg] = useState<string | null>(null);
  const [copiedCode, setCopiedCode] = useState(false);

  // Google Sheet & CSV Templates State
  const [selectedTemplateForPreview, setSelectedTemplateForPreview] = useState<SheetTemplateInfo | null>(null);
  const [copiedTemplateId, setCopiedTemplateId] = useState<string | null>(null);
  const [isImportingFile, setIsImportingFile] = useState(false);
  const [activeImportingId, setActiveImportingId] = useState<string | null>(null);
  const [importStatusBanner, setImportStatusBanner] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [templateFilterCategory, setTemplateFilterCategory] = useState<string>('all');

  // Search & Filters for Enquiries & Citizen Details Modal
  const [enquiryFilterStatus, setEnquiryFilterStatus] = useState<string>('All');
  const [serviceSearchTerm, setServiceSearchTerm] = useState('');
  const [selectedEnquiryForDetails, setSelectedEnquiryForDetails] = useState<Enquiry | null>(null);

  // Protect Admin route
  React.useEffect(() => {
    if (!isAdminLoggedIn) {
      navigate('/admin/login');
    }
  }, [isAdminLoggedIn, navigate]);

  React.useEffect(() => {
    setSettingsForm(settings);
    setSheetsUrlInput(settings.google_sheet_web_app_url || '');
  }, [settings]);

  // Metrics Calculations
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
      category: categories[0] || 'General Services',
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
    setDocsInput('');
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

  // Save Service
  const handleSaveService = async (e: React.FormEvent) => {
    e.preventDefault();
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
        short_description_en: serviceForm.short_description_en?.trim() || serviceForm.short_description_hi?.trim() || '',
        short_description_hi: serviceForm.short_description_hi?.trim() || serviceForm.short_description_en?.trim() || '',
        full_description_en: serviceForm.full_description_en?.trim() || serviceForm.short_description_en?.trim() || '',
        full_description_hi: serviceForm.full_description_hi?.trim() || serviceForm.short_description_hi?.trim() || '',
        required_documents: docs.length > 0 ? docs : ['Original Aadhaar Card', 'Registered Mobile Number'],
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
        setServiceSuccessToast(editingServiceId ? 'Service updated successfully!' : 'New service added and published live successfully!');
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

  // Safe delete handler without window.confirm
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
    if (res.success) {
      setSettingsSavedMsg(true);
      setTimeout(() => setSettingsSavedMsg(false), 3000);
    }
  };

  // Save Sheets URL & Trigger Sync
  const handleSyncSheets = async () => {
    setIsSyncing(true);
    setSyncStatusMsg(null);
    const res = await syncWithGoogleSheets(sheetsUrlInput.trim());
    setIsSyncing(false);
    setSyncStatusMsg(res.message);
  };

  // Copy Google Apps Script code
  const handleCopyScriptCode = () => {
    navigator.clipboard.writeText(GOOGLE_APPS_SCRIPT_CODE);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2500);
  };

  // Copy Template Headers & Sample Row for Direct Paste in Google Sheets (Ctrl+V)
  const handleCopyTemplateHeaders = (template: SheetTemplateInfo) => {
    try {
      const tsv = generateTabSeparatedContent(template);
      navigator.clipboard.writeText(tsv);
      setCopiedTemplateId(template.id);
      setTimeout(() => setCopiedTemplateId(null), 3000);
    } catch (err) {
      console.error('Failed to copy to clipboard:', err);
    }
  };

  // Direct CSV File Upload Handler
  const handleFileUpload = async (templateId: string, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsImportingFile(true);
    setActiveImportingId(templateId);
    setImportStatusBanner(null);

    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const text = e.target?.result as string;
        if (!text || !text.trim()) {
          setImportStatusBanner({ type: 'error', message: 'Selected file is empty.' });
          setIsImportingFile(false);
          setActiveImportingId(null);
          return;
        }

        const res = await importCsvData(templateId, text);
        if (res.success) {
          setImportStatusBanner({ type: 'success', message: res.message });
        } else {
          setImportStatusBanner({ type: 'error', message: res.message });
        }
      } catch (err: any) {
        setImportStatusBanner({ type: 'error', message: err.message || 'Failed to process CSV file.' });
      } finally {
        setIsImportingFile(false);
        setActiveImportingId(null);
        event.target.value = '';
      }
    };
    reader.onerror = () => {
      setImportStatusBanner({ type: 'error', message: 'Could not read file from disk.' });
      setIsImportingFile(false);
      setActiveImportingId(null);
      event.target.value = '';
    };
    reader.readAsText(file);
  };

  // Filtered Enquiries
  const filteredEnquiries = enquiries.filter(enq => {
    if (enquiryFilterStatus === 'All') return true;
    return enq.status === enquiryFilterStatus;
  });

  // Filtered Services in Admin list
  const filteredServices = services.filter(s => {
    if (!serviceSearchTerm.trim()) return true;
    const q = serviceSearchTerm.toLowerCase();
    return s.service_name_en.toLowerCase().includes(q) ||
           s.service_name_hi.toLowerCase().includes(q) ||
           s.category.toLowerCase().includes(q);
  });

  return (
    <div id="admin-dashboard-page" className="min-h-screen bg-slate-100 py-8 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Top Bar Header */}
        <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-blue-700 text-white flex items-center justify-center font-bold text-lg shadow-sm">
              BC
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-extrabold text-slate-900">
                  Balaji Admin Control Center
                </h1>
                <span className="px-2 py-0.5 text-[10px] font-extrabold bg-emerald-100 text-emerald-800 rounded-full">
                  Live
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Manage Jan Seva Kendra services, citizen enquiries & Google Sheets synchronization
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors border border-slate-200"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>View Website</span>
            </Link>
            <button
              type="button"
              id="btn-admin-logout"
              onClick={() => {
                logoutAdmin();
                navigate('/admin/login');
              }}
              className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-lg transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Logout</span>
            </button>
          </div>
        </div>

        {/* Metric Cards Row */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
            <span className="text-xs text-slate-500 font-semibold block">Total Services</span>
            <div className="flex items-baseline justify-between mt-1">
              <span className="text-2xl font-extrabold text-slate-900">{totalServices}</span>
              <Layers className="w-5 h-5 text-blue-600 opacity-60" />
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
            <span className="text-xs text-slate-500 font-semibold block">Active Services</span>
            <div className="flex items-baseline justify-between mt-1">
              <span className="text-2xl font-extrabold text-emerald-700">{activeServices}</span>
              <CheckCircle className="w-5 h-5 text-emerald-600 opacity-60" />
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
            <span className="text-xs text-slate-500 font-semibold block">Total Enquiries</span>
            <div className="flex items-baseline justify-between mt-1">
              <span className="text-2xl font-extrabold text-slate-900">{totalEnquiries}</span>
              <Inbox className="w-5 h-5 text-indigo-600 opacity-60" />
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
            <span className="text-xs text-slate-500 font-semibold block">New / Pending</span>
            <div className="flex items-baseline justify-between mt-1">
              <span className="text-2xl font-extrabold text-amber-600">{pendingEnquiries}</span>
              <Clock className="w-5 h-5 text-amber-500 opacity-60" />
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs col-span-2 sm:col-span-1">
            <span className="text-xs text-slate-500 font-semibold block">Completed</span>
            <div className="flex items-baseline justify-between mt-1">
              <span className="text-2xl font-extrabold text-blue-700">{completedEnquiries}</span>
              <CheckCircle className="w-5 h-5 text-blue-600 opacity-60" />
            </div>
          </div>
        </div>

        {/* Tab Navigation Navigation */}
        <div className="bg-white rounded-xl border border-slate-200 p-1.5 flex gap-1 overflow-x-auto shadow-2xs">
          <button
            type="button"
            id="tab-services"
            onClick={() => setActiveTab('services')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-colors whitespace-nowrap ${
              activeTab === 'services'
                ? 'bg-blue-700 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Services Directory ({totalServices})</span>
          </button>

          <button
            type="button"
            id="tab-enquiries"
            onClick={() => setActiveTab('enquiries')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-colors whitespace-nowrap ${
              activeTab === 'enquiries'
                ? 'bg-blue-700 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Inbox className="w-4 h-4" />
            <span>Citizen Enquiries ({pendingEnquiries} pending)</span>
          </button>

          <button
            type="button"
            id="tab-settings"
            onClick={() => setActiveTab('settings')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-colors whitespace-nowrap ${
              activeTab === 'settings'
                ? 'bg-blue-700 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <SettingsIcon className="w-4 h-4" />
            <span>Center & Website Settings</span>
          </button>

          <button
            type="button"
            id="tab-sheets"
            onClick={() => setActiveTab('sheets')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-colors whitespace-nowrap ${
              activeTab === 'sheets'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Google Sheets & Templates (6)</span>
            <span className={`px-1.5 py-0.2 rounded text-[10px] font-extrabold uppercase ${
              activeTab === 'sheets' ? 'bg-white/20 text-white' : 'bg-emerald-100 text-emerald-800'
            }`}>
              All Templates
            </span>
          </button>
        </div>

        {/* TAB 1: SERVICES MANAGEMENT */}
        {activeTab === 'services' && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-5">
            {serviceSuccessToast && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-bold flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{serviceSuccessToast}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setServiceSuccessToast(null)}
                  className="text-emerald-700 hover:text-emerald-900 font-bold text-sm"
                >
                  ✕
                </button>
              </div>
            )}

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  Service Management (Dynamic Addition & Instant Publishing)
                </h2>
                <p className="text-xs text-slate-500">
                  Services added or modified here immediately update on the public website without needing code redeployment.
                </p>
              </div>

              <button
                type="button"
                id="btn-admin-add-service"
                onClick={handleOpenAddService}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold rounded-xl shadow-xs transition-colors shrink-0"
              >
                <Plus className="w-4 h-4" />
                <span>Add New Service</span>
              </button>
            </div>

            {/* Search Input for services */}
            <div className="relative max-w-sm">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={serviceSearchTerm}
                onChange={(e) => setServiceSearchTerm(e.target.value)}
                placeholder="Search services in dashboard..."
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            {/* Services Table */}
            <div className="overflow-x-auto border border-slate-200 rounded-xl">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200 uppercase tracking-wider text-[11px]">
                  <tr>
                    <th className="p-3.5">Service Details</th>
                    <th className="p-3.5">Category</th>
                    <th className="p-3.5">Docs Required</th>
                    <th className="p-3.5">Status</th>
                    <th className="p-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredServices.map((service) => (
                    <tr key={service.service_id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="p-3.5">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center shrink-0">
                            {getServiceIcon(service.icon, { className: "w-4 h-4" })}
                          </div>
                          <div>
                            <div className="font-bold text-slate-900">
                              {service.service_name_en}
                            </div>
                            <div className="text-[11px] text-slate-500 font-medium">
                              {service.service_name_hi}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="p-3.5">
                        <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 font-semibold text-[11px] border border-slate-200">
                          {service.category}
                        </span>
                      </td>
                      <td className="p-3.5">
                        <span className="text-slate-600">
                          {service.required_documents ? service.required_documents.length : 0} items
                        </span>
                      </td>
                      <td className="p-3.5">
                        <button
                          type="button"
                          onClick={() => handleToggleServiceStatus(service)}
                          title="Click to toggle Active/Disabled"
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold cursor-pointer transition-colors ${
                            service.status === 'Active'
                              ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                              : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                          }`}
                        >
                          {service.status === 'Active' ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                          <span>{service.status}</span>
                        </button>
                      </td>
                      <td className="p-3.5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleOpenEditService(service)}
                            className="p-1.5 text-blue-700 hover:bg-blue-50 rounded-md transition-colors"
                            title="Edit Service"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setServiceToDelete(service)}
                            className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-md transition-colors"
                            title="Delete Service"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 2: CITIZEN ENQUIRIES MANAGEMENT */}
        {activeTab === 'enquiries' && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  Citizen Enquiries & Assistance Requests
                </h2>
                <p className="text-xs text-slate-500">
                  Direct citizen contact desk. Call or WhatsApp citizens directly from this view.
                </p>
              </div>

              {/* Status Filter */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500 font-bold">Filter Status:</span>
                <select
                  value={enquiryFilterStatus}
                  onChange={(e) => setEnquiryFilterStatus(e.target.value)}
                  className="px-2.5 py-1 text-xs bg-slate-50 border border-slate-300 rounded-lg text-slate-800 focus:outline-none"
                >
                  <option value="All">All Statuses ({totalEnquiries})</option>
                  <option value="New">New</option>
                  <option value="Contacted">Contacted</option>
                  <option value="Processing">Processing</option>
                  <option value="Completed">Completed</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>
            </div>

            {/* Enquiries Table */}
            <div className="overflow-x-auto border border-slate-200 rounded-xl">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200 uppercase tracking-wider text-[11px]">
                  <tr>
                    <th className="p-3.5">Applicant & Ref ID</th>
                    <th className="p-3.5">Mobile & Address</th>
                    <th className="p-3.5">Service & Priority</th>
                    <th className="p-3.5">Date & Pref</th>
                    <th className="p-3.5">Status</th>
                    <th className="p-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredEnquiries.length > 0 ? (
                    filteredEnquiries.map((enq) => {
                      const cleanMob = (enq.mobile || '').replace(/\D/g, '');
                      return (
                        <tr key={enq.enquiry_id} className="hover:bg-slate-50/80 transition-colors">
                          <td className="p-3.5">
                            <button
                              type="button"
                              onClick={() => setSelectedEnquiryForDetails(enq)}
                              className="text-left group cursor-pointer"
                              title="Click to view full citizen details and update status"
                            >
                              <span className="font-mono text-[10px] font-bold text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-200 block w-fit mb-1 group-hover:bg-blue-100 transition-colors">
                                {enq.enquiry_id}
                              </span>
                              <div className="font-bold text-slate-900 text-xs sm:text-sm group-hover:text-blue-700 transition-colors">
                                {enq.customer_name}
                              </div>
                            </button>
                            {enq.father_or_husband_name && (
                              <div className="text-[11px] text-slate-500">
                                S/O, W/O: {enq.father_or_husband_name}
                              </div>
                            )}
                            {enq.message && (
                              <p className="text-[11px] font-normal text-slate-500 mt-1 max-w-xs line-clamp-1 italic">
                                "{enq.message}"
                              </p>
                            )}
                          </td>
                          <td className="p-3.5">
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-slate-800 font-semibold">{enq.mobile}</span>
                              {/* Quick Call */}
                              <a
                                href={`tel:${cleanMob}`}
                                title="Call Citizen"
                                className="p-1 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded"
                              >
                                <Phone className="w-3 h-3" />
                              </a>
                              {/* Quick WhatsApp */}
                              <a
                                href={`https://wa.me/91${cleanMob}?text=${encodeURIComponent(`Hello ${enq.customer_name}, this is Balaji Communication regarding your application ${enq.enquiry_id} for ${enq.service_name}. Status: ${enq.status}.`)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                title="WhatsApp Citizen"
                                className="p-1 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded"
                              >
                                <MessageCircle className="w-3 h-3 fill-emerald-600" />
                              </a>
                            </div>
                            {enq.address && (
                              <div className="text-[11px] text-slate-600 mt-1 truncate max-w-xs">
                                📍 {enq.address}
                              </div>
                            )}
                          </td>
                          <td className="p-3.5">
                            <div className="font-semibold text-slate-900">
                              {enq.service_name}
                            </div>
                            {enq.urgency && enq.urgency !== 'Normal' && (
                              <span className="inline-block mt-1 px-1.5 py-0.5 text-[10px] font-extrabold bg-rose-100 text-rose-800 rounded">
                                {enq.urgency}
                              </span>
                            )}
                          </td>
                          <td className="p-3.5 text-slate-500">
                            <div>{enq.created_at ? new Date(enq.created_at).toLocaleDateString() : 'Recent'}</div>
                            <span className="text-[10px] text-blue-700 font-semibold">
                              Pref: {enq.preferred_contact}
                            </span>
                          </td>
                          <td className="p-3.5">
                            <select
                              value={enq.status}
                              onChange={async (e) => {
                                const newStatus = e.target.value as any;
                                await updateEnquiryStatus(enq.enquiry_id, newStatus);
                                setServiceSuccessToast(`Status updated to "${newStatus}" for ${enq.customer_name || enq.applicant_name}`);
                                setTimeout(() => setServiceSuccessToast(null), 3500);
                              }}
                              className={`text-[11px] font-bold rounded-lg px-2.5 py-1.5 border cursor-pointer transition-colors shadow-2xs ${
                                enq.status === 'New'
                                  ? 'bg-blue-50 text-blue-800 border-blue-300 font-extrabold'
                                  : enq.status === 'Completed'
                                  ? 'bg-emerald-50 text-emerald-800 border-emerald-300 font-extrabold'
                                  : enq.status === 'Processing'
                                  ? 'bg-indigo-50 text-indigo-800 border-indigo-300 font-extrabold'
                                  : enq.status === 'Contacted'
                                  ? 'bg-amber-50 text-amber-800 border-amber-300 font-extrabold'
                                  : 'bg-rose-50 text-rose-800 border-rose-300 font-extrabold'
                              }`}
                            >
                              <option value="New">New (आवेदन प्राप्त)</option>
                              <option value="Contacted">Contacted (दस्तावेज जांच)</option>
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
                                className="p-1.5 text-blue-700 hover:bg-blue-50 rounded-md transition-colors"
                                title="View Full Details & Update Status"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  if (window.confirm(`Delete enquiry from ${enq.customer_name}?`)) {
                                    deleteEnquiry(enq.enquiry_id);
                                  }
                                }}
                                className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-md transition-colors"
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
                      <td colSpan={6} className="text-center py-8 text-slate-500">
                        No enquiries found for this filter.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: SETTINGS MANAGEMENT */}
        {activeTab === 'settings' && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  Website & Business Settings
                </h2>
                <p className="text-xs text-slate-500">
                  Configure Center Name, phone numbers, address, working hours, and homepage copy.
                </p>
              </div>

              {settingsSavedMsg && (
                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-100 text-emerald-800 rounded-lg text-xs font-bold animate-in fade-in">
                  <Check className="w-4 h-4" />
                  <span>Settings successfully saved!</span>
                </div>
              )}
            </div>

            <form onSubmit={handleSaveSettings} className="space-y-6">
              {/* Center Names */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Business Name (English)
                  </label>
                  <input
                    type="text"
                    required
                    value={settingsForm.business_name_en}
                    onChange={(e) => setSettingsForm({ ...settingsForm, business_name_en: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Business Name (Hindi)
                  </label>
                  <input
                    type="text"
                    required
                    value={settingsForm.business_name_hi}
                    onChange={(e) => setSettingsForm({ ...settingsForm, business_name_hi: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900"
                  />
                </div>
              </div>

              {/* Contacts */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Calling Phone Number
                  </label>
                  <input
                    type="text"
                    required
                    value={settingsForm.phone_number}
                    onChange={(e) => setSettingsForm({ ...settingsForm, phone_number: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    WhatsApp Number (with country code, e.g. 919870677605)
                  </label>
                  <input
                    type="text"
                    required
                    value={settingsForm.whatsapp_number}
                    onChange={(e) => setSettingsForm({ ...settingsForm, whatsapp_number: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Email ID
                  </label>
                  <input
                    type="email"
                    required
                    value={settingsForm.email}
                    onChange={(e) => setSettingsForm({ ...settingsForm, email: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900"
                  />
                </div>
              </div>

              {/* Address */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Physical Address (English)
                  </label>
                  <textarea
                    rows={2}
                    value={settingsForm.address_en}
                    onChange={(e) => setSettingsForm({ ...settingsForm, address_en: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Physical Address (Hindi)
                  </label>
                  <textarea
                    rows={2}
                    value={settingsForm.address_hi}
                    onChange={(e) => setSettingsForm({ ...settingsForm, address_hi: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900"
                  />
                </div>
              </div>

              {/* Hours & Map Link */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Opening Hours (English)
                  </label>
                  <input
                    type="text"
                    value={settingsForm.opening_hours_en}
                    onChange={(e) => setSettingsForm({ ...settingsForm, opening_hours_en: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Google Maps Directions URL
                  </label>
                  <input
                    type="url"
                    value={settingsForm.google_maps_url}
                    onChange={(e) => setSettingsForm({ ...settingsForm, google_maps_url: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900"
                  />
                </div>
              </div>

              {/* Hero Texts */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-100">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Hero Headline (Hindi)
                  </label>
                  <input
                    type="text"
                    value={settingsForm.hero_headline_hi}
                    onChange={(e) => setSettingsForm({ ...settingsForm, hero_headline_hi: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Hero Headline (English)
                  </label>
                  <input
                    type="text"
                    value={settingsForm.hero_headline_en}
                    onChange={(e) => setSettingsForm({ ...settingsForm, hero_headline_en: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900"
                  />
                </div>
              </div>

              {/* About Us Description */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    About Us (English)
                  </label>
                  <textarea
                    rows={3}
                    value={settingsForm.about_us_en}
                    onChange={(e) => setSettingsForm({ ...settingsForm, about_us_en: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    About Us (Hindi)
                  </label>
                  <textarea
                    rows={3}
                    value={settingsForm.about_us_hi}
                    onChange={(e) => setSettingsForm({ ...settingsForm, about_us_hi: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  id="btn-save-settings"
                  className="inline-flex items-center gap-2 px-6 py-2.5 bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold rounded-xl shadow-xs transition-colors"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Center Settings</span>
                </button>
              </div>
            </form>
          </div>
        )}

        {/* TAB 4: GOOGLE SHEETS & ALL IMPORT TEMPLATES HUB */}
        {activeTab === 'sheets' && (
          <div className="space-y-6">
            
            {/* Header Banner */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-2">
                    <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Google Sheets & CSV Template Center</span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                    Google Sheet Templates & Data Importer (सभी गूगल शीट टेम्पलेट्स)
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-3xl leading-relaxed">
                    Download ready-to-use CSV templates formatted for Google Sheets, copy column headers for instant paste (<kbd className="px-1.5 py-0.5 bg-slate-200 text-slate-800 rounded font-mono text-[11px]">Ctrl+V</kbd>), upload CSV files directly, or link your Google Spreadsheet for automatic bidirectional syncing.
                  </p>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  <a
                    href="https://sheets.new"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-xl transition-colors shadow-2xs"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Open sheets.new</span>
                  </a>
                  <button
                    type="button"
                    onClick={handleCopyScriptCode}
                    className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-colors shadow-2xs"
                  >
                    {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedCode ? 'Copied Master Code!' : 'Copy Master Code.gs'}</span>
                  </button>
                </div>
              </div>

              {/* Status Banner for Direct Imports */}
              {importStatusBanner && (
                <div className={`mt-4 p-4 rounded-xl border text-xs font-semibold flex items-center justify-between gap-3 ${
                  importStatusBanner.type === 'success'
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                    : 'bg-rose-50 border-rose-200 text-rose-900'
                }`}>
                  <div className="flex items-center gap-2.5">
                    {importStatusBanner.type === 'success' ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                    )}
                    <span>{importStatusBanner.message}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setImportStatusBanner(null)}
                    className="text-slate-400 hover:text-slate-700 text-sm font-bold"
                  >
                    ✕
                  </button>
                </div>
              )}
            </div>

            {/* Google Spreadsheet Live Sync Bar */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <span>Google Spreadsheet Link or Apps Script Web App URL</span>
                    <span className="px-2 py-0.5 text-[10px] font-bold bg-blue-100 text-blue-800 rounded-full">
                      Live Sync
                    </span>
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Paste your Google Spreadsheet link (<code className="bg-slate-100 px-1 py-0.5 rounded text-slate-700">https://docs.google.com/spreadsheets/d/...</code>) or Web App link (<code className="bg-slate-100 px-1 py-0.5 rounded text-slate-700">https://script.google.com/macros/s/.../exec</code>)
                  </p>
                </div>

                {settings.last_sheet_sync && (
                  <div className="text-[11px] text-emerald-700 font-medium bg-emerald-50 px-3 py-1 rounded-lg border border-emerald-200 flex items-center gap-1.5 shrink-0">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Last synced: {new Date(settings.last_sheet_sync).toLocaleString()}</span>
                  </div>
                )}
              </div>

              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="url"
                  placeholder="Paste Google Sheet URL (Public link) or Web App URL..."
                  value={sheetsUrlInput}
                  onChange={(e) => setSheetsUrlInput(e.target.value)}
                  className="flex-1 px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500"
                />
                <button
                  type="button"
                  id="btn-sync-sheets"
                  onClick={handleSyncSheets}
                  disabled={isSyncing}
                  className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors inline-flex items-center justify-center gap-2 shrink-0 disabled:opacity-60 cursor-pointer"
                >
                  <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
                  <span>{isSyncing ? 'Connecting & Syncing...' : 'Fetch & Sync Now'}</span>
                </button>
              </div>

              {syncStatusMsg && (
                <div className={`p-3 rounded-lg text-xs font-semibold border ${
                  syncStatusMsg.toLowerCase().includes('success') || syncStatusMsg.toLowerCase().includes('imported') || syncStatusMsg.toLowerCase().includes('loaded')
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                    : 'bg-amber-50 border-amber-200 text-amber-800'
                }`}>
                  {syncStatusMsg}
                </div>
              )}
            </div>

            {/* Template Directory Header & Filter Pills */}
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                    <span>Ready-to-Use Import Templates for Google Sheets</span>
                    <span className="px-2 py-0.5 text-xs bg-slate-200 text-slate-800 font-bold rounded-full">
                      {SHEET_TEMPLATES.length} Templates
                    </span>
                  </h3>
                  <p className="text-xs text-slate-500">
                    Click <strong>Download CSV</strong> to open in Excel/Sheets, <strong>Copy for Sheets</strong> to paste columns, or <strong>Import CSV</strong> to upload records immediately.
                  </p>
                </div>

                {/* Filter Pills */}
                <div className="flex items-center gap-1.5 flex-wrap">
                  {[
                    { id: 'all', label: 'All Templates' },
                    { id: 'services', label: 'Services' },
                    { id: 'enquiries', label: 'Citizen Enquiries' },
                    { id: 'pricelist', label: 'Price List' },
                    { id: 'notices', label: 'Notice Board' },
                    { id: 'quicklinks', label: 'Quick Links' },
                    { id: 'citizens', label: 'Citizen Registry' }
                  ].map(f => (
                    <button
                      key={f.id}
                      type="button"
                      onClick={() => setTemplateFilterCategory(f.id)}
                      className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
                        templateFilterCategory === f.id
                          ? 'bg-blue-700 text-white'
                          : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Template Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {SHEET_TEMPLATES.filter(t => templateFilterCategory === 'all' || t.id === templateFilterCategory).map(template => {
                  const isCopied = copiedTemplateId === template.id;
                  const isUploading = isImportingFile && activeImportingId === template.id;

                  return (
                    <div
                      key={template.id}
                      className="bg-white rounded-2xl border border-slate-200 hover:border-blue-400 p-5 shadow-xs transition-all flex flex-col justify-between space-y-4"
                    >
                      <div className="space-y-3">
                        {/* Top Badges */}
                        <div className="flex items-center justify-between gap-2">
                          <span className="px-2.5 py-0.5 text-[10px] font-extrabold uppercase rounded-md bg-blue-100 text-blue-800">
                            {template.badge}
                          </span>
                          <span className="text-[11px] font-mono text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 font-semibold">
                            Sheet Tab: <strong>{template.sheetTabName}</strong>
                          </span>
                        </div>

                        {/* Title & Description */}
                        <div>
                          <h4 className="text-sm font-bold text-slate-900 group-hover:text-blue-700">
                            {template.title}
                          </h4>
                          <span className="text-xs font-medium text-slate-500 block">
                            {template.hindiTitle}
                          </span>
                          <p className="text-xs text-slate-600 mt-1.5 line-clamp-3 leading-relaxed">
                            {template.description}
                          </p>
                        </div>

                        {/* Columns Preview Pill List */}
                        <div className="pt-1">
                          <div className="flex items-center justify-between text-[11px] text-slate-500 mb-1.5 font-medium">
                            <span>Columns ({template.headers.length}):</span>
                            <span>{template.sampleRows.length} Sample Rows</span>
                          </div>
                          <div className="flex flex-wrap gap-1 max-h-16 overflow-y-auto pr-1">
                            {template.headers.slice(0, 6).map(h => (
                              <span
                                key={h}
                                className="px-1.5 py-0.5 bg-slate-100 border border-slate-200 text-slate-700 text-[10px] font-mono rounded"
                              >
                                {h}
                              </span>
                            ))}
                            {template.headers.length > 6 && (
                              <span className="px-1.5 py-0.5 bg-slate-50 text-slate-400 text-[10px] rounded font-medium">
                                +{template.headers.length - 6} more
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="space-y-2 pt-3 border-t border-slate-100">
                        {/* Primary Buttons Row */}
                        <div className="grid grid-cols-2 gap-2">
                          <a
                            href={`/api/templates/${template.id}.csv`}
                            download={template.fileName}
                            onClick={() => downloadCsvTemplate(template)}
                            className="inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-colors shadow-2xs"
                            title="Download CSV Template with Hindi & English support"
                          >
                            <Download className="w-3.5 h-3.5" />
                            <span>Download CSV</span>
                          </a>

                          <button
                            type="button"
                            onClick={() => handleCopyTemplateHeaders(template)}
                            className={`inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-colors border shadow-2xs ${
                              isCopied
                                ? 'bg-emerald-600 text-white border-emerald-600'
                                : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-300'
                            }`}
                            title="Copy tab-delimited headers to paste directly into Google Sheets (Ctrl+V)"
                          >
                            {isCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5 text-blue-600" />}
                            <span>{isCopied ? 'Copied Headers!' : 'Copy for Sheets'}</span>
                          </button>
                        </div>

                        {/* Secondary Row: Preview & Direct CSV Import */}
                        <div className="grid grid-cols-2 gap-2">
                          <button
                            type="button"
                            onClick={() => setSelectedTemplateForPreview(template)}
                            className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-[11px] font-semibold transition-colors"
                          >
                            <Table className="w-3 h-3 text-slate-500" />
                            <span>Preview Rows</span>
                          </button>

                          <label
                            className={`inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-semibold transition-colors cursor-pointer ${
                              isUploading
                                ? 'bg-amber-100 text-amber-800 cursor-wait'
                                : 'bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200'
                            }`}
                            title="Upload completed CSV to import directly into database"
                          >
                            {isUploading ? (
                              <>
                                <RefreshCw className="w-3 h-3 animate-spin text-amber-600" />
                                <span>Importing...</span>
                              </>
                            ) : (
                              <>
                                <UploadCloud className="w-3 h-3 text-blue-600" />
                                <span>Import .CSV</span>
                              </>
                            )}
                            <input
                              type="file"
                              accept=".csv,text/csv"
                              disabled={isUploading}
                              className="hidden"
                              onChange={(e) => handleFileUpload(template.id, e)}
                            />
                          </label>
                        </div>
                      </div>

                    </div>
                  );
                })}
              </div>
            </div>

            {/* Master Multi-Tab Google Sheet 1-Click Guide */}
            <div className="bg-slate-900 text-slate-200 rounded-2xl p-6 sm:p-7 space-y-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-2">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Master Multi-Tab Database</span>
                  </div>
                  <h3 className="text-lg sm:text-xl font-black text-white">
                    One Single Google Sheet for Everything (Services, Enquiries, PriceList, Notices, QuickLinks, Citizens)
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl leading-relaxed">
                    You don't need 6 different spreadsheets. You can have 1 master spreadsheet with 7 organized tabs, automatically created and formatted in 2 seconds using our Google Apps Script macro!
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleCopyScriptCode}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-colors shadow-lg shrink-0"
                >
                  {copiedCode ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
                  <span>{copiedCode ? 'Code.gs Copied!' : 'Copy Code.gs Script'}</span>
                </button>
              </div>

              {/* 3 Simple Setup Steps */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700 space-y-2">
                  <div className="w-6 h-6 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center">1</div>
                  <h4 className="font-bold text-white text-sm">Create New Sheet & Open Script</h4>
                  <p className="text-slate-400 text-[11px] leading-relaxed">
                    Open <a href="https://sheets.new" target="_blank" rel="noopener noreferrer" className="text-blue-400 underline font-semibold">sheets.new</a>, then click <strong>Extensions &gt; Apps Script</strong>. Delete any blank code.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700 space-y-2">
                  <div className="w-6 h-6 rounded-full bg-emerald-600 text-white font-bold text-xs flex items-center justify-center">2</div>
                  <h4 className="font-bold text-white text-sm">Paste Code.gs & Run Setup</h4>
                  <p className="text-slate-400 text-[11px] leading-relaxed">
                    Paste the script below. From the toolbar function dropdown, select <strong>setupAllTemplateSheets</strong> and click <strong>Run</strong>. All 7 tabs will be created instantly with headers and sample data!
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700 space-y-2">
                  <div className="w-6 h-6 rounded-full bg-amber-600 text-white font-bold text-xs flex items-center justify-center">3</div>
                  <h4 className="font-bold text-white text-sm">Deploy Web App & Paste URL</h4>
                  <p className="text-slate-400 text-[11px] leading-relaxed">
                    Click <strong>Deploy &gt; New deployment &gt; Web app</strong>. Set <strong>Who has access: Anyone</strong>. Copy the resulting URL and paste it in the sync box above!
                  </p>
                </div>
              </div>

              {/* Collapsible / Scrollable Code Viewer */}
              <div className="border border-slate-700 rounded-xl overflow-hidden">
                <div className="bg-slate-950 text-slate-300 px-4 py-2.5 flex items-center justify-between text-xs font-mono">
                  <span>Google Apps Script Code (Code.gs) - Supports All 6 Templates + Settings</span>
                  <button
                    type="button"
                    onClick={handleCopyScriptCode}
                    className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-800 hover:bg-slate-700 text-white rounded text-[11px] font-sans"
                  >
                    {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedCode ? 'Copied!' : 'Copy Code'}</span>
                  </button>
                </div>
                <pre className="p-4 bg-slate-950/70 text-slate-300 font-mono text-[11px] leading-relaxed max-h-64 overflow-y-auto">
                  {GOOGLE_APPS_SCRIPT_CODE}
                </pre>
              </div>
            </div>

          </div>
        )}

      </div>

      {/* SERVICE ADD / EDIT MODAL */}
      {isServiceModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 space-y-5 my-8 shadow-2xl border border-slate-200">
            <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900">
                {editingServiceId ? 'Edit Service' : 'Add New Service (Instant Publish)'}
              </h3>
              <button
                type="button"
                onClick={() => setIsServiceModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 text-sm font-bold"
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

            <form onSubmit={handleSaveService} className="space-y-4">
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
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs"
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
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs"
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
                    placeholder="Aadhaar, Voter ID, Ration Card, etc."
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Icon
                  </label>
                  <select
                    value={serviceForm.icon || 'CreditCard'}
                    onChange={(e) => setServiceForm({ ...serviceForm, icon: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs"
                  >
                    <option value="CreditCard">CreditCard (ID / Plastic)</option>
                    <option value="FileText">FileText (Certificates / Form)</option>
                    <option value="Heart">Heart (Ayushman Health)</option>
                    <option value="Users">Users (Family / Ration / Voter)</option>
                    <option value="CheckCircle">CheckCircle (Verification)</option>
                    <option value="Smartphone">Smartphone (Mobile / Recharge)</option>
                    <option value="Layers">Layers (General Digital)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Status
                  </label>
                  <select
                    value={serviceForm.status || 'Active'}
                    onChange={(e) => setServiceForm({ ...serviceForm, status: e.target.value as any })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs"
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
                    required
                    value={serviceForm.short_description_en || ''}
                    onChange={(e) => setServiceForm({ ...serviceForm, short_description_en: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Short Description (Hindi)
                  </label>
                  <input
                    type="text"
                    required
                    value={serviceForm.short_description_hi || ''}
                    onChange={(e) => setServiceForm({ ...serviceForm, short_description_hi: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs"
                  />
                </div>
              </div>

              {/* Full Descriptions */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Full Detail Explanation (English)
                  </label>
                  <textarea
                    rows={2}
                    value={serviceForm.full_description_en || ''}
                    onChange={(e) => setServiceForm({ ...serviceForm, full_description_en: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Full Detail Explanation (Hindi)
                  </label>
                  <textarea
                    rows={2}
                    value={serviceForm.full_description_hi || ''}
                    onChange={(e) => setServiceForm({ ...serviceForm, full_description_hi: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs"
                  />
                </div>
              </div>

              {/* Required Documents (One per line) */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Required Documents (Enter each document on a NEW line)
                </label>
                <textarea
                  rows={3}
                  value={docsInput}
                  onChange={(e) => setDocsInput(e.target.value)}
                  placeholder="Original Aadhaar Card&#10;Registered Mobile Phone for OTP&#10;Address Proof (Electricity Bill/Voter ID)"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-mono"
                />
              </div>

              {/* Estimated Time & Popular Checkbox */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Estimated Time (e.g. 1 to 3 Days)
                  </label>
                  <input
                    type="text"
                    value={serviceForm.estimated_time || ''}
                    onChange={(e) => setServiceForm({ ...serviceForm, estimated_time: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs"
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
                  className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  id="btn-modal-save-service"
                  disabled={isSavingService}
                  className="px-5 py-2 text-xs font-bold text-white bg-blue-700 hover:bg-blue-800 rounded-lg shadow-xs flex items-center gap-1.5 disabled:opacity-60 cursor-pointer"
                >
                  {isSavingService ? (
                    <>
                      <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Saving Service...</span>
                    </>
                  ) : (
                    <span>{editingServiceId ? 'Update Service' : 'Save & Publish Service'}</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* SERVICE DELETE CONFIRMATION DIALOG (Safe alternative to window.confirm) */}
      {serviceToDelete && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 space-y-4 shadow-2xl border border-slate-200">
            <div className="w-12 h-12 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>
            <div className="text-center space-y-1">
              <h3 className="text-base font-bold text-slate-900">Delete Service</h3>
              <p className="text-xs text-slate-500">
                Are you sure you want to remove <strong>"{serviceToDelete.service_name_en}"</strong>? This will remove it from the citizen portal.
              </p>
            </div>
            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => setServiceToDelete(null)}
                className="flex-1 px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDeleteService}
                className="flex-1 px-4 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-lg shadow-xs transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TEMPLATE SAMPLE DATA & SCHEMA EXPLORER MODAL */}
      {selectedTemplateForPreview && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-5xl w-full p-6 sm:p-7 space-y-6 my-8 shadow-2xl border border-slate-200">
            
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-slate-100 pb-4 gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2.5 py-0.5 text-[10px] font-extrabold uppercase rounded-md bg-blue-100 text-blue-800">
                    {selectedTemplateForPreview.badge}
                  </span>
                  <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    Sheet Tab: {selectedTemplateForPreview.sheetTabName}
                  </span>
                </div>
                <h3 className="text-lg font-black text-slate-900">
                  {selectedTemplateForPreview.title}
                </h3>
                <span className="text-xs text-slate-500 font-medium">
                  {selectedTemplateForPreview.hindiTitle} • {selectedTemplateForPreview.fileName}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <a
                  href={`/api/templates/${selectedTemplateForPreview.id}.csv`}
                  download={selectedTemplateForPreview.fileName}
                  onClick={() => downloadCsvTemplate(selectedTemplateForPreview)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold transition-colors shadow-2xs shrink-0"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download .CSV</span>
                </a>
                <button
                  type="button"
                  onClick={() => handleCopyTemplateHeaders(selectedTemplateForPreview)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 rounded-lg text-xs font-bold transition-colors shadow-2xs shrink-0"
                >
                  {copiedTemplateId === selectedTemplateForPreview.id ? (
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                  <span>{copiedTemplateId === selectedTemplateForPreview.id ? 'Copied!' : 'Copy for Sheets'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedTemplateForPreview(null)}
                  className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center font-bold text-base transition-colors"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Template Description */}
            <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3.5 rounded-xl border border-slate-200">
              {selectedTemplateForPreview.description}
            </p>

            {/* Section 1: Columns Schema & Instructions */}
            <div className="space-y-2.5">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                <HelpCircle className="w-3.5 h-3.5 text-blue-600" />
                <span>Column Field Requirements & Explanations ({selectedTemplateForPreview.columnsExplanation.length} Fields)</span>
              </h4>

              <div className="border border-slate-200 rounded-xl overflow-hidden shadow-2xs max-h-56 overflow-y-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200 sticky top-0">
                    <tr>
                      <th className="px-3 py-2">Column Header</th>
                      <th className="px-3 py-2">Requirement</th>
                      <th className="px-3 py-2">Description / Guidance</th>
                      <th className="px-3 py-2">Sample Value</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 bg-white">
                    {selectedTemplateForPreview.columnsExplanation.map((col, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/80">
                        <td className="px-3 py-2 font-mono font-bold text-blue-800 text-[11px]">
                          {col.key}
                        </td>
                        <td className="px-3 py-2">
                          {col.required ? (
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-800">
                              Required *
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-slate-100 text-slate-600">
                              Optional
                            </span>
                          )}
                        </td>
                        <td className="px-3 py-2 text-slate-600 text-[11px]">
                          {col.description}
                        </td>
                        <td className="px-3 py-2 font-mono text-slate-500 text-[11px] truncate max-w-xs">
                          {col.sample}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Section 2: Live Rendered Sample Rows Table */}
            <div className="space-y-2.5">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                <Table className="w-3.5 h-3.5 text-emerald-600" />
                <span>Sample Data Rows Preview (as seen in Google Sheets)</span>
              </h4>

              <div className="border border-slate-200 rounded-xl overflow-x-auto shadow-2xs max-h-60 overflow-y-auto">
                <table className="w-full text-left text-xs whitespace-nowrap">
                  <thead className="bg-slate-800 text-slate-200 font-bold border-b border-slate-700 sticky top-0">
                    <tr>
                      <th className="px-2.5 py-2 font-mono text-[10px] text-slate-400">#</th>
                      {selectedTemplateForPreview.headers.map(h => (
                        <th key={h} className="px-3 py-2 font-mono text-[11px]">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 bg-white">
                    {selectedTemplateForPreview.sampleRows.map((row, rIdx) => (
                      <tr key={rIdx} className="hover:bg-slate-50">
                        <td className="px-2.5 py-2 font-mono text-slate-400 text-[10px] bg-slate-50 border-r border-slate-200">
                          {rIdx + 1}
                        </td>
                        {row.map((val, cIdx) => (
                          <td key={cIdx} className="px-3 py-2 text-slate-800 text-xs">
                            {String(val)}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Modal Bottom Bar */}
            <div className="flex items-center justify-between pt-3 border-t border-slate-100">
              <span className="text-[11px] text-slate-500">
                UTF-8 Devanagari formatted for MS Excel, Google Sheets, LibreOffice & Apple Numbers.
              </span>
              <button
                type="button"
                onClick={() => setSelectedTemplateForPreview(null)}
                className="px-5 py-2 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
              >
                Close Preview
              </button>
            </div>

          </div>
        </div>
      )}

      {/* CITIZEN APPLICATION / ENQUIRY DETAILS & STATUS UPDATE MODAL */}
      {selectedEnquiryForDetails && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 p-6 space-y-6 animate-in fade-in zoom-in-95 duration-150">
            
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-slate-100 pb-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-mono text-xs font-extrabold text-blue-900 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                    {selectedEnquiryForDetails.enquiry_id}
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                    Citizen Request
                  </span>
                </div>
                <h3 className="text-xl font-extrabold text-slate-900">
                  {selectedEnquiryForDetails.customer_name}
                </h3>
                {selectedEnquiryForDetails.father_or_husband_name && (
                  <p className="text-xs text-slate-500">
                    S/O, W/O: {selectedEnquiryForDetails.father_or_husband_name}
                  </p>
                )}
              </div>
              <button
                type="button"
                onClick={() => setSelectedEnquiryForDetails(null)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Status Changer Box */}
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Update Application Status:
                </span>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${
                  selectedEnquiryForDetails.status === 'Completed'
                    ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                    : selectedEnquiryForDetails.status === 'Processing'
                    ? 'bg-indigo-100 text-indigo-800 border-indigo-300'
                    : selectedEnquiryForDetails.status === 'Contacted'
                    ? 'bg-amber-100 text-amber-800 border-amber-300'
                    : selectedEnquiryForDetails.status === 'New'
                    ? 'bg-blue-100 text-blue-800 border-blue-300'
                    : 'bg-rose-100 text-rose-800 border-rose-300'
                }`}>
                  Current: {selectedEnquiryForDetails.status}
                </span>
              </div>

              {/* 1-Click Status Buttons */}
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                {[
                  { key: 'New', label: 'New', sub: 'प्राप्त हुआ', bg: 'hover:bg-blue-50 hover:border-blue-300', active: 'bg-blue-600 text-white border-blue-600' },
                  { key: 'Contacted', label: 'Contacted', sub: 'दस्तावेज जांच', bg: 'hover:bg-amber-50 hover:border-amber-300', active: 'bg-amber-600 text-white border-amber-600' },
                  { key: 'Processing', label: 'Processing', sub: 'प्रक्रियाधीन', bg: 'hover:bg-indigo-50 hover:border-indigo-300', active: 'bg-indigo-600 text-white border-indigo-600' },
                  { key: 'Completed', label: 'Completed', sub: 'कार्य पूर्ण', bg: 'hover:bg-emerald-50 hover:border-emerald-300', active: 'bg-emerald-600 text-white border-emerald-600' },
                  { key: 'Cancelled', label: 'Cancelled', sub: 'निरस्त', bg: 'hover:bg-rose-50 hover:border-rose-300', active: 'bg-rose-600 text-white border-rose-600' }
                ].map((st) => {
                  const isCur = selectedEnquiryForDetails.status === st.key;
                  return (
                    <button
                      key={st.key}
                      type="button"
                      onClick={async () => {
                        const newStatus = st.key as any;
                        await updateEnquiryStatus(selectedEnquiryForDetails.enquiry_id, newStatus);
                        setSelectedEnquiryForDetails({ ...selectedEnquiryForDetails, status: newStatus });
                        setServiceSuccessToast(`Status updated to "${newStatus}" for ${selectedEnquiryForDetails.customer_name}`);
                        setTimeout(() => setServiceSuccessToast(null), 3000);
                      }}
                      className={`p-2 rounded-xl text-center border font-bold text-xs transition-all ${
                        isCur ? st.active : `bg-white text-slate-700 border-slate-200 ${st.bg}`
                      }`}
                    >
                      <div>{st.label}</div>
                      <div className={`text-[10px] font-normal ${isCur ? 'text-white/90' : 'text-slate-400'}`}>
                        {st.sub}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Information Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl space-y-1 border border-slate-100">
                <span className="text-slate-400 block font-semibold text-[11px]">Requested Service:</span>
                <span className="font-extrabold text-slate-900 text-sm block">
                  {selectedEnquiryForDetails.service_name}
                </span>
                <span className="text-[10px] text-blue-700 font-bold block">
                  Category: {selectedEnquiryForDetails.category || 'Jan Seva Kendra'}
                </span>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl space-y-1 border border-slate-100">
                <span className="text-slate-400 block font-semibold text-[11px]">Priority & Contact Preference:</span>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded font-extrabold text-[10px] bg-blue-100 text-blue-800">
                    {selectedEnquiryForDetails.urgency || 'Normal Priority'}
                  </span>
                  <span className="text-slate-600 font-bold">
                    Prefers: {selectedEnquiryForDetails.preferred_contact}
                  </span>
                </div>
                <div className="text-[11px] text-slate-500 pt-0.5">
                  Applied: {selectedEnquiryForDetails.created_at ? new Date(selectedEnquiryForDetails.created_at).toLocaleString() : 'Recent'}
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl space-y-1 border border-slate-100 sm:col-span-2">
                <span className="text-slate-400 block font-semibold text-[11px]">Citizen Mobile & Location:</span>
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="font-mono text-sm font-extrabold text-slate-900">
                    +91 {selectedEnquiryForDetails.mobile}
                  </span>
                  <div className="flex items-center gap-2">
                    <a
                      href={`tel:${selectedEnquiryForDetails.mobile.replace(/\D/g, '')}`}
                      className="inline-flex items-center gap-1 px-3 py-1 bg-blue-700 hover:bg-blue-800 text-white font-bold rounded-lg text-xs transition-colors shadow-xs"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      <span>Call Citizen</span>
                    </a>
                    <a
                      href={`https://wa.me/91${selectedEnquiryForDetails.mobile.replace(/\D/g, '')}?text=${encodeURIComponent(`Namaste ${selectedEnquiryForDetails.customer_name}, this is Balaji Communication Jan Seva Kendra Gaini. Your application ${selectedEnquiryForDetails.enquiry_id} for ${selectedEnquiryForDetails.service_name} status is: ${selectedEnquiryForDetails.status}.`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-xs transition-colors shadow-xs"
                    >
                      <MessageCircle className="w-3.5 h-3.5 fill-white" />
                      <span>WhatsApp Citizen</span>
                    </a>
                  </div>
                </div>
                {selectedEnquiryForDetails.address && (
                  <p className="text-xs text-slate-600 pt-1">
                    📍 {selectedEnquiryForDetails.address} {selectedEnquiryForDetails.village ? `(${selectedEnquiryForDetails.village})` : ''}
                  </p>
                )}
              </div>

              {selectedEnquiryForDetails.message && (
                <div className="p-3 bg-amber-50/60 rounded-xl border border-amber-200/80 sm:col-span-2 space-y-1">
                  <span className="text-amber-800 font-bold block text-[11px]">
                    Citizen Note / Special Request:
                  </span>
                  <p className="text-xs text-slate-700 italic">
                    "{selectedEnquiryForDetails.message}"
                  </p>
                </div>
              )}
            </div>

            {/* Modal Bottom Actions */}
            <div className="flex items-center justify-between pt-3 border-t border-slate-100">
              <span className="text-[11px] text-slate-500">
                Changes are synchronized automatically with local storage and Google Sheets.
              </span>
              <button
                type="button"
                onClick={() => setSelectedEnquiryForDetails(null)}
                className="px-5 py-2 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
              >
                Done
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
