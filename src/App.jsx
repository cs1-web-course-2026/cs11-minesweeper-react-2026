import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import VoliandoSofiiaGame from './pages/VoliandoSofiia';

function Home() {
  return (
    <div style={{ textAlign: 'center', padding: '50px' }}>
      <h1>Виберіть гру</h1>
      <Link to="/voliando-sofiia">Voliando Sofiia - Minesweeper</Link>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/voliando-sofiia" element={<VoliandoSofiiaGame />} />
      </Routes>
    </Router>
  );
}

export default App;
