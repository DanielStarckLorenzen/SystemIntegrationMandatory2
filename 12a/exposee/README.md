# Webhook Exposee System

This is a webhook exposee system that allows integrators to register webhooks for various events. It's built with Node.js, Express, and SQLite.

## Features

- Register and unregister webhooks for specific event types
- Trigger events manually for testing
- Ping all registered webhooks to verify connections
- Simple SQLite storage for registered webhooks
- Comprehensive documentation

## Event Types

The system supports the following event types:

- `payment.received` - Triggered when a payment is received
- `payment.processed` - Triggered when a payment is processed
- `invoice.processing` - Triggered when an invoice begins processing
- `invoice.completed` - Triggered when an invoice is completed

## Setup

1. Install dependencies:

```bash
npm install
```

2. Start the server:

```bash
npm start
```

By default, the server will run on port 3001.

## API Endpoints

### Get all event types

```
GET /events
```

### Register a webhook

```
POST /webhooks/register
```

Body:
```json
{
  "url": "https://your-server.com/webhook",
  "eventType": "payment.received"
}
```

### Unregister a webhook

```
DELETE /webhooks/unregister
```

Body:
```json
{
  "url": "https://your-server.com/webhook",
  "eventType": "payment.received"
}
```

### Ping all registered webhooks

```
POST /ping
```

### Trigger a specific event

```
POST /events/:eventType/trigger
```

Body (example):
```json
{
  "paymentId": "12345",
  "amount": 100.50,
  "currency": "USD"
}
```

## Documentation

Detailed documentation is available at the `/docs` endpoint when the server is running.
Swagger API documentation is available at the `/swagger` endpoint.

## Testing with webhook.site

Follow these steps to test your webhook integration:

1. **Create a webhook endpoint**:
   - Go to [webhook.site](https://webhook.site/) and open the page
   - A unique URL will be automatically generated for you
   - Copy this URL to use as your webhook destination

2. **Expose your local server** (if testing locally):
   - Install ngrok: https://ngrok.com/download
   - Start your webhook server: `npm start`
   - In a separate terminal, run: `ngrok http 3001`
   - Note the HTTPS URL provided by ngrok (e.g., `https://abc123.ngrok.io`)

3. **Register your webhook**:
   - Open the Swagger UI at `<ngrok-url>/swagger` or `http://localhost:3001/swagger`
   - Navigate to the `POST /webhooks/register` endpoint
   - Click "Try it out" and fill in the request body:
     ```json
     {
       "url": "YOUR_WEBHOOK_SITE_URL",
       "eventType": "payment.received"
     }
     ```
   - Click "Execute" to register your webhook
   - Verify the response shows successful registration

4. **Test the webhook connection**:
   - Navigate to the `POST /ping` endpoint in Swagger UI
   - Click "Try it out" and then "Execute"
   - Check your webhook.site page to see if you received the ping notification
   - You should see a webhook received with event type "ping"

5. **Trigger a specific event**:
   - Navigate to the `POST /events/{eventType}/trigger` endpoint in Swagger UI
   - Enter "payment.received" as the eventType
   - Click "Try it out" and provide a sample payload:
     ```json
     {
       "paymentId": "12345",
       "amount": 100.50,
       "currency": "USD"
     }
     ```
   - Click "Execute" to trigger the event
   - Check your webhook.site page to verify you received the notification
   - You should see a webhook with event type "payment.received" and your custom payload

6. **Inspect and debug**:
   - On webhook.site, you can inspect the full request details
   - Examine headers, body, and other request information
   - Use this information to debug any issues with your webhook integration

7. **Unregister your webhook** (if necessary):
   - Navigate to the `DELETE /webhooks/unregister` endpoint in Swagger UI
   - Click "Try it out" and fill in the request body with the same URL and eventType:
     ```json
     {
       "url": "YOUR_WEBHOOK_SITE_URL",
       "eventType": "payment.received"
     }
     ```
   - Click "Execute" to unregister your webhook

## Using ngrok for testing

If you're developing locally and want to test your webhooks with a public URL, you can use ngrok:

1. Install ngrok: https://ngrok.com/download
2. Start your webhook server: `npm start`
3. In a separate terminal, run: `ngrok http 3001`
4. Use the generated HTTPS URL to test your webhooks 