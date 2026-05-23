/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Users,
  Trophy,
  DollarSign,
  Zap,
  ArrowRight,
  Bell,
  Wallet,
  Shield,
  Crosshair,
  Target,
  ChevronDown,
  Crown,
  MapPin,
  Calendar,
  ExternalLink,
  Plus,
  Search,
  Filter,
  UserPlus,
  ShoppingBag,
  User,
  Heart,
  Brain,
  Activity,
  TrendingUp,
  Award,
  Star,
  Settings,
  ChevronRight,
  ChevronLeft,
  Trash,
  X,
  Upload,
  Clock,
  Play,
  BarChart2,
} from "lucide-react";
import { RARITY_CONFIG, ROLE_SPECIAL_STAT_NAME, Player } from "./types";
import { generateRandomPlayer } from "./utils/playerGenerator";
import { ShootingRange } from "./components/ShootingRange";

declare global {
  interface Window {
    html2canvas?: any;
  }
}

// --- Shared Components ---

const TeamLogo = ({ size = "md", className = "" }: { size?: "sm" | "md" | "lg", className?: string }) => {
  const sizes = {
    sm: "text-xl",
    md: "text-3xl",
    lg: "text-6xl"
  };

  return (
    <div className={`relative flex items-center justify-center select-none group/logo ${className}`}>
      {/* Background Glow */}
      <div className="absolute inset-0 bg-blue-500/20 blur-2xl rounded-full opacity-0 group-hover/logo:opacity-100 transition-opacity duration-700" />
      
      <div className={`relative ${sizes[size as keyof typeof sizes]} font-black italic tracking-tighter flex items-center`}>
        {/* Layered 3D Effect */}
        <span className="absolute top-[2px] left-[2px] text-zinc-900 opacity-80">VA</span>
        <span className="absolute top-[4px] left-[4px] text-blue-900/50">VA</span>
        
        {/* Main Text with Metallic Gradient */}
        <span className="relative bg-gradient-to-b from-white via-blue-100 to-blue-400 bg-clip-text text-transparent drop-shadow-[0_0_15px_rgba(37,99,235,0.5)]">
          VA
        </span>

        {/* Decorative Slash Accent */}
        <div className="absolute -right-2 bottom-1 w-[30%] h-[3px] bg-blue-500 shadow-[0_0_10px_rgba(37,99,235,1)] rounded-full transform -skew-x-12" />
      </div>
    </div>
  );
};

const BaseZoneCard = ({ title, subtitle, icon, onClick, color }: any) => {
  const colorMap: any = {
    blue: "from-blue-600/20 to-blue-900/10 border-blue-500/20 text-blue-500 shadow-[0_0_30px_rgba(37,99,235,0.1)] hover:border-blue-500/40",
    red: "from-red-600/20 to-red-900/10 border-red-500/20 text-red-500 shadow-[0_0_30px_rgba(239,68,68,0.1)] hover:border-red-500/40",
    purple: "from-purple-600/20 to-purple-900/10 border-purple-500/20 text-purple-500 shadow-[0_0_30px_rgba(168,85,247,0.1)] hover:border-purple-500/40",
    yellow: "from-amber-600/20 to-amber-900/10 border-amber-500/20 text-amber-500 shadow-[0_0_30px_rgba(245,158,11,0.1)] hover:border-amber-500/40",
  };

  return (
    <button
      onClick={onClick}
      className={`group relative flex flex-col p-8 rounded-[32px] border bg-gradient-to-br transition-all duration-300 hover:-translate-y-1 text-left ${colorMap[color] || colorMap.blue}`}
    >
      <div className="w-14 h-14 rounded-2xl bg-black/40 flex items-center justify-center mb-6 border border-white/5 group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <h3 className="text-xl font-black text-white italic uppercase tracking-tighter mb-1">
        {title}
      </h3>
      <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest opacity-80 group-hover:opacity-100 transition-opacity">
        {subtitle}
      </p>
      
      <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center">
          <ChevronRight size={16} className="text-white" />
        </div>
      </div>
    </button>
  );
};

const NavbarItem = ({
  label,
  active = false,
  onClick,
}: {
  label: string;
  active?: boolean;
  onClick?: () => void;
}) => (
  <button
    onClick={onClick}
    className={`relative px-4 py-2 text-[11px] font-bold uppercase tracking-wider transition-all cursor-pointer group
    ${active ? "text-white" : "text-zinc-400 hover:text-white"}`}
  >
    {label}
    {active && (
      <motion.div
        layoutId="navActive"
        className="absolute bottom-[-2px] left-4 right-4 h-[2px] bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.8)]"
      />
    )}
  </button>
);

const FilterButton = ({
  icon: Icon,
  label,
  color = "text-blue-500",
  active = false,
  onClick,
}: any) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-3 px-4 py-3 rounded-lg border transition-all group w-full
    ${active ? "bg-blue-600/10 border-blue-600/30 text-white" : "bg-white/[0.02] border-white/[0.05] text-zinc-500 hover:border-white/10 hover:text-zinc-300"}`}
  >
    <Icon size={16} className={`${active ? color : "text-zinc-600"} group-hover:scale-110 transition-transform`} />
    <span className="text-xs font-bold tracking-wide">{label}</span>
  </button>
);

const RoleButton = ({ icon: Icon, label, active = false, onClick }: any) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-3 px-4 py-3 rounded-lg border transition-all group w-full
    ${active ? "bg-white/[0.05] border-white/10 text-white" : "bg-transparent border-white/[0.02] text-zinc-600 hover:text-zinc-400"}`}
  >
    <Icon size={16} className={active ? "text-blue-500" : "text-zinc-700"} />
    <span className="text-xs font-bold tracking-wide">{label}</span>
  </button>
);

const StatCircle = ({ label, value, icon: Icon, color, isHidden = false }: any) => {
  const radius = 22;
  const circumference = 2 * Math.PI * radius;
  const numericValue = isHidden ? 0 : value;
  const offset = circumference - (numericValue / 100) * circumference;

  return (
    <div className="flex flex-col items-center">
      <div className="mb-6 flex flex-col items-center gap-1">
        <Icon size={12} className={color} />
        <span className="text-[7px] font-black tracking-widest uppercase opacity-60 text-white">{label}</span>
      </div>
      <div className="relative">
        <svg className="w-14 h-14 -rotate-90">
          <circle
            cx="28"
            cy="28"
            r={radius}
            fill="transparent"
            stroke="currentColor"
            strokeWidth="3"
            className="text-zinc-900"
          />
          <motion.circle
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            cx="28"
            cy="28"
            r={radius}
            fill="transparent"
            stroke="currentColor"
            strokeWidth="3"
            strokeDasharray={circumference}
            className={color}
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-sm font-black text-white italic">{isHidden ? "?" : value}</span>
        </div>
      </div>
    </div>
  );
};

const StatSegmentedBar = ({ label, value, icon: Icon, isHidden = false }: any) => (
  <div className="space-y-2">
    <h4 className="text-[8px] font-black text-zinc-500 uppercase tracking-widest leading-none">
      {label}
    </h4>
    <div className="flex items-center gap-3">
      <Icon size={14} className="text-zinc-400 shrink-0" />
      <div className="flex-1 flex gap-[2px]">
        {Array.from({ length: 12 }).map((_, i) => {
          const isActive = isHidden ? false : (i / 11) * 100 <= value;
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0.1 }}
              animate={{ opacity: isActive ? 1 : 0.1 }}
              className={`h-[4px] flex-1 rounded-[1px] ${isActive ? "bg-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.5)]" : "bg-zinc-800"}`}
            />
          );
        })}
      </div>
      <span className="text-[10px] font-black text-white italic w-6 text-right">{isHidden ? "?" : value}</span>
    </div>
  </div>
);

const KDGraph = ({ data }: { data: number[] }) => {
  if (!data || data.length === 0) return null;
  
  const width = 160;
  const height = 30;
  const numericData = data.map(Number);
  const maxVal = Math.max(...numericData, 1.5);
  const minVal = Math.min(...numericData, 0.5);
  const range = maxVal - minVal || 1;

  const points = numericData.map((val, i) => {
    const x = (i / (numericData.length - 1)) * width;
    const y = height - ((val - minVal) / range) * height;
    return `${x},${y}`;
  }).join(' ');

  const lastVal = numericData[numericData.length - 1];
  const prevVal = numericData[numericData.length - 2];
  const isUp = lastVal >= prevVal;

  return (
    <div className="space-y-3">
      <h4 className="text-[8px] font-black text-zinc-500 uppercase tracking-widest">
        К/Д ЗА ПОСЛЕДНИЕ 10 МАТЧЕЙ
      </h4>
      <div className="flex items-center justify-between gap-4">
        <div className="relative h-[30px] flex-1">
          <svg width="100%" height="100%" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none" className="overflow-visible">
            <motion.polyline
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 2, ease: "easeInOut" }}
              fill="none"
              stroke="#22c55e"
              strokeWidth="1.5"
              points={points}
              strokeLinejoin="round"
              strokeLinecap="round"
            />
            {numericData.map((val, i) => {
              const x = (i / (numericData.length - 1)) * width;
              const y = height - ((val - minVal) / range) * height;
              const color = val > 1 ? "fill-green-500" : "fill-red-500";
              const glowColor = val > 1 ? "shadow-[0_0_8px_rgba(34,197,94,0.5)]" : "shadow-[0_0_8px_rgba(239,68,68,0.5)]";
              return (
                <circle key={i} cx={x} cy={y} r="2" className={`${color} ${glowColor}`} />
              );
            })}
          </svg>
        </div>
        <div className="flex items-center gap-1 text-green-500">
           <span className="text-sm font-black italic">{lastVal.toFixed(2)}</span>
           <TrendingUp size={12} className={isUp ? "rotate-0" : "rotate-90"} />
        </div>
      </div>
    </div>
  );
};

const PlayerStatsPanel = ({ side, stats, price, onBuy, isBought, role, RoleIcon, onSell, onTrain, onUpgradeStat, level, xp, xpToNextLevel, trainingsToday, skillPoints, rating, potential, analystLevel = 0, maxTrainings = 3, hasCoach = false, isListedByUser = false }: any) => {
  const isStatsHidden = false; // Always visible for squad and market players
  const canUpgrade = !isStatsHidden && (skillPoints || 0) > 0 && (rating || 0) < (potential || 99);
  const isCapped = (rating || 0) >= (potential || 99);

  return (
    <motion.div
      initial={{ opacity: 0, x: side === 'right' ? 20 : -20, scale: 0.95 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: side === 'right' ? 10 : -10, scale: 0.95 }}
      className={`absolute z-[200] ${side === 'right' ? 'left-full ml-4' : 'right-full mr-4'} top-0 w-64 bg-[#050a14]/98 backdrop-blur-3xl p-5 rounded-2xl border border-white/5 shadow-[0_0_80px_rgba(0,0,0,0.9)] overflow-hidden`}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-blue-500 via-purple-500 to-green-500 opacity-50" />
      
      {/* Level Header */}
      {isBought && (
        <div className="mb-6 flex items-center justify-between bg-white/[0.03] p-3 rounded-xl border border-white/5">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center text-[11px] font-black italic shadow-[0_0_15px_rgba(37,99,235,0.4)]">
              L{level}
            </div>
            <div className="flex flex-col">
              <span className="text-[7px] font-black text-zinc-500 uppercase tracking-widest leading-none mb-1">
                {level >= 50 ? 'MAX LEVEL' : 'УБИЙСТВА'}
              </span>
              <div className="w-20 h-1 bg-white/5 rounded-full overflow-hidden">
                 <motion.div 
                   initial={{ width: 0 }}
                   animate={{ width: `${level >= 50 ? 100 : (xp / (xpToNextLevel || 100)) * 100}%` }}
                   className={`h-full ${level >= 50 ? 'bg-yellow-500' : 'bg-green-500'} shadow-[0_0_8px_rgba(34,197,94,0.5)]`} 
                 />
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-1 items-end">
            <div className="text-right leading-none">
              <span className="text-[6px] font-black text-zinc-500 uppercase tracking-widest block">POTENTIAL</span>
              <span className="text-[10px] font-black text-green-400">
                {potential || 99}
              </span>
            </div>
            <div className="text-right leading-none">
              <span className="text-[6px] font-black text-zinc-500 uppercase tracking-widest block">POINTS</span>
              <span className={`text-[9px] font-black ${skillPoints > 0 ? 'text-yellow-500' : 'text-zinc-600'}`}>
                {skillPoints}
              </span>
            </div>
          </div>
        </div>
      )}

      {isStatsHidden && (
        <div className="mb-4 p-3 bg-red-500/5 border border-red-500/20 rounded-xl text-center">
          <p className="text-[9px] font-black text-red-400 uppercase tracking-widest leading-none mb-1">
            ХАРАКТЕРИСТИКИ СКРЫТЫ
          </p>
          <p className="text-[7px] font-black text-zinc-500 uppercase tracking-widest leading-none mt-1">
            ТРЕБУЕТСЯ АНАЛИТИК УР. 2
          </p>
        </div>
      )}

      {/* Radial Stats Row */}
      <div className={`flex justify-between items-start mb-8 ${isBought ? 'pt-2' : 'pt-4'}`}>
         <div className="relative group/stat cursor-pointer transition-all active:scale-90 flex flex-col items-center" onClick={() => canUpgrade && onUpgradeStat?.('aim')}>
            <StatCircle label="АИМ" value={stats?.aim || 0} icon={Target} color="text-purple-500" isHidden={isStatsHidden} />
            {canUpgrade && (
              <motion.div 
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="absolute -top-1 -right-1 w-5 h-5 bg-yellow-500 rounded-full flex items-center justify-center shadow-[0_0_15px_rgba(234,179,8,0.6)] z-10 border border-black/20"
              >
                <Plus size={10} className="text-black stroke-[3px]" />
              </motion.div>
            )}
         </div>
         <div className="relative group/stat cursor-pointer transition-all active:scale-90 flex flex-col items-center" onClick={() => canUpgrade && onUpgradeStat?.('iq')}>
            <StatCircle label="АЙКЬЮ" value={stats?.iq || 0} icon={Brain} color="text-blue-500" isHidden={isStatsHidden} />
            {canUpgrade && (
              <motion.div 
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="absolute -top-1 -right-1 w-5 h-5 bg-yellow-500 rounded-full flex items-center justify-center shadow-[0_0_15px_rgba(234,179,8,0.6)] z-10 border border-black/20"
              >
                <Plus size={10} className="text-black stroke-[3px]" />
              </motion.div>
            )}
         </div>
         <div className="relative group/stat cursor-pointer transition-all active:scale-90 flex flex-col items-center" onClick={() => canUpgrade && onUpgradeStat?.('movement')}>
            <StatCircle label="МУВМЕНТ" value={stats?.movement || 0} icon={Zap} color="text-green-500" isHidden={isStatsHidden} />
            {canUpgrade && (
              <motion.div 
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="absolute -top-1 -right-1 w-5 h-5 bg-yellow-500 rounded-full flex items-center justify-center shadow-[0_0_15px_rgba(234,179,8,0.6)] z-10 border border-black/20"
              >
                <Plus size={10} className="text-black stroke-[3px]" />
              </motion.div>
            )}
         </div>
      </div>

      {/* Special Characteristic */}
      <div className="mb-8 relative group/stat cursor-pointer transition-all active:scale-95" onClick={() => canUpgrade && onUpgradeStat?.('special')}>
        <StatSegmentedBar 
          label="СПЕЦИАЛЬНАЯ ХАРАКТЕРИСТИКА" 
          value={stats?.special || 0} 
          icon={RoleIcon || Shield} 
          isHidden={isStatsHidden}
        />
        {canUpgrade && (
          <div className="absolute -top-4 right-0 px-2 py-0.5 bg-yellow-500 rounded text-[6px] font-black text-black animate-pulse shadow-[0_0_10px_rgba(234,179,8,0.3)] flex items-center gap-1">
            <Plus size={6} />
            UPGRADE AVAILABLE
          </div>
        )}
        {isCapped && isBought && (
          <div className="absolute -top-4 right-0 px-2 py-0.5 bg-zinc-700 rounded text-[6px] font-black text-zinc-400">MAX POTENTIAL REACHED</div>
        )}
      </div>

      {/* KD Graph */}
      <div className="mb-8">
        <KDGraph data={stats?.kdHistory || [1.2, 1.4, 1.2, 1.3, 1.4, 1.3, 1.1, 1.1, 1.2, 1.38]} />
      </div>

      {isListedByUser && (
        <div className="mb-4 px-4 py-3 rounded-2xl bg-yellow-500/10 border border-yellow-500/20 text-[10px] text-yellow-200 uppercase tracking-[0.2em]">
          Игрок выставлен на рынке. Нажмите «СНЯТЬ С РЫНКА», чтобы вернуть его в состав или на скамейку.
        </div>
      )}

      <div className="mt-2">
        {isBought ? (
          <div className="grid grid-cols-2 gap-2">
            {hasCoach ? (
              <div className="col-span-2 px-4 py-4 rounded-2xl bg-white/5 border border-white/10 text-[10px] text-zinc-300 font-bold uppercase tracking-widest leading-snug">
                У вас есть тренер. Тренировки доступны на вкладке <span className="text-blue-400">Команда → Тренировка</span>.
              </div>
            ) : (
              <button 
                onClick={(e) => { e.stopPropagation(); onTrain?.(); }}
                disabled={trainingsToday >= maxTrainings}
                className={`py-3.5 rounded-xl text-[9px] font-black uppercase tracking-widest border transition-all active:scale-95 flex items-center justify-center gap-2
                  ${trainingsToday >= maxTrainings ? 'bg-zinc-900 text-zinc-600 border-white/5 cursor-not-allowed' : 'bg-zinc-900 hover:bg-zinc-800 text-white border-white/5'}
                `}
              >
                <Zap size={12} className={trainingsToday >= maxTrainings ? "text-zinc-600" : "text-yellow-500"} />
                {trainingsToday >= maxTrainings ? "ЛИМИТ" : "ТРЕНИРОВАТЬ"}
              </button>
            )}
            <button 
              onClick={(e) => { e.stopPropagation(); onSell?.(); }}
              className="py-3.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-500 text-[9px] font-black uppercase tracking-widest border border-red-500/20 transition-all active:scale-95"
            >
              ПРОДАТЬ
            </button>
          </div>
        ) : isListedByUser ? (
          <button 
             onClick={(e) => { e.stopPropagation(); onSell?.(); }}
             className="w-full py-4 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all active:scale-95 flex items-center justify-center gap-3 bg-yellow-500 hover:bg-yellow-400 text-black shadow-[0_8px_30px_rgba(234,179,8,0.25)]"
          >
            <ShoppingBag size={14} />
            <span>СНЯТЬ С РЫНКА</span>
          </button>
        ) : (
          <button 
             onClick={(e) => { e.stopPropagation(); onBuy?.(); }}
             className="w-full py-4 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all active:scale-95 flex items-center justify-center gap-3 bg-blue-600 hover:bg-blue-500 text-white shadow-[0_8px_30px_rgba(37,99,235,0.3)]"
          >
            <ShoppingBag size={14} />
            <span>КУПИТЬ ЗА ${price?.toLocaleString()}</span>
          </button>
        )}
      </div>
    </motion.div>
  );
};

