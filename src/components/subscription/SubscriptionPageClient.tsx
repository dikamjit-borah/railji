'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { QRCodeSVG } from 'qrcode.react';
import Navbar from '@/components/common/Navbar';
import { API_ENDPOINTS } from '@/lib/apiConfig';
import { departmentCache } from '@/lib/departmentCache';
import { getDepartmentIcon } from '@/lib/departmentIcons';
import { emitExternalApiError } from '@/lib/externalApiError';

// ── Payment configuration ──────────────────────────────────────────────────
// Update PAYMENT_UPI_ID with your actual UPI ID and WHATSAPP_NUMBER with your WhatsApp business number (country code + number, no +/spaces)
const PAYMENT_UPI_ID = 'yourname@upi';
const WHATSAPP_NUMBER = '919999999999'; // format: country code + number

type PlanId = 'monthly' | 'threeMonth' | 'sixMonth';

interface DepartmentOption {
  id: string;
  name: string;
  fullName: string;
}

const MONTHLY_PRICE = 299;

const plans: Array<{
  id: PlanId;
  title: string;
  months: number;
  popular?: boolean;
}> = [
  { id: 'monthly', title: 'Monthly', months: 1 },
  { id: 'threeMonth', title: '3 Months', months: 3, popular: true },
  { id: 'sixMonth', title: '6 Months', months: 6 },
];

function formatAmount(value: number): string {
  return value.toLocaleString('en-IN');
}

