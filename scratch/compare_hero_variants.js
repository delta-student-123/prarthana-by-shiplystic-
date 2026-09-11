const { execFile } = require('child_process');
const fs = require('fs');

async function testMobileHero(variant, cssRules, jsInject, outputName) {
  const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
  const port = 9229;
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
      height: 740,
      deviceScaleFactor: 2,
      mobile: true
    });

    await send('Runtime.evaluate', {
      expression: `(() => {
        // Hide cookie consent
        const styleCookie = document.createElement('style');
        styleCookie.textContent = '#cookie-consent-banner, #cookie-consent-backdrop { display: none !important; }';
        document.head.appendChild(styleCookie);

        ${jsInject || ''}

        const style = document.createElement('style');
        style.id = 'test-style-${outputName}';
        style.textContent = \`${cssRules}\`;
        document.head.appendChild(style);
      })()`
    });

    await new Promise(r => setTimeout(r, 600));

    const shot = await send('Page.captureScreenshot', {
      format: 'png',
      clip: { x: 0, y: 0, width: 360, height: 740, scale: 1 }
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

async function runAll() {
  // Test A: Responsive background image with warm sacred light overlay that lets Somnath temple display clearly
  const cssA = `
    .hero-split-section {
      background-image: url('images/temples/somnath.jpg') !important;
      background-position: center 20% !important;
      background-size: cover !important;
      background-repeat: no-repeat !important;
      padding: 1.8rem 0 2rem !important;
    }
    .hero-bg-overlay {
      background: linear-gradient(180deg, 
        rgba(255, 255, 255, 0.82) 0%, 
        rgba(255, 253, 249, 0.65) 30%, 
        rgba(255, 253, 249, 0.88) 75%, 
        #FFFDF9 100%) !important;
    }
    .hero-banner-title {
      font-size: 2rem !important;
      line-height: 1.2 !important;
    }
    .hero-split-subtext {
      font-size: 0.85rem !important;
      line-height: 1.5 !important;
    }
  `;
  await testMobileHero('A', cssA, '', 'variant_a_bg');

  // Test B: Distinct temple landing visual card in the hero (e.g. above or below title)
  const jsB = `
    const leftContent = document.querySelector('.hero-left-content');
    const title = document.querySelector('.hero-banner-title');
    const existing = document.getElementById('mobile-hero-landing-img');
    if (!existing && title) {
      const card = document.createElement('div');
      card.id = 'mobile-hero-landing-img';
      card.className = 'mobile-landing-image-showcase';
      card.innerHTML = \`
        <div class="mobile-landing-img-wrap">
          <img src="images/temples/somnath.jpg" alt="Shri Somnath Temple - Prarthana by Shiplystic" class="mobile-landing-img">
          <div class="mobile-landing-badge">
            <span>🛕</span> 100+ Revered Temples Connected
          </div>
          <div class="mobile-landing-caption">Shri Somnath Jyotirlinga Temple</div>
        </div>
      \`;
      title.parentNode.insertBefore(card, title.nextSibling);
    }
  `;
  const cssB = `
    .mobile-landing-image-showcase {
      margin: 0.85rem 0 1.1rem;
      border-radius: 14px;
      overflow: hidden;
      box-shadow: 0 8px 24px rgba(0,0,0,0.12);
      border: 2px solid #FFFFFF;
      position: relative;
    }
    .mobile-landing-img-wrap {
      position: relative;
      height: 170px;
      overflow: hidden;
    }
    .mobile-landing-img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      display: block;
    }
    .mobile-landing-badge {
      position: absolute;
      top: 10px;
      left: 10px;
      background: rgba(15, 23, 42, 0.85);
      color: #FFF;
      font-size: 0.72rem;
      font-weight: 700;
      padding: 0.25rem 0.65rem;
      border-radius: 50px;
      backdrop-filter: blur(6px);
      border: 1px solid rgba(255,255,255,0.2);
    }
    .mobile-landing-caption {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      background: linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.75) 100%);
      color: #FFF;
      padding: 1rem 0.8rem 0.5rem;
      font-size: 0.82rem;
      font-weight: 700;
      text-align: left;
    }
  `;
  await testMobileHero('B', cssB, jsB, 'variant_b_card');
}

runAll();
