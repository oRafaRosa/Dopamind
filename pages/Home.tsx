import React, { useState } from 'react';
import { Profile, Task } from '../types';
import XPModal from '../components/XPModal';
import EvidenceModal from '../components/EvidenceModal';
import PerfectDayModal from '../components/PerfectDayModal';
import { Flame, CheckCircle2, Circle, Dumbbell, BookOpen, Brain, Briefcase, Plus, Camera, Coins } from 'lucide-react';

// Mock Data
const INITIAL_PROFILE: Profile = {
  id: '1',
  username: 'rafa_player',
  display_name: 'Rafa',
  is_pro: false,
  total_xp: 3420,
  aura_level: 6,
  streak: 6,
  credits: 450,
  avatar_url: 'https://picsum.photos/100/100',
  stats: {
    str: 65,
    int: 80,
    foc: 45,
    spi: 30,
    cha: 55
  }
};

const INITIAL_TASKS: Task[] = [
  { id: '1', title: 'Treino de Força', category: 'Body', xp: 80, is_completed: false, requires_evidence: true },
  { id: '2', title: 'Leitura (20 min)', category: 'Mind', xp: 40, is_completed: false },
  { id: '3', title: 'Deep Work (2h)', category: 'Work', xp: 120, is_completed: false },
  { id: '4', title: 'Zero Açúcar', category: 'Body', xp: 60, is_completed: false },
];

