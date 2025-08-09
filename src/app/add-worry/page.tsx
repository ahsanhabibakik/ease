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
  
  const BASE_CATEGORY_PRESETS = [t('addWorry.categories.school'), t('addWorry.categories.work'), t('addWorry.categories.family'), t('addWorry.categories.finance'), t('addWorry.categories.politics'), t('addWorry.categories.health'), t('addWorry.categories.relationships'), t('addWorry.categories.other')];
  const [customCategories, setCustomCategories] = useState<string[]>([]);
  const BODY_RESPONSES = [
    t('addWorry.bodyResponses.sweatyPalms'), t('addWorry.bodyResponses.racingHeartbeat'), t('addWorry.bodyResponses.jawTightness'), t('addWorry.bodyResponses.restlessLegs'), t('addWorry.bodyResponses.stomachKnots'), t('addWorry.bodyResponses.shoulderTension'), t('addWorry.bodyResponses.chestTightness'), t('addWorry.bodyResponses.shallowBreath'), t('addWorry.bodyResponses.headPressure'), t('addWorry.bodyResponses.other')
  ];
  const DRAFT_KEY = 'ease-add-worry-draft-v1';

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'Work',
    customCategory: '',
    bodyResponses: [] as string[],
    intensity: 5,
  });
  const [suggestIndex, setSuggestIndex] = useState(0);
  const nameSuggestions = [
    t('addWorry.suggestions.jobInterview'), t('addWorry.suggestions.meetingTomorrow'), t('addWorry.suggestions.conversation'), t('addWorry.suggestions.moneyUncertainty'), t('addWorry.suggestions.healthTests'), t('addWorry.suggestions.presentation')
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

  setFormData({ name: '', description: '', category: 'Work', customCategory: '', bodyResponses: [], intensity: 5 });
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
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header Section */}
      <div className="text-center space-y-4">
        <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-r from-[var(--c-accent)] to-[var(--c-accent-alt)] flex items-center justify-center shadow-lg">
          <span className="text-2xl">🤗</span>
        </div>
        <div>
          <h1 className="h2 mb-2 bg-gradient-to-r from-[var(--c-text)] to-[var(--c-text-soft)] bg-clip-text text-transparent">{t('addWorry.title')}</h1>
          <p className="text-soft text-base max-w-2xl mx-auto">{t('addWorry.subtitle')}</p>
        </div>
      </div>
      
      {/* Warning for unsigned users */}
      {!session && (
        <div className="bg-gradient-to-r from-[var(--c-warn)]/10 to-[var(--c-accent)]/10 border border-[var(--c-warn)]/30 rounded-xl p-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <span className="text-lg">💡</span>
            <span className="text-sm font-medium text-[var(--c-text)]">{t('addWorry.signInTip.title')}</span>
          </div>
          <p className="text-xs text-[var(--c-text-soft)]">{t('addWorry.signInTip.message')}</p>
        </div>
      )}
      
      <Card className="card-elevated">
        <CardHeader className="pb-4">
        <CardBody>
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Core Worry Input */}
            <div className="space-y-6">
              <div className="space-y-3">
                <label htmlFor="worry-name" className="flex items-center gap-2 text-base font-semibold text-[var(--c-text)]">
                  <span className="text-lg">🏷️</span>
                  {t('addWorry.form.nameLabel')}
                </label>
                <input
                  id="worry-name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder={t('addWorry.form.namePlaceholder', { example: placeholder })}
                  className="field-input text-base py-4 rounded-xl border-2 focus:border-[var(--c-accent)] transition-all duration-200"
                  required
                />
                <p className="text-xs text-[var(--c-text-faint)] ml-1">{t('addWorry.form.nameHelp')}</p>
              </div>
              
              <div className="space-y-3">
                <label htmlFor="worry-description" className="flex items-center gap-2 text-base font-semibold text-[var(--c-text)]">
                  <span className="text-lg">💭</span>
                  {t('addWorry.form.descriptionLabel')}
                </label>
                <textarea
                  id="worry-description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder={t('addWorry.form.descriptionPlaceholder')}
                  className="field-input min-h-[120px] resize-vertical text-base py-4 rounded-xl border-2 focus:border-[var(--c-accent)] transition-all duration-200"
                  required
                />
                <p className="text-xs text-[var(--c-text-faint)] ml-1">{t('addWorry.form.descriptionHelp')}</p>
              </div>
            </div>
            {/* Life Area Selection */}
            <div className="space-y-4">
              <div className="space-y-3">
                <label className="flex items-center gap-2 text-base font-semibold text-[var(--c-text)]">
                  <span className="text-lg">🌍</span>
                  {t('addWorry.form.categoryLabel')}
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                  {BASE_CATEGORY_PRESETS.concat(customCategories).filter((v,i,a)=>a.indexOf(v)===i).concat('Custom').map(cat => {
                    const active = formData.category === cat;
                    return (
                      <button
                        type="button"
                        key={cat}
                        onClick={() => setFormData(prev => ({ ...prev, category: cat }))}
                        className={`chip py-3 px-4 text-sm font-medium rounded-xl border-2 transition-all duration-200 ${active ? 'bg-[var(--c-accent)] text-white border-[var(--c-accent)] shadow-md scale-105' : 'bg-[var(--c-surface)] border-[var(--c-border)] hover:border-[var(--c-accent)]/50 hover:scale-105'}`}
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
                    className="field-input mt-3 rounded-xl border-2 focus:border-[var(--c-accent)]"
                  />
                )}
                <p className="text-xs text-[var(--c-text-faint)] ml-1">{t('addWorry.form.categoryHelp')}</p>
              </div>
              {/* Body Response Selection */}
              <div className="space-y-3">
                <label className="flex items-center gap-2 text-base font-semibold text-[var(--c-text)]">
                  <span className="text-lg">💗</span>
                  {t('addWorry.form.bodyLabel')}
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {BODY_RESPONSES.map(resp => {
                    const active = formData.bodyResponses.includes(resp);
                    return (
                      <button
                        type="button"
                        key={resp}
                        onClick={() => toggleBodyResponse(resp)}
                        className={`flex items-center justify-between py-3 px-4 text-sm rounded-xl border-2 transition-all duration-200 ${active ? 'bg-[var(--c-accent)]/10 border-[var(--c-accent)] text-[var(--c-accent)] shadow-sm' : 'bg-[var(--c-surface)] border-[var(--c-border)] hover:border-[var(--c-accent)]/50'}`}
                      >
                        <span className="text-left">{resp}</span>
                        <span className={`text-base transition-all ${active ? 'scale-110 text-[var(--c-accent)]' : 'text-transparent'}`}>✓</span>
                      </button>
                    );
                  })}
                </div>
                <p className="text-xs text-[var(--c-text-faint)] ml-1">{t('addWorry.form.bodyHelp')}</p>
              </div>
            </div>
            {/* Intensity Slider */}
            <div className="space-y-4 bg-[var(--c-surface-alt)] rounded-2xl p-6">
              <div className="space-y-3">
                <label htmlFor="intensity-slider" className="flex items-center gap-2 text-base font-semibold text-[var(--c-text)]">
                  <span className="text-lg">🌡️</span>
                  {t('addWorry.form.intensityLabel')}
                </label>
                <div className="space-y-4">
                  <div className="text-center">
                    <span className="text-3xl font-bold text-[var(--c-accent)] bg-[var(--c-accent)]/10 px-4 py-2 rounded-xl">{formData.intensity}/10</span>
                  </div>
                  <input
                    id="intensity-slider"
                    type="range"
                    min={1}
                    max={10}
                    value={formData.intensity}
                    onChange={e => setFormData(prev => ({ ...prev, intensity: Number(e.target.value) }))}
                    className="w-full h-3 bg-[var(--c-border)] rounded-full appearance-none cursor-pointer slider-thumb"
                  />
                  <div className="flex justify-between text-xs text-[var(--c-text-faint)]">
                    <span className="flex items-center gap-1"><span>🌱</span> {t('addWorry.intensity.calm')}</span>
                    <span className="flex items-center gap-1"><span>⚖️</span> {t('addWorry.intensity.moderate')}</span>
                    <span className="flex items-center gap-1"><span>🌋</span> {t('addWorry.intensity.intense')}</span>
                  </div>
                  <p className="text-xs text-[var(--c-text-faint)] text-center">{t('addWorry.form.intensityHelp')}</p>
                </div>
              </div>
            </div>
            {/* Submit Section */}
            <div className="space-y-4">
              <div className="bg-gradient-to-r from-[var(--c-accent)]/5 to-[var(--c-accent-alt)]/5 rounded-2xl p-6 text-center">
                <div className="space-y-4">
                  <div className="text-2xl">🤗</div>
                  <p className="text-sm text-[var(--c-text-soft)] max-w-md mx-auto">
                    {t('addWorry.encouragement')}
                  </p>
                </div>
              </div>
              
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full py-4 px-6 rounded-2xl text-base font-semibold transition-all duration-300 ${
                  isSubmitting 
                    ? 'bg-[var(--c-border)] text-[var(--c-text-soft)] cursor-not-allowed' 
                    : 'bg-gradient-to-r from-[var(--c-accent)] to-[var(--c-accent-alt)] text-white hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]'
                }`}
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="animate-spin">⚙️</span>
                    {t('addWorry.form.submitting')}
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <span>🫙</span>
                    {t('addWorry.form.submit')}
                  </span>
                )}
              </button>
              
              <div className="text-center space-y-2">
                <Link href="/companion#worry-input" className="inline-flex items-center gap-1 text-sm text-[var(--c-accent)] hover:text-[var(--c-accent-alt)] transition-colors">
                  <span>💡</span>
                  {t('addWorry.learnMore')}
                </Link>
                <p className="text-xs text-[var(--c-text-faint)]">{t('addWorry.processLater')}</p>
              </div>
            </div>
          </form>
        </CardBody>
      </Card>
    </div>
  );
}
