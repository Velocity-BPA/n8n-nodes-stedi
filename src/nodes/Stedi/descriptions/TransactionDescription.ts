/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import { INodeProperties } from 'n8n-workflow';

export const transactionOperations: INodeProperties[] = [
  {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    noDataExpression: true,
    displayOptions: {
      show: {
        resource: ['transaction'],
      },
    },
    options: [
      {
        name: 'Get',
        value: 'get',
        description: 'Get a specific transaction by ID',
        action: 'Get a transaction',
      },
      {
        name: 'Get Input',
        value: 'getInput',
        description: 'Get the original request for a transaction',
        action: 'Get transaction input',
      },
      {
        name: 'Get Output',
        value: 'getOutput',
        description: 'Get the response for a transaction',
        action: 'Get transaction output',
      },
      {
        name: 'List',
        value: 'list',
        description: 'List all transactions',
        action: 'List transactions',
      },
      {
        name: 'Poll',
        value: 'poll',
        description: 'Poll for new transactions',
        action: 'Poll for transactions',
      },
    ],
    default: 'list',
  },
];

export const transactionFields: INodeProperties[] = [
  // Get, Get Input, Get Output fields
  {
    displayName: 'Transaction ID',
    name: 'transactionId',
    type: 'string',
    required: true,
    displayOptions: {
      show: {
        resource: ['transaction'],
        operation: ['get', 'getInput', 'getOutput'],
      },
    },
    default: '',
    description: 'The transaction ID to retrieve',
  },

  // List fields
  {
    displayName: 'Return All',
    name: 'returnAll',
    type: 'boolean',
    displayOptions: {
      show: {
        resource: ['transaction'],
        operation: ['list'],
      },
    },
    default: false,
    description: 'Whether to return all results or only up to a given limit',
  },
  {
    displayName: 'Limit',
    name: 'limit',
    type: 'number',
    displayOptions: {
      show: {
        resource: ['transaction'],
        operation: ['list'],
        returnAll: [false],
      },
    },
    typeOptions: {
      minValue: 1,
      maxValue: 100,
    },
    default: 50,
    description: 'Max number of results to return',
  },
  {
    displayName: 'Filters',
    name: 'filters',
    type: 'collection',
    placeholder: 'Add Filter',
    default: {},
    displayOptions: {
      show: {
        resource: ['transaction'],
        operation: ['list'],
      },
    },
    options: [
      {
        displayName: 'Transaction Type',
        name: 'type',
        type: 'options',
        options: [
          { name: 'All', value: '' },
          { name: '837P - Professional Claim', value: '837P' },
          { name: '837I - Institutional Claim', value: '837I' },
          { name: '837D - Dental Claim', value: '837D' },
          { name: '835 - Remittance Advice', value: '835' },
          { name: '277CA - Claim Acknowledgment', value: '277CA' },
          { name: '276 - Claim Status Request', value: '276' },
          { name: '277 - Claim Status Response', value: '277' },
          { name: '270 - Eligibility Request', value: '270' },
          { name: '271 - Eligibility Response', value: '271' },
          { name: '275 - Attachment', value: '275' },
        ],
        default: '',
        description: 'Filter by transaction type',
      },
      {
        displayName: 'Status',
        name: 'status',
        type: 'options',
        options: [
          { name: 'All', value: '' },
          { name: 'Completed', value: 'completed' },
          { name: 'Processing', value: 'processing' },
          { name: 'Failed', value: 'failed' },
          { name: 'Pending', value: 'pending' },
        ],
        default: '',
        description: 'Filter by status',
      },
      {
        displayName: 'Start Date',
        name: 'startDate',
        type: 'string',
        default: '',
        description: 'Filter by start date (YYYY-MM-DD)',
      },
      {
        displayName: 'End Date',
        name: 'endDate',
        type: 'string',
        default: '',
        description: 'Filter by end date (YYYY-MM-DD)',
      },
    ],
  },

  // Poll fields
  {
    displayName: 'Poll Options',
    name: 'pollOptions',
    type: 'collection',
    placeholder: 'Add Option',
    default: {},
    displayOptions: {
      show: {
        resource: ['transaction'],
        operation: ['poll'],
      },
    },
    options: [
      {
        displayName: 'Transaction Type',
        name: 'type',
        type: 'options',
        options: [
          { name: 'All', value: '' },
          { name: '835 - Remittance Advice', value: '835' },
          { name: '277CA - Claim Acknowledgment', value: '277CA' },
          { name: '277 - Claim Status Response', value: '277' },
          { name: '271 - Eligibility Response', value: '271' },
        ],
        default: '',
        description: 'Filter by transaction type',
      },
      {
        displayName: 'Since',
        name: 'since',
        type: 'string',
        default: '',
        description: 'Poll for transactions since this datetime (ISO 8601)',
      },
      {
        displayName: 'Limit',
        name: 'limit',
        type: 'number',
        typeOptions: {
          minValue: 1,
          maxValue: 100,
        },
        default: 50,
        description: 'Max number of results to return',
      },
    ],
  },
];
