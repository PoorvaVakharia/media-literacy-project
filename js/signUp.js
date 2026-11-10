import { auth } from "./firebase-config.js";

import {
    createUserWithEmailAndPassword,
    updateProfile
} from "https://www.gstatic.com/firebasejs/12.5.0/firebase-auth.js";

const signUpForm = document.getElementById("signUpForm");

signUpForm.addEventListener("submit", async function(event) {
    event.preventDefault();

    const username = document.getElementById("su_name").value.trim();
    const email = document.getElementById("su_email").value.trim();
    const password = document.getElementById("su_pwd").value;
    const confirmPassword = document.getElementById("su_pwd_check").value;

    if (!username) {
        alert("Please enter your name.");
        return;
    }

    if (password !== confirmPassword) {
        alert("Your passwords don't match!");
        return;
    }

    try {
        const result = await createUserWithEmailAndPassword(
            auth,
            email,
            password
        );

        await updateProfile(result.user, {
            displayName: username
        });

        alert("Account created successfully!");

        window.location.replace("authentication.html");

    } catch (error) {
        alert("Signup failed: " + error.message);
        console.error(error);
    }
});
