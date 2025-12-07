import React, { useState, useEffect, useCallback } from 'react';
import { Sparkles, Brain, AlertCircle, Loader2 } from 'lucide-react';
import { generateMathStory } from '../services/geminiService';
import { StoryResponse } from '../types';

interface Props {
  onScoreUpdate: (points: number) => void;
}

const StoryGame: React.FC<Props> = ({ onScoreUpdate }) => {
  const [data, setData] = useState<StoryResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<'idle' | 'correct' | 'wrong'>('idle');
  const [shuffledOptions, setShuffledOptions] = useState<number[]>([]);

  const loadStory = useCallback(async () => {
    setLoading(true);
    setFeedback('idle');
    setData(null);
    const result = await generateMathStory();
    if (result) {
      setData(result);
      const allOptions = [...result.wrongOptions, result.correctAnswer];
      setShuffledOptions(allOptions.sort(() => Math.random() - 0.5));
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    loadStory();
  }, [loadStory]);

  const handleAnswer = (selected: number) => {
    if (feedback !== 'idle' || !data) return;

    if (selected === data.correctAnswer) {
      setFeedback('correct');
      onScoreUpdate(15); // Higher points for reading/logic
    } else {
      setFeedback('wrong');
      onScoreUpdate(-5);
    }
  };

  return (
    <div className="flex flex-col items-center w-full max-w-2xl mx-auto p-6 bg-white/95 backdrop-blur-sm rounded-3xl shadow-xl border-4 border-amber-200 min-h-[500px]">
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="w-6 h-6 text-amber-500" />
        <h2 className="text-2xl font-bold text-amber-600">AI 数学故事教练</h2>
      </div>

      {loading ? (
        <div className="flex-1 flex flex-col items-center justify-center text-amber-500 space-y-4">
          <Loader2 className="w-12 h-12 animate-spin" />
          <p className="font-medium animate-pulse">正在生成新的挑战...</p>
        </div>
      ) : !data ? (
        <div className="flex-1 flex flex-col items-center justify-center text-red-400 space-y-4">
          <AlertCircle className="w-12 h-12" />
          <p>无法加载故事。请检查网络或 API Key。</p>
          <button onClick={loadStory} className="px-4 py-2 bg-amber-100 rounded-lg hover:bg-amber-200 text-amber-700 font-bold">重试</button>
        </div>
      ) : (
        <div className="w-full flex flex-col h-full justify-between">
          <div className="bg-amber-50 p-6 rounded-2xl border-2 border-amber-100 mb-6 relative overflow-hidden group">
            <div className="absolute -right-4 -top-4 opacity-10 rotate-12">
                <Brain className="w-32 h-32 text-amber-600"/>
            </div>
            <p className="text-xl md:text-2xl text-slate-700 font-medium leading-relaxed mb-4 relative z-10">
              {data.storyContext}
            </p>
            <p className="text-lg text-amber-700 font-bold relative z-10 border-t border-amber-200 pt-4">
              问：{data.question}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            {shuffledOptions.map((opt, idx) => (
              <button
                key={idx}
                onClick={() => handleAnswer(opt)}
                className={`
                  h-16 text-2xl font-bold rounded-xl transition-all shadow-sm
                  ${feedback === 'idle' ? 'bg-white hover:bg-amber-50 border-2 border-amber-200 text-amber-800' : ''}
                  ${feedback === 'correct' && opt === data.correctAnswer ? 'bg-green-500 text-white border-green-600' : ''}
                  ${feedback === 'wrong' && opt === data.correctAnswer ? 'bg-green-500 text-white border-green-600 ring-4 ring-green-200' : ''}
                  ${feedback === 'wrong' && opt !== data.correctAnswer ? 'opacity-40 bg-gray-100' : ''}
                `}
                disabled={feedback !== 'idle'}
              >
                {opt}
              </button>
            ))}
          </div>

          <div className="min-h-[80px]">
            {feedback === 'correct' && (
              <div className="bg-green-50 p-4 rounded-xl border border-green-200 animate-in fade-in slide-in-from-bottom-4">
                <p className="text-green-800 font-bold flex items-center gap-2">
                  <Sparkles className="w-5 h-5"/> 回答正确！
                </p>
                <p className="text-green-700 text-sm mt-1">{data.explanation}</p>
                <button 
                  onClick={loadStory} 
                  className="mt-3 w-full py-2 bg-green-600 text-white rounded-lg font-bold hover:bg-green-700 transition-colors"
                >
                  下一个故事
                </button>
              </div>
            )}
            {feedback === 'wrong' && (
              <div className="bg-red-50 p-4 rounded-xl border border-red-200 animate-in shake">
                 <p className="text-red-600 font-bold">不太对哦。</p>
                 <p className="text-red-500 text-sm">想想怎么能凑成 10。</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default StoryGame;