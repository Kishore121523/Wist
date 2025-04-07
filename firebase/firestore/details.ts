import { db } from "@/firebase/firebase";
import {
  doc,
  setDoc,
  getDoc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
} from "firebase/firestore";
import { BucketItemDetails } from "@/types/details";

const getDetailsDocRef = (userId: string, itemId: string) =>
  doc(db, "users", userId, "privateBucketLists", itemId, "details", "info");

// ✅ Get details (read)
export const getBucketItemDetails = async (
  userId: string,
  itemId: string
): Promise<BucketItemDetails | null> => {
  const ref = getDetailsDocRef(userId, itemId);
  const snapshot = await getDoc(ref);
  return snapshot.exists() ? (snapshot.data() as BucketItemDetails) : null;
};

// ✅ Set details (create or overwrite)
export const setBucketItemDetails = async (
  userId: string,
  itemId: string,
  data: BucketItemDetails
) => {
  const ref = getDetailsDocRef(userId, itemId);
  const current = await getDoc(ref);

  const payload = {
    ...data,
    updatedAt: new Date(),
    // Only set createdAt if it's a new document
    ...(current.exists() ? {} : { createdAt: new Date() }),
  };

  await setDoc(ref, payload, { merge: true });
};

// ✅ Update details (partial update)
export const updateBucketItemDetails = async (
  userId: string,
  itemId: string,
  data: Partial<BucketItemDetails>
) => {
  const ref = getDetailsDocRef(userId, itemId);
  await updateDoc(ref, {
    ...data,
    updatedAt: serverTimestamp(),
  });
};

// ✅ Delete details
export const deleteBucketItemDetails = async (
  userId: string,
  itemId: string
) => {
  const ref = getDetailsDocRef(userId, itemId);
  await deleteDoc(ref);
};
