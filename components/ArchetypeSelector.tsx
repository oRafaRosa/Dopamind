import React from 'react';
import { Archetype, ArchetypeId } from '../types';
import { ARCHETYPES } from '../services/archetypes';

interface ArchetypeSelectorProps {
  selectedId: ArchetypeId;
  onSelect: (archetype: Archetype) => void;
}

const ArchetypeSelector = ({ selectedId, onSelect }: ArchetypeSelectorProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
      {ARCHETYPES.map((archetype) => {
        const isSelected = archetype.id === selectedId;
        return (
          <button
            key={archetype.id}
            onClick={() => onSelect(archetype)}
            className={`text-left p-4 rounded-xl border transition-all ${
              isSelected
                ? 'border-neon-purple/60 bg-neon-purple/10 shadow-lg shadow-neon-purple/10'
                : 'border-gray-800 bg-card hover:border-gray-700'
            }`}
          >
            <div className="flex items-center justify-between">
              <div>
                <div className={`text-sm font-bold ${archetype.colorClass}`}>{archetype.name.toUpperCase()}</div>
                <div className="text-xs text-gray-500 mt-1">Foco: {archetype.focus}</div>
              </div>
              {isSelected && (
                <span className="text-[10px] font-bold text-neon-purple border border-neon-purple/40 px-2 py-0.5 rounded">ATIVO</span>
              )}
            </div>
            <p className="text-xs text-gray-400 mt-2 leading-relaxed">{archetype.description}</p>
            <div className="mt-3 space-y-1">
              {archetype.perks.map((perk) => (
                <div key={perk.id} className="text-[10px] text-gray-400">
                  • <span className="text-white font-semibold">{perk.title}</span> — {perk.description}
                </div>
              ))}
            </div>
          </button>
        );
      })}
    </div>
  );
};

export default ArchetypeSelector;
