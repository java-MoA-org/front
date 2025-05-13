import React, { ChangeEvent, useState } from 'react';
import './UsedTradeWrite.css';
import { useCookies } from 'react-cookie';
import { ItemTypeTag } from '../../../../types/enums/ItemTypeTag';
import { ACCESS_TOKEN, USED_TRADE_ABSOLUTE_PATH } from '../../../../constants';
import { useNavigate } from 'react-router-dom';
import ResponseDto from '../../../../apis/dto/response/response.dto';
import { PostUsedTradeRequestDto } from '../../../../apis/dto/request/usedtrade';
import { postUsedTradeRequest } from '../../../../apis';
import { UsedItemStatusTag } from '../../../../types/enums/UsedItemStatusTag';
import LocationModal from '../../../../components/Location';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';

// component: 중고거래 게시판 판매글 작성 컴포넌트 //
export default function UsedTradeWrite() {
  // state: 쿠키 상태 //
  const [cookies] = useCookies();

  // state: 중고거래글 작성 내용 상태 //
  const [title, setTitle] = useState<string>('');
  const [content, setContent] = useState<string>('');
  const [imageList, setImageList] = useState<File[]>([]);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [itemTypeTag, setItemTypeTag] = useState<ItemTypeTag>(ItemTypeTag.ETC);
  const [usedItemStatusTag, setUsedItemStatusTag] = useState<UsedItemStatusTag>(UsedItemStatusTag.NEW);
  const [location, setLocation] = useState<string>('');
  const [detailLocation, setDetailLocation] = useState<string>('');
  const [price, setPrice] = useState<number>(0);

  // state: 모달창 여부 //
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  // variable: 카테고리 목록 //
  const categorys = ['기타', '전자기기', '의류', '가구', '도서', '뷰티/미용', '운동/스포츠', '식품'];

  // variable: 아이템 상태 표시 목록 //
  const itemsStatusTag = ['새상품', '사용감 거의 없음', '사용감 있음', '파손/고장 있음'];

  // variable: access token //
  const accessToken = cookies[ACCESS_TOKEN];

  // variable: 중고거래글 작성 가능 여부 //
  const isActive =
    title.trim() !== '' &&
    content.trim() !== '' &&
    price > 0 &&
    location.trim() !== '' &&
    detailLocation.trim() !== '' &&
    itemTypeTag !== undefined &&
    usedItemStatusTag !== undefined &&
    imageList !== undefined;

  // variable: 중고거래글 작성 버튼 클래스 //
  const writeButtonClass = isActive ? 'button middle primary' : 'button middle disable';

  // function: 네비게이터 함수 //
  const navigator = useNavigate();

  // function: post board response 처리 함수 //
  const postUsedTradeResponse = (responseBody: ResponseDto | null) => {
    const message = !responseBody
      ? '서버에 문제가 있습니다.'
      : responseBody.code === 'DBE'
      ? '서버에 문제가 있습니다.'
      : responseBody.code === 'AF'
      ? '인증에 실패했습니다.'
      : '';

    const isSuccess = responseBody !== null && responseBody.code === 'SU';
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
      alert('제목은 50자 이내로 작성해주세요.');
      return;
    }
    setTitle(value);
  };

  // event handler: 내용 변경 이벤트 처리 //
  const onContentChangeHandler = (value: string) => {
    if (value.length > 500) {
      alert('내용은 500자 이내로 작성해주세요.');
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

  // 이미지 파일 변경 핸들러
  const onImageChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    const selectedFiles = Array.from(files);
    setImageList(selectedFiles);

    // 미리보기용 URL
    const previewUrls = selectedFiles.map((file) => URL.createObjectURL(file));
    setImageUrls(previewUrls);
  };

  // event handler: 이미지 업로드 버튼 //
  const handleFileInputClick = () => {
    document.getElementById('file-input')?.click();
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
    };
    postUsedTradeRequest(requestBody, imageList, accessToken).then(postUsedTradeResponse);
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
            style={{ display: 'none' }}
            id="file-input"
            onChange={onImageChangeHandler}
            multiple
          />
          <div
            className="image-preview-slider"
            onClick={handleFileInputClick}
            style={{ width: '300px', height: '300px', marginTop: '10px' }}
          >
            <Swiper spaceBetween={0} slidesPerView={1}>
              {imageUrls.map((imageUrl, index) => (
                <SwiperSlide key={index}>
                  <div>
                    <img src={imageUrl} alt={`업로드 이미지 ${index}`} style={{ width: '100%', height: 'auto' }} />
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>

        <div className="item-name-container">
          <div className="item-name">상품명</div>
          <input
            className="item-name-box"
            type="text"
            placeholder="상품명을 입력해 주세요."
            value={title}
            onChange={onTitleChangeHandler}
          />
        </div>

        <div className="item-category-container">
          <div className="item-category">카테고리</div>
          <div className="item-category-box">
            {categorys.map((label, i) => {
              const tag = label as ItemTypeTag;
              const isChecked = itemTypeTag === tag;
              return (
                <label key={i} className={`checkbox-item ${isChecked ? 'active' : ''}`}>
                  <input type="checkbox" checked={isChecked} onChange={() => onItemTypeTagChangeHandler(tag)} />
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
                  <input type="checkbox" checked={isChecked} onChange={() => onUsedItemStatusTag(tag)} />
                  {label}
                </label>
              );
            })}
          </div>
        </div>

        <div className="item-content-container">
          <div className="item-content">설명</div>
          <textarea
            className="item-content-box"
            placeholder="브랜드, 모델명, 구매 시기, 하자 유무 등 상품 설명을 최대한 자세히 적어주세요."
            value={content}
            onChange={(e) => onContentChangeHandler(e.target.value)}
          />
        </div>

        <div className="transaction-location-container">
          <div className="transaction-location">거래위치</div>
          <div className="transaction-location-box">
            <input
              type="text"
              placeholder="거래위치를 입력해주세요."
              value={location.trim() !== '' || detailLocation.trim() !== '' ? `${location} ${detailLocation}` : ''}
              readOnly
              onClick={openLocationModal}
            />
          </div>
          <LocationModal isOpen={isModalOpen} onClose={closeLocationModal} onSave={onSaveLocation} />
        </div>

        <div className="price-container">
          <div className="price">가격</div>
          <div className="price-box">
            <input type="number" placeholder="가격을 입력하세요" value={price} onChange={onPriceChangeHandler} />
          </div>
        </div>
        <div className="button-container">
          <div className={writeButtonClass} onClick={onWriteButtonClickHandler}>
            작성하기
          </div>
        </div>
      </div>
    </div>
  );
}