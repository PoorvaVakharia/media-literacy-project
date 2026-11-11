import { auth, db } from "./firebase-config.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.5.0/firebase-auth.js";
import {
    collection, doc, addDoc, setDoc, deleteDoc, query, orderBy, limit,
    onSnapshot, serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.5.0/firebase-firestore.js";
import { validRoomId, otherReaderCount, readerAlias } from "./room-utils.js";

const form = document.getElementById("chatForm");
const input = document.getElementById("chatInput");
const messages = document.getElementById("chatMessages");
const send = document.querySelector(".send-btn");
const leave = document.querySelector(".end-chat-btn");
const status = document.getElementById("chatStatus");
const presenceStatus = document.getElementById("presenceStatus");
const roomId = new URLSearchParams(location.search).get("room") || "general";
let currentUser;
let stopMessages;
let stopPresence;
let presenceRef;
let heartbeat;
let presenceClock;
let sessions = [];
let presenceReady = false;
let serverOffset = 0;
let sending = false;
let leaving = false;
let generation = 0;

function updateSendState() {
    input.disabled = !currentUser || leaving;
    send.disabled = !currentUser || leaving || sending || !navigator.onLine;
}

function renderPresence() {
    if (!presenceReady || !currentUser) return;
    const count = otherReaderCount(sessions, currentUser.uid, Date.now() + serverOffset);
    presenceStatus.textContent = count === 0
        ? "You’re the only reader here right now. Waiting for others to join…"
        : `${count} other ${count === 1 ? "reader is" : "readers are"} here. Say hello!`;
}

function stopRoom() {
    generation++;
    stopMessages?.();
    stopPresence?.();
    clearInterval(heartbeat);
    clearInterval(presenceClock);
    const previousRef = presenceRef;
    presenceRef = null;
    presenceReady = false;
    sessions = [];
    // Best effort. The timeout handles closed tabs and lost connections.
    if (previousRef) return deleteDoc(previousRef).catch(error => console.warn("Presence cleanup:", error));
    return Promise.resolve();
}

function renderMessage(message) {
    const bubble = document.createElement("div");
    const mine = message.senderId === currentUser.uid;
    bubble.className = `message ${mine ? "outgoing" : "incoming"}`;
    const name = document.createElement("strong");
    name.textContent = mine ? "You" : readerAlias(message.senderId || "unknown");
    const text = document.createElement("div");
    text.textContent = message.text;
    text.style.whiteSpace = "pre-wrap";
    bubble.append(name, text);
    return bubble;
}

function startRoom(user) {
    currentUser = user;
    const activeGeneration = generation;
    updateSendState();
    const messageQuery = query(collection(db, "chatrooms", roomId, "messages"),
        orderBy("createdAt", "desc"), limit(100));
    stopMessages = onSnapshot(messageQuery, { includeMetadataChanges: true }, snapshot => {
        if (activeGeneration !== generation) return;
        const nearBottom = messages.scrollHeight - messages.scrollTop - messages.clientHeight < 100;
        messages.replaceChildren(...snapshot.docs.slice().reverse().map(item => renderMessage(item.data())));
        status.textContent = snapshot.metadata.fromCache
            ? "Connecting to live chat… Messages may be from this device’s cache."
            : snapshot.metadata.hasPendingWrites ? "Sending message…" : "Connected. Messages appear live.";
        if (nearBottom) messages.scrollTop = messages.scrollHeight;
    }, error => {
        console.error("Chat listener:", error);
        status.textContent = "Unable to load chat. Check your connection and try refreshing.";
    });

    // A new ID for each page instance keeps one tab from removing another tab’s presence.
    presenceRef = doc(collection(db, "chatrooms", roomId, "presence"));
    const ownPresenceRef = presenceRef;
    let heartbeatPending = false;
    async function touchPresence() {
        if (heartbeatPending || activeGeneration !== generation || !navigator.onLine) return;
        heartbeatPending = true;
        try {
            await setDoc(ownPresenceRef, { uid: user.uid, updatedAt: serverTimestamp() });
            if (activeGeneration !== generation) {
                await deleteDoc(ownPresenceRef).catch(() => {});
            }
        } catch (error) {
            if (activeGeneration !== generation) return;
            console.error("Presence update:", error);
            presenceReady = false;
            presenceStatus.textContent = "Online status unavailable. You can still try sending a message.";
        } finally {
            heartbeatPending = false;
        }
    }
    // Bound the subscription for this small class prototype.
    const presenceQuery = query(collection(db, "chatrooms", roomId, "presence"),
        orderBy("updatedAt", "desc"), limit(100));
    stopPresence = onSnapshot(presenceQuery, snapshot => {
        if (activeGeneration !== generation || snapshot.metadata.fromCache) return;
        const ownSession = snapshot.docs.find(item => item.id === ownPresenceRef.id);
        const ownTime = ownSession?.data().updatedAt?.toMillis();
        // Calibrate clock once using a confirmed server timestamp.
        if (ownTime && !presenceReady) serverOffset = ownTime - Date.now();
        sessions = snapshot.docs.filter(item => !item.metadata.hasPendingWrites).map(item => ({
            uid: item.data().uid,
            lastSeen: item.data().updatedAt?.toMillis()
        }));
        presenceReady = true;
        renderPresence();
    }, error => {
        console.error("Presence listener:", error);
        presenceReady = false;
        presenceStatus.textContent = "Online status unavailable. You can still try sending a message.";
    });
    touchPresence();
    heartbeat = setInterval(touchPresence, 20000);
    presenceClock = setInterval(renderPresence, 5000);
}

updateSendState();
if (!validRoomId(roomId)) {
    status.textContent = "This room link is invalid. Go back and choose your reading again.";
    presenceStatus.textContent = "";
} else {
    document.getElementById("roomName").textContent = roomId === "general"
        ? "Open discussion" : `Reading discussion · ${roomId.slice(4, 12)}`;
    onAuthStateChanged(auth, user => {
        stopRoom();
        currentUser = null;
        updateSendState();
        messages.replaceChildren();
        if (!user) {
            location.replace("../index.html");
            return;
        }
        if (!leaving) startRoom(user);
    });
}

form.addEventListener("submit", async event => {
    event.preventDefault();
    const text = input.value.trim();
    if (!currentUser || sending || leaving || !validRoomId(roomId)) return;
    if (!navigator.onLine) {
        status.textContent = "You’re offline. Reconnect before sending.";
        return;
    }
    if (!text || text.length > 2000) {
        status.textContent = "Enter a message of 1–2,000 characters.";
        return;
    }
    sending = true;
    updateSendState();
    try {
        await addDoc(collection(db, "chatrooms", roomId, "messages"), {
            senderId: currentUser.uid,
            senderName: readerAlias(currentUser.uid),
            text,
            createdAt: serverTimestamp()
        });
        // Keep any new text the reader typed while the write was in flight.
        if (input.value.trim() === text) input.value = "";
        messages.scrollTop = messages.scrollHeight;
    } catch (error) {
        console.error("Send failed:", error);
        status.textContent = "Message wasn’t sent. Your text is still here; please try again.";
    } finally {
        sending = false;
        updateSendState();
        if (!input.disabled) input.focus();
    }
});

leave.addEventListener("click", async () => {
    leaving = true;
    updateSendState();
    // Do not trap readers here if the network is unavailable.
    await Promise.race([stopRoom(), new Promise(resolve => setTimeout(resolve, 1000))]);
    location.href = "chooseText.html";
});
window.addEventListener("pagehide", () => { leaving = true; stopRoom(); });
window.addEventListener("pageshow", event => { if (event.persisted) location.reload(); });
window.addEventListener("offline", () => {
    presenceReady = false;
    status.textContent = "You’re offline. Reconnect to continue chatting.";
    presenceStatus.textContent = "Online status unavailable while offline.";
    updateSendState();
});
window.addEventListener("online", () => { location.reload(); });
