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
import * as admin from "firebase-admin";
admin.initializeApp();

// TODO: change the checker function below to work like this:

// 1. When an event is created, a Cloud Function triggers and creates a
// Cloud Scheduler job that will call another Cloud Function at the
// event's start time.

// 2. This other Cloud Function updates the event's status to 'live' and
// creates another Google Cloud Scheduler job that will call a third Cloud
// Function at the event's end time.

// 3. The third Cloud Function updates the event's status to 'past'.

export const scheduledFunction = functions
  .region("europe-west3") // Set the region here
  .pubsub.schedule("every 1 minutes")
  .onRun(async (context) => {
    const now = admin.firestore.Timestamp.now().toDate();
    const eventsRef = admin.firestore().collection("events");

    const snapshot = await eventsRef
      .where("status", "in", ["live", "future"])
      .get();

    snapshot.forEach((doc: admin.firestore.QueryDocumentSnapshot) => {
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
      doc.ref.update({status});
    });
  });
