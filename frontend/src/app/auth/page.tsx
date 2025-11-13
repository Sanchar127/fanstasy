'use client';
import React, { useState, useEffect } from 'react';
import { LogIn, UserPlus, Loader2, AlertTriangle, CheckCircle, Search, User, LogOut, Shield } from 'lucide-react';

const API_BASE_URL = "http://127.0.0.1:8000/api";

// --- Auth Storage Helpers ---
const storeAuthData = (token, user) => {
  localStorage.setItem('authToken', token);
  localStorage.setItem('user', JSON.stringify(user));
};

const clearAuthData = () => {
  localStorage.removeItem('authToken');
  localStorage.removeItem('user');
};

const getAuthData = () => {
  const token = localStorage.getItem('authToken');
  const userJson = localStorage.getItem('user');
  if (token && userJson) {
    try {
      return { token, user: JSON.parse(userJson) };
    } catch {
      clearAuthData();
      return { token: null, user: null };
    }
  }
  return { token: null, user: null };
};

// --- Utility Components ---
const AuthButton = ({ onClick, loading, children, icon: Icon, variant = 'primary' }) => {
  const baseStyle = "w-full flex items-center justify-center px-4 py-3 font-semibold rounded-lg shadow-md transition duration-300 disabled:cursor-not-allowed text-lg";
  const styleMap = {
    primary: "bg-indigo-600 text-white hover:bg-indigo-700 disabled:bg-indigo-400",
    secondary: "bg-gray-200 text-indigo-700 hover:bg-gray-300 disabled:bg-gray-300",
    danger: "bg-red-500 text-white hover:bg-red-600 disabled:bg-red-300",
  };
  return (
    <button onClick={onClick} disabled={loading} className={`${baseStyle} ${styleMap[variant] || styleMap.primary}`}>
      {loading ? (
        <>
          <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Processing...
        </>
      ) : (
        <>
          {Icon && <Icon className="mr-2 h-5 w-5" />}
          {children}
        </>
      )}
    </button>
  );
};

const StatusMessage = ({ type, message }) => {
  if (!message) return null;
  const styleMap = {
    error: { bg: 'bg-red-100 border-red-400 text-red-700', icon: <AlertTriangle className="h-5 w-5" /> },
    success: { bg: 'bg-green-100 border-green-400 text-green-700', icon: <CheckCircle className="h-5 w-5" /> },
  };
  const { bg, icon } = styleMap[type] || styleMap.error;
  return (
    <div className={`p-4 mb-4 border-l-4 ${bg} rounded-md flex items-center`} role="alert">
      <span className="mr-3">{icon}</span>
      <p className="font-medium text-sm">{message}</p>
    </div>
  );
};

const fetchCsrfCookie = async () => {
  try {
    const csrfUrl = `${API_BASE_URL.replace('/api','')}/sanctum/csrf-cookie`;
    await fetch(csrfUrl, { method: 'GET', credentials: 'include' });
  } catch (error) {
    console.error('Error fetching CSRF cookie:', error);
    throw new Error('Could not retrieve CSRF cookie. Check API URL and CORS configuration.');
  }
};

