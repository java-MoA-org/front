import React, { useEffect, useState } from "react";
import "./UsedTradeView.css";
import { useNavigate, useParams } from "react-router-dom";
import { useCookies } from "react-cookie";
import useSignInUserStore from "../../../../stores/sign-in-user.store";
import { ACCESS_TOKEN, USED_TRADE_ABSOLUTE_PATH, USED_TRADE_UPDATE_ABSOLUTE_PATH } from "../../../../constants";
import { GetUsedTradeResponseDto } from "../../../../apis/dto/response/usedtrade";
import ResponseDto from "../../../../apis/dto/response/response.dto";
import { deleteUsedTradeRequest, getUsedTradeRequest, putUsedTradeLikeRequest } from "../../../../apis";

// component: 중고거래 판매글 상세보기 컴포넌트 //
export default function UsedTradeView() {

  // state: 경로 변수 상태 //
  const { tradeSequence } = useParams();

  // state: cookie 상태 //
  const [cookies] = useCookies();

  // state: 로그인 사용자 아이디 상태 //
  const { userNickname } = useSignInUserStore();

  // state: 중고거래 판매글 내용 상태 
  const [writerId, setWriterId] = useState<string>('');
  const [writeDate, setWriteDate] = useState<string>('');
  const [title, setTitle] = useState<string>('');
  const [content, setContent] = useState<string>('');
  const [views, setViews] = useState<number>(0);
  const [likeCount, setLikeCount] = useState<number>(0);

  // state: 좋아요 여부 //
  const [liked, setLiked] = useState<boolean>(false);

  // state: 이미지 목록 상태 //
  const [images, setImages] = useState<string[]>([]);

  // variable: access token //
  const accessToken = cookies[ACCESS_TOKEN];

  // variable: 좋아요 여부 //
  const isLiked = liked;
  // variable: 좋아요 클래스 //
  const likedClass = isLiked ? 'icon likes-click' : 'icon likes';

  // function: 네비게이터 함수 //
  const navigator = useNavigate();

  // function: get board response 처리 함수 //
  const getUsedTradeResponse = (responseBody: GetUsedTradeResponseDto | ResponseDto | null,) => {
  
    const message =
      !responseBody ? '서버에 문제가 있습니다.' :
      responseBody.code === 'DBE' ? '서버에 문제가 있습니다.' :
      responseBody.code === 'AF' ? '인증에 실패했습니다.' :
      responseBody.code === 'NU' ? '존재하지 않는 판매글입니다.' : '';

    const isSuccess = responseBody !== null && responseBody.code === "SU";

    if (!isSuccess) {
      alert(message);
      navigator(USED_TRADE_ABSOLUTE_PATH);
      return;
    }

    const {  } = responseBody as GetUsedTradeResponseDto;

  };

  // function: delete used trade response 처리 함수 //
  const deleteUsedTradeResponse = (responseBody: ResponseDto | null) => {
    const message =
      !responseBody ? '서버에 문제가 있습니다.' :
      responseBody.code === 'DBE' ? '서버에 문제가 있습니다.' :
      responseBody.code === 'AF' ? '인증에 실패했습니다.' :
      responseBody.code === 'NU' ? '존재하지 않는 판매글입니다.' :
      responseBody.code === 'NP' ? '권한이 없습니다.' : '';

    const isSuccess = responseBody !== null && responseBody.code === 'SU';
    if (!isSuccess) {
      alert(message);
      return;
    }

    alert("삭제에 성공했습니다.");
    navigator(USED_TRADE_ABSOLUTE_PATH);
  };

  // function: put likes response 처리 함수 //
  const putLikeResponse = (responseBody: ResponseDto | null) => {
    const message =
      !responseBody ? '서버에 문제가 있습니다.' :
      responseBody.code === 'DBE' ? '서버에 문제가 있습니다.' :
      responseBody.code === 'AF' ? '인증에 실패했습니다.' : '';
    
    const isSuccess = responseBody !== null && responseBody.code === 'SU';
    if (!isSuccess) {
      alert(message);
      return;
    }

    if (responseBody && responseBody.data) {
      setLikeCount(responseBody.data.likeCount);
      setLiked(responseBody.data.liked);

      if (!tradeSequence || !accessToken) return;
    }
  };

  // event handler: 삭제 버튼 클릭 이벤트 처리 //
  const onDeleteClickHandler = () => {
    if (!tradeSequence || !accessToken) return;
    const isConfirm = window.confirm("정말로 삭제하시겠습니까?");
    if (!isConfirm) return;

    deleteUsedTradeRequest(tradeSequence, accessToken).then(deleteUsedTradeResponse);
  };

  // event handler: 수정 버튼 클릭 이벤트 처리 //
  const onUpdateClickHandler = () => {
    if (!tradeSequence) return;
    navigator(USED_TRADE_UPDATE_ABSOLUTE_PATH(tradeSequence));
  };

  // event handler: 좋아요 버튼 클릭 이벤트 처리 //
  const onLikeClickHandler = () => {
    if (!tradeSequence || !accessToken) return;
    putUsedTradeLikeRequest(tradeSequence, accessToken).then(putLikeResponse);
    
  };

  // effect: 컴포넌트 로드시 실행할 함수 //
  useEffect(() => {
    if (!tradeSequence) {
      navigator(USED_TRADE_ABSOLUTE_PATH);
      return;
    }
    getUsedTradeRequest(tradeSequence, accessToken).then(getUsedTradeResponse);
  }, []);

  // render: 중고거래 판매글 상세보기 컴포넌트 렌더링 //
  return (
    <div>
      <h1>중고거래 판매글 상세보기 페이지</h1>
    </div>
  );
}
