const dropdownButton = document.getElementById("dropdownButton");
const dropdownMenu = document.getElementById("dropdownMenu");

dropdownButton.addEventListener("click", () => {
    dropdownMenu.classList.toggle("hidden");
});

//   newform.html js code

// home.html js code
const loadButtons = async () => {
    try {
        const response = await fetch("/api/env_asp"); // Fetching data from your backend
        const data = await response.json();

        // Log the response to check the structure

        // Check if data and plans exist
        if (!data || !data.options) {
            throw new Error("Plans data not found");
        }

        const buttonContainer = document.getElementById("buttonContainer");
        buttonContainer.innerHTML = "";

        data.options.forEach((plan) => {
            const button = document.createElement("button");
            button.className = "bg-[#a2b18b] text-black py-2 px-4 rounded text-left";
            button.textContent = plan.Environmental_Aspect; // Set button text to the plan name
            buttonContainer.appendChild(button); // Append button to the container
        });
    } catch (error) {
        console.error("Error loading plans:", error);
    }
};

window.onload = loadButtons;
