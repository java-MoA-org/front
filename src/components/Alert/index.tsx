import React, { RefObject, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { patchReadAlertRequest, deleteAlertRequest, patchReadAllAlertRequest, deleteAlertAllRequest } from '../../apis';
import './style.css';
import useNotificationStore from '../../stores/alert-read.store';

const ALERTS_PER_PAGE = 3;

interface AlertDropdownProps {
  accessToken: string;
  dropdownRef: RefObject<HTMLDivElement | null>;
}

export default function AlertDropdown({ accessToken, dropdownRef }: AlertDropdownProps) {
  const { alerts, markAsRead, removeAlert, markAllAsRead, removeAllAlerts } = useNotificationStore();
  const [visibleAlerts, setVisibleAlerts] = useState(ALERTS_PER_PAGE);
  const navigate = useNavigate();

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    console.log('scroll');
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    if (scrollTop + clientHeight >= scrollHeight - 10) {
      setVisibleAlerts((prev) => Math.min(prev + ALERTS_PER_PAGE, alerts.length));
    }
  };

  const handleMouseEnter = async (id: number, read: boolean) => {
    if (!read) {
      await patchReadAlertRequest(id, accessToken);
      markAsRead(id);
    }
  };

  const handleClick = (link: string) => {
    navigate(link.startsWith('/') ? link : `/${link}`);
  };

  const handleDelete = async (id: number) => {
    await deleteAlertRequest(id, accessToken);
    removeAlert(id);
  };

  const handleReadAll = async () => {
    await patchReadAllAlertRequest(accessToken);
    markAllAsRead();
  };

  const handleDeleteAll = async () => {
    await deleteAlertAllRequest(accessToken);
    removeAllAlerts();
  };

  return (
    <div className="alert-dropdown" ref={dropdownRef}>
      <div className="alert-list" onScroll={handleScroll}>
        {alerts.slice(0, visibleAlerts).map(({ id, type, content, creationDate, link, read }) => (
          <div
            key={id}
            className={`alert-item ${read ? 'read' : 'unread'}`}
            onMouseEnter={() => handleMouseEnter(id, read)}
          >
            <div className="alert-main" onClick={() => handleClick(link)}>
              <div className="alert-title">
                "{type}"<br />
                {content}
              </div>
              <div className="alert-date">{new Date(creationDate).toLocaleString()}</div>
            </div>
            <button className="alert-delete" onClick={() => handleDelete(id)}>
              x
            </button>
          </div>
        ))}
      </div>

      <div className="alert-controls">
        <button onClick={handleReadAll}>모두 읽음</button>
        <button onClick={handleDeleteAll}>모두 삭제</button>
      </div>
    </div>
  );
}
