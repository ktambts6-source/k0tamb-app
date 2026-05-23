import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Target, X, Trophy, Timer, Crosshair } from 'lucide-react';

interface ShootingRangeProps {
  playerName: string;
  playerRole: string;
  selectedAttribute: 'aim' | 'iq' | 'movement' | 'special';
  onSelectAttribute: (attr: 'aim' | 'iq' | 'movement' | 'special') => void;
  onComplete: (score: number) => void;
  onCancel: () => void;
}

export const ShootingRange: React.FC<ShootingRangeProps> = ({ playerName, playerRole, selectedAttribute, onSelectAttribute, onComplete, onCancel }) => {
  const [gameState, setGameState] = useState<'idle' | 'playing' | 'finished'>('idle');
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(45);
  const [targets, setTargets] = useState<{ id: number; x: number; y: number; size: number; vx: number; vy: number; hp: number }[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const nextTargetId = useRef(0);
  const [isMissed, setIsMissed] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const startGame = () => {
    setGameState('playing');
    setScore(0);
    setTimeLeft(45);
    setTargets([]);
    spawnTarget();
    spawnTarget();
    spawnTarget();
  };

  const spawnTarget = () => {
    if (!containerRef.current) return;
    
    setTargets(prev => {
      if (prev.length >= 8) return prev;
      
      const rect = containerRef.current!.getBoundingClientRect();
      const padding = 100;
      
      const x = Math.random() * (rect.width - padding * 2) + padding;
      const y = Math.random() * (rect.height - padding * 2) + padding;
      const size = 32;
      const speed = 2.5 + Math.random() * 2;

      const angle = Math.random() * Math.PI * 2;
      const vx = Math.cos(angle) * speed;
      const vy = Math.sin(angle) * speed;

      const newTarget = { id: nextTargetId.current++, x, y, size, vx, vy, hp: 2 };
      return [...prev, newTarget];
    });
  };

  const hitTarget = (id: number) => {
    setTargets(prev => {
      const target = prev.find(t => t.id === id);
      if (!target) return prev;

      if (target.hp <= 1) {
        setScore(s => s + 1);
        setTimeout(() => spawnTarget(), 100);
        return prev.filter(t => t.id !== id);
      }

      return prev.map(t => t.id === id ? { ...t, hp: t.hp - 1 } : t);
    });
  };

  useEffect(() => {
    if (gameState === 'playing' && targets.length < 3) {
      spawnTarget();
    }
  }, [targets.length, gameState]);

  // Movement loop
  useEffect(() => {
    if (gameState !== 'playing') return;

    const moveInterval = setInterval(() => {
      setTargets(prev => {
        return prev.map(t => {
          let nvx = t.vx;
          let nvy = t.vy;

          let nx = t.x + nvx;
          let ny = t.y + nvy;

          if (containerRef.current) {
            const rect = containerRef.current.getBoundingClientRect();
            // Bounce
            if (nx < t.size || nx > rect.width - t.size) nvx *= -1;
            if (ny < t.size || ny > rect.height - t.size) nvy *= -1;
          }

          return { ...t, x: nx, y: ny, vx: nvx, vy: nvy };
        });
      });
    }, 16);

    return () => clearInterval(moveInterval);
  }, [gameState]);

  useEffect(() => {
    if (gameState !== 'playing') return;
    const handleMouseMove = (e: MouseEvent) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
      }
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [gameState]);

  useEffect(() => {
    if (gameState === 'playing' && timeLeft > 0) {
      const timer = setInterval(() => setTimeLeft(t => t - 1), 1000);
      return () => clearInterval(timer);
    } else if (timeLeft === 0 && gameState === 'playing') {
      setGameState('finished');
    }
  }, [gameState, timeLeft]);

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/98 backdrop-blur-3xl p-0 sm:p-4 overflow-hidden">
      <div className="relative w-full h-full sm:h-auto sm:max-w-5xl sm:aspect-[16/9] bg-[#05060a] sm:border sm:border-white/10 sm:rounded-[32px] overflow-hidden shadow-[0_0_150px_rgba(0,0,0,1)] flex flex-col font-mono">
        
        {/* Header */}
        <div className="relative z-[60] p-6 flex items-center justify-between border-b border-white/5 bg-zinc-950/80 backdrop-blur-xl">
          <div className="flex items-center gap-5">
            <div className="w-12 h-12 rounded-2xl bg-red-600/10 border border-red-500/20 flex items-center justify-center">
              <Crosshair size={24} className="text-red-500" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-white italic tracking-tighter uppercase leading-none mb-1">ПОЛИГОН</h2>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                <p className="text-[10px] font-bold text-zinc-500 tracking-[0.3em] uppercase">{playerName}</p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-12">
            <div className="text-right hidden sm:block">
              <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest block mb-1">TIME LEFT</span>
              <div className="text-3xl font-black text-white tabular-nums leading-none flex items-center gap-3">
                <Timer size={20} className={timeLeft <= 10 ? "text-red-500 animate-pulse" : "text-zinc-500"} />
                {timeLeft}s
              </div>
            </div>
            <div className="text-right">
              <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest block mb-1">УБИЙСТВ</span>
              <div className="text-3xl font-black text-white leading-none">
                {score}<span className="text-xs text-red-500 ml-2">KILLS</span>
              </div>
            </div>
            <button onClick={onCancel} className="p-3 hover:bg-white/5 rounded-2xl transition-all">
              <X size={24} className="text-zinc-500 hover:text-white" />
            </button>
          </div>
        </div>

        {/* Range Area */}
        <div 
          ref={containerRef}
          className={`flex-1 relative overflow-hidden group bg-black transition-colors duration-100 ${isMissed ? 'bg-red-500/5' : ''} ${gameState === 'playing' ? 'cursor-none' : 'cursor-default'}`}
          onPointerDown={() => {
             if (gameState === 'playing') {
               setIsMissed(true);
               setTimeout(() => setIsMissed(false), 80);
             }
          }}
        >
          {/* Tactical Overlay */}
          <div className="absolute inset-0 pointer-events-none opacity-[0.1]" 
               style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
          
          {/* CROSSHAIR */}
          {gameState === 'playing' && (
            <div 
              className="absolute pointer-events-none z-[110]"
              style={{ transform: `translate(${mousePos.x - 20}px, ${mousePos.y - 20}px)` }}
            >
              <div className="relative w-10 h-10 flex items-center justify-center">
                 <div className="absolute w-[2px] h-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.8)]" />
                 <div className="absolute w-full h-[2px] bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.8)]" />
                 <div className="w-2 h-2 bg-green-500 rounded-full border border-black" />
              </div>
            </div>
          )}

          <AnimatePresence>
            {gameState === 'idle' && (
              <motion.div 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="absolute inset-0 flex flex-col items-center justify-center p-12 text-center z-50 backdrop-blur-sm bg-black/60"
              >
                <div className="mb-10 relative">
                  <div className="absolute inset-0 bg-red-500/20 blur-3xl animate-pulse" />
                  <div className="relative p-10 bg-zinc-900 border border-red-500/20 rounded-[40px] shadow-2xl">
                    <Crosshair size={80} className="text-red-500" />
                  </div>
                </div>
                <h3 className="text-5xl font-black text-white mb-6 uppercase tracking-tighter italic">ПОЛИГОН</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mb-6">
                   <div className="p-4 bg-zinc-900/50 border border-white/5 rounded-2xl text-left">
                      <div className="text-red-500 text-xs font-black mb-2 tracking-[0.2em]">MISSION</div>
                      <p className="text-zinc-500 text-xs leading-relaxed uppercase">
                        Стандартный курс подготовки всех оперативников.
                      </p>
                   </div>
                   <div className="p-4 bg-zinc-900/50 border border-white/5 rounded-2xl text-left">
                      <div className="text-zinc-500 text-xs font-black mb-2 tracking-[0.2em]">OBJECTIVE</div>
                      <p className="text-zinc-500 text-xs leading-relaxed uppercase">Ликвидируй как можно больше целей за 45 секунд.</p>
                   </div>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
                  {[
                    { id: 'aim', label: 'Aim' },
                    { id: 'iq', label: 'Game IQ' },
                    { id: 'movement', label: 'Movement' },
                    { id: 'special', label: 'Special' },
                  ].map((stat) => (
                    <button
                      key={stat.id}
                      type="button"
                      onClick={() => onSelectAttribute(stat.id as any)}
                      className={`py-3 rounded-2xl border text-[10px] font-black uppercase tracking-[0.2em] transition-all ${selectedAttribute === stat.id ? 'bg-white text-black border-white' : 'bg-white/5 border-white/10 text-zinc-300 hover:bg-white/10 hover:text-white'}`}
                    >
                      {stat.label}
                    </button>
                  ))}
                </div>
                <button 
                  onClick={startGame}
                  className="px-20 py-5 bg-red-600 hover:bg-red-500 text-white font-black uppercase tracking-[0.4em] rounded-[24px] shadow-[0_20px_50px_rgba(239,68,68,0.3)] transition-all active:scale-95"
                >
                  СТАРТ
                </button>
              </motion.div>
            )}

            {gameState === 'playing' && targets.map((target) => (
              <motion.button
                key={target.id}
                initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                className="absolute flex items-center justify-center z-20 group/target"
                style={{ left: target.x - target.size / 2, top: target.y - target.size / 2, width: target.size, height: target.size }}
                onPointerDown={(e) => { e.stopPropagation(); hitTarget(target.id); }}
              >
                <div className="relative w-full h-full rounded-full bg-zinc-900 border-[2px] border-white/20 shadow-[0_0_20px_rgba(255,255,255,0.1)] flex items-center justify-center overflow-hidden group-active/target:scale-95 transition-transform">
                   <div className="absolute inset-0 bg-red-500/10 opacity-0 group-hover/target:opacity-100 transition-opacity" />
                   <div className={`w-1/2 h-1/2 rounded-full shadow-[0_0_15px_rgba(239,68,68,0.5)] ${target.hp === 2 ? 'bg-red-600/40' : 'bg-red-600'}`} />
                   <div className="absolute w-full h-[1px] bg-white/10" />
                   <div className="absolute h-full w-[1px] bg-white/10" />
                   {/* HP Indicator */}
                   <div className="absolute bottom-1 flex gap-0.5">
                      <div className={`w-1 h-1 rounded-full ${target.hp >= 1 ? 'bg-red-500' : 'bg-zinc-700'}`} />
                      <div className={`w-1 h-1 rounded-full ${target.hp >= 2 ? 'bg-red-500' : 'bg-zinc-700'}`} />
                   </div>
                </div>
              </motion.button>
            ))}

            {gameState === 'finished' && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                className="absolute inset-0 flex flex-col items-center justify-center bg-zinc-950/95 backdrop-blur-2xl p-12 text-center z-[70]"
              >
                <div className="mb-10 relative">
                  <div className="absolute inset-0 bg-red-500/20 blur-3xl" />
                  <div className="relative p-10 bg-zinc-900 border border-red-500/20 rounded-[40px]">
                    <Trophy size={80} className="text-red-500" />
                  </div>
                </div>
                <h2 className="text-5xl font-black text-white italic mb-2 uppercase tracking-tighter underline decoration-red-500 underline-offset-8">MISSION SUMMARY</h2>
                <div className="flex items-baseline gap-4 mb-12 mt-4">
                  <span className="text-9xl font-black text-white italic leading-none drop-shadow-[0_0_40px_rgba(255,255,255,0.1)]">{score}</span>
                  <div className="text-left">
                    <span className="block text-2xl font-bold text-red-500 uppercase tracking-[0.2em] leading-none">УНИЧТОЖЕНО</span>
                    <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">УБИЙСТВ В ПОЛИГОНЕ</span>
                  </div>
                </div>
                <div className="flex gap-6 w-full sm:w-auto">
                  <button 
                    onClick={() => onComplete(score)}
                    className="flex-1 sm:flex-none px-16 py-5 bg-red-600 hover:bg-red-500 text-white font-black uppercase tracking-[0.2em] rounded-2xl shadow-xl transition-all active:scale-95"
                  >
                    ПОДТВЕРДИТЬ
                  </button>
                  <button 
                    onClick={startGame}
                    className="flex-1 sm:flex-none px-12 py-5 bg-zinc-900 border border-white/5 hover:bg-zinc-800 text-white font-black uppercase tracking-[0.2em] rounded-2xl transition-all active:scale-95"
                  >
                    ПОВТОРИТЬ
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};
