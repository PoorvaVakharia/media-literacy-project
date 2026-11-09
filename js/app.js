// Select the elements from the HTML page
const signInButton = document.getElementById('sign-in-btn');
const signUpButton = document.getElementById('sign-up-btn');
const loginForm = document.getElementById('loginForm');


loginForm.addEventListener('submit', function(event) {
    event.preventDefault();

    const emailInput = document.getElementById('si_email');
    const passwordValue = document.getElementById('si_pwd').value;

    if (emailInput.checkValidity() && passwordValue === "check") {
        alert("Sign in successful!");
        window.location.replace("pages/authentication.html");
    } else {
        alert("Invalid email or password.");
    }
});


signUpButton.addEventListener('click', () => {
    window.location.replace("pages/signUp.html");
});
