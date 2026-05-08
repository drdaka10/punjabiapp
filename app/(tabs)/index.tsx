import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  LessonNode,
  LessonStatus,
  lessonNodeOffset,
} from '@/components/LessonNode';
import { StatusHeader } from '@/components/StatusHeader';
import { UNITS } from '@/content/units';
import { useAuth } from '@/lib/auth';
import { MAX_CROWNS, useGamification } from '@/lib/gamification';
import { getCompletedLessons } from '@/lib/progress';
import { colors, radius, spacing } from '@/lib/theme';

export default function Home() {
  const { session } = useAuth();
  const router = useRouter();
  const [completed, setCompleted] = useState<Set<string>>(new Set());
  const lessonCrowns = useGamification((s) => s.lessonCrowns);

  useFocusEffect(
    useCallback(() => {
      if (!session) return;
      getCompletedLessons(session.user.id)
        .then(setCompleted)
        .catch(() => {});
    }, [session]),
  );

  const flatLessons = UNITS.flatMap((u) => u.lessons.map((l) => l.id));

  function statusFor(lessonId: string, idx: number): LessonStatus {
    const crowns = lessonCrowns[lessonId] ?? 0;
    const isDone = completed.has(lessonId) || crowns > 0;
    if (crowns >= MAX_CROWNS) return 'mastered';
    if (idx === 0) return isDone ? 'inProgress' : 'available';
    const prev = flatLessons[idx - 1];
    const prevDone = completed.has(prev) || (lessonCrowns[prev] ?? 0) > 0;
    if (!prevDone) return 'locked';
    return isDone ? 'inProgress' : 'available';
  }

  let runningIndex = 0;

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      <View style={styles.topBar}>
        <Text style={styles.heading}>Sikho</Text>
      </View>
      <StatusHeader />

      <ScrollView contentContainerStyle={styles.content}>
        {UNITS.map((unit) => {
          const total = unit.lessons.length;
          const masteredCount = unit.lessons.filter(
            (l) => (lessonCrowns[l.id] ?? 0) >= MAX_CROWNS,
          ).length;

          return (
            <View key={unit.id} style={styles.unit}>
              <View style={styles.unitBanner}>
                <Text style={styles.unitTitle}>{unit.title}</Text>
                <Text style={styles.unitDesc}>{unit.description}</Text>
                <Text style={styles.unitCount}>
                  {masteredCount}/{total} mastered
                </Text>
              </View>

              <View style={styles.path}>
                {unit.lessons.map((lesson, i) => {
                  const idx = runningIndex++;
                  const status = statusFor(lesson.id, idx);
                  const crowns = lessonCrowns[lesson.id] ?? 0;
                  return (
                    <LessonNode
                      key={lesson.id}
                      title={lesson.title}
                      crowns={crowns}
                      status={status}
                      offset={lessonNodeOffset(i)}
                      index={i}
                      onPress={() => router.push(`/lesson/${lesson.id}`)}
                    />
                  );
                })}
              </View>
            </View>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  topBar: {
    paddingHorizontal: spacing(2),
    paddingTop: spacing(1),
  },
  heading: { fontSize: 28, fontWeight: '800', color: colors.primary },
  content: { padding: spacing(2), paddingBottom: spacing(6) },
  unit: { marginBottom: spacing(3) },
  unitBanner: {
    backgroundColor: colors.primary,
    borderRadius: radius.lg,
    padding: spacing(2),
    marginBottom: spacing(1.5),
  },
  unitTitle: { fontSize: 18, fontWeight: '800', color: colors.primaryText },
  unitDesc: { color: colors.primaryText, opacity: 0.85, marginTop: 4 },
  unitCount: {
    color: colors.primaryText,
    opacity: 0.85,
    marginTop: spacing(0.75),
    fontSize: 13,
    fontWeight: '600',
  },
  path: { paddingHorizontal: spacing(2) },
});
