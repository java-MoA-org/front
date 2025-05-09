import { useEffect, useRef } from 'react';
import SockJS from 'sockjs-client';
import { Client, over } from 'stompjs';

// 타입 지정이 필요하면 여기에 interface Message 정의 가능
// interface Message { senderId: string; receiverId: string; content: string; }

const useChatSocket = (userId: string, onMessage: (msg: any) => void) => {
  const stompClientRef = useRef<Client | null>(null);

  useEffect(() => {
    // 1. SockJS로 WebSocket 연결 생성
    const socket = new SockJS('http://localhost:4000/ws');
    const client = over(socket);

    // 2. STOMP 연결 및 구독
    client.connect({}, () => {
      console.log('✅ WebSocket 연결됨');

      // 3. 해당 유저가 수신할 개인 큐 구독
      client.subscribe(`/user/queue/messages`, (message) => {
        const body = JSON.parse(message.body);
        console.log('📩 수신:', body);
        onMessage(body);
      });

      stompClientRef.current = client;
    }, (error) => {
      console.error('❌ WebSocket 연결 실패:', error);
    });

    // 언마운트 시 연결 종료
    return () => {
      client.disconnect(() => {
        console.log('❌ WebSocket 연결 종료');
      });
    };
  }, [userId, onMessage]);

  // 4. 메시지 전송 함수
  const sendMessage = (receiverId: string, content: string) => {
    if (!stompClientRef.current) return;

    const message = {
      senderId: userId,
      receiverId,
      content,
    };

    stompClientRef.current.send('/app/send', {}, JSON.stringify(message));
  };

  return { sendMessage };
};

export default useChatSocket;