import { Archetype, ArchetypeId, TaskCategory } from '../types';

export const ARCHETYPES: Archetype[] = [
  {
    id: 'warrior',
    name: 'Warrior',
    description: 'Disciplina física, poder bruto e consistência no corpo.',
    focus: 'Body',
    colorClass: 'text-emerald-400',
    perks: [
      {
        id: 'warrior-xp-body',
        title: '+10% XP (Body)',
        description: 'Ganhe mais XP em tarefas físicas.',
        effect: { xpMultiplier: 1.1, category: 'Body' }
      },
      {
        id: 'warrior-credits-body',
        title: '+5% Créditos (Body)',
        description: 'Créditos extras em tarefas físicas.',
        effect: { creditsMultiplier: 1.05, category: 'Body' }
      }
    ]
  },
  {
    id: 'sage',
    name: 'Sage',
    description: 'Mente afiada, estudo profundo e aprendizagem constante.',
    focus: 'Mind',
    colorClass: 'text-blue-400',
    perks: [
      {
        id: 'sage-xp-mind',
        title: '+10% XP (Mind)',
        description: 'Ganhe mais XP em tarefas mentais.',
        effect: { xpMultiplier: 1.1, category: 'Mind' }
      },
      {
        id: 'sage-xp-all',
        title: '+5% XP (Todas)',
        description: 'Bônus leve em qualquer tarefa.',
        effect: { xpMultiplier: 1.05 }
      }
    ]
  },
  {
    id: 'monk',
    name: 'Monk',
    description: 'Equilíbrio interno e evolução espiritual contínua.',
    focus: 'Spirit',
    colorClass: 'text-amber-400',
    perks: [
      {
        id: 'monk-xp-spirit',
        title: '+10% XP (Spirit)',
        description: 'Ganhe mais XP em tarefas espirituais.',
        effect: { xpMultiplier: 1.1, category: 'Spirit' }
      },
      {
        id: 'monk-credits-spirit',
        title: '+5% Créditos (Spirit)',
        description: 'Créditos extras em tarefas espirituais.',
        effect: { creditsMultiplier: 1.05, category: 'Spirit' }
      }
    ]
  },
  {
    id: 'architect',
    name: 'Architect',
    description: 'Construção diária, foco profundo e execução impecável.',
    focus: 'Work',
    colorClass: 'text-purple-400',
    perks: [
      {
        id: 'architect-xp-work',
        title: '+10% XP (Work)',
        description: 'Ganhe mais XP em tarefas de trabalho.',
        effect: { xpMultiplier: 1.1, category: 'Work' }
      },
      {
        id: 'architect-credits-work',
        title: '+5% Créditos (Work)',
        description: 'Créditos extras em tarefas de trabalho.',
        effect: { creditsMultiplier: 1.05, category: 'Work' }
      }
    ]
  },
  {
    id: 'bard',
    name: 'Bard',
    description: 'Conexões, carisma e vida social elevada.',
    focus: 'Life',
    colorClass: 'text-pink-400',
    perks: [
      {
        id: 'bard-xp-life',
        title: '+10% XP (Life)',
        description: 'Ganhe mais XP em tarefas sociais.',
        effect: { xpMultiplier: 1.1, category: 'Life' }
      },
      {
        id: 'bard-xp-all',
        title: '+5% XP (Todas)',
        description: 'Bônus leve em qualquer tarefa.',
        effect: { xpMultiplier: 1.05 }
      }
    ]
  },
  {
    id: 'hybrid',
    name: 'Hybrid',
    description: 'Equilíbrio entre todos os atributos.',
    focus: 'Balanced',
    colorClass: 'text-gray-400',
    perks: [
      {
        id: 'hybrid-xp-all',
        title: '+5% XP (Todas)',
        description: 'Bônus leve em qualquer tarefa.',
        effect: { xpMultiplier: 1.05 }
      }
    ]
  }
];

export const getArchetypeById = (id: ArchetypeId | null | undefined) => {
  return ARCHETYPES.find((archetype) => archetype.id === id) || ARCHETYPES[ARCHETYPES.length - 1];
};

const getStorageKey = (userId: string) => `dopamind_archetype_${userId}`;

export const getUserArchetypeId = (userId: string): ArchetypeId => {
  if (typeof window === 'undefined') return 'hybrid';
  const stored = window.localStorage.getItem(getStorageKey(userId));
  if (!stored) return 'hybrid';
  return (stored as ArchetypeId) || 'hybrid';
};

export const setUserArchetypeId = (userId: string, archetypeId: ArchetypeId) => {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(getStorageKey(userId), archetypeId);
};

export const applyArchetypeBonuses = (
  archetypeId: ArchetypeId,
  category: TaskCategory,
  xp: number,
  credits: number
) => {
  const archetype = getArchetypeById(archetypeId);

  let xpMultiplier = 1;
  let creditsMultiplier = 1;

  archetype.perks.forEach((perk) => {
    if (perk.effect.category && perk.effect.category !== category) return;
    if (perk.effect.xpMultiplier) xpMultiplier *= perk.effect.xpMultiplier;
    if (perk.effect.creditsMultiplier) creditsMultiplier *= perk.effect.creditsMultiplier;
  });

  const boostedXp = Math.round(xp * xpMultiplier);
  const boostedCredits = Math.round(credits * creditsMultiplier);

  return {
    xp: boostedXp,
    credits: boostedCredits,
    xpBonus: boostedXp - xp,
    creditsBonus: boostedCredits - credits,
    archetype
  };
};
