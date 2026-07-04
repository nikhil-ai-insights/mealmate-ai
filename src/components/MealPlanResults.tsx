import React, { useState } from 'react';
import { 
  Coffee, 
  Utensils, 
  Moon, 
  Apple, 
  Clock, 
  Scale, 
  TrendingUp, 
  Dumbbell, 
  DollarSign, 
  CheckSquare, 
  Square, 
  ArrowRight, 
  Shuffle, 
  Lightbulb, 
  Copy, 
  Printer, 
  Check, 
  ChevronDown, 
  ChevronUp,
  Flame,
  Info,
  FileDown,
  Loader2
} from 'lucide-react';
import { MealPlan, MealDetail } from '../types';
import { generateMealPlanPDF } from '../utils/pdfGenerator';

interface MealPlanResultsProps {
  plan: MealPlan;
  userName?: string;
}

export const MealPlanResults: React.FC<MealPlanResultsProps> = ({ plan, userName }) => {
  const [copied, setCopied] = useState(false);
  const [pdfLoading, setPdfLoading] = useState(false);
  const [pdfError, setPdfError] = useState<string | null>(null);
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});
  const [expandedMeal, setExpandedMeal] = useState<'breakfast' | 'lunch' | 'dinner' | 'snack' | null>('breakfast');

  const {
    breakfast,
    lunch,
    dinner,
    snack,
    nutritionSummary,
    groceryList,
    ingredientSubstitutions,
    budget,
    cookingTips
  } = plan;

  // Toggle item in grocery list
  const toggleGroceryItem = (key: string) => {
    setCheckedItems(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  // Copy entire meal plan as plain text formatted beautifully
  const handleCopy = async () => {
    try {
      const text = `
=== MEALMATE AI DAILY MEAL PLAN ===
"Personalized Meals. Smarter Days."

🍳 BREAKFAST: ${breakfast.name} (${breakfast.prepTime} | ${breakfast.calories} kcal)
- Description: ${breakfast.description}
- Ingredients: ${breakfast.ingredients.join(', ')}
- Instructions: ${breakfast.instructions.map((inst, i) => `${i + 1}. ${inst}`).join('\n  ')}

🥗 LUNCH: ${lunch.name} (${lunch.prepTime} | ${lunch.calories} kcal)
- Description: ${lunch.description}
- Ingredients: ${lunch.ingredients.join(', ')}
- Instructions: ${lunch.instructions.map((inst, i) => `${i + 1}. ${inst}`).join('\n  ')}

🍽️ DINNER: ${dinner.name} (${dinner.prepTime} | ${dinner.calories} kcal)
- Description: ${dinner.description}
- Ingredients: ${dinner.ingredients.join(', ')}
- Instructions: ${dinner.instructions.map((inst, i) => `${i + 1}. ${inst}`).join('\n  ')}

🍎 SNACK: ${snack.name} (${snack.prepTime} | ${snack.calories} kcal)
- Description: ${snack.description}
- Ingredients: ${snack.ingredients.join(', ')}

📊 NUTRITION SUMMARY:
- Total Calories: ${nutritionSummary.calories} kcal
- Protein: ${nutritionSummary.protein}
- Carbs: ${nutritionSummary.carbs}
- Fat: ${nutritionSummary.fat}
- Fiber: ${nutritionSummary.fiber}

💰 BUDGET FEASIBILITY (${budget.status}):
- Estimated Daily Cost: ${budget.estimatedDailyCost}
- Details: ${budget.explanation}

🛒 GROCERY SHOPPING LIST:
${groceryList.map(cat => `\n[${cat.category}]\n${cat.items.map(item => `• ${item.name} (${item.amount})`).join('\n')}`).join('\n')}

🔄 INGREDIENT SUBSTITUTIONS:
${ingredientSubstitutions.map(sub => `• Replace ${sub.original} with ${sub.substitute} (${sub.reason})`).join('\n')}

💡 CHEF'S COOKING TIPS:
${cookingTips.map((tip, i) => `${i + 1}. ${tip}`).join('\n')}

Generated beautifully by MealMate AI.
`;

      await navigator.clipboard.writeText(text.trim());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text", err);
    }
  };

  // Trigger print view which is optimized via CSS media rules
  const handlePrint = () => {
    window.print();
  };

  // Generate and download a beautifully styled PDF document
  const handleDownloadPDF = async () => {
    if (pdfLoading) return;
    setPdfLoading(true);
    setPdfError(null);
    try {
      await generateMealPlanPDF(plan, userName);
    } catch (err: any) {
      console.error("PDF generation failure:", err);
      setPdfError(err?.message || "An error occurred during PDF compiling. Please try printing instead.");
    } finally {
      setPdfLoading(false);
    }
  };

  const getMealIcon = (type: 'breakfast' | 'lunch' | 'dinner' | 'snack') => {
    switch (type) {
      case 'breakfast': return <Coffee className="w-5 h-5 text-cherry" />;
      case 'lunch': return <Utensils className="w-5 h-5 text-cherry" />;
      case 'dinner': return <Moon className="w-5 h-5 text-cherry" />;
      case 'snack': return <Apple className="w-5 h-5 text-cherry" />;
    }
  };

  const renderMealSection = (type: 'breakfast' | 'lunch' | 'dinner' | 'snack', meal: MealDetail, title: string) => {
    const isExpanded = expandedMeal === type;
    return (
      <div 
        id={`meal-card-${type}`}
        className="bg-white rounded-2xl border border-[#E5E4DE] shadow-sm overflow-hidden transition-all duration-300 hover:shadow-md"
      >
        {/* Accordion Header */}
        <button
          onClick={() => setExpandedMeal(isExpanded ? null : type)}
          aria-expanded={isExpanded}
          aria-controls={`meal-content-${type}`}
          className="w-full text-left p-5 flex items-center justify-between gap-4 cursor-pointer focus:outline-none"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-cherry-light/60 rounded-xl flex items-center justify-center">
              {getMealIcon(type)}
            </div>
            <div>
              <span className="text-xs font-bold text-cherry tracking-wide uppercase">{title}</span>
              <h4 className="font-display text-lg font-bold text-gray-900 mt-0.5">{meal.name}</h4>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Quick Stats badges hidden on mobile if narrow, but clean */}
            <div className="hidden sm:flex items-center gap-3">
              <span className="inline-flex items-center gap-1 text-xs text-gray-500 bg-gray-100 px-2.5 py-1 rounded-full">
                <Clock className="w-3.5 h-3.5" />
                <span>{meal.prepTime}</span>
              </span>
              <span className="inline-flex items-center gap-1 text-xs text-[#3C5B27] bg-matcha-light/40 px-2.5 py-1 rounded-full font-medium">
                <Flame className="w-3.5 h-3.5" />
                <span>{meal.calories} kcal</span>
              </span>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-gray-50 border border-gray-200">
                {meal.difficulty}
              </span>
            </div>

            {isExpanded ? (
              <ChevronUp className="w-5 h-5 text-gray-400" />
            ) : (
              <ChevronDown className="w-5 h-5 text-gray-400" />
            )}
          </div>
        </button>

        {/* Accordion Content */}
        {isExpanded && (
          <div id={`meal-content-${type}`} className="p-5 border-t border-gray-100 bg-gray-50/50 space-y-5 animate-fadeIn">
            {/* Mobile Stats row */}
            <div className="flex flex-wrap gap-2 sm:hidden border-b border-gray-100 pb-3">
              <span className="inline-flex items-center gap-1 text-xs text-gray-500 bg-gray-100 px-2.5 py-1 rounded-full">
                <Clock className="w-3.5 h-3.5" />
                <span>{meal.prepTime}</span>
              </span>
              <span className="inline-flex items-center gap-1 text-xs text-[#3C5B27] bg-matcha-light/40 px-2.5 py-1 rounded-full font-medium">
                <Flame className="w-3.5 h-3.5" />
                <span>{meal.calories} kcal</span>
              </span>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-gray-50 border border-gray-200">
                {meal.difficulty}
              </span>
            </div>

            {/* Description */}
            <p className="text-sm text-gray-600 leading-relaxed italic">
              {meal.description}
            </p>

            {/* Grid for Ingredients vs Instructions */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
              {/* Ingredients List */}
              <div className="md:col-span-2 space-y-3">
                <h5 className="text-xs font-extrabold uppercase tracking-wider text-gray-400">Ingredients needed:</h5>
                <ul className="space-y-2">
                  {meal.ingredients.map((ing, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                      <span className="inline-block w-1.5 h-1.5 rounded-full bg-cherry mt-1.5 flex-shrink-0" />
                      <span>{ing}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Steps/Instructions */}
              <div className="md:col-span-3 space-y-3 border-t md:border-t-0 md:border-l border-gray-100 pt-4 md:pt-0 md:pl-6">
                <h5 className="text-xs font-extrabold uppercase tracking-wider text-gray-400">Step-by-step preparation:</h5>
                <ol className="space-y-3">
                  {meal.instructions.map((inst, idx) => (
                    <li key={idx} className="flex gap-3 text-sm text-gray-700">
                      <span className="font-mono font-bold text-cherry-dark/60 bg-cherry-light/50 w-5 h-5 rounded-full flex items-center justify-center text-xs flex-shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <span className="leading-relaxed">{inst}</span>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto px-4 pb-16 print:p-0 print:m-0" id="meal-plan-results-container">
      
      {/* Header controls for Action/Export */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 pb-5 print:hidden">
        <div>
          <span className="text-xs font-bold text-[#3C5B27] tracking-wider uppercase bg-matcha-light/60 px-3 py-1 rounded-full">
            Plan Successfully Curated
          </span>
          <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-gray-900 mt-2">
            Your Daily Culinary Blueprint
          </h2>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Copy button */}
          <button
            onClick={handleCopy}
            id="btn-copy-plan"
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold bg-white hover:bg-gray-50 border border-gray-200 hover:border-gray-300 text-gray-700 rounded-xl transition shadow-sm active:scale-95 cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-[#3C5B27] animate-scaleIn" />
                <span className="text-[#3C5B27] font-bold">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 text-cherry" />
                <span>Copy Text Plan</span>
              </>
            )}
          </button>

          {/* Print button */}
          <button
            onClick={handlePrint}
            id="btn-print-plan"
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold bg-white hover:bg-gray-50 border border-gray-200 hover:border-gray-300 text-gray-700 rounded-xl transition shadow-sm active:scale-95 cursor-pointer"
          >
            <Printer className="w-4 h-4 text-cherry" />
            <span>Print Layout</span>
          </button>

          {/* Download PDF button */}
          <button
            onClick={handleDownloadPDF}
            id="btn-download-pdf"
            disabled={pdfLoading}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold bg-cherry hover:bg-cherry-dark disabled:bg-cherry/50 text-white rounded-xl transition shadow-sm active:scale-95 cursor-pointer"
          >
            {pdfLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-matcha" />
                <span>Compiling PDF...</span>
              </>
            ) : (
              <>
                <FileDown className="w-4 h-4 text-matcha" />
                <span>Download PDF File</span>
              </>
            )}
          </button>
        </div>
      </div>

      {pdfError && (
        <div className="p-3.5 bg-red-50 border border-red-200 text-xs text-red-600 rounded-xl flex items-center gap-2 print:hidden">
          <Info className="w-4 h-4 text-red-500" />
          <span>{pdfError}</span>
        </div>
      )}

      {/* Print-only brand header */}
      <div className="hidden print:block text-center border-b-2 border-cherry pb-6 mb-8">
        <h1 className="font-display text-4xl font-extrabold text-cherry">MealMate AI</h1>
        <p className="text-gray-500 italic mt-1">"Personalized Meals. Smarter Days."</p>
        <p className="text-xs text-gray-400 mt-2">Generated on: {new Date().toLocaleDateString()}</p>
      </div>

      {/* Primary Dashboard layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left column: Meal Cards Accordions */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="text-xs font-extrabold text-gray-400 uppercase tracking-widest pl-1">
            Recipes & Meals
          </h3>
          
          {renderMealSection('breakfast', breakfast, '🍳 Breakfast')}
          {renderMealSection('lunch', lunch, '🥗 Lunch')}
          {renderMealSection('dinner', dinner, '🍽️ Dinner')}
          {renderMealSection('snack', snack, '🍎 Snack Suggestion')}

          {/* Chef's Cooking tips section */}
          <div id="cooking-tips-card" className="bg-white rounded-2xl border border-[#E5E4DE] p-5 sm:p-6 shadow-sm space-y-4">
            <h4 className="font-display text-lg font-bold text-gray-900 flex items-center gap-2 border-b border-gray-100 pb-3">
              <Lightbulb className="w-5 h-5 text-cherry" />
              <span>Chef's Culinary Insights</span>
            </h4>
            <div className="space-y-3.5">
              {cookingTips.map((tip, idx) => (
                <div key={idx} className="flex gap-3 text-sm text-gray-600 leading-relaxed">
                  <span className="font-bold text-cherry-dark/60">•</span>
                  <span>{tip}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right column: Nutrition, Grocery, Budget, Substitution Cards */}
        <div className="space-y-6">
          
          {/* Nutrition summary Card */}
          <div id="nutrition-summary-card" className="bg-white rounded-2xl border border-[#E5E4DE] p-5 sm:p-6 shadow-sm space-y-4">
            <div className="flex justify-between items-center border-b border-gray-100 pb-3">
              <h4 className="font-display text-lg font-bold text-gray-900 flex items-center gap-2">
                <Scale className="w-5 h-5 text-cherry" />
                <span>Daily Macros Tracker</span>
              </h4>
              <span className="text-xs font-bold text-[#3C5B27] bg-matcha-light/50 px-2.5 py-1 rounded-full">
                {nutritionSummary.calories} kcal
              </span>
            </div>

            {/* Circular or linear progress metrics for protein, carbs, fat, fiber */}
            <div className="space-y-3.5">
              {/* Protein */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-semibold text-gray-600">
                  <span className="flex items-center gap-1.5">
                    <Dumbbell className="w-3.5 h-3.5 text-cherry/70" />
                    <span>Protein</span>
                  </span>
                  <span className="font-bold text-gray-900">{nutritionSummary.protein}</span>
                </div>
                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden p-0.5">
                  <div className="h-full bg-cherry rounded-full" style={{ width: '75%' }} />
                </div>
              </div>

              {/* Carbs */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-semibold text-gray-600">
                  <span className="flex items-center gap-1.5">
                    <TrendingUp className="w-3.5 h-3.5 text-cherry/70" />
                    <span>Carbs</span>
                  </span>
                  <span className="font-bold text-gray-900">{nutritionSummary.carbs}</span>
                </div>
                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden p-0.5">
                  <div className="h-full bg-matcha-dark rounded-full" style={{ width: '60%' }} />
                </div>
              </div>

              {/* Fat */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-semibold text-gray-600">
                  <span className="flex items-center gap-1.5">
                    <Scale className="w-3.5 h-3.5 text-cherry/70" />
                    <span>Dietary Fats</span>
                  </span>
                  <span className="font-bold text-gray-900">{nutritionSummary.fat}</span>
                </div>
                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden p-0.5">
                  <div className="h-full bg-[#E5B542] rounded-full" style={{ width: '45%' }} />
                </div>
              </div>

              {/* Fiber */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-semibold text-gray-600">
                  <span className="flex items-center gap-1.5">
                    <Apple className="w-3.5 h-3.5 text-cherry/70" />
                    <span>Fiber</span>
                  </span>
                  <span className="font-bold text-gray-900">{nutritionSummary.fiber}</span>
                </div>
                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden p-0.5">
                  <div className="h-full bg-emerald-600 rounded-full" style={{ width: '80%' }} />
                </div>
              </div>
            </div>
          </div>

          {/* Budget Feasibility Card */}
          <div id="budget-feasibility-card" className="bg-white rounded-2xl border border-[#E5E4DE] p-5 sm:p-6 shadow-sm space-y-4">
            <h4 className="font-display text-lg font-bold text-gray-900 flex items-center gap-2 border-b border-gray-100 pb-3">
              <DollarSign className="w-5 h-5 text-cherry" />
              <span>Budget Feasibility</span>
            </h4>
            <div className="flex justify-between items-center bg-gray-50 p-3 rounded-xl border border-gray-150">
              <div>
                <span className="text-[10px] uppercase font-extrabold text-gray-400 block tracking-wider">Estimated Cost</span>
                <span className="text-xl font-bold text-cherry">{budget.estimatedDailyCost} <span className="text-xs text-gray-500 font-normal">/ day</span></span>
              </div>
              <div className="text-right">
                <span className="text-[10px] uppercase font-extrabold text-gray-400 block tracking-wider">Status Match</span>
                <span className="inline-block text-xs font-bold text-[#3C5B27] bg-matcha-light/60 border border-matcha/50 px-2.5 py-1 rounded-full mt-0.5">
                  {budget.status}
                </span>
              </div>
            </div>
            <p className="text-xs text-gray-600 leading-relaxed bg-cherry-light/20 p-3 rounded-xl border border-cherry/10">
              {budget.explanation}
            </p>
          </div>

          {/* Grocery Shopping List Card */}
          <div id="grocery-list-card" className="bg-white rounded-2xl border border-[#E5E4DE] p-5 sm:p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h4 className="font-display text-lg font-bold text-gray-900 flex items-center gap-2">
                <CheckSquare className="w-5 h-5 text-cherry" />
                <span>Shopping Grocery List</span>
              </h4>
              <span className="text-[10px] bg-gray-100 text-gray-500 px-2 py-0.5 rounded font-bold uppercase">
                Interactive
              </span>
            </div>

            <div className="space-y-4 max-h-96 overflow-y-auto pr-1">
              {groceryList.map((cat, catIdx) => (
                <div key={catIdx} className="space-y-1.5">
                  <h5 className="text-[10px] uppercase font-extrabold tracking-wider text-cherry-dark/60 bg-cherry-light/30 px-2.5 py-1 rounded-md">
                    {cat.category}
                  </h5>
                  <div className="space-y-1">
                    {cat.items.map((item, itemIdx) => {
                      const itemKey = `${catIdx}-${itemIdx}`;
                      const isChecked = !!checkedItems[itemKey];

                      return (
                        <button
                          key={itemIdx}
                          onClick={() => toggleGroceryItem(itemKey)}
                          className="w-full text-left flex items-center gap-2.5 px-2 py-1.5 rounded-lg hover:bg-gray-50 transition cursor-pointer text-xs sm:text-sm focus:outline-none"
                        >
                          {isChecked ? (
                            <CheckSquare className="w-4 h-4 text-[#3C5B27] flex-shrink-0" />
                          ) : (
                            <Square className="w-4 h-4 text-gray-300 flex-shrink-0" />
                          )}
                          <span className={`flex-1 ${isChecked ? 'line-through text-gray-400' : 'text-gray-700 font-medium'}`}>
                            {item.name}
                          </span>
                          <span className={`text-[11px] px-1.5 py-0.5 rounded ${isChecked ? 'bg-gray-100 text-gray-300' : 'bg-gray-100 text-gray-500 font-mono'}`}>
                            {item.amount}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
            <p className="text-[11px] text-gray-400 text-center italic mt-2">
              Tip: Click ingredients above to check them off as you shop.
            </p>
          </div>

          {/* Ingredient Substitutions Card */}
          {ingredientSubstitutions && ingredientSubstitutions.length > 0 && (
            <div id="substitution-card" className="bg-white rounded-2xl border border-[#E5E4DE] p-5 sm:p-6 shadow-sm space-y-4">
              <h4 className="font-display text-lg font-bold text-gray-900 flex items-center gap-2 border-b border-gray-100 pb-3">
                <Shuffle className="w-5 h-5 text-cherry" />
                <span>Smart Substitutions</span>
              </h4>
              <div className="space-y-3">
                {ingredientSubstitutions.map((sub, idx) => (
                  <div 
                    key={idx}
                    className="p-3 bg-[#FAF9F5] rounded-xl border border-gray-150 space-y-1.5 text-xs"
                  >
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold text-gray-500 line-through">{sub.original}</span>
                      <ArrowRight className="w-3.5 h-3.5 text-cherry" />
                      <span className="font-bold text-[#3C5B27] bg-matcha-light/40 px-2.5 py-0.5 rounded-full">
                        {sub.substitute}
                      </span>
                    </div>
                    <p className="text-gray-600 leading-relaxed">
                      {sub.reason}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
