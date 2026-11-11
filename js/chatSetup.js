import { pdfRoomId } from "./room-utils.js";

const input = document.getElementById("pdfInput");
const preview = document.getElementById("pdfPreview");
const join = document.getElementById("joinChat");
const status = document.getElementById("status");
let previewUrl;
let selection = 0;

input.addEventListener("change", async () => {
    const version = ++selection;
    join.hidden = true;
    preview.hidden = true;
    preview.removeAttribute("src");
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    const file = input.files[0];
    if (!file) {
        status.textContent = "Choose a PDF to find its discussion room.";
        return;
    }
    if (file.size > 25 * 1024 * 1024) {
        status.textContent = "Please choose a PDF smaller than 25 MB.";
        return;
    }
    status.textContent = "Preparing your text…";
    try {
        const bytes = await file.arrayBuffer();
        if (version !== selection) return;
        if (new TextDecoder().decode(bytes.slice(0, 5)) !== "%PDF-") {
            throw new Error("Please choose a valid PDF file.");
        }
        const roomId = await pdfRoomId(bytes);
        if (version !== selection) return;
        previewUrl = URL.createObjectURL(file);
        preview.src = previewUrl;
        preview.hidden = false;
        join.href = "chat.html?room=" + roomId;
        join.hidden = false;
        status.textContent = "Ready. Readers who choose this exact PDF will join the same room.";
    } catch (error) {
        status.textContent = error.message || "Unable to prepare this PDF. Please try again.";
    }
});
window.addEventListener("pagehide", () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
});
