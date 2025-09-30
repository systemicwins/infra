import { Router, Request, Response } from 'express';
import { Firestore } from '@google-cloud/firestore';
import { logger } from '../utils/logger.js';

export const supportRouter = Router();

// Initialize Firestore
const firestore = new Firestore({
  projectId: process.env.FIRESTORE_PROJECT_ID,
});

/**
 * Submit a support ticket
 */
supportRouter.post('/ticket', async (req: Request, res: Response) => {
  try {
    const { name, email, subject, message } = req.body;

    // Validate required fields
    if (!name || !email || !subject || !message) {
      return res.status(400).json({
        error: 'Missing required fields',
        message: 'Please provide name, email, subject, and message'
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        error: 'Invalid email format',
        message: 'Please provide a valid email address'
      });
    }

    // Create support ticket
    const ticketData = {
      name,
      email,
      subject,
      message,
      status: 'new',
      priority: 'medium',
      createdAt: new Date(),
      updatedAt: new Date(),
      source: 'web',
      assignedTo: null,
      tags: this.extractTags(subject + ' ' + message),
      customerInfo: {
        name,
        email,
        submittedAt: new Date()
      }
    };

    // Save to Firestore
    const docRef = await firestore.collection('support_tickets').add(ticketData);

    logger.info(`Support ticket created: ${docRef.id} for ${email}`);

    // Send confirmation response
    res.status(201).json({
      success: true,
      ticketId: docRef.id,
      message: 'Your support ticket has been submitted successfully. We\'ll respond within 24 hours.',
      estimatedResponseTime: '24 hours'
    });

  } catch (error) {
    logger.error('Error creating support ticket:', error);
    res.status(500).json({
      error: 'Failed to submit support ticket',
      message: 'Please try again later or contact us directly'
    });
  }
});

/**
 * Newsletter subscription endpoint
 */
supportRouter.post('/newsletter', async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        error: 'Email is required',
        message: 'Please provide an email address'
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        error: 'Invalid email format',
        message: 'Please provide a valid email address'
      });
    }

    // Check if already subscribed
    const existingSubscriber = await firestore
      .collection('newsletter_subscribers')
      .where('email', '==', email)
      .get();

    if (!existingSubscriber.empty) {
      return res.status(409).json({
        error: 'Already subscribed',
        message: 'This email address is already subscribed to our newsletter'
      });
    }

    // Add to newsletter collection
    await firestore.collection('newsletter_subscribers').add({
      email,
      subscribedAt: new Date(),
      status: 'active',
      source: 'website'
    });

    logger.info(`Newsletter subscription: ${email}`);

    res.status(201).json({
      success: true,
      message: 'Thank you for subscribing to our newsletter! You\'ll receive our latest updates soon.'
    });

  } catch (error) {
    logger.error('Error subscribing to newsletter:', error);
    res.status(500).json({
      error: 'Failed to subscribe to newsletter',
      message: 'Please try again later'
    });
  }
});

/**
 * Get support ticket status (for customers to check their tickets)
 */
supportRouter.get('/ticket/:ticketId', async (req: Request, res: Response) => {
  try {
    const { ticketId } = req.params;

    const ticketDoc = await firestore.collection('support_tickets').doc(ticketId).get();

    if (!ticketDoc.exists) {
      return res.status(404).json({
        error: 'Ticket not found',
        message: 'The requested support ticket could not be found'
      });
    }

    const ticketData = ticketDoc.data();

    // Return limited information for security
    res.json({
      ticketId,
      status: ticketData?.status,
      createdAt: ticketData?.createdAt,
      updatedAt: ticketData?.updatedAt,
      estimatedResponseTime: '24 hours'
    });

  } catch (error) {
    logger.error('Error retrieving support ticket:', error);
    res.status(500).json({
      error: 'Failed to retrieve ticket status',
      message: 'Please try again later'
    });
  }
});

/**
 * Extract relevant tags from ticket content for categorization
 */
function extractTags(content: string): string[] {
  const tags: string[] = [];
  const lowerContent = content.toLowerCase();

  // Common issue categories
  if (lowerContent.includes('billing') || lowerContent.includes('payment') || lowerContent.includes('charge')) {
    tags.push('billing');
  }
  if (lowerContent.includes('technical') || lowerContent.includes('bug') || lowerContent.includes('error')) {
    tags.push('technical');
  }
  if (lowerContent.includes('account') || lowerContent.includes('login') || lowerContent.includes('password')) {
    tags.push('account');
  }
  if (lowerContent.includes('feature') || lowerContent.includes('request') || lowerContent.includes('suggestion')) {
    tags.push('feature-request');
  }
  if (lowerContent.includes('urgent') || lowerContent.includes('asap') || lowerContent.includes('emergency')) {
    tags.push('urgent');
  }

  return tags;
}
