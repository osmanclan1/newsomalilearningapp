import { Link, useParams } from 'react-router-dom'
import { getTheme, getWorld } from '../data/worlds'
import { PATH_IDS } from '../data/conversations'
import {
  useProgressStore,
  isLevelUnlocked,
  isLevelComplete,
  isPathUnlocked,
} from '../store/progressStore'

export default function LevelSelect() {
  const { worldId, themeId } = useParams()
  const completedPaths = useProgressStore((s) => s.completedPaths)
  const world = getWorld(worldId)
  const theme = getTheme(worldId, themeId)

  if (!theme || !world) {
    return (
      <p className="p-6 text-slate-600">
        Theme not found.{' '}
        <Link to="/" className="text-brand underline">
          Back to map
        </Link>
      </p>
    )
  }

  return (
    <div className="mx-auto min-h-full max-w-lg px-4 pb-8 pt-4">
      <Link
        to="/"
        className="inline-flex items-center gap-1 text-sm font-medium text-brand"
      >
        ← {world.name}
      </Link>
      <header className="mt-4 mb-6">
        <span className="text-4xl" aria-hidden>
          {theme.icon}
        </span>
        <h1 className="mt-2 text-2xl font-bold text-slate-900">{theme.name}</h1>
      </header>

      <div className="flex flex-col gap-4">
        {[1, 2].map((level) => {
          const unlocked = isLevelUnlocked(completedPaths, worldId, themeId, level)
          const pathState = completedPaths[worldId]?.[themeId]?.[level] ?? {}
          const complete = isLevelComplete(pathState)

          return (
            <div
              key={level}
              className={`rounded-2xl border p-5 ${
                unlocked
                  ? 'border-violet-100 bg-white shadow-sm'
                  : 'border-slate-100 bg-slate-50 opacity-75'
              }`}
            >
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-slate-900">Level {level}</h2>
                {!unlocked && (
                  <span className="flex items-center gap-1 text-xs font-medium text-slate-500">
                    🔒 Complete Level {level - 1} first
                  </span>
                )}
                {complete && unlocked && (
                  <span className="text-xs font-semibold text-emerald-600">Complete</span>
                )}
              </div>

              <div className="mt-3 flex gap-2">
                {PATH_IDS.map((pathId) => {
                  const done = pathState[pathId]
                  const pathUnlocked = isPathUnlocked(pathState, pathId)

                  if (!unlocked) {
                    return (
                      <span
                        key={pathId}
                        className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-200 text-xs font-bold text-slate-400"
                      >
                        {pathId}
                      </span>
                    )
                  }

                  if (!pathUnlocked) {
                    return (
                      <span
                        key={pathId}
                        title={`Complete Path ${pathId === 'B' ? 'A' : 'B'} first`}
                        className="flex h-9 w-9 items-center justify-center rounded-lg border border-dashed border-slate-300 text-xs font-bold text-slate-300"
                      >
                        {pathId}
                      </span>
                    )
                  }

                  return (
                    <Link
                      key={pathId}
                      to={`/world/${worldId}/theme/${themeId}/level/${level}/path/${pathId}`}
                      className={`flex h-9 flex-1 items-center justify-center rounded-lg text-xs font-bold transition ${
                        done
                          ? 'bg-emerald-100 text-emerald-700'
                          : 'bg-brand-soft text-brand hover:bg-violet-200'
                      }`}
                    >
                      Path {pathId}
                      {done ? ' ✓' : ''}
                    </Link>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
