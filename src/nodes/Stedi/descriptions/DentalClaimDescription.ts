/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import { INodeProperties } from 'n8n-workflow';

export const dentalClaimOperations: INodeProperties[] = [
  {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    noDataExpression: true,
    displayOptions: {
      show: {
        resource: ['dentalClaim'],
      },
    },
    options: [
      {
        name: 'Submit',
        value: 'submit',
        description: 'Submit a new dental claim (837D)',
        action: 'Submit a dental claim',
      },
    ],
    default: 'submit',
  },
];

export const dentalClaimFields: INodeProperties[] = [
  {
    displayName: 'JSON Payload',
    name: 'jsonPayload',
    type: 'json',
    required: true,
    displayOptions: {
      show: {
        resource: ['dentalClaim'],
        operation: ['submit'],
      },
    },
    default: '{}',
    description: 'Full 837D claim payload in JSON format. See Stedi documentation for schema: https://www.stedi.com/docs/api-reference/healthcare',
    hint: 'Dental claims have tooth-specific fields and ADA procedure codes',
  },
];