const PlayerCard = ({
  nickname,
  role,
  rating,
  imageUrl,
  stats,
  rarity = "Common",
  price,
  teamName,
  teamLogo,
  avatarSeed,
  onBuy,
  onSell,
  onTrain,
  isBought,
  isListedByUser,
  level,
  xp,
  xpToNextLevel,
  trainingsToday,
  skillPoints,
  onUpgradeStat,
  potential, // Added potential
  onClick,
  silhouetteColor = "text-zinc-500",
  isEmpty = false,
  variant = "lobby",
  label,
  analystLevel = 0,
  maxTrainings = 3,
}: any) => {
  const [isLocked, setIsLocked] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [panelSide, setPanelSide] = useState<'left' | 'right'>('right');
  const cardRef = React.useRef<HTMLDivElement>(null);

  const config = RARITY_CONFIG[rarity as keyof typeof RARITY_CONFIG] || RARITY_CONFIG.Common;

  // Level indicator
  const levelNode = isBought && (
    <div className="absolute top-2 left-2 z-10 flex items-center gap-1.5 px-2 py-1 bg-black/60 backdrop-blur-md rounded-lg border border-white/10 group-hover:bg-blue-600/80 transition-colors">
      <Star size={10} className="text-yellow-500 fill-yellow-500" />
      <span className="text-[10px] font-black text-white italic">LVL {level}</span>
    </div>
  );

  // Close the stats panel when clicking anywhere else & handle panel side
  React.useEffect(() => {
    const updatePanelSide = () => {
      if (cardRef.current) {
        const rect = cardRef.current.getBoundingClientRect();
        const screenWidth = window.innerWidth;
        // If the card is in the right 30% of the screen, show panel on the left
        if (rect.right > screenWidth * 0.7) {
          setPanelSide('left');
        } else {
          setPanelSide('right');
        }
      }
    };

    const handleClickOutside = (event: MouseEvent) => {
      if (cardRef.current && !cardRef.current.contains(event.target as Node)) {
        setIsLocked(false);
      }
    };

    if (isLocked) {
      document.addEventListener("mousedown", handleClickOutside);
      updatePanelSide();
    }

    window.addEventListener('resize', updatePanelSide);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener('resize', updatePanelSide);
    };
  }, [isLocked]);

  const getRoleIcon = (roleName: string) => {
    switch (roleName) {
      case "Sniper":
        return Crosshair;
      case "Captain":
        return Crown;
      case "Rifler":
        return Target;
      case "Support":
        return Shield;
      case "Lurker":
        return Zap;
      default:
        return Users;
    }
  };

  const RoleIcon = role ? getRoleIcon(role) : null;

  if (isEmpty) {
    return (
      <div
        onClick={onClick}
        className="glass-card rounded-xl p-3 flex flex-col items-center justify-center min-w-[130px] aspect-[14/18] relative overflow-hidden group cursor-pointer transition-all hover:border-blue-500/30 hover:bg-white/[0.05]"
      >
        <div className="w-10 h-10 rounded-lg border border-white/10 flex items-center justify-center text-zinc-600 group-hover:text-blue-500 group-hover:scale-110 transition-all">
          <Plus size={20} />
        </div>
        <span className="mt-3 text-[8px] font-black uppercase text-zinc-600 tracking-widest group-hover:text-zinc-400">
          {label || "Свободно"}
        </span>
      </div>
    );
  }

  const isMarket = variant === "market";

  const getRarityIcon = () => {
    switch (rarity) {
      case 'Virtual': return Trophy;
      case 'Legendary': return Crown;
      case 'Epic': return Zap;
      case 'Rare': return Shield;
      default: return User;
    }
  };

  const RarityIcon = getRarityIcon();

  if (isMarket) {
    return (
      <div
        ref={cardRef}
        onClick={() => setIsLocked(!isLocked)}
        className="relative group cursor-pointer"
      >
        <div
          className={`glass-card rounded-xl border p-4 flex flex-col min-h-[380px] transition-all relative overflow-hidden
          ${config.border} ${isLocked ? config.glow : "hover:shadow-2xl hover:translate-y-[-4px]"}
          bg-gradient-to-b from-[#0c1220]/80 to-[#050a14]/95
        `}
        >
          {/* Rarity Background Effect (Subtle lightning/glow) */}
          <div className={`absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_50%_40%,var(--rarity-color),transparent_70%)]`} 
             style={{ '--rarity-color': rarity === 'Virtual' ? '#ef4444' : rarity === 'Legendary' ? '#eab308' : rarity === 'Epic' ? '#a855f7' : '#3b82f6' } as any} 
          />
          <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:20px_20px]" />
          {levelNode}
          {isListedByUser && !isBought && (
            <div className="absolute top-3 left-3 z-20 px-2 py-1 rounded-full bg-yellow-500/90 text-[8px] font-black uppercase tracking-[0.3em] text-black">
              ЛИСТИНГ
            </div>
          )}

          {/* Header */}
          <div className="flex items-center justify-between relative z-10 mb-2">
            <div className={`flex items-center gap-2 ${config.color}`}>
              <RarityIcon size={12} />
              <span className="text-[10px] font-black uppercase tracking-widest">{config.label}</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex flex-col items-end leading-none">
                <span className="text-[14px] font-black text-white italic">{rating}</span>
                <span className="text-[6px] text-zinc-500 font-black uppercase tracking-tighter">Rating</span>
              </div>
              <button 
                onClick={(e) => { e.stopPropagation(); setIsFavorite(!isFavorite); }}
                className={`${isFavorite ? "text-red-500" : "text-zinc-600 hover:text-zinc-400"} transition-colors`}
              >
                <Heart size={14} fill={isFavorite ? "currentColor" : "none"} />
              </button>
            </div>
          </div>

          {/* Character Image */}
          <div className="relative flex-1 flex items-center justify-center mb-6">
            <div className={`absolute w-32 h-32 rounded-full blur-[40px] opacity-20 ${config.glow}`} />
            {imageUrl || avatarSeed ? (
              <img
                src={imageUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${avatarSeed}`}
                alt={nickname}
                className="h-44 w-full object-contain object-bottom drop-shadow-[0_20px_40px_rgba(0,0,0,0.5)] group-hover:scale-105 transition-transform duration-500 relative z-10"
              />
            ) : (
              <Users size={80} className="text-zinc-800 opacity-20" />
            )}
          </div>

          {/* Footer Info */}
          <div className="relative z-10 mt-auto">
            <h3 className="text-xl font-black text-white italic tracking-tight mb-1">{nickname}</h3>
            
            <div className="flex items-end justify-between">
               <div className="space-y-1.5">
                  <div className="flex items-center gap-1.5 opacity-60">
                    {RoleIcon && <RoleIcon size={10} className="text-blue-500" />}
                    <span className="text-[9px] font-bold text-zinc-300 uppercase tracking-widest">{role}</span>
                  </div>
               </div>

               <div className="text-right">
                  <span className="text-sm font-black text-white italic">${price?.toLocaleString()}</span>
               </div>
            </div>
          </div>

          {isBought && (
            <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center z-50">
              <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest bg-black/80 px-4 py-2 border border-blue-500/20 rounded-lg shadow-2xl">
                В КОМАНДЕ
              </span>
            </div>
          )}
        </div>

        {/* Stats Panel */}
        <AnimatePresence>
          {isLocked && (
            <PlayerStatsPanel 
              side={panelSide}
              stats={stats}
              price={price}
              onBuy={onBuy}
              onSell={onSell}
              onTrain={onTrain}
              onUpgradeStat={onUpgradeStat}
              isBought={isBought}
              isListedByUser={isListedByUser}
              level={level}
              xp={xp}
              xpToNextLevel={xpToNextLevel}
              trainingsToday={trainingsToday}
              skillPoints={skillPoints}
              role={role}
              RoleIcon={RoleIcon}
              rating={rating}
              potential={potential}
              analystLevel={analystLevel}
              maxTrainings={maxTrainings}
            />
          )}
        </AnimatePresence>
      </div>
    );
  }

  return (
    <div
      ref={cardRef}
      onClick={() => setIsLocked(!isLocked)}
      className="relative group cursor-pointer group/card"
    >
      <div
        className={`glass-card rounded-xl p-3 flex flex-col items-center border border-white/5 transition-all
        ${isMarket ? "aspect-[13/17] min-w-[135px]" : "aspect-[15/19] min-w-[150px]"}
        ${isLocked ? "border-blue-500/50 bg-blue-500/10 shadow-[0_0_25px_rgba(59,130,246,0.2)]" : "hover:border-blue-500/30 hover:translate-y-[-4px]"}
      `}
      >
        {levelNode}
        <div className="absolute top-2 right-2 flex items-center gap-1 opacity-40 group-hover:opacity-100 transition-opacity">
          {RoleIcon && <RoleIcon size={10} className="text-blue-500" />}
          <span className="text-[7px] font-black text-white uppercase italic tracking-tighter">
            {role}
          </span>
        </div>

        <div
          className={`relative w-full mb-1 flex items-center justify-center ${isMarket ? "h-24" : "h-28"}`}
        >
          <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={nickname}
              className="h-full w-full object-contain object-bottom transition-all group-hover:scale-105 drop-shadow-2xl"
            />
          ) : (
            <Users
              size={isMarket ? 50 : 64}
              className={`${silhouetteColor} player-silhouette transition-all group-hover:scale-110 opacity-20`}
            />
          )}
        </div>

        <span
          className={`${isMarket ? "text-xs" : "text-sm"} font-black text-white italic tracking-tight relative z-10 truncate w-full text-center`}
        >
          {nickname}
        </span>
        <div className="w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent my-1.5" />

        <div className="flex items-center justify-between w-full relative z-10 px-1">
          {isLocked ? (
            <span
              className={`${isMarket ? "text-2xl" : "text-3xl"} font-black text-white italic`}
            >
              {rating}
            </span>
          ) : (
            <div className="w-10 h-6" /> // Spacer
          )}
          <div className="flex flex-col items-end">
            <span className="text-[6px] text-zinc-500 font-black uppercase">
              Rating
            </span>
            <div className="w-6 h-0.5 bg-blue-600/30 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-500"
                style={{ width: `${rating}%` }}
              />
            </div>
          </div>
        </div>

        {/* Small badge if already in team */}
        {isBought && isMarket && (
          <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center">
            <span className="text-[8px] font-black text-blue-400 uppercase tracking-widest bg-black/80 px-2 py-1 border border-blue-500/20 rounded">
              В КОМАНДЕ
            </span>
          </div>
        )}
      </div>

        <AnimatePresence>
          {isLocked && (
            <PlayerStatsPanel 
              side={panelSide}
              stats={stats}
              price={price}
              onBuy={onBuy}
              onSell={onSell}
              onTrain={onTrain}
              onUpgradeStat={onUpgradeStat}
              isBought={isBought}
              isListedByUser={isListedByUser}
              level={level}
              xp={xp}
              xpToNextLevel={xpToNextLevel}
              trainingsToday={trainingsToday}
              skillPoints={skillPoints}
              role={role}
              RoleIcon={RoleIcon}
              rating={rating}
              potential={potential}
              analystLevel={analystLevel}
              maxTrainings={maxTrainings}
            />
          )}
        </AnimatePresence>
      </div>
    );
  }

const NewsItem = ({
  image,
  title,
  desc,
  time,
  isNew = false,
  isSpecial = false,
}: any) => (
  <div
    className={`p-4 rounded-xl border transition-all cursor-pointer group flex flex-col gap-3
    ${
      isSpecial
        ? "bg-gradient-to-br from-blue-600/20 to-transparent border-blue-500/30 ring-1 ring-blue-500/10"
        : "bg-white/[0.02] border-white/5 hover:bg-white/[0.04]"
    }`}
  >
    <div className="flex items-center gap-4">
      <div
        className={`w-14 h-14 rounded-lg overflow-hidden shrink-0 border ${isSpecial ? "border-blue-500/40" : "border-white/10"}`}
      >
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-all scale-110 group-hover:scale-125"
        />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <h4
            className={`text-sm font-black uppercase italic ${isSpecial ? "text-blue-400" : "text-white"}`}
          >
            {title}
          </h4>
          {isNew && (
            <div className="w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,1)]" />
          )}
        </div>
        <p className="text-[11px] text-zinc-300 font-medium leading-tight line-clamp-1">
          {desc}
        </p>
      </div>
      {isSpecial && <Zap size={14} className="text-blue-500 animate-pulse" />}
    </div>

    <div className="flex items-center justify-between border-t border-white/[0.06] pt-3">
      <span className="text-[8px] text-zinc-600 font-bold uppercase tracking-widest">
        {time}
      </span>
      <ArrowRight
        size={12}
        className="text-zinc-700 group-hover:text-blue-500 transition-all group-hover:translate-x-1"
      />
    </div>
  </div>
);
const CreatePlayerModal = ({
  isOpen,
  onClose,
  onSave,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSave: (player: any) => void;
}) => {
  const [nickname, setNickname] = useState("");
  const [rarity, setRarity] = useState("Rare");
  const [role, setRole] = useState("Rifler");
  const [stats, setStats] = useState({
    aim: 80,
    iq: 80,
    movement: 80,
    special: 80,
  });
  const [potential, setPotential] = useState<number>(93);
  const [playerImage, setPlayerImage] = useState<string | null>(null);

  const rarities = [
    {
      name: "Virtual",
      color: "text-red-500",
      border: "border-red-500/50",
      bg: "bg-red-500/10",
    },
    {
      name: "Legendary",
      color: "text-yellow-400",
      border: "border-yellow-500/50",
      bg: "bg-yellow-500/10",
    },
    {
      name: "Epic",
      color: "text-purple-400",
      border: "border-purple-500/50",
      bg: "bg-purple-500/10",
    },
    {
      name: "Rare",
      color: "text-blue-400",
      border: "border-blue-500/50",
      bg: "bg-blue-500/10",
    },
    {
      name: "Common",
      color: "text-zinc-400",
      border: "border-zinc-500/50",
      bg: "bg-zinc-500/10",
    },
  ];

  const getSpecialStatName = (r: string) => {
    switch (r) {
      case "Sniper":
        return "Focus";
      case "Captain":
        return "Strategy";
      case "Rifler":
        return "Aggression";
      case "Support":
        return "Utility";
      default:
        return "Special";
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPlayerImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    if (!nickname) {
      alert("Введите никнейм!");
      return;
    }
    const avg = Math.round(
      (stats.aim + stats.iq + stats.movement + stats.special) / 4,
    );
    onSave({
      id: Date.now().toString(),
      nickname: nickname.toUpperCase(),
      role,
      rating: avg,
      potential: Math.max(avg, Math.min(99, potential)),
      imageUrl: playerImage,
      rarity,
      stats: { ...stats, specialLabel: getSpecialStatName(role) },
    });
    setNickname("");
    setPlayerImage(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 backdrop-blur-xl bg-black/60">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-panel w-full max-w-3xl rounded-3xl overflow-hidden relative border-blue-500/20 shadow-[0_0_50px_rgba(37,99,235,0.15)]"
      >
        <div className="p-8 border-b border-white/5 flex items-center justify-between bg-white/[0.01]">
          <div>
            <h2 className="text-2xl font-black text-white italic tracking-tight">
              СОЗДАНИЕ ИГРОКА
            </h2>
            <div className="flex items-center gap-2 mt-2">
              <div className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,1)] animate-pulse" />
              <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-black">
                V.ARENA CONTROL CENTER v2.1
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-12 h-12 rounded-2xl bg-white/5 hover:bg-white/10 flex items-center justify-center transition-all group"
          >
            <Plus
              className="rotate-45 text-zinc-500 group-hover:text-white transition-colors"
              size={20}
            />
          </button>
        </div>

        <div className="p-8 space-y-10 max-h-[75vh] overflow-y-auto custom-scrollbar">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Left Column: ID & Image */}
            <div className="space-y-8">
              <div className="space-y-3">
                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                  <User size={12} className="text-blue-500" /> Никнейм
                </label>
                <input
                  type="text"
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  placeholder="CRIMSON"
                  className="w-full h-14 bg-white/5 border border-white/10 rounded-2xl px-5 text-sm font-bold text-white outline-none focus:border-blue-500/50 transition-all italic placeholder:text-zinc-800"
                />
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                  <ShoppingBag size={12} className="text-blue-500" /> Фото
                  игрока
                </label>
                <div className="relative group">
                  <div className="w-full h-56 bg-zinc-950 border-2 border-dashed border-white/5 rounded-3xl overflow-hidden flex flex-col items-center justify-center transition-all group-hover:border-blue-500/20 group-hover:bg-zinc-900">
                    {playerImage ? (
                      <div className="relative w-full h-full p-2">
                        <img
                          src={playerImage}
                          alt="PlayerPreview"
                          className="w-full h-full object-contain object-bottom drop-shadow-[0_10px_20px_rgba(0,0,0,0.5)]"
                        />
                        <button
                          onClick={() => setPlayerImage(null)}
                          className="absolute top-4 right-4 w-8 h-8 bg-black/60 backdrop-blur-md rounded-full border border-white/10 flex items-center justify-center text-white hover:bg-red-500 transition-all"
                        >
                          <Plus className="rotate-45" size={16} />
                        </button>
                      </div>
                    ) : (
                      <label className="flex flex-col items-center justify-center w-full h-full cursor-pointer">
                        <input
                          type="file"
                          className="hidden"
                          accept="image/*"
                          onChange={handleImageChange}
                        />
                        <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-4 transition-transform group-hover:scale-110 group-hover:border-blue-500/40">
                          <Plus
                            size={32}
                            className="text-zinc-700 group-hover:text-blue-500"
                          />
                        </div>
                        <span className="text-[10px] font-black text-zinc-700 uppercase tracking-widest group-hover:text-zinc-400">
                          Нажмите для выбора
                        </span>
                        <span className="text-[8px] text-zinc-800 mt-2">
                          PNG с прозрачным фоном рекомендуется
                        </span>
                      </label>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Rarity, Role & Stats */}
            <div className="space-y-8">
              <div className="space-y-4">
                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">
                  Ранг / Редкость
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {rarities.map((r) => (
                    <button
                      key={r.name}
                      onClick={() => setRarity(r.name)}
                      className={`p-3.5 rounded-2xl border text-center transition-all flex flex-col items-center gap-1
                            ${
                              rarity === r.name
                                ? `${r.border} ${r.bg} shadow-[0_4px_15px_rgba(0,0,0,0.3)]`
                                : "border-white/5 hover:border-white/10 grayscale opacity-60 hover:grayscale-0 hover:opacity-100"
                            }`}
                    >
                      <p
                        className={`text-[10px] font-black uppercase italic ${rarity === r.name ? r.color : "text-zinc-500"}`}
                      >
                        {r.name}
                      </p>
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">
                  Специализация
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {["Sniper", "Captain", "Rifler", "Support"].map((r) => (
                    <button
                      key={r}
                      onClick={() => setRole(r)}
                      className={`px-4 py-3 rounded-2xl border text-[10px] font-black uppercase italic transition-all
                            ${
                              role === r
                                ? "border-blue-500/50 bg-blue-500/10 text-blue-400 shadow-[0_4px_15px_rgba(0,0,0,0.3)]"
                                : "border-white/5 text-zinc-600 hover:border-white/10 hover:text-zinc-400"
                            }`}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-6 pt-2">
                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">
                  Характеристики
                </label>
                <div className="space-y-6">
                  {[
                    { key: "aim", label: "Aim" },
                    { key: "iq", label: "Game IQ" },
                    { key: "movement", label: "Movement" },
                    { key: "special", label: getSpecialStatName(role) },
                  ].map((s: any) => (
                    <div key={s.key} className="space-y-3">
                      <div className="flex justify-between items-center">
                        <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">
                          {s.label}
                        </label>
                        <span
                          className={`text-xs font-black italic ${s.key === "special" ? "text-blue-500" : "text-white"}`}
                        >
                          {(stats as any)[s.key]}
                        </span>
                      </div>
                      <div className="relative h-1.5 bg-white/5 rounded-full overflow-hidden group">
                        <input
                          type="range"
                          min="1"
                          max="99"
                          value={(stats as any)[s.key]}
                          onChange={(e) =>
                            setStats({
                              ...stats,
                              [s.key]: parseInt(e.target.value),
                            })
                          }
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                        />
                        <div
                          className={`h-full transition-all duration-300 relative ${s.key === "special" ? "bg-blue-600" : "bg-white/40 group-hover:bg-white/60"}`}
                          style={{ width: `${(stats as any)[s.key]}%` }}
                        >
                          <div className="absolute top-0 right-0 h-full w-4 bg-white/20 blur shadow-[0_0_10px_rgba(255,255,255,0.5)]" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between">
                  <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">
                    Потенциал игрока
                  </label>
                  <span className="text-xs font-black text-white uppercase tracking-widest">{potential}</span>
                </div>
                <input
                  type="range"
                  min={Math.max(1, Math.round((stats.aim + stats.iq + stats.movement + stats.special) / 4))}
                  max={99}
                  value={potential}
                  onChange={(e) => setPotential(Math.min(99, Math.max(Math.round((stats.aim + stats.iq + stats.movement + stats.special) / 4), parseInt(e.target.value))))}
                  className="w-full h-2 bg-white/10 rounded-full accent-blue-500"
                />
                <p className="text-[8px] text-zinc-500 uppercase tracking-widest">Потенциал задаёт максимальный рейтинг, до которого игрок может развиваться.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="p-8 bg-black/80 backdrop-blur-xl border-t border-white/10 flex gap-5">
          <button
            onClick={onClose}
            className="flex-1 h-14 rounded-xl text-zinc-600 font-black uppercase text-[10px] tracking-[0.2em] hover:bg-white/5 hover:text-zinc-400 transition-all skew-x-[-15deg]"
          >
            <span className="inline-block skew-x-[15deg]">Отмена</span>
          </button>
          <button
            onClick={handleSave}
            className="flex-[2] bg-blue-600 hover:bg-blue-500 h-14 rounded-xl text-white font-black uppercase text-[11px] tracking-[0.3em] shadow-[0_0_40px_rgba(37,99,235,0.3)] transition-all hover:scale-[1.02] flex items-center justify-center gap-4 skew-x-[-15deg] group overflow-hidden"
          >
            <div className="flex items-center gap-4 skew-x-[15deg]">
              <ShoppingBag size={18} />
              <span>Сохранить игрока</span>
            </div>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-[100%] group-hover:translate-x-[100%] transition-transform duration-700" />
          </button>
        </div>
      </motion.div>
    </div>
  );
};

const AdminPanelModal = ({ 
  isOpen, 
  onClose, 
  roleMultipliers, 
  setRoleMultipliers,
  rankingTeams,
  setRankingTeams,
  maintenance,
  setMaintenance,
  cloudKeys,
  setCloudKeys,
  geminiKey,
  setGeminiKey,
  players,
  setPlayers,
  matchHistory,
  clearMatchHistory,
  syncToCloud,
  pullFromCloud,
  generateAIReport,
  setMatchResult
}: any) => {
  const [activeTab, setActiveTab] = useState("stats");
  const gameTab = "S2";
  
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 backdrop-blur-2xl bg-black/80">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-panel w-full max-w-6xl h-[85vh] rounded-[40px] overflow-hidden flex flex-col border-blue-500/20 shadow-[0_0_100px_rgba(37,99,235,0.2)]"
      >
        <div className="p-8 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
          <div className="flex items-center gap-6">
            <div className="flex flex-col">
              <h2 className="text-2xl font-black text-white italic tracking-tight uppercase">V.ARENA CONTROL PANEL</h2>
              <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-[0.2em] mt-1">Management Console v3.4.0</p>
            </div>
            <div className="h-10 w-px bg-white/5" />
            <div className="flex items-center gap-2">
              {['stats', 'history', 'players', 'roles', 'ranking', 'system'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all
                  ${activeTab === tab ? "bg-blue-600 text-white shadow-[0_0_20px_rgba(37,99,235,0.4)]" : "text-zinc-500 hover:text-zinc-300 hover:bg-white/5"}`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>
          <button onClick={onClose} className="w-12 h-12 rounded-2xl bg-white/5 hover:bg-white/10 flex items-center justify-center transition-all group">
            <X className="text-zinc-500 group-hover:text-white" size={24} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
          {activeTab === 'stats' && (
             <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                   <div className="p-6 rounded-[32px] bg-white/[0.02] border border-white/5 text-center">
                      <div className="text-4xl font-black text-blue-500 italic mb-2">12</div>
                      <div className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Active Users</div>
                   </div>
                   <div className="p-6 rounded-[32px] bg-white/[0.02] border border-white/5 text-center">
                      <div className="text-4xl font-black text-purple-500 italic mb-2">1,248</div>
                      <div className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Total Visits</div>
                   </div>
                   <div className="p-6 rounded-[32px] bg-white/[0.02] border border-white/5 text-center">
                      <div className="text-4xl font-black text-green-500 italic mb-2">842</div>
                      <div className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Unique Players</div>
                   </div>
                   <div className="p-6 rounded-[32px] bg-white/[0.02] border border-white/5 text-center">
                      <div className="text-4xl font-black text-yellow-500 italic mb-2">{maintenance.enabled ? "ON" : "OFF"}</div>
                      <div className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Maintenance</div>
                   </div>
                </div>
                
                <div className="p-8 rounded-[40px] bg-white/[0.01] border border-white/5 overflow-hidden relative">
                   <div className="absolute top-0 right-0 p-8 opacity-10"><Activity size={120} className="text-blue-500" /></div>
                   <h3 className="text-sm font-black text-white italic uppercase mb-6 flex items-center gap-3">
                     <TrendingUp size={16} className="text-blue-500" /> Server Performance
                   </h3>
                   <div className="h-64 flex items-end gap-2 px-2">
                     {Array.from({ length: 40 }).map((_, i) => {
                       const height = 20 + Math.random() * 80;
                       return (
                         <div key={i} className="flex-1 bg-blue-600/20 rounded-t-md relative group">
                            <motion.div 
                              initial={{ height: 0 }}
                              animate={{ height: `${height}%` }}
                              className="w-full bg-blue-500 rounded-t-md group-hover:bg-blue-400 transition-colors" 
                            />
                         </div>
                       )
                     })}
                   </div>
                </div>
             </div>
          )}

          {activeTab === 'roles' && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
               <div className="grid grid-cols-1 gap-4">
                  <div className="grid grid-cols-[2fr_1fr_1fr_1fr] px-6 py-4 text-[9px] font-black text-zinc-600 uppercase tracking-[0.2em] border-b border-white/5">
                    <span>Role Name</span>
                    <span className="text-center">Kill Mult</span>
                    <span className="text-center">Skill Mult</span>
                    <span className="text-center">Impact Mult</span>
                  </div>
                  {roleMultipliers[gameTab].map((role: any, idx: number) => (
                    <div key={idx} className="grid grid-cols-[2fr_1fr_1fr_1fr] items-center px-6 py-4 bg-white/[0.02] border border-white/5 rounded-2xl hover:bg-white/[0.04] transition-all">
                       <span className="text-sm font-black text-white italic">{role.name}</span>
                       <div className="flex justify-center px-4">
                         <input 
                           type="number" 
                           step="0.05"
                           value={role.kill}
                           onChange={(e) => {
                             const newMults = {...roleMultipliers};
                             newMults[gameTab][idx].kill = parseFloat(e.target.value);
                             setRoleMultipliers(newMults);
                           }}
                           className="w-16 bg-black/40 border border-white/10 rounded-lg py-1 px-2 text-center text-xs text-blue-500 outline-none focus:border-blue-500/50"
                         />
                       </div>
                       <div className="flex justify-center px-4">
                         <input 
                           type="number" 
                           step="0.05"
                           value={role.skill}
                           onChange={(e) => {
                             const newMults = {...roleMultipliers};
                             newMults[gameTab][idx].skill = parseFloat(e.target.value);
                             setRoleMultipliers(newMults);
                           }}
                           className="w-16 bg-black/40 border border-white/10 rounded-lg py-1 px-2 text-center text-xs text-purple-500 outline-none focus:border-purple-500/50"
                         />
                       </div>
                       <div className="flex justify-center px-4">
                         <input 
                           type="number" 
                           step="0.05"
                           value={role.impact}
                           onChange={(e) => {
                             const newMults = {...roleMultipliers};
                             newMults[gameTab][idx].impact = parseFloat(e.target.value);
                             setRoleMultipliers(newMults);
                           }}
                           className="w-16 bg-black/40 border border-white/10 rounded-lg py-1 px-2 text-center text-xs text-green-500 outline-none focus:border-green-500/50"
                         />
                       </div>
                    </div>
                  ))}
               </div>
               
               <div className="p-6 rounded-[32px] bg-blue-600/10 border border-blue-500/20">
                  <div className="flex items-center gap-4 text-blue-500 mb-2">
                    <Zap size={20} />
                    <h4 className="text-xs font-black uppercase tracking-widest">Match Engine Logic</h4>
                  </div>
                  <p className="text-[11px] text-zinc-400 font-medium leading-relaxed">
                    Эти множители используются в симуляторе матчей. Чем выше множитель, тем больший вклад вносит игрок данной роли в итоговый рейтинг (Score) своей команды в каждом раунде.
                  </p>
               </div>
            </div>
          )}

          {activeTab === 'ranking' && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                 <div className="p-8 rounded-[40px] bg-white/[0.02] border border-white/5">
                    <div className="flex items-center justify-between mb-8">
                       <h3 className="text-xl font-black text-white italic uppercase">RANKING TABLE</h3>
                       <button 
                         onClick={() => {
                           const name = prompt("Team Name:");
                           if (name) {
                             const newTeams = {...rankingTeams} as any;
                             newTeams[gameTab] = [...newTeams[gameTab], { name: name.toUpperCase(), rp: 1000 }];
                             setRankingTeams(newTeams);
                           }
                         }}
                         className="px-6 py-3 bg-blue-600 rounded-xl text-[10px] font-black uppercase tracking-widest text-white hover:bg-blue-500 transition-all"
                       >
                         ADD TEAM
                       </button>
                    </div>
                    
                    <div className="space-y-3">
                       {rankingTeams[gameTab].sort((a: any, b: any) => b.rp - a.rp).map((team: any, i: number) => (
                         <div key={i} className="flex items-center justify-between p-4 bg-white/[0.03] border border-white/10 rounded-2xl hover:border-blue-500/30 transition-all">
                            <div className="flex items-center gap-4">
                               <div className="w-10 h-10 rounded-xl bg-black/40 flex items-center justify-center font-black italic text-zinc-400">#{i+1}</div>
                               <span className="font-black text-white italic text-lg tracking-tight">{team.name}</span>
                            </div>
                            <div className="flex items-center gap-6">
                               <div className="flex flex-col items-end">
                                  <span className="text-[14px] font-black italic text-blue-500">{team.rp} RP</span>
                                  <span className="text-[8px] font-bold text-zinc-600 uppercase tracking-widest">Ranking Points</span>
                               </div>
                               <button 
                                 onClick={() => {
                                   const newTeams = {...rankingTeams} as any;
                                   newTeams[gameTab] = newTeams[gameTab].filter((_: any, idx: number) => idx !== i);
                                   setRankingTeams(newTeams);
                                 }}
                                 className="w-10 h-10 rounded-xl bg-red-500/10 text-red-500 border border-red-500/20 flex items-center justify-center hover:bg-red-500 transition-all hover:text-white"
                               >
                                 <Trash size={16} />
                               </button>
                            </div>
                         </div>
                       ))}
                    </div>
                 </div>
              </div>
          )}

          {activeTab === 'system' && (
             <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <section className="space-y-4">
                   <h3 className="text-[10px] font-black text-blue-500 uppercase tracking-[0.3em]">Maintenance Mode</h3>
                   <div className="p-8 rounded-[40px] bg-white/[0.02] border border-white/5 flex flex-col md:flex-row gap-8 items-center">
                      <div className="flex-1 w-full space-y-4">
                         <div className="flex items-center justify-between">
                            <span className="text-zinc-300 font-bold italic">Enable Maintenance</span>
                            <button 
                              onClick={() => setMaintenance({...maintenance, enabled: !maintenance.enabled})}
                              className={`w-14 h-8 rounded-full relative transition-all ${maintenance.enabled ? "bg-red-500" : "bg-zinc-800"}`}
                            >
                               <div className={`absolute top-1 w-6 h-6 rounded-full bg-white transition-all ${maintenance.enabled ? "left-7" : "left-1"}`} />
                            </button>
                         </div>
                         <div className="space-y-1">
                            <label className="text-[8px] font-black text-zinc-600 uppercase">Estimated Done Date</label>
                            <input 
                              type="text" 
                              placeholder="н-р: ЗАВТРА В 14:00"
                              value={maintenance.until}
                              onChange={(e) => setMaintenance({...maintenance, until: e.target.value})}
                              className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-xs text-white outline-none" 
                            />
                         </div>
                      </div>
                      <div className="flex-1 w-full space-y-1">
                         <label className="text-[8px] font-black text-zinc-600 uppercase">Reason for users</label>
                         <textarea 
                           placeholder="ПЛАНОВОЕ ОБНОВЛЕНИЕ..."
                           value={maintenance.reason}
                           onChange={(e) => setMaintenance({...maintenance, reason: e.target.value})}
                           className="w-full h-[100px] bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-xs text-white outline-none resize-none" 
                         />
                      </div>
                   </div>
                </section>

                <section className="space-y-4">
                   <h3 className="text-[10px] font-black text-purple-500 uppercase tracking-[0.3em]">Cloud Persistence (Firebase)</h3>
                   <div className="p-8 rounded-[40px] bg-white/[0.02] border border-white/5 grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-1">
                         <label className="text-[8px] font-black text-zinc-600 uppercase">Project ID / API Key</label>
                         <input 
                           type="password" 
                           value={cloudKeys.accessKey}
                           onChange={(e) => setCloudKeys({...cloudKeys, accessKey: e.target.value})}
                           className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-xs text-white outline-none" 
                         />
                      </div>
                      <div className="space-y-1">
                         <label className="text-[8px] font-black text-zinc-600 uppercase">Database URL / Bin ID</label>
                         <input 
                           type="text" 
                           value={cloudKeys.binId}
                           onChange={(e) => setCloudKeys({...cloudKeys, binId: e.target.value})}
                           className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-xs text-white outline-none" 
                         />
                      </div>
                   </div>
                   <div className="flex gap-4">
                      <button 
                        onClick={syncToCloud}
                        className="px-6 py-3 bg-purple-600/10 border border-purple-500/20 text-purple-500 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-purple-600 hover:text-white transition-all">PUSH DATA</button>
                      <button 
                        onClick={pullFromCloud}
                        className="px-6 py-3 bg-white/5 border border-white/10 text-zinc-500 rounded-xl text-[9px] font-black uppercase tracking-widest hover:border-white/20 transition-all">PULL DATA</button>
                   </div>
                </section>

                <section className="space-y-4">
                   <h3 className="text-[10px] font-black text-green-500 uppercase tracking-[0.3em]">Gemini AI Core (Match Analytics)</h3>
                   <div className="p-8 rounded-[40px] bg-white/[0.02] border border-white/5 flex gap-8 items-end">
                      <div className="flex-1 space-y-1">
                         <label className="text-[8px] font-black text-zinc-600 uppercase">API Key</label>
                         <input 
                           type="password" 
                           value={geminiKey}
                           onChange={(e) => setGeminiKey(e.target.value)}
                           className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-xs text-white outline-none" 
                         />
                      </div>
                      <button 
                         onClick={() => alert("Gemini API Key saved to local storage!")}
                         className="px-8 h-11 bg-green-600 rounded-xl text-[9px] font-black uppercase tracking-widest text-white hover:bg-green-500 transition-all shadow-[0_0_30px_rgba(34,197,94,0.3)]">SAVE KEY</button>
                   </div>
                </section>
             </div>
          )}
          
          {activeTab === 'players' && (
             <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
               <div className="flex items-center justify-between">
                 <h3 className="text-xl font-black text-white italic uppercase tracking-tighter">PLAYERS BASE</h3>
                 <div className="flex gap-4 text-[9px] font-black text-zinc-500 uppercase tracking-widest">
                   <span>TOTAL: {players.length}</span>
                   <span>AVERAGE RATING: {Math.round(players.reduce((acc: any, p: any) => acc + (p.rating || 0), 0) / (players.length || 1))}</span>
                 </div>
               </div>
               
               <div className="grid grid-cols-1 gap-3">
                 {players.map((p: any) => (
                   <div key={p.id} className="flex items-center justify-between p-4 bg-white/[0.02] border border-white/5 rounded-2xl hover:bg-white/[0.04] transition-all">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-black/40 border border-white/5 overflow-hidden">
                          <img src={p.imageUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${p.nickname}`} className="w-full h-full object-contain object-bottom" alt="" />
                        </div>
                        <div className="flex flex-col">
                           <span className="font-black text-white italic text-lg tracking-tight leading-none">{p.nickname}</span>
                           <span className="text-[8px] font-black text-blue-500 uppercase tracking-[0.2em] mt-1">{p.role} / {p.rarity}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-12">
                         <div className="flex flex-col items-center">
                            <span className="text-xl font-black italic text-zinc-100">{p.rating}</span>
                            <span className="text-[7px] font-bold text-zinc-600 uppercase">Rating</span>
                         </div>
                         <button 
                           onClick={() => setPlayers((prev: any) => prev.filter((pl: any) => pl.id !== p.id))}
                           className="p-3 text-red-500 hover:bg-red-500/10 rounded-xl transition-all border border-transparent hover:border-red-500/20"
                         >
                            <Trash size={18} />
                         </button>
                      </div>
                   </div>
                 ))}
               </div>
             </div>
          )}
          
          {activeTab === 'history' && (
             <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-black text-white italic uppercase tracking-tighter">MATCH ARCHIVE</h3>
                  <button 
                    onClick={clearMatchHistory}
                    className="px-6 py-2 bg-red-500/10 border border-red-500/20 text-red-500 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all"
                  >
                    WIPE HISTORY
                  </button>
                </div>
                
                <div className="grid grid-cols-1 gap-4">
                  {matchHistory && matchHistory.length > 0 ? matchHistory.map((m: any, i: number) => (
                    <div key={i} className="p-6 bg-white/[0.02] border border-white/5 rounded-[32px] relative overflow-hidden group">
                       <div className="absolute top-0 right-0 p-6 opacity-0 group-hover:opacity-10 transition-opacity"><Trophy size={40} className="text-blue-500" /></div>
                       <div className="flex items-center justify-between mb-4">
                          <span className="text-[8px] font-black text-zinc-600 uppercase tracking-[0.3em]">{new Date(m.date).toLocaleString()}</span>
                          <span className={`text-[10px] font-black italic px-3 py-1 rounded-full ${m.result === 'WIN' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                            {m.result}
                          </span>
                       </div>
                       <div className="flex items-center justify-center gap-12">
                          <div className="flex flex-col items-center gap-2">
                             <div className="w-14 h-14 rounded-2xl bg-black/40 flex items-center justify-center text-xl font-black italic text-white border border-white/5">VA</div>
                             <span className="text-[10px] font-black text-white uppercase tracking-widest">Virtual Arena</span>
                          </div>
                             <div className="flex flex-col items-center">
                                <div className="text-3xl font-black text-white italic tracking-tighter mb-1">{m.scoreA} : {m.scoreB}</div>
                                <div className="text-[8px] font-black text-zinc-500 uppercase tracking-widest mb-3">Final Score</div>
                                <div className="flex items-center gap-2">
                                  <button 
                                    onClick={() => generateAIReport(m)}
                                    className="flex items-center gap-2 px-4 py-1.5 bg-blue-600/10 border border-blue-500/20 text-blue-400 rounded-lg text-[8px] font-black uppercase tracking-widest hover:bg-blue-600 hover:text-white transition-all"
                                  >
                                    <Brain size={10} /> AI ANALYSIS
                                  </button>
                                  {m.playerStats && (
                                    <button 
                                      onClick={() => setMatchResult(m)}
                                      className="flex items-center gap-2 px-4 py-1.5 bg-white/5 border border-white/10 text-white rounded-lg text-[8px] font-black uppercase tracking-widest hover:bg-white/10 transition-all"
                                    >
                                      <Activity size={10} /> SCOREBOARD
                                    </button>
                                  )}
                                </div>
                             </div>
                          <div className="flex flex-col items-center gap-2">
                             <div className="w-14 h-14 rounded-2xl bg-zinc-900 flex items-center justify-center border border-white/5">
                                <img src={m.opponentLogo} className="w-10 h-10 object-contain opacity-50" alt="" />
                             </div>
                             <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest truncate max-w-[100px]">{m.opponentName}</span>
                          </div>
                       </div>
                    </div>
                  )) : (
                    <div className="p-20 text-center border-2 border-dashed border-white/5 rounded-[40px]">
                       <Clock size={40} className="mx-auto text-zinc-800 mb-4" />
                       <span className="text-[10px] font-black text-zinc-700 uppercase tracking-widest">No match history available</span>
                    </div>
                  )}
                </div>
             </div>
          )}
        </div>
        
        <div className="p-6 border-t border-white/5 bg-white/[0.01] flex justify-between items-center px-10">
           <div className="flex items-center gap-4 text-[9px] font-black text-zinc-600 uppercase tracking-widest">
              <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,1)]" /> SYSTEM NOMINAL</div>
              <div>LOC: EUROPE-WEST2</div>
           </div>
           <button 
             onClick={onClose}
             className="px-8 py-3 bg-blue-600 text-white rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] shadow-[0_10px_30px_rgba(37,99,235,0.3)] hover:scale-105 transition-all active:scale-95"
           >
             CONFIRM ALL CHANGES
           </button>
        </div>
      </motion.div>
    </div>
  );
};

