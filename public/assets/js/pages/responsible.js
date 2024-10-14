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

// public/js/pages/responsible.js
document.addEventListener('DOMContentLoaded', async () => {
  console.log('Responsible page scripts loaded');

  // Initialize sql.js
  const SQL = await initSqlJs({
    locateFile: file => `https://cdn.jsdelivr.net/npm/sql.js@1.6.1/dist/${file}`
  });

  // Create a new database
  const db = new SQL.Database();

  // Create the choices table
  db.run(`
    CREATE TABLE choices (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      Project_Name TEXT NOT NULL,
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

  // Function to import CSV data
  async function importCSVData(csvFilePath) {
    const response = await fetch(csvFilePath);
    const csvText = await response.text();
    const rows = csvText.split('\n').slice(1); // Skip header row

    rows.forEach(row => {
      const columns = row.split(',');
      db.run(`
        INSERT INTO choices (
          Project_Name, Primary_Environmental_Mechanism, Procedure, Environmental_Aspect, Obligation_Number, Obligation, Accountability, Responsibility, ProjectPhase, Action_DueDate, Close_Out_Date, Status, Supporting_Information, General_Comments, Compliance_Comments, NonConformance_Comments, Evidence, PersonEmail, Recurring_Obligation, Recurring_Frequency, Recurring_Status, Recurring_Forcasted_Date, Inspection, Inspection_Frequency, Site_or_Desktop, New_Control_action_required, Obligation_type
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, columns);
    });
  }

  // Import data from PPM.CSV
  await importCSVData('path/to/PPM.CSV');

  // Query the database and display the data
  const result = db.exec('SELECT Responsibility, PersonEmail, Accountability FROM choices');
  const tableBody = document.getElementById('responsible-table-body');

  result[0].values.forEach(row => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td><input type="checkbox" class="form-check-input"></td>
      <td>${row[0]}</td>
      <td>${row[1]}</td>
      <td>${row[2]}</td>
    `;
    tableBody.appendChild(tr);
  });
});
