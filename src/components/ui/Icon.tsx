import {
  Activity,
  ArrowRight,
  Award,
  Bell,
  Box,
  Calendar,
  ChevronDown,
  ChevronRight,
  Clock,
  Code2,
  Copy,
  Crown,
  Download,
  Eye,
  FileText,
  Filter,
  Flame,
  Folder,
  Gauge,
  Globe,
  Layers,
  LayoutGrid,
  Link2,
  Mail,
  MessageCircle,
  PenTool,
  Plus,
  Rocket,
  Search,
  ShieldCheck,
  Sparkles,
  Star,
  Trophy,
  Users,
  Wand2,
  Zap,
  type LucideProps,
} from "lucide-react";

type BrandProps = { size?: number; className?: string };

/** px design size → rem, so icons scale with the fluid root font size. */
const rem = (size: number | string) => `${Number(size) / 16}rem`;

function Github({ size = 20, className }: BrandProps) {
  return (
    <svg width={size} height={size} style={{ width: rem(size), height: rem(size) }} viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M12 .5a11.5 11.5 0 0 0-3.64 22.41c.58.1.79-.25.79-.56v-2c-3.2.7-3.88-1.37-3.88-1.37-.53-1.33-1.28-1.69-1.28-1.69-1.05-.71.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.29 1.19-3.09-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.17 1.18a11 11 0 0 1 5.77 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.8 1.19 1.83 1.19 3.09 0 4.42-2.7 5.39-5.26 5.68.41.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.56A11.5 11.5 0 0 0 12 .5Z" />
    </svg>
  );
}

function Dribbble({ size = 20, className }: BrandProps) {
  return (
    <svg width={size} height={size} style={{ width: rem(size), height: rem(size) }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className} aria-hidden="true">
      <circle cx="12" cy="12" r="10" />
      <path d="M8.6 2.6c3.2 4.3 5.3 9.4 6.4 18.6M2.2 10.6c5 .3 10.3-.6 15.5-4.4M5 19c2.8-4.7 7.6-6.6 16.8-5.2" />
    </svg>
  );
}

function Linkedin({ size = 20, className }: BrandProps) {
  return (
    <svg width={size} height={size} style={{ width: rem(size), height: rem(size) }} viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3 9.75h4v11H3v-11Zm6.5 0h3.8v1.5h.06c.53-1 1.83-2.06 3.77-2.06 4.03 0 4.77 2.65 4.77 6.1v5.46h-4v-4.84c0-1.16-.02-2.64-1.61-2.64-1.61 0-1.86 1.26-1.86 2.56v4.92h-4v-11Z" />
    </svg>
  );
}

function XLogo({ size = 20, className }: BrandProps) {
  return (
    <svg width={size} height={size} style={{ width: rem(size), height: rem(size) }} viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M17.75 3h3.07l-6.7 7.66L22 21h-6.17l-4.83-6.32L5.47 21H2.4l7.17-8.2L2 3h6.33l4.36 5.77L17.75 3Zm-1.08 16.2h1.7L7.4 4.73H5.58L16.67 19.2Z" />
    </svg>
  );
}

const lucide = {
  activity: Activity,
  arrowRight: ArrowRight,
  award: Award,
  bell: Bell,
  cube: Box,
  calendar: Calendar,
  chevronDown: ChevronDown,
  chevronRight: ChevronRight,
  clock: Clock,
  code: Code2,
  copy: Copy,
  crown: Crown,
  download: Download,
  eye: Eye,
  file: FileText,
  filter: Filter,
  flame: Flame,
  folder: Folder,
  gauge: Gauge,
  globe: Globe,
  layers: Layers,
  grid: LayoutGrid,
  link: Link2,
  mail: Mail,
  message: MessageCircle,
  pen: PenTool,
  plus: Plus,
  rocket: Rocket,
  search: Search,
  shield: ShieldCheck,
  spark: Sparkles,
  star: Star,
  trophy: Trophy,
  users: Users,
  wand: Wand2,
  zap: Zap,
} as const;

const brands = { github: Github, dribbble: Dribbble, linkedin: Linkedin, x: XLogo } as const;

export type IconName = keyof typeof lucide | keyof typeof brands;

export function Icon({ name, size = 18, ...rest }: { name: IconName | string } & Omit<LucideProps, "ref">) {
  if (name in brands) {
    const Brand = brands[name as keyof typeof brands];
    return <Brand size={Number(size)} className={rest.className} />;
  }
  const L = lucide[name as keyof typeof lucide] ?? Sparkles;
  const { style, ...props } = rest;
  return (
    <L size={size} strokeWidth={1.8} aria-hidden="true" {...props} style={{ width: rem(size), height: rem(size), flex: "none", ...style }} />
  );
}
