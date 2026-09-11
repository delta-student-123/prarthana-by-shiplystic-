const fs = require('fs');
const content = fs.readFileSync('temples/index.html', 'utf8');

const regex = /(?:src|href)=["']([^"']+)["']/g;
let match;
const links = [];
while ((match = regex.exec(content)) !== null) {
  links.push(match[1]);
}

console.log('Total links/resources found:', links.length);

const broken = [];
links.forEach(link => {
  if (link.startsWith('http') || link.startsWith('#') || link.startsWith('mailto') || link.startsWith('tel') || link.startsWith('javascript')) return;
  
  let filePath = link;
  if (filePath.startsWith('../')) {
    filePath = filePath.substring(3);
  } else if (filePath.startsWith('/')) {
    filePath = filePath.substring(1);
  } else {
    filePath = 'temples/' + filePath;
  }
  
  filePath = filePath.split('?')[0];
  
  if (!fs.existsSync(filePath) && !fs.existsSync(filePath + '.html') && !fs.existsSync(filePath + '/index.html')) {
    broken.push({ link, filePath });
  }
});

console.log('Broken count:', broken.length);
console.log(broken);
