import React from 'react';
import "./BoardView.css";

// component: 게시판 게시글 상세보기 컴포넌트 //
export default function BoardView() {

  // component: 게시판 게시글 상세보기 컴포넌트 렌더링 //
  return (
    <div id='board-view-wrapper'>
      <div className='back-button'>글 목록 버튼</div>

      <div className='bulletin-info-container'>
        <div className='top-bar'>
          <div className='title'>제목</div>
          <div className='category'>게임</div>
        </div>
        <div className='bottom-bar'>
          <div className='default-user-image'></div>
          <div className='user-info-wrapper'>
            <div className='userName'>익명</div>
            <div className='date'>2025-04-08 15:41</div>
          </div>
          <div className='stats'>
            <div className='like-count'>🧡 11</div>
            <div className='view-count'>👁‍🗨 111</div>
          </div>
        </div>
      </div>

      <div className='bulletin-content-container'>
      <div className='content-top-bar'>
        <div
          className='bulletin-content'
          dangerouslySetInnerHTML={{ __html: "<p>글 내용입니다</p><img src='이미지주소' />" }}
        />
      </div>
        <div className='content-bottom-bar'>
          <div className='like-button'>🧡</div>
          <div className='comment-button'>📄</div>
        </div>
      </div>

      <div className='bulletin-comment-container'>
        <div className='comment-write'>
          <div className='comment-write-content'>댓글 내용</div>
          <div className='comment-write-button'>댓글 작성 버튼</div>
        </div>

        <div className='comment'>
          <div className='default-user-image'></div>
          <div className='userName'>익명</div>
          <div className='date'>2025-04-08 15:41</div>
          <div className='comment-content'>댓글 내용</div>
        </div>
      </div>
    </div>
  )
}
