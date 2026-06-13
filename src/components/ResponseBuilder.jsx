import { useCallback, useEffect, useState } from 'react'
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  closestCenter,
} from '@dnd-kit/core'
import DropZone from './DropZone'
import WordBank from './WordBank'
import WordTile from './WordTile'
import { validateAnswer } from '../utils/answerCheck'

function makeTiles(words, prefix) {
  return words.map((word, i) => ({
    id: `${prefix}-${i}-${word}`,
    word,
  }))
}

export default function ResponseBuilder({ wordBank, acceptedAnswers, onCorrect }) {
  const exchange = { acceptedAnswers }
  const [bankTiles, setBankTiles] = useState([])
  const [zoneTiles, setZoneTiles] = useState([])
  const [feedback, setFeedback] = useState(null)
  const [activeTile, setActiveTile] = useState(null)

  const reset = useCallback(() => {
    setBankTiles(makeTiles(wordBank, 'bank'))
    setZoneTiles([])
    setFeedback(null)
  }, [wordBank])

  useEffect(() => {
    reset()
  }, [reset])

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
  )

  const moveToZone = (tileId) => {
    const fromBank = bankTiles.find((t) => t.id === tileId)
    if (fromBank) {
      setBankTiles((b) => b.filter((t) => t.id !== tileId))
      setZoneTiles((z) => [...z, fromBank])
      setFeedback(null)
      return
    }
    const fromZone = zoneTiles.find((t) => t.id === tileId)
    if (fromZone) {
      setZoneTiles((z) => z.filter((t) => t.id !== tileId))
      setBankTiles((b) => [...b, fromZone])
      setFeedback(null)
    }
  }

  const handleDragStart = (event) => {
    const tile =
      bankTiles.find((t) => t.id === event.active.id) ||
      zoneTiles.find((t) => t.id === event.active.id)
    setActiveTile(tile ?? null)
  }

  const handleDragEnd = (event) => {
    setActiveTile(null)
    const { active, over } = event
    if (!over) return

    const tileId = active.id
    const inZone = zoneTiles.some((t) => t.id === tileId)
    const inBank = bankTiles.some((t) => t.id === tileId)

    if (over.id === 'drop-zone' && inBank) {
      const tile = bankTiles.find((t) => t.id === tileId)
      setBankTiles((b) => b.filter((t) => t.id !== tileId))
      setZoneTiles((z) => [...z, tile])
      setFeedback(null)
    } else if (over.id === 'word-bank' && inZone) {
      const tile = zoneTiles.find((t) => t.id === tileId)
      setZoneTiles((z) => z.filter((t) => t.id !== tileId))
      setBankTiles((b) => [...b, tile])
      setFeedback(null)
    }
  }

  const handleConfirm = () => {
    const selected = zoneTiles.map((t) => t.word)
    if (validateAnswer(selected, exchange)) {
      setFeedback({ type: 'success', message: 'Correct!' })
      onCorrect(selected)
    } else {
      setFeedback({
        type: 'error',
        message: 'Not quite — try rearranging your words.',
      })
    }
  }

  const canConfirm = zoneTiles.length > 0

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="border-t border-slate-200 bg-white px-4 py-4 pb-6 shadow-[0_-4px_24px_rgba(0,0,0,0.06)]">
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
          Build your response
        </p>
        <DropZone zoneTiles={zoneTiles} onTileClick={moveToZone} />
        <div className="mt-3">
          <WordBank bankTiles={bankTiles} onTileClick={moveToZone} />
        </div>
        {feedback && (
          <p
            className={`mt-3 text-center text-sm font-medium ${
              feedback.type === 'success' ? 'text-emerald-600' : 'text-coral'
            }`}
          >
            {feedback.message}
          </p>
        )}
        <button
          type="button"
          disabled={!canConfirm}
          onClick={handleConfirm}
          className="mt-4 w-full rounded-xl bg-brand py-3 text-sm font-bold text-white transition enabled:hover:bg-brand-light disabled:cursor-not-allowed disabled:opacity-40"
        >
          Confirm
        </button>
      </div>
      <DragOverlay>
        {activeTile ? (
          <WordTile id={activeTile.id} word={activeTile.word} variant="zone" />
        ) : null}
      </DragOverlay>
    </DndContext>
  )
}
