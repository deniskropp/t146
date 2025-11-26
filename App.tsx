
import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import PersonaDetail from './components/PersonaDetail';
import RoleGraph from './components/RoleGraph';
import GeneratedPlaybookView from './components/GeneratedPlaybookView';
import { PLAYBOOK_DATA } from './constants';
import { Menu, X, ArrowRight, BookOpen, Target, Cpu } from 'lucide-react';

const App: React.FC = () => {
  const [selectedPersonaId, setSelectedPersonaId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'detail' | 'graph' | 'intro' | 'generated'>('intro');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // State for subset selection
  const [selectedPersonaIds, setSelectedPersonaIds] = useState<Set<string>>(new Set());

  const selectedPersona = PLAYBOOK_DATA.personas.find(p => p.id === selectedPersonaId);

  const handleSelectPersona = (id: string | null) => {
    setSelectedPersonaId(id);
    setViewMode('detail');
    setIsMobileMenuOpen(false);
  };

  const togglePersonaSelection = (id: string) => {
    setSelectedPersonaIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const getSelectedPersonasForGeneration = () => {
    return PLAYBOOK_DATA.personas.filter(p => selectedPersonaIds.has(p.id));
  };

  const IntroView = () => (
    <div className="space-y-8 max-w-4xl mx-auto animate-fadeIn pb-12">
      <div className="text-center py-12">
        <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-4">
          Meta-AI Playbook
        </h1>
        <p className="text-xl text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">
          Operational framework for the Aetheric Pipe Network's collaborative human-AI team.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow">
          <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400 mb-4">
            <BookOpen className="w-5 h-5" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{PLAYBOOK_DATA.introduction.title}</h2>
          <p className="text-slate-600 dark:text-slate-300">{PLAYBOOK_DATA.introduction.content}</p>
        </div>

        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow">
          <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-purple-600 dark:text-purple-400 mb-4">
            <Target className="w-5 h-5" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{PLAYBOOK_DATA.goal.title}</h2>
          <p className="text-slate-600 dark:text-slate-300">{PLAYBOOK_DATA.goal.content}</p>
        </div>
      </div>

      <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-2xl p-8 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4">
             <Cpu className="w-6 h-6 text-indigo-400" />
             <h2 className="text-2xl font-bold">Orchestration & Roles</h2>
          </div>
          <p className="text-slate-300 mb-6 max-w-2xl">
            {PLAYBOOK_DATA.orchestrator.content.split('\n')[0]}
          </p>
          <button 
            onClick={() => setViewMode('graph')}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-slate-900 rounded-lg font-semibold hover:bg-indigo-50 transition-colors"
          >
            Explore Network <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans">
      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 w-full z-30 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 p-4 flex justify-between items-center">
        <span className="font-bold text-lg">Meta-AI Playbook</span>
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2">
          {isMobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Sidebar - Desktop & Mobile */}
      <div className={`fixed inset-0 z-40 transition-transform transform md:translate-x-0 ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:w-64`}>
         <Sidebar 
           personas={PLAYBOOK_DATA.personas} 
           selectedId={selectedPersonaId} 
           onSelect={handleSelectPersona}
           viewMode={viewMode}
           setViewMode={(mode) => {
             setViewMode(mode);
             setIsMobileMenuOpen(false);
           }}
           onViewGraph={() => {
             setViewMode('graph');
             setIsMobileMenuOpen(false);
           }}
           selectedPersonaIds={selectedPersonaIds}
           onToggleSelection={togglePersonaSelection}
         />
      </div>

      {/* Main Content */}
      <main className="md:ml-64 min-h-screen p-6 md:p-12 pt-20 md:pt-12 transition-all">
        {viewMode === 'intro' && <IntroView />}
        
        {viewMode === 'graph' && (
          <div className="h-[calc(100vh-6rem)] animate-fadeIn">
             <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-white">Role Topology</h2>
             <RoleGraph 
               personas={PLAYBOOK_DATA.personas} 
               onSelectPersona={handleSelectPersona}
               selectedId={selectedPersonaId || undefined}
               highlightedIds={selectedPersonaIds.size > 0 ? selectedPersonaIds : undefined}
             />
             <p className="mt-4 text-center text-slate-500 text-sm">
               {selectedPersonaIds.size > 0 
                 ? "Highlighting selected agents from the subset." 
                 : "Interactive visualization of system nodes. Drag nodes to rearrange."}
             </p>
          </div>
        )}

        {viewMode === 'detail' && selectedPersona && (
          <PersonaDetail persona={selectedPersona} />
        )}
        
        {viewMode === 'detail' && !selectedPersona && (
           <div className="flex items-center justify-center h-full text-slate-400">
             <p>Select a persona from the sidebar to view details.</p>
           </div>
        )}

        {viewMode === 'generated' && (
          <GeneratedPlaybookView 
            data={PLAYBOOK_DATA} 
            selectedPersonas={getSelectedPersonasForGeneration()} 
            onBack={() => setViewMode('intro')}
          />
        )}
      </main>
    </div>
  );
};

export default App;
