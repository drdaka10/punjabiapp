import { useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '@/components/Button';
import { findCard } from '@/content/units';
import { useAuth } from '@/lib/auth';
import { getDueCardIds, recordReview } from '@/lib/progress';
import { colors, radius, spacing } from '@/lib/theme';
import { speak } from '@/lib/tts';

type Phase = 'idle' | 'reviewing' | 'done';

export default function Review() {
  const { session } = useAuth();
  const [dueIds, setDueIds] = useState<string[]>([]);
  const [phase, setPhase] = useState<Phase>('idle');
  const [index, setIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);

  const refresh = useCallback(() => {
    if (!session) return;
    getDueCardIds(session.user.id)
      .then(setDueIds)
      .catch(() => {});
  }, [session]);

  useFocusEffect(
    useCallback(() => {
      refresh();
      setPhase('idle');
      setIndex(0);
      setRevealed(false);
    }, [refresh]),
  );

  function start() {
    if (dueIds.length === 0) return;
    setPhase('reviewing');
    setIndex(0);
    setRevealed(false);
  }

  async function grade(quality: 0 | 1 | 2 | 3) {
    if (!session) return;
    const cardId = dueIds[index];
    await recordReview(session.user.id, cardId, quality).catch(() => {});
    if (index + 1 >= dueIds.length) {
      setPhase('done');
    } else {
      setIndex(index + 1);
      setRevealed(false);
    }
  }

  if (phase === 'idle') {
    return (
      <SafeAreaView style={styles.root} edges={['top']}>
        <View style={styles.center}>
          <Text style={styles.heading}>Review</Text>
          <Text style={styles.subhead}>
            {dueIds.length === 0
              ? 'Nothing due. Finish a lesson to add cards.'
              : `${dueIds.length} card${dueIds.length === 1 ? '' : 's'} due.`}
          </Text>
          <Button label="Start review" onPress={start} disabled={dueIds.length === 0} />
        </View>
      </SafeAreaView>
    );
  }

  if (phase === 'done') {
    return (
      <SafeAreaView style={styles.root} edges={['top']}>
        <View style={styles.center}>
          <Text style={styles.heading}>All clear ✓</Text>
          <Text style={styles.subhead}>You've reviewed every due card.</Text>
        </View>
      </SafeAreaView>
    );
  }

  const cardId = dueIds[index];
  const card = findCard(cardId);
  if (!card) {
    return (
      <SafeAreaView style={styles.root} edges={['top']}>
        <View style={styles.center}>
          <Text style={styles.subhead}>Card missing from content. Skipping.</Text>
          <Button label="Skip" onPress={() => grade(2)} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.counter}>{index + 1} / {dueIds.length}</Text>

        <View style={styles.card}>
          <Text style={styles.gurmukhi}>{card.gurmukhi}</Text>
          <Pressable onPress={() => speak(card.gurmukhi)}>
            <Text style={styles.speaker}>🔊 Hear it</Text>
          </Pressable>
          {revealed && (
            <View style={styles.answerBlock}>
              <Text style={styles.translit}>{card.translit}</Text>
              <Text style={styles.english}>{card.english}</Text>
            </View>
          )}
        </View>

        {!revealed ? (
          <Button label="Show answer" onPress={() => setRevealed(true)} />
        ) : (
          <View style={styles.gradeRow}>
            <Pressable style={[styles.gradeBtn, styles.again]} onPress={() => grade(0)}>
              <Text style={styles.gradeLabel}>Again</Text>
            </Pressable>
            <Pressable style={[styles.gradeBtn, styles.hard]} onPress={() => grade(1)}>
              <Text style={styles.gradeLabel}>Hard</Text>
            </Pressable>
            <Pressable style={[styles.gradeBtn, styles.good]} onPress={() => grade(2)}>
              <Text style={[styles.gradeLabel, { color: colors.primaryText }]}>Good</Text>
            </Pressable>
            <Pressable style={[styles.gradeBtn, styles.easy]} onPress={() => grade(3)}>
              <Text style={[styles.gradeLabel, { color: colors.primaryText }]}>Easy</Text>
            </Pressable>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  content: { padding: spacing(2) },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: spacing(3) },
  heading: { fontSize: 28, fontWeight: '800', color: colors.text, marginBottom: spacing(1) },
  subhead: { color: colors.muted, marginBottom: spacing(2), textAlign: 'center' },
  counter: { color: colors.muted, textAlign: 'center', marginBottom: spacing(1.5) },
  card: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    padding: spacing(3),
    alignItems: 'center',
    marginBottom: spacing(2),
  },
  gurmukhi: { fontSize: 64, color: colors.text, marginBottom: spacing(1) },
  speaker: { color: colors.primary, fontWeight: '600' },
  answerBlock: { marginTop: spacing(2), alignItems: 'center' },
  translit: { fontSize: 18, color: colors.muted, fontStyle: 'italic' },
  english: { fontSize: 22, color: colors.text, fontWeight: '600', marginTop: spacing(0.5) },
  gradeRow: { flexDirection: 'row', justifyContent: 'space-between', gap: 8 },
  gradeBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: radius.md,
    alignItems: 'center',
    borderWidth: 1,
  },
  again: { backgroundColor: '#F8E6E6', borderColor: colors.incorrect },
  hard: { backgroundColor: '#FBF1DC', borderColor: colors.accent },
  good: { backgroundColor: colors.primary, borderColor: colors.primary },
  easy: { backgroundColor: colors.text, borderColor: colors.text },
  gradeLabel: { fontWeight: '700', color: colors.text },
});
