import { supabase } from './supabase';
import { initialState, review, SrsState } from './srs';

export async function markLessonComplete(
  userId: string,
  lessonId: string,
  score: number,
) {
  const { error } = await supabase
    .from('lesson_progress')
    .upsert(
      { user_id: userId, lesson_id: lessonId, score, completed_at: new Date().toISOString() },
      { onConflict: 'user_id,lesson_id' },
    );
  if (error) throw error;
}

export async function getCompletedLessons(userId: string): Promise<Set<string>> {
  const { data, error } = await supabase
    .from('lesson_progress')
    .select('lesson_id')
    .eq('user_id', userId);
  if (error) throw error;
  return new Set((data ?? []).map((r) => r.lesson_id as string));
}

export async function recordReview(
  userId: string,
  cardId: string,
  quality: 0 | 1 | 2 | 3,
) {
  const { data } = await supabase
    .from('srs_cards')
    .select('ease, interval_days, repetitions, due_at')
    .eq('user_id', userId)
    .eq('card_id', cardId)
    .maybeSingle();

  const prev: SrsState = data
    ? {
        ease: data.ease,
        intervalDays: data.interval_days,
        repetitions: data.repetitions,
        dueAt: data.due_at,
      }
    : initialState();

  const next = review(prev, quality);

  const { error } = await supabase.from('srs_cards').upsert(
    {
      user_id: userId,
      card_id: cardId,
      ease: next.ease,
      interval_days: next.intervalDays,
      repetitions: next.repetitions,
      due_at: next.dueAt,
      updated_at: new Date().toISOString(),
    },
    { onConflict: 'user_id,card_id' },
  );
  if (error) throw error;
}

export async function getDueCardIds(userId: string): Promise<string[]> {
  const { data, error } = await supabase
    .from('srs_cards')
    .select('card_id')
    .eq('user_id', userId)
    .lte('due_at', new Date().toISOString());
  if (error) throw error;
  return (data ?? []).map((r) => r.card_id as string);
}
