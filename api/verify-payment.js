const https = require('https');
const url = require('url');

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.statusCode = 200;
    return res.end();
  }

  try {
    const parsedUrl = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
    const orderId = parsedUrl.searchParams.get('order_id') || req.query?.order_id;

    if (!orderId) {
      res.statusCode = 400;
      res.setHeader('Content-Type', 'application/json');
      return res.end(JSON.stringify({ error: 'order_id parameter is required' }));
    }

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

    const options = {
      hostname,
      port: 443,
      path: `/pg/orders/${encodeURIComponent(orderId)}`,
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'x-client-id': appId,
        'x-client-secret': secretKey,
        'x-api-version': '2023-08-01'
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
      cfReq.end();
    });

    res.statusCode = cfResponse.statusCode || 200;
    res.setHeader('Content-Type', 'application/json');
    return res.end(JSON.stringify(cfResponse.data));
  } catch (error) {
    res.statusCode = 500;
    res.setHeader('Content-Type', 'application/json');
    return res.end(JSON.stringify({ error: error.message }));
  }
};
