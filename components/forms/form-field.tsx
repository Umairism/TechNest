"use client";

import React from "react";

interface FormFieldProps {
  label?: string;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
  className?: string;
  labelClassName?: string;
  errorClassName?: string;
}

export const FormField = React.memo(function FormField({
  label,
  error,
  required = false,
  children,
  className = "space-y-2",
  labelClassName = "block text-sm font-medium text-foreground",
  errorClassName = "text-sm text-red-500 mt-1",
}: FormFieldProps) {
  return (
    <div className={className}>
      {label && (
        <label className={labelClassName}>
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      {children}
      {error && <p className={errorClassName}>{error}</p>}
    </div>
  );
});
