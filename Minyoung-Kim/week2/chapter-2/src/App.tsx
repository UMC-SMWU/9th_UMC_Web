// useState 기초 실습 : 버튼 클릭 시 마다 숫자 증가 (0 ->)

import './App.css'
import { useState } from 'react';

function App() {
  const [count, setCount] = useState(0) // 초기값을 0으로 설정
  return (
     <>
      <h1>{count}</h1>
      {/* onClick 이벤트 핸들러를 사용함 */}
      {/* 바꾸고 싶은 두 번째 상태 값을 넣어주기(setCount로 1씩 증가하는 숫자) */}
      <button onClick={() => setCount(count + 1)}>숫자 증가</button>
     </>
  )
}

export default App