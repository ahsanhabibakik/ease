"use client";

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import useWorryStore, { CognitiveDistortion, CognitiveChallenge } from '@/stores/worryStore';
import { useSession } from 'next-auth/react';
import { toastApiError, toastSuccess, toastInfo } from '@/lib/toast';
import { useTranslation } from '@/lib/intl';

// Cognitive distortion definitions for reference - now using translations
const getDistortionDefinitions = (t: (key: string) => string) => ({
  [CognitiveDistortion.ALL_OR_NOTHING]: {
    name: t('challengeWorry.distortions.ALL_OR_NOTHING.name'),
    description: t('challengeWorry.distortions.ALL_OR_NOTHING.description'),
    example: t('challengeWorry.distortions.ALL_OR_NOTHING.example'),
    reframe: t('challengeWorry.distortions.ALL_OR_NOTHING.reframe')
  },
  [CognitiveDistortion.OVERGENERALIZATION]: {
    name: t('challengeWorry.distortions.OVERGENERALIZATION.name'),
    description: t('challengeWorry.distortions.OVERGENERALIZATION.description'),
    example: t('challengeWorry.distortions.OVERGENERALIZATION.example'),
    reframe: t('challengeWorry.distortions.OVERGENERALIZATION.reframe')
  },
  [CognitiveDistortion.MENTAL_FILTER]: {
    name: t('challengeWorry.distortions.MENTAL_FILTER.name'),
    description: t('challengeWorry.distortions.MENTAL_FILTER.description'),
    example: t('challengeWorry.distortions.MENTAL_FILTER.example'),
    reframe: t('challengeWorry.distortions.MENTAL_FILTER.reframe')
  },
  [CognitiveDistortion.CATASTROPHIZING]: {
    name: t('challengeWorry.distortions.CATASTROPHIZING.name'),
    description: t('challengeWorry.distortions.CATASTROPHIZING.description'),
    example: t('challengeWorry.distortions.CATASTROPHIZING.example'),
    reframe: t('challengeWorry.distortions.CATASTROPHIZING.reframe')
  },
  [CognitiveDistortion.JUMPING_TO_CONCLUSIONS]: {
    name: t('challengeWorry.distortions.JUMPING_TO_CONCLUSIONS.name'),
    description: t('challengeWorry.distortions.JUMPING_TO_CONCLUSIONS.description'),
    example: t('challengeWorry.distortions.JUMPING_TO_CONCLUSIONS.example'),
    reframe: t('challengeWorry.distortions.JUMPING_TO_CONCLUSIONS.reframe')
  },
  [CognitiveDistortion.EMOTIONAL_REASONING]: {
    name: t('challengeWorry.distortions.EMOTIONAL_REASONING.name'),
    description: t('challengeWorry.distortions.EMOTIONAL_REASONING.description'),
    example: t('challengeWorry.distortions.EMOTIONAL_REASONING.example'),
    reframe: t('challengeWorry.distortions.EMOTIONAL_REASONING.reframe')
  },
  [CognitiveDistortion.SHOULD_STATEMENTS]: {
    name: t('challengeWorry.distortions.SHOULD_STATEMENTS.name'),
    description: t('challengeWorry.distortions.SHOULD_STATEMENTS.description'),
    example: t('challengeWorry.distortions.SHOULD_STATEMENTS.example'),
    reframe: t('challengeWorry.distortions.SHOULD_STATEMENTS.reframe')
  },
  [CognitiveDistortion.LABELING]: {
    name: t('challengeWorry.distortions.LABELING.name'),
    description: t('challengeWorry.distortions.LABELING.description'),
    example: t('challengeWorry.distortions.LABELING.example'),
    reframe: t('challengeWorry.distortions.LABELING.reframe')
  },
  [CognitiveDistortion.PERSONALIZATION]: {
    name: t('challengeWorry.distortions.PERSONALIZATION.name'),
    description: t('challengeWorry.distortions.PERSONALIZATION.description'),
    example: t('challengeWorry.distortions.PERSONALIZATION.example'),
    reframe: t('challengeWorry.distortions.PERSONALIZATION.reframe')
  },
  [CognitiveDistortion.DIMINISHING_POSITIVE]: {
    name: t('challengeWorry.distortions.DIMINISHING_POSITIVE.name'),
    description: t('challengeWorry.distortions.DIMINISHING_POSITIVE.description'),
    example: t('challengeWorry.distortions.DIMINISHING_POSITIVE.example'),
    reframe: t('challengeWorry.distortions.DIMINISHING_POSITIVE.reframe')
  },
});

interface ChallengeStep {
  id: string;
  title: string;
  question: string;
  description?: string;
}

