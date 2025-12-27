"use client";

import { useEffect, useState, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { clsx } from 'clsx';
import { executeCommand } from '@/app/actions';

interface LiveConsoleProps {
  serverId: string;
  initialLogs?: string;
  controllerUrl: string; // e.g., http://localhost:3000
  onStats?: (stats: any) => void;
}

export default function LiveConsole({ serverId, initialLogs = "", controllerUrl, onStats }: LiveConsoleProps) {
  const [logs, setLogs] = useState<string[]>(initialLogs ? initialLogs.split('\n') : []);
  const [status, setStatus] = useState<'connecting' | 'connected' | 'disconnected'>('connecting');
  const [input, setInput] = useState("");
  const socketRef = useRef<Socket | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const onStatsRef = useRef(onStats);

  useEffect(() => {
    onStatsRef.current = onStats;
  }, [onStats]);

  useEffect(() => {
    // 1. Initialize Socket
    // Simplified to root namespace to avoid handshake issues with Nginx/namespaces
    const socket = io('/', {
        path: '/socket.io/',
        transports: ['websocket'],
        reconnectionDelay: 5000,
        reconnectionDelayMax: 10000,
    });

    socketRef.current = socket;

    socket.on('connect', () => {
        setStatus('connected');
        console.log('Console: Connected');
        // 2. Join Room
        socket.emit('join-server', serverId);
    });

    socket.on('disconnect', () => {
        setStatus('disconnected');
    });

    socket.on('log', (data: string) => {
        setLogs(prev => {
            const newLogs = [...prev, data];
            if (newLogs.length > 1000) return newLogs.slice(-1000); // Keep buffer sane
            return newLogs;
        });
    });

    socket.on('log-history', (history: string[]) => {
        setLogs(history);
    });

    socket.on('stats', (data: any) => {
        if (onStatsRef.current) onStatsRef.current(data);
    });

    return () => {
        socket.disconnect();
    };
  }, [serverId]);

  useEffect(() => {
    if (scrollRef.current) {
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!input.trim()) return;
      const cmd = input;
      setInput("");
      
      // Optimistic UI
      setLogs(prev => [...prev, `> ${cmd}`]);

      try {
          await executeCommand(serverId, cmd);
      } catch (err) {
          setLogs(prev => [...prev, `Error: Failed to send command.`]);
      }
  };

  return (
      <div className="flex flex-col h-[600px] bg-black/40 rounded-xl overflow-hidden font-mono text-xs">
          <div className="bg-white/5 px-4 py-2 flex justify-between items-center">
              <span className="text-gray-400 font-bold uppercase tracking-widest">Live Terminal</span>
              <div className="flex items-center gap-2">
                  <div className={clsx("w-2 h-2 rounded-full", 
                      status === 'connected' ? "bg-green-500 animate-pulse" : 
                      status === 'connecting' ? "bg-yellow-500" : "bg-red-500"
                  )} />
                  <span className="text-[10px] text-gray-500 uppercase">{status}</span>
              </div>
          </div>
          
          <div ref={scrollRef} className="flex-1 p-4 overflow-y-auto whitespace-pre-wrap text-gray-300 font-medium">
              {logs.map((line, i) => (
                  <div key={i} className="leading-tight hover:bg-white/5 px-1 rounded">{line}</div>
              ))}
          </div>

          <form onSubmit={handleSubmit} className="p-4 bg-white/5 border-t border-white/5 flex gap-2">
              <span className="text-brand-purple font-bold">{'>'}</span>
              <input 
                  type="text" 
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  className="flex-1 bg-transparent border-none outline-none text-white placeholder-gray-600"
                  placeholder="Type command..."
              />
          </form>
      </div>
  );
}
