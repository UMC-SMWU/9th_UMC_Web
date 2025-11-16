import { useEffect, useState } from "react";

function useDebounce<T>(value:T, delay:number ) {
    const[debouncedValue, setDebouncedValue] = useState<T>(value)

    //value, dealy가 변경될 때 마다 실행
    useEffect(() => {
        //delay 후에 실행됨
        //delay 시간 후에 value를 debouncedValue로 업데이트하는 타이머를 시작함

        const handler = setTimeout(()=>setDebouncedValue(value), delay)

        //value가 변경되면, 기존 타이머를 지워서 업데이트 취소함.
        return () => clearTimeout(handler);
    }, [value, delay]);

    //최종적으로 '잠시 기다린 후의' 값을 반환함
    return debouncedValue;
}
export default useDebounce;
