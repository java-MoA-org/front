import './MessageList.css';
import { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import useSignInUserStore from '../../stores/sign-in-user.store';
import useChatSocket from '../../hooks/useChatSocket';
import { getUserProfileImageByIdRequest, getUserNicknameByIdRequest } from '../../apis';

// interface: 메시지 방 요약 정보 인터페이스 정의 //
interface MessageRoomSummary {
  partnerId: string;
  nickname: string;
  profileImage: string;
  lastMessage: string;
  timestamp: string;
  unread: boolean;
}

const MessageList = () => {
  // state: 상태 변수 정의 //
  const [cookies] = useCookies(['accessToken']);
  const accessToken = cookies['accessToken'];
  const [rooms, setRooms] = useState<MessageRoomSummary[]>([]);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const navigate = useNavigate();
  const { userId } = useSignInUserStore();

  // socket: WebSocket 수신 메시지 핸들링 - 새 메시지를 받으면 채팅방 목록을 갱신
  const { sendMessage } = useChatSocket(userId!, async (message) => {
    const isIncoming = message.senderId !== userId;
    const partnerId = isIncoming ? message.senderId : message.receiverId;

    const nickname = await getUserNicknameByIdRequest(partnerId, accessToken);
    const profileImage = await getUserProfileImageByIdRequest(partnerId, accessToken);

    setRooms(prev => {
      const updated = [...prev];
      const index = updated.findIndex(room =>
        room.partnerId === partnerId
      );

      const newRoom: MessageRoomSummary = {
        partnerId,
        nickname,
        profileImage,
        lastMessage: message.content,
        timestamp: message.timestamp,
        unread: isIncoming,
      };

      if (index !== -1) {
        updated[index] = { ...updated[index], ...newRoom };
      } else {
        updated.unshift(newRoom);
      }

      updated.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
      return [...updated];
    });
  });

  // effect: accessToken 변경 시 채팅방 목록 API 호출 및 초기 데이터 로드 //
  useEffect(() => {
    console.log('[✅ accessToken 확인]', accessToken);
    if (!accessToken) return;

    // 최초 진입 시 채팅방 목록 API 호출
    console.log('[📡 요청 시작] /api/message/rooms');
    axios.get('/api/message/rooms', {
      headers: { Authorization: `Bearer ${accessToken}` }
    })
      .then((res) => {
        let fetchedRooms: MessageRoomSummary[] = [];

        if (res.data.rooms && Array.isArray(res.data.rooms)) {
          fetchedRooms = res.data.rooms;
        } else if (Array.isArray(res.data)) {
          fetchedRooms = res.data;
        } else {
          console.warn('[⚠️ 알림] 응답 형식이 예상과 다름:', res.data);
          return setRooms([]);
        }

        // 최신 (내림차순) 메시지 기준으로 정렬 
        fetchedRooms.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

        setRooms(fetchedRooms);
      })
      .catch((err) => console.error('채팅방 목록 불러오기 실패:', err.response?.data || err.message));
  }, [accessToken]);

  // effect: 다른 영역 클릭 시 옵션 메뉴 닫기 처리
  useEffect(() => {
    const handleClickOutside = () => {
      setOpenMenuId(null);
    };

    document.addEventListener('click', handleClickOutside);

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  // function: 채팅방 클릭 시 해당 채팅방으로 이동
  const handleClickRoom = (partnerId: string) => {
    if (userId) {
      navigate(`/message/${userId}/${partnerId}`);
    }
  };

  // function: 채팅방 삭제 요청 (숨김 처리) 후 목록에서 제거
  const handleDeleteRoom = async (partnerId: string) => {
    if (!accessToken || !userId) return;

    try {
      await axios.delete(`/api/message/hide-room/${userId}/${partnerId}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      });

      setRooms(prev => prev.filter(room => room.partnerId !== partnerId));
    } catch (err) {
      console.error('채팅방 숨김 실패:', err);
    }
  };

  // render: 채팅방 목록 렌더링 // 
  return (
    <div className="message-list">
      {Array.isArray(rooms) && rooms.map((room) => (
        // 채팅방 하나를 렌더링
        <div
          key={room.partnerId}
          className={`message-item ${room.unread ? 'unread' : ''}`}
          onClick={(e) => {
            e.stopPropagation();
            handleClickRoom(room.partnerId);
          }}
        >
          <img src={room.profileImage} alt="프로필" className="profile-img" />
          <div className="text-info">
            <div className="nickname-row">
              <span className="nickname">{room.nickname}</span>
              <span className="timestamp">{new Date(room.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
            </div>
            <div className="last-message">
              {room.lastMessage}
              {/* 안 읽은 메시지가 있는 경우 빨간 점 표시 */}
              {room.unread && <span className="unread-dot" />}
            </div>
          </div>
          <div className="message-options">
            {/* 더보기 버튼 (삭제 메뉴 열기) */}
            <button
              className="more-btn"
              onClick={(e) => {
                e.stopPropagation();
                setOpenMenuId((prev) => (prev === room.partnerId ? null : room.partnerId));
              }}
            >
              ...
            </button>
            {/* 더보기 메뉴 - 삭제 버튼 포함 */}
            {openMenuId === room.partnerId && (
              <div className="dropdown-menu">
                <button
                  className="delete-room-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteRoom(room.partnerId);
                    setOpenMenuId(null);
                  }}
                >
                  삭제
                </button>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default MessageList;