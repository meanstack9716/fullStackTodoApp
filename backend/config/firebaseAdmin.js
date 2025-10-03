const admin = require('firebase-admin');

if (!admin.apps.length) {
    const serviceAccountJson = process.env.FIREBASE_SERVICE_ACCOUNT_KEY
        ? JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY)
        : require('./todotapp-c920b-firebase-adminsdk-fbsvc-483cf24827.json');

    admin.initializeApp({
        credential: admin.credential.cert(serviceAccountJson),
    });
}

module.exports = admin;
