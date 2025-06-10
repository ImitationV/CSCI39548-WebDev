import React, { useState } from 'react';
import { supabase } from './SupabaseClient';

const Auth = () => {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false); 
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setError(error.message);
    } else {
      setMessage('Logged in successfully!');
    }
    setLoading(false);
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    const { data, error } = await supabase.auth.signUp({ email, password });

    if (error) {
      setError(error.message);
    } else {
      setMessage('Sign up successful! Please check your email to confirm.');
    }
    setLoading(false);
  };

  return (
    <div className="container">
      <h1 className="title">{isSignUp ? 'Create Account' : 'Login'}</h1>
      <p>Sign in or create an account to manage your todos.</p>

      <form onSubmit={isSignUp ? handleSignUp : handleLogin} className="add-todo-form">
        <input
          type="email"
          placeholder="Your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={loading}
        />
        <input
          type="password"
          placeholder="Your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={loading}
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Loading...' : (isSignUp ? 'Sign Up' : 'Login')}
        </button>
      </form>

      {error && <p className="error">{error}</p>}
      {message && <p className="message">{message}</p>}

      <button
        className="switch-auth-button" 
        onClick={() => setIsSignUp(!isSignUp)}
        disabled={loading}
      >
        {isSignUp ? 'Already have an account? Login' : 'Need an account? Sign Up'}
      </button>
    </div>
  );
};

export default Auth;
