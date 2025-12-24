# n8n-nodes-stedi

[Velocity BPA Licensing Notice]

This n8n node is licensed under the Business Source License 1.1 (BSL 1.1).

Use of this node by for-profit organizations in production environments requires a commercial license from Velocity BPA.

For licensing information, visit https://velobpa.com/licensing or contact licensing@velobpa.com.

---

![n8n](https://img.shields.io/badge/n8n-community--node-ff6d5a)
![License](https://img.shields.io/badge/license-BUSL--1.1-blue)
![Node.js](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen)
![Healthcare](https://img.shields.io/badge/healthcare-EDI-purple)

**n8n community node for Stedi® healthcare clearinghouse integration**

Automate the entire healthcare claims lifecycle including claim submission, eligibility verification, status checking, payment reconciliation, and attachment management.

---

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Installation](#installation)
- [Configuration](#configuration)
- [Resources & Operations](#resources--operations)
- [Usage Examples](#usage-examples)
- [Testing](#testing)
- [Troubleshooting](#troubleshooting)
- [License](#license)
- [Support](#support)

---

## Overview

This n8n community node integrates with [Stedi](https://www.stedi.com), the API-first healthcare clearinghouse. It enables healthcare organizations to automate:

- **Professional Claims (837P)** - CMS-1500 equivalent
- **Institutional Claims (837I)** - UB-04 equivalent  
- **Dental Claims (837D)** - ADA dental claims
- **Eligibility Verification (270/271)** - Real-time benefits check
- **Claim Status (276/277)** - Track claim progress
- **Remittance Advice (835 ERA)** - Payment reconciliation
- **Claim Acknowledgments (277CA)** - Payer responses
- **Attachments (275)** - Supporting documentation

---

## Features

- ✅ **Complete Healthcare EDI Support** - All major X12 transaction types
- ✅ **Real-time Operations** - Eligibility, claim status, and submissions
- ✅ **Webhook Triggers** - Listen for incoming transactions
- ✅ **Pagination Handling** - Automatic pagination for large result sets
- ✅ **Error Handling** - Detailed error messages from Stedi API
- ✅ **Test/Production Environments** - Easy environment switching
- ✅ **TypeScript** - Full type safety and IntelliSense support

---

## Installation

### Prerequisites

- n8n version >= 0.200.0
- Node.js >= 18.0.0
- Stedi account with API key

### Method 1: Install from npm (Recommended)

```bash
# In your n8n installation directory
npm install n8n-nodes-stedi
```

### Method 2: Install from Source

```bash
# Clone the repository
git clone https://github.com/Velocity-BPA/n8n-nodes-stedi.git
cd n8n-nodes-stedi

# Install dependencies
npm install

# Build the project
npm run build

# Link to your n8n installation
npm link

# In your n8n directory
cd /path/to/n8n
npm link n8n-nodes-stedi
```

### Method 3: Docker Installation

Add to your n8n Docker Compose or Dockerfile:

```dockerfile
# In your custom n8n Dockerfile
FROM n8nio/n8n:latest
RUN npm install -g n8n-nodes-stedi
```

### Method 4: Install from ZIP

1. Download the latest release ZIP from GitHub
2. Extract to your n8n custom nodes directory
3. Restart n8n

---

## Configuration

### Step 1: Get Your Stedi API Key

1. Log in to [Stedi Dashboard](https://www.stedi.com/app)
2. Navigate to **Settings** → **API Keys**
3. Create a new API key
4. Copy the key (it won't be shown again)

### Step 2: Configure Credentials in n8n

1. In n8n, go to **Credentials** → **Add Credential**
2. Search for **Stedi API**
3. Enter your API key
4. Select environment: **Test** or **Production**
5. Click **Save**

### Environment Notes

- **Test Environment**: Use for development. Stedi provides test payer IDs that return mock responses.
- **Production Environment**: Live healthcare transactions. Ensure HIPAA compliance.

---

## Resources & Operations

### Professional Claim (837P)

Submit CMS-1500 equivalent claims for physician and outpatient services.

| Operation | Description |
|-----------|-------------|
| Submit | Submit a new professional claim |
| Get PDF | Retrieve CMS-1500 PDF for a submitted claim |

### Institutional Claim (837I)

Submit UB-04 equivalent claims for hospitals and facilities.

| Operation | Description |
|-----------|-------------|
| Submit | Submit institutional claim (JSON payload) |

### Dental Claim (837D)

Submit dental claims with ADA procedure codes.

| Operation | Description |
|-----------|-------------|
| Submit | Submit dental claim (JSON payload) |

### Eligibility (270/271)

Real-time patient eligibility and benefits verification.

| Operation | Description |
|-----------|-------------|
| Check | Verify patient coverage and benefits |

### Claim Status (276/277)

Check the status of submitted claims.

| Operation | Description |
|-----------|-------------|
| Check | Query real-time claim status |

### Remittance (835 ERA)

Retrieve Electronic Remittance Advice for payment reconciliation.

| Operation | Description |
|-----------|-------------|
| Get Report | Get specific ERA report |
| List | List all available ERAs |

### Claim Acknowledgment (277CA)

Retrieve payer acknowledgments for submitted claims.

| Operation | Description |
|-----------|-------------|
| Get Report | Get acknowledgment report |

### Transaction

Manage transaction history across all types.

| Operation | Description |
|-----------|-------------|
| Get | Get transaction by ID |
| Get Input | Get original request payload |
| Get Output | Get response payload |
| List | List all transactions |
| Poll | Poll for new transactions |

### Attachment (275)

Submit supporting documentation for claims.

| Operation | Description |
|-----------|-------------|
| Create | Create attachment submission |
| Upload File | Upload attachment file |

---

## Usage Examples

### Example 1: Check Patient Eligibility

```
1. Add "Stedi" node
2. Select Resource: "Eligibility (270/271)"
3. Select Operation: "Check"
4. Configure:
   - Trading Partner Service ID: Your payer ID (e.g., "BCBSFL")
   - Provider NPI: Your 10-digit NPI
   - Subscriber Member ID: Patient's member ID
   - Service Type Codes: ["30"] for general coverage
5. Execute
```

### Example 2: Submit Professional Claim

```
1. Add "Stedi" node
2. Select Resource: "Professional Claim (837P)"
3. Select Operation: "Submit"
4. Fill in required fields:
   - Control Number: Unique claim ID
   - Trading Partner Service ID: Payer ID
   - Submitter info
   - Subscriber (patient) info
   - Billing provider info
   - Diagnosis codes (ICD-10)
   - Service lines (CPT codes)
5. Execute
```

### Example 3: Daily ERA Processing Workflow

```
Schedule Trigger (Daily 6am)
     ↓
Stedi: List Remittance (835)
     ↓
Loop: Process each ERA
     ↓
Match to original claims
     ↓
Update accounting system
     ↓
Send notification
```

### Example 4: Pre-Visit Eligibility Check

```
Webhook Trigger (Appointment Created)
     ↓
Stedi: Check Eligibility
     ↓
IF eligible → Store benefits
     ↓
IF not eligible → Alert front desk
```

---

## Testing

### Run Unit Tests

```bash
npm test
```

### Run Tests with Coverage

```bash
npm run test:coverage
```

### Run Integration Tests

Set your Stedi test API key:

```bash
export STEDI_TEST_API_KEY="your-test-api-key"
npm test
```

### Test Payer IDs

Use Stedi's documented test payer IDs for sandbox testing. Check [Stedi Payer Network](https://www.stedi.com/payer-network) for available test payers.

---

## Troubleshooting

### Common Errors

#### "Invalid API Key"
- Verify your API key in Stedi dashboard
- Ensure no extra spaces in the key
- Check environment matches (test vs production)

#### "Invalid Payer ID"
- Search [Stedi Payer Network](https://www.stedi.com/payer-network) for valid IDs
- Different payers may use different service IDs
- Some payers require enrollment before submission

#### "NPI Validation Failed"
- NPI must be exactly 10 digits
- Use [NPPES NPI Registry](https://npiregistry.cms.hhs.gov/) to verify

#### "Invalid Diagnosis Code"
- ICD-10 codes should not include periods
- Example: Use "J069" not "J06.9"

#### "Date Format Error"
- Use YYYY-MM-DD format in UI fields
- API converts to YYYYMMDD automatically

### Debug Mode

Enable n8n debug logs:

```bash
export N8N_LOG_LEVEL=debug
n8n start
```

---

## License

This n8n community node is licensed under the **Business Source License 1.1 (BSL 1.1)**.

### Free Use

Permitted for personal, educational, research, and internal business use.

### Commercial Use

Use of this node within any SaaS, PaaS, hosted platform, managed service, or paid automation offering requires a commercial license from Velocity BPA.

For licensing inquiries: **licensing@velobpa.com**

See [LICENSE](LICENSE), [COMMERCIAL_LICENSE.md](COMMERCIAL_LICENSE.md), and [LICENSING_FAQ.md](LICENSING_FAQ.md) for full details.

### Third-Party Notices

- **Stedi®** is a registered trademark of Stedi, Inc. This node is not affiliated with or endorsed by Stedi.
- **n8n** is a registered trademark of n8n GmbH.

---

## Support

### Documentation

- [Stedi API Docs](https://www.stedi.com/docs/healthcare)
- [Stedi API Reference](https://www.stedi.com/docs/api-reference/healthcare)
- [Stedi Payer Network](https://www.stedi.com/payer-network)
- [n8n Community Nodes](https://docs.n8n.io/integrations/community-nodes/)

### Get Help

- **GitHub Issues:** [Report bugs or request features](https://github.com/Velocity-BPA/n8n-nodes-stedi/issues)
- **Email:** licensing@velobpa.com
- **Website:** https://velobpa.com

### Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

---

## Author

**Velocity BPA, LLC**  
Website: https://velobpa.com  
GitHub: https://github.com/Velocity-BPA  
Email: licensing@velobpa.com

---

*Built with ❤️ for the healthcare automation community*
