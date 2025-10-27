import { useState, useEffect } from "react";
import axios from "axios";

//useCustomFetch에서 요청 옵션을 전달할 타입 정의함
interface FechOptions {
    headers?: Record<string, string>; //headers는 HTTP 요청 헤더를 key-value 형태로 받을 수 있음

}


export function useCustomFetch<T> (
    url: string, //요청할 API 주소
    FechOptions?: FechOptions, //HTTP 요청 헤더 등 옵션
    deps: unknown[] = [] 
) {
    const [data, setData] = useState<T | null>(null);
    const [isPending, setIsPending] = useState(false);
    const [isError, setIsError] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            setIsPending(true); //요청 시작 시 로딩 상태 활성화
            setIsError(false); //이전 에러 상태 초기화

            try {
                const response = await axios.get<T>(url, FechOptions);
                setData(response.data); //API 응담 성공 시 response.data를 data 상태에 저장
            } catch (error) {
                console.error("Fetch error:", error);
                setIsError(true);
            
            } finally {
                setIsPending(false);
            }
        };

        fetchData();
    }, deps);
    return { data, isPending, isError };
}