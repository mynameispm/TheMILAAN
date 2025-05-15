import { AlertTriangle, BookOpen, Briefcase, Building as BuildingLibrary, Heart, Home, LifeBuoy, Scale, ShieldAlert, Zap } from 'lucide-react';

export interface CategoryOption {
  value: string;
  label: string;
}

export const categoryOptions: CategoryOption[] = [
  { value: 'education', label: 'Education & Teaching' },
  { value: 'legal', label: 'Legal Assistance' },
  { value: 'housing', label: 'Housing & Shelter' },
  { value: 'health', label: 'Healthcare & Medical' },
  { value: 'disaster', label: 'Disaster Relief' },
  { value: 'business', label: 'Business & Employment' },
  { value: 'community', label: 'Community Development' },
  { value: 'safety', label: 'Safety & Protection' },
  { value: 'essential', label: 'Essential Supplies' },
  { value: 'other', label: 'Other' },
];

// Map category values to icons
export const categoryIcons: Record<string, any> = {
  education: BookOpen,
  legal: Scale,
  housing: Home,
  health: Heart,
  disaster: LifeBuoy,
  business: Briefcase,
  community: BuildingLibrary,
  safety: ShieldAlert,
  essential: Zap,
  other: AlertTriangle,
};