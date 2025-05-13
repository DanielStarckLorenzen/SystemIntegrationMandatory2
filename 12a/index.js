const express = require('express');
const bodyParser = require('body-parser');
const { webhookService, EVENT_TYPES } = require('./services/webhookService');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());

// Routes
app.get('/', (req, res) => {
  res.json({
    message: 'Webhook Exposee API',
    documentation: '/docs',
    endpoints: {
      register: 'POST /webhooks/register',
      unregister: 'DELETE /webhooks/unregister',
      events: 'GET /events',
      ping: 'POST /ping',
      trigger: 'POST /events/:eventType/trigger'
    }
  });
});

// Get all available event types
app.get('/events', (req, res) => {
  res.json({
    events: webhookService.getEventTypes(),
    description: {
      [EVENT_TYPES.PAYMENT_RECEIVED]: 'Triggered when a payment is received',
      [EVENT_TYPES.PAYMENT_PROCESSED]: 'Triggered when a payment is processed',
      [EVENT_TYPES.INVOICE_PROCESSING]: 'Triggered when an invoice begins processing',
      [EVENT_TYPES.INVOICE_COMPLETED]: 'Triggered when an invoice is completed'
    }
  });
});

// Register a webhook
app.post('/webhooks/register', async (req, res) => {
  try {
    const { url, eventType } = req.body;
    
    if (!url) {
      return res.status(400).json({ error: 'URL is required' });
    }
    
    if (!eventType) {
      return res.status(400).json({ error: 'Event type is required' });
    }
    
    if (!webhookService.isValidEventType(eventType)) {
      return res.status(400).json({ 
        error: 'Invalid event type',
        validEventTypes: webhookService.getEventTypes()
      });
    }
    
    const result = await webhookService.registerWebhook(url, eventType);
    
    if (result.success) {
      return res.status(201).json(result);
    } else {
      return res.status(200).json({
        message: 'Webhook already registered for this event type',
        ...result
      });
    }
  } catch (error) {
    console.error('Error registering webhook:', error);
    res.status(500).json({ error: error.message });
  }
});

// Unregister a webhook
app.delete('/webhooks/unregister', async (req, res) => {
  try {
    const { url, eventType } = req.body;
    
    if (!url) {
      return res.status(400).json({ error: 'URL is required' });
    }
    
    if (!eventType) {
      return res.status(400).json({ error: 'Event type is required' });
    }
    
    const result = await webhookService.unregisterWebhook(url, eventType);
    
    if (result.success) {
      return res.json({ message: 'Webhook unregistered successfully' });
    } else {
      return res.status(404).json({ message: 'Webhook not found' });
    }
  } catch (error) {
    console.error('Error unregistering webhook:', error);
    res.status(500).json({ error: error.message });
  }
});

// Ping all registered webhooks
app.post('/ping', async (req, res) => {
  try {
    const result = await webhookService.pingAll();
    res.json(result);
  } catch (error) {
    console.error('Error pinging webhooks:', error);
    res.status(500).json({ error: error.message });
  }
});

// Trigger a specific event type
app.post('/events/:eventType/trigger', async (req, res) => {
  try {
    const { eventType } = req.params;
    const payload = req.body;
    
    if (!webhookService.isValidEventType(eventType)) {
      return res.status(400).json({ 
        error: 'Invalid event type',
        validEventTypes: webhookService.getEventTypes()
      });
    }
    
    const result = await webhookService.triggerEvent(eventType, payload);
    res.json(result);
  } catch (error) {
    console.error('Error triggering event:', error);
    res.status(500).json({ error: error.message });
  }
});

// Serve documentation as a static file
app.use('/docs', express.static('docs'));

// Start the server
app.listen(PORT, () => {
  console.log(`Webhook Exposee server running on port ${PORT}`);
});

// Export for testing
module.exports = app; 