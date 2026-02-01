"use client";

import { useSession, signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import {
  ArrowRightIcon,
  VideoIcon,
  ZapIcon,
  UsersIcon,
  GitBranchIcon,
  CodeIcon,
  GithubIcon,
  TerminalIcon,
  CpuIcon,
  CheckIcon,
  GlobeIcon,
  LockIcon
} from "lucide-react";

// --- Components for Animations ---

function TypewriterTerminal() {
  const [text, setText] = useState("");
  const fullText = `> reading repository context...
> planning implementation steps...
> creating new database schema...
> writing API endpoints...
> running unit tests...
> all tests passed.
> creating pull request...`;

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      setText(fullText.slice(0, index));
      index++;
      if (index > fullText.length) clearInterval(interval);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="font-mono text-sm leading-relaxed whitespace-pre-line text-green-400">
      {text}
      <span className="animate-pulse inline-block w-2 h-4 bg-green-500 ml-1 align-middle"></span>
    </div>
  );
}

function HeadlineTypewriter() {
  const [text, setText] = useState("");
  const fullText = "Hire an AI Engineer\nthat builds 24/7.";

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      setText(fullText.slice(0, index));
      index++;
      if (index > fullText.length + 1) clearInterval(interval);
    }, 100);
    return () => clearInterval(interval);
  }, []);

  const parts = text.split('\n');
  const line1 = parts[0] || "";
  const line2 = parts[1];

  return (
    <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-8 leading-relaxed min-h-[120px] md:min-h-[160px] text-white" style={{ fontFamily: "'Press Start 2P', cursive", lineHeight: "1.5" }}>
      {line1}
      {line2 !== undefined && <br />}
      <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-300 via-emerald-400 to-green-500 animate-gradient-x">
        {line2}
      </span>
      <span className="inline-block w-4 h-8 md:h-12 bg-green-500 ml-2 animate-pulse align-middle" />
    </h1>
  );
}

// --- Main Page ---

