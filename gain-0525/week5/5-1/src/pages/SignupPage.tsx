import { useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { postSignup } from "../apis/auth";
import { useNavigate } from "react-router-dom";

const schema = z.object({
  email: z.string().email({ message: "올바른 이메일 형식이 아닙니다." }),
  password: z.string()
    .min(8, { message: "비밀번호는 8자 이상이어야 합니다." })
    .max(20, { message: "비밀번호는 20자 이하이어야 합니다." }),
  passwordCheck: z.string(),
  name: z.string().min(1, { message: "닉네임을 입력해주세요." }),
}).refine(data => data.password === data.passwordCheck, {
  message: "비밀번호가 일치하지 않습니다.",
  path: ["passwordCheck"],
});

type FormFields = z.infer<typeof schema>;

const MultiStepSignup = () => {
  const [step, setStep] = useState(1);
  const navigate = useNavigate();

  const { register, handleSubmit, watch, formState: { errors } } = useForm<FormFields>({
    resolver: zodResolver(schema),
    mode: "onChange",
    defaultValues: {
      email: "",
      password: "",
      passwordCheck: "",
      name: "",
    },
  });

  const values = watch();

  const handleNext = () => setStep(prev => prev + 1);

  const onSubmit: SubmitHandler<FormFields> = async (data) => {
    const { passwordCheck, ...rest } = data;
    try {
      await postSignup(rest);
      navigate("/"); // 회원가입 완료 후 메인페이지 이동
    } catch (error: any) {
      alert(error?.message || "회원가입 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-full gap-4">
        <h1 className="text-2xl font-bold mb-4">회원가입</h1>
      {/* Step 1: 이메일 */}
      {step === 1 && (
        <div className="flex flex-col gap-3 w-full max-w-sm">
          <input
            {...register("email")}
            type="email"
            placeholder="이메일"
            className={`border p-3 rounded-md ${errors.email ? "border-red-500 bg-red-200" : "border-gray-300"}`}
          />
          {errors.email && <div className="text-red-500 text-sm">{errors.email.message}</div>}

          <button
            onClick={handleNext}
            disabled={!values.email || !!errors.email}
            className="w-full bg-blue-600 text-white py-3 rounded-md disabled:bg-gray-400"
          >
            다음
          </button>
        </div>
      )}

      {/* Step 2: 비밀번호 */}
      {step === 2 && (
        <div className="flex flex-col gap-3 w-full max-w-sm">
          <input
            {...register("password")}
            type="password"
            placeholder="비밀번호"
            className={`border p-3 rounded-md ${errors.password ? "border-red-500 bg-red-200" : "border-gray-300"}`}
          />
          {errors.password && <div className="text-red-500 text-sm">{errors.password.message}</div>}

          <input
            {...register("passwordCheck")}
            type="password"
            placeholder="비밀번호 확인"
            className={`border p-3 rounded-md ${errors.passwordCheck ? "border-red-500 bg-red-200" : "border-gray-300"}`}
          />
          {errors.passwordCheck && <div className="text-red-500 text-sm">{errors.passwordCheck.message}</div>}

          <button
            onClick={handleNext}
            disabled={
              !values.password || !values.passwordCheck ||
              !!errors.password || !!errors.passwordCheck
            }
            className="w-full bg-blue-600 text-white py-3 rounded-md disabled:bg-gray-400"
          >
            다음
          </button>
        </div>
      )}

      {/* Step 3: 닉네임 */}
      {step === 3 && (
        <div className="flex flex-col gap-3 w-full max-w-sm">
          <input
            {...register("name")}
            type="text"
            placeholder="이름"
            className={`border p-3 rounded-md ${errors.name ? "border-red-500 bg-red-200" : "border-gray-300"}`}
          />
          {errors.name && <div className="text-red-500 text-sm">{errors.name.message}</div>}

          <button
            onClick={handleSubmit(onSubmit)}
            disabled={!values.name || !!errors.name}
            className="w-full bg-green-600 text-white py-3 rounded-md disabled:bg-gray-400"
          >
            회원가입
          </button>
        </div>
      )}
    </div>
  );
};

export default MultiStepSignup;
