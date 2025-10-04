# 🤖 AI-Powered Business Infrastructure

A comprehensive customer support system built on Google Cloud Platform 
with AI-powered conversational agents, multi-channel communication, and 
automated infrastructure provisioning. Note that this system is fairly 
complex and getting even moreso but it's an ambitious infrastructure 
design intended to be a good starting point for nearly any business 
acquisition in any vertical.

## 📋 Table of Contents

- [System Overview](#-system-overview)
- [Architecture](#-architecture)
- [Infrastructure](#-infrastructure)
- [AI Agent](#-ai-agent)
- [Frontend](#-frontend)
- [API Endpoints](#-api-endpoints)
- [Data Flow](#-data-flow)
- [Deployment](#-deployment)
- [Getting Started](#-getting-started)

## 🎯 System Overview

This platform provides a complete customer support solution for businesses with:

- **AI-Powered Conversations**: Vertex AI Gemini 2.5 Flash for natural language understanding
- **Multi-Channel Support**: Phone, SMS, web chat, and email integration *(Complete communication stack)*
  - **📞 Phone**: Twilio telephony with Gemini 2.5 Flash AI responses
  - **💬 SMS**: Twilio SMS API with CRM context integration
  - **🌐 Web Chat**: Real-time chat interface with conversation history
  - **📧 Email**: SendGrid API integration with AI-powered responses
- **CRM Integration**: Firebase CRM for customer relationship management and context *(Fully automated deployment)*
- **Persistent Memory**: Conversation history and context retention across CRM records
- **Scalable Infrastructure**: Auto-scaling Google Cloud resources with complete CRM stack
- **Modern UI**: Responsive Svelte frontend with Bootstrap styling

### 🤖 Complete Infrastructure Stack

**Fully Automated Deployment**: When you run `terraform apply`, this infrastructure automatically provisions:

- ✅ **AI Customer Support**: Gemini 2.5 Flash with phone and chat integration
- ✅ **CRM System**: Firebase CRM with Firestore database (`crm.yourdomain.com`)
- ✅ **Load Balancing**: Subdomain routing for seamless service access
- ✅ **SSL Security**: Automatic certificate management for custom domains
- ✅ **Database Integration**: PostgreSQL with automated backups and scaling

### Subdomain Architecture

When deployed with a custom domain (e.g., `yourbusiness.com`):

- **Main Site**: `yourbusiness.com` - Landing page and support interface
- **CRM Portal**: `crm.yourbusiness.com` - Firebase CRM customer management
- **API Endpoints**: Integrated across services for seamless data flow

### 💼 Why CRM Integration Matters for Business Acquisition

When acquiring a new business, **immediate access to customer data and support infrastructure** is critical for:

- **📞 Personalized Support**: AI agents instantly recognize customers and provide context-aware responses based on purchase history
- **🛒 Purchase Context**: AI understands what customers have bought, when, and their preferences for better service
- **🎯 Customer Retention**: Access to complete purchase history prevents service disruption during transition
- **📊 Business Intelligence**: Immediate visibility into customer base, purchase patterns, and lifetime value
- **🔄 Operational Continuity**: Existing customers continue receiving contextual support without interruption
- **📈 Growth Acceleration**: New customer acquisition supported by AI that understands customer behavior patterns
- **🎯 Lead Conversion**: Automated lead nurturing and sales pipeline management for business growth

**The Problem Solved**: Traditional business acquisitions often lose 20-30% of customers due to poor transition management. This infrastructure ensures **zero-downtime customer experience** with AI-powered support that knows every customer personally, including their complete purchase history and preferences.

**Data Migration Note**: When acquiring an existing business, simply import customer and purchase data into Firebase CRM. The AI agent will immediately have access to complete customer context for personalized support.

### Implementing Sales Pipeline Features *(Future Enhancement)*

**To Add Complete Sales Pipeline:**

1. **Enhanced Lead Capture Forms** *(Frontend)*
   - Add detailed prospect qualification forms
   - Industry-specific lead capture pages
   - Lead scoring and qualification logic

2. **Automated Lead Nurturing** *(Backend)*
   - Email sequence automation via Firebase CRM workflows
   - Lead scoring algorithms
   - Sales team notification triggers

3. **Sales Pipeline Management** *(Firebase CRM)*
   - Custom pipeline stages for your business
   - Lead-to-opportunity conversion workflows
   - Sales forecasting and reporting

4. **AI Agent Sales Integration** *(Backend)*
   - Lead status checking during conversations
   - Sales follow-up triggering
   - Opportunity creation from qualified leads

**Implementation Timeline:** 2-4 weeks for complete sales pipeline automation.

## 🔗 Third-Party System Integration for Acquisitions

### Merge.dev Integration for Seamless Acquisitions

When acquiring an existing business, **immediate integration with their existing systems** is crucial for maintaining operational continuity and customer experience. Merge.dev provides a unified API platform that simplifies this process:

#### **Why Merge.dev for Acquisitions:**

**Unified API Access:**
- **Single Integration Point**: Connect to 200+ business applications through one API
- **Standardized Data Models**: Consistent data structures across different systems
- **Real-time Sync**: Live data synchronization without custom development

**Supported Systems:**
- **HR/Payroll**: Gusto, ADP, Paychex, BambooHR, Workday
- **CRM**: Salesforce, HubSpot, Pipedrive, Zoho CRM
- **Accounting**: QuickBooks, Xero, NetSuite, Sage
- **E-commerce**: Shopify, WooCommerce, BigCommerce
- **Communication**: Slack, Microsoft Teams, Gmail

#### **Acquisition Integration Workflow:**

```typescript
// Example: Import customer data from acquired company's CRM
const importAcquiredCustomers = async (sourceSystem: string) => {
  // 1. Connect to source system via Merge.dev
  const mergeClient = new MergeClient({
    apiKey: process.env.MERGE_API_KEY,
    accountToken: sourceSystemToken
  });

  // 2. Retrieve customer data
  const customers = await mergeClient.crm.contacts.list({
    includeRemoteData: true
  });

  // 3. Transform and import to Firebase CRM
  for (const customer of customers) {
    await suiteCRM.createContact({
      first_name: customer.firstName,
      last_name: customer.lastName,
      email: customer.emailAddresses[0]?.emailAddress,
      phone: customer.phoneNumbers[0]?.phoneNumber,
      source: `acquired_${sourceSystem}`,
      // Map additional fields as needed
    });
  }

  return { imported: customers.length };
};
```

#### **Payroll System Integration:**

**For Acquired Companies with Existing Payroll:**
```typescript
// Example: Sync employee payroll data from acquired company's system
const syncPayrollData = async (acquiredCompanyId: string) => {
  // Connect to acquired company's payroll system
  const payrollData = await mergeClient.hris.employees.list({
    companyId: acquiredCompanyId,
    includeRemoteData: true
  });

  // Import payroll records to maintain continuity
  for (const employee of payrollData) {
    await payrollSystem.importEmployee({
      employeeId: employee.id,
      name: `${employee.firstName} ${employee.lastName}`,
      payRate: employee.compensations[0]?.rate,
      payFrequency: employee.compensations[0]?.payPeriod,
      // Preserve existing payroll history
    });
  }
};
```

#### **Integration Benefits for Acquisitions:**

**Operational Continuity:**
- **Zero Downtime**: Existing systems continue running during transition
- **Data Preservation**: All historical customer and employee data maintained
- **Process Continuity**: Payroll, invoicing, and customer service uninterrupted

**Risk Mitigation:**
- **Compliance Maintenance**: Tax withholding and reporting obligations met
- **Employee Retention**: Familiar systems reduce acquisition-related stress
- **Customer Experience**: Seamless support during ownership transition

**Technical Advantages:**
- **No Vendor Lock-in**: Easy migration path if needed later
- **Scalable Integration**: Works with systems of any size
- **API-First Architecture**: Reliable, documented integration points

#### **Implementation for Acquisitions:**

1. **Assessment Phase** (Week 1)
   ```bash
   # Identify existing systems
   merge discover-systems --company-id acquired-company-123

   # Map data structures
   merge schema-inspect --system-type gusto
   ```

2. **Integration Phase** (Week 2-3)
   ```typescript
   // Set up secure connection
   const integration = await mergeClient.integrations.create({
     category: 'hris',
     provider: 'gusto',
     credentials: acquiredCompanyCredentials
   });
   ```

3. **Data Migration** (Week 3-4)
   ```typescript
   // Migrate customers to Firebase CRM
   await migrateCustomers(integration.id, 'firebase');

   // Migrate employees to HR system
   await migrateEmployees(integration.id, 'frappe-hr');
   ```

**Result**: Acquired businesses maintain full operational capability while gaining access to AI-powered support and modern CRM infrastructure.

## 📧 Email Infrastructure Integration

### Current Email Capabilities *(Customer Data Only)*

**Currently Implemented:**
- **Email as Customer Data**: Email addresses stored in Firebase CRM for customer identification
- **Email Data Import**: Import email lists from marketing platforms during acquisition
- **Email Contact Method**: Support contact form includes email field for follow-up

**Implemented Email Infrastructure:**
- ✅ **SendGrid Integration**: Full SendGrid API integration for email sending
- ✅ **Email Processing**: AI agent can process incoming emails with CRM context
- ✅ **Email Responses**: Automated email responses via SendGrid API
- ✅ **Customer Email Integration**: Email addresses stored in Firebase CRM for identification

**Implemented Email Features:**
- ✅ **Mailchimp Integration**: Full Mailchimp API integration for marketing campaigns
- ✅ **Email Campaign Management**: AI-powered marketing automation workflows
- ✅ **Subscriber Management**: Add/remove subscribers with merge fields and tags

**Still Missing Email Features:**
- ❌ **Email Notifications**: No automated email alerts or responses for CRM events

### Email Integration Possibilities

**1. Email Receiving/Processing**
```typescript
// AI Agent could process incoming emails
const processEmail = async (emailData) => {
  // Extract customer info from email
  const customer = await suiteCRM.lookupByEmail(emailData.from);

  // Generate AI response
  const response = await aiAgent.generateResponse({
    message: emailData.body,
    context: customer,
    channel: 'email'
  });

  // Send response email via SendGrid
  await sendgridAPI.send(customer.email, response);
};
```

**2. Automated Email Notifications**
```typescript
// Firebase CRM workflow triggers
const emailWorkflows = {
  newCustomer: 'Welcome email with AI-generated content',
  supportTicket: 'Automated acknowledgment with case details',
  purchaseConfirmation: 'Personalized thank you with recommendations'
};
```

**3. Email Marketing Integration** ✅ **IMPLEMENTED**
```typescript
// Email marketing capabilities (fully implemented)
const emailMarketing = {
  sendgrid: 'Transactional emails with AI personalization ✅ IMPLEMENTED',
  mailchimp: 'Marketing campaigns via Mailchimp API integration ✅ IMPLEMENTED',
  customSMTP: 'Self-hosted email server for complete control ❌ NOT IMPLEMENTED'
};

// Campaign Management API Examples
const campaignAPI = {
  createCampaign: 'POST /api/ai/campaign - Create AI-powered email campaigns',
  subscribe: 'POST /api/ai/subscribe - Add subscribers to mailing lists',
  unsubscribe: 'DELETE /api/ai/unsubscribe - Remove subscribers',
  analytics: 'GET /api/ai/campaign/{id}/analytics - Get campaign performance'
};
```

### Infrastructure Requirements for Email

**Implemented Infrastructure:**

**SendGrid Integration:** ✅ **ALREADY CONFIGURED**
```hcl
# SendGrid API credentials stored in Secret Manager
resource "google_secret_manager_secret" "sendgrid_api_key" {
  secret_id = "${var.environment}-sendgrid-api-key"
  replication { auto {} }
}

resource "google_secret_manager_secret" "sendgrid_from_email" {
  secret_id = "${var.environment}-sendgrid-from-email"
  replication { auto {} }
}

# IAM for accessing SendGrid secrets
resource "google_secret_manager_secret_iam_member" "sendgrid_api_key_accessor" {
  secret_id = google_secret_manager_secret.sendgrid_api_key.secret_id
  role      = "roles/secretmanager.secretAccessor"
  member    = "serviceAccount:${google_service_account.cloud_run_sa.email}"
}
```

**Implemented Infrastructure:**

**Mailchimp Integration:** ✅ **CONFIGURED**
```hcl
# Mailchimp API credentials (for marketing campaigns)
resource "google_secret_manager_secret" "mailchimp_api_key" {
  secret_id = "${var.environment}-mailchimp-api-key"
  replication { auto {} }
}

resource "google_secret_manager_secret" "mailchimp_server_prefix" {
  secret_id = "${var.environment}-mailchimp-server-prefix"
  replication { auto {} }
}

resource "google_secret_manager_secret" "mailchimp_list_id" {
  secret_id = "${var.environment}-mailchimp-list-id"
  replication { auto {} }
}
```

**Email Processing Service:** ✅ **IMPLEMENTED**
```typescript
// AI Agent Service handles email processing with SendGrid
// Email processing integrated in main AI agent - no separate service needed
// Route: POST /api/ai/email - processes incoming emails and sends responses
```


**Email Workflow Automation:**
```php
// Firebase CRM email workflows
$sugar_config['email_workflows'] = array(
    'new_ticket_notification' => array(
        'trigger' => 'new_case_created',
        'template' => 'ai_generated_response',
        'recipient' => 'customer_email'
    )
);
```

### Email Channel Benefits

**Multi-Channel Customer Experience:**
- **Unified Context**: Customer email conversations linked to CRM records
- **AI-Powered Responses**: Email replies generated with full customer context
- **Automated Follow-ups**: Triggered emails based on customer behavior
- **Preference Tracking**: Email preferences stored and respected

**Business Acquisition Value:**
- **Existing Email Lists**: Import and activate email marketing immediately
- **Customer Communication**: Maintain relationships through preferred channels
- **Marketing Automation**: Automated campaigns with customer personalization

## 📥 Customer Data Import for Business Acquisitions

### Common Data Sources from Non-CRM Businesses

**Digital Sources:**
- **Spreadsheets** (Excel, Google Sheets, CSV files)
- **Email Marketing Lists** (Mailchimp, Constant Contact exports)
- **E-commerce Platforms** (Shopify, WooCommerce customer data)
- **Accounting Software** (QuickBooks, Xero customer records)
- **Point of Sale Systems** (Square, Toast transaction data)

**Physical/Digital Hybrid:**
- **Customer Address Books** (Outlook, Gmail contacts)
- **Business Card Scanners** (digital business card collections)
- **Paper Records** (customer lists, order forms, service tickets)

**Legacy Systems:**
- **Old Software Exports** (custom databases, legacy CRM dumps)
- **Website Contact Forms** (database exports of form submissions)
- **Social Media** (Facebook, LinkedIn business page contacts)

### Firebase CRM Import Methods

**1. CSV Import (Primary Method)**
```bash
# Export from source system as CSV
# Format: customer_name,email,phone,address,purchase_history,notes

# Access Firebase CRM → Import → Select Module (Contacts/Leads/Accounts)
# Upload CSV → Map fields → Import data
# Supports: Contacts, Leads, Accounts, Opportunities, Custom Modules
```

**2. API Integration (Automated)**
```typescript
// Programmatic import via Firebase CRM REST API
const importCustomers = async (customerData) => {
  const response = await fetch('https://crm.yourdomain.com/api/contacts', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      first_name: customerData.name,
      email: customerData.email,
      phone: customerData.phone,
      // Map additional fields as needed
    })
  });
  return response.json();
};
```

**3. Data Migration Tools**
- **CSV Import Wizard**: Built-in Firebase CRM functionality
- **Firebase CRM Plugins**: Community extensions for enhanced imports
- **ETL Tools**: Third-party tools for complex data transformation

### Import Process for Different Business Types

**Retail/E-commerce:**
```csv
# CSV Format Example
customer_name,email,phone,total_purchases,last_purchase_date,preferred_products
John Doe,john@email.com,+1234567890,5,2024-01-15,Electronics,Gaming
```

**Service Business:**
```csv
# CSV Format Example
customer_name,email,phone,service_history,total_spent,last_service_date
Jane Smith,jane@email.com,+0987654321,Plumbing Repair,450,2024-02-10
```

**SaaS/Subscription:**
```csv
# CSV Format Example
customer_name,email,phone,subscription_tier,signup_date,renewal_date,usage_level
Bob Wilson,bob@email.com,+1122334455,Premium,2023-06-01,2024-06-01,High
```

### Post-Import AI Integration

**Automatic Context Building:**
```typescript
// After import, AI agent immediately has access
const customerContext = await firebaseCRM.getCustomer(phoneNumber);
// Returns: { purchases: [...], preferences: [...], history: [...] }

const personalizedResponse = await aiAgent.generate({
  message,
  context: customerContext,
  businessType: "retail" // or "service" or "saas"
});
```

### Data Quality Best Practices

**Before Import:**
- **Deduplication**: Remove duplicate customer records
- **Standardization**: Normalize phone numbers, addresses, names
- **Validation**: Verify email formats and required fields
- **Categorization**: Tag customers by source, value, or type

**Import Mapping:**
```javascript
// Field mapping configuration
const fieldMapping = {
  'source_name_field': 'first_name',
  'source_email_field': 'email',
  'source_phone_field': 'phone',
  'source_purchase_total': 'custom_purchase_total',
  'source_last_contact': 'last_contact_date'
};
```

### Batch Import Strategy

**For Large Datasets:**
1. **Test Import**: Import 10-20 records first to verify mapping
2. **Batch Processing**: Import in chunks of 500-1000 records
3. **Error Handling**: Review and fix import errors
4. **Validation**: Verify data integrity after import
5. **AI Testing**: Test AI agent responses with imported data

### Business Acquisition Timeline

**Week 1: Assessment**
- Inventory existing customer data sources
- Assess data quality and completeness
- Plan import strategy by data type

**Week 2: Preparation**
- Clean and standardize data
- Create field mapping templates
- Set up Firebase CRM custom fields if needed

**Week 3: Import & Validation**
- Execute batch imports
- Verify data integrity
- Test AI agent integration

**Week 4: Optimization**
- Fine-tune field mappings
- Set up automated workflows
- Train team on data management

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend API   │    │   Firebase CRM  │    │  Google Cloud   │
│   (Svelte)      │◄──►│   (Node.js)     │◄──►│   (Firestore)   │◄──►│  Services       │
│                 │    │                 │    │                 │    │                 │
│ • Landing Page  │    │ • AI Agent      │    │ • Purchase Hist.│    │ • Firestore     │
│ • Chat Interface│    │ • CRM Lookup    │    │ • Support Cases │    │ • Cloud Run     │
│ • Email Forms   │    │ • Email Proc.   │    │ • Email Workfl. │    │ • SendGrid API  │
└─────────────────┘    └─────────────────┘    └─────────────────┘    │ • Twilio API    │
                                                              └─────────────────┘
```

### Service Integration

- **AI Agent ↔ Firebase CRM**: Real-time customer lookups during phone conversations
- **Phone Support ↔ CRM**: Automatic ticket creation and customer context retrieval
- **Web Forms ↔ CRM**: Seamless lead capture and customer record creation
- **Email Processing ↔ AI Agent**: AI-powered email responses with customer context ✅ **Implemented**
- **CRM Workflows ↔ Email**: Automated email notifications and campaigns ✅ **Implemented**
- **Customer Data ↔ Email**: Email addresses as customer identifiers across all systems

## 🛠️ Infrastructure

### Google Cloud Services Used

| Service | Purpose | Configuration |
|---------|---------|---------------|
| **Cloud Run** | Serverless backend | Auto-scaling Node.js API |
| **Firestore** | NoSQL database | CRM data storage |
| **Firestore** | NoSQL database | Conversation & ticket storage |
| **Vertex AI** | Conversational AI | Gemini 2.5 Flash for natural language processing |
| **Twilio API** | Phone integration | Voice/SMS handling & number provisioning |
| **Cloud Storage** | Static hosting | Frontend assets |
| **Secret Manager** | Credential storage | API keys & phone numbers |
| **VPC Network** | Secure networking | Private subnets & NAT |
| **Cloud Load Balancing** | Traffic distribution | Multi-service routing (optional) |

### Infrastructure Provisioning *(Fully Automated)*

**Complete Infrastructure Stack**: When you run `terraform apply`, this infrastructure automatically provisions:

**Core Infrastructure**:
- VPC with private subnets
- NAT Gateway for outbound traffic
- Service accounts with minimal permissions

**AI Services**:
- Vertex AI Gemini 2.5 Flash for conversational AI
- Firebase CRM integration

**Business Applications** *(Fully Automated)*:
- ✅ **Firestore** for CRM data storage
- ✅ **Load Balancer** for domain routing
- ✅ **SSL Certificates** for custom domain security (`yourbusiness.com`, `crm.yourbusiness.com`)

**Communication Services**:
- Twilio API for phone number provisioning and telephony
- SendGrid API for email processing and responses

**Data Storage**:
- Firestore database for conversations and CRM data
- Cloud Storage for frontend assets

**Security & Access**:
- Secret Manager for sensitive data
- IAM roles for service accounts
- SSL certificates for custom domains
- Database access controls and network security
```

## 🤖 AI Agent

### Conversational AI Pipeline

**1. Message Reception**
- Phone/SMS via Twilio telephony with Gemini 2.5 Flash AI
- Web chat via REST API
- Voice calls with speech-to-text conversion

**2. Context Management**
```typescript
// Conversation persistence in Firestore
const context = await firestore.collection('conversations')
  .doc(sessionId).get();

// Maintain conversation history
context.messages.push({
  role: 'user',
  content: message,
  timestamp: new Date()
});
```

**3. Gemini 2.5 Flash Processing**
- Natural language understanding
- Intent detection and entity extraction
- Context-aware responses

**4. Response Generation**
- Dynamic responses based on conversation history
- Escalation to human agents when needed
- Multi-language support

### API Endpoints (`/api/ai/`)

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/sms` | POST | Handle incoming SMS messages with Gemini 2.5 Flash + MCP |
| `/voice` | POST | Process voice calls with OpenAI Whisper + Gemini 2.5 Flash + ElevenLabs |
| `/chat` | POST | Web chat interface with Gemini 2.5 Flash + MCP |
| `/email` | POST | Process incoming emails with Gemini 2.5 Flash + SendGrid | ✅ **Implemented** |
| `/campaign` | POST | Create and send email campaigns via Mailchimp | ✅ **Implemented** |
| `/subscribe` | POST | Add email to Mailchimp mailing list | ✅ **Implemented** |
| `/unsubscribe` | DELETE | Remove email from Mailchimp mailing list | ✅ **Implemented** |
| `/campaign/:campaignId/analytics` | GET | Get campaign analytics and performance data | ✅ **Implemented** |
| `/crm/customers` | GET/POST | Firebase CRM customer management |

## 🔗 CRM Integration

### Firebase CRM Customer Context

The AI agent seamlessly integrates with Firebase CRM to provide personalized customer support experiences:

**Enhanced Customer Context Process:**
```typescript
// AI Agent receives phone number or customer identifier
const customerContext = await lookupCustomer(phoneNumber);

// Query Firebase CRM for comprehensive customer information
const customerData = await firebaseCRM.getCustomer({
  phone: phoneNumber
});

// Get additional context via MCP
const purchaseHistory = await suiteCRM.executeTool('getPurchaseHistory', {
  customerId: customerData.id,
  limit: 5
});

const supportCases = await suiteCRM.executeTool('getSupportCases', {
  customerId: customerData.id,
  limit: 3
});

// Enhance AI response with comprehensive customer context
const personalizedResponse = await geminiFlash.generateResponse({
  message,
  context: {
    customerProfile: customerData,
    recentPurchases: purchaseHistory,
    supportHistory: supportCases,
    preferences: await suiteCRM.executeTool('getCustomerPreferences', { customerId: customerData.id })
  }
});
```

### CRM ↔ AI Agent Integration Features

- **Real-time Customer Lookup**: Phone/email identification triggers instant CRM data retrieval via MCP
- **Comprehensive Purchase History**: AI agent accesses complete customer purchase/order history with detailed transaction data
- **Advanced Customer Profiling**: AI has access to customer segment, lifetime value, preferences, and behavioral patterns
- **Support Case Integration**: AI can create support tickets and access existing case history with full context
- **Customer Preference Tracking**: Language preferences, contact methods, notification preferences, and special requirements
- **Contextual Responses**: AI responses personalized based on complete customer profile, purchase patterns, and support history
- **Conversation History Sync**: All interactions logged in both Firestore and Firebase CRM with full context preservation
- **Vertical-Specific Data**: Custom fields for different business types (products, services, subscriptions, IoT, etc.)
- **Customer Lifetime Value**: AI understands customer value metrics for personalized service prioritization
- **Behavioral Analytics**: AI can reference customer behavior patterns for predictive support

### Firebase CRM Configuration

**Database Integration:**
```typescript
// Firebase configuration for Firestore
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
```

**CRM Service Integration:**
```typescript
// Firebase CRM service provides real-time data access
const crmService = new FirebaseCRMService();

// Available methods for AI agent
const availableMethods = [
  'getCustomer',           // Customer profile and contact info
  'getPurchaseHistory',    // Complete purchase history with categories
  'getSupportCases',       // Support case history with resolution details
  'getCustomerPreferences', // Communication and service preferences
  'createSupportTicket',   // Create new support cases
  'updateCustomerContactInfo', // Update customer contact information
  'getCustomerLifetimeValue'   // Customer value metrics and analytics
];
```

### 🔐 Firebase CRM Authentication & Access

**API Access:**
- **Base URL**: `https://your-api-domain.com/api/crm`
- **Authentication**: Firebase service account or API keys
- **Security**: All access through secure HTTPS with authentication

**Access Control Features:**
- **Service Account**: Firebase service account for programmatic access
- **API Keys**: Secure API key authentication for external integrations
- **Firestore Security Rules**: Granular access control at document level
- **Real-time Updates**: Live data synchronization across services

## 🎯 Sales Pipeline & Lead Management

### Current Lead Capture Capabilities *(Basic)*

**Currently Implemented:**
- **Newsletter Signup**: Email capture from homepage
- **Support Tickets**: Contact information from support requests
- **Basic CRM Modules**: Firebase CRM supports Customers, Orders, and Interactions

**Missing Sales Pipeline Features:**
- ❌ **Lead Scoring**: Automatic qualification of prospects
- ❌ **Lead Nurturing**: Automated email sequences for prospects
- ❌ **Sales Pipeline Stages**: Visual pipeline management
- ❌ **Lead Qualification Forms**: Detailed prospect information capture
- ❌ **Conversion Tracking**: Lead-to-customer journey analytics

### Lead Journey: Visitor → Prospect → Lead → Customer

**Current Flow:**
```
1. Visitor → Newsletter Signup → Email captured in CRM
   ↓
2. Visitor → Support Ticket → Contact info + issue logged
   ↓
3. Manual CRM Management → Sales team follows up manually
```

**Potential Enhanced Flow:**
```
1. Visitor → Landing Page → Newsletter Signup → Email captured
   ↓
2. Visitor → Lead Magnet → Contact Form → Qualified as Marketing Qualified Lead (MQL)
   ↓
3. Automated Nurturing → Email sequences → Sales Qualified Lead (SQL)
   ↓
4. Sales Follow-up → Opportunities Module → Customer conversion
   ↓
5. Purchase Tracking → Customer Data → AI context for support
```

### Firebase CRM Sales Pipeline Modules

**Built-in Sales Modules:**
- **Customers**: Customer information and lifetime value
- **Orders**: Purchase history and transaction tracking
- **Interactions**: Communication history across all channels
- **Analytics**: Customer behavior and value metrics

**Custom Configuration (Post-Deployment):**
```typescript
// Example: Custom collection for product purchases
interface Purchase {
  customerId: string;
  productName: string;
  purchaseDate: Date;
  amount: number;
  status: 'pending' | 'completed' | 'refunded';
  category: 'electronics' | 'services' | 'subscriptions';
}

// Firestore collection: purchases
```

**AI Agent Integration:**
```typescript
// AI Agent retrieves purchase context during calls
const customerPurchases = await firebaseCRM.getCustomerOrders({
  customerId: customerData.id,
  includeHistory: true,
  limit: 10 // Last 10 purchases
});

// Enhance AI response with purchase context
const purchaseContext = customerPurchases.map(p => ({
  product: p.productName,
  date: p.purchaseDate,
  amount: p.amount,
  status: p.status
}));
```

**Vertical-Specific Configurations:**

**E-commerce/Retail:**
- Product catalogs and inventory tracking
- Purchase frequency and lifetime value
- Return and exchange history

**SaaS/Subscription:**
- Subscription tiers and renewal dates
- Feature usage and upgrade history
- Billing and payment method tracking

**Service Businesses:**
- Service packages and completion tracking
- Project history and deliverables
- Client satisfaction and repeat business

### Implementing Sales Pipeline Features

**Frontend Lead Capture Forms:**
```svelte
<!-- Example: Enhanced lead capture form -->
<form on:submit={handleLeadSubmit}>
  <input type="text" placeholder="Company Name" required>
  <input type="email" placeholder="Work Email" required>
  <select name="companySize">
    <option>1-10 employees</option>
    <option>11-50 employees</option>
    <option>51-200 employees</option>
    <option>200+ employees</option>
  </select>
  <select name="industry">
    <option>Technology</option>
    <option>Healthcare</option>
    <option>Finance</option>
    <!-- More industry options -->
  </select>
  <textarea placeholder="What are you looking for?"></textarea>
  <button type="submit">Get Started</button>
</form>
```

**Backend Lead Processing:**
```typescript
// Enhanced lead capture with qualification
supportRouter.post('/lead', async (req: Request, res: Response) => {
  const leadData = {
    ...req.body,
    leadScore: calculateLeadScore(req.body), // Custom scoring logic
    source: 'website',
    status: 'new',
    qualification: determineQualification(req.body)
  };

  // Create in Firebase CRM
  await firebaseCRM.createCustomer(leadData);

  // Trigger automated nurturing sequence
  await emailNurturing.startSequence(leadData.email);

  res.json({ success: true, leadId: leadData.id });
});
```

**Lead Scoring Algorithm:**
```typescript
function calculateLeadScore(leadData) {
  let score = 0;

  // Company size scoring
  if (leadData.companySize === '200+ employees') score += 30;
  else if (leadData.companySize === '51-200 employees') score += 20;

  // Industry relevance
  if (['Technology', 'Healthcare'].includes(leadData.industry)) score += 25;

  // Message length (shows engagement)
  if (leadData.message.length > 100) score += 15;

  return score;
}
```

### Automated Lead Nurturing

**Email Sequence Configuration:**
```typescript
// Firebase CRM workflow for customer nurturing
const emailWorkflows = {
  welcome_series: {
    trigger: 'new_customer_created',
    emails: [
      { day: 1, template: 'Welcome and value proposition' },
      { day: 3, template: 'Case study or demo offer' },
      { day: 7, template: 'Product benefits deep dive' },
      { day: 14, template: 'Call-to-action for sales contact' }
    ]
  }
};
```

### Sales Pipeline Integration

**CRM ↔ AI Agent Integration for Sales:**
```typescript
// AI agent can access customer status during conversations
const customerContext = await firebaseCRM.getCustomer(customerEmail);
// Returns: { lifetimeValue: 1250, lastOrderDate: '2024-01-15', totalOrders: 5 }

const salesResponse = await aiAgent.generate({
  message,
  context: customerContext,
  customerValue: customerContext.lifetimeValue,
  action: 'sales_followup' // Trigger sales team notification
});
```

## 🎨 Frontend

### User Interface Components

**Landing Page** (`/`)
- Hero section with value proposition
- Feature highlights (AI agent, phone support, cloud infrastructure)
- Newsletter signup form
- Call-to-action buttons

**Support Page** (`/support`)
- Multi-channel contact options (phone, SMS, web form)
- Interactive phone number display
- Support ticket submission form
- FAQ accordion

**Layout Components**
- Responsive navigation
- Footer with contact information
- Bootstrap-based styling
- Mobile-optimized design

### Technology Stack

- **Framework**: SvelteKit (Svelte + Vite)
- **Styling**: Bootstrap 5 + custom CSS
- **Icons**: Bootstrap Icons
- **Build Tool**: Vite
- **Deployment**: Cloud Storage static hosting

## 📡 API Endpoints

### AI Agent API (`/api/ai/`)

**SMS Processing**
```typescript
POST /api/ai/sms
Content-Type: application/xml
// Handles Twilio webhook for SMS messages
```

**Voice Processing**
```typescript
POST /api/ai/voice
// Processes voice input with speech recognition
```

**Web Chat**
```typescript
POST /api/ai/chat
{
  "message": "User message",
  "sessionId": "optional-session-id"
}
```

### Support API (`/api/support/`)

**Ticket Submission**
```typescript
POST /api/support/ticket
{
  "name": "John Doe",
  "email": "john@example.com",
  "subject": "Issue description",
  "message": "Detailed problem description"
}
```

**Newsletter Signup**
```typescript
POST /api/support/newsletter
{
  "email": "user@example.com"
}
```

### Phone API (`/api/phone/`)

**Number Retrieval**
```typescript
GET /api/phone/numbers
// Returns current support phone numbers
```

## 🔄 Data Flow

### Complete Multi-Channel Customer Interaction Flow

**All channels follow the same intelligent processing pipeline:**

```
Customer Input (Phone/SMS/Email/Web) → Input Processing
     ↓
Customer Identification → Firebase CRM → Customer Record Retrieval
     ↓
Customer Context (History, Preferences, Cases, Purchase Data) → AI Agent Enhancement
     ↓
Personalized Response Generation → Customer
     ↓
Conversation & Case Updates → Both Firestore & Firebase CRM
```

### Channel-Specific Processing Flows

```
1. Customer visits website (yourbusiness.com)
   ↓
2. Views landing page with support options
   ↓
3. Chooses communication method:
      ├── Phone → Twilio telephony with Gemini 2.5 Flash AI
      ├── SMS → Twilio SMS API with CRM context
      ├── Email → Gmail API with AI processing
      └── Web Form → Support ticket creation
   ↓
4. AI Agent processes request:
      ├── Customer identification (phone/email lookup)
      ├── CRM context retrieval from Firebase CRM
      ├── Natural language understanding (Gemini 2.5 Flash)
      ├── Context retrieval from Firestore
      ├── Speech-to-text processing (OpenAI Whisper)
      ├── Text-to-speech generation (ElevenLabs)
      ├── Personalized response generation
      ├── Email response sending (for email channel via SendGrid)
      └── Conversation history update (both Firestore & Firebase CRM)
   ↓
5. Response delivered via chosen channel with full customer context
```

### CRM Integration Flow

```
Customer Interaction (Phone/SMS/Email/Web) → Multi-Channel Processing
     ↓
Customer Identification → Firebase CRM API → Customer Record Retrieval
     ↓
Customer Context (History, Preferences, Cases, Purchase Data) → AI Agent Enhancement
     ↓
Personalized Response Generation → Customer
     ↓
Conversation & Case Updates → Both Firestore & Firebase CRM
     ↓
Email Auto-Response (if email channel) → Gmail API
```

**Email-Specific Flow:**
```
Customer Email → Email Processing → Gemini 2.5 Flash (AI Agent)
     ↓
Email Content Analysis → Intent Recognition
     ↓
Customer Lookup by Email → Firebase CRM → Purchase & Support History
     ↓
AI-Generated Response → SendGrid API → Customer Email
```

**Complete Phone Call Flow:**
```
📞 Customer Call → Twilio API → Voice Audio Stream
     ↓
🎙️ Speech-to-Text → OpenAI Whisper (Primary) → Text Transcription
     ↓                          ↓
🔄 Google Cloud STT (Fallback) → Customer Context Lookup
     ↓                          ↓
🤖 Gemini 2.5 Flash → AI Response Generation (with CRM Context)
     ↓                          ↓
🎤 Text-to-Speech → ElevenLabs (Primary) → Natural Audio Response
     ↓                          ↓
🔊 Google Cloud TTS (Fallback) → Twilio Audio Delivery
     ↓
📞 Customer Receives AI Response
```

**SMS/Text Message Flow:**
```
💬 SMS Received → Twilio SMS API → Text Message
     ↓
🔍 Customer Lookup → Firebase CRM → Customer Context & History
     ↓
🤖 Gemini 2.5 Flash → AI Response Generation
     ↓
📤 SMS Response → Twilio SMS API → Customer
```

**Email Flow:**
```
📧 Email Received → Email Processing → Customer Identification
     ↓
🔍 CRM Lookup → Firebase CRM → Customer Context & History
     ↓
🤖 Gemini 2.5 Flash → AI Response Generation
     ↓
📤 Email Response → SendGrid API → Customer Email
```

**Complete Processing Pipeline:**
```
🎙️ Audio Input → OpenAI Whisper (Primary STT) → Text Transcription
     ↓                          ↓
🔄 Google Cloud STT (Fallback) → Gemini 2.5 Flash → AI Response Generation
     ↓                          ↓
🎤 ElevenLabs TTS (Primary) → Natural Audio Response
     ↓
🔊 Google Cloud TTS (Fallback)
```

**Technical Implementation:**
```typescript
// Complete phone call processing
async processPhoneCall(audioStream) {
  // 1. Speech-to-Text with Whisper
  const transcription = await openAIWhisper.transcribe(audioStream);

  // 2. AI Processing with Gemini 2.5 Flash
  const customerContext = await firebaseCRM.getCustomer({ phone: extractPhone(audioStream) });
  const aiResponse = await geminiFlash.generate({
    text: transcription,
    context: customerContext,
    conversationHistory: getHistory(sessionId)
  });

  // 3. Text-to-Speech with ElevenLabs
  const audioResponse = await elevenLabs.synthesize(aiResponse);

  return audioResponse;
}
```

### Detailed Channel Processing

**📞 Phone Call Processing:**
```
1. Customer calls phone number → Twilio receives call
2. Twilio streams audio to webhook → Cloud Run AI Agent receives audio
3. Audio processing → OpenAI Whisper converts speech to text
4. Customer identification → Extract phone number from call
5. CRM lookup → Firebase CRM queries customer database
6. Context enhancement → Gemini 2.5 Flash processes with customer history
7. Response generation → AI creates personalized response
8. Audio synthesis → ElevenLabs converts text to natural speech
9. Response delivery → Twilio streams audio back to customer
10. Conversation logging → Both Firestore and Firebase CRM updated
```

**💬 SMS/Text Message Processing:**
```
1. Customer sends SMS → Twilio receives message via webhook
2. Message processing → Extract sender phone number and content
3. Customer identification → Firebase CRM lookup by phone
4. Context retrieval → Get customer's purchase history and preferences
5. AI processing → Gemini 2.5 Flash generates contextual response
6. Response delivery → Twilio sends SMS reply to customer
7. Conversation tracking → Update Firestore and Firebase CRM records
```

**🌐 Web Chat Processing:**
```
1. Customer visits website → Loads chat interface
2. Message submission → Frontend sends to backend API
3. Context lookup → Check for existing conversation session
4. Customer identification → Optional email/phone lookup
5. AI processing → Gemini 2.5 Flash generates response
6. Response delivery → Real-time chat response to customer
7. Conversation persistence → Save to Firestore for continuity
```

**📧 Email Processing:**
```
1. Customer sends email → SendGrid receives email
2. Email parsing → Extract sender, subject, and content
3. Customer identification → Firebase CRM lookup by email
4. Context enhancement → Get customer's support history and preferences
5. AI processing → Gemini 2.5 Flash generates contextual email response
6. Email composition → Create personalized email reply
7. Response delivery → SendGrid sends email to customer
8. Conversation tracking → Update both Firestore and Firebase CRM with interaction
```

### Infrastructure Flow

```
1. Git push triggers GitHub Actions
   ↓
2. Backend tests and builds Docker image
   ↓
3. Image pushed to Google Container Registry
   ↓
4. Cloud Run service updated with new image
   ↓
5. Frontend built and deployed to Cloud Storage
   ↓
6. Load balancer routes traffic to new deployments
```

## 🚀 Deployment

### Automated Deployment (GitHub Actions)

**Complete Stack Deployment**: All services deploy automatically including CRM integration.

**Backend Deployment** (`deployment/github-actions/backend.yml`)
- Automated testing and linting
- Docker image building and pushing
- Cloud Run service deployment (AI Agent)
- Environment variable configuration
- Database migration and seeding

**Frontend Deployment** (`deployment/github-actions/frontend.yml`)
- Static site generation
- Cloud Storage upload
- SPA routing configuration

**Infrastructure** (`deployment/github-actions/terraform.yml`)
- Plan and apply infrastructure changes
- Secret management integration
- Firebase project configuration
- Load balancer and SSL certificate setup

### Local Development

```bash
# Start all services
docker-compose up --build

# Individual services
cd frontend && npm run dev  # Frontend development
cd backend && npm run dev   # Backend development
```

## 🛠️ Getting Started

### Prerequisites

- **Google Cloud Project** with billing enabled
- **Terraform** >= 1.0
- **Node.js** >= 18
- **Git** for version control

### Initial Setup

1. **Clone Repository**
   ```bash
   git clone <repository-url>
   cd ai-customer-support-platform
   ```

2. **Configure Infrastructure**
   ```bash
   cd terraform
   cp terraform.tfvars.example terraform.tfvars
   # Edit terraform.tfvars with your values
   terraform init
   terraform plan
   terraform apply
   ```

3. **Configure Phone Number** *(Twilio Setup)*
   - Create Twilio account at twilio.com
   - Purchase phone number(s) in your desired region
   - Configure webhook URL to point to your deployed Cloud Run service
   - Update terraform.tfvars with phone number and Twilio credentials

4. **Deploy Application**
   ```bash
   # Push to main branch to trigger automated deployment
   git push origin main
   ```

5. **Verify CRM Integration**
   ```bash
   # Check that all services are running
   terraform output

   # Firebase CRM is automatically configured and ready to use
   # AI agent will automatically lookup customers during phone calls
   ```

6. **Firebase Configuration** *(One-time setup)*
    ```bash
    # Firebase CRM is automatically configured via Terraform
    # No manual setup required - the system is ready to use immediately
    # Import customer data using the provided API endpoints
    ```

### Environment Variables

**Backend** (`.env`)
```bash
FIRESTORE_PROJECT_ID=your-project-id
VERTEX_AI_LOCATION=us-central1
SUPPORT_PHONE_NUMBER=+15551234567

# ElevenLabs API Configuration (for enhanced text-to-speech)
ELEVENLABS_API_KEY=your-elevenlabs-api-key
ELEVENLABS_VOICE_ID=your-preferred-voice-id

# SendGrid API Configuration (for email sending)
SENDGRID_API_KEY=your-sendgrid-api-key
SENDGRID_FROM_EMAIL=support@yourbusiness.com

# Mailchimp API Configuration (for email marketing campaigns)
MAILCHIMP_API_KEY=your-mailchimp-api-key
MAILCHIMP_SERVER_PREFIX=us1
MAILCHIMP_LIST_ID=your-mailchimp-audience-id
```

**Terraform** (`terraform.tfvars`)
```hcl
project_id = "your-gcp-project-id"
region = "us-central1"
environment = "production"
phone_number = "+15551234567"

# ElevenLabs Configuration (for enhanced text-to-speech)
elevenlabs_api_key = "your-elevenlabs-api-key"
elevenlabs_voice_id = "your-preferred-voice-id"

# SendGrid Configuration (for email sending)
sendgrid_api_key = "your-sendgrid-api-key"
sendgrid_from_email = "support@yourbusiness.com"

# Mailchimp Configuration (for email marketing campaigns)
mailchimp_api_key = "your-mailchimp-api-key"
mailchimp_server_prefix = "us1"
mailchimp_list_id = "your-mailchimp-audience-id"
```

## 🔧 Configuration

### Google Cloud Setup

1. **Enable APIs**
   - Vertex AI
   - Firestore
   - Cloud Run
   - Cloud SQL
   - Speech-to-Text
   - Text-to-Speech
   - Certificate Manager (for custom domains)

2. **Service Accounts**
   - Cloud Run service account with minimal permissions
   - Vertex AI access for Gemini 2.5 Flash
   - Firestore access for CRM data
   - Secret Manager access for SendGrid credentials

3. **Phone Number Configuration** *(Twilio Setup)*
   - Create Twilio account at twilio.com
   - Purchase phone number(s) in your desired region
   - Configure webhook URL to point to deployed Cloud Run service
   - Update terraform.tfvars with phone number and Twilio credentials

4. **Firebase Configuration** *(Automated)*
    - Firestore database automatically configured via Terraform
    - Firebase project initialized with proper permissions
    - Real-time database ready for CRM operations

5. **Custom Domain Configuration** *(Automated)*
   - Load balancer automatically configured for subdomain routing
   - SSL certificates automatically provisioned for `yourbusiness.com`
   - DNS configuration: Point your domain to the load balancer IP address

6. **SendGrid API Setup** *(Manual - for email support)*
   ```bash
   # Set up SendGrid API:
   # 1. Create SendGrid account at sendgrid.com
   # 2. Generate API key in SendGrid dashboard
   # 3. Verify your sender email address in SendGrid
   # 4. Update terraform.tfvars with SendGrid credentials
   ```

7. **Mailchimp API Setup** *(Manual - for email marketing campaigns)*
   ```bash
   # Set up Mailchimp API:
   # 1. Create Mailchimp account at mailchimp.com
   # 2. Generate API key in Account > Extras > API keys
   # 3. Create an audience/list in Mailchimp
   # 4. Note your server prefix (visible in API key URL, e.g., 'us1')
   # 5. Copy your audience/list ID from Mailchimp dashboard
   # 6. Update terraform.tfvars with Mailchimp credentials
   ```

8. **Email Integration Testing** *(Optional)*
   ```bash
   # Test email processing:
   # 1. Send test email to configured SendGrid sender address
   # 2. Verify AI agent processes and responds via SendGrid
   # 3. Check conversation history in Firestore
   # 4. Verify email delivery and response quality
   ```

10. **ElevenLabs API Setup** *(Manual - for enhanced text-to-speech)*
   ```bash
   # Set up ElevenLabs API:
   # 1. Create ElevenLabs account at elevenlabs.io
   # 2. Generate API key in account settings
   # 3. Choose preferred voice ID (optional)
   # 4. Update terraform.tfvars with ElevenLabs credentials
   ```

12. **Speech Services Testing** *(Optional)*
   ```bash
   # Test speech-to-text and text-to-speech:
   # 1. Test OpenAI Whisper transcription quality
   # 2. Test ElevenLabs voice quality and naturalness
   # 3. Verify fallback mechanisms work correctly
   # 4. Check audio processing latency
   ```

**Mailchimp Campaign Testing** *(Optional)*
```bash
# Test email marketing campaigns:
# 1. Add test subscribers via POST /api/ai/subscribe
# 2. Create test campaign via POST /api/ai/campaign
# 3. Verify campaign delivery in Mailchimp dashboard
# 4. Check campaign analytics via GET /api/ai/campaign/{id}/analytics
```

## 📊 Monitoring & Logging

- **Cloud Logging**: Centralized logging for all services
- **Cloud Monitoring**: Performance metrics and alerting
- **Error Tracking**: Comprehensive error handling and reporting
- **Conversation Analytics**: Cloud Logging and Monitoring integration

## 🔒 Security

- **Secret Management**: Google Secret Manager for sensitive data
- **IAM Permissions**: Principle of least privilege
- **Network Security**: VPC isolation and private subnets
- **API Security**: Input validation and rate limiting

## 🚨 Troubleshooting

### Common Issues

**Phone Integration Not Working**
- Verify Twilio phone number is properly configured
- Check Twilio webhook URL is accessible and pointing to correct endpoint
- Confirm Twilio credentials are correctly stored in Secret Manager
- Test Twilio API connectivity from deployed Cloud Run service

**Firestore Connection Issues**
- Verify project ID configuration
- Check IAM permissions for service account
- Ensure Firestore API is enabled

**Frontend Build Failures**
- Check Node.js version compatibility
- Verify all dependencies are installed
- Review build logs for specific errors

**CRM Access Issues**
- Verify Firebase project is properly configured
- Check that Firestore API is enabled in Google Cloud Console
- Confirm Firebase service account has proper permissions

- Access logs available in Google Cloud Console → Cloud Run → Logs

**Email Integration Issues**
- Verify SendGrid API key is correctly configured in terraform.tfvars
- Confirm SendGrid sender email is verified in SendGrid dashboard
- Check email processing logs in Cloud Run service logs
- Test SendGrid API connectivity: Verify API key has mail send permissions
- Validate email template formatting and personalization

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:
- **Phone**: [Configured phone number] - AI-powered support with CRM context *(Customers)*
- **Email**: support@yourbusiness.com *(Customers)*
- **Web**: Submit support ticket through the platform *(Customers)*
- **CRM API**: Firebase CRM - Customer management and case tracking *(Programmatic access)*
- **Admin Dashboard**: admin.yourbusiness.com - Business management and analytics *(Administrators)*
  - Real-time order and ticket monitoring
  - Customer lifetime value analytics
  - Business intelligence dashboard
  - Admin user authentication via PostgreSQL

---

**Complete Multi-Channel Business Infrastructure**: Fully automated deployment of AI-powered customer support across phone, SMS, web chat, and email with integrated CRM for seamless business acquisition and customer retention.

**Built with ❤️ using Google Cloud Platform, Vertex AI (Gemini 2.5 Flash), OpenAI (Whisper), ElevenLabs (TTS), Firebase (CRM), Firestore, Twilio API, SendGrid API, and modern web technologies.**
