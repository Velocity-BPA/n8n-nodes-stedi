/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import {
  IExecuteFunctions,
  IHookFunctions,
  ILoadOptionsFunctions,
  IDataObject,
  IHttpRequestMethods,
  NodeApiError,
  NodeOperationError,
  JsonObject,
} from 'n8n-workflow';

import { StediError } from './types';

const BASE_URL = 'https://healthcare.us.stedi.com';
const API_VERSION = '2024-04-01';

export interface IStediApiRequestOptions {
  method: IHttpRequestMethods;
  endpoint: string;
  body?: IDataObject;
  qs?: IDataObject;
  headers?: IDataObject;
}

/**
 * Make an API request to Stedi
 */
export async function stediApiRequest(
  this: IExecuteFunctions | ILoadOptionsFunctions | IHookFunctions,
  options: IStediApiRequestOptions,
): Promise<IDataObject> {
  const credentials = await this.getCredentials('stediApi');

  const { method, endpoint, body, qs, headers } = options;

  const requestOptions = {
    method,
    body,
    qs,
    uri: `${BASE_URL}/${API_VERSION}${endpoint}`,
    headers: {
      Authorization: credentials.apiKey as string,
      'Content-Type': 'application/json',
      Accept: 'application/json',
      ...headers,
    },
    json: true,
  };

  try {
    const response = await this.helpers.request(requestOptions);
    return response as IDataObject;
  } catch (error: unknown) {
    // Handle Stedi-specific errors
    if (error && typeof error === 'object' && 'response' in error) {
      const errorResponse = error as { response?: { body?: StediError } };
      if (errorResponse.response?.body?.error) {
        const stediError = errorResponse.response.body.error;
        throw new NodeApiError(this.getNode(), error as JsonObject, {
          message: stediError.message,
          description: `Stedi API Error: ${stediError.code}`,
        });
      }
    }
    throw new NodeApiError(this.getNode(), error as JsonObject);
  }
}

/**
 * Make an API request with pagination support
 */
export async function stediApiRequestAllItems(
  this: IExecuteFunctions | ILoadOptionsFunctions,
  options: IStediApiRequestOptions,
  propertyName = 'items',
): Promise<IDataObject[]> {
  const returnData: IDataObject[] = [];
  let responseData: IDataObject;
  let nextPageToken: string | undefined;

  do {
    const paginatedOptions = {
      ...options,
      qs: {
        ...options.qs,
        ...(nextPageToken && { page_token: nextPageToken }),
      },
    };

    responseData = await stediApiRequest.call(this, paginatedOptions);

    if (responseData[propertyName]) {
      const items = responseData[propertyName] as IDataObject[];
      returnData.push(...items);
    }

    nextPageToken = responseData.nextPageToken as string | undefined;
  } while (nextPageToken);

  return returnData;
}

/**
 * Build a professional claim payload from node parameters
 */
