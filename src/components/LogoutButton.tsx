import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { useContext } from 'react';
import { AppContext } from '../state/AppContext';
import { auth } from '../config/firebase-config';

const LogoutButton = () => {
  const navigate = useNavigate();
  const { setAppState } = useContext(AppContext);

  const handleLogout = async () => {
    try {
      await auth.signOut();

      setAppState({ user: null, userData: null });

      Swal.fire({
        icon: 'success',
        title: 'Logged Out',
        text: 'You have been logged out.',
        confirmButtonText: 'OK',
      });

      navigate('/');
    } catch (error: any) {
      Swal.fire({
        icon: 'error',
        title: 'Logout Failed',
        text: error.message,
        confirmButtonText: 'OK',
      });
    }
  };

  return (
    <button
      onClick={handleLogout}
      className="bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 transition-colors"
    >
      Logout
    </button>
  );
};

export default LogoutButton;
