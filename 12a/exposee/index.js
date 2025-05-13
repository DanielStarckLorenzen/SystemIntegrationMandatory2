const express = require('express');
const bodyParser = require('body-parser');
const { webhookService, EVENT_TYPES } = require('./services/webhookService');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const app = express();
const PORT = process.env.PORT || 3001;

// Swagger definition
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Webhook Exposee API',
      version: '1.0.0',
      description: 'A webhook system exposee that allows webhook registration and event triggering',
    },
    servers: [
      {
        url: '/',
        description: 'Local Development Server',
      },
    ],
  },
  apis: ['./index.js'], // Path to the API docs
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Middleware
app.use(bodyParser.json());

// Routes
/**
 * @swagger
 * /:
 *   get:
 *     summary: Get API information
 *     description: Returns API information and available endpoints
 *     responses:
 *       200:
 *         description: API information
 */
app.get('/', (req, res) => {
  res.json({
    message: 'Webhook Exposee API',
    documentation: '/api-docs',
    endpoints: {
      register: 'POST /webhooks/register',
      unregister: 'DELETE /webhooks/unregister',
      events: 'GET /events',
      ping: 'POST /ping',
      trigger: 'POST /events/:eventType/trigger'
    }
  });
});

/**
 * @swagger
 * /events:
 *   get:
 *     summary: Get all available event types
 *     description: Returns a list of all event types that can be used for webhook registration
 *     responses:
 *       200:
 *         description: List of event types and their descriptions
 */
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

/**
 * @swagger
 * /webhooks/register:
 *   post:
 *     summary: Register a webhook
 *     description: Register a URL to receive notifications for a specific event type
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - url
 *               - eventType
 *             properties:
 *               url:
 *                 type: string
 *                 description: The URL to receive webhook notifications
 *               eventType:
 *                 type: string
 *                 description: The event type to subscribe to
 *     responses:
 *       201:
 *         description: Webhook registered successfully
 *       400:
 *         description: Invalid input parameters
 *       500:
 *         description: Server error
 */
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

/**
 * @swagger
 * /webhooks/unregister:
 *   delete:
 *     summary: Unregister a webhook
 *     description: Remove a URL from receiving notifications for a specific event type
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - url
 *               - eventType
 *             properties:
 *               url:
 *                 type: string
 *                 description: The URL to unregister
 *               eventType:
 *                 type: string
 *                 description: The event type to unsubscribe from
 *     responses:
 *       200:
 *         description: Webhook unregistered successfully
 *       404:
 *         description: Webhook not found
 *       500:
 *         description: Server error
 */
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

/**
 * @swagger
 * /ping:
 *   post:
 *     summary: Ping all registered webhooks
 *     description: Send a test ping to all registered webhooks to verify they are accessible
 *     responses:
 *       200:
 *         description: Ping results
 *       500:
 *         description: Server error
 */
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

/**
 * @swagger
 * /events/{eventType}/trigger:
 *   post:
 *     summary: Trigger a specific event
 *     description: Manually trigger an event to send notifications to all registered webhooks for that event type
 *     parameters:
 *       - in: path
 *         name: eventType
 *         required: true
 *         description: The event type to trigger
 *         schema:
 *           type: string
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             description: Custom payload to send with the webhook
 *     responses:
 *       200:
 *         description: Event triggered results
 *       400:
 *         description: Invalid event type
 *       500:
 *         description: Server error
 */
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
  console.log(`Swagger documentation available at http://localhost:${PORT}/api-docs`);
});

// Export for testing
module.exports = app; 