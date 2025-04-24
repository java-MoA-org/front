import React, { ChangeEvent, useEffect, useState } from "react";
import "./BoardUpdate.css";
import { useNavigate, useParams } from "react-router-dom";
import { useCookies } from "react-cookie";
import useSignInUserStore from "../../../../stores/sign-in-user.store";
import { ACCESS_TOKEN, BOARD_ABSOLUTE_PATH, BOARD_VIEW_ABSOLUTE_PATH } from "../../../../constants";
import { GetBoardResponseDto } from "../../../../apis/dto/response/board";
import ResponseDto from "../../../../apis/dto/response/response.dto";
import { PatchBoardRequestDto } from "../../../../apis/dto/request/board";
import { getBoardRequest, patchBoardRequest } from "../../../../apis";
import TextEditor from "../../../../components/TextEditor";

// component: 게시판 게시글 수정 컴포넌트 //
export default function BoardUpdate() {

  // state: 경로 변수 상태 //
  const { boardSequence } = useParams();

  // state: 쿠키 상태 //
  const [cookies] = useCookies();

  // state: 로그인 유저 아이디 상태 //
  const { userId } = useSignInUserStore();

  // state: 게시글 수정 내용 상태 //
  const [writerId, setWriterId] = useState<string>('');
  const [writeDate, setWriteDate] = useState<string>('');
  const [boardTag, setBoardTag] = useState<string>('');
  const [title, setTitle] = useState<string>('');
  const [content, setContent] = useState<string>('');

  // variable: acess token //
  const accessToken = cookies[ACCESS_TOKEN];

  // variable: 게시글 수정 가능 여부 //
  const isActive = title !== '' && content !== "";
  // variable: 게시글 수정 버튼 클래스 //
  const updateButtonClass = !isActive ? 'button middle primary' : 'button middle disable';

  // function: 네비게이터 함수 //
  const navigator = useNavigate();

  // function: get board response 처리 함수 //
  const getBoardResponse = (responseBody: GetBoardResponseDto | ResponseDto | null) => {
    const message =
      !responseBody ? '서버에 문제가 있습니다.' :
      responseBody.code === 'DBE' ? '서버에 문제가 있습니다.' : 
      responseBody.code === 'AF' ? '인증에 실패했습니다.' : 
      responseBody.code === 'NB' ? '존재하지 않는 게시글입니다.' : '';

    const isSuccess = responseBody !== null && responseBody.code === 'SU';
    if(!isSuccess) {
      alert(message);
      navigator(BOARD_ABSOLUTE_PATH);
      return;
    }

    const { writerId, creationDate, tag, title, content } = responseBody as GetBoardResponseDto;
    setWriterId(writerId);
    setWriteDate(creationDate);
    setBoardTag(tag);
    setTitle(title);
    setContent(content);
  };

  // function: patch board response 처리 함수 //
  const patchBoardResponse = (responseBody: ResponseDto | null) => {
    const message = 
      !responseBody ? '서버에 문제가 있습니다.' :
      responseBody.code === 'DBE' ? '서버에 문제가 있습니다.' :
      responseBody.code === 'AF' ? '인증에 실패했습니다.' :
      responseBody.code === 'NB' ? '존재하지 않는 게시글입니다.' :
      responseBody.code === 'NP' ? '권한이 없습니다.' : '';

    const isSuccess = responseBody !== null && responseBody.code === 'SU';
    if (!isSuccess) {
      alert(message);
      return;
    }

    if(!boardSequence) return;
    navigator(BOARD_VIEW_ABSOLUTE_PATH(boardSequence));
  }

  // event handler: 제목 변경 이벤트 처리 //
  const onTitleChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setTitle(value);
  };

  // event handler: 내용 변경 이벤트 처리 //
  const onContentChangeHandler = (content: string) => {
    setContent(content);
  };

  // event handler: 게시글 수정 버튼 클릭 이벤트 처리 //
  const onUpdateButtonClickHandler = () => {
    if (!isActive || !accessToken || !boardSequence) return;

    const requestBody: PatchBoardRequestDto = {
      title, content
    };
    patchBoardRequest(boardSequence, requestBody, accessToken).then(patchBoardResponse);
  };

  // effect: 게시글 번호가 변경될 시 실행할 함수 //
  useEffect(() => {
    if (!accessToken || !boardSequence) return;
    getBoardRequest(boardSequence, accessToken).then(getBoardResponse);
  }, [boardSequence]);

  // effect: 로그인 유저 아이디와 작성자 아이디가 변경될시 실행할 함수 //
  useEffect(() => {
    if (writerId && userId && writerId !== userId) {
      alert('권한이 없습니다.');
      navigator(BOARD_ABSOLUTE_PATH);
    }
  }, [writerId, userId])

  // render: 게시판 게시글 수정 컴포넌트 렌더링 //
  return (
    <div id='board-write-wrapper'>
      <div className='write-container'>
        <div className='write-title'>게시판 글 수정</div>
        <div className='contents-container'>
          <div className='board-category'>카테고리</div>
          <div className='input-row-box'>
            <div className='content disabled'>{boardTag}</div>
          </div>

          <div className='input-box'>
            <input
              className='input title-input'
              type='text'
              placeholder='제목을 입력해주세요.'
              value={title}
              onChange={onTitleChangeHandler}
            />
          </div>

          <div className='editor-box'>
            <TextEditor content={content} setContent={onContentChangeHandler} />
          </div>

          <div className='button-box'>
            <div
              className={updateButtonClass}
              onClick={onUpdateButtonClickHandler}
            >
              게시글 수정
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
