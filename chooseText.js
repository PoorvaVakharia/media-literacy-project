const specificTextButton = document.getElementById('specificTextBtn');
const anythingButton = document.getElementById('anythingBtn');
let pref = "";
// need to actually select users based on 'academia', right now only simulation
// need to pass academia to this function!!!

// Wait function
function wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Matching function
async function startMatching(pref) {
    alert("Matching you with someone of similar academic standing. Please wait...");
    await wait(2000);
    alert("User found! Redirecting...");
    if(pref === "specific"){
        window.location.replace("chatSetup.html");
    }
    else{
        window.location.replace("chat.html");
    }
    
}

specificTextButton.addEventListener('click', () => {
    pref = "specific";
    startMatching(pref);
});

anythingButton.addEventListener('click', () => {
    pref = "anything";
    startMatching(pref);
});

