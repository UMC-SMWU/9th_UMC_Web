// src/pages/LoginPage.tsx
import { validateSignin, type UserSigninInformation } from '../utils/validate';
import useForm from '../hooks/useForm';
import { useNavigate, useLocation } from 'react-router-dom';
import GoogleLogo from '../assets/GoogleLogo.png'; 
import { useAuth } from '../context/useAuth';
import { useMutation } from '@tanstack/react-query';
import { useEffect } from 'react';

const LoginPage = () => {
    const { login, accessToken } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const from = (location.state as { from?: string })?.from || "/";

    const { values, errors, touched, getInputProps } = 
        useForm<UserSigninInformation>({
            initialValue: { email: '', password: '' },
            validate: validateSignin,
        });

    // ✅ useMutation으로 기존 login 함수 감싸기
    const loginMutation = useMutation({
        mutationFn: (loginData: UserSigninInformation) => login(loginData),
        onSuccess: () => {
            // 로그인 성공하면 홈 화면 이동
            navigate(from, { replace: true });
        },
        onError: (error: any) => {
            alert(error.response?.data?.message || '로그인 실패');
        },
    });

    // 이미 로그인 되어 있다면 리다이렉트
    useEffect(() => {
        if (accessToken) {
            navigate(from, { replace: true });
        }
    }, [accessToken, navigate, from]);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        loginMutation.mutate(values); // mutate로 기존 login 호출
    };

    const handleGoogleLogin = () => {
        window.location.href = import.meta.env.VITE_SERVER_API_URL + "/v1/auth/google/login";
    };

    const isDisabled:boolean = 
        Object.values(errors || {}).some(error => error.length > 0) ||
        Object.values(values).some(value => value === "");

    return (
        <div className='flex flex-col items-center justify-center h-full gap-4 px-6'>
            <div className='flex items-center gap-2 w-full max-w-sm'>
                <button
                    onClick={() => navigate(-1)}
                    className='text-xl font-bold hover:text-blue-600'
                >
                    &lt;
                </button>
                <span className='flex-1 text-center text-xl font-bold'>로그인</span>
            </div>

            <form onSubmit={handleSubmit} className='flex flex-col gap-3 w-full max-w-sm'>
                <input
                    {...getInputProps('email')}
                    type='email'
                    placeholder='이메일'
                    className={`border p-3 rounded-md focus:border-[#807bff] ${errors?.email && touched?.email ? "border-red-500 bg-red-200" : "border-gray-300"}`}
                />
                {errors?.email && touched?.email && (
                    <div className='text-red-500 text-sm'>{errors.email}</div>
                )}

                <input
                    {...getInputProps('password')}
                    type='password'
                    placeholder='비밀번호'
                    className={`border p-3 rounded-md focus:border-[#807bff] ${errors?.password && touched?.password ? "border-red-500 bg-red-200" : "border-gray-300"}`}
                />
                {errors?.password && touched?.password && (
                    <div className='text-red-500 text-sm'>{errors.password}</div>
                )}

                <button
                    type="submit"
                    disabled={isDisabled || loginMutation.isPending}
                    className='w-full bg-[#073cb0] text-white py-3 rounded-md text-lg font-medium hover:bg-blue-700 transition-colors cursor-pointer disabled:bg-gray-400'
                >
                    {loginMutation.isPending ? '로그인 중...' : '로그인'}
                </button>
            </form>

            <div className='flex items-center gap-1 text-sm text-[#afafaf] w-full max-w-sm'> 
                <span>아직 계정이 없으신가요?</span>
                <span 
                    className='text-blue-600 cursor-pointer hover:underline'
                    onClick={() => navigate('/signup')}
                >
                    회원가입 바로가기
                </span> 
            </div>

            <div className="flex items-center w-full max-w-sm my-1">
                <hr className="flex-1 border-gray-300" />
                <span className="px-2 text-gray-400 text-sm">OR</span>
                <hr className="flex-1 border-gray-300" />
            </div>

            <button
                type="button"
                onClick={handleGoogleLogin}
                className='w-full flex items-center justify-center gap-2 bg-transparent text-[#8f8f93] border border-[#afafaf] py-3 rounded-md text-lg font-medium transition-colors cursor-pointer max-w-sm'
            >
                <img src={GoogleLogo} alt="Google Logo" className='w-6 h-6' />
                <span className='text-lg'>구글 로그인</span>
            </button>
        </div>
    );
};

export default LoginPage;
