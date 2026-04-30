// Minimal SM-2 spaced-repetition scheduler.
// Quality: 0 = forgot, 1 = hard, 2 = good, 3 = easy.

export type SrsState = {
  ease: number;
  intervalDays: number;
  repetitions: number;
  dueAt: string; // ISO
};

export function initialState(): SrsState {
  return {
    ease: 2.5,
    intervalDays: 0,
    repetitions: 0,
    dueAt: new Date().toISOString(),
  };
}

export function review(state: SrsState, quality: 0 | 1 | 2 | 3): SrsState {
  let { ease, intervalDays, repetitions } = state;

  if (quality === 0) {
    repetitions = 0;
    intervalDays = 1;
  } else {
    repetitions += 1;
    if (repetitions === 1) intervalDays = 1;
    else if (repetitions === 2) intervalDays = 3;
    else intervalDays = Math.round(intervalDays * ease);
  }

  // SM-2 ease adjustment, mapping our 4-step quality to the classic 0-5 scale.
  const q = quality === 0 ? 2 : quality === 1 ? 3 : quality === 2 ? 4 : 5;
  ease = Math.max(1.3, ease + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02)));

  const due = new Date();
  due.setDate(due.getDate() + intervalDays);

  return {
    ease,
    intervalDays,
    repetitions,
    dueAt: due.toISOString(),
  };
}