export default function LandingPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const isDark = true; // Forcing dark mode as per original design preference

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (status === "authenticated" && session) {
      router.push("/dashboard");
    }
  }, [status, session, router]);

  if (status === "loading" || !mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500" />
      </div>
    );
  }

  if (status === "authenticated") return null;

  return (
    <div className="min-h-screen selection:bg-green-500/30 font-sans bg-black text-white relative isolate">
      {/* Graph Paper Background Effect */}
      <div className="fixed inset-0 z-[-1] bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] mask-image-[radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>

      {/* Navbar - Floating Glass */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled
        ? "bg-black/80 backdrop-blur-md border-b border-white/5 py-4"
        : "py-6"
        }`}>
        <div className="max-w-6xl mx-auto px-4 md:px-8 flex items-center justify-between">
          <div className="flex items-center gap-2 group cursor-pointer">
            <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-green-600 rounded-lg flex items-center justify-center shadow-lg shadow-green-500/20 group-hover:rotate-12 transition-transform">
              <CodeIcon className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
              CODINSPECT
            </span>
          </div>

          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-400">
            {['Home', 'Features', 'How it works', 'Security'].map((item) => (
              <a key={item} href={`#${item.toLowerCase().replace(/ /g, '-')}`} className="relative transition-colors group hover:text-white">
                {item}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-green-500 group-hover:w-full transition-all duration-300"></span>
              </a>
            ))}
          </div>

          <button
            onClick={() => signIn("github")}
            className="group relative px-6 py-2 rounded-full overflow-hidden transition-all border bg-white/10 hover:bg-white/20 border-white/5"
          >
            <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-shimmer" />
            <span className="relative flex items-center gap-2 text-sm font-semibold">
              <GithubIcon className="w-4 h-4" /> Sign In
            </span>
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="home" className="relative pt-40 pb-20 px-4 flex justify-center overflow-hidden">
        {/* Ambient Glows */}
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-green-500/20 blur-[120px] rounded-full pointer-events-none opacity-50 mix-blend-screen" />

        <div className="relative z-10 max-w-6xl w-full">
          <div className="rounded-[2.5rem] border border-white/10 bg-black/40 backdrop-blur-xl shadow-2xl overflow-hidden relative group">
            {/* Card Glow */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-green-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

            <div className="grid lg:grid-cols-2 gap-0 relative">
              {/* Left: Content */}
              <div className="p-10 md:p-16 flex flex-col justify-center border-b lg:border-b-0 lg:border-r border-white/5 relative bg-gradient-to-b from-white/5 to-transparent">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-green-500/20 bg-green-500/5 text-green-400 text-xs font-mono mb-8 w-fit shadow-[0_0_20px_rgba(34,197,94,0.1)]">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.8)]" />
                  V2.0 NOW LIVE
                </div>

                <HeadlineTypewriter />

                <p className="text-lg mb-10 leading-relaxed text-gray-400 max-w-md">
                  Hire an autonomous engineer that lives in your repo. CODINSPECT plans architecture, writes clean code, fixes bugs, and runs tests—all without supervision.
                </p>

                <div className="flex flex-wrap gap-4">
                  <button
                    onClick={() => signIn("github")}
                    className="px-8 py-3.5 rounded-xl bg-white text-black font-bold text-base hover:scale-105 transition-all duration-300 flex items-center gap-2 shadow-[0_0_30px_rgba(255,255,255,0.2)] hover:shadow-[0_0_40px_rgba(255,255,255,0.4)]"
                  >
                    <GithubIcon className="w-5 h-5" /> Hire Agent
                  </button>
                  <button className="px-8 py-3.5 rounded-xl border border-white/10 bg-white/5 text-white font-medium hover:bg-white/10 transition-all flex items-center gap-2 backdrop-blur-md">
                    <VideoIcon className="w-5 h-5 opacity-70" /> Watch Demo
                  </button>
                </div>
              </div>

              {/* Right: Terminal Visual */}
              <div className="relative bg-[#050505] min-h-[400px] flex flex-col">
                {/* Terminal Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-white/5 bg-white/[0.02]">
                  <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-[#FF5F56]" />
                    <div className="w-3 h-3 rounded-full bg-[#FFBD2E]" />
                    <div className="w-3 h-3 rounded-full bg-[#27C93F]" />
                  </div>
                  <div className="text-[10px] font-mono text-gray-500 flex items-center gap-1">
                    <LockIcon className="w-3 h-3" />
                    ssh root@codinspect-agent
                  </div>
                </div>

                {/* Terminal Body */}
                <div className="flex-1 p-8 font-mono text-sm relative overflow-hidden">
                  {/* Matrix Rain / Grid Effect */}
                  <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'linear-gradient(0deg, transparent 24%, #22c55e 25%, #22c55e 26%, transparent 27%, transparent 74%, #22c55e 75%, #22c55e 76%, transparent 77%, transparent), linear-gradient(90deg, transparent 24%, #22c55e 25%, #22c55e 26%, transparent 27%, transparent 74%, #22c55e 75%, #22c55e 76%, transparent 77%, transparent)', backgroundSize: '50px 50px' }}></div>

                  <div className="relative z-10 space-y-2">
                    <div className="flex gap-2 text-gray-500">
                      <span>$</span>
                      <span className="text-white">codinspect init --repo=my-project</span>
                    </div>
                    <div className="text-green-500/50 italic mb-4">Initializing autonomous agent environment...</div>
                    <TypewriterTerminal />
                  </div>

                  {/* Floating Stats */}
                  <div className="absolute bottom-6 right-6 flex items-center gap-4">
                    <div className="px-3 py-1 rounded bg-green-500/10 border border-green-500/20 text-[10px] text-green-400 font-mono animate-pulse">
                      CPU: 12%
                    </div>
                    <div className="px-3 py-1 rounded bg-green-500/10 border border-green-500/20 text-[10px] text-green-400 font-mono">
                      RAM: 2.1GB
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>



      {/* Features Section (Bento Grid) */}
      <section id="features" className="py-32 px-4 relative overflow-hidden">
        <div className="absolute top-1/4 left-0 w-full h-[500px] bg-green-500/5 blur-[120px] -skew-y-6 pointer-events-none" />
        <div className="max-w-7xl mx-auto">
          <div className="mb-24 flex flex-col md:flex-row items-end justify-between gap-8 border-b border-white/5 pb-12">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border text-xs font-mono mb-6 border-green-500/30 bg-green-500/10 text-green-400">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" /> CAPABILITIES
              </div>
              <h2 className="text-4xl md:text-6xl font-bold tracking-tight leading-tight text-white">
                More than just <br /> autocomplete.
              </h2>
            </div>
            <p className="text-xl max-w-sm leading-relaxed text-gray-400">
              A fully autonomous agent capable of complex reasoning and engineering.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* 1. Deep Reasoning Engine */}
            <div className="col-span-1 lg:col-span-12 relative overflow-hidden rounded-[2rem] border group transition-all duration-500 bg-white/5 border-white/10 hover:border-green-500/30">
              <div className="absolute inset-0 bg-green-500/5 group-hover:bg-green-500/10 transition-colors duration-500" />
              <div className="p-8 md:p-16 relative z-10 flex flex-col md:flex-row gap-16 items-center">
                <div className="flex-1 space-y-8">
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-lg shadow-green-500/30 group-hover:scale-110 transition-transform duration-500">
                    <CpuIcon className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="text-4xl font-bold text-white">Deep Reasoning Engine</h3>
                  <p className="text-xl leading-relaxed text-gray-400">
                    CODINSPECT doesn't just guess code. It reads your entire repo, understands dependencies, plans architecture, and implements features like a senior developer.
                  </p>
                </div>
                {/* Visualizer: Neural Graph/Scanning */}
                <div className="flex-1 w-full aspect-video rounded-2xl border relative overflow-hidden backdrop-blur-sm bg-[#050505] border-white/10 flex items-center justify-center group-hover:border-green-500/30 transition-colors">
                  {/* Grid Background */}
                  <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(#22c55e 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>

                  {/* Animated Radar/Scan Effect */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-green-500/5 via-transparent to-transparent animate-pulse"></div>

                  {/* Central Node */}
                  <div className="relative z-10 w-24 h-24 rounded-full bg-green-500/10 border border-green-500/50 flex items-center justify-center backdrop-blur-md shadow-[0_0_30px_rgba(34,197,94,0.2)]">
                    <div className="absolute inset-0 rounded-full border border-green-500/30 animate-[spin_10s_linear_infinite]"></div>
                    <div className="absolute inset-2 rounded-full border border-green-500/30 animate-[spin_15s_linear_infinite_reverse]"></div>
                    <CpuIcon className="w-8 h-8 text-green-400 animate-pulse" />
                  </div>

                  {/* Satellite Nodes */}
                  <div className="absolute top-1/4 left-1/4 p-2 rounded-lg bg-gray-900 border border-green-500/30 text-green-500 text-xs font-mono animate-bounce-slow shadow-lg">
                    AST_Node
                  </div>
                  <div className="absolute bottom-1/3 right-1/4 p-2 rounded-lg bg-gray-900 border border-green-500/30 text-green-500 text-xs font-mono animate-bounce-slow animation-delay-2000 shadow-lg">
                    Dependency_Map
                  </div>

                  {/* Mini Terminal */}
                  <div className="absolute bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-64 p-3 rounded bg-black/80 border border-white/10 font-mono text-[10px] text-green-500/70 overflow-hidden shadow-lg backdrop-blur-sm">
                    <div className="flex flex-col gap-1">
                      <span className="opacity-50">&gt; init_semantic_graph()</span>
                      <span className="opacity-75">&gt; parsing directory tree...</span>
                      <span className="animate-pulse text-green-400">&gt; optimizing execution plan_</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 2. Multiplayer */}
            <div className="col-span-1 lg:col-span-6 relative overflow-hidden rounded-[2rem] border p-10 md:p-12 group hover:-translate-y-1 transition-all duration-300 bg-white/5 border-white/10 hover:border-blue-500/30">
              <div className="w-16 h-16 rounded-2xl bg-blue-500/20 flex items-center justify-center mb-8 text-blue-500 group-hover:scale-110 transition-transform">
                <UsersIcon className="w-8 h-8" />
              </div>
              <h3 className="text-3xl font-bold mb-4 text-white">Multiplayer</h3>
              <p className="text-xl mb-10 leading-relaxed text-gray-400">
                Real-time collaboration with your AI agents and team. Watch code generation live.
              </p>
            </div>

            {/* 3. Git Native */}
            <div className="col-span-1 lg:col-span-6 relative overflow-hidden rounded-[2rem] border p-10 md:p-12 group hover:-translate-y-1 transition-all duration-300 bg-white/5 border-white/10 hover:border-purple-500/30">
              <div className="w-16 h-16 rounded-2xl bg-purple-500/20 flex items-center justify-center mb-8 text-purple-500 group-hover:scale-110 transition-transform">
                <GitBranchIcon className="w-8 h-8" />
              </div>
              <h3 className="text-3xl font-bold mb-4 text-white">Git Native</h3>
              <p className="text-xl mb-10 leading-relaxed text-gray-400">
                Automated PRs, clean commits, and branch management. Works with your existing workflow.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-32 px-4 bg-white/[0.02]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-3xl md:text-5xl font-bold mb-6 text-white">How CODINSPECT Works</h2>
            <p className="text-lg text-gray-400">From issue to pull request in minutes.</p>
          </div>
          <div className="space-y-24 relative">
            <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-0.5 bg-white/10" />
            {[
              { title: "1. Connect", desc: "Install the GitHub App. CODINSPECT indexes your codebase in <5 minutes.", icon: <GithubIcon /> },
              { title: "2. Analyze", desc: "Our engine maps dependencies and understands your architecture.", icon: <CpuIcon /> },
              { title: "3. Solve", desc: "Describe a bug or feature. Currently solving issues with 94% success rate.", icon: <CheckIcon /> }
            ].map((step, i) => (
              <div key={i} className={`relative flex flex-col md:flex-row gap-8 items-center ${i % 2 === 0 ? 'md:flex-row-reverse' : ''}`}>
                <div className="flex-1 w-full md:w-1/2" />
                <div className="relative z-10 w-16 h-16 rounded-2xl flex items-center justify-center border-4 bg-black border-green-500/20 text-green-500 shadow-[0_0_20px_rgba(34,197,94,0.2)]">
                  {step.icon}
                </div>
                <div className="flex-1 w-full md:w-1/2 text-center md:text-left">
                  <div className="p-8 rounded-3xl border transition-all hover:-translate-y-1 bg-white/5 border-white/10">
                    <h3 className="text-2xl font-bold mb-4 text-white">{step.title}</h3>
                    <p className="text-gray-400">{step.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Security Section (Updated with 'Holographic Forcefield' Design) */}
      <section id="security" className="py-24 px-4 overflow-hidden relative">
        <div className="max-w-7xl mx-auto rounded-[3rem] p-12 md:p-24 relative overflow-hidden border bg-gradient-to-br from-green-900/10 to-transparent border-green-500/20">
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-green-500/10 rounded-full blur-[100px] pointer-events-none" />
          <div className="grid md:grid-cols-2 gap-16 items-center relative z-10">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 text-green-500 font-mono text-sm border border-green-500/20 mb-8">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" /> SOC2 COMPLIANT
              </div>
              <h2 className="text-4xl md:text-6xl font-bold mb-6 text-white">Enterprise Grade Security</h2>
              <p className="text-xl mb-10 text-gray-400">
                Your code never trains our models. We run ephemeral, isolated sandboxes for every task.
              </p>
              <button className="px-8 py-4 rounded-full border font-semibold hover:scale-105 transition-transform border-white/20 hover:bg-white/10 text-white">
                Read Security Whitepaper
              </button>
            </div>

            {/* Visualizer: Holographic Forcefield */}
            <div className="relative">
              <div className="w-full aspect-square rounded-3xl overflow-hidden bg-[#050505] border border-white/10 group relative flex items-center justify-center hover:border-green-500/30 transition-colors duration-500">
                {/* Grid Floor */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>

                {/* Central Safe Zone */}
                <div className="absolute inset-0 flex items-center justify-center">
                  {/* Ripples */}
                  <div className="absolute w-[300px] h-[300px] bg-green-500/5 rounded-full animate-[ping_3s_cubic-bezier(0,0,0.2,1)_infinite]"></div>
                  <div className="absolute w-[200px] h-[200px] bg-green-500/5 rounded-full animate-[ping_3s_cubic-bezier(0,0,0.2,1)_infinite] animation-delay-1000"></div>

                  {/* Shield Container */}
                  <div className="relative z-10 w-32 h-32 bg-gradient-to-br from-green-500/10 to-black rounded-2xl border border-green-500/30 backdrop-blur-xl flex items-center justify-center shadow-[0_0_60px_rgba(34,197,94,0.15)] group-hover:shadow-[0_0_100px_rgba(34,197,94,0.4)] transition-all duration-500 group-hover:scale-110 group-hover:border-green-500/60">
                    <LockIcon className="w-12 h-12 text-green-400 drop-shadow-[0_0_15px_rgba(34,197,94,0.8)]" />

                    {/* Corner Accents - Technical Look */}
                    <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-green-500/50 -translate-x-1 -translate-y-1"></div>
                    <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-green-500/50 translate-x-1 -translate-y-1"></div>
                    <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-green-500/50 -translate-x-1 translate-y-1"></div>
                    <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-green-500/50 translate-x-1 translate-y-1"></div>
                  </div>
                </div>

                {/* Status Indicator */}
                <div className="absolute bottom-10 left-1/2 -translate-x-1/2 px-4 py-2 bg-green-900/20 border border-green-500/20 rounded-full flex items-center gap-2 backdrop-blur-md">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_10px_rgba(34,197,94,1)]"></div>
                  <span className="text-xs font-mono text-green-400 tracking-wider">SANDBOX_ACTIVE</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Testimonials Section (Legacy Marquee) */}
      <section className="py-24 border-y border-white/5 overflow-hidden bg-black/50">
        <div className="max-w-6xl mx-auto px-4 mb-16 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border text-xs font-mono mb-6 border-green-500/30 bg-green-500/10 text-green-400">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" /> TESTIMONIALS
          </div>
          <h2 className="text-3xl md:text-5xl font-bold mb-4 text-white">Loved by engineering teams</h2>
          <p className="text-lg text-gray-400">Hear what founders and developers say about CODINSPECT.</p>
        </div>
        <div className="relative w-full max-w-7xl mx-auto overflow-hidden group">
          <div className="absolute left-0 top-0 h-full w-20 z-10 pointer-events-none bg-gradient-to-r from-black to-transparent" />
          <div className="absolute right-0 top-0 h-full w-20 z-10 pointer-events-none bg-gradient-to-l from-black to-transparent" />
          <div className="flex animate-marquee gap-6 min-w-[200%]">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="flex gap-6 shrink-0">
                {[
                  { name: "Briar Martin", handle: "@neilstellar", img: "https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=200", text: "CODINSPECT helped us ship our auth system in days instead of weeks." },
                  { name: "Avery Johnson", handle: "@averywrites", img: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200", text: "I was skeptical about AI engineers, but this agent actually understands our monorepo." },
                  { name: "Jordan Lee", handle: "@jordantalks", img: "https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=200&auto=format&fit=crop&q=60", text: "It fixed a critical bug while I was asleep. Woke up to a green build." },
                  { name: "Sarah Chen", handle: "@schen_dev", img: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&auto=format&fit=crop&q=60", text: "The deep reasoning engine is legit. Caught a race condition we missed." }
                ].map((card, idx) => (
                  <div key={idx} className="p-6 rounded-2xl w-80 shrink-0 border transition-all bg-white/5 border-white/10 hover:bg-white/10">
                    <div className="flex gap-3 mb-4">
                      <img className="w-10 h-10 rounded-full object-cover" src={card.img} alt={card.name} />
                      <div>
                        <div className="flex items-center gap-1">
                          <h4 className="text-sm font-bold text-white">{card.name}</h4>
                          <span className="text-green-500 text-[10px]">✓</span>
                        </div>
                        <p className="text-xs text-gray-500">{card.handle}</p>
                      </div>
                    </div>
                    <p className="text-sm leading-relaxed text-gray-300">"{card.text}"</p>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 border-t border-white/5 bg-black/50 backdrop-blur-lg">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h2 className="text-5xl md:text-8xl font-bold text-transparent bg-clip-text tracking-tighter mb-8 bg-gradient-to-b from-white/20 to-transparent">
            CODINSPECT
          </h2>
          <div className="flex justify-center gap-8 text-sm text-gray-500">
            <a href="#" className="transition hover:text-white">Twitter</a>
            <a href="#" className="transition hover:text-white">GitHub</a>
            <a href="#" className="transition hover:text-white">Discord</a>
          </div>
        </div>
      </footer>

      {/* Global Styles */}
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap');
        
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 30s linear infinite;
        }
         @keyframes shimmer {
          100% { transform: translateX(100%); }
        }
        .animate-shimmer {
           animation: shimmer 2s infinite;
        }
        @keyframes gradient-x {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .animate-gradient-x {
          background-size: 200% 200%;
          animation: gradient-x 5s ease infinite;
        }
        .animation-delay-1000 {
            animation-delay: 1s;
        }
        .animation-delay-2000 {
            animation-delay: 2s;
        }
        .animate-bounce-slow {
            animation: bounce 3s infinite;
        }
      `}</style>
    </div>
  );
}
