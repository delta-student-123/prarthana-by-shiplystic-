const fs = require('fs');

const trackHtml = fs.readFileSync('track.html', 'utf8');
const trackDeliveryHtml = fs.readFileSync('track-delivery/index.html', 'utf8');
const mainJs = fs.readFileSync('js/main.js', 'utf8');
const styleCss = fs.readFileSync('css/style.css', 'utf8');

const requiredIds = [
  'tracking-search-form',
  'tracking-input',
  'track-pill-awb',
  'track-pill-order',
  'tracking-loading-card',
  'tracking-error-card',
  'track-error-msg',
  'track-whatsapp-help-btn',
  'tracking-result-card',
  'track-id-type-label',
  'track-courier-partner',
  'track-order-ref',
  'track-res-id',
  'track-res-status',
  'track-route-banner',
  'track-res-origin',
  'track-res-destination',
  'track-res-edd',
  'track-order-summary-pills',
  'track-res-temple',
  'track-res-package',
  'track-res-devotee',
  'track-res-gotra',
  'track-timeline',
  'track-initial-info'
];

let allPassed = true;

console.log('--- Checking HTML IDs ---');
requiredIds.forEach(id => {
  const inTrack = trackHtml.includes(`id="${id}"`);
  const inTrackDelivery = trackDeliveryHtml.includes(`id="${id}"`);
  if (!inTrack) {
    console.error(`FAIL: Missing id="${id}" in track.html`);
    allPassed = false;
  }
  if (!inTrackDelivery) {
    console.error(`FAIL: Missing id="${id}" in track-delivery/index.html`);
    allPassed = false;
  }
});

console.log('--- Checking JS Integration ---');
const jsChecks = [
  { name: 'API endpoint URL', test: mainJs.includes('https://admin.shiplystic.com/api/track-multiple') },
  { name: 'AwbNumbers parameter in request body', test: mainJs.includes('AwbNumbers:') },
  { name: 'fetchLiveTracking function', test: mainJs.includes('async function fetchLiveTracking') },
  { name: 'renderTrackingResult function', test: mainJs.includes('async function renderTrackingResult') },
  { name: 'copyTrackingId function', test: mainJs.includes('window.copyTrackingId') },
  { name: 'trackSampleOrder function', test: mainJs.includes('window.trackSampleOrder') },
  { name: 'renderApiShipment function', test: mainJs.includes('function renderApiShipment') },
  { name: 'renderLocalOrder function', test: mainJs.includes('function renderLocalOrder') },
  { name: 'renderTrackingErrorCard function', test: mainJs.includes('function renderTrackingErrorCard') },
  { name: 'selectTrackPill function', test: mainJs.includes('function selectTrackPill') }
];

jsChecks.forEach(check => {
  if (check.test) {
    console.log(`PASS: ${check.name}`);
  } else {
    console.error(`FAIL: ${check.name}`);
    allPassed = false;
  }
});

console.log('--- Checking CSS Classes ---');
const cssChecks = [
  '.track-loading-card',
  '.track-spinner',
  '.track-error-card',
  '.track-route-card',
  '.track-route-point',
  '.track-route-mid',
  '.track-route-line',
  '.track-route-icon',
  '.track-edd-chip',
  '.track-courier-badge',
  '.track-status-pill',
  '.track-status-delivered',
  '.track-status-outfordelivery',
  '.track-status-intransit',
  '.track-copy-btn',
  '.track-event-card',
  '.track-event-dot'
];

cssChecks.forEach(cls => {
  if (styleCss.includes(cls)) {
    console.log(`PASS: CSS class ${cls}`);
  } else {
    console.error(`FAIL: Missing CSS class ${cls}`);
    allPassed = false;
  }
});

if (allPassed) {
  console.log('\n🌟 ALL VERIFICATION CHECKS PASSED SUCCESSFULLY! 🌟');
} else {
  console.error('\n❌ SOME CHECKS FAILED!');
  process.exit(1);
}
