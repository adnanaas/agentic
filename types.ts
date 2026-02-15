
export interface CodeExample {
  language: string;
  code: string;
  explanation: string;
  expectedOutput: string;
}

export interface AIResponse {
  title: string;
  introduction: string;
  coreConcepts: string[];
  examples: CodeExample[];
  summary: string;
}

export enum LoadingStatus {
  IDLE = 'IDLE',
  LOADING = 'LOADING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR'
}
