import { useEffect, useLayoutEffect, useMemo, useRef, useState, type MouseEvent as ReactMouseEvent, type ReactNode } from "react";
import { motion, AnimatePresence, useInView, useScroll } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  ArrowRight,
  BarChart3,
  Bot,
  BrainCircuit,
  CalendarDays,
  CheckCheck,
  CheckCircle2,
  ChevronDown,
  Copy,
  Gauge,
  Globe2,
  Layers3,
  LineChart,
  MessageSquareText,
  MousePointerClick,
  ShieldCheck,
  Sparkles,
  Workflow,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Lenis from "lenis";
import { HeroCanvas } from "./components/HeroCanvas";
import { ServiceGalaxyCanvas } from "./components/ServiceGalaxyCanvas";
import {
  caseStudies,
  crmIntegrations,
  dashboardMetrics,
  faqItems,
  founderTimeline,
  industries,
  performanceData,
  platformLogos,
  serviceCards,
  storytellingSteps,
  testimonials,
  trustItems,
} from "./data/site";
import {
  brand,
  caseStudiesV2,
  clientLogosPremium,
  founderStory,
  founders,
  partnerBadges,
  pricingPlans,
  reviews,
} from "./data/brand";
import { cn } from "./utils/cn";

gsap.registerPlugin(ScrollTrigger);

const leadSchema = z.object({
  fullName: z.string().min(2, "Please enter your name."),
  companyName: z.string().min(2, "Please enter your company name."),
  websiteUrl: z.string().min(3, "Please enter your website, social profile or business page."),
  email: z.string().email("Enter a valid email address."),
  phone: z.string().min(7, "Enter a valid phone number."),
  whatsApp: z.string().min(7, "Enter a valid WhatsApp number."),
  industry: z.string().min(2, "Please specify your industry."),
  monthlyRevenue: z.string().min(2, "Please choose or enter monthly revenue."),
  marketingBudget: z.string().min(2, "Please choose or enter your budget."),
  currentChannels: z.string().min(5, "Tell us what channels you are currently using."),
  servicesNeeded: z.string().min(5, "Tell us what services you need."),
  businessGoals: z.string().min(8, "Please share your goals."),
  targetLocation: z.string().min(2, "Please share your target market."),
  numberOfEmployees: z.string().min(1, "Please share team size."),
  timeline: z.string().min(2, "Please choose your timeline."),
  message: z.string().min(10, "Give us a little more context so we can help properly."),
  preferredContactTime: z.string().min(2, "Please select a preferred contact time."),
  preferredContactMethod: z.string().min(2, "Please select a preferred contact method."),
  utm_source: z.string().optional(),
  utm_medium: z.string().optional(),
  utm_campaign: z.string().optional(),
  utm_content: z.string().optional(),
  utm_term: z.string().optional(),
});

type LeadFormValues = z.infer<typeof leadSchema>;

type AIMessage = {
  role: "user" | "assistant";
  text: string;
};

function SectionHeader({
  eyebrow,
  title,
  copy,
  align = "left",
}: {
  eyebrow: string;
  title: string;
  copy: string;
  align?: "left" | "center";
}) {
  return (
    <div className={cn("space-y-5", align === "center" && "mx-auto max-w-3xl text-center")}>
      <div className="inline-flex items-center gap-2 rounded-full border border-[#43F000]/20 bg-[#43F000]/10 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.28em] text-[#b9ff9c]">
        <Sparkles className="h-4 w-4" />
        {eyebrow}
      </div>
      <h2 className="max-w-4xl text-3xl font-semibold tracking-[-0.04em] text-white sm:text-4xl lg:text-6xl">
        {title}
      </h2>
      <p className={cn("max-w-2xl text-base leading-8 text-white/68 sm:text-lg", align === "center" && "mx-auto")}>{copy}</p>
    </div>
  );
}

function MagneticLink({
  href,
  children,
  className,
  target,
  rel,
}: {
  href: string;
  children: ReactNode;
  className?: string;
  target?: string;
  rel?: string;
}) {
  const ref = useRef<HTMLAnchorElement>(null);

  function handleMove(event: ReactMouseEvent<HTMLAnchorElement>) {
    if (!ref.current || window.matchMedia("(pointer: coarse)").matches) return;

    const rect = ref.current.getBoundingClientRect();
    const x = event.clientX - rect.left - rect.width / 2;
    const y = event.clientY - rect.top - rect.height / 2;
    ref.current.style.transform = `translate(${x * 0.12}px, ${y * 0.12}px)`;
  }

  function reset() {
    if (ref.current) ref.current.style.transform = "translate(0px, 0px)";
  }

  return (
    <a
      ref={ref}
      href={href}
      target={target}
      rel={rel}
      onMouseMove={handleMove}
      onMouseLeave={reset}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-full border border-white/10 px-6 py-3.5 text-sm font-semibold text-white transition duration-300 will-change-transform",
        className,
      )}
    >
      {children}
    </a>
  );
}

