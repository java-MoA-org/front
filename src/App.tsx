import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './views/home/Home'
import Board from './views/category/board/Board'
import Marquee from './components/marquee/Marquee'
import Header from './components/header/'
import MyPage from './views/my-page/MyPage'
import AuthPage from './views/auth/AuthPage'
import Trade from './views/category/trade/Trade'
import Notice from './views/category/notice/Notice'
// import Message from './pages/message/Message'
import Daily from './views/category/daily/Daily'

function App() {
  return (
    <BrowserRouter>
      <Marquee />
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/board" element={<Board />} />
        <Route path="/daily" element={<Daily />} />
        <Route path="/trade" element={<Trade />} />
        <Route path="/notice" element={<Notice />} />
        <Route path="/mypage" element={<MyPage />} />
        {/* <Route path="/message" element={<Message />} /> */}
      </Routes>
    </BrowserRouter>
  )
}

export default App