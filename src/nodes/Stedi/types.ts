/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import { IDataObject } from 'n8n-workflow';

/**
 * Stedi API Types
 * Healthcare EDI transaction types and interfaces
 */

// Base types
export type StediEnvironment = 'test' | 'production';
export type Gender = 'M' | 'F' | 'U';
export type ProviderType = 'BillingProvider' | 'RenderingProvider' | 'ReferringProvider' | 'ServiceFacility';

// Address structure used throughout Stedi API
export interface StediAddress {
  address1: string;
  address2?: string;
  city: string;
  state: string;
  postalCode: string;
  countryCode?: string;
}

// Contact information
export interface ContactInformation {
  name: string;
  phoneNumber: string;
  faxNumber?: string;
  email?: string;
}

// Submitter information
export interface Submitter {
  organizationName: string;
  contactInformation: ContactInformation;
}

// Receiver information
export interface Receiver {
  organizationName: string;
}

// Subscriber (patient/member) information
export interface Subscriber {
  memberId: string;
  firstName: string;
  lastName: string;
  middleName?: string;
  suffix?: string;
  dateOfBirth: string;
  gender: Gender;
  address: StediAddress;
  groupNumber?: string;
}

// Provider information
export interface Provider {
  providerType: ProviderType;
  npi: string;
  taxonomyCode?: string;
  organizationName?: string;
  firstName?: string;
  lastName?: string;
  address?: StediAddress;
  taxId?: string;
  taxIdType?: 'EIN' | 'SSN';
}

// Diagnosis code
export interface DiagnosisCode {
  diagnosisTypeCode: string;
  diagnosisCode: string;
}

// Service line for claims
export interface ServiceLine {
  serviceDate: string;
  serviceDateEnd?: string;
  professionalService: {
    procedureCode: string;
    procedureModifiers?: string[];
    lineItemChargeAmount: string;
    measurementUnit: string;
    serviceUnitCount: string;
    compositeDiagnosisCodePointers: {
      diagnosisCodePointers: string[];
    };
    placeOfServiceCode?: string;
  };
  providerControlNumber?: string;
  renderingProvider?: Provider;
}

// Claim information
export interface ClaimInformation {
  patientControlNumber: string;
  claimChargeAmount: string;
  placeOfServiceCode: string;
  claimFrequencyCode: string;
  signatureIndicator: string;
  planParticipationCode: string;
  releaseInformationCode: string;
  healthCareCodeInformation: DiagnosisCode[];
  serviceLines: ServiceLine[];
  claimNote?: string;
  referenceIdentifications?: Array<{
    referenceIdentificationQualifier: string;
    referenceIdentificationValue: string;
  }>;
}

// Professional Claim (837P)
export interface ProfessionalClaim {
  controlNumber: string;
  tradingPartnerServiceId: string;
  tradingPartnerName?: string;
  submitter: Submitter;
  receiver: Receiver;
  subscriber: Subscriber;
  dependent?: Partial<Subscriber> & {
    relationship: string;
  };
  providers: Provider[];
  claimInformation: ClaimInformation;
}

// Institutional Claim (837I)
export interface InstitutionalClaim extends ProfessionalClaim {
  claimInformation: ClaimInformation & {
    admissionTypeCode?: string;
    admissionSourceCode?: string;
    patientStatusCode?: string;
    facilityCodeQualifier?: string;
    facilityCodeValue?: string;
    admitDate?: string;
    dischargeDate?: string;
  };
}

// Dental Claim (837D)
export interface DentalClaim extends ProfessionalClaim {
  claimInformation: ClaimInformation & {
    toothInformation?: Array<{
      toothCode: string;
      toothSurface?: string[];
    }>;
    orthodonticInformation?: {
      orthodonticTreatmentIndicator: string;
      orthodonticTreatmentMonths?: string;
    };
  };
}

// Claim Status Request (276)
export interface ClaimStatusRequest {
  tradingPartnerServiceId: string;
  submitter: Submitter;
  subscriber: {
    memberId: string;
    firstName: string;
    lastName: string;
    dateOfBirth: string;
  };
  dependent?: {
    firstName: string;
    lastName: string;
    dateOfBirth: string;
    relationship: string;
  };
  providers: Array<{
    organizationName?: string;
    firstName?: string;
    lastName?: string;
    npi: string;
  }>;
  claimStatusInquiry: {
    patientControlNumber?: string;
    serviceDate?: string;
    serviceDateEnd?: string;
    claimAmount?: string;
    trackingNumber?: string;
  };
}

