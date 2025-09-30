import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger.js';

/**
 * Validate SMS webhook requests from Twilio
 */
export function validateSMSRequest(req: Request, res: Response, next: NextFunction): void {
  try {
    const { From, Body, To } = req.body;

    if (!From || !Body || !To) {
      logger.warn('Invalid SMS request - missing required fields', { body: req.body });
      res.status(400).json({
        error: 'Invalid request',
        message: 'Missing required SMS fields'
      });
      return;
    }

    // Basic phone number validation
    const phoneRegex = /^\+?[1-9]\d{1,14}$/;
    if (!phoneRegex.test(From) || !phoneRegex.test(To)) {
      logger.warn('Invalid SMS request - invalid phone numbers', { from: From, to: To });
      res.status(400).json({
        error: 'Invalid request',
        message: 'Invalid phone number format'
      });
      return;
    }

    next();
  } catch (error) {
    logger.error('SMS validation error:', error);
    res.status(500).json({
      error: 'Validation error',
      message: 'Failed to validate SMS request'
    });
  }
}

/**
 * Validate voice webhook requests from Twilio
 */
export function validateVoiceRequest(req: Request, res: Response, next: NextFunction): void {
  try {
    const { From, To } = req.body;

    if (!From || !To) {
      logger.warn('Invalid voice request - missing required fields', { body: req.body });
      res.status(400).json({
        error: 'Invalid request',
        message: 'Missing required voice fields'
      });
      return;
    }

    // Basic phone number validation
    const phoneRegex = /^\+?[1-9]\d{1,14}$/;
    if (!phoneRegex.test(From) || !phoneRegex.test(To)) {
      logger.warn('Invalid voice request - invalid phone numbers', { from: From, to: To });
      res.status(400).json({
        error: 'Invalid request',
        message: 'Invalid phone number format'
      });
      return;
    }

    next();
  } catch (error) {
    logger.error('Voice validation error:', error);
    res.status(500).json({
      error: 'Validation error',
      message: 'Failed to validate voice request'
    });
  }
}

/**
 * Rate limiting for API endpoints
 */
const requestCounts = new Map<string, { count: number; resetTime: number }>();

export function rateLimit(maxRequests: number = 100, windowMs: number = 60000) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const key = req.ip || req.connection.remoteAddress || 'unknown';
    const now = Date.now();

    const requestData = requestCounts.get(key);

    if (!requestData || now > requestData.resetTime) {
      // Reset or initialize
      requestCounts.set(key, {
        count: 1,
        resetTime: now + windowMs
      });
      next();
    } else if (requestData.count < maxRequests) {
      // Increment count
      requestData.count++;
      next();
    } else {
      // Rate limit exceeded
      logger.warn(`Rate limit exceeded for IP: ${key}`);
      res.status(429).json({
        error: 'Too many requests',
        message: 'Rate limit exceeded. Please try again later.',
        retryAfter: Math.ceil((requestData.resetTime - now) / 1000)
      });
    }
  };
}

/**
 * Clean up old rate limit data periodically
 */
setInterval(() => {
  const now = Date.now();
  for (const [key, data] of requestCounts.entries()) {
    if (now > data.resetTime) {
      requestCounts.delete(key);
    }
  }
}, 60000); // Clean up every minute
