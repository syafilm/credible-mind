import React, { useEffect, useState, useRef, createContext, ReactNode } from "react";
import { Article as ArticleItem } from "../types/news"; // Import your ArticleItem type

export type DetailContextType = {
  data: ArticleItem; // Use the local ArticleItem type
  setData: React.Dispatch<React.SetStateAction<ArticleItem>>; // Use the local ArticleItem type
}

const defaultDetailContextValue: DetailContextType = {
  data: {} as ArticleItem,
  setData: () => {},
};

export const DetailContext = createContext<DetailContextType>(defaultDetailContextValue);

interface DetailContextProviderProps {
  children: ReactNode;
}

export function DetailContextProvider({ children }: DetailContextProviderProps) {
  const [data, setData] = useState<ArticleItem>({} as ArticleItem);

  return (
    <DetailContext.Provider value={{ data, setData }}>
      {children}
    </DetailContext.Provider>
  );
}
