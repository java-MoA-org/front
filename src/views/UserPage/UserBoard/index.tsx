import { useEffect, useState } from "react";
import "./style.css";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { Board, Daily, Trade } from "../../../types/interfaces";
import { MY_USER_PATH } from "../../../constants";
import { getUserPageRequest } from "../../../apis";
import ResponseDto from "../../../apis/dto/response/response.dto";
import GetUserPageResponseDto from "../../../apis/dto/response/userpage/get-user-page.response.dto";
import { usePagination } from "../../../hooks";
import Pagination from "../../../components/pagination";

export default function UserBoard() {
  const [searchParams] = useSearchParams();
  const typeParam = searchParams.get("type");
  const { nickname } = useParams();

  const navigator = useNavigate();

  const [boards, setBoards] = useState<Board[]>([]);
  const [dailys, setDailys] = useState<Daily[]>([]);
  const [trades, setTrades] = useState<Trade[]>([]);

  const [activeTab, setActiveTab] = useState<"board" | "daily" | "used">(
    typeParam === "board" ? "board" : typeParam === "daily" ? "daily" : "used"
  );

  const {
    currentPage,
    setCurrentPage,
    currentSection,
    setCurrentSection,
    totalSection,
    setTotalList,
    viewList,
    pageList
  } = usePagination<Board | Daily | Trade>();

  // function: get user page response 처리 함수 //
  const getUserBoardResponse = (responseBody: GetUserPageResponseDto | ResponseDto | null) => {
    const message = !responseBody
      ? "서버에 문제가 있습니다."
      : responseBody.code === "DBE"
      ? "서버에 문제가 있습니다."
      : responseBody.code === "AF"
      ? "인증에 실패했습니다."
      : "";

    const isSuccess = responseBody !== null && responseBody.code === "SU";
    if (!isSuccess) {
      alert(message);
      return;
    }

    const { boards, dailyBoards, tradeBoards } = responseBody as GetUserPageResponseDto;
    setBoards(boards);
    setDailys(dailyBoards);
    setTrades(tradeBoards);
  };

  // effect: 컴포넌트 로드시 실행할 함수 //
  useEffect(() => {
    if (!nickname) {
      navigator(MY_USER_PATH);
      return;
    }

    getUserPageRequest(nickname)
      .then(getUserBoardResponse)
      .catch(() => alert("서버 요청 중 오류가 발생했습니다."));
  }, [nickname]);

  // effect: 컴포넌트 로드시 실행할 함수 //
  useEffect(() => {
    if (typeParam === "board" || typeParam === "daily" || typeParam === "used") {
      setActiveTab(typeParam);
    }
  }, [typeParam]);

  useEffect(() => {
    if (activeTab === "board") {
      setTotalList([...boards].reverse());
    } else if (activeTab === "daily") {
      setTotalList([...dailys].reverse());
    } else {
      setTotalList([...trades].reverse());
    }
    setCurrentPage(1);
    setCurrentSection(1);
  }, [activeTab, boards, dailys, trades, setTotalList, setCurrentPage, setCurrentSection]);

  useEffect(() => {
    // console.log("activeTab:", activeTab);
    // console.log("boards:", boards.length, boards);
    // console.log("dailys:", dailys.length, dailys);
    // console.log("trades:", trades.length, trades);
    // console.log("viewList after setTotalList:", viewList);
    // ... setTotalList, setCurrentPage, setCurrentSection
  }, [activeTab, boards, dailys, trades]);

  // variable: board,daily,user 변수 //
  const boardClass = activeTab === "board" ? "board active" : "board";
  const dailyClass = activeTab === "daily" ? "daily active" : "daily";
  const usedClass = activeTab === "used" ? "used active" : "used";

  return (
    <div id="my-user-board">
      <div className="board-type">
        <div className={boardClass} onClick={() => setActiveTab("board")}>
          익명 게시판
        </div>
        <div className={dailyClass} onClick={() => setActiveTab("daily")}>
          일상 게시판
        </div>
        <div className={usedClass} onClick={() => setActiveTab("used")}>
          중고거래 게시판
        </div>
      </div>
      <div className="board-container">
        <div className="board-name">
          <div className="board-numbers">게시물 번호</div>
          <div className="board-titles">제목</div>
          <div className="board-views">조회수</div>
          <div className="board-likes">좋아요 수</div>
          <div className="board-date-time">날짜</div>
        </div>
        {activeTab === "board" &&
          (boards.length === 0 ? (
            <div className="no-content">아직 작성한 글이 없습니다.</div>
          ) : (
            (viewList as Board[]).map(
              ({ boardSequence, title, views, likeCount, creationDate }) => (
                <div className="board-content" key={boardSequence}>
                  <div className="board-numbers content">{boardSequence}</div>
                  <div className="board-titles content">{title}</div>
                  <div className="board-views content">{views}</div>
                  <div className="board-likes content">{likeCount}</div>
                  <div className="board-date-time content">{creationDate}</div>
                </div>
              )
            )
          ))}
        {activeTab === "daily" &&
          (dailys.length === 0 ? (
            <div className="no-content">아직 작성한 글이 없습니다.</div>
          ) : (
            (viewList as Daily[]).map(
              ({ dailySequence, title, views, likeCount, creationDate }) => (
                <div className="board-content" key={dailySequence}>
                  <div className="board-numbers content">{dailySequence}</div>
                  <div className="board-titles content">{title}</div>
                  <div className="board-views content">{views}</div>
                  <div className="board-likes content">{likeCount}</div>
                  <div className="board-date-time content">{creationDate}</div>
                </div>
              )
            )
          ))}

        {activeTab === "used" &&
          (trades.length === 0 ? (
            <div className="no-content">아직 작성한 글이 없습니다.</div>
          ) : (
            (viewList as Trade[]).map(
              ({ tradeSequence, title, views, likeCount, creationDate }) => (
                <div className="board-content" key={tradeSequence}>
                  <div className="board-numbers content">{tradeSequence}</div>
                  <div className="board-titles content">{title}</div>
                  <div className="board-views content">{views}</div>
                  <div className="board-likes content">{likeCount}</div>
                  <div className="board-date-time content">{creationDate}</div>
                </div>
              )
            )
          ))}
        <div className="pagination-container">
          {totalSection > 0 && (
            <Pagination
              currentPage={currentPage}
              currentSection={currentSection}
              totalSection={totalSection}
              pageList={pageList}
              setCurrentPage={setCurrentPage}
              setCurrentSection={setCurrentSection}
            />
          )}
        </div>
      </div>
    </div>
  );
}
