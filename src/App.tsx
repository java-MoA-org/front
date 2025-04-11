import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./views/home/Home";
import Board from "./views/category/board/Board";
import Marquee from "./components/marquee/Marquee";
import Header from "./components/header/";
import AuthPage from "./views/auth/AuthPage";
import Trade from "./views/category/trade/Trade";
import Notice from "./views/category/notice/Notice";
// import Message from './pages/message/Message'
import Daily from "./views/category/daily/Daily";
import { MY_USER_FOLLOW_ABSOULTE_PATH, MY_USER_FOLLOW_PATH, MY_USER_PATH } from "./constants";
import MyUserPage from "./views/UserPage";
import UserPageFollow from "./views/UserPage/UserPageFollow";

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
        <Route path={MY_USER_PATH}>
          <Route index element={<MyUserPage />} />
          <Route path={MY_USER_FOLLOW_PATH} element={<UserPageFollow />} />
        </Route>
        {/* <Route path="/message" element={<Message />} /> */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