export function buildProfessionalClaimPayload(
  this: IExecuteFunctions,
  itemIndex: number,
): IDataObject {
  const controlNumber = this.getNodeParameter('controlNumber', itemIndex) as string;
  const tradingPartnerServiceId = this.getNodeParameter('tradingPartnerServiceId', itemIndex) as string;

  // Submitter
  const submitterOrgName = this.getNodeParameter('submitterOrganizationName', itemIndex) as string;
  const submitterContactName = this.getNodeParameter('submitterContactName', itemIndex) as string;
  const submitterPhone = this.getNodeParameter('submitterPhone', itemIndex) as string;

  // Receiver
  const receiverOrgName = this.getNodeParameter('receiverOrganizationName', itemIndex) as string;

  // Subscriber
  const subscriberMemberId = this.getNodeParameter('subscriberMemberId', itemIndex) as string;
  const subscriberFirstName = this.getNodeParameter('subscriberFirstName', itemIndex) as string;
  const subscriberLastName = this.getNodeParameter('subscriberLastName', itemIndex) as string;
  const subscriberDob = this.getNodeParameter('subscriberDateOfBirth', itemIndex) as string;
  const subscriberGender = this.getNodeParameter('subscriberGender', itemIndex) as string;
  const subscriberAddress1 = this.getNodeParameter('subscriberAddress1', itemIndex) as string;
  const subscriberCity = this.getNodeParameter('subscriberCity', itemIndex) as string;
  const subscriberState = this.getNodeParameter('subscriberState', itemIndex) as string;
  const subscriberPostalCode = this.getNodeParameter('subscriberPostalCode', itemIndex) as string;

  // Billing Provider
  const billingProviderNpi = this.getNodeParameter('billingProviderNpi', itemIndex) as string;
  const billingProviderTaxonomy = this.getNodeParameter('billingProviderTaxonomy', itemIndex) as string;
  const billingProviderOrgName = this.getNodeParameter('billingProviderOrganizationName', itemIndex) as string;
  const billingProviderAddress1 = this.getNodeParameter('billingProviderAddress1', itemIndex) as string;
  const billingProviderCity = this.getNodeParameter('billingProviderCity', itemIndex) as string;
  const billingProviderState = this.getNodeParameter('billingProviderState', itemIndex) as string;
  const billingProviderPostalCode = this.getNodeParameter('billingProviderPostalCode', itemIndex) as string;
  const billingProviderTaxId = this.getNodeParameter('billingProviderTaxId', itemIndex) as string;

  // Claim Information
  const patientControlNumber = this.getNodeParameter('patientControlNumber', itemIndex) as string;
  const claimChargeAmount = this.getNodeParameter('claimChargeAmount', itemIndex) as string;
  const placeOfServiceCode = this.getNodeParameter('placeOfServiceCode', itemIndex) as string;
  const diagnosisCodes = this.getNodeParameter('diagnosisCodes.codes', itemIndex, []) as IDataObject[];
  const serviceLines = this.getNodeParameter('serviceLines.lines', itemIndex, []) as IDataObject[];

  // Build the claim payload
  const payload: IDataObject = {
    controlNumber,
    tradingPartnerServiceId,
    submitter: {
      organizationName: submitterOrgName,
      contactInformation: {
        name: submitterContactName,
        phoneNumber: submitterPhone,
      },
    },
    receiver: {
      organizationName: receiverOrgName,
    },
    subscriber: {
      memberId: subscriberMemberId,
      firstName: subscriberFirstName,
      lastName: subscriberLastName,
      dateOfBirth: subscriberDob.replace(/-/g, ''),
      gender: subscriberGender,
      address: {
        address1: subscriberAddress1,
        city: subscriberCity,
        state: subscriberState,
        postalCode: subscriberPostalCode,
      },
    },
    providers: [
      {
        providerType: 'BillingProvider',
        npi: billingProviderNpi,
        taxonomyCode: billingProviderTaxonomy,
        organizationName: billingProviderOrgName,
        taxId: billingProviderTaxId,
        address: {
          address1: billingProviderAddress1,
          city: billingProviderCity,
          state: billingProviderState,
          postalCode: billingProviderPostalCode,
        },
      },
    ],
    claimInformation: {
      patientControlNumber,
      claimChargeAmount,
      placeOfServiceCode,
      claimFrequencyCode: '1',
      signatureIndicator: 'Y',
      planParticipationCode: 'A',
      releaseInformationCode: 'Y',
      healthCareCodeInformation: diagnosisCodes.map((code: IDataObject) => ({
        diagnosisTypeCode: code.diagnosisTypeCode || 'ABK',
        diagnosisCode: code.diagnosisCode,
      })),
      serviceLines: serviceLines.map((line: IDataObject) => ({
        serviceDate: (line.serviceDate as string).replace(/-/g, ''),
        professionalService: {
          procedureCode: line.procedureCode,
          procedureModifiers: line.procedureModifiers
            ? (line.procedureModifiers as string).split(',').map((m) => m.trim())
            : undefined,
          lineItemChargeAmount: line.lineItemChargeAmount,
          measurementUnit: 'UN',
          serviceUnitCount: line.serviceUnitCount || '1',
          compositeDiagnosisCodePointers: {
            diagnosisCodePointers: line.diagnosisPointers
              ? (line.diagnosisPointers as string).split(',').map((p) => p.trim())
              : ['1'],
          },
        },
      })),
    },
  };

  // Add optional dependent if provided
  const addDependent = this.getNodeParameter('addDependent', itemIndex, false) as boolean;
  if (addDependent) {
    const dependentFirstName = this.getNodeParameter('dependentFirstName', itemIndex, '') as string;
    const dependentLastName = this.getNodeParameter('dependentLastName', itemIndex, '') as string;
    const dependentDob = this.getNodeParameter('dependentDateOfBirth', itemIndex, '') as string;
    const dependentRelationship = this.getNodeParameter('dependentRelationship', itemIndex, '') as string;

    if (dependentFirstName && dependentLastName) {
      payload.dependent = {
        firstName: dependentFirstName,
        lastName: dependentLastName,
        dateOfBirth: dependentDob.replace(/-/g, ''),
        relationship: dependentRelationship,
      };
    }
  }

  // Add optional rendering provider
  const addRenderingProvider = this.getNodeParameter('addRenderingProvider', itemIndex, false) as boolean;
  if (addRenderingProvider) {
    const renderingNpi = this.getNodeParameter('renderingProviderNpi', itemIndex, '') as string;
    const renderingFirstName = this.getNodeParameter('renderingProviderFirstName', itemIndex, '') as string;
    const renderingLastName = this.getNodeParameter('renderingProviderLastName', itemIndex, '') as string;

    if (renderingNpi) {
      (payload.providers as IDataObject[]).push({
        providerType: 'RenderingProvider',
        npi: renderingNpi,
        firstName: renderingFirstName,
        lastName: renderingLastName,
      });
    }
  }

  return payload;
}

