// Beginner-focused content. Each unit groups lessons; each lesson is a sequence
// of exercises. Cards (id-keyed vocab/letter items) are what the SRS reviews.

export type Card = {
  id: string;
  gurmukhi: string;
  translit: string;
  english: string;
};

export type Exercise =
  | {
      kind: 'letter';
      cardId: string;
      prompt: string;
      gurmukhi: string;
      choices: string[];
      answer: string;
    }
  | {
      kind: 'multipleChoice';
      cardId: string;
      prompt: string;
      questionGurmukhi: string;
      choices: string[];
      answer: string;
    }
  | {
      kind: 'listen';
      cardId: string;
      prompt: string;
      speak: string;
      choices: string[];
      answer: string;
    }
  | {
      kind: 'wordBank';
      cardId: string;
      prompt: string;
      questionEnglish: string;
      bank: string[];
      answer: string[];
    }
  | {
      kind: 'matchPairs';
      cardId: string;
      prompt: string;
      pairs: { gurmukhi: string; english: string }[];
    }
  | {
      kind: 'fillBlank';
      cardId: string;
      prompt: string;
      before: string;
      after: string;
      choices: string[];
      answer: string;
    }
  | {
      kind: 'typeAnswer';
      cardId: string;
      prompt: string;
      questionGurmukhi?: string;
      speak?: string;
      answer: string;
      acceptableAnswers?: string[];
    };

export type Lesson = {
  id: string;
  title: string;
  exercises: Exercise[];
};

export type Unit = {
  id: string;
  title: string;
  description: string;
  lessons: Lesson[];
};

export const CARDS: Record<string, Card> = {
  'l.a': { id: 'l.a', gurmukhi: 'ੳ', translit: 'ura', english: 'u/o vowel carrier' },
  'l.aa': { id: 'l.aa', gurmukhi: 'ਅ', translit: 'aira', english: 'a vowel carrier' },
  'l.ee': { id: 'l.ee', gurmukhi: 'ੲ', translit: 'iri', english: 'i vowel carrier' },
  'l.s': { id: 'l.s', gurmukhi: 'ਸ', translit: 'sassa', english: 's' },
  'l.h': { id: 'l.h', gurmukhi: 'ਹ', translit: 'haha', english: 'h' },
  'l.k': { id: 'l.k', gurmukhi: 'ਕ', translit: 'kakka', english: 'k' },
  'l.g': { id: 'l.g', gurmukhi: 'ਗ', translit: 'gagga', english: 'g' },
  'w.hello': { id: 'w.hello', gurmukhi: 'ਸਤ ਸ੍ਰੀ ਅਕਾਲ', translit: 'Sat Sri Akaal', english: 'Hello' },
  'w.thanks': { id: 'w.thanks', gurmukhi: 'ਧੰਨਵਾਦ', translit: 'dhanvaad', english: 'Thank you' },
  'w.yes': { id: 'w.yes', gurmukhi: 'ਹਾਂ', translit: 'haan', english: 'Yes' },
  'w.no': { id: 'w.no', gurmukhi: 'ਨਹੀਂ', translit: 'nahin', english: 'No' },
  'w.water': { id: 'w.water', gurmukhi: 'ਪਾਣੀ', translit: 'paani', english: 'Water' },
  'w.food': { id: 'w.food', gurmukhi: 'ਖਾਣਾ', translit: 'khaana', english: 'Food' },
  'n.1': { id: 'n.1', gurmukhi: 'ਇੱਕ', translit: 'ikk', english: 'One' },
  'n.2': { id: 'n.2', gurmukhi: 'ਦੋ', translit: 'do', english: 'Two' },
  'n.3': { id: 'n.3', gurmukhi: 'ਤਿੰਨ', translit: 'tinn', english: 'Three' },
};

