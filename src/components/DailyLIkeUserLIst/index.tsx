import React, { useEffect, useState } from 'react';
import { getDailyLikesRequest } from '../../apis';
import GetLikedUserListResponseDto, { LikedUserDto } from '../../apis/dto/response/daily/get-liked-user-list.resopnse.dto';
import { ACCESS_TOKEN, MY_USER_ABSOLUTE_PATH } from '../../constants';
import { useCookies } from 'react-cookie';
import "./style.css";
import { useNavigate } from 'react-router-dom';
import closeIcon from '../../assets/images/close.png';
import useSignInUserStore from '../../stores/sign-in-user.store';

interface Props {
  dailySequence: number;
  isOpen: boolean;
  onClose: () => void;
  writerNickname: string;
}

const DailyLikesModal: React.FC<Props> = ({ dailySequence, isOpen, onClose, writerNickname }) => {
  const [likedUsers, setLikedUsers] = useState<LikedUserDto[]>([]);
  const [likeCount, setLikeCount] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [cookies] = useCookies([ACCESS_TOKEN]);
  const accessToken = cookies[ACCESS_TOKEN];

  const { userNickname, userId } = useSignInUserStore();

  // function: 네비게이터 함수 //
  const navigator = useNavigate();

  // event handler: 프로필 클릭 이벤트 처리 //
  const onProfileClickHandler = () => {
    if(!userId) return;
    navigator(MY_USER_ABSOLUTE_PATH(userNickname));
  };

  useEffect(() => {
    if (!isOpen) return;

    const fetchLikedUsers = async () => {
      setLoading(true);
      try {
        const response = await getDailyLikesRequest(dailySequence, accessToken);
        const typedResponse = response as GetLikedUserListResponseDto;

        if (typedResponse && typedResponse.code === 'SU' && typedResponse.likedUserList) {
          setLikedUsers(typedResponse.likedUserList.slice(0, 100));
          setLikeCount(typedResponse.likeCount);
        } else {
          console.warn('예상치 못한 응답:', response);
        }
      } catch (error) {
        console.error('좋아요 유저 목록 불러오기 실패:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLikedUsers();
  }, [dailySequence, accessToken, isOpen]);

  if (!isOpen) return null; 

  const formatLikeCount = (likeCount: number) => {
    if (likeCount > 9999) {
      const formattedCount = likeCount >= 10000
        ? `${(likeCount / 10000).toFixed(1)}만개`
        : `총 좋아요 ${likeCount}개`;
      return formattedCount;
    }
    return `총 좋아요 ${likeCount}개`;
  };

  return (
    <div id="modal-backdrop" onClick={onClose} >
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <img src={closeIcon} alt="Close" className='close-button' onClick={onClose} />
        <div className='like-title'>좋아요</div>
        {userNickname === writerNickname && (
          <div className='like-count'>{formatLikeCount(likeCount)}</div>
        )}
        {loading ? (
          <p>로딩 중...</p>
        ) : likedUsers.length === 0 ? (
          <p>아직 좋아요를 누른 유저가 없습니다.</p>
        ) : (
          <ul>
            {likedUsers.map((user) => (
              <li key={user.userId}>
                <img
                  src={user.profileImage}
                  alt={`${user.userNickname}의 프로필`}
                  style={{ width: 40, height: 40, borderRadius: '50%', border: '1px solid #ccc' }}
                  onClick={onProfileClickHandler}
                />
                <div className='like-user-name' onClick={onProfileClickHandler}>{user.userNickname}</div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default DailyLikesModal;
