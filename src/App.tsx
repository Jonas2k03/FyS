import { useWelcomeState } from './hooks/useWelcomeState'
import { Welcome } from './components/Welcome/Welcome'
import { Dashboard } from './components/Dashboard/Dashboard'
import { FloatingHearts } from './components/FloatingHearts'
import './App.css'

function App() {
  const { shouldShowWelcome, dismissWelcome, resetWelcome, isLoading } = useWelcomeState()

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

  return (
    <>
      <FloatingHearts />
      {shouldShowWelcome ? (
        <Welcome
          onEnter={() => dismissWelcome(false)}
        />
      ) : (
        <Dashboard onShowWelcome={resetWelcome} />
      )}
    </>
  )
}

export default App
