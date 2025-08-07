'use client'

import Link from 'next/link';
import Layout from '@/components/Layout';

export default function Home() {
  return (
    <Layout>
      <section className="text-center py-16">
        <div className="inline-flex items-center bg-white p-6 rounded-2xl shadow-lg">
          <div className="text-5xl mr-4 text-primary">💚</div>
          <div>
            <h1 className="text-3xl font-bold">Ease Your Mind</h1>
            <p className="mt-2 text-gray-600">Ease is your kind friend, here to help you feel lighter and find calm in just three easy steps.</p>
          </div>
          <Link href="/add-worry" className="ml-6 px-6 py-3 bg-gradient-to-r from-accentLavender to-accentTeal text-white rounded-full shadow-lg">
            Take Action!
          </Link>
        </div>
      </section>
      <section className="space-y-8">
        <h2 className="text-2xl font-semibold text-center">How Ease Works</h2>
        <p className="text-center text-gray-600">Three simple steps to find your calm and ease your worries</p>
        <div className="space-y-6">
          {[
            { num: 1, title: 'Write Down Your Worries', desc: 'Type in what’s on your mind to lighten your load.' },
            { num: 2, title: 'Set a Time to Reflect', desc: 'Pick a daily worry slot (default 5 PM).' },
            { num: 3, title: 'Track Your Progress', desc: 'Watch how your worries and calm moments change over time.' }
          ].map((step) => (
            <div key={step.num} className="bg-white p-6 rounded-xl shadow-md">
              <div className="flex items-center">
                <div className="w-8 h-8 flex-shrink-0 flex items-center justify-center bg-primary text-white rounded-full mr-4">{step.num}</div>
                <div>
                  <h3 className="text-lg font-bold">{step.title}</h3>
                  <p className="text-gray-600">{step.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
      <section className="mt-12 grid grid-cols-1 sm:grid-cols-2 gap-6">
        <Link href="/calm-corner" className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg">
          <h4 className="font-semibold">Feeling overwhelmed?</h4>
          <p className="mt-1 text-gray-600">Calm Corner</p>
        </Link>
        <Link href="/companion" className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg">
          <h4 className="font-semibold">Want to learn more?</h4>
          <p className="mt-1 text-gray-600">Ease Companion</p>
        </Link>
      </section>
    </Layout>
  );
}
