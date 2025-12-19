
export type ViewState = 'home' | 'dashboard' | 'learn' | 'lab' | 'challenges' | 'certificate' | 'settings' | 'library';

export interface User {
  name: string;
  rank: string;
  level: number;
  xp: number;
  completedModules: string[];
  skills: {
    offensive: number;
    defensive: number;
    networking: number;
    scripting: number;
    forensics: number;
  };
}

export interface CourseModule {
  id: string;
  title: string;
  category: 'Red Team' | 'Blue Team' | 'Purple Team';
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  description: string;
  content: string; // Markdown content
  labConfig?: {
    initialOutput: string;
    expectedCommand: string; // Simple validation for MVP
    successMessage: string;
    hint: string;
  };
}

export interface Challenge {
  id: string;
  title: string;
  points: number;
  difficulty: 'Easy' | 'Medium' | 'Hard' | 'Insane';
  description: string;
  category: string;
  solved: boolean;
}

export interface TerminalLine {
  type: 'input' | 'output' | 'error' | 'success' | 'system';
  content: string;
}

export interface ThemeSettings {
  primaryColor: string;
  fontFamily: string;
  mode: 'matrix' | 'cyberpunk' | 'terminal' | 'clean';
}
