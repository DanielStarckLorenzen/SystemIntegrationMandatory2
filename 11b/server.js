const express = require('express');
const paypal = require('@paypal/checkout-server-sdk');
const cors = require('cors');
const { client } = require('./paypalConfig');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Serve static files for the frontend
app.use(express.static('public'));

// Create a PayPal order
app.post('/api/create-order', async (req, res) => {
  try {
    const request = new paypal.orders.OrdersCreateRequest();
    
    // Get the product details from the request
    const { value } = req.body;
    
    request.prefer("return=representation");
    request.requestBody({
      intent: 'CAPTURE',
      purchase_units: [{
        amount: {
          currency_code: 'USD',
          value: value || '19.99'
        },
        description: 'Sample product purchase'
      }]
    });

    const order = await client().execute(request);
    
    res.status(200).json({
      id: order.result.id
    });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ error: 'Failed to create order' });
  }
});

// Capture payment for an order
app.post('/api/capture-order', async (req, res) => {
  try {
    const { orderID } = req.body;
    const request = new paypal.orders.OrdersCaptureRequest(orderID);
    request.requestBody({});

    const capture = await client().execute(request);
    
    res.status(200).json({
      status: 'SUCCESS',
      details: capture.result
    });
  } catch (error) {
    console.error('Error capturing order:', error);
    res.status(500).json({ error: 'Failed to capture order' });
  }
});

// Get order details
app.get('/api/order/:orderID', async (req, res) => {
  try {
    const { orderID } = req.params;
    const request = new paypal.orders.OrdersGetRequest(orderID);
    
    const order = await client().execute(request);
    
    res.status(200).json({
      status: 'SUCCESS',
      order: order.result
    });
  } catch (error) {
    console.error('Error getting order details:', error);
    res.status(500).json({ error: 'Failed to get order details' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 