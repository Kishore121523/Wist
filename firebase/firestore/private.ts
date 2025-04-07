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
  getDocs,
} from "firebase/firestore";
import { BucketItem } from "@/types/bucket";
import { serverTimestamp } from "firebase/firestore";

const priorityToValue = {
  High: 1,
  Medium: 2,
  Low: 3,
};

export const createPrivateBucketList = async (
  userId: string,
  bucketData: Omit<BucketItem, "id">
) => {
  const bucketRef = doc(collection(db, "users", userId, "privateBucketLists"));
  const priorityValue =
    priorityToValue[bucketData.priority as keyof typeof priorityToValue] || 4;

  await setDoc(bucketRef, {
    ...bucketData,
    priorityValue,
    createdAt: serverTimestamp(),
    isFavorite: false,
  });
};

export const updatePrivateBucketItem = async (
  userId: string,
  itemId: string,
  updates: Partial<BucketItem>
) => {
  const ref = doc(db, "users", userId, "privateBucketLists", itemId);

  const finalUpdates = { ...updates };

  if (updates.priority) {
    finalUpdates.priorityValue =
      priorityToValue[updates.priority as keyof typeof priorityToValue] || 4;
  }

  await updateDoc(ref, finalUpdates);
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
    orderBy("priorityValue"),
    orderBy("createdAt", "desc")
  );

  return onSnapshot(q, (snapshot) => {
    const items: BucketItem[] = snapshot.docs.map(
      (doc) => ({ id: doc.id, ...doc.data() } as BucketItem)
    );

    // Push completed items to the end
    const sorted = [
      ...items.filter((item) => !item.completed),
      ...items.filter((item) => item.completed),
    ];

    callback(sorted);
  });
};

export const deletePrivateBucketItem = async (
  userId: string,
  itemId: string
) => {
  const itemRef = doc(db, "users", userId, "privateBucketLists", itemId);
  const detailsRef = collection(
    db,
    "users",
    userId,
    "privateBucketLists",
    itemId,
    "details"
  );

  // Delete all documents inside 'details' subcollection
  const detailsSnapshot = await getDocs(detailsRef);
  const deleteDetails = detailsSnapshot.docs.map((docSnap) =>
    deleteDoc(docSnap.ref)
  );
  await Promise.all(deleteDetails);

  // Delete the main bucket item
  await deleteDoc(itemRef);
};

export const toggleCompletedBucketItem = async (
  userId: string,
  itemId: string,
  current: boolean
) => {
  const ref = doc(db, "users", userId, "privateBucketLists", itemId);
  await updateDoc(ref, { completed: !current });
};
