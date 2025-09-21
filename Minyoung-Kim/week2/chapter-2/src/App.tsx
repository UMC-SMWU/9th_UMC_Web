import './App.css'
import { useState } from 'react';

function App() {
  const [count, setCount] = useState(0)

  // 버튼 클릭 시 6씩 증가하는 함수
  const handleIncreaseNumber = () => {
    // 이전 상태 값을 인자로 받아서 업데이트
    setCount(prev => prev + 1)
    setCount(prev => prev + 1)
    setCount(prev => prev + 1)
    setCount(prev => prev + 1)
    setCount(prev => prev + 1)
    setCount(prev => prev + 1)
  }

  return (
     <>
      <h1>{count}</h1>
      <button onClick={handleIncreaseNumber}>숫자 증가</button>
     </>
  )
}

export default App