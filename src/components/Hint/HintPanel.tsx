import { useState } from 'react';

interface HintPanelProps {
  hints: string[];
  onHintUsed?: () => void;
}

export default function HintPanel({ hints, onHintUsed }: HintPanelProps) {
  const [revealedHints, setRevealedHints] = useState(0);

  const showNextHint = () => {
    if (revealedHints < hints.length) {
      setRevealedHints(prev => prev + 1);
      onHintUsed?.();
    }
  };

  if (hints.length === 0) return null;

  const hintProgress = (revealedHints / hints.length) * 100;

  return (
    <div className="game-card p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-[#ffd700] font-semibold flex items-center gap-2 game-font text-sm uppercase tracking-wider">
          <span className="text-xl">💡</span>
          INTEL
        </h3>
        <button
          onClick={showNextHint}
          disabled={revealedHints >= hints.length}
          className="px-4 py-2 bg-[#ffd700]/10 hover:bg-[#ffd700]/20 disabled:bg-[#1e293b] disabled:text-[#475569] text-[#ffd700] rounded-lg text-sm transition-all duration-300 border border-[#ffd700]/20 disabled:border-[#1e293b]"
        >
          {revealedHints >= hints.length ? 'All Revealed' : `Reveal (${revealedHints}/${hints.length})`}
        </button>
      </div>

      {/* Hint Progress Bar */}
      <div className="mb-4">
        <div className="h-1.5 bg-[#1e293b] rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[#ffd700] to-[#ff8c00] rounded-full transition-all duration-500"
            style={{ width: `${hintProgress}%` }}
          />
        </div>
      </div>

      {revealedHints > 0 && (
        <div className="space-y-3">
          {hints.slice(0, revealedHints).map((hint, i) => (
            <div
              key={i}
              className="flex items-start gap-3 p-3 bg-[#ffd700]/5 border border-[#ffd700]/10 rounded-lg animate-[slide-up_0.3s_ease-out]"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <span className="text-[#ffd700] mt-0.5 text-lg">▸</span>
              <p className="text-[#ffd700]/80 text-sm leading-relaxed">{hint}</p>
            </div>
          ))}
        </div>
      )}

      {revealedHints === 0 && (
        <div className="text-center py-4">
          <p className="text-[#475569] text-sm terminal-font">
            // Click reveal to access intel
          </p>
        </div>
      )}
    </div>
  );
}
