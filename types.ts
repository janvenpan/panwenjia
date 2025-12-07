export enum GameMode {
  ADDITION = 'ADDITION',
  SUBTRACTION = 'SUBTRACTION',
  STORY = 'STORY'
}

export interface GameState {
  score: number;
  streak: number;
  currentMode: GameMode;
}

export interface Question {
  id: string;
  questionText: string;
  formulaDisplay: string;
  correctAnswer: number;
  options: number[];
  feedback?: string;
}

export interface StoryResponse {
  storyContext: string;
  question: string;
  correctAnswer: number;
  wrongOptions: number[];
  explanation: string;
}
