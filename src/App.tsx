import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './views/home/Home';
import Marquee from './components/marquee/Marquee';
import Header from './components/header/';
import AuthPage from './views/auth/AuthPage';

import BoardMain from './views/category/board/BoardMain';
import BoardWrite from './views/category/board/BoardWrite/BoardWrite';
import BoardView from './views/category/board/BoardView/BoardView';
import BoardUpdate from './views/category/board/BoardUpdate/BoardUpdate';

import DailyMain from './views/category/daily/DailyMain';
import DailyWrite from './views/category/daily/DailyWrite/DailyWrite';
import DailyView from './views/category/daily/DailyView/DailyView';
import DailyUpdate from './views/category/daily/DailyUpdate/DailyUpdate';

import UsedTradeMain from './views/category/trade/UsedTradeMain';
import UsedTradeWrite from './views/category/trade/UsedTradeWrite/UsedTradeWrite';
import UsedTradeView from './views/category/trade/UsedTradeView/UsedTradeView';
import UsedTradeUpdate from './views/category/trade/UsedTradeUpdate/UsedTradeUpdate';

import Notice from './views/category/notice/Notice';
import NoticeWrite from './views/category/notice/NoticeWrite/NoticeWrite';
import NoticeView from './views/category/notice/NoticeView/NoticeView';
import NoticeUpdate from './views/category/notice/NoticeUpdate/NoticeUpdate';

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
  USED_TRADE_UPDATE_PATH,
  NOTICE_PATH,
  NOTICE_WRITE_PATH,
  NOTICE_VIEW_PATH,
  NOTICE_UPDATE_PATH,
} from './constants';

import MyUserPage from './views/UserPage';
import UserPageFollow from './views/UserPage/UserPageFollow';
import UserBoard from './views/UserPage/UserBoard';
import Footer from './components/footer';
import UserPageContainer from './views/UserPage/UserPageContainer';
import UserPageUpdate from './views/UserPage/UserPageUpdate';
import { CookiesProvider } from 'react-cookie';
import { useEffect } from 'react';

function App() {
  useEffect(() => {}, []);

  return (
    <CookiesProvider>
      {' '}
      {/* CookiesProvider로 애플리케이션 감싸기 */}
      <BrowserRouter>
        <Marquee />
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/auth*" element={<AuthPage />} />

          <Route path={BOARD_PATH}>
            <Route index element={<BoardMain />} />
            <Route path={BOARD_WRITE_PATH} element={<BoardWrite />} />
            <Route path={BOARD_VIEW_PATH} element={<BoardView />} />
            <Route path={BOARD_UPDATE_PATH} element={<BoardUpdate />} />
          </Route>

          <Route path={DAILY_PATH}>
            <Route index element={<DailyMain />} />
            <Route path={DAILY_WRITE_PATH} element={<DailyWrite />} />
            <Route path={DAILY_VIEW_PATH} element={<DailyView />} />
            <Route path={DAILY_UPDATE_PATH} element={<DailyUpdate />} />
          </Route>

          <Route path={USED_TRADE_PATH}>
            <Route index element={<UsedTradeMain />} />
            <Route path={USED_TRADE_WRITE_PATH} element={<UsedTradeWrite />} />
            <Route path={USED_TRADE_VIEW_PATH} element={<UsedTradeView />} />
            <Route path={USED_TRADE_UPDATE_PATH} element={<UsedTradeUpdate />} />
          </Route>

          <Route path="/notice" element={<Notice />} />
          <Route path={NOTICE_PATH}>
            <Route index element={<Notice />} />
            <Route path={NOTICE_WRITE_PATH} element={<NoticeWrite />} />
            <Route path={NOTICE_VIEW_PATH} element={<NoticeView />} />
            <Route path={`${NOTICE_VIEW_PATH}/${NOTICE_UPDATE_PATH}`} element={<NoticeUpdate />} />
          </Route>

          <Route path={MY_USER_PATH}>
            <Route path=":nickname" element={<UserPageContainer />} />
            <Route path=":nickname/follow" element={<UserPageFollow />} />
            <Route path=":nickname/user-board" element={<UserBoard />} />
            <Route path=":nickname/user-update" element={<UserPageUpdate />} />
          </Route>
          <Route path="/user-update" element={<UserPageUpdate />} />
          {/* <Route path="/message" element={<Message />} /> */}
        </Routes>
        <Footer />
      </BrowserRouter>
    </CookiesProvider>
  );
}

export default App;
