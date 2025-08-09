"use client";
// Centralized toast helper utilities for consistent UX messaging
import { toast } from 'sonner';

export const toastSuccess = (msg: string, opts: { description?: string } = {}) => toast.success(msg, opts);
export const toastError = (msg: string, opts: { description?: string } = {}) => toast.error(msg, opts);
export const toastInfo = (msg: string, opts: { description?: string } = {}) => toast.message(msg, opts);

export function toastApiError(action: string, error?: unknown) {
  console.error(`[toastApiError] ${action}:`, error);
  toastError(`${action} failed`, { description: 'Please try again shortly.' });
}

export function toastApiSuccess(action: string, details?: string) {
  toastSuccess(action, details ? { description: details } : {});
}

// Auth helpers
export function toastSignedIn() {
  toastSuccess('Signed in', { description: 'Your data is syncing securely.' });
}
export function toastSignedOut() {
  toastInfo('Signed out', { description: 'Come back anytime.' });
}
