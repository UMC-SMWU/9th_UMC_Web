import { useCallback, useMemo, useState, type ReactElement } from "react";
import TextInput from "./components/TextInput";
import { findPrimeNumbers } from "./utils/math";

export default function UseMemoPage() : ReactElement {
    console.log('rerender');
    const [limit, setLimit] = useState(0);
    const [text, setText] = useState('');

    const handleChangeText = useCallback((text: string) : void => {
        setText(text);
    },[])

    const primes = useMemo(() => findPrimeNumbers(limit), [limit]);
    return (
        <div className="flex flex-col gap-4 h-dvh">
            <h1> 같이 배우는 리액트 : useMemo</h1>
            <label>
                숫자입력 (소수 찾기):
                <input 
                    value={limit} 
                    className="border p-4 rounded-lg"
                    onChange={(e) : void => setLimit(Number(e.target.value))}
                />
            </label>

            <h2>소수 리스트: </h2>
            <div className="flex flex-wrap gap-2">
                {primes.map((prime) : ReactElement => (
                    <div key = {prime}>{prime}&nbsp;</div>
                ))}
            </div>

            <label>
                {text}
                다른 입력 텍스트: <TextInput onChange={handleChangeText} />
            </label>
        </div>
    )
}