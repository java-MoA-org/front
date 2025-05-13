// src/pages/UserPageContainer.tsx

import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Board, Daily, Trade, UserInterest } from "../../types/interfaces";
import { getUserPageRequest } from "../../apis";
import MyUserPage from ".";
// props 받아서 렌더링만 하는 컴포넌트

export default function UserPageContainer() {
  const { nickname } = useParams(); // URL에서 :nickname 추출

  const [boards, setBoards] = useState<Board[]>([]);
  const [dailys, setDailys] = useState<Daily[]>([]);
  const [trades, setTrades] = useState<Trade[]>([]);
  const [interests, setInterest] = useState<UserInterest>();
  const [userIntroduce, setUserIntroduce] = useState<string>("");
  const [userProfileImage, setUserProfileImage] = useState<string>("");
  const [userPageId, setUserPageId] = useState<string>("");

  useEffect(() => {
    if (!nickname) return;

    const fetchUserPage = async () => {
      const response = await getUserPageRequest(nickname);

      // Type narrowing: 응답이 성공적인 경우만 처리
      if (response && "boards" in response) {
        setBoards(response.boards);
        setDailys(response.dailyBoards);
        setTrades(response.tradeBoards);
        setInterest(response.interests);
        setUserIntroduce(response.userIntroduce);
        setUserProfileImage(response.userProfileImage);
        setUserPageId(response.userPageId);
      }
    };

    fetchUserPage();
  }, [nickname]);

  if (!interests) return null;

  return (
    <MyUserPage
      userProfileImage={userProfileImage}
      boards={boards}
      dailys={dailys}
      trades={trades}
      interests={interests}
      userIntroduce={userIntroduce}
      userPageId={userPageId}
    />
  );
}
