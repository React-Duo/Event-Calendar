import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import PublicView from './views/PublicView/PublicView';
import Home from './views/Home/Home';
import Header from './components/Header/Header';
import SideBar from './components/SideBar/SideBar';
import Contacts from './views/Contacts/Contacts';

function App() {


  return (
    <BrowserRouter>
      <Header />
      {window.location.pathname !== "/" && <SideBar />}
      <Routes>
        <Route path="/" element=<PublicView /> />
        <Route path="/home" element=<Home /> />
        <Route path="/contacts" element=<Contacts /> />
      </Routes>
    </BrowserRouter>
  )
}

export default App
