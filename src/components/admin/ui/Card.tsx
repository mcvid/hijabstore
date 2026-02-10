import React from "react";

interface CardProps {
    children: React.ReactNode;
    className?: string;
    title?: string;
    action?: React.ReactNode;
    footer?: React.ReactNode;
}

export default function Card({
    children,
    className = "",
    title,
    action,
    footer,
}: CardProps) {
    return (
        <div className={`bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow duration-300 border border-admin-gray-200 ${className}`}>
            {(title || action) && (
                <div className="flex justify-between items-center mb-4 pb-4 border-b border-admin-gray-200">
                    {title && <h3 className="text-lg font-display font-semibold text-admin-dark">{title}</h3>}
                    {action && <div>{action}</div>}
                </div>
            )}
            <div className="text-admin-gray-900">{children}</div>
            {footer && (
                <div className="mt-6 pt-4 border-t border-admin-gray-200 text-sm text-admin-gray-600">
                    {footer}
                </div>
            )}
        </div>
    );
}
