export const WORLDS = [
  {
    id: 'beginner',
    name: 'Beginner World',
    themes: [
      {
        id: 'restaurant',
        name: 'Ordering at a Restaurant',
        icon: '🍽️',
        available: true,
        npc: { name: 'Hassan', role: 'the waiter' },
        levels: 2,
      },
      {
        id: 'greetings',
        name: 'Greetings & Introductions',
        icon: '👋',
        available: false,
        levels: 2,
      },
      {
        id: 'market',
        name: 'Shopping at a Market',
        icon: '🛒',
        available: false,
        levels: 2,
      },
      {
        id: 'directions',
        name: 'Asking for Directions',
        icon: '🧭',
        available: false,
        levels: 2,
      },
      {
        id: 'family',
        name: 'Family & Relationships',
        icon: '👨‍👩‍👧',
        available: false,
        levels: 2,
      },
      {
        id: 'numbers',
        name: 'Numbers & Money',
        icon: '💰',
        available: false,
        levels: 2,
      },
      {
        id: 'doctor',
        name: 'At the Doctor',
        icon: '🏥',
        available: false,
        levels: 2,
      },
      {
        id: 'transport',
        name: 'Transportation',
        icon: '🚌',
        available: false,
        levels: 2,
      },
    ],
  },
]

export const NEXT_WORLD_PREVIEW = {
  id: 'intermediate',
  name: 'Intermediate World',
}

export function getWorld(worldId) {
  return WORLDS.find((w) => w.id === worldId)
}

export function getTheme(worldId, themeId) {
  const world = getWorld(worldId)
  return world?.themes.find((t) => t.id === themeId)
}
