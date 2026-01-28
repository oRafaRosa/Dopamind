import React, { useState, useEffect } from 'react';
import { Profile, Task, Goal, getAuraConfig } from '../types';
import { supabase } from '../services/supabaseClient';
import { getProfile, getTasks, updateProfile, updateTask, createTask, addXpEntry, updateDayLog, addRouletteTickets, checkDailyLoginBonus } from '../services/database';
import { applyArchetypeBonuses, getUserArchetypeId } from '../services/archetypes';
import { addWeeklyXpLocal } from '../services/league';
import { getActiveXpMultiplier } from '../services/inventory';
import { loadGoals, trackTaskCompletion, trackXpGain, trackStreakUpdate } from '../services/goals';
import { getActiveBossRaid, dealBossDamage, calculateBossDamage } from '../services/boss';
import XPModal from '../components/XPModal';
import EvidenceModal from '../components/EvidenceModal';
import PerfectDayModal from '../components/PerfectDayModal';
import BossRaidWidget from '../components/BossRaidWidget';
import GoalsWidget from '../components/GoalsWidget';
import { Flame, CheckCircle2, Circle, Dumbbell, BookOpen, Brain, Briefcase, Plus, Camera, Coins, Activity } from 'lucide-react';

const Home = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [defaultTasksCreated, setDefaultTasksCreated] = useState(false);
  const [goals, setGoals] = useState<Goal[]>([]);

  // Load user and data on mount
  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      if (user) {
        await loadProfileAndTasks(user.id);
      }
      setLoading(false);
    };

    getUser();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        await loadProfileAndTasks(session.user.id);
      } else {
        setProfile(null);
        setTasks([]);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const loadProfileAndTasks = async (userId: string) => {
    console.log('Loading profile and tasks for user:', userId);
    const profileData = await getProfile(userId);
    console.log('Profile data:', profileData);
    const tasksData = await getTasks(userId);
    console.log('Tasks data:', tasksData);

    if (profileData) {
      setProfile(profileData);

      // Check daily login bonus
      const bonusAwarded = await checkDailyLoginBonus(userId);
      if (bonusAwarded) {
        console.log('Daily login bonus awarded! +1 ticket');
        // Reload profile to get updated ticket count
        const updatedProfile = await getProfile(userId);
        if (updatedProfile) setProfile(updatedProfile);
      }

      // Update streak tracking for goals
      trackStreakUpdate(profileData.streak);
    } else {
      console.log('No profile found, will create default tasks');
    }

    setTasks(tasksData);
    
    // Load goals
    const goalsData = loadGoals();
    setGoals(goalsData);
  };

  // Modals state
  const [showReward, setShowReward] = useState(false);
  const [rewardData, setRewardData] = useState({ xp: 0, message: '' });

  const [showEvidence, setShowEvidence] = useState(false);
  const [evidenceTask, setEvidenceTask] = useState<Task | null>(null);

  const [showPerfectDay, setShowPerfectDay] = useState(false);
  const [perfectDayXp, setPerfectDayXp] = useState(0);

  // Aura Logic
  const auraConfig = profile ? getAuraConfig(profile.streak) : getAuraConfig(0);

  // Calculate Levels
  const calculateAura = (xp: number) => Math.floor(Math.sqrt(xp / 120)) + 1;

  // Progress Bar Math
  const currentLevelXpStart = profile ? 120 * Math.pow(profile.aura_level - 1, 2) : 0;
  const nextLevelXpThreshold = profile ? 120 * Math.pow(profile.aura_level, 2) : 120;
  const xpInCurrentLevel = profile ? profile.total_xp - currentLevelXpStart : 0;
  const xpNeededForLevel = nextLevelXpThreshold - currentLevelXpStart;
  const progressPercent = profile && xpNeededForLevel > 0 ? Math.min(100, Math.max(0, (xpInCurrentLevel / xpNeededForLevel) * 100)) : 0;

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

  const completeTask = async (taskId: string) => {
    if (!profile || !user) return;

    const taskIndex = tasks.findIndex(t => t.id === taskId);
    if (tasks[taskIndex].is_completed) return;

    const newTasks = [...tasks];
    newTasks[taskIndex].is_completed = true;
    setTasks(newTasks);

    const task = newTasks[taskIndex];
    let xpGained = task.xp;
    let creditsGained = Math.floor(xpGained / 10); // 10% of XP as credits
    let isPerfectDay = false;

    // Apply archetype passive bonuses (local profile-based)
    const archetypeId = getUserArchetypeId(user.id);
    const bonusResult = applyArchetypeBonuses(archetypeId, task.category, xpGained, creditsGained);
    xpGained = bonusResult.xp;
    creditsGained = bonusResult.credits;

    // Apply active item boosts (XP Booster 24h)
    const xpMultiplier = getActiveXpMultiplier(user.id);
    if (xpMultiplier > 1) {
      const boostXp = Math.round(xpGained * xpMultiplier) - xpGained;
      xpGained = Math.round(xpGained * xpMultiplier);
      bonusResult.xpBonus += boostXp;
    }

    // Simulate Stat Gain - Safe Access
    const currentStats = profile.stats || { str: 0, int: 0, foc: 0, spi: 0, cha: 0 };
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
      const bonusNote = bonusResult.xpBonus > 0
        ? `Bônus de classe: +${bonusResult.xpBonus} XP`
        : '';
      const quotes = [
        "Sem evidência, sem XP.",
        "O mundo hackeou sua dopamina. Hackeie de volta.",
        "Consistência é rei.",
        "GG. Aura subindo.",
        "Easy peasy.",
        "Farmando na vida real."
      ];
      const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
      setRewardData({ xp: xpGained, message: bonusNote ? `${randomQuote} • ${bonusNote}` : randomQuote });
      setShowReward(true);
    }

    // Update Profile
    const newTotalXp = profile.total_xp + xpGained;
    const newLevel = calculateAura(newTotalXp);

    const updatedProfile = {
      ...profile,
      total_xp: newTotalXp,
      aura_level: newLevel,
      credits: profile.credits + creditsGained,
      stats: newStats
    };

    setProfile(updatedProfile);

    // Save to database
    await updateTask(taskId, { is_completed: true });
    await updateProfile(user.id, {
      total_xp: newTotalXp,
      aura_level: newLevel,
      credits: profile.credits + creditsGained,
      stats: newStats
    });
    await addXpEntry(user.id, `Task: ${task.title}`, xpGained);

    // Weekly league local tracking (fallback when no DB aggregation exists)
    addWeeklyXpLocal(user.id, xpGained);

    // Track goals progress
    const completedGoalsFromTasks = trackTaskCompletion(task.category);
    const completedGoalsFromXp = trackXpGain(xpGained);
    const allCompletedGoals = [...completedGoalsFromTasks, ...completedGoalsFromXp];
    
    // Award rewards for completed goals
    if (allCompletedGoals.length > 0) {
      for (const completedGoal of allCompletedGoals) {
        const goalRewardXp = completedGoal.reward.xp;
        const goalRewardCredits = completedGoal.reward.credits;
        const goalRewardTickets = completedGoal.reward.tickets || 0;
        
        // Update profile with goal rewards
        const currentProfile = await getProfile(user.id);
        if (currentProfile) {
          await updateProfile(user.id, {
            total_xp: currentProfile.total_xp + goalRewardXp,
            credits: currentProfile.credits + goalRewardCredits
          });
          if (goalRewardTickets > 0) {
            await addRouletteTickets(user.id, goalRewardTickets);
          }
          await addXpEntry(user.id, `Goal: ${completedGoal.title}`, goalRewardXp);
          console.log(`🏆 Goal completed: ${completedGoal.title} (+${goalRewardXp} XP, +${goalRewardCredits}¢)`);
        }
      }
      // Reload goals to get updated state
      setGoals(loadGoals());
    }

    // Deal damage to boss raid
    const activeBoss = await getActiveBossRaid();
    if (activeBoss) {
      const damage = calculateBossDamage(xpGained);
      const result = await dealBossDamage(activeBoss.id, user.id, damage, 1, 0);
      if (result?.defeated) {
        console.log('🎉 BOSS DERROTADO! A comunidade venceu!');
      }
    }

    // Award ticket if task grants it
    if (task.grants_ticket) {
      await addRouletteTickets(user.id, 1);
      // Update local profile
      setProfile(prev => prev ? { ...prev, roulette_tickets: prev.roulette_tickets + 1 } : null);
      console.log('Ticket awarded for completing task!');
    }

    // Update day log
    const today = new Date().toISOString().split('T')[0];
    await updateDayLog(user.id, today, 'active', xpGained);
  };

  const getIcon = (category: string) => {
    switch (category) {
      case 'Body': return <Dumbbell size={18} className="text-emerald-400" />;
      case 'Mind': return <BookOpen size={18} className="text-blue-400" />;
      case 'Work': return <Briefcase size={18} className="text-orange-400" />;
      default: return <Brain size={18} className="text-purple-400" />;
    }
  };

  const completedCount = tasks.filter(t => t.is_completed).length;
  const completionRate = tasks.length > 0 ? Math.round((completedCount / tasks.length) * 100) : 0;

  // Create default tasks if none exist (MUST be before early returns)
  useEffect(() => {
    if (tasks.length === 0 && user && !loading && !defaultTasksCreated) {
      const defaultTasks = [
        { user_id: user.id, title: 'Treino de Força', category: 'Body', xp: 80, requires_evidence: true, is_completed: false },
        { user_id: user.id, title: 'Leitura (20 min)', category: 'Mind', xp: 40, is_completed: false },
        { user_id: user.id, title: 'Deep Work (2h)', category: 'Work', xp: 120, is_completed: false },
        { user_id: user.id, title: 'Zero Açúcar', category: 'Body', xp: 60, is_completed: false },
      ];

      const createDefaultTasks = async () => {
        console.log('Creating default tasks...');
        setDefaultTasksCreated(true);
        for (const task of defaultTasks) {
          await createTask(task);
        }
        // Reload data after creating tasks
        await loadProfileAndTasks(user.id);
      };

      createDefaultTasks();
    }
  }, [user, loading, defaultTasksCreated, tasks.length]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-white">Carregando...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-white">Por favor, faça login para continuar.</div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-white">Perfil não encontrado. Tente recarregar a página.</div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-slide-up pb-20">
      {/* Header Stats */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className={`relative p-0.5 rounded-full border-2 ${auraConfig.border}`}>
            <img src={profile.avatar_url} alt="Avatar" className="w-14 h-14 rounded-full" />
            <div className="absolute -bottom-1 -right-1 bg-background text-[10px] font-bold px-1.5 py-0.5 rounded border border-gray-700">
              LVL {profile.aura_level}
            </div>
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">{profile.display_name}</h1>
            <div className={`flex items-center space-x-2 text-xs font-bold uppercase tracking-wider ${auraConfig.color}`}>
              <Activity size={12} />
              <span>{auraConfig.state}</span>
              {profile.is_pro && <span className="text-yellow-400">PRO</span>}
            </div>
          </div>
        </div>
        <div className="flex flex-col items-end space-y-1">
          <div className={`flex items-center space-x-1 px-3 py-1 rounded-full border ${auraConfig.bg} ${auraConfig.border} ${auraConfig.color}`}>
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
            className={`h-full bg-gradient-to-r from-gray-600 to-white transition-all duration-1000 ease-out`}
            style={{ width: `${progressPercent}%` }}
          >
            {/* Overlay color based on Aura State */}
            <div className={`absolute inset-0 opacity-70 ${auraConfig.bg.replace('/10', '')}`}></div>
          </div>
        </div>
      </div>

      {/* Boss Raid Widget */}
      <BossRaidWidget />

      {/* Goals Widgets */}
      <GoalsWidget goals={goals} period="daily" />
      <GoalsWidget goals={goals} period="weekly" />
      <GoalsWidget goals={goals} period="seasonal" />

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
              className={`group relative flex items-center justify-between p-4 rounded-xl border transition-all duration-300 cursor-pointer select-none ${task.is_completed
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