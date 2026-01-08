"use client";

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { 
    Server, Cpu, Zap, Box, ShoppingBag, Gamepad2, 
    HardDrive, Check, ArrowRight, Layers,
    Globe, Rocket, Info, RefreshCw, Search,
    Activity, Shield, ChevronLeft, Sparkles, Database, CreditCard, Plus, Lock
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { clsx } from 'clsx';
import Link from 'next/link';
import { deployServer, getUserSubscriptions, getGames, getPlans, subscribeToPlan, getNodes } from '@/app/actions';
import Header from '@/components/Header';
import { useAuth } from '@/lib/auth-context';

function CreateServerWizard() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();
  
  const queryType = searchParams.get('type') as 'fixed' | 'flexi' | null;
  const queryGameId = searchParams.get('gameId');

  const [step, setStep] = useState(queryGameId ? 1 : (queryType ? 1 : 0));
  const [path, setPath] = useState<'fixed' | 'flexi' | null>(queryType || (queryGameId ? 'fixed' : null));
  const [loading, setLoading] = useState(false);
  
  const [games, setGames] = useState<any[]>([]);
  const [plans, setPlans] = useState<any[]>([]);
  const [nodes, setNodes] = useState<any[]>([]);
  const [userSubs, setUserSubs] = useState<any[]>([]);
  const [fetchingData, setFetchingData] = useState(true);

  const [selectedPlanId, setSelectedPlanId] = useState("");
  const [selectedTier, setSelectedTier] = useState<'budget' | 'premium'>('budget');
  const [selectedGameId, setSelectedGameId] = useState(queryGameId || "");
  const [selectedCategory, setSelectedCategory] = useState<'game' | 'voip' | 'web' | 'utility'>('game');
  const [serverName, setServerName] = useState("");
  const [customRam, setCustomRam] = useState(2048);
  const [location, setLocation] = useState("");
  const [customImage, setCustomImage] = useState("");
  const [gameVars, setGameVars] = useState<Record<string, string>>({});
  const [isPrivate, setIsPrivate] = useState(false);
  const [serverPassword, setServerPassword] = useState("");

  useEffect(() => {
    Promise.all([
        getGames(),
        getPlans(),
        getNodes(),
        user ? getUserSubscriptions(user.id) : Promise.resolve([])
    ]).then(([g, p, n, s]) => {
        setGames((g as any[]) || []);
        setPlans((p as any[]) || []);
        setNodes((n as any[]) || []);
        const activeSubs = (s as any[]).filter(sub => sub.status === 'ACTIVE');
        setUserSubs(activeSubs);
        
        const onlineNodes = (n as any[]).filter(node => node.status === 'ONLINE');
        if (onlineNodes.length > 0) {
            setLocation(onlineNodes[0].location);
        }

        if (path === 'flexi' && activeSubs.length > 0) {
            const flexiSub = activeSubs.find(sub => sub.plan?.type === 'flexi');
            if (flexiSub) {
                setSelectedPlanId(flexiSub.plan.id);
            }
        }

        setFetchingData(false);
    });
  }, [user, path]);

  const handleNext = () => setStep(s => s + 1);
  const handleBack = () => setStep(s => s - 1);

  const handleDeploy = async () => {
    if (!selectedGameId) return;
    
    if (!user) {
        const returnUrl = `/servers/new?gameId=${selectedGameId}&type=${path}`;
        router.push(`/signup?returnTo=${encodeURIComponent(returnUrl)}`);
        return;
    }

    setLoading(true);
    
    try {
      const plan = plans.find(p => p.id === selectedPlanId);
      const ram = path === 'flexi' ? customRam : (plan?.ramMb || 2048);

      const hasActiveSub = userSubs.some(s => s.plan?.id === selectedPlanId);
      if (!hasActiveSub && selectedPlanId) {
          await subscribeToPlan(user.id, selectedPlanId);
      }

      // Format environment variables from gameVars
      const env = Object.entries(gameVars).map(([k, v]) => `${k}=${v}`);
      if (serverName) env.push(`SERVER_NAME=${serverName}`);
      if (isPrivate && serverPassword) {
          env.push(`PASSWORD=${serverPassword}`);
          env.push(`PUBLIC=0`);
      } else {
          env.push(`PUBLIC=1`);
      }

      const result: any = await deployServer(user.id, selectedGameId, ram, serverName, location, { env });
      if (result.status === 'provisioning') {
        router.push('/dashboard/servers');
      } else {
        alert('Provisioning failed');
      }
    } catch (err) {
      alert('Deployment sequence failed.');
    } finally {
      setLoading(false);
    }
  };

  const selectedPlan = plans.find(p => p.id === selectedPlanId);
  const selectedGame = games.find(g => g.id === selectedGameId);

  const availableRegions = Array.from(new Set(nodes.filter(n => n.status === 'ONLINE').map(n => n.location)))
    .map(loc => ({
        id: loc,
        name: loc,
        latency: 'OPTIMAL',
        status: 'Online'
    }));

  const steps = [
    { id: 'path', name: 'Path' },
    ...(queryGameId ? [] : [{ id: 'game', name: 'Game' }]),
    { id: 'deployment', name: 'Deployment' },
    { id: 'configuration', name: 'Configuration' },
    { id: 'final', name: 'Summary' }
  ];

  const currentStep = steps[step];

  const isNextDisabled = () => {
      if (!currentStep) return true;
      switch(currentStep.id) {
          case 'game': return !selectedGameId;
          case 'deployment': return !location || !selectedPlanId;
          case 'configuration': return !serverName.trim();
          default: return false;
      }
  };

  const handleGameSelect = (id: string) => {
      setSelectedGameId(id);
      handleNext();
  };

  const filteredPlans = plans.filter(p => {
      const matchesTier = p.tier === selectedTier;
      if (path === 'flexi') return p.type === 'flexi' && matchesTier;
      if (path === 'fixed' && selectedGameId) {
          return p.type === 'fixed' && matchesTier && (p.gameId === selectedGameId || !p.gameId);
      }
      return p.type === 'fixed' && matchesTier;
  });

  return (
    <div className="min-h-screen relative overflow-hidden bg-[#05050A]">
      <Header />
      <main className="container-main py-32 relative z-10">
        <div className="max-w-5xl mx-auto space-y-12">
            <div className="flex flex-wrap justify-center gap-4">
                {steps.map((s, idx) => (
                    <div key={idx} className={clsx(
                        "glass-card px-5 py-2 flex items-center gap-3 transition-all duration-500",
                        step === idx ? "border-brand-purple/50 bg-white/10 scale-105" : "opacity-30"
                    )}>
                        <div className={clsx("w-5 h-5 rounded flex items-center justify-center text-[9px] font-black", step >= idx ? "bg-brand-purple text-white" : "bg-white/10 text-gray-500")}>
                            {step > idx ? <Check size={10} /> : idx}
                        </div>
                        <span className="text-[9px] font-black uppercase tracking-widest text-white">{s.name}</span>
                    </div>
                ))}
            </div>

            <div className="glass-card p-10 md:p-16 min-h-[600px] flex flex-col relative overflow-hidden">
                {/* Floating Game Context Indicator */}
                <AnimatePresence>
                    {selectedGame && (
                        <motion.div 
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="absolute top-6 left-6 z-50 flex items-center gap-3 px-4 py-2 rounded-xl bg-brand-purple/10 border border-brand-purple/20 backdrop-blur-md"
                        >
                            <span className="text-[10px] font-black text-brand-purple uppercase tracking-[0.2em]">Deploying //</span>
                            <span className="text-[10px] font-black text-white uppercase tracking-[0.2em]">{selectedGame.name}</span>
                        </motion.div>
                    )}
                </AnimatePresence>

                <AnimatePresence mode="wait">
                    {currentStep?.id === 'path' && (
                        <motion.div key="path" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-12 text-center">
                            <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-white">Choose <span className="text-gradient">Protocol.</span></h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <button onClick={() => { setPath('fixed'); handleNext(); }} className="glass-card p-10 hover:border-brand-purple transition-all group text-center">
                                    <Server size={48} className="mx-auto mb-6 text-brand-purple" />
                                    <h3 className="text-2xl font-black text-white uppercase tracking-tighter italic">Fixed Module</h3>
                                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-2">Dedicated resources // Single Game</p>
                                </button>
                                <button onClick={() => { setPath('flexi'); handleNext(); }} className="glass-card p-10 hover:border-brand-blue transition-all group text-center">
                                    <Layers size={48} className="mx-auto mb-6 text-brand-blue" />
                                    <h3 className="text-2xl font-black text-white uppercase tracking-tighter italic">Flexi Pool</h3>
                                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-2">Dynamic allocation // Multiple Instances</p>
                                </button>
                            </div>
                        </motion.div>
                    )}

                    {currentStep?.id === 'game' && (
                        <motion.div key="game" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-12">
                            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                                <div>
                                    <h2 className="text-[10px] font-black tracking-[0.4em] text-brand-purple uppercase mb-4">Discovery Engine</h2>
                                    <div 
                                        className="flex items-center gap-6 group cursor-pointer select-none" 
                                        onClick={() => {
                                            const cats: ('game' | 'voip' | 'web')[] = ['game', 'voip', 'web'];
                                            const nextIdx = (cats.indexOf(selectedCategory as any) + 1) % cats.length;
                                            setSelectedCategory(cats[nextIdx]);
                                        }}
                                    >
                                        <p className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-white leading-none italic">
                                            Available <span className="text-gradient">
                                                {selectedCategory === 'game' ? 'Games' : selectedCategory === 'voip' ? 'VoIP' : 'Web Hosting'}.
                                            </span>
                                        </p>
                                        <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-brand-purple group-hover:bg-brand-purple group-hover:text-white transition-all">
                                            <ArrowRight size={24} />
                                        </div>
                                    </div>
                                    <p className="text-[8px] font-black uppercase tracking-[0.2em] text-gray-600 mt-4 italic">
                                        Click title or arrow to cycle categories
                                    </p>
                                </div>

                                <div className="relative w-full md:w-96">
                                    <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                                    <input 
                                        type="text"
                                        placeholder="Search manifest..."
                                        value={customImage} // Reusing customImage state for search temporarily to avoid new state
                                        onChange={(e) => setCustomImage(e.target.value)}
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl h-14 pl-14 pr-6 text-white text-sm placeholder:text-gray-700 focus:outline-none focus:border-brand-purple transition-all"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 min-h-[400px]">
                                {games.filter(g => {
                                    const matchesSearch = g.name.toLowerCase().includes(customImage.toLowerCase());
                                    const matchesCategory = g.category === selectedCategory;
                                    return matchesSearch && matchesCategory;
                                }).map((game) => (
                                    <button 
                                        key={game.id} 
                                        onClick={() => handleGameSelect(game.id)}
                                        className="relative aspect-[16/10] group overflow-hidden rounded-[2rem] border border-white/10 hover:border-brand-purple/50 transition-all duration-700 bg-gray-900"
                                    >
                                        <div className="absolute inset-0 transition-transform duration-1000 group-hover:scale-110">
                                            {game.banner ? (
                                                <img 
                                                    src={game.banner} 
                                                    alt={game.name}
                                                    className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity duration-700"
                                                />
                                            ) : (
                                                <div className="w-full h-full bg-gradient-to-br from-gray-900 via-black to-brand-purple/10 flex items-center justify-center">
                                                    <span className="text-4xl opacity-20 transform -rotate-12 grayscale">🎮</span>
                                                </div>
                                            )}
                                        </div>
                                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-90" />
                                        <div className="absolute inset-0 p-8 flex flex-col justify-end text-left">
                                            <div className="transform group-hover:-translate-y-2 transition-transform duration-700">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <span className="px-2 py-0.5 rounded-full bg-brand-purple/20 border border-brand-purple/30 text-[8px] font-black text-brand-purple uppercase tracking-widest">
                                                        {game.category}
                                                    </span>
                                                </div>
                                                <h4 className="text-xl font-black uppercase tracking-tighter text-white leading-tight mb-2 drop-shadow-lg">
                                                    {game.name}
                                                </h4>
                                                <div className="h-0 group-hover:h-auto overflow-hidden opacity-0 group-hover:opacity-100 transition-all duration-700">
                                                    <p className="text-[9px] text-gray-400 font-bold uppercase tracking-tight line-clamp-2 leading-relaxed">
                                                        {game.description}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {currentStep?.id === 'deployment' && (
                        <motion.div key="deployment" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-12">
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                                <div className="lg:col-span-1 space-y-8">
                                    <h2 className="text-3xl font-black text-white uppercase tracking-tighter italic">1. <span className="text-brand-blue">Region.</span></h2>
                                    <div className="grid grid-cols-1 gap-4">
                                        {availableRegions.map((reg) => (
                                            <button key={reg.id} onClick={() => setLocation(reg.id)} className={clsx("glass-card p-6 flex items-center gap-4 transition-all", location === reg.id ? "bg-brand-blue/20 border-brand-blue scale-[1.02]" : "hover:bg-white/5 opacity-40 hover:opacity-60")}>
                                                <Globe size={20} className="text-brand-blue" />
                                                <div className="text-left">
                                                    <h3 className="text-xs font-black text-white uppercase tracking-tighter">{reg.name}</h3>
                                                    <p className="text-[8px] text-brand-blue font-black tracking-widest uppercase mt-0.5">{reg.latency}</p>
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="lg:col-span-2 space-y-8">
                                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                                        <h2 className="text-3xl font-black text-white uppercase tracking-tighter italic">2. <span className="text-brand-purple">Plan.</span></h2>
                                        
                                        {/* Tier Selector */}
                                        <div className="flex bg-white/5 border border-white/10 rounded-2xl p-1 w-fit">
                                            <button 
                                                onClick={() => setSelectedTier('budget')}
                                                className={clsx(
                                                    "px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                                                    selectedTier === 'budget' ? "bg-brand-purple text-white shadow-lg" : "text-gray-500 hover:text-white"
                                                )}
                                            >
                                                Budget
                                            </button>
                                            <button 
                                                onClick={() => setSelectedTier('premium')}
                                                className={clsx(
                                                    "px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                                                    selectedTier === 'premium' ? "bg-brand-purple text-white shadow-lg" : "text-gray-500 hover:text-white"
                                                )}
                                            >
                                                Premium
                                            </button>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {filteredPlans.length > 0 ? filteredPlans.map(p => (
                                            <button key={p.id} onClick={() => setSelectedPlanId(p.id)} className={clsx("glass-card p-8 text-left space-y-4 transition-all relative overflow-hidden", selectedPlanId === p.id ? "bg-brand-purple/20 border-brand-purple scale-[1.02]" : "hover:bg-white/5 opacity-40 hover:opacity-60")}>
                                                <div className="flex justify-between items-start relative z-10">
                                                    <div className="space-y-1">
                                                        <h4 className="text-white font-black uppercase text-xs tracking-tighter">{p.name}</h4>
                                                        <p className="text-[8px] text-brand-purple font-bold uppercase tracking-widest">{p.tier} Series</p>
                                                    </div>
                                                    <span className="text-xl font-black text-white italic">${p.price}</span>
                                                </div>
                                                <div className="flex flex-col gap-1 relative z-10">
                                                    <div className="flex items-center gap-2">
                                                        <Cpu size={10} className="text-brand-purple" />
                                                        <p className="text-[9px] text-gray-400 uppercase font-black tracking-[0.1em]">
                                                            {p.cpuCores} vCPU CORES
                                                        </p>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <Database size={10} className="text-brand-blue" />
                                                        <p className="text-[9px] text-gray-400 uppercase font-black tracking-[0.1em]">
                                                            {p.ramMb / 1024}GB HIGH-SPEED RAM
                                                        </p>
                                                    </div>
                                                </div>
                                                {selectedPlanId === p.id && <div className="absolute inset-0 bg-brand-purple/5 animate-pulse" />}
                                            </button>
                                        )) : (
                                            <div className="col-span-full p-12 text-center border border-dashed border-white/10 rounded-[2rem] space-y-4">
                                                <Database size={32} className="mx-auto text-gray-700" />
                                                <p className="text-[10px] text-gray-600 font-black uppercase tracking-[0.3em]">No {selectedTier} modules available for this configuration.</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {currentStep?.id === 'configuration' && (
                        <motion.div key="configuration" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-12">
                            <div className="space-y-10">
                                {/* Identity Selection (Top) */}
                                <div className="space-y-6">
                                    <div className="flex items-center gap-3">
                                        <h2 className="text-3xl font-black text-white uppercase tracking-tighter italic">1. <span className="text-gradient">Identity.</span></h2>
                                        <div className="group relative">
                                            <div className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center text-[10px] font-black text-gray-400 cursor-help border border-white/5">?</div>
                                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-64 p-4 bg-[#0A0A1A] border border-white/10 rounded-2xl text-[9px] font-bold uppercase tracking-widest leading-relaxed text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-2xl z-50">
                                                The host name determines your unique access point. Your server will be reachable via <span className="text-brand-purple">name.hostmachine.com.au</span>.
                                            </div>
                                        </div>
                                    </div>
                                    <div className="max-w-xl">
                                        <div className="space-y-3">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-600">Host Name</label>
                                            <HostNameInput value={serverName} onChange={setServerName} />
                                            <p className="text-[9px] text-brand-purple uppercase font-black tracking-[0.2em] ml-1">Endpoint: {serverName.toLowerCase().replace(/[^a-z0-9]/g, '-') || 'name'}.hostmachine.com.au</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="h-px bg-white/5" />

                                {/* Privacy & Network Selection */}
                                <div className="space-y-8">
                                    <div className="flex items-center gap-3">
                                        <h2 className="text-3xl font-black text-white uppercase tracking-tighter italic">2. <span className="text-gradient">Security.</span></h2>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl">
                                        <div className="space-y-4">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-600">Access Protocol</label>
                                            <div className="flex bg-white/5 border border-white/10 rounded-2xl p-1 w-fit">
                                                <button 
                                                    onClick={() => setIsPrivate(false)}
                                                    className={clsx(
                                                        "px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2",
                                                        !isPrivate ? "bg-white/10 text-white shadow-lg" : "text-gray-500 hover:text-white"
                                                    )}
                                                >
                                                    <Globe size={14} /> Public
                                                </button>
                                                <button 
                                                    onClick={() => setIsPrivate(true)}
                                                    className={clsx(
                                                        "px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2",
                                                        isPrivate ? "bg-brand-purple text-white shadow-lg" : "text-gray-500 hover:text-white"
                                                    )}
                                                >
                                                    <Lock size={14} /> Private
                                                </button>
                                            </div>
                                        </div>

                                        <AnimatePresence>
                                            {isPrivate && (
                                                <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="space-y-3">
                                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-600">Server Password</label>
                                                    <div className="relative">
                                                        <Shield className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-purple" size={16} />
                                                        <input 
                                                            type="password" 
                                                            value={serverPassword} 
                                                            onChange={(e) => setServerPassword(e.target.value)} 
                                                            placeholder="••••••••" 
                                                            className="w-full h-14 pl-12 pr-6 rounded-xl bg-white/5 border border-brand-purple/30 text-white font-bold text-sm focus:border-brand-purple outline-none transition-all pointer-events-auto relative z-20"
                                                        />
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                </div>

                                <div className="h-px bg-white/5" />

                                {/* Game Specific Variables (Bottom) */}
                                <div className="space-y-8">
                                    <h2 className="text-3xl font-black text-white uppercase tracking-tighter italic">3. <span className="text-gradient">Parameters.</span></h2>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl">
                                        {selectedGame?.variables?.map((v: any) => (
                                            <div key={v.envVar} className="space-y-3">
                                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-600">{v.name}</label>
                                                {v.type === 'enum' ? (
                                                    <select 
                                                        value={gameVars[v.envVar] || v.defaultValue}
                                                        onChange={(e) => setGameVars({...gameVars, [v.envVar]: e.target.value})}
                                                        className="w-full h-12 px-6 rounded-xl bg-white/5 border border-white/10 text-white font-bold text-xs focus:border-brand-purple outline-none transition-all appearance-none cursor-pointer pointer-events-auto relative z-20"
                                                    >
                                                        {v.options?.map((opt: string) => (
                                                            <option key={opt} value={opt} className="bg-[#0A0A1A]">{opt}</option>
                                                        ))}
                                                    </select>
                                                ) : (
                                                    <input 
                                                        type="text" 
                                                        placeholder={v.defaultValue}
                                                        value={gameVars[v.envVar] || ''}
                                                        onChange={(e) => setGameVars({...gameVars, [v.envVar]: e.target.value})}
                                                        className="w-full h-12 px-6 rounded-xl bg-white/5 border border-white/10 text-white font-bold text-xs focus:border-brand-purple outline-none transition-all pointer-events-auto relative z-20"
                                                    />
                                                )}
                                            </div>
                                        ))}
                                        {(!selectedGame?.variables || selectedGame.variables.length === 0) && (
                                            <div className="col-span-full p-10 text-center border border-dashed border-white/10 rounded-2xl text-gray-600 font-bold uppercase tracking-widest italic">
                                                Standard core configuration will be applied.
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {currentStep?.id === 'final' && (
                        <motion.div key="final" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-12 py-10">
                            <h2 className="text-5xl font-black text-white uppercase tracking-tighter leading-none text-center">Final <span className="text-gradient">Review.</span></h2>
                            <div className="max-w-2xl mx-auto glass-card overflow-hidden">
                                <table className="w-full text-left">
                                    <tbody className="divide-y divide-white/5">
                                        <ReviewRow label="Module" value={selectedGame?.name} />
                                        <ReviewRow label="Series" value={selectedPlan?.tier} />
                                        <ReviewRow label="Plan" value={selectedPlan?.name} />
                                        <ReviewRow label="Region" value={location} />
                                        <ReviewRow label="Address" value={`${serverName.toLowerCase()}.hostmachine.com.au`} />
                                        <ReviewRow label="Monthly Cost" value={`$${selectedPlan?.price} AUD`} highlight />
                                    </tbody>
                                </table>
                            </div>
                            <div className="flex justify-center pt-8">
                                <Info size={16} className="text-brand-purple mr-2" />
                                <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">Deployment will begin immediately after authorization.</p>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {step > 0 && (
                    <div className="mt-auto pt-12 border-t border-white/5 flex items-center justify-between">
                        <button onClick={handleBack} disabled={loading} className="w-14 h-14 rounded-2xl border border-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-all"><ChevronLeft size={24} /></button>
                        <div className="flex items-center gap-8">
                            <button 
                                onClick={currentStep?.id === 'final' ? handleDeploy : handleNext} 
                                disabled={isNextDisabled() || loading} 
                                className="btn-primary !h-14 !px-10 text-xs font-black uppercase tracking-widest relative overflow-hidden"
                            >
                                {currentStep?.id === 'final' ? (loading ? "AUTHORIZING..." : "SUBSCRIBE & DEPLOY") : "CONTINUE SEQUENCE"}
                                {currentStep?.id !== 'final' && <ArrowRight size={18} className="ml-2" />}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
      </main>
    </div>
  );
}

function ReviewRow({ label, value, highlight }: any) {
    return (
        <tr className="border-b border-white/5">
            <td className="p-6 text-[10px] font-bold text-gray-500 uppercase tracking-widest">{label}</td>
            <td className={clsx("p-6 text-sm font-black uppercase italic text-right", highlight ? "text-brand-purple text-xl" : "text-white")}>{value}</td>
        </tr>
    );
}

function HostNameInput({ value, onChange }: { value: string, onChange: (val: string) => void }) {
    const [localValue, setLocalValue] = useState(value);

    // Sync with parent if it changes from outside
    useEffect(() => {
        setLocalValue(value);
    }, [value]);

    return (
        <input 
            type="text" 
            value={localValue} 
            onChange={(e) => {
                setLocalValue(e.target.value);
                onChange(e.target.value);
            }} 
            autoFocus
            placeholder="omega-node" 
            className="w-full h-16 px-8 rounded-2xl bg-white/5 border border-white/10 text-white text-xl font-black uppercase tracking-tighter focus:outline-none focus:border-brand-purple transition-all pointer-events-auto relative z-20"
        />
    );
}

export default function CreateServerPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-[#05050A] flex flex-col items-center justify-center text-white font-black uppercase tracking-[0.5em] animate-pulse">
          <div className="w-16 h-16 border-2 border-brand-purple border-t-transparent rounded-full mb-8" />
          Synchronizing Manifest...
        </div>}>
            <CreateServerWizard />
        </Suspense>
    );
}