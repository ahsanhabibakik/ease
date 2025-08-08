'use client';

import { usePathname, useRouter } from 'next/navigation';
import { createContext, useContext, useEffect, useState } from 'react';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Messages = Record<string, any>;

interface IntlContextType {
  locale: string;
  messages: Messages;
  formatMessage: (id: string, values?: Record<string, string | number>) => string;
  setLocale: (locale: string) => void;
}

const IntlContext = createContext<IntlContextType | undefined>(undefined);

const DEFAULT_LOCALE = 'en';
const SUPPORTED_LOCALES = ['en', 'hi', 'bn', 'fr'];

async function loadMessages(locale: string): Promise<Messages> {
  try {
    const messages = await import(`../../locales/${locale}.json`);
    return messages.default || messages;
  } catch {
    console.warn(`Failed to load messages for locale: ${locale}`);
    // Fallback to English
    const fallback = await import('../../locales/en.json');
    return fallback.default || fallback;
  }
}

function getLocaleFromPath(pathname: string): string {
  const segments = pathname.split('/').filter(Boolean);
  const firstSegment = segments[0];
  return SUPPORTED_LOCALES.includes(firstSegment) ? firstSegment : DEFAULT_LOCALE;
}

export function IntlProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [locale, setLocaleState] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('ease-locale') || getLocaleFromPath(pathname) || DEFAULT_LOCALE;
    }
    return DEFAULT_LOCALE;
  });
  const [messages, setMessages] = useState<Messages>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function init() {
      setLoading(true);
      const msgs = await loadMessages(locale);
      setMessages(msgs);
      setLoading(false);
    }
    init();
  }, [locale]);

  const setLocale = (newLocale: string) => {
    if (SUPPORTED_LOCALES.includes(newLocale)) {
      setLocaleState(newLocale);
      if (typeof window !== 'undefined') {
        localStorage.setItem('ease-locale', newLocale);
      }
      // For App Router, we'll manage locale client-side
      const currentPath = pathname.replace(`/${locale}`, '').replace(/^\/+/, '') || '/';
      const newPath = newLocale === DEFAULT_LOCALE ? currentPath : `/${newLocale}${currentPath === '/' ? '' : '/' + currentPath}`;
      router.push(newPath);
    }
  };

  const formatMessage = (id: string, values?: Record<string, string | number>): string => {
    const keys = id.split('.');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let message: any = messages;
    
    for (const key of keys) {
      message = message?.[key];
    }

    if (typeof message !== 'string') {
      console.warn(`Translation missing for key: ${id}`);
      return id;
    }

    if (!values) return message;

    // Simple placeholder replacement
    return message.replace(/\{(\w+)\}/g, (match: string, key: string) => {
      return values[key]?.toString() || match;
    });
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <IntlContext.Provider value={{ locale, messages, formatMessage, setLocale }}>
      {children}
    </IntlContext.Provider>
  );
}

export function useIntl() {
  const context = useContext(IntlContext);
  if (!context) {
    throw new Error('useIntl must be used within an IntlProvider');
  }
  return context;
}

export function useTranslation() {
  const { formatMessage } = useIntl();
  return { t: formatMessage };
}
