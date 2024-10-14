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

async function fetchResponsibilities() {
    try {
        const response = await fetch('/api/responsibility');
        const responsibilities = await response.json();

        // Container where the bars will be displayed
        const container = document.getElementById('responsibilityBarChartContainer');
        container.innerHTML = ''; // Clear the container before adding new bars

        responsibilities.forEach(item => {
            // Create the bar wrapper
            const barWrapper = document.createElement('div');
            barWrapper.className = 'flex items-center mb-2'; // Flex layout for bar and label

            // Create the bar element
            const bar = document.createElement('div');
            const barLength = item.count * 10; // Example: each responsibility count * 10 for width scaling
            bar.style.width = `${barLength}px`; // Set bar width based on count
            bar.style.height = '20px'; // Bar height
            bar.style.backgroundColor = '#20b2aa'; // Bar color
            bar.className = 'rounded-full mr-2'; // Add rounded corners and margin

            // Create the label element
            const label = document.createElement('span');
            label.textContent = `${item.Responsibility} (${item.count})`; // Label with responsibility and count
            label.className = 'text-white'; // Text color

            // Append bar and label to the wrapper
            barWrapper.appendChild(bar);
            barWrapper.appendChild(label);

            // Append the wrapper to the container
            container.appendChild(barWrapper);
        });

    } catch (error) {
        console.error('Error fetching responsibilities:', error);
    }
}

async function fetchChartData() {
    try {
        const response = await fetch('/api/chart-data');
        const { data } = await response.json();  // Get the data from API

        // Extract labels and counts
        const counts = data.map(item => item.count);

        // Pie Chart
        const pieCtx = document.getElementById('pieChart').getContext('2d');
        new Chart(pieCtx, {
            type: 'pie',
            data: {
                datasets: [{
                    label: 'Environmental Aspects',
                    data: counts,
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.2)',
                        'rgba(54, 162, 235, 0.2)',
                        'rgba(75, 192, 192, 0.2)',
                        'rgba(153, 102, 255, 0.2)',
                        'rgba(255, 159, 64, 0.2)'
                    ],
                    borderColor: [
                        'rgba(255, 99, 132, 1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(75, 192, 192, 1)',
                        'rgba(153, 102, 255, 1)',
                        'rgba(255, 159, 64, 1)'
                    ],
                    borderWidth: 1
                }]
            }
        });

    } catch (error) {
        console.error('Error fetching chart data:', error);
    }
}

// Fetch the data and render the charts when the page loads
window.onload = function () {
    fetchResponsibilities();
    fetchChartData();
};
