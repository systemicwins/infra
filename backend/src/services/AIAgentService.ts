import { SessionsClient } from '@google-cloud/dialogflow-cx';
import { TextToSpeechClient } from '@google-cloud/text-to-speech';
import { SpeechToTextClient } from '@google-cloud/speech';
import { Firestore } from '@google-cloud/firestore';
import { gmail } from '@google-cloud/gmail';
import { logger } from '../utils/logger.js';

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
  private sessionsClient: SessionsClient;
  private textToSpeechClient: TextToSpeechClient;
  private speechToTextClient: SpeechToTextClient;
  private firestore: Firestore;
  private gmailClient: any;
  private projectId: string;
  private agentId: string;
  private location: string;

  constructor() {
    // Initialize Google Cloud clients
    this.projectId = process.env.FIRESTORE_PROJECT_ID || 'your-project-id';
    this.location = process.env.DIALOGFLOW_LOCATION || 'us-central1';

    this.sessionsClient = new SessionsClient({
      projectId: this.projectId,
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

    // Dialogflow CX Agent ID (will be provided by Terraform output)
    this.agentId = process.env.DIALOGFLOW_AGENT_ID || 'your-agent-id';
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

      // Process with Dialogflow CX
      const dialogflowResponse = await this.processWithDialogflow(sessionId, message);

      // Add AI response to context
      context.messages.push({
        role: 'assistant',
        content: dialogflowResponse,
        timestamp: new Date(),
      });

      // Save updated context
      await this.saveConversationContext(context);

      return dialogflowResponse;

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

      // Process with Dialogflow CX
      const dialogflowResponse = await this.processWithDialogflow(sessionId, speech);

      // Add AI response to context
      context.messages.push({
        role: 'assistant',
        content: dialogflowResponse,
        timestamp: new Date(),
      });

      // Save updated context
      await this.saveConversationContext(context);

      return dialogflowResponse;

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

        const response = await this.processWithDialogflow(sessionId || 'web-chat', message);
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

      const response = await this.processWithDialogflow(sessionId || 'web-chat', message);

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

      // Process with Dialogflow CX
      const dialogflowResponse = await this.processWithDialogflow(sessionId, `Email: ${subject} - ${body}`);

      // Add AI response to context
      context.messages.push({
        role: 'assistant',
        content: dialogflowResponse,
        timestamp: new Date(),
      });

      // Save updated context
      await this.saveConversationContext(context);

      return dialogflowResponse;

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

  private async processWithDialogflow(sessionId: string, message: string): Promise<string> {
    try {
      // Create session path
      const sessionPath = this.sessionsClient.projectLocationAgentSessionPath(
        this.projectId,
        this.location,
        this.agentId,
        sessionId
      );

      // Create detect intent request
      const request = {
        session: sessionPath,
        queryInput: {
          text: {
            text: message,
          },
          languageCode: 'en',
        },
      };

      // Detect intent
      const [response] = await this.sessionsClient.detectIntent(request);

      if (response.queryResult?.responseMessages) {
        // Extract text response from Dialogflow
        const textMessages = response.queryResult.responseMessages.filter(
          msg => msg.text && msg.text.text
        );

        if (textMessages.length > 0) {
          return textMessages[0].text?.text?.[0] || 'I understand your concern. Let me help you with that.';
        }
      }

      return 'I understand your concern. Let me help you with that.';

    } catch (error) {
      logger.error('Error processing with Dialogflow:', error);
      return 'I apologize, but I\'m experiencing technical difficulties. Please try again or contact our support team directly.';
    }
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
