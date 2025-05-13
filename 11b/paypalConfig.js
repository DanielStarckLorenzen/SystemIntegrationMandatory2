const paypal = require('@paypal/checkout-server-sdk');
require('dotenv').config();

// Creating an environment
function environment() {
  let clientId = process.env.PAYPAL_CLIENT_ID || 'PAYPAL-SANDBOX-CLIENT-ID';
  let clientSecret = process.env.PAYPAL_CLIENT_SECRET || 'PAYPAL-SANDBOX-CLIENT-SECRET';
  
  // This is for sandbox testing
  return new paypal.core.SandboxEnvironment(clientId, clientSecret);
}

// Creating a client
function client() {
  return new paypal.core.PayPalHttpClient(environment());
}

module.exports = { client }; 