import * as Speech from 'expo-speech';

// Most devices don't ship with a Punjabi (pa-IN) TTS voice — so naively
// passing `language: 'pa-IN'` to expo-speech can yield silence or a wrong
// voice for Gurmukhi. We probe once for the best available Indic voice and
// fall back to speaking the romanized transliteration via the default voice.

type Resolved = {
  // Voice language tag to use for Gurmukhi text, or null if we have to fall
  // back to the transliteration.
  indicLang: string | null;
  indicVoiceId: string | null;
};

let resolved: Resolved | null = null;
let resolving: Promise<Resolved> | null = null;

async function resolveVoice(): Promise<Resolved> {
  if (resolved) return resolved;
  if (resolving) return resolving;
  resolving = (async () => {
    try {
      const voices = await Speech.getAvailableVoicesAsync();
      const find = (prefix: string) =>
        voices.find((v) => v.language?.toLowerCase().startsWith(prefix));
      const pa = find('pa');
      if (pa) {
        resolved = { indicLang: pa.language, indicVoiceId: pa.identifier };
        return resolved;
      }
      const hi = find('hi');
      if (hi) {
        resolved = { indicLang: hi.language, indicVoiceId: hi.identifier };
        return resolved;
      }
      resolved = { indicLang: null, indicVoiceId: null };
      return resolved;
    } catch {
      resolved = { indicLang: null, indicVoiceId: null };
      return resolved;
    } finally {
      resolving = null;
    }
  })();
  return resolving;
}

// Speak Gurmukhi text. If the device has no Punjabi or Hindi voice available,
// speak the supplied romanized transliteration (slowed) so the learner hears
// something useful instead of silence.
export async function speak(gurmukhi: string, translit?: string) {
  Speech.stop();
  const { indicLang, indicVoiceId } = await resolveVoice();
  if (indicLang) {
    Speech.speak(gurmukhi, {
      language: indicLang,
      voice: indicVoiceId ?? undefined,
      rate: 0.85,
      pitch: 1.0,
    });
    return;
  }
  if (translit) {
    Speech.speak(translit, { rate: 0.7, pitch: 1.0 });
  }
}

export function stop() {
  Speech.stop();
}

// Diagnostic helper for surfacing voice availability in the UI when we want.
export async function ttsStatus(): Promise<{
  hasIndicVoice: boolean;
  lang: string | null;
}> {
  const { indicLang } = await resolveVoice();
  return { hasIndicVoice: indicLang !== null, lang: indicLang };
}
