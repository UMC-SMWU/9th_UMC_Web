import './App.css';
import Todo from './components/Todo';
import type { JSX } from 'react';
import { TodoProvider } from './context/TodoContext';

function App(): JSX.Element {
  return (
    <TodoProvider>
      <Todo />
    </TodoProvider>
  );
}

export default App;
