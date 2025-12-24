/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import { INodeProperties } from 'n8n-workflow';

export const eligibilityOperations: INodeProperties[] = [
  {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    noDataExpression: true,
    displayOptions: {
      show: {
        resource: ['eligibility'],
      },
    },
    options: [
      {
        name: 'Check',
        value: 'check',
        description: 'Check patient eligibility and benefits (270/271)',
        action: 'Check patient eligibility',
      },
    ],
    default: 'check',
  },
];

export const eligibilityFields: INodeProperties[] = [
  // Trading Partner
  {
    displayName: 'Trading Partner Service ID',
    name: 'tradingPartnerServiceId',
    type: 'string',
    required: true,
    displayOptions: {
      show: {
        resource: ['eligibility'],
        operation: ['check'],
      },
    },
    default: '',
    description: 'Payer ID from the Stedi Payer Network',
    placeholder: 'BCBSFL',
  },

  // Provider Information
  {
    displayName: 'Provider NPI',
    name: 'providerNpi',
    type: 'string',
    required: true,
    displayOptions: {
      show: {
        resource: ['eligibility'],
        operation: ['check'],
      },
    },
    default: '',
    description: '10-digit National Provider Identifier',
    placeholder: '1234567890',
  },
  {
    displayName: 'Provider Organization Name',
    name: 'providerOrganizationName',
    type: 'string',
    displayOptions: {
      show: {
        resource: ['eligibility'],
        operation: ['check'],
      },
    },
    default: '',
    description: "Provider's organization name (if organization)",
  },
  {
    displayName: 'Provider First Name',
    name: 'providerFirstName',
    type: 'string',
    displayOptions: {
      show: {
        resource: ['eligibility'],
        operation: ['check'],
      },
    },
    default: '',
    description: "Provider's first name (if individual)",
  },
  {
    displayName: 'Provider Last Name',
    name: 'providerLastName',
    type: 'string',
    displayOptions: {
      show: {
        resource: ['eligibility'],
        operation: ['check'],
      },
    },
    default: '',
    description: "Provider's last name (if individual)",
  },

  // Subscriber Information
  {
    displayName: 'Subscriber Member ID',
    name: 'subscriberMemberId',
    type: 'string',
    required: true,
    displayOptions: {
      show: {
        resource: ['eligibility'],
        operation: ['check'],
      },
    },
    default: '',
    description: "Patient's member ID from insurance card",
  },
  {
    displayName: 'Subscriber First Name',
    name: 'subscriberFirstName',
    type: 'string',
    displayOptions: {
      show: {
        resource: ['eligibility'],
        operation: ['check'],
      },
    },
    default: '',
    description: "Subscriber's first name",
  },
  {
    displayName: 'Subscriber Last Name',
    name: 'subscriberLastName',
    type: 'string',
    displayOptions: {
      show: {
        resource: ['eligibility'],
        operation: ['check'],
      },
    },
    default: '',
    description: "Subscriber's last name",
  },
  {
    displayName: 'Subscriber Date of Birth',
    name: 'subscriberDateOfBirth',
    type: 'string',
    displayOptions: {
      show: {
        resource: ['eligibility'],
        operation: ['check'],
      },
    },
    default: '',
    description: "Subscriber's date of birth (YYYY-MM-DD)",
    placeholder: '1980-01-15',
  },

  // Service Type Codes
  {
    displayName: 'Service Type Codes',
    name: 'serviceTypeCodes',
    type: 'multiOptions',
    required: true,
    displayOptions: {
      show: {
        resource: ['eligibility'],
        operation: ['check'],
      },
    },
    options: [
      { name: '30 - Health Benefit Plan Coverage', value: '30' },
      { name: '1 - Medical Care', value: '1' },
      { name: '2 - Surgical', value: '2' },
      { name: '3 - Consultation', value: '3' },
      { name: '4 - Diagnostic X-Ray', value: '4' },
      { name: '5 - Diagnostic Lab', value: '5' },
      { name: '33 - Chiropractic', value: '33' },
      { name: '35 - Dental Care', value: '35' },
      { name: '47 - Hospital', value: '47' },
      { name: '48 - Hospital - Inpatient', value: '48' },
      { name: '50 - Hospital - Outpatient', value: '50' },
      { name: '51 - Hospital - Emergency Accident', value: '51' },
      { name: '52 - Hospital - Emergency Medical', value: '52' },
      { name: '86 - Emergency Services', value: '86' },
      { name: '88 - Pharmacy', value: '88' },
      { name: '98 - Professional (Physician) - Visit - Office', value: '98' },
      { name: 'A4 - Psychiatric', value: 'A4' },
      { name: 'A6 - Psychotherapy', value: 'A6' },
      { name: 'AD - Occupational Therapy', value: 'AD' },
      { name: 'AE - Physical Medicine', value: 'AE' },
      { name: 'AF - Speech Therapy', value: 'AF' },
      { name: 'AL - Vision (Optometry)', value: 'AL' },
      { name: 'MH - Mental Health', value: 'MH' },
      { name: 'PT - Physical Therapy', value: 'PT' },
      { name: 'UC - Urgent Care', value: 'UC' },
    ],
    default: ['30'],
    description: 'Service types to check eligibility for. Use code 30 for general coverage inquiry.',
  },

  // Optional: Dependent
  {
    displayName: 'Add Dependent',
    name: 'addDependent',
    type: 'boolean',
    default: false,
    displayOptions: {
      show: {
        resource: ['eligibility'],
        operation: ['check'],
      },
    },
    description: 'Whether to check eligibility for a dependent',
  },
  {
    displayName: 'Dependent First Name',
    name: 'dependentFirstName',
    type: 'string',
    displayOptions: {
      show: {
        resource: ['eligibility'],
        operation: ['check'],
        addDependent: [true],
      },
    },
    default: '',
    description: "Dependent's first name",
  },
  {
    displayName: 'Dependent Last Name',
    name: 'dependentLastName',
    type: 'string',
    displayOptions: {
      show: {
        resource: ['eligibility'],
        operation: ['check'],
        addDependent: [true],
      },
    },
    default: '',
    description: "Dependent's last name",
  },
  {
    displayName: 'Dependent Date of Birth',
    name: 'dependentDateOfBirth',
    type: 'string',
    displayOptions: {
      show: {
        resource: ['eligibility'],
        operation: ['check'],
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
        resource: ['eligibility'],
        operation: ['check'],
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

  // Optional: Date Range
  {
    displayName: 'Add Date Range',
    name: 'addDateRange',
    type: 'boolean',
    default: false,
    displayOptions: {
      show: {
        resource: ['eligibility'],
        operation: ['check'],
      },
    },
    description: 'Whether to specify a date range for eligibility check',
  },
  {
    displayName: 'Date Range Start',
    name: 'dateRangeStart',
    type: 'string',
    displayOptions: {
      show: {
        resource: ['eligibility'],
        operation: ['check'],
        addDateRange: [true],
      },
    },
    default: '',
    description: 'Start date for eligibility check (YYYY-MM-DD)',
    placeholder: '2024-01-01',
  },
  {
    displayName: 'Date Range End',
    name: 'dateRangeEnd',
    type: 'string',
    displayOptions: {
      show: {
        resource: ['eligibility'],
        operation: ['check'],
        addDateRange: [true],
      },
    },
    default: '',
    description: 'End date for eligibility check (YYYY-MM-DD)',
    placeholder: '2024-12-31',
  },
];
