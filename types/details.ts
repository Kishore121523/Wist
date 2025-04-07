import { Timestamp } from "firebase/firestore";

export interface BucketItemDetails {
  expectedStartDate?: Date | Timestamp;
  expectedEndDate?: Date | Timestamp;
  planningNotes?: string; // Rich text or plain notes
  memoryPhotos?: string[]; // URLs of uploaded images
  reflectionNotes?: string; // Reflections after completing
  collaborators?: string[]; // List of email addresses or user IDs
  createdAt?: Date; // When the detail doc was created
  updatedAt?: Date; // When it was last edited
}
