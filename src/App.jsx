import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import ConversationScreen from './screens/ConversationScreen'
import LevelSelect from './screens/LevelSelect'
import WorldMap from './screens/WorldMap'

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-[100dvh] bg-surface text-slate-900">
        <Routes>
          <Route path="/" element={<WorldMap />} />
          <Route path="/world/:worldId/theme/:themeId" element={<LevelSelect />} />
          <Route
            path="/world/:worldId/theme/:themeId/level/:level/path/:pathId"
            element={<ConversationScreen />}
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}
