import './App.css'
import { Route, Routes } from 'react-router-dom'
import AppRoute from './AppRoute'
import Home from './pages/Home'
import Login from './pages/Login'
import { useContext } from 'react'
import { AuthContext } from './contexts/AuthContext'
import Signup from './pages/Signup'
import Pin from './pages/Pin'
import Profile from './pages/Profile'
import Create from './pages/Create'

function App() {
  const { isAuthenticated, user, handleLogin, handleLogout } = useContext(AuthContext);
  return (
    <>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/login' element={<AppRoute can={!isAuthenticated} redirectTo='/' ><Login /></AppRoute>} />
        <Route path='/signup' element={<AppRoute can={!isAuthenticated} redirectTo='/' ><Signup/></AppRoute>} />
        <Route path='/create' element={<AppRoute can={isAuthenticated} redirectTo='/login' ><Create /></AppRoute>} />
        <Route path='/pin/:name' element={<Pin />} />
        <Route path='/profile/:_id' element={<Profile />} />
      </Routes>
    </>
  )
}

export default App