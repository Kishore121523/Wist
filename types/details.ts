import { Timestamp } from "firebase/firestore";

export interface BucketItemDetails {
  expectedStartDate?: Date | Timestamp;
  expectedEndDate?: Date | Timestamp;
  planningNotes?: string;
  memoryPhotos?: string[];
  reflectionNotes?: string;
  collaborators?: string[];
  createdAt?: Date;
  updatedAt?: Date;
}
