import type { JSX } from 'react';
import './App.css'
import ContextPage from './useContext/ContextPage';

export function App() : JSX.Element {
  return (
    <>
    <ContextPage/>
      <h1>Hello React</h1>
    </>
  )
}

export default App;