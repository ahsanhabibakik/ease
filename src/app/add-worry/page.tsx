'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import useWorryStore from '@/stores/worryStore';

export default function AddWorry() {
  const router = useRouter();
  const addWorry = useWorryStore((state) => state.addWorry);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'Work',
    bodyResponses: [] as string[],
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.description.trim()) {
      alert('Please fill in both the worry name and description.');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Add to store
      addWorry({
        name: formData.name.trim(),
        description: formData.description.trim(),
        category: formData.category,
        bodyResponses: formData.bodyResponses,
      });
      
      // Reset form
      setFormData({
        name: '',
        description: '',
        category: 'Work',
        bodyResponses: [],
      });
      
      // Redirect to worry reflection page
      router.push('/worry-reflection');
    } catch (error) {
      console.error('Error adding worry:', error);
      alert('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBodyResponseChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedOptions = Array.from(e.target.selectedOptions, option => option.value);
    setFormData(prev => ({ ...prev, bodyResponses: selectedOptions }));
  };

  return (
    <div className="max-w-2xl mx-auto">
      <section className="bg-white/90 backdrop-blur rounded-2xl shadow-sm ring-1 ring-gray-200/70 p-6 sm:p-8">
        <h1 className="text-2xl font-bold mb-2 tracking-tight">Add a Worry</h1>
        <p className="text-sm text-gray-600 mb-6">Externalize the thought so you can evaluate it later with clarity.</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="worry-name" className="block mb-1 font-medium">Give your worry a name</label>
            <input 
              id="worry-name" 
              type="text" 
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="e.g., &quot;Job interview nerves&quot;" 
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
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="life-area-select" className="block mb-1 font-medium">Choose a life area</label>
              <select 
                id="life-area-select" 
                value={formData.category}
                onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-primary focus:border-primary"
              >
                <option value="School">School</option>
                <option value="Work">Work</option>
                <option value="Family">Family</option>
                <option value="Finance">Finance</option>
                <option value="Politics">Politics</option>
                <option value="Health">Health</option>
                <option value="Relationships">Relationships</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label htmlFor="body-response-select" className="block mb-1 font-medium">How does your body respond?</label>
              <select 
                id="body-response-select" 
                multiple 
                value={formData.bodyResponses}
                onChange={handleBodyResponseChange}
                className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-primary focus:border-primary h-32"
              >
                <option value="Sweaty palms">Sweaty palms</option>
                <option value="Heartbeat">Racing heartbeat</option>
                <option value="Jaw tightness">Jaw tightness</option>
                <option value="Restless legs">Restless legs</option>
                <option value="Stomach knots">Stomach knots</option>
                <option value="Shoulder tension">Shoulder tension</option>
                <option value="Chest tightness">Chest tightness</option>
                <option value="Other">Other</option>
              </select>
              <p className="text-xs text-gray-500 mt-1">Hold Ctrl/Cmd to select multiple</p>
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
