/**
 * Royal Lives / Hearts System for Laddu Crush
 * Max 5 lives. Automatically regenerates +1 life every 15 minutes.
 * Supports watching Rewarded Ad to refill or spending coins.
 */

export const MAX_LIVES = 5;
export const REFILL_INTERVAL_SECONDS = 15 * 60; // 15 minutes = 900 seconds

export interface LivesState {
  lives: number;
  timeRemainingSeconds: number; // Seconds until next life
  formattedCountdown: string;   // MM:SS string
}

export function getStoredLivesState(): LivesState {
  if (typeof window === 'undefined') {
    return { lives: MAX_LIVES, timeRemainingSeconds: 0, formattedCountdown: 'FULL' };
  }

  const storedLivesStr = localStorage.getItem('laddu_crush_lives');
  const storedTimeStr = localStorage.getItem('laddu_crush_lives_time');

  let currentLives = storedLivesStr !== null ? parseInt(storedLivesStr, 10) : MAX_LIVES;
  let lastTime = storedTimeStr !== null ? parseInt(storedTimeStr, 10) : Date.now();

  if (isNaN(currentLives) || currentLives > MAX_LIVES) currentLives = MAX_LIVES;
  if (currentLives < 0) currentLives = 0;

  if (currentLives >= MAX_LIVES) {
    return {
      lives: MAX_LIVES,
      timeRemainingSeconds: 0,
      formattedCountdown: 'FULL',
    };
  }

  const now = Date.now();
  const elapsedSeconds = Math.floor((now - lastTime) / 1000);
  const livesToRegenerate = Math.floor(elapsedSeconds / REFILL_INTERVAL_SECONDS);

  if (livesToRegenerate > 0) {
    currentLives = Math.min(MAX_LIVES, currentLives + livesToRegenerate);
    lastTime = now - ((elapsedSeconds % REFILL_INTERVAL_SECONDS) * 1000);

    localStorage.setItem('laddu_crush_lives', currentLives.toString());
    localStorage.setItem('laddu_crush_lives_time', lastTime.toString());
  }

  if (currentLives >= MAX_LIVES) {
    return {
      lives: MAX_LIVES,
      timeRemainingSeconds: 0,
      formattedCountdown: 'FULL',
    };
  }

  const remainingSeconds = REFILL_INTERVAL_SECONDS - (Math.floor((now - lastTime) / 1000) % REFILL_INTERVAL_SECONDS);
  const minutes = Math.floor(remainingSeconds / 60);
  const seconds = remainingSeconds % 60;
  const formatted = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;

  return {
    lives: currentLives,
    timeRemainingSeconds: remainingSeconds,
    formattedCountdown: formatted,
  };
}

export function consumeOneLife(): boolean {
  const state = getStoredLivesState();
  if (state.lives <= 0) return false;

  const newLives = state.lives - 1;
  localStorage.setItem('laddu_crush_lives', newLives.toString());

  // If dropping below MAX_LIVES, record timestamp if not already set
  if (state.lives === MAX_LIVES) {
    localStorage.setItem('laddu_crush_lives_time', Date.now().toString());
  }

  return true;
}

export function addLives(amount: number): number {
  const state = getStoredLivesState();
  const newLives = Math.min(MAX_LIVES, state.lives + amount);
  localStorage.setItem('laddu_crush_lives', newLives.toString());

  if (newLives >= MAX_LIVES) {
    localStorage.removeItem('laddu_crush_lives_time');
  }
  return newLives;
}

export function refillAllLives(): void {
  localStorage.setItem('laddu_crush_lives', MAX_LIVES.toString());
  localStorage.removeItem('laddu_crush_lives_time');
}
