export type PlayerRole = 'Captain' | 'Support' | 'Rifler' | 'Sniper' | 'Lurker';

export interface PlayerStats {
  iq: number;
  aim: number;
  movement: number;
  special: number; // role-specific: Calls, Utility, Aggression, Focus
  kdHistory?: string[];
}

export type Rarity = 'Common' | 'Rare' | 'Epic' | 'Legendary' | 'Virtual';

export interface Player {
  id: string;
  name: string;
  nickname: string;
  role: PlayerRole;
  stats: PlayerStats;
  rarity: Rarity;
  price: number;
  listedPrice?: number;
  isListedByUser?: boolean;
  avatarSeed: string; // for generating consistent avatars
  teamName?: string;
  teamLogo?: string;
  level: number;
  xp: number;
  xpToNextLevel: number;
  trainingsToday: number;
  skillPoints: number;
  rating: number;
  potential: number;
}

export interface Team {
  players: (Player | null)[]; // exactly 5 slots
}

export const ROLE_SPECIAL_STAT_NAME: Record<PlayerRole, string> = {
  Captain: 'Strategy',
  Support: 'Utility',
  Rifler: 'Aggression',
  Sniper: 'Focus',
  Lurker: 'Stealth',
};

export const RARITY_CONFIG: Record<Rarity, { label: string; color: string; border: string; glow: string }> = {
  Common: { label: 'ОБЫЧНАЯ', color: 'text-zinc-500', border: 'border-zinc-500/20', glow: 'shadow-white/5' },
  Rare: { label: 'РАРКА', color: 'text-blue-400', border: 'border-blue-500/30', glow: 'shadow-blue-500/20' },
  Epic: { label: 'ЭПИК', color: 'text-purple-500', border: 'border-purple-500/30', glow: 'shadow-purple-500/20' },
  Legendary: { label: 'ЛЕГЕНДАРКА', color: 'text-yellow-500', border: 'border-yellow-500/30', glow: 'shadow-yellow-500/20' },
  Virtual: { label: 'ВИРТУАЛ', color: 'text-red-500', border: 'border-red-500/30', glow: 'shadow-red-500/20' },
};
