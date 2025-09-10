import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Transition from '../utils/Transition';
import { logout } from '../authGuards/auth';
import UserAvatar from '../images/user-avatar-32.png';
import { useSelector } from 'react-redux';

function DropdownProfile({ align }) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const trigger = useRef(null);
  const dropdown = useRef(null);
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);


  // Close on click outside
  useEffect(() => {
    const clickHandler = ({ target }) => {
      if (!dropdown.current || !dropdownOpen) return;
      if (dropdown.current.contains(target) || trigger.current.contains(target)) return;
      setDropdownOpen(false);
    };
    document.addEventListener('click', clickHandler);
    return () => document.removeEventListener('click', clickHandler);
  }, [dropdownOpen]);

  // Close on ESC
  useEffect(() => {
    const keyHandler = ({ keyCode }) => {
      if (keyCode === 27) setDropdownOpen(false);
    };
    document.addEventListener('keydown', keyHandler);
    return () => document.removeEventListener('keydown', keyHandler);
  }, []);

  // ✅ Handle Sign Out
  const handleSignOut = () => {
    setDropdownOpen(false);
    logout();           // Clear localStorage
    navigate('/signin'); // Redirect to login page
  };

  return (
    <div className="relative inline-flex">
      <button
        ref={trigger}
        className="inline-flex justify-center items-center group"
        aria-haspopup="true"
        onClick={() => setDropdownOpen(!dropdownOpen)}
        aria-expanded={dropdownOpen}
      >
        <img className="w-8 h-8 rounded-full"  src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user?.firstName || "U")}&background=22177A&color=fff&size=48`} width="32" height="32" alt="User" />
        <div className="flex items-center truncate">
          <span className="truncate ml-2 text-sm font-medium text-gray-600 dark:text-gray-100 group-hover:text-gray-800 dark:group-hover:text-white">{user?.firstName ? user.firstName.charAt(0).toUpperCase() + user.firstName.slice(1) : ""}</span>
          <svg className="w-3 h-3 shrink-0 ml-1 fill-current text-gray-400 dark:text-gray-500" viewBox="0 0 12 12">
            <path d="M5.9 11.4L.5 6l1.4-1.4 4 4 4-4L11.3 6z" />
          </svg>
        </div>
      </button>

      <Transition
  className={`origin-top-right z-10 absolute top-full min-w-52 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700/60 py-2 rounded-xl shadow-2xl overflow-hidden mt-2 ${align === 'right' ? 'right-0' : 'left-0'}`}
  show={dropdownOpen}
  enter="transition ease-out duration-200 transform"
  enterStart="opacity-0 -translate-y-2"
  enterEnd="opacity-100 translate-y-0"
  leave="transition ease-in duration-150"
  leaveStart="opacity-100"
  leaveEnd="opacity-0"
>
  <div
    ref={dropdown}
    onFocus={() => setDropdownOpen(true)}
    onBlur={() => setDropdownOpen(false)}
    className="px-4 py-3"
  >
    {/* Profile Header */}
    <div className="flex items-center gap-3 border-b border-gray-200 dark:border-gray-700/60 pb-3 mb-3">
      <img
        src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user?.firstName || "U")}&background=22177A&color=fff&size=48`}
        alt="User avatar"
        className="w-11 h-11 rounded-full border-2 border-cyan-500 shadow-sm"
      />
      <div>
        <div className="text-sm font-semibold text-gray-800 dark:text-gray-100 capitalize">
          {user?.firstName || ""}
        </div>
        <div className="text-xs text-gray-500 dark:text-gray-400 italic capitalize">
          {user?.role?.name || ""}
        </div>
      </div>
    </div>

    {/* Menu Items */}
    <ul className="space-y-1">
      <li>
        <Link
          to="/setting/inventory"
          onClick={() => setDropdownOpen(false)}
          className="flex items-center gap-2 py-2 px-3 text-sm text-gray-700 dark:text-gray-200 font-medium rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition"
        >
          <svg className="w-4 h-4 text-cyan-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M12 4v16m8-8H4" />
          </svg>
          Settings
        </Link>
      </li>
      <li>
        <button
          onClick={handleSignOut}
          className="w-full flex items-center gap-2 py-2 px-3 text-sm text-red-600 dark:text-red-400 font-medium rounded-lg hover:bg-red-100 dark:hover:bg-red-700 transition"
        >
          <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1m0-10V5" />
          </svg>
          Sign Out
        </button>
      </li>
    </ul>
  </div>
</Transition>


    </div>
  );
}

export default DropdownProfile;
