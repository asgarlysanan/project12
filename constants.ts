import { AppDefinition, FileDefinition } from "./types";

export const MOCK_APPS: AppDefinition[] = [
  { id: 'chrome', name: 'Google Chrome', category: 'browser', icon: '🌐', status: 'closed', cpuUsage: 0, memoryUsage: 0 },
  { id: 'spotify', name: 'Spotify', category: 'media', icon: '🎵', status: 'closed', cpuUsage: 0, memoryUsage: 0 },
  { id: 'vscode', name: 'Visual Studio Code', category: 'productivity', icon: '📝', status: 'running', cpuUsage: 5.2, memoryUsage: 450 },
  { id: 'telegram', name: 'Telegram Desktop', category: 'social', icon: '✈️', status: 'running', cpuUsage: 1.1, memoryUsage: 120 },
  { id: 'whatsapp', name: 'WhatsApp', category: 'social', icon: '💬', status: 'closed', cpuUsage: 0, memoryUsage: 0 },
  { id: 'explorer', name: 'File Explorer', category: 'system', icon: '📁', status: 'running', cpuUsage: 0.5, memoryUsage: 80 },
  { id: 'youtube_music', name: 'YouTube Music', category: 'media', icon: '▶️', status: 'closed', cpuUsage: 0, memoryUsage: 0 },
];

export const MOCK_FILES: FileDefinition[] = [
  { id: 'f1', name: 'Q3_Financial_Report.pdf', path: 'C:/Users/Admin/Documents', type: 'PDF', size: '2.4 MB', lastModified: '2023-10-25' },
  { id: 'f2', name: 'Project_Alpha_Specs.docx', path: 'C:/Users/Admin/Documents/Projects', type: 'DOCX', size: '1.1 MB', lastModified: '2023-11-02' },
  { id: 'f3', name: 'holiday_photos_backup.zip', path: 'D:/Backups', type: 'ZIP', size: '4.2 GB', lastModified: '2023-09-15' },
  { id: 'f4', name: 'main.py', path: 'C:/Dev/Python/Bot', type: 'PYTHON', size: '4 KB', lastModified: '2023-11-05' },
  { id: 'f5', name: 'budget_2024.xlsx', path: 'C:/Users/Admin/Desktop', type: 'XLSX', size: '45 KB', lastModified: '2023-11-06' },
];

export const INITIAL_BOOT_LOGS = [
  "Initializing Secure Core...",
  "Verifying Environment Keys...",
  "Mounting Virtual File System...",
  "Scanning Registry for Applications...",
  "Indexing User Documents...",
  "Calibrating Microphone Input...",
  "Establishing Neural Link...",
  "System Ready."
];
