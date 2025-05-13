import './MessageRoom.css';
import defaultProfile from '../../assets/images/default-profile.png';
import { useEffect, useState, useRef, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import useChatSocket from '../../hooks/useChatSocket';
import axios from 'axios';
import { getUserProfileImageByIdRequest, getUserNicknameByIdRequest } from '../../apis';

// interface: 메시지 데이터 타입 정의 - 각 메시지 객체의 구조 (id, 송신자/수신자, 내용, 타입, 타임스탬프 등)
interface Message {
  id: number;
  senderId: string;
  receiverId: string;
  content: string;
  imageUrl?: string;
  type: 'TEXT' | 'IMAGE' | 'DELETE' | 'READ';
  timestamp: string;
  isRead?: boolean;
  isDeleted?: boolean;
}

const MessageRoom = () => {
  // URL 파라미터에서 userId, partnerId 추출
  const { userId, partnerId } = useParams();
  // 쿠키에서 accessToken 추출
  const [cookies] = useCookies(['accessToken']);
  const accessToken = cookies['accessToken'];

  // state: 메시지 목록 상태 - 채팅방에 표시될 메시지들을 관리
  const [messages, setMessages] = useState<Message[]>([]);
  const [hasUnreadSent, setHasUnreadSent] = useState(false);
  // state: 입력창 값 상태
  const [input, setInput] = useState('');
  // state: 상대방 프로필 이미지 상태
  const [partnerProfileImage, setPartnerProfileImage] = useState<string>(defaultProfile);
  // state: 상대방 닉네임 상태
  const [partnerNickname, setPartnerNickname] = useState('');
  // state: 삭제 옵션 표시할 메시지 인덱스 상태
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  // state: 채팅박스 DOM 참조 (스크롤 제어용)
  const chatBoxRef = useRef<HTMLDivElement>(null);
  // state: 이미지 업로드 파일
  const [imageFile, setImageFile] = useState<File | null>(null);

  // 이미지 input ref
  const imageInputRef = useRef<HTMLInputElement>(null);

  // New state for image preview modal
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  // 이미지 업로드 버튼 클릭 시 input 트리거
  const handleImageButtonClick = () => {
    imageInputRef.current?.click();
  };

  // 이미지 파일 선택 시 처리
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
      setTimeout(() => {
        document.querySelector<HTMLInputElement>('input[type="text"]')?.focus();
      }, 0);
    }
  };

  // function: 메시지 옵션(삭제 등) 토글 함수
  const toggleOptions = (index: number) => {
    setActiveIndex((prev) => (prev === index ? null : index));
  };

  // 메시지 수신 처리 함수 (useCallback으로 메모이제이션)
  const onMessageReceived = useCallback((msg: Message) => {
    if (msg.type === 'DELETE') {
      setMessages((prev) =>
        prev.map((m) =>
          m.timestamp === msg.content
            ? {
                ...m,
                type: 'TEXT',
                content: '상대가 메시지를 삭제했습니다.',
                isDeleted: true,
              }
            : m
        )
      );
    } else if (msg.type === 'READ') {
      setMessages((prev) =>
        prev.map((m) =>
          m.senderId === partnerId && !m.isRead
            ? { ...m, isRead: true }
            : m
        )
      );
    } else {
      setMessages((prev) => [...prev, msg]);
    }
  }, [partnerId]);

  // socket: WebSocket 연결 및 메시지 수신 처리
  const { sendMessage } = useChatSocket(userId!, onMessageReceived);

  // effect: 컴포넌트 마운트 시 초기 메시지 로딩 및 상대방 프로필 조회
  useEffect(() => {
    if (!userId || !partnerId || !accessToken) return;

    // 과거 메시지 API 호출
    axios
      .get(`/api/message/${userId}/${partnerId}`, { headers: { Authorization: `Bearer ${accessToken}`}, })
      .then((res) => { setMessages(res.data); })
      .catch((err) => { console.error('메시지 불러오기 실패:', err)});

    // 상대방 프로필 이미지 요청
    getUserProfileImageByIdRequest(partnerId!, accessToken)
      .then((url) => {setPartnerProfileImage(url || defaultProfile)})
      .catch(() => {setPartnerProfileImage(defaultProfile)});

    // 상대방 닉네임 요청
    getUserNicknameByIdRequest(partnerId!, accessToken)
      .then((nickname) => setPartnerNickname(nickname))
      .catch(() => setPartnerNickname('알 수 없음'));
  }, [userId, partnerId, accessToken]);

  // effect: 외부 클릭 시 메시지 옵션 메뉴 닫기 처리 - 우측 점 3개 눌러 열리는 메뉴를 외부 클릭 시 닫음
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

  // effect: 메시지룸 접속 시 콘솔 출력 (디버깅용)
  useEffect(() => {
    console.log('[📡 메시지룸 접속]', userId, partnerId);
  }, []);

  // effect: 메시지 목록 변경 시 자동 스크롤 처리 API 호출
  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  }, [messages]);

  // function: 메시지 전송 처리 함수 (이미지 업로드 포함) - 텍스트 입력 또는 이미지 선택 후 서버로 전송
  const handleSend = async () => {
    if (!input.trim() && !imageFile) return; // 텍스트도 이미지도 없으면 전송 안 함

    let imageUrl = '';

    if (imageFile) {
      const formData = new FormData();
      formData.append('file', imageFile);

      try {
        const res = await axios.post('/api/upload-image', formData, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'multipart/form-data',
          },
        });
        imageUrl = res.data.data; // 백엔드 ResponseDto 기준
      } catch (err) {
        console.error('이미지 업로드 실패:', err);
        return;
      }
    }

    const newMsg: Message = {
      id: 0,
      senderId: userId!,
      receiverId: partnerId!,
      content: input,
      imageUrl,
      type: imageFile ? 'IMAGE' : 'TEXT',
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, newMsg]); // 클라이언트에서 즉시 메시지 추가
    sendMessage(newMsg); // WebSocket으로 서버 전송
    setInput(''); // 입력창 초기화
    setImageFile(null); // 이미지 초기화
  };

  // function: 입력창에서 Enter 키 입력 시 메시지 전송
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSend();
    }
  };

  // component: 메시지룸 컴포넌트 렌더링 - 상단 헤더, 메시지 목록, 입력창, 이미지 모달 포함
  return (
    <div className="message-room">
      {/* 헤더 - 상대 프로필 이미지 및 닉네임 표시 */}
      <div className="header">
        <img src={partnerProfileImage} alt="상대 프로필" width={40} height={40} />
        <span>{partnerNickname}</span>
      </div>

      {/* 채팅 메시지 목록 영역 */}
      <div className="chat-box" ref={chatBoxRef}>
        {messages.map((msg, i) => {
          // variable: 메세지 클래스 - 내가 보낸 메시지인지에 따라 스타일 구분
          const isMine = msg.senderId === userId; // 내가 보낸 메시지 여부

          return (
            <div key={i} className={`message-container ${isMine ? 'mine' : 'theirs'}`}>
              {!isMine && <img className="profile-icon" src={partnerProfileImage} alt="상대 프로필" />}
              <div className={isMine ? 'my-message' : 'their-message'}>
                {msg.type === 'TEXT' && <p>{msg.content}</p>}
                {msg.type === 'IMAGE' && msg.imageUrl && (
                  <>
                    <img className="message-image"
                      src={msg.imageUrl}
                      alt="image"
                      onClick={() => setPreviewImage(msg.imageUrl!)}
                    />
                  </>
                )}
                <div className="message-timestamp">
                  {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* 메시지 입력창 및 전송 버튼 */}
      <div className="input-area">
        <button className="image-upload-button" onClick={handleImageButtonClick}>＋</button>
        <input
          ref={imageInputRef}
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          style={{ display: 'none' }}
        />
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="메시지를 입력하세요"
        />
        <button onClick={handleSend}>전송</button>
      </div>

      {previewImage && (
        <div className="image-modal" onClick={() => setPreviewImage(null)}>
          <div className="image-modal-backdrop" />
          <img className="image-modal-content" src={previewImage} alt="preview"/>
        </div>
      )}
    </div>
  );
};

export default MessageRoom;
