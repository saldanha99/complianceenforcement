import { LucideIcon } from 'lucide-react';

export interface ServiceCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  ctaText?: string;
}

export interface TestimonialProps {
  name: string;
  role: string;
  company: string;
  quote: string;
  image: string;
}

export interface FeatureProps {
  title: string;
  description: string;
  items: string[];
}