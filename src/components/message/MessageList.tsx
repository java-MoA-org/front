// src/components/message/MessageList.tsx

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUserInfoByIdRequest, searchUserRequest } from '../../apis';
import useSignInUserStore from '../../stores/sign-in-user.store';
import defaultProfile from '../../assets/images/default-profile.png';
import { useCookies } from 'react-cookie';
import { ACCESS_TOKEN } from '../../constants';

interface MessageItem {
  partnerId: string;
  lastContent: string;
  timestamp: string;
}

interface UserInfo {
  userId: string;
  userNickname: string;
  userProfileImage: string;
}

const MessageList = () => {
  const navigate = useNavigate();
  const { userId } = useSignInUserStore();
  const [cookies] = useCookies([ACCESS_TOKEN]);
  const accessToken = cookies[ACCESS_TOKEN];

  const [messages, setMessages] = useState<MessageItem[]>([]);
  const [userInfoMap, setUserInfoMap] = useState<{ [key: string]: UserInfo }>({});
  const [searchKeyword, setSearchKeyword] = useState('');
  const [searchResults, setSearchResults] = useState<UserInfo[]>([]);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);

  // 메시지 + 유저정보 불러오기
  useEffect(() => {
    if (!accessToken) return;

    const loadRecentMessages = async () => {
      const dummyMessages: MessageItem[] = [
        { partnerId: 'sella45', lastContent: '안녕? 잘 지내?', timestamp: '2025-05-07 12:12:00' },
        { partnerId: 'test3', lastContent: '공지 읽어주세요.', timestamp: '2025-05-06 22:40:00' },
      ];
      setMessages(dummyMessages);

      try {
        const ids = dummyMessages.map((msg) => msg.partnerId);
        const results = await Promise.all(
          ids.map(async (id) => {
            const res = await getUserInfoByIdRequest(id, accessToken);
            return {
              userId: id,
              userNickname: res.userNickname,
              userProfileImage: res.userProfileImage || '',
            };
          })
        );

        const userMap: { [key: string]: UserInfo } = {};
        results.forEach((user) => {
          userMap[user.userId] = user;
        });
        setUserInfoMap(userMap);
      } catch (err) {
        console.error('⚠️ 유저 정보 불러오기 실패:', err);
        setUserInfoMap({
          sella45: {
            userId: 'sella45',
            userNickname: '셀라',
            userProfileImage: '',
          },
          test3: {
            userId: 'test3',
            userNickname: '테스터',
            userProfileImage: '',
          },
        });
      }
    };

    loadRecentMessages();
  }, [accessToken]);

  // 유저 검색
  useEffect(() => {
    if (!searchKeyword.trim() || !accessToken) {
      setSearchResults([]);
      return;
    }

    searchUserRequest(searchKeyword, accessToken)
      .then((res) => {
        if (Array.isArray(res)) {
          const converted: UserInfo[] = res.map((item) => ({
            userId: item.userId,
            userNickname: item.userNickname,
            userProfileImage: item.userProfileImage || '',
          }));
          setSearchResults(converted);
          setShowSearchDropdown(true);
        }
      })
      .catch((err) => console.error('검색 실패:', err));
  }, [searchKeyword, accessToken]);

  return (
    <div className="message-list-wrapper">
      <h2>메시지</h2>

      {!accessToken ? (
        <p>로딩 중...</p>
      ) : (
        <>
          <input
            type="text"
            placeholder="닉네임으로 유저 검색"
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            onFocus={() => setShowSearchDropdown(true)}
            onBlur={() => setTimeout(() => setShowSearchDropdown(false), 150)}
          />

          {showSearchDropdown && searchResults.length > 0 && (
            <ul className="search-result-list">
              {searchResults.map((user) => (
                <li key={user.userId} onClick={() => navigate(`/message/${userId}/${user.userId}`)}>
                  <img src={user.userProfileImage || defaultProfile} className="profile-img" />
                  {user.userNickname}
                </li>
              ))}
            </ul>
          )}

          {messages.length === 0 ? (
            <p>최근 메시지 내역이 없습니다.</p>
          ) : (
            <ul className="message-list">
              {messages.map((msg) => {
                const partner = userInfoMap[msg.partnerId];
                return (
                  <li
                    key={msg.partnerId}
                    className="message-list-item"
                    onClick={() => navigate(`/message/${userId}/${msg.partnerId}`)}
                  >
                    <img src={partner?.userProfileImage || defaultProfile} className="profile-img" />
                    <div className="message-info">
                      <strong>{partner?.userNickname || msg.partnerId}</strong>
                      <p>{msg.lastContent}</p>
                    </div>
                    <div className="message-time">{msg.timestamp}</div>
                  </li>
                );
              })}
            </ul>
          )}
        </>
      )}
    </div>
  );
};

export default MessageList;