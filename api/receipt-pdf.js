const url = require('url');
const { getReceiptPdf, getReceiptMetadata } = require('../lib/receipt-store.js');
const { generateFallbackReceiptPdf } = require('../lib/receipt-generator.js');

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.statusCode = 200;
    return res.end();
  }

  const parsedUrl = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  const orderId = parsedUrl.searchParams.get('order_id') || 'PRARTHANA-123240';
  const format = parsedUrl.searchParams.get('format');
  const rawId = orderId.replace(/[^0-9]/g, '');
  const cleanNum = rawId ? rawId.slice(-6).padStart(6, '1') : '123240';
  const filename = `Temple_Donation_Receipt_${cleanNum}.pdf`;

  // Explicit HTML format requested for browser preview
  if (format === 'html') {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    return res.end(getPreviewHtml(orderId, cleanNum));
  }

  // DEFAULT & META CLOUD API: Return genuine binary PDF stream
  try {
    let pdfBuffer = getReceiptPdf(orderId);

    if (!pdfBuffer) {
      const meta = getReceiptMetadata(orderId) || {};
      const generatedBytes = await generateFallbackReceiptPdf({
        orderId,
        devoteeName: meta.devoteeName || parsedUrl.searchParams.get('devotee') || 'Jayshree Patil',
        templeName: meta.templeName || parsedUrl.searchParams.get('temple') || 'Shri Mahakaleshwar Temple',
        amount: meta.amount || parsedUrl.searchParams.get('amount') || 501,
        date: meta.date || parsedUrl.searchParams.get('date'),
        purpose: meta.purpose || parsedUrl.searchParams.get('purpose') || 'Temple Puja & Prarthana Dakshina Pass-Through'
      });
      pdfBuffer = Buffer.from(generatedBytes);
    }

    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `inline; filename="${filename}"`);
    res.setHeader('Content-Length', pdfBuffer.length);
    res.setHeader('Cache-Control', 'public, max-age=86400');
    return res.end(pdfBuffer);
  } catch (error) {
    console.error('Error serving receipt PDF:', error);
    res.statusCode = 500;
    res.setHeader('Content-Type', 'application/json');
    return res.end(JSON.stringify({ error: 'Failed to generate receipt PDF', details: error.message }));
  }
};

function getPreviewHtml(orderId, cleanNum) {
  return `
  <!DOCTYPE html>
  <html lang="hi">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Temple Donation Receipt #${cleanNum}</title>
    <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+Devanagari:wght@400;600;700;800;900&display=swap" rel="stylesheet">
    <style>
      * { box-sizing: border-box; }
      body { margin: 0; padding: 20px; background: #F4EFE6; font-family: 'Noto Sans Devanagari', sans-serif; text-align: center; }
      .actions { margin-bottom: 20px; }
      .btn { display: inline-block; padding: 10px 20px; background: #EA580C; color: #FFF; text-decoration: none; border-radius: 6px; font-weight: bold; }
    </style>
  </head>
  <body>
    <div class="actions">
      <a class="btn" href="/api/receipt-pdf?order_id=${encodeURIComponent(orderId)}">📥 Download Binary PDF</a>
    </div>
    <h2>Official Temple Donation Receipt #${cleanNum}</h2>
    <p>PDF Stream active. Viewable directly at <a href="/api/receipt-pdf?order_id=${encodeURIComponent(orderId)}">/api/receipt-pdf?order_id=${orderId}</a></p>
  </body>
  </html>
  `;
}