// Eligibility Request (270)
export interface EligibilityRequest {
  tradingPartnerServiceId: string;
  provider: {
    organizationName?: string;
    firstName?: string;
    lastName?: string;
    npi: string;
    serviceProviderNumber?: string;
  };
  subscriber: {
    memberId: string;
    firstName?: string;
    lastName?: string;
    dateOfBirth?: string;
    groupNumber?: string;
  };
  dependent?: {
    firstName: string;
    lastName: string;
    dateOfBirth: string;
    relationship: string;
    memberId?: string;
  };
  encounter: {
    serviceTypeCodes: string[];
    dateRange?: {
      startDate: string;
      endDate: string;
    };
  };
}

// Transaction types
export type TransactionType = 
  | '837P'  // Professional Claim
  | '837I'  // Institutional Claim
  | '837D'  // Dental Claim
  | '835'   // Remittance Advice
  | '277CA' // Claim Acknowledgment
  | '276'   // Claim Status Request
  | '277'   // Claim Status Response
  | '270'   // Eligibility Request
  | '271'   // Eligibility Response
  | '275';  // Attachment

// Transaction response
export interface Transaction {
  transactionId: string;
  type: TransactionType;
  status: string;
  createdAt: string;
  updatedAt: string;
  input?: IDataObject;
  output?: IDataObject;
}

// Pagination
export interface PaginatedResponse<T> {
  items: T[];
  pageToken?: string;
  nextPageToken?: string;
}

// API Error
export interface StediError {
  error: {
    code: string;
    message: string;
    details?: IDataObject[];
  };
}

