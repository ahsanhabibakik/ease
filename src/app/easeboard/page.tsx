'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import useWorryStore from '@/stores/worryStore';
import { useTranslation } from '@/lib/intl';

export default function EaseboardPage() {
  const { t } = useTranslation();
  const { worries, getActiveWorries, getReleasedWorries } = useWorryStore();
  const [stats, setStats] = useState({
    totalWorries: 0,
    activeWorries: 0,
    releasedWorries: 0,
    topCategory: '',
    topBodyResponse: '',
  });

  const quickInsights = [
    t('easeboard.quickInsights.weighing'),
    t('easeboard.quickInsights.feltMost'),
    t('easeboard.quickInsights.calmMoments'),
    t('easeboard.quickInsights.worryTime')
  ];

  useEffect(() => {
    const active = getActiveWorries();
    const released = getReleasedWorries();
    const total = worries;

    // Calculate category frequency
    const categoryCount: Record<string, number> = {};
    total.forEach(worry => {
      categoryCount[worry.category] = (categoryCount[worry.category] || 0) + 1;
    });
    const topCategory = Object.entries(categoryCount).sort(([,a], [,b]) => b - a)[0]?.[0] || 'None';

    // Calculate body response frequency
    const bodyResponseCount: Record<string, number> = {};
    total.forEach(worry => {
      worry.bodyResponses.forEach(response => {
        bodyResponseCount[response] = (bodyResponseCount[response] || 0) + 1;
      });
    });
    const topBodyResponse = Object.entries(bodyResponseCount).sort(([,a], [,b]) => b - a)[0]?.[0] || 'None';

    setStats({
      totalWorries: total.length,
      activeWorries: active.length,
      releasedWorries: released.length,
      topCategory,
      topBodyResponse,
    });
  }, [worries, getActiveWorries, getReleasedWorries]);

  const getWorryTrend = () => {
    if (stats.totalWorries === 0) return t('easeboard.trends.noData');
    const releaseRate = (stats.releasedWorries / stats.totalWorries) * 100;
    if (releaseRate > 70) return t('easeboard.trends.great');
    if (releaseRate > 40) return t('easeboard.trends.making');
    return t('easeboard.trends.building');
  };

  const getRecentActivity = () => {
    const recent = [...worries]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5);
    
    return recent;
  };

  return (
    <div className="space-y-10 max-w-7xl mx-auto">
      <div className="max-w-6xl mx-auto space-y-6">
          <section className="bg-white p-6 rounded-2xl shadow-md">
            <h1 className="text-3xl font-bold mb-6">{t('easeboard.title')}</h1>
            
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-lg">
                <h3 className="font-semibold text-blue-800">{t('easeboard.stats.totalWorries')}</h3>
                <p className="text-2xl font-bold text-blue-900">{stats.totalWorries}</p>
              </div>
              <div className="bg-gradient-to-r from-orange-50 to-orange-100 p-4 rounded-lg">
                <h3 className="font-semibold text-orange-800">{t('easeboard.stats.activeNow')}</h3>
                <p className="text-2xl font-bold text-orange-900">{stats.activeWorries}</p>
              </div>
              <div className="bg-gradient-to-r from-green-50 to-green-100 p-4 rounded-lg">
                <h3 className="font-semibold text-green-800">{t('easeboard.stats.released')}</h3>
                <p className="text-2xl font-bold text-green-900">{stats.releasedWorries}</p>
              </div>
              <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-4 rounded-lg">
                <h3 className="font-semibold text-purple-800">{t('easeboard.stats.progress')}</h3>
                <p className="text-sm font-medium text-purple-900">{getWorryTrend()}</p>
              </div>
            </div>
            
            {/* Quick Insights */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {quickInsights.map((insight, index) => (
                <div key={index} className="bg-gray-50 p-4 rounded-lg text-center">
                  <h4 className="font-medium text-gray-700 mb-2">{insight}</h4>
                  <div className="w-8 h-8 bg-gray-200 rounded-full mx-auto flex items-center justify-center">
                    <span className="text-xs">📊</span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Patterns Section */}
            <section className="bg-white p-6 rounded-2xl shadow-md">
              <h2 className="font-semibold text-xl mb-4">{t('easeboard.patterns.title')}</h2>
              
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium text-gray-700 mb-2">{t('easeboard.patterns.commonCategory')}</h3>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <span className="font-semibold">{stats.topCategory}</span>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-medium text-gray-700 mb-2">{t('easeboard.patterns.commonBodyResponse')}</h3>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <span className="font-semibold">{stats.topBodyResponse}</span>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-medium text-gray-700 mb-2">{t('easeboard.patterns.releaseRate')}</h3>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <div className="flex items-center justify-between">
                      <span>
                        {stats.totalWorries > 0 
                          ? Math.round((stats.releasedWorries / stats.totalWorries) * 100) 
                          : 0}% {t('easeboard.patterns.released')}
                      </span>
                      <div className="w-20 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-accentLavender to-accentTeal h-2 rounded-full transition-all"
                          style={{
                            width: `${stats.totalWorries > 0 
                              ? Math.round((stats.releasedWorries / stats.totalWorries) * 100) 
                              : 0}%`
                          }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Recent Activity */}
            <section className="bg-white p-6 rounded-2xl shadow-md">
              <h2 className="font-semibold text-xl mb-4">{t('easeboard.activity.title')}</h2>
              
              {getRecentActivity().length > 0 ? (
                <div className="space-y-3">
                  {getRecentActivity().map((worry) => (
                    <div key={worry.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                      <div className="flex-1">
                        <p className="font-medium text-sm">{worry.name}</p>
                        <p className="text-xs text-gray-500">
                          {worry.category} • {new Date(worry.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        worry.isReleased 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-orange-100 text-orange-800'
                      }`}>
                        {worry.isReleased ? t('easeboard.activity.released') : t('easeboard.activity.active')}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500 mb-4">{t('easeboard.activity.noActivity')}</p>
                  <Link 
                    href="/add-worry" 
                    className="inline-block px-4 py-2 bg-gradient-to-r from-accentLavender to-accentTeal text-white rounded-lg text-sm"
                  >
                    {t('easeboard.activity.addFirst')}
                  </Link>
                </div>
              )}
            </section>
          </div>

          {/* How I've Been Feeling Chart Placeholder */}
          <section className="bg-white p-6 rounded-2xl shadow-md">
            <h2 className="font-semibold mb-2">{t('easeboard.mood.title')}</h2>
            <div className="h-32 flex items-center justify-center text-gray-400 bg-gray-50 rounded-lg">
              <div className="text-center">
                <p className="mb-2">📊</p>
                <p className="text-sm">{t('easeboard.mood.comingSoon')}</p>
              </div>
            </div>
          </section>
  </div>
    </div>
  );
}
