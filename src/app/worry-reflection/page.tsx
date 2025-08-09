"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import useWorryStore, { Worry } from '@/stores/worryStore';
import ChallengeButton from '@/components/ChallengeButton';
import { useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import { toastSuccess } from '@/lib/toast';
import { useTranslation } from '@/lib/intl';

export default function WorryReflection() {
  const { t } = useTranslation();
  const { 
    getActiveWorries, 
    getReleasedWorries, 
    releaseWorry, 
    settings, 
    updateSettings 
  } = useWorryStore();
  
  const [activeWorries, setActiveWorries] = useState<Worry[]>([]);
  const [releasedWorries, setReleasedWorries] = useState<Worry[]>([]);
  const [tempWorryTime, setTempWorryTime] = useState(settings.dailyWorryTime);
  const searchParams = useSearchParams();

  useEffect(() => {
    const completed = searchParams.get('completed');
    if (completed === 'true') {
      toastSuccess('Challenge complete', { description: 'Reflection saved' });
    }
  }, [searchParams]);

  useEffect(() => {
    setActiveWorries(getActiveWorries());
    setReleasedWorries(getReleasedWorries());
  }, [getActiveWorries, getReleasedWorries]);

  const handleReleaseWorry = (id: string) => {
    releaseWorry(id);
    setActiveWorries(getActiveWorries());
    setReleasedWorries(getReleasedWorries());
    toast.success('Worry released');
  };

  const handleUpdateWorryTime = () => {
    updateSettings({ dailyWorryTime: tempWorryTime });
    toast.message('Daily worry time updated');
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="space-y-10 max-w-6xl mx-auto">
      {/* Header Section */}
      <section className="bg-white/90 backdrop-blur rounded-2xl shadow-sm ring-1 ring-gray-200/70 p-6 sm:p-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold">{t('worryReflection.title')}</h1>
            <p className="text-gray-600">
              {activeWorries.length} {t('worryReflection.activeWorries', { count: activeWorries.length })}
            </p>
          </div>
          <div className="text-right">
            <div className="flex items-center gap-2 mb-2">
              <label htmlFor="worry-time" className="text-sm font-medium">{t('worryReflection.dailyWorryTime')}:</label>
              <input 
                id="worry-time"
                type="number" 
                min="5" 
                max="60" 
                value={tempWorryTime}
                onChange={(e) => setTempWorryTime(Number(e.target.value))}
                onBlur={handleUpdateWorryTime}
                className="w-16 text-center border rounded px-2 py-1 text-sm"
              />
              <span className="text-sm">{t('worryReflection.min')}</span>
            </div>
            <p className="text-xs text-gray-500">{t('worryReflection.worryTimeHelp')}</p>
          </div>
        </div>

        {/* Active Worries */}
        {activeWorries.length > 0 ? (
          <div className="space-y-4">
            <h2 className="font-semibold text-lg">{t('worryReflection.currentWorries')}</h2>
            <div className="grid gap-4">
              {activeWorries.map((worry) => (
                <div key={worry.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-lg">{worry.name}</h3>
                    <span className="text-xs bg-gray-100 px-2 py-1 rounded-full">{worry.category}</span>
                  </div>
                  <p className="text-gray-700 mb-3">{worry.description}</p>
                  
                  {worry.bodyResponses.length > 0 && (
                    <div className="mb-3">
                      <p className="text-sm text-gray-600 mb-1">{t('worryReflection.physicalResponses')}:</p>
                      <div className="flex flex-wrap gap-1">
                        {worry.bodyResponses.map((response, idx) => (
                          <span key={idx} className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                            {response}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <div className="flex justify-between items-center gap-3">
                    <span className="text-xs text-gray-500">
                      {t('worryReflection.added')} {formatDate(worry.createdAt)}
                    </span>
                    <div className="flex gap-2">
                      <ChallengeButton 
                        worryId={worry.id}
                        worryText={worry.description}
                        className="text-xs"
                      />
                      <button 
                        onClick={() => handleReleaseWorry(worry.id)}
                        className="px-4 py-2 bg-gradient-to-r from-accentLavender to-accentTeal text-white rounded-lg text-sm hover:shadow-md transition-shadow"
                      >
                        {t('worryReflection.releaseWorry')}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="mb-4">
              <div className="w-24 h-24 mx-auto bg-gray-100 rounded-full flex items-center justify-center">
                <span className="text-4xl">🫙</span>
              </div>
            </div>
            <h2 className="font-semibold text-lg mb-2">{t('worryReflection.emptyJar.title')}</h2>
            <p className="text-gray-600 mb-4">{t('worryReflection.emptyJar.subtitle')}</p>
            <Link 
              href="/add-worry" 
              className="inline-block px-6 py-2 bg-gradient-to-r from-accentLavender to-accentTeal text-white rounded-lg hover:shadow-md transition-shadow"
            >
              {t('worryReflection.emptyJar.addFirst')}
            </Link>
          </div>
        )}
      </section>

      {/* Released Worries */}
      {releasedWorries.length > 0 && (
        <section className="bg-white/90 backdrop-blur rounded-2xl shadow-sm ring-1 ring-gray-200/70 p-6 sm:p-8">
          <h2 className="font-semibold text-lg mb-4">{t('worryReflection.releasedWorries.title')}</h2>
          <p className="text-sm text-gray-600 mb-4">
            {t('worryReflection.releasedWorries.subtitle', { count: releasedWorries.length })}
          </p>
          <div className="grid gap-3">
            {releasedWorries.slice(0, 5).map((worry) => (
              <div key={worry.id} className="border rounded-lg p-3 bg-gray-50">
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-medium">{worry.name}</h4>
                    <p className="text-sm text-gray-600">{worry.category}</p>
                  </div>
                  <span className="text-xs text-gray-500">
                    {t('worryReflection.released')} {worry.releasedAt ? formatDate(worry.releasedAt) : t('worryReflection.unknown')}
                  </span>
                </div>
              </div>
            ))}
            {releasedWorries.length > 5 && (
              <p className="text-sm text-gray-500 text-center">
                {t('worryReflection.releasedWorries.andMore', { count: releasedWorries.length - 5 })}
              </p>
            )}
          </div>
        </section>
      )}
    </div>
  );
}
