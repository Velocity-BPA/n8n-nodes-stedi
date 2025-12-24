/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

/**
 * Integration Tests for n8n-nodes-stedi
 * 
 * These tests are designed to be run against the Stedi sandbox environment.
 * Set STEDI_TEST_API_KEY environment variable to run these tests.
 * 
 * @author Velocity BPA, LLC
 * @website https://velobpa.com
 */

const TEST_API_KEY = process.env.STEDI_TEST_API_KEY;
const BASE_URL = 'https://healthcare.us.stedi.com/2024-04-01';

// Skip integration tests if no API key is provided
const describeIntegration = TEST_API_KEY ? describe : describe.skip;

describeIntegration('Stedi API Integration Tests', () => {
  // Helper function to make API requests
  async function makeRequest(
    method: string,
    endpoint: string,
    body?: object,
    qs?: Record<string, string>,
  ) {
    const url = new URL(`${BASE_URL}${endpoint}`);
    if (qs) {
      Object.entries(qs).forEach(([key, value]) => {
        url.searchParams.append(key, value);
      });
    }

    const response = await fetch(url.toString(), {
      method,
      headers: {
        Authorization: TEST_API_KEY!,
        'Content-Type': 'application/json',
      },
      body: body ? JSON.stringify(body) : undefined,
    });

    return {
      status: response.status,
      data: await response.json(),
    };
  }

  describe('Transaction Endpoints', () => {
    it('should list transactions', async () => {
      const { status, data } = await makeRequest('GET', '/healthcare/transactions', undefined, {
        limit: '5',
      });

      expect(status).toBe(200);
      expect(data).toBeDefined();
    });

    it('should poll for transactions', async () => {
      const { status, data } = await makeRequest('GET', '/healthcare/transactions/poll', undefined, {
        limit: '5',
      });

      expect(status).toBe(200);
      expect(data).toBeDefined();
    });
  });

  describe('Eligibility Endpoints', () => {
    it('should check eligibility with test payer', async () => {
      const eligibilityRequest = {
        tradingPartnerServiceId: 'STEDI_TEST_PAYER', // Use Stedi's test payer
        provider: {
          organizationName: 'Test Practice',
          npi: '1234567893',
        },
        subscriber: {
          memberId: 'TEST123456',
          firstName: 'Test',
          lastName: 'Patient',
          dateOfBirth: '19800115',
        },
        encounter: {
          serviceTypeCodes: ['30'],
        },
      };

      const { status, data } = await makeRequest(
        'POST',
        '/change/medicalnetwork/eligibility/v3',
        eligibilityRequest,
      );

      // In sandbox, this should either succeed or return a validation error
      expect([200, 400, 422]).toContain(status);
      expect(data).toBeDefined();
    });
  });

  describe('Claim Submission Endpoints', () => {
    it('should validate professional claim structure', async () => {
      const minimalClaim = {
        controlNumber: `TEST${Date.now()}`,
        tradingPartnerServiceId: 'STEDI_TEST_PAYER',
        submitter: {
          organizationName: 'Test Practice',
          contactInformation: {
            name: 'Test Contact',
            phoneNumber: '5551234567',
          },
        },
        receiver: {
          organizationName: 'Test Payer',
        },
        subscriber: {
          memberId: 'TEST123456',
          firstName: 'Test',
          lastName: 'Patient',
          dateOfBirth: '19800115',
          gender: 'M',
          address: {
            address1: '123 Test St',
            city: 'Miami',
            state: 'FL',
            postalCode: '33101',
          },
        },
        providers: [
          {
            providerType: 'BillingProvider',
            npi: '1234567893',
            taxonomyCode: '207Q00000X',
            organizationName: 'Test Practice LLC',
            taxId: '123456789',
            address: {
              address1: '456 Provider Dr',
              city: 'Miami',
              state: 'FL',
              postalCode: '33102',
            },
          },
        ],
        claimInformation: {
          patientControlNumber: 'PAT-TEST-001',
          claimChargeAmount: '100.00',
          placeOfServiceCode: '11',
          claimFrequencyCode: '1',
          signatureIndicator: 'Y',
          planParticipationCode: 'A',
          releaseInformationCode: 'Y',
          healthCareCodeInformation: [
            {
              diagnosisTypeCode: 'ABK',
              diagnosisCode: 'J069',
            },
          ],
          serviceLines: [
            {
              serviceDate: '20240115',
              professionalService: {
                procedureCode: '99213',
                lineItemChargeAmount: '100.00',
                measurementUnit: 'UN',
                serviceUnitCount: '1',
                compositeDiagnosisCodePointers: {
                  diagnosisCodePointers: ['1'],
                },
              },
            },
          ],
        },
      };

      const { status, data } = await makeRequest(
        'POST',
        '/change/medicalnetwork/professionalclaims/v3/submission',
        minimalClaim,
      );

      // In sandbox, this should either succeed or return a validation error
      expect([200, 201, 400, 422]).toContain(status);
      expect(data).toBeDefined();
    });
  });

  describe('Reports Endpoints', () => {
    it('should list 835 ERA reports', async () => {
      const { status, data } = await makeRequest('GET', '/healthcare/reports/835/list', undefined, {
        limit: '5',
      });

      // May return 200 with empty array or 404 if no reports exist
      expect([200, 404]).toContain(status);
      expect(data).toBeDefined();
    });

    it('should get 277CA reports', async () => {
      const { status, data } = await makeRequest('GET', '/healthcare/reports/277ca', undefined, {
        limit: '5',
      });

      expect([200, 404]).toContain(status);
      expect(data).toBeDefined();
    });
  });
});

// Credential validation tests (can run without API key)
// Note: These tests require network access to the Stedi API
describe.skip('Credential Validation', () => {
  it('should reject requests without API key', async () => {
    const response = await fetch(
      'https://healthcare.us.stedi.com/2024-04-01/healthcare/transactions?limit=1',
      {
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );

    // Should return 401 Unauthorized without API key
    expect(response.status).toBe(401);
  });

  it('should reject requests with invalid API key', async () => {
    const response = await fetch(
      'https://healthcare.us.stedi.com/2024-04-01/healthcare/transactions?limit=1',
      {
        headers: {
          Authorization: 'invalid-api-key',
          'Content-Type': 'application/json',
        },
      },
    );

    // Should return 401 or 403 with invalid API key
    expect([401, 403]).toContain(response.status);
  });
});
