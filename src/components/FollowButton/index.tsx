import { useState } from "react";
import "./style.css";

interface FollowButtonProps {
  initialIsFollowing?: boolean; // ❗초기 상태 props로 받기 (선택적)
}

export default function FollowButton({
  initialIsFollowing = false,
}: FollowButtonProps) {
  const [isFollowing, setIsFollowing] = useState(initialIsFollowing);

  const handleToggle = () => {
    // 나중에 요청 추가하면 여기서 fetch/post 등 처리 가능
    setIsFollowing((prev) => !prev);
  };

  const followClass = isFollowing ? "following" : "follow";

  return (
    <div className={`do ${followClass}`} onClick={handleToggle}>
      {isFollowing ? "팔로잉" : "팔로우"}
    </div>
  );
}
