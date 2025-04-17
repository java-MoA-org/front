import { ChangeEvent, useRef, useState } from 'react';
import './index.css'; // 스타일은 아래에!
import axios from 'axios';
import camera from '../../assets/images/camera.png';

interface Props {
    onImageUpload: (url: string) => void; // 업로드된 URL을 SignUp에 넘겨줌
}
export default function ProfileImageUploader({ onImageUpload }: Props) {
    const [preview, setPreview] = useState(camera);

    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleChange = async (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('file', file);

        try {
            const res = await axios.post('/api/v1/upload/profile', formData); // 서버 URL 맞게 수정
            const imageUrl = res.data; // 응답이 string 형태의 URL이면
            setPreview(imageUrl);
            onImageUpload(imageUrl); // 부모에게 전달
        } catch (error) {
            alert('이미지 업로드 실패');
        }
    };

    return (
        <div className="profile-uploader">
            <div style={{ backgroundImage: `url(${preview})` }} className="profile-image" />
            <button type="button" onClick={() => fileInputRef.current?.click()}>
                파일 선택
            </button>
            <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                onChange={handleChange}
                style={{ display: 'none' }}
            />
        </div>
    );
}
