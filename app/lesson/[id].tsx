import { useLocalSearchParams, useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '@/components/Button';
import { ExerciseView } from '@/components/ExerciseView';
import { ProgressBar } from '@/components/ProgressBar';
import { findLesson } from '@/content/units';
import { useAuth } from '@/lib/auth';
import {
  MAX_CROWNS,
  XP_PER_LESSON,
  useGamification,
} from '@/lib/gamification';
import { markLessonComplete, recordReview } from '@/lib/progress';
import { colors, spacing } from '@/lib/theme';

type Outcome = 'won' | 'failed' | null;

export default function LessonScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { session } = useAuth();
  const lesson = useMemo(() => (id ? findLesson(id) : undefined), [id]);

  const hearts = useGamification((s) => s.hearts);
  const loseHeart = useGamification((s) => s.loseHeart);
  const recordLessonCompletion = useGamification((s) => s.recordLessonCompletion);

  const [index, setIndex] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [outcome, setOutcome] = useState<Outcome>(null);
  const [reward, setReward] = useState<{
    xpEarned: number;
    crownEarned: boolean;
    newCrowns: number;
  } | null>(null);

  if (!lesson) {
    return (
      <SafeAreaView style={styles.root}>
        <View style={styles.center}>
          <Text style={styles.heading}>Lesson not found</Text>
          <Button label="Go back" onPress={() => router.back()} />
        </View>
      </SafeAreaView>
    );
  }

  async function handleAnswered(correct: boolean) {
    if (!lesson || !session) return;

    if (correct) {
      setCorrectCount((c) => c + 1);
    } else {
      const stillAlive = loseHeart();
      if (!stillAlive) {
        setOutcome('failed');
        const ex = lesson.exercises[index];
        recordReview(session.user.id, ex.cardId, 0).catch(() => {});
        return;
      }
    }

    const ex = lesson.exercises[index];
    recordReview(session.user.id, ex.cardId, correct ? 2 : 0).catch(() => {});

    if (index + 1 >= lesson.exercises.length) {
      const finalCorrect = correctCount + (correct ? 1 : 0);
      const finalScore = Math.round((finalCorrect / lesson.exercises.length) * 100);
      markLessonComplete(session.user.id, lesson.id, finalScore).catch(() => {});
      const result = recordLessonCompletion(lesson.id);
      const newCrowns = useGamification.getState().lessonCrowns[lesson.id] ?? 0;
      setReward({
        xpEarned: result.xpEarned,
        crownEarned: result.crownEarned,
        newCrowns,
      });
      setOutcome('won');
    } else {
      setIndex(index + 1);
    }
  }

  if (outcome === 'failed') {
    return (
      <SafeAreaView style={styles.root}>
        <View style={styles.center}>
          <Text style={styles.failIcon}>💔</Text>
          <Text style={styles.heading}>Out of hearts</Text>
          <Text style={styles.subtle}>
            Take a break — hearts refill over time.
          </Text>
          <Button label="Back to learn" onPress={() => router.back()} />
        </View>
      </SafeAreaView>
    );
  }

  if (outcome === 'won' && reward) {
    const total = lesson.exercises.length;
    const pct = Math.round((correctCount / total) * 100);
    return (
      <SafeAreaView style={styles.root}>
        <View style={styles.center}>
          <Text style={styles.celebrateIcon}>
            {reward.newCrowns >= MAX_CROWNS ? '👑' : '🎉'}
          </Text>
          <Text style={styles.heading}>Lesson complete!</Text>
          <View style={styles.rewardRow}>
            <Reward icon="⭐" value={`+${reward.xpEarned}`} label="XP" />
            <Reward
              icon="✓"
              value={`${correctCount}/${total}`}
              label={`${pct}%`}
            />
            {reward.crownEarned && (
              <Reward icon="👑" value={`${reward.newCrowns}`} label="crown" />
            )}
          </View>
          <Button label="Continue" onPress={() => router.back()} />
        </View>
      </SafeAreaView>
    );
  }

  const progress = index / lesson.exercises.length;

  return (
    <SafeAreaView style={styles.root}>
      <View style={styles.headerRow}>
        <Pressable onPress={() => router.back()} hitSlop={12}>
          <Text style={styles.close}>✕</Text>
        </Pressable>
        <View style={styles.progressWrap}>
          <ProgressBar value={progress} />
        </View>
        <Text style={styles.heartCount}>❤️ {hearts}</Text>
      </View>

      <ExerciseView
        key={index}
        exercise={lesson.exercises[index]}
        onAnswered={handleAnswered}
      />
    </SafeAreaView>
  );
}

function Reward({
  icon,
  value,
  label,
}: {
  icon: string;
  value: string;
  label: string;
}) {
  return (
    <View style={styles.reward}>
      <Text style={styles.rewardIcon}>{icon}</Text>
      <Text style={styles.rewardValue}>{value}</Text>
      <Text style={styles.rewardLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing(2),
    paddingTop: spacing(1),
    paddingBottom: spacing(1.5),
    gap: 12,
  },
  close: { fontSize: 22, color: colors.muted, paddingHorizontal: 4 },
  progressWrap: { flex: 1 },
  heartCount: { fontSize: 16, fontWeight: '700', color: colors.incorrect },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing(3),
  },
  heading: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.text,
    marginBottom: spacing(1),
    textAlign: 'center',
  },
  subtle: {
    color: colors.muted,
    textAlign: 'center',
    marginBottom: spacing(3),
  },
  failIcon: { fontSize: 64, marginBottom: spacing(1) },
  celebrateIcon: { fontSize: 64, marginBottom: spacing(1) },
  rewardRow: {
    flexDirection: 'row',
    gap: spacing(1.5),
    marginVertical: spacing(2),
  },
  reward: {
    minWidth: 84,
    paddingVertical: spacing(1.25),
    paddingHorizontal: spacing(1.5),
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    backgroundColor: colors.surface,
  },
  rewardIcon: { fontSize: 22 },
  rewardValue: { fontSize: 18, fontWeight: '800', color: colors.text, marginTop: 2 },
  rewardLabel: { fontSize: 11, color: colors.muted, textTransform: 'uppercase' },
});
