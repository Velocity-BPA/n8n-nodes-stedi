/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import { INodeProperties } from 'n8n-workflow';

export const claimStatusOperations: INodeProperties[] = [
  {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    noDataExpression: true,
    displayOptions: {
      show: {
        resource: ['claimStatus'],
      },
    },
    options: [
      {
        name: 'Check',
        value: 'check',
        description: 'Check real-time claim status (276/277)',
        action: 'Check claim status',
      },
    ],
    default: 'check',
  },
];

export const claimStatusFields: INodeProperties[] = [
  // Trading Partner
  {
    displayName: 'Trading Partner Service ID',
    name: 'tradingPartnerServiceId',
    type: 'string',
    required: true,
    displayOptions: {
      show: {
        resource: ['claimStatus'],
        operation: ['check'],
      },
    },
    default: '',
    description: 'Payer ID from the Stedi Payer Network',
    placeholder: 'BCBSFL',
  },

  // Submitter Information
  {
    displayName: 'Submitter Organization Name',
    name: 'submitterOrganizationName',
    type: 'string',
    required: true,
    displayOptions: {
      show: {
        resource: ['claimStatus'],
        operation: ['check'],
      },
    },
    default: '',
    description: 'Name of the organization submitting the inquiry',
  },
  {
    displayName: 'Submitter Contact Name',
    name: 'submitterContactName',
    type: 'string',
    required: true,
    displayOptions: {
      show: {
        resource: ['claimStatus'],
        operation: ['check'],
      },
    },
    default: '',
    description: 'Name of the contact person',
  },
  {
    displayName: 'Submitter Phone',
    name: 'submitterPhone',
    type: 'string',
    required: true,
    displayOptions: {
      show: {
        resource: ['claimStatus'],
        operation: ['check'],
      },
    },
    default: '',
    description: 'Phone number for inquiries',
    placeholder: '5551234567',
  },

  // Subscriber Information
  {
    displayName: 'Subscriber Member ID',
    name: 'subscriberMemberId',
    type: 'string',
    required: true,
    displayOptions: {
      show: {
        resource: ['claimStatus'],
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
    required: true,
    displayOptions: {
      show: {
        resource: ['claimStatus'],
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
    required: true,
    displayOptions: {
      show: {
        resource: ['claimStatus'],
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
    required: true,
    displayOptions: {
      show: {
        resource: ['claimStatus'],
        operation: ['check'],
      },
    },
    default: '',
    description: "Subscriber's date of birth (YYYY-MM-DD)",
    placeholder: '1980-01-15',
  },

  // Provider Information
  {
    displayName: 'Provider NPI',
    name: 'providerNpi',
    type: 'string',
    required: true,
    displayOptions: {
      show: {
        resource: ['claimStatus'],
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
        resource: ['claimStatus'],
        operation: ['check'],
      },
    },
    default: '',
    description: "Provider's organization name",
  },

  // Claim Status Inquiry
  {
    displayName: 'Patient Control Number',
    name: 'patientControlNumber',
    type: 'string',
    displayOptions: {
      show: {
        resource: ['claimStatus'],
        operation: ['check'],
      },
    },
    default: '',
    description: 'Original claim control number to look up',
    placeholder: 'PAT-001-2024',
  },
  {
    displayName: 'Service Date',
    name: 'serviceDate',
    type: 'string',
    displayOptions: {
      show: {
        resource: ['claimStatus'],
        operation: ['check'],
      },
    },
    default: '',
    description: 'Date of service on the original claim (YYYY-MM-DD)',
    placeholder: '2024-01-15',
  },
  {
    displayName: 'Claim Amount',
    name: 'claimAmount',
    type: 'string',
    displayOptions: {
      show: {
        resource: ['claimStatus'],
        operation: ['check'],
      },
    },
    default: '',
    description: 'Original claim charge amount',
    placeholder: '150.00',
  },
];
