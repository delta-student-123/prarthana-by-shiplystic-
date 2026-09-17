const { execFile } = require('child_process');
const fs = require('fs');

async function run() {
  const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
  const p = execFile(edgePath, [
    '--headless',
    '--remote-debugging-port=9231',
    '--disable-gpu',
    'http://127.0.0.1:5500/scratch/test_temples_opt1.html'
  ]);

  await new Promise(r => setTimeout(r, 2500));

  try {
    const listRes = await fetch('http://127.0.0.1:9231/json/list');
    const tabs = await listRes.json();
    const tab = tabs.find(t => t.url.includes('test_temples_opt1'));
    if (!tab) {
      console.log('No tab found');
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
    const send = (method, params = {}) => new Promise((resolve) => {
      const id = msgId++;
      callbacks.set(id, resolve);
      ws.send(JSON.stringify({ id, method, params }));
    });

    await send('Page.enable');
    await send('Runtime.enable');
    await send('Emulation.setDeviceMetricsOverride', { width: 1280, height: 720, deviceScaleFactor: 1, mobile: false });
    await new Promise(r => setTimeout(r, 500));

    const evalRes = await send('Runtime.evaluate', {
      expression: `(() => {
        const navContainer = document.querySelector('.nav-container');
        const logo = document.querySelector('.brand-logo');
        const nav = document.querySelector('.nav-container nav');
        const ctaBtn = document.querySelector('#header-cta-btn');
        const r = el => el ? { left: Math.round(el.getBoundingClientRect().left), right: Math.round(el.getBoundingClientRect().right), width: Math.round(el.getBoundingClientRect().width) } : null;
        return {
          windowWidth: window.innerWidth,
          navContainer: r(navContainer),
          logo: r(logo),
          nav: r(nav),
          ctaBtn: r(ctaBtn)
        };
      })()`,
      returnByValue: true
    });
    console.log('OPT1 BOXES:', JSON.stringify(evalRes.result ? evalRes.result.value : evalRes));

    const shot = await send('Page.captureScreenshot', { format: 'png', clip: { x: 0, y: 0, width: 1280, height: 100, scale: 1 } });
    fs.writeFileSync('scratch/header_opt1_1280.png', Buffer.from(shot.data, 'base64'));
    console.log('Saved scratch/header_opt1_1280.png');
    ws.close();
  } catch (e) {
    console.error(e);
  } finally {
    p.kill();
  }
}
run();