// --- Forms ---
const RegisterForm = ({ navigateTo }) => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [status, setStatus] = useState({ type: '', message: '' });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setStatus({ type: '', message: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: '', message: '' });
    try {
      await fetchCsrfCookie();
      const response = await fetch(`${API_BASE_URL}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
        credentials: 'include',
      });
      const data = await response.json();
      if (response.ok) {
        setStatus({ type: 'success', message: `Registration successful! Redirecting to login...` });
        setTimeout(() => navigateTo('login'), 3000);
      } else {
        const errorMessage = data.errors ? Object.values(data.errors).flat().join(' ') : data.message || 'Registration failed';
        setStatus({ type: 'error', message: errorMessage });
      }
    } catch (error) {
      setStatus({ type: 'error', message: `An error occurred: ${error.message}` });
    } finally { setLoading(false); }
  };

  return (
    <div className="p-8 md:p-10">
      <h2 className="text-3xl font-extrabold text-gray-900 mb-6 text-center flex items-center justify-center">
        <UserPlus className="w-7 h-7 mr-2 text-indigo-600" /> Register Account
      </h2>
      <StatusMessage type={status.type} message={status.message} />
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700">Name</label>
          <input name="name" type="text" required value={formData.name} onChange={handleChange}
            placeholder="Your Full Name"
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 transition duration-150"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Email Address</label>
          <input name="email" type="email" required value={formData.email} onChange={handleChange}
            placeholder="you@example.com"
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 transition duration-150"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Password</label>
          <input name="password" type="password" required minLength="6" value={formData.password} onChange={handleChange}
            placeholder="Min 6 characters"
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 transition duration-150"
          />
        </div>
        <AuthButton loading={loading} icon={UserPlus}>Register</AuthButton>
      </form>
      <p className="mt-6 text-center text-sm text-gray-600">
        Already have an account?{' '}
        <button onClick={() => navigateTo('login')} className="font-medium text-indigo-600 hover:text-indigo-500 transition duration-150">
          Login here
        </button>
      </p>
    </div>
  );
};

const LoginForm = ({ setAuth, navigateTo }) => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [status, setStatus] = useState({ type: '', message: '' });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setStatus({ type: '', message: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: '', message: '' });
    try {
      await fetchCsrfCookie();
      const response = await fetch(`${API_BASE_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
        credentials: 'include',
      });
      const data = await response.json();
      if (response.ok) {
        storeAuthData(data.token, data.user);
        setAuth(data.token, data.user);
        setStatus({ type: 'success', message: `Welcome back, ${data.user.name}! Redirecting...` });
      } else {
        const errorMessage = data.errors?.email?.[0] || data.message || 'Login failed';
        setStatus({ type: 'error', message: errorMessage });
      }
    } catch (error) {
      setStatus({ type: 'error', message: `An error occurred: ${error.message}` });
    } finally { setLoading(false); }
  };

  return (
    <div className="p-8 md:p-10">
      <h2 className="text-3xl font-extrabold text-gray-900 mb-6 text-center flex items-center justify-center">
        <LogIn className="w-7 h-7 mr-2 text-indigo-600" /> Log in to your account
      </h2>
      <StatusMessage type={status.type} message={status.message} />
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700">Email Address</label>
          <input name="email" type="email" required value={formData.email} onChange={handleChange}
            placeholder="you@example.com"
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 transition duration-150"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Password</label>
          <input name="password" type="password" required value={formData.password} onChange={handleChange}
            placeholder="••••••••"
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 transition duration-150"
          />
        </div>
        <AuthButton loading={loading} icon={LogIn}>Log in</AuthButton>
      </form>
      <p className="mt-6 text-center text-sm text-gray-600">
        Don't have an account?{' '}
        <button onClick={() => navigateTo('register')} className="font-medium text-indigo-600 hover:text-indigo-500 transition duration-150">
          Register now
        </button>
      </p>
    </div>
  );
};

// --- Dashboards ---
const AdminDashboard = ({ user, handleLogout }) => (
  <div className="p-8 md:p-10 bg-red-50 border-t-4 border-red-500">
    <h2 className="text-3xl font-extrabold text-gray-900 mb-6 text-center flex items-center justify-center">
      <Shield className="w-7 h-7 mr-2 text-red-600" /> Admin Dashboard
    </h2>
    <div className="bg-white p-6 rounded-lg shadow-md space-y-3">
      <p className="text-lg font-semibold text-red-700">Administrator: {user.name}</p>
      <p className="text-sm text-gray-700">Restricted admin area.</p>
    </div>
    <div className="mt-8">
      <AuthButton onClick={handleLogout} variant="danger" icon={LogOut}>Logout</AuthButton>
    </div>
  </div>
);