/**
 * Build eligibility check payload
 */
export function buildEligibilityPayload(
  this: IExecuteFunctions,
  itemIndex: number,
): IDataObject {
  const tradingPartnerServiceId = this.getNodeParameter('tradingPartnerServiceId', itemIndex) as string;

  // Provider
  const providerNpi = this.getNodeParameter('providerNpi', itemIndex) as string;
  const providerOrgName = this.getNodeParameter('providerOrganizationName', itemIndex, '') as string;
  const providerFirstName = this.getNodeParameter('providerFirstName', itemIndex, '') as string;
  const providerLastName = this.getNodeParameter('providerLastName', itemIndex, '') as string;

  // Subscriber
  const subscriberMemberId = this.getNodeParameter('subscriberMemberId', itemIndex) as string;
  const subscriberFirstName = this.getNodeParameter('subscriberFirstName', itemIndex, '') as string;
  const subscriberLastName = this.getNodeParameter('subscriberLastName', itemIndex, '') as string;
  const subscriberDob = this.getNodeParameter('subscriberDateOfBirth', itemIndex, '') as string;

  // Service Type
  const serviceTypeCodes = this.getNodeParameter('serviceTypeCodes', itemIndex) as string[];

  const payload: IDataObject = {
    tradingPartnerServiceId,
    provider: {
      ...(providerOrgName && { organizationName: providerOrgName }),
      ...(providerFirstName && { firstName: providerFirstName }),
      ...(providerLastName && { lastName: providerLastName }),
      npi: providerNpi,
    },
    subscriber: {
      memberId: subscriberMemberId,
      ...(subscriberFirstName && { firstName: subscriberFirstName }),
      ...(subscriberLastName && { lastName: subscriberLastName }),
      ...(subscriberDob && { dateOfBirth: subscriberDob.replace(/-/g, '') }),
    },
    encounter: {
      serviceTypeCodes,
    },
  };

  // Add dependent if provided
  const addDependent = this.getNodeParameter('addDependent', itemIndex, false) as boolean;
  if (addDependent) {
    const dependentFirstName = this.getNodeParameter('dependentFirstName', itemIndex, '') as string;
    const dependentLastName = this.getNodeParameter('dependentLastName', itemIndex, '') as string;
    const dependentDob = this.getNodeParameter('dependentDateOfBirth', itemIndex, '') as string;
    const dependentRelationship = this.getNodeParameter('dependentRelationship', itemIndex, '') as string;

    if (dependentFirstName && dependentLastName) {
      payload.dependent = {
        firstName: dependentFirstName,
        lastName: dependentLastName,
        dateOfBirth: dependentDob.replace(/-/g, ''),
        relationship: dependentRelationship,
      };
    }
  }

  // Add date range if provided
  const addDateRange = this.getNodeParameter('addDateRange', itemIndex, false) as boolean;
  if (addDateRange) {
    const startDate = this.getNodeParameter('dateRangeStart', itemIndex, '') as string;
    const endDate = this.getNodeParameter('dateRangeEnd', itemIndex, '') as string;

    if (startDate && endDate) {
      (payload.encounter as IDataObject).dateRange = {
        startDate: startDate.replace(/-/g, ''),
        endDate: endDate.replace(/-/g, ''),
      };
    }
  }

  return payload;
}

