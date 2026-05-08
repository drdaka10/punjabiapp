import { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import {
  DAILY_XP_GOAL,
  MAX_HEARTS,
  useGamification,
} from '@/lib/gamification';
import { colors, radius, spacing } from '@/lib/theme';

export function StatusHeader() {
  const streakDays = useGamification((s) => s.streakDays);
  const hearts = useGamification((s) => s.hearts);
  const dailyXp = useGamification((s) => s.dailyXp);
  const dailyXpDate = useGamification((s) => s.dailyXpDate);
  const tick = useGamification((s) => s.tick);

  useEffect(() => {
    tick();
    const id = setInterval(tick, 60_000);
    return () => clearInterval(id);
  }, [tick]);

  const today = new Date().toISOString().slice(0, 10);
  const todayXp = dailyXpDate === today ? dailyXp : 0;

  return (
    <View style={styles.row}>
      <Stat icon="🔥" value={`${streakDays}`} label="streak" tint={colors.accent} />
      <Stat
        icon="❤️"
        value={`${hearts}/${MAX_HEARTS}`}
        label="hearts"
        tint={hearts === 0 ? colors.incorrect : colors.incorrect}
      />
      <Stat
        icon="⭐"
        value={`${todayXp}/${DAILY_XP_GOAL}`}
        label="today"
        tint={colors.primary}
      />
    </View>
  );
}

function Stat({
  icon,
  value,
  label,
  tint,
}: {
  icon: string;
  value: string;
  label: string;
  tint: string;
}) {
  return (
    <View style={styles.stat}>
      <Text style={styles.icon}>{icon}</Text>
      <View>
        <Text style={[styles.value, { color: tint }]}>{value}</Text>
        <Text style={styles.label}>{label}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: spacing(1),
    paddingHorizontal: spacing(2),
    paddingTop: spacing(1),
    paddingBottom: spacing(1.5),
  },
  stat: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing(1),
    paddingVertical: spacing(1),
    paddingHorizontal: spacing(1.25),
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  icon: { fontSize: 22 },
  value: { fontSize: 16, fontWeight: '800' },
  label: { fontSize: 11, color: colors.muted, textTransform: 'uppercase', letterSpacing: 0.5 },
});
