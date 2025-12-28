"use client";

import { useEffect, useState } from 'react';
import { Clock, Plus, Trash2, Calendar, Play, Save } from 'lucide-react';
import { getSchedules, createSchedule, deleteSchedule } from '@/app/actions';
import { clsx } from 'clsx';

export default function ScheduleManager({ serverId }: { serverId: string }) {
    const [schedules, setSchedules] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [showAdd, setShowAdd] = useState(false);
    
    // Form State
    const [name, setName] = useState("");
    const [task, setTask] = useState<any>("restart");
    const [cron, setCron] = useState("0 4 * * *");

    const fetchSchedules = async () => {
        setLoading(true);
        try {
            const data = await getSchedules(serverId);
            setSchedules(Array.isArray(data) ? data : []);
        } catch (e) {
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSchedules();
    }, [serverId]);

    const handleCreate = async () => {
        if (!name) return;
        try {
            await createSchedule(serverId, { name, task, cronExpression: cron });
            setShowAdd(false);
            setName("");
            fetchSchedules();
        } catch (e) {
            alert("Failed to create schedule");
        }
    };

    const handleDelete = async (id: string) => {
        try {
            await deleteSchedule(id);
            fetchSchedules();
        } catch (e) {
        }
    };

    return (
        <div className="p-8 space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-black uppercase tracking-tighter italic">Automation Engine</h2>
                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-1">Configure recursive system protocols.</p>
                </div>
                <button 
                    onClick={() => setShowAdd(!showAdd)}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-purple/10 text-brand-purple border border-brand-purple/20 text-[10px] font-black uppercase hover:bg-brand-purple hover:text-white transition-all"
                >
                    <Plus size={14} /> New Protocol
                </button>
            </div>

            {showAdd && (
                <div className="glass-card p-6 border-brand-purple/30 bg-brand-purple/5 space-y-6 animate-in fade-in slide-in-from-top-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase text-gray-500">Protocol Name</label>
                            <input 
                                value={name} 
                                onChange={(e) => setName(e.target.value)}
                                placeholder="e.g. Daily Reboot"
                                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm focus:border-brand-purple outline-none"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase text-gray-500">Task Type</label>
                            <select 
                                value={task} 
                                onChange={(e) => setTask(e.target.value)}
                                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm focus:border-brand-purple outline-none appearance-none"
                            >
                                <option value="restart">System Restart</option>
                                <option value="backup">Data Archive (Backup)</option>
                                <option value="update">Engine Update Check</option>
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase text-gray-500">Cron Expression</label>
                            <input 
                                value={cron} 
                                onChange={(e) => setCron(e.target.value)}
                                placeholder="0 4 * * *"
                                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm font-mono focus:border-brand-purple outline-none"
                            />
                        </div>
                    </div>
                    <div className="flex justify-end gap-3">
                        <button onClick={() => setShowAdd(false)} className="px-4 py-2 text-[10px] font-bold text-gray-500 hover:text-white uppercase">Cancel</button>
                        <button onClick={handleCreate} className="btn-primary !h-10 px-6">Activate Protocol</button>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 gap-4">
                {loading ? (
                    <div className="py-20 text-center text-gray-500">Scanning for active protocols...</div>
                ) : schedules.length === 0 ? (
                    <div className="py-20 text-center glass-card border-dashed">
                        <Clock size={40} className="mx-auto text-gray-700 mb-4" />
                        <p className="text-gray-500 text-xs font-bold uppercase">No automated protocols detected.</p>
                    </div>
                ) : (
                    schedules.map((s) => (
                        <div key={s.id} className="glass-card p-6 flex items-center justify-between hover:border-white/20 transition-all group">
                            <div className="flex items-center gap-6">
                                <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-brand-purple">
                                    {s.task === 'restart' ? <RefreshCw size={24} /> : s.task === 'backup' ? <Calendar size={24} /> : <Clock size={24} />}
                                </div>
                                <div>
                                    <h4 className="text-lg font-black uppercase tracking-tight">{s.name}</h4>
                                    <div className="flex items-center gap-3 mt-1">
                                        <span className="text-[9px] font-bold px-2 py-0.5 rounded bg-white/5 text-gray-400 uppercase">{s.task}</span>
                                        <code className="text-[10px] text-brand-purple font-bold">{s.cronExpression}</code>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="flex items-center gap-8">
                                <div className="text-right hidden md:block">
                                    <p className="text-[8px] font-black text-gray-600 uppercase">Last Execution</p>
                                    <p className="text-[10px] font-bold text-gray-400">{s.lastRun ? new Date(s.lastRun).toLocaleString() : 'NEVER'}</p>
                                </div>
                                <button 
                                    onClick={() => handleDelete(s.id)}
                                    className="w-10 h-10 rounded-lg hover:bg-red-500/20 text-gray-600 hover:text-red-500 transition-all flex items-center justify-center"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
