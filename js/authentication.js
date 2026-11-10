const savedUser = JSON.parse(localStorage.getItem('knovels_user') || 'null');
const isLoggedIn = sessionStorage.getItem('knovels_logged_in') === 'true';

if (!savedUser || !isLoggedIn) {
    window.location.replace("../index.html");
} else {
    document.getElementById('userGreeting').textContent = savedUser.name;
}

const highSchoolButton = document.getElementById('hsBtn');
const collegeButton = document.getElementById('collegeBtn');
const otherButton = document.getElementById('otherBtn');
const logOutButton = document.getElementById('logoutBtn');

function textSelection(level) {
    sessionStorage.setItem('knovels_academia', level);
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
    sessionStorage.removeItem('knovels_logged_in');
    sessionStorage.removeItem('knovels_academia');

    alert("Successfully logged out.");
    window.location.replace("../index.html");
});
