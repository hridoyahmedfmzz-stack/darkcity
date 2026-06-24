const { initializeApp, cert } = require("firebase-admin/app");
const { getAuth } = require("firebase-admin/auth");
const { getFirestore, FieldValue } = require("firebase-admin/firestore");

const serviceAccount = require("./darkcity-a3b54-firebase-adminsdk-fbsvc-f2470daada.json");

initializeApp({
  credential: cert(serviceAccount),
});

const db = getFirestore();
async function migrateUsers() {
  let nextPageToken;

  do {
    const result = await getAuth().listUsers(
  1000,
  nextPageToken
);
    for (const user of result.users) {
      const ref = db.collection("users").doc(user.uid);

      const snap = await ref.get();

      if (!snap.exists) {
        await ref.set({
          uid: user.uid,
          name: user.displayName || "",
          email: user.email || "",
          role: "user",
          premium: false,
          createdAt: FieldValue.serverTimestamp(),
        });

        console.log(`Imported: ${user.email}`);
      }
    }

    nextPageToken = result.pageToken;
  } while (nextPageToken);

  console.log("Migration Complete");
}

migrateUsers()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });