const { execFile } = require('child_process');
const fs = require('fs');

async function run() {
  const p = execFile('C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe', [
    '--headless',
    '--remote-debugging-port=9242',
    '--user-data-dir=C:\\Users\\Dell\\.gemini\\antigravity-ide\\brain\\d074ccbf-9e6b-467f-a1e2-d50eeb235f43\\scratch\\edge_profile2',
    '--disable-gpu',
    'http://127.0.0.1:5500/temples/vaishno-devi.html'
  ]);

  await new Promise(r => setTimeout(r, 2200));
  const res = await fetch('http://127.0.0.1:9242/json/list');
  const tabs = await res.json();
  const tab = tabs.find(t => t.url.includes('vaishno-devi'));
  const ws = new WebSocket(tab.webSocketDebuggerUrl);
  await new Promise(r => ws.onopen = r);

  let id = 1;
  const send = (m, params={}) => new Promise(resolve => {
    const cur = id++;
    const handler = (evt) => {
      const d = JSON.parse(evt.data);
      if (d.id === cur) {
        ws.removeEventListener('message', handler);
        resolve(d.result);
      }
    };
    ws.addEventListener('message', handler);
    ws.send(JSON.stringify({ id: cur, method: m, params }));
  });

  await send('Page.enable');
  await send('Runtime.enable');
  await send('Emulation.setDeviceMetricsOverride', {
    width: 375,
    height: 812,
    deviceScaleFactor: 2,
    mobile: true
  });

  // Remove cookie banner
  await send('Runtime.evaluate', {
    expression: `(() => {
      const b = document.getElementById('cookie-consent-banner');
      if (b) b.remove();
      const bd = document.getElementById('cookie-consent-backdrop');
      if (bd) bd.remove();
    })()`
  });

  const eval1 = await send('Runtime.evaluate', {
    expression: `(() => {
      showComingSoon();
      const modal = document.getElementById('comingSoonModal');
      return {
        className: modal ? modal.className : 'null',
        display: modal ? window.getComputedStyle(modal).display : 'null',
        zIndex: modal ? window.getComputedStyle(modal).zIndex : 'null',
        visibility: modal ? window.getComputedStyle(modal).visibility : 'null',
        opacity: modal ? window.getComputedStyle(modal).opacity : 'null',
        rect: modal ? modal.getBoundingClientRect() : 'null'
      };
    })()`,
    returnByValue: true
  });

  console.log('Eval result on mobile:', eval1.result.value);

  await new Promise(r => setTimeout(r, 400));
  const capture = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('scratch/mob_modal_test.png', Buffer.from(capture.data, 'base64'));
  console.log('Saved mob_modal_test.png');

  ws.close();
  p.kill();
}

run();
