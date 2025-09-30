import { VertexAI } from '@google-cloud/aiplatform';
import { TextToSpeechClient } from '@google-cloud/text-to-speech';
import { SpeechToTextClient } from '@google-cloud/speech';
import { Firestore } from '@google-cloud/firestore';
import { gmail } from '@google-cloud/gmail';
import OpenAI from 'openai';
import { logger } from '../utils/logger.js';
import { SuiteCRMMCPServer } from './SuiteCRMMCP.js';
import { MailchimpService } from './MailchimpService.js';

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
  private openAI: OpenAI;
  private suiteCRMMCP: SuiteCRMMCPServer;
  private mailchimp: MailchimpService;
  private elevenLabsAPIKey: string;
  private elevenLabsVoiceId: string;
  private sendGridAPIKey: string;
  private sendGridFromEmail: string;
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

    // Initialize SuiteCRM MCP server
    this.suiteCRMMCP = new SuiteCRMMCPServer();

    // Initialize Mailchimp service
    this.mailchimp = new MailchimpService();

    // Initialize OpenAI for Whisper
    this.openAI = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    // Initialize ElevenLabs credentials
    this.elevenLabsAPIKey = process.env.ELEVENLABS_API_KEY || '';
    this.elevenLabsVoiceId = process.env.ELEVENLABS_VOICE_ID || '';

    // Initialize SendGrid credentials
    this.sendGridAPIKey = process.env.SENDGRID_API_KEY || '';
    this.sendGridFromEmail = process.env.SENDGRID_FROM_EMAIL || 'support@yourbusiness.com';
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
      // Send email via SendGrid API
      const emailData = {
        personalizations: [{
          to: [{ email: to }]
        }],
        from: {
          email: this.sendGridFromEmail,
          name: 'AI Customer Support'
        },
        subject: `Re: ${subject}`,
        content: [{
          type: 'text/plain',
          value: `${response}\n\nThis is an automated response from our AI customer support system. For urgent matters, please call us directly.`
        }]
      };

      const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.sendGridAPIKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(emailData)
      });

      if (!response.ok) {
        throw new Error(`SendGrid API error: ${response.status} ${response.statusText}`);
      }

      logger.info(`Email response sent to ${to} via SendGrid`);
      return true;

    } catch (error) {
      logger.error('Error sending email response via SendGrid:', error);
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
          // Use MCP server to get comprehensive customer data
          if (identifier.phone) {
            customerContext = await this.suiteCRMMCP.executeTool('getCustomer', { phone: identifier.phone });
          } else if (identifier.email) {
            customerContext = await this.suiteCRMMCP.executeTool('getCustomer', { email: identifier.email });
          }

          if (customerContext) {
            logger.info('Retrieved comprehensive customer context for enhanced response', {
              customerId: customerContext.id,
              totalPurchases: customerContext.total_purchases,
              lifetimeValue: customerContext.lifetime_value
            });

            // Get additional context if we have customer ID
            if (customerContext.id) {
              try {
                // Get purchase history
                const purchaseHistory = await this.suiteCRMMCP.executeTool('getPurchaseHistory', {
                  customerId: customerContext.id,
                  limit: 5
                });
                customerContext.recentPurchases = purchaseHistory;

                // Get support cases
                const supportCases = await this.suiteCRMMCP.executeTool('getSupportCases', {
                  customerId: customerContext.id,
                  limit: 3
                });
                customerContext.recentSupportCases = supportCases;

                // Get customer preferences
                const preferences = await this.suiteCRMMCP.executeTool('getCustomerPreferences', {
                  customerId: customerContext.id
                });
                customerContext.preferences = preferences;

                logger.info('Retrieved comprehensive customer context including purchases and support history');
              } catch (contextError) {
                logger.warn('Could not retrieve additional customer context:', contextError);
              }
            }
          }
        }
      } catch (error) {
        logger.warn('Could not retrieve customer context, proceeding without it:', error);
      }

      // Build system prompt with customer context
      let systemPrompt = `You are a helpful customer support AI assistant for a business that uses SuiteCRM for customer management.

You have access to comprehensive customer data including purchase history, support cases, preferences, and lifetime value metrics. Use this information to provide personalized, contextual support that anticipates customer needs.

Current conversation context:
- Session ID: ${sessionId}
- Message count: ${context.messages.length}
- Channel: ${this.getChannelFromSessionId(sessionId)}`;

      if (customerContext) {
        systemPrompt += `

=== CUSTOMER PROFILE ===
Name: ${customerContext.first_name} ${customerContext.last_name}
Email: ${customerContext.email}
Phone: ${customerContext.phone}
Account Created: ${customerContext.created_date}
Last Contact: ${customerContext.last_contact_date || 'Never'}
Preferred Contact Method: ${customerContext.preferred_contact_method || 'Not specified'}
Customer Segment: ${customerContext.customer_segment || 'Standard'}
Total Purchases: ${customerContext.total_purchases || 0}
Lifetime Value: $${customerContext.lifetime_value?.toFixed(2) || '0.00'}
Tags: ${customerContext.tags?.join(', ') || 'None'}`;

        // Add purchase history if available
        if (customerContext.recentPurchases && customerContext.recentPurchases.length > 0) {
          systemPrompt += `

=== RECENT PURCHASES ===
${customerContext.recentPurchases.map((p: any) =>
  `- ${p.product_name} (${p.product_category}) - $${p.amount} on ${p.purchase_date}`
).join('\n')}`;
        }

        // Add support cases if available
        if (customerContext.recentSupportCases && customerContext.recentSupportCases.length > 0) {
          systemPrompt += `

=== RECENT SUPPORT CASES ===
${customerContext.recentSupportCases.map((c: any) =>
  `- ${c.subject} (${c.status}, ${c.priority}) - ${c.created_date}`
).join('\n')}`;
        }

        // Add preferences if available
        if (customerContext.preferences) {
          systemPrompt += `

=== CUSTOMER PREFERENCES ===
Language: ${customerContext.preferences.preferred_language}
Contact Method: ${customerContext.preferences.preferred_contact_method}
Marketing Opt-in: ${customerContext.preferences.marketing_opt_in ? 'Yes' : 'No'}
Notifications: ${customerContext.preferences.notification_preferences.join(', ')}`;
          if (customerContext.preferences.special_requirements) {
            systemPrompt += `
Special Requirements: ${customerContext.preferences.special_requirements}`;
          }
        }
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

  private getChannelFromSessionId(sessionId: string): string {
    if (sessionId.startsWith('sms_')) return 'SMS';
    if (sessionId.startsWith('voice_')) return 'Phone Call';
    if (sessionId.startsWith('email_')) return 'Email';
    return 'Web Chat';
  }

  /**
   * Speech-to-Text with fallback logic
   * Primary: OpenAI Whisper, Fallback: Google Cloud Speech-to-Text
   */
  private async speechToTextWithFallback(audioBuffer: Buffer, languageCode: string = 'en-US'): Promise<string> {
    try {
      // Try OpenAI Whisper first
      if (process.env.OPENAI_API_KEY) {
        logger.info('Using OpenAI Whisper for speech-to-text');

        // Create a file-like object for OpenAI Whisper
        const audioFile = {
          data: audioBuffer,
          name: 'audio.wav',
          type: 'audio/wav'
        } as any;

        const transcription = await this.openAI.audio.transcriptions.create({
          file: audioFile,
          model: 'whisper-1',
          language: languageCode.split('-')[0], // Extract language part (e.g., 'en' from 'en-US')
          response_format: 'text'
        });
        return transcription;
      }
    } catch (error) {
      logger.warn('OpenAI Whisper failed, falling back to Google Cloud Speech-to-Text:', error);
    }

    // Fallback to Google Cloud Speech-to-Text
    try {
      logger.info('Using Google Cloud Speech-to-Text as fallback');
      const [response] = await this.speechToTextClient.recognize({
        audio: { content: audioBuffer },
        config: {
          encoding: 'LINEAR16',
          sampleRateHertz: 16000,
          languageCode,
          enableAutomaticPunctuation: true,
        },
      });

      return response.results?.[0]?.alternatives?.[0]?.transcript || '';
    } catch (error) {
      logger.error('Google Cloud Speech-to-Text also failed:', error);
      throw new Error('All speech-to-text services failed');
    }
  }

  /**
   * Text-to-Speech with fallback logic
   * Primary: ElevenLabs, Fallback: Google Cloud Text-to-Speech
   */
  private async textToSpeechWithFallback(text: string, voiceName?: string): Promise<Buffer> {
    try {
      // Try ElevenLabs first
      if (this.elevenLabsAPIKey) {
        logger.info('Using ElevenLabs for text-to-speech');
        return await this.generateElevenLabsAudio(text, voiceName);
      }
    } catch (error) {
      logger.warn('ElevenLabs failed, falling back to Google Cloud Text-to-Speech:', error);
    }

    // Fallback to Google Cloud Text-to-Speech
    try {
      logger.info('Using Google Cloud Text-to-Speech as fallback');
      return await this.generateGoogleTTSAudio(text, voiceName);
    } catch (error) {
      logger.error('Google Cloud Text-to-Speech also failed:', error);
      throw new Error('All text-to-speech services failed');
    }
  }

  /**
   * Generate audio using ElevenLabs API
   */
  private async generateElevenLabsAudio(text: string, voiceName?: string): Promise<Buffer> {
    // Use a default voice if no specific voice ID is configured
    const voiceId = this.elevenLabsVoiceId || '21m00Tcm4TlvDq8ikWAM'; // Rachel voice

    const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
      method: 'POST',
      headers: {
        'Accept': 'audio/mpeg',
        'Content-Type': 'application/json',
        'xi-api-key': this.elevenLabsAPIKey,
      },
      body: JSON.stringify({
        text,
        model_id: 'eleven_monolingual_v1',
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.5,
          style: 0.0,
          use_speaker_boost: true
        }
      }),
    });

    if (!response.ok) {
      throw new Error(`ElevenLabs API error: ${response.status}`);
    }

    return Buffer.from(await response.arrayBuffer());
  }

  /**
   * Generate audio using Google Cloud Text-to-Speech
   */
  private async generateGoogleTTSAudio(text: string, voiceName?: string): Promise<Buffer> {
    const [response] = await this.textToSpeechClient.synthesizeSpeech({
      input: { text },
      voice: {
        languageCode: 'en-US',
        name: voiceName || 'en-US-Neural2-D', // Professional female voice
        ssmlGender: 'FEMALE',
      },
      audioConfig: {
        audioEncoding: 'LINEAR16',
        speakingRate: 1.0,
        pitch: 0.0,
      },
    });

    return response.audioContent as Buffer;
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

  /**
   * Create and send an email campaign via Mailchimp
   */
  async createEmailCampaign(
    campaignType: 'welcome' | 'promotional' | 'newsletter' | 'abandoned_cart',
    targetEmails?: string[],
    customerContext?: any
  ): Promise<string | null> {
    try {
      // Generate campaign content using AI
      const content = await this.mailchimp.generateAICampaignContent(campaignType, customerContext);

      const campaignData = {
        type: 'regular' as const,
        settings: {
          subject_line: content.subject,
          title: `${campaignType} Campaign - ${new Date().toISOString()}`,
          from_name: 'AI Customer Support',
          reply_to: this.sendGridFromEmail
        },
        content: {
          html: content.html,
          plain_text: content.plainText
        }
      };

      // If specific emails provided, create a segment for them
      let segmentId = null;
      if (targetEmails && targetEmails.length > 0) {
        segmentId = await this.createEmailSegment(targetEmails);
      }

      const campaignId = await this.mailchimp.createCampaign(campaignData, segmentId);

      if (campaignId) {
        logger.info(`Created and sent email campaign: ${campaignId} (${campaignType})`);
        return campaignId;
      }

      return null;
    } catch (error) {
      logger.error('Error creating email campaign:', error);
      return null;
    }
  }

  /**
   * Add email to Mailchimp audience
   */
  async addToEmailList(email: string, mergeFields?: Record<string, any>, tags?: string[]): Promise<boolean> {
    try {
      return await this.mailchimp.addSubscriber(email, mergeFields, tags);
    } catch (error) {
      logger.error('Error adding email to Mailchimp list:', error);
      return false;
    }
  }

  /**
   * Remove email from Mailchimp audience
   */
  async removeFromEmailList(email: string): Promise<boolean> {
    try {
      return await this.mailchimp.removeSubscriber(email);
    } catch (error) {
      logger.error('Error removing email from Mailchimp list:', error);
      return false;
    }
  }

  /**
   * Create a segment for specific emails
   */
  private async createEmailSegment(emails: string[]): Promise<string | null> {
    try {
      // For simplicity, we'll create segments based on email domains or use a basic condition
      // In a real implementation, you'd want more sophisticated segmentation
      const conditions = emails.map(email => ({
        condition_type: 'EmailAddress',
        field: 'EMAIL',
        op: 'one_of',
        value: email
      }));

      const segmentName = `Campaign Segment ${new Date().toISOString()}`;
      return await this.mailchimp.createSegment(segmentName, conditions);
    } catch (error) {
      logger.error('Error creating email segment:', error);
      return null;
    }
  }

  /**
   * Get campaign analytics
   */
  async getCampaignAnalytics(campaignId: string): Promise<any> {
    try {
      return await this.mailchimp.getCampaignReport(campaignId);
    } catch (error) {
      logger.error('Error getting campaign analytics:', error);
      return null;
    }
  }
}
