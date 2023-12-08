import { collection, doc, onSnapshot } from "firebase/firestore";
import { db } from "../firebase.js";
import { useEffect } from "react";

const EventListeners = ({ events, setIsLive, setLiveEventIds }) => {
  useEffect(() => {
    if (events) {
      const liveEventIds = events.live
        ? events.live.map((event) => event.eventId)
        : [];
      const futureEventIds = events.future
        ? events.future.map((event) => event.eventId)
        : [];
      const eventIds = [...liveEventIds, ...futureEventIds];
      const cleanup = listenToEvents(eventIds);

      return cleanup; // This will call the cleanup function when the component unmounts
    }
  }, [events]);

  const listenToEvents = (eventIds) => {
    const liveEventIds = [];
    const unsubscribeFns = eventIds.map((eventId) =>
      onSnapshot(
        doc(collection(db, "events"), eventId),
        (doc) => {
          if (doc.exists() && doc.data().status === "live") {
            setIsLive(true);
            liveEventIds.push(eventId);
          }
        },
        (err) => {
          console.log(err);
        }
      )
    );

    setLiveEventIds(liveEventIds);

    return () => {
      unsubscribeFns.forEach((unsubscribe) => unsubscribe());
    };
  };
  return null;
};

export default EventListeners;