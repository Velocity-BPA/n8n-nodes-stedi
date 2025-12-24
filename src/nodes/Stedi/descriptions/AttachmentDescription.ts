/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import { INodeProperties } from 'n8n-workflow';

export const attachmentOperations: INodeProperties[] = [
  {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    noDataExpression: true,
    displayOptions: {
      show: {
        resource: ['attachment'],
      },
    },
    options: [
      {
        name: 'Create',
        value: 'create',
        description: 'Create an attachment submission (275)',
        action: 'Create attachment submission',
      },
      {
        name: 'Upload File',
        value: 'uploadFile',
        description: 'Upload an attachment file',
        action: 'Upload attachment file',
      },
    ],
    default: 'create',
  },
];

export const attachmentFields: INodeProperties[] = [
  // Create attachment submission
  {
    displayName: 'JSON Payload',
    name: 'jsonPayload',
    type: 'json',
    required: true,
    displayOptions: {
      show: {
        resource: ['attachment'],
        operation: ['create'],
      },
    },
    default: '{}',
    description: 'Full 275 attachment payload in JSON format. See Stedi documentation.',
  },

  // Upload file
  {
    displayName: 'Binary Property',
    name: 'binaryPropertyName',
    type: 'string',
    required: true,
    displayOptions: {
      show: {
        resource: ['attachment'],
        operation: ['uploadFile'],
      },
    },
    default: 'data',
    description: 'Name of the binary property containing the file to upload',
  },
  {
    displayName: 'Content Type',
    name: 'contentType',
    type: 'options',
    required: true,
    displayOptions: {
      show: {
        resource: ['attachment'],
        operation: ['uploadFile'],
      },
    },
    options: [
      { name: 'PDF', value: 'application/pdf' },
      { name: 'JPEG Image', value: 'image/jpeg' },
      { name: 'PNG Image', value: 'image/png' },
      { name: 'TIFF Image', value: 'image/tiff' },
    ],
    default: 'application/pdf',
    description: 'MIME type of the file being uploaded',
  },
  {
    displayName: 'Attachment Description',
    name: 'attachmentDescription',
    type: 'string',
    displayOptions: {
      show: {
        resource: ['attachment'],
        operation: ['uploadFile'],
      },
    },
    default: '',
    description: 'Description of the attachment',
  },
];
