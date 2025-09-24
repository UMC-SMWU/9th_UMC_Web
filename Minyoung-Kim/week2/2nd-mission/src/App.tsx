import './App.css'
import TodoBefore from './components/TodoBefore';
import Todo from './components/Todo';

function App() : Element {
  return (
    <>
      <Todo />
      <TodoBefore/>
    </>
  );
}

export default App;