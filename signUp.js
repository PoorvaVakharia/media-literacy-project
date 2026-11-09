const signUpButton = document.getElementById('sign-up-btn');
const signUpForm = document.getElementById('signUpForm');


signUpForm.addEventListener('submit', function(event) {
    event.preventDefault();

    const emailInput = document.getElementById('su_email');
    const passwordInput = document.getElementById('su_pwd');
    const passwordValue = passwordInput.value;
    const passwordCheckInput = document.getElementById('su_pwd_check');
    const passwordCheckValue = passwordCheckInput.value;

    if (emailInput.checkValidity() && passwordValue === passwordCheckValue) {
        alert("Sign up successful!");
        window.location.replace("authentication.html");
    } else {
        alert("Invalid email or password. Please make sure you have retyped your password correctly!");
    }
});
