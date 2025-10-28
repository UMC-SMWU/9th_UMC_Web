import type { RequestSigninDto, RequestSignupDto, ResponseSigninDto, ResponseSignupDto, ResponseMyInfoDto } from "../types/auth";
import { axiosInstance } from "./axios";

export const postSignup = async (body: RequestSignupDto): Promise<ResponseSignupDto> => {
  const { data } = await axiosInstance.post("v1/auth/signup", body);
  return data;
};

export const postSignin = async (body: RequestSigninDto): Promise<ResponseSigninDto> => {
  const { data } = await axiosInstance.post("v1/auth/signin", body);
  return data;
};

export const getMyInfo = async (): Promise<ResponseMyInfoDto> => {
  const { data } = await axiosInstance.get("v1/users/me");
  return data;
<<<<<<< HEAD
};
=======
};
>>>>>>> 2f3834b ([Fix(간/김가인)] RefreshToken 추가)
