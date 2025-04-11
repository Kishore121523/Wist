// firebase/firestore/memoryPhotos.ts
import { db } from "@/firebase/firebase";
import { doc, getDoc, setDoc, Timestamp } from "firebase/firestore";
import { BucketItemDetails } from "@/types/details";

export const addMemoryPhoto = async (
  userId: string,
  bucketId: string,
  photoUrl: string,
  comment?: string
) => {
  const docRef = doc(
    db,
    "users",
    userId,
    "privateBucketLists",
    bucketId,
    "details",
    "info"
  );
  const docSnap = await getDoc(docRef);

  const newPhoto = {
    url: photoUrl,
    comment: comment || "",
    uploadedAt: Timestamp.now(),
  };

  let updatedPhotos: BucketItemDetails["memoryPhotos"] = [newPhoto];

  if (docSnap.exists()) {
    const data = docSnap.data() as BucketItemDetails;
    const existingPhotos = data.memoryPhotos || [];
    updatedPhotos = [...existingPhotos, newPhoto];
  }

  await setDoc(
    docRef,
    {
      memoryPhotos: updatedPhotos,
      updatedAtMemoryPhotos: Timestamp.now(),
    },
    { merge: true }
  );
};
