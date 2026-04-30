# Sikho — a Punjabi learning app

A mobile (Expo / React Native) app for absolute beginners learning Punjabi.
Bite-sized lessons in **Gurmukhi script**, **greetings**, and **numbers**, with
spaced-repetition review and cloud-synced progress via Supabase. No streaks,
leagues, or XP — just learning.

## Stack

- **Expo SDK 51** + **expo-router** (typed routes)
- **TypeScript**, React Native 0.74
- **Supabase** for auth + Postgres (with RLS) for cloud progress
- **expo-speech** for TTS (placeholder until real audio)
- **SM-2** spaced repetition (`lib/srs.ts`)

## Setup

```bash
npm install
cp .env.example .env
# Fill in EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY
```

### Supabase

1. Create a project at supabase.com.
2. In the SQL editor, run `supabase/schema.sql` — this creates `profiles`,
   `lesson_progress`, and `srs_cards` tables with row-level security so each
   user only sees their own data.
3. (Optional during dev) In **Authentication → Providers → Email**, disable
   "Confirm email" so you can sign up and immediately use the app.
4. Copy your project URL and **anon** key into `.env`.

### Run

```bash
npm run start          # Expo dev server
npm run ios            # iOS simulator
npm run android        # Android emulator
npm run web            # browser (limited TTS)
```

## App structure

```
app/
  _layout.tsx           # Auth gate, routes signed-out users to (auth)
  (auth)/sign-in.tsx
  (auth)/sign-up.tsx
  (tabs)/index.tsx      # Units & lessons
  (tabs)/review.tsx     # SRS due-card review
  (tabs)/profile.tsx    # Stats + sign out
  lesson/[id].tsx       # Exercise runner
components/
  Button, Choice, ProgressBar, ExerciseView
content/
  units.ts              # Units → Lessons → Exercises + Card vocabulary
lib/
  supabase.ts           # Supabase client (AsyncStorage-backed session)
  auth.tsx              # AuthProvider / useAuth
  progress.ts           # Cloud reads/writes for lessons + SRS
  srs.ts                # SM-2 algorithm
  tts.ts                # expo-speech wrapper (pa-IN)
  theme.ts
supabase/schema.sql
```

## Exercise types

- **letter** — recognize a Gurmukhi letter's sound.
- **multipleChoice** — translate a written word.
- **listen** — TTS plays a word; tap the meaning.

Each exercise is tied to a `cardId`. Answering an exercise records an SM-2
review (correct → "good", incorrect → "forgot"), so the **Review** tab will
naturally surface things you struggled with.

## Adding content

Edit `content/units.ts`. Add `Card`s to the `CARDS` map, then reference them in
new `Exercise`s under a `Lesson` inside a `Unit`. No DB migration is needed —
content lives in code so lessons can be updated by shipping a new build.

## TTS note

`expo-speech` uses the device's installed `pa-IN` voice when available and
falls back to the default voice otherwise. This is intentionally a placeholder
— swap `lib/tts.ts` for real audio assets when recordings are available.

## What's intentionally missing (for now)

- Streaks, XP, leagues, hearts — by request.
- Sentence-building / word-bank exercises (next obvious add).
- Offline content cache (lessons are bundled; only progress requires network).
- Real audio assets.
