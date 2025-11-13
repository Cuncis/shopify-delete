// api/delete-customer.js
import axios from 'axios';

export default async function handler(req, res) {
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
    console.error(error.response?.data || error.message);
    return res.status(500).json({ error: 'Failed to delete customer', details: error.response?.data });
  }
}
