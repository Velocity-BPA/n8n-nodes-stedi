/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import { INodeProperties } from 'n8n-workflow';

export const institutionalClaimOperations: INodeProperties[] = [
  {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    noDataExpression: true,
    displayOptions: {
      show: {
        resource: ['institutionalClaim'],
      },
    },
    options: [
      {
        name: 'Submit',
        value: 'submit',
        description: 'Submit a new institutional claim (837I)',
        action: 'Submit an institutional claim',
      },
    ],
    default: 'submit',
  },
];

export const institutionalClaimFields: INodeProperties[] = [
  {
    displayName: 'JSON Payload',
    name: 'jsonPayload',
    type: 'json',
    required: true,
    displayOptions: {
      show: {
        resource: ['institutionalClaim'],
        operation: ['submit'],
      },
    },
    default: '{}',
    description: 'Full 837I claim payload in JSON format. See Stedi documentation for schema: https://www.stedi.com/docs/api-reference/healthcare',
    hint: 'Institutional claims (UB-04) have additional fields like revenue codes, occurrence codes, and condition codes',
  },
];
