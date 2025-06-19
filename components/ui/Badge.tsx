import React from "react";

const variants: Record<string, string> = {
  default: "bg-blue-100 text-blue-800",
  outline: "border border-gray-300 text-gray-700 bg-white",
  secondary: "bg-gray-100 text-gray-800",
};

export function Badge({
  children,
  variant = "default",
  className = "",
}: {
  children: React.ReactNode;
  variant?: "default" | "outline" | "secondary";
  className?: string;
}) {
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
} 