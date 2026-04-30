import * as Speech from 'expo-speech';

// Punjabi locale. expo-speech falls back to the device default voice if pa-IN
// isn't installed, so this is a placeholder until real audio is recorded.
const LANG = 'pa-IN';

export function speak(text: string) {
  Speech.stop();
  Speech.speak(text, {
    language: LANG,
    rate: 0.85,
    pitch: 1.0,
  });
}

export function stop() {
  Speech.stop();
}
