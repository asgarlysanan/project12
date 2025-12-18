import React, { useState, useEffect, useCallback } from 'react';
import { SystemStatus, AppDefinition, FileDefinition, SystemStats, LogEntry, AIActionType } from './types';
import { MOCK_APPS, MOCK_FILES } from './constants';
import { interpretCommand } from './services/geminiService';
import SystemBoot from './components/SystemBoot';
import AppGrid from './components/AppGrid';
import SystemMonitor from './components/SystemMonitor';
import VoiceInput from './components/VoiceInput';
import ActivityFeed from './components/ActivityFeed';

const App: React.FC = () => {
  const [status, setStatus] = useState<SystemStatus>(SystemStatus.BOOTING);
  const [apps, setApps] = useState<AppDefinition[]>(MOCK_APPS);
  const [files, setFiles] = useState<FileDefinition[]>(MOCK_FILES);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Simulated System Stats
  const [stats, setStats] = useState<SystemStats>({
    cpu: 12,
    memory: 4096,
    battery: 1, // 100%
    network: 'Online',
    networkSpeed: '450 Mbps'
  });

  // Battery API Simulation / Real Access
  useEffect(() => {
    // @ts-ignore
    if (navigator.getBattery) {
      // @ts-ignore
      navigator.getBattery().then((battery) => {
        setStats(prev => ({ ...prev, battery: battery.level }));
        battery.addEventListener('levelchange', () => {
             setStats(prev => ({ ...prev, battery: battery.level }));
        });
      });
    }
  }, []);

  // Proactive CPU/Mem Simulation
  useEffect(() => {
    if (status !== SystemStatus.READY) return;

    const interval = setInterval(() => {
      setStats(prev => {
        const loadFactor = apps.filter(a => a.status === 'running').length;
        const newCpu = Math.min(100, Math.max(2, prev.cpu + (Math.random() * 10 - 5) + (loadFactor * 2)));
        const newMem = Math.min(16000, Math.max(2000, prev.memory + (Math.random() * 200 - 100)));
        
        // Proactive Alert Logic
        if (newCpu > 85 && prev.cpu <= 85) {
            addLog('SYSTEM', 'Warning: High CPU usage detected. Optimizing background threads...', 'warning');
        }
        
        return { ...prev, cpu: newCpu, memory: newMem };
      });
    }, 3000);

    return () => clearInterval(interval);
  }, [status, apps]);

  const addLog = useCallback((source: 'SYSTEM' | 'USER' | 'AI', message: string, type: LogEntry['type'] = 'info') => {
    const newLog: LogEntry = {
      id: Math.random().toString(36).substr(2, 9),
      timestamp: Date.now(),
      source,
      message,
      type
    };
    setLogs(prev => [...prev, newLog]);
  }, []);

  const executeAction = (action: AIActionType, target?: string, responseText?: string) => {
    if (responseText) addLog('AI', responseText, 'success');

    switch (action) {
      case AIActionType.OPEN_APP:
        if (target) {
          setApps(prev => prev.map(app => {
            if (app.name.toLowerCase().includes(target.toLowerCase())) {
              return { ...app, status: 'running' };
            }
            return app;
          }));
        }
        break;
      case AIActionType.CLOSE_APP:
        if (target) {
          setApps(prev => prev.map(app => {
            if (app.name.toLowerCase().includes(target.toLowerCase())) {
              return { ...app, status: 'closed' };
            }
            return app;
          }));
        }
        break;
      case AIActionType.OPTIMIZE_PERFORMANCE:
        setStats(prev => ({ ...prev, cpu: Math.max(10, prev.cpu - 30) }));
        addLog('SYSTEM', 'Performance optimization complete. Freed 1.2GB RAM.', 'info');
        break;
      case AIActionType.SEARCH_FILES:
         if (target) {
             const found = files.filter(f => f.name.toLowerCase().includes(target.toLowerCase()));
             if (found.length > 0) {
                 addLog('SYSTEM', `Found ${found.length} files matching "${target}": ${found.map(f => f.name).join(', ')}`, 'info');
             } else {
                 addLog('SYSTEM', `No files found matching "${target}".`, 'warning');
             }
         }
         break;
      case AIActionType.SYSTEM_DIAGNOSTIC:
         addLog('SYSTEM', `Diagnostic Report: CPU ${Math.round(stats.cpu)}% | MEM ${Math.round(stats.memory/1024)}GB | BAT ${Math.round(stats.battery*100)}%`, 'info');
         break;
      default:
        break;
    }
  };

  const handleCommand = async (text: string) => {
    addLog('USER', text);
    setIsProcessing(true);
    
    // Simulate slight "thinking" delay for realism
    setTimeout(async () => {
        const response = await interpretCommand(text, apps, files);
        executeAction(response.action, response.target, response.responseText);
        setIsProcessing(false);
    }, 1000);
  };

  if (status === SystemStatus.BOOTING || status === SystemStatus.SCANNING) {
    return <SystemBoot onComplete={() => setStatus(SystemStatus.READY)} />;
  }

  return (
    <div className="min-h-screen bg-[url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop')] bg-cover bg-center">
      <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"></div>
      
      <div className="relative z-10 container mx-auto p-4 h-screen flex flex-col gap-4">
        {/* Header */}
        <header className="flex justify-between items-center py-2 px-4 glass-panel rounded-lg">
          <div className="flex items-center gap-3">
             <div className="w-8 h-8 rounded bg-cyan-500/20 flex items-center justify-center text-cyan-400">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>
             </div>
             <div>
                 <h1 className="font-bold text-slate-100 tracking-wide">NEURAL OS</h1>
                 <p className="text-[10px] text-cyan-500 uppercase tracking-wider">System Active • Monitoring</p>
             </div>
          </div>
          <div className="flex gap-4 text-xs font-mono text-slate-400">
             <div>BUILD 9.4.2</div>
             <div>SECURE LINK: ESTABLISHED</div>
          </div>
        </header>

        {/* Main Grid */}
        <main className="flex-1 grid grid-cols-1 md:grid-cols-12 gap-4 min-h-0">
          
          {/* Left: App Grid */}
          <div className="md:col-span-3 h-full min-h-0">
             <AppGrid apps={apps} />
          </div>

          {/* Center: Activity/Chat */}
          <div className="md:col-span-6 h-full flex flex-col gap-4 min-h-0">
             <div className="flex-1 min-h-0">
                <ActivityFeed logs={logs} />
             </div>
             <VoiceInput onSendMessage={handleCommand} isProcessing={isProcessing} />
          </div>

          {/* Right: Stats & Info */}
          <div className="md:col-span-3 flex flex-col gap-4">
             <SystemMonitor stats={stats} />
             
             {/* File Browser Preview */}
             <div className="glass-panel rounded-xl p-4 flex-1">
                <h2 className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-4 border-b border-slate-700 pb-2">
                   Recent Files
                </h2>
                <div className="space-y-3">
                    {files.slice(0, 5).map(f => (
                        <div key={f.id} className="flex items-center gap-3 text-sm group cursor-pointer">
                            <span className="text-slate-500 group-hover:text-cyan-400">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                            </span>
                            <div className="flex flex-col min-w-0">
                                <span className="text-slate-300 truncate group-hover:text-white transition-colors">{f.name}</span>
                                <span className="text-[10px] text-slate-600">{f.size} • {f.path}</span>
                            </div>
                        </div>
                    ))}
                </div>
             </div>
          </div>

        </main>
      </div>
    </div>
  );
};

export default App;