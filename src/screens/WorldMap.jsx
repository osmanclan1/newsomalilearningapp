import { useState } from 'react'
import { Link } from 'react-router-dom'
import { WORLDS, NEXT_WORLD_PREVIEW } from '../data/worlds'
import {
  useProgressStore,
  countCompletedLevels,
  isWorldComplete,
  isThemeComplete,
} from '../store/progressStore'

const WORLD_ID = 'beginner'
const PLAYABLE_THEMES = ['restaurant']

export default function WorldMap() {
  const completedPaths = useProgressStore((s) => s.completedPaths)
  const lesson1aDone = useProgressStore((s) => s.isLessonComplete(1, 'a'))
  const world = WORLDS[0]
  const [tooltipTheme, setTooltipTheme] = useState(null)

  const totalLevels = world.themes.reduce((sum, t) => sum + t.levels, 0)
  const completedLevels = world.themes.reduce(
    (sum, t) => sum + countCompletedLevels(completedPaths, WORLD_ID, t.id),
    0,
  )
  const progressPct = totalLevels > 0 ? (completedLevels / totalLevels) * 100 : 0

  const nextWorldUnlocked = isWorldComplete(
    completedPaths,
    WORLD_ID,
    PLAYABLE_THEMES,
  )

  return (
    <div className="mx-auto min-h-full max-w-lg px-4 pb-8 pt-6">
      <section className="mb-8">
        <p className="text-xs font-semibold uppercase tracking-wide text-brand">
          Unit 1
        </p>
        <h2 className="text-xl font-bold text-slate-900">People</h2>
        <Link
          to="/unit/1/lesson/a"
          className="relative mt-3 flex items-center gap-4 rounded-2xl border border-violet-100 bg-white p-4 shadow-sm transition hover:border-brand hover:shadow-md"
        >
          <span className="text-3xl" aria-hidden>
            📘
          </span>
          <div className="min-w-0 flex-1">
            <h3 className="text-sm font-bold text-slate-900">Lesson 1A: I am from…</h3>
            <p className="mt-0.5 text-xs text-slate-500">
              Spot the patterns — imid, timid, nimid
            </p>
          </div>
          {lesson1aDone && (
            <span className="text-emerald-500" aria-label="Complete">
              ✓
            </span>
          )}
        </Link>
      </section>

      <header className="mb-6">
        <p className="text-xs font-semibold uppercase tracking-wide text-brand">
          World
        </p>
        <h1 className="text-2xl font-bold text-slate-900">{world.name}</h1>
        <div className="mt-4">
          <div className="mb-1 flex justify-between text-xs text-slate-500">
            <span>World progress</span>
            <span>
              {completedLevels}/{totalLevels} levels
            </span>
          </div>
          <div className="h-2.5 overflow-hidden rounded-full bg-slate-200">
            <div
              className="h-full rounded-full bg-brand transition-all duration-500"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>
      </header>

      <div className="grid grid-cols-2 gap-3">
        {world.themes.map((theme) => {
          const done = countCompletedLevels(completedPaths, WORLD_ID, theme.id)
          const complete = isThemeComplete(completedPaths, WORLD_ID, theme.id)
          const playable = theme.available

          const cardInner = (
            <>
              <span className="text-3xl" aria-hidden>
                {theme.icon}
              </span>
              <h2 className="mt-2 text-sm font-bold leading-tight text-slate-900">
                {theme.name}
              </h2>
              <p className="mt-1 text-xs text-slate-500">
                {playable ? `${done}/2 levels` : 'Coming soon'}
              </p>
              {complete && (
                <span className="absolute right-2 top-2 text-emerald-500" aria-label="Complete">
                  ✓
                </span>
              )}
            </>
          )

          if (!playable) {
            return (
              <button
                key={theme.id}
                type="button"
                className="relative rounded-2xl border border-slate-100 bg-slate-50 p-4 text-left opacity-60"
                onClick={() =>
                  setTooltipTheme(tooltipTheme === theme.id ? null : theme.id)
                }
              >
                {cardInner}
                {tooltipTheme === theme.id && (
                  <p className="mt-2 text-xs text-slate-500">
                    More themes are on the way — restaurant is ready to play!
                  </p>
                )}
              </button>
            )
          }

          return (
            <Link
              key={theme.id}
              to={`/world/${WORLD_ID}/theme/${theme.id}`}
              className="relative rounded-2xl border border-violet-100 bg-white p-4 shadow-sm transition hover:border-brand hover:shadow-md"
            >
              {cardInner}
            </Link>
          )
        })}
      </div>

      <div className="mt-8">
        <div
          className={`rounded-2xl border-2 border-dashed p-5 text-center ${
            nextWorldUnlocked
              ? 'border-emerald-300 bg-emerald-50'
              : 'border-slate-200 bg-slate-50 opacity-70'
          }`}
        >
          {!nextWorldUnlocked && (
            <span className="mb-2 inline-block text-2xl" aria-hidden>
              🔒
            </span>
          )}
          <p className="text-sm font-bold text-slate-700">{NEXT_WORLD_PREVIEW.name}</p>
          <p className="mt-1 text-xs text-slate-500">
            {nextWorldUnlocked
              ? 'Unlocked — coming in a future update!'
              : 'Complete all restaurant levels (Path A + B) to unlock'}
          </p>
        </div>
      </div>
    </div>
  )
}
