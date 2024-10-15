// Copyright (C) 2024 Enveng Group
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the gnu affero general public license as
// published by the free software foundation, either version 3 of the
// license, or (at your option) any later version.
//
// this program is distributed in the hope that it will be useful,
// but without any warranty; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU Affero General Public License for more details.
//
// You should have received a copy of the GNU Affero General Public License
// along with this program.  If not, see <https://www.gnu.org/licenses/>.

import http from 'node:http';
import path from 'node:path';
import process from 'node:process';
import express from 'express';
import fs from 'node:fs';
import { getUsers } from './controllers/userController.js';
import logger from './utils/logger.js';
import userRoutes from './routes/userRoutes.js';
import dotenv from 'dotenv';

// Use import instead of require for dotenv
dotenv.config({ path: '.env.vault' });

const app = express();
const PORT = process.env.PORT || 8080;

const directories = [
    'tmp',
    'cache',
];

for (const dir of directories) {
    const dirPath = path.join(process.cwd(), dir);

    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath);
        logger.info(`Directory created: ${dirPath}`);
    }
}

app.use(express.json());

app.use((req, res, next) => {
    logger.info(`${req.method} ${req.url}`);
    next();
});

app.use('/api/users', userRoutes);

app.use((err, req, res) => {
    logger.error(err.stack);
    res.status(500).send('Something broke!');
});

// Comment out or remove this block
/*
app.listen(PORT, () => {
    logger.info(`Server is running on port ${PORT}`);
});
*/

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
    '.wasm': 'application/wasm'
};

const server = http.createServer(async (req, res) => {
    const { URL } = await import('node:url');
    const parsedUrl = new URL(req.url, `http://${req.headers.host}`);
    let pathname = `.${parsedUrl.pathname}`;

    if (pathname === './')
        pathname = './public/index.html';

    const { ext } = path.parse(pathname);

    if (pathname.startsWith('./api'))
        handleApiRequest(req, res, pathname);
    else
        fs.stat(pathname, (err, stats) => {
            if (err) {
                res.statusCode = 404;
                res.end(`File ${pathname} not found!`);
                return;
            }

            if (stats.isDirectory())
                pathname += '/index.html';

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

server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
