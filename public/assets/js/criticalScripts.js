// Copyright (C) 2024 Enveng Group - Adrian Gallo, Rohan Lonkar and Rhett Bachoup
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as
// published by the Free Software Foundation, either version 3 of the
// License, or (at your option) any later version.
//
// This program is distributed in the hope that it will be useful,
// but without any WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU Affero General Public License for more details.
//
// You should have received a copy of the GNU Affero General Public License
// along with this program.  If not, see <https://www.gnu.org/licenses/>.
// Import critical functions from services.js and helper.js

import {fetchData} from '../../../services/service.js';
import {formatDate, capitalize} from '../../../utils/helper.js';
import { initSqlJs } from 'https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.11.0/sql-wasm.js';
initSqlJs().then((SQL) => {
  const db = new SQL.Database();
  // You can now use the `db` object to interact with the database
  console.log('SQL.js initialized');
});

document.addEventListener('DOMContentLoaded', () => {
  console.log('Critical scripts loaded');
  // Add any critical JavaScript code here
});

// Example usage of critical functions
fetchData('/api/data')
  .then((data) => console.log('Fetched data:', data))
  .catch((error) => console.error('Error fetching data:', error));

console.log('Formatted date:', formatDate(new Date()));
console.log('Capitalized string:', capitalize('example'));
