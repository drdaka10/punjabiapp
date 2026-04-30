import { useLocalSearchParams, useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '@/components/Button';
import { ExerciseView } from '@/components/ExerciseView';
import { ProgressBar } from '@/components/ProgressBar';
import { findLesson } from '@/content/units';
import { useAuth } from '@/lib/auth';
import { markLessonComplete, recordReview } from '@/lib/progress';
import { colors, spacing } from '@/lib/theme';

export default function LessonScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { session } = useAuth();
  const lesson = useMemo(() => (id ? findLesson(id) : undefined), [id]);

  const [index, setIndex] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [finished, setFinished] = useState(false);

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
    if (correct) setCorrectCount((c) => c + 1);

    const ex = lesson.exercises[index];
    // SM-2 quality: correct = good (2), incorrect = forgot (0).
    recordReview(session.user.id, ex.cardId, correct ? 2 : 0).catch(() => {});

    if (index + 1 >= lesson.exercises.length) {
      const finalScore = Math.round(((correctCount + (correct ? 1 : 0)) / lesson.exercises.length) * 100);
      markLessonComplete(session.user.id, lesson.id, finalScore).catch(() => {});
      setFinished(true);
    } else {
      setIndex(index + 1);
    }
  }

  if (finished) {
    const total = lesson.exercises.length;
    const pct = Math.round((correctCount / total) * 100);
    return (
      <SafeAreaView style={styles.root}>
        <View style={styles.center}>
          <Text style={styles.heading}>Lesson complete!</Text>
          <Text style={styles.score}>{correctCount} / {total} correct</Text>
          <Text style={styles.scorePct}>{pct}%</Text>
          <Button label="Done" onPress={() => router.back()} />
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
      </View>

      <ExerciseView
        key={index}
        exercise={lesson.exercises[index]}
        onAnswered={handleAnswered}
      />
    </SafeAreaView>
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
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: spacing(3) },
  heading: { fontSize: 28, fontWeight: '800', color: colors.text, marginBottom: spacing(1) },
  score: { fontSize: 18, color: colors.muted, marginBottom: spacing(0.5) },
  scorePct: { fontSize: 48, fontWeight: '800', color: colors.primary, marginBottom: spacing(3) },
});
