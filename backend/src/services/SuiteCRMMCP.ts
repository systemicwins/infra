import { logger } from '../utils/logger.js';

interface MCPServer {
  name: string;
  description: string;
  tools: MCPTool[];
  resources?: MCPResource[];
}

interface MCPTool {
  name: string;
  description: string;
  inputSchema: {
    type: string;
    properties: Record<string, any>;
    required?: string[];
  };
}

interface MCPResource {
  uri: string;
  mimeType: string;
  description: string;
}

interface CustomerData {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  account_id?: string;
  created_date: string;
  last_contact_date?: string;
  total_purchases?: number;
  lifetime_value?: number;
  preferred_contact_method?: string;
  tags?: string[];
}

interface PurchaseHistory {
  id: string;
  customer_id: string;
  product_name: string;
  product_category: string;
  purchase_date: string;
  amount: number;
  status: string;
  quantity?: number;
}

interface SupportCase {
  id: string;
  customer_id: string;
  subject: string;
  status: string;
  priority: string;
  created_date: string;
  updated_date?: string;
  description: string;
  resolution?: string;
  assigned_to?: string;
}

interface CustomerPreferences {
  preferred_language: string;
  preferred_contact_method: string;
  marketing_opt_in: boolean;
  notification_preferences: string[];
  special_requirements?: string;
}

export class SuiteCRMMCPServer implements MCPServer {
  name = "suitecrm";
  description = "SuiteCRM customer relationship management system with comprehensive customer data access";

  tools: MCPTool[] = [
    {
      name: "getCustomer",
      description: "Look up comprehensive customer information by phone number, email, or customer ID",
      inputSchema: {
        type: "object",
        properties: {
          phone: { type: "string", description: "Customer phone number" },
          email: { type: "string", description: "Customer email address" },
          customerId: { type: "string", description: "Customer ID from previous lookup" }
        },
        required: [] // At least one identifier required
      }
    },
    {
      name: "getPurchaseHistory",
      description: "Get customer's complete purchase history with detailed transaction data",
      inputSchema: {
        type: "object",
        properties: {
          customerId: { type: "string", description: "Customer ID from getCustomer" },
          limit: { type: "number", description: "Number of records to return", default: 10 },
          startDate: { type: "string", description: "Start date for purchase history (YYYY-MM-DD)" },
          endDate: { type: "string", description: "End date for purchase history (YYYY-MM-DD)" },
          category: { type: "string", description: "Filter by product category" }
        },
        required: ["customerId"]
      }
    },
    {
      name: "getSupportCases",
      description: "Get customer's support case history with detailed case information",
      inputSchema: {
        type: "object",
        properties: {
          customerId: { type: "string", description: "Customer ID from getCustomer" },
          status: { type: "string", description: "Filter by case status (open, closed, in_progress, etc.)" },
          priority: { type: "string", description: "Filter by priority (low, medium, high, urgent)" },
          limit: { type: "number", description: "Number of records to return", default: 10 },
          startDate: { type: "string", description: "Start date for case history (YYYY-MM-DD)" }
        },
        required: ["customerId"]
      }
    },
    {
      name: "getCustomerPreferences",
      description: "Get customer's communication and service preferences",
      inputSchema: {
        type: "object",
        properties: {
          customerId: { type: "string", description: "Customer ID from getCustomer" }
        },
        required: ["customerId"]
      }
    },
    {
      name: "createSupportTicket",
      description: "Create a new support ticket for a customer with full context",
      inputSchema: {
        type: "object",
        properties: {
          customerId: { type: "string", description: "Customer ID from getCustomer" },
          subject: { type: "string", description: "Ticket subject" },
          description: { type: "string", description: "Detailed ticket description" },
          priority: { type: "string", description: "Ticket priority (low, medium, high, urgent)", default: "medium" },
          category: { type: "string", description: "Support category (technical, billing, general)" },
          source: { type: "string", description: "How customer contacted us", default: "ai_agent" }
        },
        required: ["customerId", "subject", "description"]
      }
    },
    {
      name: "updateCustomerContactInfo",
      description: "Update customer's contact information",
      inputSchema: {
        type: "object",
        properties: {
          customerId: { type: "string", description: "Customer ID from getCustomer" },
          email: { type: "string", description: "New email address" },
          phone: { type: "string", description: "New phone number" },
          preferred_contact_method: { type: "string", description: "Preferred contact method" }
        },
        required: ["customerId"]
      }
    },
    {
      name: "getCustomerLifetimeValue",
      description: "Calculate and return customer's lifetime value metrics",
      inputSchema: {
        type: "object",
        properties: {
          customerId: { type: "string", description: "Customer ID from getCustomer" }
        },
        required: ["customerId"]
      }
    }
  ];

