# 🤖 AI-Powered Business Infrastructure

A comprehensive customer support system built on Google Cloud Platform with AI-powered conversational agents, multi-channel communication, and automated infrastructure provisioning.

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

- **AI-Powered Conversations**: Google Dialogflow CX for natural language understanding
- **Multi-Channel Support**: Phone, SMS, and web chat integration
- **CRM Integration**: SuiteCRM for customer relationship management and context *(Fully automated deployment)*
- **Persistent Memory**: Conversation history and context retention across CRM records
- **Scalable Infrastructure**: Auto-scaling Google Cloud resources with complete CRM stack
- **Modern UI**: Responsive Svelte frontend with Bootstrap styling

### 🤖 Complete Infrastructure Stack

**Fully Automated Deployment**: When you run `terraform apply`, this infrastructure automatically provisions:

- ✅ **AI Customer Support**: Dialogflow CX with phone and chat integration
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

**The Problem Solved**: Traditional business acquisitions often lose 20-30% of customers due to poor transition management. This infrastructure ensures **zero-downtime customer experience** with AI-powered support that knows every customer personally, including their complete purchase history and preferences.

**Data Migration Note**: When acquiring an existing business, simply import customer and purchase data into SuiteCRM. The AI agent will immediately have access to complete customer context for personalized support.

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
│ • Landing Page  │    │ • AI Agent      │    │ • Purchase Hist.│    │ • Dialogflow CX │
│ • Support Form  │    │ • Phone Handler │    │ • Sales Pipeline│    │ • Firestore     │
│ • Chat Interface│    │ • CRM Lookup    │    │ • Support Cases │    │ • Cloud Run     │
└─────────────────┘    └─────────────────┘    └─────────────────┘    │ • Contact Center│
                                                                   └─────────────────┘
```

### Service Integration

- **AI Agent ↔ SuiteCRM**: Real-time customer lookups during phone conversations
- **Phone Support ↔ CRM**: Automatic ticket creation and customer context retrieval
- **Web Forms ↔ CRM**: Seamless lead capture and customer record creation

## 🛠️ Infrastructure

### Google Cloud Services Used

| Service | Purpose | Configuration |
|---------|---------|---------------|
| **Cloud Run** | Serverless backend | Auto-scaling Node.js API & SuiteCRM |
| **Cloud SQL** | PostgreSQL database | SuiteCRM customer data storage |
| **Firestore** | NoSQL database | Conversation & ticket storage |
| **Dialogflow CX** | Conversational AI | Natural language processing |
| **Contact Center AI** | Phone integration | Voice/SMS handling |
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
- Dialogflow CX agent for conversations
- Contact Center Insights for analysis

**Business Applications** *(New - Fully Automated)*:
- ✅ **Cloud SQL PostgreSQL** for SuiteCRM database
- ✅ **Cloud Run service** for SuiteCRM application
- ✅ **Load Balancer** for subdomain routing (`crm.yourdomain.com`)
- ✅ **SSL Certificates** for custom domain security

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

**3. Dialogflow Processing**
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
| `/sms` | POST | Handle incoming SMS messages |
| `/voice` | POST | Process voice call input |
| `/chat` | POST | Web chat interface |
| `/crm/lookup` | POST | Customer lookup from SuiteCRM |

## 🔗 CRM Integration

### SuiteCRM Customer Context

The AI agent seamlessly integrates with SuiteCRM to provide personalized customer support experiences:

**Customer Lookup Process:**
```typescript
// AI Agent receives phone number or customer identifier
const customerContext = await lookupCustomer(phoneNumber);

// Query SuiteCRM database for customer information
const customerData = await suiteCRM.lookup({
  phone: phoneNumber,
  include: ['contact_history', 'support_cases', 'preferences']
});

