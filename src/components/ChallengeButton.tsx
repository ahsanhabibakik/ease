'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useTranslation } from '@/lib/intl';

interface ChallengeButtonProps {
  worryId: string;
  worryText: string;
  className?: string;
}

const ChallengeButton: React.FC<ChallengeButtonProps> = ({ 
  worryId, 
  worryText, 
  className = '' 
}) => {
  const { t } = useTranslation();
  const router = useRouter();

  const handleChallengeClick = () => {
    // Navigate to challenge page with worry data
    const queryParams = new URLSearchParams({
      worryId,
      worryText: encodeURIComponent(worryText),
    });
    
    router.push(`/challenge-worry?${queryParams.toString()}`);
  };

  return (
    <button
      onClick={handleChallengeClick}
      className={`
        inline-flex items-center gap-2 px-4 py-2 
        bg-accentTeal/10 hover:bg-accentTeal/20 
        text-accentTeal border border-accentTeal/30 
        rounded-lg transition-all duration-200
        font-medium text-sm
        hover:shadow-sm active:scale-95
        ${className}
      `}
      aria-label={`Challenge the worry: ${worryText}`}
    >
      <svg 
        className="w-4 h-4" 
        fill="none" 
        stroke="currentColor" 
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          strokeWidth={2} 
          d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" 
        />
      </svg>
      {t('common.challengeWorry')}
    </button>
  );
};

export default ChallengeButton;
