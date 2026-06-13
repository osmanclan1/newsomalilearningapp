/**
 * Conversation content keyed by world → theme → level → path.
 *
 * For each `response` exchange, list every valid answer in `acceptedAnswers`.
 * Each entry is an ordered array of tile strings (must match wordBank spelling).
 */

const restaurantLevel1 = {
  A: {
    npc: { name: 'Hassan', role: 'the waiter' },
    exchanges: [
      {
        type: 'npc',
        somali: 'Salaan, soo dhawoow!',
        english: 'Hello, welcome!',
      },
      {
        type: 'npc',
        somali: 'Maxaad rabtaa?',
        english: 'What would you like?',
      },
      {
        type: 'response',
        wordBank: ['Baasto', 'iyo', 'biyo', 'shaah', 'fadlan', 'mahadsanid'],
        acceptedAnswers: [
          ['Baasto', 'fadlan'],
          ['biyo', 'fadlan'],
          ['shaah', 'fadlan'],
          ['Baasto', 'iyo', 'biyo', 'fadlan'],
          ['Baasto', 'iyo', 'shaah', 'fadlan'],
          ['biyo', 'iyo', 'shaah', 'fadlan'],
        ],
      },
      {
        type: 'npc',
        somali: 'Waa hagaag, wax kale?',
        english: 'Alright, anything else?',
      },
      {
        type: 'response',
        wordBank: ['Waxba', 'kale', 'mahadsanid', 'fadlan', 'biyo'],
        acceptedAnswers: [
          ['Waxba', 'kale', 'mahadsanid'],
          ['Waxba', 'mahadsanid'],
          ['Mahadsanid'],
        ],
      },
    ],
  },
  B: {
    npc: { name: 'Hassan', role: 'the waiter' },
    exchanges: [
      {
        type: 'npc',
        somali: 'Waa kan cuntadii. Ma ku raaxaysatay?',
        english: 'Here is the food. Did you enjoy it?',
      },
      {
        type: 'response',
        wordBank: ['Haa', 'aad', 'baad', 'u', 'mahadsanid', 'maya'],
        acceptedAnswers: [
          ['Haa', 'mahadsanid'],
          ['Haa', 'aad', 'baad', 'u', 'mahadsanid'],
          ['Haa', 'mahadsanid', 'u'],

        ],
      },
      {
        type: 'npc',
        somali: 'Waa hagaag! Ma rabtaa xisaabta?',
        english: 'Excellent! Do you want the bill?',
      },
      {
        type: 'response',
        wordBank: ['Haa', 'fadlan', 'keen', 'xisaabta', 'maya'],
        acceptedAnswers: [
          ['Haa', 'fadlan'],
          ['keen', 'xisaabta', 'fadlan'],
        ],
      },
      {
        type: 'npc',
        somali: 'Waa kan. Waa toban dollar.',
        english: 'Here it is. It is ten dollars.',
      },
      {
        type: 'response',
        wordBank: ['Waa', 'kan', 'lacagta', 'waaye', 'mahadsanid', 'qaado'],
        acceptedAnswers: [
          ['Waa', 'kan', 'lacagta', 'mahadsanid'],
          ['Waa', 'lacagta', 'mahadsanid'],
          ['Mahadsanid'],
        ],
      },
    ],
  },
  
 
  C: {
    npc: { name: 'Hassan', role: 'the waiter' },
    exchanges: [
      {
        type: 'npc',
        somali: 'Soo dhawoow!',
        english: 'Welcome!',
      },
      {
        type: 'npc',
        somali: 'Maxaad rabtaa?',
        english: 'What would you like?',
      },
      {
        type: 'response',
        wordBank: ['Hilib', 'kuma', 'jiro', 'baasto', 'fadlan', 'biyo'],
        acceptedAnswers: [['Hilib', 'kuma', 'jiro']],
      },
      {
        type: 'npc',
        somali: 'Raali noqo! Waan soo keenayaa.',
        english: 'Sorry! I will bring it.',
      },
      {
        type: 'response',
        wordBank: ['Mahadsanid', 'hagaag', 'fadlan', 'biyo'],
        acceptedAnswers: [['Mahadsanid']],
      },
    ],
  },
}

const restaurantLevel2Placeholder = {
  A: {
    npc: { name: 'Hassan', role: 'the waiter' },
    exchanges: [
      {
        type: 'npc',
        somali: 'Salaan! Maanta wax cusub ayaan haynaa.',
        english: 'Hello! We have something new today.',
      },
      {
        type: 'response',
        wordBank: ['Waa', 'hagaag', 'mahadsanid', 'fadlan'],
        acceptedAnswers: [['Waa', 'hagaag']],
      },
    ],
  },
  B: {
    npc: { name: 'Hassan', role: 'the waiter' },
    exchanges: [
      {
        type: 'npc',
        somali: 'Immisa ayay ku kacaysaa?',
        english: 'How much does it cost?',
      },
      {
        type: 'response',
        wordBank: ['Shan', 'dollar', 'laba', 'afar'],
        acceptedAnswers: [['Shan', 'dollar']],
      },
    ],
  },
  C: {
    npc: { name: 'Hassan', role: 'the waiter' },
    exchanges: [
      {
        type: 'npc',
        somali: 'Ma rabtaa shaah?',
        english: 'Would you like tea?',
      },
      {
        type: 'response',
        wordBank: ['Haa', 'fadlan', 'maya', 'biyo'],
        acceptedAnswers: [['Haa', 'fadlan']],
      },
    ],
  },
}

const conversations = {
  beginner: {
    restaurant: {
      1: restaurantLevel1,
      2: restaurantLevel2Placeholder,
    },
  },
}

export const PATH_IDS = ['A', 'B', 'C']

export function getPathConversation(worldId, themeId, level, pathId) {
  return conversations[worldId]?.[themeId]?.[level]?.[pathId] ?? null
}

export function isThemePlayable(theme) {
  return theme?.available === true
}
