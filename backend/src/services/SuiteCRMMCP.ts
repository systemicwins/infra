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
}

interface PurchaseHistory {
  id: string;
  customer_id: string;
  product_name: string;
  purchase_date: string;
  amount: number;
  status: string;
}

interface SupportCase {
  id: string;
  customer_id: string;
  subject: string;
  status: string;
  priority: string;
  created_date: string;
  description: string;
}

export class SuiteCRMMCPServer implements MCPServer {
  name = "suitecrm";
  description = "SuiteCRM customer relationship management system";

  tools: MCPTool[] = [
    {
      name: "getCustomer",
      description: "Look up customer information by phone number or email",
      inputSchema: {
        type: "object",
        properties: {
          phone: { type: "string", description: "Customer phone number" },
          email: { type: "string", description: "Customer email address" }
        },
        required: [] // Either phone or email required
      }
    },
    {
      name: "getPurchaseHistory",
      description: "Get customer's purchase history",
      inputSchema: {
        type: "object",
        properties: {
          customerId: { type: "string", description: "Customer ID from getCustomer" },
          limit: { type: "number", description: "Number of records to return", default: 10 }
        },
        required: ["customerId"]
      }
    },
    {
      name: "getSupportCases",
      description: "Get customer's support case history",
      inputSchema: {
        type: "object",
        properties: {
          customerId: { type: "string", description: "Customer ID from getCustomer" },
          status: { type: "string", description: "Filter by case status (open, closed, etc.)" },
          limit: { type: "number", description: "Number of records to return", default: 10 }
        },
        required: ["customerId"]
      }
    },
    {
      name: "createSupportTicket",
      description: "Create a new support ticket for a customer",
      inputSchema: {
        type: "object",
        properties: {
          customerId: { type: "string", description: "Customer ID from getCustomer" },
          subject: { type: "string", description: "Ticket subject" },
          description: { type: "string", description: "Ticket description" },
          priority: { type: "string", description: "Ticket priority (low, medium, high, urgent)", default: "medium" }
        },
        required: ["customerId", "subject", "description"]
      }
    }
  ];

  constructor() {
    logger.info('SuiteCRM MCP Server initialized');
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
        case 'createSupportTicket':
          return await this.createSupportTicket(params);
        default:
          throw new Error(`Unknown tool: ${toolName}`);
      }
    } catch (error) {
      logger.error(`Error executing MCP tool ${toolName}:`, error);
      throw error;
    }
  }

  private async getCustomer(params: { phone?: string; email?: string }): Promise<CustomerData | null> {
    try {
      // This would connect to SuiteCRM database
      // For now, return mock data structure
      if (!params.phone && !params.email) {
        throw new Error('Either phone or email is required');
      }

      // Mock implementation - in real implementation, query SuiteCRM PostgreSQL
      const mockCustomer: CustomerData = {
        id: 'customer_123',
        first_name: 'John',
        last_name: 'Doe',
        email: params.email || 'john.doe@example.com',
        phone: params.phone || '+1234567890',
        created_date: '2024-01-15T10:00:00Z',
        last_contact_date: '2024-02-01T14:30:00Z'
      };

      logger.info(`Retrieved customer data for ${params.phone || params.email}`);
      return mockCustomer;

    } catch (error) {
      logger.error('Error getting customer:', error);
      return null;
    }
  }

  private async getPurchaseHistory(params: { customerId: string; limit?: number }): Promise<PurchaseHistory[]> {
    try {
      // Mock implementation - in real implementation, query SuiteCRM purchases table
      const mockPurchases: PurchaseHistory[] = [
        {
          id: 'purchase_1',
          customer_id: params.customerId,
          product_name: 'Electronics Kit',
          purchase_date: '2024-01-15T10:00:00Z',
          amount: 299.99,
          status: 'completed'
        },
        {
          id: 'purchase_2',
          customer_id: params.customerId,
          product_name: 'Premium Support Package',
          purchase_date: '2024-01-20T15:30:00Z',
          amount: 99.99,
          status: 'completed'
        }
      ];

      const limit = params.limit || 10;
      logger.info(`Retrieved ${mockPurchases.length} purchase records for customer ${params.customerId}`);
      return mockPurchases.slice(0, limit);

    } catch (error) {
      logger.error('Error getting purchase history:', error);
      return [];
    }
  }

  private async getSupportCases(params: { customerId: string; status?: string; limit?: number }): Promise<SupportCase[]> {
    try {
      // Mock implementation - in real implementation, query SuiteCRM cases table
      const mockCases: SupportCase[] = [
        {
          id: 'case_1',
          customer_id: params.customerId,
          subject: 'Product not working as expected',
          status: 'closed',
          priority: 'medium',
          created_date: '2024-01-25T09:15:00Z',
          description: 'Customer reported issues with electronics kit functionality'
        },
        {
          id: 'case_2',
          customer_id: params.customerId,
          subject: 'Billing inquiry',
          status: 'open',
          priority: 'low',
          created_date: '2024-02-05T11:45:00Z',
          description: 'Question about monthly billing charges'
        }
      ];

      let filteredCases = mockCases;
      if (params.status) {
        filteredCases = mockCases.filter(c => c.status === params.status);
      }

      const limit = params.limit || 10;
      logger.info(`Retrieved ${filteredCases.length} support cases for customer ${params.customerId}`);
      return filteredCases.slice(0, limit);

    } catch (error) {
      logger.error('Error getting support cases:', error);
      return [];
    }
  }

  private async createSupportTicket(params: { customerId: string; subject: string; description: string; priority?: string }): Promise<{ id: string; status: string }> {
    try {
      // Mock implementation - in real implementation, insert into SuiteCRM cases table
      const ticketId = `ticket_${Date.now()}`;

      logger.info(`Created support ticket ${ticketId} for customer ${params.customerId}`);

      return {
        id: ticketId,
        status: 'new'
      };

    } catch (error) {
      logger.error('Error creating support ticket:', error);
      throw error;
    }
  }
}
