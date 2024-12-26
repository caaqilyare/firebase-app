import React, { useState, useRef } from 'react';
import { FileText, Copy, Check, Maximize2, Minimize2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

export function NoteInput({ value, onChange, isFullscreen, onToggleFullscreen, readOnly = false }) {
  const [isCopied, setIsCopied] = useState(false);
  const textareaRef = useRef(null);

  const handleCopy = () => {
    navigator.clipboard.writeText(value);
    setIsCopied(true);
    toast.success('Note copied to clipboard');
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className={cn(
      "relative group/note w-full",
      "rounded-lg overflow-hidden transition-all duration-300",
      "bg-amber-50/90 dark:bg-amber-950/10",
      "border border-amber-200/50 dark:border-amber-800/50",
      "shadow-lg shadow-amber-500/5",
      isFullscreen ? "fixed inset-4 z-50 flex flex-col" : "h-[240px]"
    )}>
      {/* Notepad Header */}
      <div className="flex items-center h-8 px-3 bg-gradient-to-r from-amber-100 to-orange-100/80 dark:from-amber-900/30 dark:to-orange-900/20 border-b border-amber-200/30 dark:border-amber-800/30">
        <div className="flex items-center gap-2">
          <FileText className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" />
          <span className="text-xs font-medium text-amber-700 dark:text-amber-300">
            Note Editor
          </span>
        </div>
        <div className="flex-1" />
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 hover:bg-amber-200/20 dark:hover:bg-amber-800/20"
            onClick={handleCopy}
          >
            {isCopied ? (
              <Check className="h-3 w-3 text-green-600 dark:text-green-400" />
            ) : (
              <Copy className="h-3 w-3 text-amber-600 dark:text-amber-400" />
            )}
          </Button>
          {!readOnly && (
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 hover:bg-amber-200/20 dark:hover:bg-amber-800/20"
              onClick={onToggleFullscreen}
            >
              {isFullscreen ? (
                <Minimize2 className="h-3 w-3 text-amber-600 dark:text-amber-400" />
              ) : (
                <Maximize2 className="h-3 w-3 text-amber-600 dark:text-amber-400" />
              )}
            </Button>
          )}
        </div>
      </div>

      {/* Editor Area */}
      <div className="relative flex-1 overflow-hidden">
        {/* Paper Background with subtle gradient */}
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-transparent to-amber-50/50 dark:to-amber-950/5" />

        {/* Text Editor */}
        <textarea
          ref={textareaRef}
          value={value}
          onChange={onChange}
          readOnly={readOnly}
          className={cn(
            "w-full h-full",
            "px-4 py-3",
            "bg-transparent",
            "text-amber-950 dark:text-amber-100",
            "font-mono text-sm",
            "resize-none",
            "focus:outline-none focus:ring-0",
            "custom-scrollbar-notepad dark:custom-scrollbar-notepad-dark",
            "placeholder-amber-700/30 dark:placeholder-amber-300/30",
            "leading-relaxed",
            isFullscreen ? "h-[calc(100vh-8rem)]" : "h-[calc(240px-3rem)]"
          )}
          placeholder={readOnly ? "" : "Start typing your note here..."}
          spellCheck={false}
          style={{
            lineHeight: "1.5rem",
            fontFamily: "'IBM Plex Mono', monospace",
          }}
        />
      </div>

      {/* Status Bar */}
      <div className="flex items-center justify-between h-6 px-3 bg-gradient-to-r from-amber-100 to-orange-100/80 dark:from-amber-900/30 dark:to-orange-900/20 border-t border-amber-200/30 dark:border-amber-800/30">
        <div className="flex items-center gap-2">
          <div className="h-1.5 w-1.5 rounded-full bg-amber-500/70 dark:bg-amber-400/70 animate-pulse" />
          <span className="text-[10px] text-amber-700 dark:text-amber-300">
            {value.split('\n').length} lines
          </span>
        </div>
        <span className="text-[10px] text-amber-600/60 dark:text-amber-400/60">
          Modified {new Date().toLocaleTimeString()}
        </span>
      </div>
    </div>
  );
} 