import type { ReactElement, FormEvent } from "react";
import { useState } from 'react';
import { useTodo } from "../context/useTodo";


const TodoForm = () : ReactElement => {
        const [input, setInput] = useState<string>('');
        const { addTodo } = useTodo()
        const handleSubmit = (e: FormEvent<HTMLFormElement>) : void => {
            e.preventDefault();
            const text = input.trim();

            if (text) {
                addTodo(text);
                setInput('');
            }
        }
    return (
        <form onSubmit={handleSubmit} className="todo-form">
                <input
                    value={input}
                    onChange={(e): void => setInput(e.target.value)}
                    type='text'
                    className="todo-input"
                    placeholder="할 일 입력"
                    required
                />
                <button type="submit" className="todo-submit">
                    할 일 추가
                </button>
            </form>
    )
};

export default TodoForm;