import { useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { ChevronDown, User, LogOut } from "lucide-react";
import { logoutUser } from '../store/actions/authActions';
import { useNavigate } from "react-router-dom";

const Header = ({ title }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const user  = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
      dispatch(logoutUser());
  };
  
  return (
    <header className="bg-white shadow-sm py-4 px-6">
      <div className="flex justify-between items-center">
        {/* Page Title */}
        <h1 className="text-2xl font-bold text-gray-800">{title}</h1>

        {/* User Profile Dropdown */}
        <div className="relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center space-x-2 text-gray-600 focus:outline-none"
          >
            <span>Welcome, {user?.name}</span>
            <img
              src={user?.photoUrl}
              alt="User avatar"
              className="w-10 h-10 rounded-full border"
            />
            <ChevronDown size={18} className="text-gray-500" />
          </button>

          {/* Dropdown Menu */}
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
              <button
                className="flex items-center w-full px-4 py-2 text-gray-700 hover:bg-gray-100"
                onClick={() => {
                  setDropdownOpen(false);
                  // Navigate to profile (Replace with actual routing logic)
                  navigate("/my-profile");
                }}
              >
                <User size={18} className="mr-2" />
                My Profile
              </button>
              <button
                className="flex items-center w-full px-4 py-2 text-red-600 hover:bg-red-100"
                onClick={handleLogout}
              >
                <LogOut size={18} className="mr-2" />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
