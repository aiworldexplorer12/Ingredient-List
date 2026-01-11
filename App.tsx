
import React, { useState, useEffect } from 'react';
import { Recipe } from './types';
import { getRecipeData, getRecipeImage } from './services/geminiService';
import { RecipeView } from './components/RecipeView';

const App: React.FC = () => {
  const [query, setQuery] = useState('');
  const [currentRecipe, setCurrentRecipe] = useState<Recipe | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<Recipe[]>([]);

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!query.trim()) return;

    setIsLoading(true);
    setError(null);

    try {
      const recipe = await getRecipeData(query);
      const imageUrl = await getRecipeImage(recipe.name);
      const finalRecipe = { ...recipe, imageUrl };
      
      setCurrentRecipe(finalRecipe);
      setHistory(prev => {
        const filtered = prev.filter(r => r.name !== finalRecipe.name);
        return [finalRecipe, ...filtered].slice(0, 5);
      });
      setQuery('');
    } catch (err: any) {
      setError(err.message || 'Failed to find recipe. Please try another name.');
    } finally {
      setIsLoading(false);
    }
  };

  const loadFromHistory = (recipe: Recipe) => {
    setCurrentRecipe(recipe);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen pb-20">
      {/* Navigation Header */}
      <nav className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div 
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => setCurrentRecipe(null)}
          >
            <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center text-white font-bold text-xl">F</div>
            <span className="serif text-xl font-bold text-gray-800">FlavorGenie</span>
          </div>
          
          <div className="hidden md:flex gap-6 text-sm font-medium text-gray-500">
            <a href="#" className="hover:text-orange-500 transition-colors">Discover</a>
            <a href="#" className="hover:text-orange-500 transition-colors">Popular</a>
            <a href="#" className="hover:text-orange-500 transition-colors">Collections</a>
          </div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-4 py-12">
        {/* Search Hero Section */}
        <div className={`transition-all duration-1000 ${currentRecipe ? 'mb-12' : 'mt-24 text-center'}`}>
          {!currentRecipe && (
            <div className="mb-8 animate-in zoom-in-95 duration-700">
              <h1 className="serif text-6xl md:text-7xl font-bold text-gray-900 mb-6">
                Ingredients <span className="text-orange-500">Display</span>
              </h1>
              <p className="text-xl text-gray-500 max-w-2xl mx-auto">
                Enter any dish name, and our AI chef will provide the perfect ingredient list and instructions instantly.
              </p>
            </div>
          )}

          <form 
            onSubmit={handleSearch}
            className={`relative max-w-2xl mx-auto transition-all duration-500 ${currentRecipe ? 'scale-90 opacity-90' : 'scale-110'}`}
          >
            <input 
              type="text" 
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="e.g. Classic Beef Wellington or Spicy Miso Ramen"
              className="w-full pl-6 pr-32 py-5 bg-white border-2 border-gray-100 rounded-2xl shadow-xl focus:outline-none focus:border-orange-500/50 focus:ring-4 focus:ring-orange-500/5 transition-all text-lg"
              disabled={isLoading}
            />
            <button 
              type="submit"
              disabled={isLoading || !query.trim()}
              className="absolute right-2 top-2 bottom-2 px-8 bg-orange-500 hover:bg-orange-600 disabled:bg-gray-300 text-white rounded-xl font-bold transition-all flex items-center gap-2"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                'Generate'
              )}
            </button>
          </form>
          {error && <p className="mt-4 text-red-500 text-center font-medium">{error}</p>}
        </div>

        {/* Loading State Overlay */}
        {isLoading && !currentRecipe && (
          <div className="flex flex-col items-center justify-center py-20 animate-pulse">
            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center text-3xl mb-4">🍳</div>
            <p className="text-gray-400 font-medium italic">Consulting the digital chef archives...</p>
          </div>
        )}

        {/* Content Area */}
        {currentRecipe ? (
          <RecipeView recipe={currentRecipe} />
        ) : (
          !isLoading && (
            <div className="mt-32 grid grid-cols-1 md:grid-cols-3 gap-8">
               <div className="p-8 bg-white rounded-3xl border border-gray-100 shadow-sm text-center">
                  <div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-4 text-2xl">📋</div>
                  <h3 className="font-bold text-lg mb-2">Detailed Ingredients</h3>
                  <p className="text-gray-500 text-sm">Get exact measurements for every part of your chosen meal.</p>
               </div>
               <div className="p-8 bg-white rounded-3xl border border-gray-100 shadow-sm text-center">
                  <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 text-2xl">💡</div>
                  <h3 className="font-bold text-lg mb-2">Smart Tips</h3>
                  <p className="text-gray-500 text-sm">Instructions crafted to ensure the best possible flavor every time.</p>
               </div>
               <div className="p-8 bg-white rounded-3xl border border-gray-100 shadow-sm text-center">
                  <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4 text-2xl">📸</div>
                  <h3 className="font-bold text-lg mb-2">AI Visuals</h3>
                  <p className="text-gray-500 text-sm">See a preview of your dish before you even start chopping.</p>
               </div>
            </div>
          )
        )}

        {/* Search History */}
        {history.length > 0 && (
          <div className="mt-20">
            <h2 className="serif text-2xl font-bold mb-6">Recently Viewed</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {history.map(recipe => (
                <div 
                  key={recipe.id}
                  onClick={() => loadFromHistory(recipe)}
                  className="group cursor-pointer"
                >
                  <div className="relative aspect-video rounded-xl overflow-hidden mb-3">
                    <img 
                      src={recipe.imageUrl || `https://picsum.photos/seed/${recipe.id}/400/225`} 
                      alt={recipe.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors"></div>
                  </div>
                  <h4 className="font-bold text-gray-800 line-clamp-1 group-hover:text-orange-500 transition-colors">{recipe.name}</h4>
                  <p className="text-xs text-gray-500">{recipe.difficulty} • {recipe.prepTime}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-20 border-t border-gray-100 py-12 text-center text-gray-400 text-sm">
        <p>© 2024 FlavorGenie. Powered by Gemini AI.</p>
        <p className="mt-2 italic">Cooking is an art, but AI is a pretty good sous-chef.</p>
      </footer>
    </div>
  );
};

export default App;
