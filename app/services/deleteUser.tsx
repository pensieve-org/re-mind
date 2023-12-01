import {
  collection,
  doc,
  getDocs,
  query,
  where,
  deleteDoc,
  writeBatch,
} from "firebase/firestore";
import { db, storage, auth } from "../firebase.js";
import { deleteObject, ref } from "firebase/storage";

const deleteUser = async (userId) => {
  try {
    // delete user from firestore
    const userRef = doc(db, "users", userId);
    await deleteDoc(userRef);

    // delete attendees from firestore
    const attendeesQuery = query(
      collection(db, "attendees"),
      where("userId", "==", userId)
    );
    const attendeesSnapshot = await getDocs(attendeesQuery);

    const batchDelete = writeBatch(db);
    attendeesSnapshot.docs.forEach((doc) => {
      batchDelete.delete(doc.ref);
    });
    await batchDelete.commit();

    // delete all friend connections
    const friends1Query = query(
      collection(db, "friends"),
      where("user1Id", "==", userId)
    );
    const friends2Query = query(
      collection(db, "friends"),
      where("user2Id", "==", userId)
    );

    const friends1Snapshot = await getDocs(friends1Query);
    const friends2Snapshot = await getDocs(friends2Query);

    const friendsSnapshot = [
      ...friends1Snapshot.docs,
      ...friends2Snapshot.docs,
    ];

    const batchDeleteFriends = writeBatch(db);
    friendsSnapshot.forEach((doc) => {
      batchDeleteFriends.delete(doc.ref);
    });

    await batchDeleteFriends.commit();

    // delete thumbnail from storage
    const profilePictureRef = ref(storage, `users/${userId}/profile_picture`);
    await deleteObject(profilePictureRef);

    // delete user auth
    await auth.currentUser.delete();
  } catch (error) {
    throw error;
  }
};

export default deleteUser;
