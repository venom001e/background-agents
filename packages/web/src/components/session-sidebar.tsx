"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect, useMemo } from "react";
import { useSession, signOut } from "next-auth/react";
import { formatRelativeTime, isInactiveSession } from "@/lib/time";
import {
  Plus,
  Search,
  PanelLeftClose,
  Hexagon,
  LogOut,
  Clock,
  History,
  LayoutGrid,
  Settings
} from "lucide-react";

export interface SessionItem {
  id: string;
  title: string | null;
  repoOwner: string;
  repoName: string;
  status: string;
  createdAt: number;
  updatedAt: number;
}

interface SessionSidebarProps {
  onNewSession?: () => void;
  onToggle?: () => void;
}

export function SessionSidebar({ onNewSession, onToggle }: SessionSidebarProps) {
  const { data: authSession } = useSession();
  const pathname = usePathname();
  const [sessions, setSessions] = useState<SessionItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (authSession) {
      fetchSessions();
    }
  }, [authSession]);

  const fetchSessions = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/sessions");
      if (res.ok) {
        const data = await res.json();
        setSessions(data.sessions || []);
      }
    } catch (error) {
      console.error("Failed to fetch sessions:", error);
    } finally {
      setLoading(false);
    }
  };

  const { activeSessions, inactiveSessions } = useMemo(() => {
    const filtered = sessions.filter((session) => {
      if (!searchQuery) return true;
      const query = searchQuery.toLowerCase();
      const title = session.title?.toLowerCase() || "";
      const repo = `${session.repoOwner}/${session.repoName}`.toLowerCase();
      return title.includes(query) || repo.includes(query);
    });

    const sorted = [...filtered].sort((a, b) => {
      const aTime = a.updatedAt || a.createdAt;
      const bTime = b.updatedAt || b.createdAt;
      return bTime - aTime;
    });

    const active: SessionItem[] = [];
    const inactive: SessionItem[] = [];

    for (const session of sorted) {
      const timestamp = session.updatedAt || session.createdAt;
      if (isInactiveSession(timestamp)) {
        inactive.push(session);
      } else {
        active.push(session);
      }
    }

    return { activeSessions: active, inactiveSessions: inactive };
  }, [sessions, searchQuery]);

  const currentSessionId = pathname?.startsWith("/session/") ? pathname.split("/")[2] : null;

  return (
    <aside className="w-72 h-screen flex flex-col bg-[#0a0a0b] border-r border-white/5 relative z-20">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-5">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-accent/20 flex items-center justify-center border border-accent/20">
            <Hexagon className="w-5 h-5 text-accent fill-accent/10" />
          </div>
          <span className="font-black text-lg tracking-tighter text-white uppercase italic">CodInspect</span>
        </div>
        <button
          onClick={onToggle}
          className="p-1.5 text-muted-foreground hover:text-white hover:bg-white/5 rounded-lg transition-all"
        >
          <PanelLeftClose className="w-4 h-4" />
        </button>
      </div>

      {/* Action Buttons */}
      <div className="px-4 mb-4">
        <button
          onClick={onNewSession}
          className="w-full flex items-center justify-between px-4 py-3 bg-white text-black rounded-2xl font-bold text-sm hover:bg-accent hover:text-white transition-all duration-300 shadow-lg shadow-white/5 group"
        >
          <div className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            New Session
          </div>
          <kbd className="hidden group-hover:block px-1.5 py-0.5 rounded-md bg-black/10 text-[10px] uppercase font-black tracking-widest text-black/40 border border-black/5 animate-in fade-in duration-300">
            ⌘N
          </kbd>
        </button>
      </div>

      {/* Search */}
      <div className="px-4 mb-6">
        <div className="relative group">
          <Search className="absolute left-3.5 top-2.5 w-4 h-4 text-muted-foreground group-focus-within:text-accent transition-colors" />
          <input
            type="text"
            placeholder="Search sessions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white/[0.02] border border-white/5 rounded-xl text-sm text-white placeholder:text-muted-foreground/30 focus:outline-none focus:ring-1 focus:ring-accent/50 focus:bg-white/[0.04] transition-all"
          />
        </div>
      </div>

      {/* Session List */}
      <div className="flex-1 overflow-y-auto px-2 space-y-1">
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="w-6 h-6 border-2 border-accent border-t-transparent rounded-full animate-spin" />
          </div>
        ) : sessions.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-white/5">
              <History className="w-6 h-6 text-muted-foreground/30" />
            </div>
            <p className="text-xs font-bold text-muted-foreground/40 uppercase tracking-widest">No history yet</p>
          </div>
        ) : (
          <>
            {activeSessions.length > 0 && (
              <div className="px-4 py-2 mt-2">
                <span className="text-[10px] font-black text-muted-foreground/40 uppercase tracking-[0.2em]">Active Now</span>
              </div>
            )}
            {activeSessions.map((session) => (
              <SessionListItem
                key={session.id}
                session={session}
                isActive={session.id === currentSessionId}
              />
            ))}

            {inactiveSessions.length > 0 && (
              <>
                <div className="px-4 py-4 mt-2">
                  <span className="text-[10px] font-black text-muted-foreground/40 uppercase tracking-[0.2em]">Older</span>
                </div>
                {inactiveSessions.map((session) => (
                  <SessionListItem
                    key={session.id}
                    session={session}
                    isActive={session.id === currentSessionId}
                  />
                ))}
              </>
            )}
          </>
        )}
      </div>

      {/* Footer / User Profile */}
      <div className="p-4 border-t border-white/5 space-y-2">
        <div className="flex items-center justify-between p-2 glass rounded-2xl">
          <div className="flex items-center gap-3 min-w-0">
            {authSession?.user?.image ? (
              <img
                src={authSession.user.image}
                alt={authSession.user.name || "User"}
                className="w-10 h-10 rounded-xl object-cover border border-white/10 shrink-0"
              />
            ) : (
              <div className="w-10 h-10 rounded-xl bg-accent/20 flex items-center justify-center text-accent font-bold shrink-0">
                {authSession?.user?.name?.charAt(0).toUpperCase() || "?"}
              </div>
            )}
            <div className="flex flex-col min-w-0">
              <span className="text-sm font-bold text-white truncate leading-tight">
                {authSession?.user?.name || "Anonymous"}
              </span>
              <span className="text-[10px] text-muted-foreground truncate uppercase tracking-widest font-black opacity-40">
                Free Tier
              </span>
            </div>
          </div>
          <button
            onClick={() => signOut()}
            className="p-2 text-muted-foreground hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all"
            title="Sign out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}

