import path, {dirname} from 'node:path';
import fs from 'node:fs';
import {fileURLToPath} from 'node:url';
import logger from '../utils/logger.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const uploadFile = (req, res) => {
    const tempFilePath = path.join(__dirname, '../tmp', req.file.filename);
    
    fs.writeFile(tempFilePath, req.file.buffer, (err) => {
        if (err) {
            logger.error('Error writing file to tmp directory: %s', err.message);
            return res
                .status(500)
                .send('Internal Server Error');
        }
        
        logger.info('File written to tmp directory: %s', tempFilePath);
        res.send('File uploaded successfully');
    });
};
