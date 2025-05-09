import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';
import useSignInUserStore from '../../stores/sign-in-user.store';
import { getUserInfoByIdRequest } from '../../apis';
import { useCookies } from 'react-cookie';
import MessageInput from './MessageInput';
import defaultProfile from '../../assets/images/default-profile.png';

interface Message {
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: string;
}

interface UserInfo {
  userId: string;
  userNickname: string;
  userProfileImage: string;
}

const MessageRoom = () => {
  const { partnerId } = useParams<{ partnerId: string }>();
  const { userId } = useSignInUserStore();
  const [cookies] = useCookies();
  const accessToken = cookies.ACCESS_TOKEN;

  const [messages, setMessages] = useState<Message[]>([]);
  const [partnerInfo, setPartnerInfo] = useState<UserInfo | null>(null);
  const stompClient = useRef<Client | null>(null);

  useEffect(() => {
    if (!partnerId || !accessToken) return;

    const loadPartnerInfo = async () => {
      try {
        const res = await getUserInfoByIdRequest(partnerId, accessToken);
        console.log("✅ 상대방 유저 정보 불러오기 성공:", res);
        setPartnerInfo({
          userId: partnerId,
          userNickname: res.userNickname,
          userProfileImage: res.userProfileImage || '',
        });
      } catch (err) {
        console.error('⚠️ 유저 정보 로딩 실패:', err);
        setPartnerInfo({
          userId: partnerId,
          userNickname: partnerId,
          userProfileImage: '',
        });
      }
    };

    loadPartnerInfo();
  }, [partnerId, accessToken]);

  useEffect(() => {
    if (!userId || !partnerId) return;

    const socket = new SockJS('http://localhost:4000/ws');
    const client = new Client({
      webSocketFactory: () => socket,
      reconnectDelay: 5000,
      onConnect: () => {
        console.log('✅ STOMP 연결됨');

        client.subscribe(`/user/${userId}/queue/messages`, (message) => {
          const body = JSON.parse(message.body);
          console.log("📥 수신된 메시지:", body);

          if (
            (body.senderId === partnerId && body.receiverId === userId) ||
            (body.senderId === userId && body.receiverId === partnerId)
          ) {
            setMessages((prev) => [...prev, body]);
          }
        });
      },
      onStompError: (frame) => {
        console.error('❌ STOMP 에러:', frame);
      }
    });

    client.activate();
    stompClient.current = client;

    return () => {
      client.deactivate();
      console.log('🔌 STOMP 연결 해제');
    };
  }, [userId, partnerId]);

  const sendMessage = (content: string) => {
    if (!partnerId || !stompClient.current?.connected) return;

    const message: Message = {
      senderId: userId,
      receiverId: partnerId,
      content,
      timestamp: new Date().toISOString(),
    };

    console.log('📤 메시지 전송 요청:', message);

    stompClient.current.publish({
      destination: '/app/send',
      body: JSON.stringify(message),
    });
  };

  return (
    <div className="message-room">
      <div className="room-header">
        <img
          src={
            partnerInfo?.userProfileImage
              ? `${partnerInfo.userProfileImage}?t=${Date.now()}`
              : defaultProfile
          }
          alt="상대 프로필"
          className="profile-img"
        />
        <strong>{partnerInfo?.userNickname || partnerId}</strong>
      </div>

      <div className="message-list">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`message-item ${msg.senderId === userId ? 'sent' : 'received'}`}
          >
            <div className="message-content">{msg.content}</div>
            <div className="timestamp">{msg.timestamp}</div>
          </div>
        ))}
      </div>

      <MessageInput onSend={sendMessage} />
    </div>
  );
};

export default MessageRoom;