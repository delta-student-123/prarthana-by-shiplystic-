const { execFile } = require('child_process');
const fs = require('fs');

async function testVaishno() {
  const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
  const port = 9231;
  const p = execFile(edgePath, [
    '--headless',
    `--remote-debugging-port=${port}`,
    '--disable-gpu',
    'http://127.0.0.1:5500/temples/vaishno-devi'
  ]);

  await new Promise(r => setTimeout(r, 2400));

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

    // 1. Mobile 320x640
    await send('Emulation.setDeviceMetricsOverride', {
      width: 320,
      height: 640,
      deviceScaleFactor: 2,
      mobile: true
    });
    await new Promise(r => setTimeout(r, 600));

    const shotMobile = await send('Page.captureScreenshot', {
      format: 'png',
      clip: { x: 0, y: 0, width: 320, height: 640, scale: 1 }
    });
    fs.writeFileSync('scratch/vaishno_mobile_320.png', Buffer.from(shotMobile.data, 'base64'));
    console.log('Saved scratch/vaishno_mobile_320.png');

    // 2. Desktop 1200x700
    await send('Emulation.setDeviceMetricsOverride', {
      width: 1200,
      height: 700,
      deviceScaleFactor: 1,
      mobile: false
    });
    await new Promise(r => setTimeout(r, 600));

    const shotDesk = await send('Page.captureScreenshot', {
      format: 'png',
      clip: { x: 0, y: 0, width: 1200, height: 700, scale: 1 }
    });
    fs.writeFileSync('scratch/vaishno_desktop.png', Buffer.from(shotDesk.data, 'base64'));
    console.log('Saved scratch/vaishno_desktop.png');

    ws.close();
  } catch (err) {
    console.error('Error:', err);
  } finally {
    p.kill();
  }
}

testVaishno();
