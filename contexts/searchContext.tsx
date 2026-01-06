// context/SearchContext.tsx
"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import SmoothScroll from "@/app/components/common/SmoothScroll";

const SearchContext = createContext<{
  searchActive: boolean;
  setSearchActive: (value: boolean) => void;
}>({
  searchActive: false,
  setSearchActive: () => {},
});



export const useSearchContext = () => useContext(SearchContext);

export const SearchProvider = ({ children }: { children: React.ReactNode }) => {
  const [searchActive, setSearchActive] = useState(false);

  return (
    <SearchContext.Provider value={{ searchActive, setSearchActive }}>
        {!searchActive && <SmoothScroll/>}
      {children}
    </SearchContext.Provider>
  );
};