function SessionListItem({ session, isActive }: { session: SessionItem; isActive: boolean }) {
  const timestamp = session.updatedAt || session.createdAt;
  const relativeTime = formatRelativeTime(timestamp);
  const displayTitle = session.title || `${session.repoOwner}/${session.repoName}`;
  const repoInfo = `${session.repoOwner}/${session.repoName}`;

  return (
    <Link
      href={`/session/${session.id}`}
      className={`group flex items-center gap-3 px-4 py-3 mx-2 rounded-2xl transition-all duration-300 ${isActive
        ? "bg-accent/10 border border-accent/20 text-accent"
        : "hover:bg-white/5 text-muted-foreground hover:text-white border border-transparent"
        }`}
    >
      <div className={`w-2 h-2 rounded-full shrink-0 transition-all ${isActive ? "bg-accent shadow-[0_0_8px_rgba(212,160,23,1)]" : "bg-white/10"}`} />
      <div className="flex-1 min-w-0">
        <div className={`truncate text-sm font-bold tracking-tight ${isActive ? "text-white" : ""}`}>
          {displayTitle}
        </div>
        <div className="flex items-center gap-2 mt-0.5 text-[10px] font-bold uppercase tracking-widest opacity-40 group-hover:opacity-60 transition-opacity">
          <Clock className="w-2.5 h-2.5" />
          <span>{relativeTime}</span>
          <span>·</span>
          <span className="truncate">{repoInfo}</span>
        </div>
      </div>
    </Link>
  );
}
