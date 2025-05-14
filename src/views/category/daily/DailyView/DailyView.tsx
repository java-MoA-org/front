import React, { ChangeEvent, useEffect, useState } from 'react';
import './DailyView.css';
import { useCookies } from 'react-cookie';
import { useNavigate, useParams } from 'react-router-dom';
import useSignInUserStore from '../../../../stores/sign-in-user.store';
import { GetDailyCommentResponseDto, GetDailyResponseDto, GetLikedUserListResponseDto } from '../../../../apis/dto/response/daily';
import ResponseDto from '../../../../apis/dto/response/response.dto';
import { ACCESS_TOKEN, DAILY_ABSOLUTE_PATH, DAILY_UPDATE_ABSOLUTE_PATH, MY_USER_ABSOLUTE_PATH } from '../../../../constants';
import {
  deleteDailyRequest,
  getDailyCommentRequest,
  getDailyLikesRequest,
  getDailyRequest,
  postCommentAlertRequest,
  postDailyCommentRequest,
  postLikeAlertRequest,
  putDailyLikeRequest,
} from '../../../../apis';
import { PostDailyCommentRequestDto } from '../../../../apis/dto/request/daily';
import Comment from '../../../../types/interfaces/comment.interface';
import PostCommentAlertRequestDto from '../../../../apis/dto/request/alert/post-comment-alert.request.dto';
import PostLikeAlertRequestDto from '../../../../apis/dto/request/alert/post-like-alert.request.dto';
import likeClickIcon from '../../../../assets/images/likeClick.png';
import likeIcon from '../../../../assets/images/like.png';
import commentIcon from '../../../../assets/images/comment.png';
import viewsIcon from '../../../../assets/images/views.png';
import DailyLikesModal from '../../../../components/DailyLIkeUserLIst';
import { LikedUserDto } from '../../../../apis/dto/response/daily/get-liked-user-list.resopnse.dto';

// interface: 댓글 컴포넌트 속성 //
interface CommentItemProps {
  commentItem: Comment;
}

// component: 댓글 컴포넌트 //
function CommentItem({ commentItem }: CommentItemProps) {

  const { userId } = useSignInUserStore();

  const { writerNickname, commentWriteDate, comment, profileImage } = commentItem;

  // function: 네비게이터 함수 //
  const navigator = useNavigate();

  // event handler: 프로필 클릭 이벤트 처리 //
  const onProfileClickHandler = () => {
    if(!userId) return;
    navigator(MY_USER_ABSOLUTE_PATH(writerNickname));
  }

  // render: 댓글 컴포넌트 렌더링 //
  return (
    <div className="comment-box">
      <div className="title-box">
        <img src={profileImage} alt="프로필 이미지" className="daily-comment-profile-image" onClick={onProfileClickHandler} />
        <div className="user-name" onClick={onProfileClickHandler}>{writerNickname}</div>
        <div className="divider"></div>
        <div className="write-date">{commentWriteDate}</div>
      </div>
      <div className="comment">{comment}</div>
    </div>
  );
}

// component: 일상 게시판 게시글 상세보기 컴포넌트 //
export default function DailyView() {
  // state: cookie 상태 //
  const [cookies] = useCookies();

  // state: 경로 변수 상태 //
  const { dailySequence } = useParams();

  // state: 로그인 사용자 닉네임 상태 //
  const { userNickname, userId } = useSignInUserStore();

  // state: 일상 게시글 내용 상태 //
  const [writerNickname, setWriterNickname] = useState<string>('');
  const [writeDate, setWriteDate] = useState<string>('');
  const [title, setTitle] = useState<string>('');
  const [content, setContent] = useState<string>('');
  const [views, setViews] = useState<number>(0);
  const [likeCount, setLikeCount] = useState<number>(0);
  const [profileImage, setProfileImage] = useState<string>('');

  // state: 댓글 상태 //
  const [comment, setComment] = useState<string>('');

  // state: 좋아요 여부 //
  const [liked, setLiked] = useState<boolean>(false);

  // state: 댓글 리스트 상태 //
  const [comments, setComments] = useState<Comment[]>([]);

  // state: 댓글창 보이기 상태 //
  const [showCommentInput, setShowCommentInput] = useState<boolean>(false);

  // state: 이미지 목록 상태 //
  const [images, setImages] = useState<string[]>([]);

  // state: 좋아요 유저 목록 상태 //
  const [likedUsers, setLikedUsers] = useState<any[]>([]);  
  const [showLikesModal ,setShowLikesModal] = useState<boolean>(false);  

  // variable: access token //
  const accessToken = cookies[ACCESS_TOKEN];

  // variable: 좋아요 클래스 //
  const likedClass = liked ? 'icon likes-click' : 'icon likes';

  // variable: 댓글 작성 가능 여부 //
  const isActive = comment !== '';
  // variable: 댓글 작성 버튼 클래스 //
  const commentButtonClass = isActive ? 'button middle primary' : 'button middle disable';

  // function: 네비게이터 함수 //
  const navigator = useNavigate();

  // function: get daily response 처리 함수 //
  const getDailyResponse = (responseBody: GetDailyResponseDto | ResponseDto | null) => {
    const message = !responseBody
      ? '서버에 문제가 있습니다.'
      : responseBody.code === 'DBE'
      ? '서버에 문제가 있습니다.'
      : responseBody.code === 'AF'
      ? '인증에 실패했습니다.'
      : responseBody.code === 'ND'
      ? '존재하지 않는 게시글입니다.'
      : '';

    const isSuccess = responseBody !== null && responseBody.code === 'SU';

    if (!isSuccess) {
      alert(message);
      navigator(DAILY_ABSOLUTE_PATH);
      return;
    }

    const { title, content, creationDate, views, likeCount, writerNickname, imageUrls, profileImage, liked } = responseBody as GetDailyResponseDto;

    setTitle(title);
    setContent(content);
    setWriterNickname(writerNickname);
    setWriteDate(creationDate);
    setViews(views);
    setLikeCount(likeCount);
    setProfileImage(profileImage);
    const uniqueImages = Array.from(new Set(imageUrls));
    setImages(uniqueImages);
    setLiked(liked);
  };

  // function: get comment response 처리 함수 //
  const getDailyCommentResponse = (responseBody: GetDailyCommentResponseDto | ResponseDto | null) => {
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

    const { comments } = responseBody as GetDailyCommentResponseDto;

    setComments(comments);
  };

  // function: delete daily response 처리 함수 //
  const deleteDailyResponse = (responseBody: ResponseDto | null) => {
    const message = !responseBody
      ? '서버에 문제가 있습니다.'
      : responseBody.code === 'DBE'
      ? '서버에 문제가 있습니다.'
      : responseBody.code === 'AF'
      ? '인증에 실패했습니다.'
      : responseBody.code === 'ND'
      ? '존재하지 않는 게시글입니다.'
      : responseBody.code === 'NP'
      ? '권한이 없습니다.'
      : '';

    const isSuccess = responseBody !== null && responseBody.code === 'SU';
    if (!isSuccess) {
      alert(message);
      return;
    }

    alert('삭제에 성공했습니다.');
    navigator(DAILY_ABSOLUTE_PATH);
  };

  // function: get likes response 처리 함수 //
  const getDailyLikesResponse = (responseBody: any) => {
    const message = !responseBody
      ? '서버에 문제가 있습니다.'
      : responseBody.code === 'DBE'
      ? '서버에 문제가 있습니다.'
      : responseBody.code === 'AF'
      ? '인증에 실패했습니다.'
      : responseBody.code === 'ND'
      ? '존재하지 않는 게시글입니다.'
      : '';
  
    const isSuccess = responseBody !== null && responseBody.code === 'SU';
    if (!isSuccess) {
      alert(message);
      return;
    }

    const { likedUserList } = responseBody as GetLikedUserListResponseDto;
    setLikedUsers(likedUserList);
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

      if (!dailySequence || !accessToken) return;
    }
  };

  // function: post comment response 처리 함수 //
  const postCommentResponse = (responseBody: ResponseDto | null) => {
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

    setComment('');
    if (!dailySequence || !accessToken) return;
    getDailyCommentRequest(dailySequence, accessToken).then(getDailyCommentResponse);
  };

  // event handler: 댓글 변경 이벤트 처리 //
  const onCommentChangeHandler = (event: ChangeEvent<HTMLTextAreaElement>) => {
    const { value } = event.target;
    setComment(value);
  };

  // event handler: 삭제 버튼 클릭 이벤트 처리 //
  const onDeleteClickHandler = () => {
    if (!dailySequence || !accessToken) return;
    const isConfirm = window.confirm('정말로 삭제하시겠습니까?');
    if (!isConfirm) return;

    deleteDailyRequest(dailySequence, accessToken).then(deleteDailyResponse);
  };

  // event handler: 수정 버튼 클릭 이벤트 처리 //
  const onUpdateClickHandler = () => {
    if (!dailySequence) return;
    navigator(DAILY_UPDATE_ABSOLUTE_PATH(dailySequence));
  };

  // event handler: 댓글 아이콘 클릭 이벤트 처리 //
  const onCommentIconClickHandler = () => {
    if (accessToken) {
      setShowCommentInput((prev) => !prev);
    } else {
      alert('댓글을 작성하려면 로그인해야 합니다.');
    }
  };

  const onLikesModalOpen = () => {
    setShowLikesModal(true);
  };

  const onLikesModalClose = () => {
    setShowLikesModal(false);
  };

  const renderLikesButtonText = () => {
    if (!likedUsers || likedUsers.length === 0) {
      return '';
    }
  
    if (likeCount === 0) {
      return "";
    }
  
    if (likeCount > 50) {
      const formattedCount = likeCount >= 10000
        ? `${(likeCount / 10000).toFixed(1)}만개`
        : `좋아요 ${likeCount}개`;
      return `좋아요 ${formattedCount}`;
    }
  
    if (!userNickname) {
      return '';
    }
  
    const isLikedByMe = likedUsers.some(user => user.userNickname === userNickname);
    const otherUsers = likedUsers.filter(user => user.userNickname !== userNickname);
    const firstOtherUser = otherUsers[0]?.userNickname;
  
    if (isLikedByMe) {
      if (otherUsers.length === 0) {
        return "회원님이 좋아합니다";
      } else if (otherUsers.length === 1) {
        return `회원님, ${firstOtherUser}님이 좋아합니다`;
      } else {
        return `회원님 외 ${otherUsers.length}명이 좋아합니다`;
      }
    }
  
    if (likeCount === 1) {
      return `${likedUsers[0].userNickname}님이 좋아합니다`;
    }
  
    return `${likedUsers[0].userNickname}님 외 ${likeCount - 1}명이 좋아합니다`;
  };
  
  

  // event handler: 좋아요 버튼 클릭 이벤트 처리 //
  const onLikeClickHandler = () => {
    if (!dailySequence || !accessToken) return;
    putDailyLikeRequest(dailySequence, accessToken).then(putLikeResponse);
    const requestBody: PostLikeAlertRequestDto = { boardType: 'daily', sequence: dailySequence };
    console.log('like:', requestBody);
    postLikeAlertRequest(requestBody, accessToken);
  };

  // event handler: 댓글 작성 클릭 이벤트 처리 //
  const onPostCommentClickHandler = () => {
    if (!accessToken || !dailySequence || !comment.trim()) return;

    const requestBody: PostDailyCommentRequestDto = {
      dailyComment: comment,
    };
    postDailyCommentRequest(requestBody, dailySequence, accessToken).then(postCommentResponse);
    // 알림 생성
    const requestBody2: PostCommentAlertRequestDto = { comment, boardType: 'daily', sequence: dailySequence };
    console.log(requestBody2);
    postCommentAlertRequest(requestBody2, accessToken);
  };

  // event handler: 프로필 클릭 이벤트 처리 //
  const onProfileClickHandler = () => {
    if(!userId) return;
    navigator(MY_USER_ABSOLUTE_PATH(writerNickname));
  }

  // effect: 컴포넌트 로드시 실행할 함수 //
  useEffect(() => {
    if (!dailySequence) {
      navigator(DAILY_ABSOLUTE_PATH);
      return;
    }
    getDailyRequest(dailySequence, accessToken).then(getDailyResponse);
    getDailyCommentRequest(dailySequence, accessToken).then(getDailyCommentResponse);
    getDailyLikesRequest(dailySequence, accessToken).then(getDailyLikesResponse);
  }, []);

  // render: 일상 게시판 게시글 상세보기 컴포넌트 렌더링 //
  return (
    <div id="daily-view-wrapper">
      <div className="button-container">
        <div className="back-button" onClick={() => navigator(DAILY_ABSOLUTE_PATH)}>
          글 목록
        </div>
        {userNickname === writerNickname && (
          <div className="button-group">
            <div className="patch-button" onClick={onUpdateClickHandler}>
              수정하기
            </div>
            <div className="delete-button" onClick={onDeleteClickHandler}>
              삭제하기
            </div>
          </div>
        )}
      </div>

      <div className="bulletin-info-container">
        <div className="top-bar">
          <div className="title">{title}</div>
        </div>
        <div className="bottom-bar">
          <div className="user-profile-image">
            <img src={profileImage} alt="프로필 이미지" className="daily-profile-image" onClick={onProfileClickHandler} />
          </div>
          <div className="user-info-wrapper">
            <div className="userName" onClick={onProfileClickHandler}>{writerNickname}</div>
            <div className="date">{writeDate}</div>
          </div>
          <div className="stats">
            <div className="like-count">
              <img src={likeClickIcon} alt="Like" className="icon" /> {likeCount}
            </div>
            <div className="view-count">
              <img src={viewsIcon} alt="Views" className="icon" /> {views}
            </div>
          </div>
        </div>
      </div>

      <div className="bulletin-content-container">
        <div className="content-top-bar">
          <div className="bulletin-content" dangerouslySetInnerHTML={{ __html: content }} />
        </div>

        <div className="content-bottom-bar">
          <div className="like-button">
            <img
              src={liked ? likeClickIcon : likeIcon}
              alt="Like"
              className={likedClass}
              onClick={onLikeClickHandler}
            />
          </div>
          <div className="comment-button" onClick={onCommentIconClickHandler}>
            <img src={commentIcon} alt="Comment" className="icon" />
          </div>
        </div>
      </div>
      <div className='like-user-list' onClick={onLikesModalOpen}>{renderLikesButtonText()}</div>
      <DailyLikesModal dailySequence={parseInt(dailySequence || '')} writerNickname={writerNickname} isOpen={showLikesModal} onClose={onLikesModalClose} />

      {showCommentInput && accessToken && (
        <div className="comment-write">
          <div className="comment-write-container">
            <textarea
              className="comment-write-content"
              placeholder="댓글을 입력하세요."
              value={comment}
              onChange={onCommentChangeHandler}
            />
            <div className={commentButtonClass} onClick={onPostCommentClickHandler}>
              댓글 작성
            </div>
          </div>
        </div>
      )}

      <div className="comments-list">
        {comments.map((commentItem, index) => (
          <CommentItem key={index} commentItem={commentItem} />
        ))}
      </div>
    </div>
  );
}
