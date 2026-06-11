import { useState, useEffect, useRef } from "react";
import { motion, useScroll, useSpring, AnimatePresence } from "framer-motion";
import {
  ChevronDown, Shield, Music, Ticket, Users, Megaphone,
  Gamepad2, Wrench, Swords, ChevronRight, Send, X,
  Copy, Check, Menu, Lock,
} from "lucide-react";
import { SiDiscord, SiRoblox } from "react-icons/si";

// ─────────────────────────────────────────
// DATA
// ─────────────────────────────────────────

const NAV_LINKS = [
  { label: "About", href: "#about" },
  { label: "What I Build", href: "#categories" },
  { label: "My Bots", href: "#projects" },
  { label: "Pricing", href: "#pricing" },
  { label: "Request a Bot", href: "#request" },
  { label: "Contact", href: "#contact" },
];

const BOT_CATEGORIES = [
  {
    icon: Shield, title: "Moderation",
    color: "text-red-400", border: "group-hover:border-red-500/40",
    features: [
      "Auto ban, kick, and mute members",
      "Anti-spam and anti-raid protection",
      "Warning system with full history",
      "Role-based staff permissions",
      "Bulk message deletion",
      "Custom word filters",
    ],
  },
  {
    icon: Music, title: "Music",
    color: "text-purple-400", border: "group-hover:border-purple-500/40",
    features: [
      "Stream from YouTube, Spotify & SoundCloud",
      "Full queue — add, remove, shuffle",
      "Loop one song or the whole queue",
      "Volume control and audio effects",
      "Bass Boost, Nightcore, 8D and more",
      "Save and load personal playlists",
    ],
  },
  {
    icon: Ticket, title: "Ticket System",
    color: "text-yellow-400", border: "group-hover:border-yellow-500/40",
    features: [
      "One-click private support channels",
      "Separate departments (support, appeals, PR…)",
      "Auto-pings the right staff",
      "Close ticket with a button",
      "Transcript saving",
      "Custom welcome message per category",
    ],
  },
  {
    icon: Users, title: "Welcome System",
    color: "text-green-400", border: "group-hover:border-green-500/40",
    features: [
      "Custom welcome message when members join",
      "Welcome images with custom backgrounds",
      "Auto-assign a role on join",
      "Member count display",
      "DM new members on arrival",
      "Leave messages too",
    ],
  },
  {
    icon: Swords, title: "Alliance Management",
    color: "text-cyan-400", border: "group-hover:border-cyan-500/40",
    features: [
      "Create and track server alliances",
      "Strike system — auto-disbands at 3 strikes",
      "Per-alliance warning log",
      "Private log channel, auto-updated",
      "Public alliance list always in sync",
      "Weekly alliance checkups",
    ],
  },
  {
    icon: Megaphone, title: "Announcements",
    color: "text-orange-400", border: "group-hover:border-orange-500/40",
    features: [
      "Scheduled announcements",
      "Shift pings with game link auto-formatting",
      "Cross-channel broadcasts",
      "Role pings built in",
      "Recurring reminders",
      "Custom embed styling",
    ],
  },
  {
    icon: Gamepad2, title: "Economy & Fun",
    color: "text-pink-400", border: "group-hover:border-pink-500/40",
    features: [
      "Server coins (daily, work, gamble, rob)",
      "Buy roles from a server shop",
      "Leaderboard for top earners",
      "Giveaway system with auto winner picking",
      "Dead chat revival command",
      "AFK status with custom messages",
    ],
  },
  {
    icon: Wrench, title: "Utility",
    color: "text-blue-400", border: "group-hover:border-blue-500/40",
    features: [
      "Server and user info commands",
      "Reminders and countdowns",
      "Polls",
      "AI chat assistant",
      "Custom prefix support",
      "Ping and diagnostics",
    ],
  },
];

