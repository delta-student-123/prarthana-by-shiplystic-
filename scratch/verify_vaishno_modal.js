const fs = require('fs');

const files = [
  'temples/vaishno-devi.html',
  'temples/vaishno-devi/index.html',
  'temples.html',
  'temples/index.html'
];

files.forEach(f => {
  const content = fs.readFileSync(f, 'utf8');
  console.log('=== ' + f + ' ===');
  console.log('Has comingSoonModal:', content.includes('id="comingSoonModal"'));
  console.log('Has showComingSoon function:', content.includes('function showComingSoon'));
  console.log('Calls to showComingSoon():', (content.match(/showComingSoon\(\)/g) || []).length);
  const remainingLinks = content.match(/href="[^"]*book-prarthana\?temple=vaishno-devi[^"]*"/g);
  console.log('Remaining vaishno-devi booking links:', remainingLinks ? remainingLinks : 'None (0)');
});
