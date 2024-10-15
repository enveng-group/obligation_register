// Copyright (C) 2024 Enveng Group - Adrian Gallo, Rohan Lonkar and Rhett Bachoup
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
// services/cacheService.js
import fs from 'node:fs';
import path from 'node:path';
import logger from '../utils/logger.js';

const cacheDir = new URL('../cache', import.meta.url).pathname;

export const cacheData = (key, data) => {
    const cacheFilePath = path.join(cacheDir, `${key}.json`);
    
    fs.writeFile(cacheFilePath, JSON.stringify(data), (err) => {
        if (err)
            logger.error('Error writing data to cache directory: %s', err.message);
        else
            logger.info('Data cached successfully: %s', cacheFilePath);
    });
};

export const getCachedData = (key) => {
    const cacheFilePath = path.join(cacheDir, `${key}.json`);
    
    if (fs.existsSync(cacheFilePath)) {
        const data = fs.readFileSync(cacheFilePath, 'utf-8');
        logger.info('Data retrieved from cache: %s', cacheFilePath);
        return JSON.parse(data);
    }
    
    logger.info('No cache found for key: %s', key);
    return null;
};
