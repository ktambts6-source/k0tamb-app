import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '10mb' }));

  // Gemini API Setup
  const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY || "",
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      }
    }
  });

  // Local Match Simulation Simulator Engine Helper
  function runLocalSimulation(match: any, map: any, team: any[]) {
    const SITUATION_REWARDS = { win: 3000, lose: 1900, lose2: 2400, lose3: 2900 };
    const START_MONEY = 4000; 
    const BUY_POWER: any = { pistol: 0.78, eco: 0.66, force: 0.82, half: 0.90, full: 1.0 };
    const TEAM_PLAYERS = 5;

    const normalizeRating = (r: any) => {
      const raw = parseFloat(String(r)) || 50;
      return (raw > 0 && raw <= 3) ? raw * 100 : raw;
    };

    const getBuyType = (money: number, round: number, lostLast: boolean) => {
      const perPlayer = Math.floor(money / TEAM_PLAYERS);
      if (round === 1) return 'pistol';
      if (perPlayer < 1300) return 'eco';
      if (lostLast && perPlayer < 2100) return 'eco';
      if (perPlayer < 2600) return 'force';
      if (perPlayer < 3600) return 'half';
      return 'full';
    };

    const getTeamBuyCost = (buyType: string) => {
      const costs: any = { pistol: 0, eco: 500, force: 1800, half: 2500, full: 3500 };
      return costs[buyType] * TEAM_PLAYERS;
    };

    const computeRoundWinChance = (params: any) => {
      const { ratingDiff, momentumDiff, buyDiff, streakPenalty, scoreDiff, isOvertime } = params;
      const comebackEdge = -scoreDiff * (isOvertime ? 0.008 : 0.012);
      const edge = (ratingDiff * 0.98) + (momentumDiff * 0.02) + (buyDiff * 0.08) - (streakPenalty * 0.65) + comebackEdge;
      const randomPart = (Math.random() - 0.5) * 2 * (isOvertime ? 0.02 : 0.01);
      return Math.max(isOvertime ? 0.30 : 0.28, Math.min(isOvertime ? 0.70 : 0.72, 0.5 + edge + randomPart));
    };

    const teamARatings = team.map((p: any) => normalizeRating(p.rating));
    const vaStrength = teamARatings.length > 0 ? (teamARatings.reduce((a: number, b: number) => a + b, 0) / teamARatings.length) : 50;
    const oppStrength = 70 + Math.random() * 40;

    let scoreA = 0;
    let scoreB = 0;
    let round = 1;
    let t1Money = START_MONEY;
    let t2Money = START_MONEY;
    let t1LoseStreak = 0;
    let t2LoseStreak = 0;
    let t1Momentum = 0;
    let t2Momentum = 0;

    const teamAStats = team.map((p: any) => ({
      id: p.id,
      nickname: p.nickname,
      role: p.role,
      avatarSeed: p.avatarSeed,
      kills: 0,
      deaths: 0,
      assists: 0,
      rating: 0,
      roundsWon: 0
    }));

    const teamBStats = Array.from({ length: 5 }).map((_, i) => ({
      id: 999 + i,
      nickname: `Bot_${i + 1}`,
      role: 'Player',
      avatarSeed: `opp_${match.id}_${i}`,
      kills: 0,
      deaths: 0,
      assists: 0,
      rating: 0,
      roundsWon: 0
    }));

    const distributeStats = (winnerWins: boolean, currentRound: number) => {
      const winnerKills = 5;
      const loserKills = Math.floor(Math.random() * 5);
      const winStats = winnerWins ? teamAStats : teamBStats;
      const loseStats = winnerWins ? teamBStats : teamAStats;

      for (let i = 0; i < winnerKills; i++) {
        const idx = Math.floor(Math.random() * 5);
        winStats[idx].kills++;
        const victimIdx = Math.floor(Math.random() * 5);
        loseStats[victimIdx].deaths++;
        if (Math.random() < 0.3) {
          winStats[(idx + 1) % 5].assists++;
        }
      }
      for (let i = 0; i < loserKills; i++) {
        const idx = Math.floor(Math.random() * 5);
        loseStats[idx].kills++;
        const victimIdx = Math.floor(Math.random() * 5);
        winStats[victimIdx].deaths++;
      }
    };

    const target = 13;

    while (scoreA < target && scoreB < target) {
      const t1Buy = getBuyType(t1Money, round, t1LoseStreak > 0);
      const t2Buy = getBuyType(t2Money, round, t2LoseStreak > 0);

      t1Money = Math.max(0, t1Money - getTeamBuyCost(t1Buy));
      t2Money = Math.max(0, t2Money - getTeamBuyCost(t2Buy));

      const winChance = computeRoundWinChance({
        ratingDiff: (vaStrength - oppStrength) / 200,
        momentumDiff: t1Momentum - t2Momentum,
        buyDiff: BUY_POWER[t1Buy] - BUY_POWER[t2Buy],
        streakPenalty: (t1LoseStreak >= 3 ? 0.05 : 0) - (t2LoseStreak >= 3 ? 0.05 : 0),
        scoreDiff: scoreA - scoreB,
        isOvertime: false
      });

      const t1Wins = Math.random() < winChance;
      if (t1Wins) {
        scoreA++; t1LoseStreak = 0; t2LoseStreak++;
        t1Momentum = Math.min(1, t1Momentum + 0.1);
        t2Momentum = Math.max(-1, t2Momentum - 0.1);
        t1Money = Math.min(60000, t1Money + SITUATION_REWARDS.win * TEAM_PLAYERS);
        const lossBonus = (t2LoseStreak >= 3 ? SITUATION_REWARDS.lose3 : t2LoseStreak === 2 ? SITUATION_REWARDS.lose2 : SITUATION_REWARDS.lose);
        t2Money = Math.min(60000, t2Money + lossBonus * TEAM_PLAYERS);
      } else {
        scoreB++; t2LoseStreak = 0; t1LoseStreak++;
        t2Momentum = Math.min(1, t2Momentum + 0.1);
        t1Momentum = Math.max(-1, t1Momentum - 0.1);
        t2Money = Math.min(60000, t2Money + SITUATION_REWARDS.win * TEAM_PLAYERS);
        const lossBonus = (t1LoseStreak >= 3 ? SITUATION_REWARDS.lose3 : t1LoseStreak === 2 ? SITUATION_REWARDS.lose2 : SITUATION_REWARDS.lose);
        t1Money = Math.min(60000, t1Money + lossBonus * TEAM_PLAYERS);
      }

      distributeStats(t1Wins, round);
      round++;
    }

    if (scoreA === 12 && scoreB === 12) {
      let otT1 = 0; let otT2 = 0;
      t1Money = 8000 * TEAM_PLAYERS;
      t2Money = 8000 * TEAM_PLAYERS;

      while (otT1 < 3 && otT2 < 3) {
        const winChance = computeRoundWinChance({
          ratingDiff: (vaStrength - oppStrength) / 200,
          momentumDiff: 0, buyDiff: 0, streakPenalty: 0, scoreDiff: otT1 - otT2, isOvertime: true
        });
        const t1Wins = Math.random() < winChance;
        if (t1Wins) { otT1++; scoreA++; } else { otT2++; scoreB++; }
        distributeStats(t1Wins, round++);
        if (otT1 + otT2 === 2) {
          t1Money = 8000 * TEAM_PLAYERS; t2Money = 8000 * TEAM_PLAYERS;
        }
        if (otT1 === 2 && otT2 === 2) { otT1 = 0; otT2 = 0; }
      }
    }

    const totalRounds = scoreA + scoreB;
    [...teamAStats, ...teamBStats].forEach((ps) => {
      ps.rating = parseFloat(((ps.kills / totalRounds * 2.5) + (ps.assists / totalRounds * 0.8)).toFixed(2));
    });

    return {
      a: scoreA,
      b: scoreB,
      players: teamAStats,
      opponentPlayers: teamBStats,
      mapTitle: map.name,
      mapImage: map.image
    };
  }

  // API routes
  app.get("/api/simulation/config", (req, res) => {
    res.json({
      configured: !!(process.env.SIMULATION_SERVICE_URL && process.env.SIMULATION_SERVICE_API_KEY),
      serviceUrl: process.env.SIMULATION_SERVICE_URL || null,
      hasApiKey: !!process.env.SIMULATION_SERVICE_API_KEY
    });
  });

  app.post("/api/match/simulate", async (req, res) => {
    try {
      const { match, map, team } = req.body;
      if (!match || !map || !team) {
        return res.status(400).json({ error: "Missing match, map, or team parameter" });
      }

      const externalUrl = process.env.SIMULATION_SERVICE_URL;
      const apiKey = process.env.SIMULATION_SERVICE_API_KEY;

      if (externalUrl && apiKey) {
        console.log(`Forwarding match sim to external matchmaking site: ${externalUrl}`);
        try {
          // Attempt to call the external simulator website
          const response = await fetch(externalUrl, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${apiKey}`,
              "X-API-Key": apiKey
            },
            body: JSON.stringify({ match, map, team })
          });

          if (!response.ok) {
            throw new Error(`External server returned status code ${response.status}`);
          }

          const externalData = await response.json();
          return res.json({
            success: true,
            source: "external",
            data: externalData
          });
        } catch (err: any) {
          console.warn(`External match simulator failed: ${err.message}. Falling back to high-fidelity local engine.`);
          const localResult = runLocalSimulation(match, map, team);
          return res.json({
            success: true,
            source: "local-fallback",
            warning: `Couldn't connect to external service (${err.message}). Local fallback used.`,
            data: localResult
          });
        }
      } else {
        // Fall back to server local engine
        const localResult = runLocalSimulation(match, map, team);
        return res.json({
          success: true,
          source: "local-default",
          data: localResult
        });
      }
    } catch (error: any) {
      console.error("Match Simulation route error:", error);
      res.status(500).json({ error: error.message || "Simulation server error" });
    }
  });

  app.post("/api/gemini/analyze", async (req, res) => {
    try {
      const { prompt } = req.body;
      if (!prompt) return res.status(400).json({ error: "Prompt is required" });

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
      });

      res.json({ text: response.text });
    } catch (error: any) {
      console.error("Gemini Error:", error);
      res.status(500).json({ error: error.message || "Internal Server Error" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
