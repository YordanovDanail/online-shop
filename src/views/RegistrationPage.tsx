import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { AppContext } from '../state/AppContext';
import { createUser, getEmail, getPhoneNumber, getUserByUsername } from '../services/user.service';
import { registerUser } from '../services/auth.service';
import { EMAIL_REGEX, PASSWORD_REGEX, USER_REGEX, PHONE_REGEX } from '../common/regex';

const RegistrationPage = () => {
  const { setAppState } = useContext(AppContext);
  const navigate = useNavigate();

  const [user, setUser] = useState({
    username: '',
    email: '',
    firstName: '',
    lastName: '',
    password: '',
    confirmPassword: '',
    phoneNumber: '',
  });

  const [loading, setLoading] = useState(false);
  const [hidePassword, setHidePassword] = useState(true);

  const togglePasswordVisibility = () => setHidePassword(!hidePassword);

  const updateUser = (prop: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setUser({ ...user, [prop]: e.target.value });
  };

  const register = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const alertArr: string[] = [];

    if (!USER_REGEX.test(user.username)) {
      alertArr.push('Invalid Username!');
    }
    if (!EMAIL_REGEX.test(user.email)) {
      alertArr.push('Invalid Email address!');
    }
    if (!PASSWORD_REGEX.test(user.password)) {
      alertArr.push('Invalid Password!');
    }
    if (user.password !== user.confirmPassword) {
      alertArr.push("Passwords don't match!");
    }
    if (!PHONE_REGEX.test(user.phoneNumber)) {
      alertArr.push('Phone number must be 10 digits!');
    }

    if (alertArr.length > 0) {
      Swal.fire({
        icon: 'warning',
        title: 'Validation Error',
        text: alertArr.join('\n'),
        confirmButtonText: 'OK',
      });
      setLoading(false);
      return;
    }

    try {
      const userFromDB = await getUserByUsername(user.username);
      if (userFromDB) {
        Swal.fire({
          icon: 'error',
          title: 'Registration Failed',
          text: `Username ${user.username} already exists!`,
          confirmButtonText: 'OK',
        });
        setLoading(false);
        return;
      }

      const emailExists = await getEmail(user.email);
      if (emailExists) {
        Swal.fire({
          icon: 'error',
          title: 'Registration Failed',
          text: 'Email address already exists!',
          confirmButtonText: 'OK',
        });
        setLoading(false);
        return;
      }

      const phoneExists = await getPhoneNumber(user.phoneNumber);
      if (phoneExists) {
        Swal.fire({
          icon: 'error',
          title: 'Registration Failed',
          text: 'Phone number already exists!',
          confirmButtonText: 'OK',
        });
        setLoading(false);
        return;
      }

      // Register the user in Firebase
      const credential = await registerUser(user.email, user.password);
      const userId = credential.user.uid;

      // Create user in the database
      await createUser(
        user.username,
        userId,
        user.email,
        user.firstName,
        user.lastName,
        user.phoneNumber
      );

      Swal.fire({
        icon: 'success',
        title: 'Registration Successful',
        text: 'You have successfully registered.',
        confirmButtonText: 'OK',
      });

      setAppState({ user: user.username, userData: null });
      navigate('/');

      setUser({
        username: '',
        email: '',
        firstName: '',
        lastName: '',
        password: '',
        confirmPassword: '',
        phoneNumber: '',
      });
    } catch (error: any) {
      Swal.fire({
        icon: 'error',
        title: 'Registration Error',
        text: error.message || 'An unknown error occurred',
        confirmButtonText: 'OK',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white shadow-md rounded-lg p-8 max-w-lg w-full">
        <h1 className="text-4xl font-bold text-center mb-6 text-indigo-600">Create an Account</h1>
        <form onSubmit={register} className="space-y-4">
          {/* Username */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Username</label>
            <input
              type="text"
              value={user.username}
              onChange={updateUser('username')}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              required
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              value={user.email}
              onChange={updateUser('email')}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              required
            />
          </div>

          {/* First Name and Last Name */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">First Name</label>
              <input
                type="text"
                value={user.firstName}
                onChange={updateUser('firstName')}
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Last Name</label>
              <input
                type="text"
                value={user.lastName}
                onChange={updateUser('lastName')}
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                required
              />
            </div>
          </div>

          {/* Phone Number */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Phone Number</label>
            <input
              type="tel"
              value={user.phoneNumber}
              onChange={updateUser('phoneNumber')}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              required
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type={hidePassword ? 'password' : 'text'}
              value={user.password}
              onChange={updateUser('password')}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              required
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="text-sm text-indigo-600 mt-1"
            >
              {hidePassword ? 'Show Password' : 'Hide Password'}
            </button>
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
            <input
              type="password"
              value={user.confirmPassword}
              onChange={updateUser('confirmPassword')}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              required
            />
          </div>

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              className={`w-full bg-indigo-600 text-white py-3 px-4 rounded-md font-semibold hover:bg-indigo-700 transition-colors duration-300 ${
                loading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              disabled={loading}
            >
              {loading ? 'Registering...' : 'Create Account'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegistrationPage;
