export type RoleCategory = 'System' | 'Specialist' | 'Director' | 'Tool' | 'Facilitator' | 'Creative' | 'Other';

export interface Persona {
  id: string;
  name: string;
  role: string;
  goal: string;
  prompt: string;
  category: RoleCategory;
  relationships?: string[]; // IDs of related personas
}

export interface Section {
  id: string;
  title: string;
  content: string; // Markdown or plain text
}

export interface PlaybookData {
  introduction: Section;
  goal: Section;
  orchestrator: Section;
  personas: Persona[];
}