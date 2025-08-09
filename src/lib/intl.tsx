'use client';

import { usePathname } from 'next/navigation';
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
  // Only return locale if the path actually starts with a supported locale
  if (SUPPORTED_LOCALES.includes(firstSegment)) {
    return firstSegment;
  }
  return DEFAULT_LOCALE;
}

export function IntlProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [locale, setLocaleState] = useState(() => {
    if (typeof window !== 'undefined') {
      // First check localStorage
      const stored = localStorage.getItem('ease-locale');
      if (stored && SUPPORTED_LOCALES.includes(stored)) {
        return stored;
      }
      // Then check path
      const pathLocale = getLocaleFromPath(pathname);
      if (pathLocale !== DEFAULT_LOCALE) {
        return pathLocale;
      }
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
        // Set cookie for server-side detection
        document.cookie = `ease-locale=${newLocale}; path=/; max-age=31536000`;
      }
      // Don't navigate - just store preference
      // The user can manually navigate or refresh to see changes
    }
  };

  const formatMessage = (id: string, values?: Record<string, string | number>): string => {
    try {
      if (!messages || Object.keys(messages).length === 0) {
        return id;
      }

      const keys = id.split('.');
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let message: any = messages;
      
      for (const key of keys) {
        if (!message || typeof message !== 'object') {
          console.warn(`Translation path not found: ${id}`);
          return id;
        }
        message = message[key];
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
    } catch (error) {
      console.error(`Error formatting message for key: ${id}`, error);
      return id;
    }
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
    console.error('useIntl must be used within an IntlProvider');
    // Return a safe fallback instead of throwing
    return {
      locale: DEFAULT_LOCALE,
      messages: {},
      formatMessage: (id: string) => id,
      setLocale: () => {}
    };
  }
  return context;
}

export function useTranslation() {
  const { formatMessage } = useIntl();
  return { t: formatMessage };
}
