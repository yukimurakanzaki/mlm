'use client';

import { useAuth, useClerk } from '@clerk/nextjs';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';

/**
 * Breaks the sign-in <-> dashboard redirect loop. When the server sent the visitor here from a protected page
 * (`rejected`) but the browser still believes it is signed in, the server did not accept that session
 * (wrong or mixed Clerk keys, stale cookies). Rendering <SignIn> would bounce straight back to the dashboard, so
 * show a way out instead.
 */
export const SessionGuard = (props: { rejected: boolean; children: React.ReactNode }) => {
  const t = useTranslations('SignIn');
  const { isLoaded, isSignedIn } = useAuth();
  const { signOut } = useClerk();

  if (props.rejected && isLoaded && isSignedIn) {
    return (
      <div
        role="alert"
        className="max-w-md rounded-lg border bg-card p-6 text-center"
      >
        <h1 className="text-lg font-semibold">{t('session_rejected_title')}</h1>
        <p className="mt-2 text-sm text-muted-foreground">{t('session_rejected_description')}</p>
        <Button className="mt-4" onClick={() => signOut({ redirectUrl: '/sign-in' })}>
          {t('session_rejected_button')}
        </Button>
      </div>
    );
  }

  return props.children;
};
