const { execFile } = require('child_process');
const fs = require('fs');
const path = require('path');

async function captureModal() {
  const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
  const port = 9240;
  const userDataDir = 'C:\\Users\\Dell\\.gemini\\antigravity-ide\\brain\\d074ccbf-9e6b-467f-a1e2-d50eeb235f43\\scratch\\edge_profile';
  const p = execFile(edgePath, [
    '--headless',
    `--remote-debugging-port=${port}`,
    `--user-data-dir=${userDataDir}`,
    '--disable-gpu',
    'http://127.0.0.1:5500/temples/vaishno-devi.html'
  ]);

  await new Promise(r => setTimeout(r, 2200));

  try {
    const listRes = await fetch(`http://127.0.0.1:${port}/json/list`);
    const tabs = await listRes.json();
    const tab = tabs.find(t => t.url.includes('vaishno-devi'));
    if (!tab) {
      console.log('Tab not found, tabs:', tabs);
      p.kill();
      return;
    }

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

    // Dismiss cookie banner
    await send('Runtime.evaluate', {
      expression: `(() => {
        const style = document.createElement('style');
        style.textContent = '#cookie-consent-banner, #cookie-consent-backdrop { display: none !important; }';
        document.head.appendChild(style);
      })()`
    });

    // Desktop viewport
    await send('Emulation.setDeviceMetricsOverride', {
      width: 1280,
      height: 900,
      deviceScaleFactor: 1,
      mobile: false
    });

    // Trigger showComingSoon()
    await send('Runtime.evaluate', {
      expression: `(() => {
        showComingSoon();
      })()`
    });

    await new Promise(r => setTimeout(r, 600));

    // Capture screenshot
    const res = await send('Page.captureScreenshot', { format: 'png' });
    const buffer = Buffer.from(res.data, 'base64');
    fs.writeFileSync('scratch/vaishno_launch_modal.png', buffer);
    console.log('Desktop launch popup screenshot saved!');

    // Mobile viewport
    await send('Emulation.setDeviceMetricsOverride', {
      width: 375,
      height: 812,
      deviceScaleFactor: 2,
      mobile: true
    });

    await send('Runtime.evaluate', {
      expression: `(() => {
        showComingSoon();
      })()`
    });

    await new Promise(r => setTimeout(r, 500));
    const resMob = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync('scratch/vaishno_launch_modal_mobile.png', Buffer.from(resMob.data, 'base64'));
    console.log('Mobile launch popup screenshot saved!');

    ws.close();
    p.kill();
  } catch (err) {
    console.error('Error:', err);
    p.kill();
  }
}

captureModal();
