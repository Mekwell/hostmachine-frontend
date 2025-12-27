"use client";

export default function SectionDivider() {
    return (
        <div className="w-full h-32 relative pointer-events-none">
            {/* Ambient Glow for blending */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl h-full bg-brand-purple/5 blur-[100px] opacity-50" />
        </div>
    );
}