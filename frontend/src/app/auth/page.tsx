'use client';
import React, { useState, useEffect } from 'react';
import { LogIn, UserPlus, Loader2, AlertTriangle, CheckCircle, Search } from 'lucide-react';

// IMPORTANT: Replace this with your actual Laravel API base URL
// Ensure your Laravel cors.php allows the origin where this frontend is running (e.g., http://localhost:3000)
const API_BASE_URL = "http://localhost:8000/api"; 

// --- Utility Components ---

/**
 * A simple, styled button component.
 */
const AuthButton = ({ onClick, loading, children, icon: Icon, variant = 'primary' }) => {
  const baseStyle = "w-full flex items-center justify-center px-4 py-3 font-semibold rounded-lg shadow-md transition duration-300 disabled:cursor-not-allowed text-lg";
  
  const styleMap = {
    primary: "bg-indigo-600 text-white hover:bg-indigo-700 disabled:bg-indigo-400",
    secondary: "bg-gray-200 text-indigo-700 hover:bg-gray-300 disabled:bg-gray-300",
  };

  return (
    <button
      onClick={onClick}
      disabled={loading}
      className={`${baseStyle} ${styleMap[variant]}`}
    >
      {loading ? (
        <>
          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
          Processing...
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

/**
 * Displays status or error messages.
 */
const StatusMessage = ({ type, message }) => {
  if (!message) return null;

  const styleMap = {
    error: {
      bg: 'bg-red-100 border-red-400 text-red-700',
      icon: <AlertTriangle className="h-5 w-5" />,
    },
    success: {
    bg: 'bg-green-100 border-green-400 text-green-700',
    icon: <CheckCircle className="h-5 w-5" />,
    },
  };

  const { bg, icon } = styleMap[type] || styleMap.error;

  return (
    <div className={`p-4 mb-4 border-l-4 ${bg} rounded-md flex items-center`} role="alert">
      <span className="mr-3">{icon}</span>
      <p className="font-medium text-sm">{message}</p>
    </div>
  );
};

// Function to fetch the CSRF cookie before any stateful request
const fetchCsrfCookie = async () => {
    try {
        const csrfUrl = `${API_BASE_URL.replace('/api','')}/sanctum/csrf-cookie`;
        console.log(`Fetching CSRF cookie from: ${csrfUrl}`);
        await fetch(csrfUrl, {
            method: 'GET',
            credentials: 'include',
        });
        console.log('CSRF cookie fetch successful.');
    } catch (error) {
        console.error('Error fetching CSRF cookie:', error);
        throw new Error('Could not retrieve CSRF cookie. Check API URL and CORS configuration.');
    }
}


// --- Form Components ---

const RegisterForm = ({ navigateTo }) => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [status, setStatus] = useState({ type: '', message: '' });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setStatus({ type: '', message: '' }); // Clear status on change
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: '', message: '' });

    try {
      // Step 1: Get CSRF cookie (Crucial for stateful POST requests like register)
      await fetchCsrfCookie();

      // Step 2: Send the POST request with credentials
      const response = await fetch(`${API_BASE_URL}/register`, {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json',
            // Note: The X-XSRF-TOKEN is automatically sent by the browser 
            // if the cookie was successfully received in Step 1.
        },
        body: JSON.stringify(formData),
        credentials: 'include', // <-- This is key for sending the cookie back
      });

      const data = await response.json();

      if (response.ok) {
        // Registration successful
        console.log('Registration Successful:', data);
        setStatus({ type: 'success', message: `Registration successful! You can now log in.` });
        // Automatically navigate to login after a brief pause
        setTimeout(() => navigateTo('login'), 3000);
      } else {
        // Handle validation or other API errors
        let errorMessage = 'Registration failed. Please check your inputs.';
        if (data.errors) {
          // Laravel validation errors
          errorMessage = Object.values(data.errors).flat().join(' ');
        } else if (data.message) {
            errorMessage = data.message;
        }
        setStatus({ type: 'error', message: errorMessage });
      }
    } catch (error) {
      console.error('Operation Error:', error);
      setStatus({ type: 'error', message: `An error occurred: ${error.message || 'Could not connect to the API.'}` });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 md:p-10">
      <h2 className="text-3xl font-extrabold text-gray-900 mb-6 text-center flex items-center justify-center">
        <UserPlus className="w-7 h-7 mr-2 text-indigo-600" /> Register Account
      </h2>
      <StatusMessage type={status.type} message={status.message} />
      
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
          <input
            id="name"
            name="name"
            type="text"
            required
            value={formData.name}
            onChange={handleChange}
            placeholder="Your Full Name"
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 transition duration-150"
          />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label>
          <input
            id="email"
            name="email"
            type="email"
            required
            value={formData.email}
            onChange={handleChange}
            placeholder="you@example.com"
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 transition duration-150"
          />
        </div>
        <div>
          <label htmlFor="password-reg" className="block text-sm font-medium text-gray-700">Password</label>
          <input
            id="password-reg"
            name="password"
            type="password"
            required
            minLength="6"
            value={formData.password}
            onChange={handleChange}
            placeholder="Min 6 characters"
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 transition duration-150"
          />
        </div>
        
        <AuthButton loading={loading} icon={UserPlus}>
          Register
        </AuthButton>
      </form>
      
      <p className="mt-6 text-center text-sm text-gray-600">
        Already have an account?{' '}
        <button
          onClick={() => navigateTo('login')}
          className="font-medium text-indigo-600 hover:text-indigo-500 transition duration-150"
        >
          Login here
        </button>
      </p>
    </div>
  );
};

