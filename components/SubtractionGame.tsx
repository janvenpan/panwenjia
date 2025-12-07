import React, { useState, useEffect, useCallback } from 'react';
import { Minus, ArrowRight, CheckCircle, XCircle } from 'lucide-react';

interface Props {
  onScoreUpdate: (points: number) => void;
}

const SubtractionGame: React.FC<Props> = ({ onScoreUpdate }) => {
  const [startNum, setStartNum] = useState<number>(0);
  const [options, setOptions] = useState<number[]>([]);
  const [feedback, setFeedback] = useState<'idle' | 'correct' | 'wrong'>('idle');

  const generateQuestion = useCallback(() => {
    // We want Result = 10. So Equation is X - Y = 10.
    // X must be between 11 and 19 for simple "within 10 range" logic mentally.
    const diff = Math.floor(Math.random() * 9) + 1; // 1 to 9
    const start = 10 + diff; // 11 to 19

    // The answer is 'diff'
    const correct = diff;

    const wrong1 = Math.max(1, correct - 1);
    const wrong2 = correct + 1;
    const wrong3 = Math.floor(Math.random() * 9) + 1;

    const uniqueOptions = Array.from(new Set([correct, wrong1, wrong2, wrong3])).slice(0, 4);
     while (uniqueOptions.length < 4) {
        const r = Math.floor(Math.random() * 9) + 1;
        if (!uniqueOptions.includes(r)) uniqueOptions.push(r);
    }

    setStartNum(start);
    setOptions(uniqueOptions.sort(() => Math.random() - 0.5));
    setFeedback('idle');
  }, []);

  useEffect(() => {
    generateQuestion();
  }, [generateQuestion]);

  const handleAnswer = (selected: number) => {
    if (feedback !== 'idle') return;

    if (startNum - selected === 10) {
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
    <div className="flex flex-col items-center justify-center w-full max-w-2xl mx-auto p-6 bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl border-4 border-purple-200">
      <h2 className="text-3xl font-bold text-purple-600 mb-2">减法挑战 (减到10)</h2>
      <p className="text-gray-500 mb-8">减去一个数，让结果等于 10！</p>

      <div className="flex items-center gap-3 text-5xl md:text-6xl font-black text-slate-800 mb-12 bg-purple-50 px-8 py-8 rounded-2xl w-full justify-center">
        <span className="text-purple-600">{startNum}</span>
        <Minus className="w-8 h-8 md:w-12 md:h-12 text-gray-400" />
        <div className="w-20 h-20 md:w-24 md:h-24 border-4 border-dashed border-purple-300 rounded-xl flex items-center justify-center bg-white text-gray-400 text-4xl">
          ?
        </div>
        <div className="flex flex-col items-center">
            <span className="text-sm text-gray-400 font-normal mb-1">等于</span>
            <ArrowRight className="w-8 h-8 text-gray-400" />
        </div>
        <span className="text-green-600">10</span>
      </div>

      <div className="grid grid-cols-4 gap-3 w-full max-w-lg">
        {options.map((opt, idx) => (
          <button
            key={idx}
            onClick={() => handleAnswer(opt)}
            className={`
              h-20 md:h-24 text-3xl md:text-4xl font-bold rounded-2xl transition-all transform active:scale-95 shadow-md flex items-center justify-center
              ${feedback === 'idle' ? 'bg-white hover:bg-purple-50 border-2 border-purple-100 text-purple-600' : ''}
              ${feedback === 'correct' && startNum - opt === 10 ? 'bg-green-500 text-white border-green-600 scale-105' : ''}
              ${feedback === 'wrong' && startNum - opt !== 10 ? 'opacity-30' : ''}
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
            <CheckCircle className="w-6 h-6 mr-2" /> 答对了！ {startNum} - {startNum-10} = 10
          </span>
        )}
        {feedback === 'wrong' && (
          <span className="flex items-center text-red-500 font-bold text-xl animate-pulse">
            <XCircle className="w-6 h-6 mr-2" /> 哎呀！再试一次。
          </span>
        )}
      </div>
    </div>
  );
};

export default SubtractionGame;