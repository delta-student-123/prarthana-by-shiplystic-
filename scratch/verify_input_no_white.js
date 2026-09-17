const { execFile } = require('child_process');
const fs = require('fs');
const path = require('path');

async function verifyInput() {
  const filePath = path.resolve('track.html').replace(/\\/g, '/');
  const fileUrl = `file:///${filePath}`;

  const edgeProc = execFile('C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe', [
    '--headless',
    '--remote-debugging-port=9244',
    '--disable-gpu',
    '--window-size=1280,800',
    fileUrl
  ]);

  await new Promise(r => setTimeout(r, 2000));

  try {
    const listRes = await fetch('http://127.0.0.1:9244/json/list');
    const tabs = await listRes.json();
    const tab = tabs.find(t => t.url.includes('track.html'));
    if (!tab) {
      console.log('Tab not found, tabs:', tabs);
      edgeProc.kill();
      return;
    }

    const ws = new WebSocket(tab.webSocketDebuggerUrl);
    let msgId = 1;
    const send = (method, params = {}) => new Promise((resolve) => {
      const id = msgId++;
      const handler = (evt) => {
        const d = JSON.parse(evt.data);
        if (d.id === id) {
          ws.removeEventListener('message', handler);
          resolve(d.result);
        }
      };
      ws.addEventListener('message', handler);
      ws.send(JSON.stringify({ id, method, params }));
    });

    await new Promise(r => ws.addEventListener('open', r));

    // Type text into input
    await send('Runtime.evaluate', {
      expression: `
        const input = document.getElementById('tracking-input');
        input.value = 'PRARTHANA-892341';
        input.focus();
      `
    });

    await new Promise(r => setTimeout(r, 500));

    // Check computed styles
    const styles = await send('Runtime.evaluate', {
      expression: `
        (() => {
          const input = document.getElementById('tracking-input');
          const comp = window.getComputedStyle(input);
          return {
            backgroundColor: comp.backgroundColor,
            color: comp.color,
            boxShadow: comp.boxShadow,
            border: comp.border
          };
        })()
      `,
      returnByValue: true
    });

    console.log('Computed styles of tracking-input:', styles.result.value);

    // Capture screenshot
    const screenshot = await send('Page.captureScreenshot', {
      clip: { x: 200, y: 350, width: 880, height: 260, scale: 1 }
    });

    fs.writeFileSync('scratch/track_input_clean.png', Buffer.from(screenshot.data, 'base64'));
    console.log('Screenshot saved to scratch/track_input_clean.png');

    ws.close();
  } catch (err) {
    console.error('Error during verification:', err);
  } finally {
    edgeProc.kill();
  }
}

verifyInput();
