import React, { useState, useEffect } from 'react';
import { supabase } from './SupabaseClient';

const TodoList = () => {
  const [todos, setTodos] = useState([]);
  const [newTaskDescription, setNewTaskDescription] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch todos from Supabase
  const fetchTodos = async () => {
    try {
      setLoading(true);
      // In a real app with RLS, you would filter by the logged-in user's ID like this:
      // const { data, error } = await supabase
      //   .from('todos')
      //   .select('*')
      //   .eq('user_id', (await supabase.auth.getUser()).data.user.id) // Requires authenticated user
      //   .order('created_at', { ascending: true });

      const { data, error } = await supabase
        .from('todos')
        .select('*')
        .order('created_at', { ascending: true });


      if (error) {
        throw error;
      }
      setTodos(data);
    } catch (error) {
      console.error('Error fetching todos:', error.message);
      setError('Failed to fetch todos.');
    } finally {
      setLoading(false);
    }
  };

  // Add a new todo
  const addTodo = async (e) => {
    e.preventDefault();
    if (!newTaskDescription.trim()) return;

    try {

      const { data, error } = await supabase
        .from('todos')
        .insert([
          { description: newTaskDescription, is_completed: false }
        ]);


      if (error) {
        throw error;
      }

      if (data && data.length > 0) {
         setTodos([...todos, data[0]]);
      } else {
         fetchTodos();
      }

      setNewTaskDescription(''); 
    } catch (error) {
      console.error('Error adding todo:', error.message);
      setError(`Failed to add todo: ${error.message}`);
    }
  };

  // Update a todo 
  const updateTodo = async (id, currentStatus) => {
    try {
      const { data, error } = await supabase
        .from('todos')
        .update({ is_completed: !currentStatus })
        .match({ id });

      if (error) {
        throw error;
      }

      setTodos(todos.map(todo =>
        todo.id === id ? { ...todo, is_completed: !currentStatus } : todo
      ));
    } catch (error) {
      console.error('Error updating todo:', error.message);
      setError(`Failed to update todo: ${error.message}`); 
    }
  };

  // Delete a todo
  const deleteTodo = async (id) => {
    try {
      const { data, error } = await supabase
        .from('todos')
        .delete()
        .match({ id });

      if (error) {
        throw error;
      }

      setTodos(todos.filter(todo => todo.id !== id));
    } catch (error) {
      console.error('Error deleting todo:', error.message);
      setError(`Failed to delete todo: ${error.message}`); 
    }
  };

  // Fetch todos when the component mounts
  useEffect(() => {
    fetchTodos();
  }, []); // Empty dependency array means this runs once on mount

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  return (
    <div className="container">
      <h1 className="title">Supabase Todo App</h1>

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
