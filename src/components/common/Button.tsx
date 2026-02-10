"use client";
import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "primary" | "secondary" | "outline";
    size?: "sm" | "md" | "lg";
}

export default function Button({
    children,
    variant = "primary",
    size = "md",
    className = "",
    ...props
}: ButtonProps) {
    if (variant === "primary") {
        return (
            <button
                className={`relative inline-block px-10 py-4 bg-primary-dark text-white font-medium tracking-wide overflow-hidden group transition-all duration-300 ${className}`}
                {...props}
            >
                <span className="relative z-10 transition-colors duration-300 group-hover:text-white">
                    {children}
                </span>
                <span className="absolute top-0 left-[-100%] w-full h-full bg-primary-gold transition-all duration-500 ease-out group-hover:left-0 z-0" />
            </button>
        );
    }

    return (
        <button
            className={`px-8 py-3 border border-primary-dark text-primary-dark font-medium tracking-wide hover:bg-primary-dark hover:text-white transition-all duration-300 ${className}`}
            {...props}
        >
            {children}
        </button>
    );
}
