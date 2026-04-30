import { Link } from 'expo-router';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, View } from 'react-native';
import { Button } from '@/components/Button';
import { useAuth } from '@/lib/auth';
import { colors, radius, spacing } from '@/lib/theme';

export default function SignUp() {
  const { signUp } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function submit() {
    setError(null);
    setInfo(null);
    setBusy(true);
    const { error } = await signUp(email.trim(), password);
    setBusy(false);
    if (error) setError(error);
    else setInfo('Account created. Check your email to confirm, then sign in.');
  }

  return (
    <KeyboardAvoidingView
      style={styles.root}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.inner}>
        <Text style={styles.brand}>Create your account</Text>

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
          placeholder="Password (8+ characters)"
          placeholderTextColor={colors.muted}
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        {error && <Text style={styles.error}>{error}</Text>}
        {info && <Text style={styles.info}>{info}</Text>}

        <Button label="Sign up" onPress={submit} loading={busy} />
        <Link href="/(auth)/sign-in" style={styles.link}>
          <Text style={styles.linkText}>Already have an account? Sign in</Text>
        </Link>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  inner: { flex: 1, padding: spacing(3), justifyContent: 'center' },
  brand: { fontSize: 28, fontWeight: '800', color: colors.text, marginBottom: spacing(3), textAlign: 'center' },
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
  info: { color: colors.primary, marginBottom: spacing(1) },
  link: { marginTop: spacing(2), alignSelf: 'center' },
  linkText: { color: colors.primary, fontWeight: '600' },
});
