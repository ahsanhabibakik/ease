"use client";
import { useSession } from 'next-auth/react';
import { useEffect, useRef } from 'react';
import { toastSignedIn } from '@/lib/toast';

// Fires a one-time toast when a user transitions into an authenticated session.
export default function SessionToastWatcher() {
  const { status } = useSession();
  const fired = useRef(false);
  useEffect(() => {
    if (!fired.current && status === 'authenticated') {
      fired.current = true;
      toastSignedIn();
    }
  }, [status]);
  return null;
}
