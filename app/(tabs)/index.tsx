import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ProgressBar } from '@/components/ProgressBar';
import { UNITS } from '@/content/units';
import { useAuth } from '@/lib/auth';
import { getCompletedLessons } from '@/lib/progress';
import { colors, radius, spacing } from '@/lib/theme';

export default function Home() {
  const { session } = useAuth();
  const router = useRouter();
  const [completed, setCompleted] = useState<Set<string>>(new Set());

  useFocusEffect(
    useCallback(() => {
      if (!session) return;
      getCompletedLessons(session.user.id)
        .then(setCompleted)
        .catch(() => {});
    }, [session]),
  );

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.heading}>Sikho</Text>
        <Text style={styles.subhead}>Pick up where you left off.</Text>

        {UNITS.map((unit) => {
          const total = unit.lessons.length;
          const done = unit.lessons.filter((l) => completed.has(l.id)).length;
          return (
            <View key={unit.id} style={styles.unit}>
              <View style={styles.unitHeader}>
                <Text style={styles.unitTitle}>{unit.title}</Text>
                <Text style={styles.unitCount}>{done}/{total}</Text>
              </View>
              <Text style={styles.unitDesc}>{unit.description}</Text>
              <ProgressBar value={total === 0 ? 0 : done / total} />

              <View style={styles.lessonList}>
                {unit.lessons.map((lesson) => {
                  const isDone = completed.has(lesson.id);
                  return (
                    <Pressable
                      key={lesson.id}
                      onPress={() => router.push(`/lesson/${lesson.id}`)}
                      style={({ pressed }) => [
                        styles.lessonRow,
                        isDone && styles.lessonRowDone,
                        pressed && styles.lessonRowPressed,
                      ]}
                    >
                      <Text style={styles.lessonTitle}>{lesson.title}</Text>
                      <Text style={styles.lessonMeta}>
                        {isDone ? '✓ Done' : `${lesson.exercises.length} exercises`}
                      </Text>
                    </Pressable>
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
  content: { padding: spacing(2), paddingBottom: spacing(6) },
  heading: { fontSize: 32, fontWeight: '800', color: colors.primary },
  subhead: { color: colors.muted, marginBottom: spacing(2) },
  unit: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing(2),
    marginBottom: spacing(2),
  },
  unitHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  unitTitle: { fontSize: 18, fontWeight: '700', color: colors.text },
  unitCount: { color: colors.muted, fontSize: 14 },
  unitDesc: { color: colors.muted, marginVertical: spacing(0.75) },
  lessonList: { marginTop: spacing(1.5) },
  lessonRow: {
    paddingVertical: spacing(1.5),
    paddingHorizontal: spacing(1.5),
    borderRadius: radius.md,
    backgroundColor: colors.bg,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing(0.75),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  lessonRowDone: { borderColor: colors.primary, backgroundColor: '#EFF6F1' },
  lessonRowPressed: { opacity: 0.85 },
  lessonTitle: { fontSize: 16, color: colors.text, fontWeight: '600' },
  lessonMeta: { fontSize: 13, color: colors.muted },
});
