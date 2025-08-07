'use client';

import { useState, useEffect, useRef } from 'react';

export default function CalmCorner() {
  const [isBreathing, setIsBreathing] = useState(false);
  const [breathingPhase, setBreathingPhase] = useState<'inhale' | 'hold' | 'exhale' | 'pause'>('inhale');
  const [countdown, setCountdown] = useState(4);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const breathingCycle = {
    inhale: { duration: 4, next: 'hold', instruction: 'Breathe in...' },
    hold: { duration: 4, next: 'exhale', instruction: 'Hold...' },
    exhale: { duration: 6, next: 'pause', instruction: 'Breathe out...' },
    pause: { duration: 2, next: 'inhale', instruction: 'Pause...' }
  };

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
  }, [isBreathing, breathingPhase]);

  const getCircleScale = () => {
    if (breathingPhase === 'inhale') return 'scale-150';
    if (breathingPhase === 'exhale') return 'scale-75';
    return 'scale-125';
  };

  return (
    <div className="space-y-10 max-w-5xl mx-auto">
      {/* Breathing Exercise */}
      <section className="bg-white/90 backdrop-blur rounded-2xl p-8 shadow-sm ring-1 ring-gray-200/70 text-center">
        <h1 className="text-3xl font-bold mb-2">Calm Corner</h1>
        <p className="text-gray-600 mb-8">Find your center with guided breathing</p>
        
        <div className="mb-8">
          <div className={`w-32 h-32 mx-auto rounded-full bg-gradient-to-r from-accentLavender to-accentTeal transition-transform duration-1000 ease-in-out flex items-center justify-center ${getCircleScale()}`}>
            <span className="text-white text-2xl font-bold">{countdown}</span>
          </div>
          
          <div className="mt-6">
            <h2 className="text-xl font-semibold mb-2">
              {isBreathing ? breathingCycle[breathingPhase].instruction : 'Ready to breathe?'}
            </h2>
            <p className="text-gray-600 mb-4">
              {isBreathing ? `${breathingPhase} phase` : '4-4-6-2 breathing pattern'}
            </p>
            
            <button
              onClick={isBreathing ? stopBreathing : startBreathing}
              className={`px-8 py-3 rounded-lg font-medium transition-all ${
                isBreathing
                  ? 'bg-red-500 hover:bg-red-600 text-white'
                  : 'bg-gradient-to-r from-accentLavender to-accentTeal hover:shadow-lg text-white'
              }`}
            >
              {isBreathing ? 'Stop' : 'Start Breathing'}
            </button>
          </div>
        </div>
      </section>

      {/* Quick Techniques */}
      <section className="bg-white p-6 rounded-2xl shadow-md">
        <h2 className="text-2xl font-bold mb-6">Quick Calming Techniques</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-4 border rounded-lg hover:shadow-md transition-shadow">
            <h3 className="font-semibold mb-2">🌊 Progressive Relaxation</h3>
            <p className="text-gray-600 text-sm mb-3">
              Tense and release each muscle group, starting from your toes and working up to your head.
            </p>
            <p className="text-xs text-gray-500">5-10 minutes</p>
          </div>
          
          <div className="p-4 border rounded-lg hover:shadow-md transition-shadow">
            <h3 className="font-semibold mb-2">🎯 5-4-3-2-1 Grounding</h3>
            <p className="text-gray-600 text-sm mb-3">
              Name 5 things you see, 4 you can touch, 3 you hear, 2 you smell, and 1 you taste.
            </p>
            <p className="text-xs text-gray-500">2-3 minutes</p>
          </div>
          
          <div className="p-4 border rounded-lg hover:shadow-md transition-shadow">
            <h3 className="font-semibold mb-2">🤲 Gentle Self-Massage</h3>
            <p className="text-gray-600 text-sm mb-3">
              Massage your temples, shoulders, or hands with slow, circular motions.
            </p>
            <p className="text-xs text-gray-500">3-5 minutes</p>
          </div>
          
          <div className="p-4 border rounded-lg hover:shadow-md transition-shadow">
            <h3 className="font-semibold mb-2">🧘 Mindful Observation</h3>
            <p className="text-gray-600 text-sm mb-3">
              Focus completely on one object near you. Notice its color, texture, and details.
            </p>
            <p className="text-xs text-gray-500">1-2 minutes</p>
          </div>
        </div>
      </section>

      {/* Affirmations */}
      <section className="bg-white p-6 rounded-2xl shadow-md">
        <h2 className="text-2xl font-bold mb-4">Gentle Reminders</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            "This feeling will pass, just like clouds in the sky.",
            "I am safe in this moment, right here, right now.",
            "My worries don't define me; they're just visitors.",
            "I can handle whatever comes my way.",
            "It's okay to not be okay sometimes.",
            "I am worthy of peace and calm."
          ].map((affirmation, index) => (
            <div key={index} className="p-4 bg-gray-50 rounded-lg">
              <p className="text-gray-700 italic">&quot;{affirmation}&quot;</p>
            </div>
          ))}
        </div>
      </section>

      {/* Emergency Resources */}
      <section className="bg-white p-6 rounded-2xl shadow-md border-l-4 border-red-400">
        <h2 className="text-xl font-bold mb-4 text-red-800">Need Immediate Support?</h2>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between items-center">
            <span className="font-medium">Crisis Text Line:</span>
            <span className="text-blue-600">Text HOME to 741741</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="font-medium">National Suicide Prevention Lifeline:</span>
            <span className="text-blue-600">988</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="font-medium">Emergency Services:</span>
            <span className="text-red-600">911</span>
          </div>
        </div>
      </section>
    </div>
  );
}