const STAFF_UPGRADES: Record<string, any[]> = {
  Manager: [
    { level: 1, name: 'Сергей "starix" Ищук', role: 'Manager', roleName: 'Менеджер', price: 15000, desc: 'Позволяет проводить до 4 тренировок в день на каждого игрока (+1 прак).' },
    { level: 2, name: 'Александр "Shara" Гордеев', role: 'Manager', roleName: 'Менеджер', price: 45000, desc: 'Позволяет проводить до 5 тренировок в день на каждого игрока (+2 прака).' },
    { level: 3, name: 'Константин "groove" Пикинер', role: 'Manager', roleName: 'Менеджер', price: 120000, desc: 'Позволяет проводить до 6 тренировок в день на каждого игрока (+3 прака).' }
  ],
  Analyst: [
    { level: 1, name: 'Дмитрий "hooch" Богданов', role: 'Analyst', roleName: 'Аналитик', price: 20000, desc: 'Позволяет настроить Автопик и Автобан карт для AFK-симуляции матчей.' },
    { level: 2, name: 'Александр "Petr1k" Петрик', role: 'Analyst', roleName: 'Аналитик', price: 55000, desc: 'Полностью открывает детальные скрытые характеристики (AIM, IQ, и др.) игроков в команде.' },
    { level: 3, name: 'Иван "Johnta" Шевцов', role: 'Analyst', roleName: 'Аналитик', price: 140000, desc: 'Делает видимым винрейт карт соперника на стадии драфта и выбора карт.' }
  ],
  Coach: [
    { level: 1, name: 'Андрей "B1ad3" Городенский', role: 'Coach', roleName: 'Тренер', price: 25000, desc: 'Дополнительный бонус +10% к получаемому XP во время тренировок (Эффект временно отключен).' },
    { level: 2, name: 'Михаил "Kane" Благин', role: 'Coach', roleName: 'Тренер', price: 60000, desc: 'Бонус +20% к XP и ускорение прироста характеристик на тренировках (Эффект временно отключен).' },
    { level: 3, name: 'Сергей "lmbt" Бежанов', role: 'Coach', roleName: 'Тренер', price: 150000, desc: 'Максимальный бонус +30% к XP, снижает утомляемость игроков (Эффект временно отключен).' }
  ]
};

const STAFF_POOL = [
  { id: 'mng_1', name: 'Сергей "starix" Ищук', role: 'Manager', roleName: 'Менеджер', level: 1, price: 15000, desc: 'Позволяет проводить до 4 тренировок в день на каждого игрока (+1 прак).' },
  { id: 'an_1', name: 'Дмитрий "hooch" Богданов', role: 'Analyst', roleName: 'Аналитик', level: 1, price: 20000, desc: 'Позволяет настроить Автопик и Автобан карт для AFK-симуляции матчей.' },
  { id: 'ch_1', name: 'Андрей "B1ad3" Городенский', role: 'Coach', roleName: 'Тренер', level: 1, price: 25000, desc: 'Дополнительный бонус +10% к получаемому XP во время тренировок (Эффект временно отключен).' }
];

