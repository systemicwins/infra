# 🤖 AI-Powered Business Infrastructure

A comprehensive customer support system built on Google Cloud Platform with AI-powered conversational agents, multi-channel communication, and automated infrastructure provisioning. Note that this system is fairly complex and getting even moreso but
it's an ambitious infrastructure design intended to be a good starting point for nearly any business acquisition in any vertical.

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
- **CRM Integration**: SuiteCRM for customer relationship management and context *(Fully automated deployment)*
- **Persistent Memory**: Conversation history and context retention across CRM records
- **Scalable Infrastructure**: Auto-scaling Google Cloud resources with complete CRM stack
- **Modern UI**: Responsive Svelte frontend with Bootstrap styling

### 🤖 Complete Infrastructure Stack

**Fully Automated Deployment**: When you run `terraform apply`, this infrastructure automatically provisions:

- ✅ **AI Customer Support**: Gemini 2.5 Flash with phone and chat integration
- ✅ **CRM System**: SuiteCRM with PostgreSQL database (`crm.yourdomain.com`)
- ✅ **Load Balancing**: Subdomain routing for seamless service access
- ✅ **SSL Security**: Automatic certificate management for custom domains
- ✅ **Database Integration**: PostgreSQL with automated backups and scaling

### Subdomain Architecture

When deployed with a custom domain (e.g., `yourbusiness.com`):

- **Main Site**: `yourbusiness.com` - Landing page and support interface
- **CRM Portal**: `crm.yourbusiness.com` - SuiteCRM customer management
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

**Data Migration Note**: When acquiring an existing business, simply import customer and purchase data into SuiteCRM. The AI agent will immediately have access to complete customer context for personalized support.

### Implementing Sales Pipeline Features *(Future Enhancement)*

**To Add Complete Sales Pipeline:**

1. **Enhanced Lead Capture Forms** *(Frontend)*
   - Add detailed prospect qualification forms
   - Industry-specific lead capture pages
   - Lead scoring and qualification logic

2. **Automated Lead Nurturing** *(Backend)*
   - Email sequence automation via SuiteCRM workflows
   - Lead scoring algorithms
   - Sales team notification triggers

3. **Sales Pipeline Management** *(SuiteCRM)*
   - Custom pipeline stages for your business
   - Lead-to-opportunity conversion workflows
   - Sales forecasting and reporting

4. **AI Agent Sales Integration** *(Backend)*
   - Lead status checking during conversations
   - Sales follow-up triggering
   - Opportunity creation from qualified leads

**Implementation Timeline:** 2-4 weeks for complete sales pipeline automation.

## 📧 Email Infrastructure Integration

### Current Email Capabilities *(Customer Data Only)*

**Currently Implemented:**
- **Email as Customer Data**: Email addresses stored in SuiteCRM for customer identification
- **Email Data Import**: Import email lists from marketing platforms during acquisition
- **Email Contact Method**: Support contact form includes email field for follow-up

**Missing Email Infrastructure:**
- ❌ **No Email Server**: No SMTP server for sending emails
- ❌ **No Email Processing**: AI agent cannot receive/respond to emails
- ❌ **No Email Notifications**: No automated email alerts or responses
- ❌ **No Email Campaigns**: No marketing email capabilities

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
// SuiteCRM workflow triggers
const emailWorkflows = {
  newCustomer: 'Welcome email with AI-generated content',
  supportTicket: 'Automated acknowledgment with case details',
  purchaseConfirmation: 'Personalized thank you with recommendations'
};
```

**3. Email Marketing Integration**
```typescript
// SendGrid provides both transactional and marketing capabilities
const emailMarketing = {
  sendgrid: 'Transactional emails with AI personalization and marketing campaigns',
  mailchimp: 'Sync customer data for targeted campaigns via SendGrid webhooks',
  customSMTP: 'Self-hosted email server for complete control'
};
```

### Infrastructure Requirements for Email

**To Add Email Capabilities:**

**SendGrid Integration:**
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

**Email Processing Service:**
```typescript
// AI Agent Service handles email processing with SendGrid
// No separate email processor service needed - integrated in main AI agent
```


**Email Workflow Automation:**
```php
// SuiteCRM email workflows
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

### SuiteCRM Import Methods

