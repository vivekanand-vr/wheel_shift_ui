import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { loginUser, registerUser } from '../store/actions/authActions';
// Import image
import carBackground from '../assets/car-background.jpg';

const LandingPage = () => {
  const [activeTab, setActiveTab] = useState('login');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);

  // Login form validation schema
  const loginSchema = Yup.object({
    email: Yup.string().email('Invalid email address').required('Email is required'),
    password: Yup.string().required('Password is required'),
  });

  // Register form validation schema
  const registerSchema = Yup.object({
    name: Yup.string().required('Name is required'),
    email: Yup.string().email('Invalid email address').required('Email is required'),
    password: Yup.string()
      .min(6, 'Password must be at least 6 characters')
      .required('Password is required'),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password'), null], 'Passwords must match')
      .required('Confirm password is required'),
  });

  // Login form
  const loginFormik = useFormik({
    initialValues: {
      email: 'admin@ws.com',
      password: 'password',
    },
    validationSchema: loginSchema,
    onSubmit: async (values) => {
      try {
        dispatch(loginUser(values));
        navigate('/dashboard');
      } catch (error) {
        console.error('Login error:', error);
      }
    },
  });

  // Register form
  const registerFormik = useFormik({
    initialValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
    validationSchema: registerSchema,
    onSubmit: async (values) => {
      try {
        const userData = {
          name: values.name,
          email: values.email,
          password: values.password,
        };
        await dispatch(registerUser(userData)).unwrap();
        navigate('/dashboard');
      } catch (error) {
        console.error('Registration error:', error);
      }
    },
  });

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left section - Car Background (70% width on desktop) */}
      <div 
        className="w-full md:w-[70%] min-h-[40vh] md:min-h-screen bg-cover bg-center relative"
        style={{ 
          backgroundImage: `url(${carBackground})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="text-center text-white p-8">
            <h1 className="text-5xl font-bold mb-4">Wheel Shift</h1>
            <p className="text-xl">Your complete solution for used-car trading</p>
          </div>
        </div>
      </div>

      {/* Right section - Auth Form (30% width on desktop) */}
      <div className="w-full md:w-[30%] bg-gray-100 flex items-center justify-center p-6">
        <div className="bg-white rounded-lg shadow-card w-full max-w-sm p-6">
          <h2 className="text-2xl font-bold text-center mb-6">Access Your Account</h2>
          
          {/* Tabs for switching between login and signup */}
          <div className="flex rounded-md bg-gray-200 p-1 mb-6">
            <button 
              className={`flex-1 py-2 rounded-md text-sm font-medium ${
                activeTab === 'login' 
                  ? 'bg-white text-gray-800 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-800'
              }`}
              onClick={() => setActiveTab('login')}
            >
              Login
            </button>
            <button 
              className={`flex-1 py-2 rounded-md text-sm font-medium ${
                activeTab === 'register' 
                  ? 'bg-white text-gray-800 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-800'
              }`}
              onClick={() => setActiveTab('register')}
            >
              Sign Up
            </button>
          </div>

          {/* Error message if any */}
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
              <span className="block sm:inline">{error}</span>
            </div>
          )}

          {/* Login Form */}
          {activeTab === 'login' && (
            <form onSubmit={loginFormik.handleSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="email">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                    loginFormik.touched.email && loginFormik.errors.email 
                      ? 'border-red-500 focus:ring-red-200' 
                      : 'border-gray-300 focus:ring-blue-200 focus:border-blue-400'
                  }`}
                  {...loginFormik.getFieldProps('email')}
                />
                {loginFormik.touched.email && loginFormik.errors.email && (
                  <p className="text-red-500 text-xs mt-1">{loginFormik.errors.email}</p>
                )}
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="password">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  placeholder="Password"
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                    loginFormik.touched.password && loginFormik.errors.password 
                      ? 'border-red-500 focus:ring-red-200' 
                      : 'border-gray-300 focus:ring-blue-200 focus:border-blue-400'
                  }`}
                  {...loginFormik.getFieldProps('password')}
                />
                {loginFormik.touched.password && loginFormik.errors.password && (
                  <p className="text-red-500 text-xs mt-1">{loginFormik.errors.password}</p>
                )}
                <div className="flex justify-end mt-1">
                  <a href="#" className="text-sm text-blue-600 hover:text-blue-800">
                    Forgot password?
                  </a>
                </div>
              </div>

              <div className="mt-6">
                <button 
                  type="submit" 
                  className={`w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300 ${
                    loading ? 'opacity-70 cursor-not-allowed' : ''
                  }`}
                  disabled={loading}
                >
                  {loading ? 'Logging in...' : 'Login'}
                </button>
              </div>
            </form>
          )}

          {/* Register Form */}
          {activeTab === 'register' && (
            <form onSubmit={registerFormik.handleSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="register-name">
                  Name
                </label>
                <input
                  id="register-name"
                  type="text"
                  placeholder="John Doe"
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                    registerFormik.touched.name && registerFormik.errors.name 
                      ? 'border-red-500 focus:ring-red-200' 
                      : 'border-gray-300 focus:ring-blue-200 focus:border-blue-400'
                  }`}
                  {...registerFormik.getFieldProps('name')}
                />
                {registerFormik.touched.name && registerFormik.errors.name && (
                  <p className="text-red-500 text-xs mt-1">{registerFormik.errors.name}</p>
                )}
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="register-email">
                  Email
                </label>
                <input
                  id="register-email"
                  type="email"
                  placeholder="your@email.com"
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                    registerFormik.touched.email && registerFormik.errors.email 
                      ? 'border-red-500 focus:ring-red-200' 
                      : 'border-gray-300 focus:ring-blue-200 focus:border-blue-400'
                  }`}
                  {...registerFormik.getFieldProps('email')}
                />
                {registerFormik.touched.email && registerFormik.errors.email && (
                  <p className="text-red-500 text-xs mt-1">{registerFormik.errors.email}</p>
                )}
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="register-password">
                  Password
                </label>
                <input
                  id="register-password"
                  type="password"
                  placeholder="Password"
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                    registerFormik.touched.password && registerFormik.errors.password 
                      ? 'border-red-500 focus:ring-red-200' 
                      : 'border-gray-300 focus:ring-blue-200 focus:border-blue-400'
                  }`}
                  {...registerFormik.getFieldProps('password')}
                />
                {registerFormik.touched.password && registerFormik.errors.password && (
                  <p className="text-red-500 text-xs mt-1">{registerFormik.errors.password}</p>
                )}
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="register-confirm-password">
                  Confirm Password
                </label>
                <input
                  id="register-confirm-password"
                  type="password"
                  placeholder="Confirm Password"
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                    registerFormik.touched.confirmPassword && registerFormik.errors.confirmPassword 
                      ? 'border-red-500 focus:ring-red-200' 
                      : 'border-gray-300 focus:ring-blue-200 focus:border-blue-400'
                  }`}
                  {...registerFormik.getFieldProps('confirmPassword')}
                />
                {registerFormik.touched.confirmPassword && registerFormik.errors.confirmPassword && (
                  <p className="text-red-500 text-xs mt-1">{registerFormik.errors.confirmPassword}</p>
                )}
              </div>

              <div className="mt-6">
                <button 
                  type="submit" 
                  className={`w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300 ${
                    loading ? 'opacity-70 cursor-not-allowed' : ''
                  }`}
                  disabled={loading}
                >
                  {loading ? 'Signing up...' : 'Sign Up'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default LandingPage;