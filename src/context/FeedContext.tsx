// context/FeedContext.tsx
import React, {createContext, useState, useContext, ReactNode} from 'react';
import {FeedContent, FeedItem} from '../types/FeedTypes';

type FeedContextType = {
  feedData: any[];
  setFeedData: React.Dispatch<React.SetStateAction<any[]>>;
};

const FeedContext = createContext<FeedContextType | undefined>(undefined);

export const FeedProvider: React.FC<{children: ReactNode}> = ({children}) => {
  const [feedData, setFeedData] = useState<any[]>([]); // any?

  return (
    <FeedContext.Provider value={{feedData, setFeedData}}>
      {children}
    </FeedContext.Provider>
  );
};

export const useFeedData = (): FeedContextType => {
  const context = useContext(FeedContext);
  if (!context) {
    throw new Error('useFeedData must be used within a FeedProvider');
  }
  return context;
};
