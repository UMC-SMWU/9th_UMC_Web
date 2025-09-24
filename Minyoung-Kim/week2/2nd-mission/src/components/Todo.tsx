import { useState, type FormEvent } from "react";
import type { TTodo } from "../types/todo";

const Todo = () : Element => {

    const [todos, setTodos] = useState<TTodo[]>([]);
      const [doneTodos, setDoneTodos] = useState<TTodo[]>([]);
      const [input, setInput] = useState<string>('');
    
      const handleSubmit = (e: FormEvent<HTMLFormElement>) : void => {
        e.preventDefault();
        const text = input.trim();
    
        if (text) {
            const newTodo: TTodo = { id: Date.now(), text };
            setTodos((prevTodos) : TTodo[] => [...prevTodos, newTodo]);
            setInput('');
        }
      };
    
      const completeTodo = (todo: TTodo) : void => {
        setTodos((prevTodos) : TTodo[] => prevTodos.filter((t) : boolean => t.id !== todo.id));
        setDoneTodos((prevDoneTodos): TTodo[] => [...prevDoneTodos, todo]);
      };
    
      const deleteTodo = (todo: TTodo) : void => {
        setDoneTodos((prevDoneTodo) : TTodo[] =>
            prevDoneTodo.filter((t) : boolean => t.id !== todo.id)
        );
      };

    <div className="todo-container">
        <h1 className="todo-container__header">YONG TODO</h1>
        { */ <TodoForm /> */}
        <div className="render-container">
            <TodoList
                title='할 일'
                todos={todos}
                buttonLabel='완료'
                buttonColor='#28a745'
                onClick={completeTodo}
            />
            <TodoList
                title='완료'
                todos={doneTodos}
                buttonLabel='삭제'
                buttonColor='#28a745'
                onClick={deleteTodo}
            />
        </div>
    </div>
};

export default Todo;