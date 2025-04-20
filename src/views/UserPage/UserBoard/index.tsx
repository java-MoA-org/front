import { useEffect, useState } from "react";
import "./style.css";
import { useSearchParams } from "react-router-dom";

export default function UserBoard() {
  const [searchParams] = useSearchParams();
  const typeParam = searchParams.get("type");

  const [activeTab, setActiveTab] = useState<"board" | "daily" | "used">(
    typeParam === "board" ? "board" : typeParam === "daily" ? "daily" : "used"
  );

  useEffect(() => {
    if (typeParam === "board" || typeParam === "daily" || typeParam === "used") {
      setActiveTab(typeParam);
    }
  }, [typeParam]);

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
        {activeTab === "board" && (
          <div className="board-content">
            <div className="board-numbers content">1</div>
            <div className="board-titles content">오늘도 익명익명익명익명</div>
            <div className="board-views content">30000</div>
            <div className="board-likes content">200</div>
            <div className="board-date-time content">2025-04-12</div>
          </div>
        )}
        {activeTab === "daily" && (
          <div className="board-content">
            <div className="board-numbers content">1</div>
            <div className="board-titles content">오늘도 일상일상일상일상상</div>
            <div className="board-views content">30000</div>
            <div className="board-likes content">200</div>
            <div className="board-date-time content">2025-04-12</div>
          </div>
        )}
        {activeTab === "used" && (
          <div className="board-content">
            <div className="board-numbers content">1</div>
            <div className="board-titles content">오늘도 중고중고중고중고</div>
            <div className="board-views content">30000</div>
            <div className="board-likes content">200</div>
            <div className="board-date-time content">2025-04-12</div>
          </div>
        )}
      </div>
    </div>
  );
}
