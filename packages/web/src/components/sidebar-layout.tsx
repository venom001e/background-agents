"use client";

import { createContext, useContext } from "react";
import { useSession, signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { SessionSidebar } from "./session-sidebar";
import { useSidebar } from "@/hooks/use-sidebar";
import { Github, Loader2, Sparkles } from "lucide-react";

interface SidebarContextValue {
  isOpen: boolean;
  toggle: () => void;
  open: () => void;
  close: () => void;
}

const SidebarContext = createContext<SidebarContextValue | null>(null);

export function useSidebarContext() {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebarContext must be used within a SidebarLayout");
  }
  return context;
}

interface SidebarLayoutProps {
  children: React.ReactNode;
}

export function SidebarLayout({ children }: SidebarLayoutProps) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const sidebar = useSidebar();

  // Show loading state
  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0a0b]">
        <Loader2 className="animate-spin h-8 w-8 text-accent" />
      </div>
    );
  }

  // Show sign-in page if not authenticated
  if (!session) {
    return (
      <div className="min-h-screen relative flex flex-col items-center justify-center bg-[#0a0a0b] overflow-hidden p-6">
        {/* Reuse Mesh Background logic directly or via component if shared */}
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-[20%] -left-[10%] w-[60%] h-[60%] bg-accent/20 rounded-full blur-[120px] animate-mesh" />
          <div className="absolute -bottom-[20%] -right-[10%] w-[50%] h-[50%] bg-accent/10 rounded-full blur-[100px] animate-mesh" style={{ animationDelay: "-5s" }} />
        </div>

        <div className="relative z-10 w-full max-w-lg space-y-12 text-center animate-in fade-in slide-in-from-bottom-8 duration-1000">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-accent text-sm font-bold tracking-widest uppercase">
              <Sparkles className="w-4 h-4" /> Next-Gen Build Agent
            </div>
            <h1 className="text-6xl md:text-8xl font-black text-white tracking-tighter leading-none">
              Cod<span className="text-gradient">Inspect</span>
            </h1>
            <p className="text-muted-foreground text-xl font-medium max-w-sm mx-auto">
              Automate your codebase evolution with autonomous AI agents.
            </p>
          </div>

          <div className="glass rounded-[2.5rem] p-4 p-8 space-y-8 shadow-2xl border border-white/5">
            <div className="space-y-2">
              <h3 className="text-white font-bold text-lg">Initialize your workspace</h3>
              <p className="text-muted-foreground text-sm">Securely connect with GitHub to get started.</p>
            </div>
            <button
              onClick={() => signIn("github")}
              className="group w-full flex items-center justify-center gap-4 bg-white text-black px-8 py-5 rounded-[1.5rem] font-bold text-lg hover:bg-accent hover:text-white transition-all duration-500 shadow-xl hover:shadow-accent/25 active:scale-95"
            >
              <Github className="w-6 h-6 group-hover:rotate-12 transition-transform duration-300" />
              Sign in with GitHub
            </button>
            <p className="text-[10px] text-muted-foreground/50 uppercase tracking-[0.2em] font-black">
              Zero-Configuration • Open Source • Enterprise Ready
            </p>
          </div>
        </div>
      </div>
    );
  }

  const handleNewSession = () => {
    router.push("/dashboard");
  };

  return (
    <SidebarContext.Provider value={sidebar}>
      <div className="flex h-screen overflow-hidden">
        {/* Sidebar with transition */}
        <div
          className={`transition-all duration-200 ease-in-out ${sidebar.isOpen ? "w-72" : "w-0"
            } flex-shrink-0 overflow-hidden`}
        >
          <SessionSidebar onNewSession={handleNewSession} onToggle={sidebar.toggle} />
        </div>
        <main className="flex-1 overflow-hidden">{children}</main>
      </div>
    </SidebarContext.Provider>
  );
}

function GitHubIcon() {
  return (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
      <path
        fillRule="evenodd"
        d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
        clipRule="evenodd"
      />
    </svg>
  );
}
