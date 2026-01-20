import { doc, getDoc } from "firebase/firestore";
import { db } from "./config";

export const getUserRole = async (uid) => {
  const docRef = doc(db, "users", uid);
  const snap = await getDoc(docRef);
  return snap.data()?.role;
};
