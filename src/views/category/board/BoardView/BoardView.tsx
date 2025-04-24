import React, { ChangeEvent, useEffect, useState } from "react";
import "./BoardView.css";
import Comment from "../../../../types/interfaces/comment.interface";
import { useNavigate, useParams } from "react-router-dom";
import { useCookies } from "react-cookie";
import useSignInUserStore from "../../../../stores/sign-in-user.store";
import {
  ACCESS_TOKEN,
  BOARD_ABSOLUTE_PATH,
  BOARD_UPDATE_ABSOLUTE_PATH,
} from "../../../../constants";
import {
  GetBoardCommentResponseDto,
  GetBoardResponseDto,
} from "../../../../apis/dto/response/board";
import ResponseDto from "../../../../apis/dto/response/response.dto";
import {
  deleteBoardRequest,
  getBoardCommentRequest,
  getBoardRequest,
  postBoardCommentRequest,
} from "../../../../apis";
import { PostBoardCommentRequestDto } from "../../../../apis/dto/request/board";

// interface: 댓글 컴포넌트 속성 //
interface CommentItemProps {
  commentItem: Comment;
}
// component: 댓글 컴포넌트 //
function CommentItem({ commentItem }: CommentItemProps) {
  const { commentWriterId, commentWriteDate, comment } = commentItem;

  // render: 댓글 컴포넌트 렌더링 //
  return (
    <div className="comment-box">
      <div className="title-box">
        <div className="title">{commentWriterId}</div>
        <div className="divider"></div>
        <div className="write-date">{commentWriteDate} 전</div>
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

  // state: 게시글 내용 상태 //
  const [writerId, setWriterId] = useState<string>("");
  const [writeDate, setWriteDate] = useState<string>("");
  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<string>("");

  // state: 댓글 상태 //
  const [comment, setComment] = useState<string>("");

  // state: 댓글 리스트 상태 //
  const [comments, setComments] = useState<Comment[]>([]);

  // variable: access token //
  const accessToken = cookies[ACCESS_TOKEN];

  // function: 네비게이터 함수 //
  const navigator = useNavigate();

  // function: get board response 처리 함수 //
  const getBoardResponse = (
    responseBody: GetBoardResponseDto | ResponseDto | null,
  ) => {
    const message = !responseBody
      ? "서버에 문제가 있습니다."
      : responseBody.code === "DBE"
        ? "서버에 문제가 있습니다."
        : responseBody.code === "AF"
          ? "인증에 실패했습니다."
          : responseBody.code === "ND"
            ? "존재하지 않는 일기입니다."
            : "";

    const isSuccess = responseBody !== null && responseBody.code === "SU";

    if (!isSuccess) {
      alert(message);
      navigator(BOARD_ABSOLUTE_PATH);
      return;
    }
  };

  // function: get comment response 처리 함수 //
  const getBoardCommentResponse = (
    responseBody: GetBoardCommentResponseDto | ResponseDto | null,
  ) => {
    const message = !responseBody
      ? "서버에 문제가 있습니다."
      : responseBody.code === "DBE"
        ? "서버에 문제가 있습니다."
        : responseBody.code === "AF"
          ? "인증에 실패했습니다."
          : "";

    const isSuccess = responseBody !== null && responseBody.code === "SU";
    if (!isSuccess) {
      alert(message);
      return;
    }

    const { comments } = responseBody as GetBoardCommentResponseDto;
    setComments(comments);
  };

  // function: delete board response 처리 함수 //
  const deleteBoardResponse = (responseBody: ResponseDto | null) => {
    const message = !responseBody
      ? "서버에 문제가 있습니다."
      : responseBody.code === "DBE"
        ? "서버에 문제가 있습니다."
        : responseBody.code === "AF"
          ? "인증에 실패했습니다."
          : responseBody.code === "ND"
            ? "존재하지 않는 일기입니다."
            : responseBody.code === "NP"
              ? "권한이 없습니다."
              : "";

    const isSuccess = responseBody !== null && responseBody.code === "SU";
    if (!isSuccess) {
      alert(message);
      return;
    }

    alert("삭제에 성공했습니다.");
    navigator(BOARD_ABSOLUTE_PATH);
  };

  // function: post comment response 처리 함수 //
  const postCommentResponse = (responseBody: ResponseDto | null) => {
    const message = !responseBody
      ? "서버에 문제가 있습니다."
      : responseBody.code === "DBE"
        ? "서버에 문제가 있습니다."
        : responseBody.code === "AF"
          ? "인증에 실패했습니다."
          : "";

    const isSuccess = responseBody !== null && responseBody.code === "SU";
    if (!isSuccess) {
      alert(message);
      return;
    }

    setComment("");
    if (!boardSequence || !accessToken) return;
    getBoardCommentRequest(boardSequence, accessToken).then(
      getBoardCommentResponse,
    );
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

  // event handler: 댓글 작성 클릭 이벤트 처리 //
  const onPostCommentClickHandler = () => {
    if (!accessToken || !boardSequence || !comment.trim()) return;

    const requestBody: PostBoardCommentRequestDto = {
      comment,
    };
    postBoardCommentRequest(requestBody, boardSequence, accessToken).then(
      postCommentResponse,
    );
  };

  // effect: 컴포넌트 로드시 실행할 함수 //
  useEffect(() => {
    if (!accessToken) return;
    if (!boardSequence) {
      navigator(BOARD_ABSOLUTE_PATH);
      return;
    }
    getBoardRequest(boardSequence, accessToken).then(getBoardResponse);
    // getEmpathyRequest(boardSequence, accessToken).then(getEmpathyResponse);
    getBoardCommentRequest(boardSequence, accessToken).then(
      getBoardCommentResponse,
    );
  }, []);

  // component: 게시판 게시글 상세보기 컴포넌트 렌더링 //
  return (
    <div id="board-view-wrapper">
      <div
        className="back-button"
        onClick={() => navigator(BOARD_ABSOLUTE_PATH)}
      >
        글 목록
      </div>

      <div className="bulletin-info-container">
        <div className="top-bar">
          <div className="title">{title}</div>
          <div className="category">게시판</div>{" "}
          {/* 필요시 category도 상태로 관리 가능 */}
        </div>
        <div className="bottom-bar">
          <div className="default-user-image"></div>
          <div className="user-info-wrapper">
            <div className="userName">{writerId}</div>
            <div className="date">{writeDate}</div>
          </div>
          <div className="stats">
            <div className="like-count">🧡 좋아요</div>{" "}
            {/* 추후 좋아요 수 상태 연결 */}
            <div className="view-count">👁‍🗨 조회수</div>{" "}
            {/* 추후 조회수 상태 연결 */}
          </div>
        </div>
      </div>

      <div className="bulletin-content-container">
        <div className="content-top-bar">
          <div
            className="bulletin-content"
            dangerouslySetInnerHTML={{ __html: content }}
          />
        </div>
        <div className="content-bottom-bar">
          <div className="like-button">🧡</div>
          <div className="comment-button">📄</div>
          {userId === writerId && (
            <div className="button-group">
              <button onClick={onUpdateClickHandler}>수정</button>
              <button onClick={onDeleteClickHandler}>삭제</button>
            </div>
          )}
        </div>
      </div>

      <div className="bulletin-comment-container">
        <div className="comment-write">
          <textarea
            className="comment-write-content"
            placeholder="댓글을 입력하세요."
            value={comment}
            onChange={onCommentChangeHandler}
          />
          <button
            className="comment-write-button"
            onClick={onPostCommentClickHandler}
          >
            댓글 작성
          </button>
        </div>

        {comments.map((commentItem, index) => (
          <CommentItem key={index} commentItem={commentItem} />
        ))}
      </div>
    </div>
  );
}
