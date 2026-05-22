import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import About from './pages/About'
import Game from './pages/Game'
import MockGame from './pages/MockGame'
import KhomchenkoVitaliy from './pages/KhomchenkoVitaliy'
import MariaSechko from './pages/SechkoMaria';
import KesilKarina from './pages/KesilKarina';
import HumenValeriiaGame from './pages/HumenValeriia';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="about" element={<About />} />
        <Route path="game" element={<Game />} />
        <Route path="mock-game" element={<MockGame />} />
        <Route path="khomchenko-vitaliy" element={<KhomchenkoVitaliy />} />
        <Route path="sechko-maria" element={<MariaSechko />} />
        <Route path="kesil-karina" element={<KesilKarina />} />
        <Route path="humen-valeriia" element={<HumenValeriiaGame />} />
      </Route>
    </Routes>
  )
}

export default App