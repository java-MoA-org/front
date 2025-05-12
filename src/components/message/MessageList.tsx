import './MessageList.css';
import { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import useSignInUserStore from '../../stores/sign-in-user.store';

interface MessageRoomSummary {
  partnerId: string;
  nickname: string;
  profileImage: string;
  lastMessage: string;
  timestamp: string;
  unread: boolean;
}

const MessageList = () => {
  const [cookies] = useCookies(['accessToken']);
  const accessToken = cookies['accessToken'];
  const [rooms, setRooms] = useState<MessageRoomSummary[]>([]);
  const navigate = useNavigate();
  const { userId } = useSignInUserStore();

  useEffect(() => {
    console.log('[✅ accessToken 확인]', accessToken);
    if (!accessToken) return;

    console.log('[📡 요청 시작] /api/message/rooms');
    axios
      .get('/api/message/rooms', {
        headers: { Authorization: `Bearer ${accessToken}` },
      })
      .then((res) => {
        console.log('[✅ 응답 확인]', res.data);
        // 서버가 { rooms: [...] } 형태로 응답할 경우
        if (res.data.rooms && Array.isArray(res.data.rooms)) {
          setRooms(res.data.rooms);
        } else if (Array.isArray(res.data)) {
          setRooms(res.data); // 배열 자체가 올 경우
        } else {
          console.warn('[⚠️ 알림] 응답 형식이 예상과 다름:', res.data);
          setRooms([]);
        }
      })
      .catch((err) => console.error('채팅방 목록 불러오기 실패:', err.response?.data || err.message));
  }, [accessToken]);

  const handleClickRoom = (partnerId: string) => {
    if (userId) {
      navigate(`/message/${userId}/${partnerId}`);
    }
  };

  return (
    <div className="message-container">
      <div className="message-list">
        {Array.isArray(rooms) &&
          rooms.map((room) => (
            <div key={room.partnerId} className="message-item" onClick={() => handleClickRoom(room.partnerId)}>
              <img src={room.profileImage} alt="프로필" className="profile-img" />
              <div className="text-info">
                <div className="nickname-row">
                  <span className="nickname">{room.nickname}</span>
                  <span className="timestamp">
                    {new Date(room.timestamp).toLocaleString('ko-KR', {
                      month: '2-digit',
                      day: '2-digit',
                      hour: '2-digit',
                      minute: '2-digit',
                      hour12: false,
                    })}
                  </span>
                </div>
                <div className="last-message">
                  {room.lastMessage}
                  {room.unread && <span className="unread-dot" />}
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default MessageList;
