import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  function handleLogout() {
    localStorage.clear();
    navigate("/login");
  }

  return (
    <div className="bg-purple-500 text-white md:relative">
      <div className="p-4 flex justify-between items-center">
        <h2 className="text-2xl font-bold">
          <Link to="/" className="hover:text-white">
            Moving Address
          </Link>
        </h2>
      </div>
    </div>
  );
};

export default Navbar;