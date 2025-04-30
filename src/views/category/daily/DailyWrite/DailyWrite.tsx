import React, { ChangeEvent, useState } from "react";
import { useCookies } from "react-cookie";
import { ACCESS_TOKEN, DAILY_ABSOLUTE_PATH } from "../../../../constants";
import { useNavigate } from "react-router-dom";
import ResponseDto from "../../../../apis/dto/response/response.dto";
import { PostDailyRequestDto } from "../../../../apis/dto/request/daily";
import { postDailyRequest } from "../../../../apis";
import TextEditor from "../../../../components/TextEditor";

// component: 일상 게시판 게시글 작성 컴포넌트 //
export default function DailyWrite() {
  // state: 쿠키 상태 //
  // state: 쿠키 상태 //
  const [cookies] = useCookies();

  // state: 게시판 글 작성 내용 상태 //
  const [title, setTitle] = useState<string>('');
  const [content, setContent] = useState<string>('');
  const [imageList, setImageList] = useState<string[]>([]);
  const [location, setLocation] = useState<string>('');
  const [detailLocation, setDetailLocation] = useState<string>('');

  // variable: access token //
  const accessToken = cookies[ACCESS_TOKEN];

  // variable: 일상 게시글 작성 가능 여부 //
  const isActive = title !== "" && content !== "";
  // variable: 일상 게시글 작성 버튼 클래스 //
  const writeButtonClass = isActive ? "button middle primary" : "button middle disable";

  // function: 네비게이터 함수 //
  const navigator = useNavigate();

  // function: post daily response 처리 함수 //
  const postDailyResponse = (responseBody: ResponseDto | null) => {
    const message = 
      !responseBody ? "서버에 문제가 있습니다." : 
      responseBody.code === "DBE" ? "서버에 문제가 있습니다." : 
      responseBody.code === "AF" ? "인증에 실패했습니다." : "";

    const isSuccess = responseBody !== null && responseBody.code === "SU";
    if (!isSuccess) {
      alert(message);
      return;
    }

    navigator(DAILY_ABSOLUTE_PATH);
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

    const requestBody: PostDailyRequestDto = {
      title,
      content,
      imageList,
      location,
      detailLocation,
    };
    postDailyRequest(requestBody, accessToken).then(postDailyResponse);
  };

  // render: 일상 게시판 게시글 작성 컴포넌트 렌더링 //
  return (
    <div id='write-wrapper'>
      <div className='write-container'>
        <div className='write-title'>일상 게시글 작성</div>
        <div className='contents-container'>
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
              type="daily"
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
