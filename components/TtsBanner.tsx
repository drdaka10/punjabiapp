import { useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { Linking, Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { useGamification } from '@/lib/gamification';
import { colors, radius, spacing } from '@/lib/theme';
import { resetVoiceCache, ttsStatus } from '@/lib/tts';

export function TtsBanner() {
  const dismissed = useGamification((s) => s.dismissedTtsHint);
  const dismiss = useGamification((s) => s.dismissTtsHint);
  const [needsVoice, setNeedsVoice] = useState(false);

  useFocusEffect(
    useCallback(() => {
      if (dismissed) return;
      // Re-probe in case the user just installed a voice.
      resetVoiceCache();
      ttsStatus()
        .then((s) => setNeedsVoice(!s.hasIndicVoice))
        .catch(() => {});
    }, [dismissed]),
  );

  if (dismissed || !needsVoice) return null;

  const instructions =
    Platform.OS === 'ios'
      ? 'Settings → Accessibility → Spoken Content → Voices → Punjabi'
      : 'Settings → System → Languages → Text-to-speech → install Punjabi or Hindi';

  return (
    <View style={styles.banner}>
      <Text style={styles.title}>🔊 Install a Punjabi voice</Text>
      <Text style={styles.body}>
        Your device doesn't have a Punjabi voice. You'll hear the romanized
        pronunciation until you install one:
      </Text>
      <Text style={styles.path}>{instructions}</Text>
      <View style={styles.row}>
        <Pressable
          onPress={() => Linking.openSettings().catch(() => {})}
          style={[styles.btn, styles.btnPrimary]}
        >
          <Text style={styles.btnPrimaryText}>Open settings</Text>
        </Pressable>
        <Pressable onPress={dismiss} style={[styles.btn, styles.btnSecondary]}>
          <Text style={styles.btnSecondaryText}>Don't show again</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    marginHorizontal: spacing(2),
    marginBottom: spacing(1.5),
    padding: spacing(1.5),
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.accent,
  },
  title: { fontSize: 15, fontWeight: '800', color: colors.text, marginBottom: 4 },
  body: { fontSize: 13, color: colors.muted, lineHeight: 18 },
  path: {
    fontSize: 12,
    color: colors.text,
    fontWeight: '600',
    marginTop: spacing(0.75),
    marginBottom: spacing(1),
  },
  row: { flexDirection: 'row', gap: 8 },
  btn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: radius.md,
    alignItems: 'center',
    borderWidth: 1,
  },
  btnPrimary: { backgroundColor: colors.primary, borderColor: colors.primary },
  btnPrimaryText: { color: colors.primaryText, fontWeight: '700', fontSize: 14 },
  btnSecondary: { backgroundColor: 'transparent', borderColor: colors.border },
  btnSecondaryText: { color: colors.muted, fontWeight: '600', fontSize: 14 },
});
