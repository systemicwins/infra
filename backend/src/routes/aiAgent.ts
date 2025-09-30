import { Router, Request, Response } from 'express';
import { AIAgentService } from '../services/AIAgentService.js';
import { logger } from '../utils/logger.js';
import { validateSMSRequest, validateVoiceRequest } from '../middleware/validation.js';

export const aiAgentRouter = Router();
const aiAgent = new AIAgentService();

// SMS endpoint for Twilio webhook
aiAgentRouter.post('/sms', validateSMSRequest, async (req: Request, res: Response) => {
  try {
    const { From: from, Body: message, To: to } = req.body;

    logger.info(`SMS received from ${from}: ${message}`);

    // Process the message with AI agent
    const response = await aiAgent.processSMS(from, message);

    // Create TwiML response for Twilio
    const twiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
    <Message>${response}</Message>
</Response>`;

    res.set('Content-Type', 'text/xml');
    res.send(twiml);

  } catch (error) {
    logger.error('SMS processing error:', error);
    const errorResponse = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
    <Message>Sorry, I'm having trouble processing your request. Please try again later.</Message>
</Response>`;

    res.set('Content-Type', 'text/xml');
    res.status(500).send(errorResponse);
  }
});

// Voice endpoint for Twilio webhook
aiAgentRouter.post('/voice', validateVoiceRequest, async (req: Request, res: Response) => {
  try {
    const { From: from, SpeechResult: speech, Digits: digits } = req.body;

    logger.info(`Voice call from ${from}, speech: ${speech}, digits: ${digits}`);

    // Get user's input (either speech or DTMF digits)
    const userInput = speech || (digits ? `User pressed ${digits}` : '');

    if (!userInput) {
      // First time caller, greet them
      const twiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
    <Gather input="speech dtmf" timeout="5" action="/api/ai/voice-response" method="POST">
        <Say voice="alice" language="en-US">
            Hello! Welcome to customer support. Please describe your issue or press any key to continue.
        </Say>
    </Gather>
    <Say voice="alice" language="en-US">
        I didn't catch that. Please call back and try again.
    </Say>
</Response>`;

      res.set('Content-Type', 'text/xml');
      res.send(twiml);
      return;
    }

    // Process the voice input with AI agent
    const response = await aiAgent.processVoice(from, userInput);

    // Create TwiML response for Twilio
    const twiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
    <Gather input="speech dtmf" timeout="5" action="/api/ai/voice-response" method="POST">
        <Say voice="alice" language="en-US">${response}</Say>
    </Gather>
    <Say voice="alice" language="en-US">
        Goodbye.
    </Say>
</Response>`;

    res.set('Content-Type', 'text/xml');
    res.send(twiml);

  } catch (error) {
    logger.error('Voice processing error:', error);
    const errorResponse = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
    <Say voice="alice" language="en-US">
        Sorry, I'm having trouble processing your request. Please try again later.
    </Say>
</Response>`;

    res.set('Content-Type', 'text/xml');
    res.status(500).send(errorResponse);
  }
});

// Voice response endpoint (for continued conversation)
aiAgentRouter.post('/voice-response', validateVoiceRequest, async (req: Request, res: Response) => {
  try {
    const { From: from, SpeechResult: speech, Digits: digits } = req.body;

    logger.info(`Voice response from ${from}, speech: ${speech}, digits: ${digits}`);

    // Get user's response
    const userInput = speech || (digits ? `User pressed ${digits}` : '');

    if (!userInput) {
      // No input received
      const twiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
    <Say voice="alice" language="en-US">
        I didn't catch that. Please try again or call back later.
    </Say>
</Response>`;

      res.set('Content-Type', 'text/xml');
      res.send(twiml);
      return;
    }

    // Process the voice response with AI agent
    const response = await aiAgent.processVoice(from, userInput);

    // Create TwiML response for Twilio
    const twiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
    <Gather input="speech dtmf" timeout="5" action="/api/ai/voice-response" method="POST">
        <Say voice="alice" language="en-US">${response}</Say>
    </Gather>
    <Say voice="alice" language="en-US">
        Goodbye.
    </Say>
</Response>`;

    res.set('Content-Type', 'text/xml');
    res.send(twiml);

  } catch (error) {
    logger.error('Voice response processing error:', error);
    const errorResponse = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
    <Say voice="alice" language="en-US">
        Sorry, I'm having trouble processing your request. Please try again later.
    </Say>
</Response>`;

    res.set('Content-Type', 'text/xml');
    res.status(500).send(errorResponse);
  }
});

