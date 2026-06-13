import { useCallback, useEffect, useRef, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import ChatBubble from '../components/ChatBubble'
import NotesPanel from '../components/NotesPanel'
import ResponseBuilder from '../components/ResponseBuilder'
import { getPathConversation, PATH_IDS } from '../data/conversations'
import { getTheme, getWorld } from '../data/worlds'
import { useProgressStore, isPathUnlocked } from '../store/progressStore'
import { formatUserResponse } from '../utils/answerCheck'

export default function ConversationScreen() {
  const { worldId, themeId, level: levelParam, pathId } = useParams()
  const level = Number(levelParam)
  const navigate = useNavigate()
  const completePath = useProgressStore((s) => s.completePath)
  const completedPaths = useProgressStore((s) => s.completedPaths)

  const conversation = getPathConversation(worldId, themeId, level, pathId)
  const world = getWorld(worldId)
  const theme = getTheme(worldId, themeId)
  const pathState = completedPaths[worldId]?.[themeId]?.[level] ?? {}

  const [exchangeIndex, setExchangeIndex] = useState(0)
  const [chatHistory, setChatHistory] = useState([])
  const [notesOpen, setNotesOpen] = useState(false)
  const [pathComplete, setPathComplete] = useState(false)
  const scrollRef = useRef(null)

  const collectNpcLines = useCallback((startIndex, exchanges) => {
    let i = startIndex
    const lines = []
    while (i < exchanges.length && exchanges[i].type === 'npc') {
      const ex = exchanges[i]
      lines.push({ type: 'npc', somali: ex.somali, english: ex.english })
      i++
    }
    return { lines, nextIndex: i }
  }, [])

  useEffect(() => {
    if (!conversation) return
    const { lines, nextIndex } = collectNpcLines(0, conversation.exchanges)
    setChatHistory(lines)
    setExchangeIndex(nextIndex)
    setPathComplete(false)
  }, [conversation, worldId, themeId, level, pathId, collectNpcLines])

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
  }, [chatHistory, pathComplete])

  if (!conversation || !theme || !world) {
    return (
      <p className="p-6 text-slate-600">
        Lesson not found.{' '}
        <Link
          to={`/world/${worldId}/theme/${themeId}`}
          className="text-brand underline"
        >
          Back
        </Link>
      </p>
    )
  }

  const exchanges = conversation.exchanges
  const current = exchanges[exchangeIndex]
  const npc = conversation.npc

  const handleCorrect = (words) => {
    const responseText = formatUserResponse(words)
    const userLine = { type: 'user', somali: responseText }
    const nextIndex = exchangeIndex + 1

    if (nextIndex >= exchanges.length) {
      setChatHistory((h) => [...h, userLine])
      completePath(worldId, themeId, level, pathId)
      setPathComplete(true)
      return
    }

    const { lines, nextIndex: afterNpc } = collectNpcLines(nextIndex, exchanges)
    setChatHistory((h) => [...h, userLine, ...lines])
    setExchangeIndex(afterNpc)
  }

  const switchPath = (id) => {
    if (!isPathUnlocked(pathState, id) && id !== pathId) return
    navigate(`/world/${worldId}/theme/${themeId}/level/${level}/path/${id}`)
  }

  const showBuilder = current?.type === 'response' && !pathComplete

  return (
    <div className="flex h-full min-h-[100dvh] flex-col bg-surface">
      <header className="shrink-0 border-b border-slate-200 bg-white px-3 py-3">
        <div className="flex items-center justify-between gap-2">
          <Link
            to={`/world/${worldId}/theme/${themeId}`}
            className="text-sm font-medium text-brand"
          >
            ←
          </Link>
          <div className="min-w-0 flex-1 text-center">
            <p className="truncate text-xs font-semibold text-brand">{world.name}</p>
            <p className="truncate text-sm font-bold text-slate-900">
              {theme.name} · L{level}
            </p>
          </div>
          <button
            type="button"
            onClick={() => setNotesOpen(true)}
            className="rounded-lg bg-brand-soft px-3 py-1.5 text-xs font-bold text-brand"
          >
            Notes
          </button>
        </div>
        <div className="mt-3 flex justify-center gap-1">
          {PATH_IDS.map((id) => {
            const unlocked = isPathUnlocked(pathState, id) || id === pathId
            const active = id === pathId
            const done = pathState[id]
            return (
              <button
                key={id}
                type="button"
                disabled={!unlocked}
                onClick={() => switchPath(id)}
                className={`rounded-lg px-4 py-1.5 text-xs font-bold transition ${
                  active
                    ? 'bg-brand text-white'
                    : unlocked
                      ? done
                        ? 'bg-emerald-100 text-emerald-700'
                        : 'bg-slate-100 text-slate-600'
                      : 'cursor-not-allowed bg-slate-50 text-slate-300'
                }`}
              >
                {id}
                {!unlocked && ' 🔒'}
              </button>
            )
          })}
        </div>
      </header>

      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4">
        {chatHistory.map((msg, i) => (
          <ChatBubble
            key={`${i}-${msg.somali}`}
            somali={msg.somali}
            english={msg.english}
            align={msg.type === 'user' ? 'right' : 'left'}
            npc={msg.type === 'npc' ? npc : undefined}
          />
        ))}

        {pathComplete && (
          <div className="mx-auto mt-6 max-w-sm rounded-2xl bg-emerald-50 p-6 text-center">
            <p className="text-lg font-bold text-emerald-800">Path {pathId} complete!</p>
            <Link
              to={`/world/${worldId}/theme/${themeId}`}
              className="mt-4 inline-block rounded-xl bg-brand px-6 py-2 text-sm font-bold text-white"
            >
              Back to levels
            </Link>
          </div>
        )}
      </div>

      {showBuilder && (
        <ResponseBuilder
          key={`${pathId}-${exchangeIndex}`}
          wordBank={current.wordBank}
          acceptedAnswers={current.acceptedAnswers}
          onCorrect={handleCorrect}
        />
      )}

      <NotesPanel open={notesOpen} onClose={() => setNotesOpen(false)} />
    </div>
  )
}
