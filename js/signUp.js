const signUpForm = document.getElementById('signUpForm');

signUpForm.addEventListener('submit', function(event) {
    event.preventDefault();

    const nameInput = document.getElementById('su_name');
    const emailInput = document.getElementById('su_email');
    const passwordInput = document.getElementById('su_pwd');
    const passwordCheckInput = document.getElementById('su_pwd_check');

    const username = nameInput.value.trim();
    const passwordValue = passwordInput.value;
    const passwordCheckValue = passwordCheckInput.value;

    if (!username) {
        alert("Please enter your name!");
        return;
    }

    if (!emailInput.checkValidity()) {
        alert("Please enter a valid email!");
        return;
    }

    if (passwordValue !== passwordCheckValue) {
        alert("Your passwords don't match!");
        return;
    }

    // Store only the name for prototype personalization.
    // Never store passwords in localStorage.
    localStorage.setItem('knovels_username', username);

    alert("Sign up successful!");
    window.location.replace("authentication.html");
});
