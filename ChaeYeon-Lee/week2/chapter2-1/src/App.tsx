import './App.css';
import TodoBefore from './components/TodoBefore';
import Todo from './components/TodoBefore';
import { TodoProvider } from './context/TodoContext';

function App() : Element {
  return (
    <TodoProvider>
      <Todo />
    </TodoProvider>
  );
}

export default App;