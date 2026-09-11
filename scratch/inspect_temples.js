const { execFile } = require('child_process');
const fs = require('fs');

async function run() {
  const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
  const p = execFile(edgePath, [
    '--headless',
    '--remote-debugging-port=9225',
    '--disable-gpu',
    'http://127.0.0.1:5500/temples/'
  ]);

  // Wait for browser to initialize
  await new Promise(r => setTimeout(r, 2500));

  try {
    const listRes = await fetch('http://127.0.0.1:9225/json/list');
    const tabs = await listRes.json();
    const tab = tabs.find(t => t.url.includes('temples'));
    if (!tab) {
      console.error('No temples tab found');
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

    // Enable Page and Runtime
    await send('Page.enable');
    await send('Runtime.enable');

    // Emulate iPhone / Mobile Device (375x812)
    await send('Emulation.setDeviceMetricsOverride', {
      width: 375,
      height: 812,
      deviceScaleFactor: 2,
      mobile: true
    });

    await new Promise(r => setTimeout(r, 1000));

    // Evaluate checks
    const evalRes = await send('Runtime.evaluate', {
      expression: `(() => {
        const toggle = document.querySelector('.mobile-toggle');
        const header = document.querySelector('.header-nav');
        const navContainer = document.querySelector('.nav-container');
        const logo = document.querySelector('.brand-logo');
        const ctaBtn = document.querySelector('#header-cta-btn');
        const grid = document.querySelector('.temple-card-grid');

        const getBox = el => el ? el.getBoundingClientRect() : null;

        // Check horizontal overflow culprits
        const allElements = Array.from(document.body.querySelectorAll('*'));
        const overflowElements = allElements.filter(el => {
          const rect = el.getBoundingClientRect();
          return rect.right > window.innerWidth + 2;
        }).map(el => ({
          tag: el.tagName,
          class: el.className,
          id: el.id,
          right: el.getBoundingClientRect().right,
          width: el.getBoundingClientRect().width
        })).slice(0, 10);

        return {
          windowWidth: window.innerWidth,
          scrollWidth: document.documentElement.scrollWidth,
          bodyScrollWidth: document.body.scrollWidth,
          toggle: toggle ? {
            display: window.getComputedStyle(toggle).display,
            visibility: window.getComputedStyle(toggle).visibility,
            box: getBox(toggle)
          } : null,
          logoBox: getBox(logo),
          ctaBox: getBox(ctaBtn),
          ctaDisplay: ctaBtn ? window.getComputedStyle(ctaBtn).display : null,
          navContainerBox: getBox(navContainer),
          overflowCount: overflowElements.length,
          overflowSample: overflowElements
        };
      })()`,
      returnByValue: true
    });

    console.log('EVAL RESULT:\n', JSON.stringify(evalRes.result ? evalRes.result.value : evalRes, null, 2));

    // Capture mobile screenshot
    const screenshotRes = await send('Page.captureScreenshot', { format: 'png' });
    if (screenshotRes && screenshotRes.data) {
      fs.writeFileSync('scratch/temples_cdp_mobile.png', Buffer.from(screenshotRes.data, 'base64'));
      console.log('Saved scratch/temples_cdp_mobile.png');
    }

  } catch(e) {
    console.error('Error:', e);
  } finally {
    p.kill();
  }
}

run();
