import axios from 'axios';

export default async function handler(req, res) {
  // Allow CORS from your actual Shopify store domain
  const allowedOrigins = [
    'https://shopify-delete-ha4s1acac-karang-reksas-projects.vercel.app',
    'https://shopify-delete-igsf0cvh0-karang-reksas-projects.vercel.app',
    'https://your-store.myshopify.com' // Ganti dengan domain Shopify Anda
  ];
  
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { customerId } = req.body;
  
  if (!customerId) {
    return res.status(400).json({ error: 'customerId is required' });
  }

  try {
    const SHOP = process.env.SHOPIFY_STORE;
    const TOKEN = process.env.SHOPIFY_ADMIN_API_ACCESS_TOKEN;

    if (!SHOP || !TOKEN) {
      throw new Error('Missing Shopify credentials');
    }

    const response = await axios.delete(
      `https://${SHOP}.myshopify.com/admin/api/2025-07/customers/${customerId}.json`,
      { 
        headers: { 
          "X-Shopify-Access-Token": TOKEN,
          "Content-Type": "application/json" 
        } 
      }
    );

    return res.status(200).json({ success: true, data: response.data });
    
  } catch (error) {
    console.error('Delete error:', error.response?.data || error.message);
    return res.status(500).json({ 
      success: false,
      error: 'Failed to delete customer', 
      details: error.response?.data || error.message 
    });
  }
}
