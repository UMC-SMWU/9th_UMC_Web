import { Outlet, Link } from "react-router-dom";

const HomeLayout = () => {
    return (
        <div className='h-dvh flex flex-col'>
            <nav className="bg-transparent text-black h-16 px-6 flex items-center border border-gray-400">
                <div className="flex items-center gap-6 ml-auto">
                    <Link to='/login' className="hover:underline">로그인</Link>
                    <Link to='/signup' className="hover:underline">회원가입</Link>
                </div>
            </nav>
            <main className='flex-1'>
                <Outlet />
            </main>
            <footer>푸터입니다.</footer>
        </div>
    )
};

export default HomeLayout;