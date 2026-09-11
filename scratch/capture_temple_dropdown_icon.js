const { execFile } = require('child_process');
const fs = require('fs');

async function run() {
  const p = execFile('C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe', [
    '--headless',
    '--remote-debugging-port=9249',
    '--user-data-dir=C:\\Users\\Dell\\.gemini\\antigravity-ide\\brain\\d074ccbf-9e6b-467f-a1e2-d50eeb235f43\\scratch\\edge_prof8',
    '--disable-gpu',
    'http://127.0.0.1:5500/temples/vaishno-devi/'
  ]);
  await new Promise(r => setTimeout(r, 2200));
  const res = await fetch('http://127.0.0.1:9249/json/list');
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

  // Desktop viewport
  await send('Emulation.setDeviceMetricsOverride', {
    width: 1280,
    height: 800,
    deviceScaleFactor: 2,
    mobile: false
  });

  // Open the dropdown menu to test rotation
  await send('Runtime.evaluate', {
    expression: `(() => {
      document.querySelector('.shiplystic-mega-dropdown-wrapper').classList.add('open');
    })()`
  });

  await new Promise(r => setTimeout(r, 400));

  // Capture header with opened menu
  const capture = await send('Page.captureScreenshot', {
    format: 'png',
    clip: {
      x: 0,
      y: 0,
      width: 1280,
      height: 480,
      scale: 2
    }
  });

  fs.writeFileSync('scratch/header_dropdown_open_desktop.png', Buffer.from(capture.data, 'base64'));
  console.log('Opened header saved to scratch/header_dropdown_open_desktop.png');

  ws.close();
  p.kill();
}
run();
