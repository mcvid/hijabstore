import React, { InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label: string;
    error?: string;
}

export default function Input({ label, error, className = "", ...props }: InputProps) {
    return (
        <div className="space-y-1">
            <label className="text-[10px] uppercase font-bold tracking-[0.2em] text-neutral-gray ml-1">
                {label}
            </label>
            <input
                className={`w-full bg-neutral-cream/50 border border-neutral-sand px-4 py-3 text-sm focus:outline-none focus:border-primary-gold transition-colors placeholder:text-neutral-gray/50 ${error ? 'border-red-500' : ''} ${className}`}
                {...props}
            />
            {error && <span className="text-xs text-red-500 ml-1">{error}</span>}
        </div>
    );
}
