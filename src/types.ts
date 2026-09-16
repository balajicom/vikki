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
  mobile: string;
  service_id?: string;
  service_name: string;
  message: string;
  preferred_contact: 'Call' | 'WhatsApp';
  status: EnquiryStatus;
  created_at: string;
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
