import * as Haptics from 'expo-haptics';

// Thin wrappers so call sites read clearly and we can no-op on platforms that
// don't support haptics without try/catch noise everywhere.

export function hapticCorrect() {
  Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(
    () => {},
  );
}

export function hapticWrong() {
  Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error).catch(
    () => {},
  );
}

export function hapticTap() {
  Haptics.selectionAsync().catch(() => {});
}

export function hapticCelebrate() {
  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy).catch(() => {});
}
