const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;
const DIST_DIR = path.join(__dirname, 'dist');

const mimeTypes = {
  '.html': 'text/html',
  '.js': 'application/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.txt': 'text/plain'
};

const server = http.createServer((req, res) => {
  console.log(`Request: ${req.url}`);
  
  let filePath = path.join(DIST_DIR, req.url === '/' ? 'index.html' : req.url);
  
  // 检查文件是否存在
  let exists = false;
  try {
    exists = fs.existsSync(filePath);
  } catch (e) {
    exists = false;
  }
  
  // 处理 SPA 路由 - 如果文件不存在或是目录，返回 index.html
  if (!exists || (exists && fs.statSync(filePath).isDirectory())) {
    filePath = path.join(DIST_DIR, 'index.html');
  }
  
  const ext = path.extname(filePath).toLowerCase();
  const contentType = mimeTypes[ext] || 'application/octet-stream';
  
  fs.readFile(filePath, (err, content) => {
    if (err) {
      console.error(`Error reading file: ${err.message}`);
      res.writeHead(500);
      res.end('Server Error');
    } else {
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content);
    }
  });
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Serving files from: ${DIST_DIR}`);
});
