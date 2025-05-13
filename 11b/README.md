# PayPal Payment Integration Example

This is a simple example of integrating PayPal payments into a Node.js application using Express and the PayPal Checkout Server SDK.

## Features

- Create PayPal orders
- Capture payments
- Get order details
- Simple product display with customizable amount
- Transaction confirmation

## Prerequisites

- Node.js and npm installed
- PayPal Developer account (for Client ID and Secret)

## Setup

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Create a `.env` file in the root directory with the following variables:
   ```
   PAYPAL_CLIENT_ID=your_paypal_client_id
   PAYPAL_CLIENT_SECRET=your_paypal_client_secret
   PORT=3000
   ```
4. Start the server:
   ```
   npm start
   ```
5. Open your browser and navigate to `http://localhost:3000`

## PayPal Developer Account Setup

1. Go to [PayPal Developer Dashboard](https://developer.paypal.com/dashboard/)
2. Log in or create an account
3. Create a new app in the Sandbox environment
4. Copy the Client ID and Secret to your `.env` file

## Implementation Details

The integration utilizes the following components:

- **Backend**: Express.js server handling API endpoints for creating orders, capturing payments, and retrieving order details
- **Frontend**: Simple HTML/CSS/JS interface with PayPal buttons
- **PayPal SDK**: Server-side SDK for creating and managing orders

## API Endpoints

- `POST /api/create-order`: Creates a new PayPal order
- `POST /api/capture-order`: Captures payment for an existing order
- `GET /api/order/:orderID`: Retrieves details for a specific order

## Testing

You can test the integration using PayPal Sandbox accounts:
1. Use the default test product or enter a custom amount
2. Click the PayPal button
3. Log in with a PayPal Sandbox account
4. Complete the payment process
5. View the transaction details displayed on the page

## Resources

- [PayPal Developer Documentation](https://developer.paypal.com/docs/checkout/)
- [PayPal Checkout Server SDK Documentation](https://developer.paypal.com/docs/checkout/reference/server-integration/) 