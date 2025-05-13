import React, { useState, useEffect } from 'react';
import './style.css';
import alterIcon from '../../assets/images/alter.png';
import deleteIcon from '../../assets/images/delete.png';
import axios from 'axios';
import { UPLOAD_IMAGES_URL } from '../../apis';

interface ImageUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (images: string[]) => void;
}

const ImageUploadModal: React.FC<ImageUploadModalProps> = ({ isOpen, onClose, onSave }) => {
  const [imageList, setImageList] = useState<(string | null)[]>(Array(5).fill(null));
  const [isUploading, setIsUploading] = useState(false);
  const [images, setImages] = useState<(string | null)[]>([]);

  const handleImageChange = async (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const newImageList = [...imageList];
      setIsUploading(true);

      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', 'used-trade');

      try {
        const response = await axios.post(UPLOAD_IMAGES_URL, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });

        const imageUrl = response.data.data;

        newImageList[index] = imageUrl;
        setImageList(newImageList);
      } catch (error) {
        console.error('이미지 업로드 실패:', error);
        alert('이미지 업로드에 실패했습니다. 다시 시도해주세요.');
      }

      setIsUploading(false);
    }
  };

  const handleImageDelete = (index: number) => {
    const newImageList = [...imageList];
  
    for (let i = index; i < newImageList.length - 1; i++) {
      newImageList[i] = newImageList[i + 1];
    }
  
    newImageList[newImageList.length - 1] = null;
  
    setImageList(newImageList);
  };

  const findEmptySlot = () => imageList.findIndex(img => img === null);

  const handleSave = () => {
    const validImages = imageList
      .filter((img) => img !== null)
      .flat() as string[]; 
    onSave(validImages);
    onClose();
  };

  useEffect(() => {
    return () => {
      imageList.forEach((img) => {
        if (img) {
          URL.revokeObjectURL(img);
        }
      });
    };
  }, [imageList]);

  if (!isOpen) return null;

  return (
    <div id="image-modal-overlay">
      <div className="modal-content">
        <h2 className="modal-title">이미지 업로드 (최대 5장)</h2>

        {imageList[0] && (
          <>
            <div className="thumbnail-container">
              <img src={imageList[0] as string} alt="thumbnail" className="thumbnail-image" />
            </div>
            <h3 className="modal-title">썸네일 이미지</h3>
          </>
        )}

        <div className="image-grid">
          {imageList.map((img, idx) => (
            <div key={idx} className="image-slot">
              {img ? (
                <>
                  <img src={img} alt={`preview-${idx}`} className="image-preview" />
                  <label className="image-replace-label">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageChange(idx, e)}
                      className="image-input"
                      disabled={isUploading}
                    />
                    <img src={alterIcon} alt="Alter" className="icon" />
                  </label>
                  <div className="delete" onClick={() => handleImageDelete(idx)}>
                    <img src={deleteIcon} alt="Delete" className="icon" />
                  </div>
                </>
              ) : (
                idx === findEmptySlot() && (
                  <label className="image-upload-label">
                    +
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageChange(idx, e)}
                      className="image-input"
                      disabled={isUploading}
                    />
                  </label>
                )
              )}
            </div>
          ))}
        </div>

        <div className="button-group">
          <button className="confirm-button" onClick={handleSave}>확인</button>
          <button className="close-button" onClick={onClose}>닫기</button>
        </div>
      </div>
    </div>
  );
};

export default ImageUploadModal;