const MarketView = ({
  isAdmin,
  players,
  onPlayerAdd,
  onPlayerBuy,
  onPlayerSell,
  onPlayerTrain,
  onPlayerUpgradeStat,
  team,
  staff = [],
  onBuyStaff,
  marketTab = "players",
  setMarketTab,
  autoPickSettings,
  setAutoPickSettings,
}: {
  key?: string;
  isAdmin: boolean;
  players: any[];
  onPlayerAdd: (p: any) => void;
  onPlayerBuy: (p: any) => void;
  onPlayerSell: (p: any) => void;
  onPlayerTrain: (p: any) => void;
  onPlayerUpgradeStat: (playerId: string, statKey: string) => void;
  team: any[];
  staff: any[];
  onBuyStaff: (s: any) => void;
  marketTab: string;
  setMarketTab: (tab: string) => void;
  autoPickSettings?: any;
  setAutoPickSettings?: (settings: any) => void;
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRank, setSelectedRank] = useState<string | null>(null);
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredPlayers = players.filter((p) => {
    const isAlreadyBought = team.some((tp: any) => tp.id === p.id);
    if (isAlreadyBought) return false;

    const matchesRank = !selectedRank || p.rarity === selectedRank;
    const matchesRole = !selectedRole || selectedRole === "Все" || p.role === selectedRole;
    const matchesSearch = p.nickname.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesRank && matchesRole && matchesSearch;
  });

  const filteredStaff = STAFF_POOL.filter((candidate) => {
    const matchesSearch = candidate.name.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Convert role query to english roles or match russian labels
    let matchesRole = !selectedRole || selectedRole === "Все";
    if (selectedRole === "Manager" || selectedRole === "Менеджер") {
      matchesRole = candidate.role === "Manager";
    } else if (selectedRole === "Analyst" || selectedRole === "Аналитик") {
      matchesRole = candidate.role === "Analyst";
    } else if (selectedRole === "Coach" || selectedRole === "Тренер") {
      matchesRole = candidate.role === "Coach";
    }
    
    return matchesSearch && matchesRole;
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col gap-8"
    >
      <CreatePlayerModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={onPlayerAdd}
      />

      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-white italic tracking-tighter mb-2">
            ТАВЕРНА
          </h1>
          <p className="text-zinc-500 text-sm max-w-md">
            Место, где рождаются легенды. Найми лучших героев для своей команды.
          </p>

          <div className="flex bg-[#050a14] border border-white/5 p-1 rounded-xl w-fit mt-4">
            <button
              onClick={() => {
                setMarketTab("players");
                setSelectedRole("Все");
              }}
              className={`px-5 py-2.5 rounded-lg text-xs font-black uppercase tracking-wider transition-all duration-300 ${
                marketTab === "players"
                  ? "bg-blue-600 text-white shadow-[0_0_15px_rgba(37,99,235,0.3)]"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              Игроки
            </button>
            <button
              onClick={() => {
                setMarketTab("staff");
                setSelectedRole("Все");
              }}
              className={`px-5 py-2.5 rounded-lg text-xs font-black uppercase tracking-wider transition-all duration-300 ${
                marketTab === "staff"
                  ? "bg-blue-600 text-white shadow-[0_0_15px_rgba(37,99,235,0.3)]"
                  : "text-zinc-400 hover:text-white relative"
              }`}
            >
              Персонал
              {staff.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-green-500 text-black font-black text-[8px] px-1 rounded-full">
                  {staff.length}
                </span>
              )}
            </button>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {isAdmin && marketTab === "players" && (
            <div className="flex gap-2">
              <button
                onClick={() => setIsModalOpen(true)}
                className="bg-blue-600 hover:bg-blue-500 px-6 py-3 rounded-lg font-black text-[11px] uppercase tracking-wider text-white flex items-center gap-3 shadow-[0_0_20px_rgba(37,99,235,0.2)] transition-all hover:scale-[1.02] active:scale-[0.98] group relative overflow-hidden"
              >
                <Plus size={16} />
                СОЗДАТЬ ИГРОКА
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-[100%] group-hover:translate-x-[100%] transition-transform duration-700" />
              </button>
            </div>
          )}
          <div className="h-12 pl-4 pr-12 bg-[#0c1220]/60 border border-white/5 rounded-lg flex items-center gap-3 text-zinc-500 focus-within:border-blue-500/30 transition-all relative">
            <Search size={16} className="text-zinc-600" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={marketTab === "players" ? "Поиск игрока..." : "Поиск сотрудника..."}
              className="bg-transparent border-none outline-none text-xs font-medium text-white placeholder:text-zinc-600 w-full md:w-64"
            />
            <div className="absolute right-4 top-1/2 -translate-y-1/2">
               <Search size={14} className="text-zinc-700" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Filters Sidebar */}
        <div className="md:col-span-1 space-y-6">
          <div className="glass-card rounded-xl p-5 border border-white/[0.03]">
            <h3 className="text-sm font-bold text-white mb-6 uppercase tracking-widest">
              ФИЛЬТРЫ
            </h3>

            <div className="space-y-6">
              {marketTab === "players" ? (
                <>
                  <div className="space-y-3">
                    <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                      РАНГ
                    </p>
                    <div className="flex flex-col gap-2">
                      <FilterButton 
                        icon={Users} 
                        label="Виртуал" 
                        color="text-red-500" 
                        active={selectedRank === "Virtual"} 
                        onClick={() => setSelectedRank(selectedRank === "Virtual" ? null : "Virtual")}
                      />
                      <FilterButton 
                        icon={Trophy} 
                        label="Легендарка" 
                        color="text-yellow-500" 
                        active={selectedRank === "Legendary"}
                        onClick={() => setSelectedRank(selectedRank === "Legendary" ? null : "Legendary")}
                      />
                      <FilterButton 
                        icon={Zap} 
                        label="Эпик" 
                        color="text-purple-500" 
                        active={selectedRank === "Epic"}
                        onClick={() => setSelectedRank(selectedRank === "Epic" ? null : "Epic")}
                      />
                      <FilterButton 
                        icon={Shield} 
                        label="Рарка" 
                        color="text-blue-400" 
                        active={selectedRank === "Rare"}
                        onClick={() => setSelectedRank(selectedRank === "Rare" ? null : "Rare")}
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                      РОЛЬ
                    </p>
                    <div className="flex flex-col gap-2">
                      <RoleButton 
                        icon={ShoppingBag} 
                        label="Все" 
                        active={selectedRole === "Все" || selectedRole === null} 
                        onClick={() => setSelectedRole("Все")}
                      />
                      <RoleButton 
                        icon={Crown} 
                        label="Captain" 
                        active={selectedRole === "Captain"} 
                        onClick={() => setSelectedRole("Captain")}
                      />
                      <RoleButton 
                        icon={Crosshair} 
                        label="Sniper" 
                        active={selectedRole === "Sniper"} 
                        onClick={() => setSelectedRole("Sniper")}
                      />
                      <RoleButton 
                        icon={Target} 
                        label="Rifler" 
                        active={selectedRole === "Rifler"} 
                        onClick={() => setSelectedRole("Rifler")}
                      />
                      <RoleButton 
                        icon={Shield} 
                        label="Support" 
                        active={selectedRole === "Support"} 
                        onClick={() => setSelectedRole("Support")}
                      />
                      <RoleButton 
                        icon={Zap} 
                        label="Lurker" 
                        active={selectedRole === "Lurker"} 
                        onClick={() => setSelectedRole("Lurker")}
                      />
                    </div>
                  </div>
                </>
              ) : (
                <div className="space-y-3">
                  <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                    РОЛЬ ПЕРСОНАЛА
                  </p>
                  <div className="flex flex-col gap-2">
                    <RoleButton 
                      icon={ShoppingBag} 
                      label="Все" 
                      active={selectedRole === "Все" || selectedRole === null} 
                      onClick={() => setSelectedRole("Все")}
                    />
                    <RoleButton 
                      icon={Users} 
                      label="Менеджер" 
                      active={selectedRole === "Менеджер" || selectedRole === "Manager"} 
                      onClick={() => setSelectedRole("Менеджер")}
                    />
                    <RoleButton 
                      icon={Activity} 
                      label="Аналитик" 
                      active={selectedRole === "Аналитик" || selectedRole === "Analyst"} 
                      onClick={() => setSelectedRole("Аналитик")}
                    />
                    <RoleButton 
                      icon={Zap} 
                      label="Тренер" 
                      active={selectedRole === "Тренер" || selectedRole === "Coach"} 
                      onClick={() => setSelectedRole("Тренер")}
                    />
                  </div>
                </div>
              )}

              <button 
                onClick={() => {
                  setSelectedRank(null);
                  setSelectedRole(null);
                  setSearchQuery("");
                }}
                className="w-full flex items-center gap-3 px-4 py-3 text-[10px] font-bold text-zinc-500 hover:text-white transition-all uppercase tracking-widest mt-4"
              >
                <Filter size={14} />
                СБРОСИТЬ ФИЛЬТРЫ
              </button>
            </div>
          </div>


        </div>

        {/* Results Area */}
        <div className="md:col-span-3">
          {marketTab === "players" ? (
            filteredPlayers.length === 0 ? (
              <div className="glass-panel min-h-[400px] rounded-2xl border-dashed flex flex-col items-center justify-center p-12 text-center opacity-80">
                <div className="w-20 h-20 bg-zinc-900 border border-white/5 rounded-full flex items-center justify-center mb-6 text-zinc-600">
                  <Users size={32} />
                </div>
                <h2 className="text-xl font-black text-white italic mb-2 tracking-tight">
                  ИГРОКИ НЕ НАЙДЕНЫ
                </h2>
                <p className="text-zinc-500 text-sm max-w-xs mb-8 leading-relaxed">
                  Попробуйте изменить параметры фильтрации или поисковый запрос.
                </p>
                <div className="flex gap-4">
                  <div className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-[9px] font-black uppercase tracking-widest text-zinc-600">
                     Ожидайте обновлений
                  </div>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
                {filteredPlayers.map((p: any) => {
                  const teamMember = team.find((tp: any) => tp.id === p.id);
                  const isUserListing = !!p.isListedByUser;
                  return (
                    <PlayerCard
                      key={p.id}
                      {...p}
                      price={p.listedPrice ?? p.price}
                      variant="market"
                      onBuy={!isUserListing ? () => onPlayerBuy(p) : undefined}
                      onSell={isUserListing ? () => onPlayerSell(p) : undefined}
                      onTrain={() => onPlayerTrain(p)}
                      onUpgradeStat={(statKey: string) => onPlayerUpgradeStat(p.id, statKey)}
                      isBought={!!teamMember}
                      isListedByUser={isUserListing}
                      {...(teamMember || {})} // get level/xp if in team
                      hasCoach={staff.some((s: any) => s.role === 'Coach')}
                      analystLevel={staff.find((s: any) => s.role === 'Analyst')?.level || 0}
                      maxTrainings={3 + ((staff.find((s: any) => s.role === 'Manager')?.level || 0) === 1 ? 1 : (staff.find((s: any) => s.role === 'Manager')?.level || 0) === 2 ? 2 : (staff.find((s: any) => s.role === 'Manager')?.level || 0) === 3 ? 3 : 0)}
                    />
                  );
                })}
              </div>
            )
          ) : (
            filteredStaff.length === 0 ? (
              <div className="glass-panel min-h-[400px] rounded-2xl border-dashed flex flex-col items-center justify-center p-12 text-center opacity-80">
                <div className="w-20 h-20 bg-zinc-900 border border-white/5 rounded-full flex items-center justify-center mb-6 text-zinc-600">
                  <Users size={32} />
                </div>
                <h2 className="text-xl font-black text-white italic mb-2 tracking-tight">
                  СОТРУДНИКИ НЕ НАЙДЕНЫ
                </h2>
                <p className="text-zinc-500 text-sm max-w-xs mb-8 leading-relaxed">
                  Попробуйте изменить поисковый запрос или фильтры персонала.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredStaff.map((candidate: any) => {
                  const currentHired = staff.find(s => s.role === candidate.role);
                  const isExactSameHired = currentHired?.level === candidate.level;
                  const isBetterHired = currentHired && currentHired.level > candidate.level;
                  const canUpgradeToThis = currentHired && currentHired.level < candidate.level;

                  // Styling constants based on staff level
                  const glowColors = 
                    candidate.level === 3 ? "shadow-[0_0_30px_rgba(234,179,8,0.15)] border-yellow-500/30 bg-gradient-to-b from-yellow-950/20 to-[#050a14]" :
                    candidate.level === 2 ? "shadow-[0_0_30px_rgba(168,85,247,0.15)] border-purple-500/30 bg-gradient-to-b from-purple-950/20 to-[#050a14]" :
                    "shadow-[0_0_30px_rgba(37,99,235,0.15)] border-blue-500/30 bg-gradient-to-b from-blue-950/20 to-[#050a14]";

                  const badgeColors =
                    candidate.level === 3 ? "bg-yellow-500 text-black shadow-[0_0_15px_rgba(234,179,8,0.4)]" :
                    candidate.level === 2 ? "bg-purple-600 text-white shadow-[0_0_15px_rgba(168,85,247,0.4)]" :
                    "bg-blue-600 text-white shadow-[0_0_15px_rgba(37,99,235,0.4)]";

                  return (
                    <motion.div
                      key={candidate.id}
                      whileHover={{ scale: 1.02 }}
                      className={`glass-card rounded-2xl p-6 border flex flex-col justify-between min-h-[280px] hover:border-white/10 transition-all ${glowColors}`}
                    >
                      <div>
                        <div className="flex items-center justify-between mb-4">
                          <span className={`px-2.5 py-1 rounded text-[8px] font-black uppercase tracking-wider ${badgeColors}`}>
                            {candidate.roleName}
                          </span>
                          <span className="text-[10px] text-yellow-500 font-extrabold flex gap-0.5">
                            {Array.from({ length: candidate.level }).map((_, i) => "⭐")}
                          </span>
                        </div>

                        <h3 className="text-lg font-black text-white uppercase italic tracking-tight leading-tight mb-2">
                          {candidate.name}
                        </h3>

                        <p className="text-zinc-400 text-xs font-medium leading-relaxed mb-6">
                          {candidate.desc}
                        </p>
                      </div>

                      <div className="pt-4 border-t border-white/5">
                        {isExactSameHired ? (
                          <div className="w-full py-3.5 rounded-xl text-center bg-green-500/10 border border-green-500/20 text-green-400 text-[10px] font-black uppercase tracking-widest">
                            НА СЛУЖБЕ (ТЕКУЩИЙ)
                          </div>
                        ) : isBetterHired ? (
                          <div className="w-full py-3.5 rounded-xl text-center bg-zinc-900 border border-white/5 text-zinc-500 text-[10px] font-black uppercase tracking-widest cursor-not-allowed">
                            НА СЛУЖБЕ (УЛУЧШЕН ДО ЛВЛ {currentHired.level})
                          </div>
                        ) : canUpgradeToThis ? (
                          <button
                            onClick={() => onBuyStaff(candidate)}
                            className="w-full py-3.5 bg-yellow-600 hover:bg-yellow-500 text-black rounded-xl text-[10px] font-black uppercase tracking-widest transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg"
                          >
                            ПОВЫСИТЬ ЗА ${candidate.price.toLocaleString()}
                          </button>
                        ) : (
                          <button
                            onClick={() => onBuyStaff(candidate)}
                            className="w-full py-3.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg"
                          >
                            НАНЯТЬ ЗА ${candidate.price.toLocaleString()}
                          </button>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )
          )}
        </div>
      </div>
    </motion.div>
  );
};
const AnalyticsStatsDetails = ({ onBack, matchHistory, setMatchResult }: any) => {
  const totalMatches = matchHistory?.length || 0;
  const wins = matchHistory?.filter((m: any) => m.result === 'WIN').length || 0;
  const winRate = totalMatches > 0 ? Math.round((wins / totalMatches) * 100) : 0;
  
  const allRatings = matchHistory?.flatMap((m:any) => m.playerStats?.map((ps:any) => ps.rating) || []) || [];
  const avgRating = allRatings.length > 0 ? (allRatings.reduce((a:any, b:any) => a + b, 0) / allRatings.length).toFixed(2) : "0.00";
  
  const stats = [
    { label: "МАТЧЕЙ", value: totalMatches.toString(), icon: <Target size={24} />, desc: "Официальные матчи" },
    { label: "ПОБЕД", value: wins.toString(), icon: <Trophy size={24} />, desc: "Все победы" },
    { label: "WIN RATE", value: `${winRate}%`, icon: <TrendingUp size={24} />, desc: "Процент успеха" },
    { label: "AVG RATING", value: avgRating, icon: <Activity size={24} />, desc: "Средний рейтинг" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.05 }}
      className="glass-panel p-10 rounded-[40px] border-white/5 flex flex-col gap-10 max-h-[85vh] overflow-y-auto custom-scrollbar"
    >
      <div className="flex items-center justify-between top-0 bg-transparent z-10">
        <h2 className="text-4xl font-black text-white italic uppercase tracking-tighter">ПОДРОБНАЯ СТАТИСТИКА</h2>
        <button 
          onClick={onBack}
          className="px-6 py-2 bg-white/5 hover:bg-white/10 rounded-xl border border-white/10 text-[10px] font-black uppercase tracking-widest text-white transition-all"
        >
          НАЗАД
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="glass-panel p-8 rounded-3xl border-white/5 bg-white/[0.01] flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 bg-blue-600/20 rounded-xl flex items-center justify-center text-blue-500 border border-blue-500/20">
                {stat.icon}
              </div>
            </div>
            <div>
              <span className="block text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] mb-1">{stat.label}</span>
              <span className="text-3xl font-black text-white italic leading-none">{stat.value}</span>
              <p className="text-[10px] text-zinc-500 mt-4 leading-relaxed">{stat.desc}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="space-y-6">
         <h3 className="text-xl font-black text-white italic uppercase tracking-tighter">НЕДАВНИЕ МАТЧИ</h3>
         <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {matchHistory && matchHistory.length > 0 ? matchHistory.slice(0, 6).map((m: any, i: number) => (
               <div key={i} className="p-6 bg-white/[0.02] border border-white/5 rounded-3xl flex items-center justify-between group hover:bg-white/[0.04] transition-all">
                   <div className="flex items-center gap-6">
                      <div className="text-2xl font-black text-white italic tabular-nums tracking-tighter">{m.scoreA}:{m.scoreB}</div>
                      <div className="flex flex-col">
                         <span className="text-[11px] font-black text-white uppercase italic tracking-tighter">{m.opponentName}</span>
                         <span className={`text-[8px] font-black uppercase tracking-widest ${m.result === 'WIN' ? 'text-green-500' : 'text-red-500'}`}>{m.result}</span>
                      </div>
                   </div>
                   <button 
                      onClick={() => setMatchResult(m)}
                      className="px-5 py-2.5 bg-white/5 border border-white/10 rounded-xl text-[9px] font-black uppercase tracking-widest text-zinc-500 group-hover:text-white group-hover:bg-blue-600 group-hover:border-blue-500 transition-all active:scale-95"
                   >
                      SCOREBOARD
                   </button>
               </div>
            )) : (
              <div className="col-span-2 py-20 text-center border-2 border-dashed border-white/5 rounded-[40px]">
                 <p className="text-[10px] font-black text-zinc-700 uppercase tracking-widest">Нет данных о матчах</p>
              </div>
            )}
         </div>
      </div>
    </motion.div>
  );
};

const AnalyticsView = ({ 
  onBack, 
  isAdmin, 
  bets, 
  setBets, 
  maps, 
  setAnalyticsMaps,
  matchHistory,
  setMatchHistory,
  team,
  roleMultipliers,
  userBets,
  setUserBets,
  balance,
  setBalance,
  resolvingMatch,
  setResolvingMatch,
  simulateMatch,
  resolveMatch,
  setMatchResult,
  matchFormat,
  handleStartSimulation,
  autoPickSettings,
  setAutoPickSettings,
  bootcamp,
  setBootcamp,
  staff
}: any) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [showStats, setShowStats] = useState(false);
  const itemsPerPage = 2;
  const totalPages = Math.max(1, Math.ceil(bets.length / itemsPerPage));

  const [showAddBet, setShowAddBet] = useState(false);
  const [showManageMaps, setShowManageMaps] = useState(false);
  const [showBetModal, setShowBetModal] = useState<any>(null);
  const [selectedTeam, setSelectedTeam] = useState<string | null>(null);
  const [betAmount, setBetAmount] = useState<string>("");
  const [showHistory, setShowHistory] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [tempMapImage, setTempMapImage] = useState<string>("");
  const [selectedMapStats, setSelectedMapStats] = useState<{name: string, winRate: number, oppWinRate: number} | null>(null);
  const [showVeto, setShowVeto] = useState(false);
  const [vetoSession, setVetoSession] = useState<{
    maps: any[];
    sequence: { turn: 'YOU' | 'ENEMY' | 'NEUTRAL'; type: 'BAN' | 'PICK' }[];
    stepIndex: number;
    log: string[];
    associatedMatch?: any;
    isAnalyzing: boolean;
    tempBestOfMaps: any[];
    team1Best?: string;
    team1Permaban?: string;
    team2Best?: string;
    team2Permaban?: string;
  } | null>(null);

  const MAP_WIN_RATES: Record<string, { you: number; enemy: number }> = {
    breeze: { you: 58, enemy: 42 },
    rust: { you: 45, enemy: 55 },
    province: { you: 62, enemy: 38 },
    sandstone: { you: 40, enemy: 60 },
    dune: { you: 52, enemy: 48 },
  };

  const buildVetoSequence = (format: string) => {
    const sequence: { turn: 'YOU' | 'ENEMY' | 'NEUTRAL'; type: 'BAN' | 'PICK' }[] = [];
    const mapCount = maps.length;
    if (format === 'bo1') {
      const banSteps = maps.length - 1;
      for (let i = 0; i < banSteps; i++) {
        sequence.push({ turn: i % 2 === 0 ? 'YOU' : 'ENEMY', type: 'BAN' });
      }
    } else if (format === 'bo2') {
      sequence.push(
        { turn: 'YOU', type: 'BAN' },
        { turn: 'ENEMY', type: 'BAN' },
        { turn: 'YOU', type: 'BAN' },
        { turn: 'ENEMY', type: 'BAN' },
        { turn: 'YOU', type: 'PICK' },
        { turn: 'ENEMY', type: 'PICK' }
      );
      if (mapCount >= 7) {
        sequence.push({ turn: 'NEUTRAL', type: 'BAN' });
      }
    } else if (format === 'bo3') {
      sequence.push(
        { turn: 'YOU', type: 'BAN' },
        { turn: 'ENEMY', type: 'BAN' },
        { turn: 'YOU', type: 'PICK' },
        { turn: 'ENEMY', type: 'PICK' },
        { turn: 'YOU', type: 'BAN' },
        { turn: 'ENEMY', type: 'BAN' }
      );
    } else if (format === 'bo5') {
      sequence.push(
        { turn: 'YOU', type: 'BAN' },
        { turn: 'ENEMY', type: 'BAN' },
        { turn: 'YOU', type: 'PICK' },
        { turn: 'ENEMY', type: 'PICK' },
        { turn: 'YOU', type: 'PICK' },
        { turn: 'ENEMY', type: 'PICK' }
      );
      if (mapCount >= 7) {
        sequence.push({ turn: 'NEUTRAL', type: 'BAN' });
      }
    } else {
      const banSteps = Math.min(6, maps.length - 1);
      for (let i = 0; i < banSteps; i++) {
        sequence.push({ turn: i % 2 === 0 ? 'YOU' : 'ENEMY', type: 'BAN' });
      }
    }
    return sequence;
  };

  const startVeto = (matchToSimulate?: any) => {
    const activeFormat = matchToSimulate ? (matchToSimulate.format || matchFormat) : matchFormat;
    const formatKey = activeFormat as 'bo1' | 'bo2' | 'bo3' | 'bo5';
    const currentPrefs = autoPickSettings[formatKey] || { preferred: 'sandstone', banned: 'province' };
    const enemyPrefs = {
      preferred: maps.find(m => m.id !== currentPrefs.preferred)?.id || maps[0].id,
      banned: maps.find(m => m.id !== currentPrefs.banned && m.id !== currentPrefs.preferred)?.id || maps[0].id,
    };
    const seq = buildVetoSequence(activeFormat);

    setVetoSession({
      maps: maps.map(m => ({ ...m, status: 'AVAILABLE' })),
      sequence: seq,
      stepIndex: 0,
      log: [`ВЕТО НАЧАТО: ФОРМАТ ${activeFormat.toUpperCase()}`],
      associatedMatch: matchToSimulate || null,
      isAnalyzing: false,
      tempBestOfMaps: [],
      team1Best: currentPrefs.preferred,
      team1Permaban: currentPrefs.banned,
      team2Best: enemyPrefs.preferred,
      team2Permaban: enemyPrefs.banned,
    });
    setShowVeto(true);
  };

  const processAutoVetoTurn = (currentSession: any) => {
    if (!currentSession) return;
    const { sequence, stepIndex, maps: currentMaps, tempBestOfMaps, team2Best, team2Permaban } = currentSession;
    if (stepIndex >= sequence.length) return;

    const step = sequence[stepIndex];
    if (step.turn === 'YOU') return;

    const available = currentMaps.filter((m: any) => m.status === 'AVAILABLE');
    if (available.length === 0) return;

    let chosenMap: any = null;
    if (step.type === 'BAN') {
      if (step.turn === 'ENEMY' && team2Permaban) {
        const permabanMap = available.find((m: any) => m.id === team2Permaban || m.name.toLowerCase() === team2Permaban.toLowerCase());
        if (permabanMap) chosenMap = permabanMap;
      }
      if (!chosenMap) {
        const randomIndex = Math.floor(Math.random() * available.length);
        chosenMap = available[randomIndex];
      }
    } else {
      if (team2Best && step.turn === 'ENEMY') {
        const bestMap = available.find((m: any) => m.id === team2Best || m.name.toLowerCase() === team2Best.toLowerCase());
        if (bestMap) chosenMap = bestMap;
      }
      if (!chosenMap) {
        const sorted = [...available].sort((a, b) => {
          const wrA = MAP_WIN_RATES[a.id]?.enemy || 50;
          const wrB = MAP_WIN_RATES[b.id]?.enemy || 50;
          return wrB - wrA;
        });
        chosenMap = sorted[0] || available[Math.floor(Math.random() * available.length)];
      }
    }

    if (!chosenMap) {
      chosenMap = available[Math.floor(Math.random() * available.length)];
    }

    const updatedMaps = currentMaps.map((m: any) => {
      if (m.id === chosenMap.id) {
        return {
          ...m,
          status: step.type === 'BAN' ? 'BANNED' : 'PICKED',
          pickedBy: step.turn === 'ENEMY' ? 'ENEMY' : 'SYSTEM'
        };
      }
      return m;
    });

    const updatedBestOf = step.type === 'PICK'
      ? [...tempBestOfMaps, chosenMap]
      : tempBestOfMaps;

    const actionText = step.type === 'BAN' ? 'ЗАБАНЕНА' : 'ВЫБРАНА (ПИК)';
    const actorText = step.turn === 'ENEMY' ? '[ПРОТИВНИК]' : '[СИСТЕМА]';
    const newLog = [`${actorText} КАРТА ${chosenMap.name} ${actionText}`, ...currentSession.log];

    const nextStepIndex = stepIndex + 1;
    const remainsCount = updatedMaps.filter((m: any) => m.status === 'AVAILABLE').length;

    if (nextStepIndex >= sequence.length || remainsCount <= 1) {
      const availableMaps = updatedMaps.filter((m: any) => m.status === 'AVAILABLE');
      const deciderMap = availableMaps.length === 1
        ? availableMaps[0]
        : availableMaps[Math.floor(Math.random() * availableMaps.length)];
      const finalMaps = updatedMaps.map((m: any) => {
        if (m.id === deciderMap?.id) {
          return { ...m, status: 'DECIDER' };
        }
        return m;
      });

      const lastMap = finalMaps.find((m: any) => m.status === 'DECIDER');
      const finalLog = [`[СИСТЕМА] ВЕТО ЗАВЕРШЕНО. ФИНАЛЬНАЯ КАРТА (DECIDER): ${lastMap?.name || ''}`, ...newLog];

      setVetoSession({
        ...currentSession,
        maps: finalMaps,
        stepIndex: nextStepIndex,
        log: finalLog,
        isAnalyzing: false,
        tempBestOfMaps: updatedBestOf
      });
    } else {
      const nextSession = {
        ...currentSession,
        maps: updatedMaps,
        stepIndex: nextStepIndex,
        log: newLog,
        isAnalyzing: false,
        tempBestOfMaps: updatedBestOf
      };

      setVetoSession(nextSession);

      if (sequence[nextStepIndex]?.turn !== 'YOU') {
        setVetoSession(prev => prev ? { ...prev, isAnalyzing: true } : null);
        setTimeout(() => {
          processAutoVetoTurn(nextSession);
        }, 1200);
      }
    }
  };

  const handleVetoAction = (mapIndex: number) => {
    if (!vetoSession || vetoSession.isAnalyzing) return;
    const { sequence, stepIndex, maps: currentMaps, tempBestOfMaps } = vetoSession;
    if (stepIndex >= sequence.length) return;

    const step = sequence[stepIndex];
    if (step.turn !== 'YOU') return;

    const map = currentMaps[mapIndex];
    if (map.status !== 'AVAILABLE') return;

    const updatedMaps = currentMaps.map((m, idx) => {
      if (idx === mapIndex) {
        return { 
          ...m, 
          status: step.type === 'BAN' ? 'BANNED' : 'PICKED',
          pickedBy: 'YOU'
        };
      }
      return m;
    });

    const updatedBestOf = step.type === 'PICK' 
      ? [...tempBestOfMaps, map] 
      : tempBestOfMaps;

    const actionText = step.type === 'BAN' ? 'ЗАБАНЕНА' : 'ВЫБРАНА (ПИК)';
    const newLog = [`[ВЫ] КАРТА ${map.name} ${actionText}`, ...vetoSession.log];

    const nextStepIndex = stepIndex + 1;
    const remainsCount = updatedMaps.filter((m: any) => m.status === 'AVAILABLE').length;

    if (nextStepIndex >= sequence.length || remainsCount <= 1) {
      const availableMaps = updatedMaps.filter((m: any) => m.status === 'AVAILABLE');
      const deciderMap = availableMaps.length === 1
        ? availableMaps[0]
        : availableMaps[Math.floor(Math.random() * availableMaps.length)];
      const finalMaps = updatedMaps.map((m: any) => {
        if (m.id === deciderMap?.id) {
          return { ...m, status: 'DECIDER' };
        }
        return m;
      });
      const lastMap = finalMaps.find((m: any) => m.status === 'DECIDER');
      const finalLog = [`[СИСТЕМА] ВЕТО ЗАВЕРШЕНО. ФИНАЛЬНАЯ КАРТА (DECIDER): ${lastMap?.name || ''}`, ...newLog];

      setVetoSession({
        ...vetoSession,
        maps: finalMaps,
        stepIndex: nextStepIndex,
        log: finalLog,
        isAnalyzing: false,
        tempBestOfMaps: updatedBestOf
      });
    } else {
      const nextSession = {
        ...vetoSession,
        maps: updatedMaps,
        stepIndex: nextStepIndex,
        log: newLog,
        isAnalyzing: false,
        tempBestOfMaps: updatedBestOf
      };
      setVetoSession(nextSession);

      if (sequence[nextStepIndex]?.turn !== 'YOU') {
        setVetoSession(prev => prev ? { ...prev, isAnalyzing: true } : null);
        setTimeout(() => {
          processAutoVetoTurn(nextSession);
        }, 1200);
      }
    }
  };

  const currentBets = bets.slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage);

  const opponent = {
    name: "CYBER DRAGONS",
    logo: "https://api.dicebear.com/7.x/identicon/svg?seed=dragons",
    history: [
      { result: "L", score: "13-16", date: "2 дня назад" },
      { result: "W", score: "16-10", date: "5 дней назад" },
      { result: "W", score: "16-14", date: "1 неделя назад" },
    ]
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setTempMapImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  if (showStats) {
    return <AnalyticsStatsDetails onBack={() => setShowStats(false)} />;
  }

  const existingBet = showBetModal ? userBets[showBetModal.id] : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="flex flex-col gap-10"
    >
      {/* MAP VETO MODAL */}
      <AnimatePresence>
        {showVeto && vetoSession && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-6 bg-[#020502]/95 backdrop-blur-xl overflow-y-auto">
             <motion.div
               initial={{ y: 50, opacity: 0 }}
               animate={{ y: 0, opacity: 1 }}
               exit={{ y: 50, opacity: 0 }}
               className="glass-panel p-8 rounded-[40px] border-white/10 w-full max-w-4xl relative overflow-hidden"
             >
                {/* Visual Glows */}
                <div className="absolute -top-32 -left-32 w-64 h-64 bg-emerald-500/10 blur-[120px] pointer-events-none" />
                <div className="absolute -bottom-32 -right-32 w-64 h-64 bg-blue-500/10 blur-[120px] pointer-events-none" />

                <div className="flex items-center justify-between mb-6 relative z-10 font-sans">
                   <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-black tracking-widest text-[#00ff88] bg-[#00ff88]/10 px-2.5 py-0.5 rounded-md uppercase">
                          DRAFT SYSTEM
                        </span>
                        <div className="w-1.5 h-1.5 rounded-full bg-[#00ff88] animate-pulse" />
                      </div>
                      <h3 className="text-2xl font-black text-white italic uppercase tracking-tighter mt-1">
                        MAP VETO: {(vetoSession.associatedMatch?.format || matchFormat || 'BO1').toUpperCase()} SERIES
                      </h3>
                      <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mt-1 font-mono">
                        Противник: <span className="text-red-400 font-extrabold">{vetoSession.associatedMatch?.opponent?.name || opponent.name}</span>
                      </p>
                   </div>
                   <button 
                     onClick={() => {
                       setShowVeto(false);
                       setVetoSession(null);
                     }} 
                     className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 hover:scale-105 transition-all text-white cursor-pointer"
                   >
                      <X size={18} />
                   </button>
                </div>

                {/* VETO STATUS / PROGRESS BAR */}
                {(() => {
                  const isFinished = vetoSession.stepIndex >= vetoSession.sequence.length || vetoSession.maps.filter((m: any) => m.status === 'AVAILABLE').length <= 1;
                  const currentStep = !isFinished ? vetoSession.sequence[vetoSession.stepIndex] : null;
                  const analyst = staff.find((s: any) => s.role === 'Analyst');
                  const showRecommendations = analyst && analyst.level >= 1;
                  const showWinrates = analyst && analyst.level >= 2;
                  
                  // Recommendations generator
                  let recText = "";
                  if (!isFinished && currentStep) {
                    const availableMaps = vetoSession.maps.filter((m: any) => m.status === 'AVAILABLE');
                    if (availableMaps.length > 0) {
                      if (currentStep.type === 'BAN') {
                        const worstForUs = [...availableMaps].sort((a, b) => (MAP_WIN_RATES[a.id]?.you || 50) - (MAP_WIN_RATES[b.id]?.you || 50))[0];
                        const bestForEnemy = [...availableMaps].sort((a, b) => (MAP_WIN_RATES[b.id]?.enemy || 50) - (MAP_WIN_RATES[a.id]?.enemy || 50))[0];
                        recText = `Рекомендуем ЗАБАНЕВАТЬ карту "${bestForEnemy?.name}" (у оппонента на ней ${(MAP_WIN_RATES[bestForEnemy?.id]?.enemy || 50)}% побед) или нашу худшую "${worstForUs?.name}" (у нас ${(MAP_WIN_RATES[worstForUs?.id]?.you || 50)}% побед).`;
                      } else {
                        const bestForUs = [...availableMaps].sort((a, b) => (MAP_WIN_RATES[b.id]?.you || 50) - (MAP_WIN_RATES[a.id]?.you || 50))[0];
                        recText = `Рекомендуем ПИКНУТЬ карту "${bestForUs?.name}" — на ней наш винрейт составляет ${(MAP_WIN_RATES[bestForUs?.id]?.you || 50)}%! Это даст весомый буст игрокам.`;
                      }
                    }
                  }

                  return (
                    <div className="relative z-10 space-y-4 font-sans">
                      {/* Interactive alert header */}
                      {!isFinished ? (
                        <div className={`p-4 rounded-2xl border flex items-center justify-between ${
                          currentStep?.turn === 'YOU' 
                            ? 'bg-blue-500/5 border-blue-500/20 text-blue-300' 
                            : 'bg-red-500/5 border-red-500/20 text-red-300'
                        }`}>
                          <div className="flex items-center gap-3">
                            <div className={`w-3 h-3 rounded-full ${currentStep?.turn === 'YOU' ? 'bg-blue-500 animate-ping' : 'bg-red-500 animate-pulse'}`} />
                            <div>
                              <p className="text-[10px] font-black uppercase tracking-widest text-[#888]">ТЕКУЩИЙ ХОД</p>
                              <h4 className="text-sm font-black uppercase tracking-tight text-white">
                                {currentStep?.turn === 'YOU' ? '🚀 ВАША ОЧЕРЕДЬ: ' : '🤖 ХОД ПРОТИВНИКА: '}
                                <span className={currentStep?.turn === 'YOU' ? 'text-blue-400' : 'text-red-400'}>
                                  {currentStep?.type === 'BAN' ? 'БАН КАРТЫ' : 'ПИК КАРТЫ'}
                                </span>
                              </h4>
                            </div>
                          </div>
                          {vetoSession.isAnalyzing && (
                            <span className="text-[9px] font-black uppercase tracking-widest px-3 py-1 bg-red-500/10 text-red-400 rounded-lg animate-pulse">
                              Противник думает...
                            </span>
                          )}
                        </div>
                      ) : (
                        <div className="p-4 rounded-2xl border bg-[#00ff88]/5 border-[#00ff88]/20 text-[#00ff88]">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="w-3 h-3 rounded-full bg-[#00ff88]" />
                              <div>
                                <p className="text-[10px] font-black uppercase tracking-widest text-[#888]">РЕЗУЛЬТАТ ВЕТО</p>
                                <h4 className="text-sm font-black uppercase tracking-tight text-white font-sans font-black">ВЕТО СЕССИЯ УСПЕШНО ЗАВЕРШЕНА!</h4>
                              </div>
                            </div>
                            <span className="text-[9px] font-black uppercase tracking-widest px-3 py-1 bg-[#00ff88]/10 text-[#00ff88] rounded-lg">
                              Серия Готова
                            </span>
                          </div>
                        </div>
                      )}

                      {/* Analyst tips block */}
                      {showRecommendations && !isFinished && recText && (
                        <div className="p-4 rounded-2xl border border-yellow-500/10 bg-gradient-to-r from-yellow-500/5 to-transparent flex items-start gap-4">
                          <span className="text-xl shrink-0">💡</span>
                          <div>
                            <p className="text-[9px] font-extrabold uppercase tracking-widest text-yellow-500">РЕКОМЕНДАЦИЯ АНАЛИТИКА (Ур. {analyst?.level})</p>
                            <p className="text-xs text-zinc-300 font-medium leading-relaxed mt-1">
                              {recText}
                            </p>
                          </div>
                        </div>
                      )}

                      {/* Map Cards selection Grid */}
                      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3 my-6">
                        {vetoSession.maps.map((map: any, i: number) => {
                          const wr = MAP_WIN_RATES[map.id] || { you: 50, enemy: 50 };
                          return (
                            <button 
                              key={map.id || `veto-map-${i}`}
                              disabled={map.status !== 'AVAILABLE' || isFinished || (currentStep?.turn !== 'YOU') || vetoSession.isAnalyzing}
                              onClick={() => handleVetoAction(i)}
                              className={`relative group flex flex-col rounded-2xl overflow-hidden border transition-all ${
                                map.status === 'AVAILABLE' 
                                  ? (currentStep?.turn === 'YOU' && !vetoSession.isAnalyzing
                                      ? 'border-white/10 hover:border-blue-500 hover:scale-[1.04] bg-zinc-950/40 cursor-pointer' 
                                      : 'border-white/5 bg-zinc-950/20 opacity-90 cursor-default')
                                  : map.status === 'BANNED'
                                    ? 'border-red-500/30 bg-red-950/5 opacity-50 cursor-not-allowed'
                                    : map.status === 'PICKED'
                                      ? 'border-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.15)] bg-emerald-950/5 cursor-default'
                                      : 'border-yellow-500 shadow-[0_0_15px_rgba(234,179,8,0.2)] bg-yellow-950/5 cursor-default'
                              }`}
                            >
                              {/* Thumbnail */}
                              <div className="aspect-square w-full overflow-hidden relative">
                                 <img src={map.image} className="w-full h-full object-cover transition-all group-hover:scale-105" alt="" />
                                 <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
                                 
                                 {/* Status badges overlay */}
                                 {map.status === 'BANNED' && (
                                   <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                                      <span className="text-[9px] font-black bg-red-600 text-white px-2 py-0.5 rounded uppercase tracking-widest shadow-lg">
                                        ЗАБАНЕНА
                                      </span>
                                   </div>
                                 )}
                                 {map.status === 'PICKED' && (
                                   <div className="absolute inset-0 bg-emerald-950/40 flex items-center justify-center">
                                      <span className="text-[9px] font-black bg-emerald-600 text-white px-2.5 py-0.5 rounded uppercase tracking-widest shadow-lg">
                                        ПИКНУТА ({map.pickedBy === 'YOU' ? 'МЫ' : 'ВРАГ'})
                                      </span>
                                   </div>
                                 )}
                                 {map.status === 'DECIDER' && (
                                   <div className="absolute inset-0 bg-yellow-500/20 flex items-center justify-center">
                                      <span className="text-[9px] font-black bg-yellow-500 text-black px-2 py-0.5 rounded uppercase tracking-widest shadow-lg font-sans">
                                        DECIDER
                                      </span>
                                   </div>
                                 )}
                              </div>

                              {/* Details pane */}
                              <div className="p-2 space-y-1 relative z-10 w-full bg-zinc-950/50">
                                 <h4 className="text-[10px] font-black text-white uppercase italic tracking-tight truncate">
                                   {map.name}
                                 </h4>
                                 
                                 {/* Win rates details from Analyst lvl 2 */}
                                 {showWinrates ? (
                                   <div className="space-y-1">
                                      <div className="flex justify-between text-[7px] font-black tracking-widest text-[#999] font-mono leading-none">
                                        <span>МЫ:{wr.you}%</span>
                                        <span>ВРГ:{wr.enemy}%</span>
                                      </div>
                                      <div className="h-0.5 w-full bg-zinc-800 rounded-full overflow-hidden flex">
                                        <div className="bg-blue-500 h-full" style={{ width: `${wr.you}%` }} />
                                        <div className="bg-red-500 h-full" style={{ width: `${wr.enemy}%` }} />
                                      </div>
                                   </div>
                                 ) : (
                                   <div className="text-[7px] font-extrabold tracking-widest text-zinc-500 uppercase font-mono">
                                     🔒 Винрейт скрыт
                                   </div>
                                 )}
                              </div>
                            </button>
                          );
                        })}
                      </div>

                      {/* Log output & Bottom panel */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                        {/* Feed block */}
                        <div className="md:col-span-2 bg-[#080d1a]/80 rounded-2xl p-4 border border-white/5 h-44 overflow-y-auto space-y-2 font-mono">
                           <p className="text-[9px] font-black text-zinc-500 uppercase tracking-widest sticky top-0 bg-[#080d1a] pb-1.5 border-b border-white/5 mb-1 z-10 flex items-center justify-between font-sans">
                             <span>ЛОГ ДРАФТА КАРТ</span>
                             <span>{vetoSession.stepIndex} / {vetoSession.sequence.length} ШАГОВ</span>
                           </p>
                           {vetoSession.log.map((entry: string, idx: number) => (
                             <div key={idx} className="text-[9px] font-bold tracking-widest text-[#b4b7c0] uppercase flex items-center gap-2">
                                {entry.includes('[ВЫ]') ? (
                                  <span className="text-blue-400 font-extrabold shrink-0">[ИГРОК]</span>
                                ) : entry.includes('[ПРОТИВНИК]') ? (
                                  <span className="text-red-400 font-extrabold shrink-0">[ВРАГ]</span>
                                ) : (
                                  <span className="text-emerald-400 font-extrabold shrink-0">[СИСТЕМА]</span>
                                )} 
                                <span className="truncate">{entry}</span>
                             </div>
                           ))}
                        </div>

                        {/* Summary details or simulation starter */}
                        <div className="bg-[#05080c] rounded-2xl p-4 border border-white/5 flex flex-col justify-between font-sans">
                          <div>
                            <span className="text-[9px] font-black uppercase tracking-widest text-zinc-500">
                              ДЕКЛАРАЦИЯ СЕРИИ
                            </span>
                            
                            {/* Played Maps list preview */}
                            <div className="mt-2.5 space-y-1.5">
                              {(() => {
                                const deciderMap = vetoSession.maps.find((m: any) => m.status === 'DECIDER') || vetoSession.maps.find((m: any) => m.status === 'AVAILABLE');
                                const picks = vetoSession.tempBestOfMaps || [];
                                const totalMapsCount = picks.length + (deciderMap ? 1 : 0);
                                
                                return (
                                  <>
                                    {picks.map((m: any, pi: number) => (
                                      <div key={pi} className="flex items-center gap-2 text-[10px] font-extrabold text-[#999] bg-white/[0.02] px-2.5 py-1 rounded-lg">
                                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                        <span>Карта {pi + 1}: {m.name}</span>
                                      </div>
                                    ))}
                                    {deciderMap && (
                                      <div className="flex items-center gap-2 text-[10px] font-extrabold text-yellow-400 bg-yellow-500/5 px-2.5 py-1 rounded-lg border border-yellow-500/10">
                                        <div className="w-1.5 h-1.5 rounded-full bg-yellow-500" />
                                        <span>Решающая: {deciderMap.name}</span>
                                      </div>
                                    )}
                                    {totalMapsCount === 0 && (
                                      <p className="text-[10px] text-zinc-500 italic mt-1 font-sans">Ожидание выбора карт...</p>
                                    )}
                                  </>
                                );
                              })()}
                            </div>
                          </div>

                          {/* Bootcamp Selection Before Match */}
                          {isFinished && (
                            <div className="p-4 bg-purple-600/10 border border-purple-500/20 rounded-xl mb-3">
                              <p className="text-[9px] font-black text-purple-400 uppercase tracking-widest mb-3">Выберите буткемп:</p>
                              <div className="grid grid-cols-3 gap-2">
                                <button
                                  onClick={() => setBootcamp({ tier: null, label: 'Нет', price: 0, bonus: { ratingBoost: 0, synergy: 0 }, purchasedAt: null })}
                                  className={`p-2 rounded-lg text-[8px] font-black uppercase tracking-widest transition-all ${
                                    !bootcamp?.tier 
                                      ? 'bg-white/10 border border-white/20 text-white' 
                                      : 'bg-white/5 border border-white/10 text-zinc-500 hover:text-white'
                                  }`}
                                >
                                  БЕЗ
                                </button>
                                {[
                                  { tier: 'budget', label: 'Дешевый', price: 50000, bonus: { ratingBoost: 3, synergy: 0.02 } },
                                  { tier: 'medium', label: 'Средний', price: 120000, bonus: { ratingBoost: 7, synergy: 0.05 } },
                                ].map(camp => (
                                  <button
                                    key={camp.tier}
                                    onClick={() => {
                                      if (balance >= camp.price) {
                                        setBalance(prev => prev - camp.price);
                                        setBootcamp({ tier: camp.tier, label: camp.label, price: camp.price, bonus: camp.bonus, purchasedAt: new Date().toISOString() });
                                      } else {
                                        alert('Недостаточно средств!');
                                      }
                                    }}
                                    disabled={balance < camp.price}
                                    className={`p-2 rounded-lg text-[8px] font-black uppercase tracking-widest transition-all ${
                                      bootcamp?.tier === camp.tier
                                        ? 'bg-purple-600/50 border border-purple-400 text-white'
                                        : balance < camp.price
                                        ? 'bg-white/5 border border-white/10 text-zinc-600 cursor-not-allowed'
                                        : 'bg-white/5 border border-white/10 text-zinc-400 hover:text-white'
                                    }`}
                                  >
                                    {camp.label}
                                  </button>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Quick simulated play trigger button */}
                          {isFinished ? (
                            <button
                              onClick={() => {
                                const deciderMap = vetoSession.maps.find((m: any) => m.status === 'DECIDER') || vetoSession.maps.find((m: any) => m.status === 'AVAILABLE') || maps[0];
                                const picks = vetoSession.tempBestOfMaps || [];
                                const playPool = [...picks];
                                if (playPool.every((p: any) => p.id !== deciderMap.id)) {
                                  playPool.push(deciderMap);
                                }
                                
                                const matchToPlay = vetoSession.associatedMatch || { id: Date.now(), opponent: { name: 'Cyber Dragons' }, format: matchFormat };
                                
                                handleStartSimulation(matchToPlay, deciderMap, playPool);
                                setShowVeto(false);
                                setVetoSession(null);
                              }}
                              className="w-full py-3.5 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white hover:scale-[1.02] active:scale-[0.98] rounded-xl text-[10px] font-black uppercase tracking-widest text-center shadow-[0_0_20px_rgba(16,185,129,0.15)] transition-all cursor-pointer font-sans"
                            >
                              НАЧАТЬ МАТЧ СЕРИИ 🎮
                            </button>
                          ) : (
                            <div className="text-[9px] font-bold text-zinc-500 uppercase italic mt-4 text-center leading-relaxed font-sans">
                              Каждая команда совершает выборы и баны поочерёдно.
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })()}
             </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MAP STATS MODAL (WIN RATE CIRCLE) */}
      <AnimatePresence>
        {selectedMapStats && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-[#02050a]/90 backdrop-blur-md">
            <div className="absolute inset-0" onClick={() => setSelectedMapStats(null)} />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="glass-panel p-10 rounded-[40px] border-white/10 w-full max-w-sm text-center relative overflow-hidden pointer-events-auto"
            >
              <div className="absolute -top-20 -left-20 w-40 h-40 bg-blue-600/20 blur-[100px]" />
              <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-red-600/20 blur-[100px]" />

              <h3 className="text-xl font-black text-white italic uppercase tracking-tighter mb-8 flex items-center justify-center gap-2">
                <span className="text-blue-500">//</span> {selectedMapStats.name} ANALYSIS
              </h3>
              
              <div className="relative w-40 h-40 mx-auto mb-8">
                <svg className="w-full h-full transform -rotate-90">
                  <circle
                    cx="80"
                    cy="80"
                    r="70"
                    fill="transparent"
                    stroke="rgba(255, 255, 255, 0.05)"
                    strokeWidth="10"
                  />
                  {/* Opponent Win Rate (Red) */}
                  <circle
                    cx="80"
                    cy="80"
                    r="70"
                    fill="transparent"
                    stroke="#ef4444"
                    strokeWidth="10"
                    strokeDasharray={`${2 * Math.PI * 70}`}
                    strokeDashoffset={`${2 * Math.PI * 70 * (1 - selectedMapStats.oppWinRate / 100)}`}
                    strokeLinecap="round"
                    className="transition-all duration-1000"
                  />
                  {/* Your Win Rate (Green) */}
                  <circle
                    cx="80"
                    cy="80"
                    r="70"
                    fill="transparent"
                    stroke="#22c55e"
                    strokeWidth="10"
                    strokeDasharray={`${2 * Math.PI * 70}`}
                    strokeDashoffset={`${2 * Math.PI * 70 * (1 - selectedMapStats.winRate / 100)}`}
                    strokeLinecap="round"
                    className="transition-all duration-1000"
                    style={{ transformOrigin: 'center', transform: `rotate(${selectedMapStats.oppWinRate * 3.6}deg)` }}
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-3xl font-black text-white italic leading-none">{selectedMapStats.winRate}%</span>
                  <span className="text-[7px] font-black text-zinc-500 uppercase tracking-widest mt-1">WIN RATE</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-8">
                <div className="p-4 bg-green-500/5 border border-green-500/20 rounded-2xl flex flex-col items-center">
                  <span className="text-[8px] font-black text-green-500 uppercase tracking-widest mb-1 italic">V.ARENA</span>
                  <span className="text-xl font-black text-white">{selectedMapStats.winRate}%</span>
                </div>
                <div className="p-4 bg-red-500/5 border border-red-500/20 rounded-2xl flex flex-col items-center">
                  <span className="text-[8px] font-black text-red-500 uppercase tracking-widest mb-1 italic">ENEMY</span>
                  <span className="text-xl font-black text-white">{selectedMapStats.oppWinRate}%</span>
                </div>
              </div>

              <button 
                onClick={() => setSelectedMapStats(null)}
                className="w-full py-4 bg-white/5 border border-white/10 rounded-2xl text-[9px] font-black text-white uppercase tracking-widest hover:bg-white/10 transition-all active:scale-95 shadow-[0_0_20px_rgba(37,99,235,0.1)]"
              >
                CLOSE REPORT
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* TOP HEADER */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4 flex-1 w-full">
          <div className="glass-panel px-8 py-4 rounded-3xl border-blue-500/30 bg-blue-600/5 flex items-center gap-4 shrink-0">
             <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-black italic shadow-[0_0_20px_rgba(37,99,235,0.4)]">
               $
             </div>
             <div>
                <span className="block text-[8px] font-black text-zinc-500 uppercase tracking-widest">ВАШ БАЛАНС</span>
                <span className="text-xl font-black text-white italic">${balance.toLocaleString()}</span>
             </div>
          </div>

          <button 
            onClick={() => setShowStats(true)}
            className="group glass-panel px-10 py-6 rounded-[32px] border-white/5 flex items-center gap-6 hover:border-blue-500/20 transition-all bg-gradient-to-r from-blue-600/10 to-transparent flex-1"
          >
            <div className="w-14 h-14 bg-blue-600/20 rounded-2xl flex items-center justify-center border border-blue-500/30 group-hover:scale-110 transition-transform">
              <BarChart2 size={28} className="text-blue-500" />
            </div>
            <div className="text-left">
              <h3 className="text-xl font-black text-white italic uppercase tracking-tighter">ВАША СТАТИСТИКА</h3>
              <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest mt-1">ОТКРЫТЬ ПОДРОБНУЮ АНАЛИТИКУ КОМАНДЫ</p>
            </div>
            <ChevronRight size={24} className="ml-auto text-zinc-700 group-hover:text-white transition-colors" />
          </button>

          <button 
            onClick={() => setShowHistory(!showHistory)}
            className="px-6 py-6 glass-panel rounded-[32px] border-white/5 hover:border-purple-500/40 transition-all group active:scale-95 bg-white/5 flex flex-col items-center justify-center gap-1"
          >
             <Activity size={20} className="text-purple-500" />
             <span className="text-[8px] font-black text-white uppercase">HISTORY</span>
          </button>

          <button 
            onClick={startVeto}
            className="hidden md:flex flex-col items-center justify-center gap-2 px-8 py-6 glass-panel rounded-[32px] border-white/5 hover:border-blue-500/40 transition-all group active:scale-95 bg-white/5"
          >
             <Shield size={20} className="text-blue-500 group-hover:animate-pulse" />
             <span className="text-[9px] font-black text-white tracking-widest uppercase">MAP VETO</span>
          </button>
        </div>

        {isAdmin && (
          <div className="flex items-center gap-4 shrink-0">
             <button 
               onClick={() => setShowAddBet(true)}
               className="px-6 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all h-full"
             >
               СОЗДАТЬ СТАВКУ
             </button>
             <button 
               onClick={() => setShowManageMaps(true)}
               className="px-6 py-4 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all h-full"
             >
               УПРАВЛЕНИЕ КАРТАМИ
             </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* MAIN CONTENT: BETS */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          <div className="flex items-center justify-between">
             <div className="flex items-center gap-4">
               <div className="w-10 h-10 bg-red-600/10 rounded-xl flex items-center justify-center border border-red-500/20">
                 <Target size={20} className="text-red-500" />
               </div>
               <h2 className="text-2xl font-black text-white italic uppercase tracking-tighter">СТАВКИ И ПРОГНОЗЫ</h2>
             </div>
             
             <div className="flex items-center gap-2">
                <button 
                  disabled={currentPage === 0}
                  onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))}
                  className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white/10 transition-all"
                >
                  <ChevronLeft size={20} />
                </button>
                <div className="px-4 text-[10px] font-black text-zinc-500 uppercase tracking-widest">
                   {currentPage + 1} / {totalPages}
                </div>
                <button 
                  disabled={currentPage >= totalPages - 1}
                  onClick={() => setCurrentPage(prev => Math.min(totalPages - 1, prev + 1))}
                  className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white/10 transition-all"
                >
                  <ChevronRight size={20} />
                </button>
             </div>
          </div>

          <div className="flex flex-col gap-4 min-h-[380px]">
            {bets.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-10 glass-panel rounded-[40px] border-white/5 border-dashed">
                <div className="w-20 h-20 bg-zinc-900/50 rounded-3xl flex items-center justify-center mb-6 text-zinc-700">
                  <Target size={40} />
                </div>
                <h3 className="text-xl font-black text-zinc-500 uppercase tracking-widest italic">МАТЧЕЙ ПОКА ЧТО НЕТУ</h3>
                <p className="text-[10px] text-zinc-600 mt-4 max-w-xs uppercase font-bold tracking-widest">Администратор еще не добавил актуальные события.</p>
              </div>
            ) : (
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentPage}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="flex flex-col gap-4"
                >
                  {currentBets.map((bet: any) => (
                    <div 
                      key={bet.id} 
                      onClick={() => {
                        setShowBetModal(bet);
                        setSelectedTeam(null);
                        setBetAmount("");
                      }}
                      className="relative overflow-hidden group cursor-pointer active:scale-[0.98] transition-all"
                    >
                      <div className="glass-panel p-0 rounded-3xl border-white/5 hover:border-blue-500/20 transition-all flex items-center bg-gradient-to-r from-white/[0.02] to-transparent">
                        <div className="flex-1 flex items-center py-6 px-8 relative border-l-2 border-blue-500/50">
                          <div className="w-16 h-16 bg-zinc-900/50 rounded-2xl overflow-hidden mr-6 border border-white/5">
                            <img src={`https://api.dicebear.com/7.x/identicon/svg?seed=teamA${bet.id}`} className="w-full h-full opacity-60 grayscale" alt="" />
                          </div>
                          <div className="text-left">
                            <span className="block text-lg font-black text-white uppercase italic tracking-tighter leading-none">{bet.teamA}</span>
                            <span className="text-[10px] font-bold text-zinc-500">HOMETEAM</span>
                          </div>
                          {userBets[bet.id]?.team === bet.teamA && (
                            <div className="absolute top-2 right-2 px-2 py-0.5 bg-blue-600 rounded text-[8px] font-black text-white">ВАША СТАВКА</div>
                          )}
                        </div>

                        <div className="flex flex-col items-center justify-center gap-3 px-10 border-x border-white/5 shrink-0">
                          <div className="flex items-center gap-4">
                             <div className="px-8 py-4 bg-blue-600 rounded-2xl font-black text-2xl text-white shadow-[0_0_20px_rgba(37,99,235,0.3)]">
                               {bet.ratioA}
                             </div>
                             <span className="text-sm font-black text-zinc-600 italic">VS</span>
                             <div className="px-8 py-4 bg-white/5 border border-white/10 rounded-2xl font-black text-2xl text-white">
                               {bet.ratioB}
                             </div>
                          </div>
                        </div>

                        <div className="flex-1 flex items-center py-6 px-8 justify-end relative border-r-2 border-purple-500/50">
                          {userBets[bet.id]?.team === bet.teamB && (
                            <div className="absolute top-2 left-2 px-2 py-0.5 bg-purple-600 rounded text-[8px] font-black text-white">ВАША СТАВКА</div>
                          )}
                          <div className="text-right">
                            <span className="block text-lg font-black text-white uppercase italic tracking-tighter leading-none">{bet.teamB}</span>
                            <span className="text-[10px] font-bold text-zinc-500">VISITOR</span>
                          </div>
                          <div className="w-16 h-16 bg-zinc-900/50 rounded-2xl overflow-hidden ml-6 border border-white/5">
                             <img src={`https://api.dicebear.com/7.x/identicon/svg?seed=teamB${bet.id}`} className="w-full h-full opacity-60 grayscale" alt="" />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </motion.div>
              </AnimatePresence>
            )}
          </div>
        </div>

        {/* SIDEBAR: NEXT OPPONENT */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          <div className="glass-panel p-8 rounded-[40px] border-white/5 relative overflow-hidden bg-gradient-to-b from-blue-900/10 to-transparent">
             <div className="absolute top-0 right-0 p-8 opacity-5">
               <Shield size={160} />
             </div>
             
             <h3 className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.3em] mb-8 flex items-center gap-2">
               <span className="text-blue-500">//</span> NEXT OPPONENT
             </h3>
             
             <div className="flex flex-col items-center gap-4 mb-8">
                <div className="w-24 h-24 rounded-full p-1.5 bg-gradient-to-br from-blue-500 via-purple-500 to-transparent shadow-[0_0_50px_rgba(37,99,235,0.2)]">
                   <div className="w-full h-full bg-[#050a14] rounded-full flex items-center justify-center border border-white/10 overflow-hidden">
                     <img src={opponent.logo} className="w-14 h-14 object-contain" alt="Opponent" />
                   </div>
                </div>
                <h2 className="text-xl font-black text-white italic tracking-tighter uppercase">{opponent.name}</h2>
                <div className="px-4 py-1 bg-white/5 border border-white/10 rounded-full text-[9px] font-black text-zinc-400 tracking-widest uppercase">
                  #12 WORLD RANKING
                </div>
             </div>

             <div className="space-y-6">
                <div>
                  <h4 className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-4 border-b border-white/5 pb-2 italic text-center">STRATEGIC MAPS</h4>
                  <div className="grid grid-cols-3 gap-2">
                    {maps.map((map, i) => (
                      <button 
                        key={map.id || `side-map-${i}`}
                        onClick={() => setSelectedMapStats({
                          name: map.name,
                          winRate: 65 + Math.floor(Math.random() * 20),
                          oppWinRate: 30 + Math.floor(Math.random() * 30)
                        })}
                        className="group relative flex flex-col gap-1.5 p-1 glass-panel rounded-lg border-white/5 hover:border-blue-500/50 transition-all active:scale-95"
                      >
                        <div className="aspect-square w-full rounded-md overflow-hidden border border-white/5 shrink-0 bg-zinc-900">
                          <img src={map.image} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all" alt={map.name} />
                        </div>
                        <span className="text-[6px] font-black text-zinc-500 uppercase tracking-[0.2em] truncate w-full text-center leading-none italic">{map.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
             </div>
          </div>
          
          <button 
            onClick={onBack}
            className="w-full py-5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-[24px] text-[10px] font-black text-white uppercase tracking-[0.3em] transition-all hover:border-white/20 active:scale-95 flex items-center justify-center gap-4"
          >
            ВЕРНУТЬСЯ НА БАЗУ
          </button>
        </div>
      </div>

      {/* MODALS */}
      <AnimatePresence>
        {showBetModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm">
            <div className="absolute inset-0" onClick={() => setShowBetModal(null)} />
             <motion.div 
               initial={{ scale: 0.9, opacity: 0 }}
               animate={{ scale: 1, opacity: 1 }}
               exit={{ scale: 0.9, opacity: 0 }}
               className="glass-panel p-10 rounded-[40px] border-white/10 w-full max-w-lg relative pointer-events-auto"
             >
                <h3 className="text-2xl font-black text-white italic uppercase mb-8 flex items-center justify-between">
                  <span>{userBets[showBetModal.id] ? "ВАША СТАВКА ПРИНЯТА" : "СДЕЛАТЬ СТАВКУ"}</span>
                  <button onClick={() => setShowBetModal(null)} className="text-zinc-500 hover:text-white"><X size={24} /></button>
                </h3>
                
                {userBets[showBetModal.id] ? (
                  <div className="space-y-6 text-center">
                     <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest block mb-2">ВЫ ПОСТАВИЛИ НА</span>
                     <h4 className="text-3xl font-black text-white italic uppercase mb-4">{userBets[showBetModal.id].team}</h4>
                     <div className="p-8 bg-blue-600/10 border border-blue-500/20 rounded-3xl">
                        <span className="block text-[8px] font-bold text-zinc-500 uppercase">ПОТЕНЦИАЛЬНЫЙ ВЫИГРЫШ</span>
                        <span className="text-4xl font-black text-green-500 italic">${(userBets[showBetModal.id].amount * parseFloat(userBets[showBetModal.id].ratio)).toFixed(0)}</span>
                     </div>
                     <button onClick={() => setShowBetModal(null)} className="w-full py-5 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black text-white uppercase">ЗАКРЫТЬ</button>
                  </div>
                ) : (
                  <>
                    <div className="grid grid-cols-2 gap-4 mb-8">
                      <button onClick={() => setSelectedTeam(showBetModal.teamA)} className={`p-6 glass-panel rounded-3xl border transition-all ${selectedTeam === showBetModal.teamA ? 'border-blue-500 bg-blue-600/10' : 'border-white/5'}`}>
                          <span className="text-sm font-black text-white uppercase italic">{showBetModal.teamA}</span>
                      </button>
                      <button onClick={() => setSelectedTeam(showBetModal.teamB)} className={`p-6 glass-panel rounded-3xl border transition-all ${selectedTeam === showBetModal.teamB ? 'border-purple-500 bg-purple-600/10' : 'border-white/5'}`}>
                          <span className="text-sm font-black text-white uppercase italic">{showBetModal.teamB}</span>
                      </button>
                    </div>
                    <input type="number" value={betAmount} onChange={(e) => setBetAmount(e.target.value)} placeholder="0.00" className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-xl font-black text-white outline-none mb-6" />
                    <button 
                      disabled={!selectedTeam || !betAmount || parseInt(betAmount) <= 0 || parseInt(betAmount) > balance} 
                      onClick={() => {
                        const amount = parseInt(betAmount);
                        setBalance((prev: number) => prev - amount);
                        setUserBets((prev: any) => ({ ...prev, [showBetModal.id]: { team: selectedTeam!, amount, ratio: selectedTeam === showBetModal.teamA ? showBetModal.ratioA : showBetModal.ratioB, status: 'pending' } }));
                        setShowBetModal(null);
                      }}
                      className="w-full py-5 bg-blue-600 rounded-2xl text-white font-black uppercase tracking-widest shadow-[0_0_30px_rgba(37,99,235,0.3)] active:scale-95 transition-all"
                    >
                      {parseInt(betAmount) > balance ? 'НЕДОСТАТОЧНО СРЕДСТВ' : 'ПОДТВЕРДИТЬ'}
                    </button>
                  </>
                )}
             </motion.div>
          </div>
        )}

        {resolvingMatch && (
         <div className="fixed inset-0 z-[120] flex items-center justify-center p-6 bg-black/90 pointer-events-auto">
           <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="glass-panel p-10 rounded-[40px] border-white/10 w-full max-w-lg text-center">
              <h3 className="text-xl font-black text-white italic mb-8 uppercase">ВЫБЕРИТЕ ПОБЕДИТЕЛЯ</h3>
              <div className="grid grid-cols-2 gap-4">
                 <button onClick={() => resolveMatch(resolvingMatch.id, 'A')} className="p-8 glass-panel rounded-3xl border-blue-500/20 hover:bg-blue-600/10 transition-all font-black text-white italic">{resolvingMatch.teamA}</button>
                 <button onClick={() => resolveMatch(resolvingMatch.id, 'B')} className="p-8 glass-panel rounded-3xl border-purple-500/20 hover:bg-purple-600/10 transition-all font-black text-white italic">{resolvingMatch.teamB}</button>
              </div>
              <button onClick={() => setResolvingMatch(null)} className="mt-10 px-8 py-3 bg-white/5 text-[10px] font-black text-zinc-500 uppercase rounded-xl">ОТМЕНА</button>
           </motion.div>
         </div>
        )}

        {showHistory && (
         <div className="fixed inset-0 z-[110] flex items-center justify-center p-6 bg-black/90 pointer-events-auto">
            <div className="absolute inset-0" onClick={() => setShowHistory(false)} />
            <motion.div initial={{ x: 300, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="glass-panel p-8 rounded-[40px] border-white/10 w-full max-w-md h-[80vh] flex flex-col">
               <div className="flex items-center justify-between mb-8">
                  <h3 className="text-xl font-black text-white italic uppercase">BET HISTORY</h3>
                  <button onClick={() => setShowHistory(false)} className="text-zinc-500 hover:text-white"><X size={20} /></button>
               </div>
               <div className="flex-1 overflow-y-auto space-y-4">
                  {Object.entries(userBets).length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center opacity-20"><span className="text-[10px] font-black text-white uppercase italic">NO HISTORY</span></div>
                  ) : (
                    Object.entries(userBets).reverse().map(([id, bet]: [any, any]) => (
                      <div key={id} className={`p-4 rounded-2xl border ${bet.status === 'won' ? 'bg-green-600/10 border-green-500/20' : bet.status === 'lost' ? 'bg-red-600/10 border-red-500/20' : 'bg-white/5 border-white/10'}`}>
                         <div className="flex items-center justify-between font-black text-white italic uppercase text-xs mb-2"><span>{bet.team}</span><span className={bet.status === 'won' ? 'text-green-500' : bet.status === 'lost' ? 'text-red-500' : 'text-zinc-500'}>{bet.status}</span></div>
                         <div className="flex justify-between items-end"><span className="text-sm font-black text-white">${bet.amount}</span><span className={`text-sm font-black ${bet.status === 'won' ? 'text-green-500' : 'text-zinc-400'}`}>{bet.status === 'won' ? `+$${Math.floor(bet.amount * parseFloat(bet.ratio))}` : '...'}</span></div>
                      </div>
                    ))
                  )}
               </div>
            </motion.div>
         </div>
        )}
      </AnimatePresence>

      {/* ADMIN MODALS */}
      {showAddBet && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm">
           <motion.div 
             initial={{ scale: 0.9, opacity: 0 }}
             animate={{ scale: 1, opacity: 1 }}
             className="glass-panel p-8 rounded-[40px] border-white/10 w-full max-lg"
           >
              <h3 className="text-xl font-black text-white italic uppercase tracking-tighter mb-6">НОВАЯ СТАВКА</h3>
              <form onSubmit={(e: any) => {
                e.preventDefault();
                const formData = new FormData(e.target);
                const newBet = {
                  id: Date.now(),
                  teamA: formData.get("teamA"),
                  teamB: formData.get("teamB"),
                  ratioA: formData.get("ratioA"),
                  ratioB: formData.get("ratioB"),
                  color: "blue"
                };
                setBets([newBet, ...bets]);
                setShowAddBet(false);
              }} className="space-y-4">
                 <div className="grid grid-cols-2 gap-4">
                   <input name="teamA" placeholder="КОМАНДА A" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs text-white" required />
                   <input name="teamB" placeholder="КОМАНДА B" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs text-white" required />
                 </div>
                 <div className="grid grid-cols-2 gap-4">
                   <input name="ratioA" placeholder="КЭФ A (н-р: 1.85)" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs text-white" required />
                   <input name="ratioB" placeholder="КЭФ B (н-р: 2.10)" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs text-white" required />
                 </div>
                 
                 <div className="flex gap-4 pt-4">
                    <button type="button" onClick={() => setShowAddBet(false)} className="flex-1 py-3 text-[10px] font-black text-zinc-500 uppercase tracking-widest">ОТМЕНА</button>
                    <button type="submit" className="flex-1 py-3 bg-blue-600 text-white rounded-xl font-black text-[10px] uppercase tracking-widest">СОЗДАТЬ</button>
                 </div>
              </form>
           </motion.div>
        </div>
      )}

      {showManageMaps && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm">
           <motion.div 
             initial={{ scale: 0.9, opacity: 0 }}
             animate={{ scale: 1, opacity: 1 }}
             className="glass-panel p-8 rounded-[40px] border-white/10 w-full max-w-2xl max-h-[80vh] overflow-y-auto"
           >
              <h3 className="text-xl font-black text-white italic uppercase tracking-tighter mb-6 flex items-center justify-between">
                <span>УПРАВЛЕНИЕ КАРТАМИ</span>
                <button onClick={() => setShowManageMaps(false)} className="text-zinc-500 hover:text-white"><X size={24} /></button>
              </h3>
              
              <div className="space-y-6 mb-8">
                {maps.map((map, i) => (
                  <div key={i} className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl border border-white/10">
                    <div className="w-16 h-10 rounded-lg overflow-hidden border border-white/10">
                      <img src={map.image} className="w-full h-full object-cover" alt="" />
                    </div>
                    <div className="flex-1">
                      <span className="block text-[10px] font-black text-white tracking-widest">{map.name}</span>
                    </div>
                    <button 
                      onClick={() => setAnalyticsMaps(maps.filter((_, idx) => idx !== i))}
                      className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition-all"
                    >
                      <Trash size={16} />
                    </button>
                  </div>
                ))}
              </div>

              <div className="border-t border-white/10 pt-6">
                <h4 className="text-xs font-black text-zinc-500 uppercase tracking-widest mb-6 border-b border-white/5 pb-2">ДОБАВИТЬ НОВУЮ КАРТУ</h4>
                
                <div className="flex flex-col gap-6">
                   <div className="flex items-center gap-6">
                      <div 
                        onClick={() => fileInputRef.current?.click()}
                        className="w-32 h-20 bg-white/5 border-2 border-dashed border-white/10 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:border-blue-500 group transition-all"
                      >
                         {tempMapImage ? (
                           <img src={tempMapImage} className="w-full h-full object-cover rounded-[14px]" alt="Preview" />
                         ) : (
                           <>
                             <Upload size={20} className="text-zinc-600 group-hover:text-blue-500 mb-1" />
                             <span className="text-[8px] font-black text-zinc-600 group-hover:text-blue-500 uppercase">ВЫБРАТЬ</span>
                           </>
                         )}
                      </div>
                      <input 
                        type="file" 
                        ref={fileInputRef} 
                        onChange={handleImageUpload} 
                        accept="image/*" 
                        className="hidden" 
                      />
                      <div className="flex-1 space-y-4">
                         <input 
                           id="new-map-name"
                           placeholder="НАЗВАНИЕ КАРТЫ" 
                           className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs text-white uppercase font-black" 
                         />
                         <button 
                           onClick={() => {
                             const nameInput = document.getElementById('new-map-name') as HTMLInputElement;
                             if (nameInput.value && tempMapImage) {
                               setAnalyticsMaps([...maps, { id: nameInput.value.toLowerCase().replace(/\s+/g, ""), name: nameInput.value.toUpperCase(), image: tempMapImage }]);
                               nameInput.value = "";
                               setTempMapImage("");
                             } else {
                               alert("Укажите название и выберите фото");
                             }
                           }}
                           className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-black text-[10px] uppercase tracking-widest"
                         >
                           ДОБАВИТЬ КАРТУ
                         </button>
                      </div>
                   </div>
                </div>
              </div>

              <div className="flex justify-center pt-8">
                 <button onClick={() => setShowManageMaps(false)} className="px-10 py-3 bg-white/5 rounded-xl text-[10px] font-black text-white uppercase tracking-widest">ЗАКРЫТЬ</button>
              </div>
           </motion.div>
        </div>
      )}
    </motion.div>
  );
};

const EventRow = ({
  date,
  month,
  icon: Icon,
  title,
  opponent,
  time,
  tz,
}: any) => (
  <div className="flex items-center gap-4 p-3 rounded-lg hover:bg-white/[0.03] transition-all cursor-pointer group">
    <div className="flex flex-col items-center min-w-[32px] text-zinc-600 group-hover:text-blue-400 transition-colors">
      <span className="text-base font-black leading-none">{date}</span>
      <span className="text-[8px] font-bold uppercase tracking-widest">
        {month}
      </span>
    </div>
    <div className="w-10 h-10 glass-card rounded-md flex items-center justify-center shrink-0 group-hover:border-blue-500/20 transition-all">
      <Icon size={16} className="text-zinc-400 group-hover:text-blue-500" />
    </div>
    <div className="flex-1 min-w-0">
      <h4 className="text-xs font-bold text-white group-hover:text-blue-100">
        {title}
      </h4>
      <p className="text-[10px] text-zinc-500 truncate">Против: {opponent}</p>
    </div>
    <div className="text-right">
      <p className="text-xs font-bold text-white">{time}</p>
      <p className="text-[9px] text-zinc-700 font-bold">{tz}</p>
    </div>
  </div>
);

// --- Main Page ---

export default function App() {
  const [activeTab, setActiveTab] = useState("lobby");
  const [isAdmin, setIsAdmin] = useState(true); 
  const [roleMultipliers, setRoleMultipliers] = useState<any>({
    S2: [
      { name: 'Support', kill: 0.9, skill: 1.1, impact: 1.2 },
      { name: 'Rifler', kill: 1.2, skill: 0.9, impact: 1.1 },
      { name: 'Sniper', kill: 1.3, skill: 1.2, impact: 0.8 },
      { name: 'Captain', kill: 1.0, skill: 1.3, impact: 1.5 },
    ]
  });
  const [rankingTeams, setRankingTeams] = useState<any>({
    S2: [
      { name: 'HORIZON', rp: 1250 },
      { name: 'SAINTS', rp: 1180 },
      { name: 'REVENGE', rp: 1100 },
    ]
  });
  const [maintenance, setMaintenance] = useState({
    enabled: false,
    until: "",
    reason: ""
  });
  const [cloudKeys, setCloudKeys] = useState({
    accessKey: localStorage.getItem('firebase_project_key') || "",
    binId: localStorage.getItem('firebase_db_url') || ""
  });
  const [geminiKey, setGeminiKey] = useState(localStorage.getItem('gemini_api_key') || "");
  const [simConfig, setSimConfig] = useState<any>(null);

  React.useEffect(() => {
    fetch('/api/simulation/config')
      .then(res => res.json())
      .then(data => setSimConfig(data))
      .catch(err => console.error("Error fetching simulation config", err));
  }, []);

  const [matchHistory, setMatchHistory] = useState<any[]>(() => {
    const saved = localStorage.getItem('match_history');
    return saved ? JSON.parse(saved) : [];
  });
  const [players, setPlayers] = useState<any[]>(() => {
    const saved = localStorage.getItem('players_base');
    return saved ? JSON.parse(saved) : [];
  });
  const [team, setTeam] = useState<any[]>(() => {
    const saved = localStorage.getItem('user_team');
    return saved ? JSON.parse(saved) : [];
  });
  const [staff, setStaff] = useState<any[]>(() => {
    const saved = localStorage.getItem('user_staff');
    return saved ? JSON.parse(saved) : [];
  });
  const [marketTab, setMarketTab] = useState("players");
  const [activeFormatTab, setActiveFormatTab] = useState<'bo1' | 'bo2' | 'bo3' | 'bo5'>('bo1');
  const [matchFormat, setMatchFormat] = useState<'bo1' | 'bo2' | 'bo3' | 'bo5'>('bo1');
  const [bench, setBench] = useState<any[]>(() => {
    const saved = localStorage.getItem('user_bench');
    return saved ? JSON.parse(saved) : [];
  });
  const [bootcamp, setBootcamp] = useState(() => {
    const saved = localStorage.getItem('user_bootcamp');
    return saved ? JSON.parse(saved) : { tier: null, label: 'Нет', price: 0, bonus: { ratingBoost: 0, synergy: 0 }, purchasedAt: null };
  });
  const [trainingAttribute, setTrainingAttribute] = useState<'aim' | 'iq' | 'movement' | 'special'>('aim');
  const [teamPanel, setTeamPanel] = useState<'overview' | 'training' | 'bootcamp'>('overview');
  const [firingStaffRole, setFiringStaffRole] = useState<string | null>(null);
  const [autoPickSettings, setAutoPickSettings] = useState(() => {
    const saved = localStorage.getItem('auto_pick_settings');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return {
          enabled: parsed.enabled ?? false,
          bo1: parsed.bo1 || { preferred: parsed.preferred || 'sandstone', banned: parsed.banned || 'province' },
          bo2: parsed.bo2 || { preferred: parsed.bo2?.preferred || 'rust', banned: parsed.bo2?.banned || 'breeze' },
          bo3: parsed.bo3 || { preferred: parsed.bo3?.preferred || 'rust', banned: parsed.bo3?.banned || 'breeze' },
          bo5: parsed.bo5 || { preferred: parsed.bo5?.preferred || 'zone9', banned: parsed.bo5?.banned || 'sandstone' }
        };
      } catch {
        // ignore
      }
    }
    return {
      enabled: false,
      bo1: { preferred: 'sandstone', banned: 'province' },
      bo2: { preferred: 'rust', banned: 'breeze' },
      bo3: { preferred: 'rust', banned: 'breeze' },
      bo5: { preferred: 'zone9', banned: 'sandstone' }
    };
  });
  const [balance, setBalance] = useState(() => {
    const saved = localStorage.getItem('user_balance');
    return saved ? parseInt(saved) : 2450500;
  });

  const saveToLocal = (key: string, data: any) => {
    localStorage.setItem(key, JSON.stringify(data));
  };

  const syncToCloud = async () => {
    if (!cloudKeys.accessKey || !cloudKeys.binId) {
      alert("Please configure Firebase keys first!");
      return;
    }
    try {
      const data = {
        players,
        team,
        balance,
        roleMultipliers,
        rankingTeams,
        matchHistory
      };
      // In a real app we'd use Firebase SDK here, but for now we keep the same logic with new labels
      const response = await fetch(`https://api.jsonbin.io/v3/b/${cloudKeys.binId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'X-Master-Key': cloudKeys.accessKey
        },
        body: JSON.stringify(data)
      });
      if (response.ok) alert("Data pushed to cloud successfully!");
      else alert("Cloud push failed.");
    } catch (err) {
      console.error(err);
      alert("Error syncing to cloud.");
    }
  };

  const pullFromCloud = async () => {
    if (!cloudKeys.accessKey || !cloudKeys.binId) {
      alert("Please configure Firebase keys first!");
      return;
    }
    try {
      const response = await fetch(`https://api.jsonbin.io/v3/b/${cloudKeys.binId}/latest`, {
        headers: {
          'X-Master-Key': cloudKeys.accessKey
        }
      });
      const result = await response.json();
      const data = result.record;
      if (data) {
        if (data.players) setPlayers(data.players);
        if (data.team) setTeam(data.team);
        if (data.balance) setBalance(data.balance);
        if (data.roleMultipliers) setRoleMultipliers(data.roleMultipliers);
        if (data.rankingTeams) setRankingTeams(data.rankingTeams);
        if (data.matchHistory) setMatchHistory(data.matchHistory);
        alert("Data pulled from cloud successfully!");
      }
    } catch (err) {
      console.error(err);
      alert("Error pulling from cloud.");
    }
  };

  const clearMatchHistory = () => {
    setMatchHistory([]);
    localStorage.removeItem('match_history');
  };

  const generateAIReport = async (match: any) => {
    try {
      const prompt = `Analyze this eSports match: Our Team (score: ${match.scoreA}) vs ${match.opponentName} (score: ${match.scoreB}). The match result was a ${match.result}. Give a short tactical review in a professional and dramatic tone. Keep it under 100 words. Respond in Russian if possible.`;
      const response = await fetch('/api/gemini/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt })
      });
      const data = await response.json();
      if (data.error) throw new Error(data.error);
      alert("AI REPORT:\n\n" + data.text);
    } catch (err: any) {
      console.error(err);
      alert("Ошибка AI: " + (err.message || "Не удалось связаться с Gemini"));
    }
  };

  const [trainingPlayer, setTrainingPlayer] = useState<any | null>(null);
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [isSimulating, setIsSimulating] = useState<any>(null);
  const [matchResult, setMatchResult] = useState<any>(null);
  const [selectedMatchForMap, setSelectedMatchForMap] = useState<any>(null);

  const LOCAL_MAP_WIN_RATES: Record<string, { you: number; enemy: number }> = {
    breeze: { you: 58, enemy: 42 },
    rust: { you: 45, enemy: 55 },
    province: { you: 62, enemy: 38 },
    prison: { you: 50, enemy: 50 },
    hanami: { you: 55, enemy: 45 },
    sandstone: { you: 40, enemy: 60 },
    dune: { you: 52, enemy: 48 }
  };

  const maps = [
    { id: 'breeze', name: 'Breeze', image: new URL('../images/maps/breeze.jpg', import.meta.url).href },
    { id: 'rust', name: 'Rust', image: new URL('../images/maps/rust.jpg', import.meta.url).href },
    { id: 'province', name: 'Province', image: new URL('../images/maps/province.jpg', import.meta.url).href },
    { id: 'prison', name: 'Prison', image: new URL('../images/maps/prison.jpg', import.meta.url).href },
    { id: 'hanami', name: 'Hanami', image: new URL('../images/maps/hanami.jpg', import.meta.url).href },
    { id: 'sandstone', name: 'Sandstone', image: new URL('../images/maps/sandstone.jpg', import.meta.url).href },
    { id: 'dune', name: 'Dune', image: new URL('../images/maps/dune.jpg', import.meta.url).href }
  ];

  const [bets, setBets] = useState<any[]>([]);
  const [userBets, setUserBets] = useState<Record<number, { team: string, amount: number, ratio: string, status: 'pending' | 'won' | 'lost' }>>({});
  const [resolvingMatch, setResolvingMatch] = useState<any>(null);

  const resolveMatch = (matchOrId: any, winner: 'A' | 'B', simulatedScore?: any) => {
    const match = typeof matchOrId === 'object' ? matchOrId : bets.find((b: any) => b.id === matchOrId);
    if (!match) return;

    const winningTeamName = winner === 'A' ? match.teamA : match.teamB;
    const bet = userBets[match.id];

    // Record History
    const scoreA = simulatedScore ? simulatedScore.a : (winner === 'A' ? 16 : Math.floor(Math.random() * 14));
    const scoreB = simulatedScore ? simulatedScore.b : (winner === 'B' ? 16 : Math.floor(Math.random() * 14));

    setMatchHistory((prev: any[]) => {
      const newMatch = {
        id: Date.now(),
        date: new Date().toISOString(),
        opponentName: match.teamB,
        opponentLogo: `https://api.dicebear.com/7.x/identicon/svg?seed=${match.teamB}`,
        scoreA,
        scoreB,
        result: (winner === 'A') ? 'WIN' : 'LOSS',
        playerStats: simulatedScore?.players,
        opponentPlayerStats: simulatedScore?.opponentPlayers,
        mapTitle: simulatedScore?.mapTitle,
        mapImage: simulatedScore?.mapImage
      };
      setMatchResult(newMatch);
      return [newMatch, ...prev];
    });

    if (bet && bet.status === 'pending') {
      const isWin = bet.team === winningTeamName;
      if (isWin) {
        const winAmount = Math.floor(bet.amount * parseFloat(bet.ratio));
        setBalance((prev: number) => prev + winAmount);
        setUserBets((prev: any) => ({
          ...prev,
          [match.id]: { ...prev[match.id], status: 'won' }
        }));
      } else {
        setUserBets((prev: any) => ({
          ...prev,
          [match.id]: { ...prev[match.id], status: 'lost' }
        }));
      }
    }

    setBets((prev: any[]) => prev.filter((b: any) => b.id !== match.id));
    setResolvingMatch(null);

    // Reset daily player trainings when match is completed/played
    setTeam(prevTeam => prevTeam.map(p => ({ ...p, trainingsToday: 0 })));
  };

  const simulateMatch = (match: any) => {
    const activeFormat = matchFormat || 'bo1';
    const matchWithFormat = { ...match, format: activeFormat };
    setSelectedMatchForMap(matchWithFormat);
  };

  const handleStartSimulation = async (match: any, map: any, predefinedPool?: any[]) => {
    setSelectedMatchForMap(null);
    const format = match.format || 'bo1';
    const numWinsRequired = format === 'bo5' ? 3 : (format === 'bo3' || format === 'bo2' ? 2 : 1);
    const maxMaps = format === 'bo5' ? 5 : (format === 'bo3' || format === 'bo2' ? 3 : 1);

    const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

    setIsSimulating({
      match,
      stage: `ИНИЦИАЛИЗАЦИЯ СЕРИИ ${format.toUpperCase()}...`,
      progress: 5
    });
    
    await sleep(600);

    let ourWins = 0;
    let enemyWins = 0;
    let mapIndex = 1;
    const resultsList: any[] = [];
    
    // Choose which maps to play during BO3/BO5.
    // Try to include the selected/preferred map first, and populate other maps without repeats.
    let selectedMapsPool = predefinedPool && predefinedPool.length > 0 ? [...predefinedPool] : [map];
    if (selectedMapsPool.length < maxMaps) {
      maps.forEach(m => {
        if (!selectedMapsPool.some(sm => sm.id === m.id) && selectedMapsPool.length < maxMaps) {
          selectedMapsPool.push(m);
        }
      });
    }

    try {
      while (ourWins < numWinsRequired && enemyWins < numWinsRequired && mapIndex <= maxMaps) {
        const currentMap = selectedMapsPool[mapIndex - 1] || maps[0];
        
        setIsSimulating((prev: any) => ({
          ...prev,
          stage: `КАРТА ${mapIndex} (${currentMap.name.toUpperCase()}): СИМУЛЯЦИЯ РАУНДОВ...`,
          progress: Math.floor(10 + (mapIndex / maxMaps) * 70)
        }));

        const sanitizedTeam = team.map((player: any) => ({
          id: player.id,
          nickname: player.nickname,
          role: player.role,
          rating: player.rating,
          avatarSeed: player.avatarSeed
        }));

        const simResult = simulateLocalMatchMap(match, currentMap, team);
        resultsList.push({
          mapName: currentMap.name,
          scoreA: simResult.a,
          scoreB: simResult.b,
          simResult
        });

        if (simResult.a > simResult.b) {
          ourWins++;
        } else {
          enemyWins++;
        }

        await sleep(800);
        mapIndex++;
      }

      setIsSimulating((prev: any) => ({ ...prev, stage: 'ЗАВЕРШЕНИЕ СИМУЛЯЦИИ...', progress: 95 }));
      await sleep(500);

      // Determine the winner of the series:
      const seriesWinner = ourWins > enemyWins ? 'A' : 'B';

      // Compile series results:
      // For BO1: raw rounds score (e.g. 13-11).
      // For BO3/BO5: series map score (e.g. 2-1 or 3-2).
      const finalScoreA = format === 'bo1' ? (resultsList[0]?.scoreA || 13) : ourWins;
      const finalScoreB = format === 'bo1' ? (resultsList[0]?.scoreB || 11) : enemyWins;

      // Create aggregated dynamic player stats from all maps played
      const aggregatedPlayers = team.map((p: any) => ({
        id: p.id,
        nickname: p.nickname,
        role: p.role,
        avatarSeed: p.avatarSeed,
        kills: 0,
        deaths: 0,
        assists: 0,
        rating: 0
      }));

      resultsList.forEach((r) => {
        const mapPlayers = r.simResult.players || [];
        aggregatedPlayers.forEach((aggP) => {
          const mapP = mapPlayers.find((p: any) => p.nickname === aggP.nickname || p.id === aggP.id);
          if (mapP) {
            aggP.kills += mapP.kills || 0;
            aggP.deaths += mapP.deaths || 0;
            aggP.assists += mapP.assists || 0;
          }
        });
      });

      // Calculate average ratings based on KDA sums
      aggregatedPlayers.forEach((p) => {
        const kda = (p.kills + p.assists) / Math.max(1, p.deaths);
        p.rating = parseFloat(Math.min(3.0, 0.5 + kda * 0.4).toFixed(2));
      });

      const seriesOverviewString = resultsList.map((r, i) => `Карта ${i + 1} (${r.mapName}): ${r.scoreA} - ${r.scoreB}`).join('\n');
      alert(`СЕРИЯ ЗАВЕРШЕНА (${format.toUpperCase()})!\nИтоговый счет серии: ${ourWins} - ${enemyWins}\n\nПодробная статистика по картам:\n${seriesOverviewString}`);

      resolveMatch(match, seriesWinner, {
        a: finalScoreA,
        b: finalScoreB,
        players: aggregatedPlayers,
        opponentPlayers: resultsList[0]?.simResult.opponentPlayers, // visual fallback
        mapTitle: format === 'bo1' ? map.name : `Серия ${format.toUpperCase()} (${resultsList.map(r => r.mapName).join(', ')})`,
        mapImage: map.image
      });

    } catch (err: any) {
      console.error(err);
      alert("Ошибка при симуляции матча на сервере: " + err.message);
    } finally {
      setIsSimulating(null);
    }
  };

  const normalizeRating = (value: any) => {
    const numeric = typeof value === 'number' ? value : parseFloat(String(value));
    if (Number.isNaN(numeric) || numeric <= 0) return 50;
    return numeric > 0 && numeric <= 3 ? numeric * 100 : numeric;
  };

  const getBuyType = (money: number, round: number, lostLast: boolean) => {
    if (round === 1) return 'pistol';
    if (money < 1300) return 'eco';
    if (lostLast && money < 2100) return 'eco';
    if (money < 2600) return 'force';
    if (money < 3600) return 'half';
    return 'full';
  };

  const getTeamBuyCost = (buyType: string) => {
    const costs: Record<string, number> = { pistol: 0, eco: 500, force: 1800, half: 2500, full: 3500 };
    return (costs[buyType] || 0) * 5;
  };

  const BUY_POWER: Record<string, number> = { pistol: 0.78, eco: 0.66, force: 0.82, half: 0.90, full: 1.0 };

  const computeRoundWinChance = (params: any) => {
    const {
      ratingDiff,
      momentumDiff,
      buyDiff,
      streakPenalty,
      scoreDiff,
      mapBias,
      isOvertime
    } = params;

    const comebackEdge = -scoreDiff * (isOvertime ? 0.008 : 0.01);
    const base = 0.5 + ratingDiff * 0.95 + momentumDiff * 0.05 + buyDiff * 0.08 - streakPenalty * 0.6 + comebackEdge + (mapBias || 0);
    const randomPart = (Math.random() - 0.5) * 0.12;
    const result = 0.5 + (base - 0.5) + randomPart;
    return Math.max(isOvertime ? 0.28 : 0.30, Math.min(isOvertime ? 0.72 : 0.78, result));
  };

  const generateOpponentPlayers = () => {
    return Array.from({ length: 5 }, (_, index) => ({
      id: 1000 + index,
      nickname: `BOT_${index + 1}`,
      role: 'Player',
      avatarSeed: `bot_${index + 1}`,
      kills: 0,
      deaths: 0,
      assists: 0,
      rating: normalizeRating(70 + Math.random() * 30)
    }));
  };

  const simulateRoundStatsBalanced = (team1Wins: boolean, teamAStats: any[], teamBStats: any[]) => {
    const winnerStats = team1Wins ? teamAStats : teamBStats;
    const loserStats = team1Wins ? teamBStats : teamAStats;
    const winnerKills = 5;
    const loserKills = Math.floor(Math.random() * 5);

    for (let i = 0; i < winnerKills; i++) {
      const idx = Math.floor(Math.random() * winnerStats.length);
      winnerStats[idx].kills++;
      if (Math.random() < 0.3) winnerStats[(idx + 1) % winnerStats.length].assists++;
      const victim = loserStats[Math.floor(Math.random() * loserStats.length)];
      victim.deaths++;
    }

    for (let i = 0; i < loserKills; i++) {
      const idx = Math.floor(Math.random() * loserStats.length);
      loserStats[idx].kills++;
      const victim = winnerStats[Math.floor(Math.random() * winnerStats.length)];
      victim.deaths++;
    }

    return {
      winnerKills,
      loserKills
    };
  };

  const finalizeStats = (players: any[]) => {
    players.forEach((player) => {
      const totalRounds = player.kills + player.deaths || 1;
      player.kd = player.deaths > 0 ? parseFloat((player.kills / player.deaths).toFixed(2)) : parseFloat(player.kills.toFixed(2));
      player.rating = parseFloat(Math.min(3.0, Math.max(0.5, 0.7 + player.kills / 20 - player.deaths / 45)).toFixed(2));
      player.kpr = parseFloat((player.kills / Math.max(1, totalRounds)).toFixed(2));
      player.dpr = parseFloat((player.deaths / Math.max(1, totalRounds)).toFixed(2));
      player.adr = parseFloat((player.kills * 2.5 / Math.max(1, totalRounds)).toFixed(1));
    });
  };

  const simulateLocalMatchMap = (match: any, map: any, teamPlayers: any[]) => {
    const format = match.format || 'bo1';
    const roundTarget = format === 'bo1' ? 13 : 13;
    const maxRounds = 25;

    const bootcampBonus = bootcamp?.bonus?.ratingBoost || 0;
    const synergyBonus = bootcamp?.bonus?.synergy || 0;

    const teamAStats = teamPlayers.map((player: any) => ({
      id: player.id,
      nickname: player.nickname,
      role: player.role || 'Player',
      avatarSeed: player.avatarSeed || `player_${player.id}`,
      kills: 0,
      deaths: 0,
      assists: 0,
      rating: normalizeRating(player.rating) + bootcampBonus
    }));

    const teamBStats = generateOpponentPlayers();

    const teamAStrength = teamAStats.reduce((sum, p) => sum + p.rating, 0) / teamAStats.length;
    const teamBStrength = teamBStats.reduce((sum, p) => sum + p.rating, 0) / teamBStats.length;
    const totalStrength = teamAStrength + teamBStrength;
    const ratingDiff = totalStrength ? (teamAStrength - teamBStrength) / totalStrength : 0;
    const mapBias = ((LOCAL_MAP_WIN_RATES[map.id]?.you || 50) - 50) / 120 + synergyBonus;

    let scoreA = 0;
    let scoreB = 0;
    let t1Money = 4000;
    let t2Money = 4000;
    let t1LoseStreak = 0;
    let t2LoseStreak = 0;
    let t1Momentum = 0;
    let t2Momentum = 0;

    let round = 1;
    while (scoreA < roundTarget && scoreB < roundTarget && round <= maxRounds) {
      const t1Buy = getBuyType(Math.floor(t1Money / 5), round, t1LoseStreak > 0);
      const t2Buy = getBuyType(Math.floor(t2Money / 5), round, t2LoseStreak > 0);
      t1Money = Math.max(0, t1Money - getTeamBuyCost(t1Buy));
      t2Money = Math.max(0, t2Money - getTeamBuyCost(t2Buy));

      const streakPenalty = (t1LoseStreak >= 3 ? 0.05 : 0) - (t2LoseStreak >= 3 ? 0.05 : 0);
      const winChance = computeRoundWinChance({
        ratingDiff,
        momentumDiff: t1Momentum - t2Momentum,
        buyDiff: BUY_POWER[t1Buy] - BUY_POWER[t2Buy],
        streakPenalty,
        scoreDiff: scoreA - scoreB,
        mapBias,
        isOvertime: false
      });

      const team1Wins = Math.random() < winChance;
      if (team1Wins) {
        scoreA++;
        t1Money = Math.min(60000, t1Money + 3000 * 5);
        t2Money = Math.min(60000, t2Money + 1900 * 5);
        t1Momentum = Math.min(1, t1Momentum + 0.08);
        t2Momentum = Math.max(-1, t2Momentum - 0.08);
        t1LoseStreak = 0;
        t2LoseStreak++;
      } else {
        scoreB++;
        t2Money = Math.min(60000, t2Money + 3000 * 5);
        t1Money = Math.min(60000, t1Money + 1900 * 5);
        t2Momentum = Math.min(1, t2Momentum + 0.08);
        t1Momentum = Math.max(-1, t1Momentum - 0.08);
        t2LoseStreak = 0;
        t1LoseStreak++;
      }

      simulateRoundStatsBalanced(team1Wins, teamAStats, teamBStats);
      round++;
    }

    if (scoreA === scoreB) {
      if (Math.random() < 0.5) scoreA++; else scoreB++;
    }

    finalizeStats(teamAStats);
    finalizeStats(teamBStats);

    return {
      a: scoreA,
      b: scoreB,
      players: teamAStats,
      opponentPlayers: teamBStats,
      mapTitle: map.name,
      mapImage: map.image
    };
  };

  const loadHtml2Canvas = (): Promise<any> => {
    return new Promise((resolve, reject) => {
      if (window.html2canvas) return resolve(window.html2canvas);
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.min.js';
      script.crossOrigin = 'anonymous';
      script.onload = () => {
        if (window.html2canvas) resolve(window.html2canvas);
        else reject(new Error('html2canvas failed to load'));
      };
      script.onerror = () => reject(new Error('html2canvas failed to load'));
      document.body.appendChild(script);
    });
  };

  const downloadMatchResultPhoto = async () => {
    const card = document.getElementById('result-card-container');
    if (!card) return;
    try {
      const html2canvas = await loadHtml2Canvas();
      const cloned = card.cloneNode(true) as HTMLElement;
      cloned.style.position = 'fixed';
      cloned.style.left = '-9999px';
      cloned.style.top = '0';
      cloned.style.opacity = '1';
      cloned.style.pointerEvents = 'none';
      document.body.appendChild(cloned);
      const canvas = await html2canvas(cloned, {
        scale: 3,
        backgroundColor: '#020406',
        useCORS: true,
        allowTaint: true,
        logging: false
      });
      document.body.removeChild(cloned);
      const link = document.createElement('a');
      link.download = `virtual_arena_result.png`;
      if (canvas.toBlob) {
        canvas.toBlob((blob) => {
          if (!blob) return;
          const url = URL.createObjectURL(blob);
          link.href = url;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(url);
        }, 'image/png');
      } else {
        link.href = canvas.toDataURL('image/png');
        link.click();
      }
    } catch (error) {
      console.error('Failed to download match photo', error);
      alert('Не удалось сохранить фото результата. Попробуйте ещё раз.');
    }
  };

  // Persistence effects
  React.useEffect(() => {
    saveToLocal('user_balance', balance);
  }, [balance]);

  React.useEffect(() => {
    saveToLocal('players_base', players);
  }, [players]);

  React.useEffect(() => {
    saveToLocal('user_team', team);
  }, [team]);

  React.useEffect(() => {
    saveToLocal('match_history', matchHistory);
  }, [matchHistory]);

  React.useEffect(() => {
    saveToLocal('user_staff', staff);
  }, [staff]);

  React.useEffect(() => {
    saveToLocal('user_bench', bench);
  }, [bench]);

  React.useEffect(() => {
    localStorage.setItem('user_bootcamp', JSON.stringify(bootcamp));
  }, [bootcamp]);

  React.useEffect(() => {
    localStorage.setItem('auto_pick_settings', JSON.stringify(autoPickSettings));
  }, [autoPickSettings]);

  React.useEffect(() => {
    localStorage.setItem('jsonbin_access_key', cloudKeys.accessKey);
    localStorage.setItem('jsonbin_bin_id', cloudKeys.binId);
  }, [cloudKeys]);

  React.useEffect(() => {
    localStorage.setItem('gemini_api_key', geminiKey);
  }, [geminiKey]);

  const [analyticsMaps, setAnalyticsMaps] = useState<any[]>([
    { id: "sandstone", name: "SANDSTONE", image: "https://images.unsplash.com/photo-1542332213-9b5a5a3fad35?q=80&w=800&auto=format&fit=crop" },
    { id: "rust", name: "RUST", image: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=800&auto=format&fit=crop" },
    { id: "sakura", name: "SAKURA", image: "https://images.unsplash.com/photo-1522383225653-ed111181a951?q=80&w=800&auto=format&fit=crop" },
    { id: "province", name: "PROVINCE", image: "https://images.unsplash.com/photo-1519011985187-444d62641929?q=80&w=800&auto=format&fit=crop" },
    { id: "zone9", name: "ZONE 9", image: "https://images.unsplash.com/photo-1533929736458-ca588d08c8be?q=80&w=800&auto=format&fit=crop" },
    { id: "breeze", name: "BREEZE", image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=800&auto=format&fit=crop" },
    { id: "dune", name: "DUNE", image: "https://images.unsplash.com/photo-1509316785289-025f5b846b35?q=80&w=800&auto=format&fit=crop" },
  ]);

  React.useEffect(() => {
    // Market starts empty as per user request to remove "my" players
    // The user can add their own players via the Admin panel
    if (players.length === 0 && team.length === 0) {
      // We'll leave it empty.
    }
  }, []);

  const handleAddPlayer = (newPlayer: any) => {
    if (Array.isArray(newPlayer)) {
      setPlayers([...players, ...newPlayer]);
    } else {
      setPlayers([...players, newPlayer]);
    }
  };

  const MAX_BENCH_CAPACITY = 3;

  const handleBuyPlayer = (player: any) => {
    if (team.some((p) => p.id === player.id) || bench.some((p) => p.id === player.id)) {
      alert("Этот игрок уже есть в составе или на скамейке!");
      return;
    }
    if (balance < (player.price || 0)) {
      alert("Недостаточно средств!");
      return;
    }
    setBalance(prev => prev - (player.price || 0));
    setPlayers(players.filter((p) => p.id !== player.id));

    const purchasedPlayer = { ...player, listedPrice: undefined, isListedByUser: false };
    if (team.length < 5) {
      setTeam([...team, purchasedPlayer]);
    } else if (bench.length < MAX_BENCH_CAPACITY) {
      setBench([...bench, purchasedPlayer]);
      alert("Команда полная. Игрок добавлен на скамейку.");
    } else {
      alert(`Скамейка заполнена. Максимум ${MAX_BENCH_CAPACITY} игроков на скамейке.`);
      setPlayers((prev) => [...prev, player]);
      setBalance((prev) => prev + (player.price || 0));
    }
  };

  const handleListPlayerForSale = (player: any) => {
    const defaultPrice = Math.max(1000, Math.floor((player.price || 0) * 0.9));
    const priceInput = window.prompt(
      `Введите цену продажи для ${player.nickname} (оставьте пустым для обычной продажи на 70% от стоимости $${Math.floor((player.price || 0) * 0.7)}):`,
      String(defaultPrice)
    );

    if (priceInput === null) return;
    const trimmed = priceInput.trim();
    const numericPrice = trimmed === '' ? null : Number(trimmed.replace(/[^0-9]/g, ''));

    setTeam(prev => prev.filter((p) => p.id !== player.id));
    setBench(prev => prev.filter((p) => p.id !== player.id));

    if (numericPrice === null) {
      const sellValue = Math.floor((player.price || 0) * 0.7);
      setBalance(prev => prev + sellValue);
      setPlayers(prev => [...prev, { ...player, listedPrice: undefined, isListedByUser: false }]);
      alert(`Игрок ${player.nickname} продан за $${sellValue.toLocaleString()}.`);
      return;
    }

    if (Number.isNaN(numericPrice) || numericPrice <= 0) {
      alert('Введите корректную цену продажи.');
      return;
    }

    setPlayers(prev => [...prev, { ...player, listedPrice: numericPrice, isListedByUser: true }]);
    alert(`Игрок ${player.nickname} выставлен на рынок за $${numericPrice.toLocaleString()}.`);
  };

  const handleSellPlayer = (player: any) => {
    handleListPlayerForSale(player);
  };

  const handleSellBenchPlayer = (player: any) => {
    handleListPlayerForSale(player);
  };

  const handleDelistPlayer = (player: any) => {
    const availableTarget = team.length < 5 ? 'team' : bench.length < MAX_BENCH_CAPACITY ? 'bench' : null;
    if (!availableTarget) {
      alert('Нет свободного места в составе или на скамейке, чтобы вернуть игрока. Освободите место и попробуйте снова.');
      return;
    }

    setPlayers(prev => prev.filter((p) => p.id !== player.id));

    const returnedPlayer = { ...player, listedPrice: undefined, isListedByUser: false };

    if (availableTarget === 'team') {
      setTeam(prev => [...prev, returnedPlayer]);
      alert(`Игрок ${player.nickname} снят с рынка и возвращён в состав.`);
    } else {
      setBench(prev => [...prev, returnedPlayer]);
      alert(`Игрок ${player.nickname} снят с рынка и возвращён на скамейку.`);
    }
  };

  const handlePromoteBenchPlayer = (player: any) => {
    if (team.length >= 5) {
      alert("В команде уже 5 игроков. Освободите место для перевода со скамейки.");
      return;
    }
    setBench(prev => prev.filter(p => p.id !== player.id));
    setTeam(prev => [...prev, player]);
  };

  const handleBuyStaff = (staffCandidate: any) => {
    if (balance < (staffCandidate.price || 0)) {
      alert("Недостаточно средств для найма этого сотрудника!");
      return;
    }

    const existingIndex = staff.findIndex((s) => s.role === staffCandidate.role);
    if (existingIndex !== -1) {
      alert("У вас уже нанят специалист этой роли! Вы можете повысить его квалификацию в Тренерском штабе.");
      return;
    }

    setBalance(prev => prev - staffCandidate.price);
    setStaff(prev => [...prev, staffCandidate]);
    alert(`Вы успешно наняли сотрудника "${staffCandidate.name}" на роль "${staffCandidate.roleName}"!`);
  };

  const handleUpgradeStaff = (role: string) => {
    const existingIndex = staff.findIndex((s) => s.role === role);
    if (existingIndex === -1) {
      alert("Сначала наймите базового специалиста на вкладке Рынок -> Персонал!");
      return;
    }

    const existing = staff[existingIndex];
    if (existing.level >= 3) {
      alert("Этот специалист уже имеет максимальную квалификацию (Уровень 3)!");
      return;
    }

    // Next level will be level (existing.level + 1). List is 0-indexed, so level 2 is index 1, level 3 is index 2.
    const upgradesList = STAFF_UPGRADES[role];
    const nextLevelData = upgradesList ? upgradesList[existing.level] : null;

    if (!nextLevelData) {
      alert("Не найдены данные для повышения этого специалиста!");
      return;
    }

    if (balance < nextLevelData.price) {
      alert(`Недостаточно средств для повышения! Требуется $${nextLevelData.price.toLocaleString()}`);
      return;
    }

    setBalance(prev => prev - nextLevelData.price);
    setStaff(prev => prev.map((s, idx) => idx === existingIndex ? { ...s, ...nextLevelData } : s));
    alert(`Специалист "${nextLevelData.roleName}" повышен до Уровня ${nextLevelData.level}! Теперь на этой должности работает: ${nextLevelData.name}.`);
  };

  const handleSellStaff = (role: string) => {
    const existingIndex = staff.findIndex((s) => s.role === role);
    if (existingIndex === -1) return;

    const existing = staff[existingIndex];
    const upgradesList = STAFF_UPGRADES[role];
    const currentPrice = upgradesList?.[existing.level - 1]?.price || existing.price || 0;
    const refundAmount = Math.floor(currentPrice * 0.6);

    // Bypassed window.confirm dynamically to prevent iframe sandbox failures
    setBalance(prev => prev + refundAmount);
    setStaff(prev => prev.filter((s, idx) => idx !== existingIndex));
    alert(`Сотрудник "${existing.name}" успешно уволен. Вы получили $${refundAmount.toLocaleString()} на баланс.`);
  };

  const handleTrainPlayer = (player: any) => {
    const managerLevel = staff.find(s => s.role === 'Manager')?.level || 0;
    const baseLimit = 3;
    const extraLimit = managerLevel === 1 ? 1 : managerLevel === 2 ? 2 : managerLevel === 3 ? 3 : 0;
    const maxTrainings = baseLimit + extraLimit;

    if (player.trainingsToday >= maxTrainings) {
      alert(`Этот игрок уже провел все тренировки на сегодня (${maxTrainings} лимит). Дайте ему отдохнуть!`);
      return;
    }
    
    const trainingCost = 5000;
    if (balance < trainingCost) {
      alert("Недостаточно средств для тренировки ($5,000)!");
      return;
    }

    setTrainingAttribute('aim');
    setTrainingPlayer(player);
  };

  const handleUpgradeStat = (playerId: string, statKey: string) => {
    setTeam(prevTeam => prevTeam.map(p => {
      if (p.id === playerId) {
        if ((p.skillPoints || 0) <= 0) return p;
        if (p.rating >= (p.potential || 99)) {
          alert("Игрок достиг своего потенциала! Дальнейшее улучшение невозможно.");
          return p;
        }
        const newStats = { ...p.stats };
        newStats[statKey] = Math.min(99, (newStats[statKey] || 0) + 1);
        const newRating = Math.floor(((newStats.aim + newStats.iq + newStats.movement + (newStats.special || 0)) / 4));
        return {
          ...p,
          stats: newStats,
          rating: Math.min(p.potential || 99, newRating),
          skillPoints: p.skillPoints - 1
        };
      }
      return p;
    }));
  };

  const handleCompleteTraining = (score: number) => {
    if (!trainingPlayer) return;

    const trainingCost = 5000;
    
    // Coach XP multiplier (disabled for now by user request)
    const coachLevel = staff.find(s => s.role === 'Coach')?.level || 0;
    const coachMultiplier = coachLevel >= 1 ? 1.2 + coachLevel * 0.05 : 1.0;
    const gainedXp = Math.round(score * coachMultiplier);
    const selectedAttribute = trainingAttribute || 'aim';
    const statImprovement = score >= 35 ? 2 : 1;
    
    console.log(`Training complete: Score ${score}, Gained XP ${gainedXp} (Coef: ${coachMultiplier}) for ${trainingPlayer.nickname}`);

    setBalance(prev => prev - trainingCost);
    setTeam(prevTeam => prevTeam.map(p => {
      if (p.id === trainingPlayer.id) {
        let currentXp = (p.xp || 0) + gainedXp;
        let currentLevel = p.level || 1;
        let currentSkillPoints = p.skillPoints || 0;
        let currentXpToNext = p.xpToNextLevel || 100;
        let currentStats = { ...p.stats };

        const effectiveStatKey = selectedAttribute as 'aim' | 'iq' | 'movement' | 'special';
        currentStats[effectiveStatKey] = Math.min(99, (currentStats[effectiveStatKey] || 0) + statImprovement);

        // Level up logic
        while (currentXp >= currentXpToNext && currentLevel < 50) {
          currentXp -= currentXpToNext;
          currentLevel += 1;
          currentSkillPoints += 1; // 1 point per level
          
          const scalingFactor = 1.1 + (currentLevel * 0.02);
          currentXpToNext = Math.floor(currentXpToNext * scalingFactor);
        }

        // Cap XP at max level
        if (currentLevel >= 50) {
          currentXp = 0;
          currentXpToNext = 1;
        }

        const finalRating = Math.floor(((currentStats.aim + currentStats.iq + currentStats.movement + (currentStats.special || 0)) / 4));

        return { 
          ...p, 
          stats: currentStats, 
          rating: Math.min(p.potential || 99, finalRating),
          xp: currentXp,
          level: currentLevel,
          skillPoints: currentSkillPoints,
          xpToNextLevel: currentXpToNext,
          trainingsToday: (p.trainingsToday || 0) + 1
        };
      }
      return p;
    }));

    setTrainingPlayer(null);
  };

  return (
    <div className="min-h-screen selection:bg-blue-600/30 font-sans text-zinc-100 overflow-x-hidden relative">
      {/* Background Layer */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: -1 }}>
        {/* Core background image */}
        <img 
          src="/lobby.jpg" 
          alt="Background"
          className="absolute inset-0 w-full h-full object-cover opacity-100"
        />

        {/* Cinematic Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/20 pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,transparent_0%,rgba(0,0,0,0.3)_100%)]" />

        {/* HUD Grid */}
        <div className="absolute inset-0 grid-overlay opacity-[0.1]" />

        {/* Scanlines Effect */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.2)_50%)] bg-[length:100%_4px] pointer-events-none opacity-30" />

        {/* Ambient Floating Elements (Cinematic) */}
        <div className="absolute top-1/4 -left-20 w-[1000px] h-px bg-gradient-to-r from-blue-500/30 to-transparent rotate-[18deg] blur-[1px]" />
        <div className="absolute bottom-1/3 -right-20 w-[1000px] h-px bg-gradient-to-l from-blue-500/30 to-transparent -rotate-[12deg] blur-[1px]" />
      </div>

      {/* NAVBAR */}
      <nav className="fixed top-0 left-0 right-0 z-[60] bg-[#02050a]/80 backdrop-blur-xl border-b border-white/[0.05] h-16 px-8 flex items-center justify-between">
        <div className="flex items-center gap-12">
          <div
            className="flex items-center gap-3 group cursor-pointer"
            onClick={() => setActiveTab("lobby")}
          >
            <TeamLogo size="sm" />
            <div className="flex flex-col">
              <span className="text-sm font-black tracking-tight text-white italic group-hover:text-blue-100 transition-colors uppercase leading-none">
                VirtualArena
              </span>
              <span className="text-[7px] font-bold text-blue-500 uppercase tracking-[0.2em] mt-0.5">ELITE ESPORTS</span>
            </div>
          </div>

          <div className="hidden xl:flex items-center gap-4">
            <NavbarItem
              label="Главная"
              active={activeTab === "lobby"}
              onClick={() => setActiveTab("lobby")}
            />
            <NavbarItem
              label="Команда"
              active={activeTab === "team"}
              onClick={() => setActiveTab("team")}
            />
            <NavbarItem label="Турниры" />
            <NavbarItem
              label="Рынок"
              active={activeTab === "market"}
              onClick={() => setActiveTab("market")}
            />
            <NavbarItem
              label="История"
              active={activeTab === "history"}
              onClick={() => setActiveTab("history")}
            />
          </div>
        </div>

        <div className="flex items-center gap-6">
          <button
            onClick={() => setIsAdmin(!isAdmin)}
            className={`px-3 py-1 rounded text-[9px] font-bold border transition-all
              ${isAdmin ? "bg-red-500/10 border-red-500/20 text-red-500" : "bg-zinc-800 border-zinc-700 text-zinc-500"}`}
          >
            ADMIN: {isAdmin ? "ON" : "OFF"}
          </button>

          {isAdmin && (
            <button
              onClick={() => setShowAdminPanel(true)}
              className="px-3 py-1 bg-blue-600/10 border border-blue-500/20 text-blue-500 rounded text-[9px] font-bold hover:bg-blue-600/20 transition-all uppercase"
            >
              Control Panel
            </button>
          )}

          <div className="flex items-center gap-2 bg-white/[0.02] border border-white/[0.05] px-4 py-2 rounded-lg">
            <Wallet size={14} className="text-blue-500" />
            <span className="text-[11px] font-bold text-white tracking-widest">
              ${balance.toLocaleString()}
            </span>
          </div>

          <div className="flex items-center gap-5 pl-5 border-l border-white/10">
            <div className="flex items-center gap-4 cursor-pointer group">
              <div className="text-right">
                <p className="text-[11px] font-bold text-white leading-none">
                  Admin
                </p>
                <p className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest mt-0.5">
                  ТРЕНЕР
                </p>
              </div>
              <div className="w-8 h-8 rounded-full overflow-hidden border border-white/10 group-hover:border-blue-500/40 transition-colors">
                <img
                  src={`https://api.dicebear.com/7.x/avataaars/svg?seed=admin`}
                  alt="Avatar"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            <div className="flex items-center gap-3 border-l border-white/10 pl-5">
              <Bell size={16} className="text-zinc-500 hover:text-white transition-colors cursor-pointer" />
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-[1500px] mx-auto px-8 pt-24 pb-12 flex flex-col gap-10">
        <AnimatePresence mode="wait">
          {/* MATCH RESULT MODAL */}
      {matchResult && (
        <div className="fixed inset-0 z-[110] bg-black/80 backdrop-blur-md flex items-center justify-center p-6">
           <motion.div 
             id="result-card-container"
             initial={{ scale: 0.9, opacity: 0 }}
             animate={{ scale: 1, opacity: 1 }}
             className="glass-panel p-8 rounded-[40px] border-white/10 max-w-5xl w-full text-center relative overflow-hidden"
           >
              {/* Blurred Map Background */}
              <div 
                className="absolute inset-0 z-0 opacity-40 blur-2xl scale-110 pointer-events-none"
                style={{ 
                  backgroundImage: `url(${matchResult.mapImage})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center'
                }}
              />
              <div className="absolute inset-0 z-0 bg-black/60 pointer-events-none" />

              <div className={`absolute top-0 left-0 w-full h-1 z-10 ${matchResult.result === 'WIN' ? 'bg-green-500 shadow-[0_0_20px_rgba(34,197,94,0.5)]' : 'bg-red-500 shadow-[0_0_20px_rgba(239,68,68,0.5)]'}`} />
              
              <div className="relative z-10">
                <h3 className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.5em] mb-6">ОФИЦИАЛЬНЫЙ РЕЗУЛЬТАТ</h3>
              
              <div className="flex items-center justify-center gap-12 mb-8">
                 <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-2xl bg-blue-600/10 border border-blue-500/20 flex items-center justify-center">
                       <span className="text-xl font-black text-blue-500 italic">VA</span>
                    </div>
                    <div className="text-left">
                       <span className="block text-[12px] font-black text-white uppercase italic">V.ARENA</span>
                       <span className="text-[10px] font-bold text-zinc-500 uppercase">OUR TEAM</span>
                    </div>
                 </div>

                 <div className="flex flex-col items-center">
                    <div className="text-6xl font-black text-white italic tracking-tighter tabular-nums mb-1 flex items-center gap-4">
                       <span>{matchResult.scoreA}</span>
                       <span className="text-zinc-700">:</span>
                       <span>{matchResult.scoreB}</span>
                    </div>
                    <div className={`px-4 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${matchResult.result === 'WIN' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                       {matchResult.result === 'WIN' ? 'ПОБЕДА' : 'ПОРАЖЕНИЕ'}
                    </div>
                    {matchResult.mapTitle && (
                       <div className="mt-2 text-[8px] font-black text-zinc-500 uppercase tracking-widest italic opacity-60">
                          MAP: {matchResult.mapTitle}
                       </div>
                    )}
                 </div>

                 <div className="flex items-center gap-4">
                    <div className="text-right">
                       <span className="block text-[12px] font-black text-zinc-400 uppercase italic truncate max-w-[100px]">{matchResult.opponentName}</span>
                       <span className="text-[10px] font-bold text-zinc-600 uppercase">OPPONENT</span>
                    </div>
                    <div className="w-16 h-16 rounded-2xl bg-zinc-900 border border-white/5 flex items-center justify-center">
                       <img src={matchResult.opponentLogo} alt="" className="w-10 h-10 grayscale opacity-60" />
                    </div>
                 </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                 {/* Team A stats */}
                 <div className="overflow-hidden rounded-2xl border border-white/5 bg-white/[0.02]">
                    <div className="px-4 py-2 bg-blue-500/10 border-b border-white/5 text-left">
                       <span className="text-[8px] font-black text-blue-400 uppercase tracking-widest">V.ARENA ROSTER</span>
                    </div>
                    <div className="grid grid-cols-5 py-2 px-4 border-b border-white/5 text-[7px] font-black text-zinc-500 uppercase tracking-widest bg-black/20">
                       <div className="text-left col-span-2">ИГРОК</div>
                       <div>K/A/D</div>
                       <div>K/D</div>
                       <div>RTG</div>
                    </div>
                    <div className="divide-y divide-white/[0.03]">
                       {(matchResult.playerStats || []).sort((a:any, b:any) => b.rating - a.rating).map((ps: any, idx: number) => (
                         <div key={idx} className="grid grid-cols-5 py-3 px-4 items-center">
                            <div className="flex items-center gap-2 col-span-2 text-left">
                               <div className="w-6 h-6 rounded-md bg-black/40 overflow-hidden border border-white/5">
                                  <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${ps.avatarSeed}`} className="w-full h-full" alt="" />
                               </div>
                               <div className="flex flex-col">
                                  <span className="text-[9px] font-black text-white uppercase italic leading-none">{ps.nickname}</span>
                                  <span className="text-[6px] font-bold text-zinc-500 uppercase whitespace-nowrap">{ps.role}</span>
                               </div>
                            </div>
                            <div className="text-[10px] font-black text-zinc-300 italic">{ps.kills}/{ps.assists}/{ps.deaths}</div>
                            <div className="text-[10px] font-black text-zinc-500 tabular-nums">{(ps.kills / (ps.deaths || 1)).toFixed(2)}</div>
                            <div className={`text-[10px] font-black italic ${ps.rating >= 1.2 ? 'text-green-400' : ps.rating >= 1.0 ? 'text-white' : 'text-zinc-600'}`}>{ps.rating.toFixed(2)}</div>
                         </div>
                       ))}
                    </div>
                 </div>

                 {/* Team B stats */}
                 <div className="overflow-hidden rounded-2xl border border-white/5 bg-white/[0.02]">
                    <div className="px-4 py-2 bg-red-500/10 border-b border-white/5 text-left">
                       <span className="text-[8px] font-black text-red-500 uppercase tracking-widest">OPPONENT ROSTER</span>
                    </div>
                    <div className="grid grid-cols-5 py-2 px-4 border-b border-white/5 text-[7px] font-black text-zinc-500 uppercase tracking-widest bg-black/20">
                       <div className="text-left col-span-2">ИГРОК</div>
                       <div>K/A/D</div>
                       <div>K/D</div>
                       <div>RTG</div>
                    </div>
                    <div className="divide-y divide-white/[0.03]">
                       {(matchResult.opponentPlayerStats || Array.from({length: 5})).map((ps: any, idx: number) => (
                         <div key={idx} className="grid grid-cols-5 py-3 px-4 items-center opacity-80">
                            <div className="flex items-center gap-2 col-span-2 text-left">
                               <div className="w-6 h-6 rounded-md bg-zinc-900 overflow-hidden border border-white/5">
                                  {ps ? (
                                     <img src={`https://api.dicebear.com/7.x/identicon/svg?seed=${ps.avatarSeed}`} className="w-full h-full grayscale" alt="" />
                                  ) : (
                                     <div className="w-full h-full bg-zinc-800" />
                                  )}
                               </div>
                               <div className="flex flex-col">
                                  <span className="text-[9px] font-black text-zinc-300 uppercase italic leading-none">{ps?.nickname || "BOT"}</span>
                                  <span className="text-[6px] font-bold text-zinc-600 uppercase whitespace-nowrap">{ps?.role || "Player"}</span>
                               </div>
                            </div>
                            <div className="text-[10px] font-black text-zinc-500 italic">{ps?.kills || 0}/{ps?.assists || 0}/{ps?.deaths || 0}</div>
                            <div className="text-[10px] font-black text-zinc-600 tabular-nums">{ps ? (ps.kills / (ps.deaths || 1)).toFixed(2) : "0.00"}</div>
                            <div className="text-[10px] font-black text-zinc-700 italic">{(ps?.rating || 0).toFixed(2)}</div>
                         </div>
                       ))}
                    </div>
                 </div>
              </div>

              </div>

              <div className="grid grid-cols-3 gap-3 max-w-sm mx-auto relative z-10">
                <button 
                  onClick={downloadMatchResultPhoto}
                  className="w-full py-4 bg-emerald-500 text-black font-black text-[10px] uppercase tracking-widest rounded-xl hover:bg-emerald-400 transition-all active:scale-95"
                >
                  СКАЧАТЬ ФОТО
                </button>
                <button 
                  onClick={() => setMatchResult(null)}
                  className="w-full py-4 bg-white text-black font-black text-[10px] uppercase tracking-widest rounded-xl hover:bg-zinc-200 transition-all active:scale-95"
                >
                  ПРОДОЛЖИТЬ
                </button>
                <button 
                  onClick={() => {
                    setMatchResult(null);
                    setActiveTab("stats");
                  }}
                  className="w-full py-4 bg-white/5 border border-white/10 text-white font-black text-[10px] uppercase tracking-widest rounded-xl hover:bg-white/10 transition-all"
                >
                  ИСТОРИЯ
                </button>
              </div>
           </motion.div>
        </div>
      )}

      {/* SIMULATION OVERLAY */}
      {selectedMatchForMap && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/90 backdrop-blur-2xl">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-4xl"
          >
            <div className="text-center mb-12">
               <h2 className="text-4xl font-black text-white italic tracking-tighter uppercase mb-4">ВЫБЕРИТЕ КАРТУ</h2>
               <p className="text-blue-500 font-black text-[10px] tracking-[0.4em] uppercase">АРЕНА ДЛЯ СРАЖЕНИЯ</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
               {maps.map((map) => (
                 <motion.button
                   key={map.id}
                   whileHover={{ scale: 1.05 }}
                   whileTap={{ scale: 0.95 }}
                   onClick={() => handleStartSimulation(selectedMatchForMap, map)}
                   className="group relative h-80 rounded-2xl overflow-hidden border border-white/10 hover:border-blue-500/50 transition-colors shadow-2xl"
                 >
                    <img 
                      src={map.image} 
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                      alt={map.name} 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
                    <div className="absolute inset-0 flex items-end p-6">
                       <div className="text-left">
                          <p className="text-[8px] font-black text-blue-500 uppercase tracking-widest mb-1 italic">MAP</p>
                          <h3 className="text-xl font-black text-white italic uppercase tracking-tighter">{map.name}</h3>
                       </div>
                    </div>
                 </motion.button>
               ))}
            </div>

            <div className="mt-12 text-center">
               <button 
                onClick={() => setSelectedMatchForMap(null)}
                className="text-[10px] font-black text-zinc-600 hover:text-white uppercase tracking-[0.4em] transition-colors"
               >
                 [ ОТМЕНИТЬ ]
               </button>
            </div>
          </motion.div>
        </div>
      )}

      {isSimulating && (
        <div className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-xl flex items-center justify-center">
            <div className="text-center space-y-8 max-w-md w-full px-6">
                <div className="relative w-32 h-32 mx-auto">
                    <div className="absolute inset-0 border-4 border-blue-500/20 rounded-full"></div>
                    <div 
                        className="absolute inset-0 border-4 border-blue-500 rounded-full border-t-transparent animate-spin"
                        style={{ transition: 'all 0.3s ease' }}
                    ></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <Brain className="text-blue-500 animate-pulse" size={40} />
                    </div>
                </div>
                
                <div className="space-y-2">
                    <h2 className="text-2xl font-black text-white italic tracking-tighter uppercase whitespace-nowrap">
                        СИМУЛЯЦИЯ МАТЧА
                    </h2>
                    <p className="text-blue-500 font-black text-[10px] tracking-[0.4em] uppercase">
                        {isSimulating.stage}
                    </p>
                </div>

                <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                    <motion.div 
                        className="h-full bg-blue-600"
                        initial={{ width: 0 }}
                        animate={{ width: `${isSimulating.progress}%` }}
                        transition={{ duration: 0.5 }}
                    />
                </div>

                <div className="flex items-center justify-between gap-4 grayscale opacity-40">
                   <div className="flex flex-col items-center gap-2">
                      <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10" />
                      <span className="text-[7px] font-black text-white uppercase italic tracking-widest">{isSimulating.match.teamA}</span>
                   </div>
                   <span className="text-xs font-black text-zinc-700 italic">VS</span>
                   <div className="flex flex-col items-center gap-2">
                      <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10" />
                      <span className="text-[7px] font-black text-white uppercase italic tracking-widest">{isSimulating.match.teamB}</span>
                   </div>
                </div>
            </div>
        </div>
      )}

      {activeTab === "lobby" && (
            <motion.div
              key="lobby"
              initial={{ opacity: 0, scale: 0.99 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.01 }}
              className="flex flex-col gap-10"
            >
              {/* UPPER ROW: HERO + ROSTER */}
              <div className="flex flex-col lg:flex-row items-start justify-between gap-12">
                {/* HERO COLUMN */}
                <div className="max-w-xl pt-10">
                  <motion.p
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="text-[9px] font-black text-zinc-500 uppercase tracking-[0.4em] mb-4"
                  >
                    ДОБРО ПОЖАЛОВАТЬ, ТРЕНЕР
                  </motion.p>

                  <motion.h1
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="text-6xl font-black text-white leading-[1.05] tracking-tighter mb-4 italic uppercase"
                  >
                    Соберите свою <br />
                    <span className="text-blue-500">команду</span> мечты
                  </motion.h1>

                  {/* Series Format Selector */}
                  <div className="flex flex-col gap-2 mb-4">
                    <span className="text-[8px] font-black text-zinc-500 uppercase tracking-widest block font-bold">Формат предстоящей серии</span>
                    <div className="flex bg-white/5 rounded-xl p-0.5 gap-0.5 border border-white/10 w-44">
                      {(['bo1', 'bo2', 'bo3', 'bo5'] as const).map((fmt) => (
                        <button
                          key={fmt}
                          type="button"
                          onClick={() => setMatchFormat(fmt)}
                          className={`flex-1 py-1 px-2 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${
                            matchFormat === fmt
                              ? 'bg-blue-600 text-white shadow-md'
                              : 'text-zinc-500 hover:text-zinc-300'
                          }`}
                        >
                          {fmt.toUpperCase()}
                        </button>
                      ))}
                    </div>
                  </div>

                  <motion.div
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3 }}
                    className="flex items-center gap-4"
                  >
                    <button 
                      onClick={() => {
                        let activeMatch = bets[0];
                        if (!activeMatch) {
                          const opponents = (rankingTeams as any).S2;
                          const randomOpponent = opponents[Math.floor(Math.random() * opponents.length)];
                          activeMatch = {
                            id: Date.now(),
                            teamA: 'V.ARENA',
                            teamB: randomOpponent.name,
                            ratioA: "1.80",
                            ratioB: "2.10",
                            map: 'SANDSTONE'
                          };
                        }
                        setSelectedMatchForMap(activeMatch);
                      }}
                      disabled={team.length < 5}
                      className="bg-blue-600 hover:bg-blue-500 px-10 py-5 rounded-xl font-black text-[11px] uppercase tracking-widest text-white flex items-center gap-3 shadow-[0_0_30px_rgba(37,99,235,0.25)] transition-all hover:scale-[1.02] active:scale-[0.98] group relative overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed">
                      <Plus size={16} />
                      {team.length < 5 ? "НУЖНО 5 ИГРОКОВ" : "Начать матч"}
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-[100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                    </button>

                    <button onClick={() => setActiveTab("team")} className="bg-white/5 hover:bg-white/10 px-10 py-5 rounded-xl font-black text-[11px] uppercase tracking-widest text-white border border-white/10 flex items-center gap-3 transition-all group">
                      Управление
                      <Users
                        size={16}
                        className="text-zinc-500 group-hover:text-blue-500 transition-colors"
                      />
                    </button>
                  </motion.div>
                </div>

                {/* ROSTER COLUMN */}
                <div className="flex-1 w-full lg:max-w-[850px]">
                  <div className="flex items-center justify-between mb-5">
                    <h2 className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.3em]">
                      ТЕКУЩИЙ СОСТАВ{" "}
                      <span className="text-blue-500">{team.length}/5</span>
                    </h2>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                    {team.map((p) => (
                      <PlayerCard 
                        key={p.id} 
                        {...p} 
                        variant="lobby" 
                        isBought={true} 
                        onSell={() => handleSellPlayer(p)}
                        onTrain={() => handleTrainPlayer(p)}
                        onUpgradeStat={(statKey: string) => handleUpgradeStat(p.id, statKey)}
                        hasCoach={staff.some((s: any) => s.role === 'Coach')}
                        analystLevel={staff.find((s: any) => s.role === 'Analyst')?.level || 0}
                        maxTrainings={3 + ((staff.find((s: any) => s.role === 'Manager')?.level || 0) === 1 ? 1 : (staff.find((s: any) => s.role === 'Manager')?.level || 0) === 2 ? 2 : (staff.find((s: any) => s.role === 'Manager')?.level || 0) === 3 ? 3 : 0)}
                      />
                    ))}
                    {Array.from({ length: Math.max(0, 5 - team.length) }).map(
                      (_, i) => (
                        <PlayerCard
                          key={`empty-${i}`}
                          isEmpty
                          onClick={() => setActiveTab("market")}
                          label="ТАВЕРНА"
                        />
                      ),
                    )}
                  </div>
                </div>
              </div>


              {/* BOTTOM ROW: INFORMATION GRID */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
                {/* NEWS PANEL */}
                <div className="glass-panel rounded-2xl p-6 bg-white/[0.01] border-blue-500/10 shadow-[0_0_40px_rgba(37,99,235,0.05)]">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xs font-black text-white uppercase tracking-widest italic opacity-80 underline underline-offset-8 decoration-blue-500/30">
                      Последние новости
                    </h3>
                    <button className="text-[9px] font-bold text-zinc-600 hover:text-zinc-400 uppercase tracking-widest">
                      Смотреть все
                    </button>
                  </div>

                  <div className="flex flex-col gap-3">
                    <NewsItem
                      image="https://images.unsplash.com/photo-1542751371-adc38448a05e?w=200"
                      title="RELEASE 1.0"
                      desc="Глобальное обновление арены! Начинайте собирать свои уникальные составы и доминировать в турнирах."
                      time="Только что"
                      isNew
                      isSpecial
                    />
                  </div>
                </div>

                {/* EVENTS PANEL */}
                <div className="glass-panel rounded-2xl p-6 bg-white/[0.01]">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xs font-black text-white uppercase tracking-widest italic opacity-80 underline underline-offset-8 decoration-blue-500/30">
                      Ближайшие события
                    </h3>
                    <button className="text-[9px] font-bold text-zinc-600 hover:text-zinc-400 uppercase tracking-widest">
                      Смотреть все
                    </button>
                  </div>

                  <div className="flex flex-col items-center justify-center py-12 gap-3 opacity-30">
                    <div className="w-12 h-12 rounded-full border-2 border-dashed border-zinc-700 flex items-center justify-center">
                      <Calendar size={20} className="text-zinc-600" />
                    </div>
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600 italic">
                      Нет событий
                    </p>
                  </div>
                </div>

                {/* CLUB PANEL */}
                <div className="glass-panel rounded-2xl p-6 bg-white/[0.01] relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 blur-3xl pointer-events-none" />
                  <h3 className="text-xs font-black text-white uppercase tracking-widest mb-6 italic opacity-80 underline underline-offset-8 decoration-blue-500/30">
                    Мой клуб
                  </h3>

                  <div className="flex items-center gap-6 mb-8">
                    <TeamLogo size="lg" />
                    <div>
                      <h4 className="text-4xl font-black text-white italic leading-none mb-1">
                        0
                      </h4>
                      <p className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest">
                        Рейтинг клуба
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between text-[10px] font-bold">
                        <div className="flex items-center gap-2 text-zinc-500">
                          <Shield size={10} className="text-blue-500" /> Процент
                          побед
                        </div>
                        <span className="text-white">0%</span>
                      </div>
                      <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)] transition-all duration-1000"
                          style={{ width: "0%" }}
                        />
                      </div>
                    </div>

                    <div className="flex justify-between items-center py-2 border-b border-white/5">
                      <div className="flex items-center gap-2 text-[10px] font-bold text-zinc-500">
                        <Plus size={10} className="text-blue-500" /> Текущая
                        серия
                      </div>
                      <span className="text-[10px] font-bold text-zinc-600 italic">
                        Нет игр
                      </span>
                    </div>

                    <div className="flex justify-between items-center py-2 border-b border-white/5">
                      <div className="flex items-center gap-2 text-[10px] font-bold text-zinc-500">
                        <Wallet size={10} className="text-blue-500" /> Бюджет
                        клуба
                      </div>
                      <span className="text-[10px] font-bold text-white">
                        $0
                      </span>
                    </div>

                    <div className="flex justify-between items-center py-2 border-b border-white/5">
                      <div className="flex items-center gap-2 text-[10px] font-bold text-zinc-500">
                        <Users size={10} className="text-blue-500" /> Игроков в
                        составе
                      </div>
                      <span className="text-[10px] font-bold text-white">
                        {team.length} / 5
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* CINESCOPIC FOOTER */}
              <div className="glass-panel rounded-xl p-5 flex items-center justify-between border-blue-500/10">
                <div className="flex items-center gap-5">
                  <div className="w-10 h-10 bg-yellow-500/10 rounded flex items-center justify-center border border-yellow-500/20">
                    <Trophy size={18} className="text-yellow-400" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white italic tracking-wide">
                      Твой путь к славе начинается здесь
                    </p>
                    <p className="text-[9px] text-zinc-600 font-medium">
                      Каждое решение имеет значение. Докажи, что ты лучший.
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setActiveTab("market")}
                  className="bg-white/5 hover:bg-white/10 px-6 py-2.5 rounded-lg border border-white/5 font-bold text-[10px] tracking-widest text-white transition-all uppercase flex items-center gap-2 group"
                >
                  В ТАВЕРНУ
                  <ShoppingBag
                    size={12}
                    className="text-blue-500 group-hover:translate-x-0.5 transition-transform"
                  />
                </button>
              </div>
            </motion.div>
          )}

          {activeTab === "team" && (
            <motion.div
              key="team"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.02 }}
              className="space-y-8"
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h1 className="text-4xl font-black text-white italic tracking-tighter mb-2">УПРАВЛЕНИЕ КОМАНДОЙ</h1>
                  <p className="text-zinc-500 text-sm">Ростер {team.length}/5 • Скамейка {bench.length}/{MAX_BENCH_CAPACITY} • Персонал</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setTeamPanel('overview')}
                    className={`px-4 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${teamPanel === 'overview' ? 'bg-blue-600 text-white' : 'bg-white/5 text-zinc-400 hover:text-white'}`}
                  >
                    РОСТЕР & СКАМЕЙКА
                  </button>
                  <button
                    onClick={() => setTeamPanel('training')}
                    className={`px-4 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${teamPanel === 'training' ? 'bg-yellow-600 text-white' : 'bg-white/5 text-zinc-400 hover:text-white'}`}
                  >
                    ТРЕНИРОВКА
                  </button>
                  <button
                    onClick={() => setTeamPanel('bootcamp')}
                    className={`px-4 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${teamPanel === 'bootcamp' ? 'bg-purple-600 text-white' : 'bg-white/5 text-zinc-400 hover:text-white'}`}
                  >
                    БУТКЕМП
                  </button>
                </div>
              </div>

              {teamPanel === 'overview' && (
                <div className="space-y-8">
                  {/* Roster and Bench Combined View */}
                  <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                    {/* Main Roster */}
                    <div className="lg:col-span-3 glass-panel rounded-2xl p-6 border border-white/5">
                      <h2 className="text-2xl font-black text-white italic tracking-tighter mb-6">ОСНОВНОЙ СОСТАВ {team.length}/5</h2>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {team.map((p, idx) => (
                          <div key={p.id} className="relative group">
                            <PlayerCard 
                              {...p} 
                              variant="lobby" 
                              isBought={true} 
                              onSell={() => handleSellPlayer(p)}
                              onTrain={() => handleTrainPlayer(p)}
                              onUpgradeStat={(statKey: string) => handleUpgradeStat(p.id, statKey)}
                              hasCoach={staff.some((s: any) => s.role === 'Coach')}
                              analystLevel={staff.find((s: any) => s.role === 'Analyst')?.level || 0}
                              maxTrainings={3 + ((staff.find((s: any) => s.role === 'Manager')?.level || 0) === 1 ? 1 : (staff.find((s: any) => s.role === 'Manager')?.level || 0) === 2 ? 2 : (staff.find((s: any) => s.role === 'Manager')?.level || 0) === 3 ? 3 : 0)}
                            />
                            {bench.length < MAX_BENCH_CAPACITY && (
                              <button
                                onClick={() => {
                                  setTeam(prev => prev.filter((_, i) => i !== idx));
                                  setBench(prev => [...prev, p]);
                                }}
                                className="absolute top-2 left-2 px-2 py-1 bg-orange-600 hover:bg-orange-500 text-white text-[7px] font-black uppercase tracking-widest rounded opacity-0 group-hover:opacity-100 transition-opacity"
                                title="Переместить в скамейку"
                              >
                                ↓
                              </button>
                            )}
                          </div>
                        ))}
                        {Array.from({ length: Math.max(0, 5 - team.length) }).map((_, i) => (
                          <PlayerCard
                            key={`empty-${i}`}
                            isEmpty
                            onClick={() => setActiveTab("market")}
                            label="ТАВЕРНА"
                          />
                        ))}
                      </div>
                    </div>

                    {/* Bench */}
                    <div className="lg:col-span-2 glass-panel rounded-2xl p-6 border border-white/5">
                      <h2 className="text-xl font-black text-white italic tracking-tighter mb-6">СКАМЕЙКА {bench.length}/{MAX_BENCH_CAPACITY}</h2>
                      <div className="space-y-2">
                        {bench.map((p, idx) => (
                          <div key={p.id} className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/10 hover:border-blue-500/50 group transition-all">
                            <div className="flex items-center gap-3 flex-1 min-w-0">
                              <div className="w-10 h-10 rounded-lg bg-black/40 border border-white/5 overflow-hidden shrink-0">
                                <img src={p.imageUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${p.nickname}`} className="w-full h-full object-contain object-bottom" alt="" />
                              </div>
                              <div className="min-w-0 flex-1">
                                <p className="text-sm font-black text-white italic truncate">{p.nickname}</p>
                                <p className="text-[9px] text-zinc-500 font-bold">{p.rating} рейтинг</p>
                              </div>
                            </div>
                            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                              {team.length < 5 && (
                                <button
                                  onClick={() => handlePromoteBenchPlayer(p)}
                                  className="px-2 py-1 bg-green-600 hover:bg-green-500 text-white text-[7px] font-black rounded"
                                  title="В состав"
                                >
                                  ↑
                                </button>
                              )}
                              <button
                                onClick={() => handleSellBenchPlayer(p)}
                                className="px-2 py-1 bg-red-600 hover:bg-red-500 text-white text-[7px] font-black rounded"
                                title="Продать"
                              >
                                X
                              </button>
                            </div>
                          </div>
                        ))}
                        {bench.length === 0 && (
                          <div className="text-center py-8 text-zinc-600">
                            <p className="text-[9px] font-black uppercase tracking-widest">Скамейка пуста</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {teamPanel === 'training' && (
                <div className="space-y-8">
                  <div className="glass-panel rounded-2xl p-8 border border-white/5">
                    <h2 className="text-2xl font-black text-white italic tracking-tighter mb-6">ТРЕНИРОВОЧНАЯ ПРОГРАММА</h2>
                    {team.length === 0 ? (
                      <div className="text-center py-12 text-zinc-500">
                        <p className="text-[10px] font-black uppercase tracking-widest">Нет игроков в составе</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {team.map((p) => (
                          <motion.div 
                            key={p.id}
                            whileHover={{ scale: 1.02 }}
                            className="p-6 rounded-2xl bg-white/[0.02] border border-white/10 hover:border-blue-500/30 transition-all"
                          >
                            <div className="flex items-center gap-4 mb-4">
                              <div className="w-12 h-12 rounded-lg bg-black/40 border border-white/5 overflow-hidden">
                                <img src={p.imageUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${p.nickname}`} className="w-full h-full object-contain object-bottom" alt="" />
                              </div>
                              <div className="flex-1">
                                <p className="text-sm font-black text-white italic">{p.nickname}</p>
                                <p className="text-[10px] text-zinc-500 font-bold">{p.role}</p>
                              </div>
                            </div>
                            
                            <div className="space-y-3 mb-4">
                              <div className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Прогресс</div>
                              <div className="flex gap-2">
                                <div className="flex-1">
                                  <div className="text-[9px] text-zinc-400 mb-1">XP: {p.xp || 0}/{p.xpToNextLevel || 100}</div>
                                  <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                                    <div className="h-full bg-blue-500" style={{ width: `${((p.xp || 0) / (p.xpToNextLevel || 100)) * 100}%` }} />
                                  </div>
                                </div>
                              </div>
                              <div className="text-[9px] text-zinc-400">Уровень: <span className="text-blue-400 font-black">{p.level}/50</span></div>
                            </div>

                            <button
                              onClick={() => handleTrainPlayer(p)}
                              disabled={(p.trainingsToday || 0) >= (3 + ((staff.find((s: any) => s.role === 'Manager')?.level || 0) === 1 ? 1 : (staff.find((s: any) => s.role === 'Manager')?.level || 0) === 2 ? 2 : (staff.find((s: any) => s.role === 'Manager')?.level || 0) === 3 ? 3 : 0))}
                              className={`w-full py-3 rounded-lg font-black text-[10px] uppercase tracking-widest transition-all ${
                                (p.trainingsToday || 0) >= (3 + ((staff.find((s: any) => s.role === 'Manager')?.level || 0) === 1 ? 1 : (staff.find((s: any) => s.role === 'Manager')?.level || 0) === 2 ? 2 : (staff.find((s: any) => s.role === 'Manager')?.level || 0) === 3 ? 3 : 0))
                                  ? 'bg-zinc-900 text-zinc-600 cursor-not-allowed'
                                  : 'bg-yellow-600 hover:bg-yellow-500 text-white'
                              }`}
                            >
                              {(p.trainingsToday || 0) >= (3 + ((staff.find((s: any) => s.role === 'Manager')?.level || 0) === 1 ? 1 : (staff.find((s: any) => s.role === 'Manager')?.level || 0) === 2 ? 2 : (staff.find((s: any) => s.role === 'Manager')?.level || 0) === 3 ? 3 : 0)) 
                                ? `ЛИМИТ ${p.trainingsToday}/`  + (3 + ((staff.find((s: any) => s.role === 'Manager')?.level || 0) === 1 ? 1 : (staff.find((s: any) => s.role === 'Manager')?.level || 0) === 2 ? 2 : (staff.find((s: any) => s.role === 'Manager')?.level || 0) === 3 ? 3 : 0))
                                : '🎯 ТРЕНИРОВАТЬ'}
                            </button>
                          </motion.div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {teamPanel === 'bootcamp' && (
                <div className="space-y-8">
                  {/* Staff Display */}
                  <div className="glass-panel rounded-2xl p-8 border border-white/5">
                    <div className="flex items-center justify-between mb-8">
                      <h3 className="text-2xl font-black text-white italic tracking-tighter">ТРЕНЕРСКИЙ ШТАБ КЛУБА</h3>
                      <button
                        onClick={() => setActiveTab("staff")}
                        className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-[0_0_15px_rgba(37,99,235,0.2)]"
                      >
                        НАЙТИ ПЕРСОНАЛ
                      </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {[
                        { role: 'Manager', icon: Users, color: 'text-blue-400', bg: 'bg-blue-500/10', label: 'Менеджер' },
                        { role: 'Coach', icon: Award, color: 'text-purple-400', bg: 'bg-purple-500/10', label: 'Тренер' },
                        { role: 'Analyst', icon: Activity, color: 'text-yellow-400', bg: 'bg-yellow-500/10', label: 'Аналитик' }
                      ].map(roleInfo => {
                        const hired = staff.find(st => st.role === roleInfo.role);
                        return (
                          <div key={roleInfo.role} className={`p-6 rounded-2xl border transition-all ${hired ? `${roleInfo.bg} border-white/10` : 'bg-white/5 border-white/5 opacity-60'}`}>
                            <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 ${roleInfo.bg}`}>
                              <roleInfo.icon className={roleInfo.color} size={24} />
                            </div>
                            {hired ? (
                              <>
                                <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-2">НАНЯТ</p>
                                <p className="text-lg font-black text-white italic mb-1">{hired.name}</p>
                                <p className="text-[10px] text-zinc-500 font-bold mb-4">Уровень {hired.level}/3</p>
                              </>
                            ) : (
                              <>
                                <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-2">НЕ НАНЯТ</p>
                                <p className="text-lg font-black text-white italic mb-4">{roleInfo.label}</p>
                              </>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Bootcamp Section */}
                  <div className="glass-panel rounded-2xl p-8 border border-white/5 bg-gradient-to-br from-purple-950/20 to-transparent">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-16 h-16 bg-purple-600/20 border border-purple-500/30 rounded-2xl flex items-center justify-center text-purple-400">
                        <Zap size={32} />
                      </div>
                      <div>
                        <h3 className="text-2xl font-black text-white italic tracking-tighter">БУТКЕМП</h3>
                        <p className="text-zinc-400 text-sm">Буткемп можно выбрать перед началом матча</p>
                      </div>
                    </div>
                    
                    {bootcamp?.tier ? (
                      <div className="space-y-4 p-4 bg-black/30 rounded-xl border border-purple-500/20">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-[9px] font-black text-purple-400 uppercase tracking-widest">АКТИВНЫЙ БУТКЕМП</p>
                            <p className="text-xl font-black text-white italic mt-1">{bootcamp.label}</p>
                          </div>
                          <button
                            onClick={() => setBootcamp({ tier: null, label: 'Нет', price: 0, bonus: { ratingBoost: 0, synergy: 0 }, purchasedAt: null })}
                            className="px-4 py-2 bg-red-600/10 border border-red-500/20 text-red-400 hover:bg-red-600/20 rounded-lg text-[9px] font-bold uppercase tracking-widest transition-all"
                          >
                            ОТМЕНИТЬ
                          </button>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-[10px]">
                          <div className="p-2 bg-blue-500/10 rounded border border-blue-500/20 text-blue-300">
                            <div className="font-bold">Бонус рейтинга</div>
                            <div className="font-black text-lg">+{bootcamp.bonus.ratingBoost}</div>
                          </div>
                          <div className="p-2 bg-purple-500/10 rounded border border-purple-500/20 text-purple-300">
                            <div className="font-bold">Синергия</div>
                            <div className="font-black text-lg">+{(bootcamp.bonus.synergy * 100).toFixed(0)}%</div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="p-4 bg-black/20 rounded-xl border border-white/5 text-center">
                        <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Буткемп не выбран</p>
                        <p className="text-[9px] text-zinc-600 mt-2">Выберите буткемп перед запуском матча</p>
                      </div>
                    )}
                  </div>

                </div>
              )}
            </motion.div>
          )}

          {activeTab === "staff" && (
            <motion.div
              key="staff-detail"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="space-y-8"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                  <h1 className="text-4xl font-black text-white italic tracking-tighter mb-2">
                    ТРЕНЕРСКИЙ ШТАБ КЛУБА
                  </h1>
                  <p className="text-zinc-500 text-sm max-w-md">
                    Ваши специалисты обеспечивают тренировочные бонусы, автопик карт и детальную разведку оппонентов.
                  </p>
                </div>
                <div className="flex gap-3">
                  <button 
                    onClick={() => {
                      setActiveTab("market");
                      setMarketTab("staff");
                    }}
                    className="px-6 py-3 bg-blue-600 hover:bg-blue-500 rounded-xl font-black text-[10px] uppercase tracking-widest text-white transition-all shadow-[0_0_20px_rgba(37,99,235,0.2)] hover:scale-[1.02]"
                  >
                    НАЙТИ СПЕЦИАЛИСТОВ
                  </button>
                  <button 
                    onClick={() => setActiveTab("team")}
                    className="px-6 py-3 bg-white/5 hover:bg-white/10 rounded-xl border border-white/10 text-[10px] font-black uppercase tracking-widest text-white transition-all"
                  >
                    ВЕРНУТЬСЯ НА БАЗУ
                  </button>
                </div>
              </div>

              <div className="max-w-4xl mx-auto w-full">
                {/* Left Column: Staff Roster Card */}
                <div className="space-y-6">
                  {(() => {
                    const rolesToRender = [
                      { role: 'Manager', icon: Users, upgrades: STAFF_UPGRADES.Manager },
                      { role: 'Coach', icon: Award, upgrades: STAFF_UPGRADES.Coach },
                      { role: 'Analyst', icon: Activity, upgrades: STAFF_UPGRADES.Analyst }
                    ];
                    return rolesToRender.map((roleInfo) => {
                      const currentHired = staff.find(s => s.role === roleInfo.role);
                      return (
                        <div key={roleInfo.role} className="glass-panel p-8 rounded-2xl border border-white/5">
                          <div className="flex items-center gap-4 mb-6">
                            <div className="w-12 h-12 bg-black/40 border border-white/10 rounded-lg flex items-center justify-center text-blue-500">
                              <roleInfo.icon size={24} />
                            </div>
                            <h3 className="text-lg font-black text-white italic uppercase tracking-tighter">
                              {roleInfo.role === 'Manager' ? 'Менеджер' : roleInfo.role === 'Coach' ? 'Тренер' : 'Аналитик'}
                            </h3>
                          </div>
                          {currentHired ? (
                            <div className="p-4 bg-white/5 border border-white/10 rounded-lg">
                              <p className="text-[10px] font-black text-green-400 uppercase tracking-widest mb-2">НАНЯТ</p>
                              <p className="text-lg font-black text-white italic">{currentHired.name}</p>
                              <p className="text-[9px] text-zinc-500 mt-1">Уровень {currentHired.level}/3</p>
                            </div>
                          ) : (
                            <div className="p-4 bg-white/5 border border-white/10 rounded-lg text-center">
                              <p className="text-[9px] font-black text-zinc-600 uppercase tracking-widest">НЕ НАНЯТ</p>
                              <p className="text-[10px] text-zinc-500 mt-2">Найдите на вкладке Рынок → Персонал</p>
                            </div>
                          )}
                        </div>
                      );
                    });
                  })()}
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === "analytics" && (
            <AnalyticsView 
              onBack={() => setActiveTab("team")} 
              isAdmin={isAdmin}
              bets={bets}
              setBets={setBets}
              maps={analyticsMaps}
              setAnalyticsMaps={setAnalyticsMaps}
              matchHistory={matchHistory}
              setMatchHistory={setMatchHistory}
              team={team}
              roleMultipliers={roleMultipliers}
              userBets={userBets}
              setUserBets={setUserBets}
              balance={balance}
              setBalance={setBalance}
              resolvingMatch={resolvingMatch}
              setResolvingMatch={setResolvingMatch}
              simulateMatch={simulateMatch}
              resolveMatch={resolveMatch}
              setMatchResult={setMatchResult}
              matchFormat={matchFormat}
              handleStartSimulation={handleStartSimulation}
              autoPickSettings={autoPickSettings}
              setAutoPickSettings={setAutoPickSettings}
              bootcamp={bootcamp}
              setBootcamp={setBootcamp}
              staff={staff}
            />
          )}

          {activeTab === "history" && (
            <AnalyticsStatsDetails 
               onBack={() => setActiveTab("team")} 
               matchHistory={matchHistory}
               setMatchResult={setMatchResult}
            />
          )}

          {activeTab === "market" && (
            <MarketView
              key="market"
              isAdmin={isAdmin}
              players={players}
              onPlayerAdd={handleAddPlayer}
              onPlayerBuy={handleBuyPlayer}
              onPlayerSell={handleDelistPlayer}
              onPlayerTrain={handleTrainPlayer}
              onPlayerUpgradeStat={handleUpgradeStat}
              team={team}
              staff={staff}
              onBuyStaff={handleBuyStaff}
              marketTab={marketTab}
              setMarketTab={setMarketTab}
              autoPickSettings={autoPickSettings}
              setAutoPickSettings={setAutoPickSettings}
            />
          )}

          {activeTab === "staff" && (
            <motion.div
              key="staff"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="space-y-8"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                  <h1 className="text-4xl font-black text-white italic tracking-tighter mb-2">
                    ТРЕНЕРСКИЙ ШТАБ КЛУБА
                  </h1>
                  <p className="text-zinc-500 text-sm max-w-md">
                    Ваши специалисты обеспечивают тренировочные бонусы, автопик карт и детальную разведку оппонентов.
                  </p>
                </div>
                <div className="flex gap-3">
                  <button 
                    onClick={() => {
                      setActiveTab("market");
                      setMarketTab("staff");
                    }}
                    className="px-6 py-3 bg-blue-600 hover:bg-blue-500 rounded-xl font-black text-[10px] uppercase tracking-widest text-white transition-all shadow-[0_0_20px_rgba(37,99,235,0.2)] hover:scale-[1.02]"
                  >
                    НАЙТИ СПЕЦИАЛИСТОВ
                  </button>
                  <button 
                    onClick={() => setActiveTab("team")}
                    className="px-6 py-3 bg-white/5 hover:bg-white/10 rounded-xl border border-white/10 text-[10px] font-black uppercase tracking-widest text-white transition-all"
                  >
                    ВЕРНУТЬСЯ НА БАЗУ
                  </button>
                </div>
              </div>

              <div className="max-w-4xl mx-auto w-full">
                {/* Left Column: Staff Roster Card */}
                <div className="space-y-6">
                  {(() => {
                    const rolesToRender = [
                      { key: 'Manager', text: 'Менеджер', icon: User, color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20' },
                      { key: 'Coach', text: 'Главный Тренер', icon: Award, color: 'text-purple-400', bg: 'bg-purple-500/10', border: 'border-purple-500/20' },
                      { key: 'Analyst', text: 'Аналитик', icon: Activity, color: 'text-yellow-400', bg: 'bg-yellow-500/10', border: 'border-yellow-500/20' }
                    ];

                    return rolesToRender.map((roleInfo) => {
                      const current = staff.find(s => s.role === roleInfo.key);
                      const upgrades = STAFF_UPGRADES[roleInfo.key];
                      const nextLevelIndex = current ? current.level : 0; // if level is 1, next index is 1 (level 2)
                      const nextLevelData = nextLevelIndex < 3 ? upgrades[nextLevelIndex] : null;

                      // Calculate current sell refund value (60% of current level price)
                      const currentPrice = current ? (upgrades?.[current.level - 1]?.price || current.price || 0) : 0;
                      const sellPrice = Math.floor(currentPrice * 0.6);

                      return (
                        <div key={roleInfo.key} className="glass-card rounded-2xl p-6 border border-white/[0.03] space-y-6 bg-gradient-to-b from-white/[0.01] to-transparent">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            {/* Core Profile */}
                            <div className="flex items-center gap-4">
                              <div className={`w-14 h-14 ${roleInfo.bg} ${roleInfo.border} border rounded-2xl flex items-center justify-center ${roleInfo.color}`}>
                                <roleInfo.icon size={26} />
                              </div>
                              <div>
                                <div className="flex items-center gap-2">
                                  <span className={`text-[9px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded ${roleInfo.bg} ${roleInfo.color}`}>
                                    {roleInfo.text}
                                  </span>
                                  {current && (
                                    <div className="flex text-yellow-500 text-xs gap-0.5">
                                      {Array.from({ length: current.level }).map((_, i) => (
                                        <Star key={i} size={11} fill="currentColor" />
                                      ))}
                                    </div>
                                  )}
                                </div>
                                <h3 className="text-xl font-black text-white uppercase italic tracking-tight mt-1.5 leading-none">
                                  {current ? current.name : `${roleInfo.text} не нанят`}
                                </h3>
                                <p className="text-xs text-zinc-400 font-medium mt-2 max-w-md leading-relaxed">
                                  {current ? current.desc : "У вас нет активного специалиста на этой должности в данный момент."}
                                </p>
                              </div>
                            </div>

                            {/* Dismiss / Sell button if current is hired */}
                            {current && (
                              <div className="flex flex-col sm:flex-row items-center gap-2 sm:self-center">
                                {firingStaffRole === roleInfo.key ? (
                                  <div className="flex items-center gap-2 bg-[#120505]/40 border border-red-500/20 p-1.5 rounded-xl">
                                    <button
                                      onClick={() => {
                                        handleSellStaff(roleInfo.key);
                                        setFiringStaffRole(null);
                                      }}
                                      className="px-4 py-2.5 bg-red-600 hover:bg-red-500 text-white rounded-lg font-black text-[9px] uppercase tracking-widest transition-all cursor-pointer"
                                    >
                                      ДА, УВОЛИТЬ
                                    </button>
                                    <button
                                      onClick={() => setFiringStaffRole(null)}
                                      className="px-4 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white rounded-lg font-black text-[9px] uppercase tracking-widest transition-all cursor-pointer"
                                    >
                                      ОТМЕНА
                                    </button>
                                  </div>
                                ) : (
                                  <button
                                    onClick={() => setFiringStaffRole(roleInfo.key)}
                                    className="px-5 py-3 border border-red-500/20 bg-red-950/20 hover:bg-red-900/40 text-red-400 hover:text-white rounded-xl font-black text-[9px] uppercase tracking-widest transition-all focus:outline-none focus:ring-opacity-0 hover:scale-[1.02] shadow-[0_0_15px_rgba(239,68,68,0.05)] text-center cursor-pointer"
                                  >
                                    Уволить за ${sellPrice.toLocaleString()} (60%)
                                  </button>
                                )}
                              </div>
                            )}

                            {/* Action Button for Vacancy */}
                            {!current && (
                              <button
                                onClick={() => {
                                  setActiveTab("market");
                                  setMarketTab("staff");
                                }}
                                className="sm:self-center px-6 py-3.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-black text-[9px] uppercase tracking-widest transition-all hover:scale-[1.02] shadow-[0_0_20px_rgba(37,99,235,0.25)]"
                              >
                                Нанять на Рынке
                              </button>
                            )}
                          </div>

                          {/* Upgrade qualification section */}
                          {current && nextLevelData && (
                            <div className="bg-[#050a14]/60 rounded-xl p-5 border border-white/5 space-y-4">
                              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                <div className="space-y-1">
                                  <div className="flex items-center gap-2">
                                    <span className="text-[9px] font-black text-yellow-500 uppercase tracking-widest bg-yellow-500/10 px-2 py-0.5 rounded border border-yellow-500/20 leading-none">
                                      Доступно Повышение Квалификации
                                    </span>
                                    <span className="text-[10px] text-zinc-400 font-bold leading-none">
                                      Уровень {nextLevelData.level}/3
                                    </span>
                                  </div>
                                  <h4 className="text-sm font-black text-white uppercase pt-1">
                                    Новый специалист: <span className="text-yellow-400 font-extrabold">{nextLevelData.name}</span>
                                  </h4>
                                  <p className="text-xs text-zinc-400 font-medium max-w-md leading-relaxed">
                                    {nextLevelData.desc}
                                  </p>
                                </div>
                                
                                <button
                                  onClick={() => handleUpgradeStaff(roleInfo.key)}
                                  className="px-5 py-3.5 bg-yellow-600 hover:bg-yellow-500 text-black rounded-xl text-[10px] font-black uppercase tracking-widest transition-all hover:scale-[1.02] shrink-0 shadow-lg active:scale-[0.98]"
                                >
                                  УЛУЧШИТЬ ЗА ${nextLevelData.price.toLocaleString()}
                                </button>
                              </div>
                            </div>
                          )}

                          {current && !nextLevelData && (
                            <div className="bg-green-500/5 border border-green-500/10 rounded-xl p-4 text-center">
                              <span className="text-[10px] font-black text-green-400 uppercase tracking-widest leading-none">
                                🏆 МАКСИМАЛЬНАЯ КВАЛИФИКАЦИЯ (УРОВЕНЬ 3) ДОСТИГНУТА!
                              </span>
                            </div>
                          )}
                        </div>
                      );
                    });
                  })()}
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === "gaming" && (
            <motion.div
              key="gaming"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              <BaseZoneCard 
                title="АНАЛИТИК БАЗА" 
                subtitle="СТАТИСТИКА И ОБЗОР" 
                icon={<Activity size={24} />} 
                onClick={() => setActiveTab("analytics")}
                color="blue"
              />
              <BaseZoneCard 
                title="ТАВЕРНА" 
                subtitle="РЫНОК ГЕРОЕВ" 
                icon={<ShoppingBag size={24} />} 
                onClick={() => setActiveTab("market")}
                color="yellow"
              />
              <BaseZoneCard 
                title="ТРЕНЕРСКИЙ ШТАБ" 
                subtitle="УПРАВЛЕНИЕ ПЕРСОНАЛОМ" 
                icon={<Users size={24} />} 
                onClick={() => setActiveTab("staff")}
                color="purple"
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Extreme Vignette Overlay */}
      <div className="fixed inset-0 pointer-events-none z-[100] bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.3)_100%)]" />
      <div className="fixed inset-0 pointer-events-none z-[100] animate-scanline opacity-[0.02] bg-gradient-to-b from-white via-transparent to-white h-px" />

      <AnimatePresence>
        {trainingPlayer && (
          <ShootingRange 
            playerName={trainingPlayer.nickname}
            playerRole={trainingPlayer.role}
            selectedAttribute={trainingAttribute}
            onSelectAttribute={setTrainingAttribute}
            onCancel={() => setTrainingPlayer(null)}
            onComplete={handleCompleteTraining}
          />
        )}
      </AnimatePresence>

      <AdminPanelModal 
        isOpen={showAdminPanel} 
        onClose={() => setShowAdminPanel(false)}
        roleMultipliers={roleMultipliers}
        setRoleMultipliers={setRoleMultipliers}
        rankingTeams={rankingTeams}
        setRankingTeams={setRankingTeams}
        maintenance={maintenance}
        setMaintenance={setMaintenance}
        cloudKeys={cloudKeys}
        setCloudKeys={setCloudKeys}
        geminiKey={geminiKey}
        setGeminiKey={setGeminiKey}
        players={players}
        setPlayers={setPlayers}
        matchHistory={matchHistory}
        clearMatchHistory={clearMatchHistory}
        syncToCloud={syncToCloud}
        pullFromCloud={pullFromCloud}
        generateAIReport={generateAIReport}
        setMatchResult={setMatchResult}
      />
    </div>
  );
}
