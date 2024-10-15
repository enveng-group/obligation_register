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
// public/assets/js/pages/newform.js
import {addObligation} from './obligations.js';
import {addUser} from './users.js';

document.addEventListener('DOMContentLoaded', () => {
    console.log('New Form page scripts loaded');
    // Handle obligation form submission
    document
        .getElementById('newObligationForm')
        .addEventListener('submit', function(event) {
        event.preventDefault();
        
        const obligation = {
            Project_Name: document.getElementById('Project_Name').value,
            Primary_Environmental_Mechanism: document.getElementById('Primary_Environmental_Mechanism').value,
            Procedure: document.getElementById('Procedure').value,
            Environmental_Aspect: document.getElementById('Environmental_Aspect').value,
            Obligation_Number: document.getElementById('Obligation_Number').value,
            Obligation: document.getElementById('Obligation').value,
            Accountability: document.getElementById('Accountability').value,
            Responsibility: document.getElementById('Responsibility').value,
            ProjectPhase: document.getElementById('ProjectPhase').value,
            Action_DueDate: document.getElementById('Action_DueDate').value,
            Close_Out_Date: document.getElementById('Close_Out_Date').value,
            Status: document.getElementById('Status').value,
            Supporting_Information: document.getElementById('Supporting_Information').value,
            General_Comments: document.getElementById('General_Comments').value,
            Compliance_Comments: document.getElementById('Compliance_Comments').value,
            NonConformance_Comments: document.getElementById('NonConformance_Comments').value,
            Evidence: document.getElementById('Evidence').value,
            PersonEmail: document.getElementById('PersonEmail').value,
            Recurring_Obligation: document.getElementById('Recurring_Obligation').value,
            Recurring_Frequency: document.getElementById('Recurring_Frequency').value,
            Recurring_Status: document.getElementById('Recurring_Status').value,
            Recurring_Forcasted_Date: document.getElementById('Recurring_Forcasted_Date').value,
            Inspection: document.getElementById('Inspection').value,
            Inspection_Frequency: document.getElementById('Inspection_Frequency').value,
            Site_or_Desktop: document.getElementById('Site_or_Desktop').value,
            New_Control_action_required: document.getElementById('New_Control_action_required').value,
            Obligation_type: document.getElementById('Obligation_type').value,
        };
        
        addObligation(obligation);
        alert('Obligation added successfully!');
        window.location.href = '/obligations.html'; // Redirect to obligations page
    });

    // Handle user form submission
    document
        .getElementById('newUserForm')
        .addEventListener('submit', function(event) {
        event.preventDefault();
        
        const user = {
            username: document.getElementById('username').value,
            first_name: document.getElementById('first_name').value,
            last_name: document.getElementById('last_name').value,
            email: document.getElementById('email').value,
            accountability: document.getElementById('accountability').value,
        };
        
        addUser(user);
        alert('User added successfully!');
        window.location.href = '/users.html'; // Redirect to users page
    });
});
