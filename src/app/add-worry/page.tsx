'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import useWorryStore from '@/stores/worryStore';
import { useSession } from 'next-auth/react';

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
      alert('Please fill in both the worry name and description.');
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
      alert('Something went wrong saving your worry. It may have been stored locally.');
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
      <section className="bg-white/90 backdrop-blur rounded-2xl shadow-sm ring-1 ring-gray-200/70 p-6 sm:p-8">
        <h1 className="text-2xl font-bold mb-2 tracking-tight">Add a Worry</h1>
        <p className="text-sm text-gray-600 mb-2">Externalize the thought so you can evaluate it later with clarity.</p>
        {!session && (
          <p className="text-xs text-amber-600 bg-amber-50 border border-amber-200 rounded-md p-2 mb-4">
            Sign in to sync worries across devices. Unsigned worries stay only in this browser.
          </p>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="worry-name" className="block mb-1 font-medium">Give your worry a name</label>
            <input 
              id="worry-name" 
              type="text" 
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder={`e.g., ${placeholder}`}
              className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-primary focus:border-primary"
              required
            />
          </div>
          <div>
            <label htmlFor="worry-description" className="block mb-1 font-medium">Why does it matter to you?</label>
            <textarea 
              id="worry-description" 
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Share what's on your heart..." 
              className="w-full border rounded-lg p-3 h-24 focus:ring-2 focus:ring-primary focus:border-primary"
              required
            />
          </div>
          <div className="space-y-6">
            <div>
              <label className="block mb-2 font-medium">Life area</label>
              <div className="flex flex-wrap gap-2">
                {BASE_CATEGORY_PRESETS.concat(customCategories).filter((v,i,a)=>a.indexOf(v)===i).concat('Custom').map(cat => {
                  const active = formData.category === cat;
                  return (
                    <button
                      type="button"
                      key={cat}
                      onClick={() => setFormData(prev => ({ ...prev, category: cat }))}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${active ? 'bg-gradient-to-r from-accentLavender to-accentTeal text-white border-transparent shadow' : 'border-gray-300 hover:bg-gray-100'}`}
                    >{cat}</button>
                  );
                })}
              </div>
              {formData.category === 'Custom' && (
                <input
                  type="text"
                  value={formData.customCategory}
                  onChange={e => setFormData(prev => ({ ...prev, customCategory: e.target.value }))}
                  placeholder="Enter custom area (e.g., Creativity)"
                  className="mt-3 w-full border rounded-lg p-2 text-sm focus:ring-2 focus:ring-primary focus:border-primary"
                />
              )}
            </div>
            <div>
              <label className="block mb-2 font-medium">Body responses (select all that apply)</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {BODY_RESPONSES.map(resp => {
                  const active = formData.bodyResponses.includes(resp);
                  return (
                    <button
                      type="button"
                      key={resp}
                      onClick={() => toggleBodyResponse(resp)}
                      className={`text-xs px-2 py-2 rounded-lg border flex items-center justify-between gap-2 transition-colors ${active ? 'bg-accentTeal/15 border-accentTeal text-teal-800' : 'border-gray-300 hover:bg-gray-100 text-gray-700'}`}
                    >
                      <span className="truncate">{resp}</span>
                      {active && <span className="text-teal-600">✓</span>}
                    </button>
                  );
                })}
              </div>
            </div>
            <div>
              <label htmlFor="intensity-slider" className="block mb-2 font-medium">Current intensity: <span className="font-semibold">{formData.intensity}/10</span></label>
              <input
                id="intensity-slider"
                type="range"
                min={1}
                max={10}
                value={formData.intensity}
                onChange={e => setFormData(prev => ({ ...prev, intensity: Number(e.target.value) }))}
                className="w-full accent-accentTeal"
              />
              <div className="flex justify-between text-[10px] text-gray-500 mt-1">
                <span>Calm</span><span>Moderate</span><span>High</span>
              </div>
            </div>
          </div>
          <button 
            type="submit" 
            disabled={isSubmitting}
            className="w-full py-3 mt-4 bg-gradient-to-r from-accentLavender to-accentTeal text-white rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transition-shadow"
          >
            {isSubmitting ? 'Adding Worry...' : 'Drop It Gently'}
          </button>
          <p className="text-center text-sm text-primary underline mt-2">
            <a href="/companion#worry-input">How this works</a>
          </p>
        </form>
      </section>
    </div>
  );
}
