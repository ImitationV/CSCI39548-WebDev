import React, { useState, useEffect } from 'react';
import { supabase } from './SupabaseClient';

// Receive user from the parent component App.jsx
const TodoList = ({ user }) => {
  const [todos, setTodos] = useState([]);
  const [newTaskDescription, setNewTaskDescription] = useState('');
  const [loading, setLoading] = useState(true); // Loading state for fetching todos
  const [error, setError] = useState(null);

  console.log('User: ', user); // Log the user

  // Function to handle user logout
  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        throw error;
      }
      // Supabase auth listener in App.jsx handles state change and redirect
    } catch (error) {
      console.error('Error logging out:', error.message);
      setError(`Failed to log out: ${error.message}`);
    }
  };


  // Fetch todos from Supabase for the user
  const fetchTodos = async () => {
    console.log('fetchTodos called. Current user:', user);

    if (!user) {
      console.log('No user logged in, clearing todos.');
      setTodos([]); // Clear todos if no user is logged in
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null); // Clear previous errors

      console.log('Fetching todos for user :', user.id); // Log the user ID being used

      const { data, error } = await supabase
        .from('todos')
        .select('*')
        .eq('user_id', user.id) // Filter by the logged-in user's ID
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Supabase fetch error:', error.message); // Log Supabase error
        throw error; // Throw the error to be caught by the catch block
      }

      setTodos(data);
    } catch (error) {
      console.error('Error in fetchTodos:', error.message); // Log error
      setError(`Failed to fetch todos: ${error.message}`); // error message from Supabase
    } finally {
      setLoading(false);
      console.log('fetchTodos finished.');
    }
  };

  // Fetch todos whenever the user changes
  useEffect(() => {
      console.log('User prop changed, fetching todos.');
      fetchTodos();
  }, [user]); 


  // Add a new todo
  const addTodo = async (e) => {
    e.preventDefault();
    if (!newTaskDescription.trim()) return;

    if (!user) {
      setError('User not available. Cannot add todo.');
      return;
    }

    try {
      const { data, error } = await supabase
        .from('todos')
        .insert([
          { description: newTaskDescription, is_completed: false, user_id: user.id }
        ])
        .select(); // to return the inserted row

      if (error) {
        throw error;
      }

      // Check if data is not null and has at least one item
      if (data && data.length > 0) {
         setTodos([...todos, data[0]]);
      } else {
         // If data is null or empty, refetch the list to be safe
         fetchTodos();
      }

      setNewTaskDescription(''); // Clear the input field
    } catch (error) {
      console.error('Error adding todo:', error.message);
      setError(`Failed to add todo: ${error.message}`);
    }
  };

  // Update a todo (TRUE/FALSE)
  const updateTodo = async (id, currentStatus) => {
      if (!user) {
          setError('User not available. Cannot update todo.');
          return;
      }
    try {
       // With RLS, the policy would ensure the user can only update their own todos
      const { data, error } = await supabase
        .from('todos')
        .update({ is_completed: !currentStatus })
        .match({ id, user_id: user.id });

      if (error) {
        throw error;
      }

      // Update the state 
      setTodos(todos.map(todo =>
        todo.id === id ? { ...todo, is_completed: !currentStatus } : todo
      ));
    } catch (error) {
      setError(`Failed to update todo: ${error.message}`);
    }
  };

  // Delete a todo
  const deleteTodo = async (id) => {
      if (!user) {
          setError('User not available. Cannot delete todo.');
          return;
      }
    try {
      const { data, error } = await supabase
        .from('todos')
        .delete()
        .match({ id, user_id: user.id });

      if (error) {
        throw error;
      }

      setTodos(todos.filter(todo => todo.id !== id));
    } catch (error) {
      setError(`Failed to delete todo: ${error.message}`);
    }
  };

  if (loading) {
    return <div className="loading">Loading Todos...</div>;
  }

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  if (!user) {
      return (
          <div className="container">
              <h1 className="title">Supabase Todo App</h1>
              <p>Please log in to see and manage your todos.</p>
          </div>
      );
  }

  return (
    <div className="container">
      <div className="header"> 
         <h1 className="title">My To-Do-List</h1>
         <div className="user-info">
             <p>Logged in as: {user.email}</p>
             <button onClick={handleLogout} className="logout-button">Logout</button>
         </div>
      </div>


      {/* Add New Todo Form */}
      <form onSubmit={addTodo} className="add-todo-form">
        <input
          type="text"
          placeholder="Add a new task"
          value={newTaskDescription}
          onChange={(e) => setNewTaskDescription(e.target.value)}
        />
        <button type="submit">
          Add Task
        </button>
      </form>

      {/* Todo List */}
      <ul className="todo-list">
        {todos.map(todo => (
          <li key={todo.id} className="todo-item">
            <span className={todo.is_completed ? 'completed' : ''}>
              {todo.description}
            </span>
            <div className="todo-actions">
              <button
                onClick={() => updateTodo(todo.id, todo.is_completed)}
                className={todo.is_completed ? 'undo-button' : 'done-button'}
              >
                {todo.is_completed ? 'Undo' : 'Done'}
              </button>
              <button
                onClick={() => deleteTodo(todo.id)}
                className="delete-button"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TodoList;
