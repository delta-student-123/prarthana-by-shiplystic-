const { execFile } = require('child_process');
const fs = require('fs');

async function run() {
  const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
  const p = execFile(edgePath, [
    '--headless',
    '--remote-debugging-port=9228',
    '--disable-gpu',
    'http://127.0.0.1:5500/temples/'
  ]);

  await new Promise(r => setTimeout(r, 2500));

  try {
    const listRes = await fetch('http://127.0.0.1:9228/json/list');
    const tabs = await listRes.json();
    const tab = tabs.find(t => t.url.includes('temples'));

    const ws = new WebSocket(tab.webSocketDebuggerUrl);
    let msgId = 1;
    const callbacks = new Map();

    ws.onmessage = (evt) => {
      const data = JSON.parse(evt.data);
      if (data.id && callbacks.has(data.id)) {
        const resolve = callbacks.get(data.id);
        callbacks.delete(data.id);
        resolve(data.result);
      }
    };

    await new Promise(r => ws.onopen = r);

    const send = (method, params = {}) => {
      return new Promise((resolve) => {
        const id = msgId++;
        callbacks.set(id, resolve);
        ws.send(JSON.stringify({ id, method, params }));
      });
    };

    await send('Page.enable');
    await send('Runtime.enable');

    await send('Emulation.setDeviceMetricsOverride', {
      width: 375,
      height: 812,
      deviceScaleFactor: 2,
      mobile: true
    });

    // Accept cookie
    await send('Runtime.evaluate', {
      expression: `(() => {
        const btn = document.querySelector('#cookie-consent-accept, button[onclick*="accept"], .cookie-btn-accept');
        if (btn) btn.click();
        const banner = document.getElementById('cookieConsentBanner');
        if (banner) banner.style.display = 'none';
      })()`
    });

    await new Promise(r => setTimeout(r, 500));

    // Scroll to temple cards
    await send('Runtime.evaluate', {
      expression: `window.scrollTo(0, 600)`
    });

    await new Promise(r => setTimeout(r, 500));

    const ss = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync('scratch/temples_page_cards_mobile.png', Buffer.from(ss.data, 'base64'));
    console.log('Saved scratch/temples_page_cards_mobile.png');

    // Scroll further down
    await send('Runtime.evaluate', {
      expression: `window.scrollTo(0, 1400)`
    });

    await new Promise(r => setTimeout(r, 500));

    const ss2 = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync('scratch/temples_page_cards_mobile_2.png', Buffer.from(ss2.data, 'base64'));
    console.log('Saved scratch/temples_page_cards_mobile_2.png');

  } catch(e) {
    console.error('Error:', e);
  } finally {
    p.kill();
  }
}

run();
