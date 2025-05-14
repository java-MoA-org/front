import React, { ChangeEvent, useState } from "react";
import "./UsedTradeWrite.css";
import { useCookies } from "react-cookie";
import { ItemTypeTag } from "../../../../types/enums/ItemTypeTag";
import { ACCESS_TOKEN, USED_TRADE_ABSOLUTE_PATH } from "../../../../constants";
import { useNavigate } from "react-router-dom";
import ResponseDto from "../../../../apis/dto/response/response.dto";
import { PostUsedTradeRequestDto } from "../../../../apis/dto/request/usedtrade";
import { postUsedTradeRequest, UPLOAD_IMAGES_URL } from "../../../../apis";
import { UsedItemStatusTag } from "../../../../types/enums/UsedItemStatusTag";
import LocationModal from "../../../../components/Location";
import ImageUploadModal from "../../../../components/ImageUploadModal";
import axios from "axios";

// component: 중고거래 게시판 판매글 작성 컴포넌트 //
export default function UsedTradeWrite() {

  // state: 쿠키 상태 //
  const [cookies] = useCookies();

  // state: 중고거래글 작성 내용 상태 //
  const [title, setTitle] = useState<string>('');
  const [content, setContent] = useState<string>('');
  const [imageList, setImageList] = useState<(string | null)[]>(Array(5).fill(null))
  const [itemTypeTag, setItemTypeTag] = useState<ItemTypeTag>(ItemTypeTag.ETC);
  const [usedItemStatusTag, setUsedItemStatusTag] = useState<UsedItemStatusTag>(UsedItemStatusTag.NEW);
  const [location, setLocation] = useState<string>('');
  const [detailLocation, setDetailLocation] = useState<string>('');
  const [price, setPrice] = useState<number>(0);

  const filteredImages = imageList.filter((img): img is string => img !== null);

  // state: 모달창 여부 //
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);

  // variable: 카테고리 목록 //
  const categorys = [
    '기타', '전자기기', '의류', '가구',
    '도서', '뷰티/미용', '운동/스포츠', '식품'
  ];

  // variable: 아이템 상태 표시 목록 //
  const itemsStatusTag = [
    '새상품', '사용감 거의 없음', '사용감 있음', '파손/고장 있음'
  ];

  // variable: access token //
  const accessToken = cookies[ACCESS_TOKEN];

  // variable: 중고거래글 작성 가능 여부 //
  const isActive = title.trim() !== "" 
  && content.length > 0
  && price > 0 
  && location.trim() !== "" 
  && detailLocation.trim() !== "" 
  && itemTypeTag !== undefined
  && usedItemStatusTag !== undefined
  && imageList.some(img => img !== null);

  // variable: 중고거래글 작성 버튼 클래스 //
  const writeButtonClass = isActive ? "button middle primary" : "button middle disable";

  // function: 네비게이터 함수 //
  const navigator = useNavigate();

  // function: post used trade response 처리 함수 //
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
    if (content.length > 500) {
      alert("내용은 500자 이내로 작성해주세요.");
      return;
    }
    setContent(value);
  };

  const onTextareaChangeHandler = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    onContentChangeHandler(event.target.value);
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;
  
    const validFiles = Array.from(files).filter((file) =>
      ['image/jpeg', 'image/png'].includes(file.type) && file.size <= 5 * 1024 * 1024
    );
  
    if (validFiles.length === 0) {
      alert('유효한 이미지 파일이 없습니다.');
      return;
    }
  
    const formData = new FormData();
    validFiles.forEach((file) => formData.append('files', file));
  
    try {
      const response = await axios.post(UPLOAD_IMAGES_URL, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${accessToken}`,
        },
      });
  
      const imageUrls = Array.isArray(response.data.data) ? response.data.data : [response.data.data];
  
      const newImageList = [...imageList, ...imageUrls].slice(0, 5);
      setImageList(newImageList);
      onImageListChangeHandler(newImageList);
  
    } catch (error) {
      console.error('이미지 업로드 실패:', error);
      alert('이미지 업로드에 실패했습니다. 다시 시도해주세요.');
    }
  };

  // event handler: 이미지 목록 변경 이벤트 처리 //
  const onImageListChangeHandler = (imageList: string[]) => {
    setImageList(imageList);
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

  // state: 이미지 저장하는 함수 //
  const onSaveImageList = (newImageList: (string | null)[]) => {
    setImageList(newImageList);
  };

  // function: 이미지 업로드 모달 열기 //
  const openImageUploadModal = () => {
    setIsImageModalOpen(true);
  }
  // function: 이미지 업로드 모달 닫기 //
  const closeImageUploadModal = () => {
    setIsImageModalOpen(false);
  }

  // state: 거래 위치와 상세 주소를 상태에 저장하는 함수 //
  const onSaveLocation = (location: string, detailLocation: string) => {
    setLocation(location);
    setDetailLocation(detailLocation);
  };

  // function: 거래 위치 입력 모달 열기 //
  const openLocationModal = () => {
    setIsLocationModalOpen(true);
  };

  // function: 거래 위치 입력 모달 닫기 //
  const closeLocationModal = () => {
    setIsLocationModalOpen(false);
  };

  // event handler: 게시판 글 작성 버튼 클릭 이벤트 처리 //
  const onWriteButtonClickHandler = () => {
    if (!isActive || !accessToken) return;

    const requestBody: PostUsedTradeRequestDto = {
      title,
      content,
      itemTypeTag,
      usedItemStatusTag,
      location,
      detailLocation,
      price,
      imageList: filteredImages,
    };
    postUsedTradeRequest(requestBody, accessToken).then(postUsedTradeResponse);
  };

  // render: 중고거래 게시판 판매글 작성 컴포넌트 렌더링 //
  return (
    <div id="trade-write-wrapper">
      <div className="trade-write-main">

        <div className="item-images-container">
          <div className="item-images">상품이미지</div>
          <input
            type="file"
            accept="image/png, image/jpeg"
            style={{ display: "none" }}
            id="file-input"
            onChange={handleImageUpload}
            multiple
          />
          <ImageUploadModal isOpen={isImageModalOpen} onClose={closeImageUploadModal} onSave={onSaveImageList} />
          <div className="trade-image-preview" onClick={openImageUploadModal} >
            {imageList[0] ? (
              <img src={imageList[0]} alt="썸네일" className="thumbnail-image" />
            ) : (
              <div className="default-image" />
            )}
          </div>
        </div>

        <div className="item-name-container">
          <div className="item-name">상품명</div>
          <input className="item-name-box" type="text" placeholder="상품명을 입력해 주세요." value={title} onChange={onTitleChangeHandler} />
          <div className='length'>({title.length}/50)</div>
        </div>
      
        <div className="item-category-container">
          <div className="item-category">카테고리</div>
          <div className="item-category-box">
            {categorys.map((label, i) => {
              const tag = label as ItemTypeTag;
              const isChecked = itemTypeTag === tag;
              return (
                <label key={i} className={`checkbox-item ${isChecked ? 'active' : ''}`}>
                  <input type="checkbox" checked={isChecked} onChange={() => onItemTypeTagChangeHandler(tag)}/>
                  {label}
                </label>
              );
            })}
          </div>
        </div>

        <div className="item-status-container">
          <div className="item-status">상품상태</div>
          <div className="item-status-box">
            {itemsStatusTag.map((label, i) => {
              const tag = label as UsedItemStatusTag;
              const isChecked = usedItemStatusTag === tag;
              return (
                <label key={i} className={`checkbox-item ${isChecked ? 'active' : ''}`}>
                  <input type="checkbox" checked={isChecked} onChange={() => onUsedItemStatusTag(tag)}/>
                  {label}
                </label>
              );
            })}
          </div>
        </div>

        <div className="item-content-container">
          <div className="item-content">설명</div>
          <textarea className="item-content-box" placeholder="브랜드, 모델명, 구매 시기, 하자 유무 등 상품 설명을 최대한 자세히 적어주세요." value={content} onChange={onTextareaChangeHandler} />
          <div className='title'>({content.length}/500)</div>
        </div>

        <div className="transaction-location-container">
          <div className="transaction-location">거래위치</div>
          <div className="transaction-location-box">
            <input type="text" placeholder="거래위치를 입력해주세요." 
              value={ location.trim() !== "" || detailLocation.trim() !== "" ? `${location} ${detailLocation}` : "" }
              readOnly onClick={openLocationModal} 
            />
          </div>
          <LocationModal isOpen={isLocationModalOpen} onClose={closeLocationModal} onSave={onSaveLocation} />
        </div>

        <div className="price-container">
          <div className="price">가격</div>
          <div className="price-box">
            <input type="number" placeholder="가격을 입력하세요"value={price} onChange={onPriceChangeHandler} />
          </div>
        </div>
        <div className="button-container">
          <div className={writeButtonClass} onClick={onWriteButtonClickHandler}>작성하기</div>
        </div>
      </div>
    </div>
  );
}
