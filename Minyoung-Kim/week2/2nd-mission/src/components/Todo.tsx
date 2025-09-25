import { useState, type FormEvent, type JSX } from "react";
import type { TTodo } from "../types/todo";
import TodoList from "./TodoList";
import TodoForm from "./TodoForm";
import { useTodo } from "../context/TodoContext";

// JSX import 제거, 반환 타입 JSX.Element 그대로 사용
const Todo = (): JSX.Element => {
  const [input, setInput] = useState<string>('');
  const { todos, completeTodo, addTodo, deleteTodo, doneTodos } = useTodo();

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const text = input.trim();

    if (text) {
      addTodo(text);
      setInput('');
    }
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
