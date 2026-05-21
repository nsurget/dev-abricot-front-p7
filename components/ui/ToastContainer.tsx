"use client";

import React from "react";
import { useToastStore } from "@/store/toastStore";
import Toast from "@/components/ui/Toast";

export default function ToastContainer() {
  const { toasts, removeToast } = useToastStore();

  if (toasts.length === 0) return null;

  return (
    <div className="w-full max-w-7xl mx-auto px-4 mt-4 pointer-events-none">
      <div className="flex flex-col gap-2">
        {toasts.map((toast) => (
          <div key={toast.id} className="pointer-events-auto cursor-pointer" onClick={() => removeToast(toast.id)}>
            <Toast type={toast.type} message={toast.message} />
          </div>
        ))}
      </div>
    </div>
  );
}
