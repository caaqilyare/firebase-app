import React, { useState, Suspense } from 'react';
import { Eye, EyeOff, Copy, Check, ChevronDown, ChevronUp, Loader2, Terminal, User, Wallet, Lock, Key, Type, Globe, Hash, Mail, Phone } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { getFieldType, getFieldDisplay } from './field-utils';
import { motion } from 'framer-motion';
import { CodeInput } from './CodeInput';
import { NoteInput } from './NoteInput';

export function ItemField({ fieldName, fieldValue, showSecretFields, toggleFieldVisibility, viewMode }) {
  const [isCopied, setIsCopied] = useState(false);
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
        <CodeInput
          value={value}
          onChange={() => {}}
          isFullscreen={false}
          onToggleFullscreen={() => {}}
          readOnly={true}
        />
      );
    }

    if (fieldDisplay.group === 'notes') {
  return (
        <NoteInput
          value={value}
          onChange={() => {}}
          isFullscreen={false}
          onToggleFullscreen={() => {}}
          readOnly={true}
        />
      );
    }

    const commonButtonProps = {
      variant: "ghost",
      size: "icon",
      onClick: handleCopy,
      className: "absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity"
    };

    const renderCopyButton = (color) => (
      <Button {...commonButtonProps}>
        {isCopied ? (
          <Check className="h-4 w-4 text-green-500" />
        ) : (
          <Copy className={`h-4 w-4 text-${color}-400`} />
        )}
      </Button>
    );

    switch (fieldDisplay.value) {
      case 'url':
        const { display, tooltip } = formatUrl(value);
        return (
          <div className="relative group">
            <div className={cn(
              "px-3 py-1.5 rounded-md",
              "bg-blue-500/5 dark:bg-blue-400/5",
              "border border-blue-500/10 dark:border-blue-400/10",
              "text-blue-700 dark:text-blue-300",
              "flex items-center gap-2"
            )}>
              <Globe className="h-4 w-4 shrink-0 text-blue-400" />
              <a 
                href={value}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline underline-offset-4"
                title={tooltip}
              >
                {display}
              </a>
            </div>
            {renderCopyButton('blue')}
          </div>
        );

      case 'email':
        return (
          <div className="relative group">
            <div className={cn(
              "px-3 py-2 rounded-md",
              "bg-gradient-to-r from-purple-500/5 to-pink-500/5",
              "border border-purple-500/10",
              "text-purple-700 dark:text-purple-300",
              "flex items-center gap-2",
              "shadow-sm hover:shadow-md transition-shadow"
            )}>
              <div className="p-1.5 bg-purple-500/10 rounded-full">
                <Mail className="h-4 w-4 text-purple-500" />
              </div>
              <a 
                href={`mailto:${value}`}
                className="hover:text-purple-600 transition-colors"
              >
                {value}
              </a>
            </div>
            {renderCopyButton('purple')}
          </div>
        );

      case 'phone':
        const cleanPhone = value.replace(/\D/g, '');
        const formattedPhone = cleanPhone.replace(/(\d{3})(\d{3})(\d{4})/, '$1 $2 $3');
        return (
          <div className="relative group">
            <div className={cn(
              "px-4 py-2.5 rounded-lg",
              "bg-gradient-to-r from-teal-500/10 to-emerald-500/10",
              "border-l-4 border border-teal-500",
              "text-teal-700 dark:text-teal-300",
              "flex items-center gap-3",
              "shadow-lg shadow-teal-500/10",
              "hover:bg-gradient-to-r hover:from-teal-500/20 hover:to-emerald-500/20",
              "transition-all duration-300"
            )}>
        <div className={cn(
                "p-2 rounded-full",
                "bg-gradient-to-br from-teal-500 to-emerald-500",
                "shadow-md shadow-teal-500/20"
              )}>
                <div className="relative">
                  <Phone className="h-4 w-4 text-white animate-pulse" />
                  <div className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-green-400 animate-ping" />
                  <div className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-green-400" />
                </div>
        </div>
              <a 
                href={`tel:${cleanPhone}`}
              className={cn(
                  "font-mono text-lg tracking-wide",
                  "flex items-center gap-2",
                  "hover:text-teal-600 dark:hover:text-teal-400",
                  "transition-colors duration-300"
                )}
              >
                <span className="text-teal-500/60 text-sm font-semibold">+</span>
                {formattedPhone}
              </a>
            </div>
            <Button
              {...commonButtonProps}
              className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-teal-500/10"
            >
              {isCopied ? (
                <Check className="h-4 w-4 text-green-500" />
              ) : (
                <Copy className="h-4 w-4 text-teal-400" />
              )}
            </Button>
          </div>
        );

      case 'username':
        return (
          <div className="relative group">
            <div className={cn(
              "px-3 py-1.5 rounded-md",
              "bg-amber-500/5 dark:bg-amber-400/5",
              "border border-amber-500/10 dark:border-amber-400/10",
              "text-amber-700 dark:text-amber-300",
              "flex items-center gap-2"
            )}>
              <User className="h-4 w-4 shrink-0 text-amber-400" />
              <span className="font-medium">{value}</span>
            </div>
            {renderCopyButton('amber')}
          </div>
        );

      case 'password':
      case 'key':
        return (
          <div className="relative group">
            <div className={cn(
              "px-3 py-1.5 rounded-md",
              "bg-rose-500/5 dark:bg-rose-400/5",
              "border border-rose-500/10 dark:border-rose-400/10",
              "text-rose-700 dark:text-rose-300",
              "flex items-center gap-2",
              "font-mono"
            )}>
              <Key className="h-4 w-4 shrink-0 text-rose-400" />
              <span>{showSecretFields[fieldName] ? value : '••••••••'}</span>
            </div>
            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => toggleFieldVisibility(fieldName)}
                className="opacity-0 group-hover:opacity-100 transition-opacity"
              >
                {showSecretFields[fieldName] ? (
                  <EyeOff className="h-4 w-4 text-rose-400" />
                ) : (
                  <Eye className="h-4 w-4 text-rose-400" />
                )}
              </Button>
              {renderCopyButton('rose')}
        </div>
      </div>
        );
  
      case 'number':
        const formattedNumber = typeof value === 'string' ? value : value.toString();
        return (
          <div className="relative group">
            <div className={cn(
              "px-4 py-2.5 rounded-lg",
              "bg-gradient-to-br from-violet-500/10 via-purple-500/10 to-fuchsia-500/10",
              "border border-violet-500/50",
              "text-violet-700 dark:text-violet-300",
              "flex items-center gap-3",
              "shadow-md hover:shadow-lg transition-shadow duration-300"
            )}>
              <div className="p-2 bg-gradient-to-br from-violet-500 to-purple-500 rounded-full">
                <Hash className="h-4 w-4 text-white" />
              </div>
              <span className="font-mono text-lg tabular-nums tracking-[0.2em]">
                {formattedNumber.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
              </span>
            </div>
            {renderCopyButton('violet')}
          </div>
        );

      case 'text':
        return (
          <div className="relative group">
            <div className={cn(
              "px-4 py-2.5 rounded-lg",
              "bg-gradient-to-r from-blue-500/5 via-cyan-500/5 to-sky-500/5",
              "border-r-4 border border-blue-500",
              "text-blue-700 dark:text-blue-300",
              "flex items-center gap-3",
              "hover:bg-gradient-to-r hover:from-blue-500/10 hover:via-cyan-500/10 hover:to-sky-500/10",
              "transition-all duration-300"
            )}>
              <div className="p-2 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full">
                <Type className="h-4 w-4 text-white" />
              </div>
              <span className="leading-relaxed text-base">
                {value}
              </span>
            </div>
            {renderCopyButton('blue')}
          </div>
        );

      case 'wallet':
        const truncateWallet = (address) => {
          if (address.length <= 10) return address;
          return `${address.slice(0, 4)}...${address.slice(-4)}`;
        };

        return (
          <div className="relative group">
            <div className={cn(
              "px-4 py-2.5 rounded-lg",
              "bg-gradient-to-r from-orange-500/10 via-amber-500/10 to-yellow-500/10",
              "border-l-4 border border-orange-500",
              "text-orange-700 dark:text-orange-300",
              "flex items-center gap-3",
              "shadow-lg shadow-orange-500/10",
              "hover:bg-gradient-to-r hover:from-orange-500/20 hover:via-amber-500/20 hover:to-yellow-500/20",
              "transition-all duration-300"
            )}>
              <div className={cn(
                "p-2 rounded-full",
                "bg-gradient-to-br from-orange-500 to-amber-500",
                "shadow-md shadow-orange-500/20"
              )}>
                <Wallet className="h-4 w-4 text-white" />
              </div>
              <div className="flex flex-col">
        <span className={cn(
                  "font-mono text-lg tracking-wider",
                  "text-orange-700 dark:text-orange-300",
                  "hover:text-orange-600 dark:hover:text-orange-400",
                  "transition-colors duration-300"
                )}>
                  {truncateWallet(value)}
                </span>
                <span className="text-xs text-orange-600/60 dark:text-orange-400/60">
                  Click to copy full address
        </span>
              </div>
            </div>
            <Button
              {...commonButtonProps}
              className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-orange-500/10"
            >
              {isCopied ? (
                <Check className="h-4 w-4 text-green-500" />
              ) : (
                <Copy className="h-4 w-4 text-orange-400" />
              )}
            </Button>
          </div>
        );

      default:
        return (
          <div className="relative group">
            <div className={cn(
              "px-3 py-1.5 rounded-md",
              "bg-zinc-500/5 dark:bg-zinc-400/5",
              "border border-zinc-500/10 dark:border-zinc-400/10",
              "text-zinc-700 dark:text-zinc-300",
              "flex items-center gap-2"
            )}>
              <Type className="h-4 w-4 shrink-0 text-zinc-400" />
              <span>{value}</span>
            </div>
            {renderCopyButton('zinc')}
          </div>
        );
    }
  };

  return (
    <motion.div
      layout
      className={cn(
        "group relative rounded-lg border p-4",
        fieldDisplay.style,
        "transition-all duration-300"
      )}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className={cn(
            "shrink-0 rounded-md p-2",
            fieldDisplay.iconStyle
          )}>
            <fieldDisplay.icon className="h-4 w-4" />
          </div>
          <div>
            <span className="text-sm font-medium capitalize">
              {fieldName}
            </span>
            {fieldDisplay.badge && (
              <Badge 
                variant="outline" 
                className={cn("ml-2 text-[10px]", fieldDisplay.badgeStyle)}
              >
                {fieldDisplay.badge}
              </Badge>
            )}
          </div>
        </div>
      </div>

      <div className={cn(
        "relative",
        fieldDisplay.isSecret && !showSecretFields[fieldName] && "blur-sm select-none"
      )}>
        {renderFieldContent(fieldDisplay, fieldValue)}
    </div>
    </motion.div>
  );
}
