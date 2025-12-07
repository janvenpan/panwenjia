import React, { useState, useEffect, useCallback } from 'react';
import { Play, RefreshCw, CheckCircle, XCircle } from 'lucide-react';

interface Props {
  onScoreUpdate: (points: number) => void;
}

const AdditionGame: React.FC<Props> = ({ onScoreUpdate }) => {
  const [num, setNum] = useState<number>(0);
  const [options, setOptions] = useState<number[]>([]);
  const [feedback, setFeedback] = useState<'idle' | 'correct' | 'wrong'>('idle');

  const generateQuestion = useCallback(() => {
    const newNum = Math.floor(Math.random() * 9) + 1; // 1 to 9
    const correct = 10 - newNum;
    
    // Generate wrong options
    const wrong1 = Math.max(1, correct - 1 === 0 ? 2 : correct - 1);
    const wrong2 = Math.min(9, correct + 1 === 10 ? 8 : correct + 1);
    const wrong3 = Math.floor(Math.random() * 9) + 1;
    
    const uniqueOptions = Array.from(new Set([correct, wrong1, wrong2, wrong3])).slice(0, 4);
    // Fill if not enough unique options (rare edge case)
    while (uniqueOptions.length < 4) {
        const r = Math.floor(Math.random() * 9) + 1;
        if (!uniqueOptions.includes(r)) uniqueOptions.push(r);
    }

    setNum(newNum);
    setOptions(uniqueOptions.sort(() => Math.random() - 0.5));
    setFeedback('idle');
  }, []);

  useEffect(() => {
    generateQuestion();
  }, [generateQuestion]);

  const handleAnswer = (selected: number) => {
    if (feedback !== 'idle') return;

    if (selected + num === 10) {
      setFeedback('correct');
      onScoreUpdate(10);
      setTimeout(generateQuestion, 1500);
    } else {
      setFeedback('wrong');
      onScoreUpdate(-5);
      setTimeout(() => setFeedback('idle'), 1000);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-2xl mx-auto p-6 bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl border-4 border-blue-200">
      <h2 className="text-3xl font-bold text-blue-600 mb-2">凑十法 (加法)</h2>
      <p className="text-gray-500 mb-8">找出哪个数字能凑成 10！</p>

      <div className="flex items-center gap-4 text-6xl font-black text-slate-800 mb-12 bg-blue-50 px-12 py-8 rounded-2xl">
        <span className="text-blue-500">{num}</span>
        <span>+</span>
        <div className="w-24 h-24 border-4 border-dashed border-gray-300 rounded-xl flex items-center justify-center bg-white text-gray-400">
          ?
        </div>
        <span>=</span>
        <span className="text-green-600">10</span>
      </div>

      <div className="grid grid-cols-2 gap-4 w-full max-w-md">
        {options.map((opt, idx) => (
          <button
            key={idx}
            onClick={() => handleAnswer(opt)}
            className={`
              h-24 text-4xl font-bold rounded-2xl transition-all transform active:scale-95 shadow-md
              ${feedback === 'idle' ? 'bg-white hover:bg-blue-50 border-2 border-blue-100 text-blue-600' : ''}
              ${feedback === 'correct' && opt + num === 10 ? 'bg-green-500 text-white border-green-600 scale-105' : ''}
              ${feedback === 'wrong' && opt + num !== 10 ? 'opacity-50' : ''}
            `}
            disabled={feedback !== 'idle'}
          >
            {opt}
          </button>
        ))}
      </div>

      <div className="h-8 mt-6">
        {feedback === 'correct' && (
          <span className="flex items-center text-green-600 font-bold text-xl animate-bounce">
            <CheckCircle className="w-6 h-6 mr-2" /> 太棒了！答对了！
          </span>
        )}
        {feedback === 'wrong' && (
          <span className="flex items-center text-red-500 font-bold text-xl animate-pulse">
            <XCircle className="w-6 h-6 mr-2" /> 再试一次！加油！
          </span>
        )}
      </div>
    </div>
  );
};

export default AdditionGame;