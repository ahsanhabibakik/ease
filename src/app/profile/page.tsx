import { getServerSession } from 'next-auth';
import { authOptions } from '@/auth';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import SaveSettingsClient from './save-settings-client';

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect('/auth/signin?callbackUrl=/profile');

  const user = await prisma.user.findUnique({ where: { id: session.user.id }, include: { settings: true } });
  const [worryCount, releasedCount, recentReflections] = await Promise.all([
    prisma.worry.count({ where: { userId: session.user.id } }),
    prisma.worry.count({ where: { userId: session.user.id, status: 'RESOLVED' } }),
    prisma.reflection.findMany({ where: { userId: session.user.id }, orderBy: { createdAt: 'desc' }, take: 30 })
  ]);

  // Compute reflection streak (consecutive days including today if applicable)
  let streak = 0;
  const seenDays = new Set<string>();
  for (const ref of recentReflections) {
    const d = new Date(ref.createdAt);
    const key = d.toISOString().slice(0,10);
    if (!seenDays.has(key)) seenDays.add(key);
  }
  // Walk back from today
  {
    const walker = new Date();
    for (let i=0;i<seenDays.size+2;i++) {
      const key = walker.toISOString().slice(0,10);
      if (seenDays.has(key)) { streak++; walker.setDate(walker.getDate()-1); }
      else break;
    }
  }

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
          <Stat label="Reflection Streak" value={streak} />
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
        <SaveSettingsClient initialSettings={{
          reflectionTime: user?.settings?.reflectionTime || '17:00',
          customCategories: user?.settings?.customCategories || [],
          notifications: user?.settings?.notifications ?? true,
        }} />
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
