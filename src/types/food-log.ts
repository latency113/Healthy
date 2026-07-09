export interface FoodLog {
  id: string;
  foodName: string;
  calories: number;
  protein: number;
  fat: number;
  carbs: number;
  imageUrl?: string;
  loggedAt: string;
}
