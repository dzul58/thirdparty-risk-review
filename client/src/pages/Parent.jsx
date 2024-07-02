import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';

const Parent = () => {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50 ">
      <Navbar />
      <Sidebar />
      <div className="flex-1 p-2">
        <Outlet />
      </div>
    </div>
  );
};

export default Parent;