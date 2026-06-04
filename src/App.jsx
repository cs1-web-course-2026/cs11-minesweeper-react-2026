import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import About from './pages/About'
import Game from './pages/Game'
import MockGame from './pages/MockGame'
import StelmakhIvan from './pages/StelmakhIvan'
import KhomchenkoVitaliy from './pages/KhomchenkoVitaliy'
import MariaSechko from './pages/SechkoMaria';
import KesilKarina from './pages/KesilKarina';
import MychkoArtem from './pages/MychkoArtem';
import HumenValeriiaGame from './pages/HumenValeriia';
import YanchukSofiaGame from './pages/YanchukSofia'
import ChernyshevOlehGame from './pages/ChernyshevOleh'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="about" element={<About />} />
        <Route path="game" element={<Game />} />
        <Route path="mock-game" element={<MockGame />} />
        <Route path="stelmakh-ivan" element={<StelmakhIvan />} />
        <Route path="khomchenko-vitaliy" element={<KhomchenkoVitaliy />} />
        <Route path="sechko-maria" element={<MariaSechko />} />
        <Route path="kesil-karina" element={<KesilKarina />} />
        <Route path="mychko-artem" element={<MychkoArtem />} />
        <Route path="humen-valeriia" element={<HumenValeriiaGame />} />
        <Route path="yanchuk-sofia" element={<YanchukSofiaGame />} />
        <Route path="chernyshev-oleh" element={<ChernyshevOlehGame />} />
      </Route>
    </Routes>
  )
}

export default App
