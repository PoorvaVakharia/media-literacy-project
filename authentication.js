const highSchoolButton = document.getElementById('hsBtn');
const collegeButton = document.getElementById('collegeBtn');
const otherButton = document.getElementById('otherBtn');
const logOutButton = document.getElementById('logoutBtn');
let academia = "";

// Matching function
async function textSelection(level) {
    academia = level;
    window.location.href = "chooseText.html";
}

highSchoolButton.addEventListener('click', () => {
    textSelection("highSchool");
});

collegeButton.addEventListener('click', () => {
    textSelection("college");
});

otherButton.addEventListener('click', () => {
    textSelection("other");
});

logOutButton.addEventListener('click', () => {
    alert("Successfully logged out.");
    window.location.replace("index.html");
});