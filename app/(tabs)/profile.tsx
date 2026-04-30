import { useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '@/components/Button';
import { UNITS } from '@/content/units';
import { useAuth } from '@/lib/auth';
import { getCompletedLessons, getDueCardIds } from '@/lib/progress';
import { colors, radius, spacing } from '@/lib/theme';

export default function Profile() {
  const { session, signOut } = useAuth();
  const [completedCount, setCompletedCount] = useState(0);
  const [dueCount, setDueCount] = useState(0);

  const totalLessons = UNITS.reduce((n, u) => n + u.lessons.length, 0);

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
      <View style={styles.content}>
        <Text style={styles.heading}>Profile</Text>
        <Text style={styles.email}>{session?.user.email}</Text>

        <View style={styles.statRow}>
          <View style={styles.stat}>
            <Text style={styles.statValue}>{completedCount}</Text>
            <Text style={styles.statLabel}>of {totalLessons} lessons</Text>
          </View>
          <View style={styles.stat}>
            <Text style={styles.statValue}>{dueCount}</Text>
            <Text style={styles.statLabel}>cards due</Text>
          </View>
        </View>

        <View style={{ flex: 1 }} />

        <Button label="Sign out" variant="secondary" onPress={signOut} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  content: { flex: 1, padding: spacing(2.5) },
  heading: { fontSize: 28, fontWeight: '800', color: colors.text },
  email: { color: colors.muted, marginBottom: spacing(3) },
  statRow: { flexDirection: 'row', gap: 12 },
  stat: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing(2),
    alignItems: 'center',
  },
  statValue: { fontSize: 32, fontWeight: '800', color: colors.primary },
  statLabel: { color: colors.muted, marginTop: 2, fontSize: 13 },
});
