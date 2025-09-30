import { VertexAI } from '@google-cloud/aiplatform';
import { TextToSpeechClient } from '@google-cloud/text-to-speech';
import { SpeechToTextClient } from '@google-cloud/speech';
import { Firestore } from '@google-cloud/firestore';
import { gmail } from '@google-cloud/gmail';
import { logger } from '../utils/logger.js';
import { SuiteCRMMCPServer } from './SuiteCRMMCP.js';

interface ConversationContext {
  sessionId: string;
  messages: Array<{
    role: 'user' | 'assistant' | 'system';
    content: string;
    timestamp: Date;
  }>;
  customerInfo?: {
    name?: string;
    email?: string;
    phone?: string;
    previousIssues?: string[];
  };
  currentIntent?: string;
  escalationRequested?: boolean;
}

export class AIAgentService {
  private vertexAI: VertexAI;
  private textToSpeechClient: TextToSpeechClient;
  private speechToTextClient: SpeechToTextClient;
  private firestore: Firestore;
  private gmailClient: any;
  private suiteCRMMCP: SuiteCRMMCPServer;
  private projectId: string;
  private location: string;

  constructor() {
    // Initialize Google Cloud clients
    this.projectId = process.env.FIRESTORE_PROJECT_ID || 'your-project-id';
    this.location = process.env.VERTEX_AI_LOCATION || 'us-central1';

    // Initialize Vertex AI with Gemini 2.5 Flash
    this.vertexAI = new VertexAI({
      project: this.projectId,
      location: this.location,
    });

    this.textToSpeechClient = new TextToSpeechClient({
      projectId: this.projectId,
    });

    this.speechToTextClient = new SpeechToTextClient({
      projectId: this.projectId,
    });

    // Initialize Firestore
    this.firestore = new Firestore({
      projectId: this.projectId,
    });

    // Initialize Gmail client
    this.gmailClient = new gmail.Gmail({
      projectId: this.projectId,
    });

    // Initialize SuiteCRM MCP server
    this.suiteCRMMCP = new SuiteCRMMCPServer();
  }

  async processSMS(from: string, message: string): Promise<string> {
    try {
      // Get or create conversation context
      const sessionId = this.generateSessionId(from, 'sms');
      let context = await this.getConversationContext(sessionId);

      if (!context) {
        context = this.createNewContext(sessionId, from);
      }

      // Add user message to context
      context.messages.push({
        role: 'user',
        content: message,
        timestamp: new Date(),
      });

      // Process with Gemini 2.5 Flash + MCP
      const geminiResponse = await this.processWithGemini(sessionId, message, context);

      // Add AI response to context
      context.messages.push({
        role: 'assistant',
        content: geminiResponse,
        timestamp: new Date(),
      });

      // Save updated context
      await this.saveConversationContext(context);

      return geminiResponse;

    } catch (error) {
      logger.error('Error processing SMS:', error);
      return "I'm sorry, I'm having trouble processing your message right now. Please try again in a few minutes or contact us through our web portal.";
    }
  }

  async processVoice(from: string, speech: string): Promise<string> {
    try {
      // Voice processing is similar to SMS but with speech context
      const sessionId = this.generateSessionId(from, 'voice');
      let context = await this.getConversationContext(sessionId);

      if (!context) {
        context = this.createNewContext(sessionId, from);
      }

      // Add user message to context
      context.messages.push({
        role: 'user',
        content: speech,
        timestamp: new Date(),
      });

      // Process with Gemini 2.5 Flash + MCP
      const geminiResponse = await this.processWithGemini(sessionId, speech, context);

      // Add AI response to context
      context.messages.push({
        role: 'assistant',
        content: geminiResponse,
        timestamp: new Date(),
      });

      // Save updated context
      await this.saveConversationContext(context);

      return geminiResponse;

    } catch (error) {
      logger.error('Error processing voice:', error);
      return "I'm sorry, I'm having trouble processing your request right now. Please try again in a few minutes.";
    }
  }

  async processChat(message: string, sessionId?: string): Promise<string> {
    try {
      const context = await this.getConversationContext(sessionId || 'web-chat');

      if (!context) {
        const newContext = this.createNewContext(sessionId || 'web-chat');
        newContext.messages.push({
          role: 'user',
          content: message,
          timestamp: new Date(),
        });

        const response = await this.processWithGemini(sessionId || 'web-chat', message, newContext);
        newContext.messages.push({
          role: 'assistant',
          content: response,
          timestamp: new Date(),
        });

        await this.saveConversationContext(newContext);
        return response;
      }

      // Add user message and generate response
      context.messages.push({
        role: 'user',
        content: message,
        timestamp: new Date(),
      });

      const response = await this.processWithGemini(sessionId || 'web-chat', message, context);

      context.messages.push({
        role: 'assistant',
        content: response,
        timestamp: new Date(),
      });

      await this.saveConversationContext(context);
      return response;

    } catch (error) {
      logger.error('Error processing chat:', error);
      return "I'm sorry, I'm having trouble processing your message. Please try again.";
    }
  }

