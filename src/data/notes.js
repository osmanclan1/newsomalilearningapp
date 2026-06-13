export const notesSections = [
  {
    id: 'greetings',
    title: 'Greetings',
    items: [
      { somali: 'Salaan', english: 'Hello' },
      { somali: 'Soo dhawoow', english: 'Welcome' },
      { somali: 'Mahadsanid', english: 'Thank you' },
      { somali: 'Haa', english: 'Yes' },
      { somali: 'Maya', english: 'No' },
      { somali: 'Fadlan', english: 'Please' },
      { somali: 'Hagaag', english: 'Alright' },
    ],
  },
  {
    id: 'questions',
    title: 'Question words',
    items: [
      { somali: 'Maxaad', english: 'What do you...' },
      { somali: 'Rabtaa', english: '...want' },
      { somali: 'Immisa', english: 'How much' },
      { somali: 'Xagee', english: 'Where' },
    ],
  },
  {
    id: 'food',
    title: 'Food & drink',
    items: [
      { somali: 'Baasto', english: 'Pasta' },
      { somali: 'Hilib', english: 'Meat' },
      { somali: 'Shaah', english: 'Tea' },
      { somali: 'Biyo', english: 'Water' },
      { somali: 'Rooti', english: 'Bread' },
      { somali: 'Caano', english: 'Milk' },
    ],
  },
  {
    id: 'numbers',
    title: 'Numbers',
    items: [
      { somali: 'Kow', english: '1' },
      { somali: 'Laba', english: '2' },
      { somali: 'Saddex', english: '3' },
      { somali: 'Afar', english: '4' },
      { somali: 'Shan', english: '5' },
      { somali: 'Lix', english: '6' },
      { somali: 'Toddoba', english: '7' },
    ],
  },
  {
    id: 'useful',
    title: 'Useful words',
    items: [
      { somali: 'Iyo', english: 'And' },
      { somali: 'Aad', english: 'Very' },
      { somali: 'Baad', english: 'You (emphatic)' },
      { somali: 'U', english: 'To (particle; aad baad u = very much)' },
      { somali: 'Waxba', english: 'Nothing' },
      { somali: 'Kale', english: 'Else / more' },
      { somali: 'Kuma', english: 'In it (not)' },
      { somali: 'Jiro', english: 'There is' },
      { somali: 'Waa', english: 'It is / here is' },
      { somali: 'Kan', english: 'This' },
      { somali: 'Keen', english: 'Bring' },
      { somali: 'Xisaabta', english: 'The bill' },
      { somali: 'Lacagta', english: 'The money' },
      { somali: 'Waaye', english: 'Is' },
      { somali: 'Qaado', english: 'Take' },
      { somali: 'Kuma jiro', english: 'Not in it' },
      { somali: 'Raali noqo', english: 'Sorry' },
      { somali: 'Dollar', english: 'Dollar' },
    ],
  },
]

const translationMap = new Map()
for (const section of notesSections) {
  for (const item of section.items) {
    translationMap.set(item.somali.toLowerCase(), item.english)
  }
}

export function getWordTranslation(word) {
  if (!word) return null
  return translationMap.get(word.toLowerCase()) ?? null
}
