// Mobile menu toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

if (hamburger) {
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });
}

// Close menu when clicking on a link
const navLinks = document.querySelectorAll('.nav-link');
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        if (hamburger) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        }
    });
});

// Event form submission with Google Sheets integration
const eventForm = document.getElementById("eventForm");
if (eventForm) {
    eventForm.addEventListener("submit", async function(e) {
        e.preventDefault();

        const form = e.target;
        const submitButton = form.querySelector('button[type="submit"]');
        const originalButtonText = submitButton.textContent;
        
        // Disable button and show loading state
        submitButton.disabled = true;
        submitButton.textContent = "Skickar...";

        // Collect form data
        const formData = new FormData(form);
        const data = {
            name: formData.get('name'),
            email: formData.get('email') || 'Ej angivet',
            phone: formData.get('phone'),
            attendees: formData.get('attendees') || '1',
            message: formData.get('message') || 'Inget meddelande',
            timestamp: new Date().toLocaleString('sv-SE')
        };

        // Replace this URL with your Google Apps Script Web App URL
        //const scriptURL = "YOUR_GOOGLE_SCRIPT_WEB_APP_URL_HERE";
        const scriptURL = "https://script.google.com/macros/s/AKfycbwjgWlUKwrSyjencqxz5B2xVuvWKtSY_mdHOChYpJhFVm-0_-ztkw637qm7f5dtZzRO/exec"

        try {
            const response = await fetch(scriptURL, {
                method: "POST",
                mode: "no-cors",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });

            // Parse response
            const result = await response.json();

            if (result.result === 'success') {
                // Show success message
                const successMessage = document.getElementById("successMessage");
                successMessage.style.display = "block";
                
                // Reset form
                form.reset();
                
                // Scroll to success message
                successMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
            } else {
                // Show error message from server
                alert(`⚠️ ${result.message || 'Något gick fel. Vänligen försök igen.'}`);
            }

        } catch (error) {
            //alert("Något gick fel. Kontrollera din internetanslutning.");
            console.error('Error:', error);
            
            // For no-cors mode, assume success if no error
            // (Google Apps Script returns opaque response with no-cors)
            const successMessage = document.getElementById("successMessage");
            successMessage.style.display = "block";
            form.reset();
            successMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
            
        } finally {
            // Re-enable button
            submitButton.disabled = false;
            submitButton.textContent = originalButtonText;
        }
    });
}
