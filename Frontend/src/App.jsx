import Profile from './components/Profile.jsx'
import Login from './components/Login.jsx'
import Register from './components/Register.jsx'
import { Routes, Route } from 'react-router-dom'
import { ToastMessageBox } from './components/ToastMessageBox.jsx'

const App = () => {
  return (
    <>
    <ToastMessageBox />
      <Routes>
        <Route path='/' element={<Profile />} />
        <Route path='/log-in' element={<Login />} />
        <Route path='/register' element={<Register />} />
      </Routes>
    </>
  )
}

export default App