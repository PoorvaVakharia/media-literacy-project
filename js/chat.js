const chatForm = document.getElementById('chatForm');
const chatInput = document.getElementById('chatInput');
const chatMessages = document.getElementById('chatMessages');
let myEndRequest = false;
let otherEndRequest = false;
let chatEnded = false;

// Automatically scroll to the bottom of the chat window
function scrollToBottom() {
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Initialize scroll position
scrollToBottom();

// Handle sending a message
chatForm.addEventListener('submit', function(event) {
    // Prevent the page from reloading on form submission
    event.preventDefault();

    const messageText = chatInput.value.trim();
    if (messageText === '') return;

    // 1. Create a new message element
    const messageElement = document.createElement('div');
    messageElement.classList.add('message', 'outgoing');
    messageElement.textContent = messageText;

    // 2. Append the message element to the chat box
    chatMessages.appendChild(messageElement);

    // 3. Clear the input field
    chatInput.value = '';

    // 4. Scroll smoothly down to reveal the new message
    scrollToBottom();

    // OPTIONAL: Simulate an automatic bot reply after 1 second
    setTimeout(simulateBotReply, 4000);
});

function simulateBotReply() {
    const botElement = document.createElement('div');
    botElement.classList.add('message', 'incoming');
    botElement.textContent = "oh hi! i'm beta testing this app for my friends. hope this message is enough for your class. if you want to give me credit, tell them that zoe tested your code! ;)";
            
    chatMessages.appendChild(botElement);
    scrollToBottom();
}

function endChat() {
    const confirmEnd = confirm("Are you sure you want to end this chat?");

    if (confirmEnd) {

        // Disable the chat input
        document.getElementById("chatInput").disabled = true;

        // Disable the send button
        document.querySelector(".send-btn").disabled = true;

        // Update the chat header
        document.querySelector(".chat-header span").textContent = "Chat Ended";

        // Hide the End Chat button
        document.querySelector(".end-chat-btn").style.display = "none";
    }
}

function requestEndChat() {
    if (chatEnded || myEndRequest) return;

    myEndRequest = true;

    alert("Your request to end the chat has been sent.");

    // In a real application, notify the other participant
    // through your backend or WebSocket connection.

    updateChatStatus();
}

function respondToEndChat(agreed) {
    if (!agreed) {
        otherEndRequest = false;

        alert("You declined the request. The chat will continue.");
        updateChatStatus();
        return;
    }

    otherEndRequest = true;

    updateChatStatus();
}

function updateChatStatus() {
    if (myEndRequest && otherEndRequest) {
        chatEnded = true;

        document.getElementById("chatInput").disabled = true;
        document.querySelector(".send-btn").disabled = true;

        document.querySelector(".chat-header span").textContent =
            "Chat Ended";

        alert("Both participants agreed. The chat has ended.");
    }
}