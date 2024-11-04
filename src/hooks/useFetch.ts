import {useState} from "react";

export const useFetch = (callback: Function) => {
    const [ isLoading, setIsLoading ] = useState(false);
    const [ error, setError ] = useState("");

    const fetching = async (...args: any[]) => {
        try {
            setIsLoading(true);
            await callback(...args);
        } catch (e) {
            if (typeof e === "string") {
                setError(e);
            } else if (e instanceof Error) {
                setError(e.message);
            }
        } finally {
            setIsLoading(false);
        }
    }

    return [ fetching, isLoading, error ] as const;
}