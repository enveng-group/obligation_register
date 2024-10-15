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
import logger from '../utils/logger.js';

export const getUsers = (req, res) => {
    try {
        const users = [{
            username: 'jdoe',
            first_name: 'John',
            last_name: 'Doe',
            email: 'jdoe@example.com',
            accountability: 'Admin',
        }        // Add more user objects here
];
        
        logger.info('Fetched users successfully');
        res.json(users);
    } catch(error) {
        logger.error('Error fetching users: %s', error.message);
        res
            .status(500)
            .send('Internal Server Error');
    }
};
