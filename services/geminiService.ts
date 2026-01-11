
import { GoogleGenAI, Type } from "@google/genai";
import { Recipe } from "../types";

// The API key is obtained directly from the environment
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const RECIPE_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    name: { type: Type.STRING },
    description: { type: Type.STRING },
    prepTime: { type: Type.STRING },
    cookTime: { type: Type.STRING },
    servings: { type: Type.STRING },
    difficulty: { type: Type.STRING, enum: ['Easy', 'Medium', 'Hard'] },
    ingredients: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          item: { type: Type.STRING },
          amount: { type: Type.STRING },
          unit: { type: Type.STRING }
        },
        required: ['item', 'amount', 'unit']
      }
    },
    instructions: {
      type: Type.ARRAY,
      items: { type: Type.STRING }
    }
  },
  required: ['name', 'description', 'ingredients', 'instructions']
};

export const getRecipeData = async (query: string): Promise<Recipe> => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Generate a detailed professional recipe for: ${query}. Include precise measurements and clear instructions.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: RECIPE_SCHEMA
    }
  });

  const recipeData = JSON.parse(response.text || '{}');
  return {
    ...recipeData,
    id: Date.now().toString()
  };
};

export const getRecipeImage = async (recipeName: string): Promise<string | undefined> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          { text: `A high-end, professional food photography shot of ${recipeName}, beautifully plated on a modern table setting, natural lighting, bokeh background, 4k resolution.` }
        ]
      },
      config: {
        imageConfig: {
          aspectRatio: "16:9"
        }
      }
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
      }
    }
  } catch (err) {
    console.error("Failed to generate image:", err);
  }
  return `https://picsum.photos/seed/${encodeURIComponent(recipeName)}/800/450`;
};
