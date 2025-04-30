import React, { useState } from 'react';
import './style.css';

interface LocationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (location: string, detailLocation: string) => void;
}

const LocationModal = ({ isOpen, onClose, onSave }: LocationModalProps) => {
  const [location, setLocation] = useState<string>('');
  const [detailLocation, setDetailLocation] = useState<string>('');

  const handleSave = () => {
    onSave(location, detailLocation);
    onClose();
  };

  if (!isOpen) return null;

  return (
    isOpen && (
      <div id="modal-overlay">
        <div className="modal-content">
          <h2>거래 위치 입력</h2>
          <div>
            <label htmlFor="location">주소</label>
            <input
              id="location"
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="예: 서울시 강남구"
            />
          </div>
          <div>
            <label htmlFor="detailLocation">상세 주소</label>
            <input
              id="detailLocation"
              type="text"
              value={detailLocation}
              onChange={(e) => setDetailLocation(e.target.value)}
              placeholder="예: 테헤란로 123"
            />
          </div>
          <button onClick={handleSave}>주소 저장</button>
          <button onClick={onClose}>취소</button>
        </div>
      </div>
    )
  );
};

export default LocationModal;
