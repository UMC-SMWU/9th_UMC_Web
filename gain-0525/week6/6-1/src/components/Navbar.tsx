import { Link } from 'react-router-dom';
import { useAuth } from '../context/useAuth'; // useAuth import 필요

const Navbar = () => {
  const { accessToken } = useAuth();
  console.log(accessToken);

  return (
    <nav className="bg-white dark-bg-gray-900 shadow-md fixed w-full z-10">
      <div className='flex items-center justify-between p-4'>
        <Link
          to="/"
          className='text-xl font-bold text-gray-900 dark-text-white'
        >
          SpinningSpinning Dolimpan
        </Link>

        <div className="space-x-6">
          {!accessToken && (  // 로그인 안 되어 있을 때만 로그인/회원가입 보여주기
            <>
              <Link 
                to="/login"
                className='text-black-700 dark:text-black-300 hover:text-blue-500'
              >
                로그인
              </Link>
              <Link 
                to="/signup"
                className='text-black-700 dark:text-black-300 hover:text-blue-500'
              >
                회원가입
              </Link>
            </>
          )}
        </div>
        {accessToken && (
        <Link
          to={"/my"}
          className='text-black-700 dark:text-black-300 hover:text-blue-500'
        >
        마이페이지
        </Link>
        )}
        <Link
          to={"/search"}
          className='text-black-700 dark:text-black-300 hover:text-blue-500'
        >
        검색
        </Link>
      </div>
    </nav>
  );
}

export default Navbar;
