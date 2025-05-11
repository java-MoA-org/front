import { useEffect, useRef } from 'react';
import { Client } from '@stomp/stompjs';
import { useCookies } from 'react-cookie';


interface Message {
  senderId: string;
  receiverId: string;
  content: string;
  imageUrl?: string;
  type: 'TEXT' | 'IMAGE' | 'DELETE'; 
  timestamp: string;
}

const useChatSocket = (
  userId: string,
  onMessageReceived: (message: Message) => void
) => {
  const [cookies] = useCookies(['accessToken']);
  const accessToken = cookies.accessToken;
  const clientRef = useRef<Client | null>(null);

  useEffect(() => {
    if (!accessToken) {
      console.warn('[🚫 WebSocket 차단] accessToken이 없습니다.');
      return;
    }

    const client = new Client({
      brokerURL: undefined, 
      connectHeaders: {
        Authorization: `Bearer ${accessToken}`,
      },
      webSocketFactory: () => {
        const socket = new WebSocket(`ws://localhost:4000/ws?token=${accessToken}`);
        return socket;
      },
      reconnectDelay: 5000,
      onConnect: () => {
        console.log(`[🟢 연결됨] /topic/messages/${userId} 구독 중`);
        client.subscribe(`/topic/messages/${userId}`, (message) => {
          const received = JSON.parse(message.body);
          console.log('[📩 메시지 수신]', received);
          onMessageReceived(received);
        });

      },
      onDisconnect: () => {
        console.log('[🔴 연결 종료]');
      },
      debug: (str) => {
        console.log('[STOMP DEBUG]', str);
      }
    });

    client.activate();
    clientRef.current = client;

    return () => {
      client.deactivate();
    };
  }, [userId, onMessageReceived, accessToken]); // accessToken 추가

  const sendMessage = (message: Message) => {
    if (clientRef.current && clientRef.current.connected) {
      clientRef.current.publish({
        destination: '/app/chat.send',
        body: JSON.stringify(message)
      });
    } else {
      console.warn('[⚠️ WebSocket 미연결 상태 - 메시지 큐에 저장]');
    }
  };

  return { sendMessage };
};

export default useChatSocket;