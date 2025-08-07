import Layout from '@/components/Layout';

export default function CalmCorner() {
  return (
    <Layout>
      <section className="space-y-6 mb-8">
        <h1 className="text-2xl font-bold text-center">Calm Corner & Wisdom Cards</h1>
        <div className="bg-white p-6 rounded-2xl shadow-md grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            { icon: '🌬️', title: '5-Minute Breathing', subtitle: 'Let the Air Love You' },
            { icon: '🚶', title: 'Walking Meditation', subtitle: 'Walk with Your Worries' },
            { icon: '🧘', title: 'Mindfulness Practice', subtitle: 'Rest in the Now' },
            { icon: '🌟', title: 'Movement & Stretching', subtitle: 'Shake it Off, Shine it Out' }
          ].map((item) => (
            <div key={item.title} className="flex items-center space-x-4 p-4 border rounded-lg">
              <div className="text-3xl">{item.icon}</div>
              <div>
                <h3 className="font-semibold">{item.title}</h3>
                <p className="text-gray-600">{item.subtitle}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
      <section className="bg-white p-6 rounded-2xl shadow-md max-w-3xl mx-auto">
        <h2 className="text-xl font-semibold mb-4">Wisdom Cards</h2>
        <div className="h-48 flex items-center justify-center text-gray-400">[Carousel Placeholder]</div>
      </section>
    </Layout>
  );
}
