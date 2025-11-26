import React from 'react';
import { Persona } from '../types';
import PromptViewer from './PromptViewer';
import { Tag, User, Briefcase, Zap } from 'lucide-react';

interface PersonaDetailProps {
  persona: Persona;
}

const PersonaDetail: React.FC<PersonaDetailProps> = ({ persona }) => {
  const getCategoryColor = (cat: string) => {
    switch (cat) {
      case 'System': return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
      case 'Director': return 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400';
      case 'Specialist': return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'Tool': return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
      case 'Facilitator': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
      default: return 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400';
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
        <div>
           <div className="flex items-center gap-3 mb-2">
             <h1 className="text-3xl font-bold text-slate-900 dark:text-white">{persona.name}</h1>
             <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${getCategoryColor(persona.category)}`}>
               {persona.category}
             </span>
           </div>
           <div className="flex items-center text-slate-500 dark:text-slate-400 text-sm gap-2">
              <Briefcase className="w-4 h-4" />
              <span>{persona.role}</span>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <div className="flex items-center gap-2 mb-3 text-slate-900 dark:text-slate-100 font-semibold">
            <Zap className="w-4 h-4 text-amber-500" />
            <h2>Primary Goal</h2>
          </div>
          <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
            {persona.goal}
          </p>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
            <Tag className="w-4 h-4" />
            System Prompt Configuration
          </h2>
          <PromptViewer prompt={persona.prompt} />
        </div>
      </div>
    </div>
  );
};

export default PersonaDetail;