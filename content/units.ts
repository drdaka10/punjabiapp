// Beginner-focused content. Each unit groups lessons; each lesson is a sequence
// of exercises. Cards (id-keyed vocab/letter items) are what the SRS reviews.
//
// CONTENT REVIEW NEEDED: Punjabi/Gurmukhi spellings, transliterations, and
// translations should be reviewed by a fluent speaker before shipping. In
// particular: Gurmukhi vowel-mark placement, retroflex vs dental letter
// distinctions, and gendered family terms (paternal vs maternal grandparents
// use different words; this set uses paternal forms).

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
  // Letters — vowel carriers
  'l.ura': { id: 'l.ura', gurmukhi: 'ੳ', translit: 'ura', english: 'u/o vowel carrier' },
  'l.aira': { id: 'l.aira', gurmukhi: 'ਅ', translit: 'aira', english: 'a vowel carrier' },
  'l.iri': { id: 'l.iri', gurmukhi: 'ੲ', translit: 'iri', english: 'i vowel carrier' },
  // Letters — consonants
  'l.s': { id: 'l.s', gurmukhi: 'ਸ', translit: 'sassa', english: 's' },
  'l.h': { id: 'l.h', gurmukhi: 'ਹ', translit: 'haha', english: 'h' },
  'l.k': { id: 'l.k', gurmukhi: 'ਕ', translit: 'kakka', english: 'k' },
  'l.kh': { id: 'l.kh', gurmukhi: 'ਖ', translit: 'khakkha', english: 'kh' },
  'l.g': { id: 'l.g', gurmukhi: 'ਗ', translit: 'gagga', english: 'g' },
  'l.gh': { id: 'l.gh', gurmukhi: 'ਘ', translit: 'ghagga', english: 'gh' },
  'l.ch': { id: 'l.ch', gurmukhi: 'ਚ', translit: 'chacha', english: 'ch' },
  'l.j': { id: 'l.j', gurmukhi: 'ਜ', translit: 'jajja', english: 'j' },
  'l.tt': { id: 'l.tt', gurmukhi: 'ਟ', translit: 'tainka', english: 't (retroflex)' },
  'l.dd': { id: 'l.dd', gurmukhi: 'ਡ', translit: 'dadda', english: 'd (retroflex)' },
  'l.t': { id: 'l.t', gurmukhi: 'ਤ', translit: 'tatta', english: 't (dental)' },
  'l.n': { id: 'l.n', gurmukhi: 'ਨ', translit: 'nanna', english: 'n' },
  'l.p': { id: 'l.p', gurmukhi: 'ਪ', translit: 'pappa', english: 'p' },
  'l.b': { id: 'l.b', gurmukhi: 'ਬ', translit: 'babba', english: 'b' },
  'l.m': { id: 'l.m', gurmukhi: 'ਮ', translit: 'mamma', english: 'm' },

  // Greetings & courtesy
  'w.hello': { id: 'w.hello', gurmukhi: 'ਸਤ ਸ੍ਰੀ ਅਕਾਲ', translit: 'Sat Sri Akaal', english: 'Hello' },
  'w.bye': { id: 'w.bye', gurmukhi: 'ਰੱਬ ਰਾਖਾ', translit: 'Rabb Raakhaa', english: 'Goodbye' },
  'w.thanks': { id: 'w.thanks', gurmukhi: 'ਧੰਨਵਾਦ', translit: 'dhanvaad', english: 'Thank you' },
  'w.please': { id: 'w.please', gurmukhi: 'ਕਿਰਪਾ ਕਰਕੇ', translit: 'kirpa karke', english: 'Please' },
  'w.sorry': { id: 'w.sorry', gurmukhi: 'ਮਾਫ਼ ਕਰਨਾ', translit: 'maaf karna', english: 'Sorry' },
  'w.yes': { id: 'w.yes', gurmukhi: 'ਹਾਂ', translit: 'haan', english: 'Yes' },
  'w.no': { id: 'w.no', gurmukhi: 'ਨਹੀਂ', translit: 'nahin', english: 'No' },
  'w.howareyou': {
    id: 'w.howareyou',
    gurmukhi: 'ਤੁਸੀਂ ਕਿਵੇਂ ਹੋ?',
    translit: 'tusi kiven ho?',
    english: 'How are you?',
  },
  'w.iamfine': {
    id: 'w.iamfine',
    gurmukhi: 'ਮੈਂ ਠੀਕ ਹਾਂ',
    translit: 'main theek haan',
    english: 'I am fine',
  },

  // Numbers
  'n.1': { id: 'n.1', gurmukhi: 'ਇੱਕ', translit: 'ikk', english: 'One' },
  'n.2': { id: 'n.2', gurmukhi: 'ਦੋ', translit: 'do', english: 'Two' },
  'n.3': { id: 'n.3', gurmukhi: 'ਤਿੰਨ', translit: 'tinn', english: 'Three' },
  'n.4': { id: 'n.4', gurmukhi: 'ਚਾਰ', translit: 'chaar', english: 'Four' },
  'n.5': { id: 'n.5', gurmukhi: 'ਪੰਜ', translit: 'panj', english: 'Five' },
  'n.6': { id: 'n.6', gurmukhi: 'ਛੇ', translit: 'chhe', english: 'Six' },
  'n.7': { id: 'n.7', gurmukhi: 'ਸੱਤ', translit: 'satt', english: 'Seven' },
  'n.8': { id: 'n.8', gurmukhi: 'ਅੱਠ', translit: 'atth', english: 'Eight' },
  'n.9': { id: 'n.9', gurmukhi: 'ਨੌਂ', translit: 'nau', english: 'Nine' },
  'n.10': { id: 'n.10', gurmukhi: 'ਦਸ', translit: 'das', english: 'Ten' },

  // Family
  'f.father': { id: 'f.father', gurmukhi: 'ਪਿਤਾ', translit: 'pitaa', english: 'Father' },
  'f.mother': { id: 'f.mother', gurmukhi: 'ਮਾਤਾ', translit: 'maataa', english: 'Mother' },
  'f.brother': { id: 'f.brother', gurmukhi: 'ਭਰਾ', translit: 'bhraa', english: 'Brother' },
  'f.sister': { id: 'f.sister', gurmukhi: 'ਭੈਣ', translit: 'bhain', english: 'Sister' },
  'f.son': { id: 'f.son', gurmukhi: 'ਪੁੱਤਰ', translit: 'puttar', english: 'Son' },
  'f.daughter': { id: 'f.daughter', gurmukhi: 'ਧੀ', translit: 'dhee', english: 'Daughter' },
  'f.grandpa': { id: 'f.grandpa', gurmukhi: 'ਦਾਦਾ', translit: 'daadaa', english: 'Grandfather' },
  'f.grandma': { id: 'f.grandma', gurmukhi: 'ਦਾਦੀ', translit: 'daadee', english: 'Grandmother' },

  // Food & drink
  'food.water': { id: 'food.water', gurmukhi: 'ਪਾਣੀ', translit: 'paani', english: 'Water' },
  'food.food': { id: 'food.food', gurmukhi: 'ਖਾਣਾ', translit: 'khaana', english: 'Food' },
  'food.tea': { id: 'food.tea', gurmukhi: 'ਚਾਹ', translit: 'chaah', english: 'Tea' },
  'food.milk': { id: 'food.milk', gurmukhi: 'ਦੁੱਧ', translit: 'duddh', english: 'Milk' },
  'food.bread': { id: 'food.bread', gurmukhi: 'ਰੋਟੀ', translit: 'roti', english: 'Bread' },
  'food.rice': { id: 'food.rice', gurmukhi: 'ਚੌਲ', translit: 'chaul', english: 'Rice' },
  'food.fruit': { id: 'food.fruit', gurmukhi: 'ਫਲ', translit: 'phal', english: 'Fruit' },
  'food.veg': { id: 'food.veg', gurmukhi: 'ਸਬਜ਼ੀ', translit: 'sabzi', english: 'Vegetable' },
  'food.sweet': { id: 'food.sweet', gurmukhi: 'ਮਿੱਠਾ', translit: 'mitthaa', english: 'Sweet' },
  'food.sugar': { id: 'food.sugar', gurmukhi: 'ਖੰਡ', translit: 'khand', english: 'Sugar' },

  // Time
  't.today': { id: 't.today', gurmukhi: 'ਅੱਜ', translit: 'ajj', english: 'Today' },
  't.now': { id: 't.now', gurmukhi: 'ਹੁਣ', translit: 'hun', english: 'Now' },
  't.morning': { id: 't.morning', gurmukhi: 'ਸਵੇਰ', translit: 'saver', english: 'Morning' },
  't.evening': { id: 't.evening', gurmukhi: 'ਸ਼ਾਮ', translit: 'shaam', english: 'Evening' },
  't.night': { id: 't.night', gurmukhi: 'ਰਾਤ', translit: 'raat', english: 'Night' },
  't.day': { id: 't.day', gurmukhi: 'ਦਿਨ', translit: 'din', english: 'Day' },
  't.week': { id: 't.week', gurmukhi: 'ਹਫ਼ਤਾ', translit: 'haftaa', english: 'Week' },

  // Common phrases / question words
  'p.what': { id: 'p.what', gurmukhi: 'ਕੀ', translit: 'ki', english: 'What' },
  'p.where': { id: 'p.where', gurmukhi: 'ਕਿੱਥੇ', translit: 'kithe', english: 'Where' },
  'p.who': { id: 'p.who', gurmukhi: 'ਕੌਣ', translit: 'kaun', english: 'Who' },
  'p.when': { id: 'p.when', gurmukhi: 'ਕਦੋਂ', translit: 'kadon', english: 'When' },
  'p.how': { id: 'p.how', gurmukhi: 'ਕਿਵੇਂ', translit: 'kiven', english: 'How' },
  'p.iwant': {
    id: 'p.iwant',
    gurmukhi: 'ਮੈਨੂੰ ਚਾਹੀਦਾ ਹੈ',
    translit: 'menu chaahida hai',
    english: 'I want',
  },
  'p.idontknow': {
    id: 'p.idontknow',
    gurmukhi: 'ਮੈਨੂੰ ਨਹੀਂ ਪਤਾ',
    translit: 'menu nahin pataa',
    english: "I don't know",
  },
  'p.understand': {
    id: 'p.understand',
    gurmukhi: 'ਮੈਨੂੰ ਸਮਝ ਆਈ',
    translit: 'menu samajh aayi',
    english: 'I understand',
  },
};

