"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState, useEffect, useRef, useCallback } from "react";
import { SidebarLayout, useSidebarContext } from "@/components/sidebar-layout";
import { formatModelNameLower } from "@/lib/format";
import {
    Search,
    Database,
    Cpu,
    Zap,
    ChevronRight,
    Check,
    MessageSquare,
    ArrowUp,
    Loader2,
    LayoutPanelLeft,
    Box
} from "lucide-react";

interface Repo {
    id: number;
    fullName: string;
    owner: string;
    name: string;
    description: string | null;
    private: boolean;
}

interface ModelOption {
    id: string;
    name: string;
    description: string;
}

const MODEL_OPTIONS: { category: string; models: ModelOption[] }[] = [
    {
        category: "Anthropic",
        models: [
            { id: "claude-haiku-4-5", name: "claude haiku 4.5", description: "Fast and efficient" },
            { id: "claude-sonnet-4-5", name: "claude sonnet 4.5", description: "Balanced performance" },
        ],
    },
    {
        category: "Google",
        models: [
            { id: "gemini-2.0-flash", name: "Gemini 2.0 Flash", description: "Fastest Google model" },
            { id: "gemini-2.0-pro", name: "Gemini 2.0 Pro", description: "Most capable Google model" },
        ],
    },
];

export default function DashboardPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [repos, setRepos] = useState<Repo[]>([]);
    const [loadingRepos, setLoadingRepos] = useState(false);
    const [selectedRepo, setSelectedRepo] = useState<string>("");
    const [selectedModel, setSelectedModel] = useState("claude-haiku-4-5");
    const [prompt, setPrompt] = useState("");
    const [creating, setCreating] = useState(false);
    const [error, setError] = useState("");
    const [pendingSessionId, setPendingSessionId] = useState<string | null>(null);
    const [isCreatingSession, setIsCreatingSession] = useState(false);
    const sessionCreationPromise = useRef<Promise<string | null> | null>(null);
    const abortControllerRef = useRef<AbortController | null>(null);
    const pendingConfigRef = useRef<{ repo: string; model: string } | null>(null);

    const fetchRepos = useCallback(async () => {
        setLoadingRepos(true);
        try {
            const res = await fetch("/api/repos");
            if (res.ok) {
                const data = await res.json();
                const repoList = data.repos || [];
                setRepos(repoList);
                if (repoList.length > 0) {
                    setSelectedRepo((current) => current || repoList[0].fullName);
                }
            }
        } catch (error) {
            console.error("Failed to fetch repos:", error);
        } finally {
            setLoadingRepos(false);
        }
    }, []);

    useEffect(() => {
        if (session) {
            fetchRepos();
        }
    }, [session, fetchRepos]);

    useEffect(() => {
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
            abortControllerRef.current = null;
        }
        setPendingSessionId(null);
        setIsCreatingSession(false);
        sessionCreationPromise.current = null;
        pendingConfigRef.current = null;
    }, [selectedRepo, selectedModel]);

    const createSessionForWarming = useCallback(async () => {
        if (pendingSessionId) return pendingSessionId;
        if (sessionCreationPromise.current) return sessionCreationPromise.current;
        if (!selectedRepo) return null;

        setIsCreatingSession(true);
        const [owner, name] = selectedRepo.split("/");
        const currentConfig = { repo: selectedRepo, model: selectedModel };
        pendingConfigRef.current = currentConfig;

        const abortController = new AbortController();
        abortControllerRef.current = abortController;

        const promise = (async () => {
            try {
                const res = await fetch("/api/sessions", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        repoOwner: owner,
                        repoName: name,
                        model: selectedModel,
                    }),
                    signal: abortController.signal,
                });

                if (res.ok) {
                    const data = await res.json();
                    if (
                        pendingConfigRef.current?.repo === currentConfig.repo &&
                        pendingConfigRef.current?.model === currentConfig.model
                    ) {
                        setPendingSessionId(data.sessionId);
                        return data.sessionId as string;
                    }
                    return null;
                }
                return null;
            } catch (error) {
                if (error instanceof Error && error.name === "AbortError") {
                    return null;
                }
                console.error("Failed to create session for warming:", error);
                return null;
            } finally {
                if (abortControllerRef.current === abortController) {
                    setIsCreatingSession(false);
                    sessionCreationPromise.current = null;
                    abortControllerRef.current = null;
                }
            }
        })();

        sessionCreationPromise.current = promise;
        return promise;
    }, [selectedRepo, selectedModel, pendingSessionId]);

    const handlePromptChange = (value: string) => {
        const wasEmpty = prompt.length === 0;
        setPrompt(value);
        if (wasEmpty && value.length > 0 && !pendingSessionId && !isCreatingSession && selectedRepo) {
            createSessionForWarming();
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!prompt.trim()) return;
        if (!selectedRepo) {
            setError("Please select a repository");
            return;
        }

        setCreating(true);
        setError("");

        try {
            let sessionId = pendingSessionId;
            if (!sessionId) {
                sessionId = await createSessionForWarming();
            }

            if (!sessionId) {
                setError("Failed to create session");
                setCreating(false);
                return;
            }

            const res = await fetch(`/api/sessions/${sessionId}/prompt`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    content: prompt,
                    model: selectedModel,
                }),
            });

            if (res.ok) {
                router.push(`/session/${sessionId}`);
            } else {
                const data = await res.json();
                setError(data.error || "Failed to send prompt");
                setCreating(false);
            }
        } catch (_error) {
            setError("Failed to create session");
            setCreating(false);
        }
    };

    return (
        <SidebarLayout>
            <div className="h-full relative overflow-hidden bg-[#0a0a0b]">
                <MeshBackground />
                <HomeContent
                    isAuthenticated={!!session}
                    repos={repos}
                    loadingRepos={loadingRepos}
                    selectedRepo={selectedRepo}
                    setSelectedRepo={setSelectedRepo}
                    selectedModel={selectedModel}
                    setSelectedModel={setSelectedModel}
                    prompt={prompt}
                    handlePromptChange={handlePromptChange}
                    creating={creating}
                    isCreatingSession={isCreatingSession}
                    error={error}
                    handleSubmit={handleSubmit}
                />
            </div>
        </SidebarLayout>
    );
}