const getChallengeSteps = (t: (key: string) => string): ChallengeStep[] => [
  {
    id: 'evidence-for',
    title: t('challengeWorry.steps.evidenceFor.title'),
    question: t('challengeWorry.steps.evidenceFor.question'),
    description: t('challengeWorry.steps.evidenceFor.description')
  },
  {
    id: 'evidence-against',
    title: t('challengeWorry.steps.evidenceAgainst.title'),
    question: t('challengeWorry.steps.evidenceAgainst.question'),
    description: t('challengeWorry.steps.evidenceAgainst.description')
  },
  {
    id: 'probability',
    title: t('challengeWorry.steps.probability.title'),
    question: t('challengeWorry.steps.probability.question'),
    description: t('challengeWorry.steps.probability.description')
  },
  {
    id: 'distortions',
    title: t('challengeWorry.steps.distortions.title'),
    question: t('challengeWorry.steps.distortions.question'),
    description: t('challengeWorry.steps.distortions.description')
  },
  {
    id: 'helpfulness',
    title: t('challengeWorry.steps.helpfulness.title'),
    question: t('challengeWorry.steps.helpfulness.question'),
    description: t('challengeWorry.steps.helpfulness.description')
  },
  {
    id: 'reframe',
    title: t('challengeWorry.steps.reframe.title'),
    question: t('challengeWorry.steps.reframe.question'),
    description: t('challengeWorry.steps.reframe.description')
  },
];