// ----------------- Units ---------------

export const UNITS: Unit[] = [
  // ============== Unit 1: Vowel carriers + first consonants ==============
  {
    id: 'u1',
    title: 'Gurmukhi: Vowel Carriers',
    description: 'The three letters that hold vowel sounds.',
    lessons: [
      {
        id: 'u1.l1',
        title: 'Meet ੳ ਅ ੲ',
        exercises: [
          {
            kind: 'letter',
            cardId: 'l.ura',
            prompt: 'Which sound does this carry?',
            gurmukhi: 'ੳ',
            choices: ['u / o', 'a', 'i', 's'],
            answer: 'u / o',
          },
          {
            kind: 'letter',
            cardId: 'l.aira',
            prompt: 'Which sound does this carry?',
            gurmukhi: 'ਅ',
            choices: ['u / o', 'a', 'i', 'k'],
            answer: 'a',
          },
          {
            kind: 'letter',
            cardId: 'l.iri',
            prompt: 'Which sound does this carry?',
            gurmukhi: 'ੲ',
            choices: ['h', 'g', 'i', 'a'],
            answer: 'i',
          },
          {
            kind: 'matchPairs',
            cardId: 'l.aira',
            prompt: 'Match each vowel carrier to its sound.',
            pairs: [
              { gurmukhi: 'ੳ', english: 'u / o' },
              { gurmukhi: 'ਅ', english: 'a' },
              { gurmukhi: 'ੲ', english: 'i' },
            ],
          },
        ],
      },
      {
        id: 'u1.l2',
        title: 'Meet ਸ ਹ',
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
            kind: 'matchPairs',
            cardId: 'l.s',
            prompt: 'Match the letter to its name.',
            pairs: [
              { gurmukhi: 'ਸ', english: 'sassa' },
              { gurmukhi: 'ਹ', english: 'haha' },
              { gurmukhi: 'ਅ', english: 'aira' },
            ],
          },
        ],
      },
    ],
  },

  // ============== Unit 2: Velar consonants ==============
  {
    id: 'u2',
    title: 'Gurmukhi: Velars',
    description: 'Consonants made at the back of the mouth.',
    lessons: [
      {
        id: 'u2.l1',
        title: 'ਕ ਖ',
        exercises: [
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
            cardId: 'l.kh',
            prompt: 'Which sound is this?',
            gurmukhi: 'ਖ',
            choices: ['k', 'kh', 'g', 'gh'],
            answer: 'kh',
          },
          {
            kind: 'matchPairs',
            cardId: 'l.k',
            prompt: 'Match each letter to its sound.',
            pairs: [
              { gurmukhi: 'ਕ', english: 'k' },
              { gurmukhi: 'ਖ', english: 'kh' },
              { gurmukhi: 'ਸ', english: 's' },
              { gurmukhi: 'ਹ', english: 'h' },
            ],
          },
        ],
      },
      {
        id: 'u2.l2',
        title: 'ਗ ਘ',
        exercises: [
          {
            kind: 'letter',
            cardId: 'l.g',
            prompt: 'Which sound is this?',
            gurmukhi: 'ਗ',
            choices: ['k', 'kh', 'g', 'gh'],
            answer: 'g',
          },
          {
            kind: 'letter',
            cardId: 'l.gh',
            prompt: 'Which sound is this?',
            gurmukhi: 'ਘ',
            choices: ['k', 'kh', 'g', 'gh'],
            answer: 'gh',
          },
          {
            kind: 'matchPairs',
            cardId: 'l.gh',
            prompt: 'Match each letter to its sound.',
            pairs: [
              { gurmukhi: 'ਕ', english: 'k' },
              { gurmukhi: 'ਖ', english: 'kh' },
              { gurmukhi: 'ਗ', english: 'g' },
              { gurmukhi: 'ਘ', english: 'gh' },
            ],
          },
        ],
      },
    ],
  },

  // ============== Unit 3: Palatal & retroflex ==============
  {
    id: 'u3',
    title: 'Gurmukhi: ਚ ਜ ਟ ਡ',
    description: 'Palatal and retroflex consonants.',
    lessons: [
      {
        id: 'u3.l1',
        title: 'ਚ and ਜ',
        exercises: [
          {
            kind: 'letter',
            cardId: 'l.ch',
            prompt: 'Which sound is this?',
            gurmukhi: 'ਚ',
            choices: ['ch', 'j', 'k', 't'],
            answer: 'ch',
          },
          {
            kind: 'letter',
            cardId: 'l.j',
            prompt: 'Which sound is this?',
            gurmukhi: 'ਜ',
            choices: ['ch', 'j', 'g', 'b'],
            answer: 'j',
          },
        ],
      },
      {
        id: 'u3.l2',
        title: 'Retroflex ਟ ਡ',
        exercises: [
          {
            kind: 'letter',
            cardId: 'l.tt',
            prompt: 'Which sound is this? (retroflex)',
            gurmukhi: 'ਟ',
            choices: ['t (retroflex)', 't (dental)', 'd (retroflex)', 'k'],
            answer: 't (retroflex)',
          },
          {
            kind: 'letter',
            cardId: 'l.dd',
            prompt: 'Which sound is this? (retroflex)',
            gurmukhi: 'ਡ',
            choices: ['t (retroflex)', 'd (retroflex)', 'd (dental)', 'g'],
            answer: 'd (retroflex)',
          },
          {
            kind: 'matchPairs',
            cardId: 'l.tt',
            prompt: 'Match the letter to its sound.',
            pairs: [
              { gurmukhi: 'ਚ', english: 'ch' },
              { gurmukhi: 'ਜ', english: 'j' },
              { gurmukhi: 'ਟ', english: 't (retroflex)' },
              { gurmukhi: 'ਡ', english: 'd (retroflex)' },
            ],
          },
        ],
      },
    ],
  },

  // ============== Unit 4: Dental & labial ==============
  {
    id: 'u4',
    title: 'Gurmukhi: ਤ ਨ ਪ ਬ ਮ',
    description: 'Dental and labial consonants — finish the basics.',
    lessons: [
      {
        id: 'u4.l1',
        title: 'ਤ and ਨ',
        exercises: [
          {
            kind: 'letter',
            cardId: 'l.t',
            prompt: 'Which sound is this? (dental)',
            gurmukhi: 'ਤ',
            choices: ['t (dental)', 't (retroflex)', 'd', 'k'],
            answer: 't (dental)',
          },
          {
            kind: 'letter',
            cardId: 'l.n',
            prompt: 'Which sound is this?',
            gurmukhi: 'ਨ',
            choices: ['m', 'n', 'p', 'b'],
            answer: 'n',
          },
        ],
      },
      {
        id: 'u4.l2',
        title: 'ਪ ਬ ਮ',
        exercises: [
          {
            kind: 'letter',
            cardId: 'l.p',
            prompt: 'Which sound is this?',
            gurmukhi: 'ਪ',
            choices: ['p', 'b', 'm', 'ph'],
            answer: 'p',
          },
          {
            kind: 'letter',
            cardId: 'l.b',
            prompt: 'Which sound is this?',
            gurmukhi: 'ਬ',
            choices: ['p', 'b', 'm', 'bh'],
            answer: 'b',
          },
          {
            kind: 'letter',
            cardId: 'l.m',
            prompt: 'Which sound is this?',
            gurmukhi: 'ਮ',
            choices: ['n', 'm', 'p', 'b'],
            answer: 'm',
          },
          {
            kind: 'matchPairs',
            cardId: 'l.m',
            prompt: 'Match each letter to its sound.',
            pairs: [
              { gurmukhi: 'ਤ', english: 't (dental)' },
              { gurmukhi: 'ਨ', english: 'n' },
              { gurmukhi: 'ਪ', english: 'p' },
              { gurmukhi: 'ਬ', english: 'b' },
              { gurmukhi: 'ਮ', english: 'm' },
            ],
          },
        ],
      },
    ],
  },

  // ============== Unit 5: Greetings & Courtesy ==============
  {
    id: 'u5',
    title: 'Greetings & Courtesy',
    description: 'Say hello, goodbye, please, and thank you.',
    lessons: [
      {
        id: 'u5.l1',
        title: 'Hello & Goodbye',
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
            kind: 'multipleChoice',
            cardId: 'w.bye',
            prompt: 'What does this mean?',
            questionGurmukhi: 'ਰੱਬ ਰਾਖਾ',
            choices: ['Hello', 'Goodbye', 'Please', 'Sorry'],
            answer: 'Goodbye',
          },
          {
            kind: 'listen',
            cardId: 'w.hello',
            prompt: 'Tap what you hear.',
            speak: 'ਸਤ ਸ੍ਰੀ ਅਕਾਲ',
            choices: ['Hello', 'Goodbye', 'Thank you', 'Yes'],
            answer: 'Hello',
          },
          {
            kind: 'typeAnswer',
            cardId: 'w.bye',
            prompt: 'Translate to English.',
            questionGurmukhi: 'ਰੱਬ ਰਾਖਾ',
            answer: 'goodbye',
            acceptableAnswers: ['bye'],
          },
        ],
      },
      {
        id: 'u5.l2',
        title: 'Thanks & Please',
        exercises: [
          {
            kind: 'multipleChoice',
            cardId: 'w.thanks',
            prompt: 'What does this mean?',
            questionGurmukhi: 'ਧੰਨਵਾਦ',
            choices: ['Thank you', 'Please', 'Sorry', 'Hello'],
            answer: 'Thank you',
          },
          {
            kind: 'listen',
            cardId: 'w.please',
            prompt: 'Tap what you hear.',
            speak: 'ਕਿਰਪਾ ਕਰਕੇ',
            choices: ['Please', 'Thank you', 'Sorry', 'Goodbye'],
            answer: 'Please',
          },
          {
            kind: 'multipleChoice',
            cardId: 'w.sorry',
            prompt: 'What does this mean?',
            questionGurmukhi: 'ਮਾਫ਼ ਕਰਨਾ',
            choices: ['Sorry', 'Thank you', 'Please', 'Hello'],
            answer: 'Sorry',
          },
          {
            kind: 'matchPairs',
            cardId: 'w.thanks',
            prompt: 'Match each phrase to its meaning.',
            pairs: [
              { gurmukhi: 'ਸਤ ਸ੍ਰੀ ਅਕਾਲ', english: 'Hello' },
              { gurmukhi: 'ਧੰਨਵਾਦ', english: 'Thank you' },
              { gurmukhi: 'ਕਿਰਪਾ ਕਰਕੇ', english: 'Please' },
              { gurmukhi: 'ਮਾਫ਼ ਕਰਨਾ', english: 'Sorry' },
            ],
          },
        ],
      },
      {
        id: 'u5.l3',
        title: 'Yes / No / How are you?',
        exercises: [
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
          {
            kind: 'wordBank',
            cardId: 'w.howareyou',
            prompt: 'Translate.',
            questionEnglish: 'How are you?',
            bank: ['ਤੁਸੀਂ', 'ਕਿਵੇਂ', 'ਹੋ', 'ਮੈਂ'],
            answer: ['ਤੁਸੀਂ', 'ਕਿਵੇਂ', 'ਹੋ'],
          },
          {
            kind: 'wordBank',
            cardId: 'w.iamfine',
            prompt: 'Translate.',
            questionEnglish: 'I am fine.',
            bank: ['ਮੈਂ', 'ਠੀਕ', 'ਹਾਂ', 'ਨਹੀਂ'],
            answer: ['ਮੈਂ', 'ਠੀਕ', 'ਹਾਂ'],
          },
          {
            kind: 'typeAnswer',
            cardId: 'w.iamfine',
            prompt: 'Translate to English.',
            questionGurmukhi: 'ਮੈਂ ਠੀਕ ਹਾਂ',
            answer: 'i am fine',
            acceptableAnswers: ['im fine', "i'm fine", 'i am ok', 'i am okay'],
          },
        ],
      },
    ],
  },

  // ============== Unit 6: Numbers ==============
  {
    id: 'u6',
    title: 'Numbers 1–10',
    description: 'Counting from one to ten.',
    lessons: [
      {
        id: 'u6.l1',
        title: 'One to Five',
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
          {
            kind: 'multipleChoice',
            cardId: 'n.4',
            prompt: 'What number is this?',
            questionGurmukhi: 'ਚਾਰ',
            choices: ['Three', 'Four', 'Five', 'Six'],
            answer: 'Four',
          },
          {
            kind: 'listen',
            cardId: 'n.5',
            prompt: 'Tap what you hear.',
            speak: 'ਪੰਜ',
            choices: ['Three', 'Four', 'Five', 'Six'],
            answer: 'Five',
          },
          {
            kind: 'matchPairs',
            cardId: 'n.5',
            prompt: 'Match each number to its name.',
            pairs: [
              { gurmukhi: 'ਇੱਕ', english: 'One' },
              { gurmukhi: 'ਦੋ', english: 'Two' },
              { gurmukhi: 'ਤਿੰਨ', english: 'Three' },
              { gurmukhi: 'ਚਾਰ', english: 'Four' },
              { gurmukhi: 'ਪੰਜ', english: 'Five' },
            ],
          },
        ],
      },
      {
        id: 'u6.l2',
        title: 'Six to Ten',
        exercises: [
          {
            kind: 'multipleChoice',
            cardId: 'n.6',
            prompt: 'What number is this?',
            questionGurmukhi: 'ਛੇ',
            choices: ['Five', 'Six', 'Seven', 'Eight'],
            answer: 'Six',
          },
          {
            kind: 'multipleChoice',
            cardId: 'n.7',
            prompt: 'What number is this?',
            questionGurmukhi: 'ਸੱਤ',
            choices: ['Six', 'Seven', 'Eight', 'Nine'],
            answer: 'Seven',
          },
          {
            kind: 'listen',
            cardId: 'n.8',
            prompt: 'Tap what you hear.',
            speak: 'ਅੱਠ',
            choices: ['Seven', 'Eight', 'Nine', 'Ten'],
            answer: 'Eight',
          },
          {
            kind: 'multipleChoice',
            cardId: 'n.9',
            prompt: 'What number is this?',
            questionGurmukhi: 'ਨੌਂ',
            choices: ['Seven', 'Eight', 'Nine', 'Ten'],
            answer: 'Nine',
          },
          {
            kind: 'multipleChoice',
            cardId: 'n.10',
            prompt: 'What number is this?',
            questionGurmukhi: 'ਦਸ',
            choices: ['Eight', 'Nine', 'Ten', 'Eleven'],
            answer: 'Ten',
          },
          {
            kind: 'matchPairs',
            cardId: 'n.10',
            prompt: 'Match each number to its name.',
            pairs: [
              { gurmukhi: 'ਛੇ', english: 'Six' },
              { gurmukhi: 'ਸੱਤ', english: 'Seven' },
              { gurmukhi: 'ਅੱਠ', english: 'Eight' },
              { gurmukhi: 'ਨੌਂ', english: 'Nine' },
              { gurmukhi: 'ਦਸ', english: 'Ten' },
            ],
          },
        ],
      },
    ],
  },

  // ============== Unit 7: Family ==============
  {
    id: 'u7',
    title: 'Family',
    description: 'Names for parents, siblings, and grandparents.',
    lessons: [
      {
        id: 'u7.l1',
        title: 'Parents & Siblings',
        exercises: [
          {
            kind: 'multipleChoice',
            cardId: 'f.father',
            prompt: 'What does this mean?',
            questionGurmukhi: 'ਪਿਤਾ',
            choices: ['Father', 'Mother', 'Brother', 'Sister'],
            answer: 'Father',
          },
          {
            kind: 'multipleChoice',
            cardId: 'f.mother',
            prompt: 'What does this mean?',
            questionGurmukhi: 'ਮਾਤਾ',
            choices: ['Father', 'Mother', 'Brother', 'Sister'],
            answer: 'Mother',
          },
          {
            kind: 'listen',
            cardId: 'f.brother',
            prompt: 'Tap what you hear.',
            speak: 'ਭਰਾ',
            choices: ['Brother', 'Sister', 'Son', 'Daughter'],
            answer: 'Brother',
          },
          {
            kind: 'multipleChoice',
            cardId: 'f.sister',
            prompt: 'What does this mean?',
            questionGurmukhi: 'ਭੈਣ',
            choices: ['Brother', 'Sister', 'Son', 'Daughter'],
            answer: 'Sister',
          },
          {
            kind: 'matchPairs',
            cardId: 'f.father',
            prompt: 'Match each word to its meaning.',
            pairs: [
              { gurmukhi: 'ਪਿਤਾ', english: 'Father' },
              { gurmukhi: 'ਮਾਤਾ', english: 'Mother' },
              { gurmukhi: 'ਭਰਾ', english: 'Brother' },
              { gurmukhi: 'ਭੈਣ', english: 'Sister' },
            ],
          },
        ],
      },
      {
        id: 'u7.l2',
        title: 'Children & Grandparents',
        exercises: [
          {
            kind: 'multipleChoice',
            cardId: 'f.son',
            prompt: 'What does this mean?',
            questionGurmukhi: 'ਪੁੱਤਰ',
            choices: ['Son', 'Daughter', 'Father', 'Brother'],
            answer: 'Son',
          },
          {
            kind: 'multipleChoice',
            cardId: 'f.daughter',
            prompt: 'What does this mean?',
            questionGurmukhi: 'ਧੀ',
            choices: ['Son', 'Daughter', 'Mother', 'Sister'],
            answer: 'Daughter',
          },
          {
            kind: 'multipleChoice',
            cardId: 'f.grandpa',
            prompt: 'What does this mean? (paternal)',
            questionGurmukhi: 'ਦਾਦਾ',
            choices: ['Grandfather', 'Grandmother', 'Father', 'Brother'],
            answer: 'Grandfather',
          },
          {
            kind: 'multipleChoice',
            cardId: 'f.grandma',
            prompt: 'What does this mean? (paternal)',
            questionGurmukhi: 'ਦਾਦੀ',
            choices: ['Grandfather', 'Grandmother', 'Mother', 'Sister'],
            answer: 'Grandmother',
          },
          {
            kind: 'wordBank',
            cardId: 'f.son',
            prompt: 'Translate.',
            questionEnglish: 'My son',
            bank: ['ਮੇਰਾ', 'ਪੁੱਤਰ', 'ਧੀ', 'ਮਾਤਾ'],
            answer: ['ਮੇਰਾ', 'ਪੁੱਤਰ'],
          },
        ],
      },
    ],
  },

  // ============== Unit 8: Food & Drink ==============
  {
    id: 'u8',
    title: 'Food & Drink',
    description: 'Order tea, ask for water, name the basics.',
    lessons: [
      {
        id: 'u8.l1',
        title: 'Water & Food',
        exercises: [
          {
            kind: 'listen',
            cardId: 'food.water',
            prompt: 'Tap what you hear.',
            speak: 'ਪਾਣੀ',
            choices: ['Water', 'Food', 'Tea', 'Milk'],
            answer: 'Water',
          },
          {
            kind: 'multipleChoice',
            cardId: 'food.food',
            prompt: 'What does this mean?',
            questionGurmukhi: 'ਖਾਣਾ',
            choices: ['Water', 'Food', 'Tea', 'Bread'],
            answer: 'Food',
          },
          {
            kind: 'fillBlank',
            cardId: 'food.water',
            prompt: 'Fill the blank: "I want water."',
            before: 'ਮੈਨੂੰ',
            after: 'ਚਾਹੀਦਾ ਹੈ',
            choices: ['ਪਾਣੀ', 'ਚਾਹ', 'ਦੁੱਧ', 'ਖਾਣਾ'],
            answer: 'ਪਾਣੀ',
          },
        ],
      },
      {
        id: 'u8.l2',
        title: 'Tea, Milk, Bread',
        exercises: [
          {
            kind: 'multipleChoice',
            cardId: 'food.tea',
            prompt: 'What does this mean?',
            questionGurmukhi: 'ਚਾਹ',
            choices: ['Tea', 'Milk', 'Sugar', 'Water'],
            answer: 'Tea',
          },
          {
            kind: 'listen',
            cardId: 'food.milk',
            prompt: 'Tap what you hear.',
            speak: 'ਦੁੱਧ',
            choices: ['Tea', 'Milk', 'Bread', 'Sugar'],
            answer: 'Milk',
          },
          {
            kind: 'multipleChoice',
            cardId: 'food.bread',
            prompt: 'What does this mean?',
            questionGurmukhi: 'ਰੋਟੀ',
            choices: ['Bread', 'Rice', 'Fruit', 'Sugar'],
            answer: 'Bread',
          },
          {
            kind: 'fillBlank',
            cardId: 'food.tea',
            prompt: 'Fill the blank: "Tea with milk."',
            before: '',
            after: 'ਨਾਲ ਦੁੱਧ',
            choices: ['ਚਾਹ', 'ਪਾਣੀ', 'ਰੋਟੀ', 'ਖਾਣਾ'],
            answer: 'ਚਾਹ',
          },
          {
            kind: 'matchPairs',
            cardId: 'food.milk',
            prompt: 'Match each word to its meaning.',
            pairs: [
              { gurmukhi: 'ਚਾਹ', english: 'Tea' },
              { gurmukhi: 'ਦੁੱਧ', english: 'Milk' },
              { gurmukhi: 'ਰੋਟੀ', english: 'Bread' },
              { gurmukhi: 'ਪਾਣੀ', english: 'Water' },
            ],
          },
        ],
      },
      {
        id: 'u8.l3',
        title: 'Rice, Fruit, Sweet',
        exercises: [
          {
            kind: 'multipleChoice',
            cardId: 'food.rice',
            prompt: 'What does this mean?',
            questionGurmukhi: 'ਚੌਲ',
            choices: ['Rice', 'Bread', 'Fruit', 'Sugar'],
            answer: 'Rice',
          },
          {
            kind: 'multipleChoice',
            cardId: 'food.fruit',
            prompt: 'What does this mean?',
            questionGurmukhi: 'ਫਲ',
            choices: ['Fruit', 'Vegetable', 'Sweet', 'Sugar'],
            answer: 'Fruit',
          },
          {
            kind: 'multipleChoice',
            cardId: 'food.veg',
            prompt: 'What does this mean?',
            questionGurmukhi: 'ਸਬਜ਼ੀ',
            choices: ['Fruit', 'Vegetable', 'Sweet', 'Bread'],
            answer: 'Vegetable',
          },
          {
            kind: 'multipleChoice',
            cardId: 'food.sweet',
            prompt: 'What does this mean?',
            questionGurmukhi: 'ਮਿੱਠਾ',
            choices: ['Sweet', 'Sour', 'Sugar', 'Salty'],
            answer: 'Sweet',
          },
          {
            kind: 'typeAnswer',
            cardId: 'food.sugar',
            prompt: 'Type the English meaning.',
            questionGurmukhi: 'ਖੰਡ',
            answer: 'sugar',
          },
        ],
      },
    ],
  },

  // ============== Unit 9: Time ==============
  {
    id: 'u9',
    title: 'Time & Days',
    description: 'Talk about today, tomorrow, morning and night.',
    lessons: [
      {
        id: 'u9.l1',
        title: 'Today & Now',
        exercises: [
          {
            kind: 'multipleChoice',
            cardId: 't.today',
            prompt: 'What does this mean?',
            questionGurmukhi: 'ਅੱਜ',
            choices: ['Today', 'Tomorrow', 'Yesterday', 'Now'],
            answer: 'Today',
          },
          {
            kind: 'multipleChoice',
            cardId: 't.now',
            prompt: 'What does this mean?',
            questionGurmukhi: 'ਹੁਣ',
            choices: ['Today', 'Now', 'Then', 'Day'],
            answer: 'Now',
          },
          {
            kind: 'multipleChoice',
            cardId: 't.day',
            prompt: 'What does this mean?',
            questionGurmukhi: 'ਦਿਨ',
            choices: ['Day', 'Night', 'Week', 'Year'],
            answer: 'Day',
          },
          {
            kind: 'multipleChoice',
            cardId: 't.week',
            prompt: 'What does this mean?',
            questionGurmukhi: 'ਹਫ਼ਤਾ',
            choices: ['Week', 'Day', 'Month', 'Year'],
            answer: 'Week',
          },
        ],
      },
      {
        id: 'u9.l2',
        title: 'Morning, Evening, Night',
        exercises: [
          {
            kind: 'multipleChoice',
            cardId: 't.morning',
            prompt: 'What does this mean?',
            questionGurmukhi: 'ਸਵੇਰ',
            choices: ['Morning', 'Evening', 'Night', 'Day'],
            answer: 'Morning',
          },
          {
            kind: 'multipleChoice',
            cardId: 't.evening',
            prompt: 'What does this mean?',
            questionGurmukhi: 'ਸ਼ਾਮ',
            choices: ['Morning', 'Evening', 'Night', 'Now'],
            answer: 'Evening',
          },
          {
            kind: 'listen',
            cardId: 't.night',
            prompt: 'Tap what you hear.',
            speak: 'ਰਾਤ',
            choices: ['Morning', 'Evening', 'Night', 'Day'],
            answer: 'Night',
          },
          {
            kind: 'matchPairs',
            cardId: 't.morning',
            prompt: 'Match each word to its meaning.',
            pairs: [
              { gurmukhi: 'ਸਵੇਰ', english: 'Morning' },
              { gurmukhi: 'ਸ਼ਾਮ', english: 'Evening' },
              { gurmukhi: 'ਰਾਤ', english: 'Night' },
              { gurmukhi: 'ਅੱਜ', english: 'Today' },
              { gurmukhi: 'ਹੁਣ', english: 'Now' },
            ],
          },
        ],
      },
    ],
  },

  // ============== Unit 10: Common Phrases ==============
  {
    id: 'u10',
    title: 'Common Phrases',
    description: 'Question words and "I want / I know" essentials.',
    lessons: [
      {
        id: 'u10.l1',
        title: 'Question Words',
        exercises: [
          {
            kind: 'multipleChoice',
            cardId: 'p.what',
            prompt: 'What does this mean?',
            questionGurmukhi: 'ਕੀ',
            choices: ['What', 'Where', 'Who', 'When'],
            answer: 'What',
          },
          {
            kind: 'multipleChoice',
            cardId: 'p.where',
            prompt: 'What does this mean?',
            questionGurmukhi: 'ਕਿੱਥੇ',
            choices: ['What', 'Where', 'Who', 'When'],
            answer: 'Where',
          },
          {
            kind: 'multipleChoice',
            cardId: 'p.who',
            prompt: 'What does this mean?',
            questionGurmukhi: 'ਕੌਣ',
            choices: ['What', 'Where', 'Who', 'When'],
            answer: 'Who',
          },
          {
            kind: 'multipleChoice',
            cardId: 'p.when',
            prompt: 'What does this mean?',
            questionGurmukhi: 'ਕਦੋਂ',
            choices: ['What', 'Where', 'Who', 'When'],
            answer: 'When',
          },
          {
            kind: 'multipleChoice',
            cardId: 'p.how',
            prompt: 'What does this mean?',
            questionGurmukhi: 'ਕਿਵੇਂ',
            choices: ['What', 'Where', 'How', 'Why'],
            answer: 'How',
          },
          {
            kind: 'matchPairs',
            cardId: 'p.what',
            prompt: 'Match each question word.',
            pairs: [
              { gurmukhi: 'ਕੀ', english: 'What' },
              { gurmukhi: 'ਕਿੱਥੇ', english: 'Where' },
              { gurmukhi: 'ਕੌਣ', english: 'Who' },
              { gurmukhi: 'ਕਦੋਂ', english: 'When' },
              { gurmukhi: 'ਕਿਵੇਂ', english: 'How' },
            ],
          },
        ],
      },
      {
        id: 'u10.l2',
        title: 'I want, I know',
        exercises: [
          {
            kind: 'multipleChoice',
            cardId: 'p.iwant',
            prompt: 'What does this mean?',
            questionGurmukhi: 'ਮੈਨੂੰ ਚਾਹੀਦਾ ਹੈ',
            choices: ['I want', "I don't know", 'I understand', 'I am fine'],
            answer: 'I want',
          },
          {
            kind: 'multipleChoice',
            cardId: 'p.idontknow',
            prompt: 'What does this mean?',
            questionGurmukhi: 'ਮੈਨੂੰ ਨਹੀਂ ਪਤਾ',
            choices: ['I want', "I don't know", 'I understand', 'I am fine'],
            answer: "I don't know",
          },
          {
            kind: 'multipleChoice',
            cardId: 'p.understand',
            prompt: 'What does this mean?',
            questionGurmukhi: 'ਮੈਨੂੰ ਸਮਝ ਆਈ',
            choices: ['I want', "I don't know", 'I understand', 'I am fine'],
            answer: 'I understand',
          },
          {
            kind: 'wordBank',
            cardId: 'p.iwant',
            prompt: 'Translate.',
            questionEnglish: 'I want tea.',
            bank: ['ਮੈਨੂੰ', 'ਚਾਹ', 'ਚਾਹੀਦੀ', 'ਹੈ', 'ਪਾਣੀ'],
            answer: ['ਮੈਨੂੰ', 'ਚਾਹ', 'ਚਾਹੀਦੀ', 'ਹੈ'],
          },
        ],
      },
      {
        id: 'u10.l3',
        title: 'Putting it together',
        exercises: [
          {
            kind: 'wordBank',
            cardId: 'food.water',
            prompt: 'Translate.',
            questionEnglish: 'I want water.',
            bank: ['ਮੈਨੂੰ', 'ਪਾਣੀ', 'ਚਾਹੀਦਾ', 'ਹੈ', 'ਚਾਹ'],
            answer: ['ਮੈਨੂੰ', 'ਪਾਣੀ', 'ਚਾਹੀਦਾ', 'ਹੈ'],
          },
          {
            kind: 'fillBlank',
            cardId: 'p.where',
            prompt: 'Fill the blank: "Where is the water?"',
            before: 'ਪਾਣੀ',
            after: 'ਹੈ?',
            choices: ['ਕਿੱਥੇ', 'ਕੀ', 'ਕੌਣ', 'ਕਦੋਂ'],
            answer: 'ਕਿੱਥੇ',
          },
          {
            kind: 'typeAnswer',
            cardId: 'w.iamfine',
            prompt: 'Translate to English.',
            questionGurmukhi: 'ਮੈਂ ਠੀਕ ਹਾਂ',
            answer: 'i am fine',
            acceptableAnswers: ["i'm fine", 'im fine', 'i am ok', 'i am okay'],
          },
          {
            kind: 'matchPairs',
            cardId: 'p.iwant',
            prompt: 'Final review — match the meanings.',
            pairs: [
              { gurmukhi: 'ਮੈਨੂੰ ਚਾਹੀਦਾ ਹੈ', english: 'I want' },
              { gurmukhi: 'ਮੈਨੂੰ ਨਹੀਂ ਪਤਾ', english: "I don't know" },
              { gurmukhi: 'ਮੈਨੂੰ ਸਮਝ ਆਈ', english: 'I understand' },
              { gurmukhi: 'ਮੈਂ ਠੀਕ ਹਾਂ', english: 'I am fine' },
            ],
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
