// src/pages/category/notice/Notice.tsx
import './Notice.css'
import { useState } from 'react'

const Notice = () => {
  const [activeTab, setActiveTab] = useState<'설명' | '공지사항'>('설명')

  return (
    <div className="notice-wrapper">
      <div className="notice-container">
        {/* 🔹 탭 메뉴 */}
        <div className="notice-tabs">
          <h2
            className={`section-title ${activeTab === '설명' ? 'active' : ''}`}
            onClick={() => setActiveTab('설명')}
          >
            설명
          </h2>
          <h2
            className={`section-title ${activeTab === '공지사항' ? 'active' : ''}`}
            onClick={() => setActiveTab('공지사항')}
          >
            공지사항
          </h2>
        </div>

        {/* 설명 영역 */}
        {activeTab === '설명' && (
          <div className="notice-content post-card">
            <p>이곳은 사이트 이용 방법이나 주요 안내사항을 알려주는 공간입니다.</p>
            <ul>
              <li>회원가입은 이메일 또는 SNS 계정으로 가능합니다.</li>
              <li>게시판은 자유롭게 의견을 공유하는 공간입니다.</li>
              <li>게시판은 익명으로 운영되며, 표현의 자유는 존중하지만 타인의 인격이나 권리를 침해하는 행위는 금지됩니다. </li>
              <li>게시판은 익명으로 자유롭게 의견을 나누는 공간입니다. 다만, 타인을 비방하거나 모욕하는 글은 제재 대상이 될 수 있습니다.</li>
              <li>일상 카테고리는 여러분의 하루를 기록하고 나누는 공간입니다. 사진 한 장, 짧은 글 한 줄도 가능합니다. </li>
              <li>중고거래 시 안전에 유의해주세요.</li>
            </ul>
          </div>
        )}

        {/* 공지사항 영역 */}
        {activeTab === '공지사항' && (
          <section className="notice-list">
            {[1, 2, 3, 4].map((item) => (
              <div className="post-card" key={item}>
                <div className="post-title">[공지] 서비스 점검 안내 {item}</div>
                <div className="post-info">
                  <span>운영자</span>
                  <span>📢</span>
                  <span>2025.04.07</span>
                </div>
              </div>
            ))}
          </section>
        )}
      </div>
    </div>
  )
}

export default Notice