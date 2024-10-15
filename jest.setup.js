// Copyright (C) 2024 Enveng Group
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the gnu affero general public license as
// published by the free software foundation, either version 3 of the
// license, or (at your option) any later version.
//
// this program is distributed in the hope that it will be useful,
// but without any warranty;Copyright2024EnvengGroupThisprogramisfreesoftware without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU Affero General Public License for more details.
//
// You should have received a copy of the GNU Affero General Public License
// along with this program.  If not, see <https://www.gnu.org/licenses/>.
// additional setup can be added here
// for example, you can mock global objects or set up other testing utilities
// ; Example: Mocking a global object
global.fetch = jest.fn(() => Promise.resolve({
    json: () => Promise.resolve({}),
}));
