var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// server.ts
var import_express = __toESM(require("express"), 1);
var import_path = __toESM(require("path"), 1);
var import_fs = __toESM(require("fs"), 1);
var import_vite = require("vite");

// src/data/initialData.ts
var INITIAL_SETTINGS = {
  business_name_en: "Balaji Communication",
  business_name_hi: "\u092C\u093E\u0932\u093E\u091C\u0940 \u0915\u092E\u094D\u092F\u0941\u0928\u093F\u0915\u0947\u0936\u0928",
  subtitle_en: "Jan Seva Kendra | Digital Service Center",
  subtitle_hi: "\u091C\u0928 \u0938\u0947\u0935\u093E \u0915\u0947\u0902\u0926\u094D\u0930 | \u0921\u093F\u091C\u093F\u091F\u0932 \u0938\u0947\u0935\u093E \u0915\u0947\u0902\u0926\u094D\u0930",
  phone_number: "+919870677605",
  whatsapp_number: "919870677605",
  email: "vikkysingh9870677605@gmail.com",
  address_en: "Shop, Masjid bali gali, Inter college road Gaini, Bareilly, Uttar Pradesh - 243302",
  address_hi: "\u0926\u0941\u0915\u093E\u0928, \u092E\u0938\u094D\u091C\u093F\u0926 \u0935\u093E\u0932\u0940 \u0917\u0932\u0940, \u0907\u0902\u091F\u0930 \u0915\u0949\u0932\u0947\u091C \u0930\u094B\u0921, \u0917\u0948\u0928\u0940, \u092C\u0930\u0947\u0932\u0940, \u0909\u0924\u094D\u0924\u0930 \u092A\u094D\u0930\u0926\u0947\u0936 - 243302",
  google_maps_url: "https://maps.google.com/?q=Gaini+Bareilly+Uttar+Pradesh+243302",
  opening_hours_en: "Mon - Sat: 9:00 AM - 8:00 PM | Sunday: 10:00 AM - 2:00 PM",
  opening_hours_hi: "\u0938\u094B\u092E - \u0936\u0928\u093F: \u0938\u0941\u092C\u0939 9:00 - \u0930\u093E\u0924 8:00 | \u0930\u0935\u093F\u0935\u093E\u0930: \u0938\u0941\u092C\u0939 10:00 - \u0926\u094B\u092A\u0939\u0930 2:00",
  hero_headline_hi: "\u0906\u092A\u0915\u0940 \u0938\u092D\u0940 \u0911\u0928\u0932\u093E\u0907\u0928 \u0938\u0947\u0935\u093E\u090F\u0902, \u090F\u0915 \u0939\u0940 \u0938\u094D\u0925\u093E\u0928 \u092A\u0930",
  hero_headline_en: "All Digital & Government Services at One Place",
  hero_subtitle_hi: "\u0906\u0927\u093E\u0930, \u0930\u093E\u0936\u0928 \u0915\u093E\u0930\u094D\u0921, \u092A\u0940\u090F\u092E \u0915\u093F\u0938\u093E\u0928, \u0906\u092F\u0941\u0937\u094D\u092E\u093E\u0928 \u090F\u0935\u0902 \u0938\u0930\u0915\u093E\u0930\u0940 \u092A\u094D\u0930\u092E\u093E\u0923 \u092A\u0924\u094D\u0930 \u0938\u0947\u0935\u093E",
  hero_subtitle_en: "Aadhaar, Ration Card, PM Kisan, Ayushman & Government Certificate Services",
  hero_description_hi: "\u092C\u093E\u0932\u093E\u091C\u0940 \u0915\u092E\u094D\u092F\u0941\u0928\u093F\u0915\u0947\u0936\u0928 \u0928\u093E\u0917\u0930\u093F\u0915\u094B\u0902 \u0915\u094B \u0935\u093F\u092D\u093F\u0928\u094D\u0928 \u0938\u0930\u0915\u093E\u0930\u0940, \u0926\u0938\u094D\u0924\u093E\u0935\u0947\u091C\u0940\u0915\u0930\u0923 \u0914\u0930 \u0921\u093F\u091C\u093F\u091F\u0932 \u0938\u0947\u0935\u093E\u0913\u0902 \u0915\u0947 \u0932\u093F\u090F \u0924\u094D\u0935\u0930\u093F\u0924, \u0935\u093F\u0936\u094D\u0935\u0938\u0928\u0940\u092F \u0914\u0930 \u0906\u0938\u093E\u0928 \u0938\u0939\u093E\u092F\u0924\u093E \u092A\u094D\u0930\u0926\u093E\u0928 \u0915\u0930\u0924\u093E \u0939\u0948\u0964",
  hero_description_en: "Balaji Communication provides convenient assistance for various government, documentation and digital services.",
  about_us_hi: "\u092C\u093E\u0932\u093E\u091C\u0940 \u0915\u092E\u094D\u092F\u0941\u0928\u093F\u0915\u0947\u0936\u0928 \u090F\u0915 \u0938\u094D\u0925\u093E\u0928\u0940\u092F \u0921\u093F\u091C\u093F\u091F\u0932 \u0938\u0947\u0935\u093E \u0915\u0947\u0902\u0926\u094D\u0930 (\u091C\u0928 \u0938\u0947\u0935\u093E \u0915\u0947\u0902\u0926\u094D\u0930) \u0939\u0948 \u091C\u094B \u0928\u093E\u0917\u0930\u093F\u0915\u094B\u0902 \u0915\u094B \u0938\u0930\u0915\u093E\u0930\u0940 \u092F\u094B\u091C\u0928\u093E\u0913\u0902, \u092A\u0939\u091A\u093E\u0928 \u0926\u0938\u094D\u0924\u093E\u0935\u0947\u091C\u094B\u0902, \u0911\u0928\u0932\u093E\u0907\u0928 \u092B\u0949\u0930\u094D\u092E \u092D\u0930\u0928\u0947 \u090F\u0935\u0902 \u0905\u0928\u094D\u092F \u0921\u093F\u091C\u093F\u091F\u0932 \u0938\u0947\u0935\u093E\u0913\u0902 \u092E\u0947\u0902 \u092E\u0926\u0926 \u0915\u0930\u0924\u093E \u0939\u0948\u0964 \u0939\u092E\u093E\u0930\u093E \u0909\u0926\u094D\u0926\u0947\u0936\u094D\u092F \u0917\u094D\u0930\u093E\u092E\u0940\u0923 \u0914\u0930 \u0936\u0939\u0930\u0940 \u0928\u093E\u0917\u0930\u093F\u0915\u094B\u0902 \u0915\u094B \u092A\u093E\u0930\u0926\u0930\u094D\u0936\u0940, \u0924\u094D\u0935\u0930\u093F\u0924 \u090F\u0935\u0902 \u0938\u0941\u0930\u0915\u094D\u0937\u093F\u0924 \u0938\u0947\u0935\u093E \u092A\u094D\u0930\u0926\u093E\u0928 \u0915\u0930\u0928\u093E \u0939\u0948\u0964",
  about_us_en: "Balaji Communication is a local digital service center providing assistance with government schemes, identity documents, online applications and various digital services. Our mission is to provide transparent, prompt and reliable assistance for citizens.",
  footer_text_hi: "\u092C\u093E\u0932\u093E\u091C\u0940 \u0915\u092E\u094D\u092F\u0941\u0928\u093F\u0915\u0947\u0936\u0928 \u090F\u0915 \u0938\u094D\u0935\u0924\u0902\u0924\u094D\u0930 \u0921\u093F\u091C\u093F\u091F\u0932 \u0938\u0947\u0935\u093E \u0938\u0939\u093E\u092F\u0924\u093E \u0915\u0947\u0902\u0926\u094D\u0930 \u0939\u0948 \u0914\u0930 \u092F\u0939 \u0915\u094B\u0908 \u0906\u0927\u093F\u0915\u093E\u0930\u093F\u0915 \u0938\u0930\u0915\u093E\u0930\u0940 \u0935\u0947\u092C\u0938\u093E\u0907\u091F \u0928\u0939\u0940\u0902 \u0939\u0948\u0964 \u0938\u092D\u0940 \u0938\u0930\u0915\u093E\u0930\u0940 \u0938\u0947\u0935\u093E\u090F\u0902 \u0938\u0902\u092C\u0902\u0927\u093F\u0924 \u0935\u093F\u092D\u093E\u0917 \u0915\u0947 \u0928\u093F\u092F\u092E\u094B\u0902 \u0915\u0947 \u0905\u0927\u0940\u0928 \u0939\u0948\u0902\u0964",
  footer_text_en: "Balaji Communication is an independent digital service assistance center and is not an official government website. All government services are subject to rules of the respective departments.",
  google_sheet_webapp_url: ""
};
var INITIAL_SERVICES = [
  {
    service_id: "srv-aadhaar-mob",
    service_name_en: "Aadhaar Mobile Number Update",
    service_name_hi: "\u0906\u0927\u093E\u0930 \u092E\u094B\u092C\u093E\u0907\u0932 \u0928\u0902\u092C\u0930 \u0905\u092A\u0921\u0947\u091F / \u091C\u094B\u0921\u093C\u0928\u093E",
    category: "Aadhaar",
    short_description_en: "Quick assistance for linking or updating your active mobile number in your Aadhaar card.",
    short_description_hi: "\u0905\u092A\u0928\u0947 \u0906\u0927\u093E\u0930 \u0915\u093E\u0930\u094D\u0921 \u092E\u0947\u0902 \u091A\u093E\u0932\u0942 \u092E\u094B\u092C\u093E\u0907\u0932 \u0928\u0902\u092C\u0930 \u0932\u093F\u0902\u0915 \u092F\u093E \u0905\u092A\u0921\u0947\u091F \u0915\u0930\u0935\u093E\u0928\u0947 \u0915\u0947 \u0932\u093F\u090F \u0906\u0938\u093E\u0928 \u0938\u0939\u093E\u092F\u0924\u093E\u0964",
    full_description_en: "Updating your mobile number in Aadhaar is essential for receiving OTPs for banking, ITR verification, DigiLocker, and availing all government online benefits. We assist you with appointment booking, biometric verification guidance, and status tracking.",
    full_description_hi: "\u0906\u0927\u093E\u0930 \u092E\u0947\u0902 \u092E\u094B\u092C\u093E\u0907\u0932 \u0928\u0902\u092C\u0930 \u0932\u093F\u0902\u0915 \u0939\u094B\u0928\u093E \u092C\u0948\u0902\u0915, \u0921\u093F\u091C\u0940\u0932\u0949\u0915\u0930, \u0930\u093E\u0936\u0928 \u0915\u093E\u0930\u094D\u0921 \u0914\u0930 \u0938\u0930\u0915\u093E\u0930\u0940 \u092F\u094B\u091C\u0928\u093E\u0913\u0902 \u0915\u0947 \u0913\u091F\u0940\u092A\u0940 \u0915\u0947 \u0932\u093F\u090F \u0905\u0928\u093F\u0935\u093E\u0930\u094D\u092F \u0939\u0948\u0964 \u0939\u092E\u093E\u0930\u0947 \u0915\u0947\u0902\u0926\u094D\u0930 \u092A\u0930 \u092C\u093E\u092F\u094B\u092E\u0947\u091F\u094D\u0930\u093F\u0915 \u0938\u0924\u094D\u092F\u093E\u092A\u0928 \u092E\u093E\u0930\u094D\u0917\u0926\u0930\u094D\u0936\u0928 \u0914\u0930 \u0938\u094D\u0925\u093F\u0924\u093F \u091C\u093E\u0902\u091A \u0915\u0940 \u092A\u0942\u0930\u0940 \u0938\u0939\u093E\u092F\u0924\u093E \u0909\u092A\u0932\u092C\u094D\u0927 \u0939\u0948\u0964",
    required_documents: [
      "Original Aadhaar Card (\u092E\u0942\u0932 \u0906\u0927\u093E\u0930 \u0915\u093E\u0930\u094D\u0921)",
      "Active Mobile SIM to be linked (\u091A\u093E\u0932\u0942 \u092E\u094B\u092C\u093E\u0907\u0932 \u0928\u0902\u092C\u0930)",
      "Physical presence of cardholder for biometric (\u092C\u093E\u092F\u094B\u092E\u0947\u091F\u094D\u0930\u093F\u0915 \u0915\u0947 \u0932\u093F\u090F \u0935\u094D\u092F\u0915\u094D\u0924\u093F \u0915\u093E \u0909\u092A\u0938\u094D\u0925\u093F\u0924 \u0939\u094B\u0928\u093E)"
    ],
    icon: "Smartphone",
    status: "Active",
    popular: true,
    estimated_time: "24-48 Hours after verification",
    whatsapp_message: "Hello Balaji Communication, I want information about Aadhaar Mobile Number Update.",
    created_at: "2026-01-10T10:00:00.000Z",
    updated_at: "2026-01-10T10:00:00.000Z"
  },
  {
    service_id: "srv-aadhaar-corr",
    service_name_en: "Aadhaar Correction & Address Update",
    service_name_hi: "\u0906\u0927\u093E\u0930 \u0938\u0941\u0927\u093E\u0930 \u090F\u0935\u0902 \u092A\u0924\u093E \u092C\u0926\u0932\u093E\u0935",
    category: "Aadhaar",
    short_description_en: "Name, DOB, gender, or address correction in your existing Aadhaar card with valid proof.",
    short_description_hi: "\u0906\u0927\u093E\u0930 \u0915\u093E\u0930\u094D\u0921 \u092E\u0947\u0902 \u0928\u093E\u092E, \u091C\u0928\u094D\u092E\u0924\u093F\u0925\u093F, \u0932\u093F\u0902\u0917 \u0905\u0925\u0935\u093E \u092A\u0924\u0947 \u092E\u0947\u0902 \u0938\u0941\u0927\u093E\u0930 \u0915\u0947 \u0932\u093F\u090F \u0909\u091A\u093F\u0924 \u0926\u0938\u094D\u0924\u093E\u0935\u0947\u091C\u094B\u0902 \u0915\u0947 \u0938\u093E\u0925 \u0906\u0935\u0947\u0926\u0928\u0964",
    full_description_en: "Get corrections in demographic details such as name spelling, date of birth, father/husband name, and residential address updated in Aadhaar database in accordance with UIDAI guidelines.",
    full_description_hi: "UIDAI \u0928\u093F\u092F\u092E\u094B\u0902 \u0915\u0947 \u0905\u0928\u0941\u0938\u093E\u0930 \u0906\u0927\u093E\u0930 \u0915\u093E\u0930\u094D\u0921 \u092E\u0947\u0902 \u0928\u093E\u092E, \u092A\u093F\u0924\u093E/\u092A\u0924\u093F \u0915\u093E \u0928\u093E\u092E, \u091C\u0928\u094D\u092E\u0924\u093F\u0925\u093F \u090F\u0935\u0902 \u0906\u0935\u093E\u0938\u0940\u092F \u092A\u0924\u093E \u0920\u0940\u0915 \u0915\u0930\u093E\u0928\u0947 \u0939\u0947\u0924\u0941 \u0938\u0902\u092A\u0942\u0930\u094D\u0923 \u0926\u0938\u094D\u0924\u093E\u0935\u0947\u091C\u0940 \u0938\u0939\u093E\u092F\u0924\u093E\u0964",
    required_documents: [
      "Existing Aadhaar Card copy (\u0935\u0930\u094D\u0924\u092E\u093E\u0928 \u0906\u0927\u093E\u0930 \u092A\u094D\u0930\u0924\u093F)",
      "Proof of Identity (POI) / Proof of Address (POA)",
      "Voter ID / Electricity Bill / Rent Agreement / Marksheet (\u092F\u0926\u093F \u0932\u093E\u0917\u0942 \u0939\u094B)"
    ],
    icon: "UserCheck",
    status: "Active",
    popular: true,
    estimated_time: "3-7 Working Days",
    whatsapp_message: "Hello Balaji Communication, I want information about Aadhaar Correction.",
    created_at: "2026-01-10T10:00:00.000Z",
    updated_at: "2026-01-10T10:00:00.000Z"
  },
  {
    service_id: "srv-aadhaar-down",
    service_name_en: "Aadhaar Download & PVC Card Print",
    service_name_hi: "\u0906\u0927\u093E\u0930 \u0915\u093E\u0930\u094D\u0921 \u0921\u093E\u0909\u0928\u0932\u094B\u0921 \u090F\u0935\u0902 \u092A\u0940\u0935\u0940\u0938\u0940 \u0915\u093E\u0930\u094D\u0921 \u092A\u094D\u0930\u093F\u0902\u091F",
    category: "Aadhaar",
    short_description_en: "Instant e-Aadhaar PDF download and ordering durable plastic PVC Aadhaar card.",
    short_description_hi: "\u0924\u0941\u0930\u0902\u0924 \u0908-\u0906\u0927\u093E\u0930 \u0921\u093E\u0909\u0928\u0932\u094B\u0921 \u0914\u0930 \u0935\u0949\u091F\u0930\u092A\u094D\u0930\u0942\u092B \u0938\u0941\u0930\u0915\u094D\u0937\u093F\u0924 \u092A\u0940\u0935\u0940\u0938\u0940 (\u092A\u094D\u0932\u093E\u0938\u094D\u091F\u093F\u0915) \u0915\u093E\u0930\u094D\u0921 \u092C\u0928\u0935\u093E\u0928\u0947 \u0915\u0940 \u0938\u0941\u0935\u093F\u0927\u093E\u0964",
    full_description_en: "Lost your physical Aadhaar card? Get high-quality e-Aadhaar downloaded instantly through OTP and order official UIDAI PVC smart card with QR code and hologram.",
    full_description_hi: "\u092F\u0926\u093F \u0906\u0927\u093E\u0930 \u0916\u094B \u0917\u092F\u093E \u0939\u0948, \u0924\u094B \u0924\u0941\u0930\u0902\u0924 \u0913\u091F\u0940\u092A\u0940 \u0915\u0947 \u092E\u093E\u0927\u094D\u092F\u092E \u0938\u0947 \u0908-\u0906\u0927\u093E\u0930 \u0921\u093E\u0909\u0928\u0932\u094B\u0921 \u0915\u0930\u093E\u090F\u0902 \u092F\u093E \u0906\u0927\u093F\u0915\u093E\u0930\u093F\u0915 \u0915\u094D\u092F\u0942\u0906\u0930 \u0915\u094B\u0921 \u092F\u0941\u0915\u094D\u0924 \u092A\u0940\u0935\u0940\u0938\u0940 \u092A\u094D\u0932\u093E\u0938\u094D\u091F\u093F\u0915 \u0915\u093E\u0930\u094D\u0921 \u092E\u0902\u0917\u0935\u093E\u090F\u0902\u0964",
    required_documents: [
      "Aadhaar Number or Enrollment ID (\u0906\u0927\u093E\u0930 \u0928\u0902\u092C\u0930 \u092F\u093E \u090F\u0928\u0930\u094B\u0932\u092E\u0947\u0902\u091F \u092A\u0930\u094D\u091A\u0940)",
      "Registered Mobile Phone for OTP (\u0913\u091F\u0940\u092A\u0940 \u0915\u0947 \u0932\u093F\u090F \u0930\u091C\u093F\u0938\u094D\u091F\u0930\u094D\u0921 \u092E\u094B\u092C\u093E\u0907\u0932)"
    ],
    icon: "CreditCard",
    status: "Active",
    popular: true,
    estimated_time: "Instant Download / 7-10 days for Speed Post PVC",
    whatsapp_message: "Hello Balaji Communication, I want information about Aadhaar Download and PVC Card.",
    created_at: "2026-01-10T10:00:00.000Z",
    updated_at: "2026-01-10T10:00:00.000Z"
  },
  {
    service_id: "srv-ration-new",
    service_name_en: "New Ration Card Application",
    service_name_hi: "\u0928\u092F\u093E \u0930\u093E\u0936\u0928 \u0915\u093E\u0930\u094D\u0921 \u0911\u0928\u0932\u093E\u0907\u0928 \u0906\u0935\u0947\u0926\u0928",
    category: "Ration Card",
    short_description_en: "Assistance in applying for new APL/BPL/Antyodaya ration cards for eligible families.",
    short_description_hi: "\u092A\u093E\u0924\u094D\u0930 \u092A\u0930\u093F\u0935\u093E\u0930\u094B\u0902 \u0915\u0947 \u0932\u093F\u090F \u0928\u092F\u093E \u0930\u093E\u0936\u0928 \u0915\u093E\u0930\u094D\u0921 (\u092A\u093E\u0924\u094D\u0930 \u0917\u0943\u0939\u0938\u094D\u0925\u0940 / \u0905\u0902\u0924\u094D\u092F\u094B\u0926\u092F) \u0911\u0928\u0932\u093E\u0907\u0928 \u0905\u092A\u094D\u0932\u093E\u0908 \u0915\u0930\u0928\u0947 \u092E\u0947\u0902 \u0938\u0939\u093E\u092F\u0924\u093E\u0964",
    full_description_en: "Complete documentation and online portal registration for fresh ration card applications. Includes family member details verification and departmental tracking.",
    full_description_hi: "\u092A\u0930\u093F\u0935\u093E\u0930 \u0915\u0947 \u0938\u092D\u0940 \u0938\u0926\u0938\u094D\u092F\u094B\u0902 \u0915\u0947 \u0935\u093F\u0935\u0930\u0923, \u0906\u0927\u093E\u0930 \u090F\u0935\u0902 \u0906\u092F \u092A\u094D\u0930\u092E\u093E\u0923 \u092A\u0924\u094D\u0930 \u0915\u0947 \u0938\u093E\u0925 \u0916\u093E\u0926\u094D\u092F \u090F\u0935\u0902 \u0930\u0938\u0926 \u0935\u093F\u092D\u093E\u0917 \u0915\u0947 \u092A\u094B\u0930\u094D\u091F\u0932 \u092A\u0930 \u0928\u090F \u0930\u093E\u0936\u0928 \u0915\u093E\u0930\u094D\u0921 \u0915\u0947 \u0932\u093F\u090F \u0906\u0935\u0947\u0926\u0928\u0964",
    required_documents: [
      "Head of Family (Female) Aadhaar Card & Photo (\u092A\u0930\u093F\u0935\u093E\u0930 \u0915\u0940 \u092E\u0941\u0916\u093F\u092F\u093E \u0915\u0940 \u092B\u094B\u091F\u094B \u0935 \u0906\u0927\u093E\u0930)",
      "Aadhaar card copies of all family members (\u0938\u092D\u0940 \u0938\u0926\u0938\u094D\u092F\u094B\u0902 \u0915\u0947 \u0906\u0927\u093E\u0930 \u0915\u093E\u0930\u094D\u0921)",
      "Income Certificate (\u0906\u092F \u092A\u094D\u0930\u092E\u093E\u0923 \u092A\u0924\u094D\u0930)",
      "Bank Passbook copy (\u092C\u0948\u0902\u0915 \u092A\u093E\u0938\u092C\u0941\u0915)",
      "Electricity Bill or Residence Proof (\u0928\u093F\u0935\u093E\u0938 \u092A\u094D\u0930\u092E\u093E\u0923)"
    ],
    icon: "FileSpreadsheet",
    status: "Active",
    popular: true,
    estimated_time: "15-30 Working Days (Subject to Food Dept inspection)",
    whatsapp_message: "Hello Balaji Communication, I want information about New Ration Card Apply.",
    created_at: "2026-01-10T10:00:00.000Z",
    updated_at: "2026-01-10T10:00:00.000Z"
  },
  {
    service_id: "srv-ration-corr",
    service_name_en: "Ration Card Correction & Member Add/Remove",
    service_name_hi: "\u0930\u093E\u0936\u0928 \u0915\u093E\u0930\u094D\u0921 \u0938\u0902\u0936\u094B\u0927\u0928 \u090F\u0935\u0902 \u092F\u0942\u0928\u093F\u091F \u091C\u094B\u0921\u093C\u0928\u093E/\u0939\u091F\u093E\u0928\u093E",
    category: "Ration Card",
    short_description_en: "Add new family member/child, remove married member, or correct names in ration card.",
    short_description_hi: "\u0930\u093E\u0936\u0928 \u0915\u093E\u0930\u094D\u0921 \u092E\u0947\u0902 \u0928\u090F \u092C\u091A\u094D\u091A\u0947/\u0938\u0926\u0938\u094D\u092F \u0915\u093E \u0928\u093E\u092E \u091C\u094B\u0921\u093C\u0928\u093E, \u0928\u093E\u092E \u0939\u091F\u093E\u0928\u093E \u0905\u0925\u0935\u093E \u0917\u0932\u0924\u093F\u092F\u094B\u0902 \u092E\u0947\u0902 \u0938\u0941\u0927\u093E\u0930\u0964",
    full_description_en: "Online submission for adding newborn children or daughters-in-law into existing ration cards, surrendering/removing units upon marriage, or modifying head of household.",
    full_description_hi: "\u0935\u093F\u0935\u093E\u0939 \u0915\u0947 \u092A\u0936\u094D\u091A\u093E\u0924 \u0928\u0908 \u092C\u0939\u0942 \u0915\u093E \u0928\u093E\u092E \u091C\u094B\u0921\u093C\u0928\u093E, \u0928\u0935\u091C\u093E\u0924 \u0936\u093F\u0936\u0941 \u0915\u0940 \u092F\u0942\u0928\u093F\u091F \u091C\u094B\u0921\u093C\u0928\u093E \u092F\u093E \u0930\u093E\u0936\u0928 \u0915\u093E\u0930\u094D\u0921 \u092E\u0947\u0902 \u0928\u093E\u092E \u0915\u0940 \u0938\u094D\u092A\u0947\u0932\u093F\u0902\u0917 \u0926\u0941\u0930\u0941\u0938\u094D\u0924 \u0915\u0930\u093E\u0928\u0947 \u0915\u0940 \u0911\u0928\u0932\u093E\u0907\u0928 \u092A\u094D\u0930\u0915\u094D\u0930\u093F\u092F\u093E\u0964",
    required_documents: [
      "Original Ration Card Number (\u0930\u093E\u0936\u0928 \u0915\u093E\u0930\u094D\u0921 \u0928\u0902\u092C\u0930)",
      "New member's Aadhaar Card / Birth Certificate (\u0928\u090F \u0938\u0926\u0938\u094D\u092F \u0915\u093E \u0906\u0927\u093E\u0930 \u092F\u093E \u091C\u0928\u094D\u092E \u092A\u094D\u0930\u092E\u093E\u0923 \u092A\u0924\u094D\u0930)",
      "Marriage Certificate (\u0935\u093F\u0935\u093E\u0939 \u092A\u094D\u0930\u092E\u093E\u0923 \u092A\u0924\u094D\u0930 - \u092F\u0926\u093F \u0932\u093E\u0917\u0942 \u0939\u094B)"
    ],
    icon: "Users",
    status: "Active",
    popular: false,
    estimated_time: "10-20 Working Days",
    whatsapp_message: "Hello Balaji Communication, I want information about Ration Card Member Addition or Correction.",
    created_at: "2026-01-10T10:00:00.000Z",
    updated_at: "2026-01-10T10:00:00.000Z"
  },
  {
    service_id: "srv-pmkisan-reg",
    service_name_en: "PM Kisan Samman Nidhi Registration",
    service_name_hi: "\u092A\u0940\u090F\u092E \u0915\u093F\u0938\u093E\u0928 \u0938\u092E\u094D\u092E\u093E\u0928 \u0928\u093F\u0927\u093F \u0928\u092F\u093E \u092A\u0902\u091C\u0940\u0915\u0930\u0923",
    category: "PM Kisan",
    short_description_en: "New farmer enrollment to receive \u20B96,000 yearly direct benefit from Government of India.",
    short_description_hi: "\u092A\u093E\u0924\u094D\u0930 \u0915\u093F\u0938\u093E\u0928 \u092D\u093E\u0907\u092F\u094B\u0902 \u0915\u0947 \u0932\u093F\u090F \u0938\u093E\u0932\u093E\u0928\u093E \u20B96,000 \u0938\u0939\u093E\u092F\u0924\u093E \u092A\u094D\u0930\u093E\u092A\u094D\u0924 \u0915\u0930\u0928\u0947 \u0939\u0947\u0924\u0941 \u0928\u092F\u093E \u0911\u0928\u0932\u093E\u0907\u0928 \u092A\u0902\u091C\u0940\u0915\u0930\u0923\u0964",
    full_description_en: "Assistance for small and marginal landholding farmer families to register under PM-KISAN scheme, upload land revenue records (Khatauni) and verify bank details.",
    full_description_hi: "\u092A\u0940\u090F\u092E-\u0915\u093F\u0938\u093E\u0928 \u092F\u094B\u091C\u0928\u093E \u0915\u0947 \u0905\u0902\u0924\u0930\u094D\u0917\u0924 \u0915\u093F\u0938\u093E\u0928\u094B\u0902 \u0915\u093E \u0911\u0928\u0932\u093E\u0907\u0928 \u0930\u091C\u093F\u0938\u094D\u091F\u094D\u0930\u0947\u0936\u0928, \u0916\u0924\u094C\u0928\u0940 \u092D\u0942\u0932\u0947\u0916 \u0935\u093F\u0935\u0930\u0923 \u0926\u0930\u094D\u091C \u0915\u0930\u0928\u093E \u090F\u0935\u0902 \u092C\u0948\u0902\u0915 \u0916\u093E\u0924\u0947 \u0915\u093E \u0938\u0924\u094D\u092F\u093E\u092A\u0928\u0964",
    required_documents: [
      "Farmer's Aadhaar Card (\u0915\u093F\u0938\u093E\u0928 \u0915\u093E \u0906\u0927\u093E\u0930 \u0915\u093E\u0930\u094D\u0921)",
      "Land Ownership Record / Khatauni (\u0916\u0938\u0930\u093E/\u0916\u0924\u094C\u0928\u0940 \u0915\u0940 \u0928\u0915\u0932)",
      "Bank Account Passbook with IFSC (\u092C\u0948\u0902\u0915 \u092A\u093E\u0938\u092C\u0941\u0915)",
      "Aadhaar-linked Mobile Number (\u0906\u0927\u093E\u0930 \u0938\u0947 \u0932\u093F\u0902\u0915 \u092E\u094B\u092C\u093E\u0907\u0932 \u0928\u0902\u092C\u0930)"
    ],
    icon: "Tractor",
    status: "Active",
    popular: true,
    estimated_time: "Departmental verification by Revenue/Patwari",
    whatsapp_message: "Hello Balaji Communication, I want information about PM Kisan Registration.",
    created_at: "2026-01-10T10:00:00.000Z",
    updated_at: "2026-01-10T10:00:00.000Z"
  },
  {
    service_id: "srv-pmkisan-kyc",
    service_name_en: "PM Kisan e-KYC & Status Check",
    service_name_hi: "\u092A\u0940\u090F\u092E \u0915\u093F\u0938\u093E\u0928 \u0908-\u0915\u0947\u0935\u093E\u0908\u0938\u0940 \u090F\u0935\u0902 \u0915\u093F\u0938\u094D\u0924 \u0938\u094D\u0925\u093F\u0924\u093F \u091C\u093E\u0902\u091A",
    category: "PM Kisan",
    short_description_en: "Mandatory OTP/Biometric e-KYC to ensure continuous payment of PM Kisan installments.",
    short_description_hi: "\u0915\u093F\u0938\u094D\u0924 \u0928 \u0930\u0941\u0915\u0928\u0947 \u092A\u093E\u090F \u0907\u0938\u0915\u0947 \u0932\u093F\u090F \u092C\u093E\u092F\u094B\u092E\u0947\u091F\u094D\u0930\u093F\u0915 \u092F\u093E \u0906\u0927\u093E\u0930 \u0913\u091F\u0940\u092A\u0940 \u0938\u0947 \u0924\u0941\u0930\u0902\u0924 \u0908-\u0915\u0947\u0935\u093E\u0908\u0938\u0940 \u0915\u0930\u0935\u093E\u090F\u0902\u0964",
    full_description_en: "If your PM-Kisan installment is stuck due to pending eKYC, land-seeding issues, or NPCI bank account mapping, visit our center for instant resolution.",
    full_description_hi: "\u0905\u091F\u0915\u0940 \u0939\u0941\u0908 \u0915\u093F\u0938\u094D\u0924\u0947\u0902 \u091A\u093E\u0932\u0942 \u0915\u0930\u093E\u0928\u0947, \u092D\u0942\u092E\u093F \u0938\u0940\u0921\u093F\u0902\u0917 \u0938\u092E\u0938\u094D\u092F\u093E \u0926\u0942\u0930 \u0915\u0930\u0928\u0947 \u0914\u0930 \u0908-\u0915\u0947\u0935\u093E\u0908\u0938\u0940 \u092B\u093F\u0902\u0917\u0930\u092A\u094D\u0930\u093F\u0902\u091F \u092F\u093E \u0913\u091F\u0940\u092A\u0940 \u0926\u094D\u0935\u093E\u0930\u093E \u0924\u0941\u0930\u0902\u0924 \u092A\u0942\u0930\u094D\u0923 \u0915\u0930\u093E\u0928\u0947 \u0915\u0940 \u0938\u0947\u0935\u093E\u0964",
    required_documents: [
      "Aadhaar Card (\u0906\u0927\u093E\u0930 \u0915\u093E\u0930\u094D\u0921)",
      "Aadhaar Registered Mobile Number (\u0913\u091F\u0940\u092A\u0940 \u0915\u0947 \u0932\u093F\u090F \u092E\u094B\u092C\u093E\u0907\u0932)"
    ],
    icon: "ShieldCheck",
    status: "Active",
    popular: true,
    estimated_time: "Instant (5 Minutes)",
    whatsapp_message: "Hello Balaji Communication, I want information about PM Kisan e-KYC.",
    created_at: "2026-01-10T10:00:00.000Z",
    updated_at: "2026-01-10T10:00:00.000Z"
  },
  {
    service_id: "srv-ayushman-card",
    service_name_en: "Ayushman Card Apply & Download",
    service_name_hi: "\u0906\u092F\u0941\u0937\u094D\u092E\u093E\u0928 \u092D\u093E\u0930\u0924 \u0917\u094B\u0932\u094D\u0921\u0928 \u0915\u093E\u0930\u094D\u0921 (\u20B95 \u0932\u093E\u0916 \u092E\u0941\u092B\u094D\u0924 \u0907\u0932\u093E\u091C)",
    category: "Ayushman",
    short_description_en: "Check eligibility under PM-JAY and apply/download your cashless hospital treatment card.",
    short_description_hi: "\u092A\u094D\u0930\u0924\u093F\u0935\u0930\u094D\u0937 \u20B95 \u0932\u093E\u0916 \u0924\u0915 \u0915\u0947 \u092E\u0941\u092B\u094D\u0924 \u0907\u0932\u093E\u091C \u0939\u0947\u0924\u0941 \u0906\u092F\u0941\u0937\u094D\u092E\u093E\u0928 \u092D\u093E\u0930\u0924 \u0915\u093E\u0930\u094D\u0921 \u0915\u0940 \u092A\u093E\u0924\u094D\u0930\u0924\u093E \u091C\u093E\u0902\u091A, \u0906\u0935\u0947\u0926\u0928 \u0935 \u0921\u093E\u0909\u0928\u0932\u094B\u0921\u0964",
    full_description_en: "Under Ayushman Bharat Pradhan Mantri Jan Arogya Yojana, eligible families get cashless treatment up to \u20B95 lakh per year in empanelled hospitals. We verify your name in the SECC list or Ration Card database and generate the official PVC card.",
    full_description_hi: "\u092A\u093E\u0924\u094D\u0930\u0924\u093E \u0938\u0942\u091A\u0940 \u092F\u093E \u0930\u093E\u0936\u0928 \u0915\u093E\u0930\u094D\u0921 \u0915\u0947 \u0906\u0927\u093E\u0930 \u092A\u0930 \u0906\u092F\u0941\u0937\u094D\u092E\u093E\u0928 \u0915\u093E\u0930\u094D\u0921 \u0915\u0947\u0935\u093E\u0908\u0938\u0940, \u0928\u093E\u092E \u0938\u0930\u094D\u091A \u0914\u0930 \u0924\u0941\u0930\u0902\u0924 \u0913\u0930\u093F\u091C\u093F\u0928\u0932 \u0906\u092F\u0941\u0937\u094D\u092E\u093E\u0928 \u092A\u0940\u0935\u0940\u0938\u0940 \u0915\u093E\u0930\u094D\u0921 \u092A\u094D\u0930\u093F\u0902\u091F \u0915\u0940 \u0938\u0941\u0935\u093F\u0927\u093E\u0964",
    required_documents: [
      "Aadhaar Card of Applicant (\u0906\u0935\u0947\u0926\u0915 \u0915\u093E \u0906\u0927\u093E\u0930 \u0915\u093E\u0930\u094D\u0921)",
      "Ration Card with 6+ units or PM-JAY letter (\u0930\u093E\u0936\u0928 \u0915\u093E\u0930\u094D\u0921 \u092F\u093E \u0906\u092F\u0941\u0937\u094D\u092E\u093E\u0928 \u092A\u0924\u094D\u0930)",
      "Mobile Phone for OTP authentication (\u0913\u091F\u0940\u092A\u0940 \u0915\u0947 \u0932\u093F\u090F \u092E\u094B\u092C\u093E\u0907\u0932)"
    ],
    icon: "HeartPulse",
    status: "Active",
    popular: true,
    estimated_time: "Instant eligibility verification; Approval within 24-48 Hours",
    whatsapp_message: "Hello Balaji Communication, I want information about Ayushman Card.",
    created_at: "2026-01-10T10:00:00.000Z",
    updated_at: "2026-01-10T10:00:00.000Z"
  },
  {
    service_id: "srv-voter-id",
    service_name_en: "Voter ID / \u092A\u0939\u091A\u093E\u0928 \u092A\u0924\u094D\u0930 Apply & Correction",
    service_name_hi: "\u0935\u094B\u091F\u0930 \u0906\u0908\u0921\u0940 (\u092A\u0939\u091A\u093E\u0928 \u092A\u0924\u094D\u0930) \u0928\u092F\u093E \u0906\u0935\u0947\u0926\u0928 \u090F\u0935\u0902 \u0938\u0902\u0936\u094B\u0927\u0928",
    category: "Voter ID",
    short_description_en: "New voter registration (Form 6), address shift (Form 8), and digital e-EPIC download.",
    short_description_hi: "18 \u0935\u0930\u094D\u0937 \u092A\u0942\u0930\u094D\u0923 \u0939\u094B\u0928\u0947 \u092A\u0930 \u0928\u092F\u093E \u092A\u0939\u091A\u093E\u0928 \u092A\u0924\u094D\u0930 \u092C\u0928\u0935\u093E\u0928\u093E, \u092A\u0924\u093E \u092C\u0926\u0932\u0928\u093E \u092F\u093E \u0921\u093F\u091C\u093F\u091F\u0932 \u0935\u094B\u091F\u0930 \u0915\u093E\u0930\u094D\u0921 \u0921\u093E\u0909\u0928\u0932\u094B\u0921\u0964",
    full_description_en: "Assistance for citizens on the Election Commission of India (ECI) portal to apply for a fresh voter ID card, modify constituency, or replace old black & white voter cards with new colorful smart cards.",
    full_description_hi: "\u092D\u093E\u0930\u0924 \u0928\u093F\u0930\u094D\u0935\u093E\u091A\u0928 \u0906\u092F\u094B\u0917 \u0915\u0947 \u092A\u094B\u0930\u094D\u091F\u0932 \u092A\u0930 \u092B\u0949\u0930\u094D\u092E 6 \u0926\u094D\u0935\u093E\u0930\u093E \u0928\u092F\u093E \u092A\u0939\u091A\u093E\u0928 \u092A\u0924\u094D\u0930 \u0906\u0935\u0947\u0926\u0928, \u092B\u094B\u091F\u094B \u090F\u0935\u0902 \u092A\u0924\u0947 \u092E\u0947\u0902 \u0938\u0902\u0936\u094B\u0927\u0928 \u0924\u0925\u093E \u0908-\u090F\u092A\u093F\u0915 \u0921\u093E\u0909\u0928\u0932\u094B\u0921 \u0938\u0941\u0935\u093F\u0927\u093E\u0964",
    required_documents: [
      "Passport size photograph (\u092A\u093E\u0938\u092A\u094B\u0930\u094D\u091F \u0938\u093E\u0907\u091C \u092B\u094B\u091F\u094B)",
      "Age Proof - 10th Marksheet or Birth Certificate or Aadhaar (\u0906\u092F\u0941 \u092A\u094D\u0930\u092E\u093E\u0923)",
      "Address Proof - Electricity Bill or Rent Agreement or Aadhaar (\u0928\u093F\u0935\u093E\u0938 \u092A\u094D\u0930\u092E\u093E\u0923)",
      "Family member's existing Voter ID number (\u092A\u0930\u093F\u0935\u093E\u0930 \u0915\u0947 \u0915\u093F\u0938\u0940 \u0938\u0926\u0938\u094D\u092F \u0915\u093E \u0935\u094B\u091F\u0930 \u0915\u093E\u0930\u094D\u0921 \u0928\u0902\u092C\u0930)"
    ],
    icon: "Vote",
    status: "Active",
    popular: true,
    estimated_time: "15-30 Days (Subject to BLO verification)",
    whatsapp_message: "Hello Balaji Communication, I want information about Voter ID application.",
    created_at: "2026-01-10T10:00:00.000Z",
    updated_at: "2026-01-10T10:00:00.000Z"
  },
  {
    service_id: "srv-pan-card",
    service_name_en: "PAN Card Apply & Correction",
    service_name_hi: "\u0928\u092F\u093E \u092A\u0948\u0928 \u0915\u093E\u0930\u094D\u0921 \u0906\u0935\u0947\u0926\u0928 \u090F\u0935\u0902 \u0938\u0941\u0927\u093E\u0930",
    category: "PAN Card",
    short_description_en: "New Instant e-PAN, minor PAN card, firm PAN card, or correction in name/father's name.",
    short_description_hi: "\u0928\u092F\u093E \u092A\u0948\u0928 \u0915\u093E\u0930\u094D\u0921 (\u0935\u092F\u0938\u094D\u0915/\u0928\u093E\u092C\u093E\u0932\u093F\u0917), \u0916\u094B\u090F \u0939\u0941\u090F \u092A\u0948\u0928 \u0915\u094B \u0926\u094B\u092C\u093E\u0930\u093E \u092A\u094D\u0930\u093E\u092A\u094D\u0924 \u0915\u0930\u0928\u093E \u092F\u093E \u0928\u093E\u092E-\u091C\u0928\u094D\u092E\u0924\u093F\u0925\u093F \u0938\u0941\u0927\u093E\u0930\u0964",
    full_description_en: "Online submission via NSDL / UTIITSL for new PAN allocation or updating details. Get digital e-PAN on email within 2-3 days and physical plastic PAN delivered to your home address.",
    full_description_hi: "NSDL / UTIITSL \u092A\u094B\u0930\u094D\u091F\u0932 \u0915\u0947 \u092E\u093E\u0927\u094D\u092F\u092E \u0938\u0947 \u0928\u092F\u093E \u092A\u0948\u0928 \u0915\u093E\u0930\u094D\u0921 \u0906\u0935\u0947\u0926\u0928\u0964 2 \u0938\u0947 3 \u0926\u093F\u0928 \u092E\u0947\u0902 \u0908\u092E\u0947\u0932 \u092A\u0930 \u0908-\u092A\u0948\u0928 \u090F\u0935\u0902 \u0938\u094D\u092A\u0940\u0921 \u092A\u094B\u0938\u094D\u091F \u0926\u094D\u0935\u093E\u0930\u093E \u0918\u0930 \u092A\u0930 \u0913\u0930\u093F\u091C\u093F\u0928\u0932 \u0915\u093E\u0930\u094D\u0921 \u092A\u094D\u0930\u093E\u092A\u094D\u0924 \u0915\u0930\u0947\u0902\u0964",
    required_documents: [
      "Aadhaar Card (with correct details) (\u0906\u0927\u093E\u0930 \u0915\u093E\u0930\u094D\u0921)",
      "Two Passport Size Photographs (\u0926\u094B \u092A\u093E\u0938\u092A\u094B\u0930\u094D\u091F \u0938\u093E\u0907\u091C \u092B\u094B\u091F\u094B)",
      "Existing PAN number (in case of correction or duplicate)"
    ],
    icon: "BadgePercent",
    status: "Active",
    popular: true,
    estimated_time: "2-3 Days for e-PAN; 10-15 Days for physical card",
    whatsapp_message: "Hello Balaji Communication, I want information about PAN Card application.",
    created_at: "2026-01-10T10:00:00.000Z",
    updated_at: "2026-01-10T10:00:00.000Z"
  },
  {
    service_id: "srv-income-cert",
    service_name_en: "Income Certificate (\u0906\u092F \u092A\u094D\u0930\u092E\u093E\u0923 \u092A\u0924\u094D\u0930)",
    service_name_hi: "\u0906\u092F \u092A\u094D\u0930\u092E\u093E\u0923 \u092A\u0924\u094D\u0930 \u0911\u0928\u0932\u093E\u0907\u0928 \u0906\u0935\u0947\u0926\u0928",
    category: "Certificates",
    short_description_en: "Government issued income certificate for student scholarships, fee concession, and schemes.",
    short_description_hi: "\u091B\u093E\u0924\u094D\u0930\u0935\u0943\u0924\u094D\u0924\u093F, \u0938\u094D\u0915\u0942\u0932-\u0915\u0949\u0932\u0947\u091C \u092A\u094D\u0930\u0935\u0947\u0936 \u090F\u0935\u0902 \u0938\u0930\u0915\u093E\u0930\u0940 \u092F\u094B\u091C\u0928\u093E\u0913\u0902 \u0939\u0947\u0924\u0941 \u0905\u0927\u093F\u0915\u0943\u0924 \u0906\u092F \u092A\u094D\u0930\u092E\u093E\u0923 \u092A\u0924\u094D\u0930\u0964",
    full_description_en: "Assistance on state e-District portal for applying, uploading self-declaration, and downloading Tehsildar verified Income Certificate.",
    full_description_hi: "\u0908-\u0921\u093F\u0938\u094D\u091F\u094D\u0930\u093F\u0915\u094D\u091F \u092A\u094B\u0930\u094D\u091F\u0932 \u0915\u0947 \u092E\u093E\u0927\u094D\u092F\u092E \u0938\u0947 \u0938\u094D\u0935\u092A\u094D\u0930\u092E\u093E\u0923\u093F\u0924 \u0918\u094B\u0937\u0923\u093E \u092A\u0924\u094D\u0930 \u090F\u0935\u0902 \u0906\u0935\u0936\u094D\u092F\u0915 \u0926\u0938\u094D\u0924\u093E\u0935\u0947\u091C\u094B\u0902 \u0915\u0947 \u0938\u093E\u0925 \u0906\u092F \u092A\u094D\u0930\u092E\u093E\u0923 \u092A\u0924\u094D\u0930 \u0915\u093E \u0906\u0935\u0947\u0926\u0928\u0964",
    required_documents: [
      "Aadhaar Card of Applicant & Guardian (\u0906\u0927\u093E\u0930 \u0915\u093E\u0930\u094D\u0921)",
      "Self-Declaration Form (\u0938\u094D\u0935\u092A\u094D\u0930\u092E\u093E\u0923\u093F\u0924 \u0918\u094B\u0937\u0923\u093E \u092A\u0924\u094D\u0930)",
      "Salary Slip or Salary Certificate (if employed) / Gram Pradhan/Councillor report",
      "Passport Size Photo (\u092A\u093E\u0938\u092A\u094B\u0930\u094D\u091F \u0938\u093E\u0907\u091C \u092B\u094B\u091F\u094B)"
    ],
    icon: "FileCheck2",
    status: "Active",
    popular: true,
    estimated_time: "7-15 Working Days (Revenue Dept)",
    whatsapp_message: "Hello Balaji Communication, I want information about Income Certificate.",
    created_at: "2026-01-10T10:00:00.000Z",
    updated_at: "2026-01-10T10:00:00.000Z"
  },
  {
    service_id: "srv-caste-cert",
    service_name_en: "Caste Certificate (\u091C\u093E\u0924\u093F \u092A\u094D\u0930\u092E\u093E\u0923 \u092A\u0924\u094D\u0930)",
    service_name_hi: "\u091C\u093E\u0924\u093F \u092A\u094D\u0930\u092E\u093E\u0923 \u092A\u0924\u094D\u0930 (SC / ST / OBC / EWS)",
    category: "Certificates",
    short_description_en: "Official caste certificate for competitive examinations, reservations, and state benefits.",
    short_description_hi: "\u0938\u0930\u0915\u093E\u0930\u0940 \u0928\u094C\u0915\u0930\u093F\u092F\u094B\u0902, \u0906\u0930\u0915\u094D\u0937\u0923 \u090F\u0935\u0902 \u0909\u091A\u094D\u091A \u0936\u093F\u0915\u094D\u0937\u093E \u092E\u0947\u0902 \u0932\u093E\u092D \u0939\u0947\u0924\u0941 \u0905\u0927\u093F\u0915\u0943\u0924 \u091C\u093E\u0924\u093F \u092A\u094D\u0930\u092E\u093E\u0923 \u092A\u0924\u094D\u0930\u0964",
    full_description_en: "State and Central format caste certificates application with proper revenue validation, ancestral land record proofs, and digital verification.",
    full_description_hi: "\u0930\u093E\u091C\u094D\u092F \u090F\u0935\u0902 \u0915\u0947\u0902\u0926\u094D\u0930 \u0938\u0930\u0915\u093E\u0930 \u0915\u0947 \u092A\u094D\u0930\u093E\u0930\u0942\u092A \u092E\u0947\u0902 \u090F\u0938\u0938\u0940, \u090F\u0938\u091F\u0940, \u0913\u092C\u0940\u0938\u0940 \u090F\u0935\u0902 \u0908\u0921\u092C\u094D\u0932\u094D\u092F\u0942\u090F\u0938 \u092A\u094D\u0930\u092E\u093E\u0923 \u092A\u0924\u094D\u0930 \u0915\u093E \u0911\u0928\u0932\u093E\u0907\u0928 \u0906\u0935\u0947\u0926\u0928\u0964",
    required_documents: [
      "Aadhaar Card (\u0906\u0927\u093E\u0930 \u0915\u093E\u0930\u094D\u0921)",
      "Old family member caste certificate or land registry mentioning caste (\u092A\u093E\u0930\u093F\u0935\u093E\u0930\u093F\u0915 \u091C\u093E\u0924\u093F \u092A\u094D\u0930\u092E\u093E\u0923)",
      "Self-Declaration Form (\u0938\u094D\u0935\u092A\u094D\u0930\u092E\u093E\u0923\u093F\u0924 \u0918\u094B\u0937\u0923\u093E \u092A\u0924\u094D\u0930)",
      "Passport Size Photograph (\u092B\u094B\u091F\u094B)"
    ],
    icon: "Award",
    status: "Active",
    popular: false,
    estimated_time: "7-15 Working Days",
    whatsapp_message: "Hello Balaji Communication, I want information about Caste Certificate.",
    created_at: "2026-01-10T10:00:00.000Z",
    updated_at: "2026-01-10T10:00:00.000Z"
  },
  {
    service_id: "srv-residence-cert",
    service_name_en: "Residence / Domicile Certificate (\u0928\u093F\u0935\u093E\u0938 \u092A\u094D\u0930\u092E\u093E\u0923 \u092A\u0924\u094D\u0930)",
    service_name_hi: "\u092E\u0942\u0932 \u0928\u093F\u0935\u093E\u0938 \u092A\u094D\u0930\u092E\u093E\u0923 \u092A\u0924\u094D\u0930 \u0911\u0928\u0932\u093E\u0907\u0928 \u0906\u0935\u0947\u0926\u0928",
    category: "Certificates",
    short_description_en: "Valid proof of permanent residence for admissions, government jobs, and police verification.",
    short_description_hi: "\u0938\u094D\u0925\u093E\u0928\u0940\u092F \u0928\u093F\u0935\u093E\u0938\u0940 \u0939\u094B\u0928\u0947 \u0915\u093E \u0915\u093E\u0928\u0942\u0928\u0940 \u092A\u094D\u0930\u092E\u093E\u0923 \u092A\u0924\u094D\u0930, \u091C\u094B \u0928\u094C\u0915\u0930\u093F\u092F\u094B\u0902 \u090F\u0935\u0902 \u092A\u094D\u0930\u0935\u0947\u0936 \u092E\u0947\u0902 \u0905\u0928\u093F\u0935\u093E\u0930\u094D\u092F \u0939\u0948\u0964",
    full_description_en: "Apply for official Domicile (Niwas Praman Patra) through e-District platform, verified by local Lekhpal / Tehsildar.",
    full_description_hi: "\u0924\u0939\u0938\u0940\u0932\u0926\u093E\u0930 \u0938\u094D\u0924\u0930 \u0938\u0947 \u0938\u0924\u094D\u092F\u093E\u092A\u093F\u0924 \u0921\u093F\u091C\u093F\u091F\u0932 \u0939\u0938\u094D\u0924\u093E\u0915\u094D\u0937\u0930\u093F\u0924 \u092E\u0942\u0932 \u0928\u093F\u0935\u093E\u0938 \u092A\u094D\u0930\u092E\u093E\u0923 \u092A\u0924\u094D\u0930 \u0915\u0947 \u0932\u093F\u090F \u0911\u0928\u0932\u093E\u0907\u0928 \u0906\u0935\u0947\u0926\u0928\u0964",
    required_documents: [
      "Aadhaar Card (\u0906\u0927\u093E\u0930 \u0915\u093E\u0930\u094D\u0921)",
      "Electricity Bill / Ration Card / Voter ID (\u0928\u093F\u0935\u093E\u0938 \u0915\u093E \u0938\u093E\u0915\u094D\u0937\u094D\u092F)",
      "10th Marksheet or School Leaving Certificate (\u0936\u0948\u0915\u094D\u0937\u0923\u093F\u0915 \u092A\u094D\u0930\u092E\u093E\u0923)",
      "Passport Size Photograph (\u092B\u094B\u091F\u094B)"
    ],
    icon: "Home",
    status: "Active",
    popular: false,
    estimated_time: "7-15 Working Days",
    whatsapp_message: "Hello Balaji Communication, I want information about Residence / Domicile Certificate.",
    created_at: "2026-01-10T10:00:00.000Z",
    updated_at: "2026-01-10T10:00:00.000Z"
  },
  {
    service_id: "srv-birth-cert",
    service_name_en: "Birth Certificate Assistance (\u091C\u0928\u094D\u092E \u092A\u094D\u0930\u092E\u093E\u0923 \u092A\u0924\u094D\u0930)",
    service_name_hi: "\u091C\u0928\u094D\u092E \u092A\u094D\u0930\u092E\u093E\u0923 \u092A\u0924\u094D\u0930 \u0911\u0928\u0932\u093E\u0907\u0928 \u0938\u0939\u093E\u092F\u0924\u093E",
    category: "Certificates",
    short_description_en: "Assistance in applying for municipal birth certificate for new-borns and delayed registrations.",
    short_description_hi: "\u0928\u0917\u0930 \u0928\u093F\u0917\u092E / \u092C\u094D\u0932\u0949\u0915 \u0938\u094D\u0924\u0930 \u092A\u0930 \u0928\u0935\u091C\u093E\u0924 \u092C\u091A\u094D\u091A\u094B\u0902 \u0905\u0925\u0935\u093E \u091B\u0942\u091F\u0947 \u0939\u0941\u090F \u091C\u0928\u094D\u092E \u092A\u094D\u0930\u092E\u093E\u0923 \u092A\u0924\u094D\u0930 \u0915\u0947 \u0932\u093F\u090F \u092E\u093E\u0930\u094D\u0917\u0926\u0930\u094D\u0936\u0928\u0964",
    full_description_en: "Civil Registration System (CRS) application filing, hospital discharge slip submission, and municipal follow-up support.",
    full_description_hi: "\u0938\u0940\u0906\u0930\u090F\u0938 \u092A\u094B\u0930\u094D\u091F\u0932 \u092A\u0930 \u091C\u0928\u094D\u092E \u092A\u0902\u091C\u0940\u0915\u0930\u0923, \u0905\u0938\u094D\u092A\u0924\u093E\u0932 \u0915\u0940 \u0921\u093F\u0938\u094D\u091A\u093E\u0930\u094D\u091C \u0938\u094D\u0932\u093F\u092A \u090F\u0935\u0902 \u092E\u093E\u0924\u093E-\u092A\u093F\u0924\u093E \u0915\u0947 \u092A\u0939\u091A\u093E\u0928 \u092A\u0924\u094D\u0930 \u0938\u0902\u0932\u0917\u094D\u0928 \u0915\u0930 \u0906\u0935\u0947\u0926\u0928\u0964",
    required_documents: [
      "Hospital Discharge Slip / Birth Slip (\u0905\u0938\u094D\u092A\u0924\u093E\u0932 \u0915\u0940 \u091C\u0928\u094D\u092E \u092A\u0930\u094D\u091A\u0940)",
      "Mother & Father Aadhaar Card (\u092E\u093E\u0924\u093E-\u092A\u093F\u0924\u093E \u0915\u093E \u0906\u0927\u093E\u0930 \u0915\u093E\u0930\u094D\u0921)",
      "Marriage Certificate / Joint declaration (\u0935\u093F\u0935\u093E\u0939 \u0938\u093E\u0915\u094D\u0937\u094D\u092F \u092F\u093E \u0918\u094B\u0937\u0923\u093E \u092A\u0924\u094D\u0930)"
    ],
    icon: "Baby",
    status: "Active",
    popular: false,
    estimated_time: "10-21 Working Days (Municipal authority)",
    whatsapp_message: "Hello Balaji Communication, I want information about Birth Certificate.",
    created_at: "2026-01-10T10:00:00.000Z",
    updated_at: "2026-01-10T10:00:00.000Z"
  },
  {
    service_id: "srv-online-forms",
    service_name_en: "Online Form Filling & Govt Job Applications",
    service_name_hi: "\u0938\u0930\u0915\u093E\u0930\u0940 \u0928\u094C\u0915\u0930\u0940 \u092B\u0949\u0930\u094D\u092E \u090F\u0935\u0902 \u0911\u0928\u0932\u093E\u0907\u0928 \u092B\u0949\u0930\u094D\u092E \u092B\u093F\u0932\u093F\u0902\u0917",
    category: "Other Digital Services",
    short_description_en: "Error-free form filling for SSC, Police, Railway, UPSC, Teaching, and college admissions.",
    short_description_hi: "\u090F\u0938\u090F\u0938\u0938\u0940, \u0930\u0947\u0932\u0935\u0947, \u092A\u0941\u0932\u093F\u0938, \u0936\u093F\u0915\u094D\u0937\u0915 \u092D\u0930\u094D\u0924\u0940, \u0928\u0940\u091F, \u091C\u0947\u0908\u0908 \u090F\u0935\u0902 \u0905\u0928\u094D\u092F \u092A\u094D\u0930\u0924\u093F\u092F\u094B\u0917\u0940 \u092A\u0930\u0940\u0915\u094D\u0937\u093E\u0913\u0902 \u0915\u0947 \u0938\u0939\u0940 \u092B\u0949\u0930\u094D\u092E\u0964",
    full_description_en: "Professional form submission with exact photo & signature resizing, document scanning, fee payment receipt generation, and admit card download.",
    full_description_hi: "\u0938\u091F\u0940\u0915 \u092B\u094B\u091F\u094B/\u0939\u0938\u094D\u0924\u093E\u0915\u094D\u0937\u0930 \u0938\u093E\u0907\u091C\u093F\u0902\u0917, \u092F\u094B\u0917\u094D\u092F\u0924\u093E \u0935\u093F\u0935\u0930\u0923 \u092A\u094D\u0930\u0935\u093F\u0937\u094D\u091F\u093F, \u0938\u0941\u0930\u0915\u094D\u0937\u093F\u0924 \u0911\u0928\u0932\u093E\u0907\u0928 \u092B\u0940\u0938 \u092D\u0941\u0917\u0924\u093E\u0928 \u0914\u0930 \u0906\u0935\u0947\u0926\u0928 \u092A\u094D\u0930\u093F\u0902\u091F \u0906\u0909\u091F\u0964",
    required_documents: [
      "Educational Marksheets (10th, 12th, Graduation) (\u0905\u0902\u0915\u092A\u0924\u094D\u0930)",
      "Passport size clear photo & signature (\u092B\u094B\u091F\u094B \u0935 \u0939\u0938\u094D\u0924\u093E\u0915\u094D\u0937\u0930)",
      "Category Certificate (if claiming reservation) (\u0906\u0930\u0915\u094D\u0937\u0923 \u092A\u094D\u0930\u092E\u093E\u0923)",
      "Aadhaar Card (\u0906\u0927\u093E\u0930 \u0915\u093E\u0930\u094D\u0921)"
    ],
    icon: "FileText",
    status: "Active",
    popular: true,
    estimated_time: "Immediate submission with confirmation receipt",
    whatsapp_message: "Hello Balaji Communication, I want information about Online Form Filling.",
    created_at: "2026-01-10T10:00:00.000Z",
    updated_at: "2026-01-10T10:00:00.000Z"
  },
  {
    service_id: "srv-print-scan",
    service_name_en: "Print, Scan, Photocopy & Passport Photos",
    service_name_hi: "\u092A\u094D\u0930\u093F\u0902\u091F, \u0938\u094D\u0915\u0948\u0928, \u092B\u094B\u091F\u094B\u0915\u0949\u092A\u0940 \u090F\u0935\u0902 \u0924\u0924\u094D\u0915\u093E\u0932 \u092A\u093E\u0938\u092A\u094B\u0930\u094D\u091F \u0938\u093E\u0907\u091C \u092B\u094B\u091F\u094B",
    category: "Other Digital Services",
    short_description_en: "High-resolution color printing, document lamination, and instant 5-minute passport photos.",
    short_description_hi: "\u0939\u093E\u0908-\u0915\u094D\u0935\u093E\u0932\u093F\u091F\u0940 \u0930\u0902\u0917\u0940\u0928 \u0935 \u092C\u094D\u0932\u0948\u0915-\u0935\u094D\u0939\u093E\u0907\u091F \u092A\u094D\u0930\u093F\u0902\u091F, \u0926\u0938\u094D\u0924\u093E\u0935\u0947\u091C \u0932\u0948\u092E\u093F\u0928\u0947\u0936\u0928 \u090F\u0935\u0902 5 \u092E\u093F\u0928\u091F \u092E\u0947\u0902 \u092A\u093E\u0938\u092A\u094B\u0930\u094D\u091F \u092B\u094B\u091F\u094B\u0964",
    full_description_en: "Walk-in facilities for high-speed laser printing from WhatsApp/Email/Pen-drive, crisp scanning to PDF, and professional white/blue background passport photos.",
    full_description_hi: "\u0935\u094D\u0939\u093E\u091F\u094D\u0938\u090F\u092A, \u0908\u092E\u0947\u0932 \u0905\u0925\u0935\u093E \u092A\u0947\u0928\u0921\u094D\u0930\u093E\u0907\u0935 \u0938\u0947 \u0924\u0941\u0930\u0902\u0924 \u092A\u094D\u0930\u093F\u0902\u091F, \u0938\u092D\u0940 \u092A\u094D\u0930\u0915\u093E\u0930 \u0915\u0947 \u0915\u093E\u0917\u091C\u093E\u0924\u094B\u0902 \u0915\u0940 \u092B\u094B\u091F\u094B\u0915\u0949\u092A\u0940, \u0938\u0941\u0930\u0915\u094D\u0937\u093F\u0924 \u0932\u0948\u092E\u093F\u0928\u0947\u0936\u0928 \u090F\u0935\u0902 \u092A\u093E\u0938\u092A\u094B\u0930\u094D\u091F \u092B\u094B\u091F\u094B\u0964",
    required_documents: [
      "Original Document or Soft copy on WhatsApp/Email (\u092E\u0942\u0932 \u092A\u094D\u0930\u0924\u093F \u092F\u093E \u0921\u093F\u091C\u093F\u091F\u0932 \u092B\u093E\u0907\u0932)"
    ],
    icon: "Printer",
    status: "Active",
    popular: false,
    estimated_time: "Instant Walk-in (2-5 Minutes)",
    whatsapp_message: "Hello Balaji Communication, I want to print or scan documents.",
    created_at: "2026-01-10T10:00:00.000Z",
    updated_at: "2026-01-10T10:00:00.000Z"
  }
];
var CATEGORIES = [
  "All",
  "Aadhaar",
  "Ration Card",
  "PM Kisan",
  "Ayushman",
  "Voter ID",
  "PAN Card",
  "Certificates",
  "Other Digital Services"
];
var INITIAL_PRICELIST = [
  {
    price_id: "PRC-001",
    service_name: "Aadhaar Mobile Number Update",
    category: "Aadhaar Services",
    government_fee: "\u20B950",
    csc_service_fee: "\u20B930",
    total_fee: "\u20B980",
    processing_time: "24 to 48 Hours",
    eligibility_or_note: "UIDAI biometric update fee + Kendra verification assistance",
    status: "Active"
  },
  {
    price_id: "PRC-002",
    service_name: "Income / Caste / Domicile Certificate",
    category: "Revenue & eDistrict UP",
    government_fee: "\u20B915",
    csc_service_fee: "\u20B935",
    total_fee: "\u20B950",
    processing_time: "7 to 10 Days",
    eligibility_or_note: "Official UP Govt treasury challan + online application & scanning",
    status: "Active"
  },
  {
    price_id: "PRC-003",
    service_name: "New PAN Card (Physical Delivery to Home)",
    category: "NSDL / UTI Services",
    government_fee: "\u20B9107",
    csc_service_fee: "\u20B993",
    total_fee: "\u20B9200",
    processing_time: "10 to 15 Days",
    eligibility_or_note: "NSDL official fee + biometric e-KYC and Speed Post plastic card",
    status: "Active"
  },
  {
    price_id: "PRC-004",
    service_name: "Ayushman Bharat Golden Card Print",
    category: "Health Mission",
    government_fee: "\u20B90 (Govt Free)",
    csc_service_fee: "\u20B930",
    total_fee: "\u20B930",
    processing_time: "Instant 5 Mins",
    eligibility_or_note: "Government subsidy is free; High-grade waterproof PVC print charge",
    status: "Active"
  },
  {
    price_id: "PRC-005",
    service_name: "PM Kisan Samman Nidhi e-KYC",
    category: "Agriculture Services",
    government_fee: "\u20B90 (Govt Free)",
    csc_service_fee: "\u20B920",
    total_fee: "\u20B920",
    processing_time: "Instant Thumb Scan",
    eligibility_or_note: "Biometric thumb authentication machine and portal server charge",
    status: "Active"
  },
  {
    price_id: "PRC-006",
    service_name: "New Ration Card Application",
    category: "Food & Civil Supplies",
    government_fee: "\u20B90 (Govt Free)",
    csc_service_fee: "\u20B960",
    total_fee: "\u20B960",
    processing_time: "15 to 30 Days",
    eligibility_or_note: "Online FCS portal filing, unit registration and document upload",
    status: "Active"
  },
  {
    price_id: "PRC-007",
    service_name: "Voter ID New Registration / Correction",
    category: "Election Commission",
    government_fee: "\u20B90 (Govt Free)",
    csc_service_fee: "\u20B940",
    total_fee: "\u20B940",
    processing_time: "15 to 30 Days",
    eligibility_or_note: "Form 6 / Form 8 application filing with BLO follow-up guidance",
    status: "Active"
  },
  {
    price_id: "PRC-008",
    service_name: "PVC Smart Plastic Card Print (Aadhaar / Voter / PAN)",
    category: "Digital Print Services",
    government_fee: "\u20B90",
    csc_service_fee: "\u20B950",
    total_fee: "\u20B950",
    processing_time: "Instant 5 Mins",
    eligibility_or_note: "High definition UV waterproof smart PVC plastic card printing",
    status: "Active"
  }
];
var INITIAL_NOTICES = [
  {
    notice_id: "NTC-001",
    title_en: "PM Kisan 19th Installment e-KYC Mandatory",
    title_hi: "\u092A\u0940\u090F\u092E \u0915\u093F\u0938\u093E\u0928 19\u0935\u0940\u0902 \u0915\u093F\u0938\u094D\u0924 \u0939\u0947\u0924\u0941 \u092C\u093E\u092F\u094B\u092E\u0947\u091F\u094D\u0930\u093F\u0915 \u0908-\u0915\u0947\u0935\u093E\u0908\u0938\u0940 \u0905\u0928\u093F\u0935\u093E\u0930\u094D\u092F",
    description_en: "Farmers who have not completed biometric or OTP e-KYC must visit Balaji Communication to avoid installment blockage.",
    description_hi: "\u091C\u093F\u0928 \u0915\u093F\u0938\u093E\u0928 \u092D\u093E\u0907\u092F\u094B\u0902 \u0915\u0940 \u0908-\u0915\u0947\u0935\u093E\u0908\u0938\u0940 \u092A\u0942\u0930\u0940 \u0928\u0939\u0940\u0902 \u0939\u0948, \u0935\u0947 \u0905\u092A\u0928\u0940 \u0906\u0917\u093E\u092E\u0940 \u0915\u093F\u0938\u094D\u0924 \u092A\u093E\u0928\u0947 \u0915\u0947 \u0932\u093F\u090F \u0924\u0941\u0930\u0902\u0924 \u0915\u0947\u0902\u0926\u094D\u0930 \u092A\u0930 \u0906\u0915\u0930 \u092B\u093F\u0902\u0917\u0930\u092A\u094D\u0930\u093F\u0902\u091F \u0938\u0947 \u0908-\u0915\u0947\u0935\u093E\u0908\u0938\u0940 \u0915\u0930\u093E\u090F\u0902\u0964",
    category: "PM Kisan",
    badge_type: "Urgent",
    last_date: "31-03-2026",
    action_link: "/services",
    status: "Active",
    created_at: (/* @__PURE__ */ new Date()).toISOString()
  },
  {
    notice_id: "NTC-002",
    title_en: "UP Scholarship 2026 Pre & Post Matric Applications Open",
    title_hi: "\u092F\u0942\u092A\u0940 \u091B\u093E\u0924\u094D\u0930\u0935\u0943\u0924\u094D\u0924\u093F 2026 \u0926\u0936\u092E\u094B\u0924\u094D\u0924\u0930 \u090F\u0935\u0902 \u092A\u0942\u0930\u094D\u0935\u0926\u0936\u092E \u0906\u0935\u0947\u0926\u0928 \u092A\u094D\u0930\u093E\u0930\u0902\u092D",
    description_en: "Apply online with Marksheet, Income Certificate, Caste Certificate, and Bank Passbook linked with NPCI.",
    description_hi: "\u0915\u0915\u094D\u0937\u093E 9, 10, 11, 12 \u090F\u0935\u0902 \u092C\u0940\u090F, \u092C\u0940\u090F\u0938\u0938\u0940, \u0906\u0908\u091F\u0940\u0906\u0908 \u091B\u093E\u0924\u094D\u0930\u0935\u0943\u0924\u094D\u0924\u093F \u0915\u0947 \u0928\u090F \u090F\u0935\u0902 \u0928\u0935\u0940\u0928\u0940\u0915\u0930\u0923 \u092B\u0949\u0930\u094D\u092E \u092D\u0930\u0928\u0947 \u0939\u0947\u0924\u0941 \u0938\u0902\u092A\u0930\u094D\u0915 \u0915\u0930\u0947\u0902\u0964",
    category: "Education & Scholarship",
    badge_type: "New",
    last_date: "15-05-2026",
    action_link: "/contact",
    status: "Active",
    created_at: (/* @__PURE__ */ new Date()).toISOString()
  },
  {
    notice_id: "NTC-003",
    title_en: "Free Aadhaar Document Update Extended by UIDAI",
    title_hi: "\u092E\u0941\u092B\u094D\u0924 \u0906\u0927\u093E\u0930 \u0915\u093E\u0930\u094D\u0921 \u0926\u0938\u094D\u0924\u093E\u0935\u0947\u091C \u0905\u092A\u0921\u0947\u091F \u0938\u0941\u0935\u093F\u0927\u093E \u0915\u093E \u0932\u093E\u092D \u0909\u0920\u093E\u090F\u0902",
    description_en: "UIDAI has extended online proof of identity and address update for cards older than 10 years.",
    description_hi: "\u091C\u093F\u0928\u0915\u093E \u0906\u0927\u093E\u0930 \u0915\u093E\u0930\u094D\u0921 10 \u0935\u0930\u094D\u0937 \u0938\u0947 \u0905\u0927\u093F\u0915 \u092A\u0941\u0930\u093E\u0928\u093E \u0939\u0948, \u0935\u0947 \u0905\u092A\u0928\u0940 \u092A\u0939\u091A\u093E\u0928 \u090F\u0935\u0902 \u092A\u0924\u0947 \u0915\u093E \u092A\u094D\u0930\u092E\u093E\u0923 \u0924\u0941\u0930\u0902\u0924 \u0905\u092A\u0921\u0947\u091F \u0915\u0930\u0935\u093E\u090F\u0902\u0964",
    category: "Aadhaar Alert",
    badge_type: "Important",
    last_date: "30-06-2026",
    action_link: "/services",
    status: "Active",
    created_at: (/* @__PURE__ */ new Date()).toISOString()
  }
];
var INITIAL_QUICKLINKS = [
  {
    link_id: "LNK-001",
    portal_name: "e-District Uttar Pradesh (\u0908-\u0921\u093F\u0938\u094D\u091F\u094D\u0930\u093F\u0915\u094D\u091F)",
    department: "Revenue & IT Department UP",
    category: "Certificates",
    portal_url: "https://edistrict.up.gov.in",
    description: "Official UP portal for Income, Caste, Domicile, Birth, Death certificates and revenue services.",
    portal_login_type: "CSC Operator / Citizen Login",
    required_credentials: "Kendra Operator ID / OTP"
  },
  {
    link_id: "LNK-002",
    portal_name: "UIDAI Official MyAadhaar Portal",
    department: "Ministry of Electronics and IT",
    category: "Aadhaar Services",
    portal_url: "https://myaadhaar.uidai.gov.in",
    description: "Download e-Aadhaar, PVC card order, check update status, and verify mobile/email.",
    portal_login_type: "Citizen Aadhaar OTP / Biometric",
    required_credentials: "Aadhaar Number + Registered Mobile"
  },
  {
    link_id: "LNK-003",
    portal_name: "UP Bhulekh Land Records (\u092D\u0942\u0932\u0947\u0916 \u0916\u0924\u094C\u0928\u0940)",
    department: "Board of Revenue Uttar Pradesh",
    category: "Land Records",
    portal_url: "https://upbhulekh.gov.in",
    description: "View and print authenticated RoR Khatauni, Gata number details, and land parcel ownership.",
    portal_login_type: "Open Public Search / Certified Copy",
    required_credentials: "District, Tehsil, Village Code, Gata/Khasra No"
  },
  {
    link_id: "LNK-004",
    portal_name: "National Voter Service Portal (ECI Voters)",
    department: "Election Commission of India",
    category: "Voter ID",
    portal_url: "https://voters.eci.gov.in",
    description: "New Form 6 voter enrollment, Form 8 address/photo correction, and EPIC digital download.",
    portal_login_type: "Mobile Login / ECI User",
    required_credentials: "EPIC Voter Number / Mobile OTP"
  },
  {
    link_id: "LNK-005",
    portal_name: "PM Kisan Samman Nidhi Portal",
    department: "Ministry of Agriculture & Farmers Welfare",
    category: "Agriculture",
    portal_url: "https://pmkisan.gov.in",
    description: "Beneficiary status check, biometric e-KYC, land correction, and farmer grievance redressal.",
    portal_login_type: "CSC Login / Farmer Self Service",
    required_credentials: "Aadhaar / Farmer Registration Number"
  }
];

