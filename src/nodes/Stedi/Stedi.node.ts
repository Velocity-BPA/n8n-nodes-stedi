/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import {
  IExecuteFunctions,
  INodeExecutionData,
  INodeType,
  INodeTypeDescription,
  IDataObject,
  NodeOperationError,
} from 'n8n-workflow';

import {
  stediApiRequest,
  stediApiRequestAllItems,
  buildProfessionalClaimPayload,
  buildEligibilityPayload,
  buildClaimStatusPayload,
} from './GenericFunctions';

import {
  professionalClaimOperations,
  professionalClaimFields,
  institutionalClaimOperations,
  institutionalClaimFields,
  dentalClaimOperations,
  dentalClaimFields,
  claimStatusOperations,
  claimStatusFields,
  claimAcknowledgmentOperations,
  claimAcknowledgmentFields,
  eligibilityOperations,
  eligibilityFields,
  remittanceOperations,
  remittanceFields,
  transactionOperations,
  transactionFields,
  attachmentOperations,
  attachmentFields,
} from './descriptions';

export class Stedi implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'Stedi',
    name: 'stedi',
    icon: 'file:stedi.svg',
    group: ['transform'],
    version: 1,
    subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
    description: 'Interact with Stedi healthcare clearinghouse for claims, eligibility, and remittance',
    defaults: {
      name: 'Stedi',
    },
    inputs: ['main'],
    outputs: ['main'],
    credentials: [
      {
        name: 'stediApi',
        required: true,
      },
    ],
    properties: [
      {
        displayName: 'Resource',
        name: 'resource',
        type: 'options',
        noDataExpression: true,
        options: [
          {
            name: 'Professional Claim (837P)',
            value: 'professionalClaim',
            description: 'Submit and manage professional claims (CMS-1500)',
          },
          {
            name: 'Institutional Claim (837I)',
            value: 'institutionalClaim',
            description: 'Submit institutional claims (UB-04)',
          },
          {
            name: 'Dental Claim (837D)',
            value: 'dentalClaim',
            description: 'Submit dental claims',
          },
          {
            name: 'Claim Status (276/277)',
            value: 'claimStatus',
            description: 'Check real-time claim status',
          },
          {
            name: 'Claim Acknowledgment (277CA)',
            value: 'claimAcknowledgment',
            description: 'Retrieve claim acknowledgments',
          },
          {
            name: 'Eligibility (270/271)',
            value: 'eligibility',
            description: 'Verify patient eligibility and benefits',
          },
          {
            name: 'Remittance (835 ERA)',
            value: 'remittance',
            description: 'Retrieve Electronic Remittance Advice',
          },
          {
            name: 'Transaction',
            value: 'transaction',
            description: 'Manage and query transaction history',
          },
          {
            name: 'Attachment (275)',
            value: 'attachment',
            description: 'Submit claim attachments',
          },
        ],
        default: 'professionalClaim',
      },
      // Operations and fields for each resource
      ...professionalClaimOperations,
      ...professionalClaimFields,
      ...institutionalClaimOperations,
      ...institutionalClaimFields,
      ...dentalClaimOperations,
      ...dentalClaimFields,
      ...claimStatusOperations,
      ...claimStatusFields,
      ...claimAcknowledgmentOperations,
      ...claimAcknowledgmentFields,
      ...eligibilityOperations,
      ...eligibilityFields,
      ...remittanceOperations,
      ...remittanceFields,
      ...transactionOperations,
      ...transactionFields,
      ...attachmentOperations,
      ...attachmentFields,
    ],
  };

  async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    const items = this.getInputData();
    const returnData: INodeExecutionData[] = [];
    const resource = this.getNodeParameter('resource', 0) as string;
    const operation = this.getNodeParameter('operation', 0) as string;

    for (let i = 0; i < items.length; i++) {
      try {
        let responseData: IDataObject | IDataObject[] = {};

        // Professional Claim operations
        if (resource === 'professionalClaim') {
          if (operation === 'submit') {
            const payload = buildProfessionalClaimPayload.call(this, i);
            responseData = await stediApiRequest.call(this, {
              method: 'POST',
              endpoint: '/change/medicalnetwork/professionalclaims/v3/submission',
              body: payload,
            });
          } else if (operation === 'getPdf') {
            const transactionId = this.getNodeParameter('transactionId', i) as string;
            responseData = await stediApiRequest.call(this, {
              method: 'GET',
              endpoint: `/change/medicalnetwork/professionalclaims/v3/${transactionId}/cms-1500`,
            });
          }
        }

        // Institutional Claim operations
        else if (resource === 'institutionalClaim') {
          if (operation === 'submit') {
            const jsonPayload = this.getNodeParameter('jsonPayload', i) as string;
            let payload: IDataObject;
            try {
              payload = JSON.parse(jsonPayload) as IDataObject;
            } catch {
              throw new NodeOperationError(
                this.getNode(),
                'Invalid JSON payload for institutional claim',
                { itemIndex: i },
              );
            }
            responseData = await stediApiRequest.call(this, {
              method: 'POST',
              endpoint: '/change/medicalnetwork/institutionalclaims/v1/submission',
              body: payload,
            });
          }
        }

        // Dental Claim operations
        else if (resource === 'dentalClaim') {
          if (operation === 'submit') {
            const jsonPayload = this.getNodeParameter('jsonPayload', i) as string;
            let payload: IDataObject;
            try {
              payload = JSON.parse(jsonPayload) as IDataObject;
            } catch {
              throw new NodeOperationError(
                this.getNode(),
                'Invalid JSON payload for dental claim',
                { itemIndex: i },
              );
            }
            responseData = await stediApiRequest.call(this, {
              method: 'POST',
              endpoint: '/change/medicalnetwork/dentalclaims/v1/submission',
              body: payload,
            });
          }
        }

        // Claim Status operations
        else if (resource === 'claimStatus') {
          if (operation === 'check') {
            const payload = buildClaimStatusPayload.call(this, i);
            responseData = await stediApiRequest.call(this, {
              method: 'POST',
              endpoint: '/change/medicalnetwork/claimstatus/v2',
              body: payload,
            });
          }
        }

        // Claim Acknowledgment operations
        else if (resource === 'claimAcknowledgment') {
          if (operation === 'getReport') {
            const qs: IDataObject = {};
            const transactionId = this.getNodeParameter('transactionId', i, '') as string;
            const startDate = this.getNodeParameter('startDate', i, '') as string;
            const endDate = this.getNodeParameter('endDate', i, '') as string;
            const status = this.getNodeParameter('status', i, '') as string;

            if (transactionId) qs.transactionId = transactionId;
            if (startDate) qs.startDate = startDate.replace(/-/g, '');
            if (endDate) qs.endDate = endDate.replace(/-/g, '');
            if (status) qs.status = status;

            responseData = await stediApiRequest.call(this, {
              method: 'GET',
              endpoint: '/healthcare/reports/277ca',
              qs,
            });
          }
        }

        // Eligibility operations
        else if (resource === 'eligibility') {
          if (operation === 'check') {
            const payload = buildEligibilityPayload.call(this, i);
            responseData = await stediApiRequest.call(this, {
              method: 'POST',
              endpoint: '/change/medicalnetwork/eligibility/v3',
              body: payload,
            });
          }
        }

        // Remittance operations
        else if (resource === 'remittance') {
          if (operation === 'getReport') {
            const qs: IDataObject = {};
            const transactionId = this.getNodeParameter('transactionId', i, '') as string;
            const startDate = this.getNodeParameter('startDate', i, '') as string;
            const endDate = this.getNodeParameter('endDate', i, '') as string;

            if (transactionId) qs.transactionId = transactionId;
            if (startDate) qs.startDate = startDate.replace(/-/g, '');
            if (endDate) qs.endDate = endDate.replace(/-/g, '');

            responseData = await stediApiRequest.call(this, {
              method: 'GET',
              endpoint: '/healthcare/reports/835',
              qs,
            });
          } else if (operation === 'list') {
            const returnAll = this.getNodeParameter('returnAll', i) as boolean;
            const filters = this.getNodeParameter('filters', i, {}) as IDataObject;
            const qs: IDataObject = {};

            if (filters.startDate) qs.startDate = (filters.startDate as string).replace(/-/g, '');
            if (filters.endDate) qs.endDate = (filters.endDate as string).replace(/-/g, '');
            if (filters.status) qs.status = filters.status;

            if (returnAll) {
              responseData = await stediApiRequestAllItems.call(this, {
                method: 'GET',
                endpoint: '/healthcare/reports/835/list',
                qs,
              });
            } else {
              const limit = this.getNodeParameter('limit', i) as number;
              qs.limit = limit;
              responseData = await stediApiRequest.call(this, {
                method: 'GET',
                endpoint: '/healthcare/reports/835/list',
                qs,
              });
            }
          }
        }

        // Transaction operations
        else if (resource === 'transaction') {
          if (operation === 'get') {
            const transactionId = this.getNodeParameter('transactionId', i) as string;
            responseData = await stediApiRequest.call(this, {
              method: 'GET',
              endpoint: `/healthcare/transactions/${transactionId}`,
            });
          } else if (operation === 'getInput') {
            const transactionId = this.getNodeParameter('transactionId', i) as string;
            responseData = await stediApiRequest.call(this, {
              method: 'GET',
              endpoint: `/healthcare/transactions/${transactionId}/input`,
            });
          } else if (operation === 'getOutput') {
            const transactionId = this.getNodeParameter('transactionId', i) as string;
            responseData = await stediApiRequest.call(this, {
              method: 'GET',
              endpoint: `/healthcare/transactions/${transactionId}/output`,
            });
          } else if (operation === 'list') {
            const returnAll = this.getNodeParameter('returnAll', i) as boolean;
            const filters = this.getNodeParameter('filters', i, {}) as IDataObject;
            const qs: IDataObject = {};

            if (filters.type) qs.type = filters.type;
            if (filters.status) qs.status = filters.status;
            if (filters.startDate) qs.startDate = (filters.startDate as string).replace(/-/g, '');
            if (filters.endDate) qs.endDate = (filters.endDate as string).replace(/-/g, '');

            if (returnAll) {
              responseData = await stediApiRequestAllItems.call(this, {
                method: 'GET',
                endpoint: '/healthcare/transactions',
                qs,
              });
            } else {
              const limit = this.getNodeParameter('limit', i) as number;
              qs.limit = limit;
              responseData = await stediApiRequest.call(this, {
                method: 'GET',
                endpoint: '/healthcare/transactions',
                qs,
              });
            }
          } else if (operation === 'poll') {
            const pollOptions = this.getNodeParameter('pollOptions', i, {}) as IDataObject;
            const qs: IDataObject = {};

            if (pollOptions.type) qs.type = pollOptions.type;
            if (pollOptions.since) qs.since = pollOptions.since;
            if (pollOptions.limit) qs.limit = pollOptions.limit;

            responseData = await stediApiRequest.call(this, {
              method: 'GET',
              endpoint: '/healthcare/transactions/poll',
              qs,
            });
          }
        }

        // Attachment operations
        else if (resource === 'attachment') {
          if (operation === 'create') {
            const jsonPayload = this.getNodeParameter('jsonPayload', i) as string;
            let payload: IDataObject;
            try {
              payload = JSON.parse(jsonPayload) as IDataObject;
            } catch {
              throw new NodeOperationError(
                this.getNode(),
                'Invalid JSON payload for attachment',
                { itemIndex: i },
              );
            }
            responseData = await stediApiRequest.call(this, {
              method: 'POST',
              endpoint: '/change/medicalnetwork/attachments/v1',
              body: payload,
            });
          } else if (operation === 'uploadFile') {
            const binaryPropertyName = this.getNodeParameter('binaryPropertyName', i) as string;
            const contentType = this.getNodeParameter('contentType', i) as string;
            const description = this.getNodeParameter('attachmentDescription', i, '') as string;

            const binaryData = this.helpers.assertBinaryData(i, binaryPropertyName);
            const buffer = await this.helpers.getBinaryDataBuffer(i, binaryPropertyName);

            // Upload the file
            const credentials = await this.getCredentials('stediApi');
            const uploadResponse = await this.helpers.request({
              method: 'POST',
              uri: 'https://healthcare.us.stedi.com/2024-04-01/healthcare/attachments/upload',
              headers: {
                Authorization: credentials.apiKey as string,
                'Content-Type': contentType,
                ...(description && { 'X-Attachment-Description': description }),
              },
              body: buffer,
              encoding: null,
              json: false,
            });

            responseData = JSON.parse(uploadResponse as string) as IDataObject;
          }
        }

        // Add response to return data
        if (Array.isArray(responseData)) {
          returnData.push(...responseData.map((data) => ({ json: data })));
        } else {
          returnData.push({ json: responseData });
        }
      } catch (error) {
        if (this.continueOnFail()) {
          returnData.push({
            json: {
              error: error instanceof Error ? error.message : 'Unknown error',
            },
            pairedItem: { item: i },
          });
          continue;
        }
        throw error;
      }
    }

    return [returnData];
  }
}
