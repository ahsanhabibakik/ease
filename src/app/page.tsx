'use client'

import { useState } from 'react'
import { useAppStore } from '@/store/appStore'
import { motion } from 'framer-motion'

export default function Home() {
  const { addWorry, worries, setCurrentWorry } = useAppStore()
  const [worryData, setWorryData] = useState({
    title: '',
    description: '',
    category: 'Work',
    bodyFeeling: '',
    intensity: 5,
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!worryData.title.trim()) return

    addWorry({
      ...worryData,
      status: 'ACTIVE' as const,
    })
    
    // Reset form
    setWorryData({
      title: '',
      description: '',
      category: 'Work',
      bodyFeeling: '',
      intensity: 5,
    })
  }

  const categories = [
    'School',
    'Work', 
    'Family',
    'Finance',
    'Politics',
    'Add My Category'
  ]

  const bodyFeelings = [
    'Sweaty palms',
    'Heartbeat',
    'Jaw tightness', 
    'Restless legs',
    'Others'
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-teal-50 to-purple-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-purple-800 mb-2">Ease</h1>
          <p className="text-purple-600">Your compassionate space for processing worries</p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Worry Input Section */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-purple-100"
          >
            <div className="mb-6">
              <h2 className="text-2xl font-semibold text-purple-800 mb-2">
                What's Weighing on Your Heart?
              </h2>
              <p className="text-purple-600 text-sm">
                Place a Worry Gently Here
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Worry Name */}
              <div>
                <input
                  type="text"
                  placeholder="Give it a name…"
                  value={worryData.title}
                  onChange={(e) => setWorryData(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-4 py-3 rounded-xl border border-purple-200 focus:border-purple-400 focus:ring-2 focus:ring-purple-100 outline-none transition-all bg-white/50"
                />
              </div>

              {/* Worry Description */}
              <div>
                <textarea
                  placeholder="Tell your worry story – why does it matter to you?"
                  value={worryData.description}
                  onChange={(e) => setWorryData(prev => ({ ...prev, description: e.target.value }))}
                  rows={4}
                  className="w-full px-4 py-3 rounded-xl border border-purple-200 focus:border-purple-400 focus:ring-2 focus:ring-purple-100 outline-none transition-all bg-white/50 resize-none"
                />
              </div>

              {/* Category Dropdown */}
              <div>
                <label className="block text-sm font-medium text-purple-700 mb-2" htmlFor="category-select">
                  Where does this belong in your life?
                </label>
                <select
                  id="category-select"
                  value={worryData.category}
                  onChange={(e) => setWorryData(prev => ({ ...prev, category: e.target.value }))}
                  className="w-full px-4 py-3 rounded-xl border border-purple-200 focus:border-purple-400 focus:ring-2 focus:ring-purple-100 outline-none transition-all bg-white/50"
                >
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>

              {/* Body Feeling Dropdown */}
              <div>
                <label className="block text-sm font-medium text-purple-700 mb-2" htmlFor="body-feeling-select">
                  Where do you feel this in your body?
                </label>
                <select
                  id="body-feeling-select"
                  value={worryData.bodyFeeling}
                  onChange={(e) => setWorryData(prev => ({ ...prev, bodyFeeling: e.target.value }))}
                  className="w-full px-4 py-3 rounded-xl border border-purple-200 focus:border-purple-400 focus:ring-2 focus:ring-purple-100 outline-none transition-all bg-white/50"
                >
                  <option value="">Select a feeling...</option>
                  {bodyFeelings.map(feeling => (
                    <option key={feeling} value={feeling}>{feeling}</option>
                  ))}
                </select>
              </div>

              {/* Submit Button */}
              <motion.button
                type="submit"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full bg-gradient-to-r from-purple-500 to-teal-500 text-white font-medium py-4 rounded-xl hover:from-purple-600 hover:to-teal-600 transition-all shadow-lg"
              >
                Drop It 🌸
              </motion.button>
            </form>
          </motion.div>

          {/* Worry Jar (List) */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-purple-100"
          >
            <div className="mb-6">
              <h2 className="text-2xl font-semibold text-purple-800 mb-2">
                Worry Jar
              </h2>
              <p className="text-purple-600 text-sm">
                {worries.length} {worries.length === 1 ? 'worry' : 'worries'} captured
              </p>
            </div>

            <div className="space-y-4 max-h-96 overflow-y-auto">
              {worries.length === 0 ? (
                <div className="text-center py-8 text-purple-400">
                  <p>Your worry jar is empty 🌸</p>
                  <p className="text-sm mt-2">Add your first worry to get started</p>
                </div>
              ) : (
                worries.map((worry) => (
                  <motion.div
                    key={worry.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white/80 rounded-xl p-4 border border-purple-100 hover:shadow-md transition-all"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-medium text-purple-800 flex-1">
                        {worry.title}
                      </h3>
                      <span className="text-xs bg-purple-100 text-purple-600 px-2 py-1 rounded-full ml-2">
                        {worry.category}
                      </span>
                    </div>
                    
                    {worry.description && (
                      <p className="text-sm text-purple-600 mb-3 line-clamp-2">
                        {worry.description}
                      </p>
                    )}

                    <div className="flex gap-2 text-xs">
                      <button className="flex items-center gap-1 text-red-500 hover:text-red-600">
                        🗑️ Let It Go
                      </button>
                      <button className="flex items-center gap-1 text-blue-500 hover:text-blue-600">
                        🕓 Save for Later
                      </button>
                      <button className="flex items-center gap-1 text-purple-500 hover:text-purple-600">
                        🪷 Hold for Worry Time
                      </button>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </motion.div>
        </div>

        {/* Calm Corner Preview */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="max-w-4xl mx-auto mt-12"
        >
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-purple-100">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-semibold text-purple-800 mb-2">
                Calm Corner
              </h2>
              <p className="text-purple-600 text-sm">
                In This Moment
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { icon: '🌬️', title: '5-Minute Breathing', subtitle: 'Let the Air Love You' },
                { icon: '🚶', title: 'Walking Meditation', subtitle: 'Walk with Your Worries' },
                { icon: '🧘', title: 'Mindfulness Practice', subtitle: 'Rest in the Now' },
                { icon: '🌟', title: 'Star Jumps / Stretching', subtitle: 'Shake it Off, Shine it Out' },
              ].map((practice, index) => (
                <motion.button
                  key={practice.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-white/80 rounded-xl p-6 text-center hover:shadow-lg transition-all border border-purple-100"
                >
                  <div className="text-3xl mb-3">{practice.icon}</div>
                  <h3 className="font-medium text-purple-800 mb-1 text-sm">
                    {practice.title}
                  </h3>
                  <p className="text-xs text-purple-600">
                    {practice.subtitle}
                  </p>
                </motion.button>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
