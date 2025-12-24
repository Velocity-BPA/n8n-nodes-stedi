/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import { INodeProperties } from 'n8n-workflow';

export const professionalClaimOperations: INodeProperties[] = [
  {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    noDataExpression: true,
    displayOptions: {
      show: {
        resource: ['professionalClaim'],
      },
    },
    options: [
      {
        name: 'Submit',
        value: 'submit',
        description: 'Submit a new professional claim (837P)',
        action: 'Submit a professional claim',
      },
      {
        name: 'Get PDF',
        value: 'getPdf',
        description: 'Get CMS-1500 PDF for a submitted claim',
        action: 'Get CMS-1500 PDF',
      },
    ],
    default: 'submit',
  },
];

export const professionalClaimFields: INodeProperties[] = [
  // Submit operation fields
  // Control Number
  {
    displayName: 'Control Number',
    name: 'controlNumber',
    type: 'string',
    required: true,
    displayOptions: {
      show: {
        resource: ['professionalClaim'],
        operation: ['submit'],
      },
    },
    default: '',
    description: 'Unique identifier for this claim submission (up to 9 characters)',
    placeholder: 'CLM123456',
  },
  {
    displayName: 'Trading Partner Service ID',
    name: 'tradingPartnerServiceId',
    type: 'string',
    required: true,
    displayOptions: {
      show: {
        resource: ['professionalClaim'],
        operation: ['submit'],
      },
    },
    default: '',
    description: 'Payer ID from the Stedi Payer Network. Find payer IDs at https://www.stedi.com/payer-network.',
    placeholder: 'BCBSFL',
  },

  // Submitter section
  {
    displayName: 'Submitter Organization Name',
    name: 'submitterOrganizationName',
    type: 'string',
    required: true,
    displayOptions: {
      show: {
        resource: ['professionalClaim'],
        operation: ['submit'],
      },
    },
    default: '',
    description: 'Name of the organization submitting the claim',
  },
  {
    displayName: 'Submitter Contact Name',
    name: 'submitterContactName',
    type: 'string',
    required: true,
    displayOptions: {
      show: {
        resource: ['professionalClaim'],
        operation: ['submit'],
      },
    },
    default: '',
    description: 'Name of the contact person for claim inquiries',
  },
  {
    displayName: 'Submitter Phone',
    name: 'submitterPhone',
    type: 'string',
    required: true,
    displayOptions: {
      show: {
        resource: ['professionalClaim'],
        operation: ['submit'],
      },
    },
    default: '',
    description: 'Phone number for claim inquiries',
    placeholder: '5551234567',
  },

  // Receiver section
  {
    displayName: 'Receiver Organization Name',
    name: 'receiverOrganizationName',
    type: 'string',
    required: true,
    displayOptions: {
      show: {
        resource: ['professionalClaim'],
        operation: ['submit'],
      },
    },
    default: '',
    description: 'Name of the payer organization receiving the claim',
  },

  // Subscriber section
  {
    displayName: 'Subscriber Member ID',
    name: 'subscriberMemberId',
    type: 'string',
    required: true,
    displayOptions: {
      show: {
        resource: ['professionalClaim'],
        operation: ['submit'],
      },
    },
    default: '',
    description: "Patient's member ID on their insurance card",
  },
  {
    displayName: 'Subscriber First Name',
    name: 'subscriberFirstName',
    type: 'string',
    required: true,
    displayOptions: {
      show: {
        resource: ['professionalClaim'],
        operation: ['submit'],
      },
    },
    default: '',
    description: "Patient's first name as shown on insurance card",
  },
  {
    displayName: 'Subscriber Last Name',
    name: 'subscriberLastName',
    type: 'string',
    required: true,
    displayOptions: {
      show: {
        resource: ['professionalClaim'],
        operation: ['submit'],
      },
    },
    default: '',
    description: "Patient's last name as shown on insurance card",
  },
  {
    displayName: 'Subscriber Date of Birth',
    name: 'subscriberDateOfBirth',
    type: 'string',
    required: true,
    displayOptions: {
      show: {
        resource: ['professionalClaim'],
        operation: ['submit'],
      },
    },
    default: '',
    description: "Patient's date of birth (YYYY-MM-DD)",
    placeholder: '1980-01-15',
  },
  {
    displayName: 'Subscriber Gender',
    name: 'subscriberGender',
    type: 'options',
    required: true,
    displayOptions: {
      show: {
        resource: ['professionalClaim'],
        operation: ['submit'],
      },
    },
    options: [
      { name: 'Male', value: 'M' },
      { name: 'Female', value: 'F' },
      { name: 'Unknown', value: 'U' },
    ],
    default: 'M',
    description: "Patient's gender",
  },
  {
    displayName: 'Subscriber Address Line 1',
    name: 'subscriberAddress1',
    type: 'string',
    required: true,
    displayOptions: {
      show: {
        resource: ['professionalClaim'],
        operation: ['submit'],
      },
    },
    default: '',
    description: "Patient's street address",
  },
  {
    displayName: 'Subscriber City',
    name: 'subscriberCity',
    type: 'string',
    required: true,
    displayOptions: {
      show: {
        resource: ['professionalClaim'],
        operation: ['submit'],
      },
    },
    default: '',
    description: "Patient's city",
  },
  {
    displayName: 'Subscriber State',
    name: 'subscriberState',
    type: 'string',
    required: true,
    displayOptions: {
      show: {
        resource: ['professionalClaim'],
        operation: ['submit'],
      },
    },
    default: '',
    description: "Patient's state (2-letter code)",
    placeholder: 'FL',
  },
  {
    displayName: 'Subscriber Postal Code',
    name: 'subscriberPostalCode',
    type: 'string',
    required: true,
    displayOptions: {
      show: {
        resource: ['professionalClaim'],
        operation: ['submit'],
      },
    },
    default: '',
    description: "Patient's ZIP code",
    placeholder: '33101',
  },

  // Billing Provider section
  {
    displayName: 'Billing Provider NPI',
    name: 'billingProviderNpi',
    type: 'string',
    required: true,
    displayOptions: {
      show: {
        resource: ['professionalClaim'],
        operation: ['submit'],
      },
    },
    default: '',
    description: '10-digit National Provider Identifier for billing provider',
    placeholder: '1234567890',
  },
  {
    displayName: 'Billing Provider Taxonomy Code',
    name: 'billingProviderTaxonomy',
    type: 'string',
    required: true,
    displayOptions: {
      show: {
        resource: ['professionalClaim'],
        operation: ['submit'],
      },
    },
    default: '',
    description: 'Provider taxonomy code (e.g., 207Q00000X for Family Medicine)',
    placeholder: '207Q00000X',
  },
  {
    displayName: 'Billing Provider Organization Name',
    name: 'billingProviderOrganizationName',
    type: 'string',
    required: true,
    displayOptions: {
      show: {
        resource: ['professionalClaim'],
        operation: ['submit'],
      },
    },
    default: '',
    description: 'Legal name of the billing provider organization',
  },
  {
    displayName: 'Billing Provider Address Line 1',
    name: 'billingProviderAddress1',
    type: 'string',
    required: true,
    displayOptions: {
      show: {
        resource: ['professionalClaim'],
        operation: ['submit'],
      },
    },
    default: '',
    description: 'Billing provider street address',
  },
  {
    displayName: 'Billing Provider City',
    name: 'billingProviderCity',
    type: 'string',
    required: true,
    displayOptions: {
      show: {
        resource: ['professionalClaim'],
        operation: ['submit'],
      },
    },
    default: '',
    description: 'Billing provider city',
  },
  {
    displayName: 'Billing Provider State',
    name: 'billingProviderState',
    type: 'string',
    required: true,
    displayOptions: {
      show: {
        resource: ['professionalClaim'],
        operation: ['submit'],
      },
    },
    default: '',
    description: 'Billing provider state (2-letter code)',
    placeholder: 'FL',
  },
  {
    displayName: 'Billing Provider Postal Code',
    name: 'billingProviderPostalCode',
    type: 'string',
    required: true,
    displayOptions: {
      show: {
        resource: ['professionalClaim'],
        operation: ['submit'],
      },
    },
    default: '',
    description: 'Billing provider ZIP code',
    placeholder: '33101',
  },
  {
    displayName: 'Billing Provider Tax ID',
    name: 'billingProviderTaxId',
    type: 'string',
    required: true,
    displayOptions: {
      show: {
        resource: ['professionalClaim'],
        operation: ['submit'],
      },
    },
    default: '',
    description: 'Billing provider EIN or SSN (numbers only)',
    placeholder: '123456789',
  },

  // Claim Information
  {
    displayName: 'Patient Control Number',
    name: 'patientControlNumber',
    type: 'string',
    required: true,
    displayOptions: {
      show: {
        resource: ['professionalClaim'],
        operation: ['submit'],
      },
    },
    default: '',
    description: 'Your internal reference number for this patient/claim',
    placeholder: 'PAT-001-2024',
  },
  {
    displayName: 'Claim Charge Amount',
    name: 'claimChargeAmount',
    type: 'string',
    required: true,
    displayOptions: {
      show: {
        resource: ['professionalClaim'],
        operation: ['submit'],
      },
    },
    default: '',
    description: 'Total charge amount for the claim',
    placeholder: '150.00',
  },
  {
    displayName: 'Place of Service Code',
    name: 'placeOfServiceCode',
    type: 'options',
    required: true,
    displayOptions: {
      show: {
        resource: ['professionalClaim'],
        operation: ['submit'],
      },
    },
    options: [
      { name: '11 - Office', value: '11' },
      { name: '12 - Home', value: '12' },
      { name: '19 - Off Campus-Outpatient Hospital', value: '19' },
      { name: '20 - Urgent Care Facility', value: '20' },
      { name: '21 - Inpatient Hospital', value: '21' },
      { name: '22 - On Campus-Outpatient Hospital', value: '22' },
      { name: '23 - Emergency Room - Hospital', value: '23' },
      { name: '24 - Ambulatory Surgical Center', value: '24' },
      { name: '31 - Skilled Nursing Facility', value: '31' },
      { name: '32 - Nursing Facility', value: '32' },
      { name: '41 - Ambulance - Land', value: '41' },
      { name: '42 - Ambulance - Air or Water', value: '42' },
      { name: '49 - Independent Clinic', value: '49' },
      { name: '50 - Federally Qualified Health Center', value: '50' },
      { name: '51 - Inpatient Psychiatric Facility', value: '51' },
      { name: '52 - Psychiatric Facility-Partial Hospitalization', value: '52' },
      { name: '53 - Community Mental Health Center', value: '53' },
      { name: '61 - Comprehensive Inpatient Rehab', value: '61' },
      { name: '62 - Comprehensive Outpatient Rehab', value: '62' },
      { name: '65 - End-Stage Renal Disease Treatment', value: '65' },
      { name: '81 - Independent Laboratory', value: '81' },
      { name: '99 - Other', value: '99' },
    ],
    default: '11',
    description: 'CMS Place of Service code',
  },

  // Diagnosis Codes
  {
    displayName: 'Diagnosis Codes',
    name: 'diagnosisCodes',
    type: 'fixedCollection',
    typeOptions: {
      multipleValues: true,
    },
    required: true,
    displayOptions: {
      show: {
        resource: ['professionalClaim'],
        operation: ['submit'],
      },
    },
    default: {},
    options: [
      {
        name: 'codes',
        displayName: 'Diagnosis',
        values: [
          {
            displayName: 'Diagnosis Type',
            name: 'diagnosisTypeCode',
            type: 'options',
            options: [
              { name: 'ABK - ICD-10-CM Principal', value: 'ABK' },
              { name: 'ABF - ICD-10-CM', value: 'ABF' },
            ],
            default: 'ABK',
            description: 'Type of diagnosis code',
          },
          {
            displayName: 'Diagnosis Code',
            name: 'diagnosisCode',
            type: 'string',
            default: '',
            description: 'ICD-10-CM diagnosis code (without periods)',
            placeholder: 'J069',
          },
        ],
      },
    ],
    description: 'List of diagnosis codes (ICD-10)',
  },

  // Service Lines
  {
    displayName: 'Service Lines',
    name: 'serviceLines',
    type: 'fixedCollection',
    typeOptions: {
      multipleValues: true,
    },
    required: true,
    displayOptions: {
      show: {
        resource: ['professionalClaim'],
        operation: ['submit'],
      },
    },
    default: {},
    options: [
      {
        name: 'lines',
        displayName: 'Service Line',
        values: [
          {
            displayName: 'Service Date',
            name: 'serviceDate',
            type: 'string',
            required: true,
            default: '',
            description: 'Date of service (YYYY-MM-DD)',
            placeholder: '2024-01-15',
          },
          {
            displayName: 'Procedure Code (CPT/HCPCS)',
            name: 'procedureCode',
            type: 'string',
            required: true,
            default: '',
            description: 'CPT or HCPCS procedure code',
            placeholder: '99213',
          },
          {
            displayName: 'Procedure Modifiers',
            name: 'procedureModifiers',
            type: 'string',
            default: '',
            description: 'Comma-separated modifiers (e.g., 25,59)',
            placeholder: '25,59',
          },
          {
            displayName: 'Line Item Charge Amount',
            name: 'lineItemChargeAmount',
            type: 'string',
            required: true,
            default: '',
            description: 'Charge amount for this service line',
            placeholder: '75.00',
          },
          {
            displayName: 'Service Unit Count',
            name: 'serviceUnitCount',
            type: 'string',
            default: '1',
            description: 'Number of units for this service',
          },
          {
            displayName: 'Diagnosis Pointers',
            name: 'diagnosisPointers',
            type: 'string',
            default: '1',
            description: 'Comma-separated pointers to diagnosis codes (e.g., 1,2)',
            placeholder: '1,2',
          },
        ],
      },
    ],
    description: 'List of service lines for the claim',
  },

  // Optional: Dependent
  {
    displayName: 'Add Dependent',
    name: 'addDependent',
    type: 'boolean',
    default: false,
    displayOptions: {
      show: {
        resource: ['professionalClaim'],
        operation: ['submit'],
      },
    },
    description: 'Whether the patient is a dependent of the subscriber',
  },
  {
    displayName: 'Dependent First Name',
    name: 'dependentFirstName',
    type: 'string',
    displayOptions: {
      show: {
        resource: ['professionalClaim'],
        operation: ['submit'],
        addDependent: [true],
      },
    },
    default: '',
    description: "Dependent patient's first name",
  },
  {
    displayName: 'Dependent Last Name',
    name: 'dependentLastName',
    type: 'string',
    displayOptions: {
      show: {
        resource: ['professionalClaim'],
        operation: ['submit'],
        addDependent: [true],
      },
    },
    default: '',
    description: "Dependent patient's last name",
  },
  {
    displayName: 'Dependent Date of Birth',
    name: 'dependentDateOfBirth',
    type: 'string',
    displayOptions: {
      show: {
        resource: ['professionalClaim'],
        operation: ['submit'],
        addDependent: [true],
      },
    },
    default: '',
    description: "Dependent's date of birth (YYYY-MM-DD)",
    placeholder: '2010-05-20',
  },
  {
    displayName: 'Dependent Relationship',
    name: 'dependentRelationship',
    type: 'options',
    displayOptions: {
      show: {
        resource: ['professionalClaim'],
        operation: ['submit'],
        addDependent: [true],
      },
    },
    options: [
      { name: 'Spouse', value: '01' },
      { name: 'Child', value: '19' },
      { name: 'Employee', value: '20' },
      { name: 'Life Partner', value: '53' },
      { name: 'Other', value: 'G8' },
    ],
    default: '19',
    description: "Dependent's relationship to subscriber",
  },

  // Optional: Rendering Provider
  {
    displayName: 'Add Rendering Provider',
    name: 'addRenderingProvider',
    type: 'boolean',
    default: false,
    displayOptions: {
      show: {
        resource: ['professionalClaim'],
        operation: ['submit'],
      },
    },
    description: 'Whether to add a rendering provider different from billing provider',
  },
  {
    displayName: 'Rendering Provider NPI',
    name: 'renderingProviderNpi',
    type: 'string',
    displayOptions: {
      show: {
        resource: ['professionalClaim'],
        operation: ['submit'],
        addRenderingProvider: [true],
      },
    },
    default: '',
    description: '10-digit NPI for rendering provider',
  },
  {
    displayName: 'Rendering Provider First Name',
    name: 'renderingProviderFirstName',
    type: 'string',
    displayOptions: {
      show: {
        resource: ['professionalClaim'],
        operation: ['submit'],
        addRenderingProvider: [true],
      },
    },
    default: '',
    description: "Rendering provider's first name",
  },
  {
    displayName: 'Rendering Provider Last Name',
    name: 'renderingProviderLastName',
    type: 'string',
    displayOptions: {
      show: {
        resource: ['professionalClaim'],
        operation: ['submit'],
        addRenderingProvider: [true],
      },
    },
    default: '',
    description: "Rendering provider's last name",
  },

  // Get PDF operation fields
  {
    displayName: 'Transaction ID',
    name: 'transactionId',
    type: 'string',
    required: true,
    displayOptions: {
      show: {
        resource: ['professionalClaim'],
        operation: ['getPdf'],
      },
    },
    default: '',
    description: 'Transaction ID from a previous claim submission',
  },
];
