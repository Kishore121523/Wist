export interface BucketItem {
  id?: string;
  name: string;
  description: string;
  category: string;
  priority: "High" | "Medium" | "Low";
  priorityValue: number;
  planningNote?: string;
  completed: boolean;
  isFavorite?: boolean;
  createdAt?: Date;
}
