import React from 'react';
import { ChefHat, Sparkles } from 'lucide-react';

interface HeroProps {
  onStartClick: () => void;
  showForm: boolean;
}

export const Hero: React.FC<HeroProps> = ({ onStartClick, showForm }) => {
  return (
    <div className="relative text-center max-w-3xl mx-auto pt-10 pb-8 px-4" id="hero-section">
      {/* Decorative Matcha Accent Circle */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-48 bg-matcha-light/30 rounded-full blur-3xl -z-10 pointer-events-none" />

      {/* Brand Badge */}
      <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-matcha-light/40 border border-matcha/40 rounded-full text-cherry-dark text-xs font-semibold tracking-wide uppercase mb-6 shadow-sm">
        <ChefHat className="w-3.5 h-3.5 text-cherry" />
        <span>Culinary Intelligence Engine</span>
      </div>

      {/* Title & Tagline */}
      <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-[#2C2B29] leading-tight mb-4">
        MealMate <span className="text-cherry">AI</span>
      </h1>
      <p className="font-display text-xl sm:text-2xl font-medium text-cherry-dark/80 tracking-wide mb-6">
        "Personalized Meals. Smarter Days."
      </p>

      {/* Narrative Intro */}
      <p className="text-gray-600 text-base sm:text-lg max-w-xl mx-auto leading-relaxed mb-8">
        Stop stressing over what to cook. Provide your available ingredients, budget, time, and goals, and let our culinary AI curate a custom, waste-free daily plan with tailored recipes and automatic groceries.
      </p>

      {!showForm && (
        <button
          onClick={onStartClick}
          id="btn-start-planner"
          className="group relative inline-flex items-center gap-2.5 bg-cherry hover:bg-cherry-dark text-white px-8 py-3.5 rounded-full font-semibold tracking-wide shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-cherry focus:ring-offset-2 active:scale-95"
        >
          <span>Curate My Custom Plan</span>
          <Sparkles className="w-4 h-4 text-matcha group-hover:rotate-12 transition-transform duration-300" />
        </button>
      )}
    </div>
  );
};
