'use client';

import { useEffect, useState, useMemo } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/common/Navbar';
import { API_ENDPOINTS } from '@/lib/apiConfig';
import { getDepartmentIcon } from '@/lib/departmentIcons';
import { emitExternalApiError } from '@/lib/externalApiError';
import { apiFetch } from '@/lib/apiUtil';
import { createClient } from '@/lib/supabase/client';

// ── Types ──────────────────────────────────────────────────────────────────
interface Plan {
  _id: string;
  planId: string;
  name: string;
  departmentId: string;
  price: number;
  currency: string;
  durationMonths: number;
  description: string;
  isActive: boolean;
  features: {
    accessType: string;
    includesPapers: boolean;
    includesExams: boolean;
    includesMaterials: boolean;
  };
}

interface Department {
  id: string;
  name: string;
}

interface ApiResponse {
  success: boolean;
  statusCode: number;
  data: Plan[];
}

interface OrderResponse {
  success: boolean;
  statusCode: number;
  message: string;
  error?: string;
  timestamp?: string;
  path?: string;
  data?: {
    orderId: string;
    amount: number;
    currency: string;
    status: string;
    createdAt: string;
    metadata: {
      departmentId: string;
      durationMonths: number;
      planId: string;
      price: number;
      userId: string;
    };
  };
}

// Razorpay types
declare global {
  interface Window {
    Razorpay: any;
  }
}

// ── Helper Functions ───────────────────────────────────────────────────────
function formatAmount(value: number): string {
  return value.toLocaleString('en-IN');
}

function extractDepartments(plans: Plan[]): Department[] {
  const deptMap = new Map<string, string>();
  
  plans.forEach((plan) => {
    if (!deptMap.has(plan.departmentId)) {
      // Extract department name from plan name (e.g., "Accounts - Yearly Access" -> "Accounts")
      const deptName = plan.name.split(' - ')[0];
      deptMap.set(plan.departmentId, deptName);
    }
  });

  return Array.from(deptMap.entries()).map(([id, name]) => ({ id, name }));
}

function filterPlansByDepartment(plans: Plan[], departmentId: string): Plan[] {
  return plans
    .filter((plan) => plan.departmentId === departmentId && plan.isActive)
    .sort((a, b) => a.durationMonths - b.durationMonths);
}

