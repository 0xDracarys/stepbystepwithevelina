const fs = require('fs');
const path = require('path');

function getFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  files.forEach(file => {
    const name = path.join(dir, file);
    if (fs.statSync(name).isDirectory()) {
      getFiles(name, fileList);
    } else if (file === 'page.tsx' || file === 'page.js') {
      fileList.push(name);
    }
  });
  return fileList;
}

const pages = getFiles(path.join(process.cwd(), 'app'));

const dynamicLine = "export const dynamic = 'force-dynamic';";

for (const full of pages) {
  let content = fs.readFileSync(full, 'utf8');
  
  // Remove any BOM
  if (content.charCodeAt(0) === 0xFEFF) {
    content = content.slice(1);
  }
  
  // Remove existing dynamic exports
  content = content.replace(/export const dynamic = ['"]force-dynamic['"];?\s*/g, '');
  
  content = content.trimStart();
  
  if (content.startsWith('"use client"') || content.startsWith("'use client'")) {
    const lines = content.split('\n');
    const firstLine = lines[0];
    const rest = lines.slice(1).join('\n').trimStart();
    content = firstLine + '\n\n' + dynamicLine + '\n\n' + rest;
  } else {
    content = dynamicLine + '\n\n' + content;
  }
  
  fs.writeFileSync(full, content, 'utf8');
  console.log('CLEAN-PATCHED:', path.relative(process.cwd(), full));
}
