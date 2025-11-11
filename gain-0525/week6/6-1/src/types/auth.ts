import type { CommonRespone } from "./common";
//회원 가입
export type RequestSignupDto = {
    name: string;
    email: string;
    bio?: string;
    avatar?:string;
    password:string;
}

export type ResponseSignupDto = CommonRespone<{
    id:number;
    name: string;
    email: string;
    bio: string| null;
    createdAt: Date;
    updateAt: Date;
}>; 

//로그인
export type RequestSigninDto = {
    email: string;
    password: string;
};

export type ResponseSigninDto = CommonRespone<{
    id: number;
    name: string;
    accessToken: string;
    refreshToken: string;
}>;

//내 정보 조회

export type ResponseMyInfoDto = CommonRespone<{
    id:number;
    name: string;
    email: string;
    bio: string| null;
    createdAt: Date;
    updateAt: Date;
}>