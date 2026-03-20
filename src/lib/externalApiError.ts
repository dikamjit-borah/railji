export const EXTERNAL_API_ERROR_EVENT = 'external-api-error';

export interface ExternalApiErrorDetail {
  message?: string;
}

export function emitExternalApiError(message?: string) {
  if (typeof window === 'undefined') return;
  const detail: ExternalApiErrorDetail = { message };
  window.dispatchEvent(new CustomEvent(EXTERNAL_API_ERROR_EVENT, { detail }));
}
