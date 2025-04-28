import React, { ChangeEvent, useEffect, useState } from "react";
import "./UsedTradeUpdate.css";
import { useNavigate, useParams } from "react-router-dom";
import { useCookies } from "react-cookie";
import useSignInUserStore from "../../../../stores/sign-in-user.store";
import { ACCESS_TOKEN, USED_TRADE_ABSOLUTE_PATH, USED_TRADE_VIEW_ABSOLUTE_PATH } from "../../../../constants";
import { GetUsedTradeResponseDto } from "../../../../apis/dto/response/usedtrade";
import ResponseDto from "../../../../apis/dto/response/response.dto";
import { PatchUsedTradeRequestDto } from "../../../../apis/dto/request/usedtrade";
import { getUsedTradeRequest, patchUsedTradeRequest } from "../../../../apis";

// component: 중고거래 판매글 수정 컴포넌트 //
export default function UsedTradeUpdate() {

  // state: 경로 변수 상태 //
  const { tradeSequence } = useParams();

  // state: 쿠키 상태 //
  const [cookies] = useCookies();

  // state: 로그인 유저 아이디 상태 //
  const { userId } = useSignInUserStore();
  
  // state: 중고거래 판매글 수정 내용 상태 //
  const [title, setTitle] = useState<string>('');
  const [content, setContent] = useState<string>('');
  const [price, setPrice] = useState<number>(0);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  // variable: acess token //
  const accessToken = cookies[ACCESS_TOKEN];

  // variable: 게시글 수정 가능 여부 //
  const isActive = title !== '' && content !== "";
  // variable: 게시글 수정 버튼 클래스 //
  const updateButtonClass = isActive ? 'button middle primary' : 'button middle disable';

  // function: 네비게이터 함수 //
  const navigator = useNavigate();

  // function: get used trade response 처리 함수 //
  const getUsedTradeResponse = (responseBody: GetUsedTradeResponseDto | ResponseDto | null) => {
    const message =
      !responseBody ? '서버에 문제가 있습니다.' :
      responseBody.code === 'DBE' ? '서버에 문제가 있습니다.' : 
      responseBody.code === 'AF' ? '인증에 실패했습니다.' : 
      responseBody.code === 'NU' ? '존재하지 않는 판매글입니다.' : '';

    const isSuccess = responseBody !== null && responseBody.code === 'SU';
    if(!isSuccess) {
      alert(message);
      navigator(USED_TRADE_ABSOLUTE_PATH);
      return;
    }

    const { title, content } = responseBody as GetUsedTradeResponseDto;
    setTitle(title);
    setContent(content);
    setIsLoaded(true);
  };

  // function: patch used trade response 처리 함수 //
  const patchUsedTradeResponse = (responseBody: ResponseDto | null) => {
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

    if(!tradeSequence) return;
    navigator(USED_TRADE_VIEW_ABSOLUTE_PATH(tradeSequence));
  };

  // event handler: 제목 변경 이벤트 처리 //
  const onTitleChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    if (value.length > 50) {
      alert("제목은 50자 이내로 작성해주세요.");
      return;
    }
    setTitle(value);
  };

  // event handler: 내용 변경 이벤트 처리 //
  const onContentChangeHandler = (value: string) => {
    if (value.length > 2000) {
      alert("내용은 2000자 이내로 작성해주세요.");
      return;
    }
    setContent(value);
  };

  // event handler: 가격 변경 이벤트 처리 //
  const onPriceChangeHandler = (value: number) => {
    setPrice(value)
  };

  // event handler: 판매글 수정 버튼 클릭 이벤트 처리 //
  const onUpdateButtonClickHandler = () => {
    if (!isActive || !accessToken || !tradeSequence) return;

    const requestBody: PatchUsedTradeRequestDto = {
      title, content, price
    };
    patchUsedTradeRequest(tradeSequence, requestBody, accessToken).then(patchUsedTradeResponse);
  };

  // effect: 게시글 번호가 변경될 시 실행할 함수 //
  useEffect(() => {
    if (!accessToken || !tradeSequence) return;
    getUsedTradeRequest(tradeSequence, accessToken).then(getUsedTradeResponse);
  }, [tradeSequence]);

  // render: 중고거래 판매글 수정 컴포넌트 렌더링 //
  return (
    <div>
      <h1>중고거래 판매글 수정 페이지</h1>
    </div>
  );
}