const PROJECTS = [
  {
    title: "Music Bot (×2)",
    server: "Giveaway Hangout",
    desc: "Two separate music bots so the server never runs out of audio capacity. Both stream from YouTube, Spotify and SoundCloud with full button controls.",
    tags: [
      "YouTube · Spotify · SoundCloud",
      "Queue management",
      "Loop modes",
      "Audio effects (Bass Boost, Nightcore, 8D…)",
      "Personal playlists",
      "Interactive buttons — pause, skip, loop",
      "Always stays in voice channel",
      "Progress bar in now-playing message",
    ],
  },
  {
    title: "Giveaway Hangout Bot",
    server: "Giveaway Hangout",
    desc: "A full-featured community bot. Keeps the server active with an economy, giveaways, fun commands and a MySQL database so nothing is ever lost.",
    tags: [
      "Economy — daily coins, work, rob, gamble",
      "Server shop — buy roles with coins",
      "Leaderboard",
      "Giveaway system with auto winner",
      "Dead chat revival (3-hour cooldown)",
      "AFK status",
      "Timed reminders",
      "Welcome images with custom backgrounds",
      "AI chat assistant",
      "MySQL database — data never lost",
    ],
  },
  {
    title: "Lorevia Hotel Bot",
    server: "Lorevia Hotel",
    desc: "Built for a hotel-themed community. Guests open tickets to reach specific departments, staff manage shifts and moderation — all from one bot.",
    tags: [
      "4-department ticket system",
      "Private channel per ticket",
      "Auto-pings correct department staff",
      "One-click close button",
      "Shift announcements with game link",
      "Warning system with history",
      "Configurable mod roles",
      "All actions logged to file",
    ],
  },
  {
    title: "Clover Bot",
    server: "Clover",
    desc: "A powerful bot built around alliance management. Tracks every alliance with strikes, warnings and logs — and handles full server moderation with a case ID system.",
    tags: [
      "Create and manage alliances",
      "Strike system — auto-disbands at 3 strikes",
      "Per-alliance warning log",
      "Private log channel, auto-updated embeds",
      "Public alliance list always in sync",
      "Warn, kick, ban, mute, unban",
      "Case IDs — every action is numbered",
      "Full member history (warns, kicks, bans)",
      "Private staff notes per member",
      "Ban appeal tracking",
      "3-tier mod levels",
      "All commands logged",
    ],
  },
  {
    title: "Canvas Cafe Bot",
    server: "Canvas Cafe",
    desc: "A community management bot combining moderation tools with alliance tracking, keeping the server organised and the alliance system running smoothly.",
    tags: [
      "Moderation",
      "Alliance management",
      "Welcome system",
      "Custom commands",
    ],
  },
  {
    title: "Personal Test Bot",
    server: "Private sandbox",
    desc: "My personal playground for experimenting with new ideas. The biggest bot I have built — more commands than any of the client bots.",
    tags: ["160+ commands", "Built for experimentation", "All categories covered"],
  },
];

const PRICING_PLANS = [
  {
    title: "Bot Files",
    subtitle: "You host it yourself",
    price: "Custom",
    priceNote: "Decided after reviewing your feature list",
    accentBorder: "border-primary/60",
    badge: null,
    items: [
      "You get the full bot code",
      "Setup guide included",
      "You run it on your own server or host",
      "One-time payment",
      "Simple bots cost less, complex ones more",
    ],
    payments: ["Robux", "UPI"],
  },
  {
    title: "Hosted Bot",
    subtitle: "We run it for you",
    price: "150",
    priceNote: "Robux per week",
    accentBorder: "border-cyan-400/60",
    badge: "Popular",
    items: [
      "Your bot stays online 24/7 — no setup needed",
      "Maintained and updated by me",
      "Weekly renewal",
      "Works for any bot type",
      "Just tell me what you want and it's running",
    ],
    payments: ["Robux", "UPI"],
  },
];

const REQUEST_CATEGORIES = BOT_CATEGORIES.map((c) => c.title);

// ─────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────

const RATE_LIMIT_KEY = "nirmit_last_request";
const RATE_LIMIT_MS = 24 * 60 * 60 * 1000;

function isRateLimited(): boolean {
  const last = localStorage.getItem(RATE_LIMIT_KEY);
  if (!last) return false;
  return Date.now() - Number(last) < RATE_LIMIT_MS;
}

function markSubmitted() {
  localStorage.setItem(RATE_LIMIT_KEY, String(Date.now()));
}

