const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

// Simple .env parser if not run with --env-file
if (fs.existsSync(path.join(__dirname, '.env'))) {
  const envContent = fs.readFileSync(path.join(__dirname, '.env'), 'utf-8');
  envContent.split('\n').forEach(line => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#')) {
      const idx = trimmed.indexOf('=');
      if (idx !== -1) {
        const key = trimmed.slice(0, idx).trim();
        const val = trimmed.slice(idx + 1).trim();
        if (!process.env[key]) process.env[key] = val;
      }
    }
  });
}

const createOrderHandler = require('./api/create-order.js');
const verifyPaymentHandler = require('./api/verify-payment.js');
const sendWhatsappReceiptHandler = require('./api/send-whatsapp-receipt.js');
const receiptPdfHandler = require('./api/receipt-pdf.js');

const PORT = process.env.PORT || 3000;
const ROOT_DIR = __dirname;

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.webp': 'image/webp',
  '.xml': 'application/xml',
  '.webmanifest': 'application/manifest+json',
  '.pdf': 'application/pdf'
};

const server = http.createServer(async (req, res) => {
  const parsed = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  const pathname = parsed.pathname;

  // API routing
  if (pathname === '/api/create-order' || pathname === '/api/create-order.js') {
    return createOrderHandler(req, res);
  }
  if (pathname === '/api/verify-payment' || pathname === '/api/verify-payment.js') {
    return verifyPaymentHandler(req, res);
  }
  if (pathname === '/api/send-whatsapp-receipt' || pathname === '/api/send-whatsapp-receipt.js') {
    return sendWhatsappReceiptHandler(req, res);
  }
  if (pathname === '/api/receipt-pdf' || pathname === '/api/receipt-pdf.js') {
    return receiptPdfHandler(req, res);
  }

  // Static file handling with clean URLs
  let filePath = path.join(ROOT_DIR, pathname);

  // If path is a directory or root, check index.html
  if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
    filePath = path.join(filePath, 'index.html');
  } else if (!fs.existsSync(filePath)) {
    // Check if adding .html exists (clean URLs)
    if (fs.existsSync(filePath + '.html')) {
      filePath = filePath + '.html';
    } else if (fs.existsSync(path.join(filePath, 'index.html'))) {
      filePath = path.join(filePath, 'index.html');
    }
  }

  if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
    const ext = path.extname(filePath).toLowerCase();
    const mime = MIME_TYPES[ext] || 'application/octet-stream';
    res.writeHead(200, { 'Content-Type': mime });
    fs.createReadStream(filePath).pipe(res);
  } else {
    res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end('<h1>404 Not Found</h1><p>The requested page could not be found.</p>');
  }
});

server.listen(PORT, () => {
  console.log(`\n🚀 Prarthana by Shiplystic Server running at: http://localhost:${PORT}`);
  console.log(`💳 Cashfree Test Environment: ${process.env.CASHFREE_ENV || 'sandbox'}`);
  console.log(`Press Ctrl+C to stop.\n`);
});
