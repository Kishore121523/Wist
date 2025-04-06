export interface BucketItem {
  id?: string;
  name: string;
  description: string;
  category: string;
  priority: string;
  daysToTick: number;
  planningNote?: string;
  completed: boolean;
  isFavorite?: boolean;
  createdAt?: Date;
}