// ── Main Component ─────────────────────────────────────────────────────────
export default function SubscriptionPageClient() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const preselectedDept = searchParams.get('dept')?.trim() ?? '';
  const backHref = searchParams.get('from') ?? '/departments';

  const [allPlans, setAllPlans] = useState<Plan[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [selectedDepartmentId, setSelectedDepartmentId] = useState<string>('');
  const [selectedPlanId, setSelectedPlanId] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [subscribing, setSubscribing] = useState(false);
  const [subscribeError, setSubscribeError] = useState<string | null>(null);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const supabase = createClient();

  // Fetch plans from API
  useEffect(() => {
    const fetchPlans = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(API_ENDPOINTS.PAYMENT_PLANS);
        if (!response.ok) {
          throw new Error(`Failed to fetch plans: ${response.statusText}`);
        }

        const apiData: ApiResponse = await response.json();
        
        if (!apiData.success || !apiData.data || apiData.data.length === 0) {
          throw new Error('No plans available');
        }

        setAllPlans(apiData.data);

        // Extract unique departments
        const depts = extractDepartments(apiData.data);
        setDepartments(depts);

        // Set initial department selection
        if (preselectedDept) {
          const matchedDept = depts.find(
            (d) => d.id.toLowerCase() === preselectedDept.toLowerCase()
          );
          if (matchedDept) {
            setSelectedDepartmentId(matchedDept.id);
          } else if (depts.length > 0) {
            setSelectedDepartmentId(depts[0].id);
          }
        } else if (depts.length > 0) {
          setSelectedDepartmentId(depts[0].id);
        }
      } catch (err) {
        console.error('Error fetching plans:', err);
        setError('Unable to load subscription plans. Please try again later.');
        emitExternalApiError();
      } finally {
        setLoading(false);
      }
    };

    fetchPlans();
  }, [preselectedDept]);

  // Get filtered plans for selected department
  const availablePlans = useMemo(() => {
    if (!selectedDepartmentId) return [];
    return filterPlansByDepartment(allPlans, selectedDepartmentId);
  }, [allPlans, selectedDepartmentId]);

  // Auto-select first plan when department changes
  useEffect(() => {
    if (availablePlans.length > 0 && !selectedPlanId) {
      setSelectedPlanId(availablePlans[0].planId);
    } else if (availablePlans.length > 0) {
      // Check if current selected plan is valid for new department
      const planExists = availablePlans.some((p) => p.planId === selectedPlanId);
      if (!planExists) {
        setSelectedPlanId(availablePlans[0].planId);
      }
    }
  }, [availablePlans, selectedPlanId]);

  // Clear error when plan changes
  useEffect(() => {
    if (subscribeError) {
      setSubscribeError(null);
    }
  }, [selectedPlanId]);

  const selectedDepartment = useMemo(() => {
    return departments.find((d) => d.id === selectedDepartmentId) || null;
  }, [departments, selectedDepartmentId]);

  const selectedPlan = useMemo(() => {
    return availablePlans.find((p) => p.planId === selectedPlanId) || null;
  }, [availablePlans, selectedPlanId]);

  // ── Handle Subscribe Button Click ─────────────────────────────────────────
  const handleSubscribe = async () => {
    if (!selectedPlan) return;

    // Check if user is authenticated
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      // Redirect to signin with return URL
      const currentPath = window.location.pathname + window.location.search;
      router.push(`/auth/signin?redirect=${encodeURIComponent(currentPath)}`);
      return;
    }

    setSubscribing(true);
    setSubscribeError(null);

    try {
      // Step 1: Create order
      const response: OrderResponse = await apiFetch(API_ENDPOINTS.PAYMENT_ORDER, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          planId: selectedPlan.planId,
        }),
      });

      // Handle error responses (409, 400, 500, etc.)
      if (!response.success) {
        setSubscribeError(
          response.message || 'Something went wrong. Please try again.'
        );
        setSubscribing(false);
        return;
      }

      if (!response.data?.orderId) {
        throw new Error('Invalid response from server');
      }

      const { orderId: razorpayOrderId, amount, currency } = response.data;
      setOrderId(razorpayOrderId);
      console.log('Order ID:', razorpayOrderId);

      // Step 2: Initialize Razorpay
      if (!window.Razorpay) {
        throw new Error('Razorpay SDK not loaded');
      }

      const razorpayKey = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
      if (!razorpayKey) {
        throw new Error('Razorpay key not configured');
      }

      const options = {
        key: razorpayKey,
        amount: amount, // Amount already in paise from backend
        currency: currency,
        name: 'RailJEE',
        description: `${selectedDepartment?.name} - ${selectedPlan.durationMonths} Month${selectedPlan.durationMonths > 1 ? 's' : ''} Subscription`,
        order_id: razorpayOrderId,
        prefill: {
          name: user.user_metadata?.full_name || user.user_metadata?.name || '',
          email: user.email || '',
          contact: user.user_metadata?.phone || '',
        },
        theme: {
          color: '#F97316', // Orange theme
        },
        handler: async function (response: any) {
          try {
            console.log('Payment successful:', response);
            
            // Payment completed - webhook will handle subscription activation
            // Just verify the payment was successful
            setPaymentSuccess(true);
            setSubscribing(false);
            
            // Show success message and redirect
            // Note: Subscription will be activated by webhook asynchronously
            setTimeout(() => {
              router.push('/departments?payment=success');
            }, 3000);
          } catch (error) {
            console.error('Payment error:', error);
            setSubscribeError('Something went wrong. Please contact support if amount was deducted.');
            setSubscribing(false);
          }
        },
        modal: {
          ondismiss: function () {
            setSubscribing(false);
            console.log('Payment cancelled by user');
          },
          escape: true,
          backdropclose: false,
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.on('payment.failed', function (response: any) {
        console.error('Payment failed:', response.error);
        setSubscribeError('Payment failed. Please try again.');
        setSubscribing(false);
      });

      razorpay.open();
    } catch (err: any) {
      console.error('Subscribe error:', err);
      setSubscribeError(err.message || 'Something went wrong. Please try again.');
      setSubscribing(false);
    }
  };

  // ── Render Loading State ─────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-100 via-orange-50/20 to-slate-100">
        <Navbar
          variant="departments"
          title="Subscription Plans"
          subtitle="Loading plans..."
          backHref={backHref}
        />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-8 text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-orange-500 border-t-transparent"></div>
            <p className="mt-4 text-slate-600">Loading subscription plans...</p>
          </div>
        </main>
      </div>
    );
  }

  // ── Render Payment Success Modal ─────────────────────────────────────────
  if (paymentSuccess) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
        <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md mx-4 text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-100 flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-10 h-10 text-green-600"
            >
              <path
                fillRule="evenodd"
                d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">
            Payment Successful!
          </h2>
          <p className="text-slate-600 mb-2">
            Your payment for {selectedDepartment?.name} has been received.
          </p>
          <p className="text-sm text-slate-500 mb-4">
            Your subscription will be activated within a few moments.
          </p>
          <div className="inline-flex items-center gap-2 text-sm text-orange-600">
            <svg
              className="animate-spin h-4 w-4"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            Redirecting...
          </div>
        </div>
      </div>
    );
  }

  // ── Render Error State ───────────────────────────────────────────────────
  if (error || departments.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-100 via-orange-50/20 to-slate-100">
        <Navbar
          variant="departments"
          title="Subscription Plans"
          subtitle="Error loading plans"
          backHref={backHref}
        />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white rounded-3xl border border-red-200 shadow-sm p-8 text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-8 h-8 text-red-600"
              >
                <path
                  fillRule="evenodd"
                  d="M9.401 3.003c1.155-2 4.043-2 5.197 0l7.355 12.748c1.154 2-.29 4.5-2.599 4.5H4.645c-2.309 0-3.752-2.5-2.598-4.5L9.4 3.003zM12 8.25a.75.75 0 01.75.75v3.75a.75.75 0 01-1.5 0V9a.75.75 0 01.75-.75zm0 8.25a.75.75 0 100-1.5.75.75 0 000 1.5z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-slate-900 mb-2">
              Unable to Load Plans
            </h2>
            <p className="text-slate-600 mb-6">
              {error || 'Subscription plans are temporarily unavailable. Please try again later.'}
            </p>
            <Link
              href={backHref}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold hover:from-orange-600 hover:to-orange-700 transition-all"
            >
              Go Back
            </Link>
          </div>
        </main>
      </div>
    );
  }

  // ── Main Render ──────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-orange-50/20 to-slate-100">
      <Navbar
        variant="departments"
        title="Subscription Plans"
        subtitle="Choose your department and plan"
        backHref={backHref}
      />

      {/* Sticky bottom bar — mobile only */}
      {selectedDepartment && selectedPlan && (
        <div className="fixed bottom-0 left-0 right-0 z-40 lg:hidden bg-slate-900 border-t border-slate-700 px-4 py-3 flex items-center justify-between gap-3 shadow-[0_-4px_24px_rgba(0,0,0,0.25)]">
          <div className="min-w-0">
            <p className="text-[11px] text-slate-400 truncate">
              {selectedDepartment.name} · {selectedPlan.durationMonths}mo
            </p>
            <p className="text-lg font-bold text-white leading-tight">
              ₹{formatAmount(selectedPlan.price)}
            </p>
          </div>
          <button
            type="button"
            onClick={handleSubscribe}
            disabled={subscribing}
            className="flex-shrink-0 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 px-5 py-2.5 text-sm font-semibold text-white hover:from-orange-600 hover:to-orange-700 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {subscribing ? (
              <>
                <svg
                  className="animate-spin h-4 w-4"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Processing...
              </>
            ) : (
              'Subscribe Now'
            )}
          </button>
        </div>
      )}

      <main
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8"
        style={{ paddingBottom: selectedDepartment && selectedPlan ? '5rem' : undefined }}
      >
        {/* Header Section */}
        <section className="mb-8 sm:mb-10 text-center">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 mb-3">
            Unlock Premium Access
          </h1>
          <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto">
            Select your department and choose a subscription plan to access premium materials, papers, and exams.
          </p>

          {/* Error Message - Mobile */}
          {subscribeError && (
            <div className="mt-4 p-3 rounded-lg bg-red-50 border border-red-200 max-w-2xl mx-auto lg:hidden">
              <p className="text-xs sm:text-sm text-red-700">{subscribeError}</p>
            </div>
          )}
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {/* Left Column: Department & Plan Selection */}
          <section className="lg:col-span-2 space-y-6">
            {/* Step 1: Department Selection */}
            <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200 shadow-sm p-4 sm:p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg sm:text-xl font-semibold text-slate-900">
                  1. Select Department
                </h2>
                <span className="hidden sm:inline text-xs sm:text-sm text-slate-500">
                  {departments.length} departments available
                </span>
              </div>

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
                          : 'border-slate-200 bg-white hover:border-orange-200 hover:bg-orange-50/40'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                            isActive ? 'bg-white' : 'bg-slate-50'
                          }`}
                        >
                          <div className="text-orange-600 scale-75">{icon}</div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm sm:text-base font-semibold text-slate-900 truncate">
                            {dept.name}
                          </p>
                          <p className="text-xs text-slate-500">
                            {filterPlansByDepartment(allPlans, dept.id).length} plans
                          </p>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 2: Plan Selection */}
            <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200 shadow-sm p-4 sm:p-6">
              <h2 className="text-lg sm:text-xl font-semibold text-slate-900 mb-4">
                2. Choose Your Plan
              </h2>

              {availablePlans.length === 0 ? (
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-6 text-center">
                  <p className="text-sm text-slate-600">
                    No plans available for this department.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                  {availablePlans.map((plan, index) => {
                    const isActive = selectedPlanId === plan.planId;
                    const isPopular = index === 1 && availablePlans.length >= 3;

                    return (
                      <button
                        key={plan.planId}
                        type="button"
                        onClick={() => setSelectedPlanId(plan.planId)}
                        className={`relative rounded-xl sm:rounded-2xl border p-4 sm:p-5 text-left transition-all duration-200 ${
                          isActive
                            ? 'border-orange-300 bg-gradient-to-br from-orange-50 to-white shadow-[0_10px_24px_rgba(251,146,60,0.2)]'
                            : 'border-slate-200 bg-white hover:border-orange-200 hover:shadow-sm'
                        }`}
                      >
                        {isPopular && (
                          <span className="absolute -top-px right-2 sm:right-3 rounded-b-md bg-orange-600 px-2 sm:px-3 py-0.5 text-[8px] sm:text-[10px] font-bold uppercase tracking-wider text-white">
                            Popular
                          </span>
                        )}
                        <div className={isPopular ? 'mt-3 sm:mt-2' : ''}>
                          <p className="text-xs sm:text-sm text-slate-500 mb-1">
                            {plan.durationMonths} {plan.durationMonths === 1 ? 'Month' : 'Months'}
                          </p>
                          <p className="text-xl sm:text-2xl font-bold text-slate-900">
                            ₹{formatAmount(plan.price)}
                          </p>
                          <p className="text-[10px] sm:text-xs text-slate-500 mt-1.5">
                            ₹{formatAmount(Math.round(plan.price / plan.durationMonths))}/month
                          </p>
                        </div>

                        {/* Features */}
                        <div className="mt-3 pt-3 border-t border-slate-100 space-y-1.5">
                          {plan.features.includesPapers && (
                            <div className="flex items-center gap-1.5 text-[10px] sm:text-xs text-slate-600">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                                className="w-3.5 h-3.5 text-orange-500"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                                  clipRule="evenodd"
                                />
                              </svg>
                              <span>Bilingual Questions</span>
                            </div>
                          )}
                          {plan.features.includesExams && (
                            <div className="flex items-center gap-1.5 text-[10px] sm:text-xs text-slate-600">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                                className="w-3.5 h-3.5 text-orange-500"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                                  clipRule="evenodd"
                                />
                              </svg>
                              <span>Previous Papers</span>
                            </div>
                          )}
                          {plan.features.includesMaterials && (
                            <div className="flex items-center gap-1.5 text-[10px] sm:text-xs text-slate-600">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                                className="w-3.5 h-3.5 text-orange-500"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                                  clipRule="evenodd"
                                />
                              </svg>
                              <span>Practice Exams</span>
                            </div>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}

              {selectedPlan && (
                <div className="mt-4 p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {selectedPlan.description}
                  </p>
                </div>
              )}
            </div>
          </section>

          {/* Right Column: Order Summary */}
          <aside className="bg-slate-900 text-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-xl h-fit lg:sticky lg:top-6">
            <h3 className="text-lg sm:text-xl font-semibold mb-4">Order Summary</h3>

            {selectedDepartment && selectedPlan ? (
              <>
                <div className="space-y-3 text-sm sm:text-base">
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-slate-300">Department</span>
                    <span className="font-medium text-right">{selectedDepartment.name}</span>
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-slate-300">Duration</span>
                    <span className="font-medium">
                      {selectedPlan.durationMonths}{' '}
                      {selectedPlan.durationMonths === 1 ? 'Month' : 'Months'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-slate-300">Rate</span>
                    <span className="font-medium">
                      ₹{formatAmount(Math.round(selectedPlan.price / selectedPlan.durationMonths))}/month
                    </span>
                  </div>
                  <div className="border-t border-slate-700 pt-3 flex items-center justify-between gap-3">
                    <span className="text-slate-300">Total</span>
                    <span className="text-2xl font-bold">
                      ₹{formatAmount(selectedPlan.price)}
                    </span>
                  </div>
                </div>

                {/* Subscribe Button - Desktop */}
                <button
                  type="button"
                  onClick={handleSubscribe}
                  disabled={subscribing}
                  className="hidden lg:flex items-center justify-center gap-2 mt-6 w-full rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 px-4 py-3 text-sm sm:text-base font-semibold text-white hover:from-orange-600 hover:to-orange-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {subscribing ? (
                    <>
                      <svg
                        className="animate-spin h-5 w-5"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                      Processing...
                    </>
                  ) : (
                    'Subscribe Now'
                  )}
                </button>

                {/* Error Message */}
                {subscribeError && (
                  <div className="mt-3 p-3 rounded-lg bg-red-50 border border-red-200">
                    <p className="text-xs text-red-700">{subscribeError}</p>
                  </div>
                )}

                {/* Features List */}
                <div className="mt-6 pt-6 border-t border-slate-700 space-y-2.5">
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
                    What&apos;s Included
                  </p>
                  {selectedPlan.features.includesPapers && (
                    <div className="flex items-start gap-2.5">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="text-sm text-slate-300">Access to previous year papers</span>
                    </div>
                  )}
                  {selectedPlan.features.includesExams && (
                    <div className="flex items-start gap-2.5">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="text-sm text-slate-300">Unlimited practice exams</span>
                    </div>
                  )}
                  {selectedPlan.features.includesMaterials && (
                    <div className="flex items-start gap-2.5">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="text-sm text-slate-300">Bilingual Questions - Hindi & English</span>
                    </div>
                  )}
                  <div className="flex items-start gap-2.5">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="text-sm text-slate-300">Filter by Post - JE, Senior Clerk, Technician & more</span>
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center py-8">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-slate-800 flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-8 h-8 text-slate-600"
                  >
                    <path d="M2.25 2.25a.75.75 0 000 1.5h1.386c.17 0 .318.114.362.278l2.558 9.592a3.752 3.752 0 00-2.806 3.63c0 .414.336.75.75.75h15.75a.75.75 0 000-1.5H5.378A2.25 2.25 0 017.5 15h11.218a.75.75 0 00.674-.421 60.358 60.358 0 002.96-7.228.75.75 0 00-.525-.965A60.864 60.864 0 005.68 4.509l-.232-.867A1.875 1.875 0 003.636 2.25H2.25zM3.75 20.25a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0zM16.5 20.25a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0z" />
                  </svg>
                </div>
                <p className="text-sm text-slate-400">
                  Select a department and plan to see your order summary
                </p>
              </div>
            )}

            <p className="mt-6 text-xs text-slate-400 leading-relaxed">
              Subscription is per department. Need access to multiple departments? You can purchase
              additional plans anytime.
            </p>

            <Link
              href={backHref}
              className="mt-4 inline-flex items-center text-xs sm:text-sm text-orange-300 hover:text-orange-200 transition-colors"
            >
              ← Back to departments
            </Link>
          </aside>
        </div>

        {/* Help/Contact Section */}
        <section className="mt-12 sm:mt-16 border-t border-orange-200 bg-gradient-to-br from-orange-50/30 to-transparent rounded-2xl sm:rounded-3xl p-6 sm:p-8">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-xl sm:text-2xl font-semibold text-slate-900 mb-2">
              Have questions before subscribing?
            </h2>
            <p className="text-sm sm:text-base text-slate-600 mb-6">
              We&apos;re happy to help.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 max-w-2xl mx-auto">
              {/* Email Card */}
              <a
                href="mailto:railjee.official@gmail.com"
                className="flex items-center gap-3 px-4 sm:px-5 py-3.5 sm:py-4 rounded-full bg-white border border-slate-200 hover:border-orange-300 hover:bg-orange-50/50 transition-all duration-200 shadow-sm hover:shadow-md group"
              >
                <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0 group-hover:bg-orange-200 transition-colors">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-5 h-5 text-orange-600"
                  >
                    <path d="M1.5 8.67v8.58a3 3 0 003 3h15a3 3 0 003-3V8.67l-8.928 5.493a3 3 0 01-3.144 0L1.5 8.67z" />
                    <path d="M22.5 6.908V6.75a3 3 0 00-3-3h-15a3 3 0 00-3 3v.158l9.714 5.978a1.5 1.5 0 001.572 0L22.5 6.908z" />
                  </svg>
                </div>
                <div className="text-left flex-1 min-w-0">
                  <p className="text-xs sm:text-sm font-semibold text-slate-900">Email us</p>
                  <p className="text-xs text-slate-600 truncate">railjee.official@gmail.com</p>
                </div>
              </a>

              {/* WhatsApp Card */}
              <a
                href="https://wa.me/918402898092"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 px-4 sm:px-5 py-3.5 sm:py-4 rounded-full bg-white border border-slate-200 hover:border-green-300 hover:bg-green-50/50 transition-all duration-200 shadow-sm hover:shadow-md group"
              >
                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 group-hover:bg-green-200 transition-colors">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-5 h-5 text-[#25D366]"
                  >
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                  </svg>
                </div>
                <div className="text-left flex-1 min-w-0">
                  <p className="text-xs sm:text-sm font-semibold text-slate-900">WhatsApp</p>
                  <p className="text-xs text-slate-600">Chat with us</p>
                </div>
              </a>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
