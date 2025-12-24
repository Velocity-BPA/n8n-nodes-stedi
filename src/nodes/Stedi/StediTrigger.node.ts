/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import {
  IWebhookFunctions,
  INodeType,
  INodeTypeDescription,
  IWebhookResponseData,
  IDataObject,
} from 'n8n-workflow';

export class StediTrigger implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'Stedi Trigger',
    name: 'stediTrigger',
    icon: 'file:stedi.svg',
    group: ['trigger'],
    version: 1,
    subtitle: '={{$parameter["transactionType"]}}',
    description: 'Listen for Stedi webhook events for transactions',
    defaults: {
      name: 'Stedi Trigger',
    },
    inputs: [],
    outputs: ['main'],
    webhooks: [
      {
        name: 'default',
        httpMethod: 'POST',
        responseMode: 'onReceived',
        path: 'webhook',
      },
    ],
    properties: [
      {
        displayName: 'Transaction Type Filter',
        name: 'transactionType',
        type: 'options',
        options: [
          { name: 'All Transactions', value: 'all' },
          { name: '837P - Professional Claim', value: '837P' },
          { name: '837I - Institutional Claim', value: '837I' },
          { name: '837D - Dental Claim', value: '837D' },
          { name: '835 - Remittance Advice (ERA)', value: '835' },
          { name: '277CA - Claim Acknowledgment', value: '277CA' },
          { name: '277 - Claim Status Response', value: '277' },
          { name: '271 - Eligibility Response', value: '271' },
          { name: '275 - Attachment', value: '275' },
        ],
        default: 'all',
        description: 'Filter incoming webhooks by transaction type',
      },
      {
        displayName: 'Status Filter',
        name: 'statusFilter',
        type: 'options',
        options: [
          { name: 'All Statuses', value: 'all' },
          { name: 'Completed', value: 'completed' },
          { name: 'Failed', value: 'failed' },
          { name: 'Processing', value: 'processing' },
        ],
        default: 'all',
        description: 'Filter incoming webhooks by status',
      },
    ],
  };

  async webhook(this: IWebhookFunctions): Promise<IWebhookResponseData> {
    const bodyData = this.getBodyData() as IDataObject;
    const transactionTypeFilter = this.getNodeParameter('transactionType') as string;
    const statusFilter = this.getNodeParameter('statusFilter') as string;

    // Get transaction details from webhook payload
    const transactionType = bodyData.type as string || '';
    const status = bodyData.status as string || '';

    // Apply filters
    if (transactionTypeFilter !== 'all' && transactionType !== transactionTypeFilter) {
      // Transaction type doesn't match filter - ignore this webhook
      return {
        workflowData: [],
      };
    }

    if (statusFilter !== 'all' && status !== statusFilter) {
      // Status doesn't match filter - ignore this webhook
      return {
        workflowData: [],
      };
    }

    // Parse and enhance the webhook data
    const enhancedData: IDataObject = {
      ...bodyData,
      receivedAt: new Date().toISOString(),
      webhookType: 'stedi_transaction',
    };

    return {
      workflowData: [
        [
          {
            json: enhancedData,
          },
        ],
      ],
    };
  }
}
