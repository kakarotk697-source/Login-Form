import { Routes, Route, Navigate } from 'react-router-dom'
import useAuthStore from '../store/authStore'
import Login  from '../pages/Login'
import Signup from '../pages/Signup'
import Home   from '../pages/Home'

function AppRoutes() {
  const { user } = useAuthStore()

  return (
    <Routes>
      <Route path="/"       element={user ? <Navigate to="/home" replace /> : <Login />}  />
      <Route path="/signup" element={user ? <Navigate to="/home" replace /> : <Signup />} />
      <Route path="/home"   element={user ? <Home />   : <Navigate to="/" replace />}     />
      <Route path="*"       element={<Navigate to="/" replace />}                         />
    </Routes>
  )
}

export default AppRoutes