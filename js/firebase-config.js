import { initializeApp } from "https://www.gstatic.com/firebasejs/12.5.0/firebase-app.js";

import {
    getAuth
} from "https://www.gstatic.com/firebasejs/12.5.0/firebase-auth.js";

import {
    getFirestore
} from "https://www.gstatic.com/firebasejs/12.5.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyD6_5zsyBA_VRlDABlGg5i9g2DRT5HSqbQ",
    authDomain: "media-literacy-project.firebaseapp.com",
    projectId: "media-literacy-project",
    storageBucket: "media-literacy-project.firebasestorage.app",
    messagingSenderId: "295134795431",
    appId: "1:295134795431:web:2b18204b263d7268db2d82",
    measurementId: "G-9461XC3K9L"
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };
