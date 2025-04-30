import React, { ChangeEvent, useEffect, useState } from "react";
import "./BoardView.css";
import Comment from '../../../../types/interfaces/comment.interface';
import { useNavigate, useParams } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import useSignInUserStore from '../../../../stores/sign-in-user.store';
import { ACCESS_TOKEN, BOARD_ABSOLUTE_PATH, BOARD_UPDATE_ABSOLUTE_PATH } from '../../../../constants';
import { GetBoardCommentResponseDto, GetBoardResponseDto } from '../../../../apis/dto/response/board';
import ResponseDto from '../../../../apis/dto/response/response.dto';
import { deleteBoardRequest, getBoardCommentRequest, getBoardRequest, postBoardCommentRequest, putBoardLikeRequest } from '../../../../apis';
import { PostBoardCommentRequestDto } from '../../../../apis/dto/request/board';
import likeClickIcon from '../../../../assets/images/likeClick.png';
import likeIcon from '../../../../assets/images/like.png';
import commentIcon from '../../../../assets/images/comment.png'
import viewsIcon from '../../../../assets/images/views.png';

// interface: 댓글 컴포넌트 속성 //
interface CommentItemProps {
  commentItem: Comment;
}

// component: 댓글 컴포넌트 //
function CommentItem({ commentItem }: CommentItemProps) {
  const { anonymizedWriterId, commentWriteDate, comment } = commentItem;

  // render: 댓글 컴포넌트 렌더링 //
  return (
    <div className='comment-box'>
      <div className='title-box'>
        <div className="comment-default-user-image"></div>
        <div className='user-name'>{anonymizedWriterId}</div>
        <div className='divider'></div>
        <div className='write-date'>{commentWriteDate}</div>
      </div>
      <div className="comment">{comment}</div>
    </div>
  );
}


// component: 게시판 게시글 상세보기 컴포넌트 //
export default function BoardView() {

  // state: 경로 변수 상태 //
  const { boardSequence } = useParams();

  // state: cookie 상태 //
  const [cookies] = useCookies();

  // state: 로그인 사용자 아이디 상태 //
  const { userId } = useSignInUserStore();
  console.log("username: ", userId);

  // userId 값 확인
  console.log("User ID:", userId);

  // state: 게시글 내용 상태 //
  const [writerId, setWriterId] = useState<string>('');
  const [writeDate, setWriteDate] = useState<string>('');
  const [title, setTitle] = useState<string>('');
  const [content, setContent] = useState<string>('');
  const [boardTag, setBoardTag] = useState<string>('');
  const [views, setViews] = useState<number>(0);
  const [likeCount, setLikeCount] = useState<number>(0);

  // state: 댓글 상태 //
  const [comment, setComment] = useState<string>("");

  // state: 좋아요 여부 //
  const [liked, setLiked] = useState<boolean>(false);

  // state: 댓글 리스트 상태 //
  const [comments, setComments] = useState<Comment[]>([]);

  // state: 댓글창 보이기 상태 //
  const [showCommentInput, setShowCommentInput] = useState<boolean>(false);

  // state: 이미지 목록 상태 //
  const [images, setImages] = useState<string[]>([]);

  // variable: access token //
  const accessToken = cookies[ACCESS_TOKEN];

  // variable: 좋아요 여부 //
  const isLiked = liked;
  // variable: 좋아요 클래스 //
  const likedClass = isLiked ? 'icon likes-click' : 'icon likes';

  // variable: 댓글 작성 가능 여부 //
  const isActive = comment !== ""
  // variable: 댓글 작성 버튼 클래스 //
  const commentButtonClass = isActive ? "button middle primary" : "button middle disable";

  // function: 네비게이터 함수 //
  const navigator = useNavigate();

  // function: get board response 처리 함수 //
  const getBoardResponse = (responseBody: GetBoardResponseDto | ResponseDto | null,) => {
  
    const message =
      !responseBody ? '서버에 문제가 있습니다.' :
      responseBody.code === 'DBE' ? '서버에 문제가 있습니다.' :
      responseBody.code === 'AF' ? '인증에 실패했습니다.' :
      responseBody.code === 'NB' ? '존재하지 않는 게시글입니다.' : '';

    const isSuccess = responseBody !== null && responseBody.code === "SU";

    if (!isSuccess) {
      alert(message);
      navigator(BOARD_ABSOLUTE_PATH);
      return;
    }

    const { title, content, creationDate, views, tag, likeCount, writerId, imageUrls } = responseBody as GetBoardResponseDto;

    console.log("Writer ID:", writerId);
    setTitle(title);
    setContent(content);
    setWriterId(writerId);
    setWriteDate(creationDate);
    setViews(views);
    setBoardTag(tag);
    setLikeCount(likeCount);
    console.log(images);
    const uniqueImages = Array.from(new Set(imageUrls));
    setImages(uniqueImages);
  };

  // function: get comment response 처리 함수 //
  const getBoardCommentResponse = (responseBody: GetBoardCommentResponseDto | ResponseDto | null) => {
    const message =
      !responseBody ? '서버에 문제가 있습니다.' :
      responseBody.code === 'DBE' ? '서버에 문제가 있습니다.' :
      responseBody.code === 'AF' ? '인증에 실패했습니다.' : '';
  
    const isSuccess = responseBody !== null && responseBody.code === 'SU';
    if (!isSuccess) {
      alert(message);
      return;
    }
  
    const { comments } = responseBody as GetBoardCommentResponseDto;
  
    const anonymousCountMap: { [userId: string]: string } = {};
    let anonymousIndex = 1;
  
    const anonymizedComments = comments.map(comment => {
      const commentWriterId = comment.commentWriterId;
  
      let anonymizedWriterId = '';
  
      if (commentWriterId === writerId) {
        anonymizedWriterId = '익명(글쓴이)';
        
      } else {
        if (!anonymousCountMap[commentWriterId]) {
          anonymousCountMap[commentWriterId] = `익명${anonymousIndex}`;
          anonymousIndex++;
        }
        anonymizedWriterId = anonymousCountMap[commentWriterId];
      }
  
      return { ...comment, anonymizedWriterId };
    });
  
    setComments(anonymizedComments);
  };
  
  // function: delete board response 처리 함수 //
  const deleteBoardResponse = (responseBody: ResponseDto | null) => {
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

    alert("삭제에 성공했습니다.");
    navigator(BOARD_ABSOLUTE_PATH);
  };

  // function: put likes response 처리 함수 //
  const putLikeResponse = (responseBody: ResponseDto | null) => {
    const message =
      !responseBody ? '서버에 문제가 있습니다.' :
      responseBody.code === 'DBE' ? '서버에 문제가 있습니다.' :
      responseBody.code === 'AF' ? '인증에 실패했습니다.' : '';
    
    const isSuccess = responseBody !== null && responseBody.code === 'SU';
    if (!isSuccess) {
      alert(message);
      return;
    }

    if (responseBody && responseBody.data) {
      setLikeCount(responseBody.data.likeCount);
      setLiked(responseBody.data.liked);

      if (!boardSequence || !accessToken) return;
    }
  };

  // function: post comment response 처리 함수 //
  const postCommentResponse = (responseBody: ResponseDto | null) => {
    const message =
      !responseBody ? '서버에 문제가 있습니다.' :
      responseBody.code === 'DBE' ? '서버에 문제가 있습니다.' :
      responseBody.code === 'AF' ? '인증에 실패했습니다.' : '';

    const isSuccess = responseBody !== null && responseBody.code === 'SU';
    if (!isSuccess) {
      alert(message);
      return;
    }

    setComment("");
    if (!boardSequence || !accessToken) return;
    getBoardCommentRequest(boardSequence, accessToken).then(getBoardCommentResponse);
  };

  // event handler: 댓글 변경 이벤트 처리 //
  const onCommentChangeHandler = (event: ChangeEvent<HTMLTextAreaElement>) => {
    const { value } = event.target;
    setComment(value);
  };

  // event handler: 삭제 버튼 클릭 이벤트 처리 //
  const onDeleteClickHandler = () => {
    if (!boardSequence || !accessToken) return;
    const isConfirm = window.confirm("정말로 삭제하시겠습니까?");
    if (!isConfirm) return;

    deleteBoardRequest(boardSequence, accessToken).then(deleteBoardResponse);
  };

  // event handler: 수정 버튼 클릭 이벤트 처리 //
  const onUpdateClickHandler = () => {
    if (!boardSequence) return;
    navigator(BOARD_UPDATE_ABSOLUTE_PATH(boardSequence));
  };

  // event handler: 댓글 아이콘 클릭 이벤트 처리 //
  const onCommentIconClickHandler = () => {
    if (accessToken) {
      setShowCommentInput(prev => !prev);
    } else {
      alert('댓글을 작성하려면 로그인해야 합니다.');
    }
  };

  // event handler: 좋아요 버튼 클릭 이벤트 처리 //
  const onLikeClickHandler = () => {
    if (!boardSequence || !accessToken) return;
    putBoardLikeRequest(boardSequence, accessToken).then(putLikeResponse);
    
  };

  // event handler: 댓글 작성 클릭 이벤트 처리 //
  const onPostCommentClickHandler = () => {
    if (!accessToken || !boardSequence || !comment.trim()) return;

    const requestBody: PostBoardCommentRequestDto = {
      boardComment: comment,
    };
    postBoardCommentRequest(requestBody, boardSequence, accessToken).then(postCommentResponse);
  };

  // effect: 컴포넌트 로드시 실행할 함수 //
  useEffect(() => {
    if (!boardSequence) {
      navigator(BOARD_ABSOLUTE_PATH);
      return;
    }
    getBoardRequest(boardSequence, accessToken).then(getBoardResponse);
    getBoardCommentRequest(boardSequence, accessToken).then(getBoardCommentResponse);
  }, []);

  // component: 게시판 게시글 상세보기 컴포넌트 렌더링 //
  return (
    <div id='board-view-wrapper'>
      <div className="button-container">
        <div className='back-button' onClick={() => navigator(BOARD_ABSOLUTE_PATH)}>글 목록</div>
        {userId === writerId &&
        <div className="button-group">
          <div className="patch-button" onClick={onUpdateClickHandler}>수정하기</div>
          <div className="delete-button" onClick={onDeleteClickHandler}>삭제하기</div>
        </div>
        }
      </div>
  
      <div className='bulletin-info-container'>
        <div className='top-bar'>
          <div className='title'>{title}</div>
          <div className='category'>{boardTag}</div>
        </div>
        <div className="bottom-bar">
          <div className="default-user-image"></div>
          <div className="user-info-wrapper">
            <div className="userName">익명</div>
            <div className="date">{writeDate}</div>
          </div>
          <div className='stats'>
            <div className='like-count'>
              <img src={likeClickIcon} alt="Like" className="icon" /> {likeCount}
            </div>
            <div className='view-count'>
              <img src={viewsIcon} alt="Views" className="icon" /> {views}
            </div>
          </div>
        </div>
      </div>

      <div className="bulletin-content-container">
        <div className="content-top-bar">
          <div className="bulletin-content" dangerouslySetInnerHTML={{ __html: content }} />
        </div>

        <div className='content-bottom-bar'>
          <div className="like-button">
            <img src={isLiked ? likeClickIcon : likeIcon} alt="Like" className={likedClass} onClick={onLikeClickHandler} />{likeCount}
          </div>
          <div className='comment-button' onClick={onCommentIconClickHandler}>
            <img src={commentIcon} alt="Comment" className="icon" />
          </div>
        </div>
      </div>

      {showCommentInput && accessToken && (
      <div className='comment-write'>
        <div className="comment-write-container">
          <textarea className='comment-write-content' placeholder='댓글을 입력하세요.' value={comment} onChange={onCommentChangeHandler} />
          <div className={commentButtonClass} onClick={onPostCommentClickHandler}>댓글 작성</div>
        </div>
      </div>
      )}
  
      <div className='comments-list'>
        {comments.map((commentItem, index) => (
          <CommentItem key={index} commentItem={commentItem} />
        ))}
      </div>
    </div>
  );
}