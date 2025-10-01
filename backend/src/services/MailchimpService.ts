import { logger } from '../utils/logger.js';

interface MailchimpConfig {
  apiKey: string;
  serverPrefix: string;
  listId: string;
}

interface CampaignData {
  type: 'regular' | 'plaintext' | 'absplit' | 'rss' | 'variate';
  settings: {
    subject_line: string;
    title: string;
    from_name: string;
    reply_to: string;
    template_id?: number;
  };
  content: {
    html?: string;
    plain_text?: string;
  };
}

interface SubscriberData {
  email_address: string;
  status: 'subscribed' | 'unsubscribed' | 'cleaned' | 'pending';
  merge_fields?: Record<string, any>;
  tags?: string[];
}

export class MailchimpService {
  private config: MailchimpConfig;
  private baseUrl: string;

  constructor() {
    this.config = {
      apiKey: process.env.MAILCHIMP_API_KEY || '',
      serverPrefix: process.env.MAILCHIMP_SERVER_PREFIX || 'us1',
      listId: process.env.MAILCHIMP_LIST_ID || ''
    };

    this.baseUrl = `https://${this.config.serverPrefix}.api.mailchimp.com/3.0`;

    if (!this.config.apiKey || !this.config.listId) {
      logger.warn('Mailchimp credentials not configured. Email campaigns will be disabled.');
    }
  }

  /**
   * Add or update a subscriber in the Mailchimp audience
   */
  async addSubscriber(email: string, mergeFields?: Record<string, any>, tags?: string[]): Promise<boolean> {
    try {
      if (!this.isConfigured()) {
        logger.warn('Mailchimp not configured, skipping subscriber addition');
        return false;
      }

      const subscriberData: SubscriberData = {
        email_address: email,
        status: 'subscribed',
        merge_fields: mergeFields || {},
        tags: tags || []
      };

      const response = await this.makeRequest(
        'PUT',
        `/lists/${this.config.listId}/members/${this.hashEmail(email)}`,
        subscriberData
      );

      if (response.status === 200 || response.status === 201) {
        logger.info(`Successfully added/updated subscriber: ${email}`);
        return true;
      }

      return false;
    } catch (error) {
      logger.error('Error adding subscriber to Mailchimp:', error);
      return false;
    }
  }

  /**
   * Remove a subscriber from the Mailchimp audience
   */
  async removeSubscriber(email: string): Promise<boolean> {
    try {
      if (!this.isConfigured()) {
        logger.warn('Mailchimp not configured, skipping subscriber removal');
        return false;
      }

      const response = await this.makeRequest(
        'DELETE',
        `/lists/${this.config.listId}/members/${this.hashEmail(email)}`
      );

      if (response.status === 204) {
        logger.info(`Successfully removed subscriber: ${email}`);
        return true;
      }

      return false;
    } catch (error) {
      logger.error('Error removing subscriber from Mailchimp:', error);
      return false;
    }
  }

  /**
   * Create and send a new email campaign
   */
  async createCampaign(campaignData: CampaignData, segmentId?: string): Promise<string | null> {
    try {
      if (!this.isConfigured()) {
        logger.warn('Mailchimp not configured, skipping campaign creation');
        return null;
      }

      const campaign = {
        ...campaignData,
        recipients: {
          list_id: this.config.listId,
          ...(segmentId && { segment_opts: { saved_segment_id: segmentId } })
        }
      };

      const response = await this.makeRequest('POST', '/campaigns', campaign);

      if (response.status === 201) {
        const campaignId = response.data.id;
        logger.info(`Created campaign: ${campaignId}`);

        // Send the campaign immediately
        await this.sendCampaign(campaignId);

        return campaignId;
      }

      return null;
    } catch (error) {
      logger.error('Error creating campaign:', error);
      return null;
    }
  }

  /**
   * Send a created campaign
   */
  private async sendCampaign(campaignId: string): Promise<boolean> {
    try {
      const response = await this.makeRequest('POST', `/campaigns/${campaignId}/actions/send`);

      if (response.status === 204) {
        logger.info(`Campaign sent successfully: ${campaignId}`);
        return true;
      }

      return false;
    } catch (error) {
      logger.error('Error sending campaign:', error);
      return false;
    }
  }

