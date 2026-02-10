import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    helperText?: string;
    icon?: React.ElementType;
}

export default function Input({
    label,
    error,
    helperText,
    icon: Icon,
    className = "",
    id,
    ...props
}: InputProps) {
    const inputId = id || props.name;

    return (
        <div className={`w-full ${className}`}>
            {label && (
                <label
                    htmlFor={inputId}
                    className="block text-sm font-medium text-admin-gray-900 mb-1"
                >
                    {label}
                </label>
            )}
            <div className="relative">
                {Icon && (
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Icon className="h-5 w-5 text-admin-gray-600" aria-hidden="true" />
                    </div>
                )}
                <input
                    id={inputId}
                    className={`
            block w-full rounded-md shadow-sm sm:text-sm transition-colors duration-200
            ${Icon ? "pl-10" : "pl-3"}
            ${error
                            ? "border-red-300 text-red-900 placeholder-red-300 focus:ring-red-500 focus:border-red-500"
                            : "border-admin-gray-200 text-admin-dark placeholder-admin-gray-600 focus:ring-admin-gold focus:border-admin-gold hover:border-admin-gray-400"
                        }
            disabled:bg-admin-gray-100 disabled:text-admin-gray-600 disabled:cursor-not-allowed
            py-2
          `}
                    aria-invalid={!!error}
                    aria-describedby={error ? `${inputId}-error` : undefined}
                    {...props}
                />
            </div>
            {error ? (
                <p className="mt-1 text-sm text-red-600" id={`${inputId}-error`}>
                    {error}
                </p>
            ) : helperText ? (
                <p className="mt-1 text-sm text-admin-gray-600" id={`${inputId}-helper`}>
                    {helperText}
                </p>
            ) : null}
        </div>
    );
}
