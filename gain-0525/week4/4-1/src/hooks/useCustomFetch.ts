import { useState, useEffect } from "react";
import axios from "axios";

interface FechOptions {
    headers?: Record<string, string>;

}


export function useCustomFetch<T> (
    url: string,
    FechOptions?: FechOptions,
    deps: unknown[] = []
) {
    const [data, setData] = useState<T | null>(null);
    const [isPending, setIsPending] = useState(false);
    const [isError, setIsError] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            setIsPending(true);
            setIsError(false);

            try {
                const response = await axios.get<T>(url, FechOptions);
                setData(response.data);
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