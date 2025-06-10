import React, { useState, useEffect } from 'react';
import TodoList from './TodoList.jsx';
import Auth from './Auth.jsx';
import { supabase } from './SupabaseClient';
import './styles.css';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // Add loading state for initial auth check

  console.log('App component rendered. Current user:', user); // Log user state in App

  useEffect(() => {
    console.log('App useEffect: Checking initial auth state and setting up listener.');

    // Check initial auth state
    const fetchUser = async () => {
      console.log('App useEffect: Calling supabase.auth.getUser()');
      const { data: { user } } = await supabase.auth.getUser();
      console.log('App useEffect: Initial user from getUser:', user);
      setUser(user);
      setLoading(false);
    };

    fetchUser();

    // Listen for authentication state changes
    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      console.log('App authStateChange event:', _event);
      console.log('App authStateChange session:', session);
      console.log('App authStateChange user:', session?.user || null);
      setUser(session?.user || null);
       // setLoading(false); 
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []); // this runs once on mount and cleans up on unmount

  // Log user state whenever it changes
  useEffect(() => {
      console.log('App useEffect: User state changed to:', user);
  }, [user]);


  if (loading) {
    return <div className="loading">Loading authentication...</div>; 
  }

  return (
    <div className="App">
      {!user ? <Auth /> : <TodoList user={user} />} 
    </div>
  );
}

export default App;
