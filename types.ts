import { LucideIcon } from 'lucide-react';

export interface NavItem {
  label: string;
  href: string;
}

export interface Service {
  title: string;
  description: string;
  image: string;
}

export interface Attorney {
  name: string;
  role: string;
  image: string;
}

export interface Stat {
  value: string;
  label: string;
  icon: LucideIcon;
}

export interface Feature {
  title: string;
  description: string;
  icon: LucideIcon;
}

export interface Testimonial {
  name: string;
  role: string;
  content: string;
  image: string;
  date: string;
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface Article {
  title: string;
  excerpt: string;
  date: string;
  category: string;
  image: string;
}

export interface VideoItem {
  title: string;
  thumbnail: string;
  duration: string;
  views: string;
  url?: string;
}