// src/data/sheetTemplates.ts
var SHEET_TEMPLATES = [
  {
    id: "services",
    title: "Services Catalog Template",
    hindiTitle: "\u0938\u0947\u0935\u093E \u0938\u0942\u091A\u0940 \u091F\u0947\u092E\u094D\u092A\u0932\u0947\u091F",
    description: "Import all Jan Seva Kendra & CSC services, categories, English/Hindi names, required documents, icons, and WhatsApp messages.",
    fileName: "balaji_services_template.csv",
    sheetTabName: "Services",
    badge: "Core Services",
    headers: [
      "service_id",
      "service_name_en",
      "service_name_hi",
      "category",
      "short_description_en",
      "short_description_hi",
      "full_description_en",
      "full_description_hi",
      "required_documents",
      "icon",
      "status",
      "popular",
      "estimated_time",
      "whatsapp_message"
    ],
    sampleRows: [
      [
        "srv-aadhaar-mob",
        "Aadhaar Mobile Number Update",
        "\u0906\u0927\u093E\u0930 \u092E\u094B\u092C\u093E\u0907\u0932 \u0928\u0902\u092C\u0930 \u0905\u092A\u0921\u0947\u091F / \u091C\u094B\u0921\u093C\u0928\u093E",
        "Aadhaar",
        "Quick assistance for linking or updating active mobile number in Aadhaar.",
        "\u0905\u092A\u0928\u0947 \u0906\u0927\u093E\u0930 \u0915\u093E\u0930\u094D\u0921 \u092E\u0947\u0902 \u091A\u093E\u0932\u0942 \u092E\u094B\u092C\u093E\u0907\u0932 \u0928\u0902\u092C\u0930 \u0932\u093F\u0902\u0915 \u092F\u093E \u0905\u092A\u0921\u0947\u091F \u0915\u0930\u0935\u093E\u0928\u0947 \u0915\u0947 \u0932\u093F\u090F \u0938\u0939\u093E\u092F\u0924\u093E\u0964",
        "Updating mobile number in Aadhaar is essential for OTPs, banking, and government schemes.",
        "\u0906\u0927\u093E\u0930 \u092E\u0947\u0902 \u092E\u094B\u092C\u093E\u0907\u0932 \u0928\u0902\u092C\u0930 \u0932\u093F\u0902\u0915 \u0939\u094B\u0928\u093E \u092C\u0948\u0902\u0915 \u0914\u0930 \u0938\u0930\u0915\u093E\u0930\u0940 \u092F\u094B\u091C\u0928\u093E\u0913\u0902 \u0915\u0947 \u0932\u093F\u090F \u0906\u0935\u0936\u094D\u092F\u0915 \u0939\u0948\u0964",
        "Original Aadhaar Card; Active Mobile Number",
        "Smartphone",
        "Active",
        "yes",
        "24-48 Hours",
        "Hello Balaji Communication, I need help with Aadhaar Mobile Number Update."
      ],
      [
        "srv-pan-new",
        "New PAN Card (Instant e-PAN & Physical)",
        "\u0928\u092F\u093E \u092A\u0948\u0928 \u0915\u093E\u0930\u094D\u0921 (\u0924\u094D\u0935\u0930\u093F\u0924 \u0908-\u092A\u0948\u0928 \u0914\u0930 \u092B\u093F\u091C\u093F\u0915\u0932 \u0915\u093E\u0930\u094D\u0921)",
        "PAN Card",
        "Apply for fresh NSDL / UTI PAN card using Aadhaar e-KYC.",
        "\u0906\u0927\u093E\u0930 \u0908-\u0915\u0947\u0935\u093E\u0908\u0938\u0940 \u0926\u094D\u0935\u093E\u0930\u093E \u0928\u092F\u093E \u092A\u0948\u0928 \u0915\u093E\u0930\u094D\u0921 \u092E\u093E\u0924\u094D\u0930 \u0915\u0941\u091B \u0926\u093F\u0928\u094B\u0902 \u092E\u0947\u0902 \u092A\u094D\u0930\u093E\u092A\u094D\u0924 \u0915\u0930\u0947\u0902\u0964",
        "Complete online application for individual, minor, or business PAN card with paperless verification.",
        "\u0928\u093E\u0917\u0930\u093F\u0915\u094B\u0902 \u0914\u0930 \u0935\u094D\u092F\u093E\u092A\u093E\u0930\u093F\u092F\u094B\u0902 \u0915\u0947 \u0932\u093F\u090F \u0938\u0902\u092A\u0942\u0930\u094D\u0923 \u0911\u0928\u0932\u093E\u0907\u0928 \u092A\u0948\u0928 \u0915\u093E\u0930\u094D\u0921 \u0906\u0935\u0947\u0926\u0928 \u0938\u0941\u0935\u093F\u0927\u093E\u0964",
        "Aadhaar Card; 2 Passport Photos; Signature",
        "CreditCard",
        "Active",
        "yes",
        "3-5 Working Days",
        "Hello Balaji Communication, I want to apply for a New PAN Card."
      ],
      [
        "srv-income-cert",
        "Income Certificate (\u0906\u092F \u092A\u094D\u0930\u092E\u093E\u0923 \u092A\u0924\u094D\u0930)",
        "\u0906\u092F \u092A\u094D\u0930\u092E\u093E\u0923 \u092A\u0924\u094D\u0930 (Income Certificate UP)",
        "Government Certificates",
        "Online application on UP eDistrict portal for official revenue income certificate.",
        "\u0909\u0924\u094D\u0924\u0930 \u092A\u094D\u0930\u0926\u0947\u0936 \u0908-\u0921\u093F\u0938\u094D\u091F\u094D\u0930\u093F\u0915\u094D\u091F \u092A\u094B\u0930\u094D\u091F\u0932 \u0915\u0947 \u092E\u093E\u0927\u094D\u092F\u092E \u0938\u0947 \u0906\u0927\u093F\u0915\u093E\u0930\u093F\u0915 \u0906\u092F \u092A\u094D\u0930\u092E\u093E\u0923 \u092A\u0924\u094D\u0930\u0964",
        "Required for student scholarships, government welfare schemes, and pension applications.",
        "\u091B\u093E\u0924\u094D\u0930\u0935\u0943\u0924\u094D\u0924\u093F, \u0938\u0930\u0915\u093E\u0930\u0940 \u092F\u094B\u091C\u0928\u093E\u0913\u0902 \u0914\u0930 \u0930\u093E\u0936\u0928 \u0915\u093E\u0930\u094D\u0921 \u0915\u0947 \u0932\u093F\u090F \u0905\u0928\u093F\u0935\u093E\u0930\u094D\u092F \u0930\u093E\u091C\u0938\u094D\u0935 \u0906\u092F \u092A\u094D\u0930\u092E\u093E\u0923 \u092A\u0924\u094D\u0930\u0964",
        "Aadhaar Card; Ration Card / Family Register; Self Declaration; Photo",
        "FileText",
        "Active",
        "yes",
        "7-10 Working Days",
        "Hello Balaji Communication, I want to apply for Income Certificate."
      ],
      [
        "srv-pm-kisan",
        "PM Kisan e-KYC & New Farmer Registration",
        "\u092A\u0940\u090F\u092E \u0915\u093F\u0938\u093E\u0928 \u0938\u092E\u094D\u092E\u093E\u0928 \u0928\u093F\u0927\u093F \u0908-\u0915\u0947\u0935\u093E\u0908\u0938\u0940 \u090F\u0935\u0902 \u0928\u092F\u093E \u092A\u0902\u091C\u0940\u0915\u0930\u0923",
        "Farmer & Agriculture",
        "Biometric thumb e-KYC, land seeding, and new farmer enrollment for Rs 6000 annual aid.",
        "\u0938\u093E\u0932\u093E\u0928\u093E \u20B96000 \u0938\u0939\u093E\u092F\u0924\u093E \u0939\u0947\u0924\u0941 \u0906\u0927\u093E\u0930 \u092C\u093E\u092F\u094B\u092E\u0947\u091F\u094D\u0930\u093F\u0915 \u0908-\u0915\u0947\u0935\u093E\u0908\u0938\u0940 \u090F\u0935\u0902 \u0916\u0924\u094C\u0928\u0940 \u0938\u0924\u094D\u092F\u093E\u092A\u0928\u0964",
        "Assistance with PM Kisan Samman Nidhi Yojana installment verification, bank NPCI seeding, and correction.",
        "\u092A\u0940\u090F\u092E \u0915\u093F\u0938\u093E\u0928 \u0915\u0940 \u0915\u093F\u0938\u094D\u0924 \u0930\u0941\u0915\u0928\u0947, \u092C\u0948\u0902\u0915 \u0916\u093E\u0924\u093E \u0932\u093F\u0902\u0915 \u0914\u0930 \u0928\u0908 \u0916\u0924\u094C\u0928\u0940 \u091C\u094B\u0921\u093C\u0928\u0947 \u0915\u0940 \u092A\u0942\u0930\u0940 \u0938\u0939\u093E\u092F\u0924\u093E\u0964",
        "Aadhaar Card; Bank Passbook; Khatauni (Land Record); Mobile for OTP",
        "Heart",
        "Active",
        "yes",
        "Instant Biometric / 7 Days Approval",
        "Hello Balaji Communication, I need help with PM Kisan e-KYC and installment."
      ]
    ],
    columnsExplanation: [
      { key: "service_id", required: true, description: "Unique identifier code for the service", sample: "srv-aadhaar-mob" },
      { key: "service_name_en", required: true, description: "Service title displayed in English", sample: "Aadhaar Mobile Number Update" },
      { key: "service_name_hi", required: true, description: "Service title in Hindi (Devanagari)", sample: "\u0906\u0927\u093E\u0930 \u092E\u094B\u092C\u093E\u0907\u0932 \u0928\u0902\u092C\u0930 \u0905\u092A\u0921\u0947\u091F" },
      { key: "category", required: true, description: "Grouping category (Aadhaar, PAN Card, Ration Card, etc.)", sample: "Aadhaar" },
      { key: "short_description_en", required: false, description: "Quick 1-sentence summary in English", sample: "Quick assistance for linking mobile..." },
      { key: "short_description_hi", required: false, description: "Quick 1-sentence summary in Hindi", sample: "\u0905\u092A\u0928\u0947 \u0906\u0927\u093E\u0930 \u0915\u093E\u0930\u094D\u0921 \u092E\u0947\u0902 \u091A\u093E\u0932\u0942 \u092E\u094B\u092C\u093E\u0907\u0932..." },
      { key: "full_description_en", required: false, description: "Detailed process explanation in English", sample: "Detailed guidelines and benefits..." },
      { key: "full_description_hi", required: false, description: "Detailed process explanation in Hindi", sample: "\u0938\u0902\u092A\u0942\u0930\u094D\u0923 \u091C\u093E\u0928\u0915\u093E\u0930\u0940 \u090F\u0935\u0902 \u0932\u093E\u092D..." },
      { key: "required_documents", required: false, description: "Semicolon or newline separated checklist of required documents", sample: "Aadhaar Card; Active Mobile Number" },
      { key: "icon", required: false, description: "Lucide icon: CreditCard, FileText, Smartphone, Heart, Users, CheckCircle", sample: "Smartphone" },
      { key: "status", required: true, description: "Active or Disabled", sample: "Active" },
      { key: "popular", required: false, description: "yes / no - displays badge on homepage", sample: "yes" },
      { key: "estimated_time", required: false, description: "Expected completion turnaround time", sample: "24-48 Hours" },
      { key: "whatsapp_message", required: false, description: "Pre-filled message when citizen clicks WhatsApp assistance", sample: "Hello Balaji, I need help..." }
    ]
  },
  {
    id: "enquiries",
    title: "Citizen Applications & Enquiries Template",
    hindiTitle: "\u0928\u093E\u0917\u0930\u093F\u0915 \u0906\u0935\u0947\u0926\u0928 \u090F\u0935\u0902 \u092A\u0942\u091B\u0924\u093E\u091B \u0930\u091C\u093F\u0938\u094D\u091F\u0930 \u091F\u0947\u092E\u094D\u092A\u0932\u0947\u091F",
    description: "Import offline registers, walk-in applicants, phone enquiries, applicant names, villages, and mobile numbers for digital tracking.",
    fileName: "balaji_enquiries_template.csv",
    sheetTabName: "Enquiries",
    badge: "Citizen CRM",
    headers: [
      "enquiry_id",
      "customer_name",
      "father_or_husband_name",
      "mobile",
      "service_name",
      "category",
      "village",
      "address",
      "message",
      "preferred_contact",
      "urgency",
      "status",
      "created_at"
    ],
    sampleRows: [
      [
        "ENQ-2026-001",
        "Ramesh Chandra Gangwar",
        "Shri Ram Prasad Gangwar",
        "9876543210",
        "Income Certificate (\u0906\u092F \u092A\u094D\u0930\u092E\u093E\u0923 \u092A\u0924\u094D\u0930)",
        "Government Certificates",
        "Gaini",
        "Vill Gaini, Near Primary School, Bareilly",
        "Urgent requirement for son college scholarship form deadline.",
        "WhatsApp",
        "Urgent",
        "New",
        "2026-03-25T10:30:00.000Z"
      ],
      [
        "ENQ-2026-002",
        "Sunita Devi",
        "W/o Manoj Kumar",
        "9812345678",
        "Ration Card Member Name Add",
        "Ration Card",
        "Fatehganj West",
        "Mohalla Kila, Bareilly",
        "Need to add newborn baby name in ration card with birth certificate.",
        "Call",
        "Normal",
        "Processing",
        "2026-03-24T14:15:00.000Z"
      ],
      [
        "ENQ-2026-003",
        "Mohammad Imran",
        "Abdul Rasheed",
        "9754321098",
        "Ayushman Golden Card (\u20B95 Lakh Free Treatment)",
        "Health & Ayushman",
        "Gaini",
        "Masjid Wali Gali, Gaini, Bareilly",
        "Name found in SECC list, wants card download and plastic card print.",
        "WhatsApp",
        "High Priority",
        "Completed",
        "2026-03-23T09:00:00.000Z"
      ]
    ],
    columnsExplanation: [
      { key: "enquiry_id", required: false, description: "Application token code (Auto-generated if blank)", sample: "ENQ-2026-001" },
      { key: "customer_name", required: true, description: "Full name of applicant / citizen", sample: "Ramesh Chandra Gangwar" },
      { key: "father_or_husband_name", required: false, description: "Father or husband name for official identification", sample: "Shri Ram Prasad Gangwar" },
      { key: "mobile", required: true, description: "10-digit mobile phone number", sample: "9876543210" },
      { key: "service_name", required: true, description: "Target Jan Seva Kendra service applied for", sample: "Income Certificate (\u0906\u092F \u092A\u094D\u0930\u092E\u093E\u0923 \u092A\u0924\u094D\u0930)" },
      { key: "category", required: false, description: "Service department category", sample: "Government Certificates" },
      { key: "village", required: false, description: "Village / Town name (Gaini, Bareilly, etc.)", sample: "Gaini" },
      { key: "address", required: false, description: "Full residential address or locality", sample: "Near Primary School, Gaini" },
      { key: "message", required: false, description: "Citizen notes or specific instructions", sample: "Urgent for college scholarship" },
      { key: "preferred_contact", required: false, description: "Call or WhatsApp", sample: "WhatsApp" },
      { key: "urgency", required: false, description: "Normal, High Priority, Urgent", sample: "Urgent" },
      { key: "status", required: true, description: "New, Contacted, Processing, Completed, Cancelled", sample: "New" },
      { key: "created_at", required: false, description: "Date and time of application receipt", sample: "2026-03-25T10:30:00.000Z" }
    ]
  },
  {
    id: "pricelist",
    title: "CSC Government Fees & Service Rate List Template",
    hindiTitle: "\u0938\u0930\u0915\u093E\u0930\u0940 \u0936\u0941\u0932\u094D\u0915 \u090F\u0935\u0902 \u091C\u0928 \u0938\u0947\u0935\u093E \u0915\u0947\u0902\u0926\u094D\u0930 \u0926\u0930 \u0938\u0942\u091A\u0940 \u091F\u0947\u092E\u094D\u092A\u0932\u0947\u091F",
    description: "Display transparent official government fee, CSC convenience fee, total cost, and delivery turnaround for all citizen services.",
    fileName: "balaji_pricelist_template.csv",
    sheetTabName: "PriceList",
    badge: "Pricing & Fees",
    headers: [
      "price_id",
      "service_name",
      "category",
      "government_fee",
      "csc_service_fee",
      "total_fee",
      "processing_time",
      "eligibility_or_note",
      "status"
    ],
    sampleRows: [
      [
        "PRC-001",
        "Aadhaar Mobile Number Update",
        "Aadhaar Services",
        "\u20B950",
        "\u20B930",
        "\u20B980",
        "24 to 48 Hours",
        "UIDAI official biometric update fee + Kendra verification assistance",
        "Active"
      ],
      [
        "PRC-002",
        "Income / Caste / Domicile Certificate",
        "Revenue & eDistrict UP",
        "\u20B915",
        "\u20B935",
        "\u20B950",
        "7 to 10 Days",
        "Official UP Govt treasury challan + online application & scanning",
        "Active"
      ],
      [
        "PRC-003",
        "New PAN Card (Physical Delivery to Home)",
        "NSDL / UTI Services",
        "\u20B9107",
        "\u20B993",
        "\u20B9200",
        "10 to 15 Days",
        "NSDL official fee + biometric e-KYC and Speed Post plastic card",
        "Active"
      ],
      [
        "PRC-004",
        "Ayushman Bharat Golden Card Print",
        "Health Mission",
        "\u20B90 (Govt Free)",
        "\u20B930",
        "\u20B930",
        "Instant 5 Mins",
        "Government subsidy is free; High-grade waterproof PVC print charge",
        "Active"
      ],
      [
        "PRC-005",
        "PM Kisan Samman Nidhi e-KYC",
        "Agriculture Services",
        "\u20B90 (Govt Free)",
        "\u20B920",
        "\u20B920",
        "Instant Thumb Scan",
        "Biometric thumb authentication machine and portal server charge",
        "Active"
      ]
    ],
    columnsExplanation: [
      { key: "price_id", required: true, description: "Unique fee code identifier", sample: "PRC-001" },
      { key: "service_name", required: true, description: "Exact service name matching catalog", sample: "Income / Caste / Domicile Certificate" },
      { key: "category", required: true, description: "Service department category", sample: "Revenue & eDistrict UP" },
      { key: "government_fee", required: true, description: "Official departmental fee prescribed by government", sample: "\u20B915" },
      { key: "csc_service_fee", required: true, description: "Jan Seva Kendra computer/portal processing fee", sample: "\u20B935" },
      { key: "total_fee", required: true, description: "Total price payable by the citizen", sample: "\u20B950" },
      { key: "processing_time", required: true, description: "Expected working days to receive final document", sample: "7 to 10 Days" },
      { key: "eligibility_or_note", required: false, description: "Clear remarks, inclusions, or required proof note", sample: "UP Govt treasury challan + scanning" },
      { key: "status", required: true, description: "Active or Inactive", sample: "Active" }
    ]
  },
  {
    id: "notices",
    title: "Notice Board & Flash Announcements Template",
    hindiTitle: "\u0938\u0942\u091A\u0928\u093E \u092A\u091F\u094D\u091F \u090F\u0935\u0902 \u092E\u0939\u0924\u094D\u0935\u092A\u0942\u0930\u094D\u0923 \u0938\u0930\u0915\u093E\u0930\u0940 \u092F\u094B\u091C\u0928\u093E \u0905\u092A\u0921\u0947\u091F \u091F\u0947\u092E\u094D\u092A\u0932\u0947\u091F",
    description: "Post urgent notifications, scholarship deadlines, last dates for e-KYC, and new government scheme rollouts.",
    fileName: "balaji_notices_template.csv",
    sheetTabName: "NoticeBoard",
    badge: "Announcements",
    headers: [
      "notice_id",
      "title_en",
      "title_hi",
      "description_en",
      "description_hi",
      "category",
      "badge_type",
      "last_date",
      "action_link",
      "status",
      "created_at"
    ],
    sampleRows: [
      [
        "NTC-001",
        "PM Kisan 19th Installment e-KYC Mandatory",
        "\u092A\u0940\u090F\u092E \u0915\u093F\u0938\u093E\u0928 19\u0935\u0940\u0902 \u0915\u093F\u0938\u094D\u0924 \u0939\u0947\u0924\u0941 \u092C\u093E\u092F\u094B\u092E\u0947\u091F\u094D\u0930\u093F\u0915 \u0908-\u0915\u0947\u0935\u093E\u0908\u0938\u0940 \u0905\u0928\u093F\u0935\u093E\u0930\u094D\u092F",
        "Farmers who have not completed biometric or OTP e-KYC must visit Balaji Communication to avoid installment blockage.",
        "\u091C\u093F\u0928 \u0915\u093F\u0938\u093E\u0928 \u092D\u093E\u0907\u092F\u094B\u0902 \u0915\u0940 \u0908-\u0915\u0947\u0935\u093E\u0908\u0938\u0940 \u092A\u0942\u0930\u0940 \u0928\u0939\u0940\u0902 \u0939\u0948, \u0935\u0947 \u0905\u092A\u0928\u0940 \u0906\u0917\u093E\u092E\u0940 \u0915\u093F\u0938\u094D\u0924 \u092A\u093E\u0928\u0947 \u0915\u0947 \u0932\u093F\u090F \u0924\u0941\u0930\u0902\u0924 \u0915\u0947\u0902\u0926\u094D\u0930 \u092A\u0930 \u0906\u0915\u0930 \u092B\u093F\u0902\u0917\u0930\u092A\u094D\u0930\u093F\u0902\u091F \u0938\u0947 \u0908-\u0915\u0947\u0935\u093E\u0908\u0938\u0940 \u0915\u0930\u093E\u090F\u0902\u0964",
        "PM Kisan",
        "Urgent",
        "31-03-2026",
        "/services/srv-pm-kisan",
        "Active",
        "2026-03-20T08:00:00.000Z"
      ],
      [
        "NTC-002",
        "UP Scholarship 2026 Pre & Post Matric Applications Open",
        "\u092F\u0942\u092A\u0940 \u091B\u093E\u0924\u094D\u0930\u0935\u0943\u0924\u094D\u0924\u093F 2026 \u0926\u0936\u092E\u094B\u0924\u094D\u0924\u0930 \u090F\u0935\u0902 \u092A\u0942\u0930\u094D\u0935\u0926\u0936\u092E \u0906\u0935\u0947\u0926\u0928 \u092A\u094D\u0930\u093E\u0930\u0902\u092D",
        "Apply online with Marksheet, Income Certificate, Caste Certificate, and Bank Passbook linked with NPCI.",
        "\u0915\u0915\u094D\u0937\u093E 9, 10, 11, 12 \u090F\u0935\u0902 \u092C\u0940\u090F, \u092C\u0940\u090F\u0938\u0938\u0940, \u0906\u0908\u091F\u0940\u0906\u0908 \u091B\u093E\u0924\u094D\u0930\u0935\u0943\u0924\u094D\u0924\u093F \u0915\u0947 \u0928\u090F \u090F\u0935\u0902 \u0928\u0935\u0940\u0928\u0940\u0915\u0930\u0923 \u092B\u0949\u0930\u094D\u092E \u092D\u0930\u0928\u0947 \u0939\u0947\u0924\u0941 \u0938\u0902\u092A\u0930\u094D\u0915 \u0915\u0930\u0947\u0902\u0964",
        "Education & Scholarship",
        "New",
        "15-05-2026",
        "/contact",
        "Active",
        "2026-03-18T10:00:00.000Z"
      ],
      [
        "NTC-003",
        "Free Aadhaar Document Update Extended by UIDAI",
        "\u092E\u0941\u092B\u094D\u0924 \u0906\u0927\u093E\u0930 \u0915\u093E\u0930\u094D\u0921 \u0926\u0938\u094D\u0924\u093E\u0935\u0947\u091C \u0905\u092A\u0921\u0947\u091F \u0938\u0941\u0935\u093F\u0927\u093E \u0915\u093E \u0932\u093E\u092D \u0909\u0920\u093E\u090F\u0902",
        "UIDAI has extended online proof of identity and address update for cards older than 10 years.",
        "\u091C\u093F\u0928\u0915\u093E \u0906\u0927\u093E\u0930 \u0915\u093E\u0930\u094D\u0921 10 \u0935\u0930\u094D\u0937 \u0938\u0947 \u0905\u0927\u093F\u0915 \u092A\u0941\u0930\u093E\u0928\u093E \u0939\u0948, \u0935\u0947 \u0905\u092A\u0928\u0940 \u092A\u0939\u091A\u093E\u0928 \u090F\u0935\u0902 \u092A\u0924\u0947 \u0915\u093E \u092A\u094D\u0930\u092E\u093E\u0923 \u0924\u0941\u0930\u0902\u0924 \u0905\u092A\u0921\u0947\u091F \u0915\u0930\u0935\u093E\u090F\u0902\u0964",
        "Aadhaar Alert",
        "Important",
        "30-06-2026",
        "/services/srv-aadhaar-corr",
        "Active",
        "2026-03-15T09:30:00.000Z"
      ]
    ],
    columnsExplanation: [
      { key: "notice_id", required: true, description: "Unique notice reference code", sample: "NTC-001" },
      { key: "title_en", required: true, description: "Headline in English", sample: "PM Kisan 19th Installment e-KYC Mandatory" },
      { key: "title_hi", required: true, description: "Headline in Hindi (Devanagari)", sample: "\u092A\u0940\u090F\u092E \u0915\u093F\u0938\u093E\u0928 19\u0935\u0940\u0902 \u0915\u093F\u0938\u094D\u0924 \u0939\u0947\u0924\u0941 \u0908-\u0915\u0947\u0935\u093E\u0908\u0938\u0940..." },
      { key: "description_en", required: false, description: "Detailed notice text in English", sample: "Farmers must complete e-KYC..." },
      { key: "description_hi", required: false, description: "Detailed notice text in Hindi", sample: "\u0915\u093F\u0938\u093E\u0928 \u092D\u093E\u0908 \u0924\u0941\u0930\u0902\u0924 \u0906\u0915\u0930 \u0908-\u0915\u0947\u0935\u093E\u0908\u0938\u0940 \u0915\u0930\u093E\u090F\u0902..." },
      { key: "category", required: true, description: "Topic category for grouping", sample: "PM Kisan" },
      { key: "badge_type", required: true, description: "Urgent, New, Important, General", sample: "Urgent" },
      { key: "last_date", required: false, description: "Scheme expiry or final submission date", sample: "31-03-2026" },
      { key: "action_link", required: false, description: "Page path or external official URL", sample: "/services/srv-pm-kisan" },
      { key: "status", required: true, description: "Active or Archived", sample: "Active" },
      { key: "created_at", required: false, description: "Date published", sample: "2026-03-20T08:00:00.000Z" }
    ]
  },
  {
    id: "quicklinks",
    title: "Government Portals & Quick Operator Links Template",
    hindiTitle: "\u0938\u0930\u0915\u093E\u0930\u0940 \u092A\u094B\u0930\u094D\u091F\u0932 \u090F\u0935\u0902 \u0924\u094D\u0935\u0930\u093F\u0924 \u0932\u093F\u0902\u0915 \u0921\u093E\u092F\u0930\u0947\u0915\u094D\u091F\u0930\u0940 \u091F\u0947\u092E\u094D\u092A\u0932\u0947\u091F",
    description: "Directory of direct official UP and India government department URLs, operator portals, and login guidelines for CSC operations.",
    fileName: "balaji_quicklinks_template.csv",
    sheetTabName: "QuickLinks",
    badge: "Official Portals",
    headers: [
      "link_id",
      "portal_name",
      "department",
      "category",
      "portal_url",
      "description",
      "portal_login_type",
      "required_credentials"
    ],
    sampleRows: [
      [
        "LNK-001",
        "e-District Uttar Pradesh (\u0908-\u0921\u093F\u0938\u094D\u091F\u094D\u0930\u093F\u0915\u094D\u091F)",
        "Revenue & IT Department UP",
        "Certificates",
        "https://edistrict.up.gov.in",
        "Official UP portal for Income, Caste, Domicile, Birth, Death certificates and revenue services.",
        "CSC Operator / Citizen Login",
        "Kendra Operator ID / OTP"
      ],
      [
        "LNK-002",
        "UIDAI Official MyAadhaar Portal",
        "Ministry of Electronics and IT",
        "Aadhaar Services",
        "https://myaadhaar.uidai.gov.in",
        "Download e-Aadhaar, PVC card order, check update status, and verify mobile/email.",
        "Citizen Aadhaar OTP / Biometric",
        "Aadhaar Number + Registered Mobile"
      ],
      [
        "LNK-003",
        "UP Bhulekh Land Records (\u092D\u0942\u0932\u0947\u0916 \u0916\u0924\u094C\u0928\u0940)",
        "Board of Revenue Uttar Pradesh",
        "Land Records",
        "https://upbhulekh.gov.in",
        "View and print authenticated RoR Khatauni, Gata number details, and land parcel ownership.",
        "Open Public Search / Certified Copy",
        "District, Tehsil, Village Code, Gata/Khasra No"
      ],
      [
        "LNK-004",
        "National Voter Service Portal (ECI Voters)",
        "Election Commission of India",
        "Voter ID",
        "https://voters.eci.gov.in",
        "New Form 6 voter enrollment, Form 8 address/photo correction, and EPIC digital download.",
        "Mobile Login / ECI User",
        "EPIC Voter Number / Mobile OTP"
      ],
      [
        "LNK-005",
        "PM Kisan Samman Nidhi Portal",
        "Ministry of Agriculture & Farmers Welfare",
        "Agriculture",
        "https://pmkisan.gov.in",
        "Beneficiary status check, biometric e-KYC, land correction, and farmer grievance redressal.",
        "CSC Login / Farmer Self Service",
        "Aadhaar / Farmer Registration Number"
      ]
    ],
    columnsExplanation: [
      { key: "link_id", required: true, description: "Unique link identifier code", sample: "LNK-001" },
      { key: "portal_name", required: true, description: "Official name of the government department portal", sample: "e-District Uttar Pradesh" },
      { key: "department", required: true, description: "Ministry or Department name", sample: "Revenue & IT Department UP" },
      { key: "category", required: true, description: "Functional category (Certificates, Land, Voter, etc.)", sample: "Certificates" },
      { key: "portal_url", required: true, description: "Exact HTTPS web address of the official portal", sample: "https://edistrict.up.gov.in" },
      { key: "description", required: false, description: "Short summary of citizen services provided on the portal", sample: "Income, Caste, Domicile certificates" },
      { key: "portal_login_type", required: false, description: "Operator login, citizen OTP, or public access", sample: "CSC Operator / Citizen Login" },
      { key: "required_credentials", required: false, description: "Requirements needed from citizen for operator processing", sample: "Aadhaar Number + Registered Mobile" }
    ]
  },
  {
    id: "citizens",
    title: "Citizen & Customer Master Registry Template",
    hindiTitle: "\u0928\u093E\u0917\u0930\u093F\u0915 \u090F\u0935\u0902 \u0917\u094D\u0930\u093E\u0939\u0915 \u092E\u093E\u0938\u094D\u091F\u0930 \u0930\u091C\u093F\u0938\u094D\u091F\u0930 \u091F\u0947\u092E\u094D\u092A\u0932\u0947\u091F",
    description: "Maintain permanent citizen directory with village name, family head, Aadhaar last-4, phone, and past service history.",
    fileName: "balaji_citizens_template.csv",
    sheetTabName: "Citizens",
    badge: "Customer Directory",
    headers: [
      "citizen_id",
      "full_name",
      "father_name",
      "mobile",
      "aadhaar_last4",
      "village",
      "address",
      "services_availed",
      "notes",
      "status",
      "created_at"
    ],
    sampleRows: [
      [
        "CIT-001",
        "Satish Gangwar",
        "Mahavir Prasad",
        "9870601122",
        "4589",
        "Gaini",
        "Inter College Road, Gaini, Bareilly",
        "Income Certificate, PM Kisan e-KYC",
        "Eligible for PM Awas Yojana list check",
        "Completed",
        "2026-02-10T11:00:00.000Z"
      ],
      [
        "CIT-002",
        "Pooja Sharma",
        "D/o Rajesh Sharma",
        "9897112233",
        "7812",
        "Fatehganj",
        "Station Road, Fatehganj, Bareilly",
        "PAN Card New, Ayushman Card",
        "Physical PAN card received at Kendra",
        "Completed",
        "2026-02-15T15:30:00.000Z"
      ],
      [
        "CIT-003",
        "Dharamvir Singh",
        "Roopchand Singh",
        "9758004455",
        "1034",
        "Gaini",
        "Masjid Wali Gali, Gaini, Bareilly",
        "Aadhaar Address Update",
        "Waiting for UIDAI update approval SMS",
        "Pending Docs",
        "2026-03-01T12:00:00.000Z"
      ]
    ],
    columnsExplanation: [
      { key: "citizen_id", required: true, description: "Permanent customer registration ID", sample: "CIT-001" },
      { key: "full_name", required: true, description: "Citizen full legal name", sample: "Satish Gangwar" },
      { key: "father_name", required: false, description: "Father / Guardian name", sample: "Mahavir Prasad" },
      { key: "mobile", required: true, description: "10-digit primary mobile number", sample: "9870601122" },
      { key: "aadhaar_last4", required: false, description: "Last 4 digits of Aadhaar (Never store full 12 digits)", sample: "4589" },
      { key: "village", required: true, description: "Village / town locality", sample: "Gaini" },
      { key: "address", required: false, description: "Full address landmark", sample: "Inter College Road, Gaini" },
      { key: "services_availed", required: false, description: "Comma separated history of services completed", sample: "Income Certificate, PM Kisan" },
      { key: "notes", required: false, description: "Operator remarks, dues, or follow-up notes", sample: "Awaiting UIDAI approval" },
      { key: "status", required: true, description: "Active, Pending Docs, or Completed", sample: "Active" },
      { key: "created_at", required: false, description: "Date citizen registered at Kendra", sample: "2026-02-10T11:00:00.000Z" }
    ]
  }
];
function escapeCsvValue(val) {
  if (val === null || val === void 0) return '""';
  const str = String(val).replace(/"/g, '""');
  return `"${str}"`;
}
function generateCsvContent(template) {
  const bom = "\uFEFF";
  const headerLine = template.headers.map(escapeCsvValue).join(",");
  const rowLines = template.sampleRows.map(
    (row) => row.map(escapeCsvValue).join(",")
  );
  return bom + [headerLine, ...rowLines].join("\r\n");
}

// server.ts
var app = (0, import_express.default)();
var PORT = 3e3;
app.use(import_express.default.json({ limit: "10mb" }));
var DATA_DIR = import_path.default.join(process.cwd(), "data");
var DB_FILE = import_path.default.join(DATA_DIR, "db.json");
function loadDatabase() {
  try {
    if (!import_fs.default.existsSync(DATA_DIR)) {
      import_fs.default.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (import_fs.default.existsSync(DB_FILE)) {
      const raw = import_fs.default.readFileSync(DB_FILE, "utf-8");
      const parsed = JSON.parse(raw);
      if (!parsed.settings.address_en || parsed.settings.address_en.includes("Sector 12")) {
        parsed.settings = { ...parsed.settings, ...INITIAL_SETTINGS };
      }
      if (!Array.isArray(parsed.enquiries)) {
        parsed.enquiries = [];
      }
      if (!Array.isArray(parsed.priceList)) {
        parsed.priceList = INITIAL_PRICELIST;
      }
      if (!Array.isArray(parsed.notices)) {
        parsed.notices = INITIAL_NOTICES;
      }
      if (!Array.isArray(parsed.quickLinks)) {
        parsed.quickLinks = INITIAL_QUICKLINKS;
      }
      if (!Array.isArray(parsed.citizens)) {
        parsed.citizens = [];
      }
      return parsed;
    }
  } catch (err) {
    console.error("Error reading db.json, falling back to defaults:", err);
  }
  const initialDb = {
    services: INITIAL_SERVICES,
    enquiries: [],
    settings: INITIAL_SETTINGS,
    priceList: INITIAL_PRICELIST,
    notices: INITIAL_NOTICES,
    quickLinks: INITIAL_QUICKLINKS,
    citizens: [],
    adminCredentials: {
      email: "admin@balaji.com",
      passwordHash: "balaji@2026"
    }
  };
  try {
    import_fs.default.writeFileSync(DB_FILE, JSON.stringify(initialDb, null, 2));
  } catch (e) {
    console.error("Could not write initial db.json:", e);
  }
  return initialDb;
}
var lastSyncedSheetUrl = null;
function saveDatabase(database) {
  try {
    if (!import_fs.default.existsSync(DATA_DIR)) {
      import_fs.default.mkdirSync(DATA_DIR, { recursive: true });
    }
    import_fs.default.writeFileSync(DB_FILE, JSON.stringify(database, null, 2));
    const sheetUrl = database.settings.google_sheet_webapp_url || database.settings.google_sheet_url || "";
    if (sheetUrl && sheetUrl !== lastSyncedSheetUrl) {
      lastSyncedSheetUrl = sheetUrl;
      try {
        const pubConfig = import_path.default.join(process.cwd(), "public", "config.json");
        import_fs.default.writeFileSync(pubConfig, JSON.stringify({
          google_sheet_webapp_url: sheetUrl,
          last_updated: (/* @__PURE__ */ new Date()).toISOString()
        }, null, 2));
        const distConfig = import_path.default.join(process.cwd(), "dist", "config.json");
        if (import_fs.default.existsSync(import_path.default.dirname(distConfig))) {
          import_fs.default.writeFileSync(distConfig, JSON.stringify({
            google_sheet_webapp_url: sheetUrl,
            last_updated: (/* @__PURE__ */ new Date()).toISOString()
          }, null, 2));
        }
      } catch (cfgErr) {
      }
    }
  } catch (err) {
    console.error("Error saving db.json:", err);
  }
}
var db = loadDatabase();
var ADMIN_TOKEN = "balaji_secure_admin_session_token_2026";
function checkAdminAuth(req, res, next) {
  const authHeader = req.headers.authorization || "";
  const tokenQuery = req.query.token || "";
  const tokenBody = req.body && req.body.token || "";
  if (authHeader.includes(ADMIN_TOKEN) || tokenQuery === ADMIN_TOKEN || tokenBody === ADMIN_TOKEN) {
    return next();
  }
  return res.status(401).json({ error: "Unauthorized access. Please login as admin." });
}
function parseCsvToObjects(csvText) {
  const lines = csvText.split(/\r?\n/).filter((line) => line.trim().length > 0);
  if (lines.length < 2) return [];
  const parseLine = (line) => {
    const values = [];
    let current = "";
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      if (char === '"') {
        if (inQuotes && line[i + 1] === '"') {
          current += '"';
          i++;
        } else {
          inQuotes = !inQuotes;
        }
      } else if (char === "," && !inQuotes) {
        values.push(current.trim());
        current = "";
      } else {
        current += char;
      }
    }
    values.push(current.trim());
    return values;
  };
  const headers = parseLine(lines[0]).map((h) => h.trim().toLowerCase().replace(/[\s_-]+/g, "_"));
  const rows = [];
  for (let i = 1; i < lines.length; i++) {
    const values = parseLine(lines[i]);
    const obj = {};
    headers.forEach((header, idx) => {
      obj[header] = values[idx] || "";
    });
    rows.push(obj);
  }
  return rows;
}
function mapRowToService(row, idx) {
  const nameEn = row.service_name_en || row.service_name || row.name_en || row.name || row.title || "";
  if (!nameEn) return null;
  const id = row.service_id || row.id || `srv-sheet-${idx + 1}`;
  const nameHi = row.service_name_hi || row.name_hi || nameEn;
  const category = row.category || "General Services";
  const shortEn = row.short_description_en || row.short_desc || row.short_description || row.description || "";
  const shortHi = row.short_description_hi || row.short_desc_hi || shortEn;
  const fullEn = row.full_description_en || row.full_description || row.long_description || shortEn;
  const fullHi = row.full_description_hi || row.full_description || shortHi;
  let docs = [];
  const rawDocs = row.required_documents || row.documents || row.docs || "";
  if (Array.isArray(rawDocs)) {
    docs = rawDocs;
  } else if (typeof rawDocs === "string" && rawDocs.trim()) {
    docs = rawDocs.split(/[\n,;]+/).map((d) => d.trim()).filter(Boolean);
  }
  return {
    service_id: String(id),
    service_name_en: String(nameEn),
    service_name_hi: String(nameHi),
    category: String(category),
    short_description_en: String(shortEn),
    short_description_hi: String(shortHi),
    full_description_en: String(fullEn),
    full_description_hi: String(fullHi),
    required_documents: docs.length > 0 ? docs : ["Original Aadhaar Card", "Registered Mobile Number"],
    icon: row.icon || "FileText",
    status: row.status && row.status.toLowerCase() === "disabled" ? "Disabled" : "Active",
    popular: Boolean(row.popular === true || row.popular === "true" || row.popular === "yes" || row.popular === 1),
    estimated_time: row.estimated_time || "1 to 3 Working Days",
    whatsapp_message: row.whatsapp_message || `Hello Balaji Communication, I want information about ${nameEn}.`,
    created_at: row.created_at || (/* @__PURE__ */ new Date()).toISOString(),
    updated_at: (/* @__PURE__ */ new Date()).toISOString()
  };
}
async function syncFromGoogleSource(inputUrl) {
  const url = inputUrl.trim();
  if (!url) {
    return { success: false, message: "Google Sheets or Web App URL is required." };
  }
  if (url.includes("script.google.com") && (url.includes("/edit") || url.includes("/home/projects/"))) {
    return {
      success: false,
      message: 'You entered an Apps Script Project Editor link (.../edit) instead of the deployed Web App link. In Google Sheets, click Extensions > Apps Script > Deploy > New deployment (or Manage deployments) > Select Web app > Make sure "Who has access" is set to "Anyone" > Copy the Web App URL ending in /exec.'
    };
  }
  if (url.includes("script.google.com") && url.endsWith("/dev")) {
    return {
      success: false,
      message: 'You entered a /dev test deployment link which requires private Google login. Please click Deploy > New deployment > Web app > Set "Who has access: Anyone" > Copy the public /exec URL.'
    };
  }
  if (url.includes("drive.google.com/drive/folders")) {
    return {
      success: false,
      message: "You entered a Google Drive folder link. Please paste your Google Spreadsheet link or Google Apps Script Web App URL."
    };
  }
  const sheetMatch = url.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/i);
  if (sheetMatch) {
    const sheetId = sheetMatch[1];
    const gidMatch = url.match(/[?#&]gid=([0-9]+)/i);
    const gid = gidMatch ? gidMatch[1] : "0";
    const applyMergedServices = (importedServices, sourceType) => {
      db.services = [...importedServices];
      db.settings.google_sheet_webapp_url = url;
      db.settings.google_sheet_url = url;
      db.settings.last_sheet_sync = (/* @__PURE__ */ new Date()).toISOString();
      saveDatabase(db);
      return {
        success: true,
        message: `Successfully connected to Google Sheet! Synced ${importedServices.length} services directly from sheet.`,
        count: importedServices.length,
        sourceType,
        services: db.services
      };
    };
    const gvizUrlsToTry = [
      `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:json&sheet=Services`,
      `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:json&gid=${gid}`,
      `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:json`
    ];
    for (const gvizUrl of gvizUrlsToTry) {
      try {
        const gvizRes = await fetch(gvizUrl, { headers: { "User-Agent": "Mozilla/5.0" } });
        if (!gvizRes.ok) continue;
        const gvizText = await gvizRes.text();
        if (gvizText.trim().startsWith("<") || gvizText.toLowerCase().includes("<html")) {
          continue;
        }
        const jsonStart = gvizText.indexOf("{");
        const jsonEnd = gvizText.lastIndexOf("}");
        if (jsonStart !== -1 && jsonEnd !== -1) {
          const jsonStr = gvizText.substring(jsonStart, jsonEnd + 1);
          const parsed = JSON.parse(jsonStr);
          if (parsed.table && parsed.table.rows && parsed.table.rows.length > 0) {
            const cols = (parsed.table.cols || []).map(
              (c) => (c.label || c.id || "").toLowerCase().replace(/[\s_-]+/g, "_")
            );
            const parsedServices = [];
            parsed.table.rows.forEach((r, rIdx) => {
              const rowObj = {};
              (r.c || []).forEach((cell, cIdx) => {
                const colName = cols[cIdx] || `col_${cIdx}`;
                rowObj[colName] = cell && cell.v !== null && cell.v !== void 0 ? cell.v : "";
              });
              const s = mapRowToService(rowObj, rIdx);
              if (s) parsedServices.push(s);
            });
            if (parsedServices.length > 0) {
              return applyMergedServices(parsedServices, "spreadsheet");
            }
          }
        }
      } catch (gvizErr) {
      }
    }
    const csvUrlsToTry = [
      `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv&gid=${gid}`,
      `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv&gid=0`
    ];
    for (const csvUrl of csvUrlsToTry) {
      try {
        const csvRes = await fetch(csvUrl);
        if (csvRes.ok) {
          const csvText = await csvRes.text();
          if (csvText.trim().startsWith("<") || csvText.toLowerCase().includes("<html")) {
            continue;
          }
          const rows = parseCsvToObjects(csvText);
          const parsedServices = [];
          rows.forEach((r, idx) => {
            const s = mapRowToService(r, idx);
            if (s) parsedServices.push(s);
          });
          if (parsedServices.length > 0) {
            return applyMergedServices(parsedServices, "spreadsheet");
          }
        }
      } catch (csvErr) {
      }
    }
    return {
      success: false,
      message: 'Google Sheet link found, but Google returned private login or could not read data. Solution: Open your Google Sheet, click the green "Share" button at top-right, change "General access" to "Anyone with the link can view", and try again.'
    };
  }
  try {
    const primaryFetchUrl = url.includes("?") ? `${url}&action=getAllData` : `${url}?action=getAllData`;
    let response = await fetch(primaryFetchUrl, {
      redirect: "follow",
      headers: { "Accept": "application/json" }
    });
    let rawText = await response.text();
    if (rawText.trim().startsWith("<") || rawText.toLowerCase().includes("<html") || response.url.includes("accounts.google.com")) {
      if (rawText.includes("ServiceLogin") || rawText.includes("accounts.google.com") || response.url.includes("accounts.google.com") || rawText.includes("Sign in")) {
        return {
          success: false,
          message: 'Google Apps Script requires Google Account Sign-In because "Who has access" is set to "Only myself". Solution: In Apps Script, click "Deploy" > "Manage deployments" > click the pencil (Edit) icon > change "Who has access" to "Anyone" > click "Deploy", then try syncing again.'
        };
      }
      if (rawText.includes("Script error") || rawText.includes("Exception") || rawText.includes("Script function not found")) {
        return {
          success: false,
          message: 'Google Apps Script encountered an execution error. Please open Google Sheets > Extensions > Apps Script, select "setupAllTemplateSheets" from the toolbar function dropdown, and click "Run" to initialize tabs and authorize permissions.'
        };
      }
      return {
        success: false,
        message: 'Google returned an HTML web page instead of JSON data. Please verify your Google Apps Script deployment settings: Execute as: "Me", Who has access: "Anyone", and URL ends with "/exec".'
      };
    }
    let data;
    try {
      data = JSON.parse(rawText);
    } catch (parseErr) {
      const fallbackUrl = url.includes("?") ? `${url}&action=getServices` : `${url}?action=getServices`;
      try {
        const fallbackRes = await fetch(fallbackUrl, {
          redirect: "follow",
          headers: { "Accept": "application/json" }
        });
        const fallbackText = await fallbackRes.text();
        if (fallbackText.trim().startsWith("<")) {
          return {
            success: false,
            message: "Google Apps Script returned an HTML page instead of JSON. Please check Deploy > Manage deployments > Who has access: Anyone."
          };
        }
        data = JSON.parse(fallbackText);
      } catch (e) {
        return {
          success: false,
          message: `Google Apps Script returned invalid data: ${rawText.slice(0, 100)}...`
        };
      }
    }
    let serviceList = [];
    if (Array.isArray(data)) {
      serviceList = data;
    } else if (data && data.status === "success" && data.data) {
      if (Array.isArray(data.data)) {
        serviceList = data.data;
      } else if (typeof data.data === "object") {
        if (data.data.services && Array.isArray(data.data.services)) {
          serviceList = data.data.services;
        }
        if (Array.isArray(data.data.enquiries)) {
          db.enquiries = data.data.enquiries;
        }
        if (Array.isArray(data.data.priceList) && data.data.priceList.length > 0) {
          db.priceList = data.data.priceList;
        }
        if (Array.isArray(data.data.notices) && data.data.notices.length > 0) {
          db.notices = data.data.notices;
        }
        if (Array.isArray(data.data.quickLinks) && data.data.quickLinks.length > 0) {
          db.quickLinks = data.data.quickLinks;
        }
        if (Array.isArray(data.data.citizens)) {
          db.citizens = data.data.citizens;
        }
        if (data.data.settings && typeof data.data.settings === "object") {
          db.settings = { ...db.settings, ...data.data.settings };
        }
      }
    } else if (data && Array.isArray(data.services)) {
      serviceList = data.services;
    }
    if (serviceList.length > 0) {
      db.services = [...serviceList];
      db.settings.google_sheet_webapp_url = url;
      db.settings.google_sheet_url = url;
      db.settings.last_sheet_sync = (/* @__PURE__ */ new Date()).toISOString();
      saveDatabase(db);
      return {
        success: true,
        message: `Successfully connected to Google Sheet! Synced ${serviceList.length} services, ${db.enquiries.length} enquiries, ${(db.priceList || []).length} rate cards, ${(db.notices || []).length} notices, and ${(db.quickLinks || []).length} portals.`,
        count: serviceList.length,
        sourceType: "webapp",
        services: db.services
      };
    } else {
      db.settings.google_sheet_webapp_url = url;
      db.settings.google_sheet_url = url;
      db.settings.last_sheet_sync = (/* @__PURE__ */ new Date()).toISOString();
      saveDatabase(db);
      return {
        success: true,
        message: `Connected to Google Apps Script! Link verified and saved (All sheet tables synchronized).`,
        sourceType: "webapp"
      };
    }
  } catch (err) {
    console.error("Web App fetch error:", err);
    return {
      success: false,
      message: `Failed to connect to Google Apps Script Web App: ${err.message || "Check URL permissions (Deploy > Anyone)."}`
    };
  }
}
if (db.settings.google_sheet_webapp_url || db.settings.google_sheet_url) {
  const syncTarget = db.settings.google_sheet_webapp_url || db.settings.google_sheet_url || "";
  if (syncTarget) {
    syncFromGoogleSource(syncTarget).then((res) => console.log("Initial Google Sheet sync result:", res.message)).catch((err) => console.warn("Initial Google Sheet sync skipped:", err.message));
  }
}
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    service: "Balaji Communication Live API",
    location: "Gaini, Bareilly",
    servicesCount: db.services.length,
    enquiriesCount: db.enquiries.length,
    lastSheetSync: db.settings.last_sheet_sync || null
  });
});
app.get("/api/services", (req, res) => {
  const auth = req.headers.authorization;
  const isAdmin = auth && auth.includes(ADMIN_TOKEN);
  const services = isAdmin ? db.services : db.services.filter((s) => !s.status || s.status.toLowerCase() !== "disabled");
  res.json({
    success: true,
    services,
    last_sheet_sync: db.settings.last_sheet_sync || null
  });
});
app.get("/api/services/:id", (req, res) => {
  const service = db.services.find((s) => s.service_id === req.params.id);
  if (!service) {
    return res.status(404).json({ error: "Service not found" });
  }
  res.json({ success: true, service });
});
app.post("/api/services", checkAdminAuth, async (req, res) => {
  const body = req.body;
  const nameEn = (body.service_name_en || body.service_name_hi || "").trim();
  const nameHi = (body.service_name_hi || body.service_name_en || "").trim();
  if (!nameEn && !nameHi) {
    return res.status(400).json({ error: "Service name is required (English or Hindi)." });
  }
  const newService = {
    service_id: body.service_id || `srv-${Date.now().toString(36)}`,
    service_name_en: nameEn || nameHi,
    service_name_hi: nameHi || nameEn,
    category: (body.category || "General Services").trim(),
    short_description_en: body.short_description_en || "",
    short_description_hi: body.short_description_hi || "",
    full_description_en: body.full_description_en || "",
    full_description_hi: body.full_description_hi || "",
    required_documents: Array.isArray(body.required_documents) ? body.required_documents : typeof body.required_documents === "string" ? body.required_documents.split("\n").map((s) => s.trim()).filter(Boolean) : [],
    icon: body.icon || "CreditCard",
    status: body.status === "Disabled" ? "Disabled" : "Active",
    popular: Boolean(body.popular),
    estimated_time: body.estimated_time || "1 to 3 Working Days",
    whatsapp_message: body.whatsapp_message || `Hello Balaji Communication, I want information about ${nameEn}.`,
    created_at: body.created_at || (/* @__PURE__ */ new Date()).toISOString(),
    updated_at: (/* @__PURE__ */ new Date()).toISOString()
  };
  const existingIdx = db.services.findIndex((s) => s.service_id === newService.service_id);
  if (existingIdx !== -1) {
    db.services[existingIdx] = newService;
  } else {
    db.services.unshift(newService);
  }
  saveDatabase(db);
  if (db.settings.google_sheet_webapp_url && db.settings.google_sheet_webapp_url.includes("script.google.com")) {
    try {
      fetch(db.settings.google_sheet_webapp_url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "createService",
          token: ADMIN_TOKEN,
          data: newService
        })
      }).catch((e) => console.warn("Background sync to Google Sheet error:", e.message));
    } catch (ignore) {
    }
  }
  res.json({ success: true, service: newService });
});
app.put("/api/services/:id", checkAdminAuth, (req, res) => {
  const targetId = String(req.params.id || "").trim();
  const idx = db.services.findIndex((s) => s.service_id.trim().toLowerCase() === targetId.toLowerCase());
  const body = req.body || {};
  let updatedService;
  if (idx === -1) {
    updatedService = {
      service_id: targetId,
      service_name_en: body.service_name_en || body.service_name_hi || "New Service",
      service_name_hi: body.service_name_hi || body.service_name_en || "\u0928\u0908 \u0938\u0947\u0935\u093E",
      category: body.category || "General Services",
      short_description_en: body.short_description_en || "",
      short_description_hi: body.short_description_hi || "",
      full_description_en: body.full_description_en || "",
      full_description_hi: body.full_description_hi || "",
      required_documents: Array.isArray(body.required_documents) ? body.required_documents : typeof body.required_documents === "string" ? body.required_documents.split("\n").filter(Boolean) : ["Original Aadhaar Card"],
      icon: body.icon || "FileText",
      status: body.status || "Active",
      popular: Boolean(body.popular),
      estimated_time: body.estimated_time || "1 to 3 Working Days",
      whatsapp_message: body.whatsapp_message || "",
      created_at: body.created_at || (/* @__PURE__ */ new Date()).toISOString(),
      updated_at: (/* @__PURE__ */ new Date()).toISOString()
    };
    db.services.unshift(updatedService);
  } else {
    updatedService = {
      ...db.services[idx],
      ...body,
      required_documents: Array.isArray(body.required_documents) ? body.required_documents : typeof body.required_documents === "string" ? body.required_documents.split("\n").filter(Boolean) : db.services[idx].required_documents,
      updated_at: (/* @__PURE__ */ new Date()).toISOString()
    };
    db.services[idx] = updatedService;
  }
  saveDatabase(db);
  if (db.settings.google_sheet_webapp_url && db.settings.google_sheet_webapp_url.includes("script.google.com")) {
    try {
      fetch(db.settings.google_sheet_webapp_url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "updateService",
          service_id: updatedService.service_id,
          id: updatedService.service_id,
          token: ADMIN_TOKEN,
          data: updatedService
        })
      }).catch((e) => console.warn("Background sync update to Google Sheet error:", e.message));
      const getUpdUrl = `${db.settings.google_sheet_webapp_url}${db.settings.google_sheet_webapp_url.includes("?") ? "&" : "?"}action=updateService&service_id=${encodeURIComponent(updatedService.service_id)}&service_name_en=${encodeURIComponent(updatedService.service_name_en || "")}&service_name_hi=${encodeURIComponent(updatedService.service_name_hi || "")}&status=${encodeURIComponent(updatedService.status || "Active")}`;
      fetch(getUpdUrl).catch(() => {
      });
    } catch (ignore) {
    }
  }
  res.json({ success: true, service: updatedService });
});
app.delete("/api/services/:id", checkAdminAuth, (req, res) => {
  const targetId = String(req.params.id || "").trim();
  db.services = db.services.filter((s) => s.service_id.trim().toLowerCase() !== targetId.toLowerCase());
  saveDatabase(db);
  if (db.settings.google_sheet_webapp_url && db.settings.google_sheet_webapp_url.includes("script.google.com")) {
    try {
      fetch(db.settings.google_sheet_webapp_url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "deleteService",
          service_id: targetId,
          id: targetId,
          token: ADMIN_TOKEN
        })
      }).catch((e) => console.warn("Background sync delete to Google Sheet error:", e.message));
      const getDelUrl = `${db.settings.google_sheet_webapp_url}${db.settings.google_sheet_webapp_url.includes("?") ? "&" : "?"}action=deleteService&service_id=${encodeURIComponent(targetId)}`;
      fetch(getDelUrl).catch(() => {
      });
    } catch (ignore) {
    }
  }
  res.json({ success: true, message: "Service deleted successfully" });
});
app.get("/api/sync-live", (req, res) => {
  res.json({
    success: true,
    services: db.services,
    settings: db.settings,
    priceList: db.priceList || [],
    notices: db.notices || [],
    quickLinks: db.quickLinks || [],
    timestamp: (/* @__PURE__ */ new Date()).toISOString()
  });
});
app.post("/api/sync-push", (req, res) => {
  const body = req.body || {};
  let changed = false;
  if (Array.isArray(body.services) && body.services.length > 0) {
    db.services = body.services.map((s, idx) => ({
      service_id: String(s.service_id || `srv-${Date.now().toString(36)}-${idx}`),
      service_name_en: String(s.service_name_en || s.service_name || "Service"),
      service_name_hi: String(s.service_name_hi || s.service_name_en || "\u0938\u0947\u0935\u093E"),
      category: String(s.category || "General Services"),
      short_description_en: String(s.short_description_en || ""),
      short_description_hi: String(s.short_description_hi || ""),
      full_description_en: String(s.full_description_en || ""),
      full_description_hi: String(s.full_description_hi || ""),
      required_documents: Array.isArray(s.required_documents) ? s.required_documents : typeof s.required_documents === "string" ? s.required_documents.split(/[;\n]+/).map((d) => d.trim()).filter(Boolean) : ["Original Aadhaar Card", "Mobile Number"],
      icon: s.icon || "CreditCard",
      status: s.status && String(s.status).toLowerCase() === "disabled" ? "Disabled" : "Active",
      popular: Boolean(s.popular === true || s.popular === "true" || s.popular === "yes"),
      estimated_time: s.estimated_time || "1 to 3 Working Days",
      whatsapp_message: s.whatsapp_message || `Hello Balaji Communication, I want information about ${s.service_name_en || "services"}.`,
      created_at: s.created_at || (/* @__PURE__ */ new Date()).toISOString(),
      updated_at: (/* @__PURE__ */ new Date()).toISOString()
    }));
    changed = true;
  }
  if (body.settings && typeof body.settings === "object") {
    db.settings = {
      ...db.settings,
      ...body.settings
    };
    changed = true;
  }
  if (Array.isArray(body.priceList) && body.priceList.length > 0) {
    db.priceList = body.priceList;
    changed = true;
  }
  if (Array.isArray(body.notices) && body.notices.length > 0) {
    db.notices = body.notices;
    changed = true;
  }
  if (Array.isArray(body.quickLinks) && body.quickLinks.length > 0) {
    db.quickLinks = body.quickLinks;
    changed = true;
  }
  if (Array.isArray(body.enquiries)) {
    db.enquiries = body.enquiries;
    changed = true;
  }
  if (changed) {
    saveDatabase(db);
  }
  res.json({
    success: true,
    message: "Data synced and persisted to database. All browsers updated.",
    servicesCount: db.services.length
  });
});
var isAutoSyncingGoogle = false;
setInterval(async () => {
  const target = db.settings.google_sheet_webapp_url || db.settings.google_sheet_url;
  if (!target || isAutoSyncingGoogle) return;
  isAutoSyncingGoogle = true;
  try {
    await syncFromGoogleSource(target);
  } catch (err) {
  } finally {
    isAutoSyncingGoogle = false;
  }
}, 25e3);
app.get("/api/categories", (req, res) => {
  const existingCategories = new Set(CATEGORIES);
  db.services.forEach((s) => {
    if (s.category) existingCategories.add(s.category);
  });
  res.json({ success: true, categories: Array.from(existingCategories) });
});
app.get("/api/settings", (req, res) => {
  res.json({ success: true, settings: db.settings });
});
app.put("/api/settings", checkAdminAuth, (req, res) => {
  db.settings = {
    ...db.settings,
    ...req.body
  };
  saveDatabase(db);
  res.json({ success: true, settings: db.settings });
});
app.post(["/api/enquiries", "/api/applications"], (req, res) => {
  const {
    customer_name,
    applicant_name,
    mobile,
    father_or_husband_name,
    address,
    service_id,
    service_name,
    category,
    message,
    preferred_contact,
    urgency
  } = req.body;
  const finalName = (customer_name || applicant_name || "").trim();
  if (!finalName || !mobile) {
    return res.status(400).json({ error: "Applicant name and mobile number are required." });
  }
  const cleanMobile = String(mobile).replace(/\D/g, "");
  if (cleanMobile.length < 10) {
    return res.status(400).json({ error: "Please enter a valid 10-digit mobile number." });
  }
  const content = `${finalName} ${message || ""}`.toLowerCase();
  if (content.includes("otp") || content.includes("password") || content.includes("upi pin") || content.includes("cvv")) {
    return res.status(400).json({ error: "Please do NOT enter OTP, bank passwords, or PINs on this form." });
  }
  const randomSuffix = Math.floor(1e3 + Math.random() * 9e3);
  const now = /* @__PURE__ */ new Date();
  const dateStr = `${String(now.getFullYear()).slice(-2)}${String(now.getMonth() + 1).padStart(2, "0")}`;
  const refId = req.body.enquiry_id && String(req.body.enquiry_id).trim() || `BALAJI-APP-${dateStr}-${randomSuffix}`;
  const newApplication = {
    enquiry_id: refId,
    customer_name: finalName,
    applicant_name: (applicant_name || finalName).trim(),
    mobile: cleanMobile,
    father_or_husband_name: father_or_husband_name ? father_or_husband_name.trim() : "",
    address: address ? address.trim() : "",
    village: (req.body.village || "Gaini").trim(),
    service_id: service_id || "",
    service_name: service_name || "General Citizen Service",
    category: category || "Jan Seva Kendra",
    message: message ? message.trim() : "",
    preferred_contact: preferred_contact === "WhatsApp" ? "WhatsApp" : "Call",
    status: "New",
    urgency: urgency || "Normal",
    created_at: now.toISOString(),
    updated_at: now.toISOString()
  };
  const existingIdx = db.enquiries.findIndex((e) => e.enquiry_id === newApplication.enquiry_id);
  if (existingIdx !== -1) {
    db.enquiries[existingIdx] = newApplication;
  } else {
    db.enquiries.unshift(newApplication);
  }
  saveDatabase(db);
  const sheetTarget = db.settings.google_sheet_webapp_url || db.settings.google_sheet_url;
  if (sheetTarget && sheetTarget.includes("script.google.com")) {
    try {
      fetch(sheetTarget, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "createEnquiry",
          data: newApplication
        })
      }).catch((err) => console.error("Failed forwarding application to Google Sheets Web App:", err));
    } catch (err) {
      console.error("Error forwarding to Google Sheet:", err);
    }
  }
  res.json({
    success: true,
    message: "Thank you. Your direct application has been received by Balaji Communication Jan Seva Kendra.",
    enquiry_id: newApplication.enquiry_id,
    application: newApplication
  });
});
app.get("/api/enquiries", checkAdminAuth, (req, res) => {
  res.json({ success: true, enquiries: db.enquiries });
});
app.get("/api/applications/track/:query", (req, res) => {
  const rawQ = req.params.query.trim();
  const q = rawQ.toLowerCase();
  const qNorm = q.replace(/[\s-_]/g, "");
  const digitsOnly = q.replace(/\D/g, "");
  const target10 = digitsOnly.length >= 10 ? digitsOnly.slice(-10) : digitsOnly;
  const matches = db.enquiries.filter((e) => {
    const id = (e.enquiry_id || "").toLowerCase();
    const idNorm = id.replace(/[\s-_]/g, "");
    const idMatch = id.includes(q) || qNorm.length >= 3 && idNorm.includes(qNorm);
    const eDigits = (e.mobile || "").replace(/\D/g, "");
    const e10 = eDigits.length >= 10 ? eDigits.slice(-10) : eDigits;
    const mobMatch = target10.length === 10 && e10 === target10 || digitsOnly.length >= 5 && (eDigits.includes(digitsOnly) || digitsOnly.includes(eDigits));
    const nameMatch = q.length >= 3 && ((e.customer_name || "").toLowerCase().includes(q) || (e.applicant_name || "").toLowerCase().includes(q));
    return idMatch || mobMatch || nameMatch;
  });
  res.json({
    success: true,
    query: rawQ,
    results: matches.map((m) => ({
      enquiry_id: m.enquiry_id,
      customer_name: m.customer_name,
      applicant_name: m.applicant_name || m.customer_name,
      service_name: m.service_name,
      status: m.status,
      created_at: m.created_at,
      updated_at: m.updated_at || m.created_at,
      preferred_contact: m.preferred_contact,
      village: m.village || "Gaini",
      address: m.address || "",
      urgency: m.urgency || "Normal",
      masked_mobile: m.mobile ? m.mobile.slice(0, 2) + "******" + m.mobile.slice(-2) : ""
    }))
  });
});
var handleStatusUpdate = (req, res) => {
  const { status, enquiry: clientEnquiry } = req.body;
  const targetId = req.params.id;
  const validStatuses = ["New", "Contacted", "Processing", "Completed", "Cancelled"];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ error: "Invalid status value. Must be New, Contacted, Processing, Completed, or Cancelled." });
  }
  let enquiry = db.enquiries.find(
    (e) => e.enquiry_id === targetId || e.enquiry_id.toLowerCase() === targetId.toLowerCase()
  );
  if (!enquiry) {
    const normTarget = targetId.toLowerCase().replace(/[\s-_]/g, "");
    enquiry = db.enquiries.find((e) => (e.enquiry_id || "").toLowerCase().replace(/[\s-_]/g, "") === normTarget);
  }
  if (!enquiry) {
    if (clientEnquiry && clientEnquiry.customer_name) {
      enquiry = {
        ...clientEnquiry,
        enquiry_id: targetId,
        status,
        updated_at: (/* @__PURE__ */ new Date()).toISOString()
      };
      db.enquiries.unshift(enquiry);
    } else {
      enquiry = {
        enquiry_id: targetId,
        customer_name: "Citizen Applicant",
        mobile: "",
        service_name: "Jan Seva Kendra Service",
        message: "",
        status,
        preferred_contact: "Call",
        created_at: (/* @__PURE__ */ new Date()).toISOString(),
        updated_at: (/* @__PURE__ */ new Date()).toISOString()
      };
      db.enquiries.unshift(enquiry);
    }
  } else {
    enquiry.status = status;
    enquiry.updated_at = (/* @__PURE__ */ new Date()).toISOString();
  }
  saveDatabase(db);
  const sheetTarget = db.settings.google_sheet_webapp_url || db.settings.google_sheet_url;
  if (sheetTarget && sheetTarget.includes("script.google.com")) {
    try {
      fetch(sheetTarget, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "updateEnquiryStatus",
          enquiry_id: enquiry.enquiry_id,
          status: enquiry.status
        })
      }).catch((err) => console.error("Failed forwarding status update to Google Sheets Web App:", err));
    } catch (err) {
      console.error("Error forwarding status update to Google Sheet:", err);
    }
  }
  return res.json({ success: true, enquiry, message: `Status updated to ${status}` });
};
app.patch("/api/enquiries/:id/status", checkAdminAuth, handleStatusUpdate);
app.post("/api/enquiries/:id/status", checkAdminAuth, handleStatusUpdate);
app.delete("/api/enquiries/:id", checkAdminAuth, (req, res) => {
  const prevLen = db.enquiries.length;
  db.enquiries = db.enquiries.filter((e) => e.enquiry_id !== req.params.id);
  if (db.enquiries.length === prevLen) {
    return res.status(404).json({ error: "Application/Enquiry not found" });
  }
  saveDatabase(db);
  res.json({ success: true, message: "Deleted successfully" });
});
app.delete("/api/enquiries-all", checkAdminAuth, (req, res) => {
  db.enquiries = [];
  saveDatabase(db);
  res.json({ success: true, message: "All enquiries cleared successfully." });
});
app.get("/api/pricelist", (req, res) => {
  res.json({ success: true, priceList: db.priceList || INITIAL_PRICELIST });
});
app.get("/api/notices", (req, res) => {
  res.json({ success: true, notices: db.notices || INITIAL_NOTICES });
});
app.get("/api/quicklinks", (req, res) => {
  res.json({ success: true, quickLinks: db.quickLinks || INITIAL_QUICKLINKS });
});
app.get("/api/citizens", checkAdminAuth, (req, res) => {
  res.json({ success: true, citizens: db.citizens || [] });
});
app.post("/api/auth/login", (req, res) => {
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
app.post("/api/auth/verify", (req, res) => {
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
app.post("/api/auth/change-password", checkAdminAuth, (req, res) => {
  const { newPassword } = req.body;
  if (!newPassword || newPassword.length < 6) {
    return res.status(400).json({ error: "Password must be at least 6 characters long." });
  }
  db.adminCredentials.passwordHash = newPassword;
  saveDatabase(db);
  res.json({ success: true, message: "Admin password updated successfully." });
});
app.post("/api/sync-sheets", checkAdminAuth, async (req, res) => {
  const { webapp_url, url } = req.body;
  const targetUrl = (webapp_url || url || db.settings.google_sheet_webapp_url || db.settings.google_sheet_url || "").trim();
  if (!targetUrl) {
    return res.status(400).json({ error: "Google Sheet URL or Web App link is required." });
  }
  const result = await syncFromGoogleSource(targetUrl);
  if (result.success) {
    return res.json({
      success: true,
      message: result.message,
      servicesCount: result.count,
      sourceType: result.sourceType
    });
  } else {
    return res.status(400).json({
      error: result.message
    });
  }
});
app.get("/api/export-services-csv", (req, res) => {
  const escapeCsv = (val) => `"${String(val || "").replace(/"/g, '""')}"`;
  const headers = [
    "service_id",
    "service_name_en",
    "service_name_hi",
    "category",
    "short_description_en",
    "short_description_hi",
    "full_description_en",
    "full_description_hi",
    "required_documents",
    "icon",
    "status",
    "popular",
    "estimated_time",
    "whatsapp_message"
  ];
  const csvRows = [headers.join(",")];
  db.services.forEach((s) => {
    csvRows.push([
      escapeCsv(s.service_id),
      escapeCsv(s.service_name_en),
      escapeCsv(s.service_name_hi),
      escapeCsv(s.category),
      escapeCsv(s.short_description_en),
      escapeCsv(s.short_description_hi),
      escapeCsv(s.full_description_en),
      escapeCsv(s.full_description_hi),
      escapeCsv((s.required_documents || []).join("; ")),
      escapeCsv(s.icon),
      escapeCsv(s.status),
      escapeCsv(s.popular ? "yes" : "no"),
      escapeCsv(s.estimated_time),
      escapeCsv(s.whatsapp_message)
    ].join(","));
  });
  res.setHeader("Content-Type", "text/csv; charset=utf-8");
  res.setHeader("Content-Disposition", 'attachment; filename="balaji_services.csv"');
  res.send("\uFEFF" + csvRows.join("\r\n"));
});
app.get("/api/templates", (req, res) => {
  const summary = SHEET_TEMPLATES.map((t) => ({
    id: t.id,
    title: t.title,
    hindiTitle: t.hindiTitle,
    description: t.description,
    fileName: t.fileName,
    sheetTabName: t.sheetTabName,
    badge: t.badge,
    columnsCount: t.headers.length,
    headers: t.headers,
    sampleRowsCount: t.sampleRows.length,
    downloadUrl: `/api/templates/${t.id}.csv`
  }));
  res.json({ success: true, templates: summary });
});
app.get("/api/templates/:id", (req, res) => {
  const cleanId = req.params.id.replace(/\.csv$/i, "").trim().toLowerCase();
  const template = SHEET_TEMPLATES.find((t) => t.id.toLowerCase() === cleanId);
  if (!template) {
    return res.status(404).json({
      error: `Template '${cleanId}' not found. Available: ${SHEET_TEMPLATES.map((t) => t.id).join(", ")}`
    });
  }
  const csvContent = generateCsvContent(template);
  res.setHeader("Content-Type", "text/csv; charset=utf-8");
  res.setHeader("Content-Disposition", `attachment; filename="${template.fileName}"`);
  res.send(csvContent);
});
app.post("/api/import-csv", checkAdminAuth, (req, res) => {
  const { type, csvText } = req.body;
  if (!csvText || typeof csvText !== "string" || !csvText.trim()) {
    return res.status(400).json({ error: "CSV data is required." });
  }
  const rows = parseCsvToObjects(csvText);
  if (rows.length === 0) {
    return res.status(400).json({ error: "No valid rows found in the CSV content." });
  }
  const cleanType = (type || "services").toLowerCase().trim();
  if (cleanType === "services") {
    const importedServices = [];
    rows.forEach((r, idx) => {
      const s = mapRowToService(r, idx);
      if (s) importedServices.push(s);
    });
    if (importedServices.length === 0) {
      return res.status(400).json({ error: "Could not parse any valid services from CSV. Please check columns." });
    }
    const importedIds = new Set(importedServices.map((s) => s.service_id));
    const retained = db.services.filter((s) => !importedIds.has(s.service_id));
    db.services = [...importedServices, ...retained];
    saveDatabase(db);
    return res.json({
      success: true,
      count: importedServices.length,
      totalServices: db.services.length,
      message: `Successfully imported ${importedServices.length} services from CSV file! Total catalog now has ${db.services.length} services.`
    });
  }
  if (cleanType === "enquiries") {
    let addedCount = 0;
    rows.forEach((r, idx) => {
      const name = r.customer_name || r.applicant_name || r.name || "";
      const mobile = r.mobile || r.phone || "";
      if (!name || !mobile) return;
      const newEnq = {
        enquiry_id: r.enquiry_id || `ENQ-IMP-${Date.now().toString(36).toUpperCase()}-${idx + 1}`,
        customer_name: name,
        applicant_name: r.applicant_name || name,
        father_or_husband_name: r.father_or_husband_name || r.father_name || "",
        mobile: mobile.replace(/\D/g, "").slice(-10),
        service_name: r.service_name || r.service || "General Jan Seva Assistance",
        category: r.category || "General",
        village: r.village || "",
        address: r.address || "",
        message: r.message || r.notes || "Imported via CSV",
        preferred_contact: r.preferred_contact && r.preferred_contact.toLowerCase().includes("whatsapp") ? "WhatsApp" : "Call",
        urgency: r.urgency || "Normal",
        status: ["New", "Contacted", "Processing", "Completed", "Cancelled"].includes(r.status) ? r.status : "New",
        created_at: r.created_at || (/* @__PURE__ */ new Date()).toISOString()
      };
      db.enquiries.unshift(newEnq);
      addedCount++;
    });
    if (addedCount === 0) {
      return res.status(400).json({ error: "Could not parse any valid enquiries. 'customer_name' and 'mobile' columns are required." });
    }
    saveDatabase(db);
    return res.json({
      success: true,
      count: addedCount,
      totalEnquiries: db.enquiries.length,
      message: `Successfully imported ${addedCount} citizen applications/enquiries from CSV file!`
    });
  }
  if (cleanType === "pricelist") {
    const list = rows.map((r, idx) => ({
      price_id: r.price_id || `PRC-${idx + 1}`,
      service_name: r.service_name || r.name || "",
      category: r.category || "General",
      government_fee: r.government_fee || r.govt_fee || "\u20B90",
      csc_service_fee: r.csc_service_fee || r.csc_fee || "\u20B90",
      total_fee: r.total_fee || r.fee || "\u20B90",
      processing_time: r.processing_time || r.time || "1-3 Days",
      eligibility_or_note: r.eligibility_or_note || r.notes || "",
      status: r.status || "Active"
    })).filter((p) => p.service_name);
    db.priceList = list;
    saveDatabase(db);
    return res.json({
      success: true,
      count: list.length,
      message: `Successfully imported ${list.length} CSC price list items!`
    });
  }
  if (cleanType === "notices") {
    const list = rows.map((r, idx) => ({
      notice_id: r.notice_id || `NTC-${idx + 1}`,
      title_en: r.title_en || r.title || "",
      title_hi: r.title_hi || r.title_en || "",
      description_en: r.description_en || r.description || "",
      description_hi: r.description_hi || r.description_en || "",
      category: r.category || "General",
      badge_type: ["Urgent", "New", "Important", "General"].includes(r.badge_type) ? r.badge_type : "Important",
      last_date: r.last_date || "",
      action_link: r.action_link || "",
      status: r.status === "Archived" ? "Archived" : "Active",
      created_at: r.created_at || (/* @__PURE__ */ new Date()).toISOString()
    })).filter((n) => n.title_en || n.title_hi);
    db.notices = list;
    saveDatabase(db);
    return res.json({
      success: true,
      count: list.length,
      message: `Successfully imported ${list.length} announcements & notices!`
    });
  }
  if (cleanType === "quicklinks") {
    const list = rows.map((r, idx) => ({
      link_id: r.link_id || `LNK-${idx + 1}`,
      portal_name: r.portal_name || r.name || "",
      department: r.department || "",
      category: r.category || "General",
      portal_url: r.portal_url || r.url || "",
      description: r.description || "",
      portal_login_type: r.portal_login_type || "",
      required_credentials: r.required_credentials || ""
    })).filter((l) => l.portal_name && l.portal_url);
    db.quickLinks = list;
    saveDatabase(db);
    return res.json({
      success: true,
      count: list.length,
      message: `Successfully imported ${list.length} government portal quick links!`
    });
  }
  if (cleanType === "citizens") {
    const list = rows.map((r, idx) => ({
      citizen_id: r.citizen_id || `CIT-${idx + 1}`,
      full_name: r.full_name || r.name || "",
      father_name: r.father_name || "",
      mobile: (r.mobile || "").replace(/\D/g, "").slice(-10),
      aadhaar_last4: r.aadhaar_last4 || "",
      village: r.village || "",
      address: r.address || "",
      services_availed: r.services_availed || "",
      notes: r.notes || "",
      status: r.status || "Active",
      created_at: r.created_at || (/* @__PURE__ */ new Date()).toISOString()
    })).filter((c) => c.full_name);
    db.citizens = list;
    saveDatabase(db);
    return res.json({
      success: true,
      count: list.length,
      message: `Successfully imported ${list.length} citizen customer records!`
    });
  }
  return res.status(400).json({
    error: `Unknown import type: '${type}'. Supported types: services, enquiries, pricelist, notices, quicklinks, citizens`
  });
});
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await (0, import_vite.createServer)({
      server: {
        middlewareMode: true,
        hmr: false,
        watch: {
          ignored: [
            "**/data/**",
            "**/data/*",
            "**/public/**",
            "**/dist/**",
            "**/vikki/**",
            "**/docs/**",
            "**/*.json",
            "**/node_modules/**",
            (p) => typeof p === "string" && (p.includes("/data/") || p.includes("/public/") || p.includes("/dist/") || p.includes("/vikki/") || p.includes("/docs/") || p.endsWith(".json"))
          ]
        }
      },
      appType: "spa"
    });
    try {
      if (vite.watcher) {
        vite.watcher.unwatch([
          DATA_DIR,
          DB_FILE,
          import_path.default.join(process.cwd(), "data"),
          import_path.default.join(process.cwd(), "public"),
          import_path.default.join(process.cwd(), "dist"),
          import_path.default.join(process.cwd(), "vikki"),
          import_path.default.join(process.cwd(), "docs")
        ]);
      }
    } catch (e) {
    }
    app.use(vite.middlewares);
  } else {
    const distPath = import_path.default.join(process.cwd(), "dist");
    const vikkiPath = import_path.default.join(process.cwd(), "vikki");
    if (import_fs.default.existsSync(vikkiPath)) {
      app.use("/vikki", import_express.default.static(vikkiPath));
    }
    app.use("/vikki", import_express.default.static(distPath));
    app.use(import_express.default.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(import_path.default.join(distPath, "index.html"));
    });
  }
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Balaji Communication Server running on http://0.0.0.0:${PORT}`);
  });
}
startServer();
//# sourceMappingURL=server.cjs.map
