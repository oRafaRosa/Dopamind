import React from 'react';
import { Calendar as CalendarIcon, Check, Flame, X } from 'lucide-react';
import { DayLog } from '../types';

const CalendarWidget = () => {
  // Get current date info
  const today = new Date();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay(); // 0 = Sunday

  // Mock Data Generator for the current month
  const getMockHistory = (): Record<number, DayLog> => {
    const history: Record<number, DayLog> = {};
    const currentDay = today.getDate();

    for (let i = 1; i <= currentDay; i++) {
        // Randomly assign status for demo purposes
        const rand = Math.random();
        let status: 'perfect' | 'active' | 'inactive' = 'inactive';
        let xp = 0;

        if (rand > 0.6) {
            status = 'perfect';
            xp = 450;
        } else if (rand > 0.3) {
            status = 'active';
            xp = 120;
        }

        // Make today always active/perfect for demo
        if (i === currentDay) {
            status = 'active';
            xp = 150;
        }

        history[i] = {
            date: `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`,
            status,
            xp_earned: xp
        };
    }
    return history;
  };

  const history = getMockHistory();
  const monthNames = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];

  // Helper to render grid cells
  const renderCalendarDays = () => {
    const cells = [];
    
    // Empty cells for padding before start of month
    for (let i = 0; i < firstDayOfMonth; i++) {
        cells.push(<div key={`empty-${i}`} className="h-10 w-full"></div>);
    }

    // Actual days
    for (let day = 1; day <= daysInMonth; day++) {
        const log = history[day];
        const isToday = day === today.getDate();
        const isFuture = day > today.getDate();
        
        let bgClass = "bg-gray-800/30 border border-gray-800 text-gray-600"; // Default Inactive
        let content = <span className="text-[10px]">{day}</span>;

        if (!isFuture && log) {
            if (log.status === 'perfect') {
                bgClass = "bg-neon-green text-black border border-neon-green shadow-[0_0_10px_rgba(16,185,129,0.3)]";
                content = (
                    <div className="flex flex-col items-center justify-center h-full">
                        <Check size={14} strokeWidth={4} />
                    </div>
                );
            } else if (log.status === 'active') {
                bgClass = "bg-yellow-500/20 text-yellow-500 border border-yellow-500/30";
                content = (
                    <div className="flex flex-col items-center justify-center h-full">
                        <span className="text-[10px] font-bold">{day}</span>
                        <div className="w-1 h-1 bg-yellow-500 rounded-full mt-0.5"></div>
                    </div>
                );
            }
        }

        if (isToday) {
            bgClass += " ring-2 ring-white ring-offset-1 ring-offset-background";
        }

        cells.push(
            <div 
                key={day} 
                className={`h-10 rounded-lg flex items-center justify-center transition-all ${bgClass} ${isFuture ? 'opacity-20' : ''}`}
            >
                {content}
            </div>
        );
    }

    return cells;
  };

  return (
    <div>
        <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 ml-1 flex items-center justify-between">
            <span>Consistência</span>
            <span className="text-[10px] text-neon-green flex items-center">
                <Flame size={12} className="mr-1" fill="currentColor" /> 94% Perfect
            </span>
        </h3>
        <div className="bg-card border border-gray-800 rounded-2xl p-4">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center text-white font-display font-bold text-lg">
                    <CalendarIcon size={18} className="mr-2 text-gray-400" />
                    {monthNames[currentMonth]} {currentYear}
                </div>
            </div>

            {/* Weekday Headers */}
            <div className="grid grid-cols-7 gap-1 mb-2 text-center">
                {['D', 'S', 'T', 'Q', 'Q', 'S', 'S'].map((d, i) => (
                    <div key={i} className="text-[10px] font-bold text-gray-500">{d}</div>
                ))}
            </div>

            {/* Days Grid */}
            <div className="grid grid-cols-7 gap-2">
                {renderCalendarDays()}
            </div>

            {/* Legend */}
            <div className="flex items-center justify-center space-x-4 mt-4 pt-4 border-t border-gray-800">
                <div className="flex items-center space-x-1.5">
                    <div className="w-3 h-3 rounded bg-neon-green border border-neon-green shadow-[0_0_5px_rgba(16,185,129,0.5)]"></div>
                    <span className="text-[10px] text-gray-400">Perfect Day</span>
                </div>
                <div className="flex items-center space-x-1.5">
                    <div className="w-3 h-3 rounded bg-yellow-500/20 border border-yellow-500/30"></div>
                    <span className="text-[10px] text-gray-400">Active</span>
                </div>
                <div className="flex items-center space-x-1.5">
                    <div className="w-3 h-3 rounded bg-gray-800/30 border border-gray-800"></div>
                    <span className="text-[10px] text-gray-400">Missed</span>
                </div>
            </div>
        </div>
    </div>
  );
};

export default CalendarWidget;