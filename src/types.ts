export interface MealPlannerInputs {
  name?: string;
  dietPreference: 'Vegetarian' | 'Vegan' | 'Eggetarian' | 'Non-Vegetarian';
  foodGoal: 'Weight Loss' | 'Weight Gain' | 'Muscle Gain' | 'Balanced';
  budget: 'Low' | 'Medium' | 'High';
  cookingTime: '10 Minutes' | '20 Minutes' | '30 Minutes' | '45+ Minutes';
  availableIngredients: string[];
  cuisinePreference: 'Indian' | 'Italian' | 'Chinese' | 'Mexican' | 'Healthy' | 'Other';
  allergies?: string;
}

export interface MealDetail {
  name: string;
  description: string;
  prepTime: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  calories: number;
  ingredients: string[];
  instructions: string[];
}

export interface GroceryItem {
  name: string;
  amount: string;
}

export interface GroceryCategory {
  category: string;
  items: GroceryItem[];
}

export interface Substitution {
  original: string;
  substitute: string;
  reason: string;
}

export interface BudgetSummary {
  estimatedDailyCost: string;
  status: string;
  explanation: string;
}

export interface NutritionDetail {
  calories: number;
  protein: string;
  carbs: string;
  fat: string;
  fiber: string;
}

export interface MealPlan {
  breakfast: MealDetail;
  lunch: MealDetail;
  dinner: MealDetail;
  snack: MealDetail;
  nutritionSummary: NutritionDetail;
  groceryList: GroceryCategory[];
  ingredientSubstitutions: Substitution[];
  budget: BudgetSummary;
  cookingTips: string[];
}
