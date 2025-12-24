/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import {
  IAuthenticateGeneric,
  ICredentialTestRequest,
  ICredentialType,
  INodeProperties,
} from 'n8n-workflow';

export class StediApi implements ICredentialType {
  name = 'stediApi';
  displayName = 'Stedi API';
  documentationUrl = 'https://www.stedi.com/docs/api-reference/healthcare';
  
  properties: INodeProperties[] = [
    {
      displayName: 'API Key',
      name: 'apiKey',
      type: 'string',
      typeOptions: {
        password: true,
      },
      default: '',
      required: true,
      description: 'Your Stedi API Key. Get it from the Stedi dashboard at https://www.stedi.com/app/settings/api-keys',
    },
    {
      displayName: 'Environment',
      name: 'environment',
      type: 'options',
      options: [
        {
          name: 'Test (Sandbox)',
          value: 'test',
        },
        {
          name: 'Production',
          value: 'production',
        },
      ],
      default: 'test',
      description: 'Select the Stedi environment. Use Test for development and Production for live transactions.',
    },
  ];

  authenticate: IAuthenticateGeneric = {
    type: 'generic',
    properties: {
      headers: {
        Authorization: '={{$credentials.apiKey}}',
      },
    },
  };

  test: ICredentialTestRequest = {
    request: {
      baseURL: 'https://healthcare.us.stedi.com',
      url: '/2024-04-01/healthcare/transactions',
      qs: {
        limit: 1,
      },
    },
  };
}