const ChallengeWorryContent: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session } = useSession();
  const { t } = useTranslation();
  
  const worryId = searchParams.get('worryId');
  const worryText = searchParams.get('worryText');
  
  const { startChallenge, updateChallenge, completeChallenge } = useWorryStore();
  
  const DISTORTION_DEFINITIONS = getDistortionDefinitions(t);
  const CHALLENGE_STEPS = getChallengeSteps(t);
  
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
      toastInfo(t('challengeWorry.challengeStarted'), { description: t('challengeWorry.challengeStartedDesc') });
    }
  }, [worryId, worryText, challengeId, startChallenge, t]);

  if (!worryId || !worryText) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="text-center">
          <p className="text-red-600 mb-4">{t('challengeWorry.missingInfo')}</p>
          <button 
            onClick={() => router.push('/worry-reflection')}
            className="px-4 py-2 bg-accentTeal text-white rounded-lg hover:bg-accentTeal/90"
          >
            {t('challengeWorry.backToWorries')}
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
      toastSuccess(t('challengeWorry.challengeComplete'), { description: t('challengeWorry.challengeCompleteDesc') });
      router.push('/worry-reflection?completed=true');
    } catch (e) {
      console.error('Failed to persist reflection', e);
      setError(t('challengeWorry.syncError'));
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
                placeholder={t('challengeWorry.steps.evidenceFor.placeholder')}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accentTeal focus:border-transparent"
                onKeyPress={(e) => e.key === 'Enter' && addEvidence('evidenceFor')}
              />
              <button
                onClick={() => addEvidence('evidenceFor')}
                disabled={!currentInput.trim()}
                className="px-4 py-2 bg-accentTeal text-white rounded-lg hover:bg-accentTeal/90 disabled:opacity-50"
              >
                {t('challengeWorry.steps.evidenceFor.add')}
              </button>
            </div>
            
            <div className="space-y-2">
              {(challengeData.evidenceFor || []).map((evidence, index) => (
                <div key={index} className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                  <span className="flex-1">{evidence}</span>
                  <button
                    onClick={() => removeEvidence('evidenceFor', index)}
                    className="text-red-500 hover:text-red-700"
                    aria-label={t('challengeWorry.steps.evidenceFor.remove')}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
            
            {(challengeData.evidenceFor || []).length === 0 && (
              <p className="text-gray-500 text-center py-8">{t('challengeWorry.steps.evidenceFor.noEvidence')}</p>
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
                placeholder={t('challengeWorry.steps.evidenceAgainst.placeholder')}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accentTeal focus:border-transparent"
                onKeyPress={(e) => e.key === 'Enter' && addEvidence('evidenceAgainst')}
              />
              <button
                onClick={() => addEvidence('evidenceAgainst')}
                disabled={!currentInput.trim()}
                className="px-4 py-2 bg-accentTeal text-white rounded-lg hover:bg-accentTeal/90 disabled:opacity-50"
              >
                {t('challengeWorry.steps.evidenceAgainst.add')}
              </button>
            </div>
            
            <div className="space-y-2">
              {(challengeData.evidenceAgainst || []).map((evidence, index) => (
                <div key={index} className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                  <span className="flex-1">{evidence}</span>
                  <button
                    onClick={() => removeEvidence('evidenceAgainst', index)}
                    className="text-red-500 hover:text-red-700"
                    aria-label={t('challengeWorry.steps.evidenceAgainst.remove')}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
            
            {(challengeData.evidenceAgainst || []).length === 0 && (
              <p className="text-gray-500 text-center py-8">{t('challengeWorry.steps.evidenceAgainst.noEvidence')}</p>
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
              <div className="text-gray-600">{t('challengeWorry.steps.probability.likelihood')}</div>
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
              <span>0% - {t('challengeWorry.steps.probability.wontHappen')}</span>
              <span>50% - {t('challengeWorry.steps.probability.mightHappen')}</span>
              <span>100% - {t('challengeWorry.steps.probability.willHappen')}</span>
            </div>
            
            <div className="p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-800">
                💡 <strong>{t('challengeWorry.steps.probability.tip')}</strong>
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
                          <strong>{t('challengeWorry.steps.distortions.example')}</strong> {def.example}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            
            <div className="p-4 bg-green-50 rounded-lg">
              <p className="text-sm text-green-800">
                ✨ {(challengeData.cognitiveDistortions || []).length === 1 
                  ? t('challengeWorry.steps.distortions.selected', { count: (challengeData.cognitiveDistortions || []).length })
                  : t('challengeWorry.steps.distortions.selectedPlural', { count: (challengeData.cognitiveDistortions || []).length })}
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
              <div className="text-gray-600">{t('challengeWorry.steps.helpfulness.helpful')}</div>
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
              <span>1 - {t('challengeWorry.steps.helpfulness.veryHarmful')}</span>
              <span>5 - {t('challengeWorry.steps.helpfulness.neutral')}</span>
              <span>10 - {t('challengeWorry.steps.helpfulness.veryHelpful')}</span>
            </div>
            
            <div className="space-y-3 text-sm">
              <div className="p-3 bg-red-50 rounded-lg">
                <p className="text-red-800">
                  <strong>Harmful (1-3):</strong> {t('challengeWorry.steps.helpfulness.harmfulDesc')}
                </p>
              </div>
              <div className="p-3 bg-yellow-50 rounded-lg">
                <p className="text-yellow-800">
                  <strong>Neutral (4-6):</strong> {t('challengeWorry.steps.helpfulness.neutralDesc')}
                </p>
              </div>
              <div className="p-3 bg-green-50 rounded-lg">
                <p className="text-green-800">
                  <strong>Helpful (7-10):</strong> {t('challengeWorry.steps.helpfulness.helpfulDesc')}
                </p>
              </div>
            </div>
          </div>
        );

      case 'reframe':
        return (
          <div className="space-y-6">
            <div className="p-4 bg-gray-50 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-2">{t('challengeWorry.steps.reframe.originalThought')}</h3>
              <p className="text-gray-700 italic">&ldquo;{decodeURIComponent(worryText || '')}&rdquo;</p>
            </div>
            
            <div>
              <label htmlFor="reframed-thought" className="block text-sm font-medium text-gray-700 mb-2">
                {t('challengeWorry.steps.reframe.newThought')}
              </label>
              <textarea
                id="reframed-thought"
                value={challengeData.reframedThought || ''}
                onChange={(e) => setChallengeData(prev => ({ 
                  ...prev, 
                  reframedThought: e.target.value 
                }))}
                placeholder={t('challengeWorry.steps.reframe.placeholder')}
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accentTeal focus:border-transparent resize-none"
              />
            </div>
            
            <div className="p-4 bg-blue-50 rounded-lg">
              <h4 className="font-semibold text-blue-900 mb-2">{t('challengeWorry.steps.reframe.tips')}</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• {t('challengeWorry.steps.reframe.tip1')}</li>
                <li>• {t('challengeWorry.steps.reframe.tip2')}</li>
                <li>• {t('challengeWorry.steps.reframe.tip3')}</li>
                <li>• {t('challengeWorry.steps.reframe.tip4')}</li>
                <li>• {t('challengeWorry.steps.reframe.tip5')}</li>
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
            {t('challengeWorry.backToWorries')}
          </button>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{t('challengeWorry.title')}</h1>
          <p className="text-gray-600">{t('challengeWorry.subtitle')}</p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">
              {t('challengeWorry.stepOf', { current: currentStep + 1, total: CHALLENGE_STEPS.length })}
            </span>
            <span className="text-sm text-gray-500">{t('challengeWorry.percentComplete', { percent: Math.round(progress) })}</span>
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
                {t('challengeWorry.navigation.back')}
              </button>

              {currentStep < CHALLENGE_STEPS.length - 1 ? (
                <button
                  onClick={handleNext}
                  disabled={!canProceed()}
                  className="px-6 py-2 bg-accentTeal text-white rounded-lg hover:bg-accentTeal/90 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {t('challengeWorry.navigation.nextStep')}
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
                  {isSubmitting ? t('challengeWorry.navigation.saving') : t('challengeWorry.navigation.completeChallenge')}
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
