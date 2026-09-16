import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
  Search,
  Eye,
  EyeOff
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import { Service, Enquiry, SiteSettings } from '../../types';
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
    createService,
    updateService,
    deleteService,
    updateEnquiryStatus,
    deleteEnquiry,
    updateSettings,
    syncWithGoogleSheets
  } = useData();

  const navigate = useNavigate();

  // Active Tab
  const [activeTab, setActiveTab] = useState<'services' | 'enquiries' | 'settings' | 'sheets'>('services');

  // Service Edit / Create Modal State
  const [isServiceModalOpen, setIsServiceModalOpen] = useState(false);
  const [editingServiceId, setEditingServiceId] = useState<string | null>(null);
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

  // Search & Filters for Enquiries
  const [enquiryFilterStatus, setEnquiryFilterStatus] = useState<string>('All');
  const [serviceSearchTerm, setServiceSearchTerm] = useState('');

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
    setServiceForm({
      service_id: `service_${Date.now()}`,
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
    setServiceForm({ ...service });
    setDocsInput(service.required_documents ? service.required_documents.join('\n') : '');
    setIsServiceModalOpen(true);
  };

  // Save Service
  const handleSaveService = async (e: React.FormEvent) => {
    e.preventDefault();
    const docs = docsInput
      .split('\n')
      .map(d => d.trim())
      .filter(d => d.length > 0);

    const serviceData: Service = {
      ...(serviceForm as Service),
      required_documents: docs,
      updated_at: new Date().toISOString()
    };

    if (editingServiceId) {
      await updateService(serviceData);
    } else {
      await createService(serviceData);
    }
    setIsServiceModalOpen(false);
  };

  // Toggle Service Active status directly
  const handleToggleServiceStatus = async (service: Service) => {
    const updatedStatus = service.status === 'Active' ? 'Disabled' : 'Active';
    await updateService({ ...service, status: updatedStatus });
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
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
            >
              <span>View Live Website</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
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
            <span>Google Sheets Sync</span>
          </button>
        </div>

        {/* TAB 1: SERVICES MANAGEMENT */}
        {activeTab === 'services' && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-5">
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
                            onClick={() => {
                              if (window.confirm(`Are you sure you want to delete "${service.service_name_en}"?`)) {
                                deleteService(service.service_id);
                              }
                            }}
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
                    <th className="p-3.5">Customer Name</th>
                    <th className="p-3.5">Mobile Number</th>
                    <th className="p-3.5">Service Requested</th>
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
                          <td className="p-3.5 font-bold text-slate-900">
                            {enq.customer_name}
                            {enq.message && (
                              <p className="text-[11px] font-normal text-slate-500 mt-0.5 max-w-xs line-clamp-1">
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
                                href={`https://wa.me/91${cleanMob}?text=${encodeURIComponent(`Hello ${enq.customer_name}, this is Balaji Communication regarding your request for ${enq.service_name}.`)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                title="WhatsApp Citizen"
                                className="p-1 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded"
                              >
                                <MessageCircle className="w-3 h-3 fill-emerald-600" />
                              </a>
                            </div>
                          </td>
                          <td className="p-3.5">
                            <span className="font-semibold text-slate-900">
                              {enq.service_name}
                            </span>
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
                              onChange={(e) => updateEnquiryStatus(enq.enquiry_id, e.target.value as any)}
                              className={`text-[11px] font-bold rounded-lg px-2 py-1 border ${
                                enq.status === 'New'
                                  ? 'bg-amber-50 text-amber-800 border-amber-300'
                                  : enq.status === 'Completed'
                                  ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                                  : enq.status === 'Processing'
                                  ? 'bg-blue-50 text-blue-800 border-blue-300'
                                  : 'bg-slate-100 text-slate-700 border-slate-300'
                              }`}
                            >
                              <option value="New">New</option>
                              <option value="Contacted">Contacted</option>
                              <option value="Processing">Processing</option>
                              <option value="Completed">Completed</option>
                              <option value="Cancelled">Cancelled</option>
                            </select>
                          </td>
                          <td className="p-3.5 text-right">
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
                    WhatsApp Number (with country code, e.g. 919876543210)
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

        {/* TAB 4: GOOGLE SHEETS INTEGRATION & SCRIPT SETUP */}
        {activeTab === 'sheets' && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-6">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-2">
                <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
                <span>Google Sheets Database Backend</span>
              </div>
              <h2 className="text-xl font-bold text-slate-900">
                Google Sheets & Google Apps Script Setup
              </h2>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                Connect your Google Spreadsheet to store citizen enquiries, publish new services, and sync site settings. The website automatically falls back to secure local storage if no URL is provided.
              </p>
            </div>

            {/* Sync URL Configuration Box */}
            <div className="p-5 bg-slate-50 border border-slate-200 rounded-2xl space-y-4">
              <h3 className="text-sm font-bold text-slate-900">
                Google Apps Script Web App Deployment URL
              </h3>
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="url"
                  placeholder="https://script.google.com/macros/s/.../exec"
                  value={sheetsUrlInput}
                  onChange={(e) => setSheetsUrlInput(e.target.value)}
                  className="flex-1 px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500"
                />
                <button
                  type="button"
                  id="btn-sync-sheets"
                  onClick={handleSyncSheets}
                  disabled={isSyncing}
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors inline-flex items-center justify-center gap-2 shrink-0 disabled:opacity-60"
                >
                  <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
                  <span>{isSyncing ? 'Connecting & Syncing...' : 'Save & Sync Now'}</span>
                </button>
              </div>

              {syncStatusMsg && (
                <div className="p-3 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-800">
                  {syncStatusMsg}
                </div>
              )}
            </div>

            {/* Step-by-step Setup Guide */}
            <div className="space-y-4 pt-2">
              <h3 className="text-sm font-bold text-slate-900">
                How to set up your Google Sheet in 3 minutes:
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
                  <span className="font-bold text-blue-700">Step 1: Create Spreadsheet</span>
                  <p className="text-slate-600">
                    Open <a href="https://sheets.new" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline font-semibold">sheets.new</a> and rename your sheet to <strong>Balaji Communication Jan Seva Kendra</strong>.
                  </p>
                  <p className="text-[11px] text-slate-500">
                    Create 3 tabs: <code className="bg-slate-200 px-1 rounded">Services</code>, <code className="bg-slate-200 px-1 rounded">Enquiries</code>, and <code className="bg-slate-200 px-1 rounded">Settings</code>.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
                  <span className="font-bold text-emerald-700">Step 2: Paste Code.gs</span>
                  <p className="text-slate-600">
                    In your spreadsheet, go to <strong>Extensions &gt; Apps Script</strong>. Delete any code in <code className="bg-slate-200 px-1 rounded">Code.gs</code> and paste the script below.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
                  <span className="font-bold text-amber-700">Step 3: Deploy as Web App</span>
                  <p className="text-slate-600">
                    Click <strong>Deploy &gt; New deployment</strong>. Select <em>Web App</em>. Set <strong>Execute as:</strong> "Me", and <strong>Who has access:</strong> "Anyone". Copy the Web App URL into the box above!
                  </p>
                </div>
              </div>

              {/* Copy Script Code Area */}
              <div className="border border-slate-200 rounded-xl overflow-hidden mt-4">
                <div className="bg-slate-800 text-slate-200 px-4 py-2.5 flex items-center justify-between text-xs font-bold">
                  <span>Google Apps Script Backend Code (Code.gs)</span>
                  <button
                    type="button"
                    onClick={handleCopyScriptCode}
                    className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors text-[11px]"
                  >
                    {copiedCode ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedCode ? 'Copied to Clipboard!' : 'Copy Code.gs'}</span>
                  </button>
                </div>
                <pre className="p-4 bg-slate-900 text-slate-300 font-mono text-[11px] leading-relaxed max-h-72 overflow-y-auto">
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
                  onClick={() => setIsServiceModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  id="btn-modal-save-service"
                  className="px-5 py-2 text-xs font-bold text-white bg-blue-700 hover:bg-blue-800 rounded-lg shadow-xs"
                >
                  {editingServiceId ? 'Update Service' : 'Save & Publish Service'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
