import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

// Simple HTML/Script tag escaping helper
function escapeString(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;")
    .replace(/\//g, "&#x2F;");
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Lazy initialization of Gemini Client
  let aiClient: GoogleGenAI | null = null;
  function getGeminiClient(): GoogleGenAI {
    if (!aiClient) {
      const key = process.env.GEMINI_API_KEY;
      if (!key) {
        throw new Error("GEMINI_API_KEY environment variable is required. Please add it via the Secrets panel in AI Studio settings.");
      }
      aiClient = new GoogleGenAI({
        apiKey: key,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          }
        }
      });
    }
    return aiClient;
  }

  // Health endpoint
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // Meal Plan generator endpoint
  app.post("/api/generate-meal-plan", async (req: express.Request, res: express.Response) => {
    try {
      const {
        name,
        dietPreference,
        foodGoal,
        budget,
        cookingTime,
        availableIngredients = [],
        cuisinePreference,
        allergies
      } = req.body;

      // ---- Robust Input Validation & Sanitization ----
      const sanitizedName = name ? escapeString(String(name).trim().slice(0, 100)) : "";
      const sanitizedAllergies = allergies ? escapeString(String(allergies).trim().slice(0, 500)) : "";

      const allowedDiets = ['Vegetarian', 'Vegan', 'Eggetarian', 'Non-Vegetarian'];
      if (!dietPreference || !allowedDiets.includes(dietPreference)) {
        return res.status(400).json({ error: "Invalid or missing Diet Preference selection." });
      }

      const allowedGoals = ['Weight Loss', 'Weight Gain', 'Muscle Gain', 'Balanced'];
      if (!foodGoal || !allowedGoals.includes(foodGoal)) {
        return res.status(400).json({ error: "Invalid or missing Food Goal selection." });
      }

      const allowedBudgets = ['Low', 'Medium', 'High'];
      if (!budget || !allowedBudgets.includes(budget)) {
        return res.status(400).json({ error: "Invalid or missing Budget tier selection." });
      }

      const allowedTimes = ['10 Minutes', '20 Minutes', '30 Minutes', '45+ Minutes'];
      if (!cookingTime || !allowedTimes.includes(cookingTime)) {
        return res.status(400).json({ error: "Invalid or missing Cooking Time preference." });
      }

      const allowedCuisines = ['Indian', 'Italian', 'Chinese', 'Mexican', 'Healthy', 'Other'];
      if (!cuisinePreference || !allowedCuisines.includes(cuisinePreference)) {
        return res.status(400).json({ error: "Invalid or missing Cuisine Preference." });
      }

      // Sanitize the ingredients list (max 20 items, up to 50 chars each)
      const sanitizedIngredients = Array.isArray(availableIngredients)
        ? availableIngredients
            .slice(0, 20)
            .map(item => escapeString(String(item).trim().slice(0, 50)))
            .filter(Boolean)
        : [];

      // Lazy check key & get SDK instance
      let ai;
      try {
        ai = getGeminiClient();
      } catch (err: any) {
        return res.status(500).json({
          error: "API Key Unconfigured",
          message: err.message || "Gemini API key is not set on the server."
        });
      }

      // Build specific prompt instructing Gemini on MealMate constraints
      const userPrompt = `Generate a daily meal plan with the following customized preferences:
- Name of user: ${sanitizedName || "Friend"}
- Diet preference: ${dietPreference}
- Food Goal: ${foodGoal}
- Budget Tier: ${budget}
- Allowed preparation/cooking time: ${cookingTime}
- Cuisine Style: ${cuisinePreference}
- Ingredients already available in user's pantry to prioritize: ${sanitizedIngredients.length > 0 ? sanitizedIngredients.join(", ") : "None specified"}
- Allergies or ingredients to strictly AVOID: ${sanitizedAllergies || "None specified"}

Curate delicious meals matching these exactly. Keep ingredients realistic and instructions easy to follow. Ensure that ALL output fields are populated accurately and do not leave any empty placeholders. Ensure budget status matches budget tier beautifully.`;

      // Define structured schemas
      const mealDetailSchema = {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING, description: "Elegant, mouthwatering title for the dish." },
          description: { type: Type.STRING, description: "Appetizing description summarizing flavor, context, and compatibility with the goal." },
          prepTime: { type: Type.STRING, description: "Preparation & cooking time (e.g., '15 mins')." },
          difficulty: { type: Type.STRING, enum: ["Easy", "Medium", "Hard"], description: "Level of culinary complexity." },
          calories: { type: Type.INTEGER, description: "Estimated calorie count." },
          ingredients: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "Precise ingredients list with quantities."
          },
          instructions: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "Step-by-step simple cooking steps."
          },
        },
        required: ["name", "description", "prepTime", "difficulty", "calories", "ingredients", "instructions"],
      };

      const mealPlanSchema = {
        type: Type.OBJECT,
        properties: {
          breakfast: mealDetailSchema,
          lunch: mealDetailSchema,
          dinner: mealDetailSchema,
          snack: mealDetailSchema,
          nutritionSummary: {
            type: Type.OBJECT,
            properties: {
              calories: { type: Type.INTEGER, description: "Total daily calorie calculation." },
              protein: { type: Type.STRING, description: "Total protein estimate (e.g., '70g')." },
              carbs: { type: Type.STRING, description: "Total carbs estimate (e.g., '150g')." },
              fat: { type: Type.STRING, description: "Total fat estimate (e.g., '45g')." },
              fiber: { type: Type.STRING, description: "Total fiber estimate (e.g., '25g')." },
            },
            required: ["calories", "protein", "carbs", "fat", "fiber"],
          },
          groceryList: {
            type: Type.ARRAY,
            description: "Shopping list grouped into clean grocery categories (e.g., Produce, Pantry, Protein, Spices).",
            items: {
              type: Type.OBJECT,
              properties: {
                category: { type: Type.STRING, description: "Category name." },
                items: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      name: { type: Type.STRING, description: "Ingredient name." },
                      amount: { type: Type.STRING, description: "Estimated quantity needed." },
                    },
                    required: ["name", "amount"],
                  },
                },
              },
              required: ["category", "items"],
            },
          },
          ingredientSubstitutions: {
            type: Type.ARRAY,
            description: "Helpful suggestions for replacing key ingredients to suit allergies, optimize budget, or swap common items.",
            items: {
              type: Type.OBJECT,
              properties: {
                original: { type: Type.STRING, description: "Ingredient in original recipe." },
                substitute: { type: Type.STRING, description: "Healthier/allergy-safe or cheaper alternative." },
                reason: { type: Type.STRING, description: "Contextual reason for this substitution." },
              },
              required: ["original", "substitute", "reason"],
            },
          },
          budget: {
            type: Type.OBJECT,
            properties: {
              estimatedDailyCost: { type: Type.STRING, description: "Range of cost for the daily meals (e.g., '$5 - $8')." },
              status: { type: Type.STRING, description: "E.g. Low Budget, Highly Feasible, Smart Match" },
              explanation: { type: Type.STRING, description: "Short breakdown explaining why it fits the budget constraints." },
            },
            required: ["estimatedDailyCost", "status", "explanation"],
          },
          cookingTips: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "3 highly useful general cooking or food prep hacks customized for these recipes."
          },
        },
        required: [
          "breakfast",
          "lunch",
          "dinner",
          "snack",
          "nutritionSummary",
          "groceryList",
          "ingredientSubstitutions",
          "budget",
          "cookingTips"
        ],
      };

      // Call Gemini 3.5 Flash server-side
      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: userPrompt,
        config: {
          systemInstruction: "You are MealMate AI, an elite culinary designer and nutritionist. Build highly personalized, professional, and visually clear daily meal plans (Breakfast, Lunch, Dinner, Snack) strictly complying with user preferences, allergies, budgets, available ingredients, goals, and cuisine preferences. Do not use markdown tags inside text fields; return simple, elegant, clean descriptions. All numbers must be realistic. Always double check if ingredients contain any of the user's allergies, and if so, swap them immediately.",
          responseMimeType: "application/json",
          responseSchema: mealPlanSchema,
          temperature: 0.2,
        }
      });

      const responseText = response.text;
      if (!responseText) {
        throw new Error("Empty response received from the Gemini generation model.");
      }

      // Parse and return the structured JSON
      const parsedData = JSON.parse(responseText.trim());
      res.json(parsedData);

    } catch (error: any) {
      console.error("Meal Generation Error:", error);
      res.status(500).json({
        error: "Generation Failed",
        message: error.message || "An unexpected error occurred while curating your meal plan."
      });
    }
  });

  // Serve static assets / handle single page app fallbacks
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`MealMate AI server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
