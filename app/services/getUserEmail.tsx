import { collection, getDocs, query, where } from "firebase/firestore";

import { db } from "../firebase.js";

const getUserEmail = async (identifier) => {
  const usersRef = collection(db, "users");

  // Query where identifier matches username
  const usernameQuery = query(usersRef, where("username", "==", identifier));
  const usernameSnapshot = await getDocs(usernameQuery);

  if (!usernameSnapshot.empty) {
    const user = usernameSnapshot.docs[0];
    return user.data().email;
  }

  return null;
};

export default getUserEmail;
