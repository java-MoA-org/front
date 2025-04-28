import React, { ChangeEvent, useState } from "react";
import "./BoardWrite.css";
import { useCookies } from "react-cookie";
import { BoardTagType } from "../../../../types/enums/BoardTagType";
import { ACCESS_TOKEN, BOARD_ABSOLUTE_PATH } from "../../../../constants";
import { useNavigate } from "react-router-dom";
import ResponseDto from "../../../../apis/dto/response/response.dto";
import { PostBoardRequestDto } from "../../../../apis/dto/request/board";
import { postBoardRequest } from "../../../../apis";
import TextEditor from "../../../../components/TextEditor";

// component: 게시판 게시글 작성 컴포넌트 //
export default function BoardWrite() {

  // state: 쿠키 상태 //
  const [cookies] = useCookies();

  // state: 게시판 글 작성 내용 상태 //
  const [tag, setTag] = useState<BoardTagType>(BoardTagType.FREE);
  const [title, setTitle] = useState<string>('');
  const [content, setContent] = useState<string>('');
  const [imageList, setImageList] = useState<string[]>([]);
  const [location, setLocation] = useState<string>('');
  const [detailLocation, setDetailLocation] = useState<string>('');

  // variable: access token //
  const accessToken = cookies[ACCESS_TOKEN];

  // variable: 보드 타입 태그 컨텐츠 클래스 //
  const freeContentClass =
    tag === "자유" ? "content active" : "content pointer";
  const gameContentClass =
    tag === "게임" ? "content active" : "content pointer";
  const travelContentClass =
    tag === "여행" ? "content active" : "content pointer";
  const workoutContentClass =
    tag === "운동" ? "content active" : "content pointer";
  const musicContentClass =
    tag === "음악" ? "content active" : "content pointer";
  const economyContentClass =
    tag === "경제" ? "content active" : "content pointer";
  const fashionContentClass =
    tag === "패션" ? "content active" : "content pointer";
  const foodContentClass =
    tag === "음식" ? "content active" : "content pointer";

  // variable: 게시판 글 작성 가능 여부 //
  const isActive = title !== "" && content !== "";
  // variable: 게시판 글 작성 버튼 클래스 //
  const writeButtonClass = isActive ? "button middle primary" : "button middle disable";

  // function: 네비게이터 함수 //
  const navigator = useNavigate();

  // function: post board response 처리 함수 //
  const postBoardResponse = (responseBody: ResponseDto | null) => {
    const message = 
      !responseBody ? "서버에 문제가 있습니다." : 
      responseBody.code === "DBE" ? "서버에 문제가 있습니다." : 
      responseBody.code === "AF" ? "인증에 실패했습니다." : "";

    const isSuccess = responseBody !== null && responseBody.code === "SU";
    if (!isSuccess) {
      alert(message);
      return;
    }

    navigator(BOARD_ABSOLUTE_PATH);
  };

  // event handler: 보드 타입 태그 변경 이벤트 처리 //
  const onBoardTagTypeChangeHandler = (boardTagType: BoardTagType) => {
    setTag(boardTagType);
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

  // 이미지 업로드 이후 content에 삽입
  const onImageUpload = (imageUrl: string) => {
    const imageTag = `<img src="${imageUrl}" alt="업로드 이미지" />`;
    setContent(prev => prev + imageTag);
  };

  // event handler: 이미지 목록 변경 이벤트 처리 //
  const onImageListChangeHandler = (imageList: string[]) => {
    setImageList(imageList);
  };

  // event handler: 게시판 글 작성 버튼 클릭 이벤트 처리 //
  const onWriteButtonClickHandler = () => {
    if (!isActive || !accessToken) return;

    const requestBody: PostBoardRequestDto = {
      tag,
      title,
      content,
      imageList,
      location,
      detailLocation,
    };
    postBoardRequest(requestBody, accessToken).then(postBoardResponse);
  };

  // render: 게시판 게시글 작성 컴포넌트 렌더링 //
  return (
    <div id='write-wrapper'>
      <div className='write-container'>
        <div className='write-title'>익명 게시글 작성</div>
        <div className='contents-container'>
          <div className='board-category'>카테고리</div>
          <div className='input-row-box'>
            <div className={freeContentClass} onClick={() => onBoardTagTypeChangeHandler(BoardTagType.FREE)}>
              자유
            </div>
            <div
              className={gameContentClass}
              onClick={() => onBoardTagTypeChangeHandler(BoardTagType.GAME)}
            >
              게임
            </div>
            <div
              className={travelContentClass}
              onClick={() => onBoardTagTypeChangeHandler(BoardTagType.TRAVEL)}
            >
              여행
            </div>
            <div
              className={workoutContentClass}
              onClick={() => onBoardTagTypeChangeHandler(BoardTagType.WORKOUT)}
            >
              운동
            </div>
            <div
              className={musicContentClass}
              onClick={() => onBoardTagTypeChangeHandler(BoardTagType.MUSIC)}
            >
              음악
            </div>
            <div
              className={economyContentClass}
              onClick={() => onBoardTagTypeChangeHandler(BoardTagType.ECONOMY)}
            >
              경제
            </div>
            <div
              className={fashionContentClass}
              onClick={() => onBoardTagTypeChangeHandler(BoardTagType.FASHION)}
            >
              패션
            </div>
            <div
              className={foodContentClass}
              onClick={() => onBoardTagTypeChangeHandler(BoardTagType.FOOD)}
            >
              음식
            </div>
          </div>
          <div className="input-column-box">
            <div className='title'>제목 ({title.length}/50)</div>
            <input type="text" value={title} placeholder="제목을 입력하세요." onChange={onTitleChangeHandler} />
          </div>
          <div className='input-column-box'>
            <div className='title'>내용 ({content.length}/2000)</div>
            <TextEditor
              content={content}
              setContent={onContentChangeHandler}
              onImageListChange={onImageListChangeHandler}
              onImageUpload={onImageUpload}
            />
          </div>
          <div className="button-box">
            <div className={writeButtonClass} onClick={onWriteButtonClickHandler}>작성 완료</div>
          </div>
        </div>
      </div>
    </div>
  );
}
