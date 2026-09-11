const { execFile } = require('child_process');

async function run() {
  const p = execFile('C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe', [
    '--headless',
    '--remote-debugging-port=9244',
    '--user-data-dir=C:\\Users\\Dell\\.gemini\\antigravity-ide\\brain\\d074ccbf-9e6b-467f-a1e2-d50eeb235f43\\scratch\\edge_prof3',
    '--disable-gpu',
    'http://127.0.0.1:5500/temples/vaishno-devi.html'
  ]);
  await new Promise(r => setTimeout(r, 2200));
  const res = await fetch('http://127.0.0.1:9244/json/list');
  const tabs = await res.json();
  const tab = tabs.find(t => t.url.includes('vaishno-devi'));
  const ws = new WebSocket(tab.webSocketDebuggerUrl);
  await new Promise(r => ws.onopen = r);
  let id = 1;
  const send = (m, params={}) => new Promise(resolve => {
    const cur = id++;
    const handler = (evt) => {
      const d = JSON.parse(evt.data);
      if (d.id === cur) { ws.removeEventListener('message', handler); resolve(d); }
    };
    ws.addEventListener('message', handler);
    ws.send(JSON.stringify({ id: cur, method: m, params }));
  });
  await send('Page.enable');
  await send('Runtime.enable');
  const eval1 = await send('Runtime.evaluate', { expression: 'typeof showComingSoon' });
  console.log('typeof showComingSoon:', JSON.stringify(eval1));
  const eval2 = await send('Runtime.evaluate', { expression: 'showComingSoon()' });
  console.log('call showComingSoon():', JSON.stringify(eval2));
  const eval3 = await send('Runtime.evaluate', { expression: 'document.getElementById("comingSoonModal").outerHTML.substring(0, 200)' });
  console.log('modal element:', JSON.stringify(eval3));
  ws.close();
  p.kill();
}
run();
