import type { ReactElement } from "react";
import { useContext } from 'react';
import type { TTodo } from '../types/todo'
import { TodoContext } from "../context/TodoContext";

interface TodoListProps {
    title: string;
    todos?: TTodo[];
    buttonLabel: string;
    buttonColor: string;
    onClick: (todo: TTodo) => void;
}
const TodoList = ({title, todos, buttonColor, buttonLabel, onClick}: TodoListProps) : ReactElement => {
    return (
        <div className="render-section">
                    <div className="render-title">{title}</div>
                    <ul id="todo-list" className="render-container__list">
                        {todos?.map((todo) : ReactElement => (
                            <li key={todo.id} className="render-container__item">
                                <span className="render-container__item-text">{todo.text}</span>
                                <button
                                    onClick = {() : void => onClick(todo)}
                                    style={{
                                        backgroundColor: buttonColor,
                                    }}
                                    className="render-container__item-button"> {buttonLabel} </button>
                                </li>
                        ))}
                    </ul>

                </div>
    )

    
};
export default TodoList;

export const A = () : ReactElement => {
    const context = useContext(TodoContext);
    return <div>{context.todos}</div>
};
