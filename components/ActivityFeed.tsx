import React, { useEffect, useRef } from 'react';
import { LogEntry } from '../types';

interface ActivityFeedProps {
  logs: LogEntry[];
}

const ActivityFeed: React.FC<ActivityFeedProps> = ({ logs }) => {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  return (
    <div className="glass-panel rounded-xl flex flex-col h-full overflow-hidden">
        <div className="p-4 border-b border-slate-700 bg-slate-900/50">
            <h2 className="text-slate-400 text-xs font-bold uppercase tracking-wider flex justify-between items-center">
                <span>Neural Activity Log</span>
                <span className="text-cyan-500 text-[10px] bg-cyan-950/50 px-2 py-0.5 rounded border border-cyan-900">LIVE</span>
            </h2>
        </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {logs.map((log) => (
          <div 
            key={log.id} 
            className={`
                flex flex-col animate-fade-in
                ${log.source === 'USER' ? 'items-end' : 'items-start'}
            `}
          >
            <div className={`
                max-w-[80%] rounded-xl p-3 text-sm
                ${log.source === 'USER' 
                    ? 'bg-slate-700 text-slate-100 rounded-tr-sm' 
                    : log.type === 'action' 
                        ? 'bg-cyan-950/40 border border-cyan-500/20 text-cyan-100 rounded-tl-sm' 
                        : 'bg-slate-800/60 text-slate-300 rounded-tl-sm'
                }
            `}>
                {log.source === 'AI' && (
                    <div className="flex items-center gap-2 mb-1 text-xs font-bold text-cyan-500 uppercase">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                        Neural Core
                    </div>
                )}
                {log.message}
            </div>
            <span className="text-[10px] text-slate-600 mt-1 px-1">
                {new Date(log.timestamp).toLocaleTimeString()}
            </span>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>
    </div>
  );
};

export default ActivityFeed;