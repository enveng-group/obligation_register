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

// public/assets/js/pages/users.js
import { initDatabase } from '../db.js';

document.addEventListener('DOMContentLoaded', () => {
  fetchUsers();
});

async function fetchUsers() {
  const db = await initDatabase();
  const result = db.exec('SELECT * FROM users');
  renderUsers(result[0].values);
}

function renderUsers(users) {
  const container = document.querySelector('.users-container');
  container.innerHTML = ''; // Clear existing content

  users.forEach(user => {
    const userElement = document.createElement('div');
    userElement.className = 'user';
    userElement.innerHTML = `
      <div class="user-info">
        <span>${user[1]}</span>
        <span>${user[2]}</span>
        <span>${user[3]}</span>
        <span>${user[4]}</span>
        <span>${user[5]}</span>
        <button onclick="editUser(${user[0]})">Edit</button>
        <button onclick="deleteUser(${user[0]})">Delete</button>
      </div>
    `;
    container.appendChild(userElement);
  });
}

async function addUser(user) {
  const db = await initDatabase();
  db.run(`
    INSERT INTO users (username, first_name, last_name, email, accountability)
    VALUES (?, ?, ?, ?, ?)
  `, [user.username, user.first_name, user.last_name, user.email, user.accountability]);
  fetchUsers();
}

async function editUser() {
  // Fetch user data and populate the form for editing
}

async function updateUser(user) {
  const db = await initDatabase();
  db.run(`
    UPDATE users
    SET username = ?, first_name = ?, last_name = ?, email = ?, accountability = ?
    WHERE id = ?
  `, [user.username, user.first_name, user.last_name, user.email, user.accountability, user.id]);
  fetchUsers();
}

async function deleteUser(id) {
  const db = await initDatabase();
  db.run('DELETE FROM users WHERE id = ?', [id]);
  fetchUsers();
}

window.addUser = addUser;
window.editUser = editUser;
window.updateUser = updateUser;
window.deleteUser = deleteUser;
