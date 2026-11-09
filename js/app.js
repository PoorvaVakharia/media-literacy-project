const signUpButton = document.getElementById('sign-up-btn');
const loginForm = document.getElementById('loginForm');

loginForm.addEventListener('submit', function(event) {
    event.preventDefault();

    const emailInput = document.getElementById('si_email');
    const email = emailInput.value.trim().toLowerCase();
    const password = document.getElementById('si_pwd').value;

    const savedUser = JSON.parse(localStorage.getItem('knovels_user') || 'null');

    if (!savedUser) {
        alert("No demo account found. Please sign up first!");
        return;
    }

    if (emailInput.checkValidity() && email === savedUser.email && password.length > 0) {
        // Demo login: password is NOT verified.
        sessionStorage.setItem('knovels_logged_in', 'true');

        alert("Demo sign in successful!");
        window.location.replace("pages/authentication.html");
    } else {
        alert("Invalid email or password.");
    }
});

signUpButton.addEventListener('click', () => {
    window.location.replace("pages/signUp.html");
});
