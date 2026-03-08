'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import type { User } from '@supabase/supabase-js';
import { createClient } from '@/lib/supabase/client';
import UserMenu from '@/components/common/UserMenu';

export default function DepartmentHeader() {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => setUser(data.user ?? null));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  return (
    <header className="pt-3 sm:pt-4 lg:pt-5 pb-2 sm:pb-3 px-3 sm:px-4 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between gap-3 sm:gap-4">
          <button onClick={() => router.back()} className="p-1 sm:p-1.5 hover:bg-stone-200 rounded-lg transition-all">
            <svg className="w-5 h-5 lg:w-6 lg:h-6 text-stone-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </button>
          <div className="flex items-center gap-3 sm:gap-4">
            {user && <UserMenu user={user} />}
            <Link href="/" className="transition-transform hover:scale-105">
              <img
                src="/images/logo.png"
                alt="RailJee Logo"
                className="h-7 sm:h-10 w-auto"
              />
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
