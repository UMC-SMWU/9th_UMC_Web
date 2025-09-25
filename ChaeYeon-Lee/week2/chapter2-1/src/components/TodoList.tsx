import type { JSX } from "react";
import type { TTodo } from "../types/todo";

interface TodoListProps{
    title: string;
    todos?: TTodo[];
    buttonLable: string;
    buttonColor: string;
    onClick: (todo: TTodo) => void;
}

const TodoList = ({title, todos, buttonColor, buttonLable, onClick}: TodoListProps) : Element  => {
  const context = useContext(TodoContext);
    return  (
        <div className="render-container__section">
            <h2 className="render-container__title">{title}</h2>
            <ul id="todo-list"
            className="render-container__list">
                {todos?.map((todo): JSX.Element => (
                  <li key={todo.id} className="render-container__item">
                    <span className="render-container__item-text">{todo.text}</span>
                    <button onClick={(): void => onClick(todo)}
                      style={{ backgroundColor: "#28a745"
                      }}
                      className="render-container__item-button"
                    >
                      {buttonLable}
                    </button>
                  </li>
                ))}
              </ul>
        </div>
    );
};

export default TodoList;