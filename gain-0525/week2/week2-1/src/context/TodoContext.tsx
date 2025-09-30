import { createContext, useState } from 'react';
import type { TTodo } from '../types/todo';
import type { PropsWithChildren, ReactElement } from "react";

export interface ITodoContext {
    todos: TTodo[];
    doneTodos: TTodo[];
    addTodo: (text: string) => void;
    completeTodo: (todo: TTodo) => void;
    deleteTodo: (todo: TTodo) => void;
}

export const TodoContext = createContext<ITodoContext | undefined>
(undefined);

export const TodoProvider =({ children }:
    PropsWithChildren) : ReactElement => {
        const [todos, setTodos] = useState<TTodo[]>([]);
        const [doneTodos, setDoneTodos] = useState<TTodo[]>([]);
        const addTodo = (text: string): void => {
            const newTodo: TTodo = { id: Date.now(), text };
            setTodos((prevTodos): TTodo[] => [...prevTodos, newTodo]);
        };
        const completeTodo = (todo: TTodo) : void => {
            setTodos((prevTodos) : TTodo[] => prevTodos.filter((t)
            : boolean => t.id !== todo.id));
            setDoneTodos((prevDoneTodos) : TTodo[] => [...
            prevDoneTodos, todo])
        }
        const deleteTodo = (todo: TTodo) : void => {
            setDoneTodos((prevDoneTodo) : TTodo[] => 
                prevDoneTodo.filter((t) : boolean => t.id !== todo.id))
        };
        return (
            <TodoContext.Provider 
                value={{todos, doneTodos,addTodo, completeTodo, deleteTodo }}>
                {children}
            </TodoContext.Provider>
        )
    }; 