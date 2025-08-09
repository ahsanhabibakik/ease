'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useTranslation } from '@/lib/intl';

export default function Companion() {
  const { t } = useTranslation();
  const [selectedGuide, setSelectedGuide] = useState<string | null>(null);

  const guides = {
    'worry-input': {
      title: t('companion.guides.worryInput.title'),
      content: t('companion.guides.worryInput.content')
    },
    'breathing': {
      title: t('companion.guides.breathing.title'),
      content: t('companion.guides.breathing.content')
    },
    'releasing': {
      title: t('companion.guides.releasing.title'),
      content: t('companion.guides.releasing.content')
    },
    'patterns': {
      title: t('companion.guides.patterns.title'),
      content: t('companion.guides.patterns.content')
    }
  };

  const quickTips = [
    {
      icon: '🌱',
      title: t('companion.quickTips.startSmall.title'),
      tip: t('companion.quickTips.startSmall.tip')
    },
    {
      icon: '⏰',
      title: t('companion.quickTips.setWorryTime.title'),
      tip: t('companion.quickTips.setWorryTime.tip')
    },
    {
      icon: '🤝',
      title: t('companion.quickTips.beGentle.title'),
      tip: t('companion.quickTips.beGentle.tip')
    },
    {
      icon: '🔄',
      title: t('companion.quickTips.practiceRegularly.title'),
      tip: t('companion.quickTips.practiceRegularly.tip')
    }
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <section className="bg-white p-8 rounded-2xl shadow-md text-center">
          <h1 className="text-3xl font-bold mb-4">{t('companion.title')}</h1>
          <p className="text-gray-600 text-lg mb-6">
            {t('companion.subtitle')}
          </p>
          <div className="w-20 h-20 mx-auto bg-gradient-to-r from-accentLavender to-accentTeal rounded-full flex items-center justify-center">
            <span className="text-white text-3xl">🤗</span>
          </div>
        </section>

        {/* Quick Tips */}
        <section className="bg-white p-6 rounded-2xl shadow-md">
          <h2 className="text-2xl font-bold mb-6">{t('companion.quickTipsTitle')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {quickTips.map((item, index) => (
              <div key={index} className="p-4 bg-gray-50 rounded-lg hover:shadow-md transition-shadow">
                <div className="flex items-start gap-3">
                  <span className="text-2xl">{item.icon}</span>
                  <div>
                    <h3 className="font-semibold mb-2">{item.title}</h3>
                    <p className="text-gray-600 text-sm">{item.tip}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Guided Help */}
        <section className="bg-white p-6 rounded-2xl shadow-md">
          <h2 className="text-2xl font-bold mb-6">{t('companion.guidedHelpTitle')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(guides).map(([key, guide]) => (
              <button
                key={key}
                onClick={() => setSelectedGuide(selectedGuide === key ? null : key)}
                className={`p-4 border rounded-lg text-left transition-all hover:shadow-md ${
                  selectedGuide === key 
                    ? 'border-accentLavender bg-purple-50' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <h3 className="font-semibold mb-2">{guide.title}</h3>
                <p className="text-sm text-gray-600">
                  {selectedGuide === key ? t('companion.clickToCollapse') : t('companion.clickForGuidance')}
                </p>
              </button>
            ))}
          </div>

          {/* Expanded Guide Content */}
          {selectedGuide && (
            <div className="mt-6 p-6 bg-gray-50 rounded-lg">
              <h3 className="font-bold text-xl mb-4">{guides[selectedGuide as keyof typeof guides].title}</h3>
              <div className="prose prose-gray max-w-none">
                {guides[selectedGuide as keyof typeof guides].content.split('\n').map((paragraph, index) => (
                  paragraph.trim() && (
                    <p key={index} className="mb-3 text-gray-700 leading-relaxed">
                      {paragraph.trim()}
                    </p>
                  )
                ))}
              </div>
            </div>
          )}
        </section>

        {/* Affirmations */}
        <section className="bg-white p-6 rounded-2xl shadow-md">
          <h2 className="text-2xl font-bold mb-4">{t('companion.gentleRemindersTitle')}</h2>
          <div className="space-y-3">
            {[
              t('companion.reminders.feelings'),
              t('companion.reminders.alone'),
              t('companion.reminders.peace'),
              t('companion.reminders.steps'),
              t('companion.reminders.resilient')
            ].map((reminder, index) => (
              <div key={index} className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border-l-4 border-accentLavender">
                <p className="text-gray-700 italic">💙 {reminder}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Getting Started */}
        <section className="bg-white p-6 rounded-2xl shadow-md">
          <h2 className="text-2xl font-bold mb-4">{t('companion.startJourneyTitle')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="w-12 h-12 mx-auto bg-blue-100 rounded-full flex items-center justify-center mb-3">
                <span className="text-blue-600 font-bold">1</span>
              </div>
              <h3 className="font-semibold mb-2">{t('companion.journey.addWorry.title')}</h3>
              <p className="text-sm text-gray-600 mb-3">{t('companion.journey.addWorry.description')}</p>
              <Link href="/add-worry" className="inline-block px-4 py-2 bg-blue-500 text-white rounded-lg text-sm hover:shadow-md transition-shadow">
                {t('companion.journey.addWorry.button')}
              </Link>
            </div>
            
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="w-12 h-12 mx-auto bg-green-100 rounded-full flex items-center justify-center mb-3">
                <span className="text-green-600 font-bold">2</span>
              </div>
              <h3 className="font-semibold mb-2">{t('companion.journey.findCalm.title')}</h3>
              <p className="text-sm text-gray-600 mb-3">{t('companion.journey.findCalm.description')}</p>
              <Link href="/calm-corner" className="inline-block px-4 py-2 bg-green-500 text-white rounded-lg text-sm hover:shadow-md transition-shadow">
                {t('companion.journey.findCalm.button')}
              </Link>
            </div>
            
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="w-12 h-12 mx-auto bg-purple-100 rounded-full flex items-center justify-center mb-3">
                <span className="text-purple-600 font-bold">3</span>
              </div>
              <h3 className="font-semibold mb-2">{t('companion.journey.trackProgress.title')}</h3>
              <p className="text-sm text-gray-600 mb-3">{t('companion.journey.trackProgress.description')}</p>
              <Link href="/easeboard" className="inline-block px-4 py-2 bg-purple-500 text-white rounded-lg text-sm hover:shadow-md transition-shadow">
                {t('companion.journey.trackProgress.button')}
              </Link>
            </div>
          </div>
        </section>
  </div>
  );
}
