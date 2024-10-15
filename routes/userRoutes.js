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
import express from 'express';
import tryCatch from 'try-catch';
import {getUsers} from '../controllers/userController.js';

const router = express.Router();

router.get('/', (req, res, next) => {
    const [error] = tryCatch(getUsers, req, res);
    
    if (error)
        next(error);
});

export default router;
