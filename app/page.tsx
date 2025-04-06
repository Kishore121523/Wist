'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { signInWithPopup } from 'firebase/auth';
import { auth, provider } from '@/firebase/firebase';
import Image from 'next/image';
import { Line, LogoMain } from '@/public';

export default function Home() {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && user) {
      router.push('/dashboard');
    }
  }, [user, loading, router]);

  const handleGoogleSignIn = async () => {
    try {
      await signInWithPopup(auth, provider);
      router.push('/dashboard');
    } catch (error) {
      console.error('Google sign-in failed:', error);
    }
  };

  if (loading) return <p className="text-center mt-10">Loading...</p>;


  return (
    <div className="min-h-screen flex justify-center items-center px-[15rem] bg-background text-foreground text-center">
      <div className="flex flex-col justify-center items-start">
        <h1 className="text-6xl font-semibold mb-2">WIST.</h1>
        <p className="text-muted-foreground mb-4 text-[16px]">Plan, dream, and achieve</p>

        <button
          onClick={handleGoogleSignIn}
          className="bg-transparent text-foreground text-[14px] px-4 py-3 rounded-[6px] font-medium cursor-pointer border border-foreground hover:bg-foreground hover:text-background transition duration-200 ease-in-out"
        >
          Sign in with Google
        </button>
      </div>

        <Image 
          src={Line}
          alt="Hero Image"
          width={450}
          height={50}
          className='mx-[5rem] mb-[3rem]'
        />

        <Image 
        src={LogoMain}
        alt="Hero Image"
        width={50}
        height={50}
        className=''
      />
      
    </div>
  );
}
