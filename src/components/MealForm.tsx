import React, { useState } from 'react';
import { 
  User, 
  Sparkles, 
  AlertTriangle, 
  Clock, 
  DollarSign, 
  ChefHat, 
  Flame, 
  Apple, 
  Plus, 
  X, 
  RotateCcw 
} from 'lucide-react';
import { MealPlannerInputs } from '../types';

// Preset lists for user convenience
const PRESET_INGREDIENTS = [
  'Tomato', 'Onion', 'Potato', 'Spinach', 'Paneer', 
  'Chicken Breast', 'Eggs', 'Rice', 'Pasta', 'Oats', 
  'Milk', 'Bread', 'Avocado', 'Tofu', 'Yogurt', 
  'Lentils', 'Garlic', 'Lemon', 'Cheese', 'Mushrooms'
];

interface MealFormProps {
  onSubmit: (data: MealPlannerInputs) => void;
  isLoading: boolean;
}

export const MealForm: React.FC<MealFormProps> = ({ onSubmit, isLoading }) => {
  // Local states for form values
  const [name, setName] = useState('');
  const [dietPreference, setDietPreference] = useState<MealPlannerInputs['dietPreference']>('Vegetarian');
  const [foodGoal, setFoodGoal] = useState<MealPlannerInputs['foodGoal']>('Balanced');
  const [budget, setBudget] = useState<MealPlannerInputs['budget']>('Medium');
  const [cookingTime, setCookingTime] = useState<MealPlannerInputs['cookingTime']>('20 Minutes');
  const [availableIngredients, setAvailableIngredients] = useState<string[]>([]);
  const [cuisinePreference, setCuisinePreference] = useState<MealPlannerInputs['cuisinePreference']>('Healthy');
  const [allergies, setAllergies] = useState('');
  
  // Custom ingredient state
  const [customIngredient, setCustomIngredient] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Handle adding custom ingredient
  const handleAddCustomIngredient = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const item = customIngredient.trim();
    if (!item) return;
    
    // Max size constraint
    if (availableIngredients.length >= 20) {
      setErrorMsg("Maximum of 20 ingredients allowed.");
      return;
    }

    if (!availableIngredients.includes(item)) {
      setAvailableIngredients([...availableIngredients, item]);
    }
    setCustomIngredient('');
    setErrorMsg('');
  };

  // Toggle standard preset ingredients
  const togglePresetIngredient = (ing: string) => {
    if (availableIngredients.includes(ing)) {
      setAvailableIngredients(availableIngredients.filter(x => x !== ing));
    } else {
      if (availableIngredients.length >= 20) {
        setErrorMsg("Maximum of 20 ingredients allowed.");
        return;
      }
      setAvailableIngredients([...availableIngredients, ing]);
      setErrorMsg('');
    }
  };

  // Reset form
  const handleReset = () => {
    setName('');
    setDietPreference('Vegetarian');
    setFoodGoal('Balanced');
    setBudget('Medium');
    setCookingTime('20 Minutes');
    setAvailableIngredients([]);
    setCuisinePreference('Healthy');
    setAllergies('');
    setCustomIngredient('');
    setErrorMsg('');
  };

  // Form submission validation
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Inputs are standard enum structures, so we directly bundle them
    const payload: MealPlannerInputs = {
      name: name.trim() || undefined,
      dietPreference,
      foodGoal,
      budget,
      cookingTime,
      availableIngredients,
      cuisinePreference,
      allergies: allergies.trim() || undefined
    };

    onSubmit(payload);
  };

  return (
    <form 
      onSubmit={handleSubmit} 
      id="meal-planner-form"
      className="bg-white rounded-3xl border border-[#E5E4DE] shadow-xl p-6 sm:p-8 max-w-4xl mx-auto my-8 space-y-8 relative overflow-hidden"
    >
      {/* Visual Accent */}
      <div className="absolute top-0 left-0 right-0 h-1.5 bg-matcha" />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-5">
        <div>
          <h2 className="font-display text-2xl font-bold text-gray-900 flex items-center gap-2">
            <ChefHat className="w-6 h-6 text-cherry" />
            <span>Customize Your Daily Meal Blueprint</span>
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Specify your preferences. Our AI will coordinate balanced recipes instantly.
          </p>
        </div>
        
        <button
          type="button"
          onClick={handleReset}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-gray-600 hover:text-cherry bg-gray-100 hover:bg-cherry-light/40 rounded-full transition-all duration-200"
          title="Reset all inputs"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Form</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Name Field */}
        <div className="space-y-2">
          <label htmlFor="user-name" className="block text-sm font-semibold text-gray-800 flex items-center gap-2">
            <User className="w-4 h-4 text-cherry/70" />
            <span>Your Name <span className="text-gray-400 font-normal">(Optional)</span></span>
          </label>
          <input
            type="text"
            id="user-name"
            value={name}
            onChange={(e) => setName(e.target.value.slice(0, 50))}
            placeholder="e.g., Alex"
            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cherry focus:bg-white transition-all text-sm"
          />
        </div>

        {/* Cuisine Preference */}
        <div className="space-y-2">
          <label htmlFor="cuisine-preference" className="block text-sm font-semibold text-gray-800 flex items-center gap-2">
            <ChefHat className="w-4 h-4 text-cherry/70" />
            <span>Cuisine Preference</span>
          </label>
          <select
            id="cuisine-preference"
            value={cuisinePreference}
            onChange={(e) => setCuisinePreference(e.target.value as MealPlannerInputs['cuisinePreference'])}
            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-cherry focus:bg-white transition-all text-sm"
          >
            <option value="Healthy">Healthy & Clean</option>
            <option value="Indian">Indian Cuisine</option>
            <option value="Italian">Italian Cuisine</option>
            <option value="Chinese">Chinese Cuisine</option>
            <option value="Mexican">Mexican Cuisine</option>
            <option value="Other">Other Flavor profiles</option>
          </select>
        </div>

        {/* Diet Preference */}
        <div className="col-span-1 md:col-span-2 space-y-3">
          <span className="block text-sm font-semibold text-gray-800 flex items-center gap-2">
            <Apple className="w-4 h-4 text-cherry/70" />
            <span>Diet Preference</span>
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {(['Vegetarian', 'Vegan', 'Eggetarian', 'Non-Vegetarian'] as const).map((pref) => (
              <button
                key={pref}
                type="button"
                onClick={() => setDietPreference(pref)}
                className={`py-3 px-4 rounded-xl text-xs sm:text-sm font-semibold text-center transition-all duration-200 border cursor-pointer ${
                  dietPreference === pref
                    ? 'bg-cherry border-cherry text-white shadow-md scale-[1.01]'
                    : 'bg-gray-50 hover:bg-gray-100 border-gray-200 text-gray-700 hover:text-gray-900'
                }`}
              >
                {pref}
              </button>
            ))}
          </div>
        </div>

        {/* Food Goal */}
        <div className="col-span-1 md:col-span-2 space-y-3">
          <span className="block text-sm font-semibold text-gray-800 flex items-center gap-2">
            <Flame className="w-4 h-4 text-cherry/70" />
            <span>Food Goal</span>
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {(['Weight Loss', 'Weight Gain', 'Muscle Gain', 'Balanced'] as const).map((goal) => (
              <button
                key={goal}
                type="button"
                onClick={() => setFoodGoal(goal)}
                className={`py-3 px-4 rounded-xl text-xs sm:text-sm font-semibold text-center transition-all duration-200 border cursor-pointer ${
                  foodGoal === goal
                    ? 'bg-cherry border-cherry text-white shadow-md scale-[1.01]'
                    : 'bg-gray-50 hover:bg-gray-100 border-gray-200 text-gray-700 hover:text-gray-900'
                }`}
              >
                {goal}
              </button>
            ))}
          </div>
        </div>

        {/* Budget tier */}
        <div className="space-y-3">
          <span className="block text-sm font-semibold text-gray-800 flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-cherry/70" />
            <span>Daily Budget Tier</span>
          </span>
          <div className="grid grid-cols-3 gap-2">
            {(['Low', 'Medium', 'High'] as const).map((b) => (
              <button
                key={b}
                type="button"
                onClick={() => setBudget(b)}
                className={`py-2.5 rounded-xl text-xs font-semibold text-center transition-all duration-200 border cursor-pointer ${
                  budget === b
                    ? 'bg-cherry border-cherry text-white shadow-sm'
                    : 'bg-gray-50 hover:bg-gray-100 border-gray-200 text-gray-700 hover:text-gray-900'
                }`}
              >
                {b === 'Low' ? 'Low ($)' : b === 'Medium' ? 'Med ($$)' : 'High ($$$)'}
              </button>
            ))}
          </div>
        </div>

        {/* Cooking Time constraint */}
        <div className="space-y-3">
          <span className="block text-sm font-semibold text-gray-800 flex items-center gap-2">
            <Clock className="w-4 h-4 text-cherry/70" />
            <span>Max Cooking Time</span>
          </span>
          <div className="grid grid-cols-4 gap-2">
            {(['10 Minutes', '20 Minutes', '30 Minutes', '45+ Minutes'] as const).map((time) => (
              <button
                key={time}
                type="button"
                onClick={() => setCookingTime(time)}
                className={`py-2.5 px-1 rounded-xl text-[11px] sm:text-xs font-semibold text-center transition-all duration-200 border cursor-pointer ${
                  cookingTime === time
                    ? 'bg-cherry border-cherry text-white shadow-sm'
                    : 'bg-gray-50 hover:bg-gray-100 border-gray-200 text-gray-700 hover:text-gray-900'
                }`}
              >
                {time}
              </button>
            ))}
          </div>
        </div>

        {/* Available Ingredients - Multi-select and Add custom */}
        <div className="col-span-1 md:col-span-2 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <label className="block text-sm font-semibold text-gray-800 flex items-center gap-2">
              <ChefHat className="w-4 h-4 text-cherry/70" />
              <span>Pantry Ingredients Available <span className="text-gray-400 font-normal">({availableIngredients.length}/20 selected)</span></span>
            </label>
            <span className="text-xs text-gray-500">Helps AI minimize ingredient waste!</span>
          </div>

          {/* Quick preset chips */}
          <div className="bg-gray-50 p-4 rounded-2xl border border-gray-200 space-y-4">
            <div>
              <span className="text-[11px] uppercase tracking-wider font-bold text-gray-400 block mb-2">Standard Presets:</span>
              <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto pr-1">
                {PRESET_INGREDIENTS.map((ing) => {
                  const isSelected = availableIngredients.includes(ing);
                  return (
                    <button
                      key={ing}
                      type="button"
                      onClick={() => togglePresetIngredient(ing)}
                      className={`text-xs px-2.5 py-1.5 rounded-full border transition-all duration-150 cursor-pointer ${
                        isSelected
                          ? 'bg-matcha-dark/30 border-matcha-dark text-[#3C5B27] font-semibold'
                          : 'bg-white hover:bg-gray-100 border-gray-200 text-gray-600'
                      }`}
                    >
                      {isSelected ? '✓ ' : ''}{ing}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Custom ingredient adder */}
            <div className="flex gap-2">
              <input
                type="text"
                value={customIngredient}
                onChange={(e) => setCustomIngredient(e.target.value.slice(0, 30))}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddCustomIngredient();
                  }
                }}
                placeholder="Add other ingredient (e.g., Salmon, Coconut milk)..."
                className="flex-1 px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs sm:text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cherry"
              />
              <button
                type="button"
                onClick={() => handleAddCustomIngredient()}
                className="px-3.5 bg-cherry hover:bg-cherry-dark text-white rounded-xl flex items-center justify-center transition-colors cursor-pointer"
                title="Add Custom Ingredient"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Display of currently selected ingredients */}
          {availableIngredients.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-1">
              {availableIngredients.map((ing) => (
                <span
                  key={ing}
                  className="inline-flex items-center gap-1 bg-cherry-light text-cherry-dark font-medium text-xs px-2.5 py-1 rounded-full border border-cherry/20"
                >
                  <span>{ing}</span>
                  <button
                    type="button"
                    onClick={() => setAvailableIngredients(availableIngredients.filter(x => x !== ing))}
                    className="p-0.5 hover:bg-cherry/10 rounded-full text-cherry cursor-pointer"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Allergies / Strict Avoidance */}
        <div className="col-span-1 md:col-span-2 space-y-2">
          <label htmlFor="allergies-input" className="block text-sm font-semibold text-gray-800 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-cherry/70" />
            <span>Allergies & Strict Avoidance <span className="text-gray-400 font-normal">(Optional)</span></span>
          </label>
          <input
            type="text"
            id="allergies-input"
            value={allergies}
            onChange={(e) => setAllergies(e.target.value.slice(0, 200))}
            placeholder="e.g., Peanuts, dairy, shellfish, gluten..."
            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cherry focus:bg-white transition-all text-sm"
          />
          <p className="text-xs text-gray-500">
            Our AI will strictly bypass these ingredients and recommend alternative combinations.
          </p>
        </div>
      </div>

      {errorMsg && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-600 font-semibold flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-red-500" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Submit button */}
      <div className="pt-4 border-t border-gray-100 flex justify-end">
        <button
          type="submit"
          id="btn-submit-planner"
          disabled={isLoading}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-cherry hover:bg-cherry-dark disabled:bg-cherry/50 text-white font-semibold px-8 py-3.5 rounded-xl shadow-md hover:shadow-lg transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-cherry focus:ring-offset-2 active:scale-95"
        >
          <span>Curate Custom Meal Plan</span>
          <Sparkles className="w-4 h-4 text-matcha" />
        </button>
      </div>
    </form>
  );
};
