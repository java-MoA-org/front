import { ChangeEvent, useRef, useState } from "react";
import "./index.css"; // 스타일은 아래에!
import axios from "axios";
import camera from "../../assets/images/camera.png";
import { userProfileImageUpload } from "../../apis";
// ✅ 변경: Props에 initialImage 추가
interface Props {
  onImageUpload: (url: string) => void;
  initialImage?: string;
}

export default function ProfileImageUploader({
  onImageUpload,
  initialImage,
}: Props) {
  const [preview, setPreview] = useState(initialImage || camera); // ✅ 초기 이미지 반영
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await userProfileImageUpload(formData);
      const imageUrl = res.data;
      setPreview(imageUrl);
      onImageUpload(imageUrl);
    } catch (error) {
      alert("이미지 업로드 실패");
    }
  };

  return (
    <div className="profile-uploader">
      <div
        style={{ backgroundImage: `url(${preview})` }}
        className="profile-image"
      />
      <button type="button" onClick={() => fileInputRef.current?.click()}>
        파일 선택
      </button>
      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        onChange={handleChange}
        style={{ display: "none" }}
      />
    </div>
  );
}
