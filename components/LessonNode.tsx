import { Pressable, StyleSheet, Text, View } from 'react-native';
import { MAX_CROWNS } from '@/lib/gamification';
import { colors, radius, spacing } from '@/lib/theme';

type Status = 'locked' | 'available' | 'inProgress' | 'mastered';

type Props = {
  title: string;
  crowns: number;
  status: Status;
  offset: number;
  onPress: () => void;
};

export function LessonNode({ title, crowns, status, offset, onPress }: Props) {
  const locked = status === 'locked';
  const mastered = status === 'mastered';
  const tint = mastered
    ? colors.accent
    : locked
    ? colors.border
    : colors.primary;

  return (
    <View style={[styles.row, { transform: [{ translateX: offset }] }]}>
      <Pressable
        disabled={locked}
        onPress={onPress}
        style={({ pressed }) => [
          styles.outer,
          { borderColor: tint, opacity: locked ? 0.55 : 1 },
          pressed && !locked && styles.pressed,
        ]}
      >
        <View style={[styles.inner, { backgroundColor: tint }]}>
          {mastered ? (
            <Text style={styles.crownIcon}>👑</Text>
          ) : locked ? (
            <Text style={styles.lockIcon}>🔒</Text>
          ) : (
            <Text style={styles.starIcon}>⭐</Text>
          )}
        </View>
      </Pressable>
      <View style={styles.labelWrap}>
        <Text style={[styles.title, locked && styles.titleLocked]} numberOfLines={1}>
          {title}
        </Text>
        <View style={styles.crownPips}>
          {Array.from({ length: MAX_CROWNS }).map((_, i) => (
            <Text
              key={i}
              style={[
                styles.pip,
                { color: i < crowns ? colors.accent : colors.border },
              ]}
            >
              ★
            </Text>
          ))}
        </View>
      </View>
    </View>
  );
}

const NODE = 84;

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing(1.5),
    marginVertical: spacing(1),
  },
  outer: {
    width: NODE,
    height: NODE,
    borderRadius: NODE / 2,
    borderWidth: 4,
    padding: 4,
    backgroundColor: colors.surface,
  },
  inner: {
    flex: 1,
    borderRadius: NODE / 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: { transform: [{ scale: 0.96 }] },
  starIcon: { fontSize: 30 },
  lockIcon: { fontSize: 26 },
  crownIcon: { fontSize: 32 },
  labelWrap: { flex: 1 },
  title: { fontSize: 15, fontWeight: '700', color: colors.text },
  titleLocked: { color: colors.muted },
  crownPips: { flexDirection: 'row', gap: 2, marginTop: 4 },
  pip: { fontSize: 14 },
});

export const LESSON_NODE_SIZE = NODE;
export const lessonNodeOffset = (i: number) => {
  // Subtle wave: -1, +1, +2, +1, -1, -2, ...
  const pattern = [0, 28, 48, 28, 0, -28, -48, -28];
  return pattern[i % pattern.length];
};

export type { Status as LessonStatus };
