import React, { useState, useRef, useEffect } from 'react';
import { Terminal, Maximize2, Minimize2, Copy, Check, Command, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

export function CodeInput({ value, onChange, isFullscreen, onToggleFullscreen }) {
  const [isCopied, setIsCopied] = useState(false);
  const [lines, setLines] = useState(value.split('\n'));
  const textareaRef = useRef(null);

  useEffect(() => {
    setLines(value.split('\n'));
  }, [value]);

  const handleCopy = () => {
    navigator.clipboard.writeText(value);
    setIsCopied(true);
    toast.success('Code copied to clipboard');
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleChange = (e) => {
    const newValue = e.target.value;
    setLines(newValue.split('\n'));
    onChange({ target: { value: newValue } });
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const start = e.target.selectionStart;
      const end = e.target.selectionEnd;
      const newValue = value.substring(0, start) + '    ' + value.substring(end);
      e.target.value = newValue;
      e.target.selectionStart = e.target.selectionEnd = start + 4;
      handleChange(e);
    }
  };

  return (
    <div className={cn(
      "relative group/code w-full",
      "rounded-lg overflow-hidden transition-all duration-300",
      "bg-[#1E1E1E] border border-zinc-800/50",
      "shadow-2xl shadow-emerald-500/10",
      isFullscreen ? "fixed inset-4 z-50 flex flex-col" : "h-[240px]"
    )}>
      {/* Terminal Header */}
      <div className="flex items-center h-9 px-4 bg-gradient-to-r from-zinc-900 to-zinc-800 border-b border-zinc-700/50">
        <div className="flex items-center gap-2">
          {/* Traffic Lights */}
          <div className="flex items-center gap-1.5">
            <div className="h-3 w-3 rounded-full bg-red-500/90 shadow-lg shadow-red-500/20" />
            <div className="h-3 w-3 rounded-full bg-yellow-500/90 shadow-lg shadow-yellow-500/20" />
            <div className="h-3 w-3 rounded-full bg-green-500/90 shadow-lg shadow-green-500/20" />
          </div>
          {/* Terminal Title */}
          <div className="flex items-center gap-2 pl-3 border-l border-zinc-700/50">
            <Command className="h-4 w-4 text-emerald-400" />
            <span className="text-xs font-medium text-emerald-400/90">
              root@terminal ~ /code/munasar
            </span>
          </div>
        </div>
        <div className="flex-1" />
        <div className="flex items-center gap-1.5">
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 hover:bg-white/5 hover:text-emerald-400 transition-colors"
            onClick={handleCopy}
          >
            {isCopied ? (
              <Check className="h-4 w-4 text-emerald-400" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 hover:bg-white/5 hover:text-emerald-400 transition-colors"
            onClick={onToggleFullscreen}
          >
            {isFullscreen ? (
              <Minimize2 className="h-4 w-4" />
            ) : (
              <Maximize2 className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>

      {/* Editor Area */}
      <div className="relative flex-1 overflow-hidden">
        {/* Terminal Background */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.03]" />
          <div className="absolute inset-0 bg-gradient-to-b from-emerald-500/[0.03]" />
        </div>

        {/* Line Numbers */}
        <div className="absolute left-0 top-0 bottom-0 w-[3.5rem] bg-black/40 border-r border-zinc-800/50 flex flex-col select-none">
          {lines.map((_, i) => (
            <div 
              key={i}
              className="h-6 flex items-center px-2 text-emerald-600/40 text-xs font-mono"
            >
              {String(i + 1).padStart(2, '0')}
            </div>
          ))}
        </div>

        {/* Code Editor */}
        <div className="pl-[3.5rem] h-full">
          <div className="relative">
            <ChevronRight className="absolute left-2 top-[0.6rem] h-4 w-4 text-emerald-500/50" />
            <textarea
              ref={textareaRef}
              value={value}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              className={cn(
                "w-full h-full",
                "pl-8 pr-4 py-2",
                "bg-transparent",
                "text-emerald-300",
                "font-mono text-sm",
                "resize-none",
                "focus:outline-none focus:ring-0",
                "custom-scrollbar-terminal",
                "placeholder-emerald-700/50",
                isFullscreen ? "h-[calc(100vh-8rem)]" : "h-[calc(240px-4rem)]"
              )}
              placeholder="Type your commands here..."
              spellCheck={false}
              style={{
                lineHeight: "1.5rem",
                fontFamily: "JetBrains Mono, monospace",
                tabSize: 4,
                caretColor: "#10b981",
              }}
            />
          </div>
        </div>
      </div>

      {/* Status Bar */}
      <div className="flex items-center justify-between h-6 px-4 bg-gradient-to-r from-zinc-900 to-zinc-800 border-t border-zinc-700/50">
        <div className="flex items-center gap-2">
          <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse shadow-lg shadow-emerald-500/50" />
          <span className="text-[10px] text-emerald-400/90">
            {lines.length} lines • bash
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-emerald-600/60">
            {new Date().toLocaleTimeString()}
          </span>
          <div className="h-2 w-2 rounded-full bg-emerald-500/20 animate-pulse-slow" />
        </div>
      </div>
    </div>
  );
}