**1. CSV Import (Primary Method)**
```bash
# Export from source system as CSV
# Format: customer_name,email,phone,address,purchase_history,notes

# Access SuiteCRM → Import → Select Module (Contacts/Leads/Accounts)
# Upload CSV → Map fields → Import data
# Supports: Contacts, Leads, Accounts, Opportunities, Custom Modules
```

**2. API Integration (Automated)**
```typescript
// Programmatic import via SuiteCRM REST API
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
- **CSV Import Wizard**: Built-in SuiteCRM functionality
- **SuiteCRM Plugins**: Community extensions for enhanced imports
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
const customerContext = await suiteCRM.lookupCustomer(phoneNumber);
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
- Set up SuiteCRM custom fields if needed

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
│   Frontend      │    │   Backend API   │    │   SuiteCRM      │    │  Google Cloud   │
│   (Svelte)      │◄──►│   (Node.js)     │◄──►│   (PostgreSQL)  │◄──►│  Services       │
│                 │    │                 │    │                 │    │                 │
│ • Landing Page  │    │ • AI Agent      │    │ • Purchase Hist.│    │ • Firestore     │
│ • Chat Interface│    │ • CRM Lookup    │    │ • Support Cases │    │ • Cloud Run     │
│ • Email Forms   │    │ • Email Proc.   │    │ • Email Workfl. │    │ • SendGrid API  │
└─────────────────┘    └─────────────────┘    └─────────────────┘    │ • Twilio API    │
                                                                     └─────────────────┘
```

### Service Integration

- **AI Agent ↔ SuiteCRM**: Real-time customer lookups during phone conversations
- **Phone Support ↔ CRM**: Automatic ticket creation and customer context retrieval
- **Web Forms ↔ CRM**: Seamless lead capture and customer record creation
- **Email Processing ↔ AI Agent**: AI-powered email responses with customer context *(Future Integration)*
- **CRM Workflows ↔ Email**: Automated email notifications and campaigns *(Future Integration)*
- **Customer Data ↔ Email**: Email addresses as customer identifiers across all systems

## 🛠️ Infrastructure

### Google Cloud Services Used

| Service | Purpose | Configuration |
|---------|---------|---------------|
| **Cloud Run** | Serverless backend | Auto-scaling Node.js API & SuiteCRM |
| **Cloud SQL** | PostgreSQL database | SuiteCRM customer data storage |
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
- Custom MCP server for SuiteCRM integration

**Business Applications** *(New - Fully Automated)*:
- ✅ **Cloud SQL PostgreSQL** for SuiteCRM database
- ✅ **Cloud Run service** for SuiteCRM application
- ✅ **Load Balancer** for subdomain routing (`crm.yourdomain.com`)
- ✅ **SSL Certificates** for custom domain security

**Communication Services**:
- Twilio API for phone number provisioning and telephony
- Gmail API for email processing and responses

**Data Storage**:
- Firestore database for conversations
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
- Phone/SMS via Google Contact Center AI
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
| `/email` | POST | Process incoming emails with Gemini 2.5 Flash + SendGrid |
| `/crm/mcp` | POST | Direct MCP access to SuiteCRM tools |

## 🔗 CRM Integration

### SuiteCRM Customer Context

The AI agent seamlessly integrates with SuiteCRM to provide personalized customer support experiences:

**Enhanced Customer Context Process:**
```typescript
// AI Agent receives phone number or customer identifier
const customerContext = await lookupCustomer(phoneNumber);

// Query SuiteCRM via MCP server for comprehensive customer information
const customerData = await suiteCRM.executeTool('getCustomer', {
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
- **Conversation History Sync**: All interactions logged in both Firestore and SuiteCRM with full context preservation
- **Vertical-Specific Data**: Custom fields for different business types (products, services, subscriptions, IoT, etc.)
- **Customer Lifetime Value**: AI understands customer value metrics for personalized service prioritization
- **Behavioral Analytics**: AI can reference customer behavior patterns for predictive support

### SuiteCRM Configuration

**Database Integration:**
```php
// SuiteCRM config.php for Google Cloud SQL PostgreSQL
$sugar_config['dbconfig'] = array(
    'db_type' => 'pgsql',
    'db_host_name' => 'your-cloud-sql-ip:5432',
    'db_user_name' => 'suitecrm_user',
    'db_password' => 'secure_password',
    'db_name' => 'suitecrm_db',
    'db_manager' => 'pg',
);
```

**MCP Server Integration:**
```typescript
// SuiteCRM MCP server provides real-time data access
const suiteCRMMCP = new SuiteCRMMCPServer();

