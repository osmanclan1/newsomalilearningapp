import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { WORLDS } from '../data/worlds'

const STORAGE_KEY = 'somali-learn-progress'

function emptyPathState() {
  return { A: false, B: false, C: false }
}

function buildInitialPaths() {
  const paths = {}
  for (const world of WORLDS) {
    paths[world.id] = {}
    for (const theme of world.themes) {
      paths[world.id][theme.id] = {
        1: emptyPathState(),
        2: emptyPathState(),
      }
    }
  }
  return paths
}

export function isLevelComplete(pathState) {
  return pathState?.A && pathState?.B
}

export function isPathUnlocked(pathState, pathId) {
  if (pathId === 'A') return true
  if (pathId === 'B') return pathState?.A === true
  if (pathId === 'C') return pathState?.B === true
  return false
}

export function isLevelUnlocked(paths, worldId, themeId, level) {
  if (level === 1) return true
  const prev = paths[worldId]?.[themeId]?.[level - 1]
  return isLevelComplete(prev)
}

export function countCompletedLevels(paths, worldId, themeId) {
  let count = 0
  for (const level of [1, 2]) {
    if (isLevelComplete(paths[worldId]?.[themeId]?.[level])) count++
  }
  return count
}

export function isThemeComplete(paths, worldId, themeId) {
  return countCompletedLevels(paths, worldId, themeId) === 2
}

export function isWorldComplete(paths, worldId, playableThemeIds) {
  return playableThemeIds.every((themeId) =>
    isThemeComplete(paths, worldId, themeId),
  )
}

export const useProgressStore = create(
  persist(
    (set, get) => ({
      unlockedWorlds: ['beginner'],
      completedPaths: buildInitialPaths(),
      completedLessons: {},

      completeLesson: (unitId, lessonId) => {
        set((state) => ({
          completedLessons: {
            ...state.completedLessons,
            [`${unitId}-${lessonId}`]: true,
          },
        }))
      },

      isLessonComplete: (unitId, lessonId) => {
        return get().completedLessons[`${unitId}-${lessonId}`] === true
      },

      completePath: (worldId, themeId, level, pathId) => {
        set((state) => {
          const world = { ...state.completedPaths[worldId] }
          const theme = { ...world[themeId] }
          const levelPaths = { ...theme[level], [pathId]: true }
          theme[level] = levelPaths
          world[themeId] = theme
          return {
            completedPaths: {
              ...state.completedPaths,
              [worldId]: world,
            },
          }
        })
      },

      resetProgress: () => {
        set({
          unlockedWorlds: ['beginner'],
          completedPaths: buildInitialPaths(),
          completedLessons: {},
        })
      },

      getPathState: (worldId, themeId, level) => {
        return get().completedPaths[worldId]?.[themeId]?.[level] ?? emptyPathState()
      },
    }),
    { name: STORAGE_KEY },
  ),
)
