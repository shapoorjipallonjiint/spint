// context/SearchContext.tsx
"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import SmoothScroll from "@/app/components/common/SmoothScroll";

const ToNavigateCountryContext = createContext<{
    toNavigateCountry: string;
    setToNavigateCountry: (value: string) => void;
}>({
    toNavigateCountry: "",
    setToNavigateCountry: () => { },
});



export const useToNavigateCountryContext = () => useContext(ToNavigateCountryContext);

export const ToNavigateCountryProvider = ({ children }: { children: React.ReactNode }) => {
    const [toNavigateCountry, setToNavigateCountry] = useState("");

    return (
        <ToNavigateCountryContext.Provider value={{ toNavigateCountry, setToNavigateCountry }}>
            {!toNavigateCountry && <SmoothScroll />}
            {children}
        </ToNavigateCountryContext.Provider>
    );
};
