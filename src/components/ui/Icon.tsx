import {
  Activity,
  ArrowLeft,
  ArrowRight,
  ArrowDown,
  ArrowUpRight,
  Building2,
  FileDown,
  Hand,
  Pause,
  Play,
  Quote,
  Send,
  Award,
  Bell,
  Check,
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
  Heart,
  House,
  Layers,
  LayoutGrid,
  Link2,
  Lock,
  Mail,
  MapPin,
  MessageCircle,
  PenTool,
  Plus,
  Rocket,
  Search,
  Smartphone,
  Square,
  ShieldCheck,
  Sparkles,
  Star,
  Trophy,
  Type,
  User,
  Users,
  Wand2,
  Frame,
  MousePointer2,
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

/*
 * Flutter and TypeScript logos in their own brand colours (not the accent),
 * for the tiles that name a stack. Their artwork runs edge to edge; the
 * viewBox margins are tuned by eye against the line icons' visual size.
 */

/** Flutter's mark: light top and upper arm, mid-blue joint, dark lower arm. */
function Flutter({ size = 20, className }: BrandProps) {
  return (
    <svg width={size} height={size} style={{ width: rem(size), height: rem(size) }} viewBox="-0.5 -0.5 25 25" className={className} aria-hidden="true">
      <path fill="#47c5fb" d="M14.31 0 2.3 12 6 15.7 21.68 0Z" />
      <path fill="#47c5fb" d="M14.33 11.07h7.37l-6.46 6.46-3.69-3.69Z" />
      <path fill="#00b5f8" d="m7.86 17.53 3.69-3.69 3.69 3.69-3.69 3.69Z" />
      <path fill="#00569e" d="m11.55 21.22 3.69-3.69L21.7 24h-7.37Z" />
    </svg>
  );
}

/** The TypeScript logo: white "TS" on the blue square. */
function Typescript({ size = 20, className }: BrandProps) {
  return (
    <svg width={size} height={size} style={{ width: rem(size), height: rem(size) }} viewBox="-1.5 -1.5 27 27" className={className} aria-hidden="true">
      <rect width="24" height="24" rx="1.5" fill="#3178c6" />
      <path
        fill="#fff"
        d="M18.488 9.75c.612 0 1.154.037 1.627.111a6.38 6.38 0 0 1 1.306.34v2.458a3.95 3.95 0 0 0-.643-.361 5.093 5.093 0 0 0-.717-.26 5.453 5.453 0 0 0-1.426-.2c-.3 0-.573.028-.819.086a2.1 2.1 0 0 0-.623.242c-.17.104-.3.229-.393.374a.888.888 0 0 0-.14.49c0 .196.053.373.156.529.104.156.252.304.443.444s.423.276.696.41c.273.135.582.274.926.416.47.197.892.407 1.266.628.374.222.695.473.963.753.268.279.472.598.614.957.142.359.214.776.214 1.253 0 .657-.125 1.21-.373 1.656a3.033 3.033 0 0 1-1.012 1.085 4.38 4.38 0 0 1-1.487.596c-.566.12-1.163.18-1.79.18a9.916 9.916 0 0 1-1.84-.164 5.544 5.544 0 0 1-1.512-.493v-2.63a5.033 5.033 0 0 0 3.237 1.2c.333 0 .624-.03.872-.09.249-.06.456-.144.623-.25.166-.108.29-.234.373-.38a1.023 1.023 0 0 0-.074-1.089 2.12 2.12 0 0 0-.537-.5 5.597 5.597 0 0 0-.807-.444 27.72 27.72 0 0 0-1.007-.436c-.918-.383-1.602-.852-2.053-1.405-.45-.553-.676-1.222-.676-2.005 0-.614.123-1.141.369-1.582.246-.441.58-.804 1.004-1.089a4.494 4.494 0 0 1 1.47-.629 7.536 7.536 0 0 1 1.77-.201zm-15.113.188h9.563v2.166H9.506v9.646H6.789v-9.646H3.375z"
      />
    </svg>
  );
}

/** WhatsApp's phone-in-a-bubble mark in its brand green, for the contact button. */
function Whatsapp({ size = 20, className }: BrandProps) {
  return (
    <svg width={size} height={size} style={{ width: rem(size), height: rem(size) }} viewBox="-0.5 -0.5 25 25" className={className} aria-hidden="true">
      <path
        fill="#25d366"
        d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"
      />
    </svg>
  );
}

const lucide = {
  activity: Activity,
  arrowLeft: ArrowLeft,
  check: Check,
  frame: Frame,
  heart: Heart,
  home: House,
  lock: Lock,
  mapPin: MapPin,
  pointer: MousePointer2,
  smartphone: Smartphone,
  square: Square,
  type: Type,
  user: User,
  arrowRight: ArrowRight,
  arrowDown: ArrowDown,
  arrowUpRight: ArrowUpRight,
  building: Building2,
  fileDown: FileDown,
  hand: Hand,
  pause: Pause,
  play: Play,
  quote: Quote,
  send: Send,
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
  phone: Smartphone,
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

const brands = { github: Github, dribbble: Dribbble, linkedin: Linkedin, x: XLogo, flutter: Flutter, typescript: Typescript, whatsapp: Whatsapp } as const;

export type IconName = keyof typeof lucide | keyof typeof brands;

/** Logos drawn in their own colours, so their tiles drop the accent fill. */
const colourLogos = new Set<string>(["flutter", "typescript"]);
export const isColourLogo = (name: string) => colourLogos.has(name);

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
