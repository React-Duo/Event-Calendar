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
import Contacts from './views/Contacts/Contacts';
import Profile from './views/Profile/Profile';
import SingleList from './views/SingleList/SingleList';
import AddEvent from './components/AddEvent/AddEvent';
import CalendarView from './views/CalendarView/CalendarView';
import Footer from './components/Footer/Footer';
import Settings from './views/Settings/Settings';
import SingleEventView from './views/SingleEventView/SingleEventView';
import Admin from './views/Admin/Admin';
import Authenticated from './hoc/Authenticated';
import './App.css';

const App = () => {
  const [authValue, setAuthValue] = useState({status: false, user: ''});
  const [theme, setTheme] = useState(localStorage.getItem('theme') === 'dark');

  return (
    <BrowserRouter>
      <AuthContext.Provider value={{ isLoggedIn: authValue, setLoginState: setAuthValue, theme, setTheme }}>
        <Header />
        {authValue.status && <SideBar />}
        <Routes>
          <Route path="/" element={<PublicView />} />
          <Route path="/home" element={<Authenticated><Home /></Authenticated>} />
          <Route path="/login" element={<Login />} />
          <Route path="/logout" element={<Authenticated><Logout /></Authenticated>} />
          <Route path="/register" element={<Register />} />
          <Route path="/add-event" element={<Authenticated><AddEvent /></Authenticated>} />
          <Route path="/contacts" element={<Authenticated><Contacts /></Authenticated>} />
          <Route path="/profile" element={<Authenticated><Profile /></Authenticated>} />
          <Route path="/contacts/:id" element={<Authenticated><SingleList /></Authenticated>} />
          <Route path="/calendar" element={<Authenticated><CalendarView /></Authenticated>} />
          <Route path="/settings" element={<Authenticated><Settings /></Authenticated>} />
          <Route path="/event/:id" element={<Authenticated><SingleEventView /></Authenticated>} />
          <Route path="/admin" element={<Authenticated><Admin /></Authenticated>} />
        </Routes>
        <hr />
        <Footer />
      </AuthContext.Provider>
    </BrowserRouter>
  )
}

export default App;