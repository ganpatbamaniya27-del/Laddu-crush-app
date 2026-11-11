export interface LevelConfig {
  id: number;
  stage: 1 | 2 | 3;
  targetScore: number;
  moves: number;
  starThresholds: [number, number, number];
  rewardCoins: number;
}

export const LEVELS: LevelConfig[] = Array.from({ length: 30 }, (_, i) => {
  const levelNum = i + 1;
  const stage = levelNum <= 10 ? 1 : levelNum <= 20 ? 2 : 3;
  const baseTarget = 6000 + (levelNum - 1) * 1800;
  
  return {
    id: levelNum,
    stage: stage as 1 | 2 | 3,
    targetScore: baseTarget,
    moves: Math.max(16, 26 - Math.floor(levelNum / 4)),
    starThresholds: [baseTarget, Math.round(baseTarget * 1.4), Math.round(baseTarget * 1.9)],
    rewardCoins: 500 + levelNum * 150,
  };
});
