import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"
 
export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

export const formatCodeBlock = (code) => {
  if (!code) return '';
  
  // Handle different line endings and remove extra spaces
  const normalizedCode = code
    .replace(/\r\n/g, '\n')
    .replace(/\s+/g, ' ')
    .trim();
  
  // Split commands and format
  return normalizedCode
    .split(/(?:[;&]|\s+(?=nano|chmod|bash|ps|ssh))/g)
    .map(line => line.trim())
    .filter(Boolean)
    .join('\n');
};
