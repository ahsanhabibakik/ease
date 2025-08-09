'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import useWorryStore from '@/stores/worryStore';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/Button';
import { Card, CardBody, CardHeader, CardTitle } from '@/components/ui/Card';
import { useTranslation } from '@/lib/intl';

export default function AddWorry() {
  const router = useRouter();
  const addWorry = useWorryStore((state) => state.addWorry);
  const { data: session } = useSession();
  const { t } = useTranslation();
  
  const BASE_CATEGORY_PRESETS = [
    t('addWorry.categories.school'),
    t('addWorry.categories.work'),
    t('addWorry.categories.family'),
    t('addWorry.categories.finance'),
    t('addWorry.categories.politics'),
    t('addWorry.categories.health'),
    t('addWorry.categories.relationships'),
    t('addWorry.categories.other')
  ];
  const [customCategories, setCustomCategories] = useState<string[]>([]);
  const BODY_RESPONSES = [
    t('addWorry.bodyResponses.sweatyPalms'),
    t('addWorry.bodyResponses.racingHeartbeat'),
    t('addWorry.bodyResponses.jawTightness'),
    t('addWorry.bodyResponses.restlessLegs'),
    t('addWorry.bodyResponses.stomachKnots'),
    t('addWorry.bodyResponses.shoulderTension'),
    t('addWorry.bodyResponses.chestTightness'),
    t('addWorry.bodyResponses.shallowBreath'),
    t('addWorry.bodyResponses.headPressure'),
    t('addWorry.bodyResponses.other')
  ];
  const DRAFT_KEY = 'ease-add-worry-draft-v1';

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: t('addWorry.categories.work'),
    customCategory: '',
    bodyResponses: [] as string[],
    intensity: 5,
  });
  const [suggestIndex, setSuggestIndex] = useState(0);
  const nameSuggestions = [
    t('addWorry.suggestions.jobInterview'),
    t('addWorry.suggestions.meetingTomorrow'),
    t('addWorry.suggestions.conversation'),
    t('addWorry.suggestions.moneyUncertainty'),
    t('addWorry.suggestions.healthTests'),
    t('addWorry.suggestions.presentation')
  ];

  // Load draft
  useEffect(() => {
    try {
      const raw = localStorage.getItem(DRAFT_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        setFormData({ ...formData, ...parsed });
      }
  } catch {}
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Autosave draft
  useEffect(() => {
    const id = setTimeout(() => {
  try { localStorage.setItem(DRAFT_KEY, JSON.stringify(formData)); } catch {}
    }, 500);
    return () => clearTimeout(id);
  }, [formData]);

  // Rotate placeholder suggestion
  useEffect(() => {
    const rot = setInterval(() => setSuggestIndex(i => (i + 1) % nameSuggestions.length), 4000);
    return () => clearInterval(rot);
  }, [nameSuggestions.length]);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  // Load custom categories from user settings if signed in
  useEffect(() => {
    let ignore = false;
    async function loadSettings() {
      if (!session?.user?.id) return;
      try {
        const res = await fetch('/api/user/settings');
        if (!res.ok) return;
        const data = await res.json();
        if (!ignore && data.settings?.customCategories) {
          setCustomCategories(data.settings.customCategories);
        }
      } catch {}
    }
    loadSettings();
    return () => { ignore = true; };
  }, [session?.user?.id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.description.trim()) {
      alert(t('addWorry.validation.required'));
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const chosenCategory = formData.category === 'Custom' && formData.customCategory.trim()
        ? formData.customCategory.trim()
        : formData.category;
      const payload = {
        title: formData.name.trim(),
        description: formData.description.trim(),
        category: chosenCategory,
        bodyFeeling: formData.bodyResponses.join(', '),
        intensity: formData.intensity,
      };

      if (session?.user?.id) {
        // Attempt server persistence
        const res = await fetch('/api/worries', {
          method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error('Failed to save worry');
      } else {
        // Fallback to local store if not signed in
        addWorry({
          name: payload.title,
          description: payload.description || '',
          category: payload.category,
          bodyResponses: formData.bodyResponses,
        });
      }

  setFormData({ name: '', description: '', category: t('addWorry.categories.work'), customCategory: '', bodyResponses: [], intensity: 5 });
  try { localStorage.removeItem(DRAFT_KEY); } catch {}
      router.push('/worry-reflection');
    } catch (error) {
      console.error('Error adding worry:', error);
      alert(t('addWorry.errors.saveFailed'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleBodyResponse = useCallback((resp: string) => {
    setFormData(prev => ({
      ...prev,
      bodyResponses: prev.bodyResponses.includes(resp)
        ? prev.bodyResponses.filter(r => r !== resp)
        : [...prev.bodyResponses, resp]
    }));
  }, []);

  const placeholder = nameSuggestions[suggestIndex];

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="h2 mb-1">{t('addWorry.title')}</CardTitle>
          <p className="text-soft text-sm">{t('addWorry.subtitle')}</p>
          {!session && (
            <p className="mt-3 text-xs rounded-md border border-[var(--c-warn)]/40 bg-[var(--c-warn)]/10 text-[var(--c-warn)] px-3 py-2">{t('addWorry.signInTip.message')}</p>
          )}
        </CardHeader>
        <CardBody>
          <form onSubmit={handleSubmit} className="form-gap">
            <div className="form-gap">
              <div>
                <label htmlFor="worry-name" className="block mb-1 font-medium text-[var(--c-text)]">{t('addWorry.form.nameLabel')}</label>
                <input
                  id="worry-name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder={t('addWorry.form.namePlaceholder', { example: placeholder })}
                  className="field-input"
                  required
                />
              </div>
              <div>
                <label htmlFor="worry-description" className="block mb-1 font-medium text-[var(--c-text)]">{t('addWorry.form.descriptionLabel')}</label>
                <textarea
                  id="worry-description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder={t('addWorry.form.descriptionPlaceholder')}
                  className="field-input min-h-[110px] resize-vertical"
                  required
                />
              </div>
            </div>
            <div className="section-gap">
              <div>
                <label className="block mb-2 font-medium text-[var(--c-text)]">{t('addWorry.form.categoryLabel')}</label>
                <div className="flex flex-wrap gap-2">
                  {BASE_CATEGORY_PRESETS.concat(customCategories).filter((v,i,a)=>a.indexOf(v)===i).concat('Custom').map(cat => {
                    const active = formData.category === cat;
                    return (
                      <button
                        type="button"
                        key={cat}
                        onClick={() => setFormData(prev => ({ ...prev, category: cat }))}
                        className={`chip ${active ? 'chip-active' : ''}`}
                      >{cat}</button>
                    );
                  })}
                </div>
                {formData.category === 'Custom' && (
                  <input
                    type="text"
                    value={formData.customCategory}
                    onChange={e => setFormData(prev => ({ ...prev, customCategory: e.target.value }))}
                    placeholder={t('addWorry.form.customCategoryPlaceholder')}
                    className="field-input mt-2"
                  />
                )}
              </div>
              <div>
                <label className="block mb-2 font-medium text-[var(--c-text)]">{t('addWorry.form.bodyLabel')}</label>
                <div className="flex flex-wrap gap-2">
                  {BODY_RESPONSES.map(resp => {
                    const active = formData.bodyResponses.includes(resp);
                    return (
                      <button
                        type="button"
                        key={resp}
                        onClick={() => toggleBodyResponse(resp)}
                        className={`chip ${active ? 'chip-active' : ''}`}
                      >{resp}</button>
                    );
                  })}
                </div>
              </div>
            </div>
            <div>
              <label htmlFor="intensity-slider" className="block mb-2 font-medium text-[var(--c-text)]">
                {t('addWorry.form.intensityLabel')} ({formData.intensity}/10)
              </label>
              <input
                id="intensity-slider"
                type="range"
                min={1}
                max={10}
                value={formData.intensity}
                onChange={e => setFormData(prev => ({ ...prev, intensity: Number(e.target.value) }))}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-[var(--c-text-soft)] mt-1">
                <span>{t('addWorry.intensity.calm')}</span>
                <span>{t('addWorry.intensity.moderate')}</span>
                <span>{t('addWorry.intensity.intense')}</span>
              </div>
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn btn-primary w-full"
            >
              {isSubmitting ? t('addWorry.form.submitting') : t('addWorry.form.submit')}
            </button>
          </form>
        </CardBody>
      </Card>
    </div>
  );
}