  constructor() {
    logger.info('SuiteCRM MCP Server initialized with comprehensive CRM functionality');
  }

  async executeTool(toolName: string, params: any): Promise<any> {
    try {
      logger.info(`Executing MCP tool: ${toolName}`, { params });

      switch (toolName) {
        case 'getCustomer':
          return await this.getCustomer(params);
        case 'getPurchaseHistory':
          return await this.getPurchaseHistory(params);
        case 'getSupportCases':
          return await this.getSupportCases(params);
        case 'getCustomerPreferences':
          return await this.getCustomerPreferences(params);
        case 'createSupportTicket':
          return await this.createSupportTicket(params);
        case 'updateCustomerContactInfo':
          return await this.updateCustomerContactInfo(params);
        case 'getCustomerLifetimeValue':
          return await this.getCustomerLifetimeValue(params);
        default:
          throw new Error(`Unknown tool: ${toolName}`);
      }
    } catch (error) {
      logger.error(`Error executing MCP tool ${toolName}:`, error);
      throw error;
    }
  }

  private async getCustomer(params: { phone?: string; email?: string; customerId?: string }): Promise<CustomerData | null> {
    try {
      if (!params.phone && !params.email && !params.customerId) {
        throw new Error('At least one identifier (phone, email, or customerId) is required');
      }

      // In real implementation, this would query the SuiteCRM PostgreSQL database
      // For now, return comprehensive mock data structure
      const mockCustomer: CustomerData = {
        id: params.customerId || 'customer_123',
        first_name: 'John',
        last_name: 'Doe',
        email: params.email || 'john.doe@example.com',
        phone: params.phone || '+1234567890',
        account_id: 'account_456',
        created_date: '2024-01-15T10:00:00Z',
        last_contact_date: '2024-02-01T14:30:00Z',
        total_purchases: 12,
        lifetime_value: 2899.87,
        preferred_contact_method: 'email',
        tags: ['premium_customer', 'tech_savvy', 'frequent_buyer']
      };

      logger.info(`Retrieved comprehensive customer data for ${params.customerId || params.phone || params.email}`);
      return mockCustomer;

    } catch (error) {
      logger.error('Error getting customer:', error);
      return null;
    }
  }

  private async getPurchaseHistory(params: { customerId: string; limit?: number; startDate?: string; endDate?: string; category?: string }): Promise<PurchaseHistory[]> {
    try {
      // In real implementation, query SuiteCRM purchases/custom tables
      const mockPurchases: PurchaseHistory[] = [
        {
          id: 'purchase_1',
          customer_id: params.customerId,
          product_name: 'Electronics Development Kit',
          product_category: 'Electronics',
          purchase_date: '2024-01-15T10:00:00Z',
          amount: 299.99,
          status: 'completed',
          quantity: 1
        },
        {
          id: 'purchase_2',
          customer_id: params.customerId,
          product_name: 'Premium Support Package',
          product_category: 'Services',
          purchase_date: '2024-01-20T15:30:00Z',
          amount: 99.99,
          status: 'completed',
          quantity: 1
        },
        {
          id: 'purchase_3',
          customer_id: params.customerId,
          product_name: 'Advanced Components Set',
          product_category: 'Electronics',
          purchase_date: '2024-01-25T09:15:00Z',
          amount: 149.99,
          status: 'completed',
          quantity: 2
        },
        {
          id: 'purchase_4',
          customer_id: params.customerId,
          product_name: 'IoT Starter Bundle',
          product_category: 'IoT',
          purchase_date: '2024-02-01T14:30:00Z',
          amount: 399.99,
          status: 'completed',
          quantity: 1
        }
      ];

      let filteredPurchases = mockPurchases;

      // Apply filters
      if (params.startDate) {
        filteredPurchases = filteredPurchases.filter(p => p.purchase_date >= params.startDate!);
      }
      if (params.endDate) {
        filteredPurchases = filteredPurchases.filter(p => p.purchase_date <= params.endDate!);
      }
      if (params.category) {
        filteredPurchases = filteredPurchases.filter(p => p.product_category === params.category);
      }

      const limit = params.limit || 10;
      logger.info(`Retrieved ${filteredPurchases.length} purchase records for customer ${params.customerId}`);
      return filteredPurchases.slice(0, limit);

    } catch (error) {
      logger.error('Error getting purchase history:', error);
      return [];
    }
  }

