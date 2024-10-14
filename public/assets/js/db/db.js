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

/// public/assets/js/db.js
async function initDatabase() {
  const SQL = await initSqlJs({
    locateFile: file => `https://cdn.jsdelivr.net/npm/sql.js@1.6.1/dist/${file}`
  });

  // Create a new database
  const db = new SQL.Database();

  // Create the choices table
  db.run(`
    CREATE TABLE IF NOT EXISTS choices (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      Project_Name TEXT,
      Primary_Environmental_Mechanism TEXT,
      Procedure TEXT,
      Environmental_Aspect TEXT,
      Obligation_Number TEXT,
      Obligation TEXT,
      Accountability TEXT,
      Responsibility TEXT,
      ProjectPhase TEXT,
      Action_DueDate DATE,
      Close_Out_Date DATE,
      Status TEXT,
      Supporting_Information TEXT,
      General_Comments TEXT,
      Compliance_Comments TEXT,
      NonConformance_Comments TEXT,
      Evidence TEXT,
      PersonEmail TEXT,
      Recurring_Obligation TEXT,
      Recurring_Frequency TEXT,
      Recurring_Status TEXT,
      Recurring_Forcasted_Date DATE,
      Inspection TEXT,
      Inspection_Frequency TEXT,
      Site_or_Desktop TEXT,
      New_Control_action_required TEXT,
      Obligation_type TEXT
    );
  `);

  // Create the users table
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT,
      first_name TEXT,
      last_name TEXT,
      email TEXT,
      accountability TEXT
    );
  `);

  return db;
}

export { initDatabase };
