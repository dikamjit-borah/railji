'use client';

import { useEffect } from 'react';
import { emitExternalApiError } from '@/lib/externalApiError';

interface ExternalApiErrorTriggerProps {
  shouldShow: boolean;
  message?: string;
}

export default function ExternalApiErrorTrigger({ shouldShow, message }: ExternalApiErrorTriggerProps) {
  useEffect(() => {
    if (shouldShow) {
      emitExternalApiError(message);
    }
  }, [shouldShow, message]);

  return null;
}
