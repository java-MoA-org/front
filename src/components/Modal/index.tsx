import { ReactNode, useEffect } from "react";
import "./style.css";

// interface: 공통 모달 컴포넌트 속성 //

interface Props {
  title: string;
  onClose: () => void;
  children?: ReactNode; // 이를 통해 원하는 형태로 외부에서 결정 가능
}

export default function Modal({ title, onClose, children }: Props) {
  // effect: 컴포넌트 로드 시 실행할 함수 //
  useEffect(() => {
    document.body.style.overflow = "hidden"; // 스크롤 제거
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  return (
    <div id="modal-wrapper">
      <div className="modal-container">
        <div className="modal-head">
          <div className="title">{title}</div>
          <div className="close-button" onClick={onClose} />
        </div>
        <div className="modal-body">{children}</div>
      </div>
    </div>
  );
}
