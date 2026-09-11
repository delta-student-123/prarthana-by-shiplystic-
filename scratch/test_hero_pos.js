const { execFile } = require('child_process');
const fs = require('fs');

async function testPosition(pos, overlay, width, name) {
  const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
  const port = 9230;
  const p = execFile(edgePath, [
    '--headless',
    `--remote-debugging-port=${port}`,
    '--disable-gpu',
    'http://127.0.0.1:5500/index.html'
  ]);

  await new Promise(r => setTimeout(r, 2200));

  try {
    const listRes = await fetch(`http://127.0.0.1:${port}/json/list`);
    const tabs = await listRes.json();
    const tab = tabs.find(t => t.url.includes('5500'));
    if (!tab) {
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

    await send('Emulation.setDeviceMetricsOverride', {
      width: width,
      height: 640,
      deviceScaleFactor: 2,
      mobile: true
    });

    await send('Runtime.evaluate', {
      expression: `(() => {
        const styleCookie = document.createElement('style');
        styleCookie.textContent = '#cookie-consent-banner, #cookie-consent-backdrop { display: none !important; }';
        document.head.appendChild(styleCookie);

        const style = document.createElement('style');
        style.textContent = \`
          .hero-split-section {
            background-image: url('images/temples/somnath.jpg') !important;
            background-position: ${pos} !important;
            background-size: cover !important;
            background-repeat: no-repeat !important;
            padding: 1.8rem 0 2rem !important;
          }
          .hero-bg-overlay {
            background: ${overlay} !important;
          }
          .hero-banner-title {
            text-shadow: 0 1px 3px rgba(255,255,255,0.8) !important;
          }
          .hero-split-subtext {
            color: #1E293B !important;
            font-weight: 550 !important;
            text-shadow: 0 1px 2px rgba(255,255,255,0.9) !important;
          }
        \`;
        document.head.appendChild(style);
      })()`
    });

    await new Promise(r => setTimeout(r, 600));

    const shot = await send('Page.captureScreenshot', {
      format: 'png',
      clip: { x: 0, y: 0, width: width, height: 640, scale: 1 }
    });
    fs.writeFileSync(`scratch/${name}.png`, Buffer.from(shot.data, 'base64'));
    console.log(`Saved scratch/${name}.png`);

    ws.close();
  } catch (e) {
    console.error(e);
  } finally {
    p.kill();
  }
}

async function run() {
  const overlay = 'linear-gradient(180deg, rgba(255, 255, 255, 0.78) 0%, rgba(255, 253, 249, 0.55) 35%, rgba(255, 253, 249, 0.85) 75%, #FFFDF9 100%)';
  
  // 320px width (user test size) with 68% center
  await testPosition('68% center', overlay, 320, 'pos_320_68');
  await testPosition('68% center', overlay, 360, 'pos_360_68');
}

run();
