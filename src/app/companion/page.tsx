'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function Companion() {
  const [selectedGuide, setSelectedGuide] = useState<string | null>(null);

  const guides = {
    'worry-input': {
      title: 'How to Add Worries',
      content: `
        Adding worries to Ease is like placing them in a safe container where they can be acknowledged and processed:

        1. **Give your worry a name** - Keep it simple and specific
        2. **Share why it matters** - Express what's really at stake for you
        3. **Choose a life area** - This helps you see patterns over time
        4. **Notice body responses** - Awareness of physical symptoms helps you recognize worry patterns

        Remember: Adding a worry doesn't make it bigger - it makes it manageable.
      `
    },
    'breathing': {
      title: 'Breathing Exercises',
      content: `
        The 4-4-6-2 breathing pattern is designed to activate your body's relaxation response:

        • **Inhale for 4 counts** - Breathe slowly through your nose
        • **Hold for 4 counts** - Let the breath settle in your body
        • **Exhale for 6 counts** - Release slowly through your mouth
        • **Pause for 2 counts** - Rest before the next breath

        This pattern helps shift your nervous system from anxiety to calm.
      `
    },
    'releasing': {
      title: 'Releasing Worries',
      content: `
        Releasing a worry doesn't mean ignoring it. It means you've processed it enough for now:

        • **Acknowledge the worry** - "I see you, worry about..."
        • **Thank it for protecting you** - Worries often come from care
        • **Set it free gently** - Like releasing a butterfly
        • **Trust the process** - You can always revisit if needed

        Releasing is an act of self-compassion, not avoidance.
      `
    },
    'patterns': {
      title: 'Understanding Your Patterns',
      content: `
        Your Easeboard shows patterns to help you understand your worry habits:

        • **Categories** - Which areas of life trigger worry most?
        • **Body responses** - How does your body signal worry?
        • **Timing** - When do worries tend to appear?
        • **Release rate** - How often do you let worries go?

        Patterns aren't judgments - they're information to help you care for yourself better.
      `
    }
  };

  const quickTips = [
    {
      icon: '🌱',
      title: 'Start Small',
      tip: 'Begin with one worry at a time. You don\'t need to solve everything today.'
    },
    {
      icon: '⏰',
      title: 'Set Worry Time',
      tip: 'Designate 10-15 minutes daily for processing worries, then let them rest.'
    },
    {
      icon: '🤝',
      title: 'Be Gentle',
      tip: 'Treat your worries (and yourself) with the kindness you\'d show a good friend.'
    },
    {
      icon: '🔄',
      title: 'Practice Regularly',
      tip: 'Like any skill, worry management gets easier with consistent practice.'
    }
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <section className="bg-white p-8 rounded-2xl shadow-md text-center">
          <h1 className="text-3xl font-bold mb-4">Your Compassionate Companion</h1>
          <p className="text-gray-600 text-lg mb-6">
            Gentle guidance for your journey with worry and peace
          </p>
          <div className="w-20 h-20 mx-auto bg-gradient-to-r from-accentLavender to-accentTeal rounded-full flex items-center justify-center">
            <span className="text-white text-3xl">🤗</span>
          </div>
        </section>

        {/* Quick Tips */}
        <section className="bg-white p-6 rounded-2xl shadow-md">
          <h2 className="text-2xl font-bold mb-6">Quick Tips for Today</h2>
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
          <h2 className="text-2xl font-bold mb-6">Guided Help</h2>
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
                  {selectedGuide === key ? 'Click to collapse' : 'Click for detailed guidance'}
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
          <h2 className="text-2xl font-bold mb-4">Gentle Reminders</h2>
          <div className="space-y-3">
            {[
              "Your feelings are valid and deserving of care.",
              "You don't have to carry all your worries alone.",
              "Taking time for peace isn't selfish—it's necessary.",
              "Every small step toward calm is meaningful.",
              "You are more resilient than your worries."
            ].map((reminder, index) => (
              <div key={index} className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border-l-4 border-accentLavender">
                <p className="text-gray-700 italic">💙 {reminder}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Getting Started */}
        <section className="bg-white p-6 rounded-2xl shadow-md">
          <h2 className="text-2xl font-bold mb-4">New Here? Start Your Journey</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="w-12 h-12 mx-auto bg-blue-100 rounded-full flex items-center justify-center mb-3">
                <span className="text-blue-600 font-bold">1</span>
              </div>
              <h3 className="font-semibold mb-2">Add Your First Worry</h3>
              <p className="text-sm text-gray-600 mb-3">Start by gently placing one concern into your worry jar.</p>
              <Link href="/add-worry" className="inline-block px-4 py-2 bg-blue-500 text-white rounded-lg text-sm hover:shadow-md transition-shadow">
                Add Worry
              </Link>
            </div>
            
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="w-12 h-12 mx-auto bg-green-100 rounded-full flex items-center justify-center mb-3">
                <span className="text-green-600 font-bold">2</span>
              </div>
              <h3 className="font-semibold mb-2">Find Your Calm</h3>
              <p className="text-sm text-gray-600 mb-3">Try a breathing exercise or gentle technique.</p>
              <Link href="/calm-corner" className="inline-block px-4 py-2 bg-green-500 text-white rounded-lg text-sm hover:shadow-md transition-shadow">
                Calm Corner
              </Link>
            </div>
            
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="w-12 h-12 mx-auto bg-purple-100 rounded-full flex items-center justify-center mb-3">
                <span className="text-purple-600 font-bold">3</span>
              </div>
              <h3 className="font-semibold mb-2">Track Your Progress</h3>
              <p className="text-sm text-gray-600 mb-3">See your patterns and celebrate your growth.</p>
              <Link href="/easeboard" className="inline-block px-4 py-2 bg-purple-500 text-white rounded-lg text-sm hover:shadow-md transition-shadow">
                Easeboard
              </Link>
            </div>
          </div>
        </section>
  </div>
  );
}
