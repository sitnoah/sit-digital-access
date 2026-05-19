import {
  ArrowRight,
  BadgeCheck,
  BarChart3,
  Bell,
  BookOpenCheck,
  BriefcaseBusiness,
  Building2,
  CheckCircle2,
  ChevronDown,
  CircleDollarSign,
  Cloud,
  Cpu,
  Database,
  Factory,
  Globe2,
  GraduationCap,
  HandHeart,
  Handshake,
  HardDrive,
  Headphones,
  LayoutGrid,
  Laptop,
  Leaf,
  List,
  Mail,
  MapPin,
  Menu,
  Monitor,
  Network,
  PackageCheck,
  Phone,
  Recycle,
  School,
  Search,
  Settings2,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  SunMedium,
  Truck,
  Users,
  WifiOff,
  Wrench,
  X
} from "lucide-react";
import { cn } from "@/lib/utils";

export const iconMap = {
  arrow: ArrowRight,
  badge: BadgeCheck,
  bell: Bell,
  chart: BarChart3,
  book: BookOpenCheck,
  business: BriefcaseBusiness,
  building: Building2,
  check: CheckCircle2,
  chevron: ChevronDown,
  cloud: Cloud,
  cost: CircleDollarSign,
  cpu: Cpu,
  database: Database,
  factory: Factory,
  globe: Globe2,
  graduation: GraduationCap,
  heart: HandHeart,
  handshake: Handshake,
  hardDrive: HardDrive,
  headset: Headphones,
  grid: LayoutGrid,
  laptop: Laptop,
  leaf: Leaf,
  list: List,
  mail: Mail,
  map: MapPin,
  menu: Menu,
  monitor: Monitor,
  network: Network,
  package: PackageCheck,
  phone: Phone,
  recycle: Recycle,
  school: School,
  search: Search,
  settings: Settings2,
  shield: ShieldCheck,
  sliders: SlidersHorizontal,
  sparkles: Sparkles,
  sun: SunMedium,
  truck: Truck,
  users: Users,
  offline: WifiOff,
  wrench: Wrench,
  close: X
};

export type IconKey = keyof typeof iconMap;

type IconProps = {
  name: IconKey;
  className?: string;
  strokeWidth?: number;
};

export function Icon({ name, className, strokeWidth = 2 }: IconProps) {
  const LucideIcon = iconMap[name];
  return <LucideIcon className={className} strokeWidth={strokeWidth} aria-hidden="true" />;
}

export function IconBadge({
  name,
  className
}: {
  name: IconKey;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex h-11 w-11 items-center justify-center rounded-lg bg-flame-500 text-white shadow-card",
        className
      )}
    >
      <Icon name={name} className="h-5 w-5" />
    </span>
  );
}
