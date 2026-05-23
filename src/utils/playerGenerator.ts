import { Player, PlayerRole, Rarity, PlayerStats } from '../types';

const NAMES = ['Alex', 'Dmitry', 'Sasha', 'Ivan', 'Luca', 'Max', 'Sam', 'Erik', 'Nikola', 'Finn'];
const NICKNAMES = ['Viper', 'Ghost', 'Striker', 'Shadow', 'Ace', 'Hunter', 'Blade', 'Cipher', 'Rogue', 'Raven', 'Titan', 'Apex', 'Nova', 'Storm', 'Blitz'];
const ROLES: PlayerRole[] = ['Captain', 'Support', 'Rifler', 'Sniper', 'Lurker'];
const RARITIES: Rarity[] = ['Common', 'Rare', 'Epic', 'Legendary', 'Virtual'];

const TEAMS = [
  { name: 'Astralis Force', logo: 'https://api.dicebear.com/7.x/identicon/svg?seed=astralis' },
  { name: 'Natus Vincere', logo: 'https://api.dicebear.com/7.x/identicon/svg?seed=navi' },
  { name: 'Team Spirit', logo: 'https://api.dicebear.com/7.x/identicon/svg?seed=spirit' },
  { name: 'ECSTATIC', logo: 'https://api.dicebear.com/7.x/identicon/svg?seed=ecstatic' },
  { name: 'G2 Esports', logo: 'https://api.dicebear.com/7.x/identicon/svg?seed=g2' },
  { name: 'Virtus.pro', logo: 'https://api.dicebear.com/7.x/identicon/svg?seed=vp' },
  { name: 'FURIA', logo: 'https://api.dicebear.com/7.x/identicon/svg?seed=furia' },
];

export function generateRandomPlayer(forcedRarity?: Rarity): Player {
  const rarity = forcedRarity || weightedRandomRarity();
  const role = ROLES[Math.floor(Math.random() * ROLES.length)];
  
  const baseRange = getStatRange(rarity);
  
  const stats: PlayerStats = {
    iq: randomIn(baseRange),
    aim: randomIn(baseRange),
    movement: randomIn(baseRange),
    special: randomIn(baseRange),
    kdHistory: Array.from({ length: 10 }).map(() => (Math.random() * 1.5 + 0.5).toFixed(2)),
  };

  const name = NAMES[Math.floor(Math.random() * NAMES.length)];
  const nickname = NICKNAMES[Math.floor(Math.random() * NICKNAMES.length)] + Math.floor(Math.random() * 99);
  const team = TEAMS[Math.floor(Math.random() * TEAMS.length)];

  const rating = Math.floor((stats.aim + stats.iq + stats.movement + stats.special) / 4);
  const potential = Math.min(99, rating + 10 + Math.floor(Math.random() * 15));

  return {
    id: Math.random().toString(36).substring(2, 9),
    name,
    nickname,
    role,
    stats,
    rarity,
    price: getPrice(rarity, stats),
    avatarSeed: nickname,
    teamName: team.name,
    teamLogo: team.logo,
    level: 1,
    xp: 0,
    xpToNextLevel: 100,
    trainingsToday: 0,
    skillPoints: 0,
    rating,
    potential,
  };
}

function randomIn(range: [number, number]): number {
  return Math.floor(Math.random() * (range[1] - range[0] + 1)) + range[0];
}

function getStatRange(rarity: Rarity): [number, number] {
  switch (rarity) {
    case 'Common': return [40, 60];
    case 'Rare': return [55, 75];
    case 'Epic': return [70, 85];
    case 'Legendary': return [80, 95];
    case 'Virtual': return [90, 99];
  }
}

function weightedRandomRarity(): Rarity {
  const r = Math.random() * 100;
  if (r < 60) return 'Common';
  if (r < 85) return 'Rare';
  if (r < 95) return 'Epic';
  if (r < 99) return 'Legendary';
  return 'Virtual';
}

function getPrice(rarity: Rarity, stats: PlayerStats): number {
  const avg = (stats.iq + stats.aim + stats.movement + stats.special) / 4;
  const base = {
    Common: 500,
    Rare: 5000,
    Epic: 25000,
    Legendary: 150000,
    Virtual: 500000,
  }[rarity];
  
  return Math.floor(base * (avg / 60));
}
