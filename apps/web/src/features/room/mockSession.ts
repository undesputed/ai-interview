/**
 * Mock session data for the interview room UI.
 * Replace with real session fetch once the api ships the session model.
 */

export type AIMode = 'active' | 'copilot' | 'spectator';
export type ParticipantState = 'speaking' | 'thinking' | 'muted' | 'idle';

export interface MockParticipant {
  id: string;
  name: string;
  role: 'candidate' | 'interviewer' | 'ai';
  initials: string;
  state: ParticipantState;
}

export interface MockNudge {
  id: string;
  /** mm:ss timestamp inside the session */
  at: string;
  /** Short signal source for the eyebrow line */
  signal: string;
  /** Italic editorial body — what the AI is saying to the host */
  message: string;
  /** When true, surfaces the "why" rationale */
  rationale?: string;
  dismissed?: boolean;
}

export interface MockTranscriptLine {
  id: string;
  at: string;
  speaker: 'candidate' | 'interviewer' | 'ai';
  text: string;
}

export interface MockQuestion {
  number: number;
  text: string;
  status: 'asked' | 'current' | 'upcoming';
  followups?: number;
}

export interface MockSession {
  id: string;
  candidate: MockParticipant;
  interviewer: MockParticipant;
  ai: MockParticipant;
  /** Role being interviewed for */
  roleTitle: string;
  language: string;
  /** Total duration in seconds */
  durationSec: number;
  /** Elapsed in seconds at "now" — used to seed timer */
  elapsedSec: number;
  aiMode: AIMode;
  connection: 'excellent' | 'good' | 'fair' | 'poor';
  questions: MockQuestion[];
  nudges: MockNudge[];
  transcript: MockTranscriptLine[];
}

export const MOCK_SESSION: MockSession = {
  id: 'sess_01h9k2x3',
  roleTitle: 'Senior Product Designer · Manila',
  language: 'en-PH',
  durationSec: 45 * 60,
  elapsedSec: 32 * 60 + 14,
  aiMode: 'copilot',
  connection: 'excellent',
  candidate: {
    id: 'p_cand',
    name: 'Jamie Rivera',
    role: 'candidate',
    initials: 'JR',
    state: 'thinking',
  },
  interviewer: {
    id: 'p_self',
    name: 'Carrie Yu',
    role: 'interviewer',
    initials: 'CY',
    state: 'idle',
  },
  ai: {
    id: 'p_ai',
    name: 'molave',
    role: 'ai',
    initials: 'm',
    state: 'idle',
  },
  questions: [
    {
      number: 1,
      text: 'Walk me through how you decide what *not* to design.',
      status: 'asked',
      followups: 2,
    },
    {
      number: 2,
      text: 'Tell me about a project where the brief was wrong.',
      status: 'asked',
      followups: 1,
    },
    {
      number: 3,
      text: 'Describe a moment a quieter teammate changed your mind.',
      status: 'current',
      followups: 0,
    },
    { number: 4, text: 'How do you choose between two reasonable rubrics?', status: 'upcoming' },
    {
      number: 5,
      text: 'What does “patient” mean inside a 45-minute interview?',
      status: 'upcoming',
    },
    { number: 6, text: 'Show me a piece of work you’d rebuild today.', status: 'upcoming' },
    {
      number: 7,
      text: 'When was the last time the room remembered what you forgot?',
      status: 'upcoming',
    },
    {
      number: 8,
      text: 'What would you want a future interviewer to know about you?',
      status: 'upcoming',
    },
  ],
  nudges: [
    {
      id: 'n_03',
      at: '32:12',
      signal: 'composing · 3 signals agree',
      message: 'She has more to say. Give her a few seconds.',
      rationale: 'Pause length · eye direction · mouth state',
    },
    {
      id: 'n_02',
      at: '24:47',
      signal: 'energy · 2 signals agree',
      message: 'Energy dropping. A short pause might help.',
    },
    {
      id: 'n_01',
      at: '11:08',
      signal: 'composure · charitable read',
      message: 'Considering, not confused.',
      rationale: 'Default applied — signals were ambiguous.',
    },
  ],
  transcript: [
    {
      id: 't1',
      at: '31:42',
      speaker: 'interviewer',
      text: 'Tell me about a moment a quieter teammate changed your mind.',
    },
    {
      id: 't2',
      at: '31:51',
      speaker: 'candidate',
      text: 'Hmm. There was an engineer on the previous launch — Maya — who almost never spoke up in design crits. She wrote things down instead.',
    },
    {
      id: 't3',
      at: '32:07',
      speaker: 'candidate',
      text: 'I had this whole flow mapped out, and after the meeting she sent me three lines that just… reframed the whole problem.',
    },
    {
      id: 't4',
      at: '32:14',
      speaker: 'candidate',
      text: '…',
    },
  ],
};