  private async getSupportCases(params: { customerId: string; status?: string; priority?: string; limit?: number; startDate?: string }): Promise<SupportCase[]> {
    try {
      // In real implementation, query SuiteCRM cases table
      const mockCases: SupportCase[] = [
        {
          id: 'case_1',
          customer_id: params.customerId,
          subject: 'Electronics Kit not working as expected',
          status: 'closed',
          priority: 'medium',
          created_date: '2024-01-25T09:15:00Z',
          updated_date: '2024-01-26T16:45:00Z',
          description: 'Customer reported that the electronics kit they purchased is not functioning properly. LED indicators not lighting up and components not responding.',
          resolution: 'Replaced defective unit and provided troubleshooting guide. Customer confirmed issue resolved.',
          assigned_to: 'support_agent_1'
        },
        {
          id: 'case_2',
          customer_id: params.customerId,
          subject: 'Monthly billing charge inquiry',
          status: 'open',
          priority: 'low',
          created_date: '2024-02-05T11:45:00Z',
          description: 'Customer is questioning the monthly service charge of $49.99 on their account.',
          assigned_to: 'billing_agent_1'
        },
        {
          id: 'case_3',
          customer_id: params.customerId,
          subject: 'Premium Support Package activation',
          status: 'in_progress',
          priority: 'high',
          created_date: '2024-02-08T13:20:00Z',
          description: 'Customer purchased Premium Support Package but it has not been activated on their account.',
          assigned_to: 'support_agent_2'
        }
      ];

      let filteredCases = mockCases;

      // Apply filters
      if (params.status) {
        filteredCases = filteredCases.filter(c => c.status === params.status);
      }
      if (params.priority) {
        filteredCases = filteredCases.filter(c => c.priority === params.priority);
      }
      if (params.startDate) {
        filteredCases = filteredCases.filter(c => c.created_date >= params.startDate!);
      }

      const limit = params.limit || 10;
      logger.info(`Retrieved ${filteredCases.length} support cases for customer ${params.customerId}`);
      return filteredCases.slice(0, limit);

    } catch (error) {
      logger.error('Error getting support cases:', error);
      return [];
    }
  }

  private async getCustomerPreferences(params: { customerId: string }): Promise<CustomerPreferences> {
    try {
      // In real implementation, query SuiteCRM preferences/custom fields
      const mockPreferences: CustomerPreferences = {
        preferred_language: 'en-US',
        preferred_contact_method: 'email',
        marketing_opt_in: true,
        notification_preferences: ['email', 'sms'],
        special_requirements: 'Prefers detailed technical explanations'
      };

      logger.info(`Retrieved preferences for customer ${params.customerId}`);
      return mockPreferences;

    } catch (error) {
      logger.error('Error getting customer preferences:', error);
      throw error;
    }
  }

  private async createSupportTicket(params: {
    customerId: string;
    subject: string;
    description: string;
    priority?: string;
    category?: string;
    source?: string;
  }): Promise<{ id: string; status: string; case_number: string }> {
    try {
      // In real implementation, insert into SuiteCRM cases table
      const ticketId = `case_${Date.now()}`;
      const caseNumber = `CS-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`;

      logger.info(`Created support ticket ${ticketId} for customer ${params.customerId}`);

      return {
        id: ticketId,
        case_number: caseNumber,
        status: 'new'
      };

    } catch (error) {
      logger.error('Error creating support ticket:', error);
      throw error;
    }
  }

  private async updateCustomerContactInfo(params: {
    customerId: string;
    email?: string;
    phone?: string;
    preferred_contact_method?: string;
  }): Promise<{ success: boolean; updated_fields: string[] }> {
    try {
      // In real implementation, update SuiteCRM contacts table
      const updatedFields: string[] = [];

      if (params.email) updatedFields.push('email');
      if (params.phone) updatedFields.push('phone');
      if (params.preferred_contact_method) updatedFields.push('preferred_contact_method');

      logger.info(`Updated contact info for customer ${params.customerId}: ${updatedFields.join(', ')}`);

      return {
        success: true,
        updated_fields: updatedFields
      };

    } catch (error) {
      logger.error('Error updating customer contact info:', error);
      throw error;
    }
  }

  private async getCustomerLifetimeValue(params: { customerId: string }): Promise<{
    total_purchases: number;
    total_amount: number;
    average_order_value: number;
    first_purchase_date: string;
    last_purchase_date: string;
    customer_segment: string;
    predicted_value?: number;
  }> {
    try {
      // In real implementation, calculate from SuiteCRM purchases/custom tables
      const mockLifetimeValue = {
        total_purchases: 12,
        total_amount: 2899.87,
        average_order_value: 241.66,
        first_purchase_date: '2024-01-15T10:00:00Z',
        last_purchase_date: '2024-02-01T14:30:00Z',
        customer_segment: 'premium',
        predicted_value: 4500.00
      };

      logger.info(`Calculated lifetime value for customer ${params.customerId}`);
      return mockLifetimeValue;

    } catch (error) {
      logger.error('Error calculating customer lifetime value:', error);
      throw error;
    }
  }
}
