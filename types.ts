export interface GeneratedImage {
  url: string;
  timestamp: number;
  prompt: string;
}

export enum AppState {
  IDLE = 'IDLE',
  UPLOADING = 'UPLOADING',
  GENERATING = 'GENERATING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR',
}

export type AspectRatio = '1:1' | '9:16' | '16:9' | '3:4' | '4:3' | 'custom';

export interface Dimensions {
  width: number;
  height: number;
}

export enum GenerationMode {
  SCENE = 'SCENE',     // Generate background/scene
  EDIT = 'EDIT',       // Instruction based edit
  MATTING = 'MATTING', // White background isolation
}

export interface PresetStyle {
  id: string;
  name: string;
  category: string; // Category for grouping
  prompts: string[]; // Changed from single prompt to array for "refresh" feature
  color: string;
}
