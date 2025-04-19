'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { signInWithPopup, browserLocalPersistence, setPersistence } from 'firebase/auth';
import { FirebaseError } from 'firebase/app';
import { auth, provider } from '@/firebase/firebase';
import Image from 'next/image';
import Loader from '@/components/Loader';
import UnsupportedBrowserPage from '@/components/UnsupportedBrowserPage';

export default function Home() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [isInAppBrowser, setIsInAppBrowser] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const ua = navigator.userAgent || navigator.vendor || (window as any).opera;
    const inApp = /FBAN|FBAV|Instagram|LinkedIn|Twitter|WebView/.test(ua);
    setIsInAppBrowser(inApp);
  }, []);

  useEffect(() => {
    if (!loading && user) {
      router.push('/dashboard');
    }
  }, [user, loading, router]);

  const handleGoogleSignIn = async () => {
    try {
      await setPersistence(auth, browserLocalPersistence);
      await signInWithPopup(auth, provider);
    } catch (error: unknown) {
      console.error('Google sign-in failed:', error);

      if (error instanceof FirebaseError && error.code === 'auth/popup-blocked') {
        alert('Popup blocked. Please allow popups and try again.');
      } else if (error instanceof FirebaseError && error.code === 'auth/cancelled-popup-request') {
        alert('Sign-in was cancelled. Please try again.');
      } else {
        alert('Something went wrong during sign-in. Please try again later.');
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-background text-foreground">
        <Loader />
      </div>
    );
  }

  if (isInAppBrowser) {
      return <UnsupportedBrowserPage />;
  }

  return (
    <div className="min-h-screen flex flex-col sm:flex-row justify-center items-center px-6 sm:px-12 md:px-[10rem] lg:px-[15rem] bg-background text-foreground text-center sm:text-left overflow-hidden">
      <div className="flex flex-col justify-center items-center sm:items-start sm:pr-12 mt-[-3rem] sm:mt-0">
        <Image 
          src="/assets/LoginMobile.svg"
          alt="Hero Image"
          width={50}
          height={50}
          className='mb-[2rem] sm:hidden w-[250px] dark:invert dark:contrast-10'
        />
        <h1 className="text-5xl sm:text-6xl font-semibold mb-2">WIST.</h1>
        <p className="text-muted-foreground mb-4 text-[15px] sm:text-[16px]">Plan, dream, and achieve</p>

        <button
          onClick={handleGoogleSignIn}
          className="bg-transparent text-foreground text-[14px] px-4 py-3 rounded-[6px] font-medium cursor-pointer border border-foreground hover:bg-foreground hover:text-background transition duration-200 ease-in-out"
        >
          Sign in with Google
        </button>
      </div>

      <Image 
        src="/assets/line.svg"
        alt="Divider"
        width={450}
        height={50}
        className='hidden sm:block mx-[3rem] mb-[3rem] dark:invert dark:contrast-100'
      />

       
    </div>
  );
}
