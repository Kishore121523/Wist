import { db } from "../firebase";
import {
  collection,
  doc,
  setDoc,
  onSnapshot,
  query,
  orderBy,
  deleteDoc,
  updateDoc,
} from "firebase/firestore";
import { BucketItem } from "@/types/bucket";
import { serverTimestamp } from "firebase/firestore";

export const createPrivateBucketList = async (
  userId: string,
  bucketData: Omit<BucketItem, "id">
) => {
  const bucketRef = doc(collection(db, "users", userId, "privateBucketLists"));
  await setDoc(bucketRef, {
    ...bucketData,
    createdAt: serverTimestamp(),
    isFavorite: false,
  });
};

export const toggleFavoriteBucketItem = async (
  userId: string,
  itemId: string,
  current: boolean
) => {
  const ref = doc(db, "users", userId, "privateBucketLists", itemId);
  await updateDoc(ref, { isFavorite: !current });
};

export const listenToPrivateBucketLists = (
  userId: string,
  callback: (items: BucketItem[]) => void
) => {
  const q = query(
    collection(db, "users", userId, "privateBucketLists"),
    orderBy("completed", "asc"), // ✅ Incomplete first
    orderBy("isFavorite", "desc"), // ⭐ Favorites next
    orderBy("createdAt", "desc") // 🕒 Most recent last
  );

  return onSnapshot(q, (snapshot) => {
    const items: BucketItem[] = snapshot.docs.map(
      (doc) =>
        ({
          id: doc.id,
          ...doc.data(),
        } as BucketItem)
    );
    callback(items);
  });
};

export const updatePrivateBucketItem = async (
  userId: string,
  itemId: string,
  updates: Partial<BucketItem>
) => {
  const ref = doc(db, "users", userId, "privateBucketLists", itemId);
  await updateDoc(ref, updates);
};

export const deletePrivateBucketItem = async (
  userId: string,
  itemId: string
) => {
  const ref = doc(db, "users", userId, "privateBucketLists", itemId);
  await deleteDoc(ref);
};

export const toggleCompletedBucketItem = async (
  userId: string,
  itemId: string,
  current: boolean
) => {
  const ref = doc(db, "users", userId, "privateBucketLists", itemId);
  await updateDoc(ref, { completed: !current });
};
