'use client';

import { useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';

interface ProfileClientProps {
  user: {
    id: string;
    email?: string;
    user_metadata?: {
      name?: string;
      full_name?: string;
    };
    created_at?: string;
  };
}

export default function ProfileClient({ user }: ProfileClientProps) {
  const [signingOut, setSigningOut] = useState(false);
  const supabase = createClient();

  const fullName =
    user.user_metadata?.name ||
    user.user_metadata?.full_name ||
    user.email?.split('@')[0] ||
    'User';

  const displayName = fullName.split(' ')[0];

  const initials = fullName
    .split(' ')
    .map((n: string) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  async function handleSignOut() {
    setSigningOut(true);
    await supabase.auth.signOut();
    window.location.href = '/';
  }

  const joinDate = user.created_at
    ? new Date(user.created_at).toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : 'N/A';

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
      {/* Profile Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-stone-100 overflow-hidden">
        {/* Header Banner */}
        <div className="h-16 sm:h-24 bg-gradient-to-r from-orange-600 via-orange-500 to-amber-400" />

        {/* Avatar + Name */}
        <div className="px-4 sm:px-6 pb-6">
          {/* Avatar overlapping banner */}
          <div className="-mt-10 sm:-mt-12 mb-3 w-14 h-14 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br from-blue-600 to-orange-500 flex items-center justify-center text-white text-lg sm:text-2xl font-bold ring-4 ring-white shadow">
            {initials}
          </div>

          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0 flex-1">
              <h1 className="text-base sm:text-2xl font-bold text-stone-900 truncate">{fullName}</h1>
              <p className="text-stone-500 text-xs sm:text-sm mt-0.5 break-all">{user.email}</p>

            </div>
            <button
              onClick={handleSignOut}
              disabled={signingOut}
              className="flex items-center gap-1.5 px-3 sm:px-4 py-2 text-sm font-medium text-orange-600 border border-orange-200 rounded-full hover:bg-orange-50 transition-colors shrink-0 disabled:opacity-60 whitespace-nowrap"
            >
              {signingOut ? (
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
              ) : (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              )}
              {signingOut ? 'Signing out...' : 'Sign Out'}
            </button>
          </div>
        </div>
      </div>

      {/* Info Section */}
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-white rounded-xl border border-stone-100 shadow-sm p-5">
          <h2 className="text-xs font-semibold text-stone-400 uppercase tracking-wide mb-3">
            Account Info
          </h2>
          <ul className="space-y-3">
            <li className="flex items-start gap-3">
              <svg className="w-4 h-4 mt-0.5 text-stone-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <div>
                <p className="text-xs text-stone-400">Full Name</p>
                <p className="text-sm font-medium text-stone-800">{fullName}</p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <svg className="w-4 h-4 mt-0.5 text-stone-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <div>
                <p className="text-xs text-stone-400">Email</p>
                <p className="text-sm font-medium text-stone-800">{user.email}</p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <svg className="w-4 h-4 mt-0.5 text-stone-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <div>
                <p className="text-xs text-stone-400">Member Since</p>
                <p className="text-sm font-medium text-stone-800">{joinDate}</p>
              </div>
            </li>
          </ul>
        </div>


      </div>
    </div>
  );
}
