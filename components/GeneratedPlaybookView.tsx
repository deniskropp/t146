
import React from 'react';
import { PlaybookData, Persona } from '../types';
import { Copy, Check, ArrowLeft, Download } from 'lucide-react';

interface GeneratedPlaybookViewProps {
  data: PlaybookData;
  selectedPersonas: Persona[];
  onBack: () => void;
}

const GeneratedPlaybookView: React.FC<GeneratedPlaybookViewProps> = ({ data, selectedPersonas, onBack }) => {
  const [copied, setCopied] = React.useState(false);

  // Generate the markdown content
  const generateMarkdown = () => {
    const parts = [
      `# Refined Meta-AI Playbook`,
      `\n## 1. Introduction\n${data.introduction.content}`,
      `\n## 2. Overall Team Goal\n${data.goal.content}`,
      `\n## 3. Orchestrator's Role\n${data.orchestrator.content}`,
      `\n## 4. Selected AI Assistant Roles`
    ];

    selectedPersonas.forEach((p, index) => {
      parts.push(`\n### 4.${index + 1}. ${p.name}`);
      parts.push(`* **Role:** ${p.role}`);
      parts.push(`* **Goal:** ${p.goal}`);
      if (p.prompt) {
        parts.push(`* **System Prompt:**\n\`\`\`\n${p.prompt}\n\`\`\``);
      }
    });

    parts.push(`\n## 5. Conclusion\nThis refined playbook serves as the focused operational guide for the selected subset of agents.`);

    return parts.join('\n');
  };

  const markdownContent = generateMarkdown();

  const handleCopy = () => {
    navigator.clipboard.writeText(markdownContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([markdownContent], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'refined-playbook.md';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-4xl mx-auto animate-fadeIn pb-12">
      <div className="flex items-center justify-between mb-6">
        <button 
          onClick={onBack}
          className="flex items-center text-sm font-medium text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back to Overview
        </button>
        <div className="flex gap-2">
          <button
            onClick={handleDownload}
            className="flex items-center px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors shadow-sm"
          >
            <Download className="w-4 h-4 mr-2" />
            Download MD
          </button>
          <button
            onClick={handleCopy}
            className="flex items-center px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium transition-colors shadow-sm"
          >
            {copied ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
            {copied ? 'Copied' : 'Copy Playbook'}
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
        <div className="p-8 prose prose-slate dark:prose-invert max-w-none">
          <pre className="whitespace-pre-wrap font-mono text-sm bg-transparent border-none p-0 m-0 text-slate-800 dark:text-slate-200">
            {markdownContent}
          </pre>
        </div>
      </div>
    </div>
  );
};

export default GeneratedPlaybookView;
