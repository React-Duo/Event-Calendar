import { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import PublicView from './views/PublicView/PublicView';
import Header from './components/Header/Header';
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
      <Routes>
          <Route path="/" element={<PublicView />} />
          <Route path="/login" element={<Login />}/>
          <Route path="/register" element={<Register />}/>
          <Route path="/logout" element={<Logout />}/>
         {/*  <Route path="/posts" element={<Authenticated><Posts /></Authenticated>}/>
          <Route path="/posts/:id" element={<Authenticated><SinglePost /></Authenticated>}/>
          <Route path="/create-post" element={<Authenticated><CreatePost /></Authenticated>}/>
          <Route path="/users" element={<Authenticated><Users /></Authenticated>}/>
          <Route path="/profile" element={<Authenticated><Profile /></Authenticated>}/>
          <Route path="*" element={<NotFound />}/> */}
      </Routes>
      </AuthContext.Provider>
    </BrowserRouter>
  )
}

export default App