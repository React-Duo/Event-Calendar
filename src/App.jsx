import { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import PublicView from './views/PublicView/PublicView';
import Home from './views/Home/Home';
import Header from './components/Header/Header';
import SideBar from './components/SideBar/SideBar';
import Login from './components/Login/Login';
import Logout from './components/Logout/Logout';
import Register from './components/Register/Register';
import AuthContext from './context/AuthContext';
import './App.css'

const App = () => {

  const[authValue, setAuthValue] = useState({
    status: false,
    user: ''
  });

  return (
    <BrowserRouter>
      <AuthContext.Provider value={{isLoggedIn: authValue, setLoginState: setAuthValue}}>
        <Header />
        {window.location.pathname !== "/" && <SideBar />}
        <Routes>
            <Route path="/" element={<PublicView />} />
            <Route path="/home" element={<Home />} />
            <Route path="/login" element={<Login />}/>
            <Route path="/logout" element={<Logout />}/>
            <Route path="/register" element={<Register />}/>
      </Routes>
      </AuthContext.Provider>
    </BrowserRouter>
  )
}

export default App;