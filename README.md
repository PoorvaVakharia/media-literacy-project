# KNovels

A class prototype for discussing academic readings with peers. The frontend uses plain HTML, CSS, and JavaScript, Firebase Authentication, and Cloud Firestore.

## Run locally

From this folder:

```sh
python3 -m http.server 8000
```

Open http://localhost:8000 and sign up or sign in. Choose an academic level, then a specific reading or open discussion.

## Peer discussions

- Selecting a PDF computes its SHA-256 fingerprint locally. The PDF is not uploaded. Readers selecting the exact same bytes share a room, even if the filenames differ.
- Different exports or editions of the same reading may use different rooms. Distribute the same PDF to everyone for a class demo.
- Open discussion joins the shared `general` room.
- Messages sync live through Firestore, and the latest 100 messages are displayed. Chat labels use an account-derived reader alias instead of the profile name.
- Each tab maintains its own presence record every 20 seconds. Multiple tabs on the same account count as one reader. Leaving removes that tab's record; a lost connection or suspended tab expires from the count after approximately 90 seconds.
- Presence reads are capped at the most recent 100 sessions. This is a small-class prototype, not a large-scale presence system.
- There are no simulated replies or AI replies. When alone, the reader sees a waiting message.

## Firebase rules

`firestore.rules` is the version-controlled rules source. Deploy it in Firebase Console → Firestore Database → Rules. It requires authentication, validates message fields and timestamps, and permits clients to update only presence records owned by their Firebase UID. Message editing and deletion are denied.

This prototype allows any authenticated account to read a valid room if it knows its ID. Reader aliases are pseudonyms, not guaranteed anonymity: Firebase stores account IDs with messages. The app does not enforce student-only or teacher-exclusion permissions, provide end-to-end encryption, or moderate chat. PDF contents remain local; message contents are stored in Firebase.

## Verify

For the room utility tests, use Node.js 22 or newer:

```sh
node tests/room-utils.test.mjs
```

For a live two-user check, use two separate browser profiles and distinct Firebase accounts. Select the same PDF in both; confirm one other reader and messages in both directions. Leave one room and confirm the waiting state. Select a different PDF and verify its room has a different ID and no messages from the first room. Two ordinary tabs in one profile usually share an account.

## Project files

- `index.html`: sign-in screen
- `pages/`: dashboard, reading selection, and chat screens
- `js/`: Firebase connection and browser behavior
- `css/`: shared styles
- `tests/`: room matching and presence utility checks

Develop on `poorva-dev`; keep the original `main` version available until the group reviews the changes.
