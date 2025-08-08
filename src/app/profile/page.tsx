import { getServerSession } from 'next-auth';
import { authOptions } from '@/auth';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect('/auth/signin?callbackUrl=/profile');

  const user = await prisma.user.findUnique({ where: { id: session.user.id }, include: { settings: true } });
  const worryCount = await prisma.worry.count({ where: { userId: session.user.id } });
  const releasedCount = await prisma.worry.count({ where: { userId: session.user.id, status: 'RESOLVED' } });

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <section className="bg-white/90 dark:bg-gray-900/70 backdrop-blur rounded-2xl p-8 ring-1 ring-gray-200/70 dark:ring-gray-700 shadow-sm">
        <div className="flex items-center gap-6">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={user?.image || 'https://avatar.vercel.sh/' + user?.email} alt={user?.name || 'User'} className="h-20 w-20 rounded-2xl object-cover ring-2 ring-accentTeal/30" />
          <div>
            <h1 className="text-2xl font-bold tracking-tight mb-1">{user?.name || user?.email}</h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">Private mindful space • Joined {new Date(user?.createdAt || Date.now()).toLocaleDateString()}</p>
          </div>
        </div>
        <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-4">
          <Stat label="Worries Captured" value={worryCount} />
          <Stat label="Released" value={releasedCount} />
          <Stat label="Categories Used" value={(await prisma.worry.findMany({ where: { userId: session.user.id }, select: { category: true } })).reduce((acc, w) => acc.add(w.category), new Set<string>()).size} />
          <Stat label="Reflection Streak" value={user?.settings ? 3 : 0} />
        </div>
      </section>

      <section className="bg-white/90 dark:bg-gray-900/70 backdrop-blur rounded-2xl p-6 ring-1 ring-gray-200/70 dark:ring-gray-700 shadow-sm">
        <h2 className="text-lg font-semibold mb-4">Wellbeing Snapshot</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          {[
            { title: 'Awareness', desc: 'Capturing worries helps reduce cognitive load.', level: 'Growing' },
            { title: 'Emotional Regulation', desc: 'You are practicing reframing & release.', level: 'Developing' },
            { title: 'Body Literacy', desc: 'Tracking physical responses increases interoceptive awareness.', level: 'Emerging' },
          ].map(item => (
            <div key={item.title} className="p-4 rounded-xl border border-gray-200/70 dark:border-gray-700 bg-white/60 dark:bg-gray-800/40">
              <h3 className="font-medium mb-1 text-gray-800 dark:text-gray-100">{item.title}</h3>
              <p className="text-xs text-gray-600 dark:text-gray-400 mb-2 leading-relaxed">{item.desc}</p>
              <span className="inline-block text-[10px] uppercase tracking-wide px-2 py-1 rounded-full bg-gradient-to-r from-accentLavender/20 to-accentTeal/20 text-accentTeal font-semibold">{item.level}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-white/90 dark:bg-gray-900/70 backdrop-blur rounded-2xl p-6 ring-1 ring-gray-200/70 dark:ring-gray-700 shadow-sm">
        <h2 className="text-lg font-semibold mb-4">Personalization</h2>
        <form className="space-y-4">
          <div>
            <label className="block text-xs font-medium mb-1 text-gray-600 dark:text-gray-400">Daily Reflection Time</label>
            <input aria-label="Daily reflection time" type="time" defaultValue={user?.settings?.reflectionTime || '17:00'} className="w-40 rounded-lg border border-gray-300/70 dark:border-gray-600 bg-white/70 dark:bg-gray-800/60 px-3 py-2 text-sm focus:outline-none focus:ring-2 ring-accentTeal/40" />
          </div>
          <div>
            <label className="block text-xs font-medium mb-1 text-gray-600 dark:text-gray-400">Custom Categories (comma separated)</label>
            <input aria-label="Custom categories" type="text" defaultValue={(user?.settings?.customCategories || []).join(', ')} placeholder="e.g., Creativity, Spiritual" className="w-full rounded-lg border border-gray-300/70 dark:border-gray-600 bg-white/70 dark:bg-gray-800/60 px-3 py-2 text-sm focus:outline-none focus:ring-2 ring-accentTeal/40" />
          </div>
          <div className="flex items-center gap-2">
            <input id="notif" type="checkbox" defaultChecked={user?.settings?.notifications} className="h-4 w-4 rounded border-gray-300 text-accentTeal focus:ring-accentTeal" />
            <label htmlFor="notif" className="text-sm text-gray-700 dark:text-gray-300">Gentle email nudges</label>
          </div>
          <p className="text-[11px] text-gray-500">These personalization features are evolving—future updates will include adaptive prompts and mood pattern insights.</p>
          <button type="button" className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-accentLavender to-accentTeal text-white px-4 py-2 text-sm font-medium shadow hover:shadow-md focus:outline-none focus-visible:ring-2 ring-accentTeal/40">Save Preferences</button>
        </form>
      </section>

      <section className="bg-white/90 dark:bg-gray-900/70 backdrop-blur rounded-2xl p-6 ring-1 ring-gray-200/70 dark:ring-gray-700 shadow-sm">
        <h2 className="text-lg font-semibold mb-3">Evidence-Based Guidance</h2>
        <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
          <li>• Externalizing worries reduces rumination load (cognitive offloading).</li>
          <li>• Labeling body sensations builds interoceptive accuracy linked to emotional regulation.</li>
          <li>• Scheduled worry time is associated with lower baseline anxiety across studies.</li>
          <li>• Reframing via structured prompts fosters balanced thinking over time.</li>
        </ul>
      </section>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="p-4 rounded-xl border border-gray-200/70 dark:border-gray-700 bg-white/60 dark:bg-gray-800/40 text-center">
      <div className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-1">{value}</div>
      <div className="text-[11px] uppercase tracking-wide text-gray-500 font-medium">{label}</div>
    </div>
  );
}
