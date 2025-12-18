export enum SystemStatus {
  BOOTING = 'BOOTING',
  SCANNING = 'SCANNING',
  READY = 'READY',
  PROCESSING = 'PROCESSING',
  ERROR = 'ERROR'
}

export interface AppDefinition {
  id: string;
  name: string;
  category: 'social' | 'media' | 'productivity' | 'system' | 'browser';
  icon: string; // URL or emoji
  status: 'running' | 'closed';
  cpuUsage: number; // Percentage
  memoryUsage: number; // MB
}

export interface FileDefinition {
  id: string;
  name: string;
  path: string;
  type: string;
  size: string;
  lastModified: string;
}

export interface SystemStats {
  cpu: number;
  memory: number;
  battery: number;
  network: 'Online' | 'Offline';
  networkSpeed: string;
}

export interface LogEntry {
  id: string;
  timestamp: number;
  source: 'SYSTEM' | 'USER' | 'AI';
  message: string;
  type: 'info' | 'success' | 'warning' | 'error' | 'action';
}

export enum AIActionType {
  OPEN_APP = 'OPEN_APP',
  CLOSE_APP = 'CLOSE_APP',
  SEARCH_FILES = 'SEARCH_FILES',
  SYSTEM_DIAGNOSTIC = 'SYSTEM_DIAGNOSTIC',
  GENERAL_CHAT = 'GENERAL_CHAT',
  OPTIMIZE_PERFORMANCE = 'OPTIMIZE_PERFORMANCE'
}

export interface AIResponse {
  action: AIActionType;
  target?: string;
  confidence: number;
  responseText: string;
  reasoning?: string;
}
