import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import Dashboard from './components/Dashboard'
import Login from './components/Login'
import SignUp from './components/SignUp'
import ForgotPassword from './components/ForgotPassword'
import UpdateProfile from './components/UpdateProfile'
import PrivateRoute from './components/PrivateRoute'
import './App.css'

function App() {
  return (
    <div className="auth-container">
      <div className="auth-wrapper">
        <Router>
          <AuthProvider>
            <Routes>
              {/* Private Routes */}
              <Route element={<PrivateRoute />}>
                <Route path="/" element={<Dashboard />} />
                <Route path="/update-profile" element={<UpdateProfile />} />
              </Route>
              
              {/* Public Routes */}
              <Route path="/signup" element={<SignUp />} />
              <Route path="/login" element={<Login />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
            </Routes>
          </AuthProvider>
        </Router>
      </div>
    </div>
  )
}

export default App
