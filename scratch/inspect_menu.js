const { execFile } = require('child_process');
const fs = require('fs');

async function run() {
  const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
  const p = execFile(edgePath, [
    '--headless',
    '--remote-debugging-port=9226',
    '--disable-gpu',
    'http://127.0.0.1:5500/temples/'
  ]);

  await new Promise(r => setTimeout(r, 2500));

  try {
    const listRes = await fetch('http://127.0.0.1:9226/json/list');
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

    // Accept or close cookie banner so we can see clearly
    await send('Runtime.evaluate', {
      expression: `(() => {
        const btn = document.querySelector('#cookie-consent-accept, button[onclick*="accept"], .cookie-btn-accept');
        if (btn) btn.click();
      })()`
    });

    await new Promise(r => setTimeout(r, 500));

    // Click mobile hamburger menu toggle
    const clickRes = await send('Runtime.evaluate', {
      expression: `(() => {
        const toggle = document.querySelector('.mobile-toggle');
        if (toggle) {
          toggle.click();
          const nav = document.querySelector('header nav');
          return {
            clicked: true,
            hasMobileOpen: nav ? nav.classList.contains('mobile-open') : false,
            navDisplay: nav ? window.getComputedStyle(nav).display : null,
            navLinksDisplay: document.querySelector('.nav-links') ? window.getComputedStyle(document.querySelector('.nav-links')).display : null
          };
        }
        return { clicked: false };
      })()`,
      returnByValue: true
    });

    console.log('CLICK RESULT:', JSON.stringify(clickRes.result ? clickRes.result.value : clickRes, null, 2));

    await new Promise(r => setTimeout(r, 600));

    // Capture screenshot with menu open
    const ss1 = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync('scratch/temples_menu_open.png', Buffer.from(ss1.data, 'base64'));
    console.log('Saved scratch/temples_menu_open.png');

  } catch(e) {
    console.error('Error:', e);
  } finally {
    p.kill();
  }
}

run();
