import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "@/firebase/firebase";

export const uploadMemoryPhoto = async (
  userId: string,
  bucketId: string,
  file: File
): Promise<string> => {
  const fileRef = ref(
    storage,
    `users/${userId}/bucketItems/${bucketId}/${file.name}`
  );
  await uploadBytes(fileRef, file);
  const url = await getDownloadURL(fileRef);
  return url;
};
