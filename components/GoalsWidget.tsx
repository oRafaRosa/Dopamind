import React from 'react';
import { Goal, GoalPeriod } from '../types';
import { Trophy, Target, Zap } from 'lucide-react';

interface GoalsWidgetProps {
  goals: Goal[];
  period: GoalPeriod;
}

const PERIOD_CONFIG = {
  daily: {
    title: 'Metas Diárias',
    icon: Zap,
    color: 'text-neon-blue',
    borderColor: 'border-neon-blue',
    bgColor: 'bg-neon-blue/5'
  },
  weekly: {
    title: 'Metas Semanais',
    icon: Target,
    color: 'text-neon-purple',
    borderColor: 'border-neon-purple',
    bgColor: 'bg-neon-purple/5'
  },
  seasonal: {
    title: 'Metas da Temporada',
    icon: Trophy,
    color: 'text-yellow-400',
    borderColor: 'border-yellow-400',
    bgColor: 'bg-yellow-400/5'
  }
};

export default function GoalsWidget({ goals, period }: GoalsWidgetProps) {
  const config = PERIOD_CONFIG[period];
  const Icon = config.icon;

  const periodGoals = goals.filter(g => g.period === period);

  if (periodGoals.length === 0) return null;

  return (
    <div className={`border ${config.borderColor} ${config.bgColor} rounded-2xl p-4`}>
      {/* Header */}
      <div className="flex items-center gap-2 mb-3">
        <Icon className={`w-4 h-4 ${config.color}`} />
        <h3 className={`text-sm font-bold ${config.color} uppercase tracking-wider`}>
          {config.title}
        </h3>
      </div>

      {/* Goals List */}
      <div className="space-y-2">
        {periodGoals.map((goal) => {
          const progressPercent = Math.min(
            (goal.progress / goal.requirement.target) * 100,
            100
          );
          const isCompleted = goal.completed;

          return (
            <div
              key={goal.id}
              className={`bg-card border border-gray-800 rounded-xl p-3 transition-all ${
                isCompleted ? 'opacity-60' : ''
              }`}
            >
              {/* Title & Description */}
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <h4 className={`text-sm font-bold ${isCompleted ? 'line-through text-gray-500' : 'text-white'}`}>
                    {goal.title}
                  </h4>
                  <p className="text-[10px] text-gray-500">{goal.description}</p>
                </div>
                {isCompleted && (
                  <div className="ml-2">
                    <Trophy className="w-4 h-4 text-yellow-400" />
                  </div>
                )}
              </div>

              {/* Progress Bar */}
              <div className="mb-2">
                <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-300 ${
                      isCompleted ? 'bg-yellow-400' : config.color.replace('text-', 'bg-')
                    }`}
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>

              {/* Stats Row */}
              <div className="flex items-center justify-between text-[10px]">
                <div className="text-gray-500">
                  {goal.progress} / {goal.requirement.target}
                  {goal.requirement.type === 'focus_time' && ' min'}
                  {goal.requirement.type === 'earn_xp' && ' XP'}
                </div>
                <div className="flex gap-2 text-gray-400">
                  {goal.reward.xp > 0 && (
                    <span className="text-neon-blue">+{goal.reward.xp} XP</span>
                  )}
                  {goal.reward.credits > 0 && (
                    <span className="text-yellow-400">+{goal.reward.credits}¢</span>
                  )}
                  {goal.reward.tickets && goal.reward.tickets > 0 && (
                    <span className="text-neon-purple">+{goal.reward.tickets} 🎟️</span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
