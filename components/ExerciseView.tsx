import { useEffect, useMemo, useState } from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
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
  switch (exercise.kind) {
    case 'letter':
    case 'multipleChoice':
    case 'listen':
    case 'fillBlank':
      return <ChoiceExercise exercise={exercise} onAnswered={onAnswered} />;
    case 'wordBank':
      return <WordBankExercise exercise={exercise} onAnswered={onAnswered} />;
    case 'matchPairs':
      return <MatchPairsExercise exercise={exercise} onAnswered={onAnswered} />;
    case 'typeAnswer':
      return <TypeAnswerExercise exercise={exercise} onAnswered={onAnswered} />;
  }
}

// ----------------- Choice-style (letter / MC / listen / fillBlank) ---------------

type ChoiceExerciseType = Extract<
  Exercise,
  { kind: 'letter' | 'multipleChoice' | 'listen' | 'fillBlank' }
>;

function ChoiceExercise({
  exercise,
  onAnswered,
}: {
  exercise: ChoiceExerciseType;
  onAnswered: (correct: boolean) => void;
}) {
  const [selected, setSelected] = useState<string | null>(null);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    setSelected(null);
    setChecked(false);
    if (exercise.kind === 'listen') {
      const t = setTimeout(() => speak(exercise.speak), 250);
      return () => clearTimeout(t);
    }
  }, [exercise]);

  const isCorrect = selected === exercise.answer;

  return (
    <View style={styles.container}>
      <Text style={styles.prompt}>{exercise.prompt}</Text>

      {exercise.kind === 'letter' && (
        <View style={styles.letterCard}>
          <Text style={styles.letterText}>{exercise.gurmukhi}</Text>
          <Pressable
            onPress={() => speak(exercise.gurmukhi)}
            style={styles.speakerSmall}
          >
            <Text style={styles.speakerSmallText}>🔊 Hear it</Text>
          </Pressable>
        </View>
      )}

      {exercise.kind === 'multipleChoice' && (
        <View style={styles.letterCard}>
          <Text style={styles.wordText}>{exercise.questionGurmukhi}</Text>
          <Pressable
            onPress={() => speak(exercise.questionGurmukhi)}
            style={styles.speakerSmall}
          >
            <Text style={styles.speakerSmallText}>🔊 Hear it</Text>
          </Pressable>
        </View>
      )}

      {exercise.kind === 'listen' && (
        <Pressable
          onPress={() => speak(exercise.speak)}
          style={styles.speakerLarge}
        >
          <Text style={styles.speakerLargeIcon}>🔊</Text>
          <Text style={styles.speakerLargeLabel}>Tap to replay</Text>
        </Pressable>
      )}

      {exercise.kind === 'fillBlank' && (
        <View style={styles.letterCard}>
          <Text style={styles.fillSentence}>
            {exercise.before}
            <Text style={styles.fillBlank}>
              {selected ? ` ${selected} ` : '  ____  '}
            </Text>
            {exercise.after}
          </Text>
          <Pressable
            onPress={() => speak(`${exercise.before} ${exercise.answer} ${exercise.after}`)}
            style={styles.speakerSmall}
          >
            <Text style={styles.speakerSmallText}>🔊 Hear full</Text>
          </Pressable>
        </View>
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
          <Button label="Check" onPress={() => selected && setChecked(true)} disabled={!selected} />
        ) : (
          <View>
            <Text
              style={[
                styles.feedback,
                { color: isCorrect ? colors.correct : colors.incorrect },
              ]}
            >
              {isCorrect ? 'Correct!' : `Answer: ${exercise.answer}`}
            </Text>
            <Button label="Continue" onPress={() => onAnswered(isCorrect)} />
          </View>
        )}
      </View>
    </View>
  );
}

// ----------------- Word-bank ---------------

function WordBankExercise({
  exercise,
  onAnswered,
}: {
  exercise: Extract<Exercise, { kind: 'wordBank' }>;
  onAnswered: (correct: boolean) => void;
}) {
  const [picked, setPicked] = useState<number[]>([]); // indices into bank
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    setPicked([]);
    setChecked(false);
  }, [exercise]);

  const remaining = exercise.bank
    .map((_, i) => i)
    .filter((i) => !picked.includes(i));

  const userAnswer = picked.map((i) => exercise.bank[i]);
  const isCorrect =
    userAnswer.length === exercise.answer.length &&
    userAnswer.every((w, i) => w === exercise.answer[i]);

  return (
    <View style={styles.container}>
      <Text style={styles.prompt}>{exercise.prompt}</Text>
      <View style={styles.englishCard}>
        <Text style={styles.englishCardText}>“{exercise.questionEnglish}”</Text>
      </View>

      <View style={styles.answerSlot}>
        {picked.length === 0 ? (
          <Text style={styles.answerHint}>Tap words below</Text>
        ) : (
          picked.map((i) => (
            <Pressable
              key={`p-${i}`}
              disabled={checked}
              onPress={() => setPicked((p) => p.filter((x) => x !== i))}
              style={styles.token}
            >
              <Text style={styles.tokenText}>{exercise.bank[i]}</Text>
            </Pressable>
          ))
        )}
      </View>

      <View style={styles.bank}>
        {remaining.map((i) => (
          <Pressable
            key={`b-${i}`}
            disabled={checked}
            onPress={() => setPicked((p) => [...p, i])}
            style={styles.token}
          >
            <Text style={styles.tokenText}>{exercise.bank[i]}</Text>
          </Pressable>
        ))}
      </View>

      <View style={styles.footer}>
        {!checked ? (
          <Button
            label="Check"
            onPress={() => setChecked(true)}
            disabled={picked.length === 0}
          />
        ) : (
          <View>
            <Text
              style={[
                styles.feedback,
                { color: isCorrect ? colors.correct : colors.incorrect },
              ]}
            >
              {isCorrect ? 'Correct!' : `Answer: ${exercise.answer.join(' ')}`}
            </Text>
            <Button label="Continue" onPress={() => onAnswered(isCorrect)} />
          </View>
        )}
      </View>
    </View>
  );
}

