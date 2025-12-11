

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
  
  // Extended metrics for detail view
  annualizedReturn?: number;
  sharpe?: number;
  volatility?: number;
  winRate?: number;
  profitFactor?: number;
  alpha?: number;
  beta?: number;
}

export interface Position {
  symbol: string;
  name: string;
  cost: number;
  price: number;
  quantity: number;
  marketValue: number;
  pnl: number;
  pnlPercent: number;
}

export interface Trade {
  id: string;
  time: string;
  symbol: string;
  name: string;
  action: 'BUY' | 'SELL';
  price: number;
  volume: number;
  fee: number;
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
  timestamp: string; // Display string
  tags: string[];
  isOfficial?: boolean;
  
  // Sorting fields
  views: number;
  createdAt: string; // ISO string for sorting
  lastReplyAt: string; // ISO string for sorting
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

export type ModelProvider = 'GEMINI' | 'DEEPSEEK' | 'OPENAI' | 'ANTHROPIC' | 'MISTRAL';

export interface ApiKeyConfig {
  provider: ModelProvider;
  key: string;
  isActive: boolean;
}

export interface ResearchReport {
  id: string;
  title: string;
  analyst: string;
  date: string;
  sector: string;
  summary?: string;
  content: string; // Mock content or PDF url
  aiAnalysis?: string;
  tags: string[];
  views: number;
}

export interface Factor {
  id: string;
  name: string;
  description: string;
  category: string;
  confidence: number;
}

export interface DockerConfig {
  provider: 'ALIYUN' | 'TENCENT' | 'AWS' | 'CUSTOM';
  host: string;
  port: string;
  authToken: string;
  brokerType: 'QMT' | 'PTRADE' | 'MINI_QMT';
  accountId: string;
  status: 'DISCONNECTED' | 'CONNECTING' | 'CONNECTED' | 'ERROR';
}

export interface StrategyTemplate {
  id: string;
  nameKey: string;
  descKey: string;
  prompt: string;
  code: string;
  tags: string[];
}

export enum Page {
  DASHBOARD = 'DASHBOARD',
  WORKSHOP = 'WORKSHOP',
  SIGNAL_BRIDGE = 'SIGNAL_BRIDGE',
  MY_STRATEGIES = 'MY_STRATEGIES',
  DATA_CENTER = 'DATA_CENTER',
  COMMUNITY = 'COMMUNITY',
  RESEARCH = 'RESEARCH',
  LIVE_SETUP = 'LIVE_SETUP',
  PROFILE = 'PROFILE',
  ADMIN_DASHBOARD = 'ADMIN_DASHBOARD'
}

export enum UserTier {
  FREE = 'FREE',
  GOLD = 'GOLD',
  DIAMOND = 'DIAMOND'
}

export type PaymentMethod = 'WECHAT' | 'ALIPAY';

export interface PointPackage {
  id: string;
  points: number;
  price: number;
  bonus?: number;
}

export type UserRole = 'USER' | 'ADMIN';
