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

// controllers/fileController.js
import fs from 'fs';
import path from 'path';
import logger from '../utils/logger.js';

export const uploadFile = (req, res) => {
  const tempFilePath = path.join(__dirname, '../tmp', req.file.filename);
  fs.writeFile(tempFilePath, req.file.buffer, (err) => {
    if (err) {
      logger.error('Error writing file to tmp directory: %s', err.message);
      return res.status(500).send('Internal Server Error');
    }
    logger.info('File written to tmp directory: %s', tempFilePath);
    res.send('File uploaded successfully');
  });
};
