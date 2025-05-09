import React, { useEffect, useState } from 'react';
import './UsedTradeView.css';
import { useNavigate, useParams } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import useSignInUserStore from '../../../../stores/sign-in-user.store';
import { ACCESS_TOKEN, USED_TRADE_ABSOLUTE_PATH, USED_TRADE_UPDATE_ABSOLUTE_PATH } from '../../../../constants';
import { GetUsedTradeResponseDto } from '../../../../apis/dto/response/usedtrade';
import ResponseDto from '../../../../apis/dto/response/response.dto';
import {
  deleteUsedTradeRequest,
  getUsedTradeRequest,
  postLikeAlertRequest,
  putUsedTradeLikeRequest,
} from '../../../../apis';
import likeIcon from '../../../../assets/images/trade-like.png';
import likeClickIcon from '../../../../assets/images/trade-like-click.png';
import likeCountIcon from '../../../../assets/images/tradeLike.png';
import viewsIcon from '../../../../assets/images/tradeViews.png';
import timeIcon from '../../../../assets/images/time.png';
import locationIcon from '../../../../assets/images/place.png';

import { useElapsedTime } from '../../../../hooks';
import PostLikeAlertRequestDto from '../../../../apis/dto/request/alert/post-like-alert.request.dto';

// component: 중고거래 판매글 상세보기 컴포넌트 //
export default function UsedTradeView() {
  // state: 경로 변수 상태 //
  const { tradeSequence } = useParams();

  // state: cookie 상태 //
  const [cookies] = useCookies();

  // state: 로그인 사용자 아이디 상태 //
  const { userId } = useSignInUserStore();

  // state: 중고거래 판매글 내용 상태
  const [writerId, setWriterId] = useState<string>('');
  const [writerNickname, setWriterNickname] = useState<string>('');
  const [writeDate, setWriteDate] = useState<string>('');
  const [title, setTitle] = useState<string>('');
  const [content, setContent] = useState<string>('');
  const [views, setViews] = useState<number>(0);
  const [likeCount, setLikeCount] = useState<number>(0);
  const [price, setPrice] = useState<string>('');
  const [location, setLocation] = useState<string>('');
  const [detailLocation, setDetailLocation] = useState<string>('');
  const [itemTypeTag, setItemTypeTag] = useState<string>('');
  const [transactionStatus, setTransactionStatus] = useState<string>('');
  const [profileImage, setProfileImage] = useState<string>('');
  const [usedItemStatusTag, setUsedItemStatusTag] = useState<string>('');

  // state: 좋아요 여부 //
  const [liked, setLiked] = useState<boolean>(false);

  // variable: 좋아요 여부 //
  const isLiked = liked;
  // variable: 좋아요 클래스 //
  const likedClass = isLiked ? 'icon-likes-click' : 'icon-likes';

  // state: 이미지 목록 상태 //
  const [images, setImages] = useState<string[]>([]);

  // variable: access token //
  const accessToken = cookies[ACCESS_TOKEN];

  // hook: 작성 시간 계산 //
  const elapsedTime = useElapsedTime(writeDate);

  // function: 네비게이터 함수 //
  const navigator = useNavigate();

  // function: get board response 처리 함수 //
  const getUsedTradeResponse = (responseBody: GetUsedTradeResponseDto | ResponseDto | null) => {
    const message = !responseBody
      ? '서버에 문제가 있습니다.'
      : responseBody.code === 'DBE'
      ? '서버에 문제가 있습니다.'
      : responseBody.code === 'AF'
      ? '인증에 실패했습니다.'
      : responseBody.code === 'NU'
      ? '존재하지 않는 판매글입니다.'
      : '';

    const isSuccess = responseBody !== null && responseBody.code === 'SU';

    if (!isSuccess) {
      alert(message);
      navigator(USED_TRADE_ABSOLUTE_PATH);
      return;
    }

    const {
      title,
      content,
      creationDate,
      views,
      itemTypeTag,
      likeCount,
      writerNickname,
      imageUrls,
      price,
      location,
      detailLocation,
      profileImage,
      transactionStatus,
      usedItemStatusTag,
    } = responseBody as GetUsedTradeResponseDto;

    setTitle(title);
    setContent(content);
    setWriterNickname(writerNickname);
    setWriteDate(creationDate);
    setViews(views);
    setLikeCount(likeCount);
    setItemTypeTag(itemTypeTag);
    setTransactionStatus(transactionStatus);
    setProfileImage(profileImage);
    setLocation(location);
    setDetailLocation(detailLocation);
    setPrice(price);
    setUsedItemStatusTag(usedItemStatusTag);
  };

  // function: 물건 상태를 한글로 변환하는 함수 //
  const getItemStatusTagInKorean = (usedItemStatusTag: string) => {
    switch (usedItemStatusTag) {
      case 'NEW':
        return '새상품';
      case 'LIKE_NEW':
        return '사용감 거의 없음';
      case 'USED':
        return '사용감 있음';
      case 'DAMAGED':
        return '파손/고장 있음';
      default:
        return usedItemStatusTag;
    }
  };

  const itemStatusTagInKorean = getItemStatusTagInKorean(usedItemStatusTag);

  // function: 물건 타입을 한글로 변환하는 함수 //
  const getItemTypeTagInKorean = (itemTypeTag: string) => {
    switch (itemTypeTag) {
      case 'ELECTRONICS':
        return '전자기기';
      case 'CLOTHING':
        return '의류';
      case 'FURNITURE':
        return '가구';
      case 'BOOKS':
        return '도서';
      case 'BEAUTY':
        return '뷰티/미용';
      case 'SPORTS':
        return '운동/스포츠';
      case 'FOOD':
        return '식품';
      case 'ETC':
        return '기타';
      default:
        return itemTypeTag;
    }
  };

  const itemTypeTagInKorean = getItemTypeTagInKorean(itemTypeTag);

  // function: delete used trade response 처리 함수 //
  const deleteUsedTradeResponse = (responseBody: ResponseDto | null) => {
    const message = !responseBody
      ? '서버에 문제가 있습니다.'
      : responseBody.code === 'DBE'
      ? '서버에 문제가 있습니다.'
      : responseBody.code === 'AF'
      ? '인증에 실패했습니다.'
      : responseBody.code === 'NU'
      ? '존재하지 않는 판매글입니다.'
      : responseBody.code === 'NP'
      ? '권한이 없습니다.'
      : '';

    const isSuccess = responseBody !== null && responseBody.code === 'SU';
    if (!isSuccess) {
      alert(message);
      return;
    }

    alert('삭제에 성공했습니다.');
    navigator(USED_TRADE_ABSOLUTE_PATH);
  };

  // function: put likes response 처리 함수 //
  const putLikeResponse = (responseBody: ResponseDto | null) => {
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

    if (responseBody && responseBody.data) {
      setLikeCount(responseBody.data.likeCount);
      setLiked(responseBody.data.liked);

      if (!tradeSequence || !accessToken) return;
    }
  };

  // event handler: 삭제 버튼 클릭 이벤트 처리 //
  const onDeleteClickHandler = () => {
    if (!tradeSequence || !accessToken) return;
    const isConfirm = window.confirm('정말로 삭제하시겠습니까?');
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

    const requestBody: PostLikeAlertRequestDto = { boardType: 'usedTrade', sequence: tradeSequence };
    console.log('like:', requestBody);
    postLikeAlertRequest(requestBody, accessToken);
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
    <div id="trade-view-wrapper">
      <div className="trade-view-main">
        <div className="object-container">
          <div className="object-images">
            <img src={profileImage} alt="프로필 이미지" className="trade-object-images" />
          </div>
          <div className="object-details">
            <div className="object-status-container">
              <div className="object-title">{title}</div>
              <div className="object-info">
                <div className="item-type">{itemTypeTagInKorean}</div>
                <div className="info-container">
                  <div className="like-count">
                    <img src={likeCountIcon} alt="Like" className="icon" /> {likeCount}
                  </div>
                  <div className="view-count">
                    <img src={viewsIcon} alt="View" className="icon" /> {views}
                  </div>
                  <div className="write-date">
                    <img src={timeIcon} alt="Time" className="icon" /> {elapsedTime}
                  </div>
                </div>
              </div>
              <div className="price">{price.toLocaleString()}원</div>
            </div>
            <div className="item-status">
              상품상태
              <div className="item-status-tag">{itemStatusTagInKorean}</div>
            </div>
            <div className="object-content">{content}</div>
            <div className={likedClass} onClick={onLikeClickHandler}>
              <img src={isLiked ? likeClickIcon : likeIcon} alt="Like" style={{ width: '25px', height: '25px' }} />
              <span>{likeCount}</span>
            </div>
          </div>
        </div>
        <div className="user-info-container">
          <div className="user">
            <img src={profileImage} alt="프로필 이미지" className="trade-profile-image" />
            <div className="writer-name">{writerNickname}</div>
          </div>
          <div className="location-box">
            <div className="location-header">
              <img src={locationIcon} alt="위치 아이콘" className="icon" />
              <span>직거래지역</span>
            </div>
            <div className="trade-location">
              {location} {detailLocation}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