  /**
   * Get campaign report/analytics
   */
  async getCampaignReport(campaignId: string): Promise<any> {
    try {
      if (!this.isConfigured()) {
        return null;
      }

      const response = await this.makeRequest('GET', `/reports/${campaignId}`);

      if (response.status === 200) {
        return response.data;
      }

      return null;
    } catch (error) {
      logger.error('Error getting campaign report:', error);
      return null;
    }
  }

  /**
   * Create a segment based on customer data
   */
  async createSegment(name: string, conditions: any[]): Promise<string | null> {
    try {
      if (!this.isConfigured()) {
        return null;
      }

      const segment = {
        name,
        static_segment: conditions
      };

      const response = await this.makeRequest('POST', `/lists/${this.config.listId}/segments`, segment);

      if (response.status === 201) {
        return response.data.id;
      }

      return null;
    } catch (error) {
      logger.error('Error creating segment:', error);
      return null;
    }
  }

  /**
   * Generate AI-powered email content based on customer context
   */
  async generateAICampaignContent(
    campaignType: 'welcome' | 'promotional' | 'newsletter' | 'abandoned_cart',
    customerContext?: any
  ): Promise<{ subject: string; html: string; plainText: string }> {
    // This would integrate with the AI agent to generate personalized content
    // For now, return basic templates

    const templates = {
      welcome: {
        subject: 'Welcome to Our Business!',
        html: `
          <h2>Welcome!</h2>
          <p>Thank you for joining us. We're excited to have you as a customer.</p>
          <p>Here's what you can expect from our service...</p>
        `,
        plainText: 'Welcome! Thank you for joining us. We\'re excited to have you as a customer.'
      },
      promotional: {
        subject: 'Special Offer Just for You!',
        html: `
          <h2>Exclusive Deal!</h2>
          <p>Based on your interests, we thought you'd love this special offer.</p>
          <p>Limited time only!</p>
        `,
        plainText: 'Exclusive Deal! Based on your interests, we thought you\'d love this special offer. Limited time only!'
      },
      newsletter: {
        subject: 'Your Monthly Newsletter',
        html: `
          <h2>Monthly Update</h2>
          <p>Here's what's new and exciting in our world.</p>
          <p>Check out our latest products and services...</p>
        `,
        plainText: 'Monthly Update - Here\'s what\'s new and exciting in our world.'
      },
      abandoned_cart: {
        subject: 'Don\'t Forget About Your Cart!',
        html: `
          <h2>Items Waiting for You</h2>
          <p>You left some items in your cart. Complete your purchase now!</p>
          <p>Limited stock available.</p>
        `,
        plainText: 'Items Waiting for You - You left some items in your cart. Complete your purchase now!'
      }
    };

    return templates[campaignType] || templates.newsletter;
  }

  /**
   * Check if Mailchimp is properly configured
   */
  private isConfigured(): boolean {
    return !!(this.config.apiKey && this.config.listId && this.config.serverPrefix);
  }

  /**
   * Hash email for Mailchimp API (MD5 hash)
   */
  private hashEmail(email: string): string {
    const crypto = require('crypto');
    return crypto.createHash('md5').update(email.toLowerCase()).digest('hex');
  }

  /**
   * Make authenticated request to Mailchimp API
   */
  private async makeRequest(method: string, endpoint: string, data?: any): Promise<any> {
    const url = `${this.baseUrl}${endpoint}`;

    const headers = {
      'Authorization': `Bearer ${this.config.apiKey}`,
      'Content-Type': 'application/json'
    };

    const config: any = {
      method,
      headers,
      ...(data && (method === 'POST' || method === 'PUT') && { body: JSON.stringify(data) })
    };

    const response = await fetch(url, config);

    if (!response.ok) {
      throw new Error(`Mailchimp API error: ${response.status} ${response.statusText}`);
    }

    return {
      status: response.status,
      data: await response.json()
    };
  }
}
