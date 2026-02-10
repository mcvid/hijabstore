import React from "react";
import { Loader2 } from "lucide-react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "primary" | "secondary" | "danger" | "ghost";
    size?: "sm" | "md" | "lg";
    isLoading?: boolean;
    icon?: React.ElementType;
}

export default function Button({
    children,
    variant = "primary",
    size = "md",
    isLoading = false,
    icon: Icon,
    className = "",
    disabled,
    ...props
}: ButtonProps) {
    const baseStyles = "inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed";

    const variants = {
        primary: "bg-admin-gold text-white hover:brightness-110 shadow-sm hover:shadow-md",
        secondary: "bg-transparent border border-admin-gray-200 text-admin-dark hover:bg-admin-gray-100",
        danger: "bg-status-danger text-white hover:bg-red-700 shadow-sm hover:shadow-md",
        ghost: "bg-transparent text-admin-gray-600 hover:text-admin-dark hover:bg-admin-gray-100",
    };

    const sizes = {
        sm: "px-3 py-1.5 text-xs",
        md: "px-4 py-2 text-sm",
        lg: "px-6 py-3 text-base",
    };

    return (
        <button
            className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
            disabled={isLoading || disabled}
            {...props}
        >
            {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
            ) : Icon ? (
                <Icon className="w-4 h-4 mr-2" />
            ) : null}
            {children}
        </button>
    );
}
