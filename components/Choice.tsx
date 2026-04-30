import { Pressable, StyleSheet, Text } from 'react-native';
import { colors, radius } from '@/lib/theme';

type Props = {
  label: string;
  onPress: () => void;
  state: 'idle' | 'selected' | 'correct' | 'incorrect' | 'disabled';
};

export function Choice({ label, onPress, state }: Props) {
  return (
    <Pressable
      onPress={onPress}
      disabled={state !== 'idle' && state !== 'selected'}
      style={[styles.box, stateStyles[state]]}
    >
      <Text style={[styles.label, state === 'correct' || state === 'incorrect' ? styles.boldLabel : null]}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  box: {
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: radius.md,
    borderWidth: 2,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    marginVertical: 6,
    minHeight: 56,
    justifyContent: 'center',
  },
  label: { fontSize: 16, color: colors.text, textAlign: 'center' },
  boldLabel: { fontWeight: '700' },
});

const stateStyles = StyleSheet.create({
  idle: {},
  selected: { borderColor: colors.primary },
  correct: { borderColor: colors.correct, backgroundColor: '#E8F4ED' },
  incorrect: { borderColor: colors.incorrect, backgroundColor: '#F8E6E6' },
  disabled: { opacity: 0.5 },
});
