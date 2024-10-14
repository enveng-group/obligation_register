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

// public/assets/js/pages/obligations.js
import { initDatabase } from '../db.js';

document.addEventListener('DOMContentLoaded', () => {
  fetchObligations();
});

async function fetchObligations() {
  const db = await initDatabase();
  const result = db.exec('SELECT * FROM choices');
  renderObligations(result[0].values);
}

function renderObligations(obligations) {
  const container = document.querySelector('.obligations-container');
  container.innerHTML = ''; // Clear existing content

  obligations.forEach(obligation => {
    const obligationElement = document.createElement('div');
    obligationElement.className = 'obligation';
    obligationElement.innerHTML = `
      <div class="obligation-info">
        <span>${obligation[1]}</span>
        <span>${obligation[2]}</span>
        <span>${obligation[3]}</span>
        <span>${obligation[4]}</span>
        <span>${obligation[5]}</span>
        <button onclick="editObligation(${obligation[0]})">Edit</button>
        <button onclick="deleteObligation(${obligation[0]})">Delete</button>
      </div>
    `;
    container.appendChild(obligationElement);
  });
}

async function addObligation(obligation) {
  const db = await initDatabase();
  db.run(`
    INSERT INTO choices (
      Project_Name, Primary_Environmental_Mechanism, Procedure, Environmental_Aspect, Obligation_Number, Obligation, Accountability, Responsibility, ProjectPhase, Action_DueDate, Close_Out_Date, Status, Supporting_Information, General_Comments, Compliance_Comments, NonConformance_Comments, Evidence, PersonEmail, Recurring_Obligation, Recurring_Frequency, Recurring_Status, Recurring_Forcasted_Date, Inspection, Inspection_Frequency, Site_or_Desktop, New_Control_action_required, Obligation_type
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `, [
    obligation.Project_Name, obligation.Primary_Environmental_Mechanism, obligation.Procedure, obligation.Environmental_Aspect, obligation.Obligation_Number, obligation.Obligation, obligation.Accountability, obligation.Responsibility, obligation.ProjectPhase, obligation.Action_DueDate, obligation.Close_Out_Date, obligation.Status, obligation.Supporting_Information, obligation.General_Comments, obligation.Compliance_Comments, obligation.NonConformance_Comments, obligation.Evidence, obligation.PersonEmail, obligation.Recurring_Obligation, obligation.Recurring_Frequency, obligation.Recurring_Status, obligation.Recurring_Forcasted_Date, obligation.Inspection, obligation.Inspection_Frequency, obligation.Site_or_Desktop, obligation.New_Control_action_required, obligation.Obligation_type
  ]);
  fetchObligations();
}

async function editObligation() {
  // Fetch obligation data and populate the form for editing
}

async function updateObligation(obligation) {
  const db = await initDatabase();
  db.run(`
    UPDATE choices
    SET Project_Name = ?, Primary_Environmental_Mechanism = ?, Procedure = ?, Environmental_Aspect = ?, Obligation_Number = ?, Obligation = ?, Accountability = ?, Responsibility = ?, ProjectPhase = ?, Action_DueDate = ?, Close_Out_Date = ?, Status = ?, Supporting_Information = ?, General_Comments = ?, Compliance_Comments = ?, NonConformance_Comments = ?, Evidence = ?, PersonEmail = ?, Recurring_Obligation = ?, Recurring_Frequency = ?, Recurring_Status = ?, Recurring_Forcasted_Date = ?, Inspection = ?, Inspection_Frequency = ?, Site_or_Desktop = ?, New_Control_action_required = ?, Obligation_type = ?
    WHERE id = ?
  `, [
    obligation.Project_Name, obligation.Primary_Environmental_Mechanism, obligation.Procedure, obligation.Environmental_Aspect, obligation.Obligation_Number, obligation.Obligation, obligation.Accountability, obligation.Responsibility, obligation.ProjectPhase, obligation.Action_DueDate, obligation.Close_Out_Date, obligation.Status, obligation.Supporting_Information, obligation.General_Comments, obligation.Compliance_Comments, obligation.NonConformance_Comments, obligation.Evidence, obligation.PersonEmail, obligation.Recurring_Obligation, obligation.Recurring_Frequency, obligation.Recurring_Status, obligation.Recurring_Forcasted_Date, obligation.Inspection, obligation.Inspection_Frequency, obligation.Site_or_Desktop, obligation.New_Control_action_required, obligation.Obligation_type, obligation.id
  ]);
  fetchObligations();
}

async function deleteObligation(id) {
  const db = await initDatabase();
  db.run('DELETE FROM choices WHERE id = ?', [id]);
  fetchObligations();
}

window.addObligation = addObligation;
window.editObligation = editObligation;
window.updateObligation = updateObligation;
window.deleteObligation = deleteObligation;
