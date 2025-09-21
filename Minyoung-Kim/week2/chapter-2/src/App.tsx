import { useState } from 'react';

function App() {

  // count 상태 관리를 위한 useState Hook (초기값 0)
  const [count, setCount] = useState(0);

  // count 1 씩 증가시키는 함수
  const increment = () => {
    setCount(count + 1);
  };
  
  // count 1 씩 감소시키는 함수
  const decrement = () => {
    setCount(count - 1);
  };

  return (
    <div>
      <h1>Counter</h1>
      {/* 현재 카운트 값 */}
      <p>Count : {count}</p>
      {/* 감소 버튼 */}
      <button onClick={decrement}>-1</button>
      {/* 증가 버튼 */}
      <button onClick={increment}>+1</button>
    </div>
  );
}

export default App;