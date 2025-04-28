import React, { ChangeEvent, useEffect, useState } from "react";
import "./DailyUpdate.css";
import { useNavigate, useParams } from "react-router-dom";
import { useCookies } from "react-cookie";
import useSignInUserStore from "../../../../stores/sign-in-user.store";
import { ACCESS_TOKEN, DAILY_ABSOLUTE_PATH, DAILY_VIEW_ABSOLUTE_PATH } from "../../../../constants";
import { GetDailyResponseDto } from "../../../../apis/dto/response/daily";
import ResponseDto from "../../../../apis/dto/response/response.dto";
import { PatchDailyRequestDto } from "../../../../apis/dto/request/daily";
import { getDailyRequest, patchDailyRequest } from "../../../../apis";
import TextEditor from "../../../../components/TextEditor";

// component: 일상 게시판 게시글 수정 컴포넌트 //
export default function DailyUpdate() {

  // state: 경로 변수 상태 //
  const { dailySequence } = useParams();

  // state: 쿠키 상태 //
  const [cookies] = useCookies();

  // state: 로그인 유저 아이디 상태 //
  const { userNickname } = useSignInUserStore();

  // state: 게시글 수정 내용 상태 //
  const [writerNickname, setWriterNickname] = useState<string>('');
  const [writeDate, setWriteDate] = useState<string>('');
  const [title, setTitle] = useState<string>('');
  const [content, setContent] = useState<string>('');
  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  // variable: acess token //
  const accessToken = cookies[ACCESS_TOKEN];

  // variable: 게시글 수정 가능 여부 //
  const isActive = title !== '' && content !== "";
  // variable: 게시글 수정 버튼 클래스 //
  const updateButtonClass = isActive ? 'button middle primary' : 'button middle disable';

  // function: 네비게이터 함수 //
  const navigator = useNavigate();

  // function: get daily response 처리 함수 //
  const getDailyResponse = (responseBody: GetDailyResponseDto | ResponseDto | null) => {
    const message =
      !responseBody ? '서버에 문제가 있습니다.' :
      responseBody.code === 'DBE' ? '서버에 문제가 있습니다.' : 
      responseBody.code === 'AF' ? '인증에 실패했습니다.' : 
      responseBody.code === 'NB' ? '존재하지 않는 게시글입니다.' : '';

    const isSuccess = responseBody !== null && responseBody.code === 'SU';
    if(!isSuccess) {
      alert(message);
      navigator(DAILY_ABSOLUTE_PATH);
      return;
    }

    const { writerNickname, creationDate, title, content } = responseBody as GetDailyResponseDto;
    setWriterNickname(writerNickname);
    setWriteDate(creationDate);
    setTitle(title);
    setContent(content);
    setIsLoaded(true);
  };

  // function: patch daily response 처리 함수 //
  const patchDailyResponse = (responseBody: ResponseDto | null) => {
    const message = 
      !responseBody ? '서버에 문제가 있습니다.' :
      responseBody.code === 'DBE' ? '서버에 문제가 있습니다.' :
      responseBody.code === 'AF' ? '인증에 실패했습니다.' :
      responseBody.code === 'ND' ? '존재하지 않는 게시글입니다.' :
      responseBody.code === 'NP' ? '권한이 없습니다.' : '';

    const isSuccess = responseBody !== null && responseBody.code === 'SU';
    if (!isSuccess) {
      alert(message);
      return;
    }

    if(!dailySequence) return;
    navigator(DAILY_VIEW_ABSOLUTE_PATH(dailySequence));
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

  // event handler: 게시글 수정 버튼 클릭 이벤트 처리 //
  const onUpdateButtonClickHandler = () => {
    if (!isActive || !accessToken || !dailySequence) return;

    const requestBody: PatchDailyRequestDto = {
      title, content
    };
    patchDailyRequest(dailySequence, requestBody, accessToken).then(patchDailyResponse);
  };

  // effect: 게시글 번호가 변경될 시 실행할 함수 //
  useEffect(() => {
    if (!accessToken || !dailySequence) return;
    getDailyRequest(dailySequence, accessToken).then(getDailyResponse);
  }, [dailySequence]);

  // effect: 로그인 유저 닉네임과 작성자 닉네임이 변경될시 실행할 함수 //
  useEffect(() => {
    if (writerNickname !== userNickname) {
      alert('권한이 없습니다.');
      navigator(DAILY_ABSOLUTE_PATH);
    }
  }, [writerNickname, userNickname]);

  // render: 일상 게시판 게시글 수정 컴포넌트 렌더링 //
  return (
    <div id='daily-update-wrapper'>
      <div className='update-container'>
        <div className='update-title'>일상 게시글 수정</div>
        <div className='contents-container'>
          <div className="input-column-box">
            <div className='title'>제목 ({title.length}/50)</div>
            <input type="text" value={title} placeholder="제목을 입력하세요." onChange={onTitleChangeHandler} />
          </div>
          <div className='input-column-box'>
            <div className='title'>내용 ({content.length}/2000)</div>
            {isLoaded &&
            <TextEditor content={content}setContent={onContentChangeHandler} />
            }
          </div>
          <div className="button-box">
            <div className={updateButtonClass} onClick={onUpdateButtonClickHandler}>작성 완료</div>
          </div>
        </div>
      </div>
    </div>
  );
}
