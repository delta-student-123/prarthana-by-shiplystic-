const { execFile } = require('child_process');
const fs = require('fs');

async function run() {
  const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
  const p = execFile(edgePath, [
    '--headless',
    '--remote-debugging-port=9227',
    '--disable-gpu',
    'http://127.0.0.1:5500/index.html'
  ]);

  await new Promise(r => setTimeout(r, 2500));

  try {
    const listRes = await fetch('http://127.0.0.1:9227/json/list');
    const tabs = await listRes.json();
    const tab = tabs.find(t => t.url.includes('5500'));
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

    // 1. Mobile 320x568
    await send('Emulation.setDeviceMetricsOverride', {
      width: 320,
      height: 568,
      deviceScaleFactor: 2,
      mobile: true
    });
    await new Promise(r => setTimeout(r, 800));

    const shotMobile = await send('Page.captureScreenshot', {
      format: 'png',
      clip: { x: 0, y: 0, width: 320, height: 568, scale: 1 }
    });
    fs.writeFileSync('scratch/home_hero_mobile.png', Buffer.from(shotMobile.data, 'base64'));
    console.log('Saved scratch/home_hero_mobile.png');

    // 2. Desktop 1200x700
    await send('Emulation.setDeviceMetricsOverride', {
      width: 1200,
      height: 700,
      deviceScaleFactor: 1,
      mobile: false
    });
    await new Promise(r => setTimeout(r, 800));

    const shotDesk = await send('Page.captureScreenshot', {
      format: 'png',
      clip: { x: 0, y: 0, width: 1200, height: 700, scale: 1 }
    });
    fs.writeFileSync('scratch/home_hero_desktop.png', Buffer.from(shotDesk.data, 'base64'));
    console.log('Saved scratch/home_hero_desktop.png');

    ws.close();
  } catch (err) {
    console.error('Error:', err);
  } finally {
    p.kill();
  }
}

run();
