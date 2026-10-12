const fs = require('fs');
const path = require('path');
const os = require('os');

// In-memory cache for fast lookups
const memoryCache = new Map();

// Local cache directory
const CACHE_DIR = path.join(os.tmpdir(), 'prarthana_receipts');
try {
  if (!fs.existsSync(CACHE_DIR)) {
    fs.mkdirSync(CACHE_DIR, { recursive: true });
  }
} catch (e) {
  // Ignore filesystem permission issues
}

function normalizeKey(orderId) {
  if (!orderId) return 'PRARTHANA-123240';
  return String(orderId).trim().toUpperCase();
}

function storeReceiptPdf(orderId, pdfBufferOrBase64, metadata = {}) {
  const key = normalizeKey(orderId);
  let buffer;

  if (Buffer.isBuffer(pdfBufferOrBase64)) {
    buffer = pdfBufferOrBase64;
  } else if (typeof pdfBufferOrBase64 === 'string') {
    const clean = pdfBufferOrBase64.replace(/^data:application\/pdf;base64,/, '');
    buffer = Buffer.from(clean, 'base64');
  } else {
    return false;
  }

  memoryCache.set(key, { buffer, metadata, timestamp: Date.now() });

  // Persist to disk cache
  try {
    const filePath = path.join(CACHE_DIR, `${key}.pdf`);
    fs.writeFileSync(filePath, buffer);
    const metaPath = path.join(CACHE_DIR, `${key}.json`);
    fs.writeFileSync(metaPath, JSON.stringify(metadata));
  } catch (e) {
    // Disk write error ignored
  }

  return true;
}

function getReceiptPdf(orderId) {
  const key = normalizeKey(orderId);

  // Check in-memory cache first
  if (memoryCache.has(key)) {
    return memoryCache.get(key).buffer;
  }

  // Check disk cache
  try {
    const filePath = path.join(CACHE_DIR, `${key}.pdf`);
    if (fs.existsSync(filePath)) {
      const buffer = fs.readFileSync(filePath);
      memoryCache.set(key, { buffer, timestamp: Date.now() });
      return buffer;
    }
  } catch (e) {
    // Disk read error ignored
  }

  return null;
}

function getReceiptMetadata(orderId) {
  const key = normalizeKey(orderId);
  if (memoryCache.has(key) && memoryCache.get(key).metadata) {
    return memoryCache.get(key).metadata;
  }
  try {
    const metaPath = path.join(CACHE_DIR, `${key}.json`);
    if (fs.existsSync(metaPath)) {
      return JSON.parse(fs.readFileSync(metaPath, 'utf8'));
    }
  } catch (e) {}
  return null;
}

module.exports = {
  storeReceiptPdf,
  getReceiptPdf,
  getReceiptMetadata
};
