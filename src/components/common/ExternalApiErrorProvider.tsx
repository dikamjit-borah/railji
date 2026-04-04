'use client';

import { useEffect, useState, type ReactNode } from 'react';
import Link from 'next/link';
import { EXTERNAL_API_ERROR_EVENT, type ExternalApiErrorDetail } from '@/lib/externalApiError';

const DEFAULT_MESSAGE = 'Please try to reload if it persists then contact us.';

interface ExternalApiErrorProviderProps {
  children: ReactNode;
}

export default function ExternalApiErrorProvider({ children }: ExternalApiErrorProviderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState(DEFAULT_MESSAGE);

  useEffect(() => {
    const handler = (event: Event) => {
      const customEvent = event as CustomEvent<ExternalApiErrorDetail>;
      const nextMessage = customEvent.detail?.message?.trim();
      setMessage(nextMessage || DEFAULT_MESSAGE);
      setIsOpen(true);
    };

    window.addEventListener(EXTERNAL_API_ERROR_EVENT, handler as EventListener);
    return () => window.removeEventListener(EXTERNAL_API_ERROR_EVENT, handler as EventListener);
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  const handleReload = () => {
    window.location.reload();
  };

  return (
    <>
      {children}
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-stone-900/50 backdrop-blur-sm p-4">
          <div
            role="dialog"
            aria-modal="true"
            className="w-full max-w-lg rounded-2xl border border-stone-100 bg-white shadow-2xl"
          >
            <div className="p-6 sm:p-8">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-orange-50">
                  <svg className="h-6 w-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-orange-600">Technical Issue</p>
                  <h2 className="mt-1 text-2xl font-bold text-stone-900">We are facing some technical issues</h2>
                  <p className="mt-2 text-sm text-stone-600">{message}</p>
                </div>
              </div>

              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <button
                  onClick={handleReload}
                  className="inline-flex w-full items-center justify-center rounded-xl bg-orange-600 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-orange-700 sm:w-auto"
                >
                  Reload
                </button>
                <Link
                  href="/contact"
                  onClick={() => setIsOpen(false)}
                  className="inline-flex w-full items-center justify-center rounded-xl border border-stone-200 px-5 py-3 text-sm font-semibold text-stone-700 transition-colors hover:border-stone-300 hover:bg-stone-50 sm:w-auto"
                >
                  Contact Us
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
