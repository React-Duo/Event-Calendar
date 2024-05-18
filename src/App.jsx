import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import PublicView from './views/PublicView/PublicView';

const App = () => {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<PublicView />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
