import React from 'react';
import {
  CreditCard,
  Smartphone,
  UserCheck,
  FileSpreadsheet,
  Users,
  Tractor,
  ShieldCheck,
  HeartPulse,
  Vote,
  BadgePercent,
  FileCheck2,
  Award,
  Home,
  Baby,
  FileText,
  Printer,
  FileCode,
  Building,
  GraduationCap,
  Briefcase,
  Layers,
  HelpCircle,
  LucideProps
} from 'lucide-react';

const ICON_MAP: Record<string, React.FC<LucideProps>> = {
  CreditCard,
  Smartphone,
  UserCheck,
  FileSpreadsheet,
  Users,
  Tractor,
  ShieldCheck,
  HeartPulse,
  Vote,
  BadgePercent,
  FileCheck2,
  Award,
  Home,
  Baby,
  FileText,
  Printer,
  FileCode,
  Building,
  GraduationCap,
  Briefcase,
  Layers
};

export function getServiceIcon(iconName: string, props: LucideProps & { className?: string } = {}) {
  const IconComponent = ICON_MAP[iconName] || FileText;
  return <IconComponent {...props} />;
}

export const AVAILABLE_ICONS = Object.keys(ICON_MAP);
