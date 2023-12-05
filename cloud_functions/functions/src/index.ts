/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
//  */

// import {onRequest} from "firebase-functions/v2/https";
// import * as logger from "firebase-functions/logger";

// Start writing functions
// https://firebase.google.com/docs/functions/typescript

// export const helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

import * as functions from "firebase-functions";
import * as adminType from "firebase-admin";

let admin: typeof adminType;

/**
 * Lazy loads and initializes the Firebase Admin SDK.
 * @return {adminType} The initialized Firebase Admin SDK.
 */
function getAdmin() {
  if (!admin) {
    admin = require("firebase-admin");
    admin.initializeApp();
  }
  return admin;
}

// TODO: change the checker function below to work like this:

// 1. When an event is created, a Cloud Function triggers and creates a
// Cloud Scheduler job that will call another Cloud Function at the
// event's start time.

// 2. This other Cloud Function updates the event's status to 'live' and
// creates another Google Cloud Scheduler job that will call a third Cloud
// Function at the event's end time.

// 3. The third Cloud Function updates the event's status to 'past'.

export const checkEvents = functions
  .region("europe-west3")
  .pubsub.schedule("every 1 minutes")
  .onRun(async () => {
    const firestore = getAdmin().firestore();
    const eventsRef = firestore.collection("events");
    const now = admin.firestore.Timestamp.now().toDate();

    const snapshot = await eventsRef
      .where("status", "in", ["live", "future"])
      .get();

    snapshot.forEach(async (doc: adminType.firestore.QueryDocumentSnapshot) => {
      const event = doc.data();
      let status = "future";

      if (event.endTime.toDate() < now) {
        status = "past";
      } else if (
        event.startTime.toDate() <= now &&
        event.endTime.toDate() > now
      ) {
        status = "live";
      }

      // Update the status if it has changed
      if (event.status !== status) {
        await doc.ref.update({status});
      }
    });
  });