// Email processing endpoint (for email webhooks)
aiAgentRouter.post('/email', async (req: Request, res: Response) => {
  try {
    const { from, subject, body, to } = req.body;

    if (!from || !subject || !body) {
      return res.status(400).json({ error: 'Missing required fields: from, subject, body' });
    }

    logger.info(`Email received from ${from}: ${subject}`);

    // Process the email with AI agent
    const response = await aiAgent.processEmail(from, subject, body);

    // Send email response via SendGrid if needed
    const emailSent = await aiAgent.sendEmailResponse(from, subject, response);

    if (emailSent) {
      logger.info(`Email response sent to ${from} via SendGrid`);
    }

    res.json({
      response,
      emailSent,
      message: 'Email processed successfully'
    });

  } catch (error) {
    logger.error('Email processing error:', error);
    res.status(500).json({
      error: 'Failed to process email',
      message: 'Please try again later'
    });
  }
});

// Email campaign management endpoints
aiAgentRouter.post('/campaign', async (req: Request, res: Response) => {
  try {
    const { campaignType, targetEmails, customerContext } = req.body;

    if (!campaignType) {
      return res.status(400).json({ error: 'Campaign type is required' });
    }

    logger.info(`Creating email campaign: ${campaignType}`);

    const campaignId = await aiAgent.createEmailCampaign(campaignType, targetEmails, customerContext);

    if (campaignId) {
      res.json({
        success: true,
        campaignId,
        message: `Email campaign ${campaignType} created and sent`
      });
    } else {
      res.status(500).json({
        error: 'Failed to create campaign',
        message: 'Please check Mailchimp configuration'
      });
    }

  } catch (error) {
    logger.error('Campaign creation error:', error);
    res.status(500).json({
      error: 'Failed to create campaign',
      message: 'Please try again later'
    });
  }
});

aiAgentRouter.post('/subscribe', async (req: Request, res: Response) => {
  try {
    const { email, mergeFields, tags } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    logger.info(`Adding email to mailing list: ${email}`);

    const success = await aiAgent.addToEmailList(email, mergeFields, tags);

    if (success) {
      res.json({
        success: true,
        message: `Email ${email} added to mailing list`
      });
    } else {
      res.status(500).json({
        error: 'Failed to add email to mailing list',
        message: 'Please check Mailchimp configuration'
      });
    }

  } catch (error) {
    logger.error('Email subscription error:', error);
    res.status(500).json({
      error: 'Failed to subscribe email',
      message: 'Please try again later'
    });
  }
});

aiAgentRouter.delete('/unsubscribe', async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    logger.info(`Removing email from mailing list: ${email}`);

    const success = await aiAgent.removeFromEmailList(email);

    if (success) {
      res.json({
        success: true,
        message: `Email ${email} removed from mailing list`
      });
    } else {
      res.status(500).json({
        error: 'Failed to remove email from mailing list',
        message: 'Please check Mailchimp configuration'
      });
    }

  } catch (error) {
    logger.error('Email unsubscription error:', error);
    res.status(500).json({
      error: 'Failed to unsubscribe email',
      message: 'Please try again later'
    });
  }
});

aiAgentRouter.get('/campaign/:campaignId/analytics', async (req: Request, res: Response) => {
  try {
    const { campaignId } = req.params;

    if (!campaignId) {
      return res.status(400).json({ error: 'Campaign ID is required' });
    }

    logger.info(`Getting analytics for campaign: ${campaignId}`);

    const analytics = await aiAgent.getCampaignAnalytics(campaignId);

    if (analytics) {
      res.json({
        success: true,
        campaignId,
        analytics
      });
    } else {
      res.status(500).json({
        error: 'Failed to get campaign analytics',
        message: 'Please check Mailchimp configuration and campaign ID'
      });
    }

  } catch (error) {
    logger.error('Campaign analytics error:', error);
    res.status(500).json({
      error: 'Failed to get campaign analytics',
      message: 'Please try again later'
    });
  }
});

// Web chat endpoint (for frontend integration)
aiAgentRouter.post('/chat', async (req: Request, res: Response) => {
  try {
    const { message, sessionId } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    logger.info(`Chat message received: ${message} (session: ${sessionId})`);

    const response = await aiAgent.processChat(message, sessionId);

    res.json({ response });

  } catch (error) {
    logger.error('Chat processing error:', error);
    res.status(500).json({
      error: 'Failed to process message',
      message: 'Please try again later'
    });
  }
});
