import './MessageRoom.css';
import defaultProfile from '../../assets/images/default-profile.png';
import { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import useChatSocket from '../../hooks/useChatSocket';
import axios from 'axios';
import { getUserInfoByIdRequest, getUserProfileImageByIdRequest, getUserNicknameByIdRequest } from '../../apis';

// 메시지 데이터 타입 정의
interface Message {
  senderId: string;
  receiverId: string;
  content: string;
  imageUrl?: string;
  type: 'TEXT' | 'IMAGE';
  timestamp: string;
}

const MessageRoom = () => {
  // URL 파라미터에서 userId, partnerId 추출
  const { userId, partnerId } = useParams();
  // 쿠키에서 accessToken 추출
  const [cookies] = useCookies(['accessToken']);
  const accessToken = cookies['accessToken'];

  // 메시지 목록 상태
  const [messages, setMessages] = useState<Message[]>([]);
  // 입력창 값 상태
  const [input, setInput] = useState('');
  // 상대방 프로필 이미지 상태
  const [partnerProfileImage, setPartnerProfileImage] = useState<string>(defaultProfile);
  // 상대방 닉네임 상태
  const [partnerNickname, setPartnerNickname] = useState('');
  // 삭제 옵션 표시할 메시지 인덱스 상태
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  // 채팅박스 DOM 참조 (스크롤 제어용)
  const chatBoxRef = useRef<HTMLDivElement>(null);

  // 메시지 옵션(삭제 등) 토글 함수
  const toggleOptions = (index: number) => {
    setActiveIndex((prev) => (prev === index ? null : index));
  };

  // 메시지 삭제 처리 함수
  const handleDelete = (index: number) => {
    setMessages((prev) => prev.filter((_, i) => i !== index));
    setActiveIndex(null); // 옵션 닫기
  };

  // WebSocket 연결 및 메시지 수신 처리
  const { sendMessage } = useChatSocket(userId!, (msg: Message) => {
    setMessages((prev) => [...prev, msg]); // 새 메시지 추가
  });

  // 컴포넌트 마운트 시 초기 메시지 로딩 및 상대방 프로필 조회
  useEffect(() => {
    if (!userId || !partnerId || !accessToken) return;

    // 과거 메시지 API 호출
    axios.get(`/api/message/${userId}/${partnerId}`, {
      headers: { Authorization: `Bearer ${accessToken}` }
    }).then((res) => {
      setMessages(res.data); // 메시지 상태 세팅
    }).catch((err) => {
      console.error('메시지 불러오기 실패:', err);
    });

    // 상대방 프로필 이미지 요청
    getUserProfileImageByIdRequest(partnerId!, accessToken)
      .then((url) => {
        setPartnerProfileImage(url || defaultProfile);
      })
      .catch(() => {
        setPartnerProfileImage(defaultProfile);
      });

    // 상대방 닉네임 요청
    getUserNicknameByIdRequest(partnerId!, accessToken)
      .then((nickname) => setPartnerNickname(nickname))
      .catch(() => setPartnerNickname('알 수 없음'));
  }, [userId, partnerId, accessToken]);

  // 외부 클릭 시 메시지 옵션 메뉴 닫기 처리
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('.message-options')) {
        setActiveIndex(null);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  // 메시지룸 접속 시 콘솔 출력 (디버깅용)
  useEffect(() => {
    console.log('[📡 메시지룸 접속]', userId, partnerId);
  }, []);

  // 메시지 목록 변경 시 자동 스크롤 처리
  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  }, [messages]);

  // 메시지 전송 처리 함수
  const handleSend = () => {
    if (!input.trim()) return; // 빈 메시지 전송 방지

    const newMsg: Message = {
      senderId: userId!,
      receiverId: partnerId!,
      content: input,
      imageUrl: '',
      type: 'TEXT',
      timestamp: new Date().toISOString()
    };

    setMessages((prev) => [...prev, newMsg]); // 클라이언트에서 즉시 메시지 추가
    sendMessage(newMsg); // WebSocket으로 서버 전송
    setInput(''); // 입력창 초기화
  };

  // 입력창에서 Enter 키 입력 시 메시지 전송
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  return (
    <div className="message-room">
      {/* 헤더 - 상대 프로필 이미지 및 닉네임 표시 */}
      <div className="header">
        <img
          src={partnerProfileImage}
          alt="상대 프로필"
          width={40}
          height={40}
        />
        <span>{partnerNickname}</span>
      </div>

      {/* 채팅 메시지 목록 영역 */}
      <div className="chat-box" ref={chatBoxRef}>
        {messages.map((msg, i) => {
          const isMine = msg.senderId === userId;

          return (
            <div key={i} className={`message-container ${isMine ? 'mine' : 'theirs'}`}>
              {!isMine && (
                <img
                  className="profile-icon"
                  src={partnerProfileImage}
                  alt="상대 프로필"
                />
              )}
              <div className={isMine ? 'my-message' : 'their-message'}>
                {msg.type === 'TEXT' && <p>{msg.content}</p>}
                {msg.type === 'IMAGE' && <img src={msg.imageUrl} alt="image" />}
                <div className="message-timestamp">
                  {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
                <div className="message-options">
                  <span className="dots" onClick={() => toggleOptions(i)}>⋯</span>
                  {activeIndex === i && (
                    <div className="dropdown-menu message-delete-menu">
                      <button onClick={() => handleDelete(i)}>삭제</button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* 메시지 입력창 및 전송 버튼 */}
      <div className="input-area">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown} 
          placeholder="메시지를 입력하세요"
        />
        <button onClick={handleSend}>전송</button>
      </div>
    </div>
  );
};

export default MessageRoom;