const LoginForm = ({ navigateTo }) => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [status, setStatus] = useState({ type: '', message: '' });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setStatus({ type: '', message: '' }); // Clear status on change
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: '', message: '' });

    try {
      // Step 1: Get CSRF cookie (Best practice for stateful API post requests, including login)
      await fetchCsrfCookie();
        
      // Step 2: Send the Login POST request
      const response = await fetch(`${API_BASE_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
        credentials: 'include', // <-- CRITICAL: Include this to send session/CSRF cookies
      });

      const data = await response.json();

      if (response.ok) {
        // Login successful
        console.log('Login Successful:', data);
        setStatus({ type: 'success', message: `Welcome back, ${data.user.name}! Token: ${data.token.substring(0, 20)}...` });
        // In a real app, you would store the token and user data here.
      } else {
        // Handle invalid credentials or other API errors
        let errorMessage = 'Login failed. Invalid email or password.';
        if (data.errors && data.errors.email) {
            errorMessage = data.errors.email[0];
        } else if (data.message) {
            errorMessage = data.message;
        }
        setStatus({ type: 'error', message: errorMessage });
      }
    } catch (error) {
      console.error('Operation Error:', error);
      setStatus({ type: 'error', message: `An error occurred: ${error.message || 'Could not connect to the API.'}` });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 md:p-10">
      <h2 className="text-3xl font-extrabold text-gray-900 mb-6 text-center flex items-center justify-center">
        <LogIn className="w-7 h-7 mr-2 text-indigo-600" /> Log in to your account
      </h2>
      <StatusMessage type={status.type} message={status.message} />
      
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label htmlFor="email-login" className="block text-sm font-medium text-gray-700">Email Address</label>
          <input
            id="email-login"
            name="email"
            type="email"
            required
            value={formData.email}
            onChange={handleChange}
            placeholder="you@example.com"
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 transition duration-150"
          />
        </div>
        <div>
          <label htmlFor="password-login" className="block text-sm font-medium text-gray-700">Password</label>
          <input
            id="password-login"
            name="password"
            type="password"
            required
            value={formData.password}
            onChange={handleChange}
            placeholder="••••••••"
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 transition duration-150"
          />
        </div>
        
        <AuthButton loading={loading} icon={LogIn}>
          Log in
        </AuthButton>
      </form>
      
      <p className="mt-6 text-center text-sm text-gray-600">
        Don't have an account?{' '}
        <button
          onClick={() => navigateTo('register')}
          className="font-medium text-indigo-600 hover:text-indigo-500 transition duration-150"
        >
          Register now
        </button>
      </p>
    </div>
  );
};

const NotFound = ({ navigateTo }) => (
  <div className="p-8 md:p-10 text-center">
    <Search className="w-16 h-16 mx-auto mb-6 text-gray-400" />
    <h2 className="text-3xl font-extrabold text-gray-900 mb-3">Page Not Found</h2>
    <p className="text-gray-600 mb-8 max-w-sm mx-auto">
      The authentication path you are looking for doesn't exist. Please use #login or #register in the URL.
    </p>
    <AuthButton onClick={() => navigateTo('login')} variant="secondary">
      Go to Login Page
    </AuthButton>
  </div>
);

/**
 * Safely determines the view from the URL hash, only running in a browser environment.
 * @returns {'login' | 'register'}
 */
const getClientViewFromHash = () => {
    if (typeof window !== 'undefined' && window.location.hash) {
        const hash = window.location.hash.substring(1).toLowerCase();
        if (hash === 'register') return 'register';
    }
    // Default to login if window is not defined, or hash is empty/invalid
    return 'login'; 
};

// --- Main Application Component ---

const App = () => {
  // Initialize currentView to a safe default value ('login') to prevent SSR errors
  const [currentView, setCurrentView] = useState('login'); 

  // Function to navigate by updating the URL hash
  const navigateTo = (view) => {
    // Setting window.location.hash triggers the 'hashchange' event
    window.location.hash = view;
  };

  // Effect to handle initial load (client-side only) and hash changes
  useEffect(() => {
    // Ensure we are running client-side before accessing window
    if (typeof window === 'undefined') return;

    // 1. Initial Load: Set the view based on the current hash
    setCurrentView(getClientViewFromHash());

    // 2. Hash Change Listener
    const handleHashChange = () => {
      setCurrentView(getClientViewFromHash());
    };

    window.addEventListener('hashchange', handleHashChange);
    
    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);

  // Set page title for better UX
  useEffect(() => {
    const titleMap = {
      'login': 'Login Page',
      'register': 'Register Account',
    };
    document.title = titleMap[currentView] || 'Authentication App';
  }, [currentView]);

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4 sm:p-6 lg:p-8 font-[Inter] antialiased">
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&display=swap');
        body { font-family: 'Inter', sans-serif; }
      `}</style>
      
      <div className="w-full max-w-lg bg-white rounded-xl shadow-2xl overflow-hidden transition-all duration-500">
        {/* Render the correct component based on the URL hash */}
        {currentView === 'login' && <LoginForm navigateTo={navigateTo} />}
        {currentView === 'register' && <RegisterForm navigateTo={navigateTo} />}
        {currentView !== 'login' && currentView !== 'register' && <NotFound navigateTo={navigateTo} />}
      </div>
      
      <footer className="fixed bottom-0 left-0 right-0 p-2 text-center text-xs text-gray-500 bg-gray-50/70 backdrop-blur-sm">
        <p>API Base URL: <code className="font-mono text-indigo-600">{API_BASE_URL}</code> (Update this in the code)</p>
      </footer>
    </div>
  );
};

export default App;