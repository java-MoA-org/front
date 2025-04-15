import { useState } from "react";
import UserPageFollowee from "./Followee";
import UserPageFollower from "./Follower";
import "./style.css";

export default function UserPageFollow() {
  const [activeTab, setActiveTab] = useState<"followee" | "follower">("followee");

  // variable: followee, follower 변수 //
  const followeeClass = activeTab === "followee" ? "type-follower active" : "type-follower";
  const followerClass = activeTab === "follower" ? "type-followee active" : "type-followee";

  return (
    <div id="my-user-follow">
      <div className="follow-type">
        <div className={followerClass} onClick={() => setActiveTab("follower")}>
          팔로워
        </div>
        <div className={followeeClass} onClick={() => setActiveTab("followee")}>
          팔로잉
        </div>
      </div>

      {activeTab === "followee" ? (
        <UserPageFollowee setActiveTab={setActiveTab} />
      ) : (
        <UserPageFollower setActiveTab={setActiveTab} />
      )}
    </div>
  );
}
