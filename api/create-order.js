const https = require('https');

module.exports = async (req, res) => {
  // CORS configuration
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

  // Parse body if not already parsed
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

  try {
    const { orderId, orderAmount, customerName, customerPhone, customerEmail } = body || {};

    const appId = process.env.CASHFREE_APP_ID;
    const secretKey = process.env.CASHFREE_SECRET_KEY;
    const env = process.env.CASHFREE_ENV || 'sandbox';

    if (!appId || !secretKey) {
      res.statusCode = 500;
      res.setHeader('Content-Type', 'application/json');
      return res.end(JSON.stringify({
        error: 'Cashfree credentials not configured. Please set CASHFREE_APP_ID and CASHFREE_SECRET_KEY in environment variables.'
      }));
    }

    const hostname = env === 'production' ? 'api.cashfree.com' : 'sandbox.cashfree.com';

    // Format phone number to clean 10 digits
    const cleanPhone = (customerPhone || '9999999999').toString().replace(/[^0-9]/g, '').slice(-10) || '9999999999';
    const validOrderId = orderId || `PRARTHANA-${Math.floor(100000 + Math.random() * 900000)}`;
    const parsedAmount = Math.max(1, Number(orderAmount) || 1999);

    const postData = JSON.stringify({
      order_id: validOrderId,
      order_amount: parsedAmount,
      order_currency: 'INR',
      customer_details: {
        customer_id: `cust_${cleanPhone}`,
        customer_name: (customerName || 'Devotee').trim().slice(0, 50),
        customer_email: (customerEmail || 'devotee@shiplystic.com').trim().slice(0, 100),
        customer_phone: cleanPhone
      },
      order_meta: {
        return_url: `${req.headers.origin || 'https://prarthana.shiplystic.com'}/track-delivery?id=${validOrderId}`
      }
    });

    const options = {
      hostname,
      port: 443,
      path: '/pg/orders',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-client-id': appId,
        'x-client-secret': secretKey,
        'x-api-version': '2023-08-01',
        'Content-Length': Buffer.byteLength(postData)
      }
    };

    const cfResponse = await new Promise((resolve, reject) => {
      const cfReq = https.request(options, (cfRes) => {
        let data = '';
        cfRes.on('data', chunk => data += chunk);
        cfRes.on('end', () => {
          try {
            resolve({ statusCode: cfRes.statusCode, data: JSON.parse(data) });
          } catch (err) {
            resolve({ statusCode: cfRes.statusCode, data });
          }
        });
      });
      cfReq.on('error', reject);
      cfReq.write(postData);
      cfReq.end();
    });

    res.statusCode = cfResponse.statusCode >= 200 && cfResponse.statusCode < 300 ? 200 : (cfResponse.statusCode || 400);
    res.setHeader('Content-Type', 'application/json');
    return res.end(JSON.stringify({
      success: cfResponse.statusCode >= 200 && cfResponse.statusCode < 300,
      payment_session_id: cfResponse.data.payment_session_id,
      order_id: cfResponse.data.order_id,
      cf_order_id: cfResponse.data.cf_order_id,
      mode: env,
      raw: cfResponse.data
    }));
  } catch (error) {
    res.statusCode = 500;
    res.setHeader('Content-Type', 'application/json');
    return res.end(JSON.stringify({ success: false, error: error.message }));
  }
};
