'use client';

import { useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { departmentCache } from '@/lib/departmentCache';
import { getDepartmentIcon } from '@/lib/departmentIcons';

// TODO: Replace with real API data once subscription endpoint is ready
const MOCK_SUBSCRIPTIONS = [
  {
    id: 'sub_1',
    departmentId: 'mechanical',
    departmentName: 'Mechanical',
    plan: '3 Months',
    startDate: '2026-02-10',
    expiryDate: '2026-05-10',
    status: 'active' as const,
  },
  {
    id: 'sub_2',
    departmentId: 'electrical',
    departmentName: 'Electrical',
    plan: 'Monthly',
    startDate: '2026-03-01',
    expiryDate: '2026-04-01',
    status: 'active' as const,
  },
  {
    id: 'sub_3',
    departmentId: 'civil',
    departmentName: 'Civil',
    plan: '6 Months',
    startDate: '2025-10-15',
    expiryDate: '2026-04-15',
    status: 'expiring_soon' as const,
  },
];

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
    departmentCache.clear();
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
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-1 gap-4">
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

      {/* Active Subscriptions */}
      <div className="mt-6 bg-white rounded-xl border border-stone-100 shadow-sm p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xs font-semibold text-stone-400 uppercase tracking-wide">
            Active Subscriptions
          </h2>
          <Link
            href="/subscription"
            className="text-xs font-medium text-orange-600 hover:text-orange-700 transition-colors"
          >
            + Add Plan
          </Link>
        </div>

        {MOCK_SUBSCRIPTIONS.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <svg className="w-10 h-10 text-stone-200 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-3-3v6m-9 1.5A2.5 2.5 0 004.5 18h15a2.5 2.5 0 002.5-2.5V8a2.5 2.5 0 00-2.5-2.5H9.914a1 1 0 01-.707-.293L7.793 3.793A1 1 0 007.086 3.5H4.5A2.5 2.5 0 002 6v9.5z" />
            </svg>
            <p className="text-sm text-stone-500">No active subscriptions yet.</p>
            <Link
              href="/subscription"
              className="mt-3 text-sm font-medium text-orange-600 hover:underline"
            >
              Browse Plans
            </Link>
          </div>
        ) : (
          <ul className="space-y-3">
            {MOCK_SUBSCRIPTIONS.map((sub) => {
              const expiryDate = new Date(sub.expiryDate);
              const today = new Date();
              const daysLeft = Math.ceil((expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
              const isExpiringSoon = sub.status === 'expiring_soon' || daysLeft <= 7;

              return (
                <li
                  key={sub.id}
                  className="flex items-center gap-4 p-3 rounded-xl border border-stone-100 bg-stone-50 hover:bg-orange-50/40 hover:border-orange-100 transition-colors group"
                >
                  {/* Dept icon */}
                  <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-gradient-to-br from-orange-100 to-amber-100 border border-orange-200/60 flex items-center justify-center text-orange-600">
                    {getDepartmentIcon(sub.departmentId, 'w-5 h-5')}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-semibold text-stone-800">{sub.departmentName}</span>
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wide border ${
                          isExpiringSoon
                            ? 'bg-amber-50 border-amber-200 text-amber-700'
                            : 'bg-emerald-50 border-emerald-200 text-emerald-700'
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${isExpiringSoon ? 'bg-amber-400' : 'bg-emerald-400'}`}
                        />
                        {isExpiringSoon ? 'Expiring Soon' : 'Active'}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                      <span className="text-xs text-stone-500">{sub.plan} Plan</span>
                      <span className="text-stone-300 text-xs">·</span>
                      <span className="text-xs text-stone-500">
                        Expires{' '}
                        {expiryDate.toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </span>
                      {daysLeft > 0 && (
                        <>
                          <span className="text-stone-300 text-xs">·</span>
                          <span className={`text-xs font-medium ${isExpiringSoon ? 'text-amber-600' : 'text-stone-500'}`}>
                            {daysLeft}d left
                          </span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Action */}
                  <Link
                    href={`/departments/${sub.departmentId}`}
                    className="flex-shrink-0 text-xs font-medium text-orange-600 border border-orange-200 rounded-full px-3 py-1 hover:bg-orange-600 hover:text-white transition-colors opacity-0 group-hover:opacity-100"
                  >
                    Open
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