// MCP tools available to AI agent
const availableTools = [
  'getCustomer',           // Customer profile and contact info
  'getPurchaseHistory',    // Complete purchase history with categories
  'getSupportCases',       // Support case history with resolution details
  'getCustomerPreferences', // Communication and service preferences
  'createSupportTicket',   // Create new support cases
  'updateCustomerContactInfo', // Update customer contact information
  'getCustomerLifetimeValue'   // Customer value metrics and analytics
];
```

### 🔐 SuiteCRM Authentication & Access

**Default Admin Account:**
- **URL**: `https://crm.yourdomain.com`
- **Username**: `admin`
- **Password**: Configured via `suitecrm_admin_password` Terraform variable

**Access Control Features:**
- **User Management**: Create additional users and assign roles
- **Role-Based Access**: Control permissions for different user types
- **Password Policies**: Configure password requirements and expiration
- **Session Management**: Automatic logout and session security
- **SSL Required**: All access through secure HTTPS connection

## 🎯 Sales Pipeline & Lead Management

### Current Lead Capture Capabilities *(Basic)*

**Currently Implemented:**
- **Newsletter Signup**: Email capture from homepage
- **Support Tickets**: Contact information from support requests
- **Basic CRM Modules**: SuiteCRM supports Leads, Accounts, and Opportunities

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

### SuiteCRM Sales Pipeline Modules

**Built-in Sales Modules:**
- **Leads**: Prospect information and qualification status
- **Accounts**: Company/organization information
- **Contacts**: Individual contact details
- **Opportunities**: Sales opportunities with value and stage tracking
- **Activities**: Calls, meetings, emails, and tasks
- **Reports**: Sales performance and pipeline analytics

**Custom Configuration (Post-Deployment):**
```php
// Example: Custom module for product purchases
$sugar_config['custom_modules'] = array(
    'Purchases' => array(
        'customer_id' => 'relate',
        'product_name' => 'varchar(255)',
        'purchase_date' => 'date',
        'amount' => 'currency',
        'status' => 'enum', // pending, completed, refunded
        'category' => 'enum' // electronics, services, subscriptions
    )
);
```

**AI Agent Integration:**
```typescript
// AI Agent retrieves purchase context during calls
const customerPurchases = await suiteCRM.getPurchases({
  customerId: customerData.id,
  includeHistory: true,
  limit: 10 // Last 10 purchases
});

// Enhance AI response with purchase context
const purchaseContext = customerPurchases.map(p => ({
  product: p.product_name,
  date: p.purchase_date,
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

  // Create in SuiteCRM Leads module
  await suiteCRM.createLead(leadData);

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
```php
// SuiteCRM workflow for lead nurturing
$sugar_config['lead_nurturing'] = array(
    'welcome_series' => array(
        'trigger' => 'new_lead_created',
        'emails' => array(
            'day_1' => 'Welcome and value proposition',
            'day_3' => 'Case study or demo offer',
            'day_7' => 'Product benefits deep dive',
            'day_14' => 'Call-to-action for sales contact'
        )
    )
);
```

### Sales Pipeline Integration

**CRM ↔ AI Agent Integration for Sales:**
```typescript
// AI agent can access lead status during conversations
const leadContext = await suiteCRM.getLeadStatus(customerEmail);
// Returns: { stage: 'MQL', score: 75, nurturing: 'day_7_sent' }

