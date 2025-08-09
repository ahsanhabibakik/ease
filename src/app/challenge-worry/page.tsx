"use client";

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import useWorryStore, { CognitiveDistortion, CognitiveChallenge } from '@/stores/worryStore';
import { useSession } from 'next-auth/react';
import { toast } from 'sonner';
import { toastApiError, toastSuccess, toastInfo } from '@/lib/toast';

// Cognitive distortion definitions for reference
const DISTORTION_DEFINITIONS = {
  [CognitiveDistortion.ALL_OR_NOTHING]: {
    name: 'All-or-Nothing Thinking',
    description: 'Seeing things in black and white categories',
    example: '"If I&apos;m not perfect, I&apos;m a failure"',
    reframe: '"I can do well without being perfect"'
  },
  [CognitiveDistortion.OVERGENERALIZATION]: {
    name: 'Overgeneralization',
    description: 'Seeing a single negative event as a pattern',
    example: '"I didn&apos;t get this job, I&apos;ll never get any job"',
    reframe: '"This wasn&apos;t the right fit, but other opportunities exist"'
  },
  [CognitiveDistortion.MENTAL_FILTER]: {
    name: 'Mental Filter',
    description: 'Focusing only on negatives',
    example: '"The whole presentation was terrible because I stumbled on one word"',
    reframe: '"The presentation went well overall, with one minor hiccup"'
  },
  [CognitiveDistortion.CATASTROPHIZING]: {
    name: 'Catastrophizing',
    description: 'Expecting the worst possible outcome',
    example: '"If I fail this test, my entire future is ruined"',
    reframe: '"This test is important, but one result doesn\'t determine everything"'
  },
  [CognitiveDistortion.JUMPING_TO_CONCLUSIONS]: {
    name: 'Jumping to Conclusions',
    description: 'Making negative assumptions without evidence',
    example: '"They didn&apos;t call back, they must hate me"',
    reframe: '"There could be many reasons for the delay"'
  },
  [CognitiveDistortion.EMOTIONAL_REASONING]: {
    name: 'Emotional Reasoning',
    description: 'Believing feelings are facts',
    example: '"I feel stupid, so I must be stupid"',
    reframe: '"Feeling something doesn\'t make it true"'
  },
  [CognitiveDistortion.SHOULD_STATEMENTS]: {
    name: 'Should Statements',
    description: 'Using "should," "must," or "ought" statements',
    example: '"I should never make mistakes"',
    reframe: '"Making mistakes is human and helps me learn"'
  },
  [CognitiveDistortion.LABELING]: {
    name: 'Labeling',
    description: 'Calling yourself or others names',
    example: '"I\'m such an idiot for forgetting that"',
    reframe: '"I made a mistake, but that doesn\'t define me"'
  },
  [CognitiveDistortion.PERSONALIZATION]: {
    name: 'Personalization',
    description: 'Blaming yourself for things outside your control',
    example: '"My friend is upset, it must be my fault"',
    reframe: '"People have their own reasons for their emotions"'
  },
  [CognitiveDistortion.DIMINISHING_POSITIVE]: {
    name: 'Diminishing the Positive',
    description: 'Rejecting positive experiences or achievements',
    example: '"That compliment doesn\'t count, they were just being nice"',
    reframe: '"I can accept and appreciate positive feedback"'
  },
};

interface ChallengeStep {
  id: string;
  title: string;
  question: string;
  description?: string;
}

