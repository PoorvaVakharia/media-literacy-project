import { auth } from "./firebase-config.js";

import {
    onAuthStateChanged,
    signOut
} from "https://www.gstatic.com/firebasejs/12.5.0/firebase-auth.js";

const highSchoolButton = document.getElementById("hsBtn");
const collegeButton = document.getElementById("collegeBtn");
const otherButton = document.getElementById("otherBtn");
const logOutButton = document.getElementById("logoutBtn");

onAuthStateChanged(auth, (user) => {
    if (!user) {
        window.location.replace("../index.html");
        return;
    }

    document.getElementById("userGreeting").textContent =
        user.displayName || user.email;
});

function textSelection(level) {
    sessionStorage.setItem("knovels_academia", level);
    window.location.href = "chooseText.html";
}

highSchoolButton.addEventListener("click", () => {
    textSelection("highSchool");
});

collegeButton.addEventListener("click", () => {
    textSelection("college");
});

otherButton.addEventListener("click", () => {
    textSelection("other");
});

logOutButton.addEventListener("click", async () => {
    await signOut(auth);

    sessionStorage.removeItem("knovels_academia");

    alert("Successfully logged out.");

    window.location.replace("../index.html");
});