function MeshBackground() {
    return (
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
            <div className="absolute -top-[20%] -left-[10%] w-[60%] h-[60%] bg-accent/20 rounded-full blur-[120px] animate-mesh" />
            <div className="absolute -bottom-[20%] -right-[10%] w-[50%] h-[50%] bg-accent/10 rounded-full blur-[100px] animate-mesh" style={{ animationDelay: "-5s" }} />
            <div className="absolute top-[20%] right-[10%] w-[40%] h-[40%] bg-purple-500/10 rounded-full blur-[120px] animate-mesh" style={{ animationDelay: "-10s" }} />
        </div>
    );
}

function HomeContent({
    isAuthenticated,
    repos,
    loadingRepos,
    selectedRepo,
    setSelectedRepo,
    selectedModel,
    setSelectedModel,
    prompt,
    handlePromptChange,
    creating,
    isCreatingSession,
    error,
    handleSubmit,
}: {
    isAuthenticated: boolean;
    repos: Repo[];
    loadingRepos: boolean;
    selectedRepo: string;
    setSelectedRepo: (value: string) => void;
    selectedModel: string;
    setSelectedModel: (value: string) => void;
    prompt: string;
    handlePromptChange: (value: string) => void;
    creating: boolean;
    isCreatingSession: boolean;
    error: string;
    handleSubmit: (e: React.FormEvent) => void;
}) {
    const { isOpen, toggle } = useSidebarContext();
    const [repoDropdownOpen, setRepoDropdownOpen] = useState(false);
    const [modelDropdownOpen, setModelDropdownOpen] = useState(false);
    const repoDropdownRef = useRef<HTMLDivElement>(null);
    const modelDropdownRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (repoDropdownRef.current && !repoDropdownRef.current.contains(event.target as Node)) {
                setRepoDropdownOpen(false);
            }
            if (modelDropdownRef.current && !modelDropdownRef.current.contains(event.target as Node)) {
                setModelDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSubmit(e);
        }
    };

    const selectedRepoObj = repos.find((r) => r.fullName === selectedRepo);
    const displayRepoName = selectedRepoObj ? selectedRepoObj.name : "Select repository";

    const [repoSearch, setRepoSearch] = useState("");
    const filteredRepos = repos.filter(r =>
        r.name.toLowerCase().includes(repoSearch.toLowerCase()) ||
        r.owner.toLowerCase().includes(repoSearch.toLowerCase())
    );

    return (
        <div className="h-full flex flex-col relative z-10">
            {!isOpen && (
                <header className="border-b border-border/50 flex-shrink-0 backdrop-blur-sm">
                    <div className="px-6 py-4">
                        <button
                            onClick={toggle}
                            className="p-2 text-muted-foreground hover:text-foreground hover:bg-white/5 rounded-xl transition-all duration-300"
                            title="Open sidebar"
                        >
                            <LayoutPanelLeft className="w-5 h-5" />
                        </button>
                    </div>
                </header>
            )}

            <div className="flex-1 flex flex-col items-center justify-center p-6 md:p-12">
                <div className="w-full max-w-3xl space-y-8">
                    {/* Welcome text */}
                    <div className="text-center space-y-4">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 text-accent text-xs font-semibold tracking-wide uppercase">
                            <Zap className="w-3 h-3" /> Powered by Advanced AI
                        </div>
                        <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight leading-[1.1]">
                            Build <span className="text-gradient">Faster.</span><br />
                            Cod<span className="opacity-50">Inspect Better.</span>
                        </h1>
                        {isAuthenticated ? (
                            <p className="text-muted-foreground text-lg md:text-xl max-w-xl mx-auto font-medium">
                                What's the next evolution of your project?
                            </p>
                        ) : (
                            <p className="text-muted-foreground">Sign in to start your next session</p>
                        )}
                    </div>

                    {/* Input box */}
                    {isAuthenticated && (
                        <form onSubmit={handleSubmit} className="space-y-4">
                            {error && (
                                <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-2xl text-sm flex items-center gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
                                    <Box className="w-4 h-4 shrink-0" />
                                    {error}
                                </div>
                            )}

                            <div className="glass rounded-[2rem] p-2 focus-within:ring-2 focus-within:ring-accent/30 transition-all duration-500 shadow-2xl">
                                <div className="relative">
                                    <textarea
                                        ref={inputRef}
                                        value={prompt}
                                        onChange={(e) => handlePromptChange(e.target.value)}
                                        onKeyDown={handleKeyDown}
                                        placeholder="Describe the feature or bug fix you want to build..."
                                        disabled={creating}
                                        className="w-full resize-none bg-transparent px-6 pt-6 pb-20 focus:outline-none text-white text-lg placeholder:text-muted-foreground/50 disabled:opacity-50 min-h-[160px]"
                                    />

                                    <div className="absolute bottom-4 left-6 flex items-center gap-3">
                                        {/* Repo selector */}
                                        <div className="relative" ref={repoDropdownRef}>
                                            <button
                                                type="button"
                                                onClick={() => !creating && setRepoDropdownOpen(!repoDropdownOpen)}
                                                disabled={creating || loadingRepos}
                                                className="flex items-center gap-2 px-3 py-1.5 glass glass-hover rounded-xl text-xs font-semibold text-muted-foreground hover:text-white transition-all duration-300"
                                            >
                                                <Database className="w-3.5 h-3.5" />
                                                <span className="max-w-[120px] truncate">
                                                    {loadingRepos ? "Indexing..." : displayRepoName}
                                                </span>
                                                <ChevronRight className={`w-3 h-3 transition-transform duration-300 ${repoDropdownOpen ? "-rotate-90" : "rotate-90"}`} />
                                            </button>

                                            {repoDropdownOpen && (
                                                <div className="absolute bottom-full left-0 mb-3 w-80 max-h-72 overflow-y-auto bg-[#101012] backdrop-blur-xl rounded-2xl py-2 z-50 shadow-2xl border border-white/10 animate-in fade-in zoom-in-95 duration-200">
                                                    <div className="px-3 pb-2 pt-1 border-b border-white/5 mb-1">
                                                        <div className="relative">
                                                            <Search className="absolute left-2.5 top-2 w-3.5 h-3.5 text-muted-foreground" />
                                                            <input
                                                                type="text"
                                                                value={repoSearch}
                                                                onChange={(e) => setRepoSearch(e.target.value)}
                                                                placeholder="Search repos..."
                                                                className="w-full bg-white/5 border-none rounded-lg pl-8 p-1.5 text-xs focus:ring-1 focus:ring-accent/50 outline-none text-white"
                                                            />
                                                        </div>
                                                    </div>
                                                    {filteredRepos.length > 0 ? filteredRepos.map((repo) => (
                                                        <button
                                                            key={repo.id}
                                                            type="button"
                                                            onClick={() => {
                                                                setSelectedRepo(repo.fullName);
                                                                setRepoDropdownOpen(false);
                                                                setRepoSearch("");
                                                            }}
                                                            className={`w-full flex items-center justify-between px-4 py-3 text-sm hover:bg-white/5 transition-all duration-200 ${selectedRepo === repo.fullName ? "text-accent bg-accent/5" : "text-muted-foreground hover:text-white"}`}
                                                        >
                                                            <div className="flex flex-col items-start gap-0.5">
                                                                <span className="font-bold tracking-tight">{repo.name}</span>
                                                                <span className="text-[10px] opacity-50 uppercase tracking-wider">{repo.owner} {repo.private && "• Private"}</span>
                                                            </div>
                                                            {selectedRepo === repo.fullName && <Check className="w-4 h-4" />}
                                                        </button>
                                                    )) : (
                                                        <div className="px-4 py-8 text-center text-xs text-muted-foreground">
                                                            No repositories found
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </div>

                                        {/* Model selector */}
                                        <div className="relative" ref={modelDropdownRef}>
                                            <button
                                                type="button"
                                                onClick={() => !creating && setModelDropdownOpen(!modelDropdownOpen)}
                                                disabled={creating}
                                                className="flex items-center gap-2 px-3 py-1.5 glass glass-hover rounded-xl text-xs font-semibold text-muted-foreground hover:text-white transition-all duration-300"
                                            >
                                                <Cpu className="w-3.5 h-3.5" />
                                                <span>{formatModelNameLower(selectedModel)}</span>
                                                <ChevronRight className={`w-3 h-3 transition-transform duration-300 ${modelDropdownOpen ? "-rotate-90" : "rotate-90"}`} />
                                            </button>

                                            {modelDropdownOpen && (
                                                <div className="absolute bottom-full left-0 mb-3 w-64 bg-[#101012] backdrop-blur-xl rounded-2xl py-2 z-50 shadow-2xl border border-white/10 animate-in fade-in zoom-in-95 duration-200">
                                                    {MODEL_OPTIONS.map((group, groupIdx) => (
                                                        <div key={group.category}>
                                                            <div className={`px-4 py-2 text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] opacity-40 ${groupIdx > 0 ? "border-t border-white/5 mt-2 pt-3" : ""}`}>
                                                                {group.category}
                                                            </div>
                                                            {group.models.map((model) => (
                                                                <button
                                                                    key={model.id}
                                                                    type="button"
                                                                    onClick={() => {
                                                                        setSelectedModel(model.id);
                                                                        setModelDropdownOpen(false);
                                                                    }}
                                                                    className={`w-full flex items-center justify-between px-4 py-2.5 text-sm hover:bg-white/5 transition-all duration-200 ${selectedModel === model.id ? "text-accent bg-accent/5" : "text-muted-foreground hover:text-white"}`}
                                                                >
                                                                    <div className="flex flex-col items-start gap-0.5">
                                                                        <span className="font-bold">{model.name}</span>
                                                                        <span className="text-[10px] opacity-40">{model.description}</span>
                                                                    </div>
                                                                    {selectedModel === model.id && <Check className="w-4 h-4" />}
                                                                </button>
                                                            ))}
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="absolute bottom-4 right-4 flex items-center gap-4">
                                        {isCreatingSession && (
                                            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 text-[10px] font-bold text-accent uppercase tracking-wider animate-pulse border border-accent/10">
                                                <Loader2 className="w-3 h-3 animate-spin" />
                                                Igniting Sandbox
                                            </div>
                                        )}
                                        <button
                                            type="submit"
                                            disabled={!prompt.trim() || creating || !selectedRepo}
                                            className="group relative flex items-center justify-center w-12 h-12 rounded-2xl bg-white text-black hover:bg-accent hover:text-white disabled:bg-white/10 disabled:text-white/20 transition-all duration-300 shadow-xl disabled:shadow-none"
                                            title="Initiate Agent"
                                        >
                                            {creating ? (
                                                <Loader2 className="w-5 h-5 animate-spin" />
                                            ) : (
                                                <ArrowUp className="w-6 h-6 group-hover:-translate-y-1 transition-transform duration-300" />
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </form>
                    )}

                    {/* Quick actions/suggestions */}
                    <div className="flex flex-wrap justify-center gap-3 pt-4">
                        <ActionButton icon={<MessageSquare className="w-4 h-4" />} label="Refactor Code" />
                        <ActionButton icon={<Zap className="w-4 h-4" />} label="Fix Performance" />
                        <ActionButton icon={<Box className="w-4 h-4" />} label="Add Documentation" />
                    </div>
                </div>
            </div>
        </div>
    );
}

function ActionButton({ icon, label }: { icon: React.ReactNode, label: string }) {
    return (
        <button className="flex items-center gap-2 px-4 py-2.5 glass glass-hover rounded-[1rem] text-sm font-medium text-muted-foreground hover:text-white transition-all duration-300">
            {icon}
            {label}
        </button>
    );
}
