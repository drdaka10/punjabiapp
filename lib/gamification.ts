import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export const MAX_HEARTS = 5;
export const HEART_REFILL_MS = 30 * 60 * 1000;
export const DAILY_XP_GOAL = 30;
export const XP_PER_LESSON = 10;
export const MAX_CROWNS = 5;

type State = {
  xp: number;
  streakDays: number;
  lastActiveDate: string | null;
  hearts: number;
  nextHeartAt: number | null;
  dailyXp: number;
  dailyXpDate: string | null;
  lessonCrowns: Record<string, number>;
  dismissedTtsHint: boolean;
};

type Actions = {
  tick: () => void;
  loseHeart: () => boolean;
  recordLessonCompletion: (lessonId: string) => {
    xpEarned: number;
    crownEarned: boolean;
    newStreak: boolean;
    goalHitNow: boolean;
  };
  dismissTtsHint: () => void;
  resetForTesting: () => void;
};

const today = () => new Date().toISOString().slice(0, 10);
const isYesterday = (a: string, b: string) => {
  const da = new Date(a + 'T00:00:00Z').getTime();
  const db = new Date(b + 'T00:00:00Z').getTime();
  return db - da === 24 * 60 * 60 * 1000;
};

const initialState: State = {
  xp: 0,
  streakDays: 0,
  lastActiveDate: null,
  hearts: MAX_HEARTS,
  nextHeartAt: null,
  dailyXp: 0,
  dailyXpDate: null,
  lessonCrowns: {},
  dismissedTtsHint: false,
};

export const useGamification = create<State & Actions>()(
  persist(
    (set, get) => ({
      ...initialState,

      tick: () => {
        const s = get();
        const now = Date.now();
        if (s.hearts < MAX_HEARTS && s.nextHeartAt && now >= s.nextHeartAt) {
          let hearts = s.hearts;
          let nextHeartAt: number | null = s.nextHeartAt;
          while (hearts < MAX_HEARTS && nextHeartAt && now >= nextHeartAt) {
            hearts += 1;
            nextHeartAt = hearts < MAX_HEARTS ? nextHeartAt + HEART_REFILL_MS : null;
          }
          set({ hearts, nextHeartAt });
        }
        const t = today();
        if (s.dailyXpDate && s.dailyXpDate !== t) {
          set({ dailyXp: 0, dailyXpDate: t });
        }
      },

      loseHeart: () => {
        const s = get();
        if (s.hearts <= 0) return false;
        const newHearts = s.hearts - 1;
        set({
          hearts: newHearts,
          nextHeartAt: s.nextHeartAt ?? Date.now() + HEART_REFILL_MS,
        });
        return newHearts > 0;
      },

      recordLessonCompletion: (lessonId) => {
        const s = get();
        const t = today();
        const prevCrowns = s.lessonCrowns[lessonId] ?? 0;
        const crownEarned = prevCrowns < MAX_CROWNS;
        const newCrowns = crownEarned ? prevCrowns + 1 : prevCrowns;

        let streakDays = s.streakDays;
        let newStreak = false;
        if (s.lastActiveDate === t) {
          // Already counted today.
        } else if (s.lastActiveDate && isYesterday(s.lastActiveDate, t)) {
          streakDays += 1;
          newStreak = true;
        } else {
          streakDays = 1;
          newStreak = true;
        }

        const dailyXpDate = s.dailyXpDate === t ? s.dailyXpDate : t;
        const carriedDailyXp = s.dailyXpDate === t ? s.dailyXp : 0;
        const newDailyXp = carriedDailyXp + XP_PER_LESSON;
        const goalHitNow =
          carriedDailyXp < DAILY_XP_GOAL && newDailyXp >= DAILY_XP_GOAL;

        set({
          xp: s.xp + XP_PER_LESSON,
          streakDays,
          lastActiveDate: t,
          dailyXp: newDailyXp,
          dailyXpDate,
          lessonCrowns: { ...s.lessonCrowns, [lessonId]: newCrowns },
        });

        return { xpEarned: XP_PER_LESSON, crownEarned, newStreak, goalHitNow };
      },

      dismissTtsHint: () => set({ dismissedTtsHint: true }),

      resetForTesting: () => set(initialState),
    }),
    {
      name: 'sikho-gamification-v1',
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);

export function crownsForLesson(lessonId: string): number {
  return useGamification.getState().lessonCrowns[lessonId] ?? 0;
}

export function dailyGoalProgress(state: Pick<State, 'dailyXp' | 'dailyXpDate'>): number {
  if (state.dailyXpDate !== today()) return 0;
  return Math.min(1, state.dailyXp / DAILY_XP_GOAL);
}
