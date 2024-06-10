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
import Contacts from './views/Contacts/Contacts';
import Profile from './views/Profile/Profile';
import SingleList from './views/SingleList/SingleList';
import AddEvent from './components/AddEvent/AddEvent';
import CalendarView from './views/CalendarView/CalendarView';
import Footer from './components/Footer/Footer';
import Settings from './views/Settings/Settings';
import SingleEvent from './components/SingleEvent/SingleEvent';
import Admin from './views/Admin/Admin';

const App = () => {

  const[authValue, setAuthValue] = useState({
    status: false,
    user: ''
  });

  const [theme, setTheme] = useState(localStorage.getItem('theme') === 'dark');

  return (
    <BrowserRouter>
      <AuthContext.Provider value={{isLoggedIn: authValue, setLoginState: setAuthValue,theme, setTheme}}>
        <Header />
        {authValue.status && <SideBar />}
        <Routes>
            <Route path="/" element={<PublicView />} />
            <Route path="/home" element={<Home />} />
            <Route path="/login" element={<Login />}/>
            <Route path="/logout" element={<Logout />}/>
            <Route path="/register" element={<Register />}/>
            <Route path="/add-event" element={<AddEvent />}/>
            <Route path="/contacts" element=<Contacts /> />
            <Route path="/profile" element=<Profile /> />
            <Route path="/contacts/:id" element=<SingleList /> />
            <Route path="/calendar" element=<CalendarView /> />
            <Route path="/settings" element=<Settings /> />
            <Route path="/event/:id" element={<SingleEvent />} />
            <Route path="/admin" element={<Admin />} />
      </Routes>
      <hr />
    <Footer />
      </AuthContext.Provider>
    </BrowserRouter>
  )
}

export default App;