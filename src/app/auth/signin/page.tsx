import { Suspense } from 'react';
import AuthModal from './AuthModal';

export default function SignInPage() {
  return (
    <Suspense fallback={<div className="p-8 text-sm text-gray-500">Loading sign in…</div>}>
      <AuthModal />
    </Suspense>
  );
}
