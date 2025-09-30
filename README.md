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
- **Persistent Memory**: Conversation history and context retention
- **Scalable Infrastructure**: Auto-scaling Google Cloud resources
- **Modern UI**: Responsive Svelte frontend with Bootstrap styling

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend API   │    │  Google Cloud   │
│   (Svelte)      │◄──►│   (Node.js)     │◄──►│  Services       │
│                 │    │                 │    │                 │
│ • Landing Page  │    │ • AI Agent      │    │ • Dialogflow CX │
│ • Support Form  │    │ • Phone Handler │    │ • Firestore     │
│ • Chat Interface│    │ • Data Storage  │    │ • Cloud Run     │
└─────────────────┘    └─────────────────┘    │ • Contact Center│
                                              └─────────────────┘
```

## 🛠️ Infrastructure

### Google Cloud Services Used

| Service | Purpose | Configuration |
|---------|---------|---------------|
| **Cloud Run** | Serverless backend | Auto-scaling Node.js API |
| **Firestore** | NoSQL database | Conversation & ticket storage |
| **Dialogflow CX** | Conversational AI | Natural language processing |
| **Contact Center AI** | Phone integration | Voice/SMS handling |
| **Cloud Storage** | Static hosting | Frontend assets |
| **Secret Manager** | Credential storage | API keys & phone numbers |
| **VPC Network** | Secure networking | Private subnets & NAT |

### Infrastructure Provisioning

**Terraform Configuration** (`terraform/main.tf`):
```hcl
# Core Infrastructure
- VPC with private subnets
- NAT Gateway for outbound traffic
- Service accounts with minimal permissions

# AI Services
- Dialogflow CX agent for conversations
- Contact Center Insights for analysis

# Data Storage
- Firestore database for conversations
- Cloud Storage for frontend assets

# Security
- Secret Manager for sensitive data
- IAM roles for service accounts
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
1. Customer visits website
   ↓
2. Views landing page with support options
   ↓
3. Chooses communication method:
      ├── Phone → Google Contact Center AI
      ├── SMS → Dialogflow CX processing
      └── Web Form → Support ticket creation
   ↓
4. AI Agent processes request:
      ├── Natural language understanding
      ├── Context retrieval from Firestore
      ├── Response generation
      └── Conversation history update
   ↓
5. Response delivered via chosen channel
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

**Backend Deployment** (`deployment/github-actions/backend.yml`)
- Automated testing and linting
- Docker image building and pushing
- Cloud Run service deployment
- Environment variable configuration

**Frontend Deployment** (`deployment/github-actions/frontend.yml`)
- Static site generation
- Cloud Storage upload
- SPA routing configuration

**Infrastructure** (`deployment/github-actions/terraform.yml`)
- Plan and apply infrastructure changes
- Secret management integration

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

### Environment Variables

**Backend** (`.env`)
```bash
FIRESTORE_PROJECT_ID=your-project-id
DIALOGFLOW_AGENT_ID=your-agent-id
DIALOGFLOW_LOCATION=us-central1
SUPPORT_PHONE_NUMBER=+15551234567
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
   - Speech-to-Text
   - Text-to-Speech

2. **Service Accounts**
   - Cloud Run service account with minimal permissions
   - Dialogflow CX agent access

3. **Phone Number Configuration**
   - Configure in Google Cloud Console
   - Point webhook to deployed Cloud Run service
   - Store in Secret Manager

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
- **Phone**: [Configured phone number]
- **Email**: support@yourbusiness.com
- **Web**: Submit support ticket through the platform

---

**Built with ❤️ using Google Cloud Platform, Dialogflow CX, and modern web technologies.**
