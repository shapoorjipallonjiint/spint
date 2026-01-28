"use client"
import { usePathname } from 'next/navigation'


const useIsPreferredLanguageArabic = () => {
    const pathname = usePathname();
    if(pathname.startsWith('/ar')){
        return true
    }else{
        return false
    }
}                       

export default useIsPreferredLanguageArabic