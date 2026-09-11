const { execFile } = require('child_process');
const fs = require('fs');

async function testStyle(cssRules, outputName) {
  const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
  const p = execFile(edgePath, [
    '--headless',
    '--remote-debugging-port=9228',
    '--disable-gpu',
    'http://127.0.0.1:5500/index.html'
  ]);

  await new Promise(r => setTimeout(r, 2200));

  try {
    const listRes = await fetch('http://127.0.0.1:9228/json/list');
    const tabs = await listRes.json();
    const tab = tabs.find(t => t.url.includes('5500'));
    if (!tab) {
      console.log('Tab not found');
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
      width: 360,
      height: 640,
      deviceScaleFactor: 2,
      mobile: true
    });

    // Remove cookie banner
    await send('Runtime.evaluate', {
      expression: `(() => {
        const banner = document.getElementById('cookie-consent-banner');
        if (banner) banner.remove();
        const backdrop = document.getElementById('cookie-consent-backdrop');
        if (backdrop) backdrop.remove();

        // Inject custom CSS to test
        const style = document.createElement('style');
        style.id = 'test-hero-style';
        style.textContent = \`${cssRules}\`;
        document.head.appendChild(style);
      })()`
    });

    await new Promise(r => setTimeout(r, 500));

    const shot = await send('Page.captureScreenshot', {
      format: 'png',
      clip: { x: 0, y: 0, width: 360, height: 640, scale: 1 }
    });
    fs.writeFileSync(`scratch/${outputName}.png`, Buffer.from(shot.data, 'base64'));
    console.log(`Saved scratch/${outputName}.png`);

    ws.close();
  } catch (e) {
    console.error(e);
  } finally {
    p.kill();
  }
}

async function main() {
  // Test 1: Light semi-transparent overlay so somnath temple background is clearly visible
  const test1 = `
    .hero-split-section {
      background-position: center right !important;
      background-size: cover !important;
    }
    .hero-bg-overlay {
      background: linear-gradient(180deg, rgba(255,255,255,0.72) 0%, rgba(255,253,249,0.45) 40%, rgba(255,253,249,0.85) 100%) !important;
    }
  `;
  await testStyle(test1, 'test_bg_visible');
}

main();
