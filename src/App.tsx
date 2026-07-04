import { useState } from 'react';
import { 
  Sparkles, 
  ChefHat, 
  AlertTriangle, 
  ArrowLeft, 
  RotateCcw,
  BookOpen,
  ShoppingBag,
  ExternalLink
} from 'lucide-react';
import { Hero } from './components/Hero';
import { MealForm } from './components/MealForm';
import { ThinkingProgress } from './components/ThinkingProgress';
import { MealPlanResults } from './components/MealPlanResults';
import { MealPlannerInputs, MealPlan } from './types';

export default function App() {
  const [showForm, setShowForm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [apiFinished, setApiFinished] = useState(false);
  const [showResults, setShowResults] = useState(false);
  
  // Results & Errors
  const [mealPlan, setMealPlan] = useState<MealPlan | null>(null);
  const [errorState, setErrorState] = useState<{ title: string; message: string; isConfigError?: boolean } | null>(null);
  const [userName, setUserName] = useState<string | undefined>(undefined);

  // Triggered when form is submitted
  const handleFormSubmit = async (inputs: MealPlannerInputs) => {
    setUserName(inputs.name);
    setIsLoading(true);
    setApiFinished(false);
    setShowResults(false);
    setErrorState(null);
    setMealPlan(null);

    try {
      const response = await fetch('/api/generate-meal-plan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(inputs),
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.error === "API Key Unconfigured") {
          throw new Error("CONFIG_ERROR||" + (data.message || "Missing GEMINI_API_KEY environment variable."));
        } else {
          throw new Error(data.message || data.error || "Failed to generate meal plan from server.");
        }
      }

      setMealPlan(data);
      setApiFinished(true);
    } catch (err: any) {
      console.error("Meal planner generation error:", err);
      const isConfig = err.message?.startsWith("CONFIG_ERROR||");
      const cleanMessage = isConfig ? err.message.replace("CONFIG_ERROR||", "") : err.message || "Something went wrong.";
      
      setErrorState({
        title: isConfig ? "API Key Configuration Required" : "Generation Interrupted",
        message: cleanMessage,
        isConfigError: isConfig
      });
      setIsLoading(false);
    }
  };

  // Triggered when thinking animation reaches 100% AND API has successfully finished
  const handleProgressComplete = () => {
    setIsLoading(false);
    setShowResults(true);
  };

  // Clear states and go back to start
  const handleReset = () => {
    setShowForm(false);
    setIsLoading(false);
    setApiFinished(false);
    setShowResults(false);
    setMealPlan(null);
    setErrorState(null);
  };

  return (
    <div className="min-h-screen flex flex-col justify-between" id="app-container">
      
      {/* Header Bar */}
      <header className="bg-white/80 backdrop-blur-md border-b border-[#E5E4DE] sticky top-0 z-40 px-4 py-3 print:hidden" id="main-header">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <button 
            onClick={handleReset}
            className="flex items-center gap-2 text-gray-900 font-display font-bold text-lg hover:text-cherry transition focus:outline-none cursor-pointer"
          >
            <div className="w-8 h-8 bg-cherry rounded-lg flex items-center justify-center shadow-sm">
              <ChefHat className="w-5 h-5 text-matcha" />
            </div>
            <span className="tracking-tight">MealMate <span className="text-cherry">AI</span></span>
          </button>

          <div className="flex items-center gap-4">
            <span className="hidden sm:inline-flex items-center gap-1.5 text-xs text-gray-500 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>AI Core Connected</span>
            </span>

            {showResults && (
              <button
                onClick={handleReset}
                className="inline-flex items-center gap-1 text-xs font-bold text-cherry bg-cherry-light hover:bg-cherry-light/80 px-3.5 py-1.5 rounded-full transition cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Plan Another</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-grow max-w-6xl w-full mx-auto px-4 py-6">
        
        {/* LANDING / HERO STEP */}
        {!showForm && !isLoading && !showResults && !errorState && (
          <div className="space-y-10 py-8 animate-fadeIn">
            <Hero 
              onStartClick={() => setShowForm(true)} 
              showForm={showForm} 
            />

            {/* Premium Mini-Bento value propositions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              {/* Card 1 */}
              <div className="bg-white p-6 rounded-2xl border border-[#E5E4DE] shadow-sm space-y-3 hover:translate-y-[-2px] transition-all">
                <div className="w-10 h-10 bg-matcha-light/60 rounded-xl flex items-center justify-center text-cherry font-bold">
                  <ChefHat className="w-5 h-5" />
                </div>
                <h3 className="font-display font-bold text-lg text-gray-900">100% Curated For You</h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Diet preferences (Vegan, Eggetarian, etc.) and strict food goals (Weight Loss, Gain, Balanced) are dynamically aligned in real-time.
                </p>
              </div>

              {/* Card 2 */}
              <div className="bg-white p-6 rounded-2xl border border-[#E5E4DE] shadow-sm space-y-3 hover:translate-y-[-2px] transition-all">
                <div className="w-10 h-10 bg-matcha-light/60 rounded-xl flex items-center justify-center text-cherry font-bold">
                  <ShoppingBag className="w-5 h-5" />
                </div>
                <h3 className="font-display font-bold text-lg text-gray-900">Zero-Waste Grocery</h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Provide your available ingredients. Our engine maps grocery categories and smart substitutions to prevent duplicate shopping.
                </p>
              </div>

              {/* Card 3 */}
              <div className="bg-white p-6 rounded-2xl border border-[#E5E4DE] shadow-sm space-y-3 hover:translate-y-[-2px] transition-all">
                <div className="w-10 h-10 bg-matcha-light/60 rounded-xl flex items-center justify-center text-cherry font-bold">
                  <BookOpen className="w-5 h-5" />
                </div>
                <h3 className="font-display font-bold text-lg text-gray-900">Budget Precision</h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Set Low, Medium or High budget tiers. The intelligence engine maps ingredients & feasibility indices directly to your selection.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* FORM STEP */}
        {showForm && !isLoading && !showResults && !errorState && (
          <div className="space-y-4 animate-slideUp">
            <button
              onClick={() => setShowForm(false)}
              className="inline-flex items-center gap-1 text-sm font-semibold text-gray-500 hover:text-cherry transition mb-2 cursor-pointer focus:outline-none"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to home</span>
            </button>
            <MealForm onSubmit={handleFormSubmit} isLoading={isLoading} />
          </div>
        )}

        {/* LOADING PROGRESS STEP */}
        {isLoading && !showResults && !errorState && (
          <ThinkingProgress 
            onComplete={handleProgressComplete} 
            apiFinished={apiFinished} 
          />
        )}

        {/* RESULTS STEP */}
        {showResults && mealPlan && (
          <div className="animate-slideUp">
            <MealPlanResults plan={mealPlan} userName={userName} />
          </div>
        )}

        {/* ERROR / EXCEPTION HANDLING SCREEN */}
        {errorState && (
          <div 
            id="error-state-card"
            className="max-w-xl mx-auto my-12 p-8 bg-white rounded-3xl border border-red-200 shadow-xl text-center space-y-6"
          >
            <div className="inline-flex items-center justify-center bg-red-50 text-red-600 p-4 rounded-full">
              <AlertTriangle className="w-12 h-12" />
            </div>

            <div className="space-y-2">
              <h3 className="font-display text-2xl font-bold text-gray-900">
                {errorState.title}
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                {errorState.message}
              </p>
            </div>

            {errorState.isConfigError ? (
              <div className="bg-gray-50 p-4 rounded-xl text-left text-xs text-gray-600 border border-gray-150 space-y-2">
                <span className="font-bold text-gray-900 block uppercase">How to resolve:</span>
                <ol className="list-decimal list-inside space-y-1">
                  <li>Locate the <strong>Secrets Panel</strong> in the Google AI Studio settings.</li>
                  <li>Add a new secret key named <strong>GEMINI_API_KEY</strong>.</li>
                  <li>Paste your valid Google Gemini API key.</li>
                  <li>Click Save and then retry your meal curation!</li>
                </ol>
                <a 
                  href="https://aistudio.google.com/app/apikey" 
                  target="_blank" 
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-cherry hover:underline font-semibold mt-1"
                >
                  <span>Get API Key from Google AI Studio</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            ) : (
              <p className="text-xs text-gray-500">
                This might be due to an temporary internet issue, model rate limits or safety filter flags in response to certain keywords.
              </p>
            )}

            <div className="pt-4 flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={() => {
                  setErrorState(null);
                  setIsLoading(false);
                  setShowForm(true);
                }}
                className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl transition cursor-pointer"
              >
                Modify Preferences
              </button>
              <button
                onClick={handleReset}
                className="px-6 py-3 bg-cherry hover:bg-cherry-dark text-white font-semibold rounded-xl shadow-md transition cursor-pointer"
              >
                Reset to Start
              </button>
            </div>
          </div>
        )}

      </main>

      {/* Footer bar */}
      <footer className="border-t border-[#E5E4DE] bg-white py-6 px-4 mt-12 print:hidden" id="main-footer">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <ChefHat className="w-4 h-4 text-cherry" />
            <span className="text-xs text-gray-500 font-medium">
              &copy; {new Date().getFullYear()} MealMate AI. Made for smarter daily nutrition.
            </span>
          </div>

          <div className="flex gap-4">
            <span className="text-xs text-[#3C5B27] bg-matcha-light/40 px-2.5 py-1 rounded-full font-bold">
              Cherry Accent & Matcha Canvas
            </span>
            <span className="text-xs text-gray-400 font-mono">
              Vite &bull; React &bull; Gemini-3.5-Flash
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
