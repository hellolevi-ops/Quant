
export enum StrategyStatus {
  RUNNING = 'RUNNING',
  PAUSED = 'PAUSED',
  STOPPED = 'STOPPED',
  BACKTESTING = 'BACKTESTING'
}

export interface MarketIndex {
  name: string;
  value: number;
  change: number;
  changePercent: number;
}

export interface Strategy {
  id: string;
  name: string;
  type: 'AI_GENERATED' | 'FOLLOW_COPY';
  roi: number;
  todayPnl: number;
  status: StrategyStatus;
  platform?: string; // For copy trading
  description?: string;
  code?: string;
  assets?: number;
  maxDD?: number;
}

export interface Signal {
  id: string;
  source: string;
  code: string;
  action: 'BUY' | 'SELL';
  price: number;
  timestamp: string;
  delayMs: number;
  status: 'PENDING' | 'EXECUTED' | 'REJECTED';
}

export interface ChatMessage {
  role: 'user' | 'model';
  content: string;
  steps?: string[]; // CoT steps
}

export interface Post {
  id: string;
  author: string;
  avatar?: string;
  title: string;
  content: string;
  image?: string; // New: Support for post images
  codeSnippet?: string; // New: Support for code sharing
  likes: number;
  comments: number;
  timestamp: string;
  tags: string[];
  isOfficial?: boolean;
}

export interface Comment {
  id: string;
  author: string;
  content: string;
  timestamp: string;
}

export interface DataSource {
  id: string;
  name: string;
  region: string;
  type: string;
  description: string;
  price: string;
  status: 'ACTIVE' | 'SUBSCRIBE';
  sampleData?: any[];
}

export type ModelProvider = 'GEMINI' | 'DEEPSEEK' | 'OPENAI';

export interface ApiKeyConfig {
  provider: ModelProvider;
  key: string;
  isActive: boolean;
}

export enum Page {
  DASHBOARD = 'DASHBOARD',
  WORKSHOP = 'WORKSHOP',
  SIGNAL_BRIDGE = 'SIGNAL_BRIDGE',
  MY_STRATEGIES = 'MY_STRATEGIES',
  DATA_CENTER = 'DATA_CENTER',
  COMMUNITY = 'COMMUNITY',
  LIVE_SETUP = 'LIVE_SETUP',
  PROFILE = 'PROFILE'
}