const CHALLENGE_STEPS: ChallengeStep[] = [
  {
    id: 'evidence-for',
    title: 'Evidence Supporting the Worry',
    question: 'What evidence do I have that this thought is true?',
    description: 'List any facts, experiences, or observations that support your worry. Be specific and objective.'
  },
  {
    id: 'evidence-against',
    title: 'Evidence Against the Worry',
    question: 'What evidence do I have that this thought is not completely true?',
    description: 'Look for facts, past experiences, or alternative explanations that challenge your worry.'
  },
  {
    id: 'probability',
    title: 'Realistic Probability',
    question: 'What\'s the realistic probability that my feared outcome will actually happen?',
    description: 'Consider all factors and give an honest percentage estimate (0-100%).'
  },
  {
    id: 'distortions',
    title: 'Thinking Patterns',
    question: 'Which unhelpful thinking patterns might be affecting this worry?',
    description: 'Review the list below and select any patterns that apply to your current thinking.'
  },
  {
    id: 'helpfulness',
    title: 'Is This Helpful?',
    question: 'How helpful is this thought to me right now?',
    description: 'Rate from 1 (very harmful) to 10 (very helpful). Consider how this thought affects your mood and actions.'
  },
  {
    id: 'reframe',
    title: 'Create a Balanced Thought',
    question: 'Based on my answers above, how could I rewrite this thought in a more balanced way?',
    description: 'Use your evidence and insights to create a more realistic and helpful perspective.'
  },
];

