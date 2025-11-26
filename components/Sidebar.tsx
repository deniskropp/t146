
import React from 'react';
import { Persona } from '../types';
import { LayoutDashboard, Network, Users, CheckSquare, Square, FileText } from 'lucide-react';

interface SidebarProps {
  personas: Persona[];
  selectedId: string | null;
  onSelect: (id: string | null) => void;
  onViewGraph: () => void;
  viewMode: 'detail' | 'graph' | 'intro' | 'generated';
  setViewMode: (mode: 'detail' | 'graph' | 'intro' | 'generated') => void;
  selectedPersonaIds: Set<string>;
  onToggleSelection: (id: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  personas, 
  selectedId, 
  onSelect, 
  setViewMode, 
  viewMode,
  selectedPersonaIds,
  onToggleSelection
}) => {
  
  const groupedPersonas = personas.reduce((acc, persona) => {
    const cat = persona.category;
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(persona);
    return acc;
  }, {} as Record<string, Persona[]>);

  const categories = Object.keys(groupedPersonas).sort();

  const selectedCount = selectedPersonaIds.size;

  return (
    <div className="w-64 h-screen bg-white dark:bg-slate-950 border-r border-slate-200 dark:border-slate-800 flex flex-col fixed left-0 top-0 overflow-hidden z-20 shadow-xl md:shadow-none">
      <div className="p-6 border-b border-slate-100 dark:border-slate-900 flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-indigo-500/20">
          M
        </div>
        <span className="font-bold text-slate-900 dark:text-white tracking-tight">Meta-AI</span>
      </div>

      <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1 scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-slate-800">
        <button
          onClick={() => setViewMode('intro')}
          className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
            viewMode === 'intro'
              ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-900/20 dark:text-indigo-400'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900'
          }`}
        >
          <LayoutDashboard className="w-4 h-4" />
          Playbook Overview
        </button>
        
        <button
          onClick={() => setViewMode('graph')}
          className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all mb-6 ${
            viewMode === 'graph'
              ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-900/20 dark:text-indigo-400'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900'
          }`}
        >
          <Network className="w-4 h-4" />
          Network View
        </button>

        <div className="px-3 pt-4 pb-2 flex justify-between items-center">
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                <Users className="w-3 h-3" />
                Agents & Roles
            </h3>
            {selectedCount > 0 && (
              <span className="text-xs font-medium text-indigo-500 bg-indigo-50 dark:bg-indigo-900/30 px-1.5 py-0.5 rounded">
                {selectedCount} selected
              </span>
            )}
        </div>

        {categories.map(cat => (
          <div key={cat} className="mb-4">
            <h4 className="px-3 mb-2 text-xs font-medium text-slate-400 dark:text-slate-500">{cat}</h4>
            <div className="space-y-0.5">
              {groupedPersonas[cat].map(p => {
                const isChecked = selectedPersonaIds.has(p.id);
                return (
                  <div 
                    key={p.id}
                    className={`group flex items-center w-full px-2 py-1 rounded-md transition-colors border-l-2 ${
                      selectedId === p.id && viewMode === 'detail'
                        ? 'border-indigo-500 bg-slate-50 dark:bg-slate-900'
                        : 'border-transparent hover:bg-slate-50 dark:hover:bg-slate-900'
                    }`}
                  >
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleSelection(p.id);
                      }}
                      className="p-1.5 text-slate-400 hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors"
                      title={isChecked ? "Deselect" : "Select for playbook"}
                    >
                      {isChecked ? (
                        <CheckSquare className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                      ) : (
                        <Square className="w-4 h-4" />
                      )}
                    </button>
                    <button
                      onClick={() => {
                          onSelect(p.id);
                          setViewMode('detail');
                      }}
                      className={`flex-1 text-left py-1 text-sm ${
                        selectedId === p.id && viewMode === 'detail'
                          ? 'text-indigo-600 dark:text-indigo-400 font-medium'
                          : 'text-slate-600 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-slate-200'
                      }`}
                    >
                      {p.name}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950">
        <button
          onClick={() => setViewMode('generated')}
          disabled={selectedCount === 0}
          className={`w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all shadow-sm ${
            selectedCount > 0
              ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-500/25'
              : 'bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
          }`}
        >
          <FileText className="w-4 h-4" />
          Generate Playbook
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
