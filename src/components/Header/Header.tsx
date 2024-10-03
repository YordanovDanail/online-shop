import { useContext, useState } from 'react';
import { AppContext } from '../../state/AppContext';
import { NavLink, useNavigate } from 'react-router-dom';
import LoginModal from '../LoginModal/LoginModal';
import LogoutButton from '../LogoutButton/LogoutButton';

const Header: React.FC = () => {
  const { user } = useContext(AppContext);
  const [isLoginModalVisible, setLoginModalVisible] = useState(false);
  const navigate = useNavigate();

  return (
    <header className="p-4 bg-gray-800 text-white flex justify-between items-center">
      <h1 className="text-2xl font-bold">Online Shop</h1>
      <nav className="space-x-4">
        <NavLink to="/" className="text-white hover:text-gray-300">
          Home
        </NavLink>
        <NavLink
          to="/items"
          className="text-white hover:text-teal-300 font-semibold transition duration-300"
        >
          Items
        </NavLink>

        {/* Conditionally render login/register or logout button */}
        {user ? (
          <LogoutButton />
        ) : (
          <>
            <button
              onClick={() => setLoginModalVisible(true)}
              className="bg-teal-600 text-white px-4 py-2 rounded hover:bg-teal-700 transition duration-300"
            >
              Login
            </button>
            <button
              onClick={() => navigate('/register')}
              className="bg-teal-600 text-white px-4 py-2 rounded hover:bg-teal-700 transition duration-300"
            >
              Register
            </button>
          </>
        )}
      </nav>

      {/* Login Modal */}
      <LoginModal isVisible={isLoginModalVisible} onClose={() => setLoginModalVisible(false)} />
    </header>
  );
};

export default Header;
