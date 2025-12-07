import React, { useState } from 'react';
import { GameMode, GameState } from './types';
import AdditionGame from './components/AdditionGame';
import SubtractionGame from './components/SubtractionGame';
import StoryGame from './components/StoryGame';
import { Calculator, MinusCircle, BookOpen, Star, Trophy } from 'lucide-react';

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>({
    score: 0,
    streak: 0,
    currentMode: GameMode.ADDITION,
  });

  const handleScoreUpdate = (points: number) => {
    setGameState(prev => ({
      ...prev,
      score: Math.max(0, prev.score + points),
      streak: points > 0 ? prev.streak + 1 : 0
    }));
  };

  const navItems = [
    { id: GameMode.ADDITION, label: '加法', icon: Calculator, color: 'bg-blue-500' },
    { id: GameMode.SUBTRACTION, label: '减法', icon: MinusCircle, color: 'bg-purple-500' },
    { id: GameMode.STORY, label: 'AI 故事', icon: BookOpen, color: 'bg-amber-500' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 font-sans selection:bg-yellow-200">
      {/* Background Decorative Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0 opacity-30">
        <div className="absolute top-10 left-10 w-32 h-32 bg-blue-300 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-48 h-48 bg-purple-300 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 w-40 h-40 bg-yellow-200 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 py-6 md:py-10 flex flex-col min-h-screen">
        
        {/* Header Section */}
        <header className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-4xl font-black text-slate-800 tracking-tight flex items-center gap-3">
              <span className="text-blue-600 text-5xl">10</span> 
              <span>凑十法大师</span>
            </h1>
            <p className="text-slate-500 font-medium ml-1">一起来学凑十法！</p>
          </div>

          <div className="flex items-center gap-4 bg-white p-3 rounded-2xl shadow-sm border border-slate-200">
             <div className="flex items-center gap-2 px-4 py-2 bg-yellow-100 text-yellow-700 rounded-xl">
                <Star className="w-5 h-5 fill-yellow-500 text-yellow-500" />
                <span className="font-bold text-lg">{gameState.score}</span>
             </div>
             {gameState.streak > 2 && (
               <div className="flex items-center gap-2 px-4 py-2 bg-orange-100 text-orange-700 rounded-xl animate-pulse">
                  <Trophy className="w-5 h-5" />
                  <span className="font-bold text-sm">{gameState.streak} 连胜！</span>
               </div>
             )}
          </div>
        </header>

        {/* Navigation Tabs */}
        <nav className="grid grid-cols-3 gap-3 md:gap-6 mb-8">
          {navItems.map((item) => {
            const isActive = gameState.currentMode === item.id;
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setGameState(prev => ({ ...prev, currentMode: item.id }))}
                className={`
                  relative overflow-hidden rounded-2xl p-4 transition-all duration-300 flex flex-col items-center justify-center gap-2 shadow-sm
                  ${isActive ? `${item.color} text-white shadow-lg scale-105 ring-4 ring-offset-2 ring-slate-100` : 'bg-white text-slate-500 hover:bg-slate-100'}
                `}
              >
                <Icon className={`w-6 h-6 md:w-8 md:h-8 ${isActive ? 'text-white' : ''}`} />
                <span className="font-bold text-sm md:text-lg">{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Main Game Area */}
        <main className="flex-1">
          {gameState.currentMode === GameMode.ADDITION && (
            <div className="animate-in fade-in slide-in-from-bottom-8 duration-500">
              <AdditionGame onScoreUpdate={handleScoreUpdate} />
            </div>
          )}
          {gameState.currentMode === GameMode.SUBTRACTION && (
             <div className="animate-in fade-in slide-in-from-bottom-8 duration-500">
              <SubtractionGame onScoreUpdate={handleScoreUpdate} />
            </div>
          )}
          {gameState.currentMode === GameMode.STORY && (
             <div className="animate-in fade-in slide-in-from-bottom-8 duration-500">
              <StoryGame onScoreUpdate={handleScoreUpdate} />
            </div>
          )}
        </main>

        <footer className="mt-12 text-center text-slate-400 text-sm">
          <p>每天练习，成为数学大师！</p>
        </footer>
      </div>
    </div>
  );
};

export default App;