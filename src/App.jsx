import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import PublicView from './views/PublicView/PublicView';
import Home from './views/Home/Home';
import Header from './components/Header/Header';
import SideBar from './components/SideBar/SideBar';

function App() {


  return (
    <BrowserRouter>
      <Header />
      {window.location.pathname !== "/" && <SideBar />}
      <Routes>
        <Route path="/" element=<PublicView /> />
        <Route path="/home" element=<Home /> />
      </Routes>
    </BrowserRouter>
  )
}

export default App
