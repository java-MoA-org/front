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
import { MY_USER_PATH } from "./constants";
import MyUserPage from "./views/UserPage";
import UserPageFollow from "./views/UserPage/UserPageFollow";
import UserBoard from "./views/UserPage/UserBoard";
import Footer from "./components/footer";
import UserPageContainer from "./views/UserPage/UserPageContainer";

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
          <Route path=":nickname" element={<UserPageContainer />} />
          <Route path=":nickname/follow" element={<UserPageFollow />} />
          <Route path=":nickname/board" element={<UserBoard />} />
        </Route>
        {/* <Route path="/message" element={<Message />} /> */}
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
