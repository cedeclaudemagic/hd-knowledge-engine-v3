#!/usr/bin/env node
/**
 * Simple static file server for the Ring Composer UI
 *
 * Usage: node serve.js [port]
 * Default port: 8080
 *
 * Then open: http://localhost:8080/ring-composer-ui.html
 */

const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.argv[2] || 8080;

// MIME types
const mimeTypes = {
  '.html': 'text/html',
  '.js': 'application/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.gif': 'image/gif'
};

// Base directory (visualization folder)
const baseDir = path.join(__dirname, '..');

const server = http.createServer((req, res) => {
  // Handle root
  let filePath = req.url === '/'
    ? path.join(__dirname, 'ring-composer-ui.html')
    : path.join(baseDir, req.url);

  // Security: prevent directory traversal
  if (!filePath.startsWith(baseDir)) {
    res.writeHead(403);
    res.end('Forbidden');
    return;
  }

  const ext = path.extname(filePath).toLowerCase();
  const contentType = mimeTypes[ext] || 'application/octet-stream';

  fs.readFile(filePath, (err, content) => {
    if (err) {
      if (err.code === 'ENOENT') {
        console.log(`404: ${req.url}`);
        res.writeHead(404);
        res.end(`File not found: ${req.url}`);
      } else {
        console.error(`Error: ${err.code}`);
        res.writeHead(500);
        res.end(`Server error: ${err.code}`);
      }
    } else {
      // Add CORS headers for local development
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content);
      console.log(`200: ${req.url}`);
    }
  });
});

server.listen(PORT, () => {
  console.log(`\n🎨 Ring Composer Server`);
  console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
  console.log(`Server running at: http://localhost:${PORT}`);
  console.log(`Open: http://localhost:${PORT}/tools/ring-composer-ui.html`);
  console.log(`\nPress Ctrl+C to stop\n`);
});