const ChallengeWorryContent: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session } = useSession();
  
  const worryId = searchParams.get('worryId');
  const worryText = searchParams.get('worryText');
  
  const { startChallenge, updateChallenge, completeChallenge } = useWorryStore();
  
  const [currentStep, setCurrentStep] = useState(0);
  const [challengeId, setChallengeId] = useState<string | null>(null);
  const [challengeData, setChallengeData] = useState<Partial<CognitiveChallenge>>({
    evidenceFor: [],
    evidenceAgainst: [],
    probabilityRating: 50,
    helpfulnessRating: 5,
    cognitiveDistortions: [],
    reframedThought: '',
  });
  
  const [currentInput, setCurrentInput] = useState('');
  // Submission + error states (declared early to maintain stable hook order)
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Initialize challenge when component mounts
    if (worryId && worryText && !challengeId) {
      const newChallengeId = startChallenge(worryId, decodeURIComponent(worryText));
      setChallengeId(newChallengeId);
      toastInfo('Challenge started', { description: 'Move through each step at your pace' });
    }
  }, [worryId, worryText, challengeId, startChallenge]);

  if (!worryId || !worryText) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="text-center">
          <p className="text-red-600 mb-4">Missing worry information. Please return to your worries and try again.</p>
          <button 
            onClick={() => router.push('/worry-reflection')}
            className="px-4 py-2 bg-accentTeal text-white rounded-lg hover:bg-accentTeal/90"
          >
            Back to Worries
          </button>
        </div>
      </div>
    );
  }

  const currentStepData = CHALLENGE_STEPS[currentStep];
  const progress = ((currentStep + 1) / CHALLENGE_STEPS.length) * 100;

  const handleNext = () => {
    // Save current step data
    if (challengeId) {
      updateChallenge(challengeId, challengeData);
    }
    
    if (currentStep < CHALLENGE_STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
      setCurrentInput('');
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      setCurrentInput('');
    }
  };


  const handleComplete = async () => {
    if (!(challengeId && (challengeData.reframedThought || '').trim())) return;
    setIsSubmitting(true);
    setError(null);
    try {
      // Always complete locally for offline users
      completeChallenge(challengeId, challengeData.reframedThought || '');

      // If signed in, persist as a reflection and resolve worry
      if (session?.user?.id && worryId) {
        const payload = {
          worryId,
          evidenceFor: (challengeData.evidenceFor || []).join('\n'),
            evidenceAgainst: (challengeData.evidenceAgainst || []).join('\n'),
            alternativeView: challengeData.reframedThought || undefined,
            // Map probability/helpfulness + distortions into gentleAction / worstCaseReality narrative fields for now
            worstCaseReality: `Perceived probability: ${challengeData.probabilityRating}%. Distortions: ${(challengeData.cognitiveDistortions || []).join(', ') || 'None identified.'}`,
            gentleAction: `Helpfulness rating: ${challengeData.helpfulnessRating}/10. Next step: Focus on balanced thought.`,
            completed: true,
        };
        const resRef = await fetch('/api/reflections', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        if (!resRef.ok) throw new Error('Reflection save failed');
        // Resolve the worry (best-effort)
        const resWorry = await fetch(`/api/worries/${worryId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: 'RESOLVED' }),
        });
        if (!resWorry.ok) throw new Error('Worry update failed');
      }
      toastSuccess('Challenge complete', { description: 'Balanced thought saved' });
      router.push('/worry-reflection?completed=true');
    } catch (e) {
      console.error('Failed to persist reflection', e);
      setError('Saved locally. Network error while syncing.');
      toastApiError('Sync', e);
      router.push('/worry-reflection?completed=true');
    } finally {
      setIsSubmitting(false);
    }
  };

  const addEvidence = (type: 'evidenceFor' | 'evidenceAgainst') => {
    if (currentInput.trim()) {
      const newEvidence = [...(challengeData[type] || []), currentInput.trim()];
      setChallengeData(prev => ({ ...prev, [type]: newEvidence }));
      setCurrentInput('');
    }
  };

  const removeEvidence = (type: 'evidenceFor' | 'evidenceAgainst', index: number) => {
    const evidenceList = challengeData[type] || [];
    const newEvidence = evidenceList.filter((_, i) => i !== index);
    setChallengeData(prev => ({ ...prev, [type]: newEvidence }));
  };

  const toggleDistortion = (distortion: CognitiveDistortion) => {
    const currentDistortions = challengeData.cognitiveDistortions || [];
    const isSelected = currentDistortions.includes(distortion);
    
    const newDistortions = isSelected
      ? currentDistortions.filter(d => d !== distortion)
      : [...currentDistortions, distortion];
      
    setChallengeData(prev => ({ ...prev, cognitiveDistortions: newDistortions }));
  };

  const renderStepContent = () => {
    switch (currentStepData.id) {
      case 'evidence-for':
        return (
          <div className="space-y-4">
            <div className="flex gap-2">
              <input
                type="text"
                value={currentInput}
                onChange={(e) => setCurrentInput(e.target.value)}
                placeholder="Add evidence that supports your worry..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accentTeal focus:border-transparent"
                onKeyPress={(e) => e.key === 'Enter' && addEvidence('evidenceFor')}
              />
              <button
                onClick={() => addEvidence('evidenceFor')}
                disabled={!currentInput.trim()}
                className="px-4 py-2 bg-accentTeal text-white rounded-lg hover:bg-accentTeal/90 disabled:opacity-50"
              >
                Add
              </button>
            </div>
            
            <div className="space-y-2">
              {(challengeData.evidenceFor || []).map((evidence, index) => (
                <div key={index} className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                  <span className="flex-1">{evidence}</span>
                  <button
                    onClick={() => removeEvidence('evidenceFor', index)}
                    className="text-red-500 hover:text-red-700"
                    aria-label="Remove evidence"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
            
            {(challengeData.evidenceFor || []).length === 0 && (
              <p className="text-gray-500 text-center py-8">No evidence added yet. Add some above.</p>
            )}
          </div>
        );

      case 'evidence-against':
        return (
          <div className="space-y-4">
            <div className="flex gap-2">
              <input
                type="text"
                value={currentInput}
                onChange={(e) => setCurrentInput(e.target.value)}
                placeholder="Add evidence against your worry..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accentTeal focus:border-transparent"
                onKeyPress={(e) => e.key === 'Enter' && addEvidence('evidenceAgainst')}
              />
              <button
                onClick={() => addEvidence('evidenceAgainst')}
                disabled={!currentInput.trim()}
                className="px-4 py-2 bg-accentTeal text-white rounded-lg hover:bg-accentTeal/90 disabled:opacity-50"
              >
                Add
              </button>
            </div>
            
            <div className="space-y-2">
              {(challengeData.evidenceAgainst || []).map((evidence, index) => (
                <div key={index} className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                  <span className="flex-1">{evidence}</span>
                  <button
                    onClick={() => removeEvidence('evidenceAgainst', index)}
                    className="text-red-500 hover:text-red-700"
                    aria-label="Remove evidence"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
            
            {(challengeData.evidenceAgainst || []).length === 0 && (
              <p className="text-gray-500 text-center py-8">No evidence added yet. Add some above.</p>
            )}
          </div>
        );

      case 'probability':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <div className="text-4xl font-bold text-accentTeal mb-2">
                {challengeData.probabilityRating}%
              </div>
              <div className="text-gray-600">Likelihood of feared outcome</div>
            </div>
            
            <label htmlFor="probability-slider" className="sr-only">
              Probability percentage slider
            </label>
            <input
              id="probability-slider"
              type="range"
              min="0"
              max="100"
              value={challengeData.probabilityRating || 50}
              onChange={(e) => setChallengeData(prev => ({ 
                ...prev, 
                probabilityRating: parseInt(e.target.value) 
              }))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider-thumb"
            />
            
            <div className="flex justify-between text-sm text-gray-500">
              <span>0% - Won&apos;t happen</span>
              <span>50% - Might happen</span>
              <span>100% - Will definitely happen</span>
            </div>
            
            <div className="p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-800">
                💡 <strong>Tip:</strong> Most worries feel like they have a high probability when we&apos;re anxious. 
                Take a step back and consider the realistic likelihood based on facts and past experiences.
              </p>
            </div>
          </div>
        );

      case 'distortions':
        return (
          <div className="space-y-4">
            <div className="grid gap-3">
              {Object.entries(DISTORTION_DEFINITIONS).map(([key, def]) => {
                const distortion = key as CognitiveDistortion;
                const isSelected = (challengeData.cognitiveDistortions || []).includes(distortion);
                
                return (
                  <div
                    key={distortion}
                    className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                      isSelected 
                        ? 'border-accentTeal bg-accentTeal/5' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => toggleDistortion(distortion)}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mt-0.5 ${
                        isSelected ? 'border-accentTeal bg-accentTeal' : 'border-gray-300'
                      }`}>
                        {isSelected && <div className="w-2 h-2 bg-white rounded-full" />}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">{def.name}</h3>
                        <p className="text-sm text-gray-600 mt-1">{def.description}</p>
                        <p className="text-xs text-gray-500 mt-2">
                          <strong>Example:</strong> {def.example}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            
            <div className="p-4 bg-green-50 rounded-lg">
              <p className="text-sm text-green-800">
                ✨ Selected: {(challengeData.cognitiveDistortions || []).length} thinking pattern
                {(challengeData.cognitiveDistortions || []).length !== 1 ? 's' : ''}
              </p>
            </div>
          </div>
        );

      case 'helpfulness':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <div className="text-4xl font-bold text-accentTeal mb-2">
                {challengeData.helpfulnessRating}/10
              </div>
              <div className="text-gray-600">How helpful is this thought?</div>
            </div>
            
            <label htmlFor="helpfulness-slider" className="sr-only">
              Helpfulness rating slider
            </label>
            <input
              id="helpfulness-slider"
              type="range"
              min="1"
              max="10"
              value={challengeData.helpfulnessRating || 5}
              onChange={(e) => setChallengeData(prev => ({ 
                ...prev, 
                helpfulnessRating: parseInt(e.target.value) 
              }))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider-thumb"
            />
            
            <div className="flex justify-between text-sm text-gray-500">
              <span>1 - Very harmful</span>
              <span>5 - Neutral</span>
              <span>10 - Very helpful</span>
            </div>
            
            <div className="space-y-3 text-sm">
              <div className="p-3 bg-red-50 rounded-lg">
                <p className="text-red-800">
                  <strong>Harmful (1-3):</strong> This thought increases anxiety, prevents action, or makes me feel worse.
                </p>
              </div>
              <div className="p-3 bg-yellow-50 rounded-lg">
                <p className="text-yellow-800">
                  <strong>Neutral (4-6):</strong> This thought doesn&apos;t help or harm me significantly.
                </p>
              </div>
              <div className="p-3 bg-green-50 rounded-lg">
                <p className="text-green-800">
                  <strong>Helpful (7-10):</strong> This thought motivates positive action and reduces unnecessary worry.
                </p>
              </div>
            </div>
          </div>
        );

      case 'reframe':
        return (
          <div className="space-y-6">
            <div className="p-4 bg-gray-50 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-2">Original Thought:</h3>
              <p className="text-gray-700 italic">&ldquo;{decodeURIComponent(worryText || '')}&rdquo;</p>
            </div>
            
            <div>
              <label htmlFor="reframed-thought" className="block text-sm font-medium text-gray-700 mb-2">
                New, Balanced Thought:
              </label>
              <textarea
                id="reframed-thought"
                value={challengeData.reframedThought || ''}
                onChange={(e) => setChallengeData(prev => ({ 
                  ...prev, 
                  reframedThought: e.target.value 
                }))}
                placeholder="Write a more balanced, realistic version of your original thought..."
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accentTeal focus:border-transparent resize-none"
              />
            </div>
            
            <div className="p-4 bg-blue-50 rounded-lg">
              <h4 className="font-semibold text-blue-900 mb-2">Tips for reframing:</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Use evidence from your previous answers</li>
                <li>• Include realistic probability assessments</li>
                <li>• Focus on what you can control</li>
                <li>• Use compassionate, supportive language</li>
                <li>• Keep it believable and practical</li>
              </ul>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const canProceed = () => {
    switch (currentStepData.id) {
      case 'evidence-for':
      case 'evidence-against':
        return true; // Allow proceeding even with no evidence
      case 'probability':
      case 'helpfulness':
        return true; // Always allow proceeding (has defaults)
      case 'distortions':
        return true; // Allow proceeding with no distortions selected
      case 'reframe':
        return (challengeData.reframedThought || '').trim().length > 10;
      default:
        return true;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-4"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Worries
          </button>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Challenge Your Worry</h1>
          <p className="text-gray-600">Let&apos;s examine this thought together and find a more balanced perspective.</p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">
              Step {currentStep + 1} of {CHALLENGE_STEPS.length}
            </span>
            <span className="text-sm text-gray-500">{Math.round(progress)}% complete</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-accentTeal h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-2">
                {currentStepData.title}
              </h2>
              <p className="text-lg text-gray-700 mb-4">
                {currentStepData.question}
              </p>
              {currentStepData.description && (
                <p className="text-sm text-gray-600">
                  {currentStepData.description}
                </p>
              )}
            </div>

            {renderStepContent()}

            {/* Navigation */}
            <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-200">
              <button
                onClick={handleBack}
                disabled={currentStep === 0}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Back
              </button>

              {currentStep < CHALLENGE_STEPS.length - 1 ? (
                <button
                  onClick={handleNext}
                  disabled={!canProceed()}
                  className="px-6 py-2 bg-accentTeal text-white rounded-lg hover:bg-accentTeal/90 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next Step
                </button>
              ) : (
                <button
                  onClick={handleComplete}
                  disabled={!canProceed() || isSubmitting}
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {isSubmitting && (
                    <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <circle cx="12" cy="12" r="10" strokeWidth="4" className="opacity-25" />
                      <path d="M4 12a8 8 0 0 1 8-8" strokeWidth="4" className="opacity-75" />
                    </svg>
                  )}
                  {isSubmitting ? 'Saving...' : 'Complete Challenge'}
                </button>
              )}
            </div>
            {error && <p className="mt-4 text-sm text-amber-600">{error}</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

const ChallengeWorryPage: React.FC = () => {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accentTeal mx-auto mb-4"></div>
          <p className="text-gray-600">Loading challenge...</p>
        </div>
      </div>
    }>
      <div className="max-w-5xl mx-auto px-2 sm:px-4 py-8 space-y-6">
        <ChallengeWorryContent />
      </div>
    </Suspense>
  );
};

export default ChallengeWorryPage;