async function sendToDiscord(payload: {
  serverName: string;
  discordHandle: string;
  categories: string[];
  details: string;
  delivery: string;
  payment: string;
}) {
  const webhookUrl = import.meta.env.VITE_DISCORD_WEBHOOK_URL as string | undefined;
  if (!webhookUrl) return;

  const categoryList = payload.categories.length > 0
    ? payload.categories.join(", ")
    : "Not specified";

  await fetch(webhookUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      embeds: [
        {
          title: "New Bot Request",
          color: 0x00d4ff,
          fields: [
            { name: "Server Name", value: payload.serverName, inline: true },
            { name: "Discord Handle", value: payload.discordHandle, inline: true },
            { name: "Categories", value: categoryList, inline: false },
            { name: "Delivery Type", value: payload.delivery || "Not specified", inline: true },
            { name: "Payment", value: payload.payment || "Not specified", inline: true },
            { name: "Requirements", value: payload.details || "—", inline: false },
          ],
          footer: { text: "Submitted via nirmit.dev portfolio" },
          timestamp: new Date().toISOString(),
        },
      ],
    }),
  });
}

// ─────────────────────────────────────────
// NAVBAR
// ─────────────────────────────────────────

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleNavClick = (href: string) => {
    setMenuOpen(false);
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        scrolled ? "bg-background/90 backdrop-blur-md border-b border-border/50" : "bg-transparent"
      }`}
    >
      <div className="max-w-6xl mx-auto px-5 sm:px-8 h-16 flex items-center justify-between">
        <a
          href="#hero"
          onClick={(e) => { e.preventDefault(); handleNavClick("#hero"); }}
          className="text-foreground font-bold text-lg tracking-tight"
        >
          Nirmit<span className="text-primary">.</span>
        </a>

        {/* Desktop */}
        <nav className="hidden md:flex items-center gap-6">
          {NAV_LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              data-testid={`nav-${l.label.toLowerCase().replace(/\s/g, "-")}`}
              onClick={(e) => { e.preventDefault(); handleNavClick(l.href); }}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              {l.label}
            </a>
          ))}
        </nav>

        {/* Mobile hamburger */}
        <button
          className="md:hidden text-muted-foreground hover:text-foreground"
          onClick={() => setMenuOpen((v) => !v)}
          aria-label="Toggle menu"
          data-testid="button-mobile-menu"
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile drawer */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-background/95 backdrop-blur-md border-b border-border/50 overflow-hidden"
          >
            <div className="px-5 py-4 flex flex-col gap-1">
              {NAV_LINKS.map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  onClick={(e) => { e.preventDefault(); handleNavClick(l.href); }}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors py-2 border-b border-border/30 last:border-0"
                >
                  {l.label}
                </a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

// ─────────────────────────────────────────
// PRIVACY MODAL
// ─────────────────────────────────────────

const PrivacyModal = ({ onClose }: { onClose: () => void }) => (
  <motion.div
    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
    onClick={onClose}
  >
    <motion.div
      className="bg-card border border-border rounded-sm max-w-lg w-full p-8 relative max-h-[85vh] overflow-y-auto"
      initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
      onClick={(e) => e.stopPropagation()}
    >
      <button onClick={onClose} className="absolute top-4 right-4 text-muted-foreground hover:text-foreground" aria-label="Close">
        <X size={20} />
      </button>

      <div className="flex items-center gap-3 mb-6">
        <Lock className="w-6 h-6 text-primary" />
        <h3 className="text-xl font-bold text-foreground">Privacy Policy</h3>
      </div>

      <div className="space-y-5 text-sm text-muted-foreground leading-relaxed">
        <div>
          <p className="text-foreground font-semibold mb-1">What information is collected</p>
          <p>When you submit a bot request, the form collects your server name, Discord handle, bot categories, requirements description, and payment preference.</p>
        </div>
        <div>
          <p className="text-foreground font-semibold mb-1">Where it goes</p>
          <p>Your submission is sent directly to the developer's private Discord channel via a secure webhook. It is not stored in any database, third-party service, or server.</p>
        </div>
        <div>
          <p className="text-foreground font-semibold mb-1">Cookies and tracking</p>
          <p>This site uses no cookies and no analytics. The only thing stored in your browser is a timestamp to prevent accidental duplicate submissions — it is never sent anywhere.</p>
        </div>
        <div>
          <p className="text-foreground font-semibold mb-1">Data sharing</p>
          <p>Your information is never sold, shared, or passed to any third party. It goes only to the developer you are contacting.</p>
        </div>
        <div>
          <p className="text-foreground font-semibold mb-1">Contact</p>
          <p>If you have any questions or want your data removed, message <span className="text-foreground">@Nirmit1950</span> on Discord.</p>
        </div>
      </div>
    </motion.div>
  </motion.div>
);

// ─────────────────────────────────────────
// CATEGORY MODAL
// ─────────────────────────────────────────

const CategoryModal = ({ cat, onClose }: { cat: typeof BOT_CATEGORIES[0]; onClose: () => void }) => (
  <motion.div
    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
    onClick={onClose}
  >
    <motion.div
      className="bg-card border border-border rounded-sm max-w-md w-full p-8 relative"
      initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
      onClick={(e) => e.stopPropagation()}
    >
      <button onClick={onClose} className="absolute top-4 right-4 text-muted-foreground hover:text-foreground" aria-label="Close">
        <X size={20} />
      </button>
      <div className="flex items-center gap-3 mb-6">
        <cat.icon className={`w-8 h-8 ${cat.color}`} />
        <h3 className="text-2xl font-bold text-foreground">{cat.title}</h3>
      </div>
      <p className="text-sm text-muted-foreground mb-4">What I can build for this:</p>
      <ul className="space-y-3">
        {cat.features.map((f) => (
          <li key={f} className="flex items-start gap-3 text-sm text-foreground">
            <ChevronRight className={`w-4 h-4 mt-0.5 shrink-0 ${cat.color}`} />
            {f}
          </li>
        ))}
      </ul>
      <a
        href="#request"
        onClick={onClose}
        className="mt-8 w-full block text-center bg-primary text-primary-foreground hover:bg-primary/90 px-6 py-3 rounded-sm font-medium transition-colors"
      >
        Request this type
      </a>
    </motion.div>
  </motion.div>
);

// ─────────────────────────────────────────
// HERO
// ─────────────────────────────────────────

const Hero = () => (
  <section id="hero" className="min-h-[100dvh] flex flex-col justify-center relative px-5 sm:px-12 md:px-24 pt-20">
    <motion.div
      initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="max-w-4xl mx-auto w-full z-10"
    >
      <div className="flex items-center gap-2 mb-5">
        <SiDiscord className="text-[#5865F2] w-5 h-5" />
        <p className="text-muted-foreground text-sm">Discord Bot Developer</p>
      </div>

      <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight mb-6 text-foreground leading-tight">
        Hi, I'm Nirmit.<br />
        <span className="text-primary">I build Discord bots.</span>
      </h1>

      <p className="text-base sm:text-lg text-muted-foreground max-w-2xl leading-relaxed mb-10">
        I create custom Discord bots for servers of all sizes — from moderation and music to economy systems, ticket support and alliance management. I code in Python and Java and can connect your bot to a real database.
      </p>

      <div className="flex flex-wrap items-center gap-4">
        <a
          href="#request"
          onClick={(e) => { e.preventDefault(); document.querySelector("#request")?.scrollIntoView({ behavior: "smooth" }); }}
          className="bg-primary text-primary-foreground hover:bg-primary/90 px-7 py-3 rounded-sm font-medium transition-colors"
        >
          Request a Bot
        </a>
        <a
          href="#projects"
          onClick={(e) => { e.preventDefault(); document.querySelector("#projects")?.scrollIntoView({ behavior: "smooth" }); }}
          className="border border-border hover:bg-muted px-7 py-3 rounded-sm font-medium transition-colors text-foreground"
        >
          See My Work
        </a>
      </div>
    </motion.div>

    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }}
      transition={{ delay: 1.2, duration: 1 }}
      className="absolute bottom-8 left-1/2 -translate-x-1/2 text-muted-foreground animate-bounce"
    >
      <a href="#about" aria-label="Scroll down"
        onClick={(e) => { e.preventDefault(); document.querySelector("#about")?.scrollIntoView({ behavior: "smooth" }); }}>
        <ChevronDown size={24} />
      </a>
    </motion.div>

    <div className="absolute top-1/4 right-[8%] w-72 h-72 bg-primary/10 rounded-full blur-[120px] -z-10 pointer-events-none" />
    <div className="absolute bottom-1/4 left-[5%] w-56 h-56 bg-secondary/10 rounded-full blur-[100px] -z-10 pointer-events-none" />
  </section>
);

// ─────────────────────────────────────────
// ABOUT
// ─────────────────────────────────────────

const About = () => (
  <section id="about" className="py-20 sm:py-24 px-5 sm:px-12 md:px-24 bg-card/30 border-y border-border/50">
    <div className="max-w-5xl mx-auto w-full">
      <motion.div
        initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }} transition={{ duration: 0.6 }}
      >
        <h2 className="text-2xl sm:text-3xl font-bold mb-10 text-foreground">About Me</h2>

        <div className="grid md:grid-cols-2 gap-10 items-start">
          <div className="space-y-5 text-muted-foreground leading-relaxed">
            <p>
              I'm a solo developer who goes server to server offering custom Discord bots. I don't use templates — every bot I make is written from scratch to do exactly what your server needs.
            </p>
            <p>
              Whether you need a simple mod bot or something complex like an alliance management system with its own database, I can build it. I code in <span className="text-foreground font-medium">Python</span> and <span className="text-foreground font-medium">Java</span>, and I connect bots to <span className="text-foreground font-medium">SQL databases</span> so your data is always saved.
            </p>
            <p>
              I've built bots for multiple active servers and my personal test bot has over 160 commands. If you can describe it, I can probably build it.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {[
              { label: "Python & Java", sub: "Two languages, more flexibility" },
              { label: "SQL Databases", sub: "Data that survives restarts" },
              { label: "Built from scratch", sub: "No copy-paste templates" },
              { label: "6 bots deployed", sub: "Across real active servers" },
            ].map((item) => (
              <div key={item.label} className="p-5 bg-card border border-border rounded-sm flex flex-col gap-2">
                <p className="text-foreground font-semibold text-sm">{item.label}</p>
                <p className="text-xs text-muted-foreground">{item.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  </section>
);

// ─────────────────────────────────────────
// CATEGORIES
// ─────────────────────────────────────────

const Categories = () => {
  const [active, setActive] = useState<typeof BOT_CATEGORIES[0] | null>(null);

  return (
    <section id="categories" className="py-20 sm:py-24 px-5 sm:px-12 md:px-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808010_1px,transparent_1px),linear-gradient(to_bottom,#80808010_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

      <div className="max-w-5xl mx-auto w-full relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }} transition={{ duration: 0.6 }}
        >
          <h2 className="text-2xl sm:text-3xl font-bold mb-3 text-foreground">What I Can Build</h2>
          <p className="text-muted-foreground text-sm mb-10">
            Click any category to see what features I can add.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {BOT_CATEGORIES.map((cat, i) => (
              <motion.button
                key={cat.title}
                data-testid={`category-card-${i}`}
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ duration: 0.4, delay: i * 0.06 }}
                onClick={() => setActive(cat)}
                className={`group bg-card border border-border ${cat.border} p-4 sm:p-6 rounded-sm text-left flex flex-col gap-3 transition-all duration-300 cursor-pointer hover:bg-card/80`}
              >
                <cat.icon className={`w-6 h-6 sm:w-7 sm:h-7 ${cat.color}`} />
                <span className="text-foreground font-semibold text-sm sm:text-base">{cat.title}</span>
                <span className="text-xs text-muted-foreground hidden sm:block">Click to see features</span>
              </motion.button>
            ))}
          </div>
        </motion.div>
      </div>

      <AnimatePresence>
        {active && <CategoryModal cat={active} onClose={() => setActive(null)} />}
      </AnimatePresence>
    </section>
  );
};

// ─────────────────────────────────────────
// PROJECTS
// ─────────────────────────────────────────

const Projects = () => (
  <section id="projects" className="py-20 sm:py-24 px-5 sm:px-12 md:px-24 bg-card/30 border-y border-border/50">
    <div className="max-w-5xl mx-auto w-full">
      <motion.div
        initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }} transition={{ duration: 0.6 }}
      >
        <h2 className="text-2xl sm:text-3xl font-bold mb-3 text-foreground">Bots I've Built</h2>
        <p className="text-muted-foreground text-sm mb-10">Real bots, built for real servers.</p>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {PROJECTS.map((p, i) => (
            <motion.div
              key={i}
              data-testid={`project-card-${i}`}
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.08 }}
              className="bg-card border border-border hover:border-primary/40 transition-colors p-5 sm:p-6 flex flex-col rounded-sm"
            >
              <h3 className="text-base sm:text-lg font-bold text-foreground mb-1">{p.title}</h3>
              <p className="text-xs text-primary mb-4">Server: {p.server}</p>
              <p className="text-sm text-muted-foreground flex-grow mb-5 leading-relaxed">{p.desc}</p>
              <div className="flex flex-wrap gap-2">
                {p.tags.map((tag, j) => (
                  <span key={j} className="text-xs bg-muted text-muted-foreground px-2 py-1 rounded-sm">
                    {tag}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  </section>
);

// ─────────────────────────────────────────
// PRICING
// ─────────────────────────────────────────

const Pricing = () => (
  <section id="pricing" className="py-20 sm:py-24 px-5 sm:px-12 md:px-24 relative overflow-hidden">
    <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808010_1px,transparent_1px),linear-gradient(to_bottom,#80808010_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

    <div className="max-w-5xl mx-auto w-full relative z-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }} transition={{ duration: 0.6 }}
      >
        <h2 className="text-2xl sm:text-3xl font-bold mb-3 text-foreground">Pricing</h2>
        <p className="text-muted-foreground text-sm mb-10">Two ways to get your bot. Both support Robux and UPI.</p>

        <div className="grid sm:grid-cols-2 gap-5 sm:gap-6 mb-10">
          {PRICING_PLANS.map((plan, i) => (
            <motion.div
              key={plan.title}
              data-testid={`pricing-card-${i}`}
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.15 }}
              className={`relative bg-card border-2 ${plan.accentBorder} rounded-sm p-6 sm:p-8 flex flex-col`}
            >
              {plan.badge && (
                <span className="absolute -top-3 left-5 bg-cyan-400 text-black text-xs font-bold px-3 py-1 rounded-sm">
                  {plan.badge}
                </span>
              )}

              <h3 className="text-xl font-bold text-foreground mb-1">{plan.title}</h3>
              <p className="text-sm text-muted-foreground mb-6">{plan.subtitle}</p>

              <div className="mb-6">
                {plan.price === "Custom" ? (
                  <p className="text-3xl font-bold text-foreground">Custom price</p>
                ) : (
                  <p className="text-3xl font-bold text-foreground">
                    {plan.price} <span className="text-lg font-normal text-muted-foreground">Robux/wk</span>
                  </p>
                )}
                <p className="text-xs text-muted-foreground mt-1">{plan.priceNote}</p>
              </div>

              <ul className="space-y-3 flex-grow mb-8">
                {plan.items.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm text-foreground">
                    <ChevronRight className="w-4 h-4 mt-0.5 shrink-0 text-primary" />
                    {item}
                  </li>
                ))}
              </ul>

              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">Accepted payments</p>
                <div className="flex flex-wrap gap-2">
                  {plan.payments.map((p) => (
                    <span key={p} className="flex items-center gap-2 text-xs bg-muted border border-border px-3 py-1.5 rounded-sm text-foreground">
                      {p === "Robux"
                        ? <SiRoblox className="w-3.5 h-3.5 text-red-400" />
                        : <span className="font-bold text-green-400">₹</span>}
                      {p}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="bg-muted/40 border border-border rounded-sm p-5 text-sm text-muted-foreground space-y-2">
          <p className="text-foreground font-semibold mb-2">Payment notes</p>
          <p><span className="text-primary font-medium">Robux</span> — Robux payment details are shared after your requirements are confirmed.</p>
          <p><span className="text-green-400 font-medium">UPI</span> — UPI ID is shared once the bot is ready for handoff. You only pay when it's done.</p>
          <p className="text-muted-foreground/60 text-xs pt-1">The price for Bot Files is agreed on before any work starts, based on what features you need.</p>
        </div>
      </motion.div>
    </div>
  </section>
);

// ─────────────────────────────────────────
// REQUEST A BOT
// ─────────────────────────────────────────

type FormState = {
  serverName: string;
  discordHandle: string;
  categories: string[];
  details: string;
  payment: string;
  delivery: string;
};

const EMPTY_FORM: FormState = {
  serverName: "", discordHandle: "", categories: [],
  details: "", payment: "", delivery: "",
};

const RequestBot = () => {
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPrivacy, setShowPrivacy] = useState(false);

  const toggleCategory = (cat: string) =>
    setForm((prev) => ({
      ...prev,
      categories: prev.categories.includes(cat)
        ? prev.categories.filter((c) => c !== cat)
        : [...prev.categories, cat],
    }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isRateLimited()) {
      setError("You already submitted a request recently. Please wait 24 hours before sending another.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      await sendToDiscord(form);
      markSubmitted();
      setSubmitted(true);
    } catch {
      setError("Something went wrong sending your request. Please contact @Nirmit1950 on Discord directly.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="request" className="py-20 sm:py-24 px-5 sm:px-12 md:px-24 bg-card/30 border-y border-border/50">
      <div className="max-w-3xl mx-auto w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }} transition={{ duration: 0.6 }}
        >
          <h2 className="text-2xl sm:text-3xl font-bold mb-3 text-foreground">Request a Bot</h2>
          <p className="text-muted-foreground text-sm mb-10">
            Fill this out and I'll message you on Discord within 24 hours to discuss your requirements and price.
          </p>

          <AnimatePresence mode="wait">
            {submitted ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
                className="bg-card border border-primary/40 rounded-sm p-10 sm:p-12 text-center"
              >
                <div className="w-14 h-14 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center mx-auto mb-5">
                  <Check className="w-7 h-7 text-primary" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-3">Request received!</h3>
                <p className="text-muted-foreground text-sm max-w-sm mx-auto mb-8">
                  I'll reach out to{" "}
                  <span className="text-foreground font-semibold">{form.discordHandle || "you"}</span>{" "}
                  on Discord within 24 hours.
                </p>
                <button
                  onClick={() => { setSubmitted(false); setForm(EMPTY_FORM); }}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors border border-border px-4 py-2 rounded-sm"
                >
                  Submit another request
                </button>
              </motion.div>
            ) : (
              <motion.form
                key="form" onSubmit={handleSubmit}
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="space-y-7"
              >
                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm text-muted-foreground mb-2">
                      Your server name <span className="text-primary">*</span>
                    </label>
                    <input
                      data-testid="input-server-name" required type="text"
                      placeholder="e.g. My Gaming Community"
                      value={form.serverName}
                      onChange={(e) => setForm((p) => ({ ...p, serverName: e.target.value }))}
                      className="w-full bg-background border border-border focus:border-primary outline-none px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/40 rounded-sm transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-muted-foreground mb-2">
                      Your Discord handle <span className="text-primary">*</span>
                    </label>
                    <input
                      data-testid="input-discord-handle" required type="text"
                      placeholder="e.g. @username"
                      value={form.discordHandle}
                      onChange={(e) => setForm((p) => ({ ...p, discordHandle: e.target.value }))}
                      className="w-full bg-background border border-border focus:border-primary outline-none px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/40 rounded-sm transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-muted-foreground mb-3">
                    What categories do you need?{" "}
                    <span className="text-muted-foreground/50">(pick all that apply)</span>
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {REQUEST_CATEGORIES.map((cat) => {
                      const selected = form.categories.includes(cat);
                      return (
                        <button
                          type="button" key={cat}
                          data-testid={`category-toggle-${cat}`}
                          onClick={() => toggleCategory(cat)}
                          className={`text-xs px-3 py-2 rounded-sm border transition-all ${
                            selected
                              ? "bg-primary/20 border-primary text-primary"
                              : "bg-card border-border text-muted-foreground hover:border-primary/40"
                          }`}
                        >
                          {cat}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-muted-foreground mb-2">
                    Describe what you need <span className="text-primary">*</span>
                  </label>
                  <textarea
                    data-testid="input-details" required rows={4}
                    placeholder="Tell me what the bot should do, any specific commands, systems, or anything you have in mind..."
                    value={form.details}
                    onChange={(e) => setForm((p) => ({ ...p, details: e.target.value }))}
                    className="w-full bg-background border border-border focus:border-primary outline-none px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/40 rounded-sm transition-colors resize-none"
                  />
                </div>

                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm text-muted-foreground mb-2">
                      How do you want the bot? <span className="text-primary">*</span>
                    </label>
                    <div className="flex flex-col gap-2">
                      {["Bot Files (I'll host it)", "Hosted Bot (150 Robux/wk, you do nothing)"].map((opt) => (
                        <button
                          type="button" key={opt}
                          data-testid={`delivery-${opt}`}
                          onClick={() => setForm((p) => ({ ...p, delivery: opt }))}
                          className={`text-left text-xs px-3 py-2.5 rounded-sm border transition-all ${
                            form.delivery === opt
                              ? "bg-primary/20 border-primary text-primary"
                              : "bg-card border-border text-muted-foreground hover:border-primary/40"
                          }`}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm text-muted-foreground mb-2">
                      How will you pay? <span className="text-primary">*</span>
                    </label>
                    <div className="flex flex-col gap-2">
                      {["Robux", "UPI"].map((opt) => (
                        <button
                          type="button" key={opt}
                          data-testid={`payment-${opt}`}
                          onClick={() => setForm((p) => ({ ...p, payment: opt }))}
                          className={`text-left text-xs px-3 py-2.5 rounded-sm border transition-all ${
                            form.payment === opt
                              ? "bg-primary/20 border-primary text-primary"
                              : "bg-card border-border text-muted-foreground hover:border-primary/40"
                          }`}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {error && (
                  <p className="text-sm text-red-400 bg-red-400/10 border border-red-400/30 rounded-sm px-4 py-3">
                    {error}
                  </p>
                )}

                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                  <button
                    type="submit"
                    data-testid="button-submit-request"
                    disabled={loading}
                    className="flex items-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-60 px-7 py-3 rounded-sm font-medium transition-colors text-sm"
                  >
                    <Send size={15} />
                    {loading ? "Sending…" : "Send Request"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowPrivacy(true)}
                    className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <Lock size={12} />
                    How is my info used?
                  </button>
                </div>
              </motion.form>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      <AnimatePresence>
        {showPrivacy && <PrivacyModal onClose={() => setShowPrivacy(false)} />}
      </AnimatePresence>
    </section>
  );
};

// ─────────────────────────────────────────
// CONTACT
// ─────────────────────────────────────────

const Contact = () => {
  const [copied, setCopied] = useState(false);
  const handle = "@Nirmit1950";

  const handleCopy = () => {
    navigator.clipboard.writeText(handle);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section id="contact" className="py-20 sm:py-28 px-5 sm:px-12 md:px-24 relative">
      <div className="max-w-3xl mx-auto w-full text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }} whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }} transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-foreground">Want a bot for your server?</h2>
          <p className="text-muted-foreground mb-12 max-w-lg mx-auto leading-relaxed">
            Message me on Discord and tell me what you're looking for. I'll get back to you quickly and we'll figure out the details from there.
          </p>

          <div className="flex items-center justify-center bg-card border border-border px-5 sm:px-6 py-4 rounded-sm w-full max-w-sm mx-auto gap-4">
            <SiDiscord className="text-[#5865F2] w-7 h-7 shrink-0" />
            <div className="text-left flex-grow">
              <p className="text-xs text-muted-foreground uppercase tracking-wider mb-0.5">Discord</p>
              <p className="text-lg font-bold text-foreground">{handle}</p>
            </div>
            <button
              onClick={handleCopy}
              data-testid="button-copy-discord"
              className="p-2.5 bg-muted hover:bg-muted/80 text-foreground rounded-sm transition-colors border border-border"
              aria-label="Copy Discord handle"
            >
              {copied ? <Check size={18} className="text-primary" /> : <Copy size={18} />}
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

// ─────────────────────────────────────────
// FOOTER
// ─────────────────────────────────────────

const Footer = ({ onPrivacy }: { onPrivacy: () => void }) => (
  <footer className="py-7 text-center border-t border-border/50 text-xs text-muted-foreground flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-6 px-5">
    <p>&copy; {new Date().getFullYear()} Nirmit. All rights reserved.</p>
    <button
      onClick={onPrivacy}
      className="flex items-center gap-1.5 hover:text-foreground transition-colors"
    >
      <Lock size={11} /> Privacy Policy
    </button>
  </footer>
);

// ─────────────────────────────────────────
// PAGE
// ─────────────────────────────────────────

export default function Home() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });
  const [showPrivacy, setShowPrivacy] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  return (
    <div ref={ref} className="bg-background text-foreground min-h-[100dvh] font-sans selection:bg-primary/30 selection:text-primary">
      <motion.div className="fixed top-0 left-0 right-0 h-0.5 bg-primary origin-left z-50" style={{ scaleX }} />
      <Navbar />
      <Hero />
      <About />
      <Categories />
      <Projects />
      <Pricing />
      <RequestBot />
      <Contact />
      <Footer onPrivacy={() => setShowPrivacy(true)} />

      <AnimatePresence>
        {showPrivacy && <PrivacyModal onClose={() => setShowPrivacy(false)} />}
      </AnimatePresence>
    </div>
  );
}