// Enhance AI response with customer context
const personalizedResponse = await dialogflowCX.generateResponse({
  message,
  context: {
    customerName: customerData.first_name,
    lastInteraction: customerData.last_contact_date,
    supportHistory: customerData.case_count,
    preferences: customerData.preferences
  }
});
```

### CRM ↔ AI Agent Integration Features

- **Real-time Customer Lookup**: Phone number identification triggers instant CRM data retrieval
- **Purchase History Access**: AI agent can access complete customer purchase/order history
- **Contextual Responses**: AI responses personalized based on purchase patterns and preferences
- **Automatic Ticket Creation**: Support conversations automatically create CRM cases with purchase context
- **Conversation History Sync**: All interactions logged in both Firestore and SuiteCRM
- **Customer Preference Tracking**: Language preferences, contact methods, and service history
- **Vertical-Specific Data**: Custom fields for different business types (products, services, subscriptions)

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

### 🛒 Purchase History & Order Tracking

**SuiteCRM Customization for Purchase Data:**

SuiteCRM can be configured to track customer purchases across different business verticals:

**Standard Modules (Built-in):**
- **Opportunities**: Track sales opportunities and potential purchases
- **Accounts**: Customer company information and purchase history
- **Contacts**: Individual customer details and interaction history

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

### Customer Interaction Flow

```
1. Customer visits website (yourbusiness.com)
   ↓
2. Views landing page with support options
   ↓
3. Chooses communication method:
      ├── Phone → Google Contact Center AI
      ├── SMS → Dialogflow CX processing
      └── Web Form → Support ticket creation
   ↓
4. AI Agent processes request:
      ├── Customer identification (phone/email lookup)
      ├── CRM context retrieval from SuiteCRM
      ├── Natural language understanding
      ├── Context retrieval from Firestore
      ├── Personalized response generation
      └── Conversation history update (both Firestore & CRM)
   ↓
5. Response delivered via chosen channel with full customer context
```

### CRM Integration Flow

```
Customer Phone Call → Contact Center AI → Dialogflow CX
     ↓
Phone Number Lookup → SuiteCRM API → Customer Record Retrieval
     ↓
Customer Context (History, Preferences, Cases) → AI Agent Enhancement
     ↓
Personalized Response Generation → Customer
     ↓
Conversation & Case Updates → Both Firestore & SuiteCRM
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
DIALOGFLOW_AGENT_ID=your-agent-id
DIALOGFLOW_LOCATION=us-central1
SUPPORT_PHONE_NUMBER=+15551234567

# SuiteCRM Configuration
SUITECRM_DB_HOST=your-cloud-sql-ip
SUITECRM_DB_PORT=5432
SUITECRM_DB_NAME=suitecrm_db
SUITECRM_DB_USER=suitecrm_user
SUITECRM_DB_PASSWORD=your-secure-password
SUITECRM_URL=https://crm.yourbusiness.com
```

**Terraform** (`terraform.tfvars`)
```hcl
project_id = "your-gcp-project-id"
region = "us-central1"
environment = "production"
phone_number = "+15551234567"
```

## 🔧 Configuration

### Google Cloud Setup

1. **Enable APIs**
   - Contact Center AI
   - Dialogflow CX
   - Firestore
   - Cloud Run
   - Cloud SQL
   - Speech-to-Text
   - Text-to-Speech
   - Certificate Manager (for custom domains)

2. **Service Accounts**
   - Cloud Run service account with minimal permissions
   - Dialogflow CX agent access
   - Cloud SQL access for SuiteCRM

3. **Phone Number Configuration**
   - Configure in Google Cloud Console
   - Point webhook to deployed Cloud Run service
   - Store in Secret Manager

4. **SuiteCRM Database Setup** *(Automated)*
   - PostgreSQL instance automatically created via Terraform
   - Database and user provisioning handled automatically
   - Credentials stored securely in Secret Manager
   - Network access configured for VPC connectivity

5. **Custom Domain Configuration** *(Automated)*
   - Load balancer automatically configured for subdomain routing
   - SSL certificates automatically provisioned for `yourbusiness.com` and `crm.yourbusiness.com`
   - DNS configuration: Point your domain to the load balancer IP address

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
- Verify phone number configuration in Google Cloud Console
- Check webhook URL is accessible
- Confirm Dialogflow CX agent is published

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

**Complete Business Infrastructure**: Fully automated deployment of AI-powered customer support with integrated CRM for seamless business acquisition and customer retention.

**Built with ❤️ using Google Cloud Platform, Dialogflow CX, SuiteCRM, PostgreSQL, and modern web technologies.**
