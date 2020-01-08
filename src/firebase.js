import { initializeApp } from 'firebase';

const app = initializeApp({
    apiKey: /* hidden */,
    authDomain: /* hidden */,
    databaseURL: /* hidden */,
    projectId: /* hidden */,
    storageBucket: /* hidden */,
    messagingSenderId: /* hidden */,
    appId: /* hidden */
});

export const db = app.database();
export const astronautsRef = db.ref('astronauts');