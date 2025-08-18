import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import HomePage from './pages/HomePage'
import SchedulePage from './pages/SchedulePage'
import AboutPage from './pages/AboutPage'
import { RadioProvider } from './contexts/RadioContext'

function App() {
  return (
    <RadioProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/schedule" element={<SchedulePage />} />
            <Route path="/about" element={<AboutPage />} />
          </Routes>
        </Layout>
      </Router>
    </RadioProvider>
  )
}

export default App