const salesResponse = await aiAgent.generate({
  message,
  context: customerContext,
  leadStatus: leadContext,
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
Customer Identification → SuiteCRM MCP → Customer Record Retrieval
     ↓
Customer Context (History, Preferences, Cases, Purchase Data) → AI Agent Enhancement
     ↓
Personalized Response Generation → Customer
     ↓
Conversation & Case Updates → Both Firestore & SuiteCRM
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
      ├── CRM context retrieval from SuiteCRM (via MCP)
      ├── Natural language understanding (Gemini 2.5 Flash)
      ├── Context retrieval from Firestore
      ├── Speech-to-text processing (OpenAI Whisper)
      ├── Text-to-speech generation (ElevenLabs)
      ├── Personalized response generation
      ├── Email response sending (for email channel via SendGrid)
      └── Conversation history update (both Firestore & SuiteCRM)
   ↓
5. Response delivered via chosen channel with full customer context
```

### CRM Integration Flow

```
Customer Interaction (Phone/SMS/Email/Web) → Multi-Channel Processing
     ↓
Customer Identification → SuiteCRM API → Customer Record Retrieval
     ↓
Customer Context (History, Preferences, Cases, Purchase Data) → AI Agent Enhancement
     ↓
Personalized Response Generation → Customer
     ↓
Conversation & Case Updates → Both Firestore & SuiteCRM
     ↓
Email Auto-Response (if email channel) → Gmail API
```

**Email-Specific Flow:**
```
Customer Email → Email Processing → Gemini 2.5 Flash (AI Agent)
     ↓
Email Content Analysis → Intent Recognition
     ↓
Customer Lookup by Email → SuiteCRM (MCP) → Purchase & Support History
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
🔍 Customer Lookup → SuiteCRM MCP → Customer Context & History
     ↓
🤖 Gemini 2.5 Flash → AI Response Generation
     ↓
📤 SMS Response → Twilio SMS API → Customer
```

**Email Flow:**
```
📧 Email Received → Email Processing → Customer Identification
     ↓
🔍 CRM Lookup → SuiteCRM MCP → Customer Context & History
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
  const customerContext = await suiteCRMMCP.getCustomer({ phone: extractPhone(audioStream) });
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
5. CRM lookup → SuiteCRM MCP queries customer database
6. Context enhancement → Gemini 2.5 Flash processes with customer history
7. Response generation → AI creates personalized response
8. Audio synthesis → ElevenLabs converts text to natural speech
9. Response delivery → Twilio streams audio back to customer
10. Conversation logging → Both Firestore and SuiteCRM updated
```

**💬 SMS/Text Message Processing:**
```
1. Customer sends SMS → Twilio receives message via webhook
2. Message processing → Extract sender phone number and content
3. Customer identification → SuiteCRM MCP lookup by phone
4. Context retrieval → Get customer's purchase history and preferences
5. AI processing → Gemini 2.5 Flash generates contextual response
6. Response delivery → Twilio sends SMS reply to customer
7. Conversation tracking → Update Firestore and SuiteCRM records
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
3. Customer identification → SuiteCRM MCP lookup by email
4. Context enhancement → Get customer's support history and preferences
5. AI processing → Gemini 2.5 Flash generates contextual email response
6. Email composition → Create personalized email reply
7. Response delivery → SendGrid sends email to customer
8. Conversation tracking → Update both systems with interaction
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
- Cloud Run service deployment (AI Agent & SuiteCRM)
- Environment variable configuration
- Database migration and seeding

**Frontend Deployment** (`deployment/github-actions/frontend.yml`)
- Static site generation
- Cloud Storage upload
- SPA routing configuration

**Infrastructure** (`deployment/github-actions/terraform.yml`)
- Plan and apply infrastructure changes
- Secret management integration
- Cloud SQL database provisioning
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

3. **Configure Phone Number**
   - Access Google Cloud Console
   - Navigate to Contact Center AI
   - Configure phone number and webhook URL
   - Update Secret Manager with phone number

4. **Deploy Application**
   ```bash
   # Push to main branch to trigger automated deployment
   git push origin main
   ```

5. **Verify CRM Integration**
   ```bash
   # Check that all services are running
   terraform output

   # Access CRM at crm.yourdomain.com
   # Login with initial admin credentials (from terraform variables)
   # AI agent will automatically lookup customers during phone calls
   ```

6. **Initial CRM Setup** *(One-time manual step)*
   ```bash
   # Access: https://crm.yourdomain.com
   # Username: admin
   # Password: [from your suitecrm_admin_password variable]

   # Complete initial setup wizard:
   # - Configure system settings
   # - Set up additional users
   # - Import customer data (if migrating from existing system)
   # - Configure email settings and integrations
   # - Set up purchase/order tracking modules for your business vertical
   # - Import historical purchase data for AI context
   ```

### Environment Variables

**Backend** (`.env`)
```bash
FIRESTORE_PROJECT_ID=your-project-id
VERTEX_AI_LOCATION=us-central1
SUPPORT_PHONE_NUMBER=+15551234567

# SuiteCRM Configuration
SUITECRM_DB_HOST=your-cloud-sql-ip
SUITECRM_DB_PORT=5432
SUITECRM_DB_NAME=suitecrm_db
SUITECRM_DB_USER=suitecrm_user
SUITECRM_DB_PASSWORD=your-secure-password
SUITECRM_URL=https://crm.yourbusiness.com
# ElevenLabs API Configuration (for enhanced text-to-speech)
ELEVENLABS_API_KEY=your-elevenlabs-api-key
ELEVENLABS_VOICE_ID=your-preferred-voice-id

# SendGrid API Configuration (for email sending)
SENDGRID_API_KEY=your-sendgrid-api-key
SENDGRID_FROM_EMAIL=support@yourbusiness.com
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
   - Cloud SQL access for SuiteCRM
   - Secret Manager access for SendGrid credentials

3. **Phone Number Configuration** *(Twilio Setup)*
   - Set up Twilio account and purchase phone numbers
   - Configure Twilio webhooks to point to deployed Cloud Run service
   - Store Twilio credentials in Secret Manager
   - Configure Twilio for voice and SMS handling

4. **SuiteCRM Database Setup** *(Automated)*
   - PostgreSQL instance automatically created via Terraform
   - Database and user provisioning handled automatically
   - Credentials stored securely in Secret Manager
   - Network access configured for VPC connectivity

5. **Custom Domain Configuration** *(Automated)*
   - Load balancer automatically configured for subdomain routing
   - SSL certificates automatically provisioned for `yourbusiness.com` and `crm.yourbusiness.com`
   - DNS configuration: Point your domain to the load balancer IP address

6. **SendGrid API Setup** *(Manual - for email support)*
   ```bash
   # Set up SendGrid API:
   # 1. Create SendGrid account at sendgrid.com
   # 2. Generate API key in SendGrid dashboard
   # 3. Verify your sender email address in SendGrid
   # 4. Update terraform.tfvars with SendGrid credentials
   ```

7. **Email Integration Testing** *(Optional)*
   ```bash
   # Test email processing:
   # 1. Send test email to configured SendGrid sender address
   # 2. Verify AI agent processes and responds via SendGrid
   # 3. Check conversation history in Firestore
   # 4. Verify email delivery and response quality
   ```

8. **ElevenLabs API Setup** *(Manual - for enhanced text-to-speech)*
   ```bash
   # Set up ElevenLabs API:
   # 1. Create ElevenLabs account at elevenlabs.io
   # 2. Generate API key in account settings
   # 3. Choose preferred voice ID (optional)
   # 4. Update terraform.tfvars with ElevenLabs credentials
   ```

9. **Speech Services Testing** *(Optional)*
   ```bash
   # Test speech-to-text and text-to-speech:
   # 1. Test OpenAI Whisper transcription quality
   # 2. Test ElevenLabs voice quality and naturalness
   # 3. Verify fallback mechanisms work correctly
   # 4. Check audio processing latency
   ```

## 📊 Monitoring & Logging

- **Cloud Logging**: Centralized logging for all services
- **Cloud Monitoring**: Performance metrics and alerting
- **Error Tracking**: Comprehensive error handling and reporting
- **Conversation Analytics**: Contact Center Insights integration

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
- Verify SSL certificate is properly configured for crm.yourdomain.com
- Check that SuiteCRM service is running: `terraform output suitecrm_service_url`
- Confirm admin password is correctly set in Terraform variables
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
- **CRM Portal**: crm.yourbusiness.com - Customer management and case tracking *(Administrators)*
  - Login: admin / [suitecrm_admin_password from Terraform variables]

---

**Complete Multi-Channel Business Infrastructure**: Fully automated deployment of AI-powered customer support across phone, SMS, web chat, and email with integrated CRM for seamless business acquisition and customer retention.

**Built with ❤️ using Google Cloud Platform, Vertex AI (Gemini 2.5 Flash), OpenAI (Whisper), ElevenLabs (TTS), SuiteCRM (MCP Integration), PostgreSQL, Twilio API, SendGrid API, and modern web technologies.**
