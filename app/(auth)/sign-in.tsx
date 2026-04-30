import { Link } from 'expo-router';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, View } from 'react-native';
import { Button } from '@/components/Button';
import { useAuth } from '@/lib/auth';
import { colors, radius, spacing } from '@/lib/theme';

export default function SignIn() {
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function submit() {
    setError(null);
    setBusy(true);
    const { error } = await signIn(email.trim(), password);
    setBusy(false);
    if (error) setError(error);
  }

  return (
    <KeyboardAvoidingView
      style={styles.root}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.inner}>
        <Text style={styles.brand}>Sikho</Text>
        <Text style={styles.subtitle}>Learn Punjabi, one word at a time.</Text>

        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor={colors.muted}
          autoCapitalize="none"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor={colors.muted}
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        {error && <Text style={styles.error}>{error}</Text>}

        <Button label="Sign in" onPress={submit} loading={busy} />
        <Link href="/(auth)/sign-up" style={styles.link}>
          <Text style={styles.linkText}>Need an account? Sign up</Text>
        </Link>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  inner: { flex: 1, padding: spacing(3), justifyContent: 'center' },
  brand: { fontSize: 40, fontWeight: '800', color: colors.primary, textAlign: 'center' },
  subtitle: { color: colors.muted, textAlign: 'center', marginBottom: spacing(4) },
  input: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: radius.md,
    padding: spacing(1.75),
    marginBottom: spacing(1.5),
    fontSize: 16,
    color: colors.text,
  },
  error: { color: colors.incorrect, marginBottom: spacing(1) },
  link: { marginTop: spacing(2), alignSelf: 'center' },
  linkText: { color: colors.primary, fontWeight: '600' },
});
