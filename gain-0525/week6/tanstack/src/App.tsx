import type { ReactElement } from 'react';
import './App.css';
import { WelcomeData } from './components/UserDataDisplay';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';

const queryClient = new QueryClient();

export function App() : ReactElement {
  return (
    <QueryClientProvider client={queryClient}>
      <WelcomeData />
    </QueryClientProvider>
  )
  
}

export default App;
