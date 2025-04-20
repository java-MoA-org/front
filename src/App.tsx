import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./views/home/Home";
import Marquee from "./components/marquee/Marquee";
import Header from "./components/header/";
import AuthPage from "./views/auth/AuthPage";
import Notice from "./views/category/notice/Notice";
// import Message from './pages/message/Message'

import Board from "./views/category/board/Board";
import BoardWrite from "./views/category/board/BoardWrite/BoardWrite";
import BoardView from "./views/category/board/BoardView/BoardView";
import BoardUpdate from "./views/category/board/BoardUpdate/BoardUpdate";

import Daily from "./views/category/daily/Daily";
import DailyWrite from "./views/category/daily/DailyWrite/DailyWrite";
import DailyView from "./views/category/daily/DailyView/DailyView";
import DailyUpdate from "./views/category/daily/DailyUpdate/DailyUpdate";

import UsedTrade from "./views/category/trade/UsedTrade";
import UsedTradeWrite from "./views/category/trade/UsedTradeWrite/UsedTradeWrite";
import UsedTradeView from "./views/category/trade/UsedTradeView/UsedTradeView";
import UsedTradeUpdate from "./views/category/trade/UsedTradeUpdate/UsedTradeUpdate";

import {
  MY_USER_BOARD_PATH,
  MY_USER_FOLLOW_ABSOLUTE_PATH,
  MY_USER_FOLLOW_PATH,
  MY_USER_PATH,
  BOARD_PATH,
  BOARD_WRITE_PATH,
  BOARD_VIEW_PATH,
  BOARD_UPDATE_PATH,
  DAILY_PATH,
  DAILY_WRITE_PATH,
  DAILY_VIEW_PATH,
  DAILY_UPDATE_PATH,
  USED_TRADE_PATH,
  USED_TRADE_WRITE_PATH,
  USED_TRADE_VIEW_PATH,
  USED_TRADE_UPDATE_PATH
} from "./constants";

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

        <Route path={BOARD_PATH}>
          <Route index element={<Board />} />
          <Route path={BOARD_WRITE_PATH} element={<BoardWrite />} />
          <Route path={BOARD_VIEW_PATH} element={<BoardView />} />
          <Route path={BOARD_UPDATE_PATH} element={<BoardUpdate />} />
        </Route>

        <Route path={DAILY_PATH}>
          <Route index element={<Daily />} />
          <Route path={DAILY_WRITE_PATH} element={<DailyWrite />} />
          <Route path={DAILY_VIEW_PATH} element={<DailyView />} />
          <Route path={DAILY_UPDATE_PATH} element={<DailyUpdate />} />
        </Route>

        <Route path={USED_TRADE_PATH}>
          <Route index element={<UsedTrade />} />
          <Route path={USED_TRADE_WRITE_PATH} element={<UsedTradeWrite />} />
          <Route path={USED_TRADE_VIEW_PATH} element={<UsedTradeView />} />
          <Route path={USED_TRADE_UPDATE_PATH} element={<UsedTradeUpdate />} />
        </Route>

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
