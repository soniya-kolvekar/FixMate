import {
  doc,
  setDoc,
  getDoc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";

import { db } from "./firebase";

export const createUserDocument = async (uid, userData) => {
  await setDoc(doc(db, "users", uid), userData);
};

export const getUserDocument = async (uid) => {
  const docSnap = await getDoc(doc(db, "users", uid));

  if (docSnap.exists()) {
    return docSnap.data();
  }

  return null;
};

export const updateUserDocument = async (uid, updatedData) => {
  await updateDoc(doc(db, "users", uid), updatedData);
};

export const deleteUserDocument = async (uid) => {
  await deleteDoc(doc(db, "users", uid));
};