export default function SubscriptionPageClient() {
  const searchParams = useSearchParams();
  const preselectedDept = searchParams.get('dept')?.trim() ?? '';
  const backHref = searchParams.get('from') ?? '/departments';

  const [departments, setDepartments] = useState<DepartmentOption[]>([]);
  const [selectedDepartmentId, setSelectedDepartmentId] = useState<string>('');
  const [selectedPlanId, setSelectedPlanId] = useState<PlanId>('monthly');
  const [loading, setLoading] = useState(true);
  const [showCheckout, setShowCheckout] = useState(false);
  const checkoutRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const cached = departmentCache.get();
        if (cached?.departments?.length) {
          const mapped = mapDepartments(cached.departments);
          setDepartments(mapped);
          setSelectedDepartmentId(resolveDepartmentId(mapped, preselectedDept));
          setLoading(false);
          return;
        }

        const response = await fetch(API_ENDPOINTS.DEPARTMENTS);
        if (!response.ok) {
          throw new Error(`Failed to fetch departments: ${response.statusText}`);
        }

        const apiData = await response.json();
        const rawDepartments = apiData?.data ?? [];
        departmentCache.set({ departments: rawDepartments });

        const mapped = mapDepartments(rawDepartments);
        setDepartments(mapped);
        setSelectedDepartmentId(resolveDepartmentId(mapped, preselectedDept));
      } catch {
        emitExternalApiError();
        setDepartments([]);
      } finally {
        setLoading(false);
      }
    };

    fetchDepartments();
  }, [preselectedDept]);

  const selectedPlan = useMemo(() => {
    return plans.find((plan) => plan.id === selectedPlanId) ?? plans[0];
  }, [selectedPlanId]);

  const selectedDepartment = useMemo(() => {
    return departments.find((dept) => dept.id === selectedDepartmentId) ?? null;
  }, [departments, selectedDepartmentId]);

  const totalPrice = selectedPlan.months * MONTHLY_PRICE;

  // Build UPI deep-link for QR code
  const upiString = useMemo(() => {
    if (!selectedDepartment) return '';
    const note = encodeURIComponent(`Railjee ${selectedDepartment.name} ${selectedPlan.title}`);
    return `upi://pay?pa=${PAYMENT_UPI_ID}&pn=Railjee&am=${totalPrice}&cu=INR&tn=${note}`;
  }, [selectedDepartment, selectedPlan, totalPrice]);

  // WhatsApp pre-filled message
  const whatsappMessage = useMemo(() => {
    if (!selectedDepartment) return '';
    return encodeURIComponent(
      `Hi! I have completed the payment of ₹${formatAmount(totalPrice)} for Railjee ${selectedDepartment.name} — ${selectedPlan.title} plan. Please find my transaction screenshot attached.`
    );
  }, [selectedDepartment, selectedPlan, totalPrice]);

  const handleProceedToCheckout = () => {
    setShowCheckout(true);
    // Small delay so the section renders before scrolling
    setTimeout(() => {
      checkoutRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 80);
  };

  return (
    <div className="min-h-screen bg-[#FDF6E3]">
      <Navbar
        variant="departments"
        title="Subscription Plans"
        subtitle="Select a plan for one department"
        backHref={backHref}
      />

      {/* Sticky bottom bar — mobile only, shown when a dept is selected */}
      {selectedDepartment && (
        <div className="fixed bottom-0 left-0 right-0 z-40 lg:hidden bg-stone-900 border-t border-stone-700 px-4 py-3 flex items-center justify-between gap-3 shadow-[0_-4px_24px_rgba(0,0,0,0.25)]">
          <div className="min-w-0">
            <p className="text-[11px] text-stone-400 truncate">{selectedDepartment.name} · {selectedPlan.title}</p>
            <p className="text-lg font-bold text-white leading-tight">₹{formatAmount(totalPrice)}</p>
          </div>
          <button
            type="button"
            onClick={handleProceedToCheckout}
            className="flex-shrink-0 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 px-5 py-2.5 text-sm font-semibold text-white hover:from-orange-600 hover:to-orange-700 active:scale-95 transition-all"
          >
            Proceed
          </button>
        </div>
      )}

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8" style={{ paddingBottom: selectedDepartment ? '5rem' : undefined }}>
        <section className="mb-8 sm:mb-10 text-center">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-stone-900 mb-3">
            Unlock Premium Access
          </h1>
          <p className="text-sm sm:text-base text-stone-600 max-w-2xl mx-auto">
            Subscription is available per department. Choose your department first, then pick your preferred duration.
          </p>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          <section className="lg:col-span-2 bg-white rounded-2xl sm:rounded-3xl border border-stone-200 shadow-sm p-4 sm:p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg sm:text-xl font-semibold text-stone-900">1. Select Department</h2>
              <span className="hidden sm:inline text-xs sm:text-sm text-stone-500">Single department plan</span>
            </div>

            {loading ? (
              <div className="rounded-xl border border-stone-200 bg-stone-50 p-4 text-sm text-stone-600">
                Loading departments...
              </div>
            ) : departments.length === 0 ? (
              <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                Departments are temporarily unavailable. Please try again shortly.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                {departments.map((dept) => {
                  const isActive = selectedDepartmentId === dept.id;
                  const icon = getDepartmentIcon(dept.id);

                  return (
                    <button
                      key={dept.id}
                      type="button"
                      onClick={() => setSelectedDepartmentId(dept.id)}
                      className={`w-full rounded-xl border p-3 sm:p-4 text-left transition-all duration-200 ${
                        isActive
                          ? 'border-orange-300 bg-orange-50 shadow-[0_8px_20px_rgba(249,115,22,0.15)]'
                          : 'border-stone-200 bg-white hover:border-orange-200 hover:bg-orange-50/40'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isActive ? 'bg-white' : 'bg-stone-50'}`}>
                          <div className="text-[#CF5D49] scale-75">{icon}</div>
                        </div>
                        <div>
                          <p className="text-sm sm:text-base font-semibold text-stone-900">{dept.name}</p>
                          <p className="text-xs text-stone-500 line-clamp-1">{dept.fullName}</p>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}

            <div className="mt-6 sm:mt-7">
              <h2 className="text-lg sm:text-xl font-semibold text-stone-900 mb-4">2. Choose Plan</h2>
              <div className="grid grid-cols-3 gap-2 sm:gap-4">
                {plans.map((plan) => {
                  const isActive = selectedPlanId === plan.id;
                  const amount = plan.months * MONTHLY_PRICE;

                  return (
                    <button
                      key={plan.id}
                      type="button"
                      onClick={() => setSelectedPlanId(plan.id)}
                      className={`relative rounded-xl sm:rounded-2xl border p-3 sm:p-5 text-left transition-all duration-200 ${
                        isActive
                          ? 'border-orange-300 bg-gradient-to-br from-orange-50 to-white shadow-[0_10px_24px_rgba(251,146,60,0.2)]'
                          : 'border-stone-200 bg-white hover:border-orange-200 hover:shadow-sm'
                      }`}
                    >
                      {plan.popular && (
                        <span className="absolute -top-px right-2 sm:right-3 rounded-b-md bg-orange-600 px-2 sm:px-3 py-0.5 text-[8px] sm:text-[10px] font-bold uppercase tracking-wider text-white whitespace-nowrap">
                          Popular
                        </span>
                      )}
                      <p className={`text-xs sm:text-sm text-stone-500 mb-1 ${plan.popular ? 'mt-3 sm:mt-2' : ''}`}>{plan.title}</p>
                      <p className="text-lg sm:text-2xl font-bold text-stone-900">₹{formatAmount(amount)}</p>
                      <p className="text-[10px] sm:text-sm text-stone-500 mt-1.5">{formatAmount(MONTHLY_PRICE)}<span className="hidden sm:inline">/mo</span><span className="sm:hidden">/m</span></p>
                    </button>
                  );
                })}
              </div>
            </div>
          </section>

          <aside className="bg-stone-900 text-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-xl h-fit lg:sticky lg:top-6">
            <h3 className="text-lg sm:text-xl font-semibold mb-4">Order Summary</h3>

            <div className="space-y-3 text-sm sm:text-base">
              <div className="flex items-center justify-between gap-3">
                <span className="text-stone-300">Department</span>
                <span className="font-medium text-right">{selectedDepartment?.name ?? 'Select department'}</span>
              </div>
              <div className="flex items-center justify-between gap-3">
                <span className="text-stone-300">Plan</span>
                <span className="font-medium">{selectedPlan.title}</span>
              </div>
              <div className="flex items-center justify-between gap-3">
                <span className="text-stone-300">Rate</span>
                <span className="font-medium">{formatAmount(MONTHLY_PRICE)}/month</span>
              </div>
              <div className="border-t border-stone-700 pt-3 flex items-center justify-between gap-3">
                <span className="text-stone-300">Total</span>
                <span className="text-xl font-bold">{formatAmount(totalPrice)}</span>
              </div>
            </div>

            {/* Button hidden on mobile — sticky bottom bar handles it */}
            <button
              type="button"
              disabled={!selectedDepartment}
              onClick={handleProceedToCheckout}
              className="hidden lg:block mt-6 w-full rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 px-4 py-3 text-sm sm:text-base font-semibold text-white disabled:opacity-50 disabled:cursor-not-allowed hover:from-orange-600 hover:to-orange-700 transition-colors"
            >
              Proceed to Checkout
            </button>

            <p className="mt-3 text-xs text-stone-400 leading-relaxed">
              You can activate one department per subscription. Need a different department? You can purchase another plan later.
            </p>

            <Link
              href={backHref}
              className="mt-4 inline-flex items-center text-xs sm:text-sm text-orange-300 hover:text-orange-200"
            >
              Back to departments
            </Link>
          </aside>
        </div>

        {/* ── Checkout Section ─────────────────────────────────────── */}
        {showCheckout && selectedDepartment && (
          <section
            ref={checkoutRef}
            className="mt-8 sm:mt-10 bg-white rounded-2xl sm:rounded-3xl border border-stone-200 shadow-sm overflow-hidden"
          >
            {/* Header banner */}
            <div className="bg-gradient-to-r from-stone-900 to-stone-800 px-5 py-4 sm:px-8 sm:py-5 flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-white">
                  <path d="M4.5 3.75a3 3 0 00-3 3v.75h21v-.75a3 3 0 00-3-3h-15z" />
                  <path fillRule="evenodd" d="M22.5 9.75h-21v7.5a3 3 0 003 3h15a3 3 0 003-3v-7.5zm-18 3.75a.75.75 0 01.75-.75h6a.75.75 0 010 1.5h-6a.75.75 0 01-.75-.75zm.75 2.25a.75.75 0 000 1.5h3a.75.75 0 000-1.5h-3z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-semibold text-white">Complete Your Payment</h3>
                <p className="text-xs sm:text-sm text-stone-400">
                  {selectedDepartment.name} · {selectedPlan.title} · ₹{formatAmount(totalPrice)}
                </p>
              </div>
            </div>

            <div className="p-4 sm:p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">

                {/* Left — QR Code */}
                <div className="flex flex-col items-center gap-4">
                  <div className="rounded-2xl border-2 border-orange-200 bg-orange-50/40 p-4 sm:p-5 flex flex-col items-center gap-4 w-full">
                    <p className="text-xs font-semibold uppercase tracking-widest text-orange-600">Scan & Pay via UPI</p>
                    <div className="rounded-xl bg-white p-3 shadow-md border border-stone-100">
                      <QRCodeSVG
                        value={upiString}
                        size={180}
                        bgColor="#ffffff"
                        fgColor="#1c1917"
                        level="M"
                        marginSize={1}
                      />
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-stone-500 mb-0.5">UPI ID</p>
                      <p className="text-sm font-semibold text-stone-900 font-mono tracking-wide">{PAYMENT_UPI_ID}</p>
                    </div>
                    <div className="w-full rounded-xl bg-orange-600 px-4 py-2.5 text-center">
                      <p className="text-xs text-orange-200 mb-0.5">Amount to Pay</p>
                      <p className="text-2xl font-bold text-white">₹{formatAmount(totalPrice)}</p>
                    </div>
                  </div>

                  <p className="text-[11px] text-stone-400 text-center leading-relaxed max-w-xs">
                    Open any UPI app (GPay, PhonePe, Paytm, BHIM) and scan the QR code above.
                  </p>
                </div>

                {/* Right — Steps + WhatsApp */}
                <div className="flex flex-col gap-5">
                  <div>
                    <h4 className="text-sm font-semibold text-stone-900 mb-3">Steps to complete</h4>
                    <ol className="space-y-3">
                      {[
                        { step: '1', text: 'Scan the QR code with any UPI app.' },
                        { step: '2', text: `Pay exactly ₹${formatAmount(totalPrice)} — add your name in remarks.` },
                        { step: '3', text: 'Take a screenshot of the payment confirmation.' },
                        { step: '4', text: 'Send the screenshot on WhatsApp using the button below.' },
                      ].map(({ step, text }) => (
                        <li key={step} className="flex items-start gap-3">
                          <span className="flex-shrink-0 w-6 h-6 rounded-full bg-orange-100 text-orange-700 text-xs font-bold flex items-center justify-center mt-0.5">
                            {step}
                          </span>
                          <p className="text-sm text-stone-600 leading-relaxed">{text}</p>
                        </li>
                      ))}
                    </ol>
                  </div>

                  {/* WhatsApp button */}
                  <div className="rounded-2xl border border-stone-200 bg-stone-50 p-4 mt-auto">
                    <p className="text-xs text-stone-500 mb-3 leading-relaxed">
                      After paying, tap the button below to open WhatsApp and send your screenshot. Your subscription will be activated within 30 minutes.
                    </p>
                    <a
                      href={`https://wa.me/${WHATSAPP_NUMBER}?text=${whatsappMessage}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2.5 w-full rounded-xl bg-[#25D366] hover:bg-[#1ebe5d] active:bg-[#18a854] transition-colors px-4 py-3 text-sm font-semibold text-white"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                      </svg>
                      Send Screenshot on WhatsApp
                    </a>
                  </div>

                  {/* Notice */}
                  <div className="flex items-start gap-2.5 rounded-xl bg-amber-50 border border-amber-200 px-3.5 py-3">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-amber-600 shrink-0 mt-0.5">
                      <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm8.706-1.442c1.146-.573 2.437.463 2.126 1.706l-.709 2.836.042-.02a.75.75 0 01.67 1.34l-.04.022c-1.147.573-2.438-.463-2.127-1.706l.71-2.836-.042.02a.75.75 0 11-.671-1.34l.041-.022zM12 9a.75.75 0 100-1.5.75.75 0 000 1.5z" clipRule="evenodd" />
                    </svg>
                    <p className="text-[11px] text-amber-700 leading-relaxed">
                      Activation is manual and done within 30 minutes during 9 AM – 9 PM IST. Payments made outside these hours will be activated the next morning.
                    </p>
                  </div>
                </div>

              </div>
            </div>
          </section>
        )}

      </main>
    </div>
  );
}

function mapDepartments(raw: any[]): DepartmentOption[] {
  return raw.map((dept) => {
    const id = dept.slug || dept.id || dept.departmentId || '';
    const name = dept.name || dept.fullName || 'Department';

    return {
      id,
      name,
      fullName: dept.fullName || dept.name || name,
    };
  }).filter((dept) => Boolean(dept.id));
}

function resolveDepartmentId(departments: DepartmentOption[], fromQuery: string): string {
  if (!departments.length) return '';

  if (fromQuery) {
    const normalized = fromQuery.toLowerCase();
    const exact = departments.find((dept) => dept.id.toLowerCase() === normalized);
    if (exact) return exact.id;
  }

  return departments[0].id;
}
