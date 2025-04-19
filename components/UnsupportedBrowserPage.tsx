'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';

export default function UnsupportedBrowserPage() {
  const [isInAppBrowser, setIsInAppBrowser] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera;
    const inAppBrowser = /FBAN|FBAV|Instagram|LinkedIn|Twitter/.test(userAgent);
    setIsInAppBrowser(inAppBrowser);
  }, []);

  if (!isInAppBrowser) return null;

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6 text-center text-foreground">
      <Image
        src="/assets/unsupportedBrowser.svg"
        alt="WIST Logo"
        width={250}
        height={250}
        className="mb-3 dark:invert dark:contrast-30"
      />
      <h1 className="text-3xl font-bold mb-2">Open in Browser</h1>
      <p className="text-muted-foreground text-sm mb-4 max-w-md">
        Google sign-in does not work inside LinkedIn or Instagram in-app browsers for security reasons.
      </p>
      <p className="text-sm text-muted-foreground mb-6 max-w-md">
        Tap the <span className="font-semibold text-foreground">⋮ menu</span> (Android & iOS), then choose{' '}
        <span className="font-semibold text-foreground">Open in Browser</span> to continue using WIST.
      </p>

      <p className="text-xs text-muted-foreground mt-6">Thank you for understanding.</p>
    </div>
  );
}
