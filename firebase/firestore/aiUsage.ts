import { db } from "@/firebase/firebase";
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore";

const getUsageRef = (userId: string) =>
  doc(db, "users", userId, "limits", "aiUsage");

export const getUserUsage = async (userId: string) => {
  const ref = getUsageRef(userId);
  const snap = await getDoc(ref);

  if (!snap.exists()) {
    await setDoc(ref, { count: 0, lastReset: serverTimestamp() });
    return { count: 0, lastReset: Timestamp.now() };
  }

  const data = snap.data();
  const now = Timestamp.now();
  const last = data.lastReset;

  const expired = now.toDate().toDateString() !== last.toDate().toDateString();

  if (expired) {
    await setDoc(ref, { count: 0, lastReset: serverTimestamp() });
    return { count: 0, lastReset: Timestamp.now() };
  }

  return data;
};

export const incrementUserUsage = async (userId: string) => {
  const ref = getUsageRef(userId);
  const snap = await getDoc(ref);
  const data = snap.data();
  const newCount = (data?.count || 0) + 1;

  await updateDoc(ref, {
    count: newCount,
    lastReset: data?.lastReset || serverTimestamp(),
  });

  return newCount;
};
