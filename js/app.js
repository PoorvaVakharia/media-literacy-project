import { auth } from "./firebase-config.js";

import {
    signInWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/12.5.0/firebase-auth.js";

const signUpButton = document.getElementById("sign-up-btn");
const loginForm = document.getElementById("loginForm");

loginForm.addEventListener("submit", async function(event) {
    event.preventDefault();

    const email = document.getElementById("si_email").value.trim();
    const password = document.getElementById("si_pwd").value;

    try {
        await signInWithEmailAndPassword(auth, email, password);

        alert("Sign in successful!");

        window.location.replace("pages/authentication.html");

    } catch (error) {
        alert("Invalid email or password.");
        console.error(error);
    }
});

signUpButton.addEventListener("click", () => {
    window.location.replace("pages/signUp.html");
});
