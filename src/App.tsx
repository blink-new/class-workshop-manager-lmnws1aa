import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Dashboard from './components/Dashboard'
import Workshops from './components/Workshops'
import Students from './components/Students'
import StudentWork from './components/StudentWork'

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <div className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/workshops" element={<Workshops />} />
            <Route path="/workshop/:id/students" element={<Students />} />
            <Route path="/workshop/:workshopId/student/:studentId" element={<StudentWork />} />
          </Routes>
        </div>
      </div>
    </Router>
  )
}

export default App