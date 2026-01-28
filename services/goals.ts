import { Goal, GoalPeriod, TaskCategory } from '../types';

const GOALS_STORAGE_KEY = 'dopamind_goals';

// --- PRE-DEFINED GOALS ---

const GOAL_TEMPLATES = {
  daily: [
    {
      id: 'daily_complete_5',
      title: 'Momentum Diário',
      description: 'Complete 5 tarefas hoje',
      requirement: { type: 'complete_tasks' as const, target: 5 },
      reward: { xp: 50, credits: 10 }
    },
    {
      id: 'daily_focus_25',
      title: 'Sessão Focada',
      description: 'Acumule 25 minutos de foco',
      requirement: { type: 'focus_time' as const, target: 25 },
      reward: { xp: 30, credits: 5 }
    },
    {
      id: 'daily_body',
      title: 'Guerreiro do Corpo',
      description: 'Complete 2 tarefas de Body',
      requirement: { type: 'complete_category' as const, target: 2, category: 'Body' as TaskCategory },
      reward: { xp: 40, credits: 8 }
    },
    {
      id: 'daily_mind',
      title: 'Sábio da Mente',
      description: 'Complete 2 tarefas de Mind',
      requirement: { type: 'complete_category' as const, target: 2, category: 'Mind' as TaskCategory },
      reward: { xp: 40, credits: 8 }
    }
  ],
  weekly: [
    {
      id: 'weekly_complete_25',
      title: 'Maratona Semanal',
      description: 'Complete 25 tarefas esta semana',
      requirement: { type: 'complete_tasks' as const, target: 25 },
      reward: { xp: 200, credits: 50, tickets: 2 }
    },
    {
      id: 'weekly_xp_1000',
      title: 'Ascensão',
      description: 'Ganhe 1000 XP esta semana',
      requirement: { type: 'earn_xp' as const, target: 1000 },
      reward: { xp: 150, credits: 40, tickets: 1 }
    },
    {
      id: 'weekly_focus_300',
      title: 'Mestre do Foco',
      description: 'Acumule 300 minutos de foco',
      requirement: { type: 'focus_time' as const, target: 300 },
      reward: { xp: 250, credits: 60, tickets: 2 }
    },
    {
      id: 'weekly_streak',
      title: 'Consistência Inquebrantável',
      description: 'Mantenha 7 dias de streak',
      requirement: { type: 'maintain_streak' as const, target: 7 },
      reward: { xp: 300, credits: 75, tickets: 3 }
    }
  ],
  seasonal: [
    {
      id: 'seasonal_complete_300',
      title: 'Campeão da Temporada',
      description: 'Complete 300 tarefas nesta temporada (90 dias)',
      requirement: { type: 'complete_tasks' as const, target: 300 },
      reward: { xp: 2000, credits: 500, tickets: 10 }
    },
    {
      id: 'seasonal_xp_10000',
      title: 'Lenda Ascendente',
      description: 'Ganhe 10.000 XP nesta temporada',
      requirement: { type: 'earn_xp' as const, target: 10000 },
      reward: { xp: 1500, credits: 400, tickets: 8 }
    },
    {
      id: 'seasonal_streak_30',
      title: 'Imortal',
      description: 'Alcance 30 dias de streak',
      requirement: { type: 'maintain_streak' as const, target: 30 },
      reward: { xp: 3000, credits: 750, tickets: 15 }
    }
  ]
};

// --- DATE CALCULATIONS ---

export const getStartOfDay = (): Date => {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  return now;
};

export const getStartOfWeek = (): Date => {
  const now = new Date();
  const day = now.getDay();
  const diff = day === 0 ? -6 : 1 - day; // Monday as start
  const monday = new Date(now);
  monday.setDate(now.getDate() + diff);
  monday.setHours(0, 0, 0, 0);
  return monday;
};

export const getStartOfSeason = (): Date => {
  // Season = 90 days, starts on first Monday of every quarter
  const now = new Date();
  const quarter = Math.floor(now.getMonth() / 3);
  const seasonStart = new Date(now.getFullYear(), quarter * 3, 1);
  
  // Find first Monday of the quarter
  const day = seasonStart.getDay();
  const diff = day === 0 ? 1 : (8 - day) % 7;
  seasonStart.setDate(seasonStart.getDate() + diff);
  seasonStart.setHours(0, 0, 0, 0);
  
  return seasonStart;
};

export const getExpirationDate = (period: GoalPeriod): string => {
  const now = new Date();
  let expiration: Date;

  switch (period) {
    case 'daily':
      expiration = new Date(now);
      expiration.setDate(now.getDate() + 1);
      expiration.setHours(0, 0, 0, 0);
      break;
    case 'weekly':
      expiration = getStartOfWeek();
      expiration.setDate(expiration.getDate() + 7);
      break;
    case 'seasonal':
      expiration = getStartOfSeason();
      expiration.setDate(expiration.getDate() + 90);
      break;
  }

  return expiration.toISOString();
};

// --- GOAL MANAGEMENT ---

