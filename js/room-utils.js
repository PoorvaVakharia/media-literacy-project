export const PRESENCE_TIMEOUT_MS = 90000;

export async function pdfRoomId(bytes) {
    const digest = await crypto.subtle.digest("SHA-256", bytes);
    return "pdf-" + Array.from(new Uint8Array(digest), byte =>
        byte.toString(16).padStart(2, "0")).join("");
}

export function validRoomId(roomId) {
    return roomId === "general" || /^pdf-[a-f0-9]{64}$/.test(roomId);
}

// Multiple tabs for the same account count as one reader.
export function otherReaderCount(sessions, ownUid, now = Date.now()) {
    return new Set(sessions.filter(session =>
        typeof session.uid === "string" && session.uid !== ownUid &&
        Number.isFinite(session.lastSeen) &&
        now - session.lastSeen < PRESENCE_TIMEOUT_MS &&
        session.lastSeen <= now + 10000
    ).map(session => session.uid)).size;
}

export function readerAlias(uid) {
    return "Reader " + uid.slice(0, 6);
}
