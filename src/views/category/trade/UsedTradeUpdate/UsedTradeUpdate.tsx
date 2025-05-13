import React, { ChangeEvent, useEffect, useState } from "react";
import "./UsedTradeUpdate.css";
import { useNavigate, useParams } from "react-router-dom";
import { useCookies } from "react-cookie";
import useSignInUserStore from "../../../../stores/sign-in-user.store";
import { ACCESS_TOKEN, USED_TRADE_ABSOLUTE_PATH, USED_TRADE_VIEW_ABSOLUTE_PATH } from "../../../../constants";
import { GetUsedTradeResponseDto } from "../../../../apis/dto/response/usedtrade";
import ResponseDto from "../../../../apis/dto/response/response.dto";
import { PatchUsedTradeRequestDto } from "../../../../apis/dto/request/usedtrade";
import { getUsedTradeRequest, patchUsedTradeRequest, UPLOAD_IMAGES_URL } from "../../../../apis";
import { Swiper, SwiperSlide } from "swiper/react";
import { UsedItemStatusTag } from "../../../../types/enums/UsedItemStatusTag";
import { ItemTypeTag } from "../../../../types/enums/ItemTypeTag";
import LocationModal from "../../../../components/Location";
import ImageUploadModal from "../../../../components/ImageUploadModal";
import axios from "axios";

// component: 중고거래 판매글 수정 컴포넌트 //
export default function UsedTradeUpdate() {

  // state: 경로 변수 상태 //
  const { tradeSequence } = useParams();

  // state: 쿠키 상태 //
  const [cookies] = useCookies();
  
  // state: 중고거래 판매글 수정 내용 상태 //
  const [title, setTitle] = useState<string>('');
  const [content, setContent] = useState<string>('');
  const [imageList, setImageList] = useState<(string | null)[]>(Array(5).fill(null))
  const [itemTypeTag, setItemTypeTag] = useState<ItemTypeTag>(ItemTypeTag.ETC);
  const [usedItemStatusTag, setUsedItemStatusTag] = useState<UsedItemStatusTag>(UsedItemStatusTag.NEW);
  const [location, setLocation] = useState<string>('');
  const [detailLocation, setDetailLocation] = useState<string>('');
  const [price, setPrice] = useState<number>(0);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  const filteredImages = imageList.filter((img): img is string => img !== null);

  // state: 모달창 여부 //
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  // variable: 카테고리 목록 //
  const categorys = [
    '기타', '전자기기', '의류', '가구',
    '도서', '뷰티/미용', '운동/스포츠', '식품'
  ];

  // variable: 아이템 상태 표시 목록 //
  const itemsStatusTag = [
    '새상품', '사용감 거의 없음', '사용감 있음', '파손/고장 있음'
  ];

  // variable: acess token //
  const accessToken = cookies[ACCESS_TOKEN];

  // variable: 중고거래글 수정 가능 여부 //
  const isActive = title.trim() !== "" 
  && content.length > 0
  && price > 0 
  && location.trim() !== "" 
  && detailLocation.trim() !== "" 
  && itemTypeTag !== undefined
  && usedItemStatusTag !== undefined
  && imageList.some(img => img !== null);

  // variable: 중고거래글 수정 버튼 클래스 //
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

    const { title, content, location, detailLocation, images, itemTypeTag, usedItemStatusTag, price } = responseBody as GetUsedTradeResponseDto;
    setTitle(title);  
    setContent(content);
    setLocation(location);
    setDetailLocation(detailLocation);
    setImageList(images);
    setIsLoaded(true);
    setItemTypeTag(itemTypeTag);
    setPrice(Number(price));
    setUsedItemStatusTag(usedItemStatusTag);
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

  // event handler: 이미지 목록 변경 이벤트 처리 //
  const onImageListChangeHandler = (imageList: string[]) => {
    setImageList(imageList);
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
    setIsModalOpen(true);
  };

  // function: 거래 위치 입력 모달 닫기 //
  const closeLocationModal = () => {
    setIsModalOpen(false);
  };

  // event handler: 판매글 수정 버튼 클릭 이벤트 처리 //
  const onUpdateButtonClickHandler = () => {
    if (!isActive || !accessToken || !tradeSequence) return;

    const requestBody: PatchUsedTradeRequestDto = {
      title, content, price, location, detailLocation, imageList: filteredImages
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
    <div id="trade-update-wrapper">
      <div className="trade-update-main">

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
          <ImageUploadModal isOpen={isImageModalOpen} onClose={closeImageUploadModal} onSave={onSaveImageList} initialImages={imageList} />
          <div className="image-preview" onClick={openImageUploadModal} >
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
        </div>
      
        <div className="item-category-container">
          <div className="item-category">카테고리</div>
          <div className="item-category-box">
            {categorys.map((label, i) => {
              const tag = label as ItemTypeTag;
              const isChecked = itemTypeTag === tag;
              return (
                <label key={i} className={`checkbox-item ${isChecked ? 'active' : ''}`}>
                  <input type="checkbox" checked={isChecked} onChange={() => onItemTypeTagChangeHandler(tag)} disabled={true} />
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
                  <input type="checkbox" checked={isChecked} onChange={() => onUsedItemStatusTag(tag)} disabled={true} />
                  {label}
                </label>
              );
            })}
          </div>
        </div>

        <div className="item-content-container">
          <div className="item-content">설명</div>
          {isLoaded &&
          <textarea className="item-content-box" placeholder="브랜드, 모델명, 구매 시기, 하자 유무 등 상품 설명을 최대한 자세히 적어주세요." value={content} onChange={(e) => onContentChangeHandler(e.target.value)} />
          }
        </div>

        <div className="transaction-location-container">
          <div className="transaction-location">거래위치</div>
          <div className="transaction-location-box">
            <input type="text" placeholder="거래위치를 입력해주세요." 
              value={
                location.trim() !== "" || detailLocation.trim() !== "" ? `${location} ${detailLocation}` : ""
              }
              readOnly onClick={openLocationModal} />
          </div>
          <LocationModal isOpen={isModalOpen} onClose={closeLocationModal} onSave={onSaveLocation} />
        </div>

        <div className="price-container">
          <div className="price">가격</div>
          <div className="price-box">
            <input type="number" placeholder="가격을 입력하세요"value={price} onChange={onPriceChangeHandler} />
          </div>
        </div>
        <div className="button-container">
          <div className={updateButtonClass} onClick={onUpdateButtonClickHandler}>수정하기</div>
        </div>
      </div>
    </div>
  );
}
