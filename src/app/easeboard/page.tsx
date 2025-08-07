import Layout from '@/components/Layout';

export default function Easeboard() {
  return (
    <Layout>
      <div className="space-y-8">
        <h1 className="text-2xl font-bold text-center">Easeboard</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {[
            "What&apos;s Been Weighing on Me",
            "Where I&apos;ve Felt It Most",
            'My Calm Moments',
            'Worry Time'
          ].map((title) => (
            <div key={title} className="bg-white p-6 rounded-2xl shadow-md">
              <h2 className="font-semibold mb-2">{title}</h2>
              <p className="text-gray-600">[Data]</p>
            </div>
          ))}
        </div>
        <section className="bg-white p-6 rounded-2xl shadow-md">
          <h2 className="font-semibold mb-2">My Worry History</h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-medium">Released with Love</h3>
              <p className="text-gray-600">No worries released yet</p>
            </div>
            <div>
              <h3 className="font-medium">Let It Go List</h3>
              <p className="text-gray-600">No worries let go yet</p>
            </div>
          </div>
        </section>
        <section className="bg-white p-6 rounded-2xl shadow-md">
          <h2 className="font-semibold mb-2">How I&apos;ve Been Feeling</h2>
          <div className="h-32 flex items-center justify-center text-gray-400">[Chart Placeholder]</div>
        </section>
      </div>
    </Layout>
  );
}