export const initializeGoals = (): Goal[] => {
  const goals: Goal[] = [];
  const now = new Date();

  // Create goals from templates
  Object.entries(GOAL_TEMPLATES).forEach(([period, templates]) => {
    templates.forEach((template) => {
      goals.push({
        ...template,
        period: period as GoalPeriod,
        progress: 0,
        completed: false,
        expiresAt: getExpirationDate(period as GoalPeriod)
      });
    });
  });

  return goals;
};

export const loadGoals = (): Goal[] => {
  try {
    const stored = localStorage.getItem(GOALS_STORAGE_KEY);
    if (!stored) return initializeGoals();

    const goals: Goal[] = JSON.parse(stored);
    
    // Check for expired goals and reset them
    const now = new Date();
    const updatedGoals = goals.map(goal => {
      const expiration = new Date(goal.expiresAt);
      if (now > expiration) {
        // Reset goal
        return {
          ...goal,
          progress: 0,
          completed: false,
          expiresAt: getExpirationDate(goal.period)
        };
      }
      return goal;
    });

    saveGoals(updatedGoals);
    return updatedGoals;
  } catch (error) {
    console.error('Error loading goals:', error);
    return initializeGoals();
  }
};

export const saveGoals = (goals: Goal[]): void => {
  try {
    localStorage.setItem(GOALS_STORAGE_KEY, JSON.stringify(goals));
  } catch (error) {
    console.error('Error saving goals:', error);
  }
};

// --- PROGRESS TRACKING ---

export const updateGoalProgress = (
  goalId: string,
  increment: number
): Goal | null => {
  const goals = loadGoals();
  const goalIndex = goals.findIndex(g => g.id === goalId);
  
  if (goalIndex === -1) return null;
  
  const goal = goals[goalIndex];
  if (goal.completed) return goal; // Already completed

  goal.progress = Math.min(goal.progress + increment, goal.requirement.target);
  
  if (goal.progress >= goal.requirement.target) {
    goal.completed = true;
  }

  saveGoals(goals);
  return goal;
};

export const trackTaskCompletion = (category?: TaskCategory): Goal[] => {
  const goals = loadGoals();
  const updatedGoals: Goal[] = [];

  goals.forEach(goal => {
    if (goal.completed) {
      updatedGoals.push(goal);
      return;
    }

    // Update task completion goals
    if (goal.requirement.type === 'complete_tasks') {
      goal.progress = Math.min(goal.progress + 1, goal.requirement.target);
      if (goal.progress >= goal.requirement.target) goal.completed = true;
    }

    // Update category-specific goals
    if (
      goal.requirement.type === 'complete_category' &&
      goal.requirement.category === category
    ) {
      goal.progress = Math.min(goal.progress + 1, goal.requirement.target);
      if (goal.progress >= goal.requirement.target) goal.completed = true;
    }

    updatedGoals.push(goal);
  });

  saveGoals(updatedGoals);
  return updatedGoals.filter(g => g.completed && g.progress === g.requirement.target);
};

export const trackXpGain = (amount: number): Goal[] => {
  const goals = loadGoals();
  const completedGoals: Goal[] = [];

  goals.forEach(goal => {
    if (goal.completed) return;
    if (goal.requirement.type !== 'earn_xp') return;

    goal.progress = Math.min(goal.progress + amount, goal.requirement.target);
    if (goal.progress >= goal.requirement.target) {
      goal.completed = true;
      completedGoals.push(goal);
    }
  });

  saveGoals(goals);
  return completedGoals;
};

export const trackFocusTime = (minutes: number): Goal[] => {
  const goals = loadGoals();
  const completedGoals: Goal[] = [];

  goals.forEach(goal => {
    if (goal.completed) return;
    if (goal.requirement.type !== 'focus_time') return;

    goal.progress = Math.min(goal.progress + minutes, goal.requirement.target);
    if (goal.progress >= goal.requirement.target) {
      goal.completed = true;
      completedGoals.push(goal);
    }
  });

  saveGoals(goals);
  return completedGoals;
};

export const trackStreakUpdate = (currentStreak: number): Goal[] => {
  const goals = loadGoals();
  const completedGoals: Goal[] = [];

  goals.forEach(goal => {
    if (goal.completed) return;
    if (goal.requirement.type !== 'maintain_streak') return;

    goal.progress = currentStreak;
    if (goal.progress >= goal.requirement.target) {
      goal.completed = true;
      completedGoals.push(goal);
    }
  });

  saveGoals(goals);
  return completedGoals;
};

// --- GET ACTIVE GOALS BY PERIOD ---

export const getGoalsByPeriod = (period: GoalPeriod): Goal[] => {
  const goals = loadGoals();
  return goals.filter(g => g.period === period);
};

export const getActiveGoals = (): Goal[] => {
  return loadGoals().filter(g => !g.completed);
};

export const getCompletedGoalsToday = (): Goal[] => {
  const goals = loadGoals();
  const today = new Date().toDateString();
  
  return goals.filter(g => {
    if (!g.completed) return false;
    const expiration = new Date(g.expiresAt);
    return expiration.toDateString() === today;
  });
};