export const UNITS: Unit[] = [
  {
    id: 'u1',
    title: 'Gurmukhi Basics',
    description: 'Recognize the first letters of the Gurmukhi script.',
    lessons: [
      {
        id: 'u1.l1',
        title: 'Vowel Carriers',
        exercises: [
          {
            kind: 'letter',
            cardId: 'l.a',
            prompt: 'Which sound does this letter carry?',
            gurmukhi: 'ੳ',
            choices: ['u / o', 'a', 'i', 's'],
            answer: 'u / o',
          },
          {
            kind: 'letter',
            cardId: 'l.aa',
            prompt: 'Which sound does this letter carry?',
            gurmukhi: 'ਅ',
            choices: ['u / o', 'a', 'i', 'k'],
            answer: 'a',
          },
          {
            kind: 'letter',
            cardId: 'l.ee',
            prompt: 'Which sound does this letter carry?',
            gurmukhi: 'ੲ',
            choices: ['h', 'g', 'i', 'a'],
            answer: 'i',
          },
        ],
      },
      {
        id: 'u1.l2',
        title: 'First Consonants',
        exercises: [
          {
            kind: 'letter',
            cardId: 'l.s',
            prompt: 'Which sound is this?',
            gurmukhi: 'ਸ',
            choices: ['s', 'h', 'k', 'g'],
            answer: 's',
          },
          {
            kind: 'letter',
            cardId: 'l.h',
            prompt: 'Which sound is this?',
            gurmukhi: 'ਹ',
            choices: ['s', 'h', 'k', 'g'],
            answer: 'h',
          },
          {
            kind: 'letter',
            cardId: 'l.k',
            prompt: 'Which sound is this?',
            gurmukhi: 'ਕ',
            choices: ['s', 'h', 'k', 'g'],
            answer: 'k',
          },
          {
            kind: 'letter',
            cardId: 'l.g',
            prompt: 'Which sound is this?',
            gurmukhi: 'ਗ',
            choices: ['s', 'h', 'k', 'g'],
            answer: 'g',
          },
        ],
      },
    ],
  },
  {
    id: 'u2',
    title: 'Greetings & Essentials',
    description: 'Your first words.',
    lessons: [
      {
        id: 'u2.l1',
        title: 'Hello & Thanks',
        exercises: [
          {
            kind: 'multipleChoice',
            cardId: 'w.hello',
            prompt: 'What does this mean?',
            questionGurmukhi: 'ਸਤ ਸ੍ਰੀ ਅਕਾਲ',
            choices: ['Hello', 'Goodbye', 'Thank you', 'Sorry'],
            answer: 'Hello',
          },
          {
            kind: 'listen',
            cardId: 'w.thanks',
            prompt: 'Tap what you hear.',
            speak: 'ਧੰਨਵਾਦ',
            choices: ['Thank you', 'Hello', 'Yes', 'No'],
            answer: 'Thank you',
          },
          {
            kind: 'multipleChoice',
            cardId: 'w.yes',
            prompt: 'What does this mean?',
            questionGurmukhi: 'ਹਾਂ',
            choices: ['No', 'Yes', 'Maybe', 'Why'],
            answer: 'Yes',
          },
          {
            kind: 'multipleChoice',
            cardId: 'w.no',
            prompt: 'What does this mean?',
            questionGurmukhi: 'ਨਹੀਂ',
            choices: ['Yes', 'No', 'Hello', 'Water'],
            answer: 'No',
          },
        ],
      },
      {
        id: 'u2.l2',
        title: 'Food & Water',
        exercises: [
          {
            kind: 'listen',
            cardId: 'w.water',
            prompt: 'Tap what you hear.',
            speak: 'ਪਾਣੀ',
            choices: ['Water', 'Food', 'Yes', 'Hello'],
            answer: 'Water',
          },
          {
            kind: 'multipleChoice',
            cardId: 'w.food',
            prompt: 'What does this mean?',
            questionGurmukhi: 'ਖਾਣਾ',
            choices: ['Water', 'Food', 'Tea', 'Bread'],
            answer: 'Food',
          },
        ],
      },
    ],
  },
  {
    id: 'u3',
    title: 'Numbers 1-3',
    description: 'Counting starts here.',
    lessons: [
      {
        id: 'u3.l1',
        title: 'One, Two, Three',
        exercises: [
          {
            kind: 'multipleChoice',
            cardId: 'n.1',
            prompt: 'What number is this?',
            questionGurmukhi: 'ਇੱਕ',
            choices: ['One', 'Two', 'Three', 'Four'],
            answer: 'One',
          },
          {
            kind: 'multipleChoice',
            cardId: 'n.2',
            prompt: 'What number is this?',
            questionGurmukhi: 'ਦੋ',
            choices: ['One', 'Two', 'Three', 'Four'],
            answer: 'Two',
          },
          {
            kind: 'listen',
            cardId: 'n.3',
            prompt: 'Tap what you hear.',
            speak: 'ਤਿੰਨ',
            choices: ['One', 'Two', 'Three', 'Four'],
            answer: 'Three',
          },
        ],
      },
    ],
  },
];

export function findLesson(lessonId: string): Lesson | undefined {
  for (const u of UNITS) {
    const l = u.lessons.find((x) => x.id === lessonId);
    if (l) return l;
  }
  return undefined;
}

export function findCard(cardId: string): Card | undefined {
  return CARDS[cardId];
}
