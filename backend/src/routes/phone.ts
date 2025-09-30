import { Router, Request, Response } from 'express';
import { SecretManagerServiceClient } from '@google-cloud/secret-manager';
import { logger } from '../utils/logger.js';

export const phoneRouter = Router();

// Initialize Secret Manager client
const secretManager = new SecretManagerServiceClient();

/**
 * Get the current support phone number
 * Used by frontend to display the phone number
 */
phoneRouter.get('/numbers', async (req: Request, res: Response) => {
  try {
    // Get phone number from Secret Manager
    const phoneNumberSecret = await getSecret('twilio-phone-number');

    if (!phoneNumberSecret) {
      logger.warn('Phone number not found in Secret Manager');
      return res.status(404).json({
        error: 'Phone number not configured',
        message: 'Support phone number is not yet available'
      });
    }

    res.json({
      phoneNumber: phoneNumberSecret,
      smsNumber: phoneNumberSecret, // Same number for both voice and SMS
      lastUpdated: new Date().toISOString()
    });

  } catch (error) {
    logger.error('Error getting phone numbers:', error);
    res.status(500).json({
      error: 'Failed to retrieve phone numbers',
      message: 'Please try again later'
    });
  }
});

/**
 * Get just the phone number (for footer display)
 */
phoneRouter.get('/number', async (req: Request, res: Response) => {
  try {
    const phoneNumberSecret = await getSecret('twilio-phone-number');

    if (!phoneNumberSecret) {
      return res.status(404).json({
        error: 'Phone number not configured',
        message: 'Support phone number is not yet available'
      });
    }

    res.json({
      phoneNumber: phoneNumberSecret
    });

  } catch (error) {
    logger.error('Error getting phone number:', error);
    res.status(500).json({
      error: 'Failed to retrieve phone number',
      message: 'Please try again later'
    });
  }
});

/**
 * Health check for phone services
 */
phoneRouter.get('/health', async (req: Request, res: Response) => {
  try {
    const phoneNumberSecret = await getSecret('twilio-phone-number');

    res.json({
      status: 'healthy',
      phoneNumberConfigured: !!phoneNumberSecret,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    logger.error('Phone health check failed:', error);
    res.status(503).json({
      status: 'unhealthy',
      error: 'Phone service unavailable',
      timestamp: new Date().toISOString()
    });
  }
});

/**
 * Helper function to retrieve secrets from Google Secret Manager
 */
async function getSecret(secretName: string): Promise<string | null> {
  try {
    const projectId = process.env.FIRESTORE_PROJECT_ID || process.env.GOOGLE_CLOUD_PROJECT;
    if (!projectId) {
      throw new Error('Project ID not configured');
    }

    const [version] = await secretManager.accessSecretVersion({
      name: `projects/${projectId}/secrets/${secretName}/versions/latest`,
    });

    const secretData = version.payload?.data;
    if (!secretData) {
      return null;
    }

    return Buffer.from(secretData).toString('utf8');

  } catch (error) {
    logger.error(`Error retrieving secret ${secretName}:`, error);
    return null;
  }
}
