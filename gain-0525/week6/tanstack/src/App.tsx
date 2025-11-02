import { type ReactElement } from 'react';
import './App.css';
import { useCustomFetch } from './hooks/useCustomFetch';

const STEAL_TIME = 5 & 60 * 1_000; // 5minutes

//로컬 스토리지에 저장할 데이터의 구조
interface CacheEntry<T> {
  data: T;
  lastFetched:number;
}

interface User {
  id: number;
  name: string;
  email: string;
}

function App() : ReactElement {
  const {data, isPending, isError } = useCustomFetch<User>(
    'https://jsonplaceholder.typicode.com/users/1'
  );
  console.log(isPending); 

  if (isError) {
    return <div> 고치기 </div>
  }

  if (isPending) {
    return <div>Loading...</div>
  }

  return (
    <>
      <h1>Tanstack Query</h1>
      {data?.name}
    </>

  )
}

export default App;