const Home = () => {
  // Ensure profile has stats even if hot-reloaded from old state
  const [profile, setProfile] = useState<Profile>(() => {
    return {
        ...INITIAL_PROFILE,
        // Safety check if we were using persistent state that might miss stats
        stats: INITIAL_PROFILE.stats || { str: 0, int: 0, foc: 0, spi: 0, cha: 0 }
    };
  });
  
  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS);
  
  // Modals state
  const [showReward, setShowReward] = useState(false);
  const [rewardData, setRewardData] = useState({ xp: 0, message: '' });
  
  const [showEvidence, setShowEvidence] = useState(false);
  const [evidenceTask, setEvidenceTask] = useState<Task | null>(null);

  const [showPerfectDay, setShowPerfectDay] = useState(false);
  const [perfectDayXp, setPerfectDayXp] = useState(0);

  // Calculate Levels
  const calculateAura = (xp: number) => Math.floor(Math.sqrt(xp / 120)) + 1;
  
  // Progress Bar Math
  const currentLevelXpStart = 120 * Math.pow(profile.aura_level - 1, 2);
  const nextLevelXpThreshold = 120 * Math.pow(profile.aura_level, 2);
  const xpInCurrentLevel = profile.total_xp - currentLevelXpStart;
  const xpNeededForLevel = nextLevelXpThreshold - currentLevelXpStart;
  const progressPercent = Math.min(100, Math.max(0, (xpInCurrentLevel / xpNeededForLevel) * 100));

  const handleTaskClick = (task: Task) => {
    if (task.is_completed) return;

    if (task.requires_evidence) {
        setEvidenceTask(task);
        setShowEvidence(true);
    } else {
        completeTask(task.id);
    }
  };

  const handleEvidenceConfirmed = () => {
    if (evidenceTask) {
        setShowEvidence(false);
        completeTask(evidenceTask.id);
        setEvidenceTask(null);
    }
  };

  const completeTask = (taskId: string) => {
    const taskIndex = tasks.findIndex(t => t.id === taskId);
    if (tasks[taskIndex].is_completed) return;

    const newTasks = [...tasks];
    newTasks[taskIndex].is_completed = true;
    setTasks(newTasks);

    const task = newTasks[taskIndex];
    let xpGained = task.xp;
    let creditsGained = Math.floor(xpGained / 10); // 10% of XP as credits
    let isPerfectDay = false;

    // Simulate Stat Gain - Safe Access
    const currentStats = profile.stats || INITIAL_PROFILE.stats || { str:0, int:0, foc:0, spi:0, cha:0 };
    const newStats = { ...currentStats };
    
    if (task.category === 'Body') newStats.str = (newStats.str || 0) + 1;
    if (task.category === 'Mind') newStats.int = (newStats.int || 0) + 1;
    if (task.category === 'Work') newStats.foc = (newStats.foc || 0) + 1;
    if (task.category === 'Spirit') newStats.spi = (newStats.spi || 0) + 1;
    if (task.category === 'Life') newStats.cha = (newStats.cha || 0) + 1;

    // Check for Perfect Day (All tasks completed)
    if (newTasks.every(t => t.is_completed)) {
        isPerfectDay = true;
        const perfectDayBonus = 200;
        const perfectDayCredits = 50;
        
        xpGained += perfectDayBonus;
        creditsGained += perfectDayCredits;
        
        setPerfectDayXp(xpGained);
        setShowPerfectDay(true);
    } else {
        // Standard Reward
        const quotes = [
            "Sem evidência, sem XP.",
            "O mundo hackeou sua dopamina. Hackeie de volta.",
            "Consistência é rei.",
            "GG. Aura subindo.",
            "Easy peasy.",
            "Farmando na vida real."
        ];
        const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
        setRewardData({ xp: xpGained, message: randomQuote });
        setShowReward(true);
    }

    // Update Profile
    const newTotalXp = profile.total_xp + xpGained;
    const newLevel = calculateAura(newTotalXp);
    
    setProfile(prev => ({
      ...prev,
      total_xp: newTotalXp,
      aura_level: newLevel,
      credits: prev.credits + creditsGained,
      stats: newStats
    }));
  };

  const getIcon = (category: string) => {
    switch(category) {
        case 'Body': return <Dumbbell size={18} className="text-emerald-400" />;
        case 'Mind': return <BookOpen size={18} className="text-blue-400" />;
        case 'Work': return <Briefcase size={18} className="text-orange-400" />;
        default: return <Brain size={18} className="text-purple-400" />;
    }
  };

  const completedCount = tasks.filter(t => t.is_completed).length;
  const completionRate = Math.round((completedCount / tasks.length) * 100);

  return (
    <div className="space-y-8 animate-slide-up pb-20">
      {/* Header Stats */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
            <div className="relative">
                <img src={profile.avatar_url} alt="Avatar" className="w-14 h-14 rounded-full border-2 border-neon-purple p-0.5" />
                <div className="absolute -bottom-1 -right-1 bg-background text-[10px] font-bold px-1.5 py-0.5 rounded border border-gray-700">
                    LVL {profile.aura_level}
                </div>
            </div>
            <div>
                <h1 className="text-xl font-bold text-white">{profile.display_name}</h1>
                <div className="flex items-center space-x-1 text-neon-purple">
                    <span className="text-sm font-display font-bold">AURA {profile.aura_level}</span>
                </div>
            </div>
        </div>
        <div className="flex flex-col items-end space-y-1">
            <div className="flex items-center space-x-1 text-orange-500 bg-orange-500/10 px-3 py-1 rounded-full border border-orange-500/20">
                <Flame size={16} fill="currentColor" />
                <span className="font-bold font-display">{profile.streak} DIAS</span>
            </div>
            <div className="flex items-center space-x-1 text-yellow-400">
                <Coins size={14} />
                <span className="text-xs font-bold">{profile.credits} $C</span>
            </div>
        </div>
      </div>

      {/* XP Progress Bar */}
      <div className="space-y-1">
        <div className="flex justify-between text-xs font-bold text-gray-500 uppercase">
            <span>XP Atual</span>
            <span>Próxima Aura</span>
        </div>
        <div className="h-3 w-full bg-gray-800 rounded-full overflow-hidden relative">
            <div 
                className="h-full bg-gradient-to-r from-neon-purple to-neon-blue transition-all duration-1000 ease-out"
                style={{ width: `${progressPercent}%` }}
            ></div>
        </div>
      </div>

      {/* Daily Progress Widget */}
      <div className={`bg-card border border-gray-800 rounded-2xl p-6 relative overflow-hidden transition-all duration-500 ${completionRate === 100 ? 'border-neon-green/50 shadow-lg shadow-neon-green/10' : ''}`}>
        <div className={`absolute top-0 right-0 p-6 opacity-10 transition-colors ${completionRate === 100 ? 'text-neon-green' : 'text-gray-500'}`}>
            <CheckCircle2 size={100} />
        </div>
        <h2 className="text-gray-400 text-sm font-bold uppercase tracking-wider mb-2">Progresso Diário</h2>
        <div className="flex items-end space-x-2">
            <span className={`text-5xl font-display font-bold transition-colors ${completionRate === 100 ? 'text-neon-green' : 'text-white'}`}>{completionRate}%</span>
            <span className="text-gray-500 mb-2 font-medium">concluído</span>
        </div>
        {completionRate === 100 && (
            <div className="mt-2 text-neon-green font-bold text-sm animate-pulse flex items-center">
                <Flame size={14} className="mr-1" fill="currentColor" />
                GG. Dia Completo. Bônus Ativo.
            </div>
        )}
      </div>

      {/* Tasks List */}
      <div>
        <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-white">Metas de Hoje</h3>
            <button className="p-2 bg-gray-800 rounded-lg text-gray-400 hover:text-white transition-colors">
                <Plus size={20} />
            </button>
        </div>

        <div className="space-y-3">
            {tasks.map((task) => (
                <div 
                    key={task.id}
                    onClick={() => handleTaskClick(task)}
                    className={`group relative flex items-center justify-between p-4 rounded-xl border transition-all duration-300 cursor-pointer select-none ${
                        task.is_completed 
                        ? 'bg-gray-900/50 border-gray-800 opacity-60' 
                        : 'bg-card border-gray-800 hover:border-neon-purple/50 hover:shadow-lg hover:shadow-neon-purple/10'
                    }`}
                >
                    <div className="flex items-center space-x-4">
                        <div className={`transition-colors duration-300 ${task.is_completed ? 'text-neon-green' : 'text-gray-600 group-hover:text-neon-purple'}`}>
                            {task.is_completed ? <CheckCircle2 size={24} /> : <Circle size={24} />}
                        </div>
                        <div>
                            <h4 className={`font-medium ${task.is_completed ? 'text-gray-500 line-through' : 'text-white'}`}>
                                {task.title}
                            </h4>
                            <div className="flex items-center space-x-2 mt-1">
                                {getIcon(task.category)}
                                <span className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">{task.category}</span>
                            </div>
                        </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                        {task.requires_evidence && !task.is_completed && (
                            <div className="bg-gray-800 p-1.5 rounded-md text-gray-400 group-hover:text-white">
                                <Camera size={14} />
                            </div>
                        )}
                        <div className="flex items-center bg-black/30 px-3 py-1 rounded-md border border-gray-800">
                            <span className={`text-xs font-bold ${task.is_completed ? 'text-gray-500' : 'text-neon-purple'}`}>
                                +{task.xp} XP
                            </span>
                        </div>
                    </div>
                </div>
            ))}
        </div>
      </div>

      <XPModal 
        xp={rewardData.xp} 
        message={rewardData.message} 
        isOpen={showReward} 
        onClose={() => setShowReward(false)} 
      />

      <EvidenceModal 
        isOpen={showEvidence} 
        onClose={() => setShowEvidence(false)} 
        onConfirm={handleEvidenceConfirmed}
        taskTitle={evidenceTask?.title || ''}
      />

      <PerfectDayModal 
        isOpen={showPerfectDay}
        onClose={() => setShowPerfectDay(false)}
        xpGained={perfectDayXp}
      />
    </div>
  );
};

export default Home;