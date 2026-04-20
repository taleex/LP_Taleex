import { useState, useCallback, useEffect } from 'react';

export interface RateLimitConfig {
  maxAttempts: number;
  windowMs: number; // Time window in milliseconds
  cooldownMs?: number; // Additional cooldown after max attempts
}

const DEFAULT_CONFIG: RateLimitConfig = {
  maxAttempts: 5,
  windowMs: 15 * 60 * 1000, // 15 minutes
  cooldownMs: 60 * 1000, // 1 minute extra cooldown
};

interface RateLimitState {
  attempts: number;
  lastAttemptTime: number | null;
  isLocked: boolean;
  remainingTime: number;
}

/**
 * Hook for implementing client-side rate limiting
 * Tracks attempts within a time window and applies cooldown after max attempts
 */
export const useRateLimit = (
  key: string,
  config: Partial<RateLimitConfig> = {}
) => {
  const finalConfig = { ...DEFAULT_CONFIG, ...config };
  const [state, setState] = useState<RateLimitState>({
    attempts: 0,
    lastAttemptTime: null,
    isLocked: false,
    remainingTime: 0,
  });

  // Load initial state from sessionStorage
  useEffect(() => {
    const stored = sessionStorage.getItem(`rateLimit_${key}`);
    if (stored) {
      try {
        const { attempts, lastAttemptTime, lockedUntil } = JSON.parse(stored);
        const now = Date.now();

        if (lockedUntil && now < lockedUntil) {
          setState({
            attempts,
            lastAttemptTime,
            isLocked: true,
            remainingTime: lockedUntil - now,
          });
        } else if (lastAttemptTime && now - lastAttemptTime < finalConfig.windowMs) {
          setState({
            attempts,
            lastAttemptTime,
            isLocked: false,
            remainingTime: 0,
          });
        } else {
          // Window has expired, reset
          sessionStorage.removeItem(`rateLimit_${key}`);
          setState({
            attempts: 0,
            lastAttemptTime: null,
            isLocked: false,
            remainingTime: 0,
          });
        }
      } catch (error) {
        console.error('Error loading rate limit state:', error);
        sessionStorage.removeItem(`rateLimit_${key}`);
      }
    }
  }, [key, finalConfig.windowMs]);

  // Update remaining time for locked state
  useEffect(() => {
    if (!state.isLocked) return;

    const timer = setInterval(() => {
      setState((prev) => {
        const newRemainingTime = Math.max(0, prev.remainingTime - 1000);
        if (newRemainingTime === 0) {
          // Clear from storage when unlocked
          sessionStorage.removeItem(`rateLimit_${key}`);
          return {
            attempts: 0,
            lastAttemptTime: null,
            isLocked: false,
            remainingTime: 0,
          };
        }
        return { ...prev, remainingTime: newRemainingTime };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [state.isLocked, key]);

  const recordAttempt = useCallback(() => {
    const now = Date.now();

    setState((prev) => {
      // Check if time window has expired
      if (prev.lastAttemptTime && now - prev.lastAttemptTime > finalConfig.windowMs) {
        // Window expired, reset
        const newState: RateLimitState = {
          attempts: 1,
          lastAttemptTime: now,
          isLocked: false,
          remainingTime: 0,
        };
        sessionStorage.setItem(`rateLimit_${key}`, JSON.stringify({
          attempts: 1,
          lastAttemptTime: now,
          lockedUntil: null,
        }));
        return newState;
      }

      // Check if already locked
      if (prev.isLocked) {
        return prev; // Don't increment, still locked
      }

      const newAttempts = prev.attempts + 1;
      const isNowLocked = newAttempts >= finalConfig.maxAttempts;
      const lockedUntil = isNowLocked ? now + (finalConfig.cooldownMs || 0) : null;

      sessionStorage.setItem(`rateLimit_${key}`, JSON.stringify({
        attempts: newAttempts,
        lastAttemptTime: now,
        lockedUntil,
      }));

      return {
        attempts: newAttempts,
        lastAttemptTime: now,
        isLocked: isNowLocked,
        remainingTime: isNowLocked ? (finalConfig.cooldownMs || 0) : 0,
      };
    });
  }, [key, finalConfig]);

  const reset = useCallback(() => {
    sessionStorage.removeItem(`rateLimit_${key}`);
    setState({
      attempts: 0,
      lastAttemptTime: null,
      isLocked: false,
      remainingTime: 0,
    });
  }, [key]);

  const getRemainingMinutes = useCallback(() => {
    return Math.ceil(state.remainingTime / 1000 / 60);
  }, [state.remainingTime]);

  return {
    isLocked: state.isLocked,
    attempts: state.attempts,
    maxAttempts: finalConfig.maxAttempts,
    remainingTime: state.remainingTime,
    remainingMinutes: getRemainingMinutes(),
    recordAttempt,
    reset,
  };
};
