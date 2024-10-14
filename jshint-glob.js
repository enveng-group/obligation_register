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

const glob = require("glob");
const { exec } = require("child_process");

const patterns = [
  "public/assets/js/**/*.js",
  "src/**/*.js",
  "controllers/**/*.js",
  "utils/**/*.js"
];

const files = patterns.flatMap(pattern => glob.sync(pattern));

if (files.length > 0) {
  exec(`jshint ${files.join(" ")}`, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error: ${stderr}`);
      process.exit(1);
    } else {
      console.log(stdout);
    }
  });
} else {
  console.log("No files found.");
}