function CountUp({ value, suffix = "", decimals = 0 }: { value: number; suffix?: string; decimals?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.6 });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!isInView) return;

    const duration = 1400;
    const start = performance.now();
    let frame = 0;

    const tick = (time: number) => {
      const progress = Math.min((time - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(value * eased);
      if (progress < 1) frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [isInView, value]);

  return (
    <div ref={ref} className="text-3xl font-semibold tracking-[-0.04em] text-white sm:text-5xl">
      {display.toFixed(decimals)}
      {suffix}
    </div>
  );
}

function MiniTrendChart({
  data,
  dataKey,
  lineColor,
}: {
  data: Array<Record<string, string | number>>;
  dataKey: string;
  lineColor: string;
}) {
  const width = 640;
  const height = 260;
  const padding = 26;
  const values = data.map((item) => Number(item[dataKey]));
  const max = Math.max(...values);
  const min = Math.min(...values);
  const step = (width - padding * 2) / Math.max(data.length - 1, 1);

  const points = data
    .map((item, index) => {
      const value = Number(item[dataKey]);
      const normalized = max === min ? 0.5 : (value - min) / (max - min);
      const x = padding + index * step;
      const y = height - padding - normalized * (height - padding * 2);
      return { x, y, label: String(item.month), value };
    });

  const linePath = points.map((point, index) => `${index === 0 ? "M" : "L"}${point.x} ${point.y}`).join(" ");
  const areaPath = `${linePath} L ${points[points.length - 1]?.x ?? padding} ${height - padding} L ${points[0]?.x ?? padding} ${height - padding} Z`;

  return (
    <div className="rounded-[1.8rem] border border-white/10 bg-black/15 p-5">
      <svg viewBox={`0 0 ${width} ${height}`} className="h-[260px] w-full overflow-visible">
        <defs>
          <linearGradient id={`area-${dataKey}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={lineColor} stopOpacity="0.45" />
            <stop offset="100%" stopColor={lineColor} stopOpacity="0.02" />
          </linearGradient>
        </defs>
        {[0, 1, 2, 3].map((line) => {
          const y = padding + ((height - padding * 2) / 3) * line;
          return <line key={line} x1={padding} y1={y} x2={width - padding} y2={y} stroke="rgba(255,255,255,0.08)" strokeDasharray="4 8" />;
        })}
        <path d={areaPath} fill={`url(#area-${dataKey})`} />
        <path d={linePath} fill="none" stroke={lineColor} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
        {points.map((point) => (
          <g key={point.label}>
            <circle cx={point.x} cy={point.y} r="5" fill={lineColor} />
            <text x={point.x} y={height - 6} fill="rgba(255,255,255,0.52)" fontSize="12" textAnchor="middle">
              {point.label}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}

function MiniBarChart({
  data,
  dataKey,
  barColor,
}: {
  data: Array<Record<string, string | number>>;
  dataKey: string;
  barColor: string;
}) {
  const max = Math.max(...data.map((item) => Number(item[dataKey])));

  return (
    <div className="grid h-[260px] grid-cols-6 items-end gap-4 rounded-[1.8rem] border border-white/10 bg-black/15 p-5">
      {data.map((item) => {
        const value = Number(item[dataKey]);
        const height = `${(value / max) * 100}%`;
        return (
          <div key={String(item.month)} className="flex h-full flex-col items-center justify-end gap-3">
            <div className="text-xs text-white/40">{value}</div>
            <div className="flex h-full w-full items-end rounded-full bg-white/5 px-1 py-1">
              <div className="w-full rounded-full transition-all duration-700" style={{ height, background: barColor, boxShadow: `0 0 20px ${barColor}55` }} />
            </div>
            <div className="text-xs text-white/52">{String(item.month)}</div>
          </div>
        );
      })}
    </div>
  );
}

function ProgressBar() {
  const { scrollYProgress } = useScroll();

  return (
    <motion.div
      className="fixed left-0 top-0 z-[80] h-1 w-full origin-left bg-gradient-to-r from-[#00ff88] via-[#a5ffd0] to-white shadow-[0_0_20px_rgba(0,255,136,0.7)]"
      style={{ scaleX: scrollYProgress }}
    />
  );
}

function CursorGlow() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [visible, setVisible] = useState(false);
  const [trail, setTrail] = useState<Array<{ x: number; y: number; id: number }>>([]);
  const [trailCounter, setTrailCounter] = useState(0);

  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) return;

    let idCounter = 0;
    const move = (event: MouseEvent) => {
      setVisible(true);
      setPosition({ x: event.clientX, y: event.clientY });
      idCounter++;
      setTrail((current) => {
        const next = [...current, { x: event.clientX, y: event.clientY, id: idCounter }];
        return next.slice(-12);
      });
      setTrailCounter(idCounter);
    };
    const leave = () => setVisible(false);

    window.addEventListener("mousemove", move);
    window.addEventListener("mouseout", leave);

    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseout", leave);
    };
  }, []);

  return (
    <>
      <div
        className={cn(
          "pointer-events-none fixed left-0 top-0 z-[70] hidden h-8 w-8 -translate-x-1/2 -translate-y-1/2 rounded-full border-[#00ff88]/60 bg-[#00ff88]/10 backdrop-blur-md transition-opacity duration-300 md:block",
          visible ? "opacity-100" : "opacity-0",
        )}
        style={{ transform: `translate(${position.x - 16}px, ${position.y - 16}px)`, border: "1px solid rgba(0,255,136,0.55)", mixBlendMode: "screen" }}
      />
      {trail.map((point, index) => (
        <div
          key={`${point.id}-${trailCounter}`}
          className="pointer-events-none fixed z-[69] hidden rounded-full md:block"
          style={{
            width: `${8 + index * 1.6}px`,
            height: `${8 + index * 1.6}px`,
            left: point.x - (8 + index * 1.6) / 2,
            top: point.y - (8 + index * 1.6) / 2,
            background: "radial-gradient(circle, rgba(0,255,136,0.9), rgba(0,255,136,0.15) 55%, transparent)",
            opacity: (index + 1) / trail.length * 0.55,
          }}
        />
      ))}
      <div
        className={cn(
          "pointer-events-none fixed left-0 top-0 z-[68] hidden h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(0,255,136,0.22),rgba(0,255,136,0.06)_40%,transparent_70%)] blur-2xl transition-opacity duration-500 md:block",
          visible ? "opacity-100" : "opacity-0",
        )}
        style={{ transform: `translate(${position.x - 144}px, ${position.y - 144}px)` }}
      />
    </>
  );
}

function Preloader({ progress }: { progress: number }) {
  return (
    <motion.div
      className="fixed inset-0 z-[90] flex items-center justify-center bg-[#000905]"
      exit={{ opacity: 0, pointerEvents: "none" }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="relative w-full max-w-xl px-6 text-center">
        <motion.div
          initial={{ scale: 0.86, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto mb-10 flex h-28 w-28 items-center justify-center rounded-[2rem] border border-[#00ff88]/30 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.14),transparent_36%),linear-gradient(135deg,rgba(0,255,136,0.18),rgba(255,255,255,0.04))] shadow-[0_0_100px_rgba(0,255,136,0.18)]"
        >
          <div className="relative flex items-center justify-center">
  <img
    src="/logo2.png"
    alt="GroYou"
    className="h-20 w-20 object-contain"
  />

  <span className="absolute -right-6 -top-5 text-xl text-[#00ff88]">
    ↗
  </span>
</div>
        </motion.div>
        <div className="space-y-3">
          <div className="text-sm uppercase tracking-[0.34em] text-white/45">GROYOU loading systems</div>
          <div className="text-5xl font-semibold tracking-[-0.06em] text-white">{progress}%</div>
          <div className="h-2 overflow-hidden rounded-full bg-white/10">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-[#00ff88] via-[#a5ffd0] to-white"
              animate={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function BrandMarquee() {
  const items = [...platformLogos, ...platformLogos];

  return (
    <div className="relative overflow-hidden rounded-full border border-white/10 bg-white/[0.03] py-4">
      <div className="marquee-track flex min-w-max items-center gap-4 px-4">
        {items.map((item, index) => (
          <div
            key={`${item}-${index}`}
            className="rounded-full border border-white/10 bg-[#0f1a13] px-5 py-2.5 text-sm font-medium text-white/75 shadow-[0_0_30px_rgba(0,255,136,0.04)] transition hover:border-[#00ff88]/35 hover:text-white hover:shadow-[0_0_24px_rgba(0,255,136,0.18)]"
          >
            {item}
          </div>
        ))}
      </div>
    </div>
  );
}

function QuickPrompt({ prompt, onClick }: { prompt: string; onClick: (value: string) => void }) {
  return (
    <button
      type="button"
      onClick={() => onClick(prompt)}
      className="rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-sm text-white/70 transition hover:border-[#00ff88]/35 hover:text-white"
    >
      {prompt}
    </button>
  );
}

function FounderCard({
  founder,
  index,
}: {
  founder: {
    name: string;
    designation: string;
    experience: string;
    specializations: string[];
    portfolio?: string;
    gradient: string;
    accent: string;
  };
  index: number;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const handleMove = (event: ReactMouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    setTilt({ x: -y * 12, y: x * 14 });
  };

  const reset = () => setTilt({ x: 0, y: 0 });

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMove}
      onMouseLeave={reset}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
      className="group relative tilt-card rounded-[2rem] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.05),rgba(255,255,255,0.02))] p-7 shadow-[0_30px_100px_rgba(0,0,0,0.45)] backdrop-blur-2xl transition-all duration-300 hover:border-[#00ff88]/45 hover:shadow-[0_30px_120px_rgba(0,255,136,0.22)] sm:p-8"
      style={{ transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) translateZ(0)` }}
    >
      <div
        className="absolute inset-0 opacity-10 pointer-events-none rounded-[2rem]"
        style={{ background: founder.gradient }}
      />
      <div className="relative grid gap-6 sm:grid-cols-[112px,1fr] sm:items-start">
        <div className="float-soft relative mx-auto flex h-28 w-28 items-center justify-center overflow-hidden rounded-[1.6rem] border border-white/10 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.2),rgba(0,0,0,0.2))] shadow-[0_20px_50px_rgba(0,0,0,0.35)]">
          <div
            className="absolute inset-0 opacity-40"
            style={{ background: founder.gradient }}
          />
          <span className="relative text-3xl font-semibold tracking-[-0.08em] text-white">
            {founder.name
              .split(" ")
              .map((part) => part[0])
              .join("")
              .slice(0, 2)}
          </span>
          <span className="absolute bottom-1 right-1 rounded-full border border-white/15 bg-black/35 px-2 py-0.5 text-[10px] font-semibold tracking-[0.24em] text-white/70">
            Founder
          </span>
        </div>
        <div className="relative">
          <div className="inline-flex rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[11px] uppercase tracking-[0.24em] text-white/60">{founder.designation}</div>
          <h3 className="mt-4 text-3xl font-semibold tracking-[-0.05em] text-white">{founder.name}</h3>
          <p className="mt-3 text-sm leading-7 text-white/62">{founder.experience}</p>
          <div className="mt-5 flex flex-wrap gap-2">
            {founder.specializations.map((spec) => (
              <span key={spec} className="rounded-full border border-[#00ff88]/25 bg-[#00ff88]/10 px-3 py-1 text-xs text-[#d7ffdd]">
                {spec}
              </span>
            ))}
          </div>
          <div className="mt-6 flex flex-wrap gap-3">
            <MagneticLink href={brand.whatsapp.link} target="_blank" rel="noreferrer" className="bg-[#00ff88] px-5 py-3 text-[#0a0a0a] hover:bg-[#62ffa9]">
              Connect on WhatsApp
              <ArrowRight className="h-4 w-4" />
            </MagneticLink>
            {founder.portfolio ? (
              <MagneticLink href={founder.portfolio} target="_blank" rel="noreferrer" className="bg-white/[0.04] px-5 py-3 text-white hover:border-[#00ff88]/35">
                View portfolio
                <ArrowRight className="h-4 w-4" />
              </MagneticLink>
            ) : null}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function MetricPair({ label, before, after, finalValue }: { label: string; before: string; after: string; finalValue: string }) {
  return (
    <div className="rounded-[1.4rem] border border-white/10 bg-black/20 p-4">
      <div className="text-[11px] uppercase tracking-[0.22em] text-white/42">{label}</div>
      <div className="mt-2 text-sm text-white/50">Before: <span className="text-white/70">{before}</span></div>
      <div className="mt-3 text-2xl font-semibold tracking-[-0.04em] text-[#00ff88]">{after}</div>
      <div className="mt-1 text-sm text-white/72">Now: {finalValue}</div>
    </div>
  );
}

function LogoWatermark() {
  const { scrollYProgress } = useScroll();

  return (
    <motion.div
      className="pointer-events-none absolute inset-0 overflow-hidden"
      style={{ opacity: scrollYProgress }}
    >
      <div
        className="logo-watermark"
        style={{
          left: "50%",
          top: "50%",
          fontSize: "min(62vw, 52rem)",
          transform: "translate(-50%, -50%)",
          whiteSpace: "nowrap",
        }}
      >
        {brand.name}
      </div>
    </motion.div>
  );
}

function HeroParticles() {
  const particles = useMemo(
    () =>
      Array.from({ length: 24 }, (_, index) => ({
        id: index,
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        size: 2 + Math.random() * 5,
        duration: 6 + Math.random() * 10,
        delay: Math.random() * 6,
      })),
    [],
  );

  return (
    <>
      {particles.map((particle) => (
      <span
        key={particle.id}
        className="hero-particle animate-[floatSoft_10s_ease-in-out_infinite]"
        style={{
          left: particle.left,
          top: particle.top,
          width: `${particle.size}px`,
          height: `${particle.size}px`,
          animationDuration: `${particle.duration}s`,
          animationDelay: `${particle.delay}s`,
        }}
      />
    ))}
      <div className="flow-line" style={{ top: "32%", width: "80%", left: "-10%", animationDelay: "0s" }} />
      <div className="flow-line" style={{ top: "58%", width: "70%", left: "15%", animationDelay: "2.2s" }} />
      <div className="flow-line" style={{ top: "74%", width: "55%", left: "25%", animationDelay: "4.1s" }} />
    </>
  );
}

function FloatingWhatsApp() {
  const [open, setOpen] = useState(false);

  return (
    <div className="fixed bottom-6 right-5 z-[60] flex flex-col items-end gap-3 sm:bottom-8 sm:right-8">
      <AnimatePresence>
        {open ? (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="w-[320px] rounded-[1.6rem] border border-white/10 bg-[linear-gradient(180deg,rgba(10,10,10,0.9),rgba(0,0,0,0.9))] p-5 shadow-[0_30px_100px_rgba(0,0,0,0.55)] backdrop-blur-2xl"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#00ff88] text-[#0a0a0a]">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M20.5 3.5A11.9 11.9 0 0 0 12 0 12 12 0 0 0 1.7 17.9L0 24l6.3-1.6A12 12 0 1 0 20.5 3.5ZM12 21.9a9.9 9.9 0 0 1-5-1.4l-.4-.2-3.7 1 1-3.6-.2-.4A10 10 0 1 1 12 21.9Z"/>
                </svg>
              </div>
              <div>
                <div className="text-sm font-semibold text-white">{brand.name} Team</div>
                <div className="text-xs text-white/50">Usually replies in a few minutes</div>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="ml-auto rounded-full border border-white/10 px-3 py-1 text-xs text-white/60 hover:text-white"
              >
                Close
              </button>
            </div>
            <p className="mt-4 rounded-[1rem] bg-white/[0.05] p-4 text-sm leading-7 text-white/72">
              Hi 👋 Welcome to GROYOU. Tell us what you want to achieve and we'll send over a tailored strategy.
            </p>
            <a
              href={brand.whatsapp.link}
              target="_blank"
              rel="noreferrer"
              className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#00ff88] px-5 py-3 text-sm font-semibold text-[#0a0a0a]"
            >
              Continue on WhatsApp
              <ArrowRight className="h-4 w-4" />
            </a>
          </motion.div>
        ) : null}
      </AnimatePresence>
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="group flex h-14 w-14 items-center justify-center rounded-full bg-[#00ff88] text-[#0a0a0a] shadow-[0_20px_60px_rgba(0,255,136,0.45)] transition-all hover:scale-105 sm:h-16 sm:w-16"
        aria-label="Chat with GROYOU on WhatsApp"
      >
        <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M20.5 3.5A11.9 11.9 0 0 0 12 0 12 12 0 0 0 1.7 17.9L0 24l6.3-1.6A12 12 0 1 0 20.5 3.5ZM12 21.9a9.9 9.9 0 0 1-5-1.4l-.4-.2-3.7 1 1-3.6-.2-.4A10 10 0 1 1 12 21.9Zm5.5-7.6c-.3-.2-1.8-.9-2.1-1-.3-.1-.5-.1-.7.1-.2.3-.8 1-1 1.2-.2.2-.4.2-.7.1-.3-.1-1.2-.4-2.3-1.4a8.5 8.5 0 0 1-1.6-2c-.2-.3 0-.5.1-.6l.5-.5c.1-.2.2-.3.3-.5.1-.2 0-.4 0-.5 0-.1-.7-1.6-1-2.2-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.7.3-.3.3-1 1-1 2.5s1 2.8 1.1 3c.1.2 2 3 4.8 4.2a17.3 17.3 0 0 0 1.7.7c.7.2 1.4.2 1.9.1.6-.1 1.8-.7 2-1.5.2-.7.2-1.3.1-1.5-.1-.2-.3-.2-.6-.4Z"/>
        </svg>
        <span className="absolute -left-1 -top-1 flex h-4 w-4 animate-pulse items-center justify-center rounded-full bg-[#00ff88] ring-4 ring-[#0a0a0a]" />
      </button>
    </div>
  );
}

export default function App() {
  const rootRef = useRef<HTMLDivElement>(null);
  const storySectionRef = useRef<HTMLElement>(null);
  const storyLineRef = useRef<HTMLDivElement>(null);
  const storyCardRefs = useRef<Array<HTMLDivElement | null>>([]);
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [activeTool, setActiveTool] = useState<"roi" | "forecast" | "audit" | "qualifier" | "assistant">("roi");
  const [auditInputs, setAuditInputs] = useState({ speed: 68, conversionRate: 2.1, offerClarity: 7, trackingReady: true, crmConnected: false });
  const [roiInputs, setRoiInputs] = useState({ spend: 120000, cpc: 42, landingRate: 8.5, closeRate: 22, avgDeal: 28000 });
  const [forecastInputs, setForecastInputs] = useState({ currentRevenue: 1200000, monthlyGrowth: 14, months: 6 });
  const [qualifierInputs, setQualifierInputs] = useState({ budget: 4, urgency: 4, offerFit: 5, salesReadiness: 3, trackingMaturity: 3 });
  const [assistantInput, setAssistantInput] = useState("");
  const [assistantMessages, setAssistantMessages] = useState<AIMessage[]>([
    {
      role: "assistant",
      text: "I’m GroYou’s strategy assistant. Ask about SEO, paid ads, funnels, lead quality, scaling, reporting or how we would approach your market.",
    },
  ]);
  const [faqOpen, setFaqOpen] = useState<number | null>(0);
  const [formStep, setFormStep] = useState(0);
  const [submittedPayload, setSubmittedPayload] = useState<Record<string, string> | null>(null);

  useEffect(() => {
    let frame = 0;
    const duration = 2200;
    const start = performance.now();

    const tick = (time: number) => {
      const next = Math.min(((time - start) / duration) * 100, 100);
      setProgress(Math.round(next));
      if (next < 100) {
        frame = requestAnimationFrame(tick);
      } else {
        window.setTimeout(() => setLoading(false), 350);
      }
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    const lenis = new Lenis({ duration: 1.1, smoothWheel: true, touchMultiplier: 1.2 });
    let frame = 0;

    const raf = (time: number) => {
      lenis.raf(time);
      frame = requestAnimationFrame(raf);
    };

    frame = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(frame);
      lenis.destroy();
    };
  }, []);

  useLayoutEffect(() => {
    if (!rootRef.current) return;

    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>(".reveal-up").forEach((element) => {
        gsap.fromTo(
          element,
          { y: 40, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: element,
              start: "top 84%",
            },
          },
        );
      });

      if (storySectionRef.current && storyLineRef.current) {
        gsap.fromTo(
          storyLineRef.current,
          { scaleY: 0, transformOrigin: "top center" },
          {
            scaleY: 1,
            ease: "none",
            scrollTrigger: {
              trigger: storySectionRef.current,
              start: "top 30%",
              end: "bottom bottom",
              scrub: true,
            },
          },
        );
      }

      storyCardRefs.current.forEach((card, index) => {
        if (!card) return;
        gsap.fromTo(
          card,
          { opacity: 0, y: 36, x: index % 2 === 0 ? -20 : 20 },
          {
            opacity: 1,
            y: 0,
            x: 0,
            duration: 0.9,
            ease: "power3.out",
            scrollTrigger: {
              trigger: card,
              start: "top 80%",
            },
          },
        );
      });
    }, rootRef);

    return () => ctx.revert();
  }, []);

  const utmDefaults = useMemo(
    () => {
      const params = new URLSearchParams(window.location.search);
      return {
        utm_source: params.get("utm_source") ?? "direct",
        utm_medium: params.get("utm_medium") ?? "organic",
        utm_campaign: params.get("utm_campaign") ?? "brand",
        utm_content: params.get("utm_content") ?? "homepage",
        utm_term: params.get("utm_term") ?? "groyou",
      };
    },
    [],
  );

  const {
    register,
    handleSubmit,
    watch,
    trigger,
    formState: { errors, isSubmitting },
  } = useForm<LeadFormValues>({
    resolver: zodResolver(leadSchema),
    defaultValues: {
      fullName: "",
      companyName: "",
      websiteUrl: "",
      email: "",
      phone: "",
      whatsApp: "",
      industry: "",
      monthlyRevenue: "₹5L - ₹25L",
      marketingBudget: "₹50k - ₹2L / month",
      currentChannels: "Google Ads, Meta Ads, Instagram, SEO",
      servicesNeeded: "SEO, Google Ads, Meta Ads, Landing Pages, Automation",
      businessGoals: "Generate more qualified leads and improve cost efficiency.",
      targetLocation: "India",
      numberOfEmployees: "11-50",
      timeline: "Within 30 days",
      message: "We want a serious growth partner who can improve lead quality, funnel visibility and revenue performance.",
      preferredContactTime: "2 PM - 6 PM",
      preferredContactMethod: "WhatsApp",
      ...utmDefaults,
    },
  });

  const stepFields: Array<Array<keyof LeadFormValues>> = [
    ["fullName", "companyName", "websiteUrl", "email", "phone", "whatsApp", "industry"],
    ["monthlyRevenue", "currentChannels", "servicesNeeded", "targetLocation", "numberOfEmployees"],
    ["marketingBudget", "timeline"],
    ["businessGoals", "message"],
    ["preferredContactTime", "preferredContactMethod"],
  ];

  async function nextFormStep() {
    const valid = await trigger(stepFields[formStep]);
    if (valid) setFormStep((prev) => Math.min(prev + 1, 4));
  }

  function previousFormStep() {
    setFormStep((prev) => Math.max(prev - 1, 0));
  }

  async function onSubmit(values: LeadFormValues) {
    const payload = {
      ...values,
      source: "GroYou website",
      submittedAt: new Date().toISOString(),
    };

    localStorage.setItem("groyou-lead", JSON.stringify(payload));
    setSubmittedPayload(payload);
  }

  const auditScore = useMemo(() => {
    const speedScore = auditInputs.speed * 0.35;
    const conversionScore = Math.min(auditInputs.conversionRate * 12, 25);
    const clarityScore = auditInputs.offerClarity * 3;
    const trackingScore = auditInputs.trackingReady ? 10 : 0;
    const crmScore = auditInputs.crmConnected ? 10 : 3;
    return Math.round(speedScore + conversionScore + clarityScore + trackingScore + crmScore);
  }, [auditInputs]);

  const roiOutput = useMemo(() => {
    const clicks = roiInputs.spend / Math.max(roiInputs.cpc, 1);
    const leads = clicks * (roiInputs.landingRate / 100);
    const customers = leads * (roiInputs.closeRate / 100);
    const revenue = customers * roiInputs.avgDeal;
    const roas = revenue / Math.max(roiInputs.spend, 1);
    return { clicks, leads, customers, revenue, roas };
  }, [roiInputs]);

  const forecastSeries = useMemo(() => {
    return Array.from({ length: forecastInputs.months }, (_, index) => {
      const month = index + 1;
      const revenue = forecastInputs.currentRevenue * Math.pow(1 + forecastInputs.monthlyGrowth / 100, month);
      return { month: `M${month}`, revenue: Math.round(revenue) };
    });
  }, [forecastInputs]);

  const qualificationScore = useMemo(() => {
    return qualifierInputs.budget + qualifierInputs.urgency + qualifierInputs.offerFit + qualifierInputs.salesReadiness + qualifierInputs.trackingMaturity;
  }, [qualifierInputs]);

  function generateAssistantReply(prompt: string) {
    const lower = prompt.toLowerCase();
    if (lower.includes("seo")) {
      return "For SEO, we’d prioritise technical cleanup, service-page architecture, local intent capture, authority building and conversion paths tied directly to enquiries — not just traffic.";
    }
    if (lower.includes("meta") || lower.includes("facebook") || lower.includes("instagram")) {
      return "For Meta, we’d structure campaigns around funnel stage, creative fatigue monitoring, lead quality feedback and destination-specific landing experiences rather than one generic form flow.";
    }
    if (lower.includes("google") || lower.includes("search") || lower.includes("pmax")) {
      return "For Google Ads, we’d tighten keyword intent, search terms, offer-message alignment, conversion tracking and budget segmentation so the account scales on qualified demand rather than noisy volume.";
    }
    if (lower.includes("lead") || lower.includes("quality")) {
      return "Lead quality typically improves when the ad promise, landing page, qualification questions, CRM tagging and sales follow-up speed are engineered together. That’s usually where the biggest gains sit.";
    }
    if (lower.includes("scale") || lower.includes("growth")) {
      return "To scale safely, we’d confirm your winning offer, stable unit economics, accurate attribution, landing page capacity and a reporting cadence that tells us exactly where the next rupee should go.";
    }
    return "Our default approach is audit first, fix tracking, sharpen positioning, improve conversion paths and then scale the best-performing channels with weekly optimisation loops.";
  }

  function submitAssistantPrompt(prompt: string) {
    const clean = prompt.trim();
    if (!clean) return;
    setAssistantMessages((messages) => [
      ...messages,
      { role: "user", text: clean },
      { role: "assistant", text: generateAssistantReply(clean) },
    ]);
    setAssistantInput("");
  }

  function copyPayload() {
    if (!submittedPayload) return;
    navigator.clipboard.writeText(JSON.stringify(submittedPayload, null, 2));
  }

  const currentValues = watch();
  const leadSummary = encodeURIComponent(
    `Hi GroYou, I want a growth audit.%0AName: ${currentValues.fullName}%0ACompany: ${currentValues.companyName}%0AWebsite: ${currentValues.websiteUrl}%0AIndustry: ${currentValues.industry}%0ABudget: ${currentValues.marketingBudget}%0AGoals: ${currentValues.businessGoals}`,
  );
  const mailtoLink = `mailto:hello@groyou.in?subject=GroYou Growth Audit - ${encodeURIComponent(currentValues.companyName || "New Enquiry")}&body=${leadSummary}`;
  const whatsappLink = `https://wa.me/?text=${leadSummary}`;
  const googleMeetLink = `https://calendar.google.com/calendar/u/0/r/eventedit?text=${encodeURIComponent(`GroYou Growth Consultation - ${currentValues.companyName || "New Lead"}`)}&details=${leadSummary}`;

  return (
    <div ref={rootRef} className="relative min-h-screen overflow-x-clip bg-[#0a0a0a] text-white selection:bg-[#00ff88] selection:text-[#0a0a0a]">
      <ProgressBar />
      <CursorGlow />

      <AnimatePresence>{loading ? <Preloader progress={progress} /> : null}</AnimatePresence>

      <div className="pointer-events-none fixed inset-0 z-0 bg-[radial-gradient(circle_at_15%_20%,rgba(0,255,136,0.14),transparent_26%),radial-gradient(circle_at_85%_10%,rgba(255,255,255,0.08),transparent_18%),radial-gradient(circle_at_70%_65%,rgba(0,255,136,0.14),transparent_24%)]" />
      <div className="noise-mask pointer-events-none fixed inset-0 z-0 opacity-30" />

      <header className="fixed inset-x-0 top-5 z-50 mx-auto w-[min(96%,1280px)] rounded-full border border-white/10 bg-black/25 px-4 py-3 backdrop-blur-2xl shadow-[0_10px_60px_rgba(0,0,0,0.35)]">
        <div className="flex items-center justify-between gap-4">
         <a href="#hero" className="flex items-center gap-3">
<div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-2xl border border-[#43F000]/20 bg-[#43F000]/10">
  <img
    src="/logo2.png"
    alt="GroYou"
    className="h-8 w-8 object-contain drop-shadow-[0_0_12px_rgba(0,255,136,0.8)]"
  />
</div>
  <div>
    <div className="text-sm font-semibold tracking-[0.04em] text-white">GroYou</div>
    <div className="text-[11px] uppercase tracking-[0.26em] text-white/45">
      Grow smarter. Scale faster.
    </div>
  </div>
</a>

          <nav className="hidden items-center gap-6 text-sm text-white/60 lg:flex">
            <a href="#story" className="transition hover:text-white">Story</a>
            <a href="#services" className="transition hover:text-white">Services</a>
            <a href="#dashboard" className="transition hover:text-white">Results</a>
            <a href="#cases" className="transition hover:text-white">Case studies</a>
            <a href="#ai-tools" className="transition hover:text-white">AI tools</a>
            <a href="#contact" className="transition hover:text-white">Contact</a>
          </nav>

          <MagneticLink href={brand.whatsapp.link} target="_blank" rel="noreferrer" className="bg-white/[0.04] px-4 py-3 text-white/90 hover:border-[#00ff88]/30 hover:text-white">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M20.5 3.5A11.9 11.9 0 0 0 12 0 12 12 0 0 0 1.7 17.9L0 24l6.3-1.6A12 12 0 1 0 20.5 3.5ZM12 21.9a9.9 9.9 0 0 1-5-1.4l-.4-.2-3.7 1 1-3.6-.2-.4A10 10 0 1 1 12 21.9Zm5.5-7.6c-.3-.2-1.8-.9-2.1-1-.3-.1-.5-.1-.7.1-.2.3-.8 1-1 1.2-.2.2-.4.2-.7.1-.3-.1-1.2-.4-2.3-1.4a8.5 8.5 0 0 1-1.6-2c-.2-.3 0-.5.1-.6l.5-.5c.1-.2.2-.3.3-.5.1-.2 0-.4 0-.5 0-.1-.7-1.6-1-2.2-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.7.3-.3.3-1 1-1 2.5s1 2.8 1.1 3c.1.2 2 3 4.8 4.2a17.3 17.3 0 0 0 1.7.7c.7.2 1.4.2 1.9.1.6-.1 1.8-.7 2-1.5.2-.7.2-1.3.1-1.5-.1-.2-.3-.2-.6-.4Z"/>
            </svg>
            Chat on WhatsApp
          </MagneticLink>
          <MagneticLink href="#contact" className="bg-[#00ff88] px-5 py-3 text-[#0a0a0a] shadow-[0_0_32px_rgba(0,255,136,0.45)] hover:bg-[#62ffa9]">
            Book Free Consultation
            <ArrowRight className="h-4 w-4" />
          </MagneticLink>
        </div>
      </header>

      <FloatingWhatsApp />
      <main className="relative z-10">
        <section id="hero" className="relative mx-auto flex min-h-screen w-[min(96%,1280px)] flex-col justify-center gap-14 overflow-hidden pt-32 lg:grid lg:grid-cols-[1.08fr_0.92fr] lg:gap-10 lg:pt-36">
          <LogoWatermark />
          <HeroParticles />
          <div className="flex flex-col justify-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: loading ? 0 : 1, y: loading ? 30 : 0 }}
              transition={{ delay: 0.1, duration: 0.8 }}
              className="mb-6 inline-flex w-fit items-center gap-3 rounded-full border border-[#43F000]/20 bg-[#43F000]/10 px-5 py-3 text-xs font-semibold uppercase tracking-[0.3em] text-[#c2ffb0]"
            >
              <BrainCircuit className="h-4 w-4" />
              Premium growth partner for modern brands
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 35 }}
              animate={{ opacity: loading ? 0 : 1, y: loading ? 35 : 0 }}
              transition={{ delay: 0.2, duration: 0.9 }}
              className="max-w-4xl text-[3rem] font-semibold leading-[0.95] tracking-[-0.08em] text-white sm:text-[4.8rem] lg:text-[6.4rem]"
            >
              Grow smarter.
              <br />
              <span className="bg-gradient-to-r from-white via-[#b8ff9c] to-[#43F000] bg-clip-text text-transparent">Scale faster.</span>
              <br />
              Dominate digital.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 35 }}
              animate={{ opacity: loading ? 0 : 1, y: loading ? 35 : 0 }}
              transition={{ delay: 0.32, duration: 0.9 }}
              className="mt-7 max-w-2xl text-lg leading-8 text-white/68 sm:text-xl"
            >
              GroYou builds premium growth systems for ambitious businesses — combining strategy, SEO, paid media, landing pages, analytics and automation into one performance engine.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 35 }}
              animate={{ opacity: loading ? 0 : 1, y: loading ? 35 : 0 }}
              transition={{ delay: 0.44, duration: 0.9 }}
              className="mt-10 flex flex-wrap items-center gap-4"
            >
              <MagneticLink href="#contact" className="bg-[#00ff88] px-7 py-4 text-[#0a0a0a] shadow-[0_0_40px_rgba(0,255,136,0.34)] hover:bg-[#62ffa9]">
                Book Free Consultation
                <ArrowRight className="h-4 w-4" />
              </MagneticLink>
              <MagneticLink href={brand.whatsapp.link} target="_blank" rel="noreferrer" className="bg-white/[0.03] px-7 py-4 text-white hover:border-[#00ff88]/35 hover:bg-white/[0.06]">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M20.5 3.5A11.9 11.9 0 0 0 12 0 12 12 0 0 0 1.7 17.9L0 24l6.3-1.6A12 12 0 1 0 20.5 3.5ZM12 21.9a9.9 9.9 0 0 1-5-1.4l-.4-.2-3.7 1 1-3.6-.2-.4A10 10 0 1 1 12 21.9Zm5.5-7.6c-.3-.2-1.8-.9-2.1-1-.3-.1-.5-.1-.7.1-.2.3-.8 1-1 1.2-.2.2-.4.2-.7.1-.3-.1-1.2-.4-2.3-1.4a8.5 8.5 0 0 1-1.6-2c-.2-.3 0-.5.1-.6l.5-.5c.1-.2.2-.3.3-.5.1-.2 0-.4 0-.5 0-.1-.7-1.6-1-2.2-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.7.3-.3.3-1 1-1 2.5s1 2.8 1.1 3c.1.2 2 3 4.8 4.2a17.3 17.3 0 0 0 1.7.7c.7.2 1.4.2 1.9.1.6-.1 1.8-.7 2-1.5.2-.7.2-1.3.1-1.5-.1-.2-.3-.2-.6-.4Z"/>
                </svg>
                Chat On WhatsApp
              </MagneticLink>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 35 }}
              animate={{ opacity: loading ? 0 : 1, y: loading ? 35 : 0 }}
              transition={{ delay: 0.56, duration: 0.9 }}
              className="mt-10 grid gap-4 sm:grid-cols-3"
            >
              {[
                { label: "Channels unified", value: "SEO + Ads + CRO" },
                { label: "Measurement depth", value: "GA4 + CRM + GTM" },
                { label: "Automation ready", value: "WhatsApp + email flows" },
              ].map((item) => (
                <div key={item.label} className="rounded-[1.4rem] border border-white/10 bg-white/[0.03] p-5 backdrop-blur-xl">
                  <div className="text-xs uppercase tracking-[0.28em] text-white/40">{item.label}</div>
                  <div className="mt-2 text-lg font-semibold text-white">{item.value}</div>
                </div>
              ))}
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: loading ? 0 : 1, scale: loading ? 0.98 : 1 }}
            transition={{ delay: 0.4, duration: 1 }}
            className="relative"
          >
            <HeroCanvas />
            <div className="pointer-events-none absolute -left-8 bottom-10 hidden rounded-[1.5rem] border border-[#43F000]/20 bg-black/45 p-5 backdrop-blur-xl lg:block">
              <div className="text-[10px] uppercase tracking-[0.28em] text-white/45">Command center</div>
              <div className="mt-2 text-sm leading-6 text-white/75">Interactive KPI layers, campaign orbits, lead funnel telemetry and volumetric glow-driven depth.</div>
            </div>
          </motion.div>
        </section>

        <section className="mx-auto w-[min(96%,1280px)] py-10 reveal-up">
          <BrandMarquee />
        </section>

        <section id="story" ref={storySectionRef} className="mx-auto w-[min(96%,1280px)] py-24 lg:py-32">
          <div className="grid gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
            <div className="lg:sticky lg:top-28 lg:h-fit">
              <SectionHeader
                eyebrow="Founder story"
                title="A growth partner built from execution, not theory."
                copy="GroYou was shaped by years of working inside real campaign pressure — where sales teams need better leads, founders need clarity and every rupee must perform."
              />
              <div className="mt-8 rounded-[2rem] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.05),rgba(255,255,255,0.02))] p-6 backdrop-blur-xl">
                <div className="text-sm uppercase tracking-[0.28em] text-white/40">Why this matters</div>
                <p className="mt-4 text-base leading-8 text-white/68">
                  The difference between decent marketing and category-leading growth is system design. GroYou brings together channel expertise, conversion thinking, analytics rigour and automation so growth stops depending on guesswork.
                </p>
              </div>
            </div>

            <div className="relative pl-8 sm:pl-12">
              <div className="absolute left-2 top-0 h-full w-px bg-white/10 sm:left-4" />
              <div ref={storyLineRef} className="absolute left-2 top-0 h-full w-px bg-gradient-to-b from-[#43F000] via-[#7dff58] to-transparent sm:left-4" />
              <div className="space-y-10">
                {founderTimeline.map((item, index) => (
                  <div
                    key={item.year}
                    ref={(element) => {
                      storyCardRefs.current[index] = element;
                    }}
                    className="relative rounded-[2rem] border border-white/10 bg-white/[0.03] p-7 backdrop-blur-xl"
                  >
                    <div className="absolute -left-[1.55rem] top-9 h-4 w-4 rounded-full border border-[#43F000]/40 bg-[#43F000] shadow-[0_0_20px_rgba(67,240,0,0.55)] sm:-left-[2.55rem]" />
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <div className="text-xs uppercase tracking-[0.3em] text-[#bfffad]">{item.year}</div>
                        <h3 className="mt-3 text-2xl font-semibold tracking-[-0.04em] text-white">{item.title}</h3>
                      </div>
                      <div className="rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-xs uppercase tracking-[0.26em] text-white/45">
                        Milestone {index + 1}
                      </div>
                    </div>
                    <p className="mt-4 max-w-xl text-base leading-8 text-white/68">{item.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto w-[min(96%,1280px)] py-24 reveal-up lg:py-32">
          <SectionHeader
            eyebrow="Cinematic funnel storytelling"
            title="We turn marketing chaos into a measurable growth machine."
            copy="Every engagement starts by finding where momentum breaks — then rebuilding the journey from positioning to pipeline visibility."
            align="center"
          />

          <div className="mt-16 grid gap-5 lg:grid-cols-6">
            {storytellingSteps.map((step, index) => (
              <motion.div
                key={step.title}
                whileHover={{ y: -10, rotateX: 4 }}
                transition={{ duration: 0.35 }}
                className="group relative overflow-hidden rounded-[2rem] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.04),rgba(255,255,255,0.02))] p-6 backdrop-blur-xl"
              >
                <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl border border-[#43F000]/20 bg-[#43F000]/10 text-lg font-semibold text-[#c3ffb3]">
                  0{index + 1}
                </div>
                <div className="text-xl font-semibold tracking-[-0.04em] text-white">{step.title}</div>
                <p className="mt-4 text-sm leading-7 text-white/65">{step.copy}</p>
                <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-transparent via-[#43F000] to-transparent opacity-0 transition group-hover:opacity-100" />
              </motion.div>
            ))}
          </div>
        </section>

        <section id="services" className="mx-auto w-[min(96%,1280px)] py-24 lg:py-32">
          <div className="grid gap-12 xl:grid-cols-[0.82fr_1.18fr] xl:items-center">
            <div>
              <SectionHeader
                eyebrow="Services galaxy"
                title="Seventeen growth capabilities. One integrated orbit."
                copy="From SEO and paid acquisition to brand systems, landing pages and AI automation, GroYou designs every service as part of the same revenue engine."
              />
              <div className="mt-10 grid gap-4">
                {serviceCards.map((service) => (
                  <motion.div
                    key={service.title}
                    whileHover={{ x: 8 }}
                    transition={{ duration: 0.25 }}
                    className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-6 backdrop-blur-xl"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="text-2xl font-semibold tracking-[-0.04em] text-white">{service.title}</h3>
                        <p className="mt-3 max-w-xl text-base leading-7 text-white/68">{service.description}</p>
                      </div>
                      <ArrowRight className="mt-1 h-5 w-5 text-[#82ff56]" />
                    </div>
                    <div className="mt-5 flex flex-wrap gap-3">
                      {service.items.map((item) => (
                        <span key={item} className="rounded-full border border-white/10 bg-black/20 px-3 py-1.5 text-sm text-white/72">
                          {item}
                        </span>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            <div className="space-y-5">
              <ServiceGalaxyCanvas />
              <div className="grid gap-4 md:grid-cols-3">
                {[
                  { icon: Layers3, title: "Branding lab", copy: "Visual identity systems, offer hierarchy, premium creative direction and narrative consistency." },
                  { icon: MousePointerClick, title: "Social media studio", copy: "Platform-native content, short-form hooks, community formats and thumb-stopping campaign assets." },
                  { icon: Workflow, title: "Automation mesh", copy: "Lead capture, follow-up sequences, CRM routing and reporting flows that reduce leakage." },
                ].map((item) => (
                  <div key={item.title} className="rounded-[1.6rem] border border-white/10 bg-white/[0.03] p-5 backdrop-blur-xl">
                    <item.icon className="h-5 w-5 text-[#89ff61]" />
                    <div className="mt-4 text-lg font-semibold text-white">{item.title}</div>
                    <p className="mt-2 text-sm leading-7 text-white/65">{item.copy}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="dashboard" className="mx-auto w-[min(96%,1280px)] py-24 reveal-up lg:py-32">
          <SectionHeader
            eyebrow="Performance dashboard"
            title="A command view of revenue, leads and efficiency."
            copy="The best growth teams don’t guess. They instrument the funnel, watch quality signals and make decisions with clear visibility into results."
          />

          <div className="mt-12 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {dashboardMetrics.map((metric) => (
              <div key={metric.label} className="rounded-[2rem] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.04),rgba(255,255,255,0.02))] p-6 backdrop-blur-xl">
                <div className="text-xs uppercase tracking-[0.28em] text-white/40">{metric.label}</div>
                <div className="mt-4">
                  <CountUp value={metric.value} suffix={metric.suffix} decimals={metric.value % 1 !== 0 ? 1 : 0} />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10 grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
            <div className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-6 backdrop-blur-xl">
              <div className="mb-5 flex items-center justify-between gap-4">
                <div>
                  <div className="text-xs uppercase tracking-[0.28em] text-white/40">Revenue trajectory</div>
                  <div className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-white">Six-month growth view</div>
                </div>
                <div className="rounded-full border border-[#43F000]/20 bg-[#43F000]/10 px-4 py-2 text-sm font-medium text-[#c9ffb8]">Live reporting style</div>
              </div>
              <div className="mt-2">
                <MiniTrendChart data={performanceData as Array<Record<string, string | number>>} dataKey="revenue" lineColor="#7dff58" />
              </div>
            </div>

            <div className="grid gap-6">
              <div className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-6 backdrop-blur-xl">
                <div className="mb-5 flex items-center gap-3">
                  <BarChart3 className="h-5 w-5 text-[#7dff58]" />
                  <div className="text-lg font-semibold text-white">Lead volume & pipeline health</div>
                </div>
                <div className="mt-2">
                  <MiniBarChart data={performanceData as Array<Record<string, string | number>>} dataKey="leads" barColor="#43F000" />
                </div>
              </div>

              <div className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-6 backdrop-blur-xl">
                <div className="flex items-center gap-3 text-lg font-semibold text-white">
                  <ShieldCheck className="h-5 w-5 text-[#7dff58]" />
                  CRM & reporting coverage
                </div>
                <div className="mt-5 flex flex-wrap gap-3">
                  {crmIntegrations.map((item) => (
                    <span key={item} className="rounded-full border border-white/10 bg-black/20 px-4 py-2 text-sm text-white/72">
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto w-[min(96%,1280px)] py-24 reveal-up lg:py-32">
          <SectionHeader
            eyebrow="Industry fit"
            title="Built for high-value service brands, ambitious operators and scalable offers."
            copy="Different industries require different qualification logic, narratives and growth levers. GroYou adapts the system to how your market buys."
            align="center"
          />
          <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {industries.map((industry) => (
              <motion.div
                key={industry}
                whileHover={{ y: -8 }}
                className="rounded-[1.8rem] border border-white/10 bg-white/[0.03] p-6 backdrop-blur-xl"
              >
                <Globe2 className="h-5 w-5 text-[#8eff63]" />
                <div className="mt-4 text-2xl font-semibold tracking-[-0.04em] text-white">{industry}</div>
                <p className="mt-3 text-sm leading-7 text-white/64">
                  Positioning, demand generation and funnel optimisation tailored for {industry.toLowerCase()} businesses.
                </p>
              </motion.div>
            ))}
          </div>
        </section>

        <section id="cases" className="mx-auto w-[min(96%,1280px)] py-24 lg:py-32">
          <SectionHeader
            eyebrow="Case studies"
            title="Proof designed as sticky, scroll-led narratives."
            copy="Each engagement starts with a clear problem, a deliberate strategy and execution mapped to measurable outcomes."
          />

          <div className="mt-14 space-y-10">
            {caseStudies.map((study, index) => (
              <div key={study.company} className="sticky rounded-[2rem] border border-white/10 bg-[linear-gradient(180deg,rgba(4,29,16,0.92),rgba(3,16,9,0.96))] p-6 backdrop-blur-xl shadow-[0_20px_80px_rgba(0,0,0,0.22)] sm:p-8" style={{ top: `${110 + index * 18}px` }}>
                <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr]">
                  <div>
                    <div className="inline-flex rounded-full border border-[#43F000]/20 bg-[#43F000]/10 px-4 py-2 text-xs uppercase tracking-[0.28em] text-[#c8ffb6]">
                      {study.industry}
                    </div>
                    <h3 className="mt-5 text-3xl font-semibold tracking-[-0.05em] text-white">{study.company}</h3>
                    <p className="mt-4 text-base leading-8 text-white/68">{study.problem}</p>
                    <div className="mt-6 grid gap-4 sm:grid-cols-2">
                      <div className="rounded-[1.5rem] border border-white/10 bg-black/20 p-5">
                        <div className="text-xs uppercase tracking-[0.24em] text-white/42">Before</div>
                        <div className="mt-3 text-lg font-medium text-white/70">{study.before.metric}</div>
                        <div className="mt-1 text-3xl font-semibold text-white">{study.before.value}</div>
                      </div>
                      <div className="rounded-[1.5rem] border border-[#43F000]/20 bg-[#43F000]/10 p-5">
                        <div className="text-xs uppercase tracking-[0.24em] text-[#d1ffc1]">After</div>
                        <div className="mt-3 text-lg font-medium text-white/75">{study.after.metric}</div>
                        <div className="mt-1 text-3xl font-semibold text-white">{study.after.value}</div>
                      </div>
                    </div>
                  </div>

                  <div className="grid gap-5">
                    <div className="rounded-[1.7rem] border border-white/10 bg-white/[0.03] p-6">
                      <div className="text-xs uppercase tracking-[0.28em] text-white/42">Strategy</div>
                      <p className="mt-3 text-base leading-8 text-white/68">{study.strategy}</p>
                    </div>
                    <div className="rounded-[1.7rem] border border-white/10 bg-white/[0.03] p-6">
                      <div className="text-xs uppercase tracking-[0.28em] text-white/42">Execution</div>
                      <div className="mt-4 flex flex-wrap gap-3">
                        {study.execution.map((item) => (
                          <span key={item} className="rounded-full border border-white/10 bg-black/20 px-4 py-2 text-sm text-white/72">
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="rounded-[1.7rem] border border-[#43F000]/20 bg-[#43F000]/10 p-6">
                      <div className="text-xs uppercase tracking-[0.28em] text-[#d0ffc0]">Result</div>
                      <p className="mt-3 text-lg leading-8 text-white">{study.result}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section id="founders" className="mx-auto w-[min(96%,1280px)] py-24 reveal-up lg:py-32">
          <div className="space-y-5 text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#00ff88]/25 bg-[#00ff88]/10 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.28em] text-[#d1ffb9]">
              <Sparkles className="h-4 w-4" />
              Meet the founders
            </div>
            <h2 className="mx-auto max-w-3xl text-3xl font-semibold tracking-[-0.04em] text-white sm:text-5xl lg:text-6xl">{founderStory.title}</h2>
            <p className="mx-auto max-w-3xl text-base leading-8 text-white/68 sm:text-lg">{founderStory.content}</p>
          </div>

          <div className="mt-14 grid gap-6 md:grid-cols-2">
            {founders.map((founder, index) => (
              <FounderCard key={founder.name} founder={founder} index={index} />
            ))}
          </div>
        </section>

        <section id="case-hits" className="mx-auto w-[min(96%,1280px)] py-24 reveal-up lg:py-32">
          <SectionHeader
            eyebrow="Growth in numbers"
            title="Before → after metrics that move the needle."
            copy="Performance transparency. Every metric is captured from live dashboards, attribution models and CRM-level revenue attribution."
          />
          <div className="mt-12 grid gap-6 lg:grid-cols-3">
            {caseStudiesV2.map((study) => (
              <div key={study.company} className="group rounded-[2rem] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.04),rgba(255,255,255,0.02))] p-6 shadow-[0_20px_60px_rgba(0,0,0,0.28)] backdrop-blur-xl transition-all duration-500 hover:-translate-y-1 hover:border-[#00ff88]/40 sm:p-8">
                <div className="inline-flex rounded-full border border-[#00ff88]/25 bg-[#00ff88]/10 px-3 py-1 text-[11px] uppercase tracking-[0.24em] text-[#c9ffb4]">{study.industry}</div>
                <h3 className="mt-4 text-2xl font-semibold tracking-[-0.04em] text-white">{study.company}</h3>
                <p className="mt-3 text-sm leading-7 text-white/64">{study.summary}</p>
                <div className="mt-6 grid grid-cols-2 gap-3">
                  <MetricPair label="Leads" before={`${study.before.leads}`} after={`+${Math.round((study.after.leads - study.before.leads) / study.before.leads * 100)}%`} finalValue={`${study.after.leads}`} />
                  <MetricPair label="CPL" before={`₹${study.before.cpl}`} after={`-${Math.round((study.before.cpl - study.after.cpl) / study.before.cpl * 100)}%`} finalValue={`₹${study.after.cpl}`} />
                  <MetricPair label="ROAS" before={`${study.before.roas}x`} after={`+${Math.round((study.after.roas - study.before.roas) / study.before.roas * 100)}%`} finalValue={`${study.after.roas}x`} />
                  <MetricPair label="Revenue" before={study.before.revenue} after={`+${Math.round((parseFloat(study.after.revenue.replace(/[^\d.]/g, "")) - parseFloat(study.before.revenue.replace(/[^\d.]/g, ""))) / parseFloat(study.before.revenue.replace(/[^\d.]/g, "")) * 100)}%`} finalValue={study.after.revenue} />
                </div>
              </div>
            ))}
          </div>
        </section>

        <section id="pricing" className="mx-auto w-[min(96%,1280px)] py-24 reveal-up lg:py-32">
          <SectionHeader
            eyebrow="Pricing"
            title="Transparent plans, designed for compounding growth."
            copy="Choose a scope that fits where your business is today and scale from there. Every plan includes strategy, reporting and execution rhythm."
            align="center"
          />
          <div className="mt-14 grid gap-6 lg:grid-cols-3">
            {pricingPlans.map((plan) => (
              <div
                key={plan.name}
                className={cn(
                  "relative rounded-[2rem] border p-8 backdrop-blur-xl transition-all duration-300",
                  plan.highlight
                    ? "border-[#00ff88]/45 bg-[linear-gradient(180deg,rgba(0,255,136,0.16),rgba(0,255,136,0.04))] shadow-[0_30px_80px_rgba(0,255,136,0.18)] lg:-translate-y-2"
                    : "border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.04),rgba(255,255,255,0.02))] hover:-translate-y-1",
                )}
              >
                {plan.highlight ? (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-[#00ff88] px-4 py-1 text-[11px] font-semibold uppercase tracking-[0.28em] text-[#0a0a0a] shadow-[0_0_30px_rgba(0,255,136,0.45)]">
                    Most popular
                  </div>
                ) : null}
                <h3 className="text-2xl font-semibold tracking-[-0.04em] text-white">{plan.name}</h3>
                <p className="mt-3 text-sm leading-7 text-white/64">{plan.tagline}</p>
                <div className="mt-6">
                  <span className="text-5xl font-semibold tracking-[-0.06em] text-white">{plan.price}</span>
                  <span className="ml-2 text-sm text-white/55">{plan.cadence}</span>
                </div>
                <ul className="mt-6 space-y-3">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3 text-sm text-white/72">
                      <CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-[#00ff88]" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <MagneticLink
                  href="#contact"
                  className={cn(
                    "mt-8 w-full",
                    plan.highlight ? "bg-[#00ff88] text-[#0a0a0a] hover:bg-[#62ffa9]" : "bg-white/[0.04] text-white hover:border-[#00ff88]/35",
                  )}
                >
                  Start with {plan.name}
                  <ArrowRight className="h-4 w-4" />
                </MagneticLink>
              </div>
            ))}
          </div>
        </section>

        <section id="trust" className="mx-auto w-[min(96%,1280px)] py-24 reveal-up lg:py-32">
          <SectionHeader
            eyebrow="Trusted by operators"
            title="Credentials, reviews and partners."
            copy="Confidence compounds when platforms, partners and clients all point in the same direction."
            align="center"
          />
          <div className="mt-12 grid gap-6 lg:grid-cols-3">
            <div className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-7 backdrop-blur-xl">
              <div className="flex items-center gap-2 text-lg font-semibold text-white">
                <Globe2 className="h-5 w-5 text-[#00ff88]" />
                Google Reviews
              </div>
              <div className="mt-4 text-5xl font-semibold text-[#00ff88]">4.9<span className="text-white">/5</span></div>
              <div className="mt-2 text-sm text-white/55">Across verified client engagements</div>
              <div className="mt-6 space-y-4">
                {reviews.map((review) => (
                  <div key={review.author} className="rounded-[1.4rem] border border-white/10 bg-black/20 p-4">
                    <div className="text-[#ffd400]">★★★★★</div>
                    <p className="mt-2 text-sm leading-7 text-white/72">{review.text}</p>
                    <div className="mt-3 text-xs uppercase tracking-[0.22em] text-white/42">{review.author} · {review.company}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-7 backdrop-blur-xl">
              <div className="text-lg font-semibold text-white">Partner badges</div>
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {partnerBadges.map((badge) => (
                  <div key={badge} className="rounded-[1.4rem] border border-white/10 bg-black/20 px-4 py-4 text-sm text-white/72">
                    {badge}
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-7 backdrop-blur-xl">
              <div className="text-lg font-semibold text-white">Client logos</div>
              <div className="mt-6 flex flex-wrap gap-3">
                {clientLogosPremium.map((logo) => (
                  <span key={logo} className="rounded-full border border-white/10 bg-black/20 px-4 py-2 text-sm font-medium tracking-[0.18em] text-white/68">
                    {logo}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="ai-tools" className="mx-auto w-[min(96%,1280px)] py-24 reveal-up lg:py-32">
          <SectionHeader
            eyebrow="AI growth suite"
            title="Interactive planning tools your team can use before the first call."
            copy="These tools turn abstract marketing conversations into directional numbers, qualification insights and action plans."
          />

          <div className="mt-10 flex flex-wrap gap-3">
            {[
              { key: "roi", label: "ROI calculator", icon: LineChart },
              { key: "forecast", label: "Growth forecast", icon: Gauge },
              { key: "audit", label: "Audit scorer", icon: BrainCircuit },
              { key: "qualifier", label: "Lead qualifier", icon: CheckCheck },
              { key: "assistant", label: "AI assistant", icon: Bot },
            ].map((tab) => (
              <button
                key={tab.key}
                type="button"
                onClick={() => setActiveTool(tab.key as typeof activeTool)}
                className={cn(
                  "inline-flex items-center gap-2 rounded-full border px-5 py-3 text-sm font-medium transition",
                  activeTool === tab.key
                    ? "border-[#43F000]/35 bg-[#43F000]/12 text-white shadow-[0_0_25px_rgba(67,240,0,0.18)]"
                    : "border-white/10 bg-white/[0.03] text-white/68 hover:text-white",
                )}
              >
                <tab.icon className="h-4 w-4" />
                {tab.label}
              </button>
            ))}
          </div>

          <div className="mt-8 rounded-[2rem] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.04),rgba(255,255,255,0.02))] p-6 backdrop-blur-xl sm:p-8">
            {activeTool === "roi" ? (
              <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
                <div className="space-y-5">
                  <div>
                    <div className="text-xs uppercase tracking-[0.28em] text-white/40">Inputs</div>
                    <div className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-white">AI ROI calculator</div>
                  </div>
                  {[
                    { key: "spend", label: "Monthly ad spend", value: roiInputs.spend, min: 10000, max: 500000, step: 5000 },
                    { key: "cpc", label: "Average CPC", value: roiInputs.cpc, min: 5, max: 200, step: 1 },
                    { key: "landingRate", label: "Landing page conversion %", value: roiInputs.landingRate, min: 1, max: 20, step: 0.1 },
                    { key: "closeRate", label: "Lead-to-sale close %", value: roiInputs.closeRate, min: 1, max: 50, step: 1 },
                    { key: "avgDeal", label: "Average deal value", value: roiInputs.avgDeal, min: 1000, max: 100000, step: 1000 },
                  ].map((field) => (
                    <label key={field.key} className="block rounded-[1.4rem] border border-white/10 bg-black/20 p-4">
                      <div className="flex items-center justify-between gap-4 text-sm text-white/70">
                        <span>{field.label}</span>
                        <span className="font-semibold text-white">{Number(field.value).toLocaleString("en-IN")}</span>
                      </div>
                      <input
                        type="range"
                        min={field.min}
                        max={field.max}
                        step={field.step}
                        value={field.value}
                        onChange={(event) =>
                          setRoiInputs((prev) => ({ ...prev, [field.key]: Number(event.target.value) }))
                        }
                        className="mt-4 w-full accent-[#43F000]"
                      />
                    </label>
                  ))}
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  {[
                    { label: "Projected clicks", value: Math.round(roiOutput.clicks).toLocaleString("en-IN") },
                    { label: "Projected leads", value: Math.round(roiOutput.leads).toLocaleString("en-IN") },
                    { label: "Projected customers", value: roiOutput.customers.toFixed(1) },
                    { label: "Projected revenue", value: `₹${Math.round(roiOutput.revenue).toLocaleString("en-IN")}` },
                  ].map((item) => (
                    <div key={item.label} className="rounded-[1.7rem] border border-white/10 bg-white/[0.03] p-6">
                      <div className="text-xs uppercase tracking-[0.28em] text-white/40">{item.label}</div>
                      <div className="mt-4 text-3xl font-semibold tracking-[-0.04em] text-white">{item.value}</div>
                    </div>
                  ))}
                  <div className="md:col-span-2 rounded-[1.7rem] border border-[#43F000]/20 bg-[#43F000]/10 p-6">
                    <div className="text-xs uppercase tracking-[0.28em] text-[#d2ffc4]">Estimated ROAS</div>
                    <div className="mt-4 text-5xl font-semibold tracking-[-0.05em] text-white">{roiOutput.roas.toFixed(2)}x</div>
                    <p className="mt-4 max-w-2xl text-base leading-8 text-white/74">
                      This directional model helps you see how media efficiency, landing page conversion and sales effectiveness compound together.
                    </p>
                  </div>
                </div>
              </div>
            ) : null}

            {activeTool === "forecast" ? (
              <div className="grid gap-6 xl:grid-cols-[0.88fr_1.12fr]">
                <div className="space-y-5">
                  <div className="text-xs uppercase tracking-[0.28em] text-white/40">Inputs</div>
                  {[
                    { key: "currentRevenue", label: "Current monthly revenue", value: forecastInputs.currentRevenue, min: 100000, max: 5000000, step: 50000 },
                    { key: "monthlyGrowth", label: "Expected monthly growth %", value: forecastInputs.monthlyGrowth, min: 3, max: 40, step: 1 },
                    { key: "months", label: "Forecast horizon", value: forecastInputs.months, min: 3, max: 12, step: 1 },
                  ].map((field) => (
                    <label key={field.key} className="block rounded-[1.4rem] border border-white/10 bg-black/20 p-4">
                      <div className="flex items-center justify-between gap-4 text-sm text-white/70">
                        <span>{field.label}</span>
                        <span className="font-semibold text-white">{Number(field.value).toLocaleString("en-IN")}</span>
                      </div>
                      <input
                        type="range"
                        min={field.min}
                        max={field.max}
                        step={field.step}
                        value={field.value}
                        onChange={(event) =>
                          setForecastInputs((prev) => ({ ...prev, [field.key]: Number(event.target.value) }))
                        }
                        className="mt-4 w-full accent-[#43F000]"
                      />
                    </label>
                  ))}
                </div>
                <div className="rounded-[1.8rem] border border-white/10 bg-white/[0.03] p-6">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <div className="text-xs uppercase tracking-[0.28em] text-white/40">Revenue projection</div>
                      <div className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-white">Compounding growth outlook</div>
                    </div>
                    <div className="rounded-full border border-[#43F000]/20 bg-[#43F000]/10 px-4 py-2 text-sm text-[#c5ffb3]">
                      {forecastInputs.months} months
                    </div>
                  </div>
                  <div className="mt-8">
                    <MiniTrendChart data={forecastSeries as Array<Record<string, string | number>>} dataKey="revenue" lineColor="#8dff67" />
                  </div>
                </div>
              </div>
            ) : null}

            {activeTool === "audit" ? (
              <div className="grid gap-6 xl:grid-cols-[0.86fr_1.14fr]">
                <div className="space-y-5">
                  <div>
                    <div className="text-xs uppercase tracking-[0.28em] text-white/40">Signal input</div>
                    <div className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-white">AI marketing audit tool</div>
                  </div>
                  <label className="block rounded-[1.4rem] border border-white/10 bg-black/20 p-4">
                    <div className="flex items-center justify-between text-sm text-white/70">
                      <span>Page speed / technical health</span>
                      <span className="font-semibold text-white">{auditInputs.speed}</span>
                    </div>
                    <input type="range" min={20} max={100} value={auditInputs.speed} onChange={(event) => setAuditInputs((prev) => ({ ...prev, speed: Number(event.target.value) }))} className="mt-4 w-full accent-[#43F000]" />
                  </label>
                  <label className="block rounded-[1.4rem] border border-white/10 bg-black/20 p-4">
                    <div className="flex items-center justify-between text-sm text-white/70">
                      <span>Landing page conversion %</span>
                      <span className="font-semibold text-white">{auditInputs.conversionRate.toFixed(1)}%</span>
                    </div>
                    <input type="range" min={0.5} max={10} step={0.1} value={auditInputs.conversionRate} onChange={(event) => setAuditInputs((prev) => ({ ...prev, conversionRate: Number(event.target.value) }))} className="mt-4 w-full accent-[#43F000]" />
                  </label>
                  <label className="block rounded-[1.4rem] border border-white/10 bg-black/20 p-4">
                    <div className="flex items-center justify-between text-sm text-white/70">
                      <span>Offer clarity / message strength</span>
                      <span className="font-semibold text-white">{auditInputs.offerClarity}/10</span>
                    </div>
                    <input type="range" min={1} max={10} step={1} value={auditInputs.offerClarity} onChange={(event) => setAuditInputs((prev) => ({ ...prev, offerClarity: Number(event.target.value) }))} className="mt-4 w-full accent-[#43F000]" />
                  </label>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <button type="button" onClick={() => setAuditInputs((prev) => ({ ...prev, trackingReady: !prev.trackingReady }))} className={cn("rounded-[1.4rem] border p-4 text-left transition", auditInputs.trackingReady ? "border-[#43F000]/30 bg-[#43F000]/10" : "border-white/10 bg-black/20")}>
                      <div className="text-sm font-medium text-white">Tracking stack</div>
                      <div className="mt-2 text-sm text-white/65">{auditInputs.trackingReady ? "GA4 + GTM look configured" : "Tracking gaps detected"}</div>
                    </button>
                    <button type="button" onClick={() => setAuditInputs((prev) => ({ ...prev, crmConnected: !prev.crmConnected }))} className={cn("rounded-[1.4rem] border p-4 text-left transition", auditInputs.crmConnected ? "border-[#43F000]/30 bg-[#43F000]/10" : "border-white/10 bg-black/20")}>
                      <div className="text-sm font-medium text-white">CRM sync</div>
                      <div className="mt-2 text-sm text-white/65">{auditInputs.crmConnected ? "Lead source mapped into CRM" : "Lead-source mapping incomplete"}</div>
                    </button>
                  </div>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="md:col-span-2 rounded-[1.8rem] border border-[#43F000]/20 bg-[#43F000]/10 p-6">
                    <div className="text-xs uppercase tracking-[0.28em] text-[#d5ffca]">Overall growth readiness</div>
                    <div className="mt-3 text-6xl font-semibold tracking-[-0.06em] text-white">{auditScore}</div>
                    <p className="mt-4 max-w-2xl text-base leading-8 text-white/74">
                      {auditScore >= 80
                        ? "Strong foundation. GroYou would focus on scale loops, creative testing and deeper revenue attribution."
                        : auditScore >= 60
                          ? "Good base with clear upside. Priority would be tracking depth, landing-page lift and tighter channel alignment."
                          : "There is substantial upside. GroYou would begin by fixing measurement gaps, offer clarity and conversion friction before scaling spend."}
                    </p>
                  </div>
                  {[
                    "Sharpen offer-language fit across ads and landing pages.",
                    "Improve conversion intent capture with better forms and qualifiers.",
                    "Map CRM stage progression back to campaigns.",
                    "Build reporting around qualified pipeline, not just leads.",
                  ].map((tip) => (
                    <div key={tip} className="rounded-[1.5rem] border border-white/10 bg-white/[0.03] p-5">
                      <CheckCircle2 className="h-5 w-5 text-[#8bff66]" />
                      <p className="mt-3 text-sm leading-7 text-white/68">{tip}</p>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}

            {activeTool === "qualifier" ? (
              <div className="grid gap-6 xl:grid-cols-[0.88fr_1.12fr]">
                <div className="space-y-5">
                  {[
                    { key: "budget", label: "Budget seriousness", value: qualifierInputs.budget },
                    { key: "urgency", label: "Urgency to move", value: qualifierInputs.urgency },
                    { key: "offerFit", label: "Offer-market fit", value: qualifierInputs.offerFit },
                    { key: "salesReadiness", label: "Sales process readiness", value: qualifierInputs.salesReadiness },
                    { key: "trackingMaturity", label: "Tracking maturity", value: qualifierInputs.trackingMaturity },
                  ].map((field) => (
                    <label key={field.key} className="block rounded-[1.4rem] border border-white/10 bg-black/20 p-4">
                      <div className="flex items-center justify-between text-sm text-white/70">
                        <span>{field.label}</span>
                        <span className="font-semibold text-white">{field.value}/5</span>
                      </div>
                      <input
                        type="range"
                        min={1}
                        max={5}
                        step={1}
                        value={field.value}
                        onChange={(event) =>
                          setQualifierInputs((prev) => ({ ...prev, [field.key]: Number(event.target.value) }))
                        }
                        className="mt-4 w-full accent-[#43F000]"
                      />
                    </label>
                  ))}
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="md:col-span-2 rounded-[1.8rem] border border-[#43F000]/20 bg-[#43F000]/10 p-6">
                    <div className="text-xs uppercase tracking-[0.28em] text-[#d5ffca]">Lead temperature</div>
                    <div className="mt-4 text-5xl font-semibold tracking-[-0.05em] text-white">
                      {qualificationScore >= 21 ? "Hot opportunity" : qualificationScore >= 16 ? "Warm opportunity" : "Needs groundwork"}
                    </div>
                    <p className="mt-4 max-w-2xl text-base leading-8 text-white/74">
                      {qualificationScore >= 21
                        ? "You’re close to scale. GroYou would likely focus on channel efficiency, creative throughput and revenue reporting."
                        : qualificationScore >= 16
                          ? "The fundamentals exist, but there is work to do around offer clarity, operations and measurement before aggressive scaling."
                          : "Before major scale, GroYou would strengthen your funnel, tracking, sales handling and channel-message fit."}
                    </p>
                  </div>
                  {[
                    "Use qualification questions earlier in the funnel.",
                    "Align sales feedback with campaign learning weekly.",
                    "Route enquiries by service, geography or urgency.",
                    "Track which lead sources actually become revenue.",
                  ].map((tip) => (
                    <div key={tip} className="rounded-[1.5rem] border border-white/10 bg-white/[0.03] p-5 text-sm leading-7 text-white/68">
                      {tip}
                    </div>
                  ))}
                </div>
              </div>
            ) : null}

            {activeTool === "assistant" ? (
              <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
                <div className="space-y-4 rounded-[1.8rem] border border-white/10 bg-black/20 p-5">
                  <div className="text-xs uppercase tracking-[0.28em] text-white/40">Prompt ideas</div>
                  <div className="flex flex-wrap gap-3">
                    {[
                      "How would GroYou improve our SEO?",
                      "How do we scale Google Ads safely?",
                      "Why are we getting low-quality leads?",
                      "How should we approach Meta Ads?",
                    ].map((item) => (
                      <QuickPrompt key={item} prompt={item} onClick={submitAssistantPrompt} />
                    ))}
                  </div>
                  <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.03] p-4">
                    <label className="text-sm text-white/70">Ask the assistant</label>
                    <textarea value={assistantInput} onChange={(event) => setAssistantInput(event.target.value)} rows={5} className="mt-3 w-full resize-none rounded-[1.2rem] border border-white/10 bg-black/25 p-4 text-sm text-white outline-none placeholder:text-white/28" placeholder="Describe your growth challenge, channel mix or reporting issue..." />
                    <button type="button" onClick={() => submitAssistantPrompt(assistantInput)} className="mt-4 inline-flex items-center gap-2 rounded-full bg-[#43F000] px-5 py-3 text-sm font-semibold text-[#001007]">
                      Generate direction
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                <div className="rounded-[1.8rem] border border-white/10 bg-white/[0.03] p-6">
                  <div className="text-xs uppercase tracking-[0.28em] text-white/40">Conversation</div>
                  <div className="mt-5 space-y-4">
                    {assistantMessages.map((message, index) => (
                      <div key={`${message.role}-${index}`} className={cn("max-w-[92%] rounded-[1.4rem] p-4 text-sm leading-7", message.role === "assistant" ? "border border-white/10 bg-black/25 text-white/78" : "ml-auto border border-[#43F000]/20 bg-[#43F000]/10 text-white")}>
                        <div className="mb-2 text-[11px] uppercase tracking-[0.24em] text-white/38">{message.role === "assistant" ? "GroYou AI" : "You"}</div>
                        {message.text}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        </section>

        <section className="mx-auto w-[min(96%,1280px)] py-24 reveal-up lg:py-32">
          <SectionHeader
            eyebrow="Trust systems"
            title="Confidence built through reporting discipline, platform fluency and premium execution."
            copy="We don’t rely on hype. We build trust through clean systems, clarity of work and outcomes teams can actually verify."
          />

          <div className="mt-12 grid gap-5 xl:grid-cols-[0.85fr_1.15fr]">
            <div className="grid gap-4 sm:grid-cols-2">
              {trustItems.map((item) => (
                <div key={item} className="rounded-[1.7rem] border border-white/10 bg-white/[0.03] p-6 backdrop-blur-xl">
                  <ShieldCheck className="h-5 w-5 text-[#87ff60]" />
                  <div className="mt-4 text-lg font-semibold text-white">{item}</div>
                  <p className="mt-2 text-sm leading-7 text-white/65">Structured to create more confidence in campaign data, quality control and operational handoff.</p>
                </div>
              ))}
            </div>
            <div className="grid gap-5 lg:grid-cols-3">
              {testimonials.map((testimonial) => (
                <div key={testimonial.name} className="rounded-[1.9rem] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.04),rgba(255,255,255,0.02))] p-6 backdrop-blur-xl">
                  <div className="text-lg text-[#92ff6d]">★★★★★</div>
                  <p className="mt-4 text-base leading-8 text-white/78">“{testimonial.quote}”</p>
                  <div className="mt-6 border-t border-white/10 pt-5">
                    <div className="font-semibold text-white">{testimonial.name}</div>
                    <div className="mt-1 text-sm text-white/54">{testimonial.role}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="faq" className="mx-auto grid w-[min(96%,1280px)] gap-10 py-24 reveal-up lg:grid-cols-[0.78fr_1.22fr] lg:py-32">
          <div className="lg:sticky lg:top-28 lg:h-fit">
            <SectionHeader
              eyebrow="FAQ"
              title="Clear answers for serious growth decisions."
              copy="Everything below is designed to reduce uncertainty before you book a strategy call."
            />
            <div className="mt-8 rounded-[2rem] border border-white/10 bg-white/[0.03] p-6 backdrop-blur-xl">
              <div className="text-xs uppercase tracking-[0.28em] text-white/40">Lead magnets</div>
              <div className="mt-5 space-y-3">
                {[
                  { label: "SEO checklist", href: "/guides/seo-checklist.txt" },
                  { label: "Google Ads checklist", href: "/guides/google-ads-checklist.txt" },
                  { label: "Brand strategy guide", href: "/guides/brand-strategy-guide.txt" },
                ].map((item) => (
                  <a key={item.label} href={item.href} className="flex items-center justify-between rounded-[1.3rem] border border-white/10 bg-black/20 px-4 py-3 text-sm text-white/72 transition hover:border-[#43F000]/30 hover:text-white">
                    {item.label}
                    <ArrowRight className="h-4 w-4" />
                  </a>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            {faqItems.map((item, index) => {
              const open = faqOpen === index;
              return (
                <div key={item.question} className="rounded-[1.7rem] border border-white/10 bg-white/[0.03] backdrop-blur-xl">
                  <button
                    type="button"
                    onClick={() => setFaqOpen(open ? null : index)}
                    className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
                  >
                    <span className="text-lg font-semibold tracking-[-0.03em] text-white">{item.question}</span>
                    <ChevronDown className={cn("h-5 w-5 shrink-0 text-white/60 transition", open && "rotate-180")} />
                  </button>
                  <AnimatePresence initial={false}>
                    {open ? (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="px-6 pb-6 text-base leading-8 text-white/68">{item.answer}</div>
                      </motion.div>
                    ) : null}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </section>

        <section id="contact" className="mx-auto w-[min(96%,1280px)] py-24 lg:py-32">
          <SectionHeader
            eyebrow="Lead funnel"
            title="Book your growth audit with a five-step qualification flow."
            copy="This form captures the context we need to give you serious strategic direction — not a generic sales pitch."
          />

          <div className="mt-12 grid gap-6 xl:grid-cols-[0.78fr_1.22fr]">
            <div className="space-y-5">
              {[
                {
                  icon: CalendarDays,
                  title: "Booking options",
                  copy: "After submitting the audit, continue with Google Meet, WhatsApp or email-based scheduling.",
                },
                {
                  icon: MessageSquareText,
                  title: "CRM-ready payload",
                  copy: "Your data is structured for follow-up workflows, source tracking and handoff into your sales process.",
                },
                {
                  icon: Gauge,
                  title: "Growth readiness",
                  copy: "We prioritise fit, urgency, offer quality and measurement maturity before recommending scale plans.",
                },
              ].map((item) => (
                <div key={item.title} className="rounded-[1.8rem] border border-white/10 bg-white/[0.03] p-6 backdrop-blur-xl">
                  <item.icon className="h-5 w-5 text-[#8eff65]" />
                  <div className="mt-4 text-xl font-semibold text-white">{item.title}</div>
                  <p className="mt-3 text-sm leading-7 text-white/65">{item.copy}</p>
                </div>
              ))}

              <div className="rounded-[1.8rem] border border-[#43F000]/20 bg-[#43F000]/10 p-6">
                <div className="text-xs uppercase tracking-[0.28em] text-[#d1ffc0]">Direct booking links</div>
                <div className="mt-5 flex flex-wrap gap-3">
                  <MagneticLink href={googleMeetLink} target="_blank" rel="noreferrer" className="bg-black/25 text-white hover:border-[#43F000]/35">
                    Google Meet
                  </MagneticLink>
                  <MagneticLink href={whatsappLink} target="_blank" rel="noreferrer" className="bg-black/25 text-white hover:border-[#43F000]/35">
                    WhatsApp
                  </MagneticLink>
                  <MagneticLink href={mailtoLink} className="bg-black/25 text-white hover:border-[#43F000]/35">
                    Email GroYou
                  </MagneticLink>
                </div>
              </div>
            </div>

            <div className="rounded-[2.2rem] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.05),rgba(255,255,255,0.02))] p-5 backdrop-blur-2xl sm:p-8">
              <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
                <div>
                  <div className="text-xs uppercase tracking-[0.28em] text-white/40">Step {formStep + 1} of 5</div>
                  <div className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-white">Tell us how you want to grow.</div>
                </div>
                <div className="flex gap-2">
                  {Array.from({ length: 5 }, (_, index) => (
                    <div key={index} className={cn("h-2.5 w-12 rounded-full", index <= formStep ? "bg-[#43F000]" : "bg-white/10")} />
                  ))}
                </div>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <input type="hidden" {...register("utm_source")} />
                <input type="hidden" {...register("utm_medium")} />
                <input type="hidden" {...register("utm_campaign")} />
                <input type="hidden" {...register("utm_content")} />
                <input type="hidden" {...register("utm_term")} />

                {formStep === 0 ? (
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <input {...register("fullName")} placeholder="Full name" className="form-input" />
                      <p className="form-error">{errors.fullName?.message}</p>
                    </div>
                    <div>
                      <input {...register("companyName")} placeholder="Company name" className="form-input" />
                      <p className="form-error">{errors.companyName?.message}</p>
                    </div>
                    <div className="md:col-span-2">
                      <input {...register("websiteUrl")} placeholder="Website / Instagram / LinkedIn / business URL" className="form-input" />
                      <p className="form-error">{errors.websiteUrl?.message}</p>
                    </div>
                    <div>
                      <input {...register("email")} placeholder="Email" className="form-input" />
                      <p className="form-error">{errors.email?.message}</p>
                    </div>
                    <div>
                      <input {...register("phone")} placeholder="Phone" className="form-input" />
                      <p className="form-error">{errors.phone?.message}</p>
                    </div>
                    <div>
                      <input {...register("whatsApp")} placeholder="WhatsApp" className="form-input" />
                      <p className="form-error">{errors.whatsApp?.message}</p>
                    </div>
                    <div>
                      <input {...register("industry")} placeholder="Industry" className="form-input" />
                      <p className="form-error">{errors.industry?.message}</p>
                    </div>
                  </div>
                ) : null}

                {formStep === 1 ? (
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <select {...register("monthlyRevenue")} className="form-input">
                        <option>Below ₹5L</option>
                        <option>₹5L - ₹25L</option>
                        <option>₹25L - ₹1Cr</option>
                        <option>₹1Cr+</option>
                      </select>
                      <p className="form-error">{errors.monthlyRevenue?.message}</p>
                    </div>
                    <div>
                      <input {...register("numberOfEmployees")} placeholder="Number of employees" className="form-input" />
                      <p className="form-error">{errors.numberOfEmployees?.message}</p>
                    </div>
                    <div className="md:col-span-2">
                      <input {...register("targetLocation")} placeholder="Target location / service area" className="form-input" />
                      <p className="form-error">{errors.targetLocation?.message}</p>
                    </div>
                    <div className="md:col-span-2">
                      <textarea {...register("currentChannels")} rows={4} placeholder="Current marketing channels" className="form-input min-h-[130px] resize-none" />
                      <p className="form-error">{errors.currentChannels?.message}</p>
                    </div>
                    <div className="md:col-span-2">
                      <textarea {...register("servicesNeeded")} rows={4} placeholder="Services needed" className="form-input min-h-[130px] resize-none" />
                      <p className="form-error">{errors.servicesNeeded?.message}</p>
                    </div>
                  </div>
                ) : null}

                {formStep === 2 ? (
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <select {...register("marketingBudget")} className="form-input">
                        <option>Below ₹50k / month</option>
                        <option>₹50k - ₹2L / month</option>
                        <option>₹2L - ₹5L / month</option>
                        <option>₹5L+ / month</option>
                      </select>
                      <p className="form-error">{errors.marketingBudget?.message}</p>
                    </div>
                    <div>
                      <select {...register("timeline")} className="form-input">
                        <option>Immediately</option>
                        <option>Within 30 days</option>
                        <option>Within 60 days</option>
                        <option>Exploring options</option>
                      </select>
                      <p className="form-error">{errors.timeline?.message}</p>
                    </div>
                    <div className="md:col-span-2 rounded-[1.5rem] border border-white/10 bg-black/20 p-5 text-sm leading-7 text-white/65">
                      GroYou uses budget and timeline to recommend the right mix of channels, landing page depth, creative velocity and reporting scope.
                    </div>
                  </div>
                ) : null}

                {formStep === 3 ? (
                  <div className="grid gap-4">
                    <div>
                      <textarea {...register("businessGoals")} rows={4} placeholder="Business goals" className="form-input min-h-[150px] resize-none" />
                      <p className="form-error">{errors.businessGoals?.message}</p>
                    </div>
                    <div>
                      <textarea {...register("message")} rows={5} placeholder="Tell us about your growth bottlenecks, current campaigns, lead quality issues or reporting needs" className="form-input min-h-[180px] resize-none" />
                      <p className="form-error">{errors.message?.message}</p>
                    </div>
                  </div>
                ) : null}

                {formStep === 4 ? (
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <select {...register("preferredContactTime")} className="form-input">
                        <option>10 AM - 1 PM</option>
                        <option>2 PM - 6 PM</option>
                        <option>6 PM - 9 PM</option>
                      </select>
                      <p className="form-error">{errors.preferredContactTime?.message}</p>
                    </div>
                    <div>
                      <select {...register("preferredContactMethod")} className="form-input">
                        <option>WhatsApp</option>
                        <option>Phone</option>
                        <option>Email</option>
                        <option>Google Meet</option>
                      </select>
                      <p className="form-error">{errors.preferredContactMethod?.message}</p>
                    </div>
                    <div className="md:col-span-2 rounded-[1.7rem] border border-white/10 bg-black/20 p-5">
                      <div className="text-xs uppercase tracking-[0.28em] text-white/40">Review snapshot</div>
                      <div className="mt-4 grid gap-3 sm:grid-cols-2">
                        {[
                          ["Company", currentValues.companyName],
                          ["Website", currentValues.websiteUrl],
                          ["Industry", currentValues.industry],
                          ["Budget", currentValues.marketingBudget],
                          ["Timeline", currentValues.timeline],
                          ["Contact", currentValues.preferredContactMethod],
                        ].map(([label, value]) => (
                          <div key={label} className="rounded-[1.2rem] border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white/72">
                            <span className="mr-2 text-white/38">{label}:</span>
                            {value || "—"}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : null}

                <div className="flex flex-wrap items-center justify-between gap-4 pt-3">
                  <div className="flex gap-3">
                    <button type="button" onClick={previousFormStep} disabled={formStep === 0} className="rounded-full border border-white/10 px-5 py-3 text-sm font-medium text-white/70 transition hover:text-white disabled:cursor-not-allowed disabled:opacity-40">
                      Previous
                    </button>
                    {formStep < 4 ? (
                      <button type="button" onClick={nextFormStep} className="rounded-full bg-[#43F000] px-5 py-3 text-sm font-semibold text-[#001007] shadow-[0_0_30px_rgba(67,240,0,0.24)]">
                        Continue
                      </button>
                    ) : (
                      <button type="submit" disabled={isSubmitting} className="rounded-full bg-[#43F000] px-5 py-3 text-sm font-semibold text-[#001007] shadow-[0_0_30px_rgba(67,240,0,0.24)]">
                        {isSubmitting ? "Submitting..." : "Submit audit request"}
                      </button>
                    )}
                  </div>
                  <div className="text-sm text-white/48">UTM source captured: {currentValues.utm_source}</div>
                </div>
              </form>

              {submittedPayload ? (
                <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="mt-6 rounded-[1.8rem] border border-[#43F000]/20 bg-[#43F000]/10 p-6">
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                      <div className="text-xs uppercase tracking-[0.28em] text-[#d8ffcd]">Request captured</div>
                      <div className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-white">Your audit request is ready for follow-up.</div>
                    </div>
                    <button type="button" onClick={copyPayload} className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-black/20 px-4 py-3 text-sm text-white">
                      <Copy className="h-4 w-4" />
                      Copy CRM JSON
                    </button>
                  </div>
                  <div className="mt-5 flex flex-wrap gap-3">
                    <MagneticLink href={whatsappLink} target="_blank" rel="noreferrer" className="bg-black/25 text-white hover:border-[#43F000]/35">
                      Continue on WhatsApp
                    </MagneticLink>
                    <MagneticLink href={mailtoLink} className="bg-black/25 text-white hover:border-[#43F000]/35">
                      Send by email
                    </MagneticLink>
                    <MagneticLink href={googleMeetLink} target="_blank" rel="noreferrer" className="bg-black/25 text-white hover:border-[#43F000]/35">
                      Add Google Meet slot
                    </MagneticLink>
                  </div>
                </motion.div>
              ) : null}
            </div>
          </div>
        </section>
      </main>

      <footer className="relative z-10 mx-auto flex w-[min(96%,1280px)] flex-col gap-8 border-t border-white/10 py-10 text-sm text-white/52 md:flex-row md:items-end md:justify-between">
        <div>
          <div className="text-2xl font-semibold tracking-[-0.05em] text-white">GroYou</div>
          <div className="mt-2 uppercase tracking-[0.28em] text-white/40">Grow smarter. Scale faster.</div>
        </div>
        <div className="max-w-xl leading-7">
          Enterprise-grade digital marketing systems for brands that want better leads, cleaner reporting and scalable growth.
        </div>
      </footer>
    </div>
  );
}