// ----------------- Match-pairs ---------------

function MatchPairsExercise({
  exercise,
  onAnswered,
}: {
  exercise: Extract<Exercise, { kind: 'matchPairs' }>;
  onAnswered: (correct: boolean) => void;
}) {
  // Independently shuffled lists of left (gurmukhi) and right (english).
  const leftItems = useMemo(
    () => shuffle(exercise.pairs.map((p) => p.gurmukhi)),
    [exercise],
  );
  const rightItems = useMemo(
    () => shuffle(exercise.pairs.map((p) => p.english)),
    [exercise],
  );
  const correctMap = useMemo(() => {
    const m = new Map<string, string>();
    exercise.pairs.forEach((p) => m.set(p.gurmukhi, p.english));
    return m;
  }, [exercise]);

  const [matchedG, setMatchedG] = useState<Set<string>>(new Set());
  const [matchedE, setMatchedE] = useState<Set<string>>(new Set());
  const [pickedG, setPickedG] = useState<string | null>(null);
  const [pickedE, setPickedE] = useState<string | null>(null);
  const [wrongFlash, setWrongFlash] = useState<{ g: string; e: string } | null>(
    null,
  );
  const [mistakes, setMistakes] = useState(0);

  useEffect(() => {
    setMatchedG(new Set());
    setMatchedE(new Set());
    setPickedG(null);
    setPickedE(null);
    setMistakes(0);
  }, [exercise]);

  useEffect(() => {
    if (!pickedG || !pickedE) return;
    if (correctMap.get(pickedG) === pickedE) {
      setMatchedG((s) => new Set(s).add(pickedG));
      setMatchedE((s) => new Set(s).add(pickedE));
      setPickedG(null);
      setPickedE(null);
    } else {
      setWrongFlash({ g: pickedG, e: pickedE });
      setMistakes((m) => m + 1);
      const t = setTimeout(() => {
        setWrongFlash(null);
        setPickedG(null);
        setPickedE(null);
      }, 600);
      return () => clearTimeout(t);
    }
  }, [pickedG, pickedE, correctMap]);

  const allDone = matchedG.size === exercise.pairs.length;
  const finishedCorrect = allDone && mistakes === 0;

  return (
    <View style={styles.container}>
      <Text style={styles.prompt}>{exercise.prompt}</Text>

      <View style={styles.matchRow}>
        <View style={styles.matchCol}>
          {leftItems.map((g) => {
            const isMatched = matchedG.has(g);
            const isPicked = pickedG === g;
            const isWrong = wrongFlash?.g === g;
            return (
              <Pressable
                key={g}
                disabled={isMatched || allDone}
                onPress={() => {
                  if (isMatched) return;
                  setPickedG(g);
                  speak(g);
                }}
                style={[
                  styles.matchCard,
                  isPicked && styles.matchCardPicked,
                  isMatched && styles.matchCardMatched,
                  isWrong && styles.matchCardWrong,
                ]}
              >
                <Text style={styles.matchTextG}>{g}</Text>
              </Pressable>
            );
          })}
        </View>

        <View style={styles.matchCol}>
          {rightItems.map((e) => {
            const isMatched = matchedE.has(e);
            const isPicked = pickedE === e;
            const isWrong = wrongFlash?.e === e;
            return (
              <Pressable
                key={e}
                disabled={isMatched || allDone}
                onPress={() => {
                  if (isMatched) return;
                  setPickedE(e);
                }}
                style={[
                  styles.matchCard,
                  isPicked && styles.matchCardPicked,
                  isMatched && styles.matchCardMatched,
                  isWrong && styles.matchCardWrong,
                ]}
              >
                <Text style={styles.matchTextE}>{e}</Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      <View style={styles.footer}>
        {allDone ? (
          <View>
            <Text
              style={[
                styles.feedback,
                { color: finishedCorrect ? colors.correct : colors.incorrect },
              ]}
            >
              {finishedCorrect
                ? 'All matched!'
                : `Done — ${mistakes} mistake${mistakes === 1 ? '' : 's'}`}
            </Text>
            <Button label="Continue" onPress={() => onAnswered(finishedCorrect)} />
          </View>
        ) : (
          <Text style={styles.hint}>
            {matchedG.size}/{exercise.pairs.length} matched
          </Text>
        )}
      </View>
    </View>
  );
}

// ----------------- Type-answer ---------------

function TypeAnswerExercise({
  exercise,
  onAnswered,
}: {
  exercise: Extract<Exercise, { kind: 'typeAnswer' }>;
  onAnswered: (correct: boolean) => void;
}) {
  const [text, setText] = useState('');
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    setText('');
    setChecked(false);
    if (exercise.speak) {
      const t = setTimeout(() => exercise.speak && speak(exercise.speak), 250);
      return () => clearTimeout(t);
    }
  }, [exercise]);

  const normalize = (s: string) => s.trim().toLowerCase().replace(/\s+/g, ' ');
  const accepted = [exercise.answer, ...(exercise.acceptableAnswers ?? [])].map(
    normalize,
  );
  const isCorrect = accepted.includes(normalize(text));

  return (
    <View style={styles.container}>
      <Text style={styles.prompt}>{exercise.prompt}</Text>

      {exercise.questionGurmukhi && (
        <View style={styles.letterCard}>
          <Text style={styles.wordText}>{exercise.questionGurmukhi}</Text>
          <Pressable
            onPress={() =>
              speak(exercise.speak ?? exercise.questionGurmukhi ?? '')
            }
            style={styles.speakerSmall}
          >
            <Text style={styles.speakerSmallText}>🔊 Hear it</Text>
          </Pressable>
        </View>
      )}

      {!exercise.questionGurmukhi && exercise.speak && (
        <Pressable
          onPress={() => exercise.speak && speak(exercise.speak)}
          style={styles.speakerLarge}
        >
          <Text style={styles.speakerLargeIcon}>🔊</Text>
          <Text style={styles.speakerLargeLabel}>Tap to replay</Text>
        </Pressable>
      )}

      <TextInput
        value={text}
        onChangeText={setText}
        editable={!checked}
        autoCapitalize="none"
        autoCorrect={false}
        placeholder="Type your answer in English"
        placeholderTextColor={colors.muted}
        style={styles.input}
      />

      <View style={styles.footer}>
        {!checked ? (
          <Button
            label="Check"
            onPress={() => setChecked(true)}
            disabled={text.trim().length === 0}
          />
        ) : (
          <View>
            <Text
              style={[
                styles.feedback,
                { color: isCorrect ? colors.correct : colors.incorrect },
              ]}
            >
              {isCorrect ? 'Correct!' : `Answer: ${exercise.answer}`}
            </Text>
            <Button label="Continue" onPress={() => onAnswered(isCorrect)} />
          </View>
        )}
      </View>
    </View>
  );
}

// ----------------- Helpers ---------------

function shuffle<T>(arr: T[]): T[] {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: spacing(2) },
  prompt: {
    fontSize: 18,
    color: colors.text,
    marginBottom: spacing(2),
    textAlign: 'center',
  },
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
  wordText: { fontSize: 40, color: colors.text, textAlign: 'center', paddingHorizontal: spacing(2) },
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
  feedback: {
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: spacing(1.5),
  },
  hint: { color: colors.muted, textAlign: 'center', fontSize: 14 },

  // fillBlank
  fillSentence: {
    fontSize: 28,
    color: colors.text,
    textAlign: 'center',
    paddingHorizontal: spacing(2),
  },
  fillBlank: {
    fontSize: 28,
    color: colors.primary,
    fontWeight: '700',
    textDecorationLine: 'underline',
  },

  // wordBank
  englishCard: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    padding: spacing(2),
    marginBottom: spacing(1.5),
  },
  englishCardText: { fontSize: 18, color: colors.text, textAlign: 'center' },
  answerSlot: {
    minHeight: 60,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    padding: spacing(1.25),
    borderRadius: radius.md,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: colors.border,
    backgroundColor: colors.surface,
    marginBottom: spacing(1.5),
    alignItems: 'center',
  },
  answerHint: { color: colors.muted, fontSize: 14, fontStyle: 'italic' },
  bank: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  token: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  tokenText: { fontSize: 18, color: colors.text },

  // matchPairs
  matchRow: { flex: 1, flexDirection: 'row', gap: 12, marginBottom: spacing(1) },
  matchCol: { flex: 1, gap: 8 },
  matchCard: {
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderRadius: radius.md,
    borderWidth: 2,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    minHeight: 56,
    alignItems: 'center',
    justifyContent: 'center',
  },
  matchCardPicked: { borderColor: colors.primary },
  matchCardMatched: { opacity: 0.35, borderColor: colors.correct },
  matchCardWrong: { borderColor: colors.incorrect, backgroundColor: '#F8E6E6' },
  matchTextG: { fontSize: 22, color: colors.text },
  matchTextE: { fontSize: 16, color: colors.text },

  // typeAnswer
  input: {
    fontSize: 18,
    color: colors.text,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: spacing(1.5),
    marginBottom: spacing(1),
  },
});
