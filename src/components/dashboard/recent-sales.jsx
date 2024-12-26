import { Avatar, AvatarFallback } from "../ui/avatar";
import { formatDistanceToNow } from 'date-fns';
import { Lock, Mail, Hash, Key, Link, Code, User, Calendar, Phone, AlignLeft, Eye, EyeOff, Copy, Terminal, Clock, Globe, Smartphone } from "lucide-react";
import { toast } from "sonner";

export function RecentSales({ items = [] }) {
  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success("Copied to clipboard!");
    } catch (err) {
      toast.error("Failed to copy");
    }
  };

  const renderFieldValue = (key, value, type = 'text') => {
    const lowerKey = key.toLowerCase();
    
    // Password field
    if (type === 'password' || lowerKey.includes('password')) {
      return (
        <div className="group/field relative">
          <div className="flex items-center gap-2 bg-gradient-to-r from-amber-500/10 to-red-500/10 rounded-lg p-2 border border-amber-200/20">
            <Lock className="h-4 w-4 text-amber-500" />
            <span className="font-mono text-xs flex-1">{'•'.repeat(8)}</span>
            <button
              onClick={() => copyToClipboard(value)}
              className="text-muted-foreground hover:text-amber-500 transition-colors opacity-0 group-hover/field:opacity-100"
            >
              <Copy className="h-4 w-4" />
            </button>
          </div>
          <div className="absolute left-1/2 -translate-x-1/2 -top-7 bg-amber-500 text-white text-xs rounded-md px-2 py-1 opacity-0 group-hover/field:opacity-100 transition-opacity whitespace-nowrap">
            {key}
          </div>
        </div>
      );
    }
    
    // Code field
    if (type === 'code') {
      return (
        <div className="group/field relative">
          <div className="bg-gradient-to-r from-green-500/10 to-blue-500/10 rounded-lg border border-green-200/20">
            <div className="flex items-center justify-between px-3 py-2 border-b border-green-200/20">
              <div className="flex items-center gap-2">
                <Terminal className="h-4 w-4 text-green-500" />
                <span className="text-xs text-green-500 font-medium">{key}</span>
              </div>
              <button
                onClick={() => copyToClipboard(value)}
                className="text-muted-foreground hover:text-green-500 transition-colors opacity-0 group-hover/field:opacity-100"
              >
                <Copy className="h-4 w-4" />
              </button>
            </div>
            <pre className="p-2 text-xs font-mono overflow-x-auto max-w-[200px] truncate">
              {value.toString()}
            </pre>
          </div>
        </div>
      );
    }
    
    // API Key field
    if (type === 'key') {
      return (
        <div className="group/field relative">
          <div className="flex items-center gap-2 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-lg p-2 border border-purple-200/20">
            <Key className="h-4 w-4 text-purple-500" />
            <span className="font-mono text-xs flex-1 truncate max-w-[150px]">{value.toString()}</span>
            <button
              onClick={() => copyToClipboard(value)}
              className="text-muted-foreground hover:text-purple-500 transition-colors opacity-0 group-hover/field:opacity-100"
            >
              <Copy className="h-4 w-4" />
            </button>
          </div>
          <div className="absolute left-1/2 -translate-x-1/2 -top-7 bg-purple-500 text-white text-xs rounded-md px-2 py-1 opacity-0 group-hover/field:opacity-100 transition-opacity whitespace-nowrap">
            {key}
          </div>
        </div>
      );
    }
    
    // Email field
    if (type === 'email' || lowerKey.includes('email')) {
      return (
        <div className="group/field relative">
          <a 
            href={`mailto:${value}`}
            className="flex items-center gap-2 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 hover:to-cyan-500/20 rounded-lg p-2 border border-blue-200/20 transition-colors"
          >
            <div className="bg-blue-500/10 rounded-full p-1">
              <Mail className="h-3 w-3 text-blue-500" />
            </div>
            <span className="text-xs text-blue-500 truncate max-w-[150px]">{value.toString()}</span>
          </a>
          <div className="absolute left-1/2 -translate-x-1/2 -top-7 bg-blue-500 text-white text-xs rounded-md px-2 py-1 opacity-0 group-hover/field:opacity-100 transition-opacity whitespace-nowrap">
            {key}
          </div>
        </div>
      );
    }
    
    // URL field
    if (type === 'url' || lowerKey.includes('url') || lowerKey.includes('website')) {
      return (
        <div className="group/field relative">
          <a 
            href={value}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 bg-gradient-to-r from-indigo-500/10 to-blue-500/10 hover:to-blue-500/20 rounded-lg p-2 border border-indigo-200/20 transition-colors"
          >
            <div className="bg-indigo-500/10 rounded-full p-1">
              <Globe className="h-3 w-3 text-indigo-500" />
            </div>
            <span className="text-xs text-indigo-500 truncate max-w-[150px]">{value.toString()}</span>
          </a>
          <div className="absolute left-1/2 -translate-x-1/2 -top-7 bg-indigo-500 text-white text-xs rounded-md px-2 py-1 opacity-0 group-hover/field:opacity-100 transition-opacity whitespace-nowrap">
            {key}
          </div>
        </div>
      );
    }
    
    // Phone field
    if (type === 'phone' || lowerKey.includes('phone') || lowerKey.includes('tel')) {
      return (
        <div className="group/field relative">
          <a 
            href={`tel:${value}`}
            className="flex items-center gap-2 bg-gradient-to-r from-green-500/10 to-emerald-500/10 hover:to-emerald-500/20 rounded-lg p-2 border border-green-200/20 transition-colors"
          >
            <div className="bg-green-500/10 rounded-full p-1">
              <Smartphone className="h-3 w-3 text-green-500" />
            </div>
            <span className="text-xs text-green-500">{value.toString()}</span>
          </a>
          <div className="absolute left-1/2 -translate-x-1/2 -top-7 bg-green-500 text-white text-xs rounded-md px-2 py-1 opacity-0 group-hover/field:opacity-100 transition-opacity whitespace-nowrap">
            {key}
          </div>
        </div>
      );
    }

    // Date/Time field
    if (type === 'date' || type === 'time' || type === 'datetime' || lowerKey.includes('date') || lowerKey.includes('time')) {
      return (
        <div className="group/field relative">
          <div className="flex items-center gap-2 bg-gradient-to-r from-orange-500/10 to-yellow-500/10 rounded-lg p-2 border border-orange-200/20">
            <div className="bg-orange-500/10 rounded-full p-1">
              <Clock className="h-3 w-3 text-orange-500" />
            </div>
            <span className="text-xs text-orange-500">{value.toString()}</span>
          </div>
          <div className="absolute left-1/2 -translate-x-1/2 -top-7 bg-orange-500 text-white text-xs rounded-md px-2 py-1 opacity-0 group-hover/field:opacity-100 transition-opacity whitespace-nowrap">
            {key}
          </div>
        </div>
      );
    }
    
    // Default field display
    return (
      <div className="group/field relative">
        <div className="flex items-center gap-2 bg-gradient-to-r from-gray-500/10 to-slate-500/10 rounded-lg p-2 border border-gray-200/20">
          <div className="bg-gray-500/10 rounded-full p-1">
            <Hash className="h-3 w-3 text-gray-500" />
          </div>
          <span className="text-xs truncate max-w-[150px]">{value.toString()}</span>
        </div>
        <div className="absolute left-1/2 -translate-x-1/2 -top-7 bg-gray-500 text-white text-xs rounded-md px-2 py-1 opacity-0 group-hover/field:opacity-100 transition-opacity whitespace-nowrap">
          {key}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {items.slice(0, 5).map((item, index) => {
        const title = Object.entries(item.fields || {}).length > 0 
          ? Object.entries(item.fields)[0][1].toString()
          : item.name || `Item #${index + 1}`;
          
        return (
          <div 
            key={item.id} 
            className="relative bg-gradient-to-br from-background via-background to-muted/20 hover:to-muted/30 rounded-xl p-4 transition-all duration-200 border border-border/50"
          >
            <div className="flex items-center gap-4">
              <Avatar className="h-10 w-10 ring-2 ring-primary/10 ring-offset-2 ring-offset-background">
                <AvatarFallback className="bg-gradient-to-br from-primary/20 to-primary/10 text-primary font-medium">
                  {title.charAt(0)?.toUpperCase() || '#'}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1 space-y-2">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium leading-none">{title}</p>
                  <div className="flex items-center gap-2">
                    <div className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(item.createdAt), { addSuffix: true })}
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  {Object.entries(item.fields || {}).slice(1).map(([key, value]) => 
                    <div key={key}>
                      {renderFieldValue(key, value, item.fields[key]?.type)}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
