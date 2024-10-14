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

import './assets/js/criticalScripts.js';
import './assets/js/common.js';
import './assets/js/header.js';
import './assets/js/footer.js';
import './assets/js/head.js';
import './assets/js/users.js';
import './assets/js/updateForm.js';
import './assets/js/singleObligation.js';
import './assets/js/signup.js';
import './assets/js/responsible.js';
import './assets/js/renderUsers.js';
import './assets/js/newForm.js';
import './assets/js/login.js';
import './assets/js/index.js';
import './assets/js/home.js';
import './assets/js/forms.js';
import './assets/js/detailedDash.js';
import './assets/js/loadHeader.js';
import './assets/js/services.js';
import './assets/js/helper.js';
import loadWasm from './wasmLoader.js';

loadWasm().then(wasm => {
  const data = new Uint8Array([1, 2, 3, 4, 5]);
  const key = 42;
  wasm._xor_encrypt(data, key, data.length);
  console.log('Encrypted data:', data);
});
