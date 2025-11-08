import { Routes, Route, Navigate, useNavigate } from 'react-router-dom'
import { useWelcomeState } from './hooks/useWelcomeState'
import { Welcome } from './components/Welcome/Welcome'
import { Dashboard } from './components/Dashboard/Dashboard'
import { FloatingHearts } from './components/FloatingHearts'
import './App.css'

function App() {
  const { shouldShowWelcome, dismissWelcome, resetWelcome, isLoading } = useWelcomeState()
  const navigate = useNavigate()

  if (isLoading) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        background: '#0b0f14',
        color: '#e6f1f5'
      }}>
        Cargando...
      </div>
    )
  }

  const handleEnter = () => {
    dismissWelcome(false)
    navigate('/dashboard')
  }

  const handleShowWelcome = () => {
    resetWelcome()
    navigate('/welcome')
  }

  return (
    <>
      <FloatingHearts />
      <Routes>
        <Route 
          path="/welcome" 
          element={
            <Welcome onEnter={handleEnter} />
          } 
        />
        <Route 
          path="/dashboard" 
          element={
            <Dashboard onShowWelcome={handleShowWelcome} />
          } 
        />
        <Route 
          path="/" 
          element={
            <Navigate 
              to={shouldShowWelcome ? '/welcome' : '/dashboard'} 
              replace 
            />
          } 
        />
      </Routes>
    </>
  )
}

export default App
