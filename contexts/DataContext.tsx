import React, { createContext, useContext, ReactNode } from 'react';
import { siteData } from '../data/site';
import type { Article, Testimonial, VideoItem, Client } from '../types';
import type { SiteData } from '../data/site';

export type { SiteData, SectionVisibility } from '../data/site';
export { siteData as defaultData };

interface DataContextType {
  data: SiteData;
  articles: Article[];
  testimonials: Testimonial[];
  clients: Client[];
  videos: VideoItem[];
  isLoading: false;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const value: DataContextType = {
    data: siteData,
    articles: siteData.news.items,
    testimonials: siteData.testimonials.items,
    clients: siteData.clients.items,
    videos: siteData.videos.items,
    isLoading: false,
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};

export const useData = (): DataContextType => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within DataProvider');
  }
  return context;
};
