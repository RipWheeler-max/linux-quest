import { useState, useRef, useEffect } from 'react';
import { TerminalEngine } from './terminalEngine';
import type { TerminalLine } from '../../types';

interface TerminalProps {
  onCommandExecuted?: (command: string, engine: TerminalEngine) => void;
}

export default function Terminal({ onCommandExecuted }: TerminalProps) {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState<TerminalLine[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [isTyping, setIsTyping] = useState(false);
  const [commandFlash, setCommandFlash] = useState(false);
  const [lastCommand, setLastCommand] = useState('');
  const engineRef = useRef<TerminalEngine | null>(null);
  const outputRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    engineRef.current = new TerminalEngine();
    setOutput(engineRef.current.getState().output);
  }, []);

  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, [output]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !engineRef.current) return;

    const command = input;
    engineRef.current.executeCommand(command);
    const stateAfterExecution = engineRef.current.getState();
    setOutput([...stateAfterExecution.output]);

    if (onCommandExecuted) {
      onCommandExecuted(command, engineRef.current);
    }

    setInput('');
    setHistoryIndex(-1);

    // 命令执行动画
    setIsTyping(true);
    setCommandFlash(true);
    setLastCommand(command);
    setTimeout(() => setIsTyping(false), 300);
    setTimeout(() => setCommandFlash(false), 500);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!engineRef.current) return;

    if (e.key === 'ArrowUp') {
      e.preventDefault();
      const history = engineRef.current.getState().commandHistory;
      if (history.length > 0) {
        const newIndex = historyIndex === -1
          ? history.length - 1
          : Math.max(0, historyIndex - 1);
        setHistoryIndex(newIndex);
        setInput(history[newIndex]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      const history = engineRef.current.getState().commandHistory;
      if (historyIndex === -1) return;

      if (historyIndex < history.length - 1) {
        const newIndex = historyIndex + 1;
        setHistoryIndex(newIndex);
        setInput(history[newIndex]);
      } else {
        setHistoryIndex(-1);
        setInput('');
      }
    }
  };

  const currentDir = engineRef.current?.getCurrentDir() || '~';

  return (
    <div className="rounded-xl overflow-hidden border border-[#1e293b] shadow-[0_0_30px_rgba(0,255,136,0.1)] relative">
      {/* Command flash overlay */}
      {commandFlash && (
        <div className="absolute inset-0 bg-[#00ff88]/5 pointer-events-none z-20 animate-pulse" />
      )}

      {/* Terminal Header */}
      <div className="bg-[#111827] px-4 py-2.5 flex items-center justify-between border-b border-[#1e293b]">
        <div className="flex items-center gap-3">
          <div className="flex gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500/80 hover:bg-red-500 transition-colors" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/80 hover:bg-yellow-500 transition-colors" />
            <div className="w-3 h-3 rounded-full bg-green-500/80 hover:bg-green-500 transition-colors" />
          </div>
          <div className="text-xs text-[#64748b] terminal-font">
            bash
          </div>
        </div>
        {lastCommand && (
          <div className="text-xs text-[#00ff88]/50 terminal-font">
            last: {lastCommand}
          </div>
        )}
      </div>

      {/* Terminal Body */}
      <div
        ref={outputRef}
        className={`bg-[#0a0e1a] p-4 h-[28rem] overflow-y-auto terminal-font text-sm relative transition-all duration-300 ${
          isTyping ? 'ring-1 ring-[#00ff88]/30' : ''
        }`}
        onClick={() => inputRef.current?.focus()}
      >
        {/* Output lines */}
        <div className="relative z-10">
          {output.map((line, i) => (
            <div
              key={i}
              className={`mb-0.5 ${
                line.type === 'command'
                  ? 'text-[#00ff88]'
                  : line.type === 'error'
                  ? 'text-red-400'
                  : line.type === 'success'
                  ? 'text-[#00ff88]'
                  : line.type === 'info'
                  ? 'text-[#00d4ff]'
                  : 'text-[#94a3b8]'
              }`}
            >
              <pre className="whitespace-pre-wrap font-sans">{line.content}</pre>
            </div>
          ))}

          {/* Input Line */}
          <form onSubmit={handleSubmit} className="flex items-center mt-1">
            <span className="text-[#00ff88] mr-2 terminal-font">
              {currentDir} $
            </span>
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-1 bg-transparent text-white outline-none terminal-font caret-[#00ff88]"
              autoFocus
              spellCheck={false}
              placeholder="输入命令..."
            />
          </form>
        </div>
      </div>

      {/* Terminal Footer */}
      <div className="bg-[#111827] px-4 py-1.5 flex items-center justify-between border-t border-[#1e293b]">
        <div className="text-[10px] text-[#475569] terminal-font">
          {engineRef.current?.getState().commandHistory.length || 0} commands
        </div>
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-[#00ff88] animate-pulse" />
          <span className="text-[10px] text-[#475569] terminal-font">ready</span>
        </div>
      </div>
    </div>
  );
}
