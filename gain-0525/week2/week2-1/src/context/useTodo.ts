// src/context/useTodo.ts
import { useContext } from 'react';
import { TodoContext, type ITodoContext } from './TodoContext';

export const useTodo = (): ITodoContext => {
  const context = useContext(TodoContext);
  if (!context) throw new Error('useTodo를 사용하려면 TodoProvider로 감싸야 합니다.');
  return context;
};
