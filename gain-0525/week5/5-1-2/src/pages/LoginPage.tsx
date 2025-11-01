import { validateSignin, type UserSigninInformation } from '../utils/validate';
import useForm from '../hooks/useForm';
import { useNavigate } from 'react-router-dom';
import GoogleLogo from '../assets/GoogleLogo.png'; 
import { useAuth } from '../context/useAuth';

const LoginPage = () => {
    const {login} = useAuth();

    const navigate = useNavigate();
    const { values, errors, touched, getInputProps } = 
    useForm<UserSigninInformation>({
        initialValue: { email: '', password: '' },
        validate: validateSignin,
    });

    const handleSubmit = async() => {
        await login(values);
        
    };

    const isDisabled:boolean = 
        Object.values(errors || {}).some(error => error.length > 0) ||
        Object.values(values).some(value => value === "");

    return (
        <div className='flex flex-col items-center justify-center h-full gap-4 px-6'>
            {/* 뒤로가기 + 로그인 타이틀 */}
            <div className='flex items-center gap-2 w-full max-w-sm'>
                <button
                    onClick={() => navigate(-1)}
                    className='text-xl font-bold hover:text-blue-600'
                >
                    &lt;
                </button>
                <span className='flex-1 text-center text-xl font-bold'>로그인</span>
            </div>

            {/* 로그인 폼 */}
            <div className='flex flex-col gap-3 w-full max-w-sm'>
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
                    onClick={handleSubmit}
                    disabled={isDisabled}
                    className='w-full bg-[#073cb0] text-white py-3 rounded-md text-lg font-medium hover:bg-blue-700 transition-colors cursor-pointer disabled:bg-gray-400'
                >
                    로그인
                </button>

                <div className='flex items-center gap-1 text-sm text-[#afafaf]'> 
                    <span>아직 계정이 없으신가요?</span>
                    <span 
                        className='text-blue-600 cursor-pointer hover:underline'
                        onClick={() => navigate('/signup')}
                    >
                        회원가입 바로가기
                    </span> 
                </div>

                <div className="flex items-center w-full my-1">
                    <hr className="flex-1 border-gray-300" />
                    <span className="px-2 text-gray-400 text-sm">OR</span>
                    <hr className="flex-1 border-gray-300" />
                </div>

                <button
                    onClick={handleSubmit}
                    className='w-full flex items-center justify-center gap-2 bg-transparent text-[#8f8f93] border border-[#afafaf] py-3 rounded-md text-lg font-medium transition-colors cursor-pointer'
                >
                    <img src={GoogleLogo} alt="Google Logo" className='w-6 h-6' />
                    <span className='text-lg'>구글 로그인</span>
                </button>
            </div>
        </div>
    );
};

export default LoginPage;
