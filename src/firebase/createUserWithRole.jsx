import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "./config";

export const createUserWithRole = async (
  email,
  password,
  role,
  name,
  adminUid
) => {
  const userCredential = await createUserWithEmailAndPassword(
    auth,
    email,
    password
  );

  await setDoc(doc(db, "users", userCredential.user.uid), {
    name,
    email,
    role,
    createdBy: adminUid,
    createdAt: serverTimestamp(),
  });
};
