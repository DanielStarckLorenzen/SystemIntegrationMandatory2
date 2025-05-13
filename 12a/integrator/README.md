# Webhook Integration Script

This Python script helps you integrate with a webhook system by guiding you through:
1. Creating a webhook endpoint on webhook.site
2. Registering the webhook with the API
3. Testing the webhook connection
4. Triggering events to test notification delivery

## Prerequisites

- Python 3.6+
- An ngrok URL pointing to the webhook provider service

## Installation

1. Install required packages:
```
pip install requests python-dotenv
```

2. (Optional) Create a `.env` file with your ngrok URL:
```
NGROK_URL=https://your-ngrok-url.ngrok.io
```

## Usage

Run the script and provide the ngrok URL as a command-line argument:

```
python webhook_integration.py https://your-ngrok-url.ngrok.io
```

If you have set the `NGROK_URL` in the `.env` file, you can simply run:

```
python webhook_integration.py
```

## What the Script Does

1. Opens webhook.site to create a new webhook endpoint
2. Prompts you to copy and paste the webhook.site URL
3. Opens the Swagger UI for the API
4. Registers your webhook with a selected event type
5. Tests the webhook connection using the ping endpoint
6. Creates a test payment or triggers a specific event type

## Troubleshooting

- If you encounter connection errors, ensure your ngrok URL is correct and the service is running
- Check webhook.site to verify notifications are being received
- Ensure you have the necessary Python packages installed 