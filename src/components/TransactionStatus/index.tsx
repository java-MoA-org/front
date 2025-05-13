import React from 'react';
import './style.css';
import { TransactionStatus } from '../../types/enums/TransactionStatus';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (status: '판매중' | '판매완료' | '예약중') => void;
  selectedStatus: '판매중' | '판매완료' | '예약중';
}

const TransactionStatusModal: React.FC<Props> = ({ isOpen, onClose, onSelect, selectedStatus }) => {
  if (!isOpen) return null;

  return (
    <div className="transaction-modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h3>거래 상태</h3>
        <button
          className={selectedStatus === '판매중' ? 'selected' : ''}
          onClick={() => onSelect('판매중')}
        >
          판매중
        </button>
        <button
          className={selectedStatus === '판매완료' ? 'selected' : ''}
          onClick={() => onSelect('판매완료')}
        >
          판매완료
        </button>
        <button
          className={selectedStatus === '예약중' ? 'selected' : ''}
          onClick={() => onSelect('예약중')}
        >
          예약중
        </button>
      </div>
    </div>
  );
};


export default TransactionStatusModal;
