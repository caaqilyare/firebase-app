import React, { useState, Suspense } from 'react';
import { Eye, EyeOff, Copy, Check, ChevronDown, ChevronUp, Loader2, Terminal, User, Wallet, Lock, Key, Type, Globe, Hash, Mail, Phone } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { getFieldType, getFieldDisplay } from './field-utils';
import { motion, AnimatePresence } from 'framer-motion';
import { CodeInput } from './CodeInput';
import { NoteInput } from './NoteInput';

const buttonVariants = {
  initial: { opacity: 0, scale: 0.9 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.9 },
  hover: { scale: 1.1 }
};

const fieldVariants = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 }
};

export function ItemField({ fieldName, fieldValue, showSecretFields, toggleFieldVisibility, viewMode }) {
  const [isCopied, setIsCopied] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const fieldDisplay = getFieldDisplay(fieldName, fieldValue);

  const handleCopy = () => {
    navigator.clipboard.writeText(fieldValue);
    setIsCopied(true);
    toast.success('Copied to clipboard');
    setTimeout(() => setIsCopied(false), 2000);
  };

  const formatUrl = (url) => {
    try {
      const urlObj = new URL(url);
      return {
        display: urlObj.hostname + (urlObj.pathname !== '/' ? urlObj.pathname : ''),
        tooltip: url
      };
    } catch (e) {
      return { display: url, tooltip: url };
    }
  };

  const renderFieldContent = (fieldDisplay, value) => {
    if (fieldDisplay.group === 'code') {
      return (
        <motion.div
          variants={fieldVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          <CodeInput
            value={value}
            onChange={() => {}}
            isFullscreen={false}
            onToggleFullscreen={() => {}}
            readOnly={true}
          />
        </motion.div>
      );
    }

    if (fieldDisplay.group === 'notes') {
      return (
        <motion.div
          variants={fieldVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          <NoteInput
            value={value}
            onChange={() => {}}
            isFullscreen={false}
            onToggleFullscreen={() => {}}
            readOnly={true}
          />
        </motion.div>
      );
    }

    const commonButtonProps = {
      variant: "ghost",
      size: "icon",
      onClick: handleCopy,
      className: cn(
        "absolute right-2 top-1/2 -translate-y-1/2",
        "opacity-0 group-hover:opacity-100",
        "transition-all duration-300",
        "hover:scale-110"
      )
    };

    const renderCopyButton = (color) => (
      <motion.div
        variants={buttonVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        whileHover="hover"
      >
        <Button {...commonButtonProps}>
          <AnimatePresence mode="wait">
            {isCopied ? (
              <motion.div
                key="check"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.5 }}
              >
                <Check className="h-4 w-4 text-green-500" />
              </motion.div>
            ) : (
              <motion.div
                key="copy"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.5 }}
              >
                <Copy className={`h-4 w-4 text-${color}-400`} />
              </motion.div>
            )}
          </AnimatePresence>
        </Button>
      </motion.div>
    );

    switch (fieldDisplay.value) {
      case 'url':
        const { display, tooltip } = formatUrl(value);
        return (
          <motion.div
            className="relative group"
            variants={fieldVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            onHoverStart={() => setIsHovered(true)}
            onHoverEnd={() => setIsHovered(false)}
          >
            <div className={cn(
              "px-4 py-2.5 rounded-lg",
              "bg-gradient-to-br from-blue-500/5 via-indigo-500/5 to-violet-500/5",
              "border border-blue-500/20",
              "text-blue-700 dark:text-blue-300",
              "flex items-center gap-3",
              "shadow-lg hover:shadow-xl transition-all duration-300",
              "group-hover:border-blue-500/40"
            )}>
              <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full">
                <Globe className="h-4 w-4 text-white" />
              </div>
              <a 
                href={value}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  "hover:text-blue-600 dark:hover:text-blue-400",
                  "transition-colors duration-300",
                  "flex items-center gap-2"
                )}
                title={tooltip}
              >
                {display}
              </a>
            </div>
            {renderCopyButton('blue')}
          </motion.div>
        );

      case 'email':
        return (
          <motion.div
            className="relative group"
            variants={fieldVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            <div className={cn(
              "px-4 py-2.5 rounded-lg",
              "bg-gradient-to-br from-violet-500/5 via-fuchsia-500/5 to-pink-500/5",
              "border border-violet-500/20",
              "text-violet-700 dark:text-violet-300",
              "flex items-center gap-3",
              "shadow-lg hover:shadow-xl transition-all duration-300",
              "group-hover:border-violet-500/40"
            )}>
              <div className="p-2 bg-gradient-to-br from-violet-500 to-fuchsia-500 rounded-full">
                <Mail className="h-4 w-4 text-white" />
              </div>
              <a 
                href={`mailto:${value}`}
                className={cn(
                  "hover:text-violet-600 dark:hover:text-violet-400",
                  "transition-colors duration-300",
                  "flex items-center gap-2"
                )}
              >
                {value}
              </a>
            </div>
            {renderCopyButton('violet')}
          </motion.div>
        );

      case 'phone':
        const cleanPhone = value.replace(/\D/g, '');
        const formattedPhone = cleanPhone.replace(/(\d{3})(\d{3})(\d{4})/, '$1 $2 $3');
        return (
          <motion.div
            className="relative group"
            variants={fieldVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            <div className={cn(
              "px-4 py-2.5 rounded-lg",
              "bg-gradient-to-br from-emerald-500/5 via-teal-500/5 to-cyan-500/5",
              "border border-emerald-500/20",
              "text-emerald-700 dark:text-emerald-300",
              "flex items-center gap-3",
              "shadow-lg hover:shadow-xl transition-all duration-300",
              "group-hover:border-emerald-500/40"
            )}>
              <div className="p-2 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-full">
                <Phone className="h-4 w-4 text-white" />
              </div>
              <a 
                href={`tel:${cleanPhone}`}
                className={cn(
                  "font-mono text-lg tracking-wide",
                  "flex items-center gap-2",
                  "hover:text-emerald-600 dark:hover:text-emerald-400",
                  "transition-colors duration-300"
                )}
              >
                <span className="text-emerald-500/60 text-sm font-semibold">+</span>
                {formattedPhone}
              </a>
            </div>
            {renderCopyButton('emerald')}
          </motion.div>
        );

      case 'username':
        return (
          <motion.div
            className="relative group"
            variants={fieldVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            <div className={cn(
              "px-4 py-2.5 rounded-lg",
              "bg-gradient-to-br from-amber-500/5 via-orange-500/5 to-yellow-500/5",
              "border border-amber-500/20",
              "text-amber-700 dark:text-amber-300",
              "flex items-center gap-3",
              "shadow-lg hover:shadow-xl transition-all duration-300",
              "group-hover:border-amber-500/40"
            )}>
              <div className="p-2 bg-gradient-to-br from-amber-500 to-orange-500 rounded-full">
                <User className="h-4 w-4 text-white" />
              </div>
              <span className="font-medium">{value}</span>
            </div>
            {renderCopyButton('amber')}
          </motion.div>
        );

      case 'password':
      case 'key':
        return (
          <motion.div
            className="relative group"
            variants={fieldVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            <div className={cn(
              "px-4 py-2.5 rounded-lg",
              "bg-gradient-to-br from-rose-500/5 via-pink-500/5 to-red-500/5",
              "border border-rose-500/20",
              "text-rose-700 dark:text-rose-300",
              "flex items-center gap-3",
              "shadow-lg hover:shadow-xl transition-all duration-300",
              "group-hover:border-rose-500/40",
              "font-mono"
            )}>
              <div className="p-2 bg-gradient-to-br from-rose-500 to-pink-500 rounded-full">
                <Key className="h-4 w-4 text-white" />
              </div>
              <span>{showSecretFields[fieldName] ? value : '••••••••'}</span>
              <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-2">
                <motion.div
                  variants={buttonVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  whileHover="hover"
                >
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => toggleFieldVisibility(fieldName)}
                    className={cn(
                      "opacity-0 group-hover:opacity-100",
                      "transition-all duration-300",
                      "hover:bg-rose-500/10"
                    )}
                  >
                    <AnimatePresence mode="wait">
                      {showSecretFields[fieldName] ? (
                        <motion.div
                          key="eyeoff"
                          initial={{ opacity: 0, scale: 0.5 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.5 }}
                        >
                          <EyeOff className="h-4 w-4 text-rose-400" />
                        </motion.div>
                      ) : (
                        <motion.div
                          key="eye"
                          initial={{ opacity: 0, scale: 0.5 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.5 }}
                        >
                          <Eye className="h-4 w-4 text-rose-400" />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </Button>
                </motion.div>
                {renderCopyButton('rose')}
              </div>
            </div>
          </motion.div>
        );

      case 'number':
        const formattedNumber = typeof value === 'string' ? value : value.toString();
        return (
          <motion.div
            className="relative group"
            variants={fieldVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            <div className={cn(
              "px-4 py-2.5 rounded-lg",
              "bg-gradient-to-br from-violet-500/5 via-purple-500/5 to-fuchsia-500/5",
              "border border-violet-500/20",
              "text-violet-700 dark:text-violet-300",
              "flex items-center gap-3",
              "shadow-lg hover:shadow-xl transition-all duration-300",
              "group-hover:border-violet-500/40"
            )}>
              <div className="p-2 bg-gradient-to-br from-violet-500 to-purple-500 rounded-full">
                <Hash className="h-4 w-4 text-white" />
              </div>
              <span className="font-mono text-lg tabular-nums tracking-[0.2em]">
                {formattedNumber.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
              </span>
            </div>
            {renderCopyButton('violet')}
          </motion.div>
        );

      default:
        return (
          <motion.div
            className="relative group"
            variants={fieldVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            <div className={cn(
              "px-4 py-2.5 rounded-lg",
              "bg-gradient-to-br from-slate-500/5 via-gray-500/5 to-zinc-500/5",
              "border border-slate-500/20",
              "text-slate-700 dark:text-slate-300",
              "flex items-center gap-3",
              "shadow-lg hover:shadow-xl transition-all duration-300",
              "group-hover:border-slate-500/40"
            )}>
              <div className="p-2 bg-gradient-to-br from-slate-500 to-gray-500 rounded-full">
                <Type className="h-4 w-4 text-white" />
              </div>
              <span>{value}</span>
            </div>
            {renderCopyButton('slate')}
          </motion.div>
        );
    }
  };

  return (
    <div className="w-full">
      {renderFieldContent(fieldDisplay, fieldValue)}
    </div>
  );
}
