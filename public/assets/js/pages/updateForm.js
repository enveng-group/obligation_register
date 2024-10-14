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

$(document).ready(function () {
    const urlParams = new URLSearchParams(window.location.search);
    const obligationId = urlParams.get('id'); // Adjust according to your URL structure

    // Fetch obligation details based on ID
    $.ajax({
        url: `/obligation/${obligationId}`, // Endpoint to fetch obligation details
        method: 'GET',
        success: function (data) {
            // Populate form fields with fetched data
            $("input[name='id']").val(data.id);
            $("input[name='obligation_number']").val(data.obligation_number);
            $("input[name='date_granted']").val(data.date_granted);
            $("#environmental_aspect").val(data.environmental_aspect);
            $("#project_phase").val(data.project_phase);
            $("#responsibility").val(data.responsibility);
            $("#primary_environmental_mechanism").val(data.primary_environmental_mechanism);
            $("#accountability").val(data.accountability);
            $("input[name='obligation']").val(data.obligation);
            $("#obligation_type").val(data.obligation_type);
            $("input[name='recurring_obligation'][value='" + data.recurring_obligation + "']").prop('checked', true);
            $("#recurring_frequency").val(data.recurring_frequency);
            $("#recurring_status").val(data.recurring_status);
            $("input[name='compliance_comments']").val(data.compliance_comments);
            $("input[name='noncompliance_comments']").val(data.noncompliance_comments);
            $("#audit").val(data.audit);
            $("input[name='due_date']").val(data.due_date);
            $("input[name='completion_date']").val(data.completion_date);
            $("#status").val(data.status);
            $("input[name='supporting_information']").val(data.supporting_information);
            $("input[name='evidence']").val(data.evidence);
            $("input[name='inspections'][value='" + data.inspections + "']").prop('checked', true);
            $("#inspection_frequency").val(data.inspection_frequency);
        },
        error: function (err) {
            console.error("Error fetching obligation details:", err);
        }
    });

    // Fetch choices from the server
    $.ajax({
        url: "/choices",
        method: "GET",
        success: function (data) {
            // Clear existing options in the dropdowns
            $("#environmental_aspect").append('<option value="">Select an Aspect</option>');
            $("#project_phase").append('<option value="">Select a Phase</option>');
            $("#primary_environmental_mechanism").append('<option value="">Select a Mechanism</option>');
            $("#accountability").append('<option value="">Select Accountability</option>');
            $("#obligation_type").append('<option value="">Select Type</option>');
            $("#recurring_frequency").append('<option value="">Select a Frequency</option>');
            $("#recurring_status").append('<option value="">Select a Status</option>');
            $("#audit").empty().append('<option value="">Select a Type</option>');
            $("#status").empty().append('<option value="">Select a status</option>');
            $("#inspection_frequency").append('<option value="">Select a Frequency</option>');

            // Map through the response and populate the dropdowns
            data.forEach(function (choice) {
                if (choice.field === "ENVIRONMENTAL_ASPECT_CHOICES") {
                    $("#environmental_aspect").append($("<option></option>").attr("value", choice.value).text(choice.label));
                }
                if (choice.field === "PROJECT_PHASE_CHOICES") {
                    $("#project_phase").append(`<option value="${choice.value}">${choice.label}</option>`);
                }
                if (choice.field === "RESPONSIBILITY_CHOICES") {
                    $("#responsibility").append(`<option value="${choice.value}">${choice.label}</option>`);
                }
                if (choice.field === "PRIMARY_ENVIRONMENTAL_MECHANISM_CHOICES") {
                    $("#primary_environmental_mechanism").append(`<option value="${choice.value}">${choice.label}</option>`);
                }
                if (choice.field === "ACCOUNTABILITY_CHOICES") {
                    $("#accountability").append(`<option value="${choice.value}">${choice.label}</option>`);
                }
                if (choice.field === "OBLIGATION_TYPE_CHOICES") {
                    $("#obligation_type").append(`<option value="${choice.value}">${choice.label}</option>`);
                }
                if (choice.field === "RECURRING_FREQUENCY_CHOICES") {
                    $("#recurring_frequency").append(`<option value="${choice.value}">${choice.label}</option>`);
                }
                if (choice.field === "RECURRING_STATUS_CHOICES") {
                    $("#recurring_status").append(`<option value="${choice.value}">${choice.label}</option>`);
                }
                if (choice.field === "AUDIT_CHOICES") {
                    $("#audit").append(`<option value="${choice.value}">${choice.label}</option>`);
                }
                if (choice.field === "STATUS_CHOICES") {
                    $("#status").append(`<option value="${choice.value}">${choice.label}</option>`);
                }
                if (choice.field === "INSPECTION_FREQUENCY_CHOICES") {
                    $("#inspection_frequency").append(`<option value="${choice.value}">${choice.label}</option>`);
                }
            });
        },
        error: function (err) {
            console.error("Error fetching choices:", err);
        }
    });

    // Handle form submission
    $("#updateForm").on("submit", function (event) {
        event.preventDefault(); // Prevent default form submission

        // Prepare the data
        const formData = {
            id: $("input[name='id']").val(),
            obligation_number: $("input[name='obligation_number']").val(),
            date_granted: $("input[name='date_granted']").val(),
            environmental_aspect: $("#environmental_aspect").val(),
            project_phase: $("#project_phase").val(),
            responsibility: $("#responsibility").val(),
            primary_environmental_mechanism: $("#primary_environmental_mechanism").val(),
            accountability: $("#accountability").val(),
            obligation: $("input[name='obligation']").val(),
            obligation_type: $("#obligation_type").val(),
            recurring_obligation: $("input[name='recurring_obligation']:checked").val(),
            recurring_frequency: $("#recurring_frequency").val(),
            recurring_status: $("#recurring_status").val(),
            compliance_comments: $("input[name='compliance_comments']").val(),
            noncompliance_comments: $("input[name='noncompliance_comments']").val(),
            audit: $("#audit").val(),
            due_date: $("input[name='due_date']").val(),
            completion_date: $("input[name='completion_date']").val(),
            status: $("#status").val(),
            supporting_information: $("input[name='supporting_information']").val(),
            evidence: $("input[name='evidence']").val(),
            inspections: $("input[name='inspections']:checked").val(),
            inspection_frequency: $("#inspection_frequency").val(),
        };

        // Send the data to the server
        $.ajax({
            url: "/updateformsubmit", // Change this URL to your update endpoint
            method: "POST",
            contentType: "application/json",
            data: JSON.stringify(formData),
            success: function () {
                alert("Update successful!"); // Handle success response
                // Optionally redirect or refresh the page
                window.location.href = '/form';
            },
            error: function (error) {
                console.error("Error updating data:", error);
                alert("Failed to update data.");
            },
        });
    });
});