  async processEmail(from: string, subject: string, body: string): Promise<string> {
    try {
      // Get or create conversation context for email
      const sessionId = this.generateSessionId(from, 'email');
      let context = await this.getConversationContext(sessionId);

      if (!context) {
        context = this.createNewContext(sessionId, from);
      }

      // Add email content to context
      context.messages.push({
        role: 'user',
        content: `Subject: ${subject}\n\n${body}`,
        timestamp: new Date(),
      });

      // Process with Gemini 2.5 Flash + MCP
      const geminiResponse = await this.processWithGemini(sessionId, `Email: ${subject} - ${body}`, context);

      // Add AI response to context
      context.messages.push({
        role: 'assistant',
        content: geminiResponse,
        timestamp: new Date(),
      });

      // Save updated context
      await this.saveConversationContext(context);

      return geminiResponse;

    } catch (error) {
      logger.error('Error processing email:', error);
      return "Thank you for your email. I'm processing your inquiry and will respond shortly.";
    }
  }

  async sendEmailResponse(to: string, subject: string, response: string): Promise<boolean> {
    try {
      // Create email message
      const emailContent = [
        'To: ' + to,
        'Subject: Re: ' + subject,
        'Content-Type: text/plain; charset=UTF-8',
        '',
        response,
        '',
        'This is an automated response from our AI customer support system.',
        'For urgent matters, please call us directly.'
      ].join('\r\n');

      const encodedMessage = Buffer.from(emailContent)
        .toString('base64')
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');

      // Send email via Gmail API
      await this.gmailClient.users.messages.send({
        userId: 'me',
        requestBody: {
          raw: encodedMessage
        }
      });

      logger.info(`Email response sent to ${to}`);
      return true;

    } catch (error) {
      logger.error('Error sending email response:', error);
      return false;
    }
  }

  private async processWithGemini(sessionId: string, message: string, context: ConversationContext): Promise<string> {
    try {
      // Get the generative model (Gemini 2.5 Flash)
      const generativeModel = this.vertexAI.getGenerativeModel({
        model: 'gemini-2.5-flash',
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 2048,
        },
      });

      // Build conversation history for context
      const conversationHistory = context.messages.map(msg => ({
        role: msg.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: msg.content }]
      }));

      // Try to get customer context from MCP server
      let customerContext = null;
      try {
        // Extract phone/email from session ID or context
        const identifier = this.extractCustomerIdentifier(sessionId, context);

        if (identifier) {
          customerContext = await this.suiteCRMMCP.executeTool('getCustomer', identifier);
          logger.info('Retrieved customer context for enhanced response', { customerId: customerContext?.id });
        }
      } catch (error) {
        logger.warn('Could not retrieve customer context, proceeding without it:', error);
      }

      // Build system prompt with customer context
      let systemPrompt = `You are a helpful customer support AI assistant for a business that uses SuiteCRM for customer management.

You have access to customer data including purchase history, support cases, and preferences. Use this information to provide personalized, contextual support.

Current conversation context:
- Session ID: ${sessionId}
- Message count: ${context.messages.length}`;

      if (customerContext) {
        systemPrompt += `

Customer Information:
- Name: ${customerContext.first_name} ${customerContext.last_name}
- Email: ${customerContext.email}
- Phone: ${customerContext.phone}
- Account created: ${customerContext.created_date}
- Last contact: ${customerContext.last_contact_date || 'Never'}`;
      }

      systemPrompt += `

Guidelines:
- Be helpful, professional, and empathetic
- Use customer context when available to personalize responses
- If you need more information, ask politely
- Escalate to human support if the issue is complex
- Keep responses conversational and natural

Respond to the customer's message:`;

      // Create the chat session
      const chat = generativeModel.startChat({
        history: conversationHistory,
        systemInstruction: systemPrompt,
      });

      // Send the message
      const result = await chat.sendMessage(message);
      const response = result.response.text();

      logger.info('Generated Gemini response', {
        sessionId,
        messageLength: message.length,
        responseLength: response.length,
        hasCustomerContext: !!customerContext
      });

      return response;

    } catch (error) {
      logger.error('Error processing with Gemini:', error);
      return 'I apologize, but I\'m experiencing technical difficulties. Please try again or contact our support team directly.';
    }
  }

  private extractCustomerIdentifier(sessionId: string, context: ConversationContext): { phone?: string; email?: string } | null {
    // Extract phone/email from session ID or conversation context
    // Session ID format: sms_phone_number_timestamp or email_email_address_timestamp
    const parts = sessionId.split('_');

    if (parts.length >= 2) {
      const identifier = parts[1];

      // Check if it looks like a phone number (contains digits and common phone symbols)
      if (/^[\d\+\-\(\)\s]+$/.test(identifier) && identifier.length >= 10) {
        return { phone: identifier.replace(/[^\d]/g, '') };
      }

      // Check if it looks like an email
      if (identifier.includes('@') && identifier.includes('.')) {
        return { email: identifier };
      }
    }

    return null;
  }


  private generateSessionId(phone: string, type: string = 'sms'): string {
    return `${type}_${phone.replace(/[^0-9]/g, '')}_${Date.now()}`;
  }

  private createNewContext(sessionId: string, identifier?: string): ConversationContext {
    return {
      sessionId,
      messages: [],
      currentIntent: 'general',
      escalationRequested: false
    };
  }

  private async getConversationContext(sessionId: string): Promise<ConversationContext | null> {
    try {
      const doc = await this.firestore.collection('conversations').doc(sessionId).get();
      return doc.exists ? (doc.data() as ConversationContext) : null;
    } catch (error) {
      logger.error('Error getting conversation context:', error);
      return null;
    }
  }

  private async saveConversationContext(context: ConversationContext): Promise<void> {
    try {
      // Keep only last 20 messages to manage Firestore document size
      context.messages = context.messages.slice(-20);

      await this.firestore.collection('conversations').doc(context.sessionId).set(context);
    } catch (error) {
      logger.error('Error saving conversation context:', error);
    }
  }
}
