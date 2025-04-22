import React from 'react';
import { Outlet } from 'react-router-dom';
import '../views/category/board/BoardMain.css';

const BoardLayout = () => {
  return (
    <div className="board-layout-wrapper">
      <Outlet />
    </div>
  );
};

export default BoardLayout;
