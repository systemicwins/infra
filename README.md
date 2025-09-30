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

- **📞 Personalized Support**: AI agents instantly recognize customers and provide context-aware responses
- **🎯 Customer Retention**: Access to complete customer history prevents service disruption during transition
- **📊 Business Intelligence**: Immediate visibility into customer base, sales pipeline, and support metrics
- **🔄 Operational Continuity**: Existing customers continue receiving support without interruption
- **📈 Growth Acceleration**: New customer acquisition supported by robust CRM and AI-powered engagement

**The Problem Solved**: Traditional business acquisitions often lose 20-30% of customers due to poor transition management. This infrastructure ensures **zero-downtime customer experience** with AI-powered support that knows every customer personally.

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend API   │    │   SuiteCRM      │    │  Google Cloud   │
│   (Svelte)      │◄──►│   (Node.js)     │◄──►│   (PostgreSQL)  │◄──►│  Services       │
│                 │    │                 │    │                 │    │                 │
│ • Landing Page  │    │ • AI Agent      │    │ • Customer Data │    │ • Dialogflow CX │
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
- **Contextual Responses**: AI responses personalized based on customer history and preferences
- **Automatic Ticket Creation**: Support conversations automatically create CRM cases
- **Conversation History Sync**: All interactions logged in both Firestore and SuiteCRM
- **Customer Preference Tracking**: Language preferences, contact methods, and service history

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
   # AI agent will automatically lookup customers during phone calls
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
- **Phone**: [Configured phone number] - AI-powered support with CRM context
- **Email**: support@yourbusiness.com
- **Web**: Submit support ticket through the platform
- **CRM Portal**: crm.yourbusiness.com - Customer management and case tracking

---

**Complete Business Infrastructure**: Fully automated deployment of AI-powered customer support with integrated CRM for seamless business acquisition and customer retention.

**Built with ❤️ using Google Cloud Platform, Dialogflow CX, SuiteCRM, PostgreSQL, and modern web technologies.**
