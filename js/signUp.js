const signUpForm = document.getElementById('signUpForm');

signUpForm.addEventListener('submit', function(event) {
    event.preventDefault();

    const username = document.getElementById('su_name').value.trim();
    const emailInput = document.getElementById('su_email');
    const email = emailInput.value.trim().toLowerCase();
    const password = document.getElementById('su_pwd').value;
    const confirmPassword = document.getElementById('su_pwd_check').value;

    if (!username || !emailInput.checkValidity()) {
        alert("Please enter your name and a valid email.");
        return;
    }

    if (password !== confirmPassword) {
        alert("Your passwords don't match!");
        return;
    }

    // Demo profile only. Never store passwords in localStorage.
    const user = {
        name: username,
        email: email
    };

    localStorage.setItem('knovels_user', JSON.stringify(user));
    sessionStorage.setItem('knovels_logged_in', 'true');

    alert("Sign up successful!");
    window.location.replace("authentication.html");
});
