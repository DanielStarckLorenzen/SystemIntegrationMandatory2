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

By default, the server will run on port 3000.

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

## Using ngrok for testing

If you're developing locally and want to test your webhooks with a public URL, you can use ngrok:

1. Install ngrok: https://ngrok.com/download
2. Start your webhook server: `npm start`
3. In a separate terminal, run: `ngrok http 3000`
4. Use the generated HTTPS URL to test your webhooks 