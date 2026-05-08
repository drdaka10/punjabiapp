import { useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '@/components/Button';
import { ProgressBar } from '@/components/ProgressBar';
import { UNITS } from '@/content/units';
import { useAuth } from '@/lib/auth';
import {
  DAILY_XP_GOAL,
  MAX_CROWNS,
  useGamification,
} from '@/lib/gamification';
import { getCompletedLessons, getDueCardIds } from '@/lib/progress';
import { colors, radius, spacing } from '@/lib/theme';

export default function Profile() {
  const { session, signOut } = useAuth();
  const [completedCount, setCompletedCount] = useState(0);
  const [dueCount, setDueCount] = useState(0);

  const xp = useGamification((s) => s.xp);
  const streakDays = useGamification((s) => s.streakDays);
  const dailyXp = useGamification((s) => s.dailyXp);
  const dailyXpDate = useGamification((s) => s.dailyXpDate);
  const lessonCrowns = useGamification((s) => s.lessonCrowns);

  const totalLessons = UNITS.reduce((n, u) => n + u.lessons.length, 0);
  const totalCrownsPossible = totalLessons * MAX_CROWNS;
  const totalCrownsEarned = Object.values(lessonCrowns).reduce(
    (n, c) => n + c,
    0,
  );

  const today = new Date().toISOString().slice(0, 10);
  const todayXp = dailyXpDate === today ? dailyXp : 0;
  const goalProgress = Math.min(1, todayXp / DAILY_XP_GOAL);

  useFocusEffect(
    useCallback(() => {
      if (!session) return;
      Promise.all([
        getCompletedLessons(session.user.id),
        getDueCardIds(session.user.id),
      ])
        .then(([done, due]) => {
          setCompletedCount(done.size);
          setDueCount(due.length);
        })
        .catch(() => {});
    }, [session]),
  );

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.heading}>Profile</Text>
        <Text style={styles.email}>{session?.user.email}</Text>

        <View style={styles.bigStatRow}>
          <BigStat icon="🔥" value={streakDays} label="day streak" />
          <BigStat icon="⭐" value={xp} label="total XP" />
          <BigStat
            icon="👑"
            value={totalCrownsEarned}
            label={`of ${totalCrownsPossible}`}
          />
        </View>

        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Daily goal</Text>
            <Text style={styles.cardMeta}>
              {todayXp}/{DAILY_XP_GOAL} XP
            </Text>
          </View>
          <ProgressBar value={goalProgress} />
          {goalProgress >= 1 && (
            <Text style={styles.goalDone}>Goal complete — nice work!</Text>
          )}
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Progress</Text>
          <View style={styles.smallStatRow}>
            <SmallStat value={completedCount} label={`of ${totalLessons} lessons`} />
            <SmallStat value={dueCount} label="cards due" />
          </View>
        </View>

        <Button label="Sign out" variant="secondary" onPress={signOut} />
      </ScrollView>
    </SafeAreaView>
  );
}

function BigStat({
  icon,
  value,
  label,
}: {
  icon: string;
  value: number;
  label: string;
}) {
  return (
    <View style={styles.bigStat}>
      <Text style={styles.bigIcon}>{icon}</Text>
      <Text style={styles.bigValue}>{value}</Text>
      <Text style={styles.bigLabel}>{label}</Text>
    </View>
  );
}

function SmallStat({ value, label }: { value: number; label: string }) {
  return (
    <View style={styles.smallStat}>
      <Text style={styles.smallValue}>{value}</Text>
      <Text style={styles.smallLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  content: { padding: spacing(2.5), paddingBottom: spacing(6) },
  heading: { fontSize: 28, fontWeight: '800', color: colors.text },
  email: { color: colors.muted, marginBottom: spacing(2) },

  bigStatRow: { flexDirection: 'row', gap: spacing(1.25), marginBottom: spacing(2) },
  bigStat: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing(1.5),
    alignItems: 'center',
  },
  bigIcon: { fontSize: 26 },
  bigValue: { fontSize: 24, fontWeight: '800', color: colors.text, marginTop: 4 },
  bigLabel: { fontSize: 11, color: colors.muted, marginTop: 2, textAlign: 'center' },

  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing(2),
    marginBottom: spacing(2),
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing(1),
  },
  cardTitle: { fontSize: 16, fontWeight: '700', color: colors.text },
  cardMeta: { fontSize: 13, color: colors.muted },
  goalDone: { color: colors.primary, marginTop: spacing(1), fontWeight: '600' },

  smallStatRow: { flexDirection: 'row', gap: spacing(2), marginTop: spacing(1) },
  smallStat: { flex: 1 },
  smallValue: { fontSize: 22, fontWeight: '800', color: colors.primary },
  smallLabel: { fontSize: 13, color: colors.muted },
});