/**
 * Build claim status request payload
 */
export function buildClaimStatusPayload(
  this: IExecuteFunctions,
  itemIndex: number,
): IDataObject {
  const tradingPartnerServiceId = this.getNodeParameter('tradingPartnerServiceId', itemIndex) as string;

  // Submitter
  const submitterOrgName = this.getNodeParameter('submitterOrganizationName', itemIndex) as string;
  const submitterContactName = this.getNodeParameter('submitterContactName', itemIndex) as string;
  const submitterPhone = this.getNodeParameter('submitterPhone', itemIndex) as string;

  // Subscriber
  const subscriberMemberId = this.getNodeParameter('subscriberMemberId', itemIndex) as string;
  const subscriberFirstName = this.getNodeParameter('subscriberFirstName', itemIndex) as string;
  const subscriberLastName = this.getNodeParameter('subscriberLastName', itemIndex) as string;
  const subscriberDob = this.getNodeParameter('subscriberDateOfBirth', itemIndex) as string;

  // Provider
  const providerNpi = this.getNodeParameter('providerNpi', itemIndex) as string;
  const providerOrgName = this.getNodeParameter('providerOrganizationName', itemIndex, '') as string;

  // Claim Status Inquiry
  const patientControlNumber = this.getNodeParameter('patientControlNumber', itemIndex, '') as string;
  const serviceDate = this.getNodeParameter('serviceDate', itemIndex, '') as string;
  const claimAmount = this.getNodeParameter('claimAmount', itemIndex, '') as string;

  const payload: IDataObject = {
    tradingPartnerServiceId,
    submitter: {
      organizationName: submitterOrgName,
      contactInformation: {
        name: submitterContactName,
        phoneNumber: submitterPhone,
      },
    },
    subscriber: {
      memberId: subscriberMemberId,
      firstName: subscriberFirstName,
      lastName: subscriberLastName,
      dateOfBirth: subscriberDob.replace(/-/g, ''),
    },
    providers: [
      {
        ...(providerOrgName && { organizationName: providerOrgName }),
        npi: providerNpi,
      },
    ],
    claimStatusInquiry: {
      ...(patientControlNumber && { patientControlNumber }),
      ...(serviceDate && { serviceDate: serviceDate.replace(/-/g, '') }),
      ...(claimAmount && { claimAmount }),
    },
  };

  return payload;
}

/**
 * Validate NPI format
 */
export function validateNpi(npi: string): boolean {
  // NPI must be 10 digits
  if (!/^\d{10}$/.test(npi)) {
    return false;
  }

  // Luhn algorithm validation for NPI
  const digits = npi.split('').map(Number);
  let sum = 24; // Constant for healthcare identifier

  for (let i = digits.length - 2; i >= 0; i--) {
    let digit = digits[i];
    if ((digits.length - 2 - i) % 2 === 0) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }
    sum += digit;
  }

  return sum % 10 === 0;
}

/**
 * Format currency amount
 */
export function formatAmount(amount: string | number): string {
  const num = typeof amount === 'string' ? parseFloat(amount) : amount;
  return num.toFixed(2);
}

/**
 * Handle operation errors with helpful messages
 */
export function handleOperationError(
  this: IExecuteFunctions,
  error: unknown,
  operation: string,
): never {
  if (error instanceof NodeApiError || error instanceof NodeOperationError) {
    throw error;
  }

  const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
  
  throw new NodeOperationError(
    this.getNode(),
    `Error in ${operation}: ${errorMessage}`,
  );
}
