const https = require('https');
const { storeReceiptPdf } = require('../lib/receipt-store.js');

module.exports = async (req, res) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.statusCode = 200;
    return res.end();
  }

  if (req.method !== 'POST') {
    res.statusCode = 405;
    res.setHeader('Content-Type', 'application/json');
    return res.end(JSON.stringify({ error: 'Method Not Allowed' }));
  }

  // Parse JSON Body
  let body = req.body;
  if (!body) {
    try {
      const raw = await new Promise((resolve, reject) => {
        let chunk = '';
        req.on('data', d => chunk += d);
        req.on('end', () => resolve(chunk));
        req.on('error', reject);
      });
      body = raw ? JSON.parse(raw) : {};
    } catch (e) {
      body = {};
    }
  }

  const {
    to,
    orderId,
    devoteeName,
    templeName,
    amount,
    date,
    purpose,
    pdfUrl,
    pdfBase64,
    filename
  } = body || {};

  // If client provided a pre-rendered high-quality base64 PDF, cache it immediately!
  if (pdfBase64 && orderId) {
    storeReceiptPdf(orderId, pdfBase64, {
      devoteeName,
      templeName,
      amount,
      date,
      purpose
    });
  }

  // Clean phone number (Ensure country code 91 for India)
  let cleanPhone = (to || '').toString().replace(/[^0-9]/g, '');
  if (cleanPhone.length === 10) {
    cleanPhone = '91' + cleanPhone;
  }
  if (!cleanPhone || cleanPhone.length < 10) {
    res.statusCode = 400;
    res.setHeader('Content-Type', 'application/json');
    return res.end(JSON.stringify({ error: 'Valid recipient phone number is required.' }));
  }

  const rawId = (orderId || 'PRARTHANA-123240').replace(/[^0-9]/g, '');
  const cleanNum = rawId ? rawId.slice(-6).padStart(6, '1') : '123240';
  const defaultHost = req.headers && req.headers.host && !req.headers.host.includes('localhost')
    ? `https://${req.headers.host}`
    : 'https://prarthana.shiplystic.com';

  const documentLink = pdfUrl || `${defaultHost}/api/receipt-pdf?order_id=${encodeURIComponent(orderId || 'PRARTHANA-123240')}`;
  const docFilename = filename || `Temple_Donation_Receipt_${cleanNum}.pdf`;
  const caption = `🙏 Pranam ${devoteeName || 'Devotee'} ji!\nHere is your official ₹501 Temple Donation Receipt for ${templeName || 'Shri Mahakaleshwar Temple'}.\n\n📦 Order ID: ${orderId || 'PRARTHANA-123240'}\n🚩 Shiplystic Prarthana Ecosystem`;

  const metaPayload = {
    messaging_product: "whatsapp",
    recipient_type: "individual",
    to: cleanPhone,
    type: "document",
    document: {
      link: documentLink,
      filename: docFilename,
      caption: caption
    }
  };

  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
  const accessToken = process.env.WHATSAPP_ACCESS_TOKEN;

  // If WhatsApp Cloud API credentials are not yet set in .env
  if (!phoneNumberId || !accessToken) {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    return res.end(JSON.stringify({
      success: false,
      configured: false,
      message: 'WhatsApp Cloud API credentials not yet configured in .env (WHATSAPP_PHONE_NUMBER_ID and WHATSAPP_ACCESS_TOKEN required).',
      simulatedPayload: metaPayload
    }));
  }

  // Call Meta WhatsApp Business Cloud API
  try {
    const postData = JSON.stringify(metaPayload);

    const options = {
      hostname: 'graph.facebook.com',
      port: 443,
      path: `/v19.0/${phoneNumberId}/messages`,
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    };

    const graphRes = await new Promise((resolve, reject) => {
      const gReq = https.request(options, (gRes) => {
        let data = '';
        gRes.on('data', chunk => data += chunk);
        gRes.on('end', () => {
          try {
            resolve({ statusCode: gRes.statusCode, data: JSON.parse(data) });
          } catch (e) {
            resolve({ statusCode: gRes.statusCode, data });
          }
        });
      });
      gReq.on('error', reject);
      gReq.write(postData);
      gReq.end();
    });

    const isSuccess = graphRes.statusCode >= 200 && graphRes.statusCode < 300;
    res.statusCode = isSuccess ? 200 : (graphRes.statusCode || 400);
    res.setHeader('Content-Type', 'application/json');
    return res.end(JSON.stringify({
      success: isSuccess,
      configured: true,
      response: graphRes.data
    }));
  } catch (error) {
    res.statusCode = 500;
    res.setHeader('Content-Type', 'application/json');
    return res.end(JSON.stringify({ success: false, configured: true, error: error.message }));
  }
};
