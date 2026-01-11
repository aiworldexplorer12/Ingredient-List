
import React, { useState } from 'react';
import { Recipe } from '../types';

interface RecipeViewProps {
  recipe: Recipe;
}

export const RecipeView: React.FC<RecipeViewProps> = ({ recipe }) => {
  const [checkedItems, setCheckedItems] = useState<Set<number>>(new Set());

  const toggleItem = (index: number) => {
    const newChecked = new Set(checkedItems);
    if (newChecked.has(index)) {
      newChecked.delete(index);
    } else {
      newChecked.add(index);
    }
    setCheckedItems(newChecked);
  };

  return (
    <div className="max-w-4xl mx-auto mt-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Hero Section */}
      <div className="relative rounded-3xl overflow-hidden shadow-2xl mb-8 group">
        <img 
          src={recipe.imageUrl || `https://picsum.photos/seed/${recipe.id}/1200/600`} 
          alt={recipe.name}
          className="w-full h-[400px] object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-8 text-white">
          <div className="flex gap-4 mb-4">
             <span className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-sm font-medium border border-white/20">
               ⏱️ {recipe.prepTime} Prep
             </span>
             <span className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-sm font-medium border border-white/20">
               🔥 {recipe.cookTime} Cook
             </span>
             <span className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-sm font-medium border border-white/20">
               🍴 {recipe.servings} Servings
             </span>
          </div>
          <h1 className="serif text-5xl font-bold mb-2">{recipe.name}</h1>
          <p className="text-gray-200 max-w-2xl leading-relaxed">{recipe.description}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-20">
        {/* Ingredients Column */}
        <div className="md:col-span-1">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 sticky top-24">
            <h2 className="serif text-2xl font-bold mb-6 flex items-center gap-2">
              <span className="bg-orange-100 text-orange-600 p-2 rounded-lg text-sm">🛒</span>
              Ingredients
            </h2>
            <ul className="space-y-4">
              {recipe.ingredients.map((ing, idx) => (
                <li 
                  key={idx} 
                  className={`flex items-start gap-3 cursor-pointer group select-none`}
                  onClick={() => toggleItem(idx)}
                >
                  <div className={`mt-1 min-w-[20px] h-[20px] rounded border flex items-center justify-center transition-colors ${checkedItems.has(idx) ? 'bg-orange-500 border-orange-500' : 'border-gray-300 group-hover:border-orange-400'}`}>
                    {checkedItems.has(idx) && (
                      <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                  <div className={`flex flex-col ${checkedItems.has(idx) ? 'line-through text-gray-400 opacity-60' : 'text-gray-700'}`}>
                    <span className="font-semibold">{ing.amount} {ing.unit}</span>
                    <span className="text-sm">{ing.item}</span>
                  </div>
                </li>
              ))}
            </ul>
            <button 
              className="w-full mt-8 py-3 bg-gray-50 text-gray-600 rounded-xl hover:bg-gray-100 transition-colors text-sm font-medium"
              onClick={() => window.print()}
            >
              🖨️ Print Recipe
            </button>
          </div>
        </div>

        {/* Method Column */}
        <div className="md:col-span-2">
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 h-full">
            <h2 className="serif text-2xl font-bold mb-6 flex items-center gap-2">
              <span className="bg-emerald-100 text-emerald-600 p-2 rounded-lg text-sm">👩‍🍳</span>
              Preparation Steps
            </h2>
            <div className="space-y-8">
              {recipe.instructions.map((step, idx) => (
                <div key={idx} className="flex gap-6 group">
                  <div className="flex-shrink-0 w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center font-bold text-gray-400 group-hover:bg-orange-100 group-hover:text-orange-600 transition-colors">
                    {idx + 1}
                  </div>
                  <div className="pt-2 text-gray-700 leading-relaxed text-lg border-b border-gray-50 pb-6 w-full">
                    {step}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
