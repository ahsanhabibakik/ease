import Layout from '@/components/Layout';

export default function WorryReflection() {
  return (
    <Layout>
      <section className="bg-white p-6 rounded-2xl shadow-md max-w-3xl mx-auto mb-8">
        <h1 className="text-2xl font-bold mb-4">Your Worry Jar & Circle</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 bg-gray-50 rounded-lg">
            <h2 className="font-semibold">Worries Ready</h2>
            <p className="mt-2 text-xl">0</p>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <h2 className="font-semibold">Daily Worry Time</h2>
            <p className="mt-2 text-xl">5:00 PM</p>
          </div>
        </div>
      </section>
      <section className="bg-white p-6 rounded-2xl shadow-md max-w-3xl mx-auto">
        <h2 className="text-xl font-semibold mb-4">Worry Jar</h2>
        <p className="text-gray-600">Your worry jar is empty. How peaceful! 🌸</p>
      </section>
    </Layout>
  );
}
