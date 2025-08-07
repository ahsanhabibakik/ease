import Layout from '@/components/Layout';

export default function AddWorry() {
  return (
    <Layout>
      <section className="bg-white p-6 rounded-2xl shadow-md max-w-xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Add a Worry</h1>
        <form className="space-y-4">
          <div>
            <label htmlFor="worry-name" className="block mb-1">Give your worry a name</label>
            <input id="worry-name" type="text" placeholder="e.g., &quot;Job interview nerves&quot;" className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-primary" />
          </div>
          <div>
            <label htmlFor="worry-description" className="block mb-1">Why does it matter to you?</label>
            <textarea id="worry-description" placeholder="Share what's on your heart..." className="w-full border rounded-lg p-3 h-24 focus:ring-2 focus:ring-primary" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="life-area-select" className="block mb-1">Choose a life area</label>
              <select id="life-area-select" className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-primary">
                <option>School</option>
                <option>Work</option>
                <option>Family</option>
                <option>Finance</option>
                <option>Politics</option>
                <option>Health</option>
                <option>Relationships</option>
                <option>Add My Category</option>
              </select>
            </div>
            <div>
              <label htmlFor="body-response-select" className="block mb-1">How does your body respond?</label>
              <select id="body-response-select" multiple className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-primary h-32">
                <option>Sweaty palms</option>
                <option>Heartbeat</option>
                <option>Jaw tightness</option>
                <option>Restless legs</option>
                <option>Stomach knots</option>
                <option>Shoulder tension</option>
                <option>Chest tightness</option>
                <option>Other</option>
              </select>
            </div>
          </div>
          <button type="submit" className="w-full py-3 mt-4 bg-gradient-to-r from-accentLavender to-accentTeal text-white rounded-lg">Drop It Gently</button>
          <p className="text-center text-sm text-primary underline mt-2"><a href="/companion#worry-input">How this works</a></p>
        </form>
      </section>
    </Layout>
  );
}
