const { execFile } = require('child_process');

async function run() {
  const p = execFile('C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe', [
    '--headless',
    '--remote-debugging-port=9247',
    '--user-data-dir=C:\\Users\\Dell\\.gemini\\antigravity-ide\\brain\\d074ccbf-9e6b-467f-a1e2-d50eeb235f43\\scratch\\edge_prof6',
    '--disable-gpu',
    'http://127.0.0.1:5500/temples/vaishno-devi/'
  ]);
  await new Promise(r => setTimeout(r, 2200));
  const res = await fetch('http://127.0.0.1:9247/json/list');
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
  const eval1 = await send('Runtime.evaluate', {
    expression: 'Array.from(document.querySelectorAll(".nav-link")).map(a => a.textContent.trim())',
    returnByValue: true
  });
  console.log('Nav links textContent:', eval1.result.value);
  const eval2 = await send('Runtime.evaluate', {
    expression: 'Array.from(document.querySelectorAll(".nav-link")).map(a => a.innerHTML.trim())',
    returnByValue: true
  });
  console.log('Nav links innerHTML:', eval2.result.value);
  ws.close();
  p.kill();
}
run();
