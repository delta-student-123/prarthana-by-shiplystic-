const { execFile } = require('child_process');
const fs = require('fs');

async function run() {
  const p = execFile('C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe', [
    '--headless',
    '--remote-debugging-port=9245',
    '--user-data-dir=C:\\Users\\Dell\\.gemini\\antigravity-ide\\brain\\d074ccbf-9e6b-467f-a1e2-d50eeb235f43\\scratch\\edge_prof4',
    '--disable-gpu',
    'http://127.0.0.1:5500/temples/vaishno-devi.html'
  ]);
  await new Promise(r => setTimeout(r, 2200));
  const res = await fetch('http://127.0.0.1:9245/json/list');
  const tabs = await res.json();
  const tab = tabs.find(t => t.url.includes('vaishno-devi'));
  const ws = new WebSocket(tab.webSocketDebuggerUrl);
  await new Promise(r => ws.onopen = r);
  let id = 1;
  const send = (m, params={}) => new Promise(resolve => {
    const cur = id++;
    const handler = (evt) => {
      const d = JSON.parse(evt.data);
      if (d.id === cur) { ws.removeEventListener('message', handler); resolve(d.result); }
    };
    ws.addEventListener('message', handler);
    ws.send(JSON.stringify({ id: cur, method: m, params }));
  });
  await send('Page.enable');
  await send('Runtime.enable');

  // Dismiss cookie banner
  await send('Runtime.evaluate', {
    expression: `(() => {
      const b = document.getElementById('cookie-consent-banner');
      if (b) b.remove();
      const bd = document.getElementById('cookie-consent-backdrop');
      if (bd) bd.remove();
    })()`
  });

  // Mobile viewport (375x812)
  await send('Emulation.setDeviceMetricsOverride', {
    width: 375,
    height: 812,
    deviceScaleFactor: 2,
    mobile: true
  });

  // Call showComingSoon()
  await send('Runtime.evaluate', {
    expression: `showComingSoon();`
  });

  await new Promise(r => setTimeout(r, 600));

  const capture = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('scratch/vaishno_mobile_modal_verified.png', Buffer.from(capture.data, 'base64'));
  console.log('Mobile screenshot saved to scratch/vaishno_mobile_modal_verified.png');

  ws.close();
  p.kill();
}
run();
