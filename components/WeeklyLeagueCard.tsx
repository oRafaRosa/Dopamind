import React, { useEffect, useState } from 'react';
import { Trophy, ArrowUpRight } from 'lucide-react';
import { WeeklyLeagueStatus } from '../types';
import { supabase, isSupabaseConfigured } from '../services/supabaseClient';
import { getXpHistory } from '../services/database';
import { buildWeeklyStatus, getWeekStart, getWeekEnd, getWeeklyXpLocal } from '../services/league';

const WeeklyLeagueCard = () => {
  const [status, setStatus] = useState<WeeklyLeagueStatus>(buildWeeklyStatus(0));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadWeeklyXp = async () => {
      let weeklyXp = 0;

      if (isSupabaseConfigured()) {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const history = await getXpHistory(user.id);
          const weekStart = getWeekStart(new Date());
          const weekEnd = getWeekEnd(new Date());

          weeklyXp = history.reduce((sum, entry) => {
            const entryDate = new Date(entry.date);
            if (entryDate >= weekStart && entryDate <= weekEnd) {
              return sum + entry.amount;
            }
            return sum;
          }, 0);
        }
      } else {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          weeklyXp = getWeeklyXpLocal(user.id);
        }
      }

      setStatus(buildWeeklyStatus(weeklyXp));
      setLoading(false);
    };

    loadWeeklyXp();
  }, []);

  if (loading) {
    return (
      <div className="bg-card border border-gray-800 rounded-2xl p-5 animate-pulse">
        <div className="h-4 w-40 bg-gray-800 rounded mb-3"></div>
        <div className="h-3 w-full bg-gray-800 rounded"></div>
      </div>
    );
  }

  return (
    <div className="bg-card border border-gray-800 rounded-2xl p-5 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-24 h-24 bg-neon-purple/10 blur-2xl rounded-full"></div>
      <div className="relative">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs text-gray-500 uppercase tracking-widest">Liga Semanal</div>
            <div className={`text-lg font-bold ${status.tier.colorClass}`}>{status.tier.name}</div>
          </div>
          <div className="flex items-center space-x-2">
            <Trophy size={20} className="text-yellow-400" />
            <span className="text-sm text-white font-bold">{status.weeklyXp} XP</span>
          </div>
        </div>

        <div className="mt-3 text-[10px] text-gray-500">
          Semana: {status.weekStart} → {status.weekEnd}
        </div>

        <div className="mt-4">
          <div className="flex items-center justify-between text-[10px] text-gray-500 mb-1">
            <span>Progresso</span>
            {status.nextTier ? (
              <span className="flex items-center text-neon-purple">
                {status.nextTier.name} <ArrowUpRight size={10} className="ml-1" />
              </span>
            ) : (
              <span className="text-neon-purple">MAX</span>
            )}
          </div>
          <div className="h-2 w-full bg-gray-900 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-neon-purple to-white transition-all"
              style={{ width: `${status.progressToNext}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeeklyLeagueCard;
