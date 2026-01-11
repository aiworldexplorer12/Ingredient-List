
export interface Ingredient {
  item: string;
  amount: string;
  unit: string;
}

export interface Recipe {
  id: string;
  name: string;
  description: string;
  prepTime: string;
  cookTime: string;
  servings: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  ingredients: Ingredient[];
  instructions: string[];
  imageUrl?: string;
}

export interface AppState {
  currentRecipe: Recipe | null;
  history: Recipe[];
  isLoading: boolean;
  error: string | null;
}
