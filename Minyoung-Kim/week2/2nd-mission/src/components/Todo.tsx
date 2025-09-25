import { useState, type FormEvent, type JSX } from "react";
import type { TTodo } from "../types/todo";
import TodoList from "./TodoList";
import TodoForm from "./TodoForm";

// ✅ JSX import 제거, 반환 타입 JSX.Element 그대로 사용
const Todo = (): JSX.Element => {
  const [todos, setTodos] = useState<TTodo[]>([]);
  const [doneTodos, setDoneTodos] = useState<TTodo[]>([]);
  const [input, setInput] = useState<string>("");

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const text = input.trim();
    if (text) {
      const newTodo: TTodo = { id: Date.now(), text };
      setTodos(prev => [...prev, newTodo]);
      setInput("");
    }
  };

  const completeTodo = (todo: TTodo) => {
    setTodos(prev => prev.filter(t => t.id !== todo.id));
    setDoneTodos(prev => [...prev, todo]);
  };

  const deleteTodo = (todo: TTodo) => {
    setDoneTodos(prev => prev.filter(t => t.id !== todo.id));
  };

  return (
    <div className="todo-container">
      <h1 className="todo-container__header">YONG TODO</h1>
      <TodoForm input={input} setInput={setInput} handleSubmit={handleSubmit} />
      <div className="render-container">
        <TodoList
          title="할 일"
          todos={todos}
          buttonLabel="완료"
          buttonColor="#28a745"
          onClick={completeTodo}
        />
        <TodoList
          title="완료"
          todos={doneTodos}
          buttonLabel="삭제"
          buttonColor="#dc3545"
          onClick={deleteTodo}
        />
      </div>
    </div>
  );
};

export default Todo;
