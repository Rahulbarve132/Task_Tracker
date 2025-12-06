'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default function Home() {
  const router = useRouter();
  const { user } = useSelector((state) => state.auth);

  // Redirect if already logged in
  useEffect(() => {
    if (user || localStorage.getItem('token')) {
      router.push('/dashboard');
    }
  }, [user, router]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-4 text-center">
      <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
        Task Tracker
      </h1>
      <p className="mt-6 text-lg leading-8 text-gray-600">
        Manage your tasks with elegance and efficiency.
      </p>
      <div className="mt-10 flex items-center justify-center gap-x-6">
        <Link href="/login">
          <Button size="lg">Get Started</Button>
        </Link>
        <Link href="/signup">
          <Button variant="ghost" size="lg">
            Create Account
          </Button>
        </Link>
      </div>
    </div>
  );
}
