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

export const createPrivateBucketList = async (
  userId: string,
  data: BucketItem
) => {
  const ref = doc(collection(db, "users", userId, "privateBucketLists"));
  await setDoc(ref, data);
};

export const listenToPrivateBucketLists = (
  userId: string,
  callback: (items: BucketItem[]) => void
) => {
  const q = query(
    collection(db, "users", userId, "privateBucketLists"),
    orderBy("priority")
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
