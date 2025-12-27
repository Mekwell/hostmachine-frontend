"use client";

import { useEffect, useState } from 'react';
import { Save, RefreshCw, AlertTriangle, FileText, ToggleLeft, ToggleRight, Type, Hash } from 'lucide-react';
import { getConfig, saveConfig } from '@/app/actions';
import { clsx } from 'clsx';

interface ConfigEditorProps {
    serverId: string;
    filename: string;
}

export default function ConfigEditor({ serverId, filename }: ConfigEditorProps) {
    const [config, setConfig] = useState<Record<string, any>>({});
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        loadConfig();
    }, [serverId, filename]);

    const loadConfig = async () => {
        setLoading(true);
        try {
            const res: any = await getConfig(serverId, filename);
            setConfig(res.config || {});
        } catch (e) {
            setError("Failed to load configuration.");
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            await saveConfig(serverId, filename, config);
            alert('Configuration saved! Server is restarting to apply changes...');
        } catch (e) {
            alert('Failed to save configuration.');
        } finally {
            setSaving(false);
        }
    };

    const handleChange = (key: string, value: any) => {
        setConfig(prev => ({ ...prev, [key]: value }));
    };

    if (loading) return <div className="p-8 text-center text-gray-500 uppercase tracking-widest text-xs font-bold animate-pulse">Parsing Configuration...</div>;
    if (error) return <div className="p-8 text-center text-red-500 font-bold">{error}</div>;

    const entries = Object.entries(config);

    if (entries.length === 0) return (
        <div className="flex flex-col items-center justify-center p-12 text-center space-y-4">
            <FileText size={48} className="text-gray-600" />
            <div>
                <h3 className="text-lg font-bold text-gray-400">Empty Configuration</h3>
                <p className="text-xs text-gray-600">This file ({filename}) appears to be empty or unparseable.</p>
            </div>
        </div>
    );

    return (
        <div className="flex flex-col h-full">
            <div className="flex items-center justify-between p-6 border-b border-white/5 bg-black/20">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-brand-purple/10 flex items-center justify-center text-brand-purple border border-brand-purple/20">
                        <FileText size={20} />
                    </div>
                    <div>
                        <h3 className="text-sm font-black uppercase tracking-widest text-white">{filename}</h3>
                        <p className="text-[10px] text-gray-500 font-bold uppercase">Dynamic Editor</p>
                    </div>
                </div>
                <button 
                    onClick={handleSave} 
                    disabled={saving}
                    className="flex items-center gap-2 px-6 py-3 rounded-xl bg-brand-purple hover:bg-brand-purple/80 text-white font-black uppercase text-xs tracking-widest transition-all disabled:opacity-50"
                >
                    {saving ? <RefreshCw size={14} className="animate-spin" /> : <Save size={14} />}
                    {saving ? 'Applying...' : 'Save Changes'}
                </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-custom">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {entries.map(([key, value]) => (
                        <div key={key} className="glass-card p-4 space-y-3 group hover:bg-white/5 transition-all">
                            <div className="flex items-center justify-between">
                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 group-hover:text-brand-purple transition-colors">{key}</label>
                                {typeof value === 'boolean' ? (
                                    <button onClick={() => handleChange(key, !value)} className={clsx("transition-all", value ? "text-green-400" : "text-gray-600")}>
                                        {value ? <ToggleRight size={24} /> : <ToggleLeft size={24} />}
                                    </button>
                                ) : typeof value === 'number' ? (
                                    <Hash size={14} className="text-gray-700" />
                                ) : (
                                    <Type size={14} className="text-gray-700" />
                                )}
                            </div>

                            {typeof value === 'boolean' ? (
                                <div className="text-xs font-mono text-gray-400">{value ? 'Enabled' : 'Disabled'}</div>
                            ) : (
                                <input 
                                    type={typeof value === 'number' ? 'number' : 'text'}
                                    value={value}
                                    onChange={(e) => handleChange(key, typeof value === 'number' ? Number(e.target.value) : e.target.value)}
                                    className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2 text-sm text-white font-mono focus:border-brand-purple focus:outline-none transition-all"
                                />
                            )}
                        </div>
                    ))}
                </div>
            </div>
            
            <div className="p-4 bg-yellow-500/5 border-t border-yellow-500/10 flex items-center gap-3 text-xs text-yellow-500/80 font-bold uppercase tracking-wide">
                <AlertTriangle size={14} />
                Saving changes will automatically restart the server.
            </div>
        </div>
    );
}
