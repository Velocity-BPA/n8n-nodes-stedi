/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import { INodeProperties } from 'n8n-workflow';

export const claimAcknowledgmentOperations: INodeProperties[] = [
  {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    noDataExpression: true,
    displayOptions: {
      show: {
        resource: ['claimAcknowledgment'],
      },
    },
    options: [
      {
        name: 'Get Report',
        value: 'getReport',
        description: 'Get 277CA claim acknowledgment report',
        action: 'Get 277CA report',
      },
    ],
    default: 'getReport',
  },
];

export const claimAcknowledgmentFields: INodeProperties[] = [
  {
    displayName: 'Transaction ID',
    name: 'transactionId',
    type: 'string',
    displayOptions: {
      show: {
        resource: ['claimAcknowledgment'],
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
        resource: ['claimAcknowledgment'],
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
        resource: ['claimAcknowledgment'],
        operation: ['getReport'],
      },
    },
    default: '',
    description: 'End date for date range filter (YYYY-MM-DD)',
    placeholder: '2024-01-31',
  },
  {
    displayName: 'Status Filter',
    name: 'status',
    type: 'options',
    displayOptions: {
      show: {
        resource: ['claimAcknowledgment'],
        operation: ['getReport'],
      },
    },
    options: [
      { name: 'All', value: '' },
      { name: 'Accepted', value: 'accepted' },
      { name: 'Rejected', value: 'rejected' },
      { name: 'Pending', value: 'pending' },
    ],
    default: '',
    description: 'Filter by acknowledgment status',
  },
];
