import { Timestamp } from "firebase/firestore";

export interface BucketItemDetails {
  expectedStartDate?: Date | Timestamp;
  expectedEndDate?: Date | Timestamp;
  planningNotes?: string;

  // New structure for photos and comments
  memoryPhotos?: {
    url: string;
    comment?: string;
    uploadedAt?: Date | Timestamp;
    updatedAtMemoryPhoto?: Date;
  }[];

  collaborators?: string[];
  createdAt?: Date;
  updatedAtPlanning?: Date;
}
