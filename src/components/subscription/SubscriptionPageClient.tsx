'use client';

import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/common/Navbar';
import { API_ENDPOINTS } from '@/lib/apiConfig';
import { departmentCache } from '@/lib/departmentCache';
import { getDepartmentIcon } from '@/lib/departmentIcons';
import { emitExternalApiError } from '@/lib/externalApiError';

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

  const [departments, setDepartments] = useState<DepartmentOption[]>([]);
  const [selectedDepartmentId, setSelectedDepartmentId] = useState<string>('');
  const [selectedPlanId, setSelectedPlanId] = useState<PlanId>('monthly');
  const [loading, setLoading] = useState(true);

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

  return (
    <div className="min-h-screen bg-[#FDF6E3]">
      <Navbar
        variant="departments"
        title="Subscription Plans"
        subtitle="Select a plan for one department"
        backHref="/departments"
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
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
              <span className="text-xs sm:text-sm text-stone-500">Single department plan</span>
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
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
                {plans.map((plan) => {
                  const isActive = selectedPlanId === plan.id;
                  const amount = plan.months * MONTHLY_PRICE;
                  const monthlyText = `${formatAmount(MONTHLY_PRICE)}/month`;

                  return (
                    <button
                      key={plan.id}
                      type="button"
                      onClick={() => setSelectedPlanId(plan.id)}
                      className={`relative rounded-xl sm:rounded-2xl border p-4 sm:p-5 text-left transition-all duration-200 ${
                        isActive
                          ? 'border-orange-300 bg-gradient-to-br from-orange-50 to-white shadow-[0_10px_24px_rgba(251,146,60,0.2)]'
                          : 'border-stone-200 bg-white hover:border-orange-200 hover:shadow-sm'
                      }`}
                    >
                      {plan.popular && (
                        <span className="absolute top-3 right-3 rounded-full bg-orange-600 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-white">
                          Popular
                        </span>
                      )}
                      <p className="text-sm text-stone-500 mb-1">{plan.title}</p>
                      <p className="text-2xl font-bold text-stone-900">{formatAmount(amount)}</p>
                      <p className="text-xs sm:text-sm text-stone-600 mt-2">{monthlyText}</p>
                    </button>
                  );
                })}
              </div>
            </div>
          </section>

          <aside className="bg-stone-900 text-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-xl h-fit">
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

            <button
              type="button"
              disabled={!selectedDepartment}
              className="mt-6 w-full rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 px-4 py-3 text-sm sm:text-base font-semibold text-white disabled:opacity-50 disabled:cursor-not-allowed hover:from-orange-600 hover:to-orange-700 transition-colors"
            >
              Proceed to Checkout
            </button>

            <p className="mt-3 text-xs text-stone-400 leading-relaxed">
              You can activate one department per subscription. Need a different department? You can purchase another plan later.
            </p>

            <Link
              href="/departments"
              className="mt-4 inline-flex items-center text-xs sm:text-sm text-orange-300 hover:text-orange-200"
            >
              Back to departments
            </Link>
          </aside>
        </div>
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
