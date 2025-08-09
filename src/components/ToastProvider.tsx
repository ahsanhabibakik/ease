"use client";
import { Toaster } from "sonner";

export default function ToastProvider() {
  return (
    <Toaster
      position="top-right"
      richColors
      closeButton
      toastOptions={{
        style: { fontSize: '0.85rem', borderRadius: '0.75rem' }
      }}
    />
  );
}
