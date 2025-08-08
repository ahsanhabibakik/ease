"use client";
import { useState } from 'react';

type Props = {
  initialSettings: {
    reflectionTime: string;
    customCategories: string[];
    notifications: boolean;
  };
};

export default function SaveSettingsClient({ initialSettings }: Props) {
  const [reflectionTime, setReflectionTime] = useState(initialSettings.reflectionTime);
  const [customCategories, setCustomCategories] = useState(initialSettings.customCategories.join(', '));
  const [notifications, setNotifications] = useState(initialSettings.notifications);
  const [status, setStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function save() {
    setLoading(true); setStatus(null);
    try {
      const res = await fetch('/api/user/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reflectionTime,
          notifications,
          customCategories: customCategories.split(',').map(s => s.trim()).filter(Boolean),
        }),
      });
      if (!res.ok) throw new Error('Save failed');
      setStatus('Saved');
      setTimeout(() => setStatus(null), 2500);
    } catch (e) {
      setStatus('Error saving');
    } finally {
      setLoading(false);
    }
  }

  return (
  <form onSubmit={(e) => { e.preventDefault(); save(); }} className="space-y-4">
      <div>
        <label className="block text-xs font-medium mb-1 text-gray-600 dark:text-gray-400">Daily Reflection Time</label>
  <input aria-label="Daily reflection time" type="time" value={reflectionTime} onChange={e => setReflectionTime(e.target.value)} className="w-40 rounded-lg border border-gray-300/70 dark:border-gray-600 bg-white/70 dark:bg-gray-800/60 px-3 py-2 text-sm focus:outline-none focus:ring-2 ring-accentTeal/40" />
      </div>
      <div>
        <label className="block text-xs font-medium mb-1 text-gray-600 dark:text-gray-400">Custom Categories (comma separated)</label>
        <input type="text" value={customCategories} onChange={e => setCustomCategories(e.target.value)} placeholder="e.g., Creativity, Spiritual" className="w-full rounded-lg border border-gray-300/70 dark:border-gray-600 bg-white/70 dark:bg-gray-800/60 px-3 py-2 text-sm focus:outline-none focus:ring-2 ring-accentTeal/40" />
      </div>
      <div className="flex items-center gap-2">
        <input id="notif" type="checkbox" checked={notifications} onChange={e => setNotifications(e.target.checked)} className="h-4 w-4 rounded border-gray-300 text-accentTeal focus:ring-accentTeal" />
        <label htmlFor="notif" className="text-sm text-gray-700 dark:text-gray-300">Gentle email nudges</label>
      </div>
      <p className="text-[11px] text-gray-500">Future updates will personalize prompts based on these settings.</p>
      <div className="flex items-center gap-3">
        <button type="submit" disabled={loading} className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-accentLavender to-accentTeal text-white px-4 py-2 text-sm font-medium shadow hover:shadow-md focus:outline-none focus-visible:ring-2 ring-accentTeal/40 disabled:opacity-60">
          {loading ? 'Saving…' : 'Save Preferences'}
        </button>
        {status && <span className="text-xs text-gray-600 dark:text-gray-400">{status}</span>}
      </div>
    </form>
  );
}
