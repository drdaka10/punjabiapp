import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Exercise } from '@/content/units';
import { colors, radius, spacing } from '@/lib/theme';
import { speak } from '@/lib/tts';
import { Button } from './Button';
import { Choice } from './Choice';

type Props = {
  exercise: Exercise;
  onAnswered: (correct: boolean) => void;
};

export function ExerciseView({ exercise, onAnswered }: Props) {
  const [selected, setSelected] = useState<string | null>(null);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    setSelected(null);
    setChecked(false);
    if (exercise.kind === 'listen') {
      // Auto-play once on appear.
      const t = setTimeout(() => speak(exercise.speak), 250);
      return () => clearTimeout(t);
    }
  }, [exercise]);

  const isCorrect = selected === exercise.answer;

  function handleCheck() {
    if (!selected) return;
    setChecked(true);
  }

  function handleContinue() {
    onAnswered(isCorrect);
  }

  return (
    <View style={styles.container}>
      <Text style={styles.prompt}>{exercise.prompt}</Text>

      {exercise.kind === 'letter' && (
        <View style={styles.letterCard}>
          <Text style={styles.letterText}>{exercise.gurmukhi}</Text>
          <Pressable onPress={() => speak(exercise.gurmukhi)} style={styles.speakerSmall}>
            <Text style={styles.speakerSmallText}>🔊 Hear it</Text>
          </Pressable>
        </View>
      )}

      {exercise.kind === 'multipleChoice' && (
        <View style={styles.letterCard}>
          <Text style={styles.wordText}>{exercise.questionGurmukhi}</Text>
          <Pressable onPress={() => speak(exercise.questionGurmukhi)} style={styles.speakerSmall}>
            <Text style={styles.speakerSmallText}>🔊 Hear it</Text>
          </Pressable>
        </View>
      )}

      {exercise.kind === 'listen' && (
        <Pressable onPress={() => speak(exercise.speak)} style={styles.speakerLarge}>
          <Text style={styles.speakerLargeIcon}>🔊</Text>
          <Text style={styles.speakerLargeLabel}>Tap to replay</Text>
        </Pressable>
      )}

      <View style={styles.choices}>
        {exercise.choices.map((c) => {
          let state: 'idle' | 'selected' | 'correct' | 'incorrect' = 'idle';
          if (checked) {
            if (c === exercise.answer) state = 'correct';
            else if (c === selected) state = 'incorrect';
          } else if (c === selected) state = 'selected';

          return (
            <Choice
              key={c}
              label={c}
              state={state}
              onPress={() => !checked && setSelected(c)}
            />
          );
        })}
      </View>

      <View style={styles.footer}>
        {!checked ? (
          <Button label="Check" onPress={handleCheck} disabled={!selected} />
        ) : (
          <View>
            <Text style={[styles.feedback, { color: isCorrect ? colors.correct : colors.incorrect }]}>
              {isCorrect ? 'Correct!' : `Answer: ${exercise.answer}`}
            </Text>
            <Button label="Continue" onPress={handleContinue} />
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: spacing(2) },
  prompt: { fontSize: 18, color: colors.text, marginBottom: spacing(2), textAlign: 'center' },
  letterCard: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    paddingVertical: spacing(4),
    alignItems: 'center',
    marginBottom: spacing(2),
  },
  letterText: { fontSize: 96, color: colors.text },
  wordText: { fontSize: 44, color: colors.text },
  speakerSmall: { marginTop: spacing(1.5) },
  speakerSmallText: { color: colors.primary, fontSize: 14, fontWeight: '600' },
  speakerLarge: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    padding: spacing(4),
    alignItems: 'center',
    marginBottom: spacing(2),
  },
  speakerLargeIcon: { fontSize: 64 },
  speakerLargeLabel: { color: colors.muted, marginTop: spacing(1) },
  choices: { flex: 1 },
  footer: { paddingTop: spacing(1) },
  feedback: { fontSize: 16, fontWeight: '700', textAlign: 'center', marginBottom: spacing(1.5) },
});
