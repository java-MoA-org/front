import React, { ChangeEvent, useState } from "react";
import "./UsedTradeWrite.css";
import { useCookies } from "react-cookie";
import { ItemTypeTag } from "../../../../types/enums/ItemTypeTag";
import { ACCESS_TOKEN, USED_TRADE_ABSOLUTE_PATH } from "../../../../constants";
import { useNavigate } from "react-router-dom";
import ResponseDto from "../../../../apis/dto/response/response.dto";
import { PostUsedTradeRequestDto } from "../../../../apis/dto/request/usedtrade";
import { postUsedTradeRequest } from "../../../../apis";
import { UsedItemStatusTag } from "../../../../types/enums/UsedItemStatusTag";

// component: 중고거래 게시판 판매글 작성 컴포넌트 //
export default function UsedTradeWrite() {

  // state: 쿠키 상태 //
  const [cookies] = useCookies();

  // state: 중고거래글 작성 내용 상태 //
  const [title, setTitle] = useState<string>('');
  const [content, setContent] = useState<string>('');
  const [imageList, setImageList] = useState<string[]>([]);
  const [itemTypeTag, setItemTypeTag] = useState<ItemTypeTag>(ItemTypeTag.ETC);
  const [usedItemStatusTag, setUsedItemStatusTag] = useState<UsedItemStatusTag>(UsedItemStatusTag.NEW);
  const [location, setLocation] = useState<string>('');
  const [detailLocation, setDetailLocation] = useState<string>('');
  const [price, setPrice] = useState<number>(0);

  // variable: access token //
  const accessToken = cookies[ACCESS_TOKEN];

  // variable: 아이템 타입 태그 컨텐츠 클래스 //
  const freeContentClass =
  itemTypeTag === "기타" ? "content active" : "content pointer";
  const gameContentClass =
  itemTypeTag === "전자기기" ? "content active" : "content pointer";
  const travelContentClass =
  itemTypeTag === "의류" ? "content active" : "content pointer";
  const workoutContentClass =
  itemTypeTag === "가구" ? "content active" : "content pointer";
  const musicContentClass =
  itemTypeTag === "도서" ? "content active" : "content pointer";
  const economyContentClass =
  itemTypeTag === "뷰티/미용" ? "content active" : "content pointer";
  const fashionContentClass =
  itemTypeTag === "운동/스포츠" ? "content active" : "content pointer";
  const foodContentClass =
  itemTypeTag === "식품" ? "content active" : "content pointer";

  // variable: 중고거래글 작성 가능 여부 //
  const isActive = title !== "" && content !== "";
  // variable: 중고거래글 작성 버튼 클래스 //
  const writeButtonClass = isActive ? "button middle primary" : "button middle disable";

  // function: 네비게이터 함수 //
  const navigator = useNavigate();

  // function: post board response 처리 함수 //
  const postUsedTradeResponse = (responseBody: ResponseDto | null) => {
    const message = 
      !responseBody ? "서버에 문제가 있습니다." : 
      responseBody.code === "DBE" ? "서버에 문제가 있습니다." : 
      responseBody.code === "AF" ? "인증에 실패했습니다." : "";

    const isSuccess = responseBody !== null && responseBody.code === "SU";
    if (!isSuccess) {
      alert(message);
      return;
    }

    navigator(USED_TRADE_ABSOLUTE_PATH);
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

  // event handler: 아이템 타입 태그 변경 이벤트 처리 //
  const onItemTypeTagChangeHandler = (itemTypeTag: ItemTypeTag) => {
    setItemTypeTag(itemTypeTag);
  };

  // event handler: 사용감 상태 태그 변경 이벤트 처리 //
  const onUsedItemStatusTag = (usedItemStatusTag: UsedItemStatusTag) => {
    setUsedItemStatusTag(usedItemStatusTag);
  };

  // event handler: 가격 변경 이벤트 처리 //
  const onPriceChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
    const priceValue = Number(event.target.value);
    setPrice(priceValue);
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

    const requestBody: PostUsedTradeRequestDto = {
      title,
      content,
      imageList,
      itemTypeTag,
      usedItemStatusTag,
      location,
      detailLocation,
      price
    };
    postUsedTradeRequest(requestBody, accessToken).then(postUsedTradeResponse);
  };

  // render: 중고거래 게시판 판매글 작성 컴포넌트 렌더링 //
  return (
    <div className="used-trade-write">
      <h1>판매글 작성</h1>

      <div className="input-container">
        <label>제목</label>
        <input
          type="text"
          value={title}
          onChange={onTitleChangeHandler}
          placeholder="글 제목을 입력하세요"
        />
      </div>

      <div className="input-container">
        <label>내용</label>
        <textarea
          value={content}
          onChange={(e) => onContentChangeHandler(e.target.value)}
          placeholder="상품에 대한 설명을 입력하세요"
        />
      </div>

      <div className="input-container">
        <label>가격</label>
        <input
          type="number"
          value={price}
          onChange={onPriceChangeHandler}
          placeholder="가격을 입력하세요"
        />
      </div>

      <div className="input-container">
        <label>지역</label>
        <input
          type="text"
          value={location}
          placeholder="지역을 입력하세요"
        />
      </div>

      <div className="input-container">
        <label>상세 위치</label>
        <input
          type="text"
          value={detailLocation}
          placeholder="상세 위치를 입력하세요"
        />
      </div>

      <div className="input-container">
        <label>카테고리</label>
        <div className="category-options">
        </div>
      </div>

      <div className="input-container">
        <label>상품 상태</label>
        <div className="status-options">
        </div>
      </div>

      <div className="button-container">
        <button
          className={writeButtonClass}
          onClick={onWriteButtonClickHandler}
          disabled={!isActive}
        >
          게시글 작성
        </button>
      </div>
    </div>
  );
}
