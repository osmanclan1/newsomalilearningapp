export default function ChatBubble({ somali, english, align = 'left', npc }) {
  const isUser = align === 'right'

  return (
    <div
      className={`flex gap-2 ${isUser ? 'flex-row-reverse' : 'flex-row'} mb-4`}
    >
      {!isUser && (
        <div
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-violet-100 text-lg"
          aria-hidden
        >
          🧑‍🍳
        </div>
      )}
      <div className={`max-w-[85%] ${isUser ? 'items-end' : 'items-start'} flex flex-col`}>
        {!isUser && npc && (
          <span className="mb-1 text-xs font-medium text-slate-500">{npc.name}</span>
        )}
        <div
          className={`rounded-2xl px-4 py-3 shadow-sm ${
            isUser
              ? 'rounded-br-md bg-brand text-white'
              : 'rounded-bl-md border border-slate-100 bg-white text-slate-900'
          }`}
        >
          <p className={`text-base font-medium leading-snug ${isUser ? 'text-white' : ''}`}>
            {somali}
          </p>
          {!isUser && english && (
            <p className="mt-1 text-sm text-slate-500">{english}</p>
          )}
        </div>
      </div>
    </div>
  )
}