// Helper to format dates to YYYYMMDD
export function formatDate(date: string | Date): string {
  if (typeof date === 'string') {
    // If already in YYYYMMDD format
    if (/^\d{8}$/.test(date)) {
      return date;
    }
    date = new Date(date);
  }
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}${month}${day}`;
}

// Helper to parse YYYYMMDD to ISO date
export function parseDate(yyyymmdd: string): string {
  if (!/^\d{8}$/.test(yyyymmdd)) {
    return yyyymmdd;
  }
  const year = yyyymmdd.substring(0, 4);
  const month = yyyymmdd.substring(4, 6);
  const day = yyyymmdd.substring(6, 8);
  return `${year}-${month}-${day}`;
}

// Common service type codes for eligibility
export const SERVICE_TYPE_CODES = {
  '1': 'Medical Care',
  '2': 'Surgical',
  '3': 'Consultation',
  '4': 'Diagnostic X-Ray',
  '5': 'Diagnostic Lab',
  '6': 'Radiation Therapy',
  '7': 'Anesthesia',
  '8': 'Surgical Assistance',
  '12': 'Durable Medical Equipment Purchase',
  '14': 'Renal Supplies in the Home',
  '18': 'Durable Medical Equipment Rental',
  '30': 'Health Benefit Plan Coverage',
  '33': 'Chiropractic',
  '35': 'Dental Care',
  '36': 'Dental Crowns',
  '37': 'Dental Accident',
  '38': 'Orthodontics',
  '39': 'Prosthodontics',
  '40': 'Oral Surgery',
  '41': 'Routine Preventive Dental',
  '42': 'Home Health Care',
  '45': 'Hospice',
  '47': 'Hospital',
  '48': 'Hospital - Inpatient',
  '50': 'Hospital - Outpatient',
  '51': 'Hospital - Emergency Accident',
  '52': 'Hospital - Emergency Medical',
  '53': 'Hospital - Ambulatory Surgical',
  '54': 'Long Term Care',
  '55': 'Major Medical',
  '56': 'Medically Related Transportation',
  '57': 'Air Transportation',
  '58': 'Cabulance',
  '59': 'Licensed Ambulance',
  '60': 'General Benefits',
  '61': 'In-Vitro Fertilization',
  '62': 'MRI/CAT Scan',
  '63': 'Donor Procedures',
  '64': 'Acupuncture',
  '65': 'Newborn Care',
  '66': 'Pathology',
  '67': 'Smoking Cessation',
  '68': 'Well Baby Care',
  '69': 'Maternity',
  '70': 'Transplants',
  '71': 'Audiology Exam',
  '72': 'Inhalation Therapy',
  '73': 'Diagnostic Medical',
  '74': 'Private Duty Nursing',
  '75': 'Prosthetic Device',
  '76': 'Dialysis',
  '77': 'Otological Exam',
  '78': 'Chemotherapy',
  '79': 'Allergy Testing',
  '80': 'Immunizations',
  '81': 'Routine Physical',
  '82': 'Family Planning',
  '83': 'Infertility',
  '84': 'Abortion',
  '85': 'AIDS',
  '86': 'Emergency Services',
  '87': 'Cancer',
  '88': 'Pharmacy',
  '89': 'Free Standing Prescription Drug',
  '90': 'Mail Order Prescription Drug',
  '91': 'Brand Name Prescription Drug',
  '92': 'Generic Prescription Drug',
  '93': 'Podiatry',
  '94': 'Podiatry - Office Visits',
  '95': 'Podiatry - Nursing Home Visits',
  '96': 'Professional (Physician)',
  '98': 'Professional (Physician) - Visit - Office',
  '99': 'Professional (Physician) - Visit - Inpatient',
  'A0': 'Professional (Physician) - Visit - Outpatient',
  'A1': 'Professional (Physician) - Visit - Nursing Home',
  'A2': 'Professional (Physician) - Visit - Skilled Nursing Facility',
  'A3': 'Professional (Physician) - Visit - Home',
  'A4': 'Psychiatric',
  'A5': 'Psychiatric - Room and Board',
  'A6': 'Psychotherapy',
  'A7': 'Psychiatric - Inpatient',
  'A8': 'Psychiatric - Outpatient',
  'A9': 'Rehabilitation',
  'AA': 'Rehabilitation - Room and Board',
  'AB': 'Rehabilitation - Inpatient',
  'AC': 'Rehabilitation - Outpatient',
  'AD': 'Occupational Therapy',
  'AE': 'Physical Medicine',
  'AF': 'Speech Therapy',
  'AG': 'Skilled Nursing Care',
  'AH': 'Skilled Nursing Care - Room and Board',
  'AI': 'Substance Abuse',
  'AJ': 'Alcoholism',
  'AK': 'Drug Addiction',
  'AL': 'Vision (Optometry)',
  'AM': 'Frames',
  'AN': 'Routine Exam',
  'AO': 'Lenses',
  'AQ': 'Nonmedically Necessary Physical',
  'AR': 'Experimental Drug Therapy',
  'B1': 'Burn Care',
  'B2': 'Brand Name Prescription Drug - Formulary',
  'B3': 'Brand Name Prescription Drug - Non-Formulary',
  'BA': 'Independent Medical Evaluation',
  'BB': 'Partial Hospitalization (Psychiatric)',
  'BC': 'Day Care (Psychiatric)',
  'BD': 'Cognitive Therapy',
  'BE': 'Massage Therapy',
  'BF': 'Pulmonary Rehabilitation',
  'BG': 'Cardiac Rehabilitation',
  'BH': 'Pediatric',
  'BI': 'Nursery',
  'BJ': 'Skin',
  'BK': 'Orthopedic',
  'BL': 'Cardiac',
  'BM': 'Lymphatic',
  'BN': 'Gastrointestinal',
  'BP': 'Endocrine',
  'BQ': 'Neurology',
  'BR': 'Eye',
  'BS': 'Invasive Procedures',
  'BT': 'Gynecological',
  'BU': 'Obstetrical',
  'BV': 'Obstetrical/Gynecological',
  'BW': 'Mail Order Prescription Drug: Brand Name',
  'BX': 'Mail Order Prescription Drug: Generic',
  'BY': 'Physician Visit - Office: Sick',
  'BZ': 'Physician Visit - Office: Well',
  'C1': 'Coronary Care',
  'CA': 'Private Duty Nursing - Inpatient',
  'CB': 'Private Duty Nursing - Home',
  'CC': 'Surgical Benefits - Professional (Physician)',
  'CD': 'Surgical Benefits - Facility',
  'CE': 'Mental Health Provider - Inpatient',
  'CF': 'Mental Health Provider - Outpatient',
  'CG': 'Mental Health Facility - Inpatient',
  'CH': 'Mental Health Facility - Outpatient',
  'CI': 'Substance Abuse Facility - Inpatient',
  'CJ': 'Substance Abuse Facility - Outpatient',
  'CK': 'Screening X-Ray',
  'CL': 'Screening Laboratory',
  'CM': 'Mammogram, High Risk Patient',
  'CN': 'Mammogram, Low Risk Patient',
  'CO': 'Flu Vaccination',
  'CP': 'Eyewear and Eyewear Accessories',
  'CQ': 'Case Management',
  'DG': 'Dermatology',
  'DM': 'Durable Medical Equipment',
  'DS': 'Diabetic Supplies',
  'GF': 'Generic Prescription Drug - Formulary',
  'GN': 'Generic Prescription Drug - Non-Formulary',
  'GY': 'Allergy',
  'IC': 'Intensive Care',
  'MH': 'Mental Health',
  'NI': 'Neonatal Intensive Care',
  'ON': 'Oncology',
  'PT': 'Physical Therapy',
  'PU': 'Pulmonary',
  'RN': 'Renal',
  'RT': 'Residential Psychiatric Treatment',
  'TC': 'Transitional Care',
  'TN': 'Transitional Nursery Care',
  'UC': 'Urgent Care',
};
