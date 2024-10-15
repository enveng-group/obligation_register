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
import {initDatabase} from '../db.js';

document.addEventListener('DOMContentLoaded', async () => {
    console.log('Detailed Dashboard scripts loaded');
    
    const db = await initDatabase();
    
    // Import data from PPM.CSV
    await importCSVData('path/to/PPM.CSV');
    // Fetch data from the database and display it
    const result = db.exec('SELECT * FROM choices');
    const table = document.createElement('table');
    const headerRow = document.createElement('tr');
    
    const headers = [
        'Project_Name',
        'Primary_Environmental_Mechanism',
        'Procedure',
        'Environmental_Aspect',
        'Obligation_Number',
        'Obligation',
        'Accountability',
        'Responsibility',
        'ProjectPhase',
        'Action_DueDate',
        'Close_Out_Date',
        'Status',
        'Supporting_Information',
        'General_Comments',
        'Compliance_Comments',
        'NonConformance_Comments',
        'Evidence',
        'PersonEmail',
        'Recurring_Obligation',
        'Recurring_Frequency',
        'Recurring_Status',
        'Recurring_Forcasted_Date',
        'Inspection',
        'Inspection_Frequency',
        'Site_or_Desktop',
        'New_Control_action_required',
        'Obligation_type',
    ];
    
    for (const header of headers) {
        const th = document.createElement('th');
        
        th.textContent = header;
        headerRow.appendChild(th);
    }
    
    table.appendChild(headerRow);
    
    for (const row of result[0].values) {
        const tr = document.createElement('tr');
        
        for (const cell of row) {
            const td = document.createElement('td');
            
            td.textContent = cell;
            tr.appendChild(td);
        }
        
        table.appendChild(tr);
    }
    
    document
        .querySelector('.diagrams')
        .appendChild(table);
});

// Function to import CSV data
async function importCSVData(csvFilePath) {
    const response = await fetch(csvFilePath);
    const csvText = await response.text();
    const rows = csvText
        .split('\n')
        .slice(1);
    
    // Skip header row
    for (const row of rows) {
        const columns = row.split(',');
        
        db.run(`
      INSERT INTO choices (
        Project_Name, Primary_Environmental_Mechanism, Procedure, Environmental_Aspect, Obligation_Number, Obligation, Accountability, Responsibility, ProjectPhase, Action_DueDate, Close_Out_Date, Status, Supporting_Information, General_Comments, Compliance_Comments, NonConformance_Comments, Evidence, PersonEmail, Recurring_Obligation, Recurring_Frequency, Recurring_Status, Recurring_Forcasted_Date, Inspection, Inspection_Frequency, Site_or_Desktop, New_Control_action_required, Obligation_type
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, columns);
    }
}