const UserDashboard = ({ user, token, handleLogout }) => {
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState({ type: '', message: '' });

  useEffect(() => {
    if (!token) return;
    const fetchProfile = async () => {
      setLoading(true);
      setStatus({ type: '', message: '' });
      try {
        const response = await fetch(`${API_BASE_URL}/user`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        });
        const data = await response.json();
        if (response.ok) {
          setProfileData(data);
          setStatus({ type: 'success', message: 'Successfully fetched protected user data.' });
        } else if (response.status === 401) {
          setStatus({ type: 'error', message: 'Unauthorized. Token may have expired.' });
          handleLogout();
        } else {
          setStatus({ type: 'error', message: data.message || 'Failed to fetch profile.' });
        }
      } catch {
        setStatus({ type: 'error', message: 'Network error while fetching profile.' });
      } finally { setLoading(false); }
    };
    fetchProfile();
  }, [token, handleLogout]);

  return (
    <div className="p-8 md:p-10">
      <h2 className="text-3xl font-extrabold text-gray-900 mb-6 text-center flex items-center justify-center">
        <User className="w-7 h-7 mr-2 text-indigo-600" /> Welcome, {user.name}
      </h2>
      <StatusMessage type={status.type} message={status.message} />
      <div className="bg-gray-50 p-6 rounded-lg shadow-inner space-y-3">
        <p className="text-sm text-gray-700"><b>Role:</b> {user.role || 'user'}</p>
        <p className="text-sm text-gray-700"><b>Email:</b> {user.email}</p>
        <div className="pt-4 border-t border-gray-200">
          <h4 className="font-semibold text-gray-800 mb-2">Protected API Data</h4>
          {loading ? <p className="text-indigo-500 flex items-center"><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Loading...</p> :
            <pre className="bg-white p-3 rounded-md overflow-auto text-xs text-gray-700">{JSON.stringify(profileData, null, 2)}</pre>}
        </div>
      </div>
      <div className="mt-8">
        <AuthButton onClick={handleLogout} variant="danger" icon={LogOut}>Logout</AuthButton>
      </div>
    </div>
  );
};

// --- Not Found ---
const NotFound = ({ navigateTo }) => (
  <div className="p-8 md:p-10 text-center">
    <Search className="w-16 h-16 mx-auto mb-6 text-gray-400" />
    <h2 className="text-3xl font-extrabold text-gray-900 mb-3">Page Not Found</h2>
    <p className="text-gray-600 mb-8 max-w-sm mx-auto">The authentication path doesn't exist. Use #login or #register in the URL.</p>
    <AuthButton onClick={() => navigateTo('login')} variant="secondary">Go to Login Page</AuthButton>
  </div>
);

// --- Main App ---
const getClientViewFromHash = () => {
  if (typeof window !== 'undefined' && window.location.hash) {
    const hash = window.location.hash.substring(1).toLowerCase();
    if (hash === 'register') return 'register';
  }
  return 'login';
};

const App = () => {
  const [auth, setAuth] = useState({ token: null, user: null });
  const [currentView, setCurrentView] = useState('login');

  useEffect(() => {
    const storedAuth = getAuthData();
    if (storedAuth.token) setAuth(storedAuth);
    setCurrentView(getClientViewFromHash());

    const handleHashChange = () => setCurrentView(getClientViewFromHash());
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const updateAuth = (token, user) => {
    setAuth({ token, user });
    const redirectUrl = localStorage.getItem('redirectAfterLogin');
    if (redirectUrl) {
      localStorage.removeItem('redirectAfterLogin');
      window.location.href = redirectUrl;
    } else {
      window.location.hash = user.role === 'admin' ? 'admin/dashboard' : 'profile';
    }
  };

  const handleLogout = () => {
    clearAuthData();
    setAuth({ token: null, user: null });
    window.location.hash = 'login';
  };

  const navigateTo = (view) => {
    window.location.hash = view;
  };

  useEffect(() => {
    document.title = auth.token ? (auth.user?.role === 'admin' ? 'Admin Dashboard' : 'User Dashboard') :
      currentView === 'register' ? 'Register Account' : 'Login Page';
  }, [currentView, auth.token, auth.user]);

  const renderContent = () => {
    if (auth.token && auth.user) {
      if (auth.user.role === 'admin') return <AdminDashboard user={auth.user} handleLogout={handleLogout} />;
      return <UserDashboard user={auth.user} token={auth.token} handleLogout={handleLogout} />;
    }
    if (currentView === 'login') return <LoginForm setAuth={updateAuth} navigateTo={navigateTo} />;
    if (currentView === 'register') return <RegisterForm navigateTo={navigateTo} />;
    return <NotFound navigateTo={navigateTo} />;
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4 sm:p-6 lg:p-8 font-[Inter] antialiased">
      <style jsx global>{`@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&display=swap'); body { font-family: 'Inter', sans-serif; }`}</style>
      <div className="w-full max-w-lg bg-white rounded-xl shadow-2xl overflow-hidden transition-all duration-500">
        {renderContent()}
      </div>
    </div>
  );
};

export default App;
