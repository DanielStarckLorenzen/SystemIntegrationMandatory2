const axios = require('axios');
const db = require('../database/db');

// Define event types for our payment theme
const EVENT_TYPES = {
  PAYMENT_RECEIVED: 'payment.received',
  PAYMENT_PROCESSED: 'payment.processed',
  INVOICE_PROCESSING: 'invoice.processing',
  INVOICE_COMPLETED: 'invoice.completed'
};

const webhookService = {
  // Get all valid event types
  getEventTypes: () => {
    return Object.values(EVENT_TYPES);
  },

  // Check if event type is valid
  isValidEventType: (eventType) => {
    return Object.values(EVENT_TYPES).includes(eventType);
  },

  // Register a webhook for an event type
  registerWebhook: async (url, eventType) => {
    if (!webhookService.isValidEventType(eventType)) {
      throw new Error(`Invalid event type: ${eventType}`);
    }
    
    return await db.registerWebhook(url, eventType);
  },

  // Unregister a webhook
  unregisterWebhook: async (url, eventType) => {
    if (!webhookService.isValidEventType(eventType)) {
      throw new Error(`Invalid event type: ${eventType}`);
    }
    
    return await db.unregisterWebhook(url, eventType);
  },
  
  // Trigger an event and notify all registered webhooks
  triggerEvent: async (eventType, payload) => {
    if (!webhookService.isValidEventType(eventType)) {
      throw new Error(`Invalid event type: ${eventType}`);
    }
    
    const webhooks = await db.getWebhooksByEvent(eventType);
    
    const results = [];
    for (const webhook of webhooks) {
      try {
        const webhookPayload = {
          event: eventType,
          timestamp: new Date().toISOString(),
          data: payload
        };
        
        const response = await axios.post(webhook.url, webhookPayload, {
          headers: {
            'Content-Type': 'application/json',
            'X-Webhook-Event': eventType
          },
          timeout: 5000 // 5 second timeout
        });
        
        results.push({
          webhook: webhook.url,
          success: true,
          statusCode: response.status
        });
      } catch (error) {
        results.push({
          webhook: webhook.url,
          success: false,
          error: error.message
        });
      }
    }
    
    return {
      eventType,
      webhooksTriggered: webhooks.length,
      results
    };
  },
  
  // Ping all registered webhooks
  pingAll: async () => {
    const webhooks = await db.getAllWebhooks();
    const uniqueUrls = [...new Set(webhooks.map(wh => wh.url))];
    
    const results = [];
    for (const url of uniqueUrls) {
      try {
        const pingPayload = {
          event: 'ping',
          timestamp: new Date().toISOString(),
          data: { message: 'Webhook ping test' }
        };
        
        const response = await axios.post(url, pingPayload, {
          headers: {
            'Content-Type': 'application/json',
            'X-Webhook-Event': 'ping'
          },
          timeout: 5000 // 5 second timeout
        });
        
        results.push({
          webhook: url,
          success: true,
          statusCode: response.status
        });
      } catch (error) {
        results.push({
          webhook: url,
          success: false,
          error: error.message
        });
      }
    }
    
    return {
      totalPinged: uniqueUrls.length,
      results
    };
  }
};

module.exports = {
  webhookService,
  EVENT_TYPES
}; 