const { execFile } = require('child_process');

async function run() {
  const p = execFile('C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe', [
    '--headless',
    '--remote-debugging-port=9246',
    '--user-data-dir=C:\\Users\\Dell\\.gemini\\antigravity-ide\\brain\\d074ccbf-9e6b-467f-a1e2-d50eeb235f43\\scratch\\edge_prof5',
    '--disable-gpu',
    'http://127.0.0.1:5500/temples/vaishno-devi.html'
  ]);
  await new Promise(r => setTimeout(r, 2200));
  const res = await fetch('http://127.0.0.1:9246/json/list');
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

  await send('Emulation.setDeviceMetricsOverride', {
    width: 375,
    height: 812,
    deviceScaleFactor: 2,
    mobile: true
  });

  const inspectRes = await send('Runtime.evaluate', {
    expression: `(() => {
      showComingSoon();
      const m = document.getElementById('comingSoonModal');
      const cs = window.getComputedStyle(m);
      const card = m.querySelector('.coming-soon-card');
      const cardCs = card ? window.getComputedStyle(card) : null;
      return JSON.stringify({
        classes: m.className,
        display: cs.display,
        position: cs.position,
        inset: [cs.top, cs.right, cs.bottom, cs.left],
        zIndex: cs.zIndex,
        opacity: cs.opacity,
        visibility: cs.visibility,
        cardDisplay: cardCs ? cardCs.display : null,
        cardOpacity: cardCs ? cardCs.opacity : null,
        cardTransform: cardCs ? cardCs.transform : null,
        cardWidth: cardCs ? cardCs.width : null,
        cardHeight: cardCs ? cardCs.height : null,
        rect: m.getBoundingClientRect(),
        cardRect: card ? card.getBoundingClientRect() : null
      });
    })()`
  });

  console.log('Inspection:', inspectRes.result.value);
  ws.close();
  p.kill();
}
run();
