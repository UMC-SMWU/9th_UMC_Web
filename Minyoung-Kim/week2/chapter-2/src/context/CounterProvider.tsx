import { createContext, useContext, useState} from 'react';
import type { ReactNode } from 'react';

// Context의 타입 정의
interface CounterContextType {
  count: number;
  handleIncrement: () => void;
  handleDecrement: () => void;
}

// Context 생성 (초기값은 undefined로 설정)
export const CounterContext = createContext<CounterContextType | undefined>(
  undefined
);

// Context Provider 생성
export const CounterProvider = ({ children }: { children: ReactNode }) => {
  const [count, setCount] = useState(0);

  const handleIncrement = () => setCount((prev) => prev + 1);
  const handleDecrement = () => setCount((prev) => prev - 1);

  return (
    <CounterContext.Provider
      value={{ count, handleIncrement, handleDecrement }}
    >
      {children}
    </CounterContext.Provider>
  );
};

// 커스텀 훅을 만들어서 사용
// Provider로 useCount를 감싸서 사용하도록 하는 에러처리 포함.
export const useCount = () => {
  const context = useContext(CounterContext);
  if (!context) {
    throw new Error(
      'useCount는 반드시 CountProvider 내부에서 사용되어야 합니다.'
    );
  }
  return context;
};