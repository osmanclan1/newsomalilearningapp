export const lesson1a = {
  id: 'a',
  unitId: 1,
  unitTitle: 'People',
  lessonLabel: 'Lesson 1A',
  subtitle: 'I am from…',

  screens: [
    {
      id: 'spot-patterns',
      emoji: '🎨',
      title: 'Screen 1: Spot the Patterns',
      intro:
        'Look closely at how the starting words and the verb endings change together. They tell you exactly who is speaking:',
      step1: {
        emoji: '👤',
        title: 'Step 1: Choose the Person',
        markers: [
          {
            somali: 'Waxaan',
            label: 'I / We',
            note: 'Talking about myself or my group',
          },
          {
            somali: 'Waxaad',
            label: 'You',
            note: 'Talking directly to you',
          },
        ],
      },
      step2: {
        emoji: '🌍',
        title: 'Step 2: Choose Your Pattern',
        patterns: [
          {
            id: 'from',
            icon: '📍',
            title: 'Pattern A: "Coming From" (Naming a Country)',
            note: 'Notice how the i-, t-, and n- match the person:',
            accent: 'teal',
            rows: [
              {
                subject: 'Waxaan',
                connector: 'ka',
                verb: 'imid',
                english: 'I am from...',
              },
              {
                subject: 'Waxaad',
                connector: 'ka',
                verb: 'timid',
                english: 'You are from...',
              },
              {
                subject: 'Waxaan',
                connector: 'ka',
                verb: 'nimid',
                english: 'We are from...',
              },
            ],
          },
          {
            id: 'be',
            icon: '📍',
            title: 'Pattern B: "Being" (Naming a Nationality or Job)',
            note: 'Notice how ah-, tah-, and nah- match the person:',
            accent: 'violet',
            rows: [
              {
                subject: 'Waxaan',
                connector: null,
                verb: 'ahay',
                english: 'I am...',
              },
              {
                subject: 'Waxaad',
                connector: null,
                verb: 'tahay',
                english: 'You are...',
              },
              {
                subject: 'Waxaan',
                connector: null,
                verb: 'nahay',
                english: 'We are...',
              },
            ],
          },
        ],
      },
    },
    {
      id: 'building',
      emoji: '🧱',
      title: 'Screen 2: Building Sentences',
      intro: 'See the pattern? Just add the country at the end:',
      examples: [
        {
          somali: 'Waxaan ka imid Somalia.',
          english: 'I am from Somalia.',
          highlight: 'imid',
        },
        {
          somali: 'Waxaad ka timid Somalia.',
          english: 'You are from Somalia.',
          highlight: 'timid',
        },
        {
          somali: 'Waxaan ka nimid Spain.',
          english: 'We are from Spain.',
          highlight: 'nimid',
        },
      ],
    },
    {
      id: 'pattern-challenge',
      emoji: '🕹️',
      title: 'Screen 3: Pattern Challenge!',
      intro: 'Pick the missing words to complete the pattern puzzle.',
      checkLabel: 'Tap to check your score!',
      checkLabelSomali: 'Jawaabaha',
      rounds: [
        {
          id: 'round1',
          emoji: '🧩',
          title: 'Round 1: Country Match (From)',
        },
        {
          id: 'round2',
          emoji: '🧩',
          title: 'Round 2: Identity Match (Being)',
        },
        {
          id: 'round3',
          emoji: '⚠️',
          title: 'Round 3: The Ultimate Logic Test!',
        },
      ],
      questions: [
        {
          id: 'q1',
          roundId: 'round1',
          label: 'Q1',
          promptSomali: 'Waxaad ka timid London.',
          options: [
            { id: 'a', label: 'I am from London.' },
            { id: 'b', label: 'You are from London.' },
          ],
          correctId: 'b',
          explanation: 'You are from London. (Waxaad + timid = You)',
        },
        {
          id: 'q2',
          roundId: 'round1',
          label: 'Q2',
          promptSomali: 'Waxaan ka imid Canada.',
          options: [
            { id: 'a', label: 'I am from Canada.' },
            { id: 'b', label: 'You are from Canada.' },
          ],
          correctId: 'a',
          explanation: 'I am from Canada. (Waxaan + imid = I)',
        },
        {
          id: 'q3',
          roundId: 'round2',
          label: 'Q3',
          promptSomali: 'Waxaan ahay Somali.',
          options: [
            { id: 'a', label: 'I am Somali.' },
            { id: 'b', label: 'You are Somali.' },
          ],
          correctId: 'a',
          explanation: 'I am Somali. (Waxaan + ahay = I am)',
        },
        {
          id: 'q4',
          roundId: 'round2',
          label: 'Q4',
          promptSomali: 'Waxaad tahay American.',
          options: [
            { id: 'a', label: 'I am American.' },
            { id: 'b', label: 'You are American.' },
          ],
          correctId: 'b',
          explanation: 'You are American. (Waxaad + tahay = You are)',
        },
        {
          id: 'q5',
          roundId: 'round3',
          label: 'Q5',
          promptText: 'Choose the ONLY correct sentence:',
          options: [
            {
              id: 'a',
              label: 'Waxaan ahay Somalia.',
              sublabel: 'I am the country of Somalia',
            },
            {
              id: 'b',
              label: 'Waxaan ka imid Somalia.',
              sublabel: 'I am from the country of Somalia',
            },
          ],
          correctId: 'b',
          explanation:
            'Waxaan ka imid Somalia. (You cannot be a physical country, you must come from it!)',
        },
      ],
    },
  ],
}
