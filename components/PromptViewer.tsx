import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';

interface PromptViewerProps {
  prompt: string;
}

const PromptViewer: React.FC<PromptViewerProps> = ({ prompt }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(prompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative group rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 mt-4 shadow-sm">
      <div className="flex items-center justify-between px-4 py-2 bg-slate-100 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
        <span className="text-xs font-mono font-medium text-slate-500 dark:text-slate-400">System Prompt</span>
        <button
          onClick={handleCopy}
          className="flex items-center space-x-1 text-xs text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400 transition-colors"
        >
          {copied ? (
            <>
              <Check className="w-3 h-3" />
              <span>Copied</span>
            </>
          ) : (
            <>
              <Copy className="w-3 h-3" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>
      <div className="p-4 overflow-x-auto max-h-[500px] text-sm font-mono text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">
        {prompt}
      </div>
    </div>
  );
};

export default PromptViewer;