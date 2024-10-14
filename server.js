// Copyright (C) 2024 Enveng Group
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as
// published by the Free Software Foundation, either version 3 of the
// License, or (at your option) any later version.
//
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU Affero General Public License for more details.
//
// You should have received a copy of the GNU Affero General Public License
// along with this program.  If not, see <https://www.gnu.org/licenses/>.

import http from 'http';
import fs from 'fs';
import path from 'path';
import url from 'url';
import { getUsers } from './controllers/userController.js';
import dotenv from 'dotenv';

dotenv.config();

const port = process.env.PORT || 3000;

const mimeTypes = {
  '.html': 'text/html',
  '.js': 'application/javascript',
  '.css': 'text/css',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.json': 'application/json',
  '.wasm': 'application/wasm',
};

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url);
  let pathname = `.${parsedUrl.pathname}`;

  if (pathname === './') {
    pathname = './public/index.html';
  }

  const ext = path.parse(pathname).ext;

  if (pathname.startsWith('./api')) {
    handleApiRequest(req, res, pathname);
  } else {
    fs.exists(pathname, (exist) => {
      if (!exist) {
        res.statusCode = 404;
        res.end(`File ${pathname} not found!`);
        return;
      }

      if (fs.statSync(pathname).isDirectory()) {
        pathname += '/index.html';
      }

      fs.readFile(pathname, (err, data) => {
        if (err) {
          res.statusCode = 500;
          res.end(`Error getting the file: ${err}.`);
        } else {
          res.setHeader('Content-type', mimeTypes[ext] || 'text/plain');
          res.end(data);
        }
      });
    });
  }
});

const handleApiRequest = (req, res, pathname) => {
  if (pathname === './api/users' && req.method === 'GET') {
    const users = getUsers();
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(users));
  } else {
    res.statusCode = 404;
    res.end('API endpoint not found');
  }
};

server.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
