import Dashboard from './components/Dashboard'
import { ThemeProvider } from './ThemeContext'

function App() {
  return (
    <ThemeProvider>
      <Dashboard />
    </ThemeProvider>
  )
}

export default App
