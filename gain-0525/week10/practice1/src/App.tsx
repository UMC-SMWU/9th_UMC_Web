import UseCallbackPage from "./useCallbackPage";
import './App.css';
import type { ReactElement } from "react";

export default function App() : ReactElement{
  return (
    <main className="flex flex-col justify-center items-center h-dvh">
      <UseCallbackPage />
    </main>
  );
}