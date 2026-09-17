const { execFile } = require('child_process');
const fs = require('fs');

async function testDropdown() {
  const p = execFile('C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe', [
    '--headless',
    '--remote-debugging-port=9234',
    '--disable-gpu',
    'http://127.0.0.1:5500/scratch/temp_width100.html'
  ]);
  await new Promise(r => setTimeout(r, 2200));
  const listRes = await fetch('http://127.0.0.1:9234/json/list');
  const tabs = await listRes.json();
  const tab = tabs.find(t => t.url.includes('temp_width100'));
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
  const send = (method, params = {}) => new Promise(resolve => {
    const id = msgId++;
    callbacks.set(id, resolve);
    ws.send(JSON.stringify({ id, method, params }));
  });
  await send('Page.enable');
  await send('Runtime.enable');
  await send('Emulation.setDeviceMetricsOverride', { width: 1280, height: 800, deviceScaleFactor: 1, mobile: false });
  await new Promise(r => setTimeout(r, 400));
  await send('Runtime.evaluate', {
    expression: 'document.querySelector(".shiplystic-mega-dropdown-wrapper").classList.add("open")'
  });
  await new Promise(r => setTimeout(r, 300));
  const shot = await send('Page.captureScreenshot', { format: 'png', clip: { x: 0, y: 0, width: 1280, height: 450, scale: 1 } });
  fs.writeFileSync('scratch/shot_dropdown_open.png', Buffer.from(shot.data, 'base64'));
  ws.close();
  p.kill();
  console.log('Saved scratch/shot_dropdown_open.png');
}

testDropdown();
