import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { AppContext } from '../state/AppContext';
import { loginUser } from '../services/auth.service';

interface LoginModalProps {
  isVisible: boolean;
  onClose: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ isVisible, onClose }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { setAppState } = useContext(AppContext);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
        const credential = await loginUser(email, password); 
        const user = credential.user;
  
        // Update AppContext after successful login
        setAppState({ user, userData: null });
  
        Swal.fire({
          icon: 'success',
          title: 'Login Successful',
          text: `Welcome back, ${user.email}!`,
          confirmButtonText: 'OK',
        });
  
        navigate('/');
        onClose();
      } catch (error: any) {
        Swal.fire({
          icon: 'error',
          title: 'Login Failed',
          text: error.message,
          confirmButtonText: 'OK',
        });
      } finally {
        setLoading(false);
      }
    };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75 z-50">
      <div className="bg-grey rounded-lg p-8 max-w-md w-full shadow-lg">
        <h2 className="text-2xl font-bold mb-4">Login</h2>
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              required
            />
          </div>

          <div>
            <button
              type="submit"
              className={`w-full bg-indigo-600 text-white py-2 px-4 rounded-md ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
              disabled={loading}
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </div>
        </form>
        <button
          onClick={onClose}
          className="mt-4 text-indigo-600 underline hover:text-indigo-800 text-sm"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default LoginModal;
