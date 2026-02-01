import React from "react";

interface SectionTitleProps {
    badge?: string;
    icon?: React.ReactNode;
    title: string;
    description?: string;
}

export default function SectionTitle({ badge, icon, title, description }: SectionTitleProps) {
    return (
        <div className="text-center mb-16 px-4">
            {badge && (
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border text-xs font-mono mb-6 bg-green-500/10 border-green-500/20 text-green-500">
                    {icon} <span className="uppercase tracking-wide">{badge}</span>
                </div>
            )}
            <h2 className="text-3xl md:text-5xl font-bold mb-4 text-white tracking-tight">{title}</h2>
            {description && (
                <p className="text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed">
                    {description}
                </p>
            )}
        </div>
    );
}
