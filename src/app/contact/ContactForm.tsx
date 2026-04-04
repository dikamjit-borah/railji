'use client';

import { useState, FormEvent } from 'react';
import Link from 'next/link';
import { emitExternalApiError } from '@/lib/externalApiError';

type Status = 'idle' | 'submitting' | 'success' | 'error';

export default function ContactForm() {
  const [status, setStatus] = useState<Status>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus('submitting');
    setErrorMsg('');

    const form = e.currentTarget;
    const data = {
      name: (form.elements.namedItem('name') as HTMLInputElement).value,
      email: (form.elements.namedItem('email') as HTMLInputElement).value,
      subject: (form.elements.namedItem('subject') as HTMLSelectElement).value,
      message: (form.elements.namedItem('message') as HTMLTextAreaElement).value,
    };

    try {
      const res = await fetch(process.env.NEXT_PUBLIC_FORMSPREE_ENDPOINT!, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        setStatus('success');
        form.reset();
      } else {
        const json = await res.json().catch(() => ({}));
        setErrorMsg(json?.error ?? 'Something went wrong. Please try again.');
        setStatus('error');
        emitExternalApiError();
      }
    } catch {
      setErrorMsg('Network error. Please check your connection and try again.');
      setStatus('error');
      emitExternalApiError();
    }
  }

  if (status === 'success') {
    return (
      <div className="bg-green-50 border-2 border-green-300 rounded-2xl p-8 text-center shadow-lg">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-green-100 mb-4">
          <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-lg font-bold text-stone-900 mb-2">Message Sent!</h3>
        <p className="text-stone-600 text-sm mb-5">
          Thanks for reaching out. We&apos;ll get back to you within 24–48 hours.
        </p>
        <button
          onClick={() => setStatus('idle')}
          className="inline-flex items-center gap-2 text-sm font-semibold text-orange-600 hover:text-orange-700 transition-colors"
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border-2 border-orange-200 bg-white shadow-[0_4px_32px_0_rgba(234,88,12,0.08)] p-6 sm:p-8">
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="name" className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
            Your Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            required
            placeholder="Rahul Sharma"
            disabled={status === 'submitting'}
            className="w-full px-4 py-2.5 rounded-xl border border-stone-200 bg-white text-stone-900 text-sm placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition disabled:opacity-60"
          />
        </div>
        <div>
          <label htmlFor="email" className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
            Email Address
          </label>
          <input
            type="email"
            id="email"
            name="email"
            required
            placeholder="rahul@example.com"
            disabled={status === 'submitting'}
            className="w-full px-4 py-2.5 rounded-xl border border-stone-200 bg-white text-stone-900 text-sm placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition disabled:opacity-60"
          />
        </div>
      </div>

      <div>
        <label htmlFor="subject" className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
          Subject
        </label>
        <select
          id="subject"
          name="subject"
          required
          disabled={status === 'submitting'}
          className="w-full px-4 py-2.5 rounded-xl border border-stone-200 bg-white text-stone-900 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition disabled:opacity-60"
        >
          <option value="">Select a topic</option>
          <option value="General Inquiry">General Inquiry</option>
          <option value="Wrong Question / Answer">Wrong Question / Answer</option>
          <option value="Content Request">Content Request</option>
          <option value="Technical Issue">Technical Issue</option>
          <option value="Account Help">Account Help</option>
          <option value="Feedback">Feedback</option>
          <option value="Other">Other</option>
        </select>
      </div>

      <div>
        <label htmlFor="message" className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
          Message
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={5}
          placeholder="Tell us how we can help you..."
          disabled={status === 'submitting'}
          className="w-full px-4 py-2.5 rounded-xl border border-stone-200 bg-white text-stone-900 text-sm placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition resize-none disabled:opacity-60"
        />
      </div>

      {status === 'error' && (
        <div className="flex items-start gap-3 bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-700">
          <svg className="w-4 h-4 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
          </svg>
          {errorMsg}
        </div>
      )}

      <button
        type="submit"
        disabled={status === 'submitting'}
        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-orange-600 hover:bg-orange-700 disabled:bg-orange-400 text-white text-sm font-semibold px-8 py-3 rounded-xl transition-colors"
      >
        {status === 'submitting' ? (
          <>
            <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
            </svg>
            Sending…
          </>
        ) : (
          <>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
            </svg>
            Send Message
          </>
        )}
      </button>

      <p className="text-xs text-stone-400">
        By submitting this form, you agree to our{' '}
        <Link href="/privacy-policy" className="underline decoration-dotted hover:text-stone-600 transition-colors">Privacy Policy</Link>.
      </p>
      </form>
    </div>
  );
}
