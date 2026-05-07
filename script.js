// Mobile menu (hamburger)
const hamburger = document.querySelector(".hamburger");
const navMenu = document.querySelector(".nav-menu");

hamburger.addEventListener("click", () => {
    hamburger.classList.toggle("active");
    navMenu.classList.toggle("active");
});

// Close menu when a link is clicked
document.querySelectorAll(".nav-link").forEach(n => n.addEventListener("click", () => {
    hamburger.classList.remove("active");
    navMenu.classList.remove("active");
}));

// Contact Form Placeholder
const contactForm = document.getElementById('contact-form');
const formMessage = document.getElementById('form-message');

contactForm.addEventListener('submit', function(e) {
    // Prevent the default form submission
    e.preventDefault();

    // Show the placeholder message
    formMessage.style.display = 'block';
    formMessage.style.opacity = '1';

    // Optional: Hide the message after a few seconds
    setTimeout(() => {
        formMessage.style.opacity = '0';
        // Use another timeout to set display to none after the transition
        setTimeout(() => {
            formMessage.style.display = 'none';
        }, 500); // This should match the transition duration
    }, 4000); // Message will be visible for 4 seconds
});
