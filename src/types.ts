export type Language = 'hi' | 'en';

export interface Service {
  service_id: string;
  service_name_en: string;
  service_name_hi: string;
  category: string;
  short_description_en: string;
  short_description_hi: string;
  full_description_en: string;
  full_description_hi: string;
  required_documents: string[];
  icon: string; // Lucide icon name, e.g. 'CreditCard', 'FileText', 'UserCheck', etc.
  status: 'Active' | 'Disabled';
  whatsapp_message?: string;
  estimated_time?: string;
  important_note?: string;
  popular?: boolean;
  created_at: string;
  updated_at: string;
}

export type EnquiryStatus = 'New' | 'Contacted' | 'Processing' | 'Completed' | 'Cancelled';

export interface Enquiry {
  enquiry_id: string;
  customer_name: string;
  applicant_name?: string;
  father_or_husband_name?: string;
  address?: string;
  village?: string;
  mobile: string;
  service_id?: string;
  service_name: string;
  category?: string;
  message: string;
  preferred_contact: 'Call' | 'WhatsApp';
  urgency?: string;
  status: EnquiryStatus;
  created_at: string;
  updated_at?: string;
}

export interface WebsiteSettings {
  business_name_en: string;
  business_name_hi: string;
  subtitle_en: string;
  subtitle_hi: string;
  phone_number: string;
  whatsapp_number: string;
  email: string;
  address_en: string;
  address_hi: string;
  google_maps_url: string;
  opening_hours_en: string;
  opening_hours_hi: string;
  hero_headline_hi: string;
  hero_headline_en: string;
  hero_subtitle_hi: string;
  hero_subtitle_en: string;
  hero_description_hi: string;
  hero_description_en: string;
  about_us_hi: string;
  about_us_en: string;
  footer_text_hi: string;
  footer_text_en: string;
  google_sheet_webapp_url?: string;
  google_sheet_web_app_url?: string;
  google_sheet_url?: string;
  last_sheet_sync?: string;
}

export type SiteSettings = WebsiteSettings;

export interface AdminUser {
  user_id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  created_at: string;
}

export interface PriceListItem {
  price_id: string;
  service_name: string;
  category: string;
  government_fee: string;
  csc_service_fee: string;
  total_fee: string;
  processing_time: string;
  eligibility_or_note?: string;
  status?: string;
}

export interface NoticeItem {
  notice_id: string;
  title_en: string;
  title_hi: string;
  description_en: string;
  description_hi: string;
  category: string;
  badge_type: 'Urgent' | 'New' | 'Important' | 'General';
  last_date?: string;
  action_link?: string;
  status: 'Active' | 'Archived';
  created_at: string;
}

export interface QuickLinkItem {
  link_id: string;
  portal_name: string;
  department: string;
  category: string;
  portal_url: string;
  description: string;
  portal_login_type?: string;
  required_credentials?: string;
}

export interface CitizenRecord {
  citizen_id: string;
  full_name: string;
  father_name: string;
  mobile: string;
  aadhaar_last4: string;
  village: string;
  address: string;
  services_availed: string;
  notes?: string;
  status: 'Active' | 'Pending Docs' | 'Completed';
  created_at: string;
}

export interface SheetTemplateInfo {
  id: string;
  title: string;
  hindiTitle: string;
  description: string;
  fileName: string;
  sheetTabName: string;
  badge: string;
  headers: string[];
  sampleRows: (string | number)[][];
  columnsExplanation: { key: string; required: boolean; description: string; sample: string }[];
}
