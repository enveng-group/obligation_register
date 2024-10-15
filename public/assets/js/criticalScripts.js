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
// Import critical functions from services.js and helper.js
import {fetchData} from './services.js';
import {formatDate, capitalize} from './helper.js';

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
