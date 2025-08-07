import Layout from '@/components/Layout';

export default function Companion() {
  const sections = [
    'why-this-works',
    'real-life-moment',
    'why-journaling-helps',
    'science-of-worry',
    'tips-for-using',
    'your-progress',
    'faq',
    'final-thought'
  ];
  return (
    <Layout>
      <div className="space-y-12">
        <h1 className="text-2xl font-bold text-center">Ease Companion</h1>
        {sections.map((id) => (
          <section key={id} id={id} className="bg-white p-6 rounded-2xl shadow-md">
            <h2 className="text-xl font-semibold mb-2">{id.replace(/-/g, ' ')}</h2>
            <p className="text-gray-600">[Content for {id}]</p>
          </section>
        ))}
      </div>
    </Layout>
  );
}
