import { createBrowserRouter, RouterProvider, type RouteObject } from "react-router-dom";
import "./App.css"
import HomePage from "./pages/HomePage";
import NotFoundPage from "./pages/NotFoundPage";
import LoginPage from "./pages/LoginPage";
import HomeLayout from "./layouts/HomeLayout";
import SignupPage from "./pages/SignupPage";
import { AuthProvider } from "./context/AuthContext";
import MyPage from "./pages/MyPage";
import ProtectedLayout from "./layouts/ProtectedLayout";

//1.홈페이지
//2.로그인 페이지
//3.회원가입 페이지

//publicRoutes : 인증 없이 접근 가능한 라우트
const publicRoutes:RouteObject[] = [
  {
    path:"/",
    element: <HomeLayout />, //공유되는 구성들이 들어가야 함. 
    errorElement: <NotFoundPage />,
    children: [
      {index: true, element: <HomePage />},
      {path: 'login', element: <LoginPage />},
      {path: 'signup', element: <SignupPage />},
    ],
  }
]
//protectedRoutes : 인증 후에 접근 가능한 라우트
const protectedRoutes:RouteObject[] = [
  {
    path:"/",
    element:<ProtectedLayout />,
    errorElement:<NotFoundPage />,
    children:[
      {
        path:"my",
        element:<MyPage />,
      },
    ],
  },
];

const router = createBrowserRouter([...publicRoutes, ...protectedRoutes]);

function App() {
  console.log("API URL:", import.meta.env.VITE_SERVER_API_URL);
  console.log("TEST VALUE:", import.meta.env.VITE_TEST);

  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  )
}

export default App
