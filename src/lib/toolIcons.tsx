// 도구별 Lucide 아이콘 매핑 — 트리쉐이킹 위해 named import.
// 누락된 도구는 Box (기본).
import {
  // 건강
  Scale, Flame, Baby, Flower2, Wine, Dumbbell, Footprints, Mountain,
  Droplet, Moon, Ruler, HeartPulse,
  // 금융
  Banknote, PiggyBank, TrendingUp, Wallet, ArrowLeftRight, CreditCard,
  LineChart, CircleDollarSign, CandlestickChart, Briefcase, RefreshCw,
  TrendingDown, Send, Hourglass, BriefcaseBusiness,
  // 부동산
  Home, Key, Handshake, Receipt, BarChart3, Target, ShieldAlert,
  // 자동차
  Car, Fuel, ParkingSquare, Zap, Milestone,
  // 세금
  ScrollText, Gift, Building,
  // 일상
  Cake, CalendarDays, Percent, Tag, GraduationCap, Lightbulb, Sparkles,
  Globe, Ticket, Timer, AlarmClock, ShoppingBag, Palmtree,
  Utensils,
  // 개발자
  KeyRound, Palette, Fingerprint, Braces, FileType, Link as LinkIcon,
  Regex, Bot, QrCode, FileText, Clock, Database, FileSpreadsheet, Hash,
  // 라이프
  HeartHandshake, Brain, Leaf, Flag,
  // 문서
  Combine, Scissors, ArchiveRestore, FileOutput, RotateCw, FileImage,
  Droplets, AlignLeft, Eraser, PenLine, Lock, Files,
  // 이미지
  IdCard, ImageMinus, Minimize2,
  // 기본
  Box,
  type LucideIcon,
} from "lucide-react";

const MAP: Record<string, LucideIcon> = {
  // 건강
  "/bmi": Scale,
  "/calorie": Flame,
  "/standard-weight": Scale,
  "/pregnancy": Baby,
  "/ovulation": Flower2,
  "/alcohol": Wine,
  "/one-rm": Dumbbell,
  "/marathon-pace": Footprints,
  "/mountain-time": Mountain,
  "/water-intake": Droplet,
  "/sleep": Moon,
  "/child-height": Ruler,
  "/heart-rate": HeartPulse,

  // 금융
  "/loan": Banknote,
  "/savings": PiggyBank,
  "/compound": TrendingUp,
  "/salary": Wallet,
  "/exchange": ArrowLeftRight,
  "/installment": CreditCard,
  "/stock-average": LineChart,
  "/coin-average": CircleDollarSign,
  "/coin-pl": CandlestickChart,
  "/freelancer-tax": Briefcase,
  "/job-change": RefreshCw,
  "/inflation": TrendingDown,
  "/remit-fee": Send,
  "/rule-of-72": Hourglass,
  "/unemployment-benefit": BriefcaseBusiness,

  // 부동산
  "/capital-gains": Home,
  "/acquisition-tax": Key,
  "/agent-fee": Handshake,
  "/property-tax": Receipt,
  "/jeonse-monthly": ArrowLeftRight,
  "/rental-yield": BarChart3,
  "/cheongyak-score": Target,
  "/ltv-dti": BarChart3,
  "/jeonse-risk": ShieldAlert,

  // 자동차
  "/car-tax": Car,
  "/fuel-cost": Fuel,
  "/car-loan": Car,
  "/parking-fee": ParkingSquare,
  "/ev-charge": Zap,
  "/toll-fee": Milestone,

  // 세금
  "/income-tax": Receipt,
  "/vat": Receipt,
  "/inheritance-tax": ScrollText,
  "/gift-tax": Gift,
  "/severance": Briefcase,
  "/comprehensive-property-tax": Building,

  // 일상
  "/pyeong": Ruler,
  "/age": Cake,
  "/dday": CalendarDays,
  "/percent": Percent,
  "/discount": Tag,
  "/tip": Utensils,
  "/gpa": GraduationCap,
  "/electricity": Lightbulb,
  "/lunar": Moon,
  "/zodiac": Sparkles,
  "/unit": Ruler,
  "/timezone": Globe,
  "/lotto": Ticket,
  "/pomodoro": Timer,
  "/countdown": AlarmClock,
  "/unit-price": ShoppingBag,
  "/annual-leave": Palmtree,

  // 개발자
  "/password": KeyRound,
  "/color": Palette,
  "/uuid": Fingerprint,
  "/json-format": Braces,
  "/base64": FileType,
  "/url-encode": LinkIcon,
  "/jwt-decode": KeyRound,
  "/regex-test": Regex,
  "/ai-token": Bot,
  "/qr-code": QrCode,
  "/color-palette": Palette,
  "/markdown": FileText,
  "/timestamp": Clock,
  "/cron": Clock,
  "/sql-format": Database,
  "/csv-json": FileSpreadsheet,
  "/hash": Hash,

  // 라이프
  "/wedding-cost": HeartHandshake,
  "/child-cost": Baby,
  "/compatibility": HeartHandshake,
  "/mbti-compatibility": Brain,
  "/carbon-footprint": Leaf,
  "/korea-rank": Flag,

  // 문서
  "/pdf-merge": Combine,
  "/pdf-split": Scissors,
  "/pdf-compress": ArchiveRestore,
  "/pdf-extract": FileOutput,
  "/pdf-rotate": RotateCw,
  "/pdf-to-image": FileImage,
  "/image-to-pdf": FileImage,
  "/pdf-watermark": Droplets,
  "/word-count": AlignLeft,
  "/strip-metadata": Eraser,
  "/pdf-sign": PenLine,
  "/pdf-password": Lock,
  "/pdf-batch": Files,

  // 이미지
  "/id-photo": IdCard,
  "/image-compress": Minimize2,
  "/remove-background": ImageMinus,
};

export function iconFor(slug: string): LucideIcon {
  return MAP[slug] ?? Box;
}
