/**
 * Cloud Functions for Firebase (2nd Gen)
 * Auth Blocking Function: beforeUserCreated
 * Project: time-table-42cb4
 */

const { beforeUserCreated, HttpsError } = require("firebase-functions/v2/identity");
const admin = require("firebase-admin");
const fs = require("fs");
const path = require("path");

admin.initializeApp();

/**
 * Loads authorized emails and domains from Cloud Firestore collection/document
 * with local fallback to allowlist.json.
 */
async function getAllowlist() {
  let allowedEmails = [];
  let allowedDomains = [];

  // 1. Attempt reading dynamic allowlist from Firestore `config/allowlist` or `allowlist` collection
  try {
    const db = admin.firestore();
    
    // Check document: `config/allowlist`
    const docRef = db.collection("config").doc("allowlist");
    const docSnap = await docRef.get();

    if (docSnap.exists) {
      const data = docSnap.data();
      if (Array.isArray(data.allowedEmails)) allowedEmails = data.allowedEmails;
      if (Array.isArray(data.allowedDomains)) allowedDomains = data.allowedDomains;
      
      if (Array.isArray(data.allowlist)) {
        data.allowlist.forEach((entry) => {
          if (entry.startsWith("@")) allowedDomains.push(entry);
          else allowedEmails.push(entry);
        });
      }
    }

    // Also check collection: `allowlist`
    const colSnap = await db.collection("allowlist").get();
    if (!colSnap.empty) {
      colSnap.forEach((doc) => {
        const item = doc.data();
        const email = item.email || item.value || doc.id;
        const domain = item.domain;

        if (email) {
          if (email.startsWith("@")) allowedDomains.push(email);
          else allowedEmails.push(email);
        }
        if (domain) {
          allowedDomains.push(domain);
        }
      });
    }
  } catch (err) {
    console.warn("Firestore allowlist lookup notice (using fallback allowlist.json):", err.message);
  }

  // 2. Read local fallback config file `allowlist.json`
  try {
    const configPath = path.join(__dirname, "allowlist.json");
    if (fs.existsSync(configPath)) {
      const fileData = fs.readFileSync(configPath, "utf-8");
      const fileConfig = JSON.parse(fileData);
      
      if (Array.isArray(fileConfig.allowedEmails)) {
        allowedEmails = Array.from(new Set([...allowedEmails, ...fileConfig.allowedEmails]));
      }
      if (Array.isArray(fileConfig.allowedDomains)) {
        allowedDomains = Array.from(new Set([...allowedDomains, ...fileConfig.allowedDomains]));
      }
    }
  } catch (err) {
    console.error("Error reading allowlist.json fallback:", err);
  }

  // Format and normalize strings
  return {
    allowedEmails: allowedEmails.map((e) => String(e).toLowerCase().trim()),
    allowedDomains: allowedDomains.map((d) => {
      const str = String(d).toLowerCase().trim();
      return str.startsWith("@") ? str : "@" + str;
    })
  };
}

/**
 * Firebase Auth Blocking Function: beforeUserCreated
 * Intercepts new user registration before account creation.
 * Works for all authentication providers (Email/Password, Google, Email Link, etc.).
 */
exports.beforeUserCreated = beforeUserCreated(async (event) => {
  const user = event.data;
  const email = user && user.email ? user.email.toLowerCase().trim() : null;

  if (!email) {
    console.warn("Sign-up blocked: User object missing email address.");
    throw new HttpsError(
      "permission-denied",
      "Registration failed: A valid college/institutional email address is required to create an account."
    );
  }

  const { allowedEmails, allowedDomains } = await getAllowlist();
  const emailDomain = "@" + email.split("@")[1];

  const isEmailAllowed = allowedEmails.includes(email);
  const isDomainAllowed = allowedDomains.includes(emailDomain);

  if (!isEmailAllowed && !isDomainAllowed) {
    console.warn(`🚫 Sign-up blocked for unauthorized email: ${email} (Domain: ${emailDomain})`);
    throw new HttpsError(
      "permission-denied",
      `Access Restricted: The email address '${email}' (domain ${emailDomain}) is not pre-approved for sign-up.`
    );
  }

  console.log(`✅ Sign-up approved for authorized user: ${email}`);
  return;
});
