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
// forms.js
document.addEventListener('DOMContentLoaded', () => {
    console.log('Forms page scripts loaded');
    // Filter for overdue obligations
    $('#overdue-btn').on('click', function() {
        const today = new Date();
        
        $('.obligation-row').each(function() {
            const dueDate = new Date($(this).data('duedate'));
            
            if (dueDate <= today)
                $(this).show();
                // Show overdue obligations
            else
                $(this).hide();
            // Hide obligations that are not overdue
        });
    });

    // Filter for 14-day look ahead
    $('#14-day-lookahead-btn').on('click', function() {
        const today = new Date();
        const fourteenDaysAhead = new Date(today);
        fourteenDaysAhead.setDate(today.getDate() + 14);
        
        $('.obligation-row').each(function() {
            const dueDate = new Date($(this).data('duedate'));
            
            if (dueDate >= today && dueDate <= fourteenDaysAhead)
                $(this).show();
                // Show obligations within 14 days
            else
                $(this).hide();
            // Hide obligations outside of 14-day look ahead
        });
    });

    // Reset filters
    $('#reset-filter-btn').on('click', function() {
        $('.obligation-row').show(); // Show all obligations
    });

    // Function to get the checked obligation IDs
    function getSelectedObligations() {
        const selected = [];
        
        $('input[name="obligationsToDelete"]:checked').each(function() {
            selected.push($(this).val());
        });
        return selected;
    }

    // Handle update action
    $('#update-selected').on('click', function(e) {
        e.preventDefault();
        const selectedObligations = getSelectedObligations();
        
        if (selectedObligations.length === 1)
            // Redirect to the update form for the selected obligation
            window.location.href = `/updateform/${selectedObligations[0]}`;
        else
            alert('Please select exactly one obligation to update.');
    });

    // Handle delete action
    $('#delete-selected').on('click', function(e) {
        e.preventDefault();
        const selectedObligations = getSelectedObligations();
        
        if (!selectedObligations.length) {
            alert('Please select at least one obligation to delete.');
            return;
        }
        
        if (confirm('Are you sure you want to delete the selected obligations?'))
            $.ajax({
                url: '/deleteform',
                method: 'POST',
                data: {
                    obligationIds: selectedObligations,
                },
                success: function() {
                    // Refresh the page or handle success
                    alert('Obligations deleted successfully');
                    location.reload(); // Reload the page to see updated list
                },
                error: function() {
                    alert('Error deleting obligations');
                },
            });
    });
});
