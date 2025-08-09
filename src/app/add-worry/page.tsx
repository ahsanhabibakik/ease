'use client';

import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import useWorryStore from '@/stores/worryStore';
import { useSession } from 'next-auth/react';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';

export default function AddWorry() {
  const router = useRouter();
  const addWorry = useWorryStore((state) => state.addWorry);
  const { data: session } = useSession();
  
  const BASE_CATEGORY_PRESETS = ['School','Work','Family','Finance','Politics','Health','Relationships','Other'];
  const [customCategories, setCustomCategories] = useState<string[]>([]);
  const BODY_RESPONSES = [
    'Sweaty palms','Racing heartbeat','Jaw tightness','Restless legs','Stomach knots','Shoulder tension','Chest tightness','Shallow breath','Head pressure','Other'
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
    'Job interview nerves','That meeting tomorrow','Conversation I keep replaying','Money uncertainty','Health test results','Upcoming presentation'
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
      toast.error('Please fill in both the worry name and description.');
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
  toast.success('Worry captured');
  router.push('/worry-reflection');
    } catch (error) {
      console.error('Error adding worry:', error);
  toast.error('Could not save to cloud. Stored locally if possible.');
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
          <h1 className="h2 mb-2 bg-gradient-to-r from-[var(--c-text)] to-[var(--c-text-soft)] bg-clip-text text-transparent">What&apos;s Weighing on Your Heart?</h1>
          <p className="text-soft text-base max-w-2xl mx-auto">Give your worry a safe place to rest. Externalizing your thoughts helps you see them more clearly and process them with compassion.</p>
        </div>
      </div>
      
      {/* Warning for unsigned users */}
      {!session && (
        <div className="bg-gradient-to-r from-[var(--c-warn)]/10 to-[var(--c-accent)]/10 border border-[var(--c-warn)]/30 rounded-xl p-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <span className="text-lg">💡</span>
            <span className="text-sm font-medium text-[var(--c-text)]">Quick tip</span>
          </div>
          <p className="text-xs text-[var(--c-text-soft)]">Sign in to sync your worries across devices and never lose your progress.</p>
        </div>
      )}
      
      <Card className="card-elevated">
        <CardHeader className="pb-4" />
        <CardBody>
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Core Worry Input */}
            <div className="space-y-6">
              <div className="space-y-3">
                <label htmlFor="worry-name" className="flex items-center gap-2 text-base font-semibold text-[var(--c-text)]">
                  <span className="text-lg">🏷️</span>
                  Give your worry a name
                </label>
                <input
                  id="worry-name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder={`e.g., ${placeholder}`}
                  className="field-input text-base py-4 rounded-xl border-2 focus:border-[var(--c-accent)] transition-all duration-200"
                  required
                />
                <p className="text-xs text-[var(--c-text-faint)] ml-1">Keep it simple and specific - this helps you recognize the worry later</p>
              </div>
              
              <div className="space-y-3">
                <label htmlFor="worry-description" className="flex items-center gap-2 text-base font-semibold text-[var(--c-text)]">
                  <span className="text-lg">💭</span>
                  Tell your worry story
                </label>
                <textarea
                  id="worry-description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Share what&apos;s on your heart... Why does this worry matter to you right now?"
                  className="field-input min-h-[120px] resize-vertical text-base py-4 rounded-xl border-2 focus:border-[var(--c-accent)] transition-all duration-200"
                  required
                />
                <p className="text-xs text-[var(--c-text-faint)] ml-1">Express what&apos;s really at stake for you - there&apos;s no wrong way to share</p>
              </div>
            </div>
            {/* Life Area Selection */}
            <div className="space-y-4">
              <div className="space-y-3">
                <label className="flex items-center gap-2 text-base font-semibold text-[var(--c-text)]">
                  <span className="text-lg">🌍</span>
                  Where does this belong in your life?
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
                    placeholder="Enter custom area (e.g., Creativity, Parenting)"
                    className="field-input mt-3 rounded-xl border-2 focus:border-[var(--c-accent)]"
                  />
                )}
                <p className="text-xs text-[var(--c-text-faint)] ml-1">Categorizing helps you spot patterns over time</p>
              </div>
              {/* Body Response Selection */}
              <div className="space-y-3">
                <label className="flex items-center gap-2 text-base font-semibold text-[var(--c-text)]">
                  <span className="text-lg">💗</span>
                  Where do you feel this in your body?
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
                <p className="text-xs text-[var(--c-text-faint)] ml-1">Physical awareness helps you recognize worry patterns early</p>
              </div>
            </div>
            {/* Intensity Slider */}
            <div className="space-y-4 bg-[var(--c-surface-alt)] rounded-2xl p-6">
              <div className="space-y-3">
                <label htmlFor="intensity-slider" className="flex items-center gap-2 text-base font-semibold text-[var(--c-text)]">
                  <span className="text-lg">🌡️</span>
                  How intense does this feel right now?
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
                    <span className="flex items-center gap-1"><span>🌱</span> Calm</span>
                    <span className="flex items-center gap-1"><span>⚖️</span> Moderate</span>
                    <span className="flex items-center gap-1"><span>🌋</span> Intense</span>
                  </div>
                  <p className="text-xs text-[var(--c-text-faint)] text-center">Your current feeling level - this can change, and that&apos;s okay</p>
                </div>
              </div>
            </div>
            {/* Submit Section */}
            <div className="space-y-4">
              <div className="bg-gradient-to-r from-[var(--c-accent)]/5 to-[var(--c-accent-alt)]/5 rounded-2xl p-6 text-center">
                <div className="space-y-4">
                  <div className="text-2xl">🤗</div>
                  <p className="text-sm text-[var(--c-text-soft)] max-w-md mx-auto">
                    You&apos;re taking a brave step by acknowledging this worry. Remember, you&apos;re not alone in this.
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
                    Gently placing in your worry jar...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <span>🫙</span>
                    Drop It Gently
                  </span>
                )}
              </button>
              
              <div className="text-center space-y-2">
                <Link href="/companion#worry-input" className="inline-flex items-center gap-1 text-sm text-[var(--c-accent)] hover:text-[var(--c-accent-alt)] transition-colors">
                  <span>💡</span>
                  How this process helps
                </Link>
                <p className="text-xs text-[var(--c-text-faint)]">You&apos;ll be guided to process this worry when you&apos;re ready</p>
              </div>
            </div>
          </form>
        </CardBody>
      </Card>
    </div>
  );
}
