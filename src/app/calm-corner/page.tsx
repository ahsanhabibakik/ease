'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import { useTranslation } from '@/lib/intl';

export default function CalmCorner() {
  const { t } = useTranslation();
  const [isBreathing, setIsBreathing] = useState(false);
  const [breathingPhase, setBreathingPhase] = useState<'inhale' | 'hold' | 'exhale' | 'pause'>('inhale');
  const [countdown, setCountdown] = useState(4);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const breathingCycle = useMemo(() => ({
    inhale: { duration: 4, next: 'hold', instruction: t('calmCorner.breathing.inhale') },
    hold: { duration: 4, next: 'exhale', instruction: t('calmCorner.breathing.hold') },
    exhale: { duration: 6, next: 'pause', instruction: t('calmCorner.breathing.exhale') },
    pause: { duration: 2, next: 'inhale', instruction: t('calmCorner.breathing.pause') }
  }), [t]);

  const startBreathing = () => {
    setIsBreathing(true);
    setBreathingPhase('inhale');
    setCountdown(4);
  };

  const stopBreathing = () => {
    setIsBreathing(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    setCountdown(4);
    setBreathingPhase('inhale');
  };

  useEffect(() => {
    if (!isBreathing) return;

    const currentCycle = breathingCycle;
    intervalRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          const currentPhase = currentCycle[breathingPhase];
          const nextPhase = currentPhase.next as keyof typeof currentCycle;
          setBreathingPhase(nextPhase);
          return currentCycle[nextPhase].duration;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isBreathing, breathingPhase, breathingCycle]);

  const getCircleScale = () => {
    if (breathingPhase === 'inhale') return 'scale-150';
    if (breathingPhase === 'exhale') return 'scale-75';
    return 'scale-125';
  };

  return (
    <div className="space-y-10 max-w-5xl mx-auto">
      {/* Breathing Exercise */}
      <section className="bg-white/90 backdrop-blur rounded-2xl p-8 shadow-sm ring-1 ring-gray-200/70 text-center">
        <h1 className="text-3xl font-bold mb-2">{t('calmCorner.title')}</h1>
        <p className="text-gray-600 mb-8">{t('calmCorner.subtitle')}</p>
        
        <div className="mb-8">
          <div className={`w-32 h-32 mx-auto rounded-full bg-gradient-to-r from-accentLavender to-accentTeal transition-transform duration-1000 ease-in-out flex items-center justify-center ${getCircleScale()}`}>
            <span className="text-white text-2xl font-bold">{countdown}</span>
          </div>
          
          <div className="mt-6">
            <h2 className="text-xl font-semibold mb-2">
              {isBreathing ? breathingCycle[breathingPhase].instruction : t('calmCorner.breathing.ready')}
            </h2>
            <p className="text-gray-600 mb-4">
              {isBreathing ? t(`calmCorner.breathing.phases.${breathingPhase}`) : t('calmCorner.breathing.subtitle')}
            </p>
            
            <button
              onClick={isBreathing ? stopBreathing : startBreathing}
              className={`px-8 py-3 rounded-lg font-medium transition-all ${
                isBreathing
                  ? 'bg-red-500 hover:bg-red-600 text-white'
                  : 'bg-gradient-to-r from-accentLavender to-accentTeal hover:shadow-lg text-white'
              }`}
            >
              {isBreathing ? t('calmCorner.breathing.stop') : t('calmCorner.breathing.start')}
            </button>
          </div>
        </div>
      </section>

      {/* Quick Techniques */}
      <section className="bg-white p-6 rounded-2xl shadow-md">
        <h2 className="text-2xl font-bold mb-6">{t('calmCorner.techniques.title')}</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-4 border rounded-lg hover:shadow-md transition-shadow">
            <h3 className="font-semibold mb-2">🌊 {t('calmCorner.techniques.progressiveRelaxation.title')}</h3>
            <p className="text-gray-600 text-sm mb-3">
              {t('calmCorner.techniques.progressiveRelaxation.description')}
            </p>
            <p className="text-xs text-gray-500">{t('calmCorner.techniques.progressiveRelaxation.duration')}</p>
          </div>
          
          <div className="p-4 border rounded-lg hover:shadow-md transition-shadow">
            <h3 className="font-semibold mb-2">🎯 {t('calmCorner.techniques.grounding.title')}</h3>
            <p className="text-gray-600 text-sm mb-3">
              {t('calmCorner.techniques.grounding.description')}
            </p>
            <p className="text-xs text-gray-500">{t('calmCorner.techniques.grounding.duration')}</p>
          </div>
          
          <div className="p-4 border rounded-lg hover:shadow-md transition-shadow">
            <h3 className="font-semibold mb-2">🤲 {t('calmCorner.techniques.selfMassage.title')}</h3>
            <p className="text-gray-600 text-sm mb-3">
              {t('calmCorner.techniques.selfMassage.description')}
            </p>
            <p className="text-xs text-gray-500">{t('calmCorner.techniques.selfMassage.duration')}</p>
          </div>
          
          <div className="p-4 border rounded-lg hover:shadow-md transition-shadow">
            <h3 className="font-semibold mb-2">🧘 {t('calmCorner.techniques.mindfulObservation.title')}</h3>
            <p className="text-gray-600 text-sm mb-3">
              {t('calmCorner.techniques.mindfulObservation.description')}
            </p>
            <p className="text-xs text-gray-500">{t('calmCorner.techniques.mindfulObservation.duration')}</p>
          </div>
        </div>
      </section>

      {/* Affirmations */}
      <section className="bg-white p-6 rounded-2xl shadow-md">
        <h2 className="text-2xl font-bold mb-4">{t('calmCorner.affirmations.title')}</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            t('calmCorner.affirmations.list.feeling'),
            t('calmCorner.affirmations.list.safe'),
            t('calmCorner.affirmations.list.visitors'),
            t('calmCorner.affirmations.list.handle'),
            t('calmCorner.affirmations.list.okay'),
            t('calmCorner.affirmations.list.worthy')
          ].map((affirmation, index) => (
            <div key={index} className="p-4 bg-gray-50 rounded-lg">
              <p className="text-gray-700 italic">&quot;{affirmation}&quot;</p>
            </div>
          ))}
        </div>
      </section>

      {/* Emergency Resources */}
      <section className="bg-white p-6 rounded-2xl shadow-md border-l-4 border-red-400">
        <h2 className="text-xl font-bold mb-4 text-red-800">{t('calmCorner.emergency.title')}</h2>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between items-center">
            <span className="font-medium">{t('calmCorner.emergency.crisisText.title')}:</span>
            <span className="text-blue-600">{t('calmCorner.emergency.crisisText.contact')}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="font-medium">{t('calmCorner.emergency.suicidePrevention.title')}:</span>
            <span className="text-blue-600">{t('calmCorner.emergency.suicidePrevention.contact')}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="font-medium">{t('calmCorner.emergency.emergency.title')}:</span>
            <span className="text-red-600">{t('calmCorner.emergency.emergency.contact')}</span>
          </div>
        </div>
      </section>
    </div>
  );
}
