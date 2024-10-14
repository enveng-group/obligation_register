// Copyright (C) 2024 Adrian Gallo, Rohan Lonkar and Rhett Bachoup
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

document.addEventListener('DOMContentLoaded', () => {
  fetch('/api/users')
    .then((response) => response.json())
    .then((users) => {
      const usersContainer = document.querySelector('.users-container');
      users.forEach((user) => {
        const userDiv = document.createElement('div');
        userDiv.classList.add('navbar-2');
        userDiv.innerHTML = `
          <div class="checkboxes">
            <div class="state-layer">
              <input type="checkbox" class="container-2" name="" id="">
            </div>
          </div>
          <div class="text-wrapper-8">${user.username}</div>
          <div class="text-wrapper-8">${user.first_name}</div>
          <div class="text-wrapper-8">${user.last_name}</div>
          <div class="text-wrapper-8">${user.email}</div>
          <div class="text-wrapper-8">${user.accountability}</div>
        `;
        usersContainer.appendChild(userDiv);
      });
    })
    .catch((error) => console.error('Error fetching users:', error));
});
