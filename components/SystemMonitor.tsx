import React, { useEffect, useState } from 'react';
import { SystemStats } from '../types';

interface SystemMonitorProps {
  stats: SystemStats;
}

const SystemMonitor: React.FC<SystemMonitorProps> = ({ stats }) => {
  // SVG Gauge Component
  const Gauge = ({ value, label, color }: { value: number; label: string; color: string }) => {
    const circumference = 2 * Math.PI * 16;
    const offset = circumference - (value / 100) * circumference;
    
    return (
      <div className="flex flex-col items-center">
        <div className="relative w-16 h-16">
          <svg className="w-full h-full transform -rotate-90">
            <circle cx="32" cy="32" r="16" stroke="currentColor" strokeWidth="4" fill="transparent" className="text-slate-800" />
            <circle 
              cx="32" cy="32" r="16" 
              stroke="currentColor" strokeWidth="4" fill="transparent"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              strokeLinecap="round"
              className={`${color} transition-all duration-700 ease-out`}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center text-xs font-bold">
            {Math.round(value)}%
          </div>
        </div>
        <span className="text-xs text-slate-500 mt-2 font-mono uppercase">{label}</span>
      </div>
    );
  };

  return (
    <div className="glass-panel rounded-xl p-4">
      <div className="flex justify-between items-center mb-4 border-b border-slate-700 pb-2">
        <h2 className="text-slate-400 text-xs font-bold uppercase tracking-wider">System Metrics</h2>
        <div className="flex items-center gap-2 text-xs">
          <span className={`w-2 h-2 rounded-full ${stats.network === 'Online' ? 'bg-emerald-500' : 'bg-red-500'}`}></span>
          <span className="text-slate-400">{stats.network} ({stats.networkSpeed})</span>
        </div>
      </div>
      
      <div className="flex justify-around items-center py-2">
        <Gauge value={stats.cpu} label="CPU Load" color="text-cyan-500" />
        <Gauge value={(stats.memory / 16000) * 100} label="RAM Usage" color="text-purple-500" />
        <Gauge value={stats.battery * 100} label="Battery" color={stats.battery > 0.2 ? "text-green-500" : "text-red-500"} />
      </div>

      <div className="mt-4 bg-slate-800/50 rounded p-2">
        <div className="flex justify-between text-xs text-slate-400 mb-1">
          <span>Neural Load</span>
          <span>Active</span>
        </div>
        <div className="w-full bg-slate-700 h-1 rounded overflow-hidden">
            <div className="h-full bg-gradient-to-r from-cyan-500 to-purple-500 w-3/4 animate-pulse"></div>
        </div>
      </div>
    </div>
  );
};

export default SystemMonitor;