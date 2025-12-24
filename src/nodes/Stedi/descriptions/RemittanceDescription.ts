/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import { INodeProperties } from 'n8n-workflow';

export const remittanceOperations: INodeProperties[] = [
  {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    noDataExpression: true,
    displayOptions: {
      show: {
        resource: ['remittance'],
      },
    },
    options: [
      {
        name: 'Get Report',
        value: 'getReport',
        description: 'Get 835 ERA (Electronic Remittance Advice) report',
        action: 'Get 835 ERA report',
      },
      {
        name: 'List',
        value: 'list',
        description: 'List available 835 ERA reports',
        action: 'List 835 ERA reports',
      },
    ],
    default: 'list',
  },
];

export const remittanceFields: INodeProperties[] = [
  // Get Report fields
  {
    displayName: 'Transaction ID',
    name: 'transactionId',
    type: 'string',
    displayOptions: {
      show: {
        resource: ['remittance'],
        operation: ['getReport'],
      },
    },
    default: '',
    description: 'Specific transaction ID to retrieve',
  },
  {
    displayName: 'Start Date',
    name: 'startDate',
    type: 'string',
    displayOptions: {
      show: {
        resource: ['remittance'],
        operation: ['getReport'],
      },
    },
    default: '',
    description: 'Start date for date range filter (YYYY-MM-DD)',
    placeholder: '2024-01-01',
  },
  {
    displayName: 'End Date',
    name: 'endDate',
    type: 'string',
    displayOptions: {
      show: {
        resource: ['remittance'],
        operation: ['getReport'],
      },
    },
    default: '',
    description: 'End date for date range filter (YYYY-MM-DD)',
    placeholder: '2024-01-31',
  },

  // List fields
  {
    displayName: 'Return All',
    name: 'returnAll',
    type: 'boolean',
    displayOptions: {
      show: {
        resource: ['remittance'],
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
        resource: ['remittance'],
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
        resource: ['remittance'],
        operation: ['list'],
      },
    },
    options: [
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
      {
        displayName: 'Status',
        name: 'status',
        type: 'options',
        options: [
          { name: 'All', value: '' },
          { name: 'Completed', value: 'completed' },
          { name: 'Processing', value: 'processing' },
          { name: 'Failed', value: 'failed' },
        ],
        default: '',
        description: 'Filter by status',
      },
    ],
  },
];
