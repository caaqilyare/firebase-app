import React, { useState, useRef, useEffect } from 'react';
import { Terminal, Maximize2, Minimize2, Copy, Check, Command, ChevronRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';

const containerVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.95 }
};

const buttonVariants = {
  hover: { scale: 1.05 },
  tap: { scale: 0.95 }
};

export function CodeInput({ value, onChange, isFullscreen, onToggleFullscreen }) {
  const [isCopied, setIsCopied] = useState(false);
  const [lines, setLines] = useState(value.split('\n'));
  const [isHovered, setIsHovered] = useState(false);
  const textareaRef = useRef(null);

  useEffect(() => {
    setLines(value.split('\n'));
  }, [value]);

  const handleCopy = () => {
    navigator.clipboard.writeText(value);
    setIsCopied(true);
    toast.success('Code copied to clipboard', {
      icon: <Sparkles className="h-4 w-4 text-violet-500" />,
      style: { background: 'rgba(139, 92, 246, 0.1)', borderColor: 'rgba(139, 92, 246, 0.2)' }
    });
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
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className={cn(
        "relative group/code w-full",
        "rounded-xl overflow-hidden transition-all duration-300",
        "bg-gradient-to-br from-zinc-900 to-zinc-950",
        "border border-zinc-800/50",
        "shadow-2xl shadow-violet-500/5",
        isFullscreen ? "fixed inset-4 z-50 flex flex-col" : "h-[240px]",
        isHovered && "shadow-violet-500/10 border-violet-500/20"
      )}
    >
      {/* Terminal Header */}
      <motion.div 
        className={cn(
          "flex items-center h-10 px-4",
          "bg-gradient-to-r from-zinc-900/90 to-zinc-950/90",
          "border-b border-zinc-800/50",
          "backdrop-blur-sm"
        )}
      >
        <div className="flex items-center gap-2">
          {/* Traffic Lights */}
          <motion.div 
            className="flex items-center gap-1.5"
            initial={false}
            animate={{ opacity: isHovered ? 1 : 0.7 }}
          >
            <motion.div whileHover={{ scale: 1.1 }} className="h-3 w-3 rounded-full bg-red-500/90 shadow-lg shadow-red-500/20" />
            <motion.div whileHover={{ scale: 1.1 }} className="h-3 w-3 rounded-full bg-yellow-500/90 shadow-lg shadow-yellow-500/20" />
            <motion.div whileHover={{ scale: 1.1 }} className="h-3 w-3 rounded-full bg-green-500/90 shadow-lg shadow-green-500/20" />
          </motion.div>
          {/* Terminal Title */}
          <div className="flex items-center gap-2 pl-3 border-l border-zinc-800/50">
            <Command className="h-4 w-4 text-violet-400" />
            <span className="text-xs font-medium bg-gradient-to-r from-violet-400 via-fuchsia-400 to-cyan-400 text-transparent bg-clip-text">
              root@terminal ~ /code/munasar
            </span>
          </div>
        </div>
        <div className="flex-1" />
        <div className="flex items-center gap-1.5">
          <motion.div whileHover="hover" whileTap="tap" variants={buttonVariants}>
            <Button
              variant="ghost"
              size="icon"
              className={cn(
                "h-8 w-8 rounded-lg",
                "hover:bg-violet-500/10 hover:text-violet-400",
                "transition-colors duration-200"
              )}
              onClick={handleCopy}
            >
              <AnimatePresence mode="wait">
                {isCopied ? (
                  <motion.div
                    key="check"
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.5 }}
                  >
                    <Check className="h-4 w-4 text-violet-400" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="copy"
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.5 }}
                  >
                    <Copy className="h-4 w-4" />
                  </motion.div>
                )}
              </AnimatePresence>
            </Button>
          </motion.div>
          <motion.div whileHover="hover" whileTap="tap" variants={buttonVariants}>
            <Button
              variant="ghost"
              size="icon"
              className={cn(
                "h-8 w-8 rounded-lg",
                "hover:bg-violet-500/10 hover:text-violet-400",
                "transition-colors duration-200"
              )}
              onClick={onToggleFullscreen}
            >
              <AnimatePresence mode="wait">
                {isFullscreen ? (
                  <motion.div
                    key="minimize"
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.5 }}
                  >
                    <Minimize2 className="h-4 w-4" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="maximize"
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.5 }}
                  >
                    <Maximize2 className="h-4 w-4" />
                  </motion.div>
                )}
              </AnimatePresence>
            </Button>
          </motion.div>
        </div>
      </motion.div>

      {/* Editor Area */}
      <div className="relative flex-1 overflow-hidden">
        {/* Terminal Background */}
        <motion.div 
          className="absolute inset-0 pointer-events-none"
          initial={false}
          animate={{ opacity: isHovered ? 1 : 0.8 }}
        >
          <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.03]" />
          <div className="absolute inset-0 bg-gradient-to-br from-violet-500/[0.03] via-fuchsia-500/[0.02] to-cyan-500/[0.01]" />
        </motion.div>

        {/* Line Numbers */}
        <div className={cn(
          "absolute left-0 top-0 bottom-0 w-[3.5rem]",
          "bg-gradient-to-br from-zinc-950/80 to-zinc-900/80",
          "border-r border-zinc-800/50",
          "flex flex-col select-none backdrop-blur-sm"
        )}>
          {lines.map((_, i) => (
            <motion.div 
              key={i}
              initial={false}
              animate={{
                opacity: isHovered ? 0.6 : 0.4,
                color: isHovered ? 'rgb(139, 92, 246)' : 'rgb(124, 58, 237)'
              }}
              className="h-6 flex items-center px-2 text-xs font-mono"
            >
              {String(i + 1).padStart(2, '0')}
            </motion.div>
          ))}
        </div>

        {/* Code Editor */}
        <div className="pl-[3.5rem] h-full">
          <div className="relative">
            <motion.div
              initial={false}
              animate={{
                opacity: isHovered ? 0.8 : 0.5,
                x: isHovered ? 4 : 0
              }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              <ChevronRight className="absolute left-2 top-[0.6rem] h-4 w-4 text-violet-500/50" />
            </motion.div>
            <textarea
              ref={textareaRef}
              value={value}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              className={cn(
                "w-full h-full",
                "pl-8 pr-4 py-2",
                "bg-transparent",
                "text-violet-200",
                "font-mono text-sm",
                "resize-none",
                "focus:outline-none focus:ring-0",
                "custom-scrollbar-terminal",
                "placeholder-violet-700/50",
                isFullscreen ? "h-[calc(100vh-8rem)]" : "h-[calc(240px-4rem)]"
              )}
              placeholder="Type your commands here..."
              spellCheck={false}
              style={{
                lineHeight: "1.5rem",
                fontFamily: "JetBrains Mono, monospace",
                tabSize: 4,
                caretColor: "#8b5cf6",
              }}
            />
          </div>
        </div>
      </div>

      {/* Status Bar */}
      <motion.div 
        className={cn(
          "flex items-center justify-between h-7 px-4",
          "bg-gradient-to-r from-zinc-900/90 to-zinc-950/90",
          "border-t border-zinc-800/50",
          "backdrop-blur-sm"
        )}
        initial={false}
        animate={{ opacity: isHovered ? 1 : 0.8 }}
      >
        <div className="flex items-center gap-2">
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.5, 1, 0.5]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="h-1.5 w-1.5 rounded-full bg-violet-500 shadow-lg shadow-violet-500/50"
          />
          <span className="text-[10px] bg-gradient-to-r from-violet-400 via-fuchsia-400 to-cyan-400 text-transparent bg-clip-text">
            {lines.length} lines • bash
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-violet-600/60">
            {new Date().toLocaleTimeString()}
          </span>
          <motion.div
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0.2, 0.4, 0.2]
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="h-2 w-2 rounded-full bg-violet-500/20"
          />
        </div>
      </motion.div>
    </motion.div>
  );
}