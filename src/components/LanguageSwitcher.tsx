'use client';

import { useState } from 'react';
import { useIntl } from '@/lib/intl';
import { ChevronDown, Globe } from 'lucide-react';

const LANGUAGE_NAMES = {
  en: 'English',
  hi: 'हिन्दी',
  bn: 'বাংলা',
  fr: 'Français'
};

export function LanguageSwitcher() {
  const { locale, setLocale } = useIntl();
  const [isOpen, setIsOpen] = useState(false);

  const handleLanguageChange = (newLocale: string) => {
    setLocale(newLocale);
    setIsOpen(false);
  };

  return (
    <div className="relative inline-block text-left">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        aria-haspopup="true"
        aria-expanded={isOpen}
        type="button"
      >
        <Globe className="w-4 h-4" />
        <span>{LANGUAGE_NAMES[locale as keyof typeof LANGUAGE_NAMES]}</span>
        <ChevronDown className="w-4 h-4" />
      </button>

      {isOpen && (
        <div className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          <div className="py-1" role="menu" aria-orientation="vertical">
            {Object.entries(LANGUAGE_NAMES).map(([localeCode, languageName]) => (
              <button
                key={localeCode}
                onClick={() => handleLanguageChange(localeCode)}
                className={`block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${
                  locale === localeCode
                    ? 'bg-indigo-50 text-indigo-700 font-medium'
                    : 'text-gray-700'
                }`}
                role="menuitem"
              >
                {languageName}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
