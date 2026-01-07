import { useEffect, useState } from "react"

export const useDebounce = (value,delay=2000) =>{
    const [debouncedValue,setDebouncedValue] = useState(value)


    useEffect(()=>{
        if(!value.trim()) return;

      const handler = setTimeout(() => {
        setDebouncedValue(value)
    }, delay);

    return ()=> clearTimeout(handler)

    },[value,delay])

    return debouncedValue
}