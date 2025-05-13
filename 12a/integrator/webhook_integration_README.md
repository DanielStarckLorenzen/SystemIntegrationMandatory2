# Webhook Integration Script

This Python script helps you integrate with a webhook system by guiding you through:
1. Creating a webhook endpoint on webhook.site (or using one provided in the .env file)
2. Registering the webhook with the API
3. Testing the webhook connection
4. Triggering events to test notification delivery

## Prerequisites

- Python 3.6+
- An ngrok URL pointing to the webhook provider service
- Required Python packages: `requests`, `python-dotenv`

## Installation

1. Install required packages:
```
python3 -m venv venv
source venv/bin/activate
pip install requests python-dotenv
```

2. Create a `.env` file with your configuration:
```
# Required
NGROK_URL=https://your-ngrok-url.ngrok.io
WEBHOOK_URL=https://webhook.site/your-unique-id

# Optional
SECRET_KEY=your-secret-key
EVENT_TYPE=payment.received
TEST_METHOD=payment
```

## Usage

### Fully Automated Mode

If you want to run the script without any interactive prompts, set all environment variables in the `.env` file:

```
# Required
NGROK_URL=https://your-ngrok-url.ngrok.io
WEBHOOK_URL=https://webhook.site/your-unique-id

# Optional but recommended for automation
EVENT_TYPE=payment.received
TEST_METHOD=payment
AUTO_OPEN=false
```

Then run the script:

```
python webhook_integration.py
```

### Semi-Interactive Mode

Set only the required environment variables:

```
NGROK_URL=https://your-ngrok-url.ngrok.io
WEBHOOK_URL=https://webhook.site/your-unique-id
```

The script will use these values but prompt for other choices like event type.

### Fully Interactive Mode

Set only the base URL and let the script guide you through the process:

```
NGROK_URL=https://your-ngrok-url.ngrok.io
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NGROK_URL` | Base URL of the webhook provider service | *Required* |
| `WEBHOOK_URL` | Your webhook.site URL to receive events | Prompted if not set |
| `SECRET_KEY` | Secret key for webhook authentication | Auto-generated UUID |
| `EVENT_TYPE` | Event type to register for | Prompted if not set |
| `TRIGGER_EVENT_TYPE` | Event type to trigger in tests | Prompted if not set |
| `TEST_METHOD` | Test method to use (`payment` or `trigger`) | Prompted if not set |
| `AUTO_OPEN` | Whether to open browser windows (`true`/`false`) | `true` |

## Available Event Types

- `payment.received` - Triggered when a payment is received
- `payment.processed` - Triggered when a payment is processed
- `invoice.processing` - Triggered when an invoice starts processing
- `invoice.completed` - Triggered when an invoice is completed

## Troubleshooting

- If you encounter connection errors, ensure your ngrok URL is correct and the service is running
- Check webhook.site to verify notifications are being received
- Make sure the secret key is properly included in your webhook registration
- Ensure you have the necessary Python packages installed 