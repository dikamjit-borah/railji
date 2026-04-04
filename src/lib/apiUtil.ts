import { getSupabaseAccessToken } from './supabase/client';

const TOAST_DURATION = 2000;

function showAccessDeniedToast(redirectUrl: string) {
  if (document.getElementById('railje-access-toast')) return;

  // ── Wrapper ────────────────────────────────────────────────────────────────
  const toast = document.createElement('div');
  toast.id = 'railje-access-toast';
  Object.assign(toast.style, {
    position: 'fixed',
    top: '20px',
    right: '20px',
    zIndex: '99999',
    width: '340px',
    background: 'linear-gradient(135deg, #f97316, #ea580c)',  // orange-500 → orange-600
    border: '1px solid rgba(255,255,255,0.15)',
    borderRadius: '16px',            // rounded-2xl
    overflow: 'hidden',
    boxShadow: '0 20px 48px rgba(234,88,12,0.35), 0 4px 12px rgba(0,0,0,0.2)',
    fontFamily: 'inherit',
    opacity: '0',
    transform: 'translateX(calc(100% + 24px))',
    transition: 'opacity 0.35s cubic-bezier(.4,0,.2,1), transform 0.35s cubic-bezier(.4,0,.2,1)',
  });

  // ── Body ───────────────────────────────────────────────────────────────────
  const body = document.createElement('div');
  Object.assign(body.style, {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '14px',
    padding: '16px 18px',
  });

  // Lock icon in a tinted circle
  const iconWrap = document.createElement('div');
  Object.assign(iconWrap.style, {
    flexShrink: '0',
    width: '38px',
    height: '38px',
    borderRadius: '10px',
    background: 'rgba(255,255,255,0.2)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: '1px',
  });
  iconWrap.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>`;

  // Text block
  const textWrap = document.createElement('div');
  Object.assign(textWrap.style, { flex: '1', minWidth: '0' });

  const title = document.createElement('div');
  title.textContent = 'Access Restricted';
  Object.assign(title.style, {
    fontWeight: '700',
    fontSize: '14px',
    color: '#ffffff',
    marginBottom: '3px',
    letterSpacing: '-0.01em',
  });

  const msg = document.createElement('div');
  msg.textContent = 'You don\u2019t have permission to access this section.';
  Object.assign(msg.style, {
    fontSize: '12.5px',
    color: 'rgba(255,255,255,0.8)',
    lineHeight: '1.5',
  });

  // Close button
  const closeBtn = document.createElement('button');
  closeBtn.setAttribute('aria-label', 'Dismiss');
  closeBtn.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.7)" stroke-width="2.5" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`;
  Object.assign(closeBtn.style, {
    flexShrink: '0',
    background: 'transparent',
    border: 'none',
    cursor: 'pointer',
    padding: '2px',
    marginTop: '-2px',
    opacity: '0.6',
  });

  // ── Assemble ──────────────────────────────────────────────────────────────
  textWrap.appendChild(title);
  textWrap.appendChild(msg);
  body.appendChild(iconWrap);
  body.appendChild(textWrap);
  body.appendChild(closeBtn);
  toast.appendChild(body);
  document.body.appendChild(toast);

  // Dismiss helper
  let dismissed = false;
  const dismiss = () => {
    if (dismissed) return;
    dismissed = true;
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(calc(100% + 24px))';
    setTimeout(() => {
      toast.remove();
      window.location.href = redirectUrl;
    }, 380);
  };

  closeBtn.addEventListener('click', dismiss);

  // Animate in
  requestAnimationFrame(() => requestAnimationFrame(() => {
    toast.style.opacity = '1';
    toast.style.transform = 'translateX(0)';
  }));

  setTimeout(dismiss, TOAST_DURATION);
}

export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

export async function apiFetch(url: string, options: RequestInit = {}): Promise<any> {
  const accessToken = await getSupabaseAccessToken();
  const headers = new Headers(options.headers || {});

  if (accessToken) {
    headers.set('Authorization', `Bearer ${accessToken}`);
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (response.status === 401 || response.status === 403 || response.status === 402) {
    if (typeof window !== 'undefined') {
      showAccessDeniedToast('/auth/signin');
    }
    throw new ApiError(response.status, 'Unauthorized');
  }

  if (!response.ok) {
    throw new ApiError(response.status, `API request failed: ${response.statusText}`);
  }

  return response.json();
}
