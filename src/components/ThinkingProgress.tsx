import React, { useState, useEffect } from 'react';
import { Loader2, CheckCircle2, CookingPot, Utensils } from 'lucide-react';

const PROGRESS_PHASES = [
  "Analyzing Preferences...",
  "Checking Nutrition Balance...",
  "Selecting Ingredients...",
  "Optimizing Budget...",
  "Building Grocery List...",
  "Preparing Personalized Meal Plan..."
];

const FUN_QUOTES = [
  "Integrating seasonal herbs to elevate flavor depth...",
  "Balancing macro percentages for sustained energy release...",
  "Cross-referencing available ingredients with budget models...",
  "Calculating portion structures to minimize waste indices...",
  "Translating complex nutritional objectives into tasty steps...",
  "Polishing your customized, chef-grade daily recipe kit..."
];

interface ThinkingProgressProps {
  onComplete: () => void;
  apiFinished: boolean;
}

export const ThinkingProgress: React.FC<ThinkingProgressProps> = ({ onComplete, apiFinished }) => {
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    // If we haven't reached the end, step forward every 1.6 seconds.
    if (currentStep < PROGRESS_PHASES.length - 1) {
      const timer = setTimeout(() => {
        setCurrentStep((prev) => prev + 1);
      }, 1600);
      return () => clearTimeout(timer);
    } else if (currentStep === PROGRESS_PHASES.length - 1 && apiFinished) {
      // If we are on the last step, and the API has finished loading, trigger completion!
      const timer = setTimeout(() => {
        onComplete();
      }, 1400);
      return () => clearTimeout(timer);
    }
  }, [currentStep, apiFinished, onComplete]);

  // Calculate percentage
  const percentComplete = Math.round(((currentStep + 1) / PROGRESS_PHASES.length) * 100);

  return (
    <div 
      id="thinking-progress-container"
      className="max-w-xl mx-auto my-12 p-8 bg-white rounded-3xl border border-[#E5E4DE] shadow-xl text-center space-y-8 relative overflow-hidden"
    >
      {/* Pulse Matcha backdrop glow */}
      <div className="absolute -top-12 -left-12 w-40 h-40 bg-matcha-light/30 rounded-full blur-2xl pointer-events-none animate-pulse" />
      <div className="absolute -bottom-12 -right-12 w-40 h-40 bg-cherry-light/30 rounded-full blur-2xl pointer-events-none animate-pulse" />

      {/* Header icon block */}
      <div className="relative inline-flex items-center justify-center bg-matcha-light text-cherry-dark p-4 rounded-2xl shadow-inner">
        <CookingPot className="w-10 h-10 animate-bounce text-cherry" />
        <Utensils className="w-4 h-4 text-cherry absolute bottom-2 right-2 animate-pulse" />
      </div>

      <div className="space-y-2">
        <h3 className="font-display text-2xl font-bold text-gray-900 tracking-tight">
          Curating Your Daily Blueprint
        </h3>
        <p className="text-sm text-gray-500 max-w-sm mx-auto">
          Our culinary intelligence engine is crafting recipes and budgets customized just for you.
        </p>
      </div>

      {/* Linear progress bar */}
      <div className="space-y-1.5 max-w-sm mx-auto">
        <div className="flex justify-between text-xs font-bold text-gray-400 uppercase tracking-wider">
          <span>Progress</span>
          <span>{percentComplete}%</span>
        </div>
        <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden p-0.5 border border-gray-200">
          <div 
            className="h-full bg-cherry rounded-full transition-all duration-1000 ease-out"
            style={{ width: `${percentComplete}%` }}
          />
        </div>
      </div>

      {/* Checklist items */}
      <div className="max-w-md mx-auto text-left space-y-3 bg-gray-50 p-5 rounded-2xl border border-gray-100 shadow-inner">
        {PROGRESS_PHASES.map((phase, idx) => {
          const isDone = idx < currentStep;
          const isCurrent = idx === currentStep;
          const isFuture = idx > currentStep;

          return (
            <div 
              key={phase}
              className={`flex items-center justify-between transition-all duration-300 ${
                isDone 
                  ? 'text-[#3C5B27] font-medium' 
                  : isCurrent 
                    ? 'text-cherry font-semibold scale-[1.01]' 
                    : 'text-gray-400'
              }`}
            >
              <div className="flex items-center gap-3">
                {isDone ? (
                  <CheckCircle2 className="w-5 h-5 text-matcha-dark fill-matcha/30 flex-shrink-0" />
                ) : isCurrent ? (
                  <Loader2 className="w-5 h-5 text-cherry animate-spin flex-shrink-0" />
                ) : (
                  <div className="w-5 h-5 rounded-full border-2 border-gray-200 flex-shrink-0" />
                )}
                <span className="text-sm sm:text-base">{phase}</span>
              </div>
              
              {isDone && (
                <span className="text-[10px] bg-matcha-light text-[#3C5B27] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                  Success
                </span>
              )}
            </div>
          );
        })}
      </div>

      {/* Micro quote ticker */}
      <div className="h-10 flex items-center justify-center px-4">
        <p className="text-xs text-gray-400 italic animate-pulse">
          {FUN_QUOTES[currentStep]}
        </p>
      </div>
    </div>
